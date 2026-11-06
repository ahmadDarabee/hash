"""Domain entities (plain frozen dataclasses, no framework imports)."""

from __future__ import annotations

import datetime as dt
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
    id: int
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
    id: int
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
    id: int
    product_id: int
    size: Decimal
    unit: str
    packaging: str


@dataclass(frozen=True, slots=True)
class PriceList:
    id: int
    name: str
    customer_id: int | None = None
    is_default: bool = False


@dataclass(frozen=True, slots=True)
class PriceListItem:
    id: int
    price_list_id: int
    product_id: int
    price: Money
    min_qty: Decimal
    discount_pct: Decimal


@dataclass(frozen=True, slots=True)
class InventoryItem:
    id: int
    product_id: int
    location: str
    qty_on_hand: Decimal
    qty_reserved: Decimal
    reorder_level: Decimal


@dataclass(frozen=True, slots=True)
class InventoryMovement:
    id: int
    inventory_item_id: int
    type: InventoryMovementType
    qty: Decimal
    reason: str | None
    ref_id: int | None
    created_at: dt.datetime


@dataclass(frozen=True, slots=True)
class SdsDocument:
    id: int
    product_id: int
    language: Language
    version: str
    file_url: str
    issued_at: dt.date
    revision_notes: str | None = None


@dataclass(frozen=True, slots=True)
class SafetyWarning:
    id: int
    product_id: int
    language: Language
    severity: WarningSeverity
    text: str


@dataclass(frozen=True, slots=True)
class Order:
    id: int
    user_id: int
    status: OrderStatus
    total: Money
    created_at: dt.datetime | None = None


@dataclass(frozen=True, slots=True)
class OrderItem:
    id: int
    order_id: int
    product_id: int
    qty: Decimal
    unit_price: Money
    line_total: Money


@dataclass(frozen=True, slots=True)
class QuoteRequest:
    id: int
    contact_name: str
    contact_email: str
    status: QuoteStatus
    contact_phone: str | None = None
    company_name: str | None = None
    notes: str | None = None
    user_id: int | None = None
    created_at: dt.datetime | None = None
