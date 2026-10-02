"""Register a new customer (B2C or B2B)."""

from application.ports.repositories import RefreshTokenRepository, UserRepository
from application.use_cases.auth.common import TokenPair, issue_token_pair
from core.security import hash_password
from domain.entities import User
from domain.enums import CustomerType, Language, Role
from domain.errors import ConflictError, ValidationError


class Register:
    def __init__(self, users: UserRepository, refresh_tokens: RefreshTokenRepository) -> None:
        self._users = users
        self._refresh_tokens = refresh_tokens

    async def execute(
        self,
        *,
        email: str,
        password: str,
        customer_type: CustomerType,
        preferred_language: Language,
        company_name: str | None = None,
    ) -> tuple[User, TokenPair]:
        email = email.strip().lower()
        if len(password) < 8:
            raise ValidationError("Password must be at least 8 characters")

        if customer_type is CustomerType.B2B and not company_name:
            raise ValidationError("Company name is required for B2B accounts")

        if await self._users.get_by_email(email) is not None:
            raise ConflictError("An account with this email already exists")

        role = Role.CUSTOMER_B2B if customer_type is CustomerType.B2B else Role.CUSTOMER_B2C
        user = await self._users.create(
            email=email,
            password_hash=hash_password(password),
            role=role,
            customer_type=customer_type,
            company_name=company_name,
            preferred_language=preferred_language,
        )
        tokens = await issue_token_pair(user, self._refresh_tokens)
        return user, tokens
