"""Pricing repository (raw SQL)."""

import uuid
from decimal import Decimal

import asyncpg

from domain.entities import PriceList, PriceListItem
from domain.errors import ConflictError, NotFoundError
from domain.value_objects import Money
from infrastructure.repositories.base import BaseRepository

_LIST_COLUMNS = "id, name, customer_id, is_default"


def _price_list_from_row(row: asyncpg.Record) -> PriceList:
    return PriceList(
        id=row["id"],
        name=row["name"],
        customer_id=row["customer_id"],
        is_default=row["is_default"],
    )


def _item_from_row(row: asyncpg.Record) -> PriceListItem:
    return PriceListItem(
        id=row["id"],
        price_list_id=row["price_list_id"],
        product_id=row["product_id"],
        price=Money(Decimal(row["price"]), row["currency"].strip()),
        min_qty=Decimal(row["min_qty"]),
        discount_pct=Decimal(row["discount_pct"]),
    )


class PricingRepository(BaseRepository):
    async def get_default(self) -> PriceList | None:
        row = await self._pool.fetchrow(
            f"SELECT {_LIST_COLUMNS} FROM price_lists WHERE is_default = TRUE LIMIT 1"
        )
        return _price_list_from_row(row) if row else None

    async def get_by_customer(self, customer_id: uuid.UUID) -> PriceList | None:
        row = await self._pool.fetchrow(
            f"SELECT {_LIST_COLUMNS} FROM price_lists WHERE customer_id = $1 LIMIT 1",
            customer_id,
        )
        return _price_list_from_row(row) if row else None

    async def get_by_id(self, price_list_id: uuid.UUID) -> PriceList | None:
        row = await self._pool.fetchrow(
            f"SELECT {_LIST_COLUMNS} FROM price_lists WHERE id = $1",
            price_list_id,
        )
        return _price_list_from_row(row) if row else None

    async def list_all(self) -> list[PriceList]:
        rows = await self._pool.fetch(
            f"SELECT {_LIST_COLUMNS} FROM price_lists ORDER BY is_default DESC, name"
        )
        return [_price_list_from_row(r) for r in rows]

    async def get_items(self, price_list_id: uuid.UUID) -> list[PriceListItem]:
        rows = await self._pool.fetch(
            "SELECT id, price_list_id, product_id, price, currency, min_qty, discount_pct "
            "FROM price_list_items WHERE price_list_id = $1 ORDER BY min_qty",
            price_list_id,
        )
        return [_item_from_row(r) for r in rows]

    async def assign_to_customer(self, price_list_id: uuid.UUID, customer_id: uuid.UUID) -> None:
        price_list = await self.get_by_id(price_list_id)
        if price_list is None:
            raise NotFoundError("Price list not found")
        if price_list.is_default:
            raise ConflictError("The default price list cannot be assigned to a customer")

        await self._pool.execute(
            "UPDATE price_lists SET customer_id = $1 WHERE id = $2",
            customer_id,
            price_list_id,
        )
