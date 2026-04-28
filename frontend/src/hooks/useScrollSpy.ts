import { useEffect, useState } from "react";

const TABS_TO_SECTION: Record<string, string> = {
  about: "about.md",
  experience: "experience.json",
  projects: "projects/",
  stack: "stack.toml",
  certs: "certs.lock",
  contact: "contact.sh",
  hero: "about.md",
};

interface ScrollSpyState {
  activeSection: string;
  activeTab: string;
  lineCount: number;
}

export function useScrollSpy(): ScrollSpyState {
  const [state, setState] = useState<ScrollSpyState>({
    activeSection: "hero",
    activeTab: "about.md",
    lineCount: 1,
  });

  useEffect(() => {
    let raf = 0;
    const tick = (): void => {
      const sections = document.querySelectorAll<HTMLElement>(".section");
      const y = window.scrollY + window.innerHeight * 0.35;
      let current = "hero";
      sections.forEach((s) => {
        const rect = s.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        if (top <= y) current = s.dataset.section ?? s.id;
      });
      const total = document.body.scrollHeight - window.innerHeight;
      const pct = total > 0 ? window.scrollY / total : 0;
      const lines = Math.max(1, Math.round(1 + pct * 1247));
      setState({
        activeSection: current,
        activeTab: TABS_TO_SECTION[current] ?? "about.md",
        lineCount: lines,
      });
    };

    const onScroll = (): void => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    tick();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return state;
}

export { TABS_TO_SECTION };
