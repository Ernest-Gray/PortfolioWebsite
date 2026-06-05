import time
from unittest.mock import AsyncMock, MagicMock

import pytest

from app.middleware.rate_limit import RATE_LIMIT, _buckets, rate_limit_middleware


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
    _buckets["1.2.3.6"] = (time.time() - 61, RATE_LIMIT)
    result = await rate_limit_middleware(request, call_next)
    assert result == "response"


@pytest.mark.asyncio
async def test_non_chat_path_not_rate_limited():
    request = MagicMock()
    request.url.path = "/health"
    request.client.host = "1.2.3.7"
    call_next = AsyncMock(return_value="response")
    _buckets["1.2.3.7"] = (time.time(), RATE_LIMIT)
    result = await rate_limit_middleware(request, call_next)
    assert result == "response"
