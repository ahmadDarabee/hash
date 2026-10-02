"""Inventory repository (raw SQL). Movements are append-only."""

import uuid
from decimal import Decimal

import asyncpg

from domain.entities import InventoryItem, InventoryMovement
from domain.enums import InventoryMovementType
from infrastructure.repositories.base import BaseRepository

_ITEM_COLUMNS = "id, product_id, location, qty_on_hand, qty_reserved, reorder_level"
_MOVEMENT_COLUMNS = "id, inventory_item_id, type, qty, reason, ref_id, created_at"


def _item_from_row(row: asyncpg.Record) -> InventoryItem:
    return InventoryItem(
        id=row["id"],
        product_id=row["product_id"],
        location=row["location"],
        qty_on_hand=Decimal(row["qty_on_hand"]),
        qty_reserved=Decimal(row["qty_reserved"]),
        reorder_level=Decimal(row["reorder_level"]),
    )


def _movement_from_row(row: asyncpg.Record) -> InventoryMovement:
    return InventoryMovement(
        id=row["id"],
        inventory_item_id=row["inventory_item_id"],
        type=InventoryMovementType(row["type"]),
        qty=Decimal(row["qty"]),
        reason=row["reason"],
        ref_id=row["ref_id"],
        created_at=row["created_at"],
    )


class InventoryRepository(BaseRepository):
    async def list_items(self, product_id: uuid.UUID) -> list[InventoryItem]:
        rows = await self._pool.fetch(
            f"SELECT {_ITEM_COLUMNS} FROM inventory_items WHERE product_id = $1 ORDER BY location",
            product_id,
        )
        return [_item_from_row(r) for r in rows]

    async def get_item(self, inventory_item_id: uuid.UUID) -> InventoryItem | None:
        row = await self._pool.fetchrow(
            f"SELECT {_ITEM_COLUMNS} FROM inventory_items WHERE id = $1",
            inventory_item_id,
        )
        return _item_from_row(row) if row else None

    async def record_movement(
        self,
        *,
        inventory_item_id: uuid.UUID,
        type_: InventoryMovementType,
        qty: Decimal,
        new_qty_on_hand: Decimal,
        reason: str | None,
        ref_id: uuid.UUID | None,
    ) -> InventoryMovement:
        async with self._pool.acquire() as conn:
            async with conn.transaction():
                await conn.execute(
                    "UPDATE inventory_items SET qty_on_hand = $1, updated_at = NOW() WHERE id = $2",
                    new_qty_on_hand,
                    inventory_item_id,
                )
                row = await conn.fetchrow(
                    "INSERT INTO inventory_movements (inventory_item_id, type, qty, reason, ref_id) "
                    "VALUES ($1, $2, $3, $4, $5) "
                    f"RETURNING {_MOVEMENT_COLUMNS}",
                    inventory_item_id,
                    type_.value,
                    qty,
                    reason,
                    ref_id,
                )
        return _movement_from_row(row)
