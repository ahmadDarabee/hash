-- =============================================================
-- seed.sql — apply all test-data files in dependency order.
--
-- Run with:  psql -f db/test-data/seed.sql
-- (from the database/ directory, or use the README command).
-- =============================================================
BEGIN;


\ir 0001_languages.sql
\ir 0002_categories.sql
\ir 0003_products.sql
\ir 0004_product_variants.sql
\ir 0005_pricing.sql
\ir 0006_inventory.sql
\ir 0007_compliance.sql
\ir 0008_users.sql
\ir 0009_product_media.sql

COMMIT;