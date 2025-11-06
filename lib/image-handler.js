// ============================================
// Trade for Egypt - Image Handler
// ============================================
// إدارة الصور (مخصصة أو افتراضية)
// ============================================

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const STORAGE_BASE = `${SUPABASE_URL}/storage/v1/object/public`;

// مسارات الصور الافتراضية
const DEFAULT_IMAGES = {
  logo: `${STORAGE_BASE}/defaults/default-logo.png`,
  banner: `${STORAGE_BASE}/defaults/default-banner.jpg`,
  product: `${STORAGE_BASE}/defaults/default-product.jpg`,
};

/**
 * الحصول على رابط صورة (مخصصة أو افتراضية)
 * @param {string|null} customImage - رابط الصورة المخصصة
 * @param {string} defaultType - نوع الصورة الافتراضية (logo, banner, product)
 * @returns {string} - رابط الصورة
 */
export function getImage(customImage, defaultType = 'product') {
  if (customImage) {
    // إذا كان الرابط كامل (يبدأ بـ http)
    if (customImage.startsWith('http')) {
      return customImage;
    }
    
    // إذا كان مسار نسبي في Supabase Storage
    if (customImage.startsWith('/')) {
      return `${STORAGE_BASE}${customImage}`;
    }
    
    // إذا كان اسم ملف فقط، نفترض أنه في bucket brands أو products
    return `${STORAGE_BASE}/brands/${customImage}`;
  }
  
  // إرجاع الصورة الافتراضية
  return DEFAULT_IMAGES[defaultType] || DEFAULT_IMAGES.product;
}

/**
 * الحصول على شعار الماركة
 * @param {Object} brand - بيانات الماركة
 * @returns {string} - رابط الشعار
 */
export function getBrandLogo(brand) {
  return getImage(brand.logo_url, 'logo');
}

/**
 * الحصول على بنر الماركة
 * @param {Object} brand - بيانات الماركة
 * @returns {string} - رابط البنر
 */
export function getBrandBanner(brand) {
  return getImage(brand.banner_url, 'banner');
}

/**
 * الحصول على صورة الغلاف للماركة (Open Graph)
 * @param {Object} brand - بيانات الماركة
 * @returns {string} - رابط صورة الغلاف
 */
export function getBrandCover(brand) {
  return getImage(brand.cover_url, 'banner');
}

/**
 * الحصول على صور المنتج (جميع الصور المتاحة)
 * @param {Object} product - بيانات المنتج
 * @returns {Array} - مصفوفة روابط الصور
 */
export function getProductImages(product) {
  const images = [];
  
  // التحقق من الصور الخمس
  for (let i = 1; i <= 5; i++) {
    const photoKey = `photo_${i}`;
    if (product[photoKey]) {
      images.push(getImage(product[photoKey], 'product'));
    }
  }
  
  // إذا لم توجد أي صورة، نرجع الصورة الافتراضية
  if (images.length === 0) {
    images.push(DEFAULT_IMAGES.product);
  }
  
  return images;
}

/**
 * الحصول على الصورة الرئيسية للمنتج
 * @param {Object} product - بيانات المنتج
 * @returns {string} - رابط الصورة الرئيسية
 */
export function getProductMainImage(product) {
  return getImage(product.photo_1, 'product');
}

/**
 * توليد اسم ملف الصورة بناءً على slug
 * @param {string} brandSlug - slug الماركة
 * @param {string} productSlug - slug المنتج (اختياري)
 * @param {string} type - نوع الصورة (logo, banner, 1-5)
 * @returns {string} - اسم الملف
 */
export function generateImageFilename(brandSlug, productSlug = null, type = 'logo') {
  if (productSlug) {
    // صورة منتج: brand-slug-product-slug-1.jpg
    return `${brandSlug}-${productSlug}-${type}.jpg`;
  } else {
    // صورة ماركة: brand-slug-logo.png أو brand-slug-banner.jpg
    const ext = type === 'logo' ? 'png' : 'jpg';
    return `${brandSlug}-${type}.${ext}`;
  }
}

/**
 * الحصول على مسار Supabase Storage الكامل
 * @param {string} bucket - اسم الـ bucket
 * @param {string} filename - اسم الملف
 * @returns {string} - المسار الكامل
 */
export function getStoragePath(bucket, filename) {
  return `${STORAGE_BASE}/${bucket}/${filename}`;
}

/**
 * التحقق من صحة رابط الصورة
 * @param {string} imageUrl - رابط الصورة
 * @returns {boolean} - true إذا كان الرابط صحيح
 */
export async function validateImageUrl(imageUrl) {
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * الحصول على أبعاد الصورة الموصى بها
 * @param {string} type - نوع الصورة
 * @returns {Object} - { width, height }
 */
export function getRecommendedDimensions(type) {
  const dimensions = {
    logo: { width: 200, height: 200 },
    banner: { width: 1920, height: 600 },
    cover: { width: 1200, height: 630 }, // Open Graph
    product: { width: 800, height: 800 },
  };
  
  return dimensions[type] || dimensions.product;
}

/**
 * توليد srcset للصور المتجاوبة (اختياري - للتحسين المستقبلي)
 * @param {string} imageUrl - رابط الصورة الأساسي
 * @returns {string} - srcset
 */
export function generateSrcSet(imageUrl) {
  // في المستقبل، يمكن توليد نسخ مختلفة الأحجام
  // حالياً، نرجع الصورة الأساسية فقط
  return `${imageUrl} 1x`;
}

/**
 * الحصول على Alt Text للصورة
 * @param {Object} brand - بيانات الماركة
 * @param {Object} product - بيانات المنتج (اختياري)
 * @param {string} type - نوع الصورة
 * @returns {string} - Alt Text
 */
export function getImageAltText(brand, product = null, type = 'logo') {
  if (type === 'logo') {
    return `شعار ${brand.name}`;
  }
  
  if (type === 'banner') {
    return `بنر ${brand.name}`;
  }
  
  if (product) {
    return `${brand.name} ${product.name}`;
  }
  
  return `${brand.name}`;
}
