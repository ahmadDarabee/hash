"""Hash API entrypoint.

Run from the backend/ directory:
    uvicorn main:app --reload
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.errors import register_exception_handlers
from api.routers import admin, auth, categories, pricing, products
from core.config import get_settings
from core.logging import setup_logging
from infrastructure.db import close_pool, create_pool

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging()
    pool = await create_pool()
    app.state.pool = pool
    yield
    await close_pool(pool)


app = FastAPI(title="Hash API", version="0.1.0", lifespan=lifespan)
register_exception_handlers(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for router in (
    auth.router,
    products.router,
    categories.router,
    pricing.router,
    admin.router,
):
    app.include_router(router, prefix="/api/v1")


@app.get("/health", tags=["health"])
async def health() -> dict[str, str]:
    return {"status": "ok"}
