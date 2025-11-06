# نظام الصور والمحتوى والسيو - Trade for Egypt

## 📋 جدول المحتويات

1. [نظام الصور](#نظام-الصور)
2. [بنية Supabase Storage](#بنية-supabase-storage)
3. [تعديلات قاعدة البيانات](#تعديلات-قاعدة-البيانات)
4. [نظام السيو التلقائي](#نظام-السيو-التلقائي)
5. [Schema Markup](#schema-markup)
6. [أمثلة عملية](#أمثلة-عملية)

---

## 🖼️ نظام الصور

### أنواع الصور المطلوبة:

#### 1. **صور الماركات:**
- **Logo:** شعار الماركة (PNG شفاف)
- **Banner:** بنر رئيسي للصفحة الرئيسية للماركة
- **Cover:** صورة غلاف (optional)

#### 2. **صور المنتجات:**
- **Product Images:** صور المنتجات (حتى 5 صور لكل منتج)
  - `photo_1`: الصورة الرئيسية
  - `photo_2`: صورة إضافية
  - `photo_3`: صورة إضافية
  - `photo_4`: صورة إضافية
  - `photo_5`: صورة إضافية

#### 3. **صور الصفحات:**
- **Page Banner:** بنر خاص بكل صفحة (optional)
- **Gallery:** معرض صور (optional)

---

## 📁 بنية Supabase Storage

### البنية المقترحة:

```
storage/
├── brands/
│   ├── samsung/
│   │   ├── logo.png                    ← شعار Samsung
│   │   ├── banner.jpg                  ← بنر رئيسي
│   │   └── cover.jpg                   ← صورة غلاف
│   ├── lg/
│   │   ├── logo.png
│   │   ├── banner.jpg
│   │   └── cover.jpg
│   └── ...
│
├── products/
│   ├── samsung/
│   │   ├── fridge/
│   │   │   ├── samsung-fridge-1.jpg    ← صورة رئيسية
│   │   │   ├── samsung-fridge-2.jpg
│   │   │   ├── samsung-fridge-3.jpg
│   │   │   └── samsung-fridge-4.jpg
│   │   ├── tv/
│   │   │   ├── samsung-tv-1.jpg
│   │   │   ├── samsung-tv-2.jpg
│   │   │   └── samsung-tv-3.jpg
│   │   └── ...
│   ├── lg/
│   │   ├── washing-machine/
│   │   │   ├── lg-washing-machine-1.jpg
│   │   │   └── lg-washing-machine-2.jpg
│   │   └── ...
│   └── ...
│
└── pages/
    ├── samsung/
    │   ├── fridge/
    │   │   ├── agency/
    │   │   │   └── banner.jpg          ← بنر خاص بصفحة التوكيل
    │   │   ├── maintenance/
    │   │   │   └── banner.jpg
    │   │   └── ...
    │   └── ...
    └── ...
```

### تسمية الملفات (File Naming Convention):

```
{brand-slug}-{product-slug}-{number}.{ext}

أمثلة:
- samsung-fridge-1.jpg
- lg-washing-machine-2.jpg
- zanussi-dishwasher-3.jpg
```

### فوائد هذه التسمية:
1. ✅ **السيو:** اسم الملف يحتوي على الكلمات المفتاحية
2. ✅ **Alt Text:** يمكن توليده تلقائياً من اسم الملف
3. ✅ **التنظيم:** سهل البحث والفرز
4. ✅ **الفريدة:** لا تكرار في الأسماء

---

## 🗄️ تعديلات قاعدة البيانات

### 1. إضافة أعمدة للصور في جدول `brands`:

```sql
ALTER TABLE brands ADD COLUMN logo_url TEXT;
ALTER TABLE brands ADD COLUMN banner_url TEXT;
ALTER TABLE brands ADD COLUMN cover_url TEXT;
```

**مثال:**
```json
{
  "id": 1,
  "name": "Samsung",
  "slug": "samsung",
  "logo_url": "https://...supabase.co/storage/v1/object/public/brands/samsung/logo.png",
  "banner_url": "https://...supabase.co/storage/v1/object/public/brands/samsung/banner.jpg",
  "cover_url": "https://...supabase.co/storage/v1/object/public/brands/samsung/cover.jpg"
}
```

---

### 2. إضافة أعمدة للصور في جدول `products`:

```sql
ALTER TABLE products ADD COLUMN photo_1 TEXT;
ALTER TABLE products ADD COLUMN photo_2 TEXT;
ALTER TABLE products ADD COLUMN photo_3 TEXT;
ALTER TABLE products ADD COLUMN photo_4 TEXT;
ALTER TABLE products ADD COLUMN photo_5 TEXT;
```

**مثال:**
```json
{
  "id": 10,
  "name": "غسالة",
  "slug": "washing-machine",
  "family_id": 20,
  "photo_1": "https://...supabase.co/storage/v1/object/public/products/samsung/washing-machine/samsung-washing-machine-1.jpg",
  "photo_2": "https://...supabase.co/storage/v1/object/public/products/samsung/washing-machine/samsung-washing-machine-2.jpg",
  "photo_3": "https://...supabase.co/storage/v1/object/public/products/samsung/washing-machine/samsung-washing-machine-3.jpg"
}
```

---

### 3. إضافة أعمدة للمحتوى والسيو:

```sql
-- في جدول brands
ALTER TABLE brands ADD COLUMN description TEXT;
ALTER TABLE brands ADD COLUMN meta_title TEXT;
ALTER TABLE brands ADD COLUMN meta_description TEXT;

-- في جدول products
ALTER TABLE products ADD COLUMN description TEXT;
ALTER TABLE products ADD COLUMN meta_title TEXT;
ALTER TABLE products ADD COLUMN meta_description TEXT;
```

---

## 🎯 نظام السيو التلقائي

### 1. **Title Tag (العنوان)**

#### القالب:
```
{keyword_ar} {product_name} {brand_name} | {location} | Trade for Egypt
```

#### أمثلة:
```
توكيل غسالة Samsung | مصر | Trade for Egypt
صيانة ثلاجة LG | القاهرة | Trade for Egypt
ضمان تلفزيون Sony | الإسكندرية | Trade for Egypt
```

#### الكود:
```javascript
function generateTitle(brand, product, keyword) {
  const keywordAr = KEYWORDS_MAP[keyword].ar;
  return `${keywordAr} ${product.name} ${brand.name} | مصر | Trade for Egypt`;
}
```

---

### 2. **Meta Description (الوصف)**

#### القالب:
```
{keyword_ar} {product_name} {brand_name} في مصر - {generic_description}. خدمات معتمدة، أرقام تواصل مباشرة، وأسعار تنافسية.
```

#### أمثلة:
```
توكيل غسالة Samsung في مصر - احصل على غسالة Samsung أصلية مع ضمان معتمد. خدمات معتمدة، أرقام تواصل مباشرة، وأسعار تنافسية.

صيانة ثلاجة LG في مصر - مركز صيانة LG المعتمد يوفر خدمات صيانة متخصصة. خدمات معتمدة، أرقام تواصل مباشرة، وأسعار تنافسية.
```

#### الكود:
```javascript
function generateMetaDescription(brand, product, keyword) {
  const keywordAr = KEYWORDS_MAP[keyword].ar;
  
  const genericDescriptions = {
    'agency': `احصل على ${product.name} ${brand.name} أصلية مع ضمان معتمد`,
    'maintenance': `مركز صيانة ${brand.name} المعتمد يوفر خدمات صيانة متخصصة`,
    'warranty': `ضمان ${brand.name} الرسمي يشمل الصيانة المجانية وقطع الغيار الأصلية`,
    'customer-service': `خدمة عملاء ${brand.name} متاحة 24/7 للرد على استفساراتكم`,
    'hotline': `الخط الساخن ${brand.name} متاح على مدار الساعة لخدمتكم`,
    'numbers': `جميع أرقام التواصل الرسمية مع ${brand.name} في مصر`
  };
  
  const generic = genericDescriptions[keyword] || `${keywordAr} ${product.name} ${brand.name}`;
  
  return `${keywordAr} ${product.name} ${brand.name} في مصر - ${generic}. خدمات معتمدة، أرقام تواصل مباشرة، وأسعار تنافسية.`;
}
```

---

### 3. **Canonical URL (الرابط الأساسي)**

#### القالب:
```
https://tradeforegypt.com/{brand_slug}/{product_slug}/{keyword}
```

#### أمثلة:
```
https://tradeforegypt.com/samsung/washing-machine/agency
https://tradeforegypt.com/lg/fridge/maintenance
https://tradeforegypt.com/sony/tv/warranty
```

#### الكود:
```javascript
function generateCanonicalUrl(brand, product, keyword) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tradeforegypt.com';
  return `${baseUrl}/${brand.slug}/${product.slug}/${keyword}`;
}
```

---

### 4. **Alt Text للصور**

#### القالب:
```
{product_name} {brand_name} - {keyword_ar}
```

#### أمثلة:
```
غسالة Samsung - توكيل معتمد
ثلاجة LG - صيانة متخصصة
تلفزيون Sony - ضمان رسمي
```

#### الكود:
```javascript
function generateAltText(brand, product, keyword, imageNumber = 1) {
  const keywordAr = KEYWORDS_MAP[keyword].ar;
  return `${product.name} ${brand.name} - ${keywordAr} (صورة ${imageNumber})`;
}
```

---

## 📊 Schema Markup (البيانات المنظمة)

### 1. **Organization Schema** (للماركة)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Samsung Egypt",
  "url": "https://tradeforegypt.com/samsung",
  "logo": "https://...supabase.co/storage/v1/object/public/brands/samsung/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+20-XX-XXXX-XXXX",
    "contactType": "customer service",
    "areaServed": "EG",
    "availableLanguage": ["ar", "en"]
  },
  "sameAs": [
    "https://www.facebook.com/SamsungEgypt",
    "https://twitter.com/SamsungEgypt"
  ]
}
```

---

### 2. **Product Schema** (للمنتج)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "غسالة Samsung",
  "image": [
    "https://...supabase.co/storage/v1/object/public/products/samsung/washing-machine/samsung-washing-machine-1.jpg",
    "https://...supabase.co/storage/v1/object/public/products/samsung/washing-machine/samsung-washing-machine-2.jpg"
  ],
  "description": "غسالة Samsung عالية الجودة مع ضمان معتمد",
  "brand": {
    "@type": "Brand",
    "name": "Samsung"
  },
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "EGP",
    "availability": "https://schema.org/InStock"
  }
}
```

---

### 3. **LocalBusiness Schema** (للتوكيل/الصيانة)

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "توكيل Samsung المعتمد",
  "image": "https://...supabase.co/storage/v1/object/public/brands/samsung/banner.jpg",
  "telephone": "+20-XX-XXXX-XXXX",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "شارع XXX",
    "addressLocality": "القاهرة",
    "addressCountry": "EG"
  },
  "priceRange": "$$",
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ],
    "opens": "09:00",
    "closes": "21:00"
  }
}
```

---

### 4. **BreadcrumbList Schema** (التنقل)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "الرئيسية",
      "item": "https://tradeforegypt.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "الأجهزة المنزلية",
      "item": "https://tradeforegypt.com/family/home-appliances"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Samsung",
      "item": "https://tradeforegypt.com/samsung"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "غسالة",
      "item": "https://tradeforegypt.com/samsung/washing-machine"
    },
    {
      "@type": "ListItem",
      "position": 5,
      "name": "توكيل",
      "item": "https://tradeforegypt.com/samsung/washing-machine/agency"
    }
  ]
}
```

