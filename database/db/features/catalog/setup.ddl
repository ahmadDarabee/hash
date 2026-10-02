-- =============================================================
-- catalog — categories, products, product variants
-- setup.ddl — tables, constraints, indexes
-- All tables inherit audit columns via INHERITS (audit).
-- =============================================================

CREATE TABLE IF NOT EXISTS categories (
    id        SERIAL PRIMARY KEY,
    slug      TEXT NOT NULL UNIQUE,
    name_en   TEXT NOT NULL,
    name_ar   TEXT NOT NULL,
    parent_id INTEGER REFERENCES categories (id)
) INHERITS (audit);

CREATE TABLE IF NOT EXISTS products (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku            TEXT NOT NULL UNIQUE,
    name_en        TEXT NOT NULL,
    name_ar        TEXT NOT NULL,
    description_en TEXT,
    description_ar TEXT,
    category_id    INTEGER NOT NULL REFERENCES categories (id),
    brand          TEXT NOT NULL,
    unit           TEXT NOT NULL,
    kind           TEXT NOT NULL DEFAULT 'finished'
                   CHECK (kind IN ('raw', 'finished')),
    is_active      BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_at     TIMESTAMPTZ
) INHERITS (audit);

CREATE TABLE IF NOT EXISTS product_variants (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products (id) ON DELETE CASCADE,
    size       NUMERIC(12, 2) NOT NULL,
    unit       TEXT NOT NULL,
    packaging  TEXT NOT NULL
) INHERITS (audit);

CREATE INDEX IF NOT EXISTS idx_products_category ON products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products (sku);
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants (product_id);
