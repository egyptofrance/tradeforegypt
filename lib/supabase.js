import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// دالة مساعدة لجلب جميع الماركات
export async function getAllBrands() {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('slug', { ascending: true });
  
  if (error) throw error;
  return data;
}

// دالة مساعدة لجلب ماركة واحدة
export async function getBrandBySlug(slug) {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) throw error;
  return data;
}

// دالة مساعدة لجلب جميع المنتجات
export async function getAllProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('slug', { ascending: true });
  
  if (error) throw error;
  return data;
}

// دالة مساعدة لجلب منتج واحد
export async function getProductBySlug(slug) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) throw error;
  return data;
}

// دالة مساعدة لجلب عائلة واحدة
export async function getFamilyById(id) {
  const { data, error } = await supabase
    .from('families')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

// دالة مساعدة لجلب منتجات ماركة معينة
export async function getBrandProducts(brandId) {
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
    .select('*')
    .in('family_id', familyIds)
    .order('slug', { ascending: true });
  
  if (pError) throw pError;
  return products;
}

// دالة مساعدة لجلب التقييم
export async function getRating(brandId, productId) {
  const { data, error } = await supabase
    .from('ratings')
    .select('*')
    .eq('brand_id', brandId)
    .eq('product_id', productId)
    .single();
  
  // إذا لم يوجد تقييم، نرجع تقييم افتراضي
  if (error || !data) {
    return {
      rating_value: 4.7,
      rating_count: 100
    };
  }
  
  return data;
}

// دالة مساعدة لجلب المحتوى المخصص
export async function getCustomContent(brandId, productId, keyword) {
  const { data, error } = await supabase
    .from('page_content')
    .select('*')
    .eq('brand_id', brandId)
    .eq('product_id', productId)
    .eq('keyword', keyword)
    .single();
  
  // إذا لم يوجد محتوى مخصص، نرجع null
  if (error || !data) {
    return null;
  }
  
  return data;
}

// دالة مساعدة للتحقق من علاقة brand-product
export async function checkBrandProductRelation(brandId, productId) {
  // جلب عائلة المنتج
  const product = await supabase
    .from('products')
    .select('family_id')
    .eq('id', productId)
    .single();
  
  if (product.error) return false;
  
  // التحقق من وجود العلاقة
  const { data, error } = await supabase
    .from('brand_families')
    .select('*')
    .eq('brand_id', brandId)
    .eq('family_id', product.data.family_id)
    .single();
  
  return !error && data !== null;
}
