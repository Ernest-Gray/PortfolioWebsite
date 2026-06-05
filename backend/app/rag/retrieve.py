from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession


async def retrieve_chunks(db: AsyncSession, embedding: list[float], top_k: int = 5) -> list[dict]:
    vector_str = "[" + ",".join(str(x) for x in embedding) + "]"
    result = await db.execute(
        text(f"""
            SELECT content, source, 1 - (embedding <=> '{vector_str}'::vector) AS similarity
            FROM chunks
            ORDER BY embedding <=> '{vector_str}'::vector
            LIMIT :top_k
        """),
        {"top_k": top_k},
    )
    return [
        {"content": row.content, "source": row.source, "similarity": row.similarity}
        for row in result.fetchall()
    ]
