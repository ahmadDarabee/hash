"""File storage port. v1 uses local disk; swap for S3/etc. later."""

from typing import Protocol


class StorageAdapter(Protocol):
    async def save(self, key: str, data: bytes, content_type: str) -> str:
        """Persist `data` under `key` and return the public path/URL."""
        ...

    async def delete(self, key: str) -> None:
        """Remove the object at `key`."""
        ...
