const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// الكلمات المفتاحية الـ 6
const KEYWORDS = [
  { slug: 'agency', name_ar: 'توكيل', name_en: 'Agency' },
  { slug: 'maintenance', name_ar: 'صيانة', name_en: 'Maintenance' },
  { slug: 'warranty', name_ar: 'ضمان', name_en: 'Warranty' },
  { slug: 'customer-service', name_ar: 'خدمة عملاء', name_en: 'Customer Service' },
  { slug: 'hotline', name_ar: 'خط ساخن', name_en: 'Hotline' },
  { slug: 'numbers', name_ar: 'أرقام', name_en: 'Numbers' }
];

async function generatePages(familyId = null, dryRun = true) {
  console.log('='.repeat(100));
  console.log('نظام توليد الصفحات - Trade for Egypt');
  console.log('='.repeat(100));
  console.log(`الوضع: ${dryRun ? 'تجريبي (Dry Run)' : 'حقيقي (Production)'}`);
  console.log('');

  // جلب العائلات
  let familiesQuery = supabase.from('families').select('*');
  if (familyId) {
    familiesQuery = familiesQuery.eq('id', familyId);
  }
  const { data: families, error: familiesError } = await familiesQuery;
  
  if (familiesError) {
    console.error('❌ خطأ في جلب العائلات:', familiesError);
    return;
  }

  console.log(`📊 العائلات: ${families.length}`);
  
  let totalPages = 0;
  let generatedPages = 0;

  for (const family of families) {
    console.log(`\n${'='.repeat(100)}`);
    console.log(`عائلة: ${family.name} (${family.slug})`);
    console.log('='.repeat(100));

    // جلب المنتجات
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .eq('family_id', family.id);

    // جلب الماركات
    const { data: brandFamilies } = await supabase
      .from('brand_families')
      .select('brand_id')
      .eq('family_id', family.id);

    const brandIds = brandFamilies.map(bf => bf.brand_id);
    
    const { data: brands } = await supabase
      .from('brands')
      .select('*')
      .in('id', brandIds);

    console.log(`  المنتجات: ${products?.length || 0}`);
    console.log(`  الماركات: ${brands?.length || 0}`);

    if (!products || !brands || products.length === 0 || brands.length === 0) {
      console.log('  ⚠️  تخطي - لا توجد منتجات أو ماركات');
      continue;
    }

    // حساب عدد الصفحات
    const pagesCount = brands.length * products.length * KEYWORDS.length;
    totalPages += pagesCount;
    console.log(`  📄 الصفحات المتوقعة: ${pagesCount.toLocaleString()}`);

    if (dryRun) {
      console.log('  ⏭️  تخطي التوليد (وضع تجريبي)');
      continue;
    }

    // توليد الصفحات
    console.log('  🔄 بدء التوليد...');
    
    for (const brand of brands) {
      for (const product of products) {
        for (const keyword of KEYWORDS) {
          const slug = `${brand.slug}/${product.slug}/${keyword.slug}`;
          const title = `${keyword.name_ar} ${product.name} ${brand.name}`;
          const metaDescription = `${keyword.name_ar} ${product.name} ${brand.name} في مصر - خدمات معتمدة وأرقام تواصل`;

          const pageData = {
            slug,
            title,
            meta_description: metaDescription,
            brand_id: brand.id,
            product_id: product.id,
            family_id: family.id,
            keyword: keyword.slug,
            content: {
              brand: brand.name,
              product: product.name,
              family: family.name,
              keyword: keyword.name_ar,
              keyword_en: keyword.name_en
            }
          };

          const { error } = await supabase
            .from('pages')
            .insert(pageData);

          if (error) {
            if (error.code === '23505') {
              // تخطي المكرر
            } else {
              console.error(`    ❌ خطأ: ${slug}`, error.message);
            }
          } else {
            generatedPages++;
            if (generatedPages % 100 === 0) {
              console.log(`    ✅ ${generatedPages.toLocaleString()} صفحة...`);
            }
          }
        }
      }
    }

    console.log(`  ✅ اكتمل: ${generatedPages.toLocaleString()} صفحة`);
  }

  console.log('\n' + '='.repeat(100));
  console.log('📊 النتيجة النهائية');
  console.log('='.repeat(100));
  console.log(`إجمالي الصفحات المتوقعة: ${totalPages.toLocaleString()}`);
  if (!dryRun) {
    console.log(`الصفحات المولدة: ${generatedPages.toLocaleString()}`);
  }
  console.log('🎉 اكتمل!');
}

// التشغيل
const args = process.argv.slice(2);
const familyId = args[0] ? parseInt(args[0]) : null;
const dryRun = args[1] !== 'production';

generatePages(familyId, dryRun)
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ خطأ:', err);
    process.exit(1);
  });

