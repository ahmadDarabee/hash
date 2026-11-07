"""Product media repository (raw SQL): photos and videos."""

import asyncpg

from domain.entities import ProductMedia
from domain.enums import MediaKind
from infrastructure.repositories.base import BaseRepository

_COLUMNS = "id, product_id, kind, url, title, sort_order"


def _media_from_row(row: asyncpg.Record) -> ProductMedia:
    return ProductMedia(
        id=row["id"],
        product_id=row["product_id"],
        kind=MediaKind(row["kind"]),
        url=row["url"],
        title=row["title"],
        sort_order=row["sort_order"],
    )


class ProductMediaRepository(BaseRepository):
    async def list_media(self, product_id: int) -> list[ProductMedia]:
        rows = await self._pool.fetch(
            f"SELECT {_COLUMNS} FROM product_media "
            "WHERE product_id = $1 ORDER BY sort_order, id",
            product_id,
        )
        return [_media_from_row(row) for row in rows]
