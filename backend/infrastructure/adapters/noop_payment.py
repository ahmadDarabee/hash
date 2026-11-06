"""No-op payment provider (future gateway to be wired via DI)."""


from domain.value_objects import Money


class NoopPaymentProvider:
    async def charge(self, order_id: int, amount: Money) -> str:
        raise NotImplementedError("Payment is not implemented yet: plug a real gateway into PaymentProvider.")

    async def refund(self, payment_id: str, amount: Money | None = None) -> str:
        raise NotImplementedError("Refunds are not implemented yet: plug a real gateway into PaymentProvider.")

    async def handle_webhook(self, payload: dict) -> None:
        raise NotImplementedError("Payment webhooks are not implemented yet.")
