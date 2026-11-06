-- =============================================================
-- inventory — stock items and append-only movements
-- Raw materials and finished goods share inventory_items; the product's
-- `kind` column distinguishes them.
-- setup.ddl — tables, constraints, indexes
-- All tables inherit audit columns via INHERITS (audit).
-- =============================================================

CREATE TABLE IF NOT EXISTS inventory_item (
    id            SERIAL PRIMARY KEY,
    product_id    INTEGER NOT NULL REFERENCES product (id) ON DELETE CASCADE,
    location      TEXT NOT NULL,
    qty_on_hand   NUMERIC(12, 2) NOT NULL DEFAULT 0,
    qty_reserved  NUMERIC(12, 2) NOT NULL DEFAULT 0,
    reorder_level NUMERIC(12, 2) NOT NULL DEFAULT 0
) INHERITS (audit);

CREATE TABLE IF NOT EXISTS inventory_movement (
    id                SERIAL PRIMARY KEY,
    inventory_item_id INTEGER NOT NULL REFERENCES inventory_item (id) ON DELETE CASCADE,
    type              TEXT NOT NULL CHECK (type IN ('in', 'out', 'adjust')),
    qty               NUMERIC(12, 2) NOT NULL,
    reason            TEXT,
    ref_id            INTEGER
) INHERITS (audit);

CREATE INDEX IF NOT EXISTS idx_inventory_items_product ON inventory_item (product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_item ON inventory_movement (inventory_item_id);
