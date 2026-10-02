"""Pricing response schemas."""

import uuid
from decimal import Decimal

from pydantic import BaseModel


class PriceListItemResponse(BaseModel):
    product_id: uuid.UUID
    price: Decimal
    currency: str
    min_qty: Decimal
    discount_pct: Decimal


class PricingResponse(BaseModel):
    price_list_id: uuid.UUID
    name: str
    is_default: bool
    items: list[PriceListItemResponse]
