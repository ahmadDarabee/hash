-- =============================================================
-- app_user — identity & access: roles, languages, users
-- setup.ddl — tables, constraints, indexes
-- All tables inherit audit columns via INHERITS (audit).
-- =============================================================

CREATE TABLE IF NOT EXISTS user (
    id                 SERIAL INT PRIMARY KEY,
    email              TEXT NOT NULL UNIQUE,
    password           TEXT NOT NULL,
    company_name       TEXT,
    preferred_language TEXT NOT NULL DEFAULT 'ar'
                       CHECK (preferred_language IN ('ar', 'en')),
    is_active          BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_at         TIMESTAMPTZ
) INHERITS (audit);

CREATE TABLE IF NOT EXISTS privilege (
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    name TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS group (
    name TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS groups_privilege (
    group_name TEXT REFERENCES groups (name),
    privilege_name TEXT REFERENCES privileges (name),
    PRIMARY KEY (group_name, privilege_name)
) INHERITS (audit);

CREATE TABLE IF NOT EXISTS users_group (
    user_id UUID REFERENCES users (id),
    group_name TEXT REFERENCES groups (name),
    PRIMARY KEY (user_id, group_name)
) INHERITS (audit);

CREATE TABLE IF NOT EXISTS language (
    code    TEXT PRIMARY KEY CHECK (code IN ('ar', 'en')),
    name_en TEXT NOT NULL,
    name_ar TEXT NOT NULL
) INHERITS (audit);