const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://npnzcdugtqhqclfcgipb.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wbnpjZHVndHFocWNsZmNnaXBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzODE1MTUsImV4cCI6MjA3Nzk1NzUxNX0.CWiKXLYT32uVGDMjVJNz3rDSxyFJohceUUYMXwcIraI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('🔄 اختبار الاتصال بـ Supabase...\n');
  
  try {
    // اختبار جلب الماركات
    console.log('📦 جلب الماركات...');
    const { data: brands, error: brandsError } = await supabase
      .from('brands')
      .select('*')
      .limit(5);
    
    if (brandsError) {
      console.error('❌ خطأ في جلب الماركات:', brandsError.message);
    } else {
      console.log(`✅ تم جلب ${brands.length} ماركات بنجاح`);
      if (brands.length > 0) {
        console.log('   مثال:', brands[0].name || brands[0].slug);
      }
    }
    
    // اختبار جلب المنتجات
    console.log('\n📦 جلب المنتجات...');
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .limit(5);
    
    if (productsError) {
      console.error('❌ خطأ في جلب المنتجات:', productsError.message);
    } else {
      console.log(`✅ تم جلب ${products.length} منتجات بنجاح`);
      if (products.length > 0) {
        console.log('   مثال:', products[0].name || products[0].slug);
      }
    }
    
    // اختبار جلب العائلات
    console.log('\n📦 جلب العائلات...');
    const { data: families, error: familiesError } = await supabase
      .from('families')
      .select('*')
      .limit(5);
    
    if (familiesError) {
      console.error('❌ خطأ في جلب العائلات:', familiesError.message);
    } else {
      console.log(`✅ تم جلب ${families.length} عائلات بنجاح`);
      if (families.length > 0) {
        console.log('   مثال:', families[0].name || families[0].slug);
      }
    }
    
    console.log('\n✅ اختبار الاتصال بـ Supabase تم بنجاح!');
    
  } catch (error) {
    console.error('\n❌ خطأ عام:', error.message);
    process.exit(1);
  }
}

testConnection();
