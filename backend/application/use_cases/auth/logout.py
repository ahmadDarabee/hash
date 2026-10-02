"""Revoke the presented refresh token."""

from application.ports.repositories import RefreshTokenRepository
from core.security import hash_token


class Logout:
    def __init__(self, refresh_tokens: RefreshTokenRepository) -> None:
        self._refresh_tokens = refresh_tokens

    async def execute(self, refresh_token: str) -> None:
        await self._refresh_tokens.revoke(hash_token(refresh_token))
