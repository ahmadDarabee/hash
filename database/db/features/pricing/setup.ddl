CREATE TABLE IF NOT EXISTS balance_operation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    operation_type TEXT NOT NULL,
) INHERITS (audit);

CREATE TABLE IF NOT EXISTS balance_operation_type (
    name TEXT PRIMARY KEY,
    description TEXT
);