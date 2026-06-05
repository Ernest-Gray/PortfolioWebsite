import json
from collections.abc import AsyncGenerator

from anthropic import AsyncAnthropic
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.rag.embed import embed_text
from app.rag.prompt import build_messages
from app.rag.retrieve import retrieve_chunks

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    history: list[dict] = []


async def _stream_response(
    message: str, history: list[dict], db: AsyncSession
) -> AsyncGenerator[str, None]:
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
