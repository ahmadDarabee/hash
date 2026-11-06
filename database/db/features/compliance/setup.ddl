-- =============================================================
-- compliance — SDS/MSDS documents and safety warnings
-- setup.ddl — tables, constraints, indexes
-- All tables inherit audit columns via INHERITS (audit).
-- =============================================================

-- CREATE TABLE IF NOT EXISTS sds_document (
--     id             SERIAL PRIMARY KEY,
--     product_id     INTEGER NOT NULL REFERENCES product (id) ON DELETE CASCADE,
--     language       TEXT NOT NULL CHECK (language IN ('ar', 'en')),
--     version        TEXT NOT NULL,
--     file_url       TEXT NOT NULL,
--     issued_at      DATE NOT NULL DEFAULT CURRENT_DATE,
--     revision_notes TEXT
-- ) INHERITS (audit);

-- CREATE TABLE IF NOT EXISTS safety_warning (
--     id         SERIAL PRIMARY KEY,
--     product_id INTEGER NOT NULL REFERENCES product (id) ON DELETE CASCADE,
--     language   TEXT NOT NULL CHECK (language IN ('ar', 'en')),
--     severity   TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'danger')),
--     text       TEXT NOT NULL
-- ) INHERITS (audit);

-- CREATE INDEX IF NOT EXISTS idx_sds_documents_product ON sds_document (product_id);
-- CREATE INDEX IF NOT EXISTS idx_safety_warnings_product ON safety_warning (product_id);
