

CREATE TABLE IF NOT EXISTS login(
    id              SERIAL NOT NULL PRIMARY KEY,
    subject         TEXT NOT NULL UNIQUE,
    email_verified  BOOLEAN NOT NULL DEFAULT FALSE,
    email           TEXT NOT NULL, 
    first_name      TEXT, 
    last_name       TEXT,
    last_seen       TIMESTAMP WITHOUT TIMEZONE
) INHERITS(audit);


-- CREATE TABLE IF NOT EXISTS api_log(
--     id              BIGSERIAL NOT NULL PRIMARY KEY,
--     login_id        INT NOT NULL REFERENCES login,
--     source_ip       INET,
--     method          TEXT,
--     path            TEXT NOT NULL,
--     descr           TEXT NOT NULL,
--     payload         JSONB

-- )INHERITS(audit);

-- CREATE INDEX ON api_log(created_date);
-- CREATE INDEX ON api_log(path);
-- CREATE INDEX ON api_log(login_id);

CREATE TABLE IF NOT EXISTS user (
   id              SERIAL NOT NULL PRIMARY KEY,
   first_name      TEXT,
   last_name       TEXT,
   email           NOT NULL,
   phone           TEXT,              
   is_active       BOOLEAN NOT NULL DEFAULT TRUE, 
) INHERITS(audit);

CREATE TABLE IF NOT EXISTS product(
    product_id      SERIAL NOT NULL PRIMARY KEY,
    product_name    TEXT NOT NULL,
    stock           BOOLEAN NOT NULL,
    brand           TEXT,
    MRP             FLOAT,
)INHERITS(audit);

CREATE TABLE IF NOT EXISTS product_type(
    name            TEXT NOT NULL PRIMARY KEY,
)INHERITS(audit);



CREATE TABLE schema_delta (
    commit_id       TEXT PRIMARY KEY NOT NULL,
);

COMMENT ON TABLE schema_delta IS
'this table used to store information about schema deltas that have been applied.';