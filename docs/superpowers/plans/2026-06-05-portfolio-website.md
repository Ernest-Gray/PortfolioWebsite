# Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Ernest Gray's AI-powered portfolio website — React SPA on Cloudflare Pages, FastAPI backend on Railway, pgvector RAG, Claude haiku streaming chat widget.

**Architecture:** Monorepo at `C:\Projects\PortfolioWebsite`. Frontend (Vite+React+TS) → Cloudflare Pages. Backend (FastAPI+Python) → Railway alongside PostgreSQL+pgvector. On each chat request: embed query via OpenAI → cosine search pgvector top-5 chunks → assemble grounded prompt → stream Claude haiku via SSE back to browser.

**Tech Stack:** Python 3.12 (via uv), FastAPI, SQLAlchemy 2 async, asyncpg, pgvector, anthropic SDK, openai SDK, Alembic, Pytest, Ruff; React 18, Vite 5, TypeScript 5, Tailwind CSS 3, Framer Motion 11, Vitest, Playwright

---

## File Map

**Backend:**
`backend/pyproject.toml`, `backend/Dockerfile`, `backend/.python-version`
`backend/app/main.py` — app factory, CORS, router mount
`backend/app/database.py` — async engine + session
`backend/app/models.py` — Chunk ORM model
`backend/app/api/chat.py` — POST /chat (SSE stream), GET /health
`backend/app/rag/embed.py` — OpenAI text-embedding-3-small
`backend/app/rag/retrieve.py` — pgvector cosine search
`backend/app/rag/prompt.py` — system prompt + context assembly
`backend/app/middleware/rate_limit.py` — IP token bucket (10/min)
`backend/scripts/ingest.py` — chunk + embed + upsert knowledge-base/
`backend/alembic/` — migration: chunks table with vector(1536)
`backend/tests/` — pytest tests for all modules

**Frontend:**
`frontend/` — Vite+React+TS scaffold
`frontend/src/data/experience.ts` — all work history (UI source of truth)
`frontend/src/components/Navbar.tsx` — sticky nav + Experience dropdown
`frontend/src/components/Hero.tsx`
`frontend/src/components/About.tsx`
`frontend/src/components/Timeline.tsx` — maps experience.ts, anchor targets
`frontend/src/components/Skills.tsx`
`frontend/src/components/ProjectCards.tsx`
`frontend/src/components/Footer.tsx`
`frontend/src/components/ChatWidget.tsx` — floating panel/modal
`frontend/src/hooks/useChat.ts` — fetch SSE + conversation history
`frontend/src/App.tsx`, `frontend/src/index.css`
`frontend/tailwind.config.ts`, `frontend/playwright.config.ts`

**Root:**
`CLAUDE.md`, `.claude/settings.json`, `.gitignore`, `.env.example`
`knowledge-base/{personal-bio,aws-work,northrop-work,education-projects}.md`

---

### Task 1: Git init + root scaffold

**Files:** `.gitignore`, `.env.example`

- [ ] Run `git init` in `C:\Projects\PortfolioWebsite`
- [ ] Write `.gitignore`:
```
# Python
backend/.venv/
**/__pycache__/
**/*.egg-info/
**/.pytest_cache/
**/dist/
.ruff_cache/

# Node
frontend/node_modules/
frontend/dist/
frontend/.playwright/
frontend/test-results/
frontend/playwright-report/

# Env
.env
backend/.env
frontend/.env
frontend/.env.local

# OS
.DS_Store
Thumbs.db
```
- [ ] Write `.env.example`:
```
# Copy relevant section to backend/.env or frontend/.env.local
DATABASE_URL=postgresql+asyncpg://user:password@host:5432/portfolio
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
ALLOWED_ORIGINS=http://localhost:5173,https://your-site.pages.dev
VITE_API_URL=http://localhost:8000
```
- [ ] Commit: `chore: init repo with gitignore and env template`

---

### Task 2: Knowledge base markdown files

**Files:** `knowledge-base/{personal-bio,aws-work,northrop-work,education-projects}.md`

- [ ] Write `knowledge-base/personal-bio.md` — name, contact, education (Towson CS 3.86), location (Denver CO), clearance (Active/Secret), job targets, elevator pitch, SAFe cert, GitHub/LinkedIn URLs
- [ ] Write `knowledge-base/aws-work.md` — full AWS AI/ML SDE work (Dec 2025–present): MissionSolutionsKBBot RAG Slack bot, LISA liteLLM fix + Claude Code integration, MLSpace workforce portal URL feature + dependency uplift, BlackMirror/PRevere cross-partition observability, Oscar agent refactor, tech skills (Lambda/CDK/Bedrock/Kendra/SageMaker/SQS/pgvector)
- [ ] Write `knowledge-base/northrop-work.md` — Software Tech Lead MDA (led team of 4, test-stand software, bitstream tools, Python/NumPy, oscilloscope/AWG scripts), F-16 SABR ML (SVM in C++ for combat ID, MATLAB→C++ embedded conversion, signal processing)
- [ ] Write `knowledge-base/education-projects.md` — BS CS Towson 2023 GPA 3.86, LightningFlashcards (full-stack, OpenAI API, Stripe, MySQL, React), InfoSys intern (CV camera config Python/TF, hackathon VR app team lead), SAFe Scrum Master 6.0
- [ ] Commit: `docs: add RAG knowledge base source files`

---

### Task 3: CLAUDE.md + .claude/settings.json

**Files:** `CLAUDE.md`, `.claude/settings.json`

- [ ] Write `CLAUDE.md` with: project overview, monorepo structure, local run commands, env vars, deployment notes, RAG update process, quality gates
- [ ] Write `.claude/settings.json`:
```json
{
  "permissions": {
    "allow": [
      "Bash(npm run dev)",
      "Bash(npm run build)",
      "Bash(npm run lint)",
      "Bash(npm run test*)",
      "Bash(npx playwright*)",
      "Bash(npx vite*)",
      "Bash(uv run uvicorn*)",
      "Bash(uv run pytest*)",
      "Bash(uv run ruff*)",
      "Bash(uv run alembic*)",
      "Bash(uv run python*)",
      "Bash(uv sync*)",
      "Bash(git status)",
      "Bash(git diff*)",
      "Bash(git log*)",
      "Bash(git add*)",
      "Bash(git commit*)"
    ]
  }
}
```
- [ ] Commit: `chore: add CLAUDE.md and claude settings`

---

### Task 4: Backend Python project setup

**Files:** `backend/pyproject.toml`, `backend/.python-version`, `backend/Dockerfile`

