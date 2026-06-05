from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.chat import router as chat_router
from app.config import settings
from app.middleware.rate_limit import rate_limit_middleware

app = FastAPI(title="Ernest Gray Portfolio API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

app.middleware("http")(rate_limit_middleware)

app.include_router(chat_router)
