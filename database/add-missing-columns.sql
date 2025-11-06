-- ============================================
-- Trade for Egypt - إضافة الأعمدة الناقصة
-- ============================================
-- تاريخ الإنشاء: نوفمبر 2025
-- الغرض: إضافة أعمدة الصور والسيو للماركات والمنتجات
-- ============================================

-- ============================================
-- 1. إضافة أعمدة للماركات (brands)
-- ============================================

-- أعمدة الصور
ALTER TABLE brands
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS banner_url TEXT,
ADD COLUMN IF NOT EXISTS cover_url TEXT;

-- أعمدة السيو والمحتوى
ALTER TABLE brands
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT;

-- تعليق على الأعمدة
COMMENT ON COLUMN brands.logo_url IS 'رابط شعار الماركة (200x200px PNG)';
COMMENT ON COLUMN brands.banner_url IS 'رابط بنر الماركة (1920x600px JPG)';
COMMENT ON COLUMN brands.cover_url IS 'رابط صورة الغلاف للسوشيال ميديا (1200x630px JPG)';
COMMENT ON COLUMN brands.description IS 'وصف الماركة (HTML مسموح)';
COMMENT ON COLUMN brands.meta_title IS 'عنوان SEO مخصص (اختياري)';
COMMENT ON COLUMN brands.meta_description IS 'وصف SEO مخصص (اختياري)';

-- ============================================
-- 2. إضافة أعمدة للمنتجات (products)
-- ============================================

-- أعمدة الصور (5 صور لكل منتج)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS photo_1 TEXT,
ADD COLUMN IF NOT EXISTS photo_2 TEXT,
ADD COLUMN IF NOT EXISTS photo_3 TEXT,
ADD COLUMN IF NOT EXISTS photo_4 TEXT,
ADD COLUMN IF NOT EXISTS photo_5 TEXT;

-- أعمدة السيو والمحتوى
ALTER TABLE products
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT;

-- تعليق على الأعمدة
COMMENT ON COLUMN products.photo_1 IS 'الصورة الرئيسية (800x800px JPG)';
COMMENT ON COLUMN products.photo_2 IS 'صورة إضافية 2 (800x800px JPG)';
COMMENT ON COLUMN products.photo_3 IS 'صورة إضافية 3 (800x800px JPG)';
COMMENT ON COLUMN products.photo_4 IS 'صورة إضافية 4 (800x800px JPG)';
COMMENT ON COLUMN products.photo_5 IS 'صورة إضافية 5 (800x800px JPG)';
COMMENT ON COLUMN products.description IS 'وصف المنتج (HTML مسموح)';
COMMENT ON COLUMN products.meta_title IS 'عنوان SEO مخصص (اختياري)';
COMMENT ON COLUMN products.meta_description IS 'وصف SEO مخصص (اختياري)';

-- ============================================
-- 3. إنشاء جدول المحتوى المخصص (page_content)
-- ============================================

CREATE TABLE IF NOT EXISTS page_content (
  id BIGSERIAL PRIMARY KEY,
  brand_id BIGINT NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL CHECK (keyword IN ('agency', 'customer-service', 'hotline', 'maintenance', 'numbers', 'warranty')),
  
  -- المحتوى المخصص
  custom_content TEXT,
  h1_title TEXT,
  h2_sections JSONB,
  h3_sections JSONB,
  
  -- التواريخ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- قيد فريد: صفحة واحدة لكل (brand + product + keyword)
  UNIQUE(brand_id, product_id, keyword)
);

-- فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_page_content_brand ON page_content(brand_id);
CREATE INDEX IF NOT EXISTS idx_page_content_product ON page_content(brand_id, product_id);
CREATE INDEX IF NOT EXISTS idx_page_content_keyword ON page_content(keyword);

