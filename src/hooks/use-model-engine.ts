import { useEffect, useState } from "react";
import { getEngine, type LoadProgress } from "@/lib/webllm-engine";
import type { MLCEngine } from "@mlc-ai/web-llm";
import { Phase } from "@/types/engine";

export const useModelEngine = () => {
  const [phase, setPhase] = useState<Phase>("loading");
  const [progress, setProgress] = useState<LoadProgress>({ text: "Initializing…", progress: 0 });
  const [engine, setEngine] = useState<MLCEngine | null>(null);

  useEffect(() => {
    let cancelled = false;
    getEngine((p) => {
      if (!cancelled) setProgress(p);
    }).then((eng) => {
      if (!cancelled) {
        setEngine(eng);
        setPhase("ready");
      }
    });
    return () => { cancelled = true; };
  }, []);

  return { phase, progress, engine };
}