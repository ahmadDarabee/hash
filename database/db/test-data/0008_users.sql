-- =============================================================
-- 0008_users.sql — users, roles (groups) and privileges.
--
-- Roles are modelled as ACL groups whose names match the backend's
-- Role enum values: 'admin', 'customer_b2b', 'customer_b2c'.
--
-- Passwords (argon2id, generated with the backend's hash_password):
--   admin@hashco.com    -> Admin123!
--   others             -> Password123!
-- =============================================================

-- -------- privileges --------
INSERT INTO acl_privilege (name) VALUES
    ('catalog.read'),
    ('catalog.write'),
    ('pricing.manage'),
    ('compliance.manage'),
    ('users.manage'),
    ('inventory.manage'),
    ('orders.manage'),
    ('admin.all')
ON CONFLICT (name) DO NOTHING;

-- -------- roles as groups --------
INSERT INTO acl_group (name) VALUES
    ('admin'),
    ('customer_b2b'),
    ('customer_b2c')
ON CONFLICT (name) DO NOTHING;

-- -------- group -> privilege --------
INSERT INTO acl_group_privilege (group_name, privilege_name) VALUES
    ('admin', 'catalog.read'),
    ('admin', 'catalog.write'),
    ('admin', 'pricing.manage'),
    ('admin', 'compliance.manage'),
    ('admin', 'users.manage'),
    ('admin', 'inventory.manage'),
    ('admin', 'orders.manage'),
    ('admin', 'admin.all'),
    ('customer_b2b', 'catalog.read'),
    ('customer_b2b', 'orders.manage'),
    ('customer_b2c', 'catalog.read')
ON CONFLICT (group_name, privilege_name) DO NOTHING;

-- -------- users --------
INSERT INTO acl_user (id, email, password, company_name, preferred_language, is_active) VALUES
    (1, 'admin@hashco.com',    '$argon2id$v=19$m=65536,t=3,p=4$bham7Rizi/SiqbYADU2CgQ$RKTmQerxccsPrad86EBpbE1K3nyI+L5Me2ZPDHkcsE8', NULL,                    'ar', TRUE),
    (2, 'b2b@hashco.com',      '$argon2id$v=19$m=65536,t=3,p=4$VevxfXTHA0tRAQls1uExXw$w3jSKeiRomgTa0vcslq7i/mCDbyqpK47fdaAZNG4JII', 'Al-Noor Trading Co.',  'ar', TRUE),
    (3, 'b2c@hashco.com',      '$argon2id$v=19$m=65536,t=3,p=4$VevxfXTHA0tRAQls1uExXw$w3jSKeiRomgTa0vcslq7i/mCDbyqpK47fdaAZNG4JII', NULL,                    'en', TRUE),
    (4, 'partner@hashco.com',  '$argon2id$v=19$m=65536,t=3,p=4$VevxfXTHA0tRAQls1uExXw$w3jSKeiRomgTa0vcslq7i/mCDbyqpK47fdaAZNG4JII', 'Gulf Facilities LLC', 'en', TRUE),
    (5, 'disabled@hashco.com', '$argon2id$v=19$m=65536,t=3,p=4$VevxfXTHA0tRAQls1uExXw$w3jSKeiRomgTa0vcslq7i/mCDbyqpK47fdaAZNG4JII', NULL,                    'ar', FALSE)
ON CONFLICT (id) DO NOTHING;

SELECT setval('acl_user_id_seq', (SELECT MAX(id) FROM acl_user));

-- -------- user -> group --------
INSERT INTO acl_user_group (user_id, group_name) VALUES
    (1, 'admin'),
    (2, 'customer_b2b'),
    (3, 'customer_b2c'),
    (4, 'customer_b2b'),
    (5, 'customer_b2c')
ON CONFLICT (user_id, group_name) DO NOTHING;
