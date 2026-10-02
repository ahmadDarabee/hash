-- =============================================================
-- inventory — stock items and append-only movements
-- Raw materials and finished goods share inventory_items; the product's
-- `kind` column distinguishes them.
-- setup.ddl — tables, constraints, indexes
-- All tables inherit audit columns via INHERITS (audit).
-- =============================================================

CREATE TABLE IF NOT EXISTS inventory_items (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id    UUID NOT NULL REFERENCES products (id) ON DELETE CASCADE,
    location      TEXT NOT NULL,
    qty_on_hand   NUMERIC(12, 2) NOT NULL DEFAULT 0,
    qty_reserved  NUMERIC(12, 2) NOT NULL DEFAULT 0,
    reorder_level NUMERIC(12, 2) NOT NULL DEFAULT 0
) INHERITS (audit);

CREATE TABLE IF NOT EXISTS inventory_movements (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inventory_item_id UUID NOT NULL REFERENCES inventory_items (id) ON DELETE CASCADE,
    type              TEXT NOT NULL CHECK (type IN ('in', 'out', 'adjust')),
    qty               NUMERIC(12, 2) NOT NULL,
    reason            TEXT,
    ref_id            UUID
) INHERITS (audit);

CREATE INDEX IF NOT EXISTS idx_inventory_items_product ON inventory_items (product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_item ON inventory_movements (inventory_item_id);
