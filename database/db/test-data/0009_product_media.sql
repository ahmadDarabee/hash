-- =============================================================
-- 0009_product_media.sql — product photos and videos.
--
-- `kind` is 'image' or 'video'. URLs here are public placeholder
-- assets (picsum.photos images + Google sample videos) so the gallery
-- renders out of the box; swap them for `/files/...` URLs or your CDN
-- when real media is available.
-- =============================================================

INSERT INTO product_media (id, product_id, kind, url, title, sort_order) VALUES
    -- Heavy-Duty Floor Detergent
    (1, 1, 'image', 'https://picsum.photos/seed/hash-dethd100-1/1200/900', 'Heavy-Duty Floor Detergent — packaging', 0),
    (2, 1, 'image', 'https://picsum.photos/seed/hash-dethd100-2/1200/900', 'Heavy-Duty Floor Detergent — in use', 1),
    (3, 1, 'video', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 'Application demo', 2),

    -- Industrial Heavy-Duty Degreaser
    (4, 7, 'image', 'https://picsum.photos/seed/hash-degdg900-1/1200/900', 'Industrial Degreaser — drum', 0),
    (5, 7, 'image', 'https://picsum.photos/seed/hash-degdg900-2/1200/900', 'Degreaser — before / after', 1),
    (6, 7, 'image', 'https://picsum.photos/seed/hash-degdg900-3/1200/900', 'Parts cleaning', 2),
    (7, 7, 'video', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 'Degreasing process', 3),

    -- Quaternary Ammonium Sanitizer
    (8, 4, 'image', 'https://picsum.photos/seed/hash-sanqs200-1/1200/900', 'Sanitizer — bottle', 0),
    (9, 4, 'image', 'https://picsum.photos/seed/hash-sanqs200-2/1200/900', 'Surface application', 1),

    -- Liquid Hand Soap
    (10, 10, 'image', 'https://picsum.photos/seed/hash-soaphs100-1/1200/900', 'Hand soap dispenser', 0),

    -- Surface Disinfectant
    (11, 19, 'image', 'https://picsum.photos/seed/hash-disdi500-1/1200/900', 'Disinfectant — bottle', 0),
    (12, 19, 'video', 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 'Disinfection demo', 1)
ON CONFLICT (id) DO NOTHING;

SELECT setval('product_media_id_seq', (SELECT MAX(id) FROM product_media));
