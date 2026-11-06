"""Refresh token repository (raw SQL)."""

import datetime as dt

from infrastructure.repositories.base import BaseRepository


class RefreshTokenRepository(BaseRepository):
    async def store(self, user_id: int, token_hash: str, expires_at: dt.datetime) -> None:
        await self._pool.execute(
            "INSERT INTO refresh_token (user_id, token_hash, expires_at) VALUES ($1, $2, $3)",
            user_id,
            token_hash,
            expires_at,
        )

    async def get_valid_user_id(self, token_hash: str) -> int | None:
        user_id = await self._pool.fetchval(
            "SELECT user_id FROM refresh_token "
            "WHERE token_hash = $1 AND revoked_at IS NULL AND expires_at > NOW()",
            token_hash,
        )
        return user_id

    async def revoke(self, token_hash: str) -> None:
        await self._pool.execute(
            "UPDATE refresh_token SET revoked_at = NOW() WHERE token_hash = $1",
            token_hash,
        )
