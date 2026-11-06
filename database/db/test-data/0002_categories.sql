-- =============================================================
-- 0002_categories.sql — product categories.
--
-- Explicit ids keep the primary four categories stable (1–4), which the
-- frontend's product-intelligence fallback relies on:
--   1 detergents, 2 sanitizers, 3 degreasers, 4 soaps
-- =============================================================

INSERT INTO category (id, slug, name_en, name_ar, parent_id) VALUES
    (1, 'detergents',    'Detergents',            'منظفات',                 NULL),
    (2, 'sanitizers',    'Sanitizers',            'معقمات',                 NULL),
    (3, 'degreasers',    'Industrial Degreasers', 'مزيلات الشحوم الصناعية', NULL),
    (4, 'soaps',         'Soaps',                 'صابون',                  NULL),
    (5, 'descalers',     'Descalers',             'مزيلات الترسبات',        NULL),
    (6, 'floor-care',    'Floor Care',            'العناية بالأرضيات',      NULL),
    (7, 'laundry',       'Laundry Care',          'العناية بالغسيل',        NULL),
    (8, 'disinfectants', 'Disinfectants',         'مطهرات',                 NULL)
ON CONFLICT (id) DO NOTHING;

-- Keep the identity sequence ahead of any explicit ids.
SELECT setval('category_id_seq', (SELECT MAX(id) FROM category));
