-- =============================================================
-- pricing — price lists and per-product price entries
-- setup.ddl — tables, constraints, indexes
-- All tables inherit audit columns via INHERITS (audit).
-- =============================================================

CREATE TABLE IF NOT EXISTS price_lists (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    customer_id UUID REFERENCES users (id),
    is_default  BOOLEAN NOT NULL DEFAULT FALSE
) INHERITS (audit);

CREATE TABLE IF NOT EXISTS price_list_items (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    price_list_id UUID NOT NULL REFERENCES price_lists (id) ON DELETE CASCADE,
    product_id    UUID NOT NULL REFERENCES products (id) ON DELETE CASCADE,
    price         NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    currency      CHAR(3) NOT NULL DEFAULT 'SAR',
    min_qty       NUMERIC(12, 2) NOT NULL DEFAULT 1 CHECK (min_qty >= 1),
    discount_pct  NUMERIC(5, 2) NOT NULL DEFAULT 0
                  CHECK (discount_pct >= 0 AND discount_pct <= 100),
    UNIQUE (price_list_id, product_id, min_qty)
) INHERITS (audit);

CREATE INDEX IF NOT EXISTS idx_price_lists_customer ON price_lists (customer_id);
CREATE INDEX IF NOT EXISTS idx_price_list_items_list ON price_list_items (price_list_id);
CREATE INDEX IF NOT EXISTS idx_price_list_items_product ON price_list_items (product_id);
