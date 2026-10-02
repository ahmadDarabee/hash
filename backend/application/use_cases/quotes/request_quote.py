"""Store a B2B quote request."""

import uuid

from application.ports.repositories import QuoteRepository
from domain.entities import QuoteRequest


class RequestQuote:
    def __init__(self, quotes: QuoteRepository) -> None:
        self._quotes = quotes

    async def execute(
        self,
        *,
        user_id: uuid.UUID | None,
        contact_name: str,
        contact_email: str,
        contact_phone: str | None = None,
        company_name: str | None = None,
        notes: str | None = None,
    ) -> QuoteRequest:
        return await self._quotes.create(
            user_id=user_id,
            contact_name=contact_name,
            contact_email=contact_email,
            contact_phone=contact_phone,
            company_name=company_name,
            notes=notes,
        )
