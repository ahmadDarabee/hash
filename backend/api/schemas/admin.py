"""Admin request schemas."""

import uuid

from pydantic import BaseModel

from domain.enums import ProductKind


class ProductCreate(BaseModel):
    sku: str
    name_en: str
    name_ar: str
    category_id: int
    brand: str
    unit: str
    description_en: str | None = None
    description_ar: str | None = None
    kind: ProductKind = ProductKind.FINISHED


class ProductUpdate(BaseModel):
    name_en: str | None = None
    name_ar: str | None = None
    description_en: str | None = None
    description_ar: str | None = None
    category_id: int | None = None
    brand: str | None = None
    unit: str | None = None
    is_active: bool | None = None


class AssignPricingRequest(BaseModel):
    price_list_id: uuid.UUID