---

## 💻 الكود الكامل للصفحة

### Component: SEOHead

```javascript
// components/SEOHead.js
import Head from 'next/head';

export default function SEOHead({ brand, product, keyword, family }) {
  const keywordData = KEYWORDS_MAP[keyword];
  
  // توليد Title
  const title = `${keywordData.ar} ${product.name} ${brand.name} | مصر | Trade for Egypt`;
  
  // توليد Meta Description
  const description = generateMetaDescription(brand, product, keyword);
  
  // توليد Canonical URL
  const canonicalUrl = `https://tradeforegypt.com/${brand.slug}/${product.slug}/${keyword}`;
  
  // توليد Schema Markup
  const schemas = generateSchemas(brand, product, keyword, family);
  
  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={brand.banner_url || brand.logo_url} />
      <meta property="og:locale" content="ar_EG" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={brand.banner_url || brand.logo_url} />
      
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.product) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.breadcrumb) }}
      />
      {keyword === 'agency' || keyword === 'maintenance' ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.localBusiness) }}
        />
      ) : null}
    </Head>
  );
}

function generateMetaDescription(brand, product, keyword) {
  const keywordAr = KEYWORDS_MAP[keyword].ar;
  
  const genericDescriptions = {
    'agency': `احصل على ${product.name} ${brand.name} أصلية مع ضمان معتمد`,
    'maintenance': `مركز صيانة ${brand.name} المعتمد يوفر خدمات صيانة متخصصة`,
    'warranty': `ضمان ${brand.name} الرسمي يشمل الصيانة المجانية وقطع الغيار الأصلية`,
    'customer-service': `خدمة عملاء ${brand.name} متاحة 24/7 للرد على استفساراتكم`,
    'hotline': `الخط الساخن ${brand.name} متاح على مدار الساعة لخدمتكم`,
    'numbers': `جميع أرقام التواصل الرسمية مع ${brand.name} في مصر`
  };
  
  const generic = genericDescriptions[keyword];
  return `${keywordAr} ${product.name} ${brand.name} في مصر - ${generic}. خدمات معتمدة، أرقام تواصل مباشرة، وأسعار تنافسية.`;
}

