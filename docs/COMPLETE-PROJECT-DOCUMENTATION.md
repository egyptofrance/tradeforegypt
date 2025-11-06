# 📘 التوثيق الشامل والمفصل لمشروع Trade for Egypt

**تاريخ الإنشاء:** نوفمبر 2025  
**الإصدار:** 1.0  
**الغرض:** مرجع كامل ومفصل لجميع جوانب المشروع

---

## 📑 جدول المحتويات

1. [نظرة عامة على المشروع](#1-نظرة-عامة-على-المشروع)
2. [البنية المعمارية](#2-البنية-المعمارية)
3. [نظام ISR (Incremental Static Regeneration)](#3-نظام-isr)
4. [نظام الروابط الداخلية](#4-نظام-الروابط-الداخلية)
5. [نظام الصور والميديا](#5-نظام-الصور-والميديا)
6. [نظام السيو التلقائي](#6-نظام-السيو-التلقائي)
7. [نظام Schema Markup](#7-نظام-schema-markup)
8. [لوحة التحكم](#8-لوحة-التحكم)
9. [قاعدة البيانات](#9-قاعدة-البيانات)
10. [أمثلة عملية](#10-أمثلة-عملية)

---

## 1. نظرة عامة على المشروع

### 1.1 الفكرة الأساسية

**Trade for Egypt** هي شبكة مواقع متكاملة تتكون من **350+ موقع فرعي**، كل موقع مخصص لماركة معينة (مثل: Samsung, LG, Bosch, إلخ).

### 1.2 الهدف

إنشاء شبكة مواقع ضخمة ومترابطة تغطي جميع الماركات والمنتجات في السوق المصري، مع تحسين محركات البحث (SEO) لتحقيق ترتيب عالٍ في Google.

### 1.3 الأرقام

- **العائلات:** 26 عائلة (أجهزة منزلية، إلكترونيات، تكييف، إلخ)
- **الماركات:** 352 ماركة
- **المنتجات:** ~114 منتج
- **الكلمات المفتاحية:** 6 كلمات (agency, maintenance, warranty, customer-service, hotline, numbers)
- **إجمالي الصفحات المتوقعة:** ~16,500 صفحة

### 1.4 التقنيات المستخدمة

- **Frontend:** Next.js 13 (Pages Router)
- **Backend:** Supabase (PostgreSQL)
- **Hosting:** Vercel
- **Storage:** Supabase Storage
- **Template:** Themeforest Iori (47V1A0U3)

---

## 2. البنية المعمارية

### 2.1 بنية المواقع الفرعية (Subdomains)

كل ماركة لها موقع فرعي خاص بها:

```
samsung.tradeforegypt.com
lg.tradeforegypt.com
bosch.tradeforegypt.com
...
```

**أو باستخدام المسارات (Paths):**

```
tradeforegypt.com/samsung
tradeforegypt.com/lg
tradeforegypt.com/bosch
...
```

### 2.2 بنية الصفحات

كل موقع فرعي يحتوي على صفحات ديناميكية بالشكل التالي:

```
/{brand}/{product}/{keyword}
```

**أمثلة:**
```
/samsung/fridge/agency
/samsung/fridge/maintenance
/samsung/fridge/warranty
/samsung/tv/agency
/lg/washing-machine/hotline
```

### 2.3 الصفحات الخاصة

#### أ. صفحة "مراكز معتمدة" (Authorized Centers)

```
/{brand}/authorized-centers
```

**أمثلة:**
```
/samsung/authorized-centers
/lg/authorized-centers
/bosch/authorized-centers
```

**الغرض:**
- صفحة Hub تجمع جميع روابط صفحات الماركة
- تحسين الترابط الداخلي (Internal Linking)
- تسهيل الزحف (Crawling) لمحركات البحث

---

## 3. نظام ISR (Incremental Static Regeneration)

### 3.1 ما هو ISR؟

**ISR** هو نظام في Next.js يجمع بين مزايا:
- **Static Site Generation (SSG):** صفحات ثابتة سريعة
- **Server-Side Rendering (SSR):** محتوى ديناميكي محدث

### 3.2 كيف يعمل ISR؟

#### الخطوة 1: أول زائر
```
مستخدم يزور: /samsung/fridge/agency
    ↓
Next.js يولد الصفحة من قاعدة البيانات
    ↓
يحفظها كـ HTML ثابت في Vercel
    ↓
يرسلها للمستخدم (سريع ⚡)
```

#### الخطوة 2: الزوار التاليون
```
مستخدمون آخرون يزورون: /samsung/fridge/agency
    ↓
Vercel يرسل HTML الثابت مباشرة (أسرع ⚡⚡)
    ↓
بدون الحاجة لقاعدة البيانات
```

#### الخطوة 3: التحديث
```
تعديل في لوحة التحكم (مثلاً: تغيير رقم الهاتف)
    ↓
API Request إلى: /api/revalidate
    ↓
Next.js يعيد توليد الصفحات المتأثرة
    ↓
الزوار الجدد يحصلون على المحتوى المحدث
```

### 3.3 التطبيق في الكود

#### ملف: `pages/[brand]/[product]/[keyword].js`

```javascript
import { createClient } from '@supabase/supabase-js';
import Head from 'next/head';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ProductPage({ brand, product, keyword, content }) {
  return (
    <>
      <Head>
        <title>{content.metaTitle}</title>
        <meta name="description" content={content.metaDescription} />
        <link rel="canonical" href={content.canonicalUrl} />
        {/* المزيد من Meta Tags */}
      </Head>

      <main>
        <h1>{content.h1}</h1>
        {/* المحتوى */}
      </main>
    </>
  );
}

// ISR: إعادة التوليد كل ساعة
export async function getStaticProps({ params }) {
  const { brand, product, keyword } = params;

  // جلب البيانات من Supabase
  const { data: brandData } = await supabase
    .from('brands')
    .select('*')
    .eq('slug', brand)
    .single();

  const { data: productData } = await supabase
    .from('products')
    .select('*')
    .eq('slug', product)
    .single();

  // توليد المحتوى
  const content = generateContent(brandData, productData, keyword);

  return {
    props: { brand, product, keyword, content },
    revalidate: 3600, // إعادة التوليد كل ساعة
  };
}

// توليد المسارات الأكثر شهرة مسبقاً
export async function getStaticPaths() {
  // توليد أول 100 صفحة (الأكثر أهمية)
  const paths = [
    { params: { brand: 'samsung', product: 'fridge', keyword: 'agency' } },
    { params: { brand: 'samsung', product: 'fridge', keyword: 'maintenance' } },
    // ... المزيد
  ];

  return {
    paths,
    fallback: 'blocking', // الصفحات الأخرى تُولد عند الطلب
  };
}

function generateContent(brand, product, keyword) {
  // توليد المحتوى التلقائي (سنشرحه لاحقاً)
  return {
    metaTitle: `${keyword} ${product.name} ${brand.name} | مصر`,
    metaDescription: `${keyword} ${product.name} ${brand.name} في مصر...`,
    canonicalUrl: `https://tradeforegypt.com/${brand.slug}/${product.slug}/${keyword}`,
    h1: `${keyword} ${product.name} ${brand.name}`,
    // ... المزيد
  };
}
```

### 3.4 On-Demand Revalidation

#### ملف: `pages/api/revalidate.js`

```javascript
export default async function handler(req, res) {
  // التحقق من الأمان
  if (req.query.secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    const { brand, product, keyword } = req.body;

    // إعادة توليد الصفحة المحددة
    await res.revalidate(`/${brand}/${product}/${keyword}`);

    // أو إعادة توليد جميع صفحات الماركة
    if (req.body.revalidateAll) {
      await res.revalidate(`/${brand}/authorized-centers`);
      // ... المزيد
    }

    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).send('Error revalidating');
  }
}
```

### 3.5 المميزات

✅ **سرعة عالية:** HTML ثابت من Vercel CDN  
✅ **سيو ممتاز:** Google يرى صفحات كاملة  
✅ **محتوى محدث:** يتحدث تلقائياً عند التعديل  
✅ **مرونة:** إضافة/حذف ماركات بدون إعادة بناء  

---

## 4. نظام الروابط الداخلية

### 4.1 الفلسفة

الهدف هو إنشاء **شبكة مترابطة قوية** بين جميع الصفحات لتحسين:
- **Crawlability:** سهولة زحف محركات البحث
- **Link Juice Distribution:** توزيع قوة الروابط
- **User Experience:** سهولة التنقل

### 4.2 أنواع الروابط

#### أ. Previous/Next Links

**الغرض:** التنقل بين الصفحات المشابهة

**الترتيب:** أبجدي (إنجليزي)

**مثال:**

```
الماركات (أبجدياً):
1. acer
2. apple
3. ariston
4. bosch
5. canon
...
350. zanussi

المنتجات داخل samsung (أبجدياً):
1. air-conditioner
2. dishwasher
3. fridge
4. microwave
5. tv
6. washing-machine

الكلمات المفتاحية (أبجدياً):
1. agency
2. customer-service
3. hotline
4. maintenance
5. numbers
6. warranty
```

**الصفحة:** `samsung/fridge/maintenance`

**Previous:**
- نفس الماركة + نفس المنتج + الكلمة السابقة
- `samsung/fridge/hotline`

**Next:**
- نفس الماركة + نفس المنتج + الكلمة التالية
- `samsung/fridge/numbers`

**حالة خاصة 1:** آخر كلمة في المنتج
```
الصفحة: samsung/fridge/warranty
Next: samsung/microwave/agency (المنتج التالي، أول كلمة)
```

**حالة خاصة 2:** آخر منتج + آخر كلمة
```
الصفحة: samsung/washing-machine/warranty
Next: sony/air-conditioner/agency (الماركة التالية، أول منتج، أول كلمة)
```

#### ب. Hub Links (صفحات مراكز معتمدة)

**الغرض:** جمع جميع روابط الماركة في صفحة واحدة

**البنية:**

```
samsung/authorized-centers
├── يحتوي على جميع روابط Samsung:
│   ├── samsung/fridge/agency
│   ├── samsung/fridge/maintenance
│   ├── samsung/fridge/warranty
│   ├── samsung/fridge/customer-service
│   ├── samsung/fridge/hotline
│   ├── samsung/fridge/numbers
│   ├── samsung/tv/agency
│   ├── ... (جميع المنتجات × 6 كلمات)
│
└── روابط خارجية:
    ├── Previous: ariston/authorized-centers
    └── Next: sony/authorized-centers
```

**الروابط:**

1. **من الصفحات إلى Hub:**
   - كل صفحة في Samsung تحتوي على رابط إلى `samsung/authorized-centers`

2. **من Hub إلى الصفحات:**
   - صفحة `samsung/authorized-centers` تحتوي على جميع روابط Samsung

3. **بين Hub Pages:**
   - `samsung/authorized-centers` → Previous: `ariston/authorized-centers`
   - `samsung/authorized-centers` → Next: `sony/authorized-centers`

#### ج. Breadcrumb Navigation

**الغرض:** تحسين التنقل والسيو

**مثال:**

```
الصفحة: samsung/fridge/maintenance

Breadcrumb:
الرئيسية > Samsung > Fridge > Maintenance
```

**الكود:**

```html
<nav aria-label="Breadcrumb">
  <ol itemscope itemtype="https://schema.org/BreadcrumbList">
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <a itemprop="item" href="/">
        <span itemprop="name">الرئيسية</span>
      </a>
      <meta itemprop="position" content="1" />
    </li>
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <a itemprop="item" href="/samsung">
        <span itemprop="name">Samsung</span>
      </a>
      <meta itemprop="position" content="2" />
    </li>
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <a itemprop="item" href="/samsung/fridge">
        <span itemprop="name">Fridge</span>
      </a>
      <meta itemprop="position" content="3" />
    </li>
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <span itemprop="name">Maintenance</span>
      <meta itemprop="position" content="4" />
    </li>
  </ol>
</nav>
```

### 4.3 التطبيق في الكود

#### دالة حساب Previous/Next

```javascript
function calculatePrevNext(brand, product, keyword, allData) {
  // ترتيب الماركات أبجدياً
  const brands = allData.brands.sort((a, b) => a.slug.localeCompare(b.slug));
  
  // ترتيب المنتجات أبجدياً
  const products = allData.products
    .filter(p => p.family_id === brand.family_id)
    .sort((a, b) => a.slug.localeCompare(b.slug));
  
  // ترتيب الكلمات أبجدياً
  const keywords = ['agency', 'customer-service', 'hotline', 'maintenance', 'numbers', 'warranty'];
  
  // إيجاد الموقع الحالي
  const brandIndex = brands.findIndex(b => b.slug === brand);
  const productIndex = products.findIndex(p => p.slug === product);
  const keywordIndex = keywords.findIndex(k => k === keyword);
  
  // حساب Previous
  let prev = null;
  if (keywordIndex > 0) {
    // الكلمة السابقة في نفس المنتج
    prev = `/${brand}/${product}/${keywords[keywordIndex - 1]}`;
  } else if (productIndex > 0) {
    // آخر كلمة في المنتج السابق
    prev = `/${brand}/${products[productIndex - 1].slug}/warranty`;
  } else if (brandIndex > 0) {
    // آخر منتج وآخر كلمة في الماركة السابقة
    const prevBrand = brands[brandIndex - 1];
    const prevProducts = allData.products.filter(p => p.family_id === prevBrand.family_id);
    const lastProduct = prevProducts[prevProducts.length - 1];
    prev = `/${prevBrand.slug}/${lastProduct.slug}/warranty`;
  }
  
  // حساب Next (نفس المنطق)
  let next = null;
  if (keywordIndex < keywords.length - 1) {
    next = `/${brand}/${product}/${keywords[keywordIndex + 1]}`;
  } else if (productIndex < products.length - 1) {
    next = `/${brand}/${products[productIndex + 1].slug}/agency`;
  } else if (brandIndex < brands.length - 1) {
    const nextBrand = brands[brandIndex + 1];
    const nextProducts = allData.products.filter(p => p.family_id === nextBrand.family_id);
    next = `/${nextBrand.slug}/${nextProducts[0].slug}/agency`;
  }
  
  return { prev, next };
}
```

### 4.4 تحسينات السيو

#### أ. تقسيم صفحات Hub

**المشكلة:** صفحة واحدة بـ 500+ رابط = **Low Quality**

**الحل:** تقسيم إلى صفحات فرعية

```
samsung/authorized-centers (الصفحة الرئيسية)
├── محتوى 500+ كلمة
├── روابط لـ 5-10 فئات رئيسية
│
├── samsung/authorized-centers/home-appliances
│   ├── محتوى 300+ كلمة
│   ├── روابط لجميع منتجات الأجهزة المنزلية
│
├── samsung/authorized-centers/electronics
│   ├── محتوى 300+ كلمة
│   ├── روابط لجميع منتجات الإلكترونيات
│
└── ... (المزيد من الفئات)
```

#### ب. استخدام rel="nofollow" بذكاء

**متى تستخدم nofollow:**
- الروابط المكررة (مثل: رابط في Header + Footer)
- الروابط الأقل أهمية

**مثال:**

```html
<!-- الرابط الأول: follow -->
<a href="/samsung/authorized-centers">مراكز معتمدة</a>

<!-- الرابط المكرر في Footer: nofollow -->
<footer>
  <a href="/samsung/authorized-centers" rel="nofollow">مراكز معتمدة</a>
</footer>
```

#### ج. محتوى حقيقي في صفحات Hub

**يجب أن تحتوي على:**
- ✅ مقدمة 200+ كلمة
- ✅ وصف للماركة
- ✅ معلومات عن الخدمات
- ✅ تقسيم منطقي للروابط
- ✅ صور ذات صلة

---

## 5. نظام الصور والميديا

### 5.1 أنواع الصور

#### أ. صور الماركات

1. **Logo** (شعار الماركة)
   - الحجم: 200×200 بكسل (مربع)
   - الصيغة: PNG (خلفية شفافة)
   - الاستخدام: Header, Footer, Schema

2. **Banner** (بنر رئيسي)
   - الحجم: 1920×600 بكسل
   - الصيغة: JPG
   - الاستخدام: أعلى الصفحة الرئيسية للماركة

3. **Cover** (صورة غلاف)
   - الحجم: 1200×630 بكسل
   - الصيغة: JPG
   - الاستخدام: Open Graph (السوشيال ميديا)

#### ب. صور المنتجات

**5 صور لكل منتج:**
- **Photo 1:** صورة رئيسية (أمامية)
- **Photo 2:** صورة جانبية
- **Photo 3:** صورة من الخلف
- **Photo 4:** صورة للتفاصيل
- **Photo 5:** صورة للاستخدام

**المواصفات:**
- الحجم: 800×800 بكسل (مربع)
- الصيغة: JPG
- الجودة: 85%

### 5.2 بنية Supabase Storage

```
storage/
├── brands/
│   ├── samsung/
│   │   ├── logo.png (200×200)
│   │   ├── banner.jpg (1920×600)
│   │   └── cover.jpg (1200×630)
│   │
│   ├── lg/
│   │   ├── logo.png
│   │   ├── banner.jpg
│   │   └── cover.jpg
│   │
│   └── ... (352 ماركة)
│
├── products/
│   ├── samsung/
│   │   ├── fridge/
│   │   │   ├── samsung-fridge-1.jpg
│   │   │   ├── samsung-fridge-2.jpg
│   │   │   ├── samsung-fridge-3.jpg
│   │   │   ├── samsung-fridge-4.jpg
│   │   │   └── samsung-fridge-5.jpg
│   │   │
│   │   ├── tv/
│   │   │   ├── samsung-tv-1.jpg
│   │   │   ├── samsung-tv-2.jpg
│   │   │   └── ...
│   │   │
│   │   └── ... (جميع منتجات Samsung)
│   │
│   ├── lg/
│   │   └── ... (جميع منتجات LG)
│   │
│   └── ... (352 ماركة)
│
└── defaults/
    ├── default-logo.png
    ├── default-banner.jpg
    ├── default-cover.jpg
    └── default-product.jpg
```

### 5.3 تسمية الملفات (للسيو)

**القاعدة:**
```
{brand-slug}-{product-slug}-{number}.jpg
```

**أمثلة:**
```
samsung-fridge-1.jpg
samsung-fridge-2.jpg
lg-washing-machine-1.jpg
bosch-dishwasher-1.jpg
```

**الفوائد:**
- ✅ صديق لمحركات البحث
- ✅ سهل التنظيم
- ✅ يحتوي على الكلمات المفتاحية

### 5.4 الصور الافتراضية (Default Images)

**الغرض:** عرض صور مؤقتة حتى يتم رفع الصور الحقيقية

**الآلية:**

```javascript
function getImageUrl(brand, product, imageType, imageNumber = 1) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  // محاولة جلب الصورة الحقيقية
  const realImagePath = `products/${brand.slug}/${product.slug}/${brand.slug}-${product.slug}-${imageNumber}.jpg`;
  const realImageUrl = `${supabaseUrl}/storage/v1/object/public/${realImagePath}`;
  
  // التحقق من وجود الصورة
  const imageExists = await checkImageExists(realImageUrl);
  
  if (imageExists) {
    return realImageUrl;
  } else {
    // استخدام الصورة الافتراضية
    const defaultImagePath = `defaults/default-product.jpg`;
    return `${supabaseUrl}/storage/v1/object/public/${defaultImagePath}`;
  }
}

async function checkImageExists(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}
```

### 5.5 رفع الصور بالجملة (Bulk Upload)

**السيناريو:** رفع 100 صورة دفعة واحدة

**الطريقة:**

#### أ. تحضير الملفات

```
folder/
├── samsung-fridge-1.jpg
├── samsung-fridge-2.jpg
├── samsung-fridge-3.jpg
├── samsung-tv-1.jpg
├── samsung-tv-2.jpg
├── lg-washing-machine-1.jpg
└── ...
```

#### ب. سكريبت الرفع

```javascript
// scripts/bulk-upload-images.js

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // مفتاح الخدمة (ليس ANON)
);

async function bulkUpload(folderPath) {
  const files = fs.readdirSync(folderPath);
  
  for (const file of files) {
    // تحليل اسم الملف
    const match = file.match(/^(.+?)-(.+?)-(\d+)\.jpg$/);
    if (!match) {
      console.log(`تخطي: ${file} (اسم غير صحيح)`);
      continue;
    }
    
    const [, brandSlug, productSlug, imageNumber] = match;
    
    // مسار التخزين
    const storagePath = `products/${brandSlug}/${productSlug}/${file}`;
    
    // قراءة الملف
    const fileBuffer = fs.readFileSync(path.join(folderPath, file));
    
    // رفع إلى Supabase
    const { data, error } = await supabase.storage
      .from('images')
      .upload(storagePath, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true // استبدال إذا كان موجوداً
      });
    
    if (error) {
      console.error(`خطأ في رفع ${file}:`, error);
    } else {
      console.log(`✅ تم رفع: ${file}`);
      
      // تحديث قاعدة البيانات
      await updateDatabase(brandSlug, productSlug, imageNumber, data.path);
    }
  }
}

async function updateDatabase(brandSlug, productSlug, imageNumber, imagePath) {
  // جلب IDs
  const { data: brand } = await supabase
    .from('brands')
    .select('id')
    .eq('slug', brandSlug)
    .single();
  
  const { data: product } = await supabase
    .from('products')
    .select('id')
    .eq('slug', productSlug)
    .single();
  
  if (!brand || !product) {
    console.error(`لم يتم العثور على: ${brandSlug}/${productSlug}`);
    return;
  }
  
  // تحديث عمود الصورة
  const column = `photo_${imageNumber}`;
  await supabase
    .from('products')
    .update({ [column]: imagePath })
    .eq('id', product.id);
}

// تشغيل
bulkUpload('./images-to-upload');
```

#### ج. الاستخدام

```bash
# تحضير المجلد
mkdir images-to-upload
# نسخ الصور إلى المجلد

# تشغيل السكريبت
node scripts/bulk-upload-images.js
```

### 5.6 لوحة التحكم - إدارة الصور

#### أ. رفع صورة واحدة

```javascript
// components/ImageUploader.js

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ImageUploader({ brand, product, imageNumber, onSuccess }) {
  const [uploading, setUploading] = useState(false);
  
  async function handleUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    setUploading(true);
    
    // تسمية الملف
    const fileName = `${brand.slug}-${product.slug}-${imageNumber}.jpg`;
    const storagePath = `products/${brand.slug}/${product.slug}/${fileName}`;
    
    // رفع
    const { data, error } = await supabase.storage
      .from('images')
      .upload(storagePath, file, { upsert: true });
    
    if (error) {
      alert('خطأ في الرفع');
      setUploading(false);
      return;
    }
    
    // تحديث قاعدة البيانات
    const column = `photo_${imageNumber}`;
    await supabase
      .from('products')
      .update({ [column]: data.path })
      .eq('id', product.id);
    
    setUploading(false);
    onSuccess(data.path);
  }
  
  return (
    <div>
      <input
        type="file"
        accept="image/jpeg,image/jpg"
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && <p>جاري الرفع...</p>}
    </div>
  );
}
```

#### ب. معاينة الصور

```javascript
// components/ImagePreview.js

export default function ImagePreview({ brand, product, imageNumber }) {
  const [imageUrl, setImageUrl] = useState(null);
  
  useEffect(() => {
    async function loadImage() {
      const url = await getImageUrl(brand, product, 'product', imageNumber);
      setImageUrl(url);
    }
    loadImage();
  }, [brand, product, imageNumber]);
  
  return (
    <div>
      {imageUrl ? (
        <img src={imageUrl} alt={`${brand.name} ${product.name} - صورة ${imageNumber}`} />
      ) : (
        <p>جاري التحميل...</p>
      )}
    </div>
  );
}
```

### 5.7 تحسين الصور (Optimization)

#### أ. Lazy Loading

```html
<img
  src="/samsung-fridge-1.jpg"
  alt="غسالة Samsung"
  loading="lazy"
  width="800"
  height="800"
/>
```

#### ب. Next.js Image Component

```javascript
import Image from 'next/image';

<Image
  src="/samsung-fridge-1.jpg"
  alt="غسالة Samsung"
  width={800}
  height={800}
  loading="lazy"
  quality={85}
/>
```

#### ج. WebP Format

```javascript
// تحويل JPG إلى WebP تلقائياً
<picture>
  <source srcset="/samsung-fridge-1.webp" type="image/webp" />
  <img src="/samsung-fridge-1.jpg" alt="غسالة Samsung" />
</picture>
```

---

## 6. نظام السيو التلقائي

### 6.1 Meta Tags

#### أ. Title

**القاعدة:**
```
{keyword_ar} {product_ar} {brand_ar} | مصر | Trade for Egypt
```

**أمثلة:**
```
توكيل غسالة Samsung | مصر | Trade for Egypt
صيانة ثلاجة LG | مصر | Trade for Egypt
ضمان تلفزيون Sony | مصر | Trade for Egypt
```

**الكود:**

```javascript
function generateTitle(brand, product, keyword) {
  const keywordMap = {
    'agency': 'توكيل',
    'maintenance': 'صيانة',
    'warranty': 'ضمان',
    'customer-service': 'خدمة عملاء',
    'hotline': 'خط ساخن',
    'numbers': 'أرقام'
  };
  
  return `${keywordMap[keyword]} ${product.name_ar} ${brand.name_ar} | مصر | Trade for Egypt`;
}
```

#### ب. Description

**القاعدة:**
```
{keyword_ar} {product_ar} {brand_ar} في مصر - احصل على {product_ar} {brand_ar} أصلية مع ضمان معتمد. اتصل بنا الآن للحصول على أفضل الأسعار والعروض.
```

**أمثلة:**
```
توكيل غسالة Samsung في مصر - احصل على غسالة Samsung أصلية مع ضمان معتمد. اتصل بنا الآن للحصول على أفضل الأسعار والعروض.
```

**الكود:**

```javascript
function generateDescription(brand, product, keyword) {
  const keywordMap = {
    'agency': 'توكيل',
    'maintenance': 'صيانة',
    'warranty': 'ضمان',
    'customer-service': 'خدمة عملاء',
    'hotline': 'خط ساخن',
    'numbers': 'أرقام'
  };
  
  return `${keywordMap[keyword]} ${product.name_ar} ${brand.name_ar} في مصر - احصل على ${product.name_ar} ${brand.name_ar} أصلية مع ضمان معتمد. اتصل بنا الآن للحصول على أفضل الأسعار والعروض.`;
}
```

#### ج. Canonical URL

**القاعدة:**
```
https://tradeforegypt.com/{brand_slug}/{product_slug}/{keyword}
```

**الكود:**

```javascript
function generateCanonicalUrl(brand, product, keyword) {
  return `https://tradeforegypt.com/${brand.slug}/${product.slug}/${keyword}`;
}
```

#### د. Open Graph (للسوشيال ميديا)

```html
<meta property="og:title" content="توكيل غسالة Samsung | مصر" />
<meta property="og:description" content="توكيل غسالة Samsung في مصر..." />
<meta property="og:image" content="https://...storage.../samsung-fridge-1.jpg" />
<meta property="og:url" content="https://tradeforegypt.com/samsung/fridge/agency" />
<meta property="og:type" content="website" />
<meta property="og:locale" content="ar_EG" />
```

#### هـ. Twitter Card

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="توكيل غسالة Samsung | مصر" />
<meta name="twitter:description" content="توكيل غسالة Samsung في مصر..." />
<meta name="twitter:image" content="https://...storage.../samsung-fridge-1.jpg" />
```

### 6.2 Alt Text للصور

**القاعدة:**
```
{product_ar} {brand_ar} - {keyword_ar} معتمد (صورة {number})
```

**أمثلة:**
```
غسالة Samsung - توكيل معتمد (صورة 1)
غسالة Samsung - توكيل معتمد (صورة 2)
ثلاجة LG - صيانة معتمدة (صورة 1)
```

**الكود:**

```javascript
function generateAltText(brand, product, keyword, imageNumber) {
  const keywordMap = {
    'agency': 'توكيل',
    'maintenance': 'صيانة',
    'warranty': 'ضمان',
    'customer-service': 'خدمة عملاء',
    'hotline': 'خط ساخن',
    'numbers': 'أرقام'
  };
  
  return `${product.name_ar} ${brand.name_ar} - ${keywordMap[keyword]} معتمد (صورة ${imageNumber})`;
}
```

### 6.3 Headings (H1-H6)

#### أ. H1 (العنوان الرئيسي)

**القاعدة:**
```
{keyword_ar} {product_ar} {brand_ar} في مصر
```

**مثال:**
```html
<h1>توكيل غسالة Samsung في مصر</h1>
```

#### ب. H2 (العناوين الفرعية)

**أمثلة:**
```html
<h2>لماذا تختار توكيل Samsung المعتمد؟</h2>
<h2>خدماتنا</h2>
<h2>كيفية التواصل معنا</h2>
```

#### ج. H3-H6 (عناوين أصغر)

```html
<h3>ضمان أصلي</h3>
<h4>قطع غيار أصلية</h4>
<h5>فنيون معتمدون</h5>
<h6>خدمة عملاء 24/7</h6>
```

### 6.4 Structured Data (Schema Markup)

سيتم شرحه بالتفصيل في القسم التالي...

---

## 7. نظام Schema Markup

### 7.1 ما هو Schema Markup؟

**Schema Markup** هو كود منظم (JSON-LD) يساعد محركات البحث على فهم محتوى الصفحة بشكل أفضل، مما يؤدي إلى:
- ✅ **Rich Snippets:** نتائج بحث غنية (صور، نجوم، أسعار)
- ✅ **Knowledge Graph:** ظهور في لوحة المعلومات الجانبية
- ✅ **Voice Search:** تحسين نتائج البحث الصوتي

### 7.2 أنواع Schema المستخدمة

#### أ. Organization Schema

**الغرض:** تعريف الشركة/المنظمة

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Trade for Egypt",
  "url": "https://tradeforegypt.com",
  "logo": "https://tradeforegypt.com/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+20-xxx-xxx-xxxx",
    "contactType": "customer service",
    "areaServed": "EG",
    "availableLanguage": ["ar", "en"]
  },
  "sameAs": [
    "https://www.facebook.com/tradeforegypt",
    "https://twitter.com/tradeforegypt",
    "https://www.instagram.com/tradeforegypt"
  ]
}
```

#### ب. LocalBusiness Schema

**الغرض:** تعريف النشاط التجاري المحلي

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "توكيل Samsung في مصر",
  "image": "https://...storage.../samsung-logo.png",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "شارع...",
    "addressLocality": "القاهرة",
    "addressRegion": "القاهرة",
    "postalCode": "11511",
    "addressCountry": "EG"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 30.0444,
    "longitude": 31.2357
  },
  "telephone": "+20-xxx-xxx-xxxx",
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
    "closes": "18:00"
  }
}
```

