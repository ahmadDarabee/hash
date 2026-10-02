"""No-op order tracking provider (future carrier integration)."""


class NoopOrderTrackingProvider:
    async def get_status(self, tracking_id: str) -> str:
        raise NotImplementedError("Order tracking is not implemented yet: plug a carrier into OrderTrackingProvider.")

    async def list_events(self, tracking_id: str) -> list[dict]:
        raise NotImplementedError("Order tracking is not implemented yet: plug a carrier into OrderTrackingProvider.")
