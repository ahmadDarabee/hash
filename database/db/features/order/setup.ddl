-- =============================================================
-- order — order and line items (minimal v1, no payment yet)
-- setup.ddl — tables, constraints, indexes
-- All tables inherit audit columns via INHERITS (audit).
-- =============================================================

-- CREATE TABLE IF NOT EXISTS order (
--     id       SERIAL PRIMARY KEY,
--     user_id  INTEGER NOT NULL REFERENCES acl_user (id),
--     status   TEXT NOT NULL DEFAULT 'draft'
--              CHECK (status IN ('draft', 'confirmed', 'fulfilled', 'cancelled')),
--     total    NUMERIC(12, 2) NOT NULL DEFAULT 0,
--     currency CHAR(3) NOT NULL DEFAULT 'SAR'
-- ) INHERITS (audit);

-- CREATE TABLE IF NOT EXISTS order_item (
--     id         SERIAL PRIMARY KEY,
--     order_id   INTEGER NOT NULL REFERENCES "order" (id) ON DELETE CASCADE,
--     product_id INTEGER NOT NULL REFERENCES product (id),
--     qty        NUMERIC(12, 2) NOT NULL,
--     unit_price NUMERIC(12, 2) NOT NULL,
--     line_total NUMERIC(12, 2) NOT NULL
-- ) INHERITS (audit);

-- CREATE INDEX IF NOT EXISTS idx_orders_user ON "order" (user_id);
-- CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_item (order_id);
