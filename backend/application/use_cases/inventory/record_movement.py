"""Record an inventory movement and update on-hand quantity atomically."""

import uuid
from decimal import Decimal

from application.ports.repositories import InventoryRepository
from domain.entities import InventoryMovement
from domain.enums import InventoryMovementType
from domain.errors import NotFoundError
from domain.rules import apply_inventory_change


class RecordInventoryMovement:
    def __init__(self, inventory: InventoryRepository) -> None:
        self._inventory = inventory

    async def execute(
        self,
        *,
        inventory_item_id: uuid.UUID,
        movement_type: InventoryMovementType,
        qty: Decimal,
        reason: str | None = None,
        ref_id: uuid.UUID | None = None,
    ) -> InventoryMovement:
        item = await self._inventory.get_item(inventory_item_id)
        if item is None:
            raise NotFoundError("Inventory item not found")

        new_qty = apply_inventory_change(item.qty_on_hand, movement_type, qty)
        return await self._inventory.record_movement(
            inventory_item_id=inventory_item_id,
            type_=movement_type,
            qty=qty,
            new_qty_on_hand=new_qty,
            reason=reason,
            ref_id=ref_id,
        )
