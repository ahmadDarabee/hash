"""Order tracking provider port (future)."""

import uuid
from typing import Protocol


class OrderTrackingProvider(Protocol):
    async def get_status(self, tracking_id: str) -> str:
        """Return the current human-readable status for a tracking id."""
        ...

    async def list_events(self, tracking_id: str) -> list[dict]:
        """Return a chronological list of tracking events."""
        ...