function generateSchemas(brand, product, keyword, family) {
  const baseUrl = 'https://tradeforegypt.com';
  
  return {
    organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": `${brand.name} Egypt`,
      "url": `${baseUrl}/${brand.slug}`,
      "logo": brand.logo_url
    },
    product: {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": `${product.name} ${brand.name}`,
      "image": [
        product.photo_1,
        product.photo_2,
        product.photo_3
      ].filter(Boolean),
      "brand": {
        "@type": "Brand",
        "name": brand.name
      }
    },
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "الرئيسية",
          "item": baseUrl
        },
        family ? {
          "@type": "ListItem",
          "position": 2,
          "name": family.name,
          "item": `${baseUrl}/family/${family.slug}`
        } : null,
        {
          "@type": "ListItem",
          "position": family ? 3 : 2,
          "name": brand.name,
          "item": `${baseUrl}/${brand.slug}`
        },
        {
          "@type": "ListItem",
          "position": family ? 4 : 3,
          "name": product.name,
          "item": `${baseUrl}/${brand.slug}/${product.slug}`
        },
        {
          "@type": "ListItem",
          "position": family ? 5 : 4,
          "name": KEYWORDS_MAP[keyword].ar,
          "item": `${baseUrl}/${brand.slug}/${product.slug}/${keyword}`
        }
      ].filter(Boolean)
    },
    localBusiness: (keyword === 'agency' || keyword === 'maintenance') ? {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": `${KEYWORDS_MAP[keyword].ar} ${brand.name} المعتمد`,
      "image": brand.banner_url,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "EG"
      }
    } : null
  };
}
```

---

## 📸 Component: ProductImages

```javascript
// components/ProductImages.js
import Image from 'next/image';