- [ ] Write `backend/.python-version`: `3.12`
- [ ] Write `backend/pyproject.toml`:
```toml
[project]
name = "portfolio-backend"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
    "fastapi>=0.115",
    "uvicorn[standard]>=0.30",
    "sqlalchemy[asyncio]>=2.0",
    "asyncpg>=0.30",
    "pgvector>=0.3",
    "alembic>=1.13",
    "anthropic>=0.40",
    "openai>=1.50",
    "pydantic>=2.0",
    "pydantic-settings>=2.0",
    "python-dotenv>=1.0",
    "tiktoken>=0.7",
]

[tool.uv]
dev-dependencies = [
    "pytest>=8.0",
    "pytest-asyncio>=0.23",
    "httpx>=0.27",
    "pytest-mock>=3.12",
    "ruff>=0.6",
]

[tool.ruff]
line-length = 100

[tool.ruff.lint]
select = ["E", "F", "I", "UP"]

[tool.pytest.ini_options]
asyncio_mode = "auto"
testpaths = ["tests"]
```
- [ ] Run `cd backend && uv sync` to create `.venv` and install deps
- [ ] Write `backend/Dockerfile`:
```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY pyproject.toml .
RUN pip install uv && uv sync --no-dev
COPY app/ app/
EXPOSE 8000
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```
- [ ] Commit: `chore: backend python project setup with uv`

---

### Task 5: Backend app skeleton — main.py, database.py, models.py, settings

**Files:** `backend/app/main.py`, `backend/app/database.py`, `backend/app/models.py`, `backend/app/config.py`

- [ ] Write `backend/app/config.py`:
```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    anthropic_api_key: str
    openai_api_key: str
    allowed_origins: str = "http://localhost:5173"

    @property
    def origins(self) -> list[str]:
        return [o.strip() for o in self.allowed_origins.split(",")]

    class Config:
        env_file = ".env"

settings = Settings()
```

- [ ] Write `backend/app/database.py`:
```python
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from app.config import settings

engine = create_async_engine(settings.database_url, echo=False)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

class Base(DeclarativeBase):
    pass

async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session
```

- [ ] Write `backend/app/models.py`:
```python
from pgvector.sqlalchemy import Vector
from sqlalchemy import Integer, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base

class Chunk(Base):
    __tablename__ = "chunks"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    source: Mapped[str] = mapped_column(Text, nullable=False)
    embedding: Mapped[list[float]] = mapped_column(Vector(1536), nullable=False)
```

- [ ] Write `backend/app/main.py`:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.chat import router as chat_router
from app.config import settings

