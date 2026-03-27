import { useCallback, useEffect, useState } from "react";
import { getEngine, type LoadProgress } from "@/lib/webllm-engine";
import type { MLCEngine } from "@mlc-ai/web-llm";
import { Phase } from "@/types/engine";

export const useModelEngine = () => {
  const [phase, setPhase] = useState<Phase>("loading");
  const [progress, setProgress] = useState<LoadProgress>({ text: "Initializing…", progress: 0 });
  const [engine, setEngine] = useState<MLCEngine | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setPhase("loading");
    setError(null);

    let cancelled = false;
    getEngine((p) => {
      if (!cancelled) setProgress(p);
    }).then((eng) => {
      if (!cancelled) {
        setEngine(eng);
        setPhase("ready");
      }
    }).catch((err) => {
      if (cancelled) return;
      const msg = err?.message || String(err);
      if (msg.includes("Quota") || msg.includes("quota")) {
        setError("Browser storage is full. Clear site data in DevTools (Application > Storage > Clear site data) and try again.");
      } else {
        setError(msg);
      }
      setPhase("error");
    });

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const cleanup = load();
    return cleanup;
  }, [load]);

  return { phase, progress, engine, error, retry: load };
}
