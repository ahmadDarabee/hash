-- =============================================================
-- quote — B2B quote requests
-- setup.ddl — tables, constraints, indexes
-- All tables inherit audit columns via INHERITS (audit).
-- =============================================================

CREATE TABLE IF NOT EXISTS quote_requests (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID REFERENCES users (id),
    contact_name  TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    company_name  TEXT,
    notes         TEXT,
    status        TEXT NOT NULL DEFAULT 'new'
                  CHECK (status IN ('new', 'reviewed', 'responded', 'closed'))
) INHERITS (audit);

CREATE INDEX IF NOT EXISTS idx_quote_requests_user ON quote_requests (user_id);
