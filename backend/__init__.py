from fastapi import FastAPI, routing
from backend.hash.backend.routers import auth

from contextlib import asynccontextmanager
import logging

logger = logging.getLogger(__name__)

from backend.hash.backend.config import CustomFormatter, get_setting

setting = get_setting()


@asynccontextmanager
def lifespan():
    """
    How the application will start and how it's end
    """
    # TODO:connect to the database and end connection
    yield
    # TODO: close database connection


app = FastAPI(
    description="api for my store",
    title="hash",
    version="1.0.0",
    # lifespan=lifespan,
)

routers = {"api/auth": auth}


for prefix, module in routers.items():
    router = getattr(module)
    print(router)
    app.include_router(router, prefix=prefix)