app = FastAPI(title="Ernest Gray Portfolio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

app.include_router(chat_router)
```

- [ ] Create empty `__init__.py` files: `backend/app/__init__.py`, `backend/app/api/__init__.py`, `backend/app/rag/__init__.py`, `backend/app/middleware/__init__.py`
- [ ] Commit: `feat: backend app skeleton with config, database, models`

---

### Task 6: Alembic migration — create chunks table

**Files:** `backend/alembic.ini`, `backend/alembic/env.py`, `backend/alembic/versions/001_create_chunks_table.py`

- [ ] Run `cd backend && uv run alembic init alembic`
- [ ] Replace `backend/alembic/env.py` target_metadata with:
```python
import asyncio
from logging.config import fileConfig
from sqlalchemy.ext.asyncio import create_async_engine
from alembic import context
from app.config import settings
from app.database import Base
from app import models  # noqa: F401 — registers models

config = context.config
if config.config_file_name:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

def do_run_migrations(connection):
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()

async def run_async_migrations():
    engine = create_async_engine(settings.database_url)
    async with engine.begin() as conn:
        await conn.run_sync(do_run_migrations)
    await engine.dispose()

def run_migrations_online():
    asyncio.run(run_async_migrations())

run_migrations_online()
```
- [ ] Write `backend/alembic/versions/001_create_chunks_table.py`:
```python
"""create chunks table

Revision ID: 001
Revises:
Create Date: 2026-06-05
"""
from alembic import op
import sqlalchemy as sa

revision = "001"
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")
    op.create_table(
        "chunks",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("content", sa.Text, nullable=False),
        sa.Column("source", sa.Text, nullable=False),
        sa.Column("embedding", sa.Text, nullable=False),  # replaced by raw SQL below
    )
    op.execute("ALTER TABLE chunks ALTER COLUMN embedding TYPE vector(1536) USING embedding::vector")

def downgrade():
    op.drop_table("chunks")
```
- [ ] Update `alembic.ini` `sqlalchemy.url` line to use env var: `sqlalchemy.url = %(DATABASE_URL)s` and add `%(here)s` path fix
- [ ] Commit: `feat: alembic migration for chunks table with pgvector`

---

### Task 7: Rate limiting middleware

**Files:** `backend/app/middleware/rate_limit.py`

- [ ] Write `backend/app/middleware/rate_limit.py`:
```python
import time
from collections import defaultdict
from fastapi import Request, HTTPException

_buckets: dict[str, tuple[float, int]] = defaultdict(lambda: (time.time(), 0))
RATE_LIMIT = 10
WINDOW = 60.0

async def rate_limit_middleware(request: Request, call_next):
    if request.url.path == "/chat":
        ip = request.client.host if request.client else "unknown"
        now = time.time()
        window_start, count = _buckets[ip]
        if now - window_start > WINDOW:
            _buckets[ip] = (now, 1)
        elif count >= RATE_LIMIT:
            raise HTTPException(status_code=429, detail="Rate limit exceeded")
        else:
            _buckets[ip] = (window_start, count + 1)
    return await call_next(request)
```
- [ ] Add to `backend/app/main.py`: `app.middleware("http")(rate_limit_middleware)`
- [ ] Write `backend/tests/test_rate_limit.py`:
```python
import time
import pytest
from unittest.mock import AsyncMock, MagicMock
from app.middleware.rate_limit import rate_limit_middleware, _buckets

@pytest.fixture(autouse=True)
def clear_buckets():
    _buckets.clear()
    yield
    _buckets.clear()

@pytest.mark.asyncio
async def test_allows_requests_under_limit():
    request = MagicMock()
    request.url.path = "/chat"
    request.client.host = "1.2.3.4"
    call_next = AsyncMock(return_value="response")
    result = await rate_limit_middleware(request, call_next)
    assert result == "response"

@pytest.mark.asyncio
async def test_blocks_at_rate_limit():
    from fastapi import HTTPException
    request = MagicMock()
    request.url.path = "/chat"
    request.client.host = "1.2.3.5"
    call_next = AsyncMock(return_value="response")
    from app.middleware.rate_limit import _buckets, RATE_LIMIT, WINDOW
    _buckets["1.2.3.5"] = (time.time(), RATE_LIMIT)
    with pytest.raises(HTTPException) as exc:
        await rate_limit_middleware(request, call_next)
    assert exc.value.status_code == 429

@pytest.mark.asyncio
async def test_resets_after_window():
    request = MagicMock()
    request.url.path = "/chat"
    request.client.host = "1.2.3.6"
    call_next = AsyncMock(return_value="response")
    from app.middleware.rate_limit import _buckets, RATE_LIMIT
    _buckets["1.2.3.6"] = (time.time() - 61, RATE_LIMIT)
    result = await rate_limit_middleware(request, call_next)
    assert result == "response"
```
- [ ] Run: `cd backend && uv run pytest tests/test_rate_limit.py -v` — expect 3 PASS
- [ ] Commit: `feat: IP rate limiting middleware with tests`

---

### Task 8: RAG — embed.py

**Files:** `backend/app/rag/embed.py`, `backend/tests/test_embed.py`

- [ ] Write `backend/app/rag/embed.py`:
```python
from openai import AsyncOpenAI
from app.config import settings

_client: AsyncOpenAI | None = None

def _get_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        _client = AsyncOpenAI(api_key=settings.openai_api_key)
    return _client

async def embed_text(text: str) -> list[float]:
    response = await _get_client().embeddings.create(
        model="text-embedding-3-small",
        input=text.replace("\n", " "),
    )
    return response.data[0].embedding
```

- [ ] Write `backend/tests/test_embed.py`:
```python
import pytest
from unittest.mock import AsyncMock, MagicMock, patch

@pytest.mark.asyncio
async def test_embed_text_returns_vector():
    mock_response = MagicMock()
    mock_response.data = [MagicMock(embedding=[0.1] * 1536)]
    with patch("app.rag.embed._get_client") as mock_get:
        mock_client = MagicMock()
        mock_client.embeddings.create = AsyncMock(return_value=mock_response)
        mock_get.return_value = mock_client
        from app.rag.embed import embed_text
        result = await embed_text("hello world")
    assert len(result) == 1536
    assert result[0] == pytest.approx(0.1)

@pytest.mark.asyncio
async def test_embed_text_replaces_newlines():
    mock_response = MagicMock()
    mock_response.data = [MagicMock(embedding=[0.0] * 1536)]
    with patch("app.rag.embed._get_client") as mock_get:
        mock_client = MagicMock()
        mock_client.embeddings.create = AsyncMock(return_value=mock_response)
        mock_get.return_value = mock_client
        from app.rag.embed import embed_text
        await embed_text("line one\nline two")
        call_args = mock_client.embeddings.create.call_args
    assert "\n" not in call_args.kwargs["input"]
```

- [ ] Run: `cd backend && uv run pytest tests/test_embed.py -v` — expect 2 PASS
- [ ] Commit: `feat: OpenAI embedding module with tests`

---

### Task 9: RAG — retrieve.py

**Files:** `backend/app/rag/retrieve.py`, `backend/tests/test_retrieve.py`

- [ ] Write `backend/app/rag/retrieve.py`:
```python
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

async def retrieve_chunks(db: AsyncSession, embedding: list[float], top_k: int = 5) -> list[dict]:
    vector_str = "[" + ",".join(str(x) for x in embedding) + "]"
    result = await db.execute(
        text("""
            SELECT content, source, 1 - (embedding <=> :embedding::vector) AS similarity
            FROM chunks
            ORDER BY embedding <=> :embedding::vector
            LIMIT :top_k
        """),
        {"embedding": vector_str, "top_k": top_k},
    )
    return [{"content": row.content, "source": row.source, "similarity": row.similarity}
            for row in result.fetchall()]
```

- [ ] Write `backend/tests/test_retrieve.py`:
```python
import pytest
from unittest.mock import AsyncMock, MagicMock

@pytest.mark.asyncio
async def test_retrieve_returns_chunks():
    mock_db = AsyncMock()
    mock_row1 = MagicMock(content="Ernest worked at AWS", source="aws-work", similarity=0.92)
    mock_row2 = MagicMock(content="Ernest led team at Northrop", source="northrop-work", similarity=0.85)
    mock_result = MagicMock()
    mock_result.fetchall.return_value = [mock_row1, mock_row2]
    mock_db.execute = AsyncMock(return_value=mock_result)
    from app.rag.retrieve import retrieve_chunks
    chunks = await retrieve_chunks(mock_db, [0.1] * 1536, top_k=2)
    assert len(chunks) == 2
    assert chunks[0]["source"] == "aws-work"
    assert chunks[0]["similarity"] == pytest.approx(0.92)

@pytest.mark.asyncio
async def test_retrieve_passes_top_k():
    mock_db = AsyncMock()
    mock_result = MagicMock()
    mock_result.fetchall.return_value = []
    mock_db.execute = AsyncMock(return_value=mock_result)
    from app.rag.retrieve import retrieve_chunks
    await retrieve_chunks(mock_db, [0.0] * 1536, top_k=3)
    call_args = mock_db.execute.call_args
    assert call_args[0][1]["top_k"] == 3
```

- [ ] Run: `cd backend && uv run pytest tests/test_retrieve.py -v` — expect 2 PASS
- [ ] Commit: `feat: pgvector retrieval module with tests`

---

### Task 10: RAG — prompt.py

**Files:** `backend/app/rag/prompt.py`, `backend/tests/test_prompt.py`

- [ ] Write `backend/app/rag/prompt.py`:
```python
SYSTEM_PROMPT = """You are an AI assistant embedded in Ernest Gray's portfolio website.
Ernest is a software development engineer with experience building GenAI services, RAG pipelines,
and cloud infrastructure at AWS and Northrop Grumman.

Answer questions about Ernest based ONLY on the provided context. Be concise and direct.
If the context doesn't contain enough information to answer, say so honestly — do not invent details.
Always speak about Ernest in the third person."""

def build_messages(
    user_message: str,
    chunks: list[dict],
    history: list[dict],
) -> list[dict]:
    context = "\n\n".join(
        f"[Source: {c['source']}]\n{c['content']}" for c in chunks
    )
    system = SYSTEM_PROMPT + f"\n\n<context>\n{context}\n</context>"
    messages = list(history[-10:])  # last 10 turns max
    messages.append({"role": "user", "content": user_message})
    return system, messages
```

- [ ] Write `backend/tests/test_prompt.py`:
```python
from app.rag.prompt import build_messages, SYSTEM_PROMPT

def test_build_messages_includes_context():
    chunks = [{"content": "Ernest built RAG at AWS", "source": "aws-work", "similarity": 0.9}]
    system, messages = build_messages("What did Ernest build?", chunks, [])
    assert "Ernest built RAG at AWS" in system
    assert "[Source: aws-work]" in system

def test_build_messages_appends_user_message():
    system, messages = build_messages("Tell me about Ernest", [], [])
    assert messages[-1] == {"role": "user", "content": "Tell me about Ernest"}

def test_build_messages_caps_history_at_10():
    history = [{"role": "user", "content": f"msg {i}"} for i in range(20)]
    system, messages = build_messages("new message", [], history)
    assert len(messages) == 11  # 10 history + 1 new

def test_system_includes_base_prompt():
    system, _ = build_messages("hi", [], [])
    assert SYSTEM_PROMPT[:50] in system
```

- [ ] Run: `cd backend && uv run pytest tests/test_prompt.py -v` — expect 4 PASS
- [ ] Commit: `feat: prompt assembly module with tests`

---

### Task 11: Chat API endpoint (SSE)

**Files:** `backend/app/api/chat.py`, `backend/tests/test_chat_api.py`

- [ ] Write `backend/app/api/chat.py`:
```python
import json
from typing import AsyncGenerator
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from anthropic import AsyncAnthropic
from app.config import settings
from app.database import get_db
from app.rag.embed import embed_text
from app.rag.retrieve import retrieve_chunks
from app.rag.prompt import build_messages

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    history: list[dict] = []

async def _stream_response(message: str, history: list[dict], db: AsyncSession) -> AsyncGenerator[str, None]:
    embedding = await embed_text(message)
    chunks = await retrieve_chunks(db, embedding)
    system, messages = build_messages(message, chunks, history)

    client = AsyncAnthropic(api_key=settings.anthropic_api_key)
    async with client.messages.stream(
        model="claude-haiku-4-5-20251001",
        max_tokens=1024,
        system=system,
        messages=messages,
    ) as stream:
        async for text in stream.text_stream:
            yield f"data: {json.dumps({'text': text})}\n\n"
    yield "data: [DONE]\n\n"

@router.post("/chat")
async def chat(req: ChatRequest, db: AsyncSession = Depends(get_db)):
    return StreamingResponse(
        _stream_response(req.message, req.history, db),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )

@router.get("/health")
async def health():
    return {"status": "ok"}
```

- [ ] Write `backend/tests/test_chat_api.py`:
```python
import pytest
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock, patch, MagicMock
from app.main import app

@pytest.mark.asyncio
async def test_health_returns_ok():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

@pytest.mark.asyncio
async def test_chat_streams_response():
    async def mock_stream(*args, **kwargs):
        yield 'data: {"text": "Hello"}\n\n'
        yield 'data: [DONE]\n\n'

    with patch("app.api.chat._stream_response", return_value=mock_stream()):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            async with client.stream("POST", "/chat", json={"message": "hi"}) as response:
                assert response.status_code == 200
                chunks = [chunk async for chunk in response.aiter_text()]
    assert any("Hello" in c for c in chunks)
```

- [ ] Run `cd backend && uv run pytest tests/ -v` — all tests pass
- [ ] Commit: `feat: SSE chat endpoint with Claude streaming`

---

### Task 12: Ingest script

**Files:** `backend/scripts/ingest.py`

- [ ] Write `backend/scripts/ingest.py`:
```python
"""Run: uv run python scripts/ingest.py
Chunks all .md files in knowledge-base/, embeds them, upserts into pgvector."""
import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.config import settings
from app.rag.embed import embed_text

CHUNK_SIZE = 1500   # characters
CHUNK_OVERLAP = 200
KB_DIR = Path(__file__).parent.parent.parent / "knowledge-base"

def chunk_text(text_: str, source: str) -> list[dict]:
    chunks = []
    start = 0
    while start < len(text_):
        end = min(start + CHUNK_SIZE, len(text_))
        chunks.append({"content": text_[start:end], "source": source})
        if end == len(text_):
            break
        start += CHUNK_SIZE - CHUNK_OVERLAP
    return chunks

async def ingest():
    engine = create_async_engine(settings.database_url)
    Session = async_sessionmaker(engine, expire_on_commit=False)

    md_files = list(KB_DIR.glob("*.md"))
    if not md_files:
        print(f"No .md files found in {KB_DIR}")
        return

    async with Session() as db:
        await db.execute(text("DELETE FROM chunks"))
        await db.commit()
        print("Cleared existing chunks")

    total = 0
    for md_file in md_files:
        source = md_file.stem
        text_content = md_file.read_text(encoding="utf-8")
        chunks = chunk_text(text_content, source)
        print(f"  {source}: {len(chunks)} chunks")

        async with Session() as db:
            for chunk in chunks:
                embedding = await embed_text(chunk["content"])
                vec_str = "[" + ",".join(str(x) for x in embedding) + "]"
                await db.execute(
                    text("INSERT INTO chunks (content, source, embedding) VALUES (:c, :s, :e::vector)"),
                    {"c": chunk["content"], "s": chunk["source"], "e": vec_str},
                )
            await db.commit()
        total += len(chunks)

    print(f"Ingested {total} chunks from {len(md_files)} files")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(ingest())
```

- [ ] Commit: `feat: knowledge base ingest script`

---

### Task 13: Backend linting pass

- [ ] Run `cd backend && uv run ruff check . --fix && uv run ruff format .`
- [ ] Run `cd backend && uv run pytest -v` — all pass
- [ ] Commit: `chore: backend lint pass`

---

### Task 14: Frontend Vite scaffold

**Files:** `frontend/` (scaffolded), `frontend/tailwind.config.ts`, `frontend/src/index.css`

- [ ] Run: `cd C:\Projects\PortfolioWebsite && npm create vite@latest frontend -- --template react-ts`
- [ ] Run: `cd frontend && npm install`
- [ ] Install deps: `npm install framer-motion @tailwindcss/typography`
- [ ] Install Tailwind: `npm install -D tailwindcss@3 postcss autoprefixer vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test`
- [ ] Run: `cd frontend && npx tailwindcss init -p --ts`
- [ ] Replace `frontend/tailwind.config.ts`:
```typescript
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#0a0f1e',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
```
- [ ] Replace `frontend/src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

html {
  scroll-behavior: smooth;
}

body {
  @apply bg-slate-950 text-slate-100 font-sans antialiased;
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  @apply bg-slate-900;
}
::-webkit-scrollbar-thumb {
  @apply bg-slate-700 rounded-full;
}
```
- [ ] Update `frontend/vite.config.ts` to add test config:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: true,
  },
})
```
- [ ] Write `frontend/src/test/setup.ts`:
```typescript
import '@testing-library/jest-dom'
```
- [ ] Update `frontend/tsconfig.json` to add `"types": ["vitest/globals"]` under `compilerOptions`
- [ ] Delete boilerplate: `frontend/src/App.css`, `frontend/src/assets/react.svg`
- [ ] Update `frontend/package.json` scripts to add `"test": "vitest run"` and `"test:watch": "vitest"`
- [ ] Commit: `chore: frontend vite+react+ts scaffold with tailwind`

---

### Task 15: Playwright config

**Files:** `frontend/playwright.config.ts`, `frontend/e2e/portfolio.spec.ts`

- [ ] Run: `cd frontend && npx playwright install chromium`
- [ ] Write `frontend/playwright.config.ts`:
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: 0,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
```
- [ ] Write `frontend/e2e/portfolio.spec.ts` (smoke tests — full tests added later):
```typescript
import { test, expect } from '@playwright/test'

test('homepage loads', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Ernest Gray/)
})

