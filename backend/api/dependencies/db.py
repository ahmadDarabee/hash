import asyncpg
from fastapi import Request

async def get_db_connection(request: Request) -> asyncpg.Connection:
    """
    Dependency that acquires a connection from the global pool 
    and returns it to the route.
    """
    # We define the type here ONCE
    pool: asyncpg.Pool = request.app.state.db_pool
    
    # Acquire a connection for this specific request
    async with pool.acquire() as connection, connection.transaction():
        yield connection  # Hands the connection to your route
    