"""Admin: assign a price list to a B2B customer."""

import uuid

from application.ports.repositories import PricingRepository, UserRepository
from domain.enums import CustomerType
from domain.errors import NotFoundError, ValidationError


class AdminAssignPricing:
    def __init__(self, users: UserRepository, pricing: PricingRepository) -> None:
        self._users = users
        self._pricing = pricing

    async def execute(self, user_id: uuid.UUID, price_list_id: uuid.UUID) -> None:
        user = await self._users.get_by_id(user_id)
        if user is None:
            raise NotFoundError("User not found")

        if user.customer_type is not CustomerType.B2B:
            raise ValidationError("Only B2B customers can be assigned a price list")

        await self._pricing.assign_to_customer(price_list_id, user_id)
