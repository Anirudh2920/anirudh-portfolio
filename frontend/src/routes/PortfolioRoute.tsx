import { useEffect } from "react";
import { TabStrip, TABS_TO_SECTION as TAB_TO_SECTION_MAP } from "@/components/chrome/TabStrip";
import { FileRail } from "@/components/chrome/FileRail";
import { StatusBar } from "@/components/chrome/StatusBar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Stack } from "@/components/sections/Stack";
import { Certs } from "@/components/sections/Certs";
import { Contact } from "@/components/sections/Contact";
import { useTheme } from "@/hooks/useTheme";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useSectionObserver } from "@/hooks/useSectionObserver";
import { usePortfolio } from "@/hooks/usePortfolio";

const TAB_TO_ID: Record<string, string> = {
  "about.md": "about",
  "experience.json": "experience",
  "projects/": "projects",
  "stack.toml": "stack",
  "certs.lock": "certs",
  "contact.sh": "contact",
};

export default function PortfolioRoute(): React.ReactElement {
  const [theme, toggleTheme] = useTheme();
  const reduced = useReducedMotion();
  const { activeSection, activeTab, lineCount } = useScrollSpy();
  const { attach, visible } = useSectionObserver();
  const { data, isLoading, isError } = usePortfolio();

  // ensure we use the same map as the chrome
  void TAB_TO_SECTION_MAP;

  useEffect(() => {
    document.title = data ? `${data.name} — ${data.role}` : "anirudh_gotike";
  }, [data]);

  const onPickTab = (tabName: string): void => {
    const sectionId = TAB_TO_ID[tabName];
    if (!sectionId) return;
    const el = document.getElementById(sectionId);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 50;
      window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
    }
  };

  if (isError) {
    return (
      <div className="error-banner" style={{ padding: 40 }}>
        <p>Failed to load portfolio data. Is the backend running?</p>
      </div>
    );
  }

  return (
    <>
      <TabStrip
        active={activeTab}
        onPick={onPickTab}
        theme={theme}
        onThemeToggle={toggleTheme}
      />
      <div className="app">
        <FileRail active={activeSection} />
        <main className="main" id="main">
          {sectionWrapper("hero", "hero", visible.has("hero"), attach("hero"))(
            data && <Hero portfolio={data} reduced={reduced} />,
          )}
          {sectionWrapper("about", "about", visible.has("about"), attach("about"))(
            data && <About portfolio={data} />,
          )}
          {sectionWrapper(
            "experience",
            "experience",
            visible.has("experience"),
            attach("experience"),
          )(data && <Experience items={data.experience} />)}
          {sectionWrapper(
            "projects",
            "projects",
            visible.has("projects"),
            attach("projects"),
          )(data && <Projects items={data.projects} />)}
          {sectionWrapper("stack", "stack", visible.has("stack"), attach("stack"))(
            data && <Stack groups={data.stack} />,
          )}
          {sectionWrapper("certs", "certs", visible.has("certs"), attach("certs"))(
            data && <Certs items={data.certs} />,
          )}
          {sectionWrapper("contact", "contact", visible.has("contact"), attach("contact"))(
            data && <Contact portfolio={data} />,
          )}
          {isLoading && <div className="loading-skel" style={{ padding: 40 }}>loading…</div>}
        </main>
      </div>
      <StatusBar section={activeSection} lineCount={lineCount} branch="main" />
    </>
  );
}

function sectionWrapper(
  id: string,
  section: string,
  isVisible: boolean,
  ref: (el: HTMLElement | null) => void,
) {
  return (children: React.ReactNode): React.ReactElement => (
    <section
      id={id}
      data-section={section}
      ref={ref}
      className={`section ${id === "hero" ? "hero " : ""}${isVisible ? "visible" : ""}`}
    >
      {children}
    </section>
  );
}
