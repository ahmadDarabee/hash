-- ===========================================================================
-- schema.ddl.sql — REFLECTED MASTER DDL
-- This file always represents the current full schema. It is regenerated from
-- the live database after every migration:
--   pg_dump --schema-only --no-owner --no-privileges $DATABASE_URL
-- (see database/db/Makefile `reflect` target).
-- Source of truth for authoring changes: database/db/migrations/NNNN_name.sql
-- ===========================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- Reference tables
-- ---------------------------------------------------------------------------

CREATE TABLE languages (
    code    text NOT NULL,
    name_en text NOT NULL,
    name_ar text NOT NULL
);

CREATE TABLE roles (
    id         integer NOT NULL,
    name       text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE categories (
    id         integer NOT NULL,
    slug       text NOT NULL,
    name_en    text NOT NULL,
    name_ar    text NOT NULL,
    parent_id  integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- ---------------------------------------------------------------------------
-- Users & auth
-- ---------------------------------------------------------------------------

CREATE TABLE users (
    id                 uuid DEFAULT gen_random_uuid() NOT NULL,
    email              text NOT NULL,
    password_hash      text NOT NULL,
    role_id            integer NOT NULL,
    customer_type      text NOT NULL,
    company_name       text,
    preferred_language text DEFAULT 'ar'::text NOT NULL,
    is_active          boolean DEFAULT true NOT NULL,
    deleted_at         timestamp with time zone,
    created_at         timestamp with time zone DEFAULT now() NOT NULL,
    updated_at         timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE refresh_tokens (
    id         uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id    uuid NOT NULL,
    token_hash text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    revoked_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- ---------------------------------------------------------------------------
-- Catalog
-- ---------------------------------------------------------------------------

CREATE TABLE products (
    id             uuid DEFAULT gen_random_uuid() NOT NULL,
    sku            text NOT NULL,
    name_en        text NOT NULL,
    name_ar        text NOT NULL,
    description_en text,
    description_ar text,
    category_id    integer NOT NULL,
    brand          text NOT NULL,
    unit           text NOT NULL,
    kind           text DEFAULT 'finished'::text NOT NULL,
    is_active      boolean DEFAULT true NOT NULL,
    deleted_at     timestamp with time zone,
    created_at     timestamp with time zone DEFAULT now() NOT NULL,
    updated_at     timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE product_variants (
    id         uuid DEFAULT gen_random_uuid() NOT NULL,
    product_id uuid NOT NULL,
    size       numeric(12, 2) NOT NULL,
    unit       text NOT NULL,
    packaging  text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- ---------------------------------------------------------------------------
-- Pricing
-- ---------------------------------------------------------------------------

CREATE TABLE price_lists (
    id          uuid DEFAULT gen_random_uuid() NOT NULL,
    name        text NOT NULL,
    customer_id uuid,
    is_default  boolean DEFAULT false NOT NULL,
    created_at  timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE price_list_items (
    id            uuid DEFAULT gen_random_uuid() NOT NULL,
    price_list_id uuid NOT NULL,
    product_id    uuid NOT NULL,
    price         numeric(12, 2) NOT NULL,
    currency      character(3) DEFAULT 'SAR'::bpchar NOT NULL,
    min_qty       numeric(12, 2) DEFAULT 1 NOT NULL,
    discount_pct  numeric(5, 2) DEFAULT 0 NOT NULL
);

-- ---------------------------------------------------------------------------
-- Inventory
-- ---------------------------------------------------------------------------

CREATE TABLE inventory_items (
    id            uuid DEFAULT gen_random_uuid() NOT NULL,
    product_id    uuid NOT NULL,
    location      text NOT NULL,
    qty_on_hand   numeric(12, 2) DEFAULT 0 NOT NULL,
    qty_reserved  numeric(12, 2) DEFAULT 0 NOT NULL,
    reorder_level numeric(12, 2) DEFAULT 0 NOT NULL,
    created_at    timestamp with time zone DEFAULT now() NOT NULL,
    updated_at    timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE inventory_movements (
    id                uuid DEFAULT gen_random_uuid() NOT NULL,
    inventory_item_id uuid NOT NULL,
    type              text NOT NULL,
    qty               numeric(12, 2) NOT NULL,
    reason            text,
    ref_id            uuid,
    created_at        timestamp with time zone DEFAULT now() NOT NULL
);

-- ---------------------------------------------------------------------------
-- Compliance (SDS / MSDS)
-- ---------------------------------------------------------------------------

CREATE TABLE sds_documents (
    id             uuid DEFAULT gen_random_uuid() NOT NULL,
    product_id     uuid NOT NULL,
    language       text NOT NULL,
    version        text NOT NULL,
    file_url       text NOT NULL,
    issued_at      date DEFAULT CURRENT_DATE NOT NULL,
    revision_notes text,
    created_at     timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE safety_warnings (
    id         uuid DEFAULT gen_random_uuid() NOT NULL,
    product_id uuid NOT NULL,
    language   text NOT NULL,
    severity   text NOT NULL,
    text       text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- ---------------------------------------------------------------------------
-- Orders
-- ---------------------------------------------------------------------------

CREATE TABLE orders (
    id         uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id    uuid NOT NULL,
    status     text DEFAULT 'draft'::text NOT NULL,
    total      numeric(12, 2) DEFAULT 0 NOT NULL,
    currency   character(3) DEFAULT 'SAR'::bpchar NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE order_items (
    id         uuid DEFAULT gen_random_uuid() NOT NULL,
    order_id   uuid NOT NULL,
    product_id uuid NOT NULL,
    qty        numeric(12, 2) NOT NULL,
    unit_price numeric(12, 2) NOT NULL,
    line_total numeric(12, 2) NOT NULL
);

-- ---------------------------------------------------------------------------
-- Quotes
-- ---------------------------------------------------------------------------

CREATE TABLE quote_requests (
    id            uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id       uuid,
    contact_name  text NOT NULL,
    contact_email text NOT NULL,
    contact_phone text,
    company_name  text,
    notes         text,
    status        text DEFAULT 'new'::text NOT NULL,
    created_at    timestamp with time zone DEFAULT now() NOT NULL
);

-- ---------------------------------------------------------------------------
-- Primary keys, foreign keys, unique constraints, checks, indexes
-- ---------------------------------------------------------------------------

ALTER TABLE ONLY languages
    ADD CONSTRAINT languages_pkey PRIMARY KEY (code);
ALTER TABLE ONLY roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);
ALTER TABLE ONLY categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);
ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);
ALTER TABLE ONLY products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);
ALTER TABLE ONLY product_variants
    ADD CONSTRAINT product_variants_pkey PRIMARY KEY (id);
ALTER TABLE ONLY price_lists
    ADD CONSTRAINT price_lists_pkey PRIMARY KEY (id);
ALTER TABLE ONLY price_list_items
    ADD CONSTRAINT price_list_items_pkey PRIMARY KEY (id);
ALTER TABLE ONLY inventory_items
    ADD CONSTRAINT inventory_items_pkey PRIMARY KEY (id);
ALTER TABLE ONLY inventory_movements
    ADD CONSTRAINT inventory_movements_pkey PRIMARY KEY (id);
ALTER TABLE ONLY sds_documents
    ADD CONSTRAINT sds_documents_pkey PRIMARY KEY (id);
ALTER TABLE ONLY safety_warnings
    ADD CONSTRAINT safety_warnings_pkey PRIMARY KEY (id);
ALTER TABLE ONLY orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);
ALTER TABLE ONLY order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);
ALTER TABLE ONLY quote_requests
    ADD CONSTRAINT quote_requests_pkey PRIMARY KEY (id);

ALTER TABLE ONLY roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);
ALTER TABLE ONLY categories
    ADD CONSTRAINT categories_slug_key UNIQUE (slug);
ALTER TABLE ONLY users
    ADD CONSTRAINT users_email_key UNIQUE (email);
ALTER TABLE ONLY refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_hash_key UNIQUE (token_hash);
ALTER TABLE ONLY products
    ADD CONSTRAINT products_sku_key UNIQUE (sku);
ALTER TABLE ONLY price_list_items
    ADD CONSTRAINT price_list_items_price_list_id_product_id_min_qty_key
        UNIQUE (price_list_id, product_id, min_qty);

ALTER TABLE ONLY categories
    ADD CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES categories (id);
ALTER TABLE ONLY users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES roles (id);
ALTER TABLE ONLY refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;
ALTER TABLE ONLY products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES categories (id);
ALTER TABLE ONLY product_variants
    ADD CONSTRAINT product_variants_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE;
ALTER TABLE ONLY price_lists
    ADD CONSTRAINT price_lists_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES users (id);
ALTER TABLE ONLY price_list_items
    ADD CONSTRAINT price_list_items_price_list_id_fkey FOREIGN KEY (price_list_id) REFERENCES price_lists (id) ON DELETE CASCADE;
ALTER TABLE ONLY price_list_items
    ADD CONSTRAINT price_list_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE;
ALTER TABLE ONLY inventory_items
    ADD CONSTRAINT inventory_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE;
ALTER TABLE ONLY inventory_movements
    ADD CONSTRAINT inventory_movements_inventory_item_id_fkey FOREIGN KEY (inventory_item_id) REFERENCES inventory_items (id) ON DELETE CASCADE;
ALTER TABLE ONLY sds_documents
    ADD CONSTRAINT sds_documents_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE;
ALTER TABLE ONLY safety_warnings
    ADD CONSTRAINT safety_warnings_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE;
ALTER TABLE ONLY orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE ONLY order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE;
ALTER TABLE ONLY order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES products (id);
ALTER TABLE ONLY quote_requests
    ADD CONSTRAINT quote_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (id);

-- Check constraints (explicit names)
ALTER TABLE ONLY languages
    ADD CONSTRAINT languages_code_check CHECK ((code = ANY (ARRAY['ar'::text, 'en'::text])));
ALTER TABLE ONLY roles
    ADD CONSTRAINT roles_name_check CHECK ((name = ANY (ARRAY['admin'::text, 'customer_b2b'::text, 'customer_b2c'::text])));
ALTER TABLE ONLY users
    ADD CONSTRAINT users_customer_type_check CHECK ((customer_type = ANY (ARRAY['b2c'::text, 'b2b'::text])));
ALTER TABLE ONLY users
    ADD CONSTRAINT users_preferred_language_check CHECK ((preferred_language = ANY (ARRAY['ar'::text, 'en'::text])));
ALTER TABLE ONLY products
    ADD CONSTRAINT products_kind_check CHECK ((kind = ANY (ARRAY['raw'::text, 'finished'::text])));
ALTER TABLE ONLY price_list_items
    ADD CONSTRAINT price_list_items_price_check CHECK ((price >= (0)::numeric));
ALTER TABLE ONLY price_list_items
    ADD CONSTRAINT price_list_items_min_qty_check CHECK ((min_qty >= (1)::numeric));
ALTER TABLE ONLY price_list_items
    ADD CONSTRAINT price_list_items_discount_pct_check CHECK (((discount_pct >= (0)::numeric) AND (discount_pct <= (100)::numeric)));
ALTER TABLE ONLY inventory_movements
    ADD CONSTRAINT inventory_movements_type_check CHECK ((type = ANY (ARRAY['in'::text, 'out'::text, 'adjust'::text])));
ALTER TABLE ONLY sds_documents
    ADD CONSTRAINT sds_documents_language_check CHECK ((language = ANY (ARRAY['ar'::text, 'en'::text])));
ALTER TABLE ONLY safety_warnings
    ADD CONSTRAINT safety_warnings_language_check CHECK ((language = ANY (ARRAY['ar'::text, 'en'::text])));
ALTER TABLE ONLY safety_warnings
    ADD CONSTRAINT safety_warnings_severity_check CHECK ((severity = ANY (ARRAY['info'::text, 'warning'::text, 'danger'::text])));
ALTER TABLE ONLY orders
    ADD CONSTRAINT orders_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'confirmed'::text, 'fulfilled'::text, 'cancelled'::text])));
