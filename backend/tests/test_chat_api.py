from unittest.mock import patch

import pytest
from httpx import ASGITransport, AsyncClient


async def mock_stream_gen():
    yield 'data: {"text": "Hello"}\n\n'
    yield 'data: {"text": " Ernest"}\n\n'
    yield "data: [DONE]\n\n"


@pytest.mark.asyncio
async def test_health_returns_ok():
    from app.main import app

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_chat_streams_response():
    from app.main import app

    with patch("app.api.chat._stream_response", return_value=mock_stream_gen()):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            async with client.stream("POST", "/chat", json={"message": "hi"}) as response:
                assert response.status_code == 200
                chunks = [chunk async for chunk in response.aiter_text()]
    full = "".join(chunks)
    assert "Hello" in full
    assert "[DONE]" in full


@pytest.mark.asyncio
async def test_chat_requires_message_field():
    from app.main import app

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post("/chat", json={})
    assert response.status_code == 422
