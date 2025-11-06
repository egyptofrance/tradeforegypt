// ============================================
// Trade for Egypt - SEO Generator
// ============================================
// توليد عناصر السيو تلقائياً لكل صفحة
// ============================================

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://tradeforegypt.com';

// ترجمة الكلمات المفتاحية
const KEYWORD_TRANSLATIONS = {
  'agency': 'توكيل',
  'customer-service': 'خدمة عملاء',
  'hotline': 'خط ساخن',
  'maintenance': 'صيانة',
  'numbers': 'أرقام',
  'warranty': 'ضمان'
};

/**
 * توليد عنوان الصفحة (Title Tag)
 * @param {Object} brand - بيانات الماركة
 * @param {Object} product - بيانات المنتج
 * @param {string} keyword - الكلمة المفتاحية
 * @returns {string} - العنوان
 */
export function generateTitle(brand, product, keyword) {
  const keywordAr = KEYWORD_TRANSLATIONS[keyword] || keyword;
  
  // إذا كان هناك meta_title مخصص
  if (brand.meta_title) {
    return brand.meta_title;
  }
  
  // صيغ متعددة للتنويع
  const formats = [
    `${keywordAr} ${brand.name} ${product.name} | رقم وعنوان ${keywordAr} ${brand.name}`,
    `رقم ${keywordAr} ${brand.name} ${product.name} في مصر | ${brand.name} مصر`,
    `${keywordAr} ${brand.name} ${product.name} - أرقام وعناوين ${brand.name}`,
    `${brand.name} ${product.name} ${keywordAr} | دليل ${brand.name} الشامل`,
  ];
  
  // اختيار صيغة بناءً على hash الـ slug
  const hash = (brand.slug + product.slug + keyword).split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const index = Math.abs(hash) % formats.length;
  return formats[index];
}

/**
 * توليد وصف الصفحة (Meta Description)
 * @param {Object} brand - بيانات الماركة
 * @param {Object} product - بيانات المنتج
 * @param {string} keyword - الكلمة المفتاحية
 * @returns {string} - الوصف
 */
export function generateMetaDescription(brand, product, keyword) {
  const keywordAr = KEYWORD_TRANSLATIONS[keyword] || keyword;
  
  // إذا كان هناك meta_description مخصص
  if (brand.meta_description) {
    return brand.meta_description;
  }
  
  // صيغ متعددة للتنويع
  const formats = [
    `احصل على رقم وعنوان ${keywordAr} ${brand.name} ${product.name} في مصر. دليل شامل لجميع فروع ${brand.name} مع أرقام التواصل والعناوين المحدثة.`,
    `دليل ${keywordAr} ${brand.name} ${product.name} الكامل في مصر. أرقام الهاتف، العناوين، ومواعيد العمل لجميع فروع ${brand.name}.`,
    `تعرف على ${keywordAr} ${brand.name} ${product.name} في مصر. معلومات كاملة عن ${brand.name} مع أرقام التواصل والعناوين المحدثة.`,
    `${keywordAr} ${brand.name} ${product.name} في مصر - دليل شامل يحتوي على أرقام التواصل والعناوين لجميع فروع ${brand.name} المعتمدة.`,
  ];
  
  const hash = (brand.slug + product.slug + keyword).split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const index = Math.abs(hash) % formats.length;
  return formats[index].substring(0, 160); // حد أقصى 160 حرف
}

/**
 * توليد رابط Canonical
 * @param {Object} brand - بيانات الماركة
 * @param {Object} product - بيانات المنتج
 * @param {string} keyword - الكلمة المفتاحية
 * @returns {string} - الرابط الكامل
 */
export function generateCanonicalUrl(brand, product, keyword) {
  return `${BASE_URL}/${brand.slug}/${product.slug}/${keyword}`;
}

/**
 * توليد نص Alt للصور
 * @param {Object} brand - بيانات الماركة
 * @param {Object} product - بيانات المنتج
 * @param {string} keyword - الكلمة المفتاحية
 * @param {number} imageNumber - رقم الصورة (1-5)
 * @returns {string} - نص Alt
 */
