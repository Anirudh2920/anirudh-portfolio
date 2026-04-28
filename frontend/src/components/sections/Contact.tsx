import { useState } from "react";
import type { Portfolio } from "@/types/portfolio";
import { SectionHeader } from "./SectionHeader";

interface Props {
  portfolio: Portfolio;
}

export function Contact({ portfolio }: Props): React.ReactElement {
  const [revealed, setRevealed] = useState(false);
  const [outputLines, setOutputLines] = useState<string[]>([]);

  const reveal = (): void => {
    if (revealed) return;
    setRevealed(true);
    const seq = [
      "→ resolving handle...",
      "→ verifying smtp record... ok",
      `→ ${portfolio.email}`,
      `→ phone: ${portfolio.phone ?? "n/a"}`,
      "→ response time: typically < 24h",
    ];
    seq.forEach((line, i) => {
      setTimeout(() => {
        setOutputLines((prev) => [...prev, line]);
      }, 220 * (i + 1));
    });
  };

  return (
    <>
      <SectionHeader
        prefix="06"
        name="Contact"
        sub="run the command to reveal email + handles"
      />
      <div className="contact-window">
        <div className="window-chrome">
          <span className="dot dot-r" />
          <span className="dot dot-y" />
          <span className="dot dot-g" />
          <span className="window-title">contact.sh — bash</span>
        </div>
        <div className="contact-body">
          <div className="contact-line">
            <span className="term-prompt">$</span>
            <span className="contact-cmd"> ./contact.sh </span>
            <span className="cmd-flag">--method=email</span>
            {!revealed && (
              <button className="contact-run" onClick={reveal}>
                ↵ run
              </button>
            )}
          </div>
          {outputLines.map((l, i) => (
            <div key={i} className="contact-out">
              {l}
            </div>
          ))}
          {revealed && outputLines.length >= 5 && (
            <div className="contact-out contact-success">
              ✓ session ready · drop a line
            </div>
          )}
          <div className="contact-line contact-spacer">
            <span className="term-prompt">$</span>
            <span className="contact-cmd"> ./contact.sh </span>
            <span className="cmd-flag">--list-handles</span>
            <span className="caret-block" />
          </div>
          <div className="contact-handles">
            {portfolio.github && (
              <a className="handle" href={`https://github.com/${portfolio.github}`} target="_blank" rel="noreferrer">
                <span className="cmd-flag">--github</span>
                <span className="handle-val">{portfolio.github}</span>
              </a>
            )}
            {portfolio.linkedin && (
              <a className="handle" href={`https://linkedin.com/in/${portfolio.linkedin}`} target="_blank" rel="noreferrer">
                <span className="cmd-flag">--linkedin</span>
                <span className="handle-val">{portfolio.linkedin}</span>
              </a>
            )}
            <a className="handle" href={`mailto:${portfolio.email}`}>
              <span className="cmd-flag">--email</span>
              <span className="handle-val">{portfolio.email}</span>
            </a>
            {portfolio.phone && (
              <a className="handle" href={`tel:${portfolio.phone}`}>
                <span className="cmd-flag">--phone</span>
                <span className="handle-val">{portfolio.phone}</span>
              </a>
            )}
          </div>
          <div className="contact-line">
            <span className="term-prompt">$</span>
            <span className="caret-block" />
          </div>
        </div>
      </div>

      <footer className="page-foot">
        <div>// © 2026 anirudh.gotike · built with html, css and curiosity</div>
        <div>// no trackers · no cookies · view-source friendly</div>
      </footer>
    </>
  );
}