test('chat widget button is visible', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('[data-testid="chat-toggle"]')).toBeVisible()
})

test('experience section has anchor targets', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#aws')).toBeVisible()
  await expect(page.locator('#northrop')).toBeVisible()
})

test('navbar experience dropdown works', async ({ page }) => {
  await page.goto('/')
  await page.click('[data-testid="nav-experience-btn"]')
  await expect(page.locator('[data-testid="nav-dropdown"]')).toBeVisible()
})
```
- [ ] Commit: `chore: playwright config and smoke tests`

---

### Task 16: experience.ts data layer

**Files:** `frontend/src/data/experience.ts`

- [ ] Write `frontend/src/data/experience.ts` with complete typed data:
```typescript
export interface Job {
  id: string
  company: string
  title: string
  period: string
  location: string
  highlights: string[]
  tags: string[]
}

export interface Project {
  id: string
  name: string
  description: string
  tags: string[]
  url?: string
}

export interface SkillGroup {
  label: string
  skills: string[]
}

export const jobs: Job[] = [
  {
    id: 'aws',
    company: 'Amazon Web Services',
    title: 'Software Development Engineer — AI/ML',
    period: 'Dec 2025 – Present',
    location: 'Denver, CO',
    highlights: [
      'Built Claude Code → LISA integration end-to-end; root-caused liteLLM double-prefix bug (PR #919)',
      'Re-architected monolithic Slack RAG bot into async two-tier system (API Gateway + SQS FIFO + Bedrock)',
      'Shipped workforce portal URL surfacing for SageMaker Ground Truth in MLSpace (PR #362)',
      'Onboarded Bedrock Data Automation to BlackMirror/PRevere cross-partition observability across 8+ CDK packages',
      'Built full RAG pipeline: Bedrock Guardrails → Kendra top-10 retrieval → Bedrock Converse → EMF metrics',
    ],
    tags: ['Python', 'TypeScript', 'AWS CDK', 'Bedrock', 'RAG', 'Lambda', 'SQS', 'Kendra'],
  },
  {
    id: 'northrop',
    company: 'Northrop Grumman',
    title: 'Software Engineer / Tech Lead',
    period: 'Jul 2023 – Nov 2025',
    location: 'Linthicum Heights, MD',
    highlights: [
      'Tech Lead for MDA team of 4 — integrated software on 5 test-stands for physics experiments',
      'Built bitstream generation tools (100s–10,000s of bits) enabling faster, lower-error experiment setup',
      'Implemented SVM-based ML model in embedded C++ for F-16 SABR combat ID (MATLAB → OFP C++)',
      'Developed signal processing pipeline to extract combat ID features as SVM inputs at runtime',
      'Wrote oscilloscope/AWG scripts for hardware simulation; validated results with system engineers',
    ],
    tags: ['Python', 'C++', 'NumPy', 'Embedded', 'ML/SVM', 'Signal Processing'],
  },
  {
    id: 'lightning',
    company: 'LightningFlashcards.com',
    title: 'Full Stack Developer (Part-Time)',
    period: 'Apr 2023 – Feb 2024',
    location: 'Remote',
    highlights: [
      'Connected OpenAI API to generate flashcards and quiz questions from textbook content',
      'Integrated Stripe API for online payments, automated billing, and credential storage',
      'Designed MySQL database for users, flashcards, quizzes, and analytics',
      'Introduced ad-attribution pixels (Google, Facebook, TikTok, Reddit) for campaign optimization',
    ],
    tags: ['React', 'Node.js', 'MySQL', 'OpenAI API', 'Stripe', 'Full Stack'],
  },
  {
    id: 'infosys',
    company: 'InfoSys',
    title: 'AI Software Engineer Intern',
    period: 'Jun 2022 – Aug 2022',
    location: 'Remote',
    highlights: [
      'Built automated camera configuration pipeline to optimize CV model training (Python, TensorFlow)',
      'Led team of 4 in hackathon — designed VR application and demo website (C#, Unity, HTML/CSS)',
    ],
    tags: ['Python', 'TensorFlow', 'Computer Vision', 'C#', 'Unity'],
  },
]

