// Chrome — tab strip, file rail, status bar
const { useState, useEffect, useRef, useMemo, useCallback } = React;

const TABS = [
  { name: "about.md", icon: "M", color: "#79c0ff" },
  { name: "experience.json", icon: "{}", color: "#e3b341" },
  { name: "projects/", icon: "/", color: "#7ee787" },
  { name: "stack.toml", icon: "≡", color: "#d2a8ff" },
  { name: "certs.lock", icon: "✦", color: "#ff7b72" },
  { name: "contact.sh", icon: "$", color: "#79c0ff" }
];

const TABS_TO_SECTION = {
  "about.md": "about",
  "experience.json": "experience",
  "projects/": "projects",
  "stack.toml": "stack",
  "certs.lock": "certs",
  "contact.sh": "contact"
};

function TabStrip({ active, onPick, theme, onThemeToggle, onMenuToggle }) {
  return (
    <div className="tab-strip">
      <div className="tab-strip-window">
        <span className="dot dot-r" />
        <span className="dot dot-y" />
        <span className="dot dot-g" />
      </div>
      <div className="tab-strip-tabs">
        {TABS.map(t => (
          <button
            key={t.name}
            className={"tab " + (active === t.name ? "tab-active" : "")}
            onClick={() => onPick(t.name)}
          >
            <span className="tab-icon" style={{ color: t.color }}>{t.icon}</span>
            <span className="tab-name">{t.name}</span>
            <span className="tab-x">×</span>
          </button>
        ))}
      </div>
      <div className="tab-strip-right">
        <button className="theme-toggle" onClick={onThemeToggle} title="toggle theme">
          <span className="theme-toggle-track">
            <span className="theme-toggle-thumb" data-theme={theme}>
              {theme === "dark" ? "◐" : "◑"}
            </span>
          </span>
          <span className="theme-toggle-label">:colorscheme {theme === "dark" ? "tokyonight" : "paper"}</span>
        </button>
        <button className="menu-btn" onClick={onMenuToggle} aria-label="menu">[ ☰ menu ]</button>
      </div>
    </div>
  );
}

function FileRail({ active }) {
  const tree = [
    { type: "folder", name: "src", open: true, children: [
      { type: "file", name: "about.md", section: "about" },
      { type: "file", name: "experience.json", section: "experience" },
      { type: "folder", name: "projects", open: true, children: [
        { type: "file", name: "fixparse-rs", section: "projects" },
        { type: "file", name: "rts22-reporter", section: "projects" },
        { type: "file", name: "ledger-cli", section: "projects" },
        { type: "file", name: "+ 3 more", section: "projects", muted: true }
      ]},
      { type: "file", name: "stack.toml", section: "stack" },
      { type: "file", name: "certs.lock", section: "certs" },
      { type: "file", name: "contact.sh", section: "contact" }
    ]},
    { type: "folder", name: ".git", open: false, children: [] },
    { type: "file", name: "README.md", section: "about" },
    { type: "file", name: ".env.local", muted: true }
  ];

  const renderNode = (node, depth) => {
    if (node.type === "folder") {
      return (
        <div key={node.name + depth}>
          <div className="rail-row" style={{ paddingLeft: depth * 12 + 10 }}>
            <span className="rail-chev">{node.open ? "▾" : "▸"}</span>
            <span className="rail-folder">{node.name}/</span>
          </div>
          {node.open && node.children.map(c => renderNode(c, depth + 1))}
        </div>
      );
    }
    const isActive = node.section && node.section === active;
    return (
      <div
        key={node.name + depth}
        className={"rail-row rail-file" + (isActive ? " rail-active" : "") + (node.muted ? " rail-muted" : "")}
        style={{ paddingLeft: depth * 12 + 10 }}
      >
        <span className="rail-dot">·</span>
        <span>{node.name}</span>
      </div>
    );
  };

  return (
    <aside className="file-rail" aria-hidden="true">
      <div className="rail-header">EXPLORER</div>
      <div className="rail-tree">{tree.map(n => renderNode(n, 0))}</div>
      <div className="rail-foot">
        <div className="rail-row rail-muted"><span className="rail-dot">⌥</span><span>OUTLINE</span></div>
        <div className="rail-row rail-muted"><span className="rail-dot">⌥</span><span>TIMELINE</span></div>
      </div>
    </aside>
  );
}

function StatusBar({ section, lineCount, branch }) {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const i = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(i);
  }, []);
  const t = time.toLocaleTimeString("en-US", { hour12: false });

  return (
    <div className="status-bar">
      <div className="status-left">
        <span className="status-chip status-branch">
          <span className="status-glyph">⎇</span> {branch}
        </span>
        <span className="status-chip status-ok">● 0 errors</span>
        <span className="status-chip status-warn">⚠ 0 warnings</span>
      </div>
      <div className="status-center">
        <span className="status-section">// {section}</span>
      </div>
      <div className="status-right">
        <span className="status-chip">Ln {lineCount}, Col 1</span>
        <span className="status-chip">UTF-8</span>
        <span className="status-chip">LF</span>
        <span className="status-chip">{t} ET</span>
        <span className="status-chip status-lua">
          <span className="status-glyph">◗</span> lua: ok
        </span>
      </div>
    </div>
  );
}

window.TabStrip = TabStrip;
window.FileRail = FileRail;
window.StatusBar = StatusBar;
window.TABS = TABS;
window.TABS_TO_SECTION = TABS_TO_SECTION;
