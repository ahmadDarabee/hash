-- Initialize Roles -- -*- sql -*-
\set read_only_role_name user_read_only


set search_path TO public;


-- This role used for read only purposes--
DO 
$do$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_catalog.pg_roles
        WHERE rolname = :'read_only_role_name') THEN
            CREATE ROLE :'read_only_role_name'
                WITH NOSUPERUSER NOLOGIN NOREPLICATION NOCREATEROLE NOCREATEDB;
    END IF;
END
$do$;

REVOKE ALL PRIVILEGES ON ALL TABLE IN SCHEMA public FROM :'read_only_role_name'

GRANT SELECT ON TABLE
    --ADD ALL NEEDED TABLES--
    TO :'read_only_role_name';