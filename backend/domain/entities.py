"""Domain entities (plain frozen dataclasses, no framework imports)."""

from __future__ import annotations

import datetime as dt
import uuid
from dataclasses import dataclass
from decimal import Decimal

from domain.enums import (
    CustomerType,
    InventoryMovementType,
    Language,
    OrderStatus,
    ProductKind,
    QuoteStatus,
    Role,
    WarningSeverity,
)
from domain.value_objects import Money


@dataclass(frozen=True, slots=True)
class User:
    id: uuid.UUID
    email: str
    password_hash: str
    role: Role
    customer_type: CustomerType
    preferred_language: Language
    company_name: str | None = None
    is_active: bool = True
    created_at: dt.datetime | None = None


@dataclass(frozen=True, slots=True)
class Category:
    id: int
    slug: str
    name_en: str
    name_ar: str
    parent_id: int | None = None


@dataclass(frozen=True, slots=True)
class Product:
    id: uuid.UUID
    sku: str
    name_en: str
    name_ar: str
    category_id: int
    brand: str
    unit: str
    kind: ProductKind
    description_en: str | None = None
    description_ar: str | None = None
    is_active: bool = True


@dataclass(frozen=True, slots=True)
class ProductVariant:
    id: uuid.UUID
    product_id: uuid.UUID
    size: Decimal
    unit: str
    packaging: str


@dataclass(frozen=True, slots=True)
class PriceList:
    id: uuid.UUID
    name: str
    customer_id: uuid.UUID | None = None
    is_default: bool = False


@dataclass(frozen=True, slots=True)
class PriceListItem:
    id: uuid.UUID
    price_list_id: uuid.UUID
    product_id: uuid.UUID
    price: Money
    min_qty: Decimal
    discount_pct: Decimal


@dataclass(frozen=True, slots=True)
class InventoryItem:
    id: uuid.UUID
    product_id: uuid.UUID
    location: str
    qty_on_hand: Decimal
    qty_reserved: Decimal
    reorder_level: Decimal


@dataclass(frozen=True, slots=True)
class InventoryMovement:
    id: uuid.UUID
    inventory_item_id: uuid.UUID
    type: InventoryMovementType
    qty: Decimal
    reason: str | None
    ref_id: uuid.UUID | None
    created_at: dt.datetime


@dataclass(frozen=True, slots=True)
class SdsDocument:
    id: uuid.UUID
    product_id: uuid.UUID
    language: Language
    version: str
    file_url: str
    issued_at: dt.date
    revision_notes: str | None = None


@dataclass(frozen=True, slots=True)
class SafetyWarning:
    id: uuid.UUID
    product_id: uuid.UUID
    language: Language
    severity: WarningSeverity
    text: str


@dataclass(frozen=True, slots=True)
class Order:
    id: uuid.UUID
    user_id: uuid.UUID
    status: OrderStatus
    total: Money
    created_at: dt.datetime | None = None


@dataclass(frozen=True, slots=True)
class OrderItem:
    id: uuid.UUID
    order_id: uuid.UUID
    product_id: uuid.UUID
    qty: Decimal
    unit_price: Money
    line_total: Money


@dataclass(frozen=True, slots=True)
class QuoteRequest:
    id: uuid.UUID
    contact_name: str
    contact_email: str
    status: QuoteStatus
    contact_phone: str | None = None
    company_name: str | None = None
    notes: str | None = None
    user_id: uuid.UUID | None = None
    created_at: dt.datetime | None = None
