-- =============================================================
-- app_user — identity & access: roles, languages, users
-- setup.ddl — tables, constraints, indexes
-- All tables inherit audit columns via INHERITS (audit).
-- =============================================================

CREATE TABLE IF NOT EXISTS roles (
    id   SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
         CHECK (name IN ('admin', 'customer_b2b', 'customer_b2c'))
) INHERITS (audit);

CREATE TABLE IF NOT EXISTS languages (
    code    TEXT PRIMARY KEY CHECK (code IN ('ar', 'en')),
    name_en TEXT NOT NULL,
    name_ar TEXT NOT NULL
) INHERITS (audit);

CREATE TABLE IF NOT EXISTS users (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email              TEXT NOT NULL UNIQUE,
    password_hash      TEXT NOT NULL,
    role_id            INTEGER NOT NULL REFERENCES roles (id),
    customer_type      TEXT NOT NULL CHECK (customer_type IN ('b2c', 'b2b')),
    company_name       TEXT,
    preferred_language TEXT NOT NULL DEFAULT 'ar'
                       CHECK (preferred_language IN ('ar', 'en')),
    is_active          BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_at         TIMESTAMPTZ
) INHERITS (audit);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role_id);
