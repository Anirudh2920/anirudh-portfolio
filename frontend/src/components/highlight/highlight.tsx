import type { ReactNode } from "react";

const KEYWORDS: Record<string, RegExp> = {
  rust: /\b(fn|let|pub|struct|impl|use|mod|self|async|await|return|match|if|else|for|in|new)\b/g,
  go: /\b(func|return|if|else|for|range|package|import|var|const|struct|type|interface|go)\b/g,
  typescript:
    /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|new|async|await|interface|type)\b/g,
  python:
    /\b(def|return|if|else|elif|for|while|class|import|from|as|in|not|and|or|with|lambda)\b/g,
  "c++": /\b(int|void|return|if|else|for|while|class|struct|namespace|template|typename|auto)\b/g,
  kotlin: /\b(fun|val|var|class|object|when|return|if|else|for|while|in|is|as|import)\b/g,
  java:
    /\b(public|private|protected|class|interface|void|return|if|else|for|while|new|import|package|static|final|extends|implements)\b/g,
  yaml: /\b(stages|build|deploy|verify|scan)\b/g,
};

export function highlight(code: string, lang: string): ReactNode[] {
  return code.split("\n").map((line, li) => {
    if (/^\s*(\/\/|#)/.test(line)) {
      return (
        <div key={li} className="hl-line">
          <span className="hl-comment">{line}</span>
        </div>
      );
    }
    const out: ReactNode[] = [];
    let rest = line;
    let idx = 0;
    while (rest.length > 0) {
      const sm = rest.match(/^("[^"]*"|'[^']*')/);
      if (sm) {
        out.push(
          <span key={idx++} className="hl-str">
            {sm[0]}
          </span>,
        );
        rest = rest.slice(sm[0].length);
        continue;
      }
      const nm = rest.match(/^(\d[\d_.]*[a-z]*)/i);
      if (nm) {
        out.push(
          <span key={idx++} className="hl-num">
            {nm[0]}
          </span>,
        );
        rest = rest.slice(nm[0].length);
        continue;
      }
      const re = KEYWORDS[lang];
      if (re) {
        re.lastIndex = 0;
        const km = re.exec(rest);
        if (km && km.index === 0) {
          out.push(
            <span key={idx++} className="hl-kw">
              {km[0]}
            </span>,
          );
          rest = rest.slice(km[0].length);
          continue;
        }
      }
      const wm = rest.match(/^[A-Za-z_][\w]*/);
      if (wm) {
        out.push(
          <span key={idx++} className="hl-id">
            {wm[0]}
          </span>,
        );
        rest = rest.slice(wm[0].length);
        continue;
      }
      out.push(
        <span key={idx++} className="hl-punct">
          {rest[0]}
        </span>,
      );
      rest = rest.slice(1);
    }
    return (
      <div key={li} className="hl-line">
        {out}
      </div>
    );
  });
}
