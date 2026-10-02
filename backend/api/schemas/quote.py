"""Quote request schemas."""

import datetime as dt
import uuid

from pydantic import BaseModel, ConfigDict, EmailStr

from domain.enums import QuoteStatus


class QuoteRequestIn(BaseModel):
    contact_name: str
    contact_email: EmailStr
    contact_phone: str | None = None
    company_name: str | None = None
    notes: str | None = None


class QuoteResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    contact_name: str
    contact_email: str
    status: QuoteStatus
    created_at: dt.datetime | None = None