export default function ProductImages({ brand, product, keyword }) {
  const images = [
    product.photo_1,
    product.photo_2,
    product.photo_3,
    product.photo_4,
    product.photo_5
  ].filter(Boolean);
  
  if (images.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">لا توجد صور متاحة</p>
      </div>
    );
  }
  
  return (
    <div className="product-images">
      {/* الصورة الرئيسية */}
      <div className="main-image mb-3">
        <Image
          src={images[0]}
          alt={generateAltText(brand, product, keyword, 1)}
          width={800}
          height={600}
          priority
          className="img-fluid rounded"
        />
      </div>
      
      {/* الصور الإضافية */}
      {images.length > 1 && (
        <div className="row">
          {images.slice(1).map((img, index) => (
            <div key={index} className="col-md-3 mb-3">
              <Image
                src={img}
                alt={generateAltText(brand, product, keyword, index + 2)}
                width={200}
                height={150}
                className="img-fluid rounded"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function generateAltText(brand, product, keyword, imageNumber) {
  const keywordAr = KEYWORDS_MAP[keyword].ar;
  return `${product.name} ${brand.name} - ${keywordAr} (صورة ${imageNumber})`;
}
```

---

## ✅ الخلاصة

### ما تم تغطيته:

1. ✅ **نظام الصور:**
   - Logo, Banner, Cover للماركات
   - 5 صور لكل منتج
   - تسمية موحدة للسيو

2. ✅ **Supabase Storage:**
   - بنية منظمة بالفولدرات
   - تسمية ملفات صديقة للسيو

3. ✅ **قاعدة البيانات:**
   - أعمدة جديدة للصور
   - أعمدة للمحتوى والسيو

4. ✅ **السيو التلقائي:**
   - Title توليد تلقائي
   - Meta Description توليد تلقائي
   - Canonical URL توليد تلقائي
   - Alt Text توليد تلقائي

5. ✅ **Schema Markup:**
   - Organization Schema
   - Product Schema
   - LocalBusiness Schema
   - BreadcrumbList Schema

---

## 🚀 الخطوات التالية

1. **تطبيق التعديلات على قاعدة البيانات**
2. **إنشاء Buckets في Supabase Storage**
3. **تحديث الصفحة الديناميكية** لاستخدام SEOHead و ProductImages
4. **إضافة واجهة رفع الصور** في لوحة التحكم
5. **اختبار السيو** باستخدام Google Search Console

---

**Trade for Egypt** - نظام سيو متكامل 🚀
