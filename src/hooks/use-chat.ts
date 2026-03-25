import { useState, useCallback, useRef, useEffect } from "react";
import { chat } from "@/lib/webllm-engine";
import type { Message } from "@/types/engine";
import type { MLCEngine } from "@mlc-ai/web-llm";

export function useChat(engine: MLCEngine | null, ready: boolean) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [generating, setGenerating] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (ready) inputRef.current?.focus();
  }, [ready]);

  const send = useCallback(async (text: string) => {
    if (!engine || !text.trim() || generating) return;

    const userMsg: Message = { role: "user", content: text.trim() };
    const history = [...messages, userMsg];

    setMessages(history);
    setInput("");
    setGenerating(true);

    try {
      const response = await chat(
        engine,
        history.map((m) => ({ role: m.role, content: m.content }))
      );
      console.log("[LLM response]", JSON.stringify(response, null, 2));

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.message || "", ui: response.ui },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${err instanceof Error ? err.message : "Something went wrong"}` },
      ]);
    } finally {
      setGenerating(false);
      inputRef.current?.focus();
    }
  }, [engine, messages, generating]);

  return { messages, input, setInput, generating, send, chatEndRef, inputRef };
}