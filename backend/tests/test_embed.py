from unittest.mock import AsyncMock, MagicMock, patch

import pytest


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
