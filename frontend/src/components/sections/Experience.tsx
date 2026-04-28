import type { Experience as ExperienceItem } from "@/types/portfolio";
import { SectionHeader } from "./SectionHeader";

interface Props {
  items: ExperienceItem[];
}

export function Experience({ items }: Props): React.ReactElement {
  return (
    <>
      <SectionHeader
        prefix="02"
        name="Experience"
        sub="3+ years at Sun Life · Waterloo, ON"
      />
      <ol className="xp-list reveal-children">
        {items.map((it, i) => (
          <li key={it.id} className="xp-item">
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
                    <span>
                      {d.startsWith("+ ") || d.startsWith("- ") ? d.slice(2) : d}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
