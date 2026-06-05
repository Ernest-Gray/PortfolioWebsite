import os

from openai import AsyncOpenAI

_client: AsyncOpenAI | None = None


def _get_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        _client = AsyncOpenAI(api_key=os.environ["OPENAI_API_KEY"])
    return _client


async def embed_text(text: str) -> list[float]:
    response = await _get_client().embeddings.create(
        model="text-embedding-3-small",
        input=text.replace("\n", " "),
    )
    return response.data[0].embedding
