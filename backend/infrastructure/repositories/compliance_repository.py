"""Compliance repository: SDS documents and safety warnings (raw SQL)."""

import datetime as dt
import uuid

import asyncpg

from domain.entities import SdsDocument, SafetyWarning
from domain.enums import Language, WarningSeverity
from infrastructure.repositories.base import BaseRepository


def _sds_from_row(row: asyncpg.Record) -> SdsDocument:
    return SdsDocument(
        id=row["id"],
        product_id=row["product_id"],
        language=Language(row["language"]),
        version=row["version"],
        file_url=row["file_url"],
        issued_at=row["issued_at"],
        revision_notes=row["revision_notes"],
    )


def _warning_from_row(row: asyncpg.Record) -> SafetyWarning:
    return SafetyWarning(
        id=row["id"],
        product_id=row["product_id"],
        language=Language(row["language"]),
        severity=WarningSeverity(row["severity"]),
        text=row["text"],
    )


class ComplianceRepository(BaseRepository):
    async def list_sds(self, product_id: uuid.UUID) -> list[SdsDocument]:
        rows = await self._pool.fetch(
            "SELECT id, product_id, language, version, file_url, issued_at, revision_notes "
            "FROM sds_documents WHERE product_id = $1 ORDER BY issued_at DESC, version DESC",
            product_id,
        )
        return [_sds_from_row(r) for r in rows]

    async def list_warnings(self, product_id: uuid.UUID) -> list[SafetyWarning]:
        rows = await self._pool.fetch(
            "SELECT id, product_id, language, severity, text "
            "FROM safety_warnings WHERE product_id = $1 "
            "ORDER BY CASE severity WHEN 'danger' THEN 0 WHEN 'warning' THEN 1 ELSE 2 END, created_at",
            product_id,
        )
        return [_warning_from_row(r) for r in rows]

    async def create_sds(
        self,
        *,
        product_id: uuid.UUID,
        language: Language,
        version: str,
        file_url: str,
        issued_at: dt.date,
        revision_notes: str | None,
    ) -> SdsDocument:
        row = await self._pool.fetchrow(
            "INSERT INTO sds_documents (product_id, language, version, file_url, issued_at, revision_notes) "
            "VALUES ($1, $2, $3, $4, $5, $6) "
            "RETURNING id, product_id, language, version, file_url, issued_at, revision_notes",
            product_id,
            language.value,
            version,
            file_url,
            issued_at,
            revision_notes,
        )
        return _sds_from_row(row)

    async def create_warning(
        self,
        *,
        product_id: uuid.UUID,
        language: Language,
        severity: WarningSeverity,
        text: str,
    ) -> SafetyWarning:
        row = await self._pool.fetchrow(
            "INSERT INTO safety_warnings (product_id, language, severity, text) "
            "VALUES ($1, $2, $3, $4) RETURNING id, product_id, language, severity, text",
            product_id,
            language.value,
            severity.value,
            text,
        )
        return _warning_from_row(row)