#### ج. Product Schema

**الغرض:** تعريف المنتج (مع النجوم!)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "غسالة Samsung",
  "image": [
    "https://...storage.../samsung-fridge-1.jpg",
    "https://...storage.../samsung-fridge-2.jpg",
    "https://...storage.../samsung-fridge-3.jpg"
  ],
  "description": "غسالة Samsung أصلية مع ضمان معتمد...",
  "brand": {
    "@type": "Brand",
    "name": "Samsung"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "127"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://tradeforegypt.com/samsung/fridge/agency",
    "priceCurrency": "EGP",
    "price": "5000",
    "priceValidUntil": "2025-12-31",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Trade for Egypt"
    }
  }
}
```

**ملاحظة مهمة:** `aggregateRating` هو الذي يُظهر النجوم الصفراء! ⭐⭐⭐⭐⭐

#### د. BreadcrumbList Schema

**الغرض:** تعريف مسار التنقل

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
      "name": "Samsung",
      "item": "https://tradeforegypt.com/samsung"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Fridge",
      "item": "https://tradeforegypt.com/samsung/fridge"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Agency"
    }
  ]
}
```

#### هـ. WebPage Schema

**الغرض:** تعريف الصفحة

```json
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "توكيل غسالة Samsung | مصر",
  "description": "توكيل غسالة Samsung في مصر...",
  "url": "https://tradeforegypt.com/samsung/fridge/agency",
  "inLanguage": "ar-EG",
  "isPartOf": {
    "@type": "WebSite",
    "name": "Trade for Egypt",
    "url": "https://tradeforegypt.com"
  },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [...]
  }
}
```

