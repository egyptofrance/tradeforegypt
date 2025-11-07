#!/usr/bin/env node

/**
 * Add Missing Brand-Family Relations
 * 
 * هذا السكريبت يضيف جميع العلاقات الناقصة بين الماركات والعائلات
 * بحيث كل ماركة تكون مرتبطة بجميع العائلات (لتوليد جميع الصفحات)
 */

const { createClient } = require('@supabase/supabase-js');

// إنشاء عميل Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function addMissingRelations() {
  console.log('🚀 بدء إضافة العلاقات الناقصة...\n');
  
  try {
    // 1. جلب جميع الماركات
    const { data: brands, error: brandsError } = await supabase
      .from('brands')
      .select('id, name, slug');
    
    if (brandsError) throw brandsError;
    console.log(`✅ تم جلب ${brands.length} ماركة\n`);
    
    // 2. جلب جميع العائلات
    const { data: families, error: familiesError } = await supabase
      .from('families')
      .select('id, name, slug');
    
    if (familiesError) throw familiesError;
    console.log(`✅ تم جلب ${families.length} عائلة\n`);
    
    // 3. جلب العلاقات الموجودة
    const { data: existingRelations, error: relationsError } = await supabase
      .from('brand_families')
      .select('brand_id, family_id');
    
    if (relationsError) throw relationsError;
    console.log(`✅ تم جلب ${existingRelations.length} علاقة موجودة\n`);
    
    // 4. إنشاء Set للعلاقات الموجودة (للبحث السريع)
    const existingSet = new Set(
      existingRelations.map(r => `${r.brand_id}-${r.family_id}`)
    );
    
    // 5. إيجاد العلاقات الناقصة
    const missingRelations = [];
    
    for (const brand of brands) {
      for (const family of families) {
        const key = `${brand.id}-${family.id}`;
        if (!existingSet.has(key)) {
          missingRelations.push({
            brand_id: brand.id,
            family_id: family.id
          });
        }
      }
    }
    
    console.log(`📊 الإحصائيات:`);
    console.log(`   - الماركات: ${brands.length}`);
    console.log(`   - العائلات: ${families.length}`);
    console.log(`   - العلاقات المتوقعة: ${brands.length * families.length}`);
    console.log(`   - العلاقات الموجودة: ${existingRelations.length}`);
    console.log(`   - العلاقات الناقصة: ${missingRelations.length}\n`);
    
    if (missingRelations.length === 0) {
      console.log('✅ جميع العلاقات موجودة بالفعل!');
      return;
    }
    
    // 6. إضافة العلاقات الناقصة (دفعات من 100)
    console.log('🔄 جاري إضافة العلاقات الناقصة...\n');
    
    const batchSize = 100;
    let addedCount = 0;
    
    for (let i = 0; i < missingRelations.length; i += batchSize) {
      const batch = missingRelations.slice(i, i + batchSize);
      
      const { error: insertError } = await supabase
        .from('brand_families')
        .insert(batch);
      
      if (insertError) {
        console.error(`❌ خطأ في الدفعة ${Math.floor(i / batchSize) + 1}:`, insertError.message);
      } else {
        addedCount += batch.length;
        console.log(`   ✅ تمت إضافة ${batch.length} علاقة (المجموع: ${addedCount}/${missingRelations.length})`);
      }
    }
    
    console.log(`\n✅ تم الانتهاء! تمت إضافة ${addedCount} علاقة جديدة\n`);
    
    // 7. التحقق النهائي
    const { data: finalRelations } = await supabase
      .from('brand_families')
      .select('brand_id, family_id');
    
    console.log(`📊 الإحصائيات النهائية:`);
    console.log(`   - العلاقات الكلية: ${finalRelations.length}`);
    console.log(`   - الصفحات المتوقعة: ${finalRelations.length} ماركة-عائلة × عدد المنتجات × 6 كلمات\n`);
    
    // 8. حساب عدد الصفحات المتوقعة
    const { data: products } = await supabase
      .from('products')
      .select('id');
    
    const expectedPages = finalRelations.length * 6; // 6 كلمات لكل ماركة-منتج
    console.log(`🎯 عدد الصفحات المتوقعة (تقريبي): ${expectedPages.toLocaleString()}\n`);
    
  } catch (error) {
    console.error('❌ خطأ:', error.message);
    process.exit(1);
  }
}

// تشغيل السكريبت
addMissingRelations()
  .then(() => {
    console.log('✅ تم بنجاح!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ فشل:', error);
    process.exit(1);
  });
