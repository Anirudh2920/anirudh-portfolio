// Sections — hero, about, experience, projects, stack, certs, contact
const { useState: useS, useEffect: useE, useRef: useR, useMemo: useM, useCallback: useCb } = React;

// ---------- typewriter hook ----------
function useTypewriter(steps, reduced) {
  // steps: [{text, speed?, pauseAfter?, kind?}]  kind: 'cmd' | 'out'
  const [rendered, setRendered] = useS([]);
  const [done, setDone] = useS(false);

  useE(() => {
    let cancelled = false;
    if (reduced) {
      setRendered(steps.map(s => ({ ...s, text: s.text })));
      setDone(true);
      return;
    }
    setRendered(steps.map(() => null));
    let i = 0;
    let acc = steps.map(() => "");

    const tick = async () => {
      while (i < steps.length && !cancelled) {
        const step = steps[i];
        const baseSpeed = step.speed ?? 28;
        for (let c = 0; c < step.text.length; c++) {
          if (cancelled) return;
          acc[i] = step.text.slice(0, c + 1);
          // copy and update
          setRendered(prev => {
            const next = [...prev];
            next[i] = { ...step, text: acc[i] };
            return next;
          });
          // varied jitter
          const jitter = step.kind === "cmd" ? Math.random() * 60 : Math.random() * 20;
          const pauseChar = step.text[c] === " " ? 10 : 0;
          await new Promise(r => setTimeout(r, baseSpeed + jitter + pauseChar));
        }
        if (step.pauseAfter) await new Promise(r => setTimeout(r, step.pauseAfter));
        i++;
      }
      if (!cancelled) setDone(true);
    };
    tick();
    return () => { cancelled = true; };
  }, []);

  return { lines: rendered.filter(Boolean), done };
}

// ---------- Hero ----------
function Hero({ reduced }) {
  const P = window.PORTFOLIO;
  const steps = [
    { text: "$ whoami", kind: "cmd", speed: 36, pauseAfter: 250 },
    { text: P.name, kind: "out", speed: 22, pauseAfter: 350 },
    { text: "$ cat role.txt", kind: "cmd", speed: 36, pauseAfter: 250 },
    { text: P.role, kind: "out", speed: 14, pauseAfter: 300 },
    { text: "$ uptime", kind: "cmd", speed: 36, pauseAfter: 200 },
    { text: "3+ yrs @ Sun Life · Brampton, ON · ET tz", kind: "out", speed: 14, pauseAfter: 200 },
    { text: "$ _", kind: "cmd", speed: 30 }
  ];
  const { lines, done } = useTypewriter(steps, reduced);
  const [glitch, setGlitch] = useS(false);

  useE(() => {
    if (reduced) return;
    const i = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 180);
    }, 30000);
    return () => clearInterval(i);
  }, [reduced]);

  return (
    <section id="hero" className="section hero" data-section="hero">
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
              return (
                <div key={idx} className="term-line term-cmd">
                  <span className="term-prompt">{l.text.split(" ")[0]}</span>
                  <span className="term-rest">{l.text.includes(" ") ? " " + l.text.split(" ").slice(1).join(" ") : ""}</span>
                  {showCaret && <span className="caret-block" />}
                </div>
              );
            }
            return (
              <div key={idx} className="term-line term-out">
                {idx === 1 ? (
                  <span className={"hero-name " + (glitch ? "glitch" : "")} data-text={l.text}>
                    {l.text}
                  </span>
                ) : (
                  <span>{l.text}</span>
                )}
                {showCaret && <span className="caret-block" />}
              </div>
            );
          })}
          {done && <div className="term-line term-cmd"><span className="term-prompt">$</span> <span className="caret-block" /></div>}
        </div>
      </div>

      <div className="hero-ctas">
        <a className="cmd-btn cmd-btn-primary" href="#projects">
          <span className="cmd-bracket">[</span>
          <span className="cmd-content">view <span className="cmd-flag">--projects</span></span>
          <span className="cmd-bracket">]</span>
        </a>
        <a className="cmd-btn" href="#" onClick={e => e.preventDefault()}>
          <span className="cmd-bracket">[</span>
          <span className="cmd-content">download <span className="cmd-flag">resume.pdf</span></span>
          <span className="cmd-bracket">]</span>
        </a>
        <a className="cmd-btn cmd-btn-ghost" href="#contact">
          <span className="cmd-bracket">[</span>
          <span className="cmd-content">contact <span className="cmd-flag">--method=email</span></span>
          <span className="cmd-bracket">]</span>
        </a>
      </div>

      <div className="hero-meta">
        <span>// boot complete in 0.42s</span>
        <span>·</span>
        <span>last login: today, from 192.168.0.* on /dev/ttys003</span>
      </div>
    </section>
  );
}

