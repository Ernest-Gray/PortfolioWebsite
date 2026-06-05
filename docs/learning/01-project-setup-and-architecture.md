# Phase 1: Project Setup & Architecture

## What We Built

A full-stack portfolio website with:
- **React + TypeScript** frontend (Vite + Tailwind CSS + Framer Motion)
- **FastAPI + Python** backend with async SQLAlchemy
- **pgvector** on PostgreSQL for vector similarity search
- **RAG pipeline**: OpenAI embeddings → cosine search → Claude haiku streaming
- **SSE streaming** chat widget (floating panel / mobile modal)
- Hosted on **Cloudflare Pages** (frontend) + **Railway** (backend + DB)

---

## Key Concepts

### RAG — Retrieval-Augmented Generation

Instead of the LLM hallucinating answers about Ernest, we:
1. Pre-chunk Ernest's work history into ~1500-char segments and embed them via OpenAI
2. At query time, embed the user's question → find the top-5 nearest chunks by cosine distance
3. Inject those chunks as context into the Claude prompt

**Why this matters:** The model stays grounded in real facts. It can't invent a job that doesn't exist in the knowledge base.

### pgvector

A PostgreSQL extension that stores vectors (arrays of floats) as a column type and supports ANN (approximate nearest neighbor) queries. We use `<=>` for cosine distance:

```sql
SELECT content, 1 - (embedding <=> '[0.1, 0.2, ...]'::vector) AS similarity
FROM chunks
ORDER BY embedding <=> '[0.1, 0.2, ...]'::vector
LIMIT 5;
```

The `1 - distance` converts cosine distance (0 = identical, 2 = opposite) to similarity (1 = identical).

### Server-Sent Events (SSE) over POST

Standard `EventSource` only supports GET requests. Since our `/chat` endpoint needs a JSON body, we use `fetch` + `ReadableStream` instead:

```typescript
const response = await fetch('/chat', { method: 'POST', body: JSON.stringify({...}) })
const reader = response.body!.getReader()
// read chunks: "data: {\"text\": \"Hello\"}\n\n"
// until: "data: [DONE]\n\n"
```

The backend yields `f"data: {json.dumps({'text': chunk})}\n\n"` for each token.

### Async FastAPI + SQLAlchemy 2

FastAPI uses an async event loop, so all I/O (DB queries, HTTP calls to OpenAI/Anthropic) must be `await`-ed. SQLAlchemy 2's async engine uses the `asyncpg` driver:

```python
engine = create_async_engine(settings.database_url)
async with AsyncSession(engine) as db:
    result = await db.execute(text("SELECT ..."))
```

### pydantic-settings

Settings are validated at import time using environment variables (or a `.env` file):

```python
class Settings(BaseSettings):
    database_url: str
    anthropic_api_key: str
    model_config = {"env_file": ".env"}
```

This means **tests must set `os.environ` before importing the app** — that's why `conftest.py` uses `os.environ.setdefault()` at the top.

### uv

Python package manager that replaces `pip` + `venv`. Key commands:
- `uv sync` — install dependencies from `pyproject.toml`
- `uv run pytest` — run a command inside the venv
- `uv run ruff check . --fix` — lint and autofix

---

## Architecture Decision: Why Separate Configs for Vite and Vitest?

Vite and Vitest share the plugin system but have separate TypeScript type definitions. The `test` block in `vite.config.ts` isn't typed in Vite's `UserConfigExport` — only in Vitest's `defineConfig`. 

**Solution:** Two files, two imports:
- `vite.config.ts` → `import { defineConfig } from 'vite'`
- `vitest.config.ts` → `import { defineConfig } from 'vitest/config'`

### Why the e2e/ exclusion in vitest.config.ts?

Vitest by default scans all `*.spec.ts` files, including Playwright tests. Playwright's `test.describe()` is a different API and crashes Vitest. Fix: restrict Vitest's `include` to `src/**/*.test.{ts,tsx}`.

---

## Quality Gates

Every feature must pass all three before it's "done":

| Gate | Command | What it catches |
|------|---------|-----------------|
| Lint | `npm run lint` / `uv run ruff check .` | Style, unused vars, imports |
| Unit tests | `npm run test -- --run` / `uv run pytest` | Logic correctness in isolation |
| E2E | `npx playwright test` | Golden-path user flows in a real browser |

---

## Quiz

1. What is the cosine distance operator in pgvector SQL, and what value means "most similar"?

2. Why can't we use the browser's built-in `EventSource` for our chat endpoint?

3. Why does `conftest.py` call `os.environ.setdefault()` before any other imports?

4. If you run `npm run test` and it picks up your Playwright `*.spec.ts` files and crashes — what's the fix?

5. The RAG pipeline does: embed → retrieve → ??? → stream. What fills the blank, and what goes into it?

<details>
<summary>Answers</summary>

1. `<=>` is cosine distance. A value of `0` means identical (so `1 - 0 = 1` similarity). We `ORDER BY embedding <=> query_vec` to get closest first.

2. `EventSource` only supports GET requests. Our `/chat` endpoint needs a JSON body (message + history), so we use `fetch` + `ReadableStream` to parse the SSE stream manually.

3. `pydantic-settings` reads env vars at import time. If `DATABASE_URL` etc. aren't set before `from app.config import settings` runs, the `Settings()` constructor throws a `ValidationError` and every test fails.

4. Add `include: ['src/**/*.test.{ts,tsx}']` to `vitest.config.ts` so Vitest only scans unit test files and skips `e2e/`.

5. The blank is **prompt assembly** (`build_messages`). It takes the retrieved chunks and formats them as `[Source: x]\ncontent` blocks inside a `<context>` tag in the system prompt, then appends the last 10 messages of conversation history.

</details>
