import { useEffect, useState } from "react";

interface Props {
  section: string;
  lineCount: number;
  branch: string;
}

export function StatusBar({ section, lineCount, branch }: Props): React.ReactElement {
  const [time, setTime] = useState<Date>(() => new Date());
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
        <span className="status-chip">
          Ln {lineCount}, Col 1
        </span>
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
