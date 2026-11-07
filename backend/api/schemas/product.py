"""Catalog response schemas."""

import datetime as dt

from pydantic import BaseModel, ConfigDict

from domain.enums import Language, MediaKind, ProductKind, WarningSeverity


class ProductResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    sku: str
    name_en: str
    name_ar: str
    description_en: str | None = None
    description_ar: str | None = None
    category_id: int
    brand: str
    unit: str
    kind: ProductKind
    is_active: bool = True


class SdsResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int
    language: Language
    version: str
    file_url: str
    issued_at: dt.date
    revision_notes: str | None = None


class WarningResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int
    language: Language
    severity: WarningSeverity
    text: str


class ProductMediaResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int
    kind: MediaKind
    url: str
    title: str | None = None
    sort_order: int = 0
