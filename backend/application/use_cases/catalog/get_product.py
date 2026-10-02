"""Fetch a single active product."""

import uuid

from application.ports.repositories import ProductRepository
from domain.entities import Product
from domain.errors import NotFoundError


class GetProduct:
    def __init__(self, products: ProductRepository) -> None:
        self._products = products

    async def execute(self, product_id: uuid.UUID) -> Product:
        product = await self._products.get_by_id(product_id)
        if product is None or not product.is_active:
            raise NotFoundError("Product not found")
        return product
