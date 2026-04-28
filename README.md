# anirudh-portfolio

Personal portfolio site for **Anirudh Reddy Gotike** — Senior Software Engineer at Sun Life. Three-tier app:

| Tier | Stack | Path |
|------|-------|------|
| Frontend | Vite + React 19 + TypeScript + TanStack Query + React Router 7 | `frontend/` |
| Backend  | FastAPI + SQLAlchemy 2.0 (async) + Pydantic v2 + Alembic | `backend/` |
| Database | PostgreSQL 16 (local via Docker, prod via Neon) | `docker-compose.yml` |

The site is dark-mode primary with a terminal/IDE-inspired design (typewriter hero, file-tree rail, status bar, scanline scroll-reveal). All content lives in the database — there's a minimal `/admin` UI for editing.

## First-time setup

```sh
make install                # uv sync + pnpm install
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Set ADMIN_BOOTSTRAP_PASSWORD in backend/.env, then:
make db                     # start local postgres
make migrate                # apply schema
make seed                   # load initial content from data
make bootstrap              # create the admin user
```

## Day-to-day

```sh
make dev                    # runs db + backend (8000) + frontend (5173)
```

Open <http://localhost:5173>. The admin UI lives at `/admin/login`.

## Project structure

```
.
├── frontend/            # Vite + React 19 SPA
│   └── src/
│       ├── api/         # fetch client + auth token store
│       ├── components/  # chrome (TabStrip/FileRail/StatusBar) + sections + highlight
│       ├── hooks/       # usePortfolio, useAuth, useTheme, useTypewriter, ...
│       ├── routes/      # PortfolioRoute + admin/* (lazy-loaded)
│       ├── types/       # TS types matching the API
│       └── styles.css   # full design system, ported from the prototype
│
├── backend/             # FastAPI app
│   ├── app/
│   │   ├── models/      # SQLAlchemy 2.0 declarative
│   │   ├── schemas/     # Pydantic v2
│   │   ├── routers/
│   │   │   ├── public.py    # GET /api/portfolio
│   │   │   ├── auth.py      # /api/auth/{login,refresh,logout,me}
│   │   │   └── admin/       # all CRUD + reorder, JWT-gated
│   │   ├── services/    # portfolio aggregator
│   │   └── tests/       # pytest-asyncio
│   ├── migrations/      # Alembic, async-aware
│   └── scripts/         # seed.py, bootstrap_admin.py
│
├── docker-compose.yml   # local Postgres 16
├── Makefile             # all dev shortcuts
└── .env.example
```

## API surface

**Public** (cached `Cache-Control: public, max-age=60, stale-while-revalidate=600`):

- `GET /api/healthz`
- `GET /api/portfolio` — aggregate, returns the entire site content in one round-trip

**Auth**:

- `POST /api/auth/login` → access token + httpOnly refresh cookie (rate limit 5/min/IP)
- `POST /api/auth/refresh` → rotate access token from cookie
- `POST /api/auth/logout`
- `GET /api/auth/me`

**Admin** (Bearer required):

- `GET / POST / PATCH / DELETE` for `/api/admin/{profile,about,experience,projects,certs,stack/groups,stack/items}`
- `POST /api/admin/{resource}/reorder` for drag-and-drop sort updates
- `PATCH /api/admin/profile/password` for rotating the admin password

OpenAPI spec lives at `/api/openapi.json`; Swagger UI at `/api/docs`.

## Database schema

Mostly normalized; JSONB for short ordered string lists (`experience.bullets`, `project.tech`).

```
profile          (singleton — id=1, CHECK constraint)
experience       (UUID, JSONB bullets, sort_order)
project          (UUID, JSONB tech, sort_order)
stack_group      (UUID, slug UNIQUE, label, sort_order)
stack_item       (UUID, FK→stack_group ON DELETE CASCADE, sort_order)
cert             (UUID, sort_order)
admin_user       (UUID, bcrypt password_hash)
```

## Deploy

| Tier | Suggested host |
|------|----------------|
| Frontend | Vercel — `pnpm build` → `dist/` |
| Backend  | Railway / Render / Fly.io — single FastAPI container |
| Database | Neon serverless Postgres — use the `-pooler` URL for the app, direct URL for migrations |

In prod, set `ENV=production` so the refresh cookie gets `Secure`. Set `CORS_ORIGINS` to your actual frontend origin (never `*` with credentials).

## Editing content

Two options:

1. **Admin UI** at `/admin` — log in, edit any section, save. Live preview for the about page.
2. **Re-seed** — edit `backend/scripts/seed.py` and rerun `make seed`. Idempotent: only inserts when each table is empty (profile is upserted).

Rotate the admin password via `PATCH /api/admin/profile/password` (or rebuild the user — drop the row and rerun `make bootstrap`).

## Notes

- Refresh tokens are httpOnly cookies; access tokens live in memory only (cleared on hard refresh, then silently re-issued from the cookie).
- Neon's pooler runs PgBouncer in transaction mode, so asyncpg's prepared-statement cache is disabled in `app/db.py`.
- React 19 StrictMode-clean: the IntersectionObserver attaches via ref callbacks and tracks visibility in state (no DOM mutation in effects).
- `prefers-reduced-motion` disables the typewriter, glitch, and scanline animations.
- `/admin` is `noindex` via `<meta>` and `robots.txt`.

## Contact

Email — anirudhreddy2920@gmail.com · LinkedIn — [linkedin.com/in/anirudhreddygotike](https://linkedin.com/in/anirudhreddygotike)
