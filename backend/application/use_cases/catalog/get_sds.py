"""List SDS documents for a product."""

import uuid

from application.ports.repositories import ComplianceRepository, ProductRepository
from domain.entities import SdsDocument
from domain.errors import NotFoundError


class GetProductSds:
    def __init__(self, compliance: ComplianceRepository, products: ProductRepository) -> None:
        self._compliance = compliance
        self._products = products

    async def execute(self, product_id: uuid.UUID) -> list[SdsDocument]:
        product = await self._products.get_by_id(product_id)
        if product is None or not product.is_active:
            raise NotFoundError("Product not found")
        return await self._compliance.list_sds(product_id)
