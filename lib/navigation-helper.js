// ============================================
// Trade for Egypt - Navigation Helper
// ============================================
// حساب Previous/Next Links للتنقل بين الصفحات
// ============================================

import { supabase } from './supabase';

// الكلمات المفتاحية بالترتيب
const KEYWORDS = ['agency', 'customer-service', 'hotline', 'maintenance', 'numbers', 'warranty'];

/**
 * حساب الصفحة السابقة والتالية
 * @param {Object} brand - الماركة الحالية
 * @param {Object} product - المنتج الحالي
 * @param {string} keyword - الكلمة المفتاحية الحالية
 * @returns {Object} - { prev, next }
 */
export async function calculatePrevNext(brand, product, keyword) {
  // 1. جلب جميع الماركات مرتبة أبجدياً
  const allBrands = await getAllBrandsSorted();
  
  // 2. جلب جميع منتجات الماركة الحالية
  const brandProducts = await getBrandProductsSorted(brand.id);
  
  // 3. إيجاد الموقع الحالي
  const currentBrandIndex = allBrands.findIndex(b => b.id === brand.id);
  const currentProductIndex = brandProducts.findIndex(p => p.id === product.id);
  const currentKeywordIndex = KEYWORDS.indexOf(keyword);
  
  // 4. حساب Previous
  const prev = calculatePrevious(
    allBrands,
    brandProducts,
    currentBrandIndex,
    currentProductIndex,
    currentKeywordIndex
  );
  
  // 5. حساب Next
  const next = calculateNext(
    allBrands,
    brandProducts,
    currentBrandIndex,
    currentProductIndex,
    currentKeywordIndex
  );
  
  return { prev, next };
}

/**
 * حساب الصفحة السابقة
 */
function calculatePrevious(allBrands, brandProducts, brandIndex, productIndex, keywordIndex) {
  // حالة 1: نفس المنتج، كلمة سابقة
  if (keywordIndex > 0) {
    return {
      brand: allBrands[brandIndex].slug,
      product: brandProducts[productIndex].slug,
      keyword: KEYWORDS[keywordIndex - 1]
    };
  }
  
  // حالة 2: منتج سابق، آخر كلمة
  if (productIndex > 0) {
    return {
      brand: allBrands[brandIndex].slug,
      product: brandProducts[productIndex - 1].slug,
      keyword: KEYWORDS[KEYWORDS.length - 1]
    };
  }
  
  // حالة 3: ماركة سابقة، آخر منتج، آخر كلمة
  if (brandIndex > 0) {
    // نحتاج لجلب منتجات الماركة السابقة
    return {
      brand: allBrands[brandIndex - 1].slug,
      product: null, // سيتم حسابه لاحقاً
      keyword: KEYWORDS[KEYWORDS.length - 1],
      needsProductFetch: true,
      prevBrandId: allBrands[brandIndex - 1].id
    };
  }
  
  // لا يوجد سابق (أول صفحة)
  return null;
}

/**
 * حساب الصفحة التالية
 */
function calculateNext(allBrands, brandProducts, brandIndex, productIndex, keywordIndex) {
  // حالة 1: نفس المنتج، كلمة تالية
  if (keywordIndex < KEYWORDS.length - 1) {
    return {
      brand: allBrands[brandIndex].slug,
      product: brandProducts[productIndex].slug,
      keyword: KEYWORDS[keywordIndex + 1]
    };
  }
  
  // حالة 2: منتج تالي، أول كلمة
  if (productIndex < brandProducts.length - 1) {
    return {
      brand: allBrands[brandIndex].slug,
      product: brandProducts[productIndex + 1].slug,
      keyword: KEYWORDS[0]
    };
  }
  
  // حالة 3: ماركة تالية، أول منتج، أول كلمة
  if (brandIndex < allBrands.length - 1) {
    // نحتاج لجلب منتجات الماركة التالية
    return {
      brand: allBrands[brandIndex + 1].slug,
      product: null, // سيتم حسابه لاحقاً
      keyword: KEYWORDS[0],
      needsProductFetch: true,
      nextBrandId: allBrands[brandIndex + 1].id
    };
  }
  
  // لا يوجد تالي (آخر صفحة)
  return null;
}

/**
 * جلب جميع الماركات مرتبة أبجدياً
 * @returns {Array} - مصفوفة الماركات
 */
export async function getAllBrandsSorted() {
  const { data, error } = await supabase
    .from('brands')
    .select('id, name, slug')
    .order('slug', { ascending: true });
  
  if (error) throw error;
  return data;
}

/**
 * جلب جميع منتجات ماركة معينة مرتبة أبجدياً
 * @param {number} brandId - معرف الماركة
 * @returns {Array} - مصفوفة المنتجات
 */
export async function getBrandProductsSorted(brandId) {
  // جلب عائلات الماركة
  const { data: brandFamilies, error: bfError } = await supabase
    .from('brand_families')
    .select('family_id')
    .eq('brand_id', brandId);
  
  if (bfError) throw bfError;
  
  const familyIds = brandFamilies.map(bf => bf.family_id);
  
  // جلب المنتجات
  const { data: products, error: pError } = await supabase
    .from('products')
    .select('id, name, slug, family_id')
    .in('family_id', familyIds)
    .order('slug', { ascending: true });
  
  if (pError) throw pError;
  return products;
}

/**
 * حل Previous/Next إذا كان يحتاج لجلب منتجات
 * @param {Object} link - رابط Previous أو Next
 * @returns {Object} - الرابط المحلول
 */
export async function resolvePrevNextLink(link) {
  if (!link || !link.needsProductFetch) {
    return link;
  }
  
  // جلب منتجات الماركة
  const brandId = link.prevBrandId || link.nextBrandId;
  const products = await getBrandProductsSorted(brandId);
  
  if (products.length === 0) {
    return null; // لا توجد منتجات
  }
  
  // اختيار أول أو آخر منتج
  const product = link.prevBrandId 
    ? products[products.length - 1] // آخر منتج للسابق
    : products[0]; // أول منتج للتالي
  
  return {
    brand: link.brand,
    product: product.slug,
    keyword: link.keyword
  };
}

/**
 * توليد URL من رابط Previous/Next
 * @param {Object} link - الرابط
 * @returns {string} - URL كامل
 */
export function generateLinkUrl(link) {
  if (!link) return null;
  return `/${link.brand}/${link.product}/${link.keyword}`;
}

/**
 * حساب Previous/Next للصفحة "مراكز معتمدة"
 * @param {Object} brand - الماركة الحالية
 * @returns {Object} - { prev, next }
 */
export async function calculateAuthorizedCentersPrevNext(brand) {
  const allBrands = await getAllBrandsSorted();
  const currentIndex = allBrands.findIndex(b => b.id === brand.id);
  
  const prev = currentIndex > 0 
    ? { brand: allBrands[currentIndex - 1].slug }
    : null;
  
  const next = currentIndex < allBrands.length - 1
    ? { brand: allBrands[currentIndex + 1].slug }
    : null;
  
  return { prev, next };
}

/**
 * توليد URL لصفحة "مراكز معتمدة"
 * @param {string} brandSlug - slug الماركة
 * @returns {string} - URL
 */
export function generateAuthorizedCentersUrl(brandSlug) {
  return `/${brandSlug}/authorized-centers`;
}
