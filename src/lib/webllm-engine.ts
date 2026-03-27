"use client";

import { LLM_PROMPT, MODEL_ID, VALID_TYPES } from "@/constants/constants";
import { LLMResponse, UIBlock } from "@/types/engine";
import * as webllm from "@mlc-ai/web-llm";

let engineInstance: webllm.MLCEngine | null = null;

export type LoadProgress = {
  text: string;
  progress: number;
};


export const getEngine = async (
  onProgress?: (p: LoadProgress) => void
): Promise<webllm.MLCEngine> => {
  if (engineInstance) return engineInstance;

  const engine = new webllm.MLCEngine();

  engine.setInitProgressCallback((report) => {
    onProgress?.({
      text: report.text,
      progress: report.progress,
    });
  });

  await engine.reload(MODEL_ID);

  engineInstance = engine;
  return engine;
}

const getBlockType = (obj: Record<string, unknown>): string | null => {
  for (const key of ["type", "component", "kind"]) {
    const val = obj[key];
    if (typeof val === "string" && VALID_TYPES.has(val)) return val;
  }
  return null;
}

const normalizeBlock = (block: Record<string, unknown>): UIBlock | null => {
  const type = getBlockType(block);
  if (!type) return null;

  if (block.props && typeof block.props === "object") {
    return { type: type as UIBlock["type"], props: block.props as Record<string, unknown> };
  }

  const props: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(block)) {
    if (k !== "type" && k !== "component" && k !== "kind") {
      props[k] = v;
    }
  }
  return { type: type as UIBlock["type"], props };
}

const collectBlocks = (value: unknown, messages: string[], blocks: UIBlock[]): void => {
  if (!value || typeof value !== "object") return;

  if (Array.isArray(value)) {
    for (const item of value) collectBlocks(item, messages, blocks);
    return;
  }

  const obj = value as Record<string, unknown>;

  const block = normalizeBlock(obj);
  if (block) {
    blocks.push(block);
  }

  if (typeof obj.message === "string" && obj.message) {
    messages.push(obj.message);
  }

  for (const val of Object.values(obj)) {
    if (Array.isArray(val)) {
      collectBlocks(val, messages, blocks);
    } else if (val && typeof val === "object") {
      const childBlock = normalizeBlock(val as Record<string, unknown>);
      if (!childBlock) {
        collectBlocks(val, messages, blocks);
      }
    }
  }
}

const normalize = (parsed: unknown): LLMResponse => {
  const messages: string[] = [];
  const blocks: UIBlock[] = [];
  collectBlocks(parsed, messages, blocks);
  return { message: messages.join("\n"), ui: blocks };
}

const repairJSON = (s: string): string => {
  let r = s;
  r = r.replace(/:\s*(\$[\d,.]+[KMBkmb]?)\b/g, ':"$1"');
  r = r.replace(/:\s*(\+[\d,.]+%)/g, ':"$1"');
  r = r.replace(/:\s*(-[\d,.]+%)/g, ':"$1"');
  r = r.replace(/:\s*([a-zA-Z_][\w]*)\s*([,}\]])/g, ':"$1"$2');
  r = r.replace(/\{\s*\d+\s*,/g, '{');
  r = r.replace(/,\s*\d+\s*,/g, ',');
  r = r.replace(/"([a-zA-Z_]\w*)\s+[a-zA-Z_]\w*"\s*:/g, '"$1":');
  r = r.replace(/([{,\[])\s*([a-zA-Z_]\w*)\s*:/g, '$1"$2":');
  r = r.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, '"$1"');
  r = r.replace(/,\s*([}\]])/g, '$1');
  r = r.replace(/\}\s*\{/g, '},{');
  return r;
};

const tryParse = (s: string): unknown | null => {
  try { return JSON.parse(s); } catch {}
  const repaired = repairJSON(s);
  try { return JSON.parse(repaired); } catch {}
  return null;
};

// Find the closing bracket that matches the opener at `start`.
const findMatchingClose = (s: string, start: number): number => {
  const open = s[start];
  const close = open === "{" ? "}" : "]";
  let depth = 0;
  let inString = false;
  for (let i = start; i < s.length; i++) {
    const ch = s[i];
    if (ch === '"' && s[i - 1] !== "\\") { inString = !inString; continue; }
    if (inString) continue;
    if (ch === open) depth++;
    else if (ch === close) { depth--; if (depth === 0) return i; }
  }
  return -1;
};

const extractJSON = (raw: string): LLMResponse => {
  // strip markdown fences
  let cleaned = raw;
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) cleaned = fenceMatch[1].trim();

  // strip trailing text after JSON (model sometimes adds commentary)
  const firstBrace = cleaned.indexOf("{");
  if (firstBrace !== -1) {
    const end = findMatchingClose(cleaned, firstBrace);
    if (end !== -1) {
      const slice = cleaned.slice(firstBrace, end + 1);
      const parsed = tryParse(slice);
      if (parsed) return normalize(parsed);
    }
  }

  // try the whole string
  const direct = tryParse(cleaned);
  if (direct) return normalize(direct);

  // try array
  const arrStart = cleaned.indexOf("[");
  if (arrStart !== -1) {
    const arrEnd = findMatchingClose(cleaned, arrStart);
    if (arrEnd !== -1) {
      const parsed = tryParse(cleaned.slice(arrStart, arrEnd + 1));
      if (parsed) return normalize(parsed);
    }
  }

  return { message: raw };
}

export const chat = async (
  engine: webllm.MLCEngine,
  messages: { role: "user" | "assistant"; content: string }[]
): Promise<LLMResponse> => {
  const fullMessages: webllm.ChatCompletionMessageParam[] = [
    { role: "system", content: LLM_PROMPT },
    ...messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  ];

  const reply = await engine.chat.completions.create({
    messages: fullMessages,
    temperature: 0.3,
    max_tokens: 1024,
  });

  const raw = reply.choices[0]?.message?.content || "{}";
  console.log("[LLM raw]", raw);

  const result = extractJSON(raw);
  console.log("[LLM parsed]", result);
  return result;
}

export const chatStream = async (
  engine: webllm.MLCEngine,
  messages: { role: "user" | "assistant"; content: string }[],
  onChunk: (text: string) => void
): Promise<LLMResponse> => {
  const fullMessages: webllm.ChatCompletionMessageParam[] = [
    { role: "system", content: LLM_PROMPT },
    ...messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  ];

  const stream = await engine.chat.completions.create({
    messages: fullMessages,
    temperature: 0.3,
    max_tokens: 1024,
    stream: true,
  });

  let full = "";
  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content || "";
    full += delta;
    onChunk(full);
  }

  return extractJSON(full);
}
