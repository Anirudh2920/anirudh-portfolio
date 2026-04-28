import { useEffect, useState } from "react";
import { useTypewriter, type TypewriterStep } from "@/hooks/useTypewriter";
import type { Portfolio } from "@/types/portfolio";

interface Props {
  portfolio: Portfolio;
  reduced: boolean;
}

export function Hero({ portfolio, reduced }: Props): React.ReactElement {
  const steps: TypewriterStep[] = [
    { text: "$ whoami", kind: "cmd", speed: 36, pauseAfter: 250 },
    { text: portfolio.name, kind: "out", speed: 22, pauseAfter: 350 },
    { text: "$ cat role.txt", kind: "cmd", speed: 36, pauseAfter: 250 },
    { text: portfolio.role, kind: "out", speed: 14, pauseAfter: 300 },
    { text: "$ uptime", kind: "cmd", speed: 36, pauseAfter: 200 },
    {
      text: "3+ yrs @ Sun Life · Brampton, ON · ET tz",
      kind: "out",
      speed: 14,
      pauseAfter: 200,
    },
    { text: "$ _", kind: "cmd", speed: 30 },
  ];
  const { lines, done } = useTypewriter(steps, reduced);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const i = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 180);
    }, 30000);
    return () => clearInterval(i);
  }, [reduced]);

  return (
    <>
      <div className="hero-window">
        <div className="window-chrome">
          <span className="dot dot-r" />
          <span className="dot dot-y" />
          <span className="dot dot-g" />
          <span className="window-title">— bash — 80×24 — anirudh@gotike.dev</span>
          <span className="window-meta">▢ ▢ ▢</span>
        </div>
        <div className="terminal-body">
          {lines.map((l, idx) => {
            const isLast = idx === lines.length - 1;
            const showCaret = isLast && !done;
            if (l.kind === "cmd") {
              const head = l.text.split(" ")[0] ?? "";
              const rest = l.text.includes(" ")
                ? " " + l.text.split(" ").slice(1).join(" ")
                : "";
              return (
                <div key={idx} className="term-line term-cmd">
                  <span className="term-prompt">{head}</span>
                  <span className="term-rest">{rest}</span>
                  {showCaret && <span className="caret-block" />}
                </div>
              );
            }
            return (
              <div key={idx} className="term-line term-out">
                {idx === 1 ? (
                  <span
                    className={"hero-name " + (glitch ? "glitch" : "")}
                    data-text={l.text}
                  >
                    {l.text}
                  </span>
                ) : (
                  <span>{l.text}</span>
                )}
                {showCaret && <span className="caret-block" />}
              </div>
            );
          })}
          {done && (
            <div className="term-line term-cmd">
              <span className="term-prompt">$</span> <span className="caret-block" />
            </div>
          )}
        </div>
      </div>

      <div className="hero-ctas">
        <a className="cmd-btn cmd-btn-primary" href="#projects">
          <span className="cmd-bracket">[</span>
          <span className="cmd-content">
            view <span className="cmd-flag">--projects</span>
          </span>
          <span className="cmd-bracket">]</span>
        </a>
        <a className="cmd-btn" href="/resume.pdf" download>
          <span className="cmd-bracket">[</span>
          <span className="cmd-content">
            download <span className="cmd-flag">resume.pdf</span>
          </span>
          <span className="cmd-bracket">]</span>
        </a>
        <a className="cmd-btn cmd-btn-ghost" href="#contact">
          <span className="cmd-bracket">[</span>
          <span className="cmd-content">
            contact <span className="cmd-flag">--method=email</span>
          </span>
          <span className="cmd-bracket">]</span>
        </a>
      </div>

      <div className="hero-meta">
        <span>// boot complete in 0.42s</span>
        <span>·</span>
        <span>last login: today, from 192.168.0.* on /dev/ttys003</span>
      </div>
    </>
  );
}
