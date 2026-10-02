"""Authenticate a user and issue tokens."""

from application.ports.repositories import RefreshTokenRepository, UserRepository
from application.use_cases.auth.common import TokenPair, issue_token_pair
from core.security import verify_password
from domain.entities import User
from domain.errors import AuthenticationError


class Login:
    def __init__(self, users: UserRepository, refresh_tokens: RefreshTokenRepository) -> None:
        self._users = users
        self._refresh_tokens = refresh_tokens

    async def execute(self, email: str, password: str) -> tuple[User, TokenPair]:
        user = await self._users.get_by_email(email.strip().lower())
        if user is None or not verify_password(password, user.password_hash):
            raise AuthenticationError("Invalid email or password")

        if not user.is_active:
            raise AuthenticationError("This account is disabled")

        tokens = await issue_token_pair(user, self._refresh_tokens)
        return user, tokens
