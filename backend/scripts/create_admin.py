"""Bootstrap the first admin user.

Usage (from the backend/ directory, with the virtualenv active):
    python scripts/create_admin.py admin@example.com

Prompts for the password (not echoed). Requires the database to be provisioned
and seeded (database/db: make all seed) and DATABASE_URL to be configured.
"""

import asyncio
import getpass
import sys

import asyncpg

from core.config import get_settings
from core.security import hash_password


async def main(email: str, password: str) -> None:
    settings = get_settings()
    conn = await asyncpg.connect(settings.database_url)
    try:
        async with conn.transaction():
            user_id = await conn.fetchval(
                """
                INSERT INTO acl_user (email, password, company_name, preferred_language)
                VALUES ($1, $2, NULL, 'ar')
                RETURNING id
                """,
                email,
                hash_password(password),
            )
            await conn.execute(
                "INSERT INTO acl_user_group (user_id, group_name) VALUES ($1, 'admin')",
                user_id,
            )
    finally:
        await conn.close()
    print(f"Admin user created: {email}")


if __name__ == "__main__":
    email = sys.argv[1] if len(sys.argv) > 1 else input("Admin email: ")
    password = getpass.getpass("Admin password: ")
    if len(password) < 8:
        sys.exit("Password must be at least 8 characters")
    asyncio.run(main(email.strip().lower(), password))
