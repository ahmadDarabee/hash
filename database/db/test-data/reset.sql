-- =============================================================
-- reset.sql — clear all test data and reset identity sequences.
--
-- Truncates every application table (cascade) so the seed can be
-- applied from a clean slate. Safe to run repeatedly.
-- =============================================================

TRUNCATE TABLE
    acl_user_group,
    acl_group_privilege,
    acl_privilege,
    acl_group,
    refresh_token,
    acl_user,
    inventory_movement,
    inventory_item,
    safety_warning,
    sds_document,
    price_list_item,
    price_list,
    product_variant,
    product,
    category,
    language
RESTART IDENTITY CASCADE;
