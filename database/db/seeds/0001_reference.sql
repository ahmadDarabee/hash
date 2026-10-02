-- 0001_reference.sql
-- Reference data only: roles, languages, categories. No demo/fake business data.

INSERT INTO roles (name)
VALUES ('admin'), ('customer_b2b'), ('customer_b2c')
ON CONFLICT (name) DO NOTHING;

INSERT INTO languages (code, name_en, name_ar)
VALUES
    ('ar', 'Arabic', 'العربية'),
    ('en', 'English', 'الإنجليزية')
ON CONFLICT (code) DO NOTHING;

INSERT INTO categories (slug, name_en, name_ar)
VALUES
    ('detergents', 'Detergents', 'منظفات'),
    ('sanitizers', 'Sanitizers', 'معقمات'),
    ('degreasers', 'Industrial Degreasers', 'مزيلات الشحوم الصناعية'),
    ('soaps', 'Soaps', 'صابون')
ON CONFLICT (slug) DO NOTHING;
