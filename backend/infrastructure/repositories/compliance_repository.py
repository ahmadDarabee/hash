"""Compliance repository: safety warnings (raw SQL)."""

import asyncpg

from domain.entities import SafetyWarning
from domain.enums import Language, WarningSeverity
from infrastructure.repositories.base import BaseRepository


def _warning_from_row(row: asyncpg.Record) -> SafetyWarning:
    return SafetyWarning(
        id=row["id"],
        product_id=row["product_id"],
        language=Language(row["language"]),
        severity=WarningSeverity(row["severity"]),
        text=row["text"],
    )


class ComplianceRepository(BaseRepository):
    async def list_warnings(self, product_id: int) -> list[SafetyWarning]:
        rows = await self._pool.fetch(
            "SELECT id, product_id, language, severity, text "
            "FROM safety_warning WHERE product_id = $1 "
            "ORDER BY CASE severity WHEN 'danger' THEN 0 WHEN 'warning' THEN 1 ELSE 2 END, created_at",
            product_id,
        )
        return [_warning_from_row(r) for r in rows]

    async def create_warning(
        self,
        *,
        product_id: int,
        language: Language,
        severity: WarningSeverity,
        text: str,
    ) -> SafetyWarning:
        row = await self._pool.fetchrow(
            "INSERT INTO safety_warning (product_id, language, severity, text) "
            "VALUES ($1, $2, $3, $4) RETURNING id, product_id, language, severity, text",
            product_id,
            language.value,
            severity.value,
            text,
        )
        return _warning_from_row(row)
