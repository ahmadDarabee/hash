-- =============================================================
-- 0001_languages.sql — supported interface languages.
-- =============================================================

INSERT INTO language (code, name_en, name_ar) VALUES
    ('ar', 'Arabic',  'العربية'),
    ('en', 'English', 'الإنجليزية')
ON CONFLICT (code) DO NOTHING;
