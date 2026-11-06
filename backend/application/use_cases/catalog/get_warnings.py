"""List safety warnings for a product."""


from application.ports.repositories import ComplianceRepository, ProductRepository
from domain.entities import SafetyWarning
from domain.errors import NotFoundError


class GetProductWarnings:
    def __init__(self, compliance: ComplianceRepository, products: ProductRepository) -> None:
        self._compliance = compliance
        self._products = products

    async def execute(self, product_id: int) -> list[SafetyWarning]:
        product = await self._products.get_by_id(product_id)
        if product is None or not product.is_active:
            raise NotFoundError("Product not found")
        return await self._compliance.list_warnings(product_id)
