"""Exception handlers mapping domain errors to the standard error envelope."""

import asyncpg
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from core.logging import get_logger
from domain.errors import DomainError

logger = get_logger("api.errors")

_STATUS_BY_CODE: dict[str, int] = {
    "not_found": 404,
    "conflict": 409,
    "validation_error": 422,
    "authentication_error": 401,
    "authorization_error": 403,
    "missing_token": 401,
    "token_expired": 401,
    "token_invalid": 401,
}


def _error_response(
    code: str,
    message: str,
    details: object | None = None,
    status: int | None = None,
) -> JSONResponse:
    return JSONResponse(
        status_code=status or _STATUS_BY_CODE.get(code, 400),
        content={"error": {"code": code, "message": message, "details": details}},
    )


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(DomainError)
    async def domain_error_handler(request: Request, exc: DomainError) -> JSONResponse:
        return _error_response(exc.code, exc.message)

    @app.exception_handler(RequestValidationError)
    async def validation_error_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
        return _error_response("validation_error", "Request validation failed", exc.errors())

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
        return _error_response("http_error", str(exc.detail), status=exc.status_code)

    @app.exception_handler(asyncpg.exceptions.UniqueViolationError)
    async def unique_violation_handler(
        request: Request, exc: asyncpg.exceptions.UniqueViolationError
    ) -> JSONResponse:
        return _error_response("conflict", "A record with this value already exists")

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        logger.exception("Unhandled error", exc_info=exc)
        return _error_response("internal_error", "Internal server error", status=500)
