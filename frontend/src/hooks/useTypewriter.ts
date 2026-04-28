import { useEffect, useState } from "react";

export interface TypewriterStep {
  text: string;
  kind: "cmd" | "out";
  speed?: number;
  pauseAfter?: number;
}

export interface TypewriterLine extends TypewriterStep {}

interface UseTypewriterResult {
  lines: TypewriterLine[];
  done: boolean;
}

export function useTypewriter(steps: TypewriterStep[], reduced: boolean): UseTypewriterResult {
  const [rendered, setRendered] = useState<(TypewriterLine | null)[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (reduced) {
      setRendered(steps);
      setDone(true);
      return;
    }
    setRendered(steps.map(() => null));
    const acc = steps.map(() => "");
    let i = 0;

    const tick = async (): Promise<void> => {
      while (i < steps.length && !cancelled) {
        const step = steps[i]!;
        const baseSpeed = step.speed ?? 28;
        for (let c = 0; c < step.text.length; c++) {
          if (cancelled) return;
          acc[i] = step.text.slice(0, c + 1);
          setRendered((prev) => {
            const next = [...prev];
            next[i] = { ...step, text: acc[i]! };
            return next;
          });
          const jitter = step.kind === "cmd" ? Math.random() * 60 : Math.random() * 20;
          const pauseChar = step.text[c] === " " ? 10 : 0;
          await new Promise((r) => setTimeout(r, baseSpeed + jitter + pauseChar));
        }
        if (step.pauseAfter) await new Promise((r) => setTimeout(r, step.pauseAfter));
        i++;
      }
      if (!cancelled) setDone(true);
    };
    void tick();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { lines: rendered.filter((l): l is TypewriterLine => l !== null), done };
}
