-- ============================================
-- Trade for Egypt - تعديلات المنتجات والعائلات
-- تاريخ: 8 نوفمبر 2025
-- ============================================

-- ============================================
-- الجزء 1: تعديل أسماء المنتجات
-- ============================================

-- 1. غلاية كهربائية → كاتيل
UPDATE products
SET name = 'كاتيل'
WHERE slug = 'kettle';

-- 2. فلتر → فلتر حمام سباحة
UPDATE products
SET name = 'فلتر حمام سباحة'
WHERE slug = 'filter-pool';

-- 3. مضخة → مضخة حمام سباحة
UPDATE products
SET name = 'مضخة حمام سباحة'
WHERE slug = 'pump-pool';

-- 4. نظام تعقيم → نظام تعقيم حمامات سباحة
UPDATE products
SET name = 'نظام تعقيم حمامات سباحة'
WHERE slug = 'sanitizer-pool';

-- 5. سخان → سخان حمام سباحة
UPDATE products
SET name = 'سخان حمام سباحة'
WHERE slug = 'heater-pool';

-- ============================================
-- الجزء 2: حذف المنتجات غير المطلوبة
-- ============================================

-- حذف ماكينة تصوير ملونة
DELETE FROM products WHERE slug = 'color-photocopier';

-- حذف المنتجات المتعلقة بمعدات البناء والأدوات
DELETE FROM products WHERE slug IN (
    'myzan-hrara',           -- ميزان حرارة
    'eyeglasses',            -- نظارة طبية
    'carrier-heavy',         -- ناقلة
    'manual-forklift',       -- رافعة يدوية
    'mobile-crane-construction', -- رافعة متحركة
    'diesel-forklift',       -- رافعة شوكية ديزل
    'electric-forklift',     -- رافعة شوكية كهربائية
    'reach-forklift',        -- رافعة وصول مرتفع
    'drill',                 -- دريل
    'mixer',                 -- خفاقة
    'excavator-construction', -- حفار
    'grinder-tool',          -- جلاخة
    'grader-construction',   -- جريدر
    'compressor-motor'       -- ضاغط
);

-- ============================================
-- الجزء 3: معالجة التكرارات
-- ============================================

-- حذف التكرار الثاني للدفاية (dfaya في التكييف والتبريد)
-- نبقي فقط radiator-heater في السخانات ونظم التدفئة
DELETE FROM products 
WHERE slug = 'dfaya' 
AND family_id = (SELECT id FROM families WHERE slug = 'air-conditioning');

-- ============================================
-- الجزء 4: دمج عائلات الرافعات ومعدات البناء
-- ============================================

-- أولاً: التأكد من وجود عائلة "معدات البناء والرافعات"
-- إذا لم تكن موجودة، سيتم إنشاؤها
INSERT INTO families (name, slug, description)
VALUES ('معدات البناء والرافعات', 'construction-lifting-equipment', 'معدات البناء والرافعات الشوكية والمعدات الثقيلة')
ON CONFLICT (slug) DO NOTHING;

-- ثانياً: نقل جميع المنتجات من عائلة "الرافعات الشوكية" و "معدات البناء والرافعات" القديمة
-- إلى العائلة الموحدة الجديدة
UPDATE products
SET family_id = (SELECT id FROM families WHERE slug = 'construction-lifting-equipment')
WHERE family_id IN (
    SELECT id FROM families WHERE slug IN ('forklifts', 'construction-cranes', 'heavy-equipment')
);

-- ثالثاً: حذف العائلات القديمة (بعد نقل المنتجات)
-- ملاحظة: قد تحتاج لحذف العلاقات في brand_families أولاً إذا كانت موجودة
DELETE FROM brand_families 
WHERE family_id IN (
    SELECT id FROM families WHERE slug IN ('forklifts', 'construction-cranes', 'heavy-equipment')
);

DELETE FROM families 
WHERE slug IN ('forklifts', 'construction-cranes', 'heavy-equipment');

-- ============================================
-- الجزء 5: إلغاء عائلة "السخانات ونظم التدفئة" ونقل المنتجات
-- ============================================

-- أولاً: نقل جميع منتجات السخانات إلى عائلة "الأجهزة المنزلية"
UPDATE products
SET family_id = (SELECT id FROM families WHERE slug = 'home-appliances')
WHERE family_id = (SELECT id FROM families WHERE slug = 'heating-systems');

-- ثانياً: حذف علاقات brand_families لعائلة السخانات
DELETE FROM brand_families 
WHERE family_id = (SELECT id FROM families WHERE slug = 'heating-systems');

-- ثالثاً: حذف عائلة "السخانات ونظم التدفئة"
DELETE FROM families WHERE slug = 'heating-systems';

-- ============================================
-- التحقق من النتائج
-- ============================================

-- عرض المنتجات المحدثة
SELECT p.id, p.name, p.slug, f.name as family_name
FROM products p
LEFT JOIN families f ON p.family_id = f.id
WHERE p.slug IN (
    'kettle', 'filter-pool', 'pump-pool', 
    'sanitizer-pool', 'heater-pool'
)
ORDER BY p.name;

-- عرض العائلات المتبقية
SELECT id, name, slug 
FROM families 
ORDER BY name;

-- عد المنتجات لكل عائلة
SELECT f.name as family_name, COUNT(p.id) as products_count
FROM families f
LEFT JOIN products p ON f.id = p.family_id
GROUP BY f.id, f.name
ORDER BY products_count DESC, f.name;

-- ============================================
-- ملاحظات مهمة
-- ============================================

/*
1. تأكد من عمل backup لقاعدة البيانات قبل تنفيذ هذا السكريبت
2. بعض الحذوفات قد تفشل إذا كانت هناك علاقات foreign key
3. قد تحتاج لتعديل slugs العائلات حسب ما هو موجود فعلياً في قاعدة البيانات
4. راجع النتائج بعد التنفيذ للتأكد من صحة التعديلات
*/
