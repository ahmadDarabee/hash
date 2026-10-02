"""List all categories."""

from application.ports.repositories import CategoryRepository
from domain.entities import Category


class ListCategories:
    def __init__(self, categories: CategoryRepository) -> None:
        self._categories = categories

    async def execute(self) -> list[Category]:
        return await self._categories.list()