ALTER TABLE ONLY quote_requests
    ADD CONSTRAINT quote_requests_status_check CHECK ((status = ANY (ARRAY['new'::text, 'reviewed'::text, 'responded'::text, 'closed'::text])));

CREATE INDEX idx_users_email ON users USING btree (email);
CREATE INDEX idx_users_role ON users USING btree (role_id);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens USING btree (user_id);
CREATE INDEX idx_products_category ON products USING btree (category_id);
CREATE INDEX idx_products_sku ON products USING btree (sku);
CREATE INDEX idx_product_variants_product ON product_variants USING btree (product_id);
CREATE INDEX idx_price_lists_customer ON price_lists USING btree (customer_id);
CREATE INDEX idx_price_list_items_list ON price_list_items USING btree (price_list_id);
CREATE INDEX idx_price_list_items_product ON price_list_items USING btree (product_id);
CREATE INDEX idx_inventory_items_product ON inventory_items USING btree (product_id);
CREATE INDEX idx_inventory_movements_item ON inventory_movements USING btree (inventory_item_id);
CREATE INDEX idx_sds_documents_product ON sds_documents USING btree (product_id);
CREATE INDEX idx_safety_warnings_product ON safety_warnings USING btree (product_id);
CREATE INDEX idx_orders_user ON orders USING btree (user_id);
CREATE INDEX idx_order_items_order ON order_items USING btree (order_id);
CREATE INDEX idx_quote_requests_user ON quote_requests USING btree (user_id);