-- تعليق على الجدول
COMMENT ON TABLE page_content IS 'محتوى مخصص للصفحات (اختياري - للإدخال اليدوي)';
COMMENT ON COLUMN page_content.custom_content IS 'محتوى HTML كامل مخصص';
COMMENT ON COLUMN page_content.h1_title IS 'عنوان H1 مخصص';
COMMENT ON COLUMN page_content.h2_sections IS 'أقسام H2 بصيغة JSON: [{"title": "", "content": ""}]';
COMMENT ON COLUMN page_content.h3_sections IS 'أقسام H3 بصيغة JSON: [{"title": "", "content": ""}]';

-- ============================================
-- 4. إنشاء جدول التقييمات (ratings) - للنجوم الصفراء
-- ============================================

CREATE TABLE IF NOT EXISTS ratings (
  id BIGSERIAL PRIMARY KEY,
  brand_id BIGINT NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  
  -- التقييم
  rating_value DECIMAL(2,1) NOT NULL CHECK (rating_value >= 1.0 AND rating_value <= 5.0),
  rating_count INTEGER NOT NULL DEFAULT 0 CHECK (rating_count >= 0),
  
  -- التواريخ
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- قيد فريد: تقييم واحد لكل (brand + product)
  UNIQUE(brand_id, product_id)
);

-- فهارس
CREATE INDEX IF NOT EXISTS idx_ratings_brand ON ratings(brand_id);
CREATE INDEX IF NOT EXISTS idx_ratings_product ON ratings(brand_id, product_id);

-- تعليق على الجدول
COMMENT ON TABLE ratings IS 'تقييمات المنتجات (للنجوم الصفراء في Schema Markup)';
COMMENT ON COLUMN ratings.rating_value IS 'قيمة التقييم (1.0 - 5.0)';
COMMENT ON COLUMN ratings.rating_count IS 'عدد التقييمات';

-- ============================================
-- 5. إنشاء Function لتحديث updated_at تلقائياً
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- تطبيق Trigger على page_content
DROP TRIGGER IF EXISTS update_page_content_updated_at ON page_content;
CREATE TRIGGER update_page_content_updated_at
  BEFORE UPDATE ON page_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- تطبيق Trigger على ratings
DROP TRIGGER IF EXISTS update_ratings_updated_at ON ratings;
CREATE TRIGGER update_ratings_updated_at
  BEFORE UPDATE ON ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. إضافة بيانات تجريبية للتقييمات
-- ============================================

-- توليد تقييمات عشوائية (4.5 - 4.9) لجميع المنتجات
INSERT INTO ratings (brand_id, product_id, rating_value, rating_count)
SELECT 
  bf.brand_id,
  p.id AS product_id,
  ROUND((4.5 + (RANDOM() * 0.4))::numeric, 1) AS rating_value,
  FLOOR(50 + (RANDOM() * 150))::integer AS rating_count
FROM brand_families bf
JOIN products p ON p.family_id = bf.family_id
ON CONFLICT (brand_id, product_id) DO NOTHING;

-- ============================================
-- 7. إنشاء Views مفيدة
-- ============================================

-- View: جميع الصفحات المتوقعة (للإحصائيات)
CREATE OR REPLACE VIEW all_pages AS
SELECT 
  b.id AS brand_id,
  b.name AS brand_name,
  b.slug AS brand_slug,
  p.id AS product_id,
  p.name AS product_name,
  p.slug AS product_slug,
  f.name AS family_name,
  unnest(ARRAY['agency', 'customer-service', 'hotline', 'maintenance', 'numbers', 'warranty']) AS keyword,
  CONCAT('/', b.slug, '/', p.slug, '/', unnest(ARRAY['agency', 'customer-service', 'hotline', 'maintenance', 'numbers', 'warranty'])) AS page_url
FROM brands b
JOIN brand_families bf ON b.id = bf.brand_id
JOIN families f ON bf.family_id = f.id
JOIN products p ON p.family_id = f.id
ORDER BY b.slug, p.slug, keyword;

