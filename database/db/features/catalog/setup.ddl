-- =============================================================
-- catalog — categories, products, product variants
-- setup.ddl — tables, constraints, indexes
-- All tables inherit audit columns via INHERITS (audit).
-- =============================================================

CREATE TABLE IF NOT EXISTS category (
    id        SERIAL PRIMARY KEY,
    slug      TEXT NOT NULL UNIQUE,
    name_en   TEXT NOT NULL,
    name_ar   TEXT NOT NULL,
    parent_id INTEGER REFERENCES category (id)
) INHERITS (audit);

CREATE TABLE IF NOT EXISTS product (
    id             SERIAL PRIMARY KEY, 
    sku            TEXT NOT NULL UNIQUE,
    name_en        TEXT NOT NULL,
    name_ar        TEXT NOT NULL,
    description_en TEXT,
    description_ar TEXT,
    category_id    INTEGER NOT NULL REFERENCES category (id),
    brand          TEXT NOT NULL,
    unit           TEXT NOT NULL,
    kind           TEXT NOT NULL DEFAULT 'finished'
                   CHECK (kind IN ('raw', 'finished')),
    is_active      BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_at     TIMESTAMPTZ
) INHERITS (audit);

CREATE TABLE IF NOT EXISTS product_variant (
    id         SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES product (id) ON DELETE CASCADE,
    size       NUMERIC(12, 2) NOT NULL,
    unit       TEXT NOT NULL,
    packaging  TEXT NOT NULL
) INHERITS (audit);

CREATE TABLE IF NOT EXISTS product_media (
    id         SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES product (id) ON DELETE CASCADE,
    kind       TEXT NOT NULL CHECK (kind IN ('image', 'video')),
    url        TEXT NOT NULL,
    title      TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0
) INHERITS (audit);

CREATE INDEX IF NOT EXISTS idx_products_category ON product (category_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON product (sku);
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variant (product_id);
CREATE INDEX IF NOT EXISTS idx_product_media_product ON product_media (product_id);
