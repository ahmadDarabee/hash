-- =============================================================
-- common — shared objects used across features
-- functions.ddl — shared functions (applied before feature setup)
-- =============================================================

-- Keep a row's updated_at column fresh on every UPDATE.
CREATE OR REPLACE FUNCTION set_updated_at_tg()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;
