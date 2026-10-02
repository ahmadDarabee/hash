"""List active products with pagination and optional filters."""

from application.ports.repositories import ProductRepository
from domain.entities import Product


class ListProducts:
    def __init__(self, products: ProductRepository) -> None:
        self._products = products

    async def execute(
        self,
        *,
        page: int,
        page_size: int,
        category_id: int | None = None,
        query: str | None = None,
    ) -> tuple[list[Product], int, int, int]:
        page = max(page, 1)
        page_size = min(max(page_size, 1), 100)
        items, total = await self._products.list(
            page=page,
            page_size=page_size,
            category_id=category_id,
            query=query,
        )
        return items, total, page, page_size
