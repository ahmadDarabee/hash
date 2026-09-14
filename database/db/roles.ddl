-- Initialize Roles
-- \set read_only_role_name user_read_only

-- SET search_path TO public;

-- -- Create the role only if it doesn't already exist.
-- SELECT format(
--          'CREATE ROLE %I WITH NOSUPERUSER NOLOGIN NOREPLICATION NOCREATEROLE NOCREATEDB',
--          :'read_only_role_name'
--        )
-- WHERE NOT EXISTS (
--     SELECT 1 FROM pg_catalog.pg_roles
--     WHERE rolname = :'read_only_role_name'
-- )
-- \gexec

-- -- Revoke anything (idempotent), then grant the read-only rights.
-- REVOKE ALL PRIVILEGES ON ALL TABLES    IN SCHEMA public FROM :"read_only_role_name";
-- REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM :"read_only_role_name";

-- GRANT  USAGE          ON SCHEMA public TO   :"read_only_role_name";
-- GRANT  SELECT         ON ALL TABLES    IN SCHEMA public TO   :"read_only_role_name";

-- -- Future tables/sequences created in this schema will also be readable.
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO :"read_only_role_name";
