import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Track which section IDs have entered the viewport. Sections register
 * themselves via the returned ref callback. Visible IDs are tracked in state
 * so React owns the class toggle (StrictMode-clean — no DOM mutation in effects).
 */
export function useSectionObserver(): {
  attach: (id: string) => (el: HTMLElement | null) => void;
  visible: Set<string>;
} {
  const [visible, setVisible] = useState<Set<string>>(() => new Set());
  const elementsRef = useRef<Map<string, HTMLElement>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const additions: string[] = [];
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-section");
            if (id) additions.push(id);
          }
        }
        if (additions.length > 0) {
          setVisible((prev) => {
            const next = new Set(prev);
            additions.forEach((id) => next.add(id));
            return next;
          });
        }
      },
      { threshold: 0.12 },
    );
    observerRef.current = observer;
    elementsRef.current.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, []);

  const attach = useCallback(
    (id: string) =>
      (el: HTMLElement | null): void => {
        const existing = elementsRef.current.get(id);
        if (existing && existing !== el) {
          observerRef.current?.unobserve(existing);
          elementsRef.current.delete(id);
        }
        if (el) {
          elementsRef.current.set(id, el);
          observerRef.current?.observe(el);
        }
      },
    [],
  );

  return { attach, visible };
}
