"""Resolve the effective price list for a user (customer-specific > default)."""

from application.ports.repositories import PricingRepository
from domain.entities import PriceList, PriceListItem, User
from domain.enums import CustomerType


class GetEffectivePricing:
    def __init__(self, pricing: PricingRepository) -> None:
        self._pricing = pricing

    async def execute(self, user: User) -> tuple[PriceList, list[PriceListItem]] | None:
        price_list = None
        if user.customer_type is CustomerType.B2B:
            price_list = await self._pricing.get_by_customer(user.id)

        if price_list is None:
            price_list = await self._pricing.get_default()

        if price_list is None:
            return None

        items = await self._pricing.get_items(price_list.id)
        return price_list, items
