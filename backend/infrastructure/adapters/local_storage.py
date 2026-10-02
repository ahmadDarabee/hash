"""Local-disk storage adapter (v1). Returns paths served by the /files mount."""

from pathlib import Path


class LocalDiskStorage:
    def __init__(self, root: str) -> None:
        self._root = Path(root)

    async def save(self, key: str, data: bytes, content_type: str) -> str:
        target = self._root / key
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
        return f"/files/{key}"

    async def delete(self, key: str) -> None:
        target = self._root / key
        target.unlink(missing_ok=True)
