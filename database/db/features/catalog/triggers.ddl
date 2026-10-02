-- =============================================================
-- catalog — categories, products, product variants
-- triggers.ddl — table triggers
-- =============================================================

CREATE OR REPLACE TRIGGER trg_products_set_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
