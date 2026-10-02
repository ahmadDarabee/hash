-- =============================================================
-- compliance — SDS/MSDS documents and safety warnings
-- setup.ddl — tables, constraints, indexes
-- All tables inherit audit columns via INHERITS (audit).
-- =============================================================

CREATE TABLE IF NOT EXISTS sds_documents (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id     UUID NOT NULL REFERENCES products (id) ON DELETE CASCADE,
    language       TEXT NOT NULL CHECK (language IN ('ar', 'en')),
    version        TEXT NOT NULL,
    file_url       TEXT NOT NULL,
    issued_at      DATE NOT NULL DEFAULT CURRENT_DATE,
    revision_notes TEXT
) INHERITS (audit);

CREATE TABLE IF NOT EXISTS safety_warnings (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products (id) ON DELETE CASCADE,
    language   TEXT NOT NULL CHECK (language IN ('ar', 'en')),
    severity   TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'danger')),
    text       TEXT NOT NULL
) INHERITS (audit);

CREATE INDEX IF NOT EXISTS idx_sds_documents_product ON sds_documents (product_id);
CREATE INDEX IF NOT EXISTS idx_safety_warnings_product ON safety_warnings (product_id);
