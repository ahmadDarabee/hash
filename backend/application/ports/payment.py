"""Payment provider port (future). Wire a real gateway later via DI."""

import uuid
from typing import Protocol

from domain.value_objects import Money


class PaymentProvider(Protocol):
    async def charge(self, order_id: uuid.UUID, amount: Money) -> str:
        """Authorize a charge and return a gateway payment id."""
        ...

    async def refund(self, payment_id: str, amount: Money | None = None) -> str:
        """Refund all or part of a payment and return a refund id."""
        ...

    async def handle_webhook(self, payload: dict) -> None:
        """Process an incoming gateway webhook event."""
        ...
