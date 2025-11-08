-- ============================================
-- Trade for Egypt - تعديلات المنتجات والعائلات (النسخة المحدثة)
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
AND family_id = (SELECT id FROM families WHERE slug IN ('air-conditioning', 'hvac', 'cooling'));

-- ============================================
-- الجزء 4: دمج عائلات الرافعات ومعدات البناء
-- ============================================

-- نقل جميع المنتجات من العائلات القديمة إلى عائلة "معدات البناء والرافعات" الموجودة
UPDATE products
SET family_id = (
    SELECT id FROM families 
    WHERE name = 'معدات البناء والرافعات' 
    OR slug IN ('construction-lifting-equipment', 'construction-equipment')
    LIMIT 1
)
WHERE family_id IN (
    SELECT id FROM families 
    WHERE slug IN ('forklifts', 'construction-cranes', 'heavy-equipment', 'lifting-equipment')
    AND name != 'معدات البناء والرافعات'
);

-- حذف علاقات brand_families للعائلات القديمة
DELETE FROM brand_families 
WHERE family_id IN (
    SELECT id FROM families 
    WHERE slug IN ('forklifts', 'construction-cranes', 'heavy-equipment', 'lifting-equipment')
    AND name != 'معدات البناء والرافعات'
);

-- حذف العائلات القديمة
DELETE FROM families 
WHERE slug IN ('forklifts', 'construction-cranes', 'heavy-equipment', 'lifting-equipment')
AND name != 'معدات البناء والرافعات';

-- ============================================
-- الجزء 5: إلغاء عائلة "السخانات ونظم التدفئة" ونقل المنتجات
-- ============================================

-- أولاً: نقل جميع منتجات السخانات إلى عائلة "الأجهزة المنزلية"
UPDATE products
SET family_id = (SELECT id FROM families WHERE slug = 'home-appliances' LIMIT 1)
WHERE family_id IN (
    SELECT id FROM families 
    WHERE slug IN ('heating-systems', 'heaters', 'heating')
);

-- ثانياً: حذف علاقات brand_families لعائلة السخانات
DELETE FROM brand_families 
WHERE family_id IN (
    SELECT id FROM families 
    WHERE slug IN ('heating-systems', 'heaters', 'heating')
);

-- ثالثاً: حذف عائلة "السخانات ونظم التدفئة"
DELETE FROM families 
WHERE slug IN ('heating-systems', 'heaters', 'heating');

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
✅ تم تحديث السكريبت لحل مشكلة التكرار
✅ السكريبت الآن يتعامل مع العائلات الموجودة بالفعل
✅ يستخدم LIMIT 1 لتجنب أخطاء multiple rows
✅ يتحقق من الأسماء والـ slugs المختلفة

⚠️ تأكد من عمل backup قبل التنفيذ
⚠️ راجع النتائج بعد كل جزء
*/
