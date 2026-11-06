-- =============================================================
-- 0004_product_variants.sql — packaging sizes per product.
--
-- product_variant has no natural unique key, so explicit ids are used
-- to keep the file idempotent (re-running skips existing rows).
-- =============================================================

INSERT INTO product_variant (id, product_id, size, unit, packaging) VALUES
    -- Heavy-Duty Floor Detergent (raw, L)
    (1,  1,  5.00,   'L',  'Jerrycan'),
    (2,  1,  20.00,  'L',  'Drum'),
    (3,  1,  200.00, 'L',  'Barrel'),
    -- Kitchen Degreaser Detergent (finished, L)
    (4,  2,  1.00,   'L',  'Bottle'),
    (5,  2,  5.00,   'L',  'Jerrycan'),
    (6,  2,  20.00,  'L',  'Drum'),
    -- Laundry Detergent Concentrate (raw, kg)
    (7,  3,  5.00,   'kg', 'Pail'),
    (8,  3,  25.00,  'kg', 'Bag'),
    (9,  3,  50.00,  'kg', 'Sack'),
    -- Quaternary Ammonium Sanitizer (finished, L)
    (10, 4,  1.00,   'L',  'Bottle'),
    (11, 4,  5.00,   'L',  'Jerrycan'),
    (12, 4,  20.00,  'L',  'Drum'),
    -- Alcohol Surface Sanitizer (finished, L)
    (13, 5,  1.00,   'L',  'Bottle'),
    (14, 5,  5.00,   'L',  'Jerrycan'),
    -- Peracetic Acid Sanitizer (raw, L)
    (15, 6,  5.00,   'L',  'Jerrycan'),
    (16, 6,  20.00,  'L',  'Drum'),
    (17, 6,  200.00, 'L',  'Barrel'),
    -- Industrial Heavy-Duty Degreaser (raw, L)
    (18, 7,  20.00,  'L',  'Drum'),
    (19, 7,  200.00, 'L',  'Barrel'),
    (20, 7,  1000.00,'L',  'IBC'),
    -- Metal Parts Degreaser (raw, L)
    (21, 8,  20.00,  'L',  'Drum'),
    (22, 8,  200.00, 'L',  'Barrel'),
    -- Enzyme Degreaser (finished, L)
    (23, 9,  1.00,   'L',  'Bottle'),
    (24, 9,  5.00,   'L',  'Jerrycan'),
    (25, 9,  20.00,  'L',  'Drum'),
    -- Liquid Hand Soap (finished, L)
    (26, 10, 1.00,   'L',  'Bottle'),
    (27, 10, 5.00,   'L',  'Jerrycan'),
    (28, 10, 20.00,  'L',  'Drum'),
    -- Liquid Soap Base (raw, kg)
    (29, 11, 5.00,   'kg', 'Pail'),
    (30, 11, 25.00,  'kg', 'Bag'),
    (31, 11, 50.00,  'kg', 'Sack'),
    -- Mild Skin Soap (finished, L)
    (32, 12, 1.00,   'L',  'Bottle'),
    (33, 12, 5.00,   'L',  'Jerrycan'),
    -- Industrial Acid Descaler (raw, L)
    (34, 13, 5.00,   'L',  'Jerrycan'),
    (35, 13, 20.00,  'L',  'Drum'),
    (36, 13, 200.00, 'L',  'Barrel'),
    -- Bathroom Descaler (finished, L)
    (37, 14, 1.00,   'L',  'Bottle'),
    (38, 14, 5.00,   'L',  'Jerrycan'),
    -- Floor Polish & Sealer (finished, L)
    (39, 15, 5.00,   'L',  'Jerrycan'),
    (40, 15, 20.00,  'L',  'Drum'),
    -- Floor Stripper (raw, L)
    (41, 16, 5.00,   'L',  'Jerrycan'),
    (42, 16, 20.00,  'L',  'Drum'),
    (43, 16, 200.00, 'L',  'Barrel'),
    -- Laundry Powder (raw, kg)
    (44, 17, 5.00,   'kg', 'Pail'),
    (45, 17, 25.00,  'kg', 'Bag'),
    (46, 17, 50.00,  'kg', 'Sack'),
    -- Fabric Softener (finished, L)
    (47, 18, 1.00,   'L',  'Bottle'),
    (48, 18, 5.00,   'L',  'Jerrycan'),
    (49, 18, 20.00,  'L',  'Drum'),
    -- Surface Disinfectant (finished, L)
    (50, 19, 1.00,   'L',  'Bottle'),
    (51, 19, 5.00,   'L',  'Jerrycan'),
    (52, 19, 20.00,  'L',  'Drum'),
    -- High-Level Disinfectant (raw, L)
    (53, 20, 5.00,   'L',  'Jerrycan'),
    (54, 20, 20.00,  'L',  'Drum'),
    (55, 20, 200.00, 'L',  'Barrel'),
    -- Legacy Floor Detergent (retired, finished, L)
    (56, 21, 5.00,   'L',  'Jerrycan')
ON CONFLICT (id) DO NOTHING;

SELECT setval('product_variant_id_seq', (SELECT MAX(id) FROM product_variant));
