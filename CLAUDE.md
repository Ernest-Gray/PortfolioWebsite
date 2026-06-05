# Portfolio Website — CLAUDE.md

## Project Overview
Ernest Gray's personal portfolio website with an AI-powered chat feature. Full-stack monorepo.

- **Frontend:** Vite + React + TypeScript → deployed to Cloudflare Pages
- **Backend:** FastAPI (Python) → deployed to Railway (Dockerfile)
- **Database:** Railway PostgreSQL + pgvector extension
- **LLM:** Anthropic Claude API (`claude-haiku-4-5-20251001`)
- **Embeddings:** OpenAI `text-embedding-3-small`

## Monorepo Structure
```
/frontend         Vite+React+TS — Cloudflare Pages
/backend          FastAPI+Python — Railway
/knowledge-base   RAG source docs (edit here, then run ingest.py to refresh)
/docs/learning    Learning notes written after each build phase
/docs/superpowers Spec and plan files
```

## Running Locally

**Backend:**
```bash
cd backend
uv sync
cp ../.env.example .env   # fill in real values
uv run uvicorn app.main:app --reload
# Runs at http://localhost:8000
```

**Frontend:**
```bash
cd frontend
npm install
cp ../.env.example .env.local  # set VITE_API_URL=http://localhost:8000
npm run dev
# Runs at http://localhost:5173
```

## Environment Variables

| Variable | Location | Purpose |
|---|---|---|
| `DATABASE_URL` | backend/.env | postgresql+asyncpg://... Railway URL |
| `ANTHROPIC_API_KEY` | backend/.env | Claude API key |
| `OPENAI_API_KEY` | backend/.env | OpenAI embeddings key |
| `ALLOWED_ORIGINS` | backend/.env | Comma-separated CORS origins |
| `VITE_API_URL` | frontend/.env.local | Backend URL for browser |

## Key Conventions

- **`frontend/src/data/experience.ts`** is the single source of truth for UI rendering (timeline cards, nav dropdown). Edit this to update what's shown on the page.
- **`knowledge-base/*.md`** is what the AI chat knows about Ernest. Edit these files, then run the ingest script to refresh embeddings.
- **Refreshing RAG knowledge base:** `cd backend && uv run python scripts/ingest.py`
- **Streaming:** Backend uses FastAPI `StreamingResponse` + SSE (`text/event-stream`). Frontend consumes via `fetch` + `ReadableStream` (NOT `EventSource` — SSE is over POST).
- **No auth** — rate limiting is IP-based token bucket in `backend/app/middleware/rate_limit.py`

## Deployment

**Frontend → Cloudflare Pages:**
- Connect GitHub repo, set build command: `npm run build`, output: `dist`, root: `frontend/`
- Set env var: `VITE_API_URL=https://your-api.railway.app`
- Push to `main` → auto-deploys

**Backend → Railway:**
- Create Railway project, add service from repo (auto-detects `backend/Dockerfile`)
- Add PostgreSQL service, enable pgvector extension: `CREATE EXTENSION vector;`
- Set env vars: `DATABASE_URL`, `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `ALLOWED_ORIGINS`
- Run migration: `uv run alembic upgrade head`
- Run ingest: `uv run python scripts/ingest.py`

## Quality Gates — MANDATORY

All three must pass before any feature is marked complete, before any commit, and before any deployment. No exceptions.

```bash
# Backend
cd backend
uv run ruff check . && uv run ruff format --check .
uv run pytest -v

# Frontend
cd frontend
npm run lint
npm run test
npx playwright test
```

## Model IDs
- Chat LLM: `claude-haiku-4-5-20251001`
- Embeddings: `text-embedding-3-small` (OpenAI, 1536 dimensions)
