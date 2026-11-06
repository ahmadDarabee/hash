"""User repository (raw SQL).

Users live in `acl_user`; roles are ACL groups linked via `acl_user_group`
(group names match the `Role` enum: 'admin', 'customer_b2b', 'customer_b2c').
The legacy `customer_type` field is derived from the role.
"""

import asyncpg

from domain.entities import User
from domain.enums import CustomerType, Language, Role
from infrastructure.repositories.base import BaseRepository

# Role resolution: pick the single most-privileged role group for a user.
_ROLE_SUBQUERY = """
    COALESCE(
        (SELECT g.name
           FROM acl_user_group ug
           JOIN acl_group g ON g.name = ug.group_name
          WHERE ug.user_id = u.id
          ORDER BY CASE g.name
                       WHEN 'admin' THEN 0
                       WHEN 'customer_b2b' THEN 1
                       ELSE 2
                   END
          LIMIT 1),
        'customer_b2c'
    ) AS role
"""

_COLUMNS = (
    "u.id, u.email, u.password AS password_hash, "
    f"{_ROLE_SUBQUERY}, "
    "u.company_name, u.preferred_language, u.is_active, u.created_at"
)
_FROM = "FROM acl_user u"


def _customer_type_for_role(role: Role) -> CustomerType:
    if role is Role.CUSTOMER_B2B:
        return CustomerType.B2B
    if role is Role.ADMIN:
        return CustomerType.B2B
    return CustomerType.B2C


def _role_from_name(name: str | None) -> Role:
    for role in Role:
        if role.value == name:
            return role
    return Role.CUSTOMER_B2C


def _user_from_row(row: asyncpg.Record) -> User:
    role = _role_from_name(row["role"])
    return User(
        id=row["id"],
        email=row["email"],
        password_hash=row["password_hash"],
        role=role,
        customer_type=_customer_type_for_role(role),
        company_name=row["company_name"],
        preferred_language=Language(row["preferred_language"]),
        is_active=row["is_active"],
        created_at=row["created_at"],
    )


class UserRepository(BaseRepository):
    async def get_by_id(self, user_id: int) -> User | None:
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
        async with self._pool.acquire() as conn:
            async with conn.transaction():
                row = await conn.fetchrow(
                    """
                    INSERT INTO acl_user (email, password, company_name, preferred_language)
                    VALUES ($1, $2, $3, $4)
                    RETURNING id, email, password AS password_hash, company_name,
                              preferred_language, is_active, created_at
                    """,
                    email,
                    password_hash,
                    company_name,
                    preferred_language.value,
                )
                await conn.execute(
                    "INSERT INTO acl_user_group (user_id, group_name) VALUES ($1, $2)",
                    row["id"],
                    role.value,
                )
        return User(
            id=row["id"],
            email=row["email"],
            password_hash=row["password_hash"],
            role=role,
            customer_type=customer_type,
            company_name=row["company_name"],
            preferred_language=preferred_language,
            is_active=row["is_active"],
            created_at=row["created_at"],
        )

    async def list(self, page: int, page_size: int) -> tuple[list[User], int]:
        offset = (page - 1) * page_size
        rows = await self._pool.fetch(
            f"SELECT {_COLUMNS} {_FROM} WHERE u.deleted_at IS NULL "
            "ORDER BY u.created_at DESC LIMIT $1 OFFSET $2",
            page_size,
            offset,
        )
        total = await self._pool.fetchval(
            "SELECT COUNT(*) FROM acl_user WHERE deleted_at IS NULL"
        )
        return [_user_from_row(r) for r in rows], int(total)
