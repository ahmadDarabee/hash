"""Admin: update product fields."""

from typing import Any, Mapping

from application.ports.repositories import ProductRepository
from domain.entities import Product
from domain.errors import NotFoundError


class AdminUpdateProduct:
    def __init__(self, products: ProductRepository) -> None:
        self._products = products

    async def execute(self, product_id: int, changes: Mapping[str, Any]) -> Product:
        product = await self._products.update(product_id, changes)
        if product is None:
            raise NotFoundError("Product not found")
        return product
