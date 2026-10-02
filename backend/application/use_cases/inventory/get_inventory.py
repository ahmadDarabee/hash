"""List inventory items for a product."""

import uuid

from application.ports.repositories import InventoryRepository
from domain.entities import InventoryItem


class GetInventory:
    def __init__(self, inventory: InventoryRepository) -> None:
        self._inventory = inventory

    async def execute(self, product_id: uuid.UUID) -> list[InventoryItem]:
        return await self._inventory.list_items(product_id)