export const projects: Project[] = [
  {
    id: 'lisa',
    name: 'LISA — LLM Inference Platform',
    description: 'Fixed liteLLM double-prefix bug that blocked Claude Code integration. Onboarded foundation models and authored reference configuration table.',
    tags: ['Open Source', 'Python', 'liteLLM', 'AWS Labs'],
    url: 'https://github.com/awslabs/LISA/pull/919',
  },
  {
    id: 'mlspace',
    name: 'MLSpace — SageMaker Portal',
    description: 'Shipped workforce portal URL surfacing for Ground Truth labeling jobs and drove multi-package dependency uplift with full end-to-end validation.',
    tags: ['Open Source', 'Python', 'SageMaker', 'AWS Labs'],
    url: 'https://github.com/awslabs/mlspace/pull/362',
  },
  {
    id: 'rag-bot',
    name: 'RAG Slack Assistant',
    description: 'Async two-tier Slack bot: API Gateway ingestion + SQS FIFO + Bedrock Converse generation. Includes Guardrails, Kendra retrieval, HMAC auth, EMF metrics.',
    tags: ['Python', 'Bedrock', 'Kendra', 'RAG', 'Lambda', 'SQS'],
  },
  {
    id: 'flashcards',
    name: 'LightningFlashcards.com',
    description: 'Full-stack study tool with OpenAI-generated flashcards, Stripe payments, MySQL backend, and ad-attribution pixel integration.',
    tags: ['React', 'Node.js', 'OpenAI', 'Stripe', 'MySQL'],
  },
]

