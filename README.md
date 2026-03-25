# Generative UI - WebLLM

A local LLM generates UI components directly in the browser. You describe what you want, it builds it. No backend, no API keys, nothing leaves your machine.

## What this is

The app downloads Phi-3.5 Mini (~2 GB, quantized 4-bit) through [WebLLM](https://github.com/mlc-ai/web-llm) the first time you open it. After that it's cached and loads fast. Once the model is ready you can chat with it or pick a quick action, it responds with JSON that gets parsed and rendered as actual UI components.

Everything runs client-side: the prompt goes in, the model thinks, JSON comes out, components appear. No externals API to any server, but they could be implemented as fallback, for example when the user has a very poor PC and isn't able to run webllm.

## Live demo

Here is a live demo hosted in vercel: https://generative-ui-webllm.vercel.app/

## Components

The model can use these to compose interfaces:

| | |
|---|---|
| **card** | Title, content, color accent |
| **alert** | Info / success / warning / error banner |
| **list** | Ordered or unordered |
| **stat** | Value + trend indicator |
| **form** | Text, email, number, select fields |
| **chart** | Bar chart |
| **text** | Paragraph, heading, or quote |

It can mix and match them in a single response.

## Why local matters

No data goes anywhere. Your prompts stay in the browser. Works offline after the first download. No dependency on someone else's API staying online or keeping the same pricing.

Privacy here isn't a checkbox, it's just how it works when there's no server.

## Where it breaks

This is an experiment. It has real limits.

**First load takes a while.** 2 GB download, then model initialization. On weaker hardware it's rough.

**The model produces broken JSON sometimes.** Unquoted keys, wrong nesting, placeholder data, creative interpretations of the schema. There's a repair layer that catches a lot of this, but not everything. When it can't be fixed, you just see the raw text.

**Output quality is inconsistent.** Same prompt, different results. Small model tradeoff, lighter to run, less reliable output.

**WebGPU only.** Chrome 113+, Edge 113+. Without WebGPU you can get nothing.

**The hard part isn't building the components — it's handling the space between what you asked for and what the model actually gives you.** Traditional UI has clear boundaries. Generative UI doesn't. That's what this project is trying to figure out.

## Stack

Next.js 16, React 19, WebLLM + Phi-3.5 Mini, Tailwind, TypeScript

## Project structure

```
src/
  app/              # Page and layout
  components/
    blocks/         # Individual UI blocks
    ui/             # Shared components (loading screen)
    ui-blocks.tsx   # Block renderer
  hooks/            # useModelEngine, useChat
  lib/              # WebLLM engine, JSON parsing & repair
  constants/        # Model config, prompt, labels
  types/            # TypeScript interfaces
```

## Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Model download starts automatically.