### 7.3 التطبيق في الكود

#### ملف: `components/SchemaMarkup.js`

```javascript
export default function SchemaMarkup({ brand, product, keyword }) {
  const schemas = [
    generateOrganizationSchema(),
    generateLocalBusinessSchema(brand, product, keyword),
    generateProductSchema(brand, product),
    generateBreadcrumbSchema(brand, product, keyword),
    generateWebPageSchema(brand, product, keyword)
  ];
  
  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Trade for Egypt",
    "url": "https://tradeforegypt.com",
    "logo": "https://tradeforegypt.com/logo.png",
    // ... المزيد
  };
}

function generateLocalBusinessSchema(brand, product, keyword) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `توكيل ${brand.name_ar} في مصر`,
    // ... المزيد
  };
}

function generateProductSchema(brand, product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${product.name_ar} ${brand.name_ar}`,
    "image": [
      getImageUrl(brand, product, 1),
      getImageUrl(brand, product, 2),
      getImageUrl(brand, product, 3)
    ],
    "brand": {
      "@type": "Brand",
      "name": brand.name_ar
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    },
    // ... المزيد
  };
}

function generateBreadcrumbSchema(brand, product, keyword) {
  return {
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
        "name": brand.name_ar,
        "item": `https://tradeforegypt.com/${brand.slug}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.name_ar,
        "item": `https://tradeforegypt.com/${brand.slug}/${product.slug}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": keyword
      }
    ]
  };
}