export const skillGroups: SkillGroup[] = [
  { label: 'Languages', skills: ['Python', 'TypeScript', 'JavaScript', 'C++', 'C#', 'Java'] },
  { label: 'AWS', skills: ['Lambda', 'CDK', 'Bedrock', 'Kendra', 'SageMaker', 'API Gateway', 'SQS', 'CloudWatch', 'IAM'] },
  { label: 'GenAI / RAG', skills: ['RAG Pipelines', 'Bedrock Converse', 'Guardrails', 'Prompt Engineering', 'pgvector', 'OpenAI API'] },
  { label: 'Infrastructure', skills: ['AWS CDK', 'CloudFormation', 'Docker', 'Alembic', 'GitLab CI', 'Jenkins'] },
  { label: 'Frontend', skills: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Angular', 'HTML/CSS'] },
  { label: 'Data & Testing', skills: ['PostgreSQL', 'MySQL', 'Pytest', 'Vitest', 'Playwright', 'NumPy', 'PyTorch', 'TensorFlow'] },
]
```
- [ ] Commit: `feat: experience data layer`

---

### Task 17: Navbar component

**Files:** `frontend/src/components/Navbar.tsx`, `frontend/src/components/Navbar.test.tsx`

- [ ] Write `frontend/src/components/Navbar.tsx`:
```tsx
import { useState, useEffect } from 'react'
import { jobs } from '../data/experience'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setDropdownOpen(false)
  }

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800' : ''}`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => scrollTo('hero')} className="text-slate-100 font-semibold text-lg hover:text-cyan-400 transition-colors">
          Ernest Gray
        </button>
        <div className="flex items-center gap-8">
          <button onClick={() => scrollTo('about')} className="text-slate-400 hover:text-slate-100 text-sm transition-colors">About</button>

          <div className="relative">
            <button
              data-testid="nav-experience-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-slate-400 hover:text-slate-100 text-sm transition-colors flex items-center gap-1"
            >
              Experience
              <svg className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {dropdownOpen && (
              <div data-testid="nav-dropdown" className="absolute top-full right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1">
                {jobs.map(job => (
                  <button
                    key={job.id}
                    onClick={() => scrollTo(job.id)}
                    className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-colors"
                  >
                    {job.company}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => scrollTo('skills')} className="text-slate-400 hover:text-slate-100 text-sm transition-colors">Skills</button>
          <button onClick={() => scrollTo('projects')} className="text-slate-400 hover:text-slate-100 text-sm transition-colors">Projects</button>
          <a href="https://github.com/Ernest-Gray" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400 transition-colors text-sm">GitHub</a>
        </div>
      </div>
    </nav>
  )
}
```

- [ ] Write `frontend/src/components/Navbar.test.tsx`:
```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import Navbar from './Navbar'

test('renders Ernest Gray brand link', () => {
  render(<Navbar />)
  expect(screen.getByText('Ernest Gray')).toBeInTheDocument()
})

test('opens dropdown on experience button click', () => {
  render(<Navbar />)
  const btn = screen.getByTestId('nav-experience-btn')
  fireEvent.click(btn)
  expect(screen.getByTestId('nav-dropdown')).toBeInTheDocument()
})

test('dropdown contains all job companies', () => {
  render(<Navbar />)
  fireEvent.click(screen.getByTestId('nav-experience-btn'))
  expect(screen.getByText('Amazon Web Services')).toBeInTheDocument()
  expect(screen.getByText('Northrop Grumman')).toBeInTheDocument()
})
```

- [ ] Run: `cd frontend && npm run test` — pass
- [ ] Commit: `feat: Navbar component with experience dropdown`

---

### Task 18: Hero + About components

**Files:** `frontend/src/components/Hero.tsx`, `frontend/src/components/About.tsx`

- [ ] Write `frontend/src/components/Hero.tsx`:
```tsx
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center px-6 pt-16">
      <div className="max-w-4xl text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="text-cyan-400 text-sm font-medium tracking-widest uppercase mb-4">Software Development Engineer</p>
          <h1 className="text-6xl md:text-7xl font-bold text-slate-100 mb-6 leading-tight">
            Ernest Gray
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Building GenAI services, RAG pipelines, and cloud infrastructure at AWS.
            Open-source contributor to LISA and MLSpace. Active/Secret clearance.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <a href="https://github.com/Ernest-Gray" target="_blank" rel="noopener noreferrer"
              className="px-6 py-3 bg-slate-800 border border-slate-700 text-slate-100 rounded-lg hover:border-cyan-500 hover:text-cyan-400 transition-all text-sm font-medium">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/ernest-gray-a877a9100/" target="_blank" rel="noopener noreferrer"
              className="px-6 py-3 bg-slate-800 border border-slate-700 text-slate-100 rounded-lg hover:border-cyan-500 hover:text-cyan-400 transition-all text-sm font-medium">
              LinkedIn
            </a>
            <a href="mailto:Egray4cs@gmail.com"
              className="px-6 py-3 bg-cyan-500 text-slate-950 rounded-lg hover:bg-cyan-400 transition-all text-sm font-medium">
              Get in Touch
            </a>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-px h-12 bg-gradient-to-b from-slate-700 to-transparent mx-auto" />
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] Write `frontend/src/components/About.tsx`:
```tsx
import { motion } from 'framer-motion'

const facts = [
  { label: 'Location', value: 'Denver, CO' },
  { label: 'Clearance', value: 'Active / Secret' },
  { label: 'Experience', value: '4 Years' },
  { label: 'Education', value: 'BS CS, Towson — GPA 3.86' },
  { label: 'Cert', value: 'SAFe Scrum Master 6.0' },
]

export default function About() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2 className="text-3xl font-bold text-slate-100 mb-2">About</h2>
          <div className="w-12 h-1 bg-cyan-500 mb-8" />
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-slate-400 leading-relaxed mb-4">
                Software engineer with experience building GenAI services, cloud infrastructure,
                and full-stack applications at AWS and Northrop Grumman. Shipped production features
                on two open-source AWS Labs projects used by AI/ML teams, built RAG pipelines on
                Amazon Bedrock, and led a five-engineer team at Northrop.
              </p>
              <p className="text-slate-400 leading-relaxed">
                Looking for roles where I can keep building meaningful AI/ML or cloud systems at scale —
                ideally at big tech or a Series A–C AI startup.
              </p>
            </div>
            <div className="space-y-3">
              {facts.map(f => (
                <div key={f.label} className="flex justify-between items-center py-2 border-b border-slate-800">
                  <span className="text-slate-500 text-sm">{f.label}</span>
                  <span className="text-slate-200 text-sm font-medium">{f.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] Commit: `feat: Hero and About components`

---

### Task 19: Timeline component

**Files:** `frontend/src/components/Timeline.tsx`, `frontend/src/components/Timeline.test.tsx`

- [ ] Write `frontend/src/components/Timeline.tsx`:
```tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { jobs } from '../data/experience'

export default function Timeline() {
  const [expanded, setExpanded] = useState<string | null>(jobs[0].id)

  return (
    <section id="experience" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl font-bold text-slate-100 mb-2">Experience</h2>
          <div className="w-12 h-1 bg-cyan-500 mb-12" />
        </motion.div>
        <div className="space-y-4">
          {jobs.map((job, i) => (
            <motion.div
              id={job.id}
              key={job.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`border rounded-xl overflow-hidden transition-colors ${expanded === job.id ? 'border-cyan-500/40 bg-slate-900' : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'}`}
            >
              <button
                className="w-full text-left p-6"
                onClick={() => setExpanded(expanded === job.id ? null : job.id)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-cyan-400 text-sm font-medium mb-1">{job.company}</p>
                    <h3 className="text-slate-100 font-semibold text-lg">{job.title}</h3>
                    <p className="text-slate-500 text-sm mt-1">{job.period} · {job.location}</p>
                  </div>
                  <svg className={`w-5 h-5 text-slate-500 mt-1 flex-shrink-0 transition-transform ${expanded === job.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {job.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 text-xs bg-slate-800 text-slate-400 rounded-md">{tag}</span>
                  ))}
                </div>
              </button>
              {expanded === job.id && (
                <div className="px-6 pb-6 border-t border-slate-800">
                  <ul className="mt-4 space-y-2">
                    {job.highlights.map((h, j) => (
                      <li key={j} className="flex gap-3 text-slate-400 text-sm leading-relaxed">
                        <span className="text-cyan-500 mt-1 flex-shrink-0">▸</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] Write `frontend/src/components/Timeline.test.tsx`:
```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import Timeline from './Timeline'

test('renders all job companies', () => {
  render(<Timeline />)
  expect(screen.getByText('Amazon Web Services')).toBeInTheDocument()
  expect(screen.getByText('Northrop Grumman')).toBeInTheDocument()
  expect(screen.getByText('LightningFlashcards.com')).toBeInTheDocument()
  expect(screen.getByText('InfoSys')).toBeInTheDocument()
})

test('first job is expanded by default', () => {
  render(<Timeline />)
  expect(screen.getByText(/Claude Code.*LISA/)).toBeInTheDocument()
})

test('clicking a job toggles expansion', () => {
  render(<Timeline />)
  const northropBtn = screen.getByText('Northrop Grumman').closest('button')!
  fireEvent.click(northropBtn)
  expect(screen.getByText(/Tech Lead/)).toBeInTheDocument()
})

test('each job has an id anchor', () => {
  render(<Timeline />)
  expect(document.getElementById('aws')).not.toBeNull()
  expect(document.getElementById('northrop')).not.toBeNull()
})
```

- [ ] Run: `cd frontend && npm run test` — pass
- [ ] Commit: `feat: Timeline component with expandable cards and anchor targets`

---

### Task 20: Skills + ProjectCards + Footer

**Files:** `frontend/src/components/Skills.tsx`, `frontend/src/components/ProjectCards.tsx`, `frontend/src/components/Footer.tsx`

- [ ] Write `frontend/src/components/Skills.tsx`:
```tsx
import { motion } from 'framer-motion'
import { skillGroups } from '../data/experience'

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6 bg-slate-900/30">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl font-bold text-slate-100 mb-2">Skills</h2>
          <div className="w-12 h-1 bg-cyan-500 mb-12" />
          <div className="grid md:grid-cols-2 gap-8">
            {skillGroups.map(group => (
              <div key={group.label}>
                <h3 className="text-slate-300 font-medium text-sm uppercase tracking-widest mb-3">{group.label}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg hover:border-cyan-500/50 hover:text-cyan-400 transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] Write `frontend/src/components/ProjectCards.tsx`:
```tsx
import { motion } from 'framer-motion'
import { projects } from '../data/experience'

export default function ProjectCards() {
  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl font-bold text-slate-100 mb-2">Projects</h2>
          <div className="w-12 h-1 bg-cyan-500 mb-12" />
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-cyan-500/40 transition-colors group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-slate-100 font-semibold group-hover:text-cyan-400 transition-colors">{project.name}</h3>
                  {project.url && (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-cyan-400 transition-colors ml-2 flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 text-xs bg-slate-800 text-slate-500 rounded">{tag}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] Write `frontend/src/components/Footer.tsx`:
```tsx
export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-slate-800">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-slate-500 text-sm">© 2026 Ernest Gray. Built with React + FastAPI + Claude.</p>
        <div className="flex items-center gap-6">
          <a href="mailto:Egray4cs@gmail.com" className="text-slate-500 hover:text-cyan-400 text-sm transition-colors">Email</a>
          <a href="https://github.com/Ernest-Gray" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-cyan-400 text-sm transition-colors">GitHub</a>
          <a href="https://www.linkedin.com/in/ernest-gray-a877a9100/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-cyan-400 text-sm transition-colors">LinkedIn</a>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] Commit: `feat: Skills, ProjectCards, Footer components`

---

### Task 21: useChat hook

**Files:** `frontend/src/hooks/useChat.ts`, `frontend/src/hooks/useChat.test.ts`

- [ ] Write `frontend/src/hooks/useChat.ts`:
```typescript
import { useState, useCallback } from 'react'

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async (userMessage: string) => {
    const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
    setError(null)
    const userMsg: Message = { role: 'user', content: userMessage }
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    const assistantMsg: Message = { role: 'assistant', content: '' }
    setMessages(prev => [...prev, assistantMsg])

    try {
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
        }),
      })

      if (!response.ok) {
        throw new Error(response.status === 429 ? 'Rate limit reached. Try again in a minute.' : 'Failed to connect to API.')
      }

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)
          if (data === '[DONE]') break
          try {
            const { text } = JSON.parse(data)
            setMessages(prev => {
              const updated = [...prev]
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                content: updated[updated.length - 1].content + text,
              }
              return updated
            })
          } catch {}
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }, [messages])

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return { messages, isLoading, error, sendMessage, clearMessages }
}
```

- [ ] Write `frontend/src/hooks/useChat.test.ts`:
```typescript
import { renderHook, act } from '@testing-library/react'
import { useChat } from './useChat'

global.fetch = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
})

test('starts with empty messages', () => {
  const { result } = renderHook(() => useChat())
  expect(result.current.messages).toHaveLength(0)
  expect(result.current.isLoading).toBe(false)
})

test('adds user message immediately on send', async () => {
  const mockReader = { read: vi.fn().mockResolvedValue({ done: true }), releaseLock: vi.fn() }
  const mockBody = { getReader: () => mockReader }
  ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: true, body: mockBody })

  const { result } = renderHook(() => useChat())
  await act(async () => {
    await result.current.sendMessage('hello')
  })
  expect(result.current.messages[0]).toEqual({ role: 'user', content: 'hello' })
})

test('sets error on 429 response', async () => {
  ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({ ok: false, status: 429 })

  const { result } = renderHook(() => useChat())
  await act(async () => {
    await result.current.sendMessage('hello')
  })
  expect(result.current.error).toMatch(/Rate limit/)
})

test('clearMessages resets state', async () => {
  const { result } = renderHook(() => useChat())
  await act(async () => { result.current.clearMessages() })
  expect(result.current.messages).toHaveLength(0)
  expect(result.current.error).toBeNull()
})
```

- [ ] Run: `cd frontend && npm run test` — pass
- [ ] Commit: `feat: useChat hook with SSE streaming and tests`

---

### Task 22: ChatWidget component

**Files:** `frontend/src/components/ChatWidget.tsx`

- [ ] Write `frontend/src/components/ChatWidget.tsx`:
```tsx
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useChat } from '../hooks/useChat'

const SUGGESTED = [
  'What did you build at AWS?',
  "Tell me about your ML work at Northrop",
  "What's your experience with RAG?",
]

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const { messages, isLoading, error, sendMessage } = useChat()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const msg = input.trim()
    if (!msg || isLoading) return
    setInput('')
    await sendMessage(msg)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
    if (e.key === 'Escape') setOpen(false)
  }

  return (
    <>
      {/* Toggle button */}
      <button
        data-testid="chat-toggle"
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-medium text-sm rounded-full shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
      >
        <span className="text-base">{open ? '✕' : '✦'}</span>
        {!open && <span>Ask about Ernest</span>}
      </button>

      {/* Desktop floating panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-6 z-40 w-[380px] max-h-[560px] hidden md:flex flex-col bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
          >
            <ChatPanel messages={messages} isLoading={isLoading} error={error} input={input}
              setInput={setInput} handleSend={handleSend} handleKey={handleKey} bottomRef={bottomRef} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden flex flex-col bg-slate-950"
          >
            <ChatPanel messages={messages} isLoading={isLoading} error={error} input={input}
              setInput={setInput} handleSend={handleSend} handleKey={handleKey} bottomRef={bottomRef} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

interface ChatPanelProps {
  messages: ReturnType<typeof useChat>['messages']
  isLoading: boolean
  error: string | null
  input: string
  setInput: (v: string) => void
  handleSend: () => void
  handleKey: (e: React.KeyboardEvent) => void
  bottomRef: React.RefObject<HTMLDivElement>
}

function ChatPanel({ messages, isLoading, error, input, setInput, handleSend, handleKey, bottomRef }: ChatPanelProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-slate-800">
        <p className="text-slate-100 font-medium text-sm">Ask about Ernest</p>
        <p className="text-slate-500 text-xs">Answers grounded in real work history</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {messages.length === 0 && (
          <div className="space-y-2">
            <p className="text-slate-500 text-xs text-center mb-4">Try asking:</p>
            {SUGGESTED.map(s => (
              <button key={s} onClick={() => handleSend()} className="w-full text-left px-3 py-2 text-sm text-slate-400 bg-slate-800 rounded-lg hover:bg-slate-700 hover:text-slate-200 transition-colors">
                {s}
              </button>
            ))}
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-cyan-500 text-slate-950 rounded-br-sm'
                : 'bg-slate-800 text-slate-200 rounded-bl-sm'
            }`}>
              {msg.content || (isLoading && i === messages.length - 1 ? <span className="animate-pulse">▋</span> : '')}
            </div>
          </div>
        ))}
        {error && <p className="text-red-400 text-xs text-center">{error}</p>}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-slate-800">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask a question..."
            disabled={isLoading}
            className="flex-1 bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-3 py-2 bg-cyan-500 text-slate-950 rounded-lg hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            {isLoading ? '…' : '↑'}
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] Commit: `feat: ChatWidget component — floating panel + mobile modal`

---

### Task 23: App.tsx assembly

**Files:** `frontend/src/App.tsx`, `frontend/index.html`

- [ ] Write `frontend/src/App.tsx`:
```tsx
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Timeline from './components/Timeline'
import Skills from './components/Skills'
import ProjectCards from './components/ProjectCards'
import Footer from './components/Footer'
import ChatWidget from './components/ChatWidget'

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Timeline />
        <Skills />
        <ProjectCards />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  )
}
```

- [ ] Update `frontend/index.html` title to `Ernest Gray — Software Development Engineer`
- [ ] Write `frontend/.env.local` (gitignored): `VITE_API_URL=http://localhost:8000`
- [ ] Run: `cd frontend && npm run build` — should succeed with no errors
- [ ] Run: `cd frontend && npm run lint` — should pass
- [ ] Run: `cd frontend && npm run test` — all pass
- [ ] Commit: `feat: App.tsx assembly — full page composed`

---

### Task 24: Fix suggested prompts in ChatWidget

In Task 22 the suggested prompts call `handleSend()` without setting input first. Fix this.

- [ ] In `ChatWidget.tsx` replace suggested prompt buttons to use a local `sendSuggested` helper:
```tsx
// replace the SUGGESTED.map block with:
{SUGGESTED.map(s => (
  <button
    key={s}
    onClick={async () => {
      setInput('')
      await sendMessage(s)
    }}
    className="w-full text-left px-3 py-2 text-sm text-slate-400 bg-slate-800 rounded-lg hover:bg-slate-700 hover:text-slate-200 transition-colors"
  >
    {s}
  </button>
))}
```
- [ ] Run: `cd frontend && npm run lint && npm run test` — pass
- [ ] Commit: `fix: suggested prompts now call sendMessage directly`

---

### Task 25: Playwright E2E tests (full suite)

**Files:** `frontend/e2e/portfolio.spec.ts` (expand)

- [ ] Replace `frontend/e2e/portfolio.spec.ts` with full suite:
```typescript
import { test, expect } from '@playwright/test'

test.describe('Portfolio smoke', () => {
  test('homepage loads with correct title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Ernest Gray/)
  })

  test('hero section visible with name', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('Ernest Gray')
  })

  test('experience section has all job anchor targets', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#aws')).toBeVisible()
    await expect(page.locator('#northrop')).toBeVisible()
    await expect(page.locator('#lightning')).toBeVisible()
    await expect(page.locator('#infosys')).toBeVisible()
  })

  test('navbar experience dropdown shows jobs', async ({ page }) => {
    await page.goto('/')
    await page.click('[data-testid="nav-experience-btn"]')
    const dropdown = page.locator('[data-testid="nav-dropdown"]')
    await expect(dropdown).toBeVisible()
    await expect(dropdown).toContainText('Amazon Web Services')
    await expect(dropdown).toContainText('Northrop Grumman')
  })

  test('dropdown nav scrolls to section', async ({ page }) => {
    await page.goto('/')
    await page.click('[data-testid="nav-experience-btn"]')
    await page.click('[data-testid="nav-dropdown"] >> text=Northrop Grumman')
    await page.waitForTimeout(600)
    const northrop = page.locator('#northrop')
    await expect(northrop).toBeInViewport()
  })

  test('chat widget toggle opens panel', async ({ page }) => {
    await page.goto('/')
    const toggle = page.locator('[data-testid="chat-toggle"]')
    await expect(toggle).toBeVisible()
    await toggle.click()
    await expect(page.locator('text=Ask about Ernest').first()).toBeVisible()
  })

  test('chat input is present when widget open', async ({ page }) => {
    await page.goto('/')
    await page.click('[data-testid="chat-toggle"]')
    await expect(page.locator('input[placeholder="Ask a question..."]')).toBeVisible()
  })

  test('skills section renders groups', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=Languages')).toBeVisible()
    await expect(page.locator('text=AWS')).toBeVisible()
    await expect(page.locator('text=GenAI / RAG')).toBeVisible()
  })

  test('projects section has LISA card', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=LISA')).toBeVisible()
  })
})
```
- [ ] Run: `cd frontend && npx playwright test` — all pass
- [ ] Commit: `test: full Playwright E2E suite`

---

### Task 26: Deployment config

**Files:** `frontend/public/_redirects`, `frontend/.cloudflare/` (if needed)

- [ ] Write `frontend/public/_redirects`:
```
/* /index.html 200
```
(Required for Cloudflare Pages SPA routing)

- [ ] Verify `backend/Dockerfile` is correct (from Task 4)
- [ ] Write `backend/.env.example`:
```
DATABASE_URL=postgresql+asyncpg://user:password@host:5432/portfolio
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
ALLOWED_ORIGINS=http://localhost:5173,https://your-site.pages.dev
```
- [ ] Commit: `chore: deployment config for Cloudflare Pages and Railway`

---

### Task 27: Learning doc — Phase 1

**Files:** `docs/learning/01-project-setup-and-architecture.md`

- [ ] Write learning doc covering: monorepo structure rationale, why FastAPI for SSE, why pgvector over standalone vector DBs, Cloudflare Pages vs Vercel tradeoffs, uv as Python package manager
- [ ] Commit: `docs: learning doc 01 — project setup and architecture`

---

### Task 28: Final quality gate pass

- [ ] `cd backend && uv run ruff check . && uv run ruff format --check . && uv run pytest -v`
- [ ] `cd frontend && npm run lint && npm run test && npx playwright test`
- [ ] All pass — commit any final fixes

