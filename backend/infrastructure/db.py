"""asyncpg connection pool lifecycle."""

import asyncpg

from core.config import get_settings


async def create_pool() -> asyncpg.Pool:
    settings = get_settings()
    return await asyncpg.create_pool(
        settings.database_url,
        min_size=1,
        max_size=10,
        command_timeout=60,
    )


async def close_pool(pool: asyncpg.Pool) -> None:
    if pool is not None:
        await pool.close()
