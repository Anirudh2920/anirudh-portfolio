import type { CSSProperties } from "react";
import { LANG_COLORS } from "@/components/highlight/langMaps";
import type { Project } from "@/types/portfolio";
import { SectionHeader } from "./SectionHeader";

interface Props {
  items: Project[];
}

interface CardProps {
  project: Project;
}

function ProjectCard({ project }: CardProps): React.ReactElement {
  const color = LANG_COLORS[project.lang] ?? "#7ee787";
  const style = { "--lang-color": color } as CSSProperties;
  return (
    <article className="project-card" style={style}>
      <div className="project-card-head">
        <div className="project-card-lang">
          <span className="project-tab-dot" />
          <span>{project.lang}</span>
        </div>
        <span className="project-status">
          <span className={"status-led status-" + project.status} />
          {project.status}
        </span>
      </div>
      <div className="project-body-clean">
        <h3 className="project-name-clean">{project.filename}</h3>
        <p className="project-desc-clean">{project.description}</p>
        <div className="project-foot-clean">
          <div className="tech-chips">
            {project.tech.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export function Projects({ items }: Props): React.ReactElement {
  return (
    <>
      <SectionHeader
        prefix="03"
        name="Projects"
        sub="representative work · backend, data, infra, AI"
      />
      <div className="project-grid reveal-children">
        {items.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </>
  );
}
