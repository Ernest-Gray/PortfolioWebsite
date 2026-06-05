import time
from collections import defaultdict

from fastapi import HTTPException, Request

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
