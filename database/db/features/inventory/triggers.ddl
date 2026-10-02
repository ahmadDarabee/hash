-- =============================================================
-- inventory — stock items and append-only movements
-- triggers.ddl — table triggers
-- =============================================================

CREATE OR REPLACE TRIGGER trg_inventory_items_set_updated_at
    BEFORE UPDATE ON inventory_items
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
