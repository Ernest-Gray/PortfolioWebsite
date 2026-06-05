# Portfolio Website — Design Spec
**Date:** 2026-06-05  
**Author:** Ernest Gray  
**Status:** Approved

---

## Overview

Ernest Gray's personal portfolio website. Full-stack application with an AI-powered chat feature backed by a RAG pipeline, designed to serve recruiters, hiring managers, and senior engineers evaluating Ernest for AI/ML, backend, and full-stack roles.

**Core differentiator:** A floating chat widget lets visitors ask natural-language questions about Ernest's experience. The answers are grounded in a structured knowledge base (his real work history) via RAG — not hallucinated — and streamed back in real time via the Claude API.

---

## Stack Decisions

| Layer | Choice | Rationale |
|---|---|---|
| Frontend | Vite + React + TypeScript | Ernest knows React; Vite is fast for dev; TS enforces contracts |
| Styling | Tailwind CSS + Framer Motion | Utility-first, dark theme, scroll animations |
| Frontend hosting | Cloudflare Pages | Generous free tier, fast global CDN, custom domain |
| Backend | FastAPI (Python) | Async, streaming-native, Ernest's strongest language |
| Backend hosting | Railway (Dockerfile) | Simple deploy, free tier, co-located with DB |
| Database | Railway PostgreSQL + pgvector | One service, SQL Ernest knows, vector search built in |
| LLM | Anthropic Claude API (`claude-haiku-4-5`) | Signals direct expertise; low cost per conversation |
| Embeddings | OpenAI `text-embedding-3-small` | Best quality/cost ratio; isolated to one function for easy swap |
| Learning material | `/docs/learning/*.md` files | Written after each phase; quiz at end of full build |

---

## Repository Structure

```
PortfolioWebsite/
├── frontend/                  # Vite + React + TypeScript
│   ├── src/
│   │   ├── components/        # Hero, About, Navbar, Timeline, Skills, ProjectCards, ChatWidget, Footer
│   │   ├── hooks/             # useChat (SSE + history)
│   │   ├── data/
│   │   │   └── experience.ts  # Single source of truth for UI rendering (timeline cards, nav dropdown)
│   │   └── pages/             # index (single-page)
│   ├── public/
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── package.json
│
├── backend/                   # FastAPI + Python
│   ├── app/
│   │   ├── api/
│   │   │   └── chat.py        # POST /chat → SSE stream, GET /health
│   │   ├── rag/
│   │   │   ├── embed.py       # OpenAI embedding calls
│   │   │   ├── retrieve.py    # pgvector cosine similarity search
│   │   │   └── prompt.py      # system prompt + context assembly
│   │   ├── middleware/
│   │   │   └── rate_limit.py  # IP-based token bucket (10 req/min)
│   │   └── main.py
│   ├── scripts/
│   │   └── ingest.py          # Chunk + embed knowledge-base/ → pgvector
│   ├── alembic/               # DB migrations
│   ├── tests/                 # Pytest unit tests
│   ├── pyproject.toml
│   └── Dockerfile
│
├── docs/
│   ├── learning/              # 01-rag-basics.md, 02-vector-search.md, etc.
│   └── superpowers/specs/     # this file
│
├── knowledge-base/            # Raw markdown source docs for RAG ingestion (separate from experience.ts — this is what the AI reads, not the UI)
│   ├── aws-work.md
│   ├── northrop-work.md
│   ├── education-projects.md
│   └── personal-bio.md
│
├── .claude/
│   └── settings.json          # MCP permissions + allowed commands
├── CLAUDE.md                  # Persistent context for Claude across sessions
├── .env.example
└── .gitignore
```

---

## Infrastructure & Hosting

```
┌─────────────────────────────────────────────────────┐
│                   Cloudflare                        │
│  Pages (React SPA)  +  DNS/CDN for custom domain   │
└──────────────────────────┬──────────────────────────┘
                           │ HTTPS API calls
                           ▼
┌─────────────────────────────────────────────────────┐
│                    Railway                          │
│                                                     │
│  ┌─────────────────────┐  ┌──────────────────────┐  │
│  │  FastAPI service    │  │  PostgreSQL service  │  │
│  │  (Dockerfile)       │◄─►  + pgvector ext.     │  │
│  │  PORT 8000          │  │  (Railway managed)   │  │
│  └─────────────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────┘
                           │
                           ▼
                    Anthropic Claude API
                    (called from backend only — key never in browser)
```

**Environment variables:**
- Frontend: `VITE_API_URL`
- Backend: `DATABASE_URL`, `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `ALLOWED_ORIGINS`

**Cost estimate at idle/low traffic:** ~$5/month (Railway hobby plan). Cloudflare Pages free. Claude `haiku-4-5` at ~$0.80/M input tokens = hundreds of conversations for under $1.

---

## Backend & RAG Pipeline

### API Routes

| Route | Method | Description |
|---|---|---|
| `/chat` | POST | Accepts `{ message, conversation_history[] }`, returns SSE stream |
| `/health` | GET | Railway health check |

CORS locked to Cloudflare domain only. Rate limiting: 10 requests/minute per IP (in-memory token bucket).

### RAG Pipeline (per `/chat` request)

```
1. Embed user message
      → OpenAI text-embedding-3-small → 1536-dim vector

