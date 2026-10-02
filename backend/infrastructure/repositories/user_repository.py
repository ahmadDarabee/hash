"""User repository (raw SQL)."""

import uuid

import asyncpg

from domain.entities import User
from domain.enums import CustomerType, Language, Role
from infrastructure.repositories.base import BaseRepository

_COLUMNS = (
    "u.id, u.email, u.password_hash, r.name AS role, u.customer_type, "
    "u.company_name, u.preferred_language, u.is_active, u.created_at"
)
_FROM = "FROM users u JOIN roles r ON r.id = u.role_id"


def _user_from_row(row: asyncpg.Record) -> User:
    return User(
        id=row["id"],
        email=row["email"],
        password_hash=row["password_hash"],
        role=Role(row["role"]),
        customer_type=CustomerType(row["customer_type"]),
        company_name=row["company_name"],
        preferred_language=Language(row["preferred_language"]),
        is_active=row["is_active"],
        created_at=row["created_at"],
    )


class UserRepository(BaseRepository):
    async def get_by_id(self, user_id: uuid.UUID) -> User | None:
        row = await self._pool.fetchrow(
            f"SELECT {_COLUMNS} {_FROM} WHERE u.id = $1 AND u.deleted_at IS NULL",
            user_id,
        )
        return _user_from_row(row) if row else None

    async def get_by_email(self, email: str) -> User | None:
        row = await self._pool.fetchrow(
            f"SELECT {_COLUMNS} {_FROM} WHERE lower(u.email) = $1 AND u.deleted_at IS NULL",
            email.lower(),
        )
        return _user_from_row(row) if row else None

    async def create(
        self,
        *,
        email: str,
        password_hash: str,
        role: Role,
        customer_type: CustomerType,
        company_name: str | None,
        preferred_language: Language,
    ) -> User:
        row = await self._pool.fetchrow(
            f"""
            WITH inserted AS (
                INSERT INTO users (email, password_hash, role_id, customer_type, company_name, preferred_language)
                VALUES ($1, $2, (SELECT id FROM roles WHERE name = $3), $4, $5, $6)
                RETURNING *
            )
            SELECT i.id, i.email, i.password_hash, r.name AS role, i.customer_type,
                   i.company_name, i.preferred_language, i.is_active, i.created_at
            FROM inserted i JOIN roles r ON r.id = i.role_id
            """,
            email,
            password_hash,
            role.value,
            customer_type.value,
            company_name,
            preferred_language.value,
        )
        return _user_from_row(row)

    async def list(self, page: int, page_size: int) -> tuple[list[User], int]:
        offset = (page - 1) * page_size
        rows = await self._pool.fetch(
            f"SELECT {_COLUMNS} {_FROM} WHERE u.deleted_at IS NULL "
            "ORDER BY u.created_at DESC LIMIT $1 OFFSET $2",
            page_size,
            offset,
        )
        total = await self._pool.fetchval("SELECT COUNT(*) FROM users WHERE deleted_at IS NULL")
        return [_user_from_row(r) for r in rows], int(total)
