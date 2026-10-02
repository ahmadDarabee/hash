-- =============================================================
-- app_user — identity & access: roles, languages, users
-- triggers.ddl — table triggers
-- =============================================================

CREATE OR REPLACE TRIGGER trg_users_set_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
