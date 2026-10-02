-- =============================================================
-- auth — refresh tokens (rotation is handled at the application layer)
-- setup.ddl — tables, constraints, indexes
-- All tables inherit audit columns via INHERITS (audit).
-- =============================================================

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ
) INHERITS (audit);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens (user_id);
