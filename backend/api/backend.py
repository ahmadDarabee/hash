from contextlib import asynccontextmanager
import os

import asyncpg
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routers import products
from api.dependencies.logger import logger

DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql://hash:hash123@localhost:5432/hash"
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing database connection pool...")
    try:
        app.state.db_pool = await asyncpg.create_pool(DATABASE_URL)
        logger.info("Database connected.")
    except Exception as e:
        logger.error(f"Error occurred while connecting to database: {e}")

    yield

    if hasattr(app.state, "db_pool"):
        app.state.db_pool.close()


app = FastAPI(
    title="API",
    description="API for the application",
    version="0.1.0",
    logger=logger,
    lifespan=lifespan,
)

# Configure allowed origins (Vite default dev port)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows GET, POST, PUT, DELETE, OPTIONS, etc.
    allow_headers=[
        "*"
    ],  # Allows all request headers (Content-Type, Authorization, etc.)
)

app_routes = [
    ("/api", products.router),
]
for prefix, router in app_routes:
    app.include_router(router, prefix=prefix)