2. pgvector cosine similarity search
      → top-5 chunks from knowledge base

3. Assemble prompt
      System: "You are Ernest's portfolio assistant. Answer only based
               on the provided context. Be concise and honest about
               what you do and don't know."
      Context: [retrieved chunks with source labels]
      History: [last 10 conversation turns]
      User: [current message]

4. Stream Claude API response (claude-haiku-4-5)
      → FastAPI StreamingResponse (SSE)
      → Frontend EventSource appends chunks in real time
```

### Ingest Script (`scripts/ingest.py`)

Runs once at setup, and again whenever `knowledge-base/` is updated:
```
1. Read all .md files from knowledge-base/
2. Chunk (512 tokens, 64-token overlap)
3. Embed each chunk via OpenAI
4. Upsert into pgvector: chunks(id, content, source, embedding vector(1536))
```

---

## Frontend

### Page Layout

Single-page app. Sticky navbar with Experience dropdown for jump navigation.

```
Navbar (sticky)
  └── Experience dropdown: AWS AI/ML | Northrop Grumman | LightningFlashcards | InfoSys Intern

Hero              — Name, title, one-liner, GitHub/LinkedIn/Resume CTAs
About             — Short paragraph, key facts (clearance, location, targets)
Experience        — Expandable timeline cards, anchor targets per job
Skills            — Grouped chips: Languages / AWS / GenAI / IaC / Testing
Projects          — Cards for LISA PR, MLSpace PRs, LightningFlashcards
Footer            — Email, GitHub, LinkedIn

[ChatWidget]      — Fixed position, always visible regardless of scroll
```

### AI Chat Widget

- **Desktop:** Fixed bottom-right pill button ("Ask about Ernest ✦"). Click expands to ~380px floating chat panel. Esc or click-away collapses.
- **Mobile:** Same pill button, tap opens full-screen modal with close button.
- Suggested starter prompts shown before first message:
  - "What did you build at AWS?"
  - "Tell me about your ML work at Northrop"
  - "What's your experience with RAG?"
- SSE streaming with typewriter effect
- Conversation history in React state (last 10 turns sent with each request)
- Graceful error fallback if API is down or rate-limited

### Styling

- Dark theme default (near-black background, subtle gradients)
- Single electric accent color (cyan or violet — decided during implementation)
- Tailwind CSS with custom palette in `tailwind.config.ts`
- Scroll animations via Framer Motion (fade-in on section enter)
- Light mode toggle: optional stretch goal

### Key Components

```
<Navbar />          — sticky, Experience dropdown with anchor links
<Hero />
<About />
<Timeline />        — maps over experience.ts, anchor targets per entry
<Skills />
<ProjectCards />
<Footer />
<ChatWidget />      — fixed position overlay, desktop panel / mobile modal
  └── useChat()     — owns all SSE + history logic
```

---

## Claude Setup

### CLAUDE.md (persistent context)

Covers: project overview, monorepo structure, how to run locally, environment variables, deployment instructions, RAG update process, code conventions, and mandatory quality gates.

### Quality Gates — Mandatory

All three must pass before any feature is marked complete, before any commit, and before any deployment. No exceptions, no skipping.

| Gate | Frontend | Backend |
|---|---|---|
| Linting | `npm run lint` (ESLint + Prettier) | `ruff check . && ruff format --check .` |
| Unit tests | `npm run test` (Vitest) | `pytest` |
| E2E tests | `npx playwright test` | — |

### `.claude/settings.json`

Pre-approved commands (no permission prompt):
- `npm run dev/build/lint/test`
- `npx playwright test`
- `uvicorn`, `ruff check/format`, `pytest`
- `python backend/scripts/ingest.py`
- `git status/diff/log`

### MCP Servers (already wired in environment)

- **Railway MCP** — deploy services, check logs, manage env vars
- **Playwright MCP** — browser-driven E2E testing and visual verification
- **Context7 MCP** — fetch current library docs during implementation

---

## Learning Material Plan

A `/docs/learning/` file is written after each major implementation phase:

| Phase | Learning doc |
|---|---|
| Project setup + CLAUDE.md | `01-project-setup.md` |
| pgvector + embeddings | `02-vector-search-and-embeddings.md` |
| RAG pipeline | `03-rag-pipeline.md` |
| FastAPI + SSE streaming | `04-streaming-apis.md` |
| React SSE consumption + chat UI | `05-frontend-sse-and-chat.md` |
| Cloudflare Pages + Railway deploy | `06-deployment.md` |

Quiz covering all six topics written at the end of the build.

---

## Out of Scope (for v1)

- Auth / login
- Light mode toggle (stretch goal)
- Cloudflare Worker proxy/cache layer
- Admin UI for updating knowledge base
- Analytics