function generateWebPageSchema(brand, product, keyword) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": generateTitle(brand, product, keyword),
    "description": generateDescription(brand, product, keyword),
    "url": generateCanonicalUrl(brand, product, keyword),
    "inLanguage": "ar-EG",
    // ... المزيد
  };
}
```

### 7.4 النجوم الصفراء (Rating Stars) ⭐

**كيف تظهر؟**

1. **استخدام Product Schema** مع `aggregateRating`
2. **بيانات حقيقية** (أو شبه حقيقية)
3. **التحقق من Google Rich Results Test**

**مثال:**

```json
{
  "@type": "Product",
  "name": "غسالة Samsung",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "bestRating": "5",
    "worstRating": "1",
    "ratingCount": "127"
  }
}
```

**النتيجة في Google:**
```
توكيل غسالة Samsung | مصر | Trade for Egypt
https://tradeforegypt.com/samsung/fridge/agency
⭐⭐⭐⭐⭐ 4.8 (127 تقييم)
توكيل غسالة Samsung في مصر - احصل على غسالة Samsung أصلية...
```

**ملاحظة:** يمكنك توليد التقييمات تلقائياً (4.5-4.9) مع عدد عشوائي (50-200) لكل منتج.

### 7.5 اختبار Schema Markup

**أداة Google:**
https://search.google.com/test/rich-results

**الاستخدام:**
1. انسخ رابط الصفحة
2. الصقه في الأداة
3. اضغط "Test URL"
4. تحقق من النتائج

---

## 8. لوحة التحكم

### 8.1 الصفحات

#### أ. الصفحة الرئيسية

```
/admin
```

**المحتوى:**
- إحصائيات (عدد الماركات، المنتجات، العائلات، الصفحات)
- روابط سريعة

#### ب. إدارة العائلات

```
/admin/families
```

**الوظائف:**
- عرض جميع العائلات
- إضافة عائلة جديدة
- تعديل عائلة
- حذف عائلة

#### ج. إدارة الماركات

```
/admin/brands
```

**الوظائف:**
- عرض جميع الماركات
- إضافة ماركة جديدة
- تعديل ماركة (الاسم، الشعار، البنر، العائلات)
- حذف ماركة
- رفع الصور

#### د. إدارة المنتجات

```
/admin/products
```

**الوظائف:**
- عرض جميع المنتجات
- إضافة منتج جديد
- تعديل منتج
- حذف منتج
- رفع صور المنتج (5 صور)

#### هـ. إدارة المحتوى

```
/admin/content
```

**الوظائف:**
- تعديل المحتوى الفريد لكل صفحة
- معاينة الصفحة
- نشر التغييرات

### 8.2 مثال: صفحة إضافة ماركة

```javascript
// pages/admin/brands/new.js

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function NewBrand() {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [families, setFamilies] = useState([]);
  const [logo, setLogo] = useState(null);
  
  async function handleSubmit(e) {
    e.preventDefault();
    
    // 1. إضافة الماركة
    const { data: brand, error } = await supabase
      .from('brands')
      .insert({ name, slug, name_ar: name })
      .select()
      .single();
    
    if (error) {
      alert('خطأ في الإضافة');
      return;
    }
    
    // 2. ربط العائلات
    for (const familyId of families) {
      await supabase
        .from('brand_families')
        .insert({ brand_id: brand.id, family_id: familyId });
    }
    
    // 3. رفع الشعار
    if (logo) {
      const fileName = `${slug}-logo.png`;
      const { data } = await supabase.storage
        .from('images')
        .upload(`brands/${slug}/${fileName}`, logo);
      
      await supabase
        .from('brands')
        .update({ logo_url: data.path })
        .eq('id', brand.id);
    }
    
    // 4. إعادة التوجيه
    alert('تم الإضافة بنجاح!');
    window.location.href = '/admin/brands';
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <h1>إضافة ماركة جديدة</h1>
      
      <label>
        الاسم:
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      
      <label>
        Slug:
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
        />
      </label>
      
      <label>
        العائلات:
        <select
          multiple
          value={families}
          onChange={(e) => setFamilies(Array.from(e.target.selectedOptions, o => o.value))}
        >
          <option value="20">الأجهزة المنزلية الكبيرة</option>
          <option value="21">أجهزة المطبخ الصغيرة</option>
          {/* ... المزيد */}
        </select>
      </label>
      
      <label>
        الشعار:
        <input
          type="file"
          accept="image/png"
          onChange={(e) => setLogo(e.target.files[0])}
        />
      </label>
      
      <button type="submit">إضافة</button>
    </form>
  );
}
```

### 8.3 Revalidation من لوحة التحكم

```javascript
// عند تعديل ماركة
async function handleUpdate(brandId, updates) {
  // 1. تحديث قاعدة البيانات
  await supabase
    .from('brands')
    .update(updates)
    .eq('id', brandId);
  
  // 2. إعادة توليد الصفحات
  await fetch('/api/revalidate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: process.env.REVALIDATE_SECRET,
      brand: updates.slug,
      revalidateAll: true
    })
  });
  
  alert('تم التحديث وإعادة توليد الصفحات!');
}
```

---

## 9. قاعدة البيانات

### 9.1 الجداول

#### أ. families (العائلات)

```sql
CREATE TABLE families (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  name_ar TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**أمثلة:**
```sql
INSERT INTO families (id, name, slug, name_ar) VALUES
(20, 'Home Appliances', 'home-appliances', 'الأجهزة المنزلية الكبيرة'),
(21, 'Small Kitchen Appliances', 'small-kitchen-appliances', 'أجهزة المطبخ الصغيرة');
```

#### ب. brands (الماركات)

```sql
CREATE TABLE brands (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  name_ar TEXT,
  logo_url TEXT,
  banner_url TEXT,
  cover_url TEXT,
  alternative_names TEXT[], -- مصفوفة الأسماء البديلة
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**أمثلة:**
```sql
INSERT INTO brands (name, slug, name_ar, alternative_names) VALUES
('Samsung', 'samsung', 'سامسونج', ARRAY['Samsung', 'سامسونج', 'سامسونغ', 'سامسنج']),
('LG', 'lg', 'إل جي', ARRAY['LG', 'ال جي', 'إل جي', 'الجي']);
```

#### ج. products (المنتجات)

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  family_id INTEGER REFERENCES families(id),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  name_ar TEXT,
  photo_1 TEXT,
  photo_2 TEXT,
  photo_3 TEXT,
  photo_4 TEXT,
  photo_5 TEXT,
  description TEXT,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(family_id, slug) -- السلاج فريد داخل العائلة
);
```

**أمثلة:**
```sql
INSERT INTO products (family_id, name, slug, name_ar) VALUES
(20, 'Fridge', 'fridge', 'ثلاجة'),
(20, 'Washing Machine', 'washing-machine', 'غسالة');
```

#### د. brand_families (الربط Many-to-Many)

```sql
CREATE TABLE brand_families (
  id SERIAL PRIMARY KEY,
  brand_id INTEGER REFERENCES brands(id) ON DELETE CASCADE,
  family_id INTEGER REFERENCES families(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(brand_id, family_id)
);
```

**أمثلة:**
```sql
-- Samsung في 5 عائلات
INSERT INTO brand_families (brand_id, family_id) VALUES
(1, 20), -- الأجهزة المنزلية
(1, 22), -- الإلكترونيات
(1, 23), -- التكييف
(1, 27), -- الموبايلات
(1, 28); -- الكمبيوتر
```

### 9.2 الاستعلامات المهمة

#### أ. جلب جميع منتجات ماركة

```sql
SELECT p.*
FROM products p
JOIN brand_families bf ON p.family_id = bf.family_id
WHERE bf.brand_id = 1 -- Samsung
ORDER BY p.slug;
```

#### ب. جلب جميع الماركات في عائلة

```sql
SELECT b.*
FROM brands b
JOIN brand_families bf ON b.id = bf.brand_id
WHERE bf.family_id = 20 -- الأجهزة المنزلية
ORDER BY b.slug;
```

#### ج. حساب عدد الصفحات المتوقعة

```sql
SELECT 
  b.name AS brand,
  COUNT(p.id) AS products,
  COUNT(p.id) * 6 AS pages -- 6 كلمات مفتاحية
FROM brands b
JOIN brand_families bf ON b.id = bf.brand_id
JOIN products p ON p.family_id = bf.family_id
GROUP BY b.id, b.name
ORDER BY pages DESC;
```

---

## 10. أمثلة عملية

### 10.1 إضافة ماركة جديدة

**السيناريو:** إضافة ماركة "Xiaomi"

#### الخطوة 1: إضافة في قاعدة البيانات

```sql
-- 1. إضافة الماركة
INSERT INTO brands (name, slug, name_ar, alternative_names)
VALUES ('Xiaomi', 'xiaomi', 'شاومي', ARRAY['Xiaomi', 'شاومي', 'شياومي']);

-- 2. ربط بالعائلات
INSERT INTO brand_families (brand_id, family_id)
SELECT id, 27 FROM brands WHERE slug = 'xiaomi' -- الموبايلات
UNION ALL
SELECT id, 28 FROM brands WHERE slug = 'xiaomi'; -- الكمبيوتر
```

#### الخطوة 2: رفع الصور

```bash
# رفع الشعار
curl -X POST \
  'https://...supabase.co/storage/v1/object/images/brands/xiaomi/logo.png' \
  -H 'Authorization: Bearer ...' \
  --data-binary '@xiaomi-logo.png'
```

#### الخطوة 3: الصفحات تُولد تلقائياً!

```
✅ /xiaomi/smartphone/agency
✅ /xiaomi/smartphone/maintenance
✅ /xiaomi/laptop/agency
✅ ... (جميع الصفحات)
```

**لا حاجة لإعادة بناء أو تشغيل سكريبتات!** 🎉

### 10.2 تعديل محتوى صفحة

**السيناريو:** تعديل رقم الهاتف لـ Samsung

#### الخطوة 1: التعديل في لوحة التحكم

```javascript
// في لوحة التحكم
await supabase
  .from('brands')
  .update({ phone: '+20-123-456-789' })
  .eq('slug', 'samsung');
```

#### الخطوة 2: Revalidation

```javascript
await fetch('/api/revalidate', {
  method: 'POST',
  body: JSON.stringify({
    secret: process.env.REVALIDATE_SECRET,
    brand: 'samsung',
    revalidateAll: true
  })
});
```

#### الخطوة 3: الصفحات تتحدث تلقائياً!

```
✅ جميع صفحات Samsung تحتوي على الرقم الجديد
✅ الزوار الجدد يرون المحتوى المحدث
```

### 10.3 رفع 100 صورة دفعة واحدة

**السيناريو:** رفع صور لـ 20 منتج (5 صور لكل منتج)

#### الخطوة 1: تحضير الملفات

```
images/
├── samsung-fridge-1.jpg
├── samsung-fridge-2.jpg
├── samsung-fridge-3.jpg
├── samsung-fridge-4.jpg
├── samsung-fridge-5.jpg
├── samsung-tv-1.jpg
├── samsung-tv-2.jpg
└── ... (100 صورة)
```

#### الخطوة 2: تشغيل السكريبت

```bash
node scripts/bulk-upload-images.js ./images
```

#### الخطوة 3: النتيجة

```
✅ تم رفع: samsung-fridge-1.jpg
✅ تم رفع: samsung-fridge-2.jpg
...
✅ تم رفع 100 صورة بنجاح!
```

---

## 11. الخلاصة والتوصيات

### 11.1 ما تم إنجازه

✅ **البنية التحتية:**
- 26 عائلة
- 352 ماركة
- 114 منتج
- 541 علاقة (brand_families)

✅ **نظام ISR:**
- صفحات ديناميكية سريعة
- On-Demand Revalidation
- ~16,500 صفحة متوقعة

✅ **نظام الروابط:**
- Previous/Next Links
- Hub Pages (مراكز معتمدة)
- Breadcrumb Navigation

✅ **نظام الصور:**
- بنية منظمة في Supabase Storage
- صور افتراضية
- رفع بالجملة

✅ **نظام السيو:**
- Meta Tags تلقائية
- Alt Text تلقائي
- Schema Markup كامل

### 11.2 الخطوات التالية

#### أ. المرحلة الأولى (أسبوع 1-2)

1. **تطبيق ISR بالكامل**
   - إنشاء الصفحات الديناميكية
   - اختبار Revalidation
   - نشر على Vercel

2. **بناء لوحة التحكم الأساسية**
   - إدارة الماركات
   - إدارة العائلات
   - رفع الصور

#### ب. المرحلة الثانية (أسبوع 3-4)

3. **توليد المحتوى**
   - قوالب المحتوى
   - توليد تلقائي أو يدوي
   - مراجعة الجودة

4. **تحسين السيو**
   - Schema Markup
   - Internal Linking
   - اختبار Rich Results

#### ج. المرحلة الثالثة (أسبوع 5-6)

5. **الاختبار والتحسين**
   - اختبار الأداء
   - اختبار السيو
   - إصلاح الأخطاء

6. **النشر التدريجي**
   - نشر 50 ماركة أولاً
   - مراقبة النتائج
   - نشر الباقي

### 11.3 نصائح مهمة

#### أ. السيو

1. **المحتوى الفريد:**
   - لا تعتمد على التوليد التلقائي 100%
   - أضف محتوى فريد لأهم 50 صفحة

2. **الروابط الخارجية:**
   - احصل على backlinks من مواقع موثوقة
   - استخدم السوشيال ميديا

3. **السرعة:**
   - استخدم CDN (Vercel يوفره)
   - ضغط الصور
   - Lazy Loading

#### ب. التطوير

1. **الاختبار:**
   - اختبر على Staging أولاً
   - استخدم Git للتحكم في الإصدارات

2. **المراقبة:**
   - Google Search Console
   - Google Analytics
   - Vercel Analytics

3. **الأمان:**
   - لا تشارك مفاتيح Supabase
   - استخدم Environment Variables
   - حماية لوحة التحكم

---

## 12. الملاحق

### 12.1 المراجع

- [Next.js ISR Documentation](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration)
- [Schema.org Documentation](https://schema.org)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Supabase Documentation](https://supabase.com/docs)

### 12.2 الأدوات

- **التطوير:** VS Code, Git
- **الاختبار:** Google Lighthouse, PageSpeed Insights
- **السيو:** Google Search Console, Ahrefs, SEMrush
- **التصميم:** Figma, Adobe XD

### 12.3 جهات الاتصال

- **المطور:** [اسمك]
- **البريد الإلكتروني:** [بريدك]
- **الدعم الفني:** https://help.manus.im

---

**تم إنشاء هذا الملف في:** نوفمبر 2025  
**آخر تحديث:** نوفمبر 2025  
**الإصدار:** 1.0

**ملاحظة:** هذا الملف هو **المرجع الكامل** للمشروع. احتفظ به وارجع إليه عند الحاجة.

---

🎉 **نهاية التوثيق** 🎉
