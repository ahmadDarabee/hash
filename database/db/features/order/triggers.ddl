-- =============================================================
-- order — orders and line items
-- triggers.ddl — table triggers
-- =============================================================

CREATE OR REPLACE TRIGGER trg_orders_set_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
