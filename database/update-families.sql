-- ============================================
-- Trade for Egypt - تعديل أسماء العائلات
-- ============================================
-- تاريخ الإنشاء: نوفمبر 2025
-- الغرض: تحديث أسماء العائلات (العربية والإنجليزية)
-- ============================================

-- 1. تعديل "أجهزة المطبخ الصغيرة" إلى "أجهزة المطبخ"
UPDATE families
SET 
    name = 'أجهزة المطبخ',
    slug = 'kitchen-appliances'
WHERE slug = 'small-kitchen-appliances';

-- 2. تعديل "الأجهزة المنزلية الكبيرة" إلى "الأجهزة المنزلية"
UPDATE families
SET 
    name = 'الأجهزة المنزلية',
    slug = 'home-appliances'
WHERE slug = 'large-home-appliances';

-- 3. تعديل slug "الأدوات الكهربائية" من power-tools إلى electrical-tools
UPDATE families
SET 
    slug = 'electrical-tools'
WHERE slug = 'power-tools';

-- 4. تعديل "الأجهزة الطبية المنزلية" إلى "الأجهزة الطبية"
UPDATE families
SET 
    name = 'الأجهزة الطبية',
    slug = 'medical-devices'
WHERE slug = 'home-medical-devices';

-- 5. تعديل slug "النظارات" من eyewear إلى glasses
UPDATE families
SET 
    slug = 'glasses'
WHERE slug = 'eyewear';

-- ============================================
-- التحقق من التعديلات
-- ============================================
SELECT id, name, slug 
FROM families 
WHERE slug IN (
    'kitchen-appliances',
    'home-appliances', 
    'electrical-tools',
    'medical-devices',
    'glasses'
)
ORDER BY name;
