# الخطة التنفيذية الشاملة والمفصلة لمشروع شبكة SEO الاحترافية
# Trade for Egypt - Professional SEO Network

**تاريخ الإنشاء:** 7 نوفمبر 2025  
**الإصدار:** 1.0 - النسخة النهائية الشاملة  
**الحالة:** جاهز للتنفيذ الفوري

---

## 📑 جدول المحتويات

1. [مقدمة ورؤية المشروع](#1-مقدمة-ورؤية-المشروع)
2. [نطاق المشروع والأهداف](#2-نطاق-المشروع-والأهداف)
3. [الهيكل الهرمي للمحتوى](#3-الهيكل-الهرمي-للمحتوى)
4. [البنية التقنية الكاملة](#4-البنية-التقنية-الكاملة)
5. [نموذج البيانات وقاعدة البيانات](#5-نموذج-البيانات-وقاعدة-البيانات)
6. [توليد الصفحات الديناميكية](#6-توليد-الصفحات-الديناميكية)
7. [استراتيجية SEO الشاملة](#7-استراتيجية-seo-الشاملة)
8. [لوحة التحكم الإدارية](#8-لوحة-التحكم-الإدارية)
9. [التخزين والوسائط](#9-التخزين-والوسائط)
10. [خطة التنفيذ المرحلية](#10-خطة-التنفيذ-المرحلية)
11. [أمثلة الكود والتطبيق](#11-أمثلة-الكود-والتطبيق)
12. [معايير القبول والاختبار](#12-معايير-القبول-والاختبار)
13. [النشر والمراقبة](#13-النشر-والمراقبة)
14. [التحديات والحلول](#14-التحديات-والحلول)
15. [الخلاصة والخطوات التالية](#15-الخلاصة-والخطوات-التالية)

---

## 1. مقدمة ورؤية المشروع

### 1.1. السياق والدافع

هذا المشروع هو مبادرة استراتيجية **ضخمة ومعقدة** تهدف إلى إعادة بناء شبكة متكاملة من المواقع لتحسين محركات البحث (SEO) واستهداف كلمات بحثية محددة في مجال الصيانة والتوكيلات التجارية في السوق المصري. الهدف الرئيسي هو **إعادة بناء شبكة من 350+ موقع فرعي** (subdomains) تحت النطاق الرئيسي `tradeforegypt.com` بمحتوى فريد وعالي الجودة لتحسين ترتيب الظهور في نتائج البحث على Google.

### 1.2. المشكلة الحالية

الشبكة الحالية تعمل بالفعل ولديها نجاحات في الظهور على الصفحات الأولى في Google، لكن تواجه التحديات التالية:

- **المحتوى ضعيف ومكرر:** لا يقدم قيمة حقيقية للزوار.
- **فشل بعض الكلمات البحثية:** في الظهور بسبب ضعف التحسين.
- **صعوبة الصيانة والتحديث:** بسبب عدم وجود نظام مركزي.

### 1.3. الحل المقترح

إعادة بناء كاملة للشبكة باستخدام:

- **قاعدة بيانات مركزية:** Supabase PostgreSQL.
- **نظام توليد ديناميكي:** Next.js مع ISR.
- **استضافة حديثة وسريعة:** Vercel.
- **محتوى فريد وعالي الجودة:** مولد تلقائيًا أو مكتوب يدويًا.
- **لوحة تحكم موحدة:** لإدارة كل شيء من مكان واحد.

### 1.4. النتائج المتوقعة

- **سيطرة على نتائج البحث:** في مئات الكلمات المفتاحية.
- **زيادة هائلة في الزيارات:** من محركات البحث.
- **تحسين السمعة والمصداقية:** للعلامة التجارية.
- **نمو الأعمال التجارية:** من خلال جذب عملاء جدد.

---

## 2. نطاق المشروع والأهداف

### 2.1. النطاق الكامل

| البند | الوصف |
|---|---|
| **عدد المواقع الفرعية** | 350+ سبدومين (subdomain)، لكل ماركة سبدومين خاص. |
| **عدد الصفحات المتوقع** | ~16,500 صفحة مبدئيًا (قابل للزيادة). |
| **نوع الصفحات** | صفحات ديناميكية تستهدف كلمات بحث محددة على مستوى الماركة والمنتج. |
| **التوليد التلقائي** | SEO meta tags, Schema markup, breadcrumbs, alt text, internal linking. |
| **لوحة التحكم** | واجهة موحدة لإدارة العائلات، الماركات، المنتجات، الكلمات البحثية، والوسائط. |

### 2.2. القيود والمتطلبات غير الوظيفية

| البند | الوصف |
|---|---|
| **الاستضافة والنشر** | Vercel، مع ربط النشر التلقائي بـ GitHub. |
| **قاعدة البيانات** | Supabase PostgreSQL. |
| **التخزين** | Supabase Storage، مع buckets منفصلة (`brands`, `products`, `defaults`). |
| **إطار العمل** | Next.js، باستخدام قالب **Iori** من ThemeForest. |
| **Pages Router** | سيتم استخدام Pages Router (وليس App Router) بناءً على الملفات الحالية. |
| **قاعدة البيانات** | أي تعديل على بنية قاعدة البيانات يجب أن يسبقه دراسة للعلاقات والسياسات. |
| **التوليد** | استخدام التوليد المرحلي (Incremental Static Regeneration - ISR) للتعامل مع الحجم الكبير. |

### 2.3. إحصائيات المشروع الحالية

| الكيان | العدد الحالي | الحالة |
|---|---|---|
| **العائلات (Families)** | 26 | ✅ تم إدخالها |
| **الماركات (Brands)** | 352 | ✅ تم إدخالها |
| **المنتجات (Products)** | 114 | ✅ تم إدخالها |
| **العلاقات (brand_families)** | 541 | ✅ تم ربطها |
| **الصفحات المتوقعة** | ~16,500 | ⏳ قيد التوليد |

---

## 3. الهيكل الهرمي للمحتوى

يتبع المشروع هيكلًا هرميًا من 4 مستويات لتنظيم المحتوى:

```
العائلات (Families)
    ↓
الماركات (Brands)
    ↓
المنتجات (Products)
    ↓
الكلمات البحثية (Keywords)
```

### 3.1. المستوى الأول: العائلات (26 عائلة)

العائلات هي التصنيفات الرئيسية للمنتجات:

1. الأجهزة المنزلية الكبيرة
2. أجهزة المطبخ الصغيرة
3. الإلكترونيات الاستهلاكية
4. التكييف والتبريد المنزلي
5. السيارات
6. الساعات
7. التكييفات المركزية
8. المعدات الثقيلة
9. تجهيزات المطابخ والمطاعم
10. الهواتف المحمولة
11. أنظمة الأمن والمراقبة
12. المعدات الطبية
13. الأدوات الكهربائية ومعدات الورش
14. أنظمة الصوتيات الاحترافية
15. الأجهزة الرياضية
16. النظارات الشمسية
17. *(10 عائلات إضافية)*

### 3.2. المستوى الثاني: الماركات (352 ماركة)

كل عائلة تحتوي على عشرات الماركات. **مثال لعائلة الأجهزة المنزلية:**

- Zanussi, LG, Samsung, Sharp, Bosch, Siemens, Beko, Ariston, Indesit, White Whale, Kiriazi, Fresh, Universal, Hoover, Candy, Miele, AEG, Electrolux, Westinghouse, Smeg

**ملاحظة مهمة:** الماركة يمكن أن تنتمي لأكثر من عائلة (Many-to-Many Relationship). مثال: **Canon** تنتمي لعائلة "الكاميرات" وعائلة "الطابعات".

### 3.3. المستوى الثالث: المنتجات (114 منتج)

كل ماركة تحتوي على منتجات متعددة. **مثال لماركات الأجهزة المنزلية:**

- غسالة (Washing Machine)
- ثلاجة (Fridge)
- بوتاجاز (Cooker)
- سخان (Water Heater)
- غسالة أطباق (Dishwasher)
- ديب فريزر (Deep Freezer)
- مجفف ملابس (Dryer)

### 3.4. المستوى الرابع: الكلمات البحثية (6 كلمات رئيسية)

كل منتج/ماركة يستهدف 6 كلمات بحثية رئيسية:

| الكلمة بالعربية | Slug بالإنجليزية | مثال |
|---|---|---|
| توكيل | `agency` | توكيل غسالات زانوسي |
| صيانة | `maintenance` | صيانة غسالات زانوسي |
| ضمان | `guarantee` | ضمان زانوسي |
| خط ساخن | `hotline` | خط ساخن زانوسي |
| أرقام | `numbers` | أرقام زانوسي |
| خدمة عملاء | `customer-service` | خدمة عملاء زانوسي |

---

## 4. البنية التقنية الكاملة

### 4.1. المكدس التقني (Tech Stack)

| التقنية | الإصدار | الاستخدام |
|---|---|---|
| **Next.js** | 13.0.4 | إطار عمل React للتطبيق (Pages Router). |
| **React** | 18.2.0 | مكتبة واجهة المستخدم. |
| **Supabase** | 2.79.0 | قاعدة البيانات (PostgreSQL) + Storage + Auth. |
| **Vercel** | - | منصة الاستضافة والنشر. |
| **GitHub** | - | التحكم في الإصدارات. |
| **Iori Template** | - | قالب Next.js احترافي من ThemeForest. |
| **Node.js** | 22.13.0 | بيئة التشغيل. |

### 4.2. هيكل المجلدات المقترح (الكامل)

```
/tradeforegypt
├── /pages
│   ├── /[brand]
│   │   ├── index.js                      // صفحة الماركة العامة (قيد الدراسة)
│   │   ├── /[product]
│   │   │   └── /[keyword].js             // ⭐ صفحة ماركة × منتج × كلمة
│   │   └── authorized-centers.js         // ⭐ صفحة مراكز معتمدة لكل ماركة
│   ├── /api
│   │   ├── revalidate.js                 // ⭐ Webhook لتفعيل ISR
│   │   ├── upload-image.js               // API لرفع صورة واحدة
│   │   └── bulk-upload.js                // API لرفع الصور بالجملة
│   ├── /admin
│   │   ├── index.js                      // لوحة التحكم الرئيسية
│   │   ├── brands.js                     // إدارة الماركات
│   │   ├── products.js                   // إدارة المنتجات
│   │   ├── families.js                   // إدارة العائلات
│   │   ├── media.js                      // إدارة الوسائط (رفع جماعي)
│   │   └── content.js                    // إدارة المحتوى المخصص
│   ├── _app.js                           // تطبيق Next.js الرئيسي
│   ├── _document.js                      // وثيقة HTML الرئيسية
│   ├── index.js                          // الصفحة الرئيسية
│   └── sitemap.xml.js                    // ⭐ Sitemap ديناميكي
├── /components
│   ├── SEOHead.js                        // ⭐ مكون Meta Tags
│   ├── SchemaMarkup.js                   // ⭐ مكون JSON-LD Schema
│   ├── Breadcrumb.js                     // مكون Breadcrumb
│   ├── PrevNextLinks.js                  // مكون Previous/Next
│   ├── ProductImages.js                  // مكون عرض صور المنتج
│   └── Layout.js                         // مكون Layout الرئيسي
├── /lib
│   ├── supabase.js                       // ⭐ إعدادات ودوال Supabase
│   ├── seo-generator.js                  // ⭐ مولد عناصر SEO
│   ├── schema-generator.js               // ⭐ مولد Schema Markup
│   ├── content-generator.js              // ⭐ مولد المحتوى الديناميكي
│   ├── navigation-helper.js              // ⭐ مساعد الربط الداخلي
│   └── image-handler.js                  // ⭐ معالج الصور والوسائط
├── /public
│   ├── robots.txt                        // ملف robots.txt
│   └── /assets                           // الأصول الثابتة (صور، خطوط، إلخ)
├── /database
│   └── add-missing-columns.sql           // ⭐ سكريبت تعديل قاعدة البيانات
├── /docs
│   └── COMPLETE-PROJECT-DOCUMENTATION.md // التوثيق الكامل
├── .env.local                            // ⭐ المتغيرات البيئية (لا يتم رفعه لـ Git)
├── .gitignore
├── package.json
├── next.config.js
├── vercel.json
└── README.md
```

**الملفات المميزة بـ ⭐ هي الملفات الأساسية التي يجب التركيز عليها.**

---

## 5. نموذج البيانات وقاعدة البيانات

### 5.1. الجداول الأساسية والعلاقات

#### جدول `families` (العائلات)

| العمود | النوع | الوصف |
|---|---|---|
| `id` | `SERIAL PRIMARY KEY` | معرف فريد. |
| `name` | `VARCHAR(255)` | اسم العائلة (عربي). |
| `slug` | `VARCHAR(255) UNIQUE` | Slug بالإنجليزية. |
| `description` | `TEXT` | وصف العائلة. |
| `created_at` | `TIMESTAMP` | تاريخ الإنشاء. |

#### جدول `brands` (الماركات)

| العمود | النوع | الوصف |
|---|---|---|
| `id` | `SERIAL PRIMARY KEY` | معرف فريد. |
| `name` | `VARCHAR(255)` | اسم الماركة. |
| `slug` | `VARCHAR(255) UNIQUE` | Slug بالإنجليزية. |
| `description` | `TEXT` | وصف الماركة. |
| `logo_url` | `VARCHAR(500)` | رابط الشعار. |
| `banner_url` | `VARCHAR(500)` | رابط البنر. |
| `cover_url` | `VARCHAR(500)` | رابط صورة الغلاف. |
| `meta_title` | `VARCHAR(255)` | عنوان Meta. |
| `meta_description` | `TEXT` | وصف Meta. |
| `created_at` | `TIMESTAMP` | تاريخ الإنشاء. |

#### جدول `products` (المنتجات)

| العمود | النوع | الوصف |
|---|---|---|
| `id` | `SERIAL PRIMARY KEY` | معرف فريد. |
| `name` | `VARCHAR(255)` | اسم المنتج (عربي). |
| `slug` | `VARCHAR(255) UNIQUE` | Slug بالإنجليزية. |
| `description` | `TEXT` | وصف المنتج. |
| `photo_1` | `VARCHAR(500)` | رابط الصورة 1. |
| `photo_2` | `VARCHAR(500)` | رابط الصورة 2. |
| `photo_3` | `VARCHAR(500)` | رابط الصورة 3. |
| `photo_4` | `VARCHAR(500)` | رابط الصورة 4. |
| `photo_5` | `VARCHAR(500)` | رابط الصورة 5. |
| `meta_title` | `VARCHAR(255)` | عنوان Meta. |
| `meta_description` | `TEXT` | وصف Meta. |
| `created_at` | `TIMESTAMP` | تاريخ الإنشاء. |

#### جدول `brand_families` (جدول وصل Many-to-Many)

| العمود | النوع | الوصف |
|---|---|---|
| `brand_id` | `INTEGER REFERENCES brands(id)` | معرف الماركة. |
| `family_id` | `INTEGER REFERENCES families(id)` | معرف العائلة. |
| `PRIMARY KEY` | `(brand_id, family_id)` | مفتاح أساسي مركب. |

#### جدول `page_content` (المحتوى المخصص - اختياري)

| العمود | النوع | الوصف |
|---|---|---|
| `id` | `SERIAL PRIMARY KEY` | معرف فريد. |
| `brand_id` | `INTEGER REFERENCES brands(id)` | معرف الماركة. |
| `product_id` | `INTEGER REFERENCES products(id)` | معرف المنتج (اختياري). |
| `keyword` | `VARCHAR(100)` | الكلمة البحثية (slug). |
| `h1` | `TEXT` | عنوان H1. |
| `h2` | `TEXT` | عنوان H2. |
| `h3` | `TEXT` | عنوان H3. |
| `h4` | `TEXT` | عنوان H4. |
| `h5` | `TEXT` | عنوان H5. |
| `body_html` | `TEXT` | محتوى HTML الكامل. |
| `created_at` | `TIMESTAMP` | تاريخ الإنشاء. |
| `updated_at` | `TIMESTAMP` | تاريخ آخر تحديث. |
| `UNIQUE` | `(brand_id, product_id, keyword)` | قيد فريد. |

#### جدول `ratings` (التقييمات - النجوم الصفراء)

| العمود | النوع | الوصف |
|---|---|---|
| `id` | `SERIAL PRIMARY KEY` | معرف فريد. |
| `brand_id` | `INTEGER REFERENCES brands(id)` | معرف الماركة. |
| `product_id` | `INTEGER REFERENCES products(id)` | معرف المنتج (اختياري). |
| `value` | `DECIMAL(2,1)` | قيمة التقييم (مثال: 4.7). |
| `count` | `INTEGER` | عدد التقييمات. |
| `created_at` | `TIMESTAMP` | تاريخ الإنشاء. |

#### View `general_stats` (إحصائيات عامة)

```sql
CREATE VIEW general_stats AS
SELECT
  (SELECT COUNT(*) FROM families) AS total_families,
  (SELECT COUNT(*) FROM brands) AS total_brands,
  (SELECT COUNT(*) FROM products) AS total_products,
  (SELECT COUNT(*) FROM brand_families) AS total_relations,
  (SELECT COUNT(*) FROM page_content) AS total_custom_pages;
```

### 5.2. مخطط العلاقات (ERD النصي)

```
families (1) ←→ (M) brand_families (M) ←→ (1) brands
                                                  ↓
                                              products (M)
                                                  ↓
                                            page_content (optional)
                                            ratings (optional)
```

---

## 6. توليد الصفحات الديناميكية (SSG + ISR)

### 6.1. أنماط الـ URL

| النمط | المثال | الوصف |
|---|---|---|
| `/{brand}/{product}/{keyword}` | `/zanussi/washing-machine/maintenance` | صفحة ماركة × منتج × كلمة. |
| `/{brand}/authorized-centers` | `/zanussi/authorized-centers` | صفحة المراكز المعتمدة. |

### 6.2. `getStaticPaths` - توليد المسارات

**الملف:** `pages/[brand]/[product]/[keyword].js`

```javascript
export async function getStaticPaths() {
  const { data: brands } = await supabase.from('brands').select('slug');
  const { data: products } = await supabase.from('products').select('slug');
  const keywords = ['agency', 'maintenance', 'guarantee', 'hotline', 'numbers', 'customer-service'];

  // توليد أول 1000 مسار فقط لتسريع البناء
  const paths = [];
  for (const brand of brands.slice(0, 50)) {
    for (const product of products.slice(0, 10)) {
      for (const keyword of keywords) {
        paths.push({
          params: {
            brand: brand.slug,
            product: product.slug,
            keyword: keyword
          }
        });
        if (paths.length >= 1000) break;
      }
      if (paths.length >= 1000) break;
    }
    if (paths.length >= 1000) break;
  }

  return {
    paths,
    fallback: 'blocking' // توليد الصفحات الأخرى عند أول زيارة
  };
}
```

### 6.3. `getStaticProps` - جلب البيانات

```javascript
export async function getStaticProps({ params }) {
  const { brand: brandSlug, product: productSlug, keyword } = params;

  // 1. جلب بيانات الماركة
  const { data: brand } = await supabase
    .from('brands')
    .select('*')
    .eq('slug', brandSlug)
    .single();

  if (!brand) return { notFound: true };

  // 2. جلب بيانات المنتج
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', productSlug)
    .single();

  if (!product) return { notFound: true };

  // 3. جلب العائلات المرتبطة بالماركة
  const { data: families } = await supabase
    .from('brand_families')
    .select('family_id, families(name, slug)')
    .eq('brand_id', brand.id);

  // 4. جلب المحتوى المخصص (إن وجد)
  const { data: customContent } = await supabase
    .from('page_content')
    .select('*')
    .eq('brand_id', brand.id)
    .eq('product_id', product.id)
    .eq('keyword', keyword)
    .single();

  // 5. توليد المحتوى الديناميكي (إذا لم يوجد محتوى مخصص)
  const content = customContent || generatePageContent(brand, product, keyword, families);

  // 6. حساب SEO
  const seo = {
    title: generateTitle(brand, product, keyword),
    description: generateMetaDescription(brand, product, keyword),
    canonical: generateCanonicalUrl(brand, product, keyword),
    keywords: generateKeywords(brand, product, keyword)
  };

  // 7. تجهيز Schema
  const schema = {
    organization: generateOrganizationSchema(brand),
    product: generateProductSchema(brand, product),
    localBusiness: generateLocalBusinessSchema(brand, product, keyword),
    breadcrumb: generateBreadcrumbSchema(brand, product, keyword),
    webPage: generateWebPageSchema(brand, product, keyword)
  };

  // 8. إعداد الربط الداخلي
  const navigation = await calculatePrevNext(brand, product, keyword);

  return {
    props: {
      brand,
      product,
      families,
      content,
      seo,
      schema,
      navigation
    },
    revalidate: 86400 // إعادة التحقق كل 24 ساعة
  };
}
```

### 6.4. Incremental Static Regeneration (ISR)

**الملف:** `pages/api/revalidate.js`

```javascript
export default async function handler(req, res) {
  // التحقق من السر
  if (req.query.secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    const { brand, product, keyword } = req.body;
    const path = `/${brand}/${product}/${keyword}`;

    // إعادة التحقق من الصفحة
    await res.revalidate(path);

    return res.json({ revalidated: true, path });
  } catch (err) {
    return res.status(500).json({ revalidated: false, error: err.message });
  }
}
```

**اختبار:**

```bash
curl -X POST http://localhost:3000/api/revalidate?secret=YOUR_SECRET \
  -H "Content-Type: application/json" \
  -d '{"brand":"zanussi","product":"washing-machine","keyword":"maintenance"}'
```

---

## 7. استراتيجية SEO الشاملة

### 7.1. العناصر التلقائية لكل صفحة

#### Meta Tags

- `<title>`: مولد تلقائيًا بصيغة: `{keyword} {brand} {product} | Trade for Egypt`
- `<meta name="description">`: وصف فريد لكل صفحة (150-160 حرف).
- `<meta name="keywords">`: كلمات مفتاحية ذات صلة.
- `<link rel="canonical">`: الرابط الكنسي للصفحة.

#### OpenGraph & Twitter Cards

```html
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="..." />
<meta property="og:url" content="..." />
<meta property="og:type" content="website" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="..." />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="..." />
```

#### JSON-LD Schema (5 أنواع)

1. **Organization Schema**
2. **Product Schema**
3. **LocalBusiness Schema**
4. **Breadcrumb Schema**
5. **WebPage Schema**

### 7.2. توليد المحتوى الديناميكي

**الهيكل الافتراضي للمحتوى:**

1. **المقدمة:** تعريف بالخدمة والكلمة المستهدفة.
2. **تعريف بالماركة:** ضمن العائلة المنتمية إليها.
3. **خدمات الصيانة/التوكيل:** تفاصيل الخدمات المقدمة.
4. **أسئلة شائعة:** 3-5 أسئلة وأجوبة.
5. **الخاتمة:** دعوة للتواصل.

**تمييز الكلمة المستهدفة:**

- سيتم تكرار الكلمة المستهدفة **5 مرات** في المحتوى.
- سيتم تمييزها بصيغ متنوعة:
  1. **Bold**
  2. **Underline**
  3. **Italic**
  4. **Bold + Underline**
  5. **Underline + Color (Blue)**

### 7.3. الربط الداخلي (Internal Linking)

#### 1. ربط دائري (Prev/Next)

كل صفحة سترتبط بالصفحة التالية والسابقة داخل نفس الماركة، بشكل دائري (الأخيرة ترتبط بالأولى).

```javascript
// مثال
const allPages = [
  '/zanussi/washing-machine/agency',
  '/zanussi/washing-machine/maintenance',
  '/zanussi/washing-machine/guarantee',
  // ...
];

const currentIndex = allPages.indexOf(currentPath);
const prevPage = allPages[(currentIndex - 1 + allPages.length) % allPages.length];
const nextPage = allPages[(currentIndex + 1) % allPages.length];
```

#### 2. صفحة المراكز المعتمدة (Authorized Centers)

- **الوظيفة:** صفحة تجمع روابط جميع صفحات الماركة.
- **الربط:** جميع صفحات `authorized-centers` مرتبطة ببعضها عبر جميع الماركات.
- **الأهمية:** عمود فقري للربط الداخلي، يزيد من قوة الشبكة.

### 7.4. Sitemap & Robots.txt

#### Sitemap.xml (ديناميكي)

**الملف:** `pages/sitemap.xml.js`

```javascript
export async function getServerSideProps({ res }) {
  const { data: brands } = await supabase.from('brands').select('slug');
  const { data: products } = await supabase.from('products').select('slug');
  const keywords = ['agency', 'maintenance', 'guarantee', 'hotline', 'numbers', 'customer-service'];

  const urls = [];
  for (const brand of brands) {
    for (const product of products) {
      for (const keyword of keywords) {
        urls.push(`https://tradeforegypt.com/${brand.slug}/${product.slug}/${keyword}`);
      }
    }
    urls.push(`https://tradeforegypt.com/${brand.slug}/authorized-centers`);
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`).join('')}
</urlset>`;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return { props: {} };
}

export default function Sitemap() {
  return null;
}
```

#### Robots.txt

**الملف:** `public/robots.txt`

```
User-agent: *
Allow: /
Sitemap: https://tradeforegypt.com/sitemap.xml

Disallow: /admin/
Disallow: /api/
```

### 7.5. الفهرسة والتحليلات

- سيتم تسجيل كل سبدومين بشكل منفصل في **Google Analytics**.
- سيتم تسجيل كل سبدومين بشكل منفصل في **Google Search Console**.
- سيتم إضافة حقول في لوحة التحكم لإدخال أكواد التتبع لكل ماركة.

---

## 8. لوحة التحكم الإدارية

ستوفر لوحة التحكم واجهة مركزية لإدارة جميع جوانب الشبكة:

### 8.1. الصفحات

| الصفحة | المسار | الوظائف |
|---|---|---|
| **Dashboard** | `/admin/index` | إحصائيات عامة، روابط سريعة، آخر التحديثات. |
| **إدارة الماركات** | `/admin/brands` | CRUD للماركات، رفع الشعار/البنر/الغلاف، ربط بالعائلات. |
| **إدارة المنتجات** | `/admin/products` | CRUD للمنتجات، رفع صور المنتج (حتى 5 صور). |
| **إدارة العائلات** | `/admin/families` | CRUD للعائلات. |
| **إدارة الوسائط** | `/admin/media` | رفع جماعي للصور (Drag & Drop) مع تسمية تلقائية. |
| **إدارة المحتوى** | `/admin/content` | محرر نصوص لإنشاء محتوى مخصص لصفحات معينة مع معاينة و Revalidation تلقائي. |

### 8.2. الوظائف الرئيسية

#### إدارة الماركات

- **عرض:** جدول بجميع الماركات مع الشعار والعائلات المرتبطة.
- **إضافة:** نموذج لإضافة ماركة جديدة.
- **تعديل:** نموذج لتعديل بيانات الماركة.
- **حذف:** حذف ماركة (مع تحذير).
- **رفع الوسائط:** رفع شعار، بنر، وصورة غلاف.
- **ربط العائلات:** اختيار عائلة أو أكثر لربطها بالماركة.

#### إدارة الوسائط (رفع جماعي)

- **Drag & Drop:** سحب وإفلات عدة صور دفعة واحدة.
- **معاينة:** معاينة الصور قبل الرفع.
- **تسمية تلقائية:** `{brand}-{product}-{number}.jpg`.
- **تحديث تلقائي:** تحديث قاعدة البيانات بروابط الصور.
- **تقرير:** عرض تقرير النجاح/الفشل لكل صورة.

#### إدارة المحتوى المخصص

- **اختيار:** اختيار ماركة + منتج + كلمة بحثية.
- **محرر نصوص:** Rich Text Editor لكتابة المحتوى.
- **حقول العناوين:** H1, H2, H3, H4, H5.
- **معاينة:** معاينة المحتوى قبل الحفظ.
- **حفظ:** حفظ في جدول `page_content`.
- **Revalidation:** استدعاء API `/api/revalidate` تلقائيًا لتحديث الصفحة.

---

## 9. التخزين والوسائط (Supabase Storage)

### 9.1. Buckets

سيتم إنشاء 3 buckets منفصلة:

| Bucket | الاستخدام | Public |
|---|---|---|
| `brands` | تخزين شعارات وبنرات الماركات. | ✅ نعم |
| `products` | تخزين صور المنتجات. | ✅ نعم |
| `defaults` | تخزين الصور الافتراضية. | ✅ نعم |

### 9.2. الصور الافتراضية

سيتم رفع 3 صور افتراضية إلى bucket `defaults`:

1. `default-logo.png` (200×200)
2. `default-banner.jpg` (1920×600)
3. `default-product.jpg` (800×800)

### 9.3. معالج الصور (Image Handler)

**الملف:** `lib/image-handler.js`

```javascript
export function getImage(customImage, defaultType) {
  if (customImage) {
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${customImage}`;
  }
  
  const defaults = {
    logo: 'defaults/default-logo.png',
    banner: 'defaults/default-banner.jpg',
    product: 'defaults/default-product.jpg'
  };
  
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${defaults[defaultType]}`;
}
```

### 9.4. سياسات الصلاحيات

- **القراءة:** عامة للجميع.
- **الرفع:** مقيد للمستخدمين المصرح لهم فقط (عبر RLS).

---

## 10. خطة التنفيذ المرحلية (TODO)

### المرحلة 1: البنية التحتية (أسبوع 1) ⚠️ **أولوية قصوى**

#### ✅ تم إنجازه:
- [x] إنشاء قاعدة البيانات (families, brands, products, brand_families)
- [x] إدخال 26 عائلة
- [x] إدخال 352 ماركة
- [x] إدخال 114 منتج
- [x] ربط 541 علاقة (brand_families)
- [x] تنظيف البيانات (إزالة التكرارات)
- [x] تصحيح slugs إلى الإنجليزية

#### 📋 TODO الآن:

**1. [ ] تنفيذ SQL لإضافة الأعمدة الناقصة** (5 دقائق)
- الملف: `/database/add-missing-columns.sql`
- الإجراء: تشغيل السكريبت في Supabase SQL Editor
- التحقق: `SELECT * FROM general_stats;`

**2. [ ] إعداد Supabase Storage** (10 دقائق)
- إنشاء 3 buckets: `brands`, `products`, `defaults`
- رفع الصور الافتراضية إلى bucket `defaults`
- ضبط صلاحيات القراءة العامة والرفع المقيد

**3. [ ] إعداد بيئة التطوير** (5 دقائق)
- تثبيت التبعيات: `npm install`
- التحقق من ملف `.env.local`
- تشغيل المشروع محليًا: `npm run dev`

---

### المرحلة 2: الصفحات الديناميكية (أسبوع 1-2)

**4. [ ] إنشاء الصفحة الديناميكية الأساسية** (30-45 دقيقة)
- الملف: `pages/[brand]/[product]/[keyword].js`
- تطبيق `getStaticProps` كاملاً
- تطبيق `getStaticPaths`
- اختبار: `http://localhost:3000/samsung/fridge/agency`

**5. [ ] إنشاء `lib/supabase.js`** (2 دقيقة)

**6. [ ] إنشاء Components الأساسية** (60 دقيقة)
- `SEOHead.js` (15 دقيقة)
- `SchemaMarkup.js` (20 دقيقة)
- `Breadcrumb.js` (10 دقيقة)
- `PrevNextLinks.js` (15 دقيقة)

**7. [ ] إنشاء `lib` helpers** (95 دقيقة)
- `seo-generator.js` (15 دقيقة)
- `schema-generator.js` (20 دقيقة)
- `content-generator.js` (30 دقيقة)
- `navigation-helper.js` (20 دقيقة)
- `image-handler.js` (10 دقيقة)

**8. [ ] إنشاء صفحة "مراكز معتمدة"** (45-60 دقيقة)
- الملف: `pages/[brand]/authorized-centers.js`

**9. [ ] إنشاء API Route للـ Revalidation** (10 دقيقة)
- الملف: `pages/api/revalidate.js`

---

### المرحلة 3: لوحة التحكم (أسبوع 2-3)

**10. [ ] إنشاء صفحة Dashboard الرئيسية** (30 دقيقة)
**11. [ ] إنشاء صفحة إدارة الماركات** (60 دقيقة)
**12. [ ] إنشاء صفحة إدارة المنتجات** (60 دقيقة)
**13. [ ] إنشاء صفحة إدارة العائلات** (30 دقيقة)
**14. [ ] إنشاء صفحة رفع الصور بالجملة** (45 دقيقة)
**15. [ ] إنشاء API Routes لرفع الصور** (50 دقيقة)
- `upload-image.js` (20 دقيقة)
- `bulk-upload.js` (30 دقيقة)
**16. [ ] إنشاء صفحة إدارة المحتوى المخصص** (60 دقيقة)

---

### المرحلة 4: التحسينات والاختبار (أسبوع 3-4)

**17. [ ] تحسينات SEO** (2-3 ساعات)
- اختبار Meta Tags
- اختبار Schema في Google Rich Results Test
- اختبار Open Graph
- إضافة Sitemap.xml
- إضافة Robots.txt

**18. [ ] تحسينات الأداء** (2-3 ساعات)
- اختبار PageSpeed Insights
- تحسين حجم الصور (WebP, Compression)
- Lazy Loading
- Code Splitting

**19. [ ] اختبار الوظائف** (3-4 ساعات)
- اختبار Previous/Next Links
- اختبار Breadcrumb
- اختبار ISR Revalidation
- اختبار لوحة التحكم
- اختبار على أجهزة مختلفة

**20. [ ] إضافة محتوى يدوي للصفحات المهمة** (10-15 ساعة - اختياري)
- تحديد أهم 50 صفحة
- كتابة محتوى فريد (500+ كلمة)

---

### المرحلة 5: النشر والمراقبة (أسبوع 4-5)

**21. [ ] إعداد Git Repository** (10 دقائق)
**22. [ ] النشر على Vercel** (15 دقيقة)
**23. [ ] ربط Domain المخصص** (30 دقيقة + وقت DNS)
**24. [ ] إعداد Google Search Console** (20 دقيقة)
**25. [ ] إعداد Google Analytics** (15 دقيقة)
**26. [ ] إعداد Monitoring والتنبيهات** (30 دقيقة)

---

### المرحلة 6: التحسين المستمر (مستمر)

**27. [ ] مراقبة الأداء والسيو** (دوري)
**28. [ ] إضافة محتوى جديد** (مستمر)
**29. [ ] بناء Backlinks** (استراتيجية طويلة الأمد)

---

## 11. أمثلة الكود والتطبيق

### 11.1. مثال: `lib/seo-generator.js`

```javascript
export function generateTitle(brand, product, keyword) {
  const keywordMap = {
    agency: 'توكيل',
    maintenance: 'صيانة',
    guarantee: 'ضمان',
    hotline: 'خط ساخن',
    numbers: 'أرقام',
    'customer-service': 'خدمة عملاء'
  };

  const keywordAr = keywordMap[keyword] || keyword;
  const base = `${brand.name} ${product ? product.name : ''}`.trim();
  
  return `${keywordAr} ${base} | Trade for Egypt`;
}

export function generateMetaDescription(brand, product, keyword) {
  const keywordMap = {
    agency: 'توكيل',
    maintenance: 'صيانة',
    guarantee: 'ضمان',
    hotline: 'خط ساخن',
    numbers: 'أرقام',
    'customer-service': 'خدمة عملاء'
  };

  const keywordAr = keywordMap[keyword] || keyword;
  const base = `${brand.name} ${product ? product.name : ''}`.trim();
  
  return `احصل على أفضل خدمات ${keywordAr} ${base} في مصر. فريق محترف ومتخصص لخدمتك على مدار الساعة.`;
}

export function generateCanonicalUrl(brand, product, keyword) {
  const base = product ? `/${brand.slug}/${product.slug}` : `/${brand.slug}`;
  return `https://tradeforegypt.com${base}/${keyword}`;
}

export function generateKeywords(brand, product, keyword) {
  const keywords = [
    `${keyword} ${brand.name}`,
    `${brand.name} ${product ? product.name : ''}`,
    `${keyword} ${brand.name} مصر`,
    `${brand.name} service`,
    `${brand.name} Egypt`
  ];
  
  return keywords.join(', ');
}

export function generateAltText(brand, product, keyword, imageNumber) {
  return `${brand.name} ${product ? product.name : ''} - ${keyword} - صورة ${imageNumber}`;
}
```

### 11.2. مثال: `lib/schema-generator.js`

```javascript
export function generateOrganizationSchema(brand) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": brand.name,
    "url": `https://tradeforegypt.com/${brand.slug}`,
    "logo": brand.logo_url || "https://tradeforegypt.com/default-logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+20-XXX-XXX-XXXX",
      "contactType": "customer service",
      "areaServed": "EG",
      "availableLanguage": ["ar", "en"]
    }
  };
}

export function generateProductSchema(brand, product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${brand.name} ${product.name}`,
    "image": product.photo_1 || "https://tradeforegypt.com/default-product.jpg",
    "description": product.description || `${brand.name} ${product.name}`,
    "brand": {
      "@type": "Brand",
      "name": brand.name
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.7",
      "reviewCount": "100"
    }
  };
}

export function generateLocalBusinessSchema(brand, product, keyword) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `${brand.name} Service Center`,
    "image": brand.banner_url || "https://tradeforegypt.com/default-banner.jpg",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Cairo",
      "addressCountry": "EG"
    },
    "telephone": "+20-XXX-XXX-XXXX",
    "openingHours": "Mo-Su 09:00-21:00"
  };
}

export function generateBreadcrumbSchema(brand, product, keyword) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://tradeforegypt.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": brand.name,
        "item": `https://tradeforegypt.com/${brand.slug}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.name,
        "item": `https://tradeforegypt.com/${brand.slug}/${product.slug}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": keyword,
        "item": `https://tradeforegypt.com/${brand.slug}/${product.slug}/${keyword}`
      }
    ]
  };
}

export function generateWebPageSchema(brand, product, keyword) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `${keyword} ${brand.name} ${product.name}`,
    "description": `احصل على أفضل خدمات ${keyword} ${brand.name} ${product.name} في مصر`,
    "url": `https://tradeforegypt.com/${brand.slug}/${product.slug}/${keyword}`
  };
}
```

### 11.3. مثال: `components/SEOHead.js`

```javascript
import Head from 'next/head';

export default function SEOHead({ seo, schema }) {
  return (
    <Head>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      <link rel="canonical" href={seo.canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={seo.canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={seo.image || "https://tradeforegypt.com/og-image.jpg"} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image || "https://tradeforegypt.com/og-image.jpg"} />

      {/* JSON-LD Schema */}
      {schema && Object.values(schema).map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}
    </Head>
  );
}
```

---

## 12. معايير القبول والاختبار

### 12.1. قبول صفحة ديناميكية

- ✅ تُحمّل بدون أخطاء.
- ✅ `title`, `meta description`, `canonical`, `OG` tags موجودة ودقيقة.
- ✅ JSON-LD صالح في Google Rich Results Test.
- ✅ Breadcrumb صحيح.
- ✅ الربط الداخلي (Prev/Next, Authorized Centers) يعمل.
- ✅ `alt` text للصور يتم توليده تلقائيًا.
- ✅ تكرار الكلمة المستهدفة ≤5 مع تنويع صيغة التمييز.
- ✅ Revalidation يعمل بعد التعديل من لوحة التحكم.

### 12.2. قبول لوحة التحكم

- ✅ CRUD كامل للعائلات، الماركات، والمنتجات.
- ✅ رفع فردي وجماعي للصور يعمل ويحدّث قاعدة البيانات.
- ✅ محرر المحتوى المخصص يحفظ ويطلق Revalidation.
- ✅ صلاحيات الرفع مقيدة للمستخدمين المصرح لهم فقط.
- ✅ إحصائيات عامة من `general_stats` تظهر بشكل صحيح.

### 12.3. اختبارات الأداء

- ✅ Google PageSpeed Insights: درجة 80+ (Mobile & Desktop).
- ✅ وقت تحميل الصفحة: أقل من 3 ثوانٍ.
- ✅ حجم الصفحة: أقل من 1 MB.

---

## 13. النشر والمراقبة

### 13.1. النشر على Vercel

**الخطوات:**

1. إنشاء حساب على Vercel (إذا لم يكن موجوداً).
2. Import Project من GitHub.
3. إضافة Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `REVALIDATE_SECRET`
4. Deploy.
5. اختبار الموقع على Vercel URL.

### 13.2. ربط Domain المخصص

**الخطوات:**

1. إضافة Domain في Vercel.
2. ضبط DNS Records:
   - A Record: `76.76.21.21`
   - CNAME: `cname.vercel-dns.com`
3. انتظار انتشار DNS (24-48 ساعة).
4. التحقق من HTTPS.

### 13.3. Google Search Console

**الخطوات:**

1. إضافة الموقع.
2. التحقق من الملكية (HTML Tag أو DNS).
3. إرسال Sitemap.
4. طلب فهرسة الصفحات الرئيسية.

### 13.4. Google Analytics

**الخطوات:**

1. إنشاء Property جديد.
2. الحصول على Tracking ID.
3. إضافة الكود إلى `pages/_app.js`.
4. اختبار التتبع.

### 13.5. Monitoring

- **Vercel Analytics:** مراقبة الأداء والزيارات.
- **UptimeRobot:** مراقبة Uptime.
- **Sentry (اختياري):** تتبع الأخطاء.

---

## 14. التحديات والحلول

### 14.1. التحدي: حجم المشروع

**المشكلة:** 350+ موقع فرعي × عشرات الصفحات = آلاف الصفحات.

**الحل:**
- نظام توليد آلي بالكامل.
- قاعدة بيانات مركزية.
- ISR لتوليد الصفحات عند الحاجة.

### 14.2. التحدي: تفرد المحتوى

**المشكلة:** كيف نضمن أن كل صفحة لها محتوى فريد؟

**الحل:**
- استخدام قوالب نصية ديناميكية.
- إضافة معلومات خاصة بكل ماركة/منتج.
- كتابة يدوية لأهم 50 صفحة.

### 14.3. التحدي: الصيانة

**المشكلة:** كيف نضيف ماركات جديدة بسهولة؟

**الحل:**
- إضافة الماركة في جدول `brands` عبر لوحة التحكم.
- إضافة المنتجات في جدول `products`.
- التوليد التلقائي للصفحات عبر ISR.

### 14.4. التحدي: التحكم البصري (Themes)

**المشكلة:** كيف نتحكم في ألوان وتصميم كل سبدومين؟

**الحل المقترح:**
- إنشاء جدول `brand_theme_config` يحتوي على:
  - `brand_id`
  - `primary_color`
  - `secondary_color`
  - `font_family`
  - `banner_image_url`
  - `favicon_url`
  - `og_image_url`
- قراءة هذه الإعدادات في `getStaticProps` وتمريرها للمكونات.
- استخدام CSS Variables لتطبيق الألوان ديناميكيًا.

---

## 15. الخلاصة والخطوات التالية

### 15.1. ما تم إنجازه حتى الآن

- ✅ تصميم هيكل قاعدة البيانات الكامل.
- ✅ إدخال 26 عائلة، 352 ماركة، 114 منتج، 541 علاقة.
- ✅ إنشاء مشروع Supabase.
- ✅ شراء ونشر قالب Iori على Vercel.
- ✅ ربط GitHub بـ Vercel للنشر التلقائي.
- ✅ إنشاء توثيق شامل.

### 15.2. الخطوة التالية الفورية

**ابدأ الآن بـ:**

1. **تنفيذ SQL** (5 دقائق)
   - افتح Supabase Dashboard
   - انسخ محتوى `/database/add-missing-columns.sql`
   - نفّذ في SQL Editor

2. **إعداد Storage** (10 دقائق)
   - أنشئ 3 buckets: brands, products, defaults
   - ارفع الصور الافتراضية

3. **ابدأ بناء الصفحة الأولى** (30 دقيقة)
   - `pages/[brand]/[product]/[keyword].js`

### 15.3. النتائج المتوقعة

عند اكتمال المشروع، ستحصل على:

- **شبكة قوية:** 350+ موقع فرعي مترابط.
- **سيطرة على البحث:** في مئات الكلمات المفتاحية.
- **زيارات عالية:** من محركات البحث.
- **سهولة الإدارة:** من لوحة تحكم واحدة.
- **قابلية التوسع:** إضافة ماركات ومنتجات جديدة بسهولة.

---

## 📚 مراجع ومصادر

- **Next.js Documentation:** https://nextjs.org/docs
- **Supabase Documentation:** https://supabase.com/docs
- **Vercel Documentation:** https://vercel.com/docs
- **Schema.org:** https://schema.org
- **Google Search Central:** https://developers.google.com/search

---

**تم إعداد هذه الوثيقة بواسطة:** Manus AI  
**التاريخ:** 7 نوفمبر 2025  
**الإصدار:** 1.0 - النسخة النهائية الشاملة

---

**ملاحظة نهائية:** هذه الوثيقة هي دمج شامل وكامل للملفات الثلاثة المقدمة، وتحتوي على كل التفاصيل اللازمة لتنفيذ المشروع من الألف إلى الياء. أي مطور Next.js + Supabase يمكنه البدء فورًا في التنفيذ بناءً على هذه الوثيقة.

**بالتوفيق في بناء هذه الشبكة القوية! 🚀**