// ---------- About ----------
function About() {
  const P = window.PORTFOLIO;
  return (
    <section id="about" className="section section-about" data-section="about">
      <SectionHeader prefix="01" name="About" sub="who I am, what I work on" />
      <div className="about-grid reveal-children">
        <div className="about-lead">
          <p className="about-p1">
            Senior Software Engineer at <strong>Sun Life</strong> with 3+ years of progressive
            experience building full-stack applications and microservices for the financial
            services industry.
          </p>
          <p className="about-p2">
            I specialize in <strong>Java</strong>, <strong>Python</strong> and <strong>Node.js</strong> backends, <strong>React</strong> frontends, and <strong>Kafka</strong>-based real-time data pipelines, with deep DevOps fluency across <strong>Kubernetes</strong>, <strong>Docker</strong> and CI/CD tooling.
          </p>
          <p className="about-p3">
            Driven by curiosity about the intersection of <strong>AI and software engineering</strong>, and motivated by solving complex problems through clean, scalable solutions.
          </p>
        </div>
        <aside className="about-side">
          <div className="about-stat">
            <div className="about-stat-k">role</div>
            <div className="about-stat-v">Senior Software Engineer</div>
          </div>
          <div className="about-stat">
            <div className="about-stat-k">company</div>
            <div className="about-stat-v">Sun Life</div>
          </div>
          <div className="about-stat">
            <div className="about-stat-k">location</div>
            <div className="about-stat-v">{P.location}</div>
          </div>
          <div className="about-stat">
            <div className="about-stat-k">experience</div>
            <div className="about-stat-v">3+ years</div>
          </div>
          <div className="about-stat">
            <div className="about-stat-k">education</div>
            <div className="about-stat-v">M.S. CS · U Windsor</div>
          </div>
          <div className="about-stat">
            <div className="about-stat-k">currently</div>
            <div className="about-stat-v">OCI GenAI Pro</div>
          </div>
        </aside>
      </div>
      <div className="about-pills reveal-children">
        <span className="pill pill-bright">Java</span>
        <span className="pill pill-bright">Python</span>
        <span className="pill pill-bright">Node.js</span>
        <span className="pill">React</span>
        <span className="pill">Kafka</span>
        <span className="pill">Kubernetes</span>
        <span className="pill">Docker</span>
        <span className="pill">CI/CD</span>
        <span className="pill">Generative AI</span>
        <span className="pill">OCI</span>
      </div>
    </section>
  );
}

function renderInline(s) {
  // ** bold ** and ` code ` with visible markers
  const parts = [];
  let rest = s;
  let i = 0;
  while (rest.length) {
    const bm = rest.match(/^\*\*([^*]+)\*\*/);
    const cm = rest.match(/^`([^`]+)`/);
    if (bm) {
      parts.push(<span key={i++}><span className="md-mark">**</span><strong>{bm[1]}</strong><span className="md-mark">**</span></span>);
      rest = rest.slice(bm[0].length);
    } else if (cm) {
      parts.push(<span key={i++}><span className="md-mark">`</span><code>{cm[1]}</code><span className="md-mark">`</span></span>);
      rest = rest.slice(cm[0].length);
    } else {
      const next = rest.search(/(\*\*|`)/);
      const chunk = next === -1 ? rest : rest.slice(0, next);
      parts.push(<span key={i++}>{chunk}</span>);
      rest = next === -1 ? "" : rest.slice(next);
    }
  }
  return parts;
}

