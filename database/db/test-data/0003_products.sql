-- =============================================================
-- 0003_products.sql — catalog products.
--
-- 21 products across all 8 categories: 20 active + 1 retired
-- (DET-HD200, is_active = FALSE) to exercise active-only filtering.
-- `kind` is 'raw' (concentrate) or 'finished' (ready-to-use).
-- created_at is staggered so the newest row is the home-page feature.
-- =============================================================

INSERT INTO product
    (id, sku, name_en, name_ar, description_en, description_ar, category_id, brand, unit, kind, is_active, created_at)
VALUES
    (1, 'DET-HD100', 'Heavy-Duty Floor Detergent', 'منظف أرضيات عالي التركيز',
     'Concentrated alkaline floor detergent for warehouses and workshops. Cuts through grease and grime fast.',
     'منظف أرضيات قلوي مركّز للمستودعات والورش. يزيل الشحوم والأوساخ بسرعة.',
     1, 'HashPro', 'L', 'raw', TRUE, '2026-01-15T12:00:00Z'),

    (2, 'DET-KP500', 'Kitchen Degreaser Detergent', 'منظف مطابخ مزيل للدهون',
     'Ready-to-use kitchen detergent that cuts through cooking grease on surfaces and equipment.',
     'منظف مطابخ جاهز للاستخدام يزيل دهون الطهي عن الأسطح والمعدات.',
     1, 'CleanLine', 'L', 'finished', TRUE, '2026-01-15T11:30:00Z'),

    (3, 'DET-LA300', 'Laundry Detergent Concentrate', 'منظف غسيل مركّز',
     'High-efficiency laundry concentrate for commercial washing machines.',
     'منظف غسيل مركّز عالي الكفاءة للغسالات التجارية.',
     1, 'EcoWash', 'kg', 'raw', TRUE, '2026-01-15T11:00:00Z'),

    (4, 'SAN-QS200', 'Quaternary Ammonium Sanitizer', 'معقم أمونيوم رباعي',
     'Broad-spectrum quaternary sanitizer for food-contact surfaces. Meets EN 1276.',
     'معقم رباعي واسع الطيف للأسطح الملامسة للأغذية. مطابق لمعيار EN 1276.',
     2, 'SteriMax', 'L', 'finished', TRUE, '2026-01-15T10:30:00Z'),

    (5, 'SAN-AL700', 'Alcohol Surface Sanitizer', 'معقم أسطح كحولي',
     'Fast-drying 70 percent alcohol sanitizer for high-touch surfaces.',
     'معقم كحولي 70 بالمئة سريع الجفاف للأسطح كثيرة اللمس.',
     2, 'SteriMax', 'L', 'finished', TRUE, '2026-01-15T10:00:00Z'),

    (6, 'SAN-PA400', 'Peracetic Acid Sanitizer', 'معقم حمض البيراسيتيك',
     'Powerful peracetic sanitizer for CIP systems and storage tanks.',
     'معقم بيراسيتيك قوي لأنظمة التنظيف الموضعي وخزانات التخزين.',
     2, 'HashPro', 'L', 'raw', TRUE, '2026-01-15T09:30:00Z'),

    (7, 'DEG-DG900', 'Industrial Heavy-Duty Degreaser', 'مزيل شحوم صناعي قوي',
     'Solvent-free heavy-duty degreaser for engines, machinery and floors.',
     'مزيل شحوم قوي خالٍ من المذيبات للمحركات والمعدات والأرضيات.',
     3, 'HashPro', 'L', 'raw', TRUE, '2026-01-15T09:00:00Z'),

    (8, 'DEG-MG600', 'Metal Parts Degreaser', 'مزيل شحوم القطع المعدنية',
     'Parts-washer degreaser that strips oil, coolant and carbon from metal.',
     'مزيل شحوم لأحواض غسيل القطع يزيل الزيت وسائل التبريد والكربون.',
     3, 'CleanLine', 'L', 'raw', TRUE, '2026-01-15T08:30:00Z'),

    (9, 'DEG-EG350', 'Enzyme Degreaser', 'مزيل شحوم إنزيمي',
     'Bio-enzymatic degreaser that digests fats, oils and grease naturally.',
     'مزيل شحوم حيوي إنزيمي يحلل الدهون والزيوت طبيعياً.',
     3, 'EcoWash', 'L', 'finished', TRUE, '2026-01-15T08:00:00Z'),

    (10, 'SOAP-HS100', 'Liquid Hand Soap', 'صابون سائل لليدين',
     'Mild pH-balanced hand soap with moisturizers for frequent washing.',
     'صابون لليدين لطيف متوازن الحموضة مع مرطبات للغسيل المتكرر.',
     4, 'CleanLine', 'L', 'finished', TRUE, '2026-01-15T07:30:00Z'),

    (11, 'SOAP-LS150', 'Liquid Soap Base', 'أساس الصابون السائل',
     'Concentrated soap base for producing finished liquid soaps.',
     'أساس صابون مركّز لإنتاج الصابون السائل النهائي.',
     4, 'EcoWash', 'kg', 'raw', TRUE, '2026-01-15T07:00:00Z'),

    (12, 'SOAP-SS120', 'Mild Skin Soap', 'صابون لطيف للبشرة',
     'Dermatologically-tested mild soap for sensitive skin.',
     'صابون لطيف مختبر جلدياً للبشرة الحساسة.',
     4, 'CleanLine', 'L', 'finished', TRUE, '2026-01-15T06:30:00Z'),

    (13, 'DESC-DS800', 'Industrial Acid Descaler', 'مزيل ترسبات حمضي صناعي',
     'Acidic descaler for boilers, heat exchangers and pipes.',
     'مزيل ترسبات حمضي للغلايات والمبادلات الحرارية والأنابيب.',
     5, 'HashPro', 'L', 'raw', TRUE, '2026-01-15T06:00:00Z'),

    (14, 'DESC-DS810', 'Bathroom Descaler', 'مزيل ترسبات الحمامات',
     'Removes limescale and soap scum from tiles, taps and sanitary ware.',
     'يزيل الترسبات الكلسية وبقايا الصابون عن البلاط والحنفيات والأدوات الصحية.',
     5, 'CleanLine', 'L', 'finished', TRUE, '2026-01-15T05:30:00Z'),

    (15, 'FLOOR-FC700', 'Floor Polish & Sealer', 'ملمع وسداد الأرضيات',
     'High-gloss polymer polish that seals and protects hard floors.',
     'ملمع بوليمري عالي اللمعان يسد ويحمي الأرضيات الصلبة.',
     6, 'CleanLine', 'L', 'finished', TRUE, '2026-01-15T05:00:00Z'),

    (16, 'FLOOR-FC710', 'Floor Stripper', 'مزيل طبقات الأرضيات',
     'Removes old wax and polish build-up before refinishing.',
     'يزيل طبقات الشمع واللمعان القديمة قبل إعادة التجهيز.',
     6, 'HashPro', 'L', 'raw', TRUE, '2026-01-15T04:30:00Z'),

    (17, 'LAU-LD200', 'Laundry Powder', 'مسحوق غسيل',
     'Phosphate-free laundry powder for industrial washing.',
     'مسحوق غسيل خالٍ من الفوسفات للغسيل الصناعي.',
     7, 'EcoWash', 'kg', 'raw', TRUE, '2026-01-15T04:00:00Z'),

    (18, 'LAU-LD210', 'Fabric Softener', 'منعم الأقمشة',
     'Concentrated fabric softener that reduces static and softens textiles.',
     'منعم أقمشة مركّز يقلل الكهرباء الساكنة وينعّم المنسوجات.',
     7, 'EcoWash', 'L', 'finished', TRUE, '2026-01-15T03:30:00Z'),

    (19, 'DIS-DI500', 'Surface Disinfectant', 'مطهر أسطح',
     'Hospital-grade surface disinfectant effective against a broad spectrum.',
     'مطهر أسطح بدرجة المستشفيات فعال ضد طيف واسع من الكائنات.',
     8, 'SteriMax', 'L', 'finished', TRUE, '2026-01-15T03:00:00Z'),

    (20, 'DIS-DI510', 'High-Level Disinfectant', 'مطهر عالي المستوى',
     'High-level disinfectant for medical and food-processing environments.',
     'مطهر عالي المستوى للبيئات الطبية وتجهيز الأغذية.',
     8, 'SteriMax', 'L', 'raw', TRUE, '2026-01-15T02:30:00Z'),

    (21, 'DET-HD200', 'Legacy Floor Detergent', 'منظف أرضيات قديم',
     'Retired formulation, kept for reference only.',
     'تركيبة قديمة متوقفة، محفوظة للرجوع إليها فقط.',
     1, 'HashPro', 'L', 'finished', FALSE, '2026-01-01T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- Keep the identity sequence ahead of any explicit ids.
SELECT setval('product_id_seq', (SELECT MAX(id) FROM product));
