from unittest.mock import AsyncMock, MagicMock

import pytest


@pytest.mark.asyncio
async def test_retrieve_returns_chunks():
    mock_db = AsyncMock()
    mock_row1 = MagicMock(content="Ernest worked at AWS", source="aws-work", similarity=0.92)
    mock_row2 = MagicMock(
        content="Ernest led team at Northrop", source="northrop-work", similarity=0.85
    )
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
