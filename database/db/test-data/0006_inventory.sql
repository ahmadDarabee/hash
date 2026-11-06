-- =============================================================
-- 0006_inventory.sql — stock items and append-only movements.
--
-- Raw concentrates live in WH-01, finished goods in WH-02.
-- =============================================================

INSERT INTO inventory_item
    (id, product_id, location, qty_on_hand, qty_reserved, reorder_level)
VALUES
    (1,  1,  'WH-01', 1200, 200, 300),
    (2,  2,  'WH-02', 350,  40,  80),
    (3,  3,  'WH-01', 800,  100, 200),
    (4,  4,  'WH-02', 500,  60,  120),
    (5,  5,  'WH-02', 420,  50,  100),
    (6,  6,  'WH-01', 300,  40,  80),
    (7,  7,  'WH-01', 1500, 250, 400),
    (8,  8,  'WH-01', 900,  150, 250),
    (9,  9,  'WH-02', 260,  30,  60),
    (10, 10, 'WH-02', 600,  70,  150),
    (11, 11, 'WH-01', 700,  90,  180),
    (12, 12, 'WH-02', 380,  45,  90),
    (13, 13, 'WH-01', 540,  60,  120),
    (14, 14, 'WH-02', 300,  35,  70),
    (15, 15, 'WH-02', 220,  25,  50),
    (16, 16, 'WH-01', 640,  80,  160),
    (17, 17, 'WH-01', 1200, 160, 300),
    (18, 18, 'WH-02', 460,  55,  110),
    (19, 19, 'WH-02', 520,  65,  130),
    (20, 20, 'WH-01', 360,  45,  90)
ON CONFLICT (id) DO NOTHING;

SELECT setval('inventory_item_id_seq', (SELECT MAX(id) FROM inventory_item));

INSERT INTO inventory_movement (id, inventory_item_id, type, qty, reason, ref_id) VALUES
    (1, 1,  'in',     1400, 'Initial stock receipt',   NULL),
    (2, 1,  'out',    200,  'Sales order #1001',       1001),
    (3, 7,  'in',     1600, 'Initial stock receipt',   NULL),
    (4, 7,  'out',    100,  'Sales order #1002',       1002),
    (5, 10, 'in',     650,  'Initial stock receipt',   NULL),
    (6, 10, 'out',    50,   'Sales order #1003',       1003),
    (7, 19, 'in',     560,  'Initial stock receipt',   NULL),
    (8, 4,  'out',    20,   'Damaged stock write-off', NULL),
    (9, 17, 'adjust', 50,   'Cycle count adjustment',  NULL)
ON CONFLICT (id) DO NOTHING;

SELECT setval('inventory_movement_id_seq', (SELECT MAX(id) FROM inventory_movement));
