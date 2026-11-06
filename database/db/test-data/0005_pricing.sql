-- =============================================================
-- 0005_pricing.sql — price lists and per-product price entries.
--
-- Two lists: a default retail list and a B2B wholesale list with a
-- 15% discount and a minimum order quantity of 20 units.
-- =============================================================

INSERT INTO price_list (id, name, customer_id, is_default) VALUES
    (1, 'Default Retail (SAR)', NULL, TRUE),
    (2, 'B2B Wholesale (SAR)',  NULL, FALSE)
ON CONFLICT (id) DO NOTHING;

SELECT setval('price_list_id_seq', (SELECT MAX(id) FROM price_list));

-- price_list_item: (id, price_list_id, product_id, price, currency, min_qty, discount_pct)
INSERT INTO price_list_item
    (id, price_list_id, product_id, price, currency, min_qty, discount_pct)
VALUES
    -- Default retail (min_qty 1, no discount)
    (1,  1, 1,  240.00, 'SAR', 1, 0),
    (2,  1, 2,  85.00,  'SAR', 1, 0),
    (3,  1, 3,  310.00, 'SAR', 1, 0),
    (4,  1, 4,  120.00, 'SAR', 1, 0),
    (5,  1, 5,  95.00,  'SAR', 1, 0),
    (6,  1, 6,  380.00, 'SAR', 1, 0),
    (7,  1, 7,  520.00, 'SAR', 1, 0),
    (8,  1, 8,  260.00, 'SAR', 1, 0),
    (9,  1, 9,  140.00, 'SAR', 1, 0),
    (10, 1, 10, 55.00,  'SAR', 1, 0),
    (11, 1, 11, 290.00, 'SAR', 1, 0),
    (12, 1, 12, 45.00,  'SAR', 1, 0),
    (13, 1, 13, 210.00, 'SAR', 1, 0),
    (14, 1, 14, 65.00,  'SAR', 1, 0),
    (15, 1, 15, 130.00, 'SAR', 1, 0),
    (16, 1, 16, 230.00, 'SAR', 1, 0),
    (17, 1, 17, 180.00, 'SAR', 1, 0),
    (18, 1, 18, 75.00,  'SAR', 1, 0),
    (19, 1, 19, 110.00, 'SAR', 1, 0),
    (20, 1, 20, 340.00, 'SAR', 1, 0),

    -- B2B wholesale (min_qty 20, 15% off retail)
    (21, 2, 1,  204.00, 'SAR', 20, 15),
    (22, 2, 2,  72.25,  'SAR', 20, 15),
    (23, 2, 3,  263.50, 'SAR', 20, 15),
    (24, 2, 4,  102.00, 'SAR', 20, 15),
    (25, 2, 5,  80.75,  'SAR', 20, 15),
    (26, 2, 6,  323.00, 'SAR', 20, 15),
    (27, 2, 7,  442.00, 'SAR', 20, 15),
    (28, 2, 8,  221.00, 'SAR', 20, 15),
    (29, 2, 9,  119.00, 'SAR', 20, 15),
    (30, 2, 10, 46.75,  'SAR', 20, 15),
    (31, 2, 11, 246.50, 'SAR', 20, 15),
    (32, 2, 12, 38.25,  'SAR', 20, 15),
    (33, 2, 13, 178.50, 'SAR', 20, 15),
    (34, 2, 14, 55.25,  'SAR', 20, 15),
    (35, 2, 15, 110.50, 'SAR', 20, 15),
    (36, 2, 16, 195.50, 'SAR', 20, 15),
    (37, 2, 17, 153.00, 'SAR', 20, 15),
    (38, 2, 18, 63.75,  'SAR', 20, 15),
    (39, 2, 19, 93.50,  'SAR', 20, 15),
    (40, 2, 20, 289.00, 'SAR', 20, 15)
ON CONFLICT (id) DO NOTHING;

SELECT setval('price_list_item_id_seq', (SELECT MAX(id) FROM price_list_item));
