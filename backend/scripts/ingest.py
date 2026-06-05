"""Chunk, embed, and upsert all knowledge-base/*.md files into pgvector.

Run: uv run python scripts/ingest.py
Requires DATABASE_URL, OPENAI_API_KEY in backend/.env
"""

import asyncio
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import text
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from app.rag.embed import embed_text

_db_url = os.environ["DATABASE_URL"]

CHUNK_SIZE = 1500
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
    engine = create_async_engine(_db_url)
    Session = async_sessionmaker(engine, expire_on_commit=False)

    md_files = sorted(KB_DIR.glob("*.md"))
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
                    text(
                        "INSERT INTO chunks (content, source, embedding) "
                        "VALUES (:c, :s, :e::vector)"
                    ),
                    {"c": chunk["content"], "s": chunk["source"], "e": vec_str},
                )
            await db.commit()
        total += len(chunks)

    print(f"\nIngested {total} chunks from {len(md_files)} files")
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(ingest())
