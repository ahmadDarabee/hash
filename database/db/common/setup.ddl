CREATE TABLE IF NOT EXISTS audit(
    created_date    TIMESTAMP WITHOUT TIMEZONE NOT NULL DEFAULT NOW(),
    created_by      TEXT NOT NULL DEFAULT 'system',
    updated_date    TIMESTAMP WITHOUT TIMEZONE,
    updated_by      TEXT,
);