export function generateAltText(brand, product, keyword, imageNumber = 1) {
  const keywordAr = KEYWORD_TRANSLATIONS[keyword] || keyword;
  
  const formats = [
    `${brand.name} ${product.name} - ${keywordAr}`,
    `صورة ${brand.name} ${product.name}`,
    `${product.name} من ${brand.name}`,
    `${keywordAr} ${brand.name} ${product.name} في مصر`,
  ];
  
  const index = (imageNumber - 1) % formats.length;
  return formats[index];
}

/**
 * توليد الكلمات المفتاحية (Keywords)
 * @param {Object} brand - بيانات الماركة
 * @param {Object} product - بيانات المنتج
 * @param {string} keyword - الكلمة المفتاحية
 * @returns {string} - الكلمات المفتاحية مفصولة بفاصلة
 */
export function generateKeywords(brand, product, keyword) {
  const keywordAr = KEYWORD_TRANSLATIONS[keyword] || keyword;
  
  const keywords = [
    `${keywordAr} ${brand.name}`,
    `${brand.name} ${product.name}`,
    `رقم ${brand.name}`,
    `عنوان ${brand.name}`,
    `${keywordAr} ${brand.name} ${product.name}`,
    `${brand.name} مصر`,
    `${product.name} ${brand.name}`,
  ];
  
  return keywords.join(', ');
}

/**
 * توليد عنوان H1
 * @param {Object} brand - بيانات الماركة
 * @param {Object} product - بيانات المنتج
 * @param {string} keyword - الكلمة المفتاحية
 * @returns {string} - عنوان H1
 */
export function generateH1(brand, product, keyword) {
  const keywordAr = KEYWORD_TRANSLATIONS[keyword] || keyword;
  
  const formats = [
    `${keywordAr} ${brand.name} ${product.name} في مصر`,
    `دليل ${keywordAr} ${brand.name} ${product.name} الشامل`,
    `${brand.name} ${product.name}: ${keywordAr} ومعلومات التواصل`,
    `معلومات ${keywordAr} ${brand.name} ${product.name}`,
  ];
  
  const hash = (brand.slug + product.slug + keyword).split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const index = Math.abs(hash) % formats.length;
  return formats[index];
}

/**
 * توليد Open Graph Title
 * @param {Object} brand - بيانات الماركة
 * @param {Object} product - بيانات المنتج
 * @param {string} keyword - الكلمة المفتاحية
 * @returns {string} - عنوان OG
 */
export function generateOGTitle(brand, product, keyword) {
  const keywordAr = KEYWORD_TRANSLATIONS[keyword] || keyword;
  return `${keywordAr} ${brand.name} ${product.name} في مصر`;
}

/**
 * توليد Open Graph Description
 * @param {Object} brand - بيانات الماركة
 * @param {Object} product - بيانات المنتج
 * @param {string} keyword - الكلمة المفتاحية
 * @returns {string} - وصف OG
 */
export function generateOGDescription(brand, product, keyword) {
  const keywordAr = KEYWORD_TRANSLATIONS[keyword] || keyword;
  return `احصل على رقم وعنوان ${keywordAr} ${brand.name} ${product.name} في مصر. دليل شامل لجميع فروع ${brand.name}.`;
}

/**
 * توليد Open Graph Image URL
 * @param {Object} brand - بيانات الماركة
 * @returns {string} - رابط الصورة
 */
export function generateOGImage(brand) {
  // إذا كان هناك cover_url مخصص
  if (brand.cover_url) {
    return brand.cover_url;
  }
  
  // صورة افتراضية
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${supabaseUrl}/storage/v1/object/public/defaults/default-banner.jpg`;
}

/**
 * توليد جميع عناصر السيو دفعة واحدة
 * @param {Object} brand - بيانات الماركة
 * @param {Object} product - بيانات المنتج
 * @param {string} keyword - الكلمة المفتاحية
 * @returns {Object} - كائن يحتوي على جميع عناصر السيو
 */
export function generateAllSEO(brand, product, keyword) {
  return {
    title: generateTitle(brand, product, keyword),
    metaDescription: generateMetaDescription(brand, product, keyword),
    canonicalUrl: generateCanonicalUrl(brand, product, keyword),
    keywords: generateKeywords(brand, product, keyword),
    h1: generateH1(brand, product, keyword),
    ogTitle: generateOGTitle(brand, product, keyword),
    ogDescription: generateOGDescription(brand, product, keyword),
    ogImage: generateOGImage(brand),
  };
}
