"""List media (photos/videos) for a product."""

from application.ports.repositories import ProductMediaRepository, ProductRepository
from domain.entities import ProductMedia
from domain.errors import NotFoundError


class GetProductMedia:
    def __init__(self, media: ProductMediaRepository, products: ProductRepository) -> None:
        self._media = media
        self._products = products

    async def execute(self, product_id: int) -> list[ProductMedia]:
        product = await self._products.get_by_id(product_id)
        if product is None or not product.is_active:
            raise NotFoundError("Product not found")
        return await self._media.list_media(product_id)
