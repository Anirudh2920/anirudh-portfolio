interface TabDef {
  name: string;
  icon: string;
  color: string;
}

export const TABS: TabDef[] = [
  { name: "about.md", icon: "M", color: "#79c0ff" },
  { name: "experience.json", icon: "{}", color: "#e3b341" },
  { name: "projects/", icon: "/", color: "#7ee787" },
  { name: "stack.toml", icon: "≡", color: "#d2a8ff" },
  { name: "certs.lock", icon: "✦", color: "#ff7b72" },
  { name: "contact.sh", icon: "$", color: "#79c0ff" },
];

export const TABS_TO_SECTION: Record<string, string> = {
  "about.md": "about",
  "experience.json": "experience",
  "projects/": "projects",
  "stack.toml": "stack",
  "certs.lock": "certs",
  "contact.sh": "contact",
};

interface Props {
  active: string;
  onPick: (tabName: string) => void;
  theme: "dark" | "light";
  onThemeToggle: () => void;
}

export function TabStrip({ active, onPick, theme, onThemeToggle }: Props): React.ReactElement {
  return (
    <div className="tab-strip">
      <div className="tab-strip-window">
        <span className="dot dot-r" />
        <span className="dot dot-y" />
        <span className="dot dot-g" />
      </div>
      <div className="tab-strip-tabs">
        {TABS.map((t) => (
          <button
            key={t.name}
            className={"tab " + (active === t.name ? "tab-active" : "")}
            onClick={() => onPick(t.name)}
          >
            <span className="tab-icon" style={{ color: t.color }}>
              {t.icon}
            </span>
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
          <span className="theme-toggle-label">
            :colorscheme {theme === "dark" ? "tokyonight" : "paper"}
          </span>
        </button>
        <button className="menu-btn" aria-label="menu">
          [ ☰ menu ]
        </button>
      </div>
    </div>
  );
}
