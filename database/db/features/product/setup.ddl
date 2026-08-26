CREATE TABLE IF NOT EXISTS product (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL
) INHERITS (audit);

CREATE TABLE IF NOT EXISTS product_type (
    name TEXT PRIMARY KEY,
    description TEXT
) INHERITS (audit);
