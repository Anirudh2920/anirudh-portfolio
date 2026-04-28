.PHONY: help install dev backend frontend db migrate seed bootstrap typegen test backend-test frontend-build clean

help:
	@echo "anirudh-portfolio — monorepo make targets"
	@echo ""
	@echo "  make install          Install backend (uv) + frontend (pnpm) deps"
	@echo "  make dev              Run db, backend, and frontend together"
	@echo "  make db               Start local Postgres via docker compose"
	@echo "  make migrate          Apply Alembic migrations"
	@echo "  make seed             Seed initial portfolio content"
	@echo "  make bootstrap        Create the first admin user from .env"
	@echo "  make typegen          Regenerate frontend types from /api/openapi.json"
	@echo "  make test             Run backend pytest + frontend type-check"
	@echo "  make backend          Run backend dev server only"
	@echo "  make frontend         Run frontend dev server only"
	@echo "  make clean            Remove build artifacts"

install:
	cd backend && uv sync
	cd frontend && pnpm install

db:
	docker compose up -d db

migrate:
	cd backend && uv run alembic upgrade head

seed:
	cd backend && uv run python -m scripts.seed

bootstrap:
	cd backend && uv run python -m scripts.bootstrap_admin

backend:
	cd backend && uv run uvicorn app.main:app --reload --port 8000

frontend:
	cd frontend && pnpm dev

dev:
	docker compose up -d db
	@echo "→ db up. Run 'make migrate seed bootstrap' in another terminal first if this is a fresh DB."
	@(cd backend && uv run uvicorn app.main:app --reload --port 8000) & \
	(cd frontend && pnpm dev) & \
	wait

typegen:
	cd frontend && pnpm typegen

backend-test:
	cd backend && uv run pytest -v

frontend-build:
	cd frontend && pnpm build

test: backend-test
	cd frontend && pnpm exec tsc -b

clean:
	rm -rf frontend/dist frontend/node_modules backend/.venv