// ---------- Experience — clean timeline cards ----------
function Experience() {
  const items = window.PORTFOLIO.experience;
  return (
    <section id="experience" className="section" data-section="experience">
      <SectionHeader prefix="02" name="Experience" sub="3+ years at Sun Life · Waterloo, ON" />
      <ol className="xp-list reveal-children">
        {items.map((it, i) => (
          <li key={i} className="xp-item">
            <div className="xp-rail">
              <div className="xp-node" />
              {i < items.length - 1 && <div className="xp-line" />}
            </div>
            <div className="xp-card">
              <div className="xp-head">
                <div className="xp-titles">
                  <h3 className="xp-role">{it.role}</h3>
                  <div className="xp-co">
                    <span className="xp-co-name">{it.company}</span>
                    <span className="xp-sep">·</span>
                    <span className="xp-loc">Waterloo, ON</span>
                  </div>
                </div>
                <div className="xp-date">{it.date}</div>
              </div>
              <p className="xp-summary">{it.message}</p>
              <ul className="xp-bullets">
                {it.diff.map((d, j) => (
                  <li key={j} className="xp-bullet">
                    <span className="xp-bullet-dot">›</span>
                    <span>{d.startsWith("+ ") || d.startsWith("- ") ? d.slice(2) : d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

// ---------- Projects ----------
const LANG_COLORS = {
  rust: "#ff7b72", go: "#79c0ff", typescript: "#79c0ff",
  python: "#e3b341", "c++": "#d2a8ff", kotlin: "#d2a8ff", javascript: "#e3b341",
  java: "#ffa657", yaml: "#7ee787"
};

const LANG_EXT = {
  rust: "rs", go: "go", typescript: "ts", python: "py",
  "c++": "cpp", kotlin: "kt", javascript: "js", java: "java", yaml: "yml"
};

function highlight(code, lang) {
  // very small token highlighter — splits common keywords / strings / comments
  const lines = code.split("\n");
  const kw = {
    rust: /\b(fn|let|pub|struct|impl|use|mod|self|async|await|return|match|if|else|for|in|new)\b/g,
    go: /\b(func|return|if|else|for|range|package|import|var|const|struct|type|interface|go)\b/g,
    typescript: /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|new|async|await|interface|type)\b/g,
    python: /\b(def|return|if|else|elif|for|while|class|import|from|as|in|not|and|or|with|lambda)\b/g,
    "c++": /\b(int|void|return|if|else|for|while|class|struct|namespace|template|typename|auto)\b/g,
    kotlin: /\b(fun|val|var|class|object|when|return|if|else|for|while|in|is|as|import)\b/g,
    java: /\b(public|private|protected|class|interface|void|return|if|else|for|while|new|import|package|static|final|extends|implements)\b/g,
    yaml: /\b(stages|build|deploy|verify|scan)\b/g
  };

  return lines.map((line, li) => {
    // comment
    const isComment = /^\s*(\/\/|#)/.test(line);
    if (isComment) return <div key={li} className="hl-line"><span className="hl-comment">{line}</span></div>;

    // tokenize
    const out = [];
    let rest = line;
    let idx = 0;
    while (rest.length) {
      // string
      const sm = rest.match(/^("[^"]*"|'[^']*')/);
      if (sm) { out.push(<span key={idx++} className="hl-str">{sm[0]}</span>); rest = rest.slice(sm[0].length); continue; }
      // number
      const nm = rest.match(/^(\d[\d_.]*[a-z]*)/i);
      if (nm) { out.push(<span key={idx++} className="hl-num">{nm[0]}</span>); rest = rest.slice(nm[0].length); continue; }
      // keyword
      const re = kw[lang];
      if (re) {
        re.lastIndex = 0;
        const km = re.exec(rest);
        if (km && km.index === 0) {
          out.push(<span key={idx++} className="hl-kw">{km[0]}</span>);
          rest = rest.slice(km[0].length);
          continue;
        }
      }
      // word
      const wm = rest.match(/^[A-Za-z_][\w]*/);
      if (wm) { out.push(<span key={idx++} className="hl-id">{wm[0]}</span>); rest = rest.slice(wm[0].length); continue; }
      // punct
      out.push(<span key={idx++} className="hl-punct">{rest[0]}</span>);
      rest = rest.slice(1);
    }
    return <div key={li} className="hl-line">{out}</div>;
  });
}

function ProjectCard({ p, idx }) {
  const color = LANG_COLORS[p.lang] || "#7ee787";
  return (
    <article className="project-card" style={{ "--lang-color": color }}>
      <div className="project-card-head">
        <div className="project-card-lang">
          <span className="project-tab-dot" />
          <span>{p.lang}</span>
        </div>
        <span className="project-status">
          <span className={"status-led status-" + p.status} />
          {p.status}
        </span>
      </div>
      <div className="project-body-clean">
        <h3 className="project-name-clean">{p.filename}</h3>
        <p className="project-desc-clean">{p.description}</p>
        <div className="project-foot-clean">
          <div className="tech-chips">
            {p.tech.map(t => <span key={t} className="chip">{t}</span>)}
          </div>
        </div>
      </div>
    </article>
  );
}

function Projects() {
  return (
    <section id="projects" className="section" data-section="projects">
      <SectionHeader prefix="03" name="Projects" sub="representative work · backend, data, infra, AI" />
      <div className="project-grid reveal-children">
        {window.PORTFOLIO.projects.map((p, i) => <ProjectCard key={i} p={p} idx={i} />)}
      </div>
    </section>
  );
}

// ---------- Stack ----------
function Stack() {
  const groups = window.PORTFOLIO.stack;
  const labels = {
    languages: "Languages",
    frontend: "Frontend",
    streaming: "Streaming & Messaging",
    devops: "DevOps & CI/CD",
    cloud: "Cloud & AI"
  };
  return (
    <section id="stack" className="section" data-section="stack">
      <SectionHeader prefix="04" name="Tech Stack" sub="tools I work with day-to-day" />
      <div className="stack-grid reveal-children">
        {Object.entries(groups).map(([gname, items]) => (
          <div key={gname} className="stack-group">
            <h3 className="stack-group-title">
              <span className="stack-group-tick">›</span>
              {labels[gname] || gname}
            </h3>
            <ul className="stack-items">
              {items.map((it) => (
                <li key={it.name} className="stack-item">
                  <span className="stack-item-name">{it.name}</span>
                  {it.note && <span className="stack-item-note">{it.note}</span>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------- Certs ----------
function Certs() {
  return (
    <section id="certs" className="section" data-section="certs">
      <SectionHeader prefix="05" name="Education & Certifications" sub="degrees, training, current credentials" />
      <div className="certs-row reveal-children">
        {window.PORTFOLIO.certs.map((c, i) => (
          <div key={i} className="cert-card">
            <div className="cert-badge">
              <span className="cert-glyph">{c.glyph}</span>
            </div>
            <div className="cert-name">{c.name}</div>
            <div className="cert-issuer">{c.issuer}</div>
            <div className="cert-expiry">{c.expiry}</div>
            <div className="cert-status"><span className="cert-led" /> active</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------- Contact ----------
function Contact() {
  const [revealed, setRevealed] = useS(false);
  const [outputLines, setOutputLines] = useS([]);

  const reveal = () => {
    if (revealed) return;
    setRevealed(true);
    const seq = [
      "→ resolving handle...",
      "→ verifying smtp record... ok",
      "→ " + window.PORTFOLIO.email,
      "→ phone: " + window.PORTFOLIO.phone,
      "→ response time: typically < 24h"
    ];
    seq.forEach((line, i) => {
      setTimeout(() => setOutputLines(prev => [...prev, line]), 220 * (i + 1));
    });
  };

  return (
    <section id="contact" className="section" data-section="contact">
      <SectionHeader prefix="06" name="Contact" sub="run the command to reveal email + handles" />
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
            <div key={i} className="contact-out">{l}</div>
          ))}
          {revealed && outputLines.length >= 5 && (
            <div className="contact-out contact-success">✓ session ready · drop a line</div>
          )}
          <div className="contact-line contact-spacer">
            <span className="term-prompt">$</span>
            <span className="contact-cmd"> ./contact.sh </span>
            <span className="cmd-flag">--list-handles</span>
            <span className="caret-block" />
          </div>
          <div className="contact-handles">
            <a className="handle" href="#" onClick={e => e.preventDefault()}>
              <span className="cmd-flag">--github</span>
              <span className="handle-val">{window.PORTFOLIO.github}</span>
            </a>
            <a className="handle" href="#" onClick={e => e.preventDefault()}>
              <span className="cmd-flag">--linkedin</span>
              <span className="handle-val">{window.PORTFOLIO.linkedin}</span>
            </a>
            <a className="handle" href={"mailto:" + window.PORTFOLIO.email}>
              <span className="cmd-flag">--email</span>
              <span className="handle-val">{window.PORTFOLIO.email}</span>
            </a>
            <a className="handle" href={"tel:" + window.PORTFOLIO.phone}>
              <span className="cmd-flag">--phone</span>
              <span className="handle-val">{window.PORTFOLIO.phone}</span>
            </a>
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
    </section>
  );
}

// ---------- Section header ----------
function SectionHeader({ prefix, name, sub }) {
  return (
    <header className="sec-h">
      <div className="sec-h-line">
        <span className="sec-h-prefix">{prefix}</span>
        <h2 className="sec-h-name">{name}</h2>
      </div>
      {sub && <div className="sec-h-sub">› {sub}</div>}
    </header>
  );
}

window.Hero = Hero;
window.About = About;
window.Experience = Experience;
window.Projects = Projects;
window.Stack = Stack;
window.Certs = Certs;
window.Contact = Contact;
