import type { StackItem } from "@/types/portfolio";
import { SectionHeader } from "./SectionHeader";

interface Props {
  groups: Record<string, StackItem[]>;
}

const LABELS: Record<string, string> = {
  languages: "Languages",
  frontend: "Frontend",
  streaming: "Streaming & Messaging",
  devops: "DevOps & CI/CD",
  cloud: "Cloud & AI",
};

export function Stack({ groups }: Props): React.ReactElement {
  return (
    <>
      <SectionHeader prefix="04" name="Tech Stack" sub="tools I work with day-to-day" />
      <div className="stack-grid reveal-children">
        {Object.entries(groups).map(([slug, items]) => (
          <div key={slug} className="stack-group">
            <h3 className="stack-group-title">
              <span className="stack-group-tick">›</span>
              {LABELS[slug] ?? slug}
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
    </>
  );
}
