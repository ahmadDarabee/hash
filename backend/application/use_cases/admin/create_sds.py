"""Admin: upload an SDS file and record its metadata."""

import datetime as dt
import uuid

from application.ports.repositories import ComplianceRepository, ProductRepository
from application.ports.storage import StorageAdapter
from domain.entities import SdsDocument
from domain.enums import Language
from domain.errors import NotFoundError


class AdminCreateSds:
    def __init__(
        self,
        compliance: ComplianceRepository,
        products: ProductRepository,
        storage: StorageAdapter,
    ) -> None:
        self._compliance = compliance
        self._products = products
        self._storage = storage

    async def execute(
        self,
        *,
        product_id: uuid.UUID,
        language: Language,
        version: str,
        issued_at: dt.date,
        revision_notes: str | None,
        filename: str,
        data: bytes,
        content_type: str,
    ) -> SdsDocument:
        product = await self._products.get_by_id(product_id)
        if product is None:
            raise NotFoundError("Product not found")

        suffix = filename.rsplit(".", 1)[-1] if "." in filename else "pdf"
        key = f"sds/{product_id}/{version}-{language.value}.{suffix}"
        file_url = await self._storage.save(key, data, content_type)

        return await self._compliance.create_sds(
            product_id=product_id,
            language=language,
            version=version,
            file_url=file_url,
            issued_at=issued_at,
            revision_notes=revision_notes,
        )
