"""Quote request repository (raw SQL)."""

import uuid

import asyncpg

from domain.entities import QuoteRequest
from domain.enums import QuoteStatus
from infrastructure.repositories.base import BaseRepository


def _quote_from_row(row: asyncpg.Record) -> QuoteRequest:
    return QuoteRequest(
        id=row["id"],
        user_id=row["user_id"],
        contact_name=row["contact_name"],
        contact_email=row["contact_email"],
        contact_phone=row["contact_phone"],
        company_name=row["company_name"],
        notes=row["notes"],
        status=QuoteStatus(row["status"]),
        created_at=row["created_at"],
    )


class QuoteRepository(BaseRepository):
    async def create(
        self,
        *,
        user_id: uuid.UUID | None,
        contact_name: str,
        contact_email: str,
        contact_phone: str | None,
        company_name: str | None,
        notes: str | None,
    ) -> QuoteRequest:
        row = await self._pool.fetchrow(
            "INSERT INTO quote_requests (user_id, contact_name, contact_email, contact_phone, company_name, notes) "
            "VALUES ($1, $2, $3, $4, $5, $6) "
            "RETURNING id, user_id, contact_name, contact_email, contact_phone, company_name, notes, status, created_at",
            user_id,
            contact_name,
            contact_email,
            contact_phone,
            company_name,
            notes,
        )
        return _quote_from_row(row)
