-- =============================================================
-- common — shared objects used across features
-- triggers.ddl — shared triggers (applied last, after all features)
-- =============================================================
DO $$ 
DECLARE
    _table_name TEXT;
BEGIN
    FOR _table_name IN (
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE format(
            'CREATE TRIGGER _0_100_%I_set_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION set_updated_at_tg();', 
            _table_name, 
            _table_name
        );
    END LOOP;
END $$;