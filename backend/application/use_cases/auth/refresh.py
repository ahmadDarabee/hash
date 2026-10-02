"""Rotate a refresh token and issue a new token pair."""

from application.ports.repositories import RefreshTokenRepository, UserRepository
from application.use_cases.auth.common import TokenPair, issue_token_pair
from core.security import hash_token
from domain.entities import User
from domain.errors import AuthenticationError


class Refresh:
    def __init__(self, users: UserRepository, refresh_tokens: RefreshTokenRepository) -> None:
        self._users = users
        self._refresh_tokens = refresh_tokens

    async def execute(self, refresh_token: str) -> tuple[User, TokenPair]:
        token_hash = hash_token(refresh_token)
        user_id = await self._refresh_tokens.get_valid_user_id(token_hash)
        if user_id is None:
            raise AuthenticationError("Invalid or expired refresh token", "token_invalid")

        user = await self._users.get_by_id(user_id)
        if user is None or not user.is_active:
            raise AuthenticationError("Invalid or expired refresh token", "token_invalid")

        await self._refresh_tokens.revoke(token_hash)
        tokens = await issue_token_pair(user, self._refresh_tokens)
        return user, tokens
