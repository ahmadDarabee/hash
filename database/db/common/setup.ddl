CREATE TABLE IF NOT EXISTS audit(
    created_date    TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    created_by      TEXT NOT NULL DEFAULT 'system',
    updated_date    TIMESTAMP WITHOUT TIME ZONE,
    updated_by      TEXT
);
