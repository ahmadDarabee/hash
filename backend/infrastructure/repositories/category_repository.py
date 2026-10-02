"""Category repository (raw SQL)."""

import asyncpg

from domain.entities import Category
from infrastructure.repositories.base import BaseRepository


def _category_from_row(row: asyncpg.Record) -> Category:
    return Category(
        id=row["id"],
        slug=row["slug"],
        name_en=row["name_en"],
        name_ar=row["name_ar"],
        parent_id=row["parent_id"],
    )


class CategoryRepository(BaseRepository):
    async def list(self) -> list[Category]:
        rows = await self._pool.fetch(
            "SELECT id, slug, name_en, name_ar, parent_id FROM categories ORDER BY id"
        )
        return [_category_from_row(r) for r in rows]
