-- =============================================================
-- common — shared objects used across features
-- setup.ddl — shared tables/types
-- =============================================================

-- ── audit ──────────────────────────────────────────────────────────────────
-- Column container. Never holds rows directly.
-- Children declare: INHERITS (audit).
CREATE TABLE IF NOT EXISTS audit (
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by  TEXT        NOT NULL DEFAULT 'system',
    updated_at  TIMESTAMPTZ,
    updated_by  TEXT
);

COMMENT ON TABLE audit IS
    'Audit columns. Never holds rows. Children use INHERITS (audit).';
