"""Catalog response schemas."""

import datetime as dt
import uuid

from pydantic import BaseModel, ConfigDict

from domain.enums import Language, ProductKind, WarningSeverity


class ProductResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
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

    id: uuid.UUID
    product_id: uuid.UUID
    language: Language
    version: str
    file_url: str
    issued_at: dt.date
    revision_notes: str | None = None


class WarningResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    product_id: uuid.UUID
    language: Language
    severity: WarningSeverity
    text: str
