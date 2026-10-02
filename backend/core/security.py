"""Security primitives: password hashing and JWT/refresh tokens.

DECISION: argon2id (argon2-cffi) for passwords — memory-hard and the current
OWASP recommendation for new projects; consistent everywhere.
DECISION: access token is a short-lived JWT; refresh token is an opaque random
string stored only as a SHA-256 hash in the DB, rotated on every refresh.
"""

import datetime as dt
import hashlib
import secrets
import uuid

import argon2
import jwt

from core.config import get_settings
from domain.errors import AuthenticationError

_password_hasher = argon2.PasswordHasher()


def hash_password(password: str) -> str:
    return _password_hasher.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return _password_hasher.verify(password_hash, password)
    except argon2.exceptions.VerifyMismatchError:
        return False
    except argon2.exceptions.InvalidHashError:
        return False


def _now_utc() -> dt.datetime:
    return dt.datetime.now(dt.timezone.utc)


def create_access_token(user_id: uuid.UUID, role: str) -> str:
    settings = get_settings()
    now = _now_utc()
    payload = {
        "sub": str(user_id),
        "role": role,
        "iat": now,
        "exp": now + dt.timedelta(minutes=settings.access_token_minutes),
        "jti": secrets.token_urlsafe(8),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> dict:
    settings = get_settings()
    try:
        return jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except jwt.ExpiredSignatureError as exc:
        raise AuthenticationError("Access token expired", "token_expired") from exc
    except jwt.InvalidTokenError as exc:
        raise AuthenticationError("Invalid access token", "token_invalid") from exc


def generate_refresh_token() -> tuple[str, str, dt.datetime]:
    """Return (raw_token, token_hash, expires_at)."""
    settings = get_settings()
    raw = secrets.token_urlsafe(48)
    token_hash = hash_token(raw)
    expires_at = _now_utc() + dt.timedelta(days=settings.refresh_token_days)
    return raw, token_hash, expires_at


def hash_token(raw: str) -> str:
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()
