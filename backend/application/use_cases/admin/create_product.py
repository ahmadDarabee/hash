"""Admin: create a product."""

from application.ports.repositories import ProductRepository
from domain.entities import Product
from domain.enums import ProductKind


class AdminCreateProduct:
    def __init__(self, products: ProductRepository) -> None:
        self._products = products

    async def execute(
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
        return await self._products.create(
            sku=sku,
            name_en=name_en,
            name_ar=name_ar,
            description_en=description_en,
            description_ar=description_ar,
            category_id=category_id,
            brand=brand,
            unit=unit,
            kind=kind,
        )
