const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://npnzcdugtqhqclfcgipb.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wbnpjZHVndHFocWNsZmNnaXBiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjM4MTUxNSwiZXhwIjoyMDc3OTU3NTE1fQ.-1MU8CIYLOoFL5Kj7tOF38tlXqOfSHYvE9uw3Xj5i0c';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixDuplicateSlugs() {
    console.log('🔧 بدء إصلاح تكرار السلاج في جدول products...\n');
    
    // الخطوة 1: التحقق من السلاجات المكررة
    console.log('📊 الخطوة 1: فحص السلاجات المكررة...');
    const { data: products, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('id');
    
    if (fetchError) {
        console.error('❌ خطأ في جلب البيانات:', fetchError);
        return;
    }
    
    // إيجاد التكرارات
    const slugCounts = {};
    products.forEach(p => {
        slugCounts[p.slug] = (slugCounts[p.slug] || 0) + 1;
    });
    
    const duplicates = Object.keys(slugCounts).filter(slug => slugCounts[slug] > 1);
    
    if (duplicates.length === 0) {
        console.log('✅ لا توجد سلاجات مكررة!');
        return;
    }
    
    console.log(`⚠️  تم العثور على ${duplicates.length} سلاج مكرر:`);
    duplicates.forEach(slug => {
        console.log(`   - "${slug}" مكرر ${slugCounts[slug]} مرة`);
    });
    
    // الخطوة 2: جلب بيانات العائلات لإنشاء السلاجات الجديدة
    console.log('\n📊 الخطوة 2: جلب بيانات العائلات...');
    const { data: families, error: familiesError } = await supabase
        .from('families')
        .select('id, slug');
    
    if (familiesError) {
        console.error('❌ خطأ في جلب العائلات:', familiesError);
        return;
    }
    
    const familyMap = {};
    families.forEach(f => {
        familyMap[f.id] = f.slug;
    });
    
    // الخطوة 3: إصلاح السلاجات المكررة
    console.log('\n🔧 الخطوة 3: إصلاح السلاجات المكررة...\n');
    
    const updates = [
        // سماعات - موبايلات
        { id: 46, oldSlug: 'smaaat', newSlug: 'smaaat-mobile-tablets', name: 'سماعات (موبايلات)' },
        // سماعات - صوت وفيديو
        { id: 73, oldSlug: 'smaaat', newSlug: 'smaaat-audio-video', name: 'سماعات (صوت وفيديو)' },
        // ماسح ضوئي - كمبيوتر
        { id: 54, oldSlug: 'mash-dwy', newSlug: 'mash-dwy-computers', name: 'ماسح ضوئي (كمبيوتر)' },
        // ماسح ضوئي - طابعات
        { id: 63, oldSlug: 'mash-dwy', newSlug: 'mash-dwy-printers', name: 'ماسح ضوئي (طابعات)' }
    ];
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const update of updates) {
        try {
            const { error } = await supabase
                .from('products')
                .update({ slug: update.newSlug })
                .eq('id', update.id);
            
            if (error) throw error;
            
            console.log(`✅ تم تحديث: ${update.name}`);
            console.log(`   ID: ${update.id}`);
            console.log(`   من: "${update.oldSlug}" → إلى: "${update.newSlug}"\n`);
            successCount++;
            
        } catch (error) {
            console.error(`❌ فشل تحديث ID ${update.id}:`, error.message);
            errorCount++;
        }
    }
    
    // الخطوة 4: التحقق من النتائج
    console.log('\n📊 الخطوة 4: التحقق من النتائج...');
    const { data: updatedProducts } = await supabase
        .from('products')
        .select('*')
        .order('id');
    
    const newSlugCounts = {};
    updatedProducts.forEach(p => {
        newSlugCounts[p.slug] = (newSlugCounts[p.slug] || 0) + 1;
    });
    
    const remainingDuplicates = Object.keys(newSlugCounts).filter(slug => newSlugCounts[slug] > 1);
    
    if (remainingDuplicates.length === 0) {
        console.log('✅ تم إصلاح جميع السلاجات المكررة بنجاح!');
    } else {
        console.log(`⚠️  لا تزال هناك ${remainingDuplicates.length} سلاجات مكررة:`);
        remainingDuplicates.forEach(slug => {
            console.log(`   - "${slug}" مكرر ${newSlugCounts[slug]} مرة`);
        });
    }
    
    // الخطوة 5: إضافة قيد الفريدة (Unique Constraint)
    console.log('\n🔒 الخطوة 5: إضافة قيد الفريدة على عمود slug...');
    console.log('⚠️  هذه الخطوة تحتاج تنفيذ يدوي في Supabase SQL Editor:');
    console.log('\nالاستعلام المطلوب:');
    console.log('---');
    console.log('ALTER TABLE products ADD CONSTRAINT unique_product_slug UNIQUE (slug);');
    console.log('---\n');
    
    // النتيجة النهائية
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 النتيجة النهائية:');
    console.log(`   ✅ تم التحديث بنجاح: ${successCount}`);
    console.log(`   ❌ فشل التحديث: ${errorCount}`);
    console.log(`   📝 السلاجات المتبقية المكررة: ${remainingDuplicates.length}`);
    console.log('═══════════════════════════════════════════════════════════\n');
    
    if (successCount === updates.length && remainingDuplicates.length === 0) {
        console.log('🎉 تم إصلاح جدول products بنجاح! المرحلة الأولى مكتملة.\n');
        return true;
    } else {
        console.log('⚠️  هناك بعض المشاكل التي تحتاج مراجعة.\n');
        return false;
    }
}

// تشغيل السكريبت
fixDuplicateSlugs()
    .then(success => {
        if (success) {
            console.log('✓ السكريبت اكتمل بنجاح');
            process.exit(0);
        } else {
            console.log('⚠ السكريبت اكتمل مع تحذيرات');
            process.exit(1);
        }
    })
    .catch(error => {
        console.error('❌ خطأ فادح:', error);
        process.exit(1);
    });
