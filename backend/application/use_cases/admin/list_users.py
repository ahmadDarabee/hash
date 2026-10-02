"""Admin: list users (read-only)."""

from application.ports.repositories import UserRepository
from domain.entities import User


class AdminListUsers:
    def __init__(self, users: UserRepository) -> None:
        self._users = users

    async def execute(self, page: int, page_size: int) -> tuple[list[User], int, int, int]:
        page = max(page, 1)
        page_size = min(max(page_size, 1), 100)
        items, total = await self._users.list(page, page_size)
        return items, total, page, page_size
