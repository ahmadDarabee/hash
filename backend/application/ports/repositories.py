"""Repository interfaces. Infrastructure implements these with raw SQL.

Rows are mapped to domain entities inside the implementations.
"""

from __future__ import annotations

import datetime as dt
from decimal import Decimal
from typing import Any, Mapping, Protocol

from domain.entities import (
    Category,
    InventoryItem,
    InventoryMovement,
    PriceList,
    PriceListItem,
    Product,
    ProductMedia,
    SdsDocument,
    SafetyWarning,
    User,
)
from domain.enums import (
    CustomerType,
    InventoryMovementType,
    Language,
    ProductKind,
    Role,
    WarningSeverity,
)


class UserRepository(Protocol):
    async def get_by_id(self, user_id: int) -> User | None: ...

    async def get_by_email(self, email: str) -> User | None: ...

    async def create(
        self,
        *,
        email: str,
        password_hash: str,
        role: Role,
        customer_type: CustomerType,
        company_name: str | None,
        preferred_language: Language,
    ) -> User: ...

    async def list(self, page: int, page_size: int) -> tuple[list[User], int]: ...


class RefreshTokenRepository(Protocol):
    async def store(self, user_id: int, token_hash: str, expires_at: dt.datetime) -> None: ...

    async def get_valid_user_id(self, token_hash: str) -> int | None: ...

    async def revoke(self, token_hash: str) -> None: ...


class ProductRepository(Protocol):
    async def list(
        self,
        *,
        page: int,
        page_size: int,
        category_id: int | None = None,
        query: str | None = None,
        include_inactive: bool = False,
    ) -> tuple[list[Product], int]: ...

    async def get_by_id(self, product_id: int) -> Product | None: ...

    async def create(
        self,
        *,
        sku: str,
        name_en: str,
        name_ar: str,
        description_en: str | None,
        description_ar: str | None,
        category_id: int,
        brand: str,
        unit: str,
        kind: ProductKind,
    ) -> Product: ...

    async def update(self, product_id: int, changes: Mapping[str, Any]) -> Product | None: ...


class CategoryRepository(Protocol):
    async def list(self) -> list[Category]: ...


class PricingRepository(Protocol):
    async def get_default(self) -> PriceList | None: ...

    async def get_by_customer(self, customer_id: int) -> PriceList | None: ...

    async def get_items(self, price_list_id: int) -> list[PriceListItem]: ...

    async def list_all(self) -> list[PriceList]: ...

    async def get_by_id(self, price_list_id: int) -> PriceList | None: ...

    async def assign_to_customer(self, price_list_id: int, customer_id: int) -> None: ...


class ComplianceRepository(Protocol):
    async def list_sds(self, product_id: int) -> list[SdsDocument]: ...

    async def list_warnings(self, product_id: int) -> list[SafetyWarning]: ...

    async def create_sds(
        self,
        *,
        product_id: int,
        language: Language,
        version: str,
        file_url: str,
        issued_at: dt.date,
        revision_notes: str | None,
    ) -> SdsDocument: ...

    async def create_warning(
        self,
        *,
        product_id: int,
        language: Language,
        severity: WarningSeverity,
        text: str,
    ) -> SafetyWarning: ...


class ProductMediaRepository(Protocol):
    async def list_media(self, product_id: int) -> list[ProductMedia]: ...

class InventoryRepository(Protocol):
    async def list_items(self, product_id: int) -> list[InventoryItem]: ...

    async def get_item(self, inventory_item_id: int) -> InventoryItem | None: ...

    async def record_movement(
        self,
        *,
        inventory_item_id: int,
        type_: InventoryMovementType,
        qty: Decimal,
        new_qty_on_hand: Decimal,
        reason: str | None,
        ref_id: int | None,
    ) -> InventoryMovement: ...
