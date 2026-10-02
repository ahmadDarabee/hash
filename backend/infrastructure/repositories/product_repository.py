"""Product repository (raw SQL)."""

import uuid
from typing import Any, Mapping

import asyncpg

from domain.entities import Product
from domain.enums import ProductKind
from infrastructure.repositories.base import BaseRepository

_COLUMNS = (
    "id, sku, name_en, name_ar, description_en, description_ar, "
    "category_id, brand, unit, kind, is_active"
)

# Only these columns may be updated through AdminUpdateProduct.
_ALLOWED_COLUMNS = frozenset(
    {
        "name_en",
        "name_ar",
        "description_en",
        "description_ar",
        "category_id",
        "brand",
        "unit",
        "is_active",
    }
)


def _product_from_row(row: asyncpg.Record) -> Product:
    return Product(
        id=row["id"],
        sku=row["sku"],
        name_en=row["name_en"],
        name_ar=row["name_ar"],
        description_en=row["description_en"],
        description_ar=row["description_ar"],
        category_id=row["category_id"],
        brand=row["brand"],
        unit=row["unit"],
        kind=ProductKind(row["kind"]),
        is_active=row["is_active"],
    )


class ProductRepository(BaseRepository):
    async def list(
        self,
        *,
        page: int,
        page_size: int,
        category_id: int | None = None,
        query: str | None = None,
        include_inactive: bool = False,
    ) -> tuple[list[Product], int]:
        offset = (page - 1) * page_size
        like = f"%{query.strip()}%" if query else None

        where = (
            "deleted_at IS NULL "
            "AND ($1 OR is_active = TRUE) "
            "AND ($2::int IS NULL OR category_id = $2) "
            "AND ($3::text IS NULL OR name_en ILIKE $3 OR name_ar ILIKE $3 OR sku ILIKE $3)"
        )

        rows = await self._pool.fetch(
            f"SELECT {_COLUMNS} FROM products WHERE {where} "
            "ORDER BY created_at DESC LIMIT $4 OFFSET $5",
            include_inactive,
            category_id,
            like,
            page_size,
            offset,
        )
        total = await self._pool.fetchval(
            f"SELECT COUNT(*) FROM products WHERE {where}",
            include_inactive,
            category_id,
            like,
        )
        return [_product_from_row(r) for r in rows], int(total)

    async def get_by_id(self, product_id: uuid.UUID) -> Product | None:
        row = await self._pool.fetchrow(
            f"SELECT {_COLUMNS} FROM products WHERE id = $1 AND deleted_at IS NULL",
            product_id,
        )
        return _product_from_row(row) if row else None

    async def create(
        self,
        *,
        sku: str,
        name_en: str,
        name_ar: str,
        description_en: str | None,
        description_ar: str | None,
        category_id: int,
        brand: str,
        unit: str,
        kind: ProductKind,
    ) -> Product:
        row = await self._pool.fetchrow(
            f"""
            INSERT INTO products
                (sku, name_en, name_ar, description_en, description_ar, category_id, brand, unit, kind)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING {_COLUMNS}
            """,
            sku,
            name_en,
            name_ar,
            description_en,
            description_ar,
            category_id,
            brand,
            unit,
            kind.value,
        )
        return _product_from_row(row)

    async def update(self, product_id: uuid.UUID, changes: Mapping[str, Any]) -> Product | None:
        fields = {k: v for k, v in changes.items() if k in _ALLOWED_COLUMNS}
        if not fields:
            return await self.get_by_id(product_id)

        # Column names come from _ALLOWED_COLUMNS (never from user input).
        assignments = ", ".join(f"{col} = ${i}" for i, col in enumerate(fields, start=1))
        values = list(fields.values())
        row = await self._pool.fetchrow(
            f"UPDATE products SET {assignments}, updated_at = NOW() "
            f"WHERE id = ${len(fields) + 1} AND deleted_at IS NULL "
            f"RETURNING {_COLUMNS}",
            *values,
            product_id,
        )
        return _product_from_row(row) if row else None
