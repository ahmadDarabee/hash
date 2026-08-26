import pydantic 
import typing

import asyncpg  

import logging

from backend.hash.backend.config import get_settings

logger=logging.getLogger(__name__)

# A callback when a new connection occurs 
async def init_connection(conn):
    
    logger.debug("initializing connection")
    await conn.set_type_codec()
    await conn.set_type_codec()


async def create_pool():
    """
    Initialize the DB connection
    """
    settings = get_settings()
    max_conn = settings.maxConn
    min_conn = settings.minConn
    database = settings.dbname
    password = settings.dbpassword
    host = settings.dbhost
    port = settings.dbport
    user = settings.dbuser
   
    dsn = settings.dbdsn or f"postgres://{user}:{password}@{host}:{port}/{database}"

    app_name = settings.application_name
    pool = await asyncpg.create_pool(
        dsn=dsn,
        max_size=max_conn,
        min_size=min_conn,
        server_settings={
            "app_name":app_name
        },
        init=init_connection
    )
    return pool
    