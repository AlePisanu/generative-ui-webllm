"use client";

import { useModelEngine } from "@/hooks/use-model-engine";
import { useChat } from "@/hooks/use-chat";
import { RenderUIBlocks } from "@/components/ui-blocks";
import { Loading } from "@/components/ui/loading";
import { labels } from "@/constants/labels";
import { QUICK_ACTIONS } from "@/constants/constants";

export default function Home() {
  const { phase, progress, engine } = useModelEngine();
  const { messages, input, setInput, generating, send, chatEndRef, inputRef } = useChat(engine, phase === "ready");

  if (phase === "loading") {
    return <Loading progress={progress} />;
  }

  return (
    <div className="flex flex-1 flex-col bg-white/5">

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-8 pt-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">{labels.home.title}</h2>
              <p className="mt-2 text-sm text-gray-400">
                {labels.home.description}
              </p>
            </div>
            <div className="grid w-full max-w-2xl grid-cols-2 gap-3">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  onClick={() => send(action.prompt)}
                  disabled={generating}
                  className="rounded-lg border border-gray-700 bg-gray-900/60 px-4 py-3 text-left text-sm text-gray-300 transition-colors hover:border-gray-500 hover:bg-gray-800 disabled:opacity-50"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-6">
            {messages.map((msg, i) => (
              <div key={i} className={msg.role === "user" ? "flex justify-end" : ""}>
                {msg.role === "user" ? (
                  <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-blue-600 px-4 py-2.5 text-sm text-white">
                    {msg.content}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {msg.content && <p className="text-sm text-gray-300">{msg.content}</p>}
                    {msg.ui && msg.ui.length > 0 && <RenderUIBlocks blocks={msg.ui} />}
                  </div>
                )}
              </div>
            ))}

            {generating && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-600 border-t-purple-500" />
                {labels.home.generating}
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      <div className="border-t border-gray-800 px-4 py-3">
        <form
          className="mx-auto flex max-w-3xl gap-2"
          onSubmit={(e) => { e.preventDefault(); send(input); }}
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe a UI to generate…"
            disabled={generating}
            className="flex-1 rounded-lg border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={generating || !input.trim()}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-40"
          >
            {labels.home.send}
          </button>
        </form>
      </div>
    </div>
  );
}