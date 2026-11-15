-- =============================================================
-- pricing — price lists and per-product price entries
-- functions.ddl — feature functions (none required for v1)
-- =============================================================

CREATE OR REPLACE FUNCTION get_price(
    v_user_id INTEGER,
    p_product_id INTEGER,
    p_qty NUMERIC
) RETURNS price_list_item AS $$
BEGIN

END;
$$ LANGUAGE plpgsql;