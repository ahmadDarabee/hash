"""Shared auth helpers for token issuance."""

from dataclasses import dataclass

from application.ports.repositories import RefreshTokenRepository
from core.security import create_access_token, generate_refresh_token
from domain.entities import User


@dataclass(frozen=True, slots=True)
class TokenPair:
    access_token: str
    refresh_token: str


async def issue_token_pair(user: User, refresh_tokens: RefreshTokenRepository) -> TokenPair:
    access_token = create_access_token(user.id, user.role.value)
    raw, token_hash, expires_at = generate_refresh_token()
    await refresh_tokens.store(user.id, token_hash, expires_at)
    return TokenPair(access_token=access_token, refresh_token=raw)
