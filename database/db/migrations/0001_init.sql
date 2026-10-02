-- 0001_init.sql
-- Hash initial schema. Idempotent where possible (CREATE ... IF NOT EXISTS).
-- Money is NUMERIC(12,2). Timestamps are TIMESTAMPTZ defaulting to NOW().

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- Reference tables
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS languages (
    code    TEXT PRIMARY KEY CHECK (code IN ('ar', 'en')),
    name_en TEXT NOT NULL,
    name_ar TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS roles (
    id         SERIAL PRIMARY KEY,
    name       TEXT NOT NULL UNIQUE CHECK (name IN ('admin', 'customer_b2b', 'customer_b2c')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
    id         SERIAL PRIMARY KEY,
    slug       TEXT NOT NULL UNIQUE,
    name_en    TEXT NOT NULL,
    name_ar    TEXT NOT NULL,
    parent_id  INTEGER REFERENCES categories (id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- Users & auth
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS users (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email              TEXT NOT NULL UNIQUE,
    password_hash      TEXT NOT NULL,
    role_id            INTEGER NOT NULL REFERENCES roles (id),
    customer_type      TEXT NOT NULL CHECK (customer_type IN ('b2c', 'b2b')),
    company_name       TEXT,
    preferred_language TEXT NOT NULL DEFAULT 'ar' CHECK (preferred_language IN ('ar', 'en')),
    is_active          BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_at         TIMESTAMPTZ,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users (role_id);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens (user_id);

-- ---------------------------------------------------------------------------
-- Catalog
-- ---------------------------------------------------------------------------

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
    kind           TEXT NOT NULL DEFAULT 'finished' CHECK (kind IN ('raw', 'finished')),
    is_active      BOOLEAN NOT NULL DEFAULT TRUE,
    deleted_at     TIMESTAMPTZ,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products (sku);

CREATE TABLE IF NOT EXISTS product_variants (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products (id) ON DELETE CASCADE,
    size       NUMERIC(12, 2) NOT NULL,
    unit       TEXT NOT NULL,
    packaging  TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants (product_id);

-- ---------------------------------------------------------------------------
-- Pricing
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS price_lists (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    customer_id UUID REFERENCES users (id),
    is_default  BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_price_lists_customer ON price_lists (customer_id);

CREATE TABLE IF NOT EXISTS price_list_items (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    price_list_id UUID NOT NULL REFERENCES price_lists (id) ON DELETE CASCADE,
    product_id    UUID NOT NULL REFERENCES products (id) ON DELETE CASCADE,
    price         NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    currency      CHAR(3) NOT NULL DEFAULT 'SAR',
    min_qty       NUMERIC(12, 2) NOT NULL DEFAULT 1 CHECK (min_qty >= 1),
    discount_pct  NUMERIC(5, 2) NOT NULL DEFAULT 0 CHECK (discount_pct >= 0 AND discount_pct <= 100),
    UNIQUE (price_list_id, product_id, min_qty)
);

CREATE INDEX IF NOT EXISTS idx_price_list_items_list ON price_list_items (price_list_id);
CREATE INDEX IF NOT EXISTS idx_price_list_items_product ON price_list_items (product_id);

-- ---------------------------------------------------------------------------
-- Inventory (raw + finished goods share one table, distinguished by products.kind)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS inventory_items (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id    UUID NOT NULL REFERENCES products (id) ON DELETE CASCADE,
    location      TEXT NOT NULL,
    qty_on_hand   NUMERIC(12, 2) NOT NULL DEFAULT 0,
    qty_reserved  NUMERIC(12, 2) NOT NULL DEFAULT 0,
    reorder_level NUMERIC(12, 2) NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_items_product ON inventory_items (product_id);

CREATE TABLE IF NOT EXISTS inventory_movements (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventory_item_id UUID NOT NULL REFERENCES inventory_items (id) ON DELETE CASCADE,
    type              TEXT NOT NULL CHECK (type IN ('in', 'out', 'adjust')),
    qty               NUMERIC(12, 2) NOT NULL,
    reason            TEXT,
    ref_id            UUID,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_movements_item ON inventory_movements (inventory_item_id);

-- ---------------------------------------------------------------------------
-- Compliance (SDS / MSDS)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS sds_documents (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id     UUID NOT NULL REFERENCES products (id) ON DELETE CASCADE,
    language       TEXT NOT NULL CHECK (language IN ('ar', 'en')),
    version        TEXT NOT NULL,
    file_url       TEXT NOT NULL,
    issued_at      DATE NOT NULL DEFAULT CURRENT_DATE,
    revision_notes TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sds_documents_product ON sds_documents (product_id);

CREATE TABLE IF NOT EXISTS safety_warnings (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products (id) ON DELETE CASCADE,
    language   TEXT NOT NULL CHECK (language IN ('ar', 'en')),
    severity   TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'danger')),
    text       TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_safety_warnings_product ON safety_warnings (product_id);

-- ---------------------------------------------------------------------------
-- Orders (minimal v1, no payment yet)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS orders (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users (id),
    status     TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'confirmed', 'fulfilled', 'cancelled')),
    total      NUMERIC(12, 2) NOT NULL DEFAULT 0,
    currency   CHAR(3) NOT NULL DEFAULT 'SAR',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders (user_id);

CREATE TABLE IF NOT EXISTS order_items (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id   UUID NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products (id),
    qty        NUMERIC(12, 2) NOT NULL,
    unit_price NUMERIC(12, 2) NOT NULL,
    line_total NUMERIC(12, 2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items (order_id);

-- ---------------------------------------------------------------------------
-- Quotes (B2B quote requests)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS quote_requests (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID REFERENCES users (id),
    contact_name  TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    company_name  TEXT,
    notes         TEXT,
    status        TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'responded', 'closed')),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quote_requests_user ON quote_requests (user_id);
