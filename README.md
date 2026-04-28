# anirudh-portfolio

Personal portfolio website for **Anirudh Reddy Gotike** — Senior Software Engineer at Sun Life. Single-page, terminal/IDE-inspired aesthetic, dark-mode primary with a light-mode toggle.

**Live:** _coming soon_

## Stack

- Plain HTML / CSS / JSX (React 18 + Babel standalone, loaded from CDN — no build step)
- JetBrains Mono for everything mono, Inter for prose
- Vanilla CSS with custom properties for theming

## Layout

```
.
├── index.html      # entry point — bootstraps the React app
├── styles.css      # full design system + section styles
├── data.jsx        # portfolio content (bio, experience, projects, stack, certs)
├── chrome.jsx      # tab strip, file rail, status bar
└── sections.jsx    # hero, about, experience, projects, stack, certs, contact
```

## Sections

1. **Hero** — terminal boot sequence with typewriter (`whoami`, `cat role.txt`, `uptime`)
2. **About** — clean readable paragraphs + sidebar stats + tech pills
3. **Experience** — vertical timeline of roles at Sun Life
4. **Projects** — representative work cards (Kafka, REST gateway, React lib, CI/CD, etc.)
5. **Tech Stack** — grouped by Languages, Frontend, Streaming, DevOps, Cloud & AI
6. **Education & Certifications** — degrees + OCI GenAI Professional, CPR/AED, First Aid
7. **Contact** — interactive terminal that reveals email/phone + handles

## Run locally

The site is fully static. Any local web server works:

```sh
# python
python3 -m http.server 8000

# or node
npx serve .
```

Then open http://localhost:8000.

> Note: opening `index.html` directly via `file://` will fail because the JSX files are loaded as scripts — browsers block that on the file protocol. Use a local server.

## Deploy

Drop the repo on any static host: GitHub Pages, Netlify, Vercel, Cloudflare Pages. No build step required.

## Contact

- Email — anirudhreddy2920@gmail.com
- LinkedIn — [linkedin.com/in/anirudhreddygotike](https://linkedin.com/in/anirudhreddygotike)
