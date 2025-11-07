# دليل البدء السريع - Trade For Egypt

## 🚀 البدء السريع

### 1. استنساخ المشروع

```bash
git clone https://github.com/egyptofrance/tradeforegypt.git
cd tradeforegypt
```

### 2. تثبيت التبعيات

```bash
npm install
```

### 3. إعداد المتغيرات البيئية

أنشئ ملف `.env.local` في جذر المشروع:

```env
NEXT_PUBLIC_SUPABASE_URL=https://npnzcdugtqhqclfcgipb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wbnpjZHVndHFocWNsZmNnaXBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzODE1MTUsImV4cCI6MjA3Nzk1NzUxNX0.CWiKXLYT32uVGDMjVJNz3rDSxyFJohceUUYMXwcIraI
```

### 4. تشغيل المشروع

```bash
npm run dev
```

افتح المتصفح على: http://localhost:3000

---

## 📝 أوامر مهمة

| الأمر | الوصف |
|-------|-------|
| `npm run dev` | تشغيل خادم التطوير |
| `npm run build` | بناء المشروع للإنتاج |
| `npm start` | تشغيل المشروع المبني |
| `npm run lint` | فحص الأكواد |
| `node test-supabase.js` | اختبار الاتصال بـ Supabase |

---

## 🔄 سير عمل التطوير

### إضافة ميزة جديدة

```bash
# 1. إنشاء فرع جديد
git checkout -b feature/new-feature

# 2. إجراء التعديلات
# ... قم بتعديل الملفات ...

# 3. اختبار محلياً
npm run dev

# 4. إضافة التغييرات
git add .

# 5. إنشاء commit
git commit -m "إضافة ميزة جديدة: وصف الميزة"

# 6. دفع إلى GitHub
git push origin feature/new-feature

# 7. إنشاء Pull Request على GitHub
# سيتم إنشاء preview deployment تلقائياً
```

### دفع إلى الإنتاج

```bash
# 1. التأكد من أنك على فرع main
git checkout main

# 2. دمج التغييرات
git merge feature/new-feature

# 3. دفع إلى GitHub
git push origin main

# ✅ سيتم النشر التلقائي على https://tradeforegypt.vercel.app
```

---

## 📚 استخدام Supabase

### مثال: جلب جميع الماركات

```javascript
import { getAllBrands } from '@/lib/supabase';

export async function getStaticProps() {
  const brands = await getAllBrands();
  
  return {
    props: { brands },
    revalidate: 60 // إعادة البناء كل 60 ثانية
  };
}
```

### مثال: جلب ماركة واحدة

```javascript
import { getBrandBySlug } from '@/lib/supabase';

export async function getStaticProps({ params }) {
  const brand = await getBrandBySlug(params.slug);
  
  return {
    props: { brand }
  };
}
```

### مثال: جلب منتجات ماركة

```javascript
import { getBrandProducts } from '@/lib/supabase';

const products = await getBrandProducts(brandId);
```

---

## 🎨 إضافة صفحة جديدة

### 1. إنشاء ملف الصفحة

```bash
# صفحة ثابتة
touch pages/about.js

# صفحة ديناميكية
touch pages/brands/[slug].js
```

### 2. كتابة الكود

```javascript
// pages/about.js
export default function About() {
  return (
    <div>
      <h1>عن الموقع</h1>
      <p>محتوى الصفحة...</p>
    </div>
  );
}
```

### 3. الصفحة ستكون متاحة تلقائياً

- `/about` للصفحات الثابتة
- `/brands/[slug]` للصفحات الديناميكية

---

## 🔍 اختبار الاتصال بقاعدة البيانات

```bash
node test-supabase.js
```

**النتيجة المتوقعة:**
```
🔄 اختبار الاتصال بـ Supabase...

📦 جلب الماركات...
✅ تم جلب 5 ماركات بنجاح

📦 جلب المنتجات...
✅ تم جلب 5 منتجات بنجاح

📦 جلب العائلات...
✅ تم جلب 5 عائلات بنجاح

✅ اختبار الاتصال بـ Supabase تم بنجاح!
```

---

## 🐛 حل المشاكل الشائعة

### المشكلة: خطأ في الاتصال بـ Supabase

**الحل:**
1. تأكد من وجود ملف `.env.local`
2. تأكد من صحة قيم `NEXT_PUBLIC_SUPABASE_URL` و `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. أعد تشغيل خادم التطوير

### المشكلة: التغييرات لا تظهر على الموقع المباشر

**الحل:**
1. تأكد من دفع التغييرات إلى GitHub
2. تحقق من حالة النشر على Vercel
3. انتظر اكتمال البناء (عادة 20-30 ثانية)

### المشكلة: خطأ في البناء على Vercel

**الحل:**
1. تحقق من logs البناء على Vercel
2. تأكد من أن المتغيرات البيئية مكونة بشكل صحيح
3. جرب البناء محلياً: `npm run build`

---

## 📊 مراقبة النشر

### عبر Vercel CLI

```bash
# تسجيل الدخول
vercel login

# عرض النشرات الأخيرة
vercel ls

# فحص نشر معين
vercel inspect [deployment-url]
```

### عبر لوحة التحكم

زر: https://vercel.com/naebaks-projects/tradeforegypt

---

## 🔗 روابط مهمة

- **الموقع المباشر:** https://tradeforegypt.vercel.app
- **GitHub:** https://github.com/egyptofrance/tradeforegypt
- **Vercel:** https://vercel.com/naebaks-projects/tradeforegypt
- **Supabase:** https://supabase.com/dashboard/project/npnzcdugtqhqclfcgipb

---

## 💡 نصائح للتطوير

1. **استخدم الـ Hot Reload:** التغييرات ستظهر فوراً في المتصفح
2. **اختبر محلياً أولاً:** تأكد من عمل الكود قبل الدفع
3. **اكتب commits واضحة:** استخدم رسائل commit وصفية
4. **استخدم الفروع:** لا تعمل مباشرة على فرع main
5. **راجع الـ logs:** تحقق من logs Vercel عند حدوث أخطاء

---

**بالتوفيق في التطوير! 🚀**
