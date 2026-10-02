-- =============================================================
-- 0001_initial.sql — initial schema (v1)
--
-- Applies the full schema in dependency order using psql \ir includes.
-- All files are idempotent (CREATE ... IF NOT EXISTS, CREATE OR REPLACE),
-- so this migration is safe to re-run.
--
-- Run with:  psql -f schema-migrations/0001_initial.sql
-- (or:        make migrate)
-- =============================================================

\ir ../create.ddl

\ir ../common/functions.ddl
\ir ../common/setup.ddl
\ir ../common/views.ddl

\ir ../features/app_user/functions.ddl
\ir ../features/app_user/setup.ddl
\ir ../features/app_user/triggers.ddl
\ir ../features/app_user/views.ddl

\ir ../features/auth/functions.ddl
\ir ../features/auth/setup.ddl
\ir ../features/auth/triggers.ddl
\ir ../features/auth/views.ddl

\ir ../features/catalog/functions.ddl
\ir ../features/catalog/setup.ddl
\ir ../features/catalog/triggers.ddl
\ir ../features/catalog/views.ddl

\ir ../features/pricing/functions.ddl
\ir ../features/pricing/setup.ddl
\ir ../features/pricing/triggers.ddl
\ir ../features/pricing/views.ddl

\ir ../features/inventory/functions.ddl
\ir ../features/inventory/setup.ddl
\ir ../features/inventory/triggers.ddl
\ir ../features/inventory/views.ddl

\ir ../features/compliance/functions.ddl
\ir ../features/compliance/setup.ddl
\ir ../features/compliance/triggers.ddl
\ir ../features/compliance/views.ddl

\ir ../features/order/functions.ddl
\ir ../features/order/setup.ddl
\ir ../features/order/triggers.ddl
\ir ../features/order/views.ddl

\ir ../features/quote/functions.ddl
\ir ../features/quote/setup.ddl
\ir ../features/quote/triggers.ddl
\ir ../features/quote/views.ddl

\ir ../common/triggers.ddl
