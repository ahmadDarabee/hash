-- =============================================================
-- app_user — identity & access: roles, languages, users
-- setup.ddl — tables, constraints, indexes
-- All tables inherit audit columns via INHERITS (audit).
-- =============================================================

CREATE TABLE IF NOT EXISTS acl_user (
    id                 SERIAL PRIMARY KEY,
    email              TEXT NOT NULL UNIQUE,
    password           TEXT NOT NULL,
    company_name       TEXT,
    preferred_language TEXT NOT NULL DEFAULT 'ar'
                       CHECK (preferred_language IN ('ar', 'en')),
    is_active          BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_at         TIMESTAMPTZ
) INHERITS (audit);

CREATE TABLE IF NOT EXISTS acl_privilege (
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    name TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS acl_group (
    name TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS acl_group_privilege (
    group_name TEXT REFERENCES acl_group (name),
    privilege_name TEXT REFERENCES acl_privilege (name),
    PRIMARY KEY (group_name, privilege_name)
) INHERITS (audit);

CREATE TABLE IF NOT EXISTS acl_user_group (
    user_id INT REFERENCES acl_user (id),
    group_name TEXT REFERENCES acl_group (name),
    PRIMARY KEY (user_id, group_name)
) INHERITS (audit);

CREATE TABLE IF NOT EXISTS language (
    code    TEXT PRIMARY KEY CHECK (code IN ('ar', 'en')),
    name_en TEXT NOT NULL,
    name_ar TEXT NOT NULL
) INHERITS (audit);