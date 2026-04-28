import type { Portfolio } from "@/types/portfolio";
import { SectionHeader } from "./SectionHeader";

interface Props {
  portfolio: Portfolio;
}

export function About({ portfolio }: Props): React.ReactElement {
  return (
    <>
      <SectionHeader prefix="01" name="About" sub="who I am, what I work on" />
      <div className="about-grid reveal-children">
        <div className="about-lead">
          <p className="about-p1">
            Senior Software Engineer at <strong>Sun Life</strong> with 3+ years of progressive
            experience building full-stack applications and microservices for the financial
            services industry.
          </p>
          <p className="about-p2">
            I specialize in <strong>Java</strong>, <strong>Python</strong> and{" "}
            <strong>Node.js</strong> backends, <strong>React</strong> frontends, and{" "}
            <strong>Kafka</strong>-based real-time data pipelines, with deep DevOps fluency
            across <strong>Kubernetes</strong>, <strong>Docker</strong> and CI/CD tooling.
          </p>
          <p className="about-p3">
            Driven by curiosity about the intersection of{" "}
            <strong>AI and software engineering</strong>, and motivated by solving complex
            problems through clean, scalable solutions.
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
            <div className="about-stat-v">{portfolio.location}</div>
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
    </>
  );
}
