"use client";

import { useMemo } from "react";
import { useModelEngine } from "@/hooks/use-model-engine";
import { useChat } from "@/hooks/use-chat";
import { RenderUIBlocks } from "@/components/ui-blocks";
import { Loading } from "@/components/ui/loading";
import { labels } from "@/constants/labels";
import { QUICK_ACTIONS } from "@/constants/constants";

export default function Home() {
  const { phase, progress, engine, error, retry } = useModelEngine();
  const chat = useChat(engine, phase === "ready");

  if (phase === "loading") return <Loading progress={progress} />;

  if (phase === "error") {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 px-4">
        <div className="dot bg-red-400" />
        <p className="text-sm font-medium">{error}</p>
        <button onClick={retry} className="btn-accent">Try again</button>
      </div>
    );
  }

  return <AppLayout {...chat} />;
}

type ChatState = ReturnType<typeof useChat>;

function AppLayout({ messages, input, setInput, generating, send, chatEndRef, inputRef }: ChatState) {
  const latestUI = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg.role === "assistant" && msg.ui?.length) return msg;
    }
    return null;
  }, [messages]);

  return (
    <div className="flex h-screen overflow-hidden">

      <aside className="flex w-80 shrink-0 flex-col border-r border-border bg-bg-sidebar">

        <div className="flex items-center gap-2.5 border-b border-border px-4 py-3.5">
          <div className="dot bg-accent" />
          <span className="text-xs font-semibold uppercase tracking-widest text-text-3">
            Generative UI
          </span>
        </div>

        <div className="border-b border-border p-3">
          <p className="px-4 pt-3 pb-1.5 text-[11px] font-medium tracking-wider text-text-3">
            {labels.home.quickActions}
          </p>
          {QUICK_ACTIONS.map((a) => (
            <button
              key={a.label}
              onClick={() => send(a.prompt)}
              disabled={generating}
              className="flex w-full items-center justify-between border border-border px-4 py-2.5
                         text-left hover:bg-surface disabled:opacity-30"
            >
              <span className="text-xs text-text-1">{a.label}</span>
              <span className="text-[11px] text-text-3">{a.description}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 space-y-2.5 overflow-y-auto p-3">
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-sm text-text-2">{labels.home.title}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-text-3">{labels.home.description}</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i}>
              {msg.role === "user" ? (
                <div className="flex justify-end">
                  <p className="max-w-[85%] rounded-xl rounded-br-sm border border-accent/20
                                bg-accent/10 px-3 py-2 text-xs text-text-1">
                    {msg.content}
                  </p>
                </div>
              ) : (
                <div>
                  {msg.content && <p className="text-xs leading-relaxed text-text-2">{msg.content}</p>}
                  {msg.ui?.length ? (
                    <span className="mt-1 flex items-center gap-1.5 text-[11px] text-accent">
                      <span className="dot !h-1.5 !w-1.5 bg-accent" />
                      {msg.ui.length} block{msg.ui.length > 1 ? "s" : ""} generated
                    </span>
                  ) : null}
                </div>
              )}
            </div>
          ))}

          {generating && (
            <p className="flex items-center gap-2 py-1 text-xs text-text-3">
              <span className="dot !h-1.5 !w-1.5 animate-pulse bg-accent" />
              {labels.home.generating}
            </p>
          )}

          <div ref={chatEndRef} />
        </div>

        <form
          className="flex gap-1.5 border-t border-border p-3"
          onSubmit={(e) => { e.preventDefault(); send(input); }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe a UI..."
            disabled={generating}
            className="field-input flex-1 !py-2 !text-xs disabled:opacity-30"
          />
          <button
            type="submit"
            disabled={generating || !input.trim()}
            className="btn-accent"
          >
            {labels.home.send}
          </button>
        </form>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        {latestUI ? (
          <div className="mx-auto max-w-4xl">
            {latestUI.content && (
              <p className="mb-5 text-sm text-text-2">{latestUI.content}</p>
            )}
            <RenderUIBlocks blocks={latestUI.ui!} />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-xs text-text-3">Your generated UI will appear here</p>
          </div>
        )}
      </main>
    </div>
  );
}