-- View: إحصائيات الماركات
CREATE OR REPLACE VIEW brand_stats AS
SELECT 
  b.id,
  b.name,
  b.slug,
  COUNT(DISTINCT bf.family_id) AS families_count,
  COUNT(DISTINCT p.id) AS products_count,
  COUNT(DISTINCT p.id) * 6 AS pages_count,
  COUNT(DISTINCT CASE WHEN b.logo_url IS NOT NULL THEN 1 END) AS has_logo,
  COUNT(DISTINCT CASE WHEN p.photo_1 IS NOT NULL THEN p.id END) AS products_with_images
FROM brands b
LEFT JOIN brand_families bf ON b.id = bf.brand_id
LEFT JOIN products p ON p.family_id = bf.family_id
GROUP BY b.id, b.name, b.slug
ORDER BY pages_count DESC;

-- View: إحصائيات عامة
CREATE OR REPLACE VIEW general_stats AS
SELECT 
  (SELECT COUNT(*) FROM brands) AS total_brands,
  (SELECT COUNT(*) FROM families) AS total_families,
  (SELECT COUNT(*) FROM products) AS total_products,
  (SELECT COUNT(*) FROM brand_families) AS total_relationships,
  (SELECT COUNT(*) FROM all_pages) AS total_pages_expected,
  (SELECT COUNT(*) FROM page_content) AS total_custom_content,
  (SELECT COUNT(*) FROM ratings) AS total_ratings;

-- ============================================
-- 8. إنشاء Policies للأمان (Row Level Security)
-- ============================================

-- تفعيل RLS على الجداول الجديدة
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- السماح بالقراءة للجميع
CREATE POLICY "Allow public read access" ON page_content
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON ratings
  FOR SELECT USING (true);

-- السماح بالكتابة للمستخدمين المصرح لهم فقط
CREATE POLICY "Allow authenticated insert" ON page_content
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON page_content
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete" ON page_content
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert" ON ratings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON ratings
  FOR UPDATE USING (auth.role() = 'authenticated');

-- ============================================
-- 9. التحقق من النتائج
-- ============================================

-- عرض الأعمدة الجديدة في brands
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'brands'
  AND column_name IN ('logo_url', 'banner_url', 'cover_url', 'description', 'meta_title', 'meta_description')
ORDER BY ordinal_position;

-- عرض الأعمدة الجديدة في products
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'products'
  AND column_name IN ('photo_1', 'photo_2', 'photo_3', 'photo_4', 'photo_5', 'description', 'meta_title', 'meta_description')
ORDER BY ordinal_position;

-- عرض الجداول الجديدة
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_name IN ('page_content', 'ratings')
ORDER BY table_name;

-- عرض الإحصائيات العامة
SELECT * FROM general_stats;

-- عرض أول 10 ماركات مع إحصائياتها
SELECT * FROM brand_stats LIMIT 10;

-- عرض عدد الصفحات المتوقعة
SELECT COUNT(*) AS total_pages FROM all_pages;

-- ============================================
-- 10. ملاحظات مهمة
-- ============================================

/*
✅ تم إضافة:
1. أعمدة الصور للماركات (logo, banner, cover)
2. أعمدة الصور للمنتجات (photo_1 إلى photo_5)
3. أعمدة السيو (description, meta_title, meta_description)
4. جدول المحتوى المخصص (page_content)
5. جدول التقييمات (ratings) - للنجوم الصفراء
6. Views للإحصائيات
7. Triggers لتحديث updated_at تلقائياً
8. Policies للأمان (RLS)

📝 الخطوات التالية:
1. تنفيذ هذا SQL في Supabase Dashboard
2. إعداد Supabase Storage (buckets: brands, products, defaults)
3. رفع الصور الافتراضية
4. البدء في بناء الصفحات الديناميكية

⚠️ تحذيرات:
- تأكد من عمل Backup قبل التنفيذ
- هذا الكود آمن (يستخدم IF NOT EXISTS)
- يمكن تشغيله عدة مرات بدون مشاكل
*/

-- ============================================
-- نهاية الملف
-- ============================================
