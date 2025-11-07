const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.SUPABASE_URL || 'https://npnzcdugtqhqclfcgipb.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wbnpjZHVndHFocWNsZmNnaXBiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjM4MTUxNSwiZXhwIjoyMDc3OTU3NTE1fQ.-1MU8CIYLOoFL5Kj7tOF38tlXqOfSHYvE9uw3Xj5i0c';

const supabase = createClient(supabaseUrl, supabaseKey);

async function importBrandFamilies() {
    console.log('🚀 بدء استيراد تصنيف الماركات...\n');
    
    // قراءة الملف النظيف
    const csvPath = '/home/ubuntu/brands_classification_clean.csv';
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').slice(1); // تجاهل الهيدر
    
    let stats = {
        total: 0,
        classified: 0,
        unclassified: 0,
        relations_added: 0,
        errors: []
    };
    
    // حذف العلاقات القديمة أولاً
    console.log('🗑️  حذف العلاقات القديمة...');
    const { error: deleteError } = await supabase
        .from('brand_families')
        .delete()
        .neq('id', 0); // حذف الكل
    
    if (deleteError) {
        console.log('⚠️  تحذير عند الحذف:', deleteError.message);
    } else {
        console.log('✅ تم حذف العلاقات القديمة\n');
    }
    
    console.log('=' .repeat(80));
    console.log('استيراد العلاقات الجديدة');
    console.log('='.repeat(80));
    
    for (const line of lines) {
        if (!line.trim()) continue;
        
        const parts = line.split(',');
        if (parts.length < 4) continue;
        
        const brandId = parseInt(parts[0]);
        const brandName = parts[1];
        const familyIds = parts[3].trim();
        
        stats.total++;
        
        if (!familyIds || familyIds === '') {
            stats.unclassified++;
            console.log(`⚠️  ${brandName}: غير مصنف`);
            continue;
        }
        
        stats.classified++;
        
        // تقسيم العائلات
        const families = familyIds.split(',').map(f => parseInt(f.trim())).filter(f => !isNaN(f));
        
        console.log(`\n📦 ${brandName} (ID: ${brandId})`);
        console.log(`   العائلات: ${families.join(', ')}`);
        
        // إضافة العلاقات
        for (const familyId of families) {
            try {
                const { data, error } = await supabase
                    .from('brand_families')
                    .insert({
                        brand_id: brandId,
                        family_id: familyId
                    })
                    .select();
                
                if (error) throw error;
                
                stats.relations_added++;
                console.log(`   ✅ تم ربط مع عائلة ${familyId}`);
                
            } catch (error) {
                console.log(`   ❌ خطأ في ربط عائلة ${familyId}: ${error.message}`);
                stats.errors.push(`${brandName} → عائلة ${familyId}: ${error.message}`);
            }
        }
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('📊 النتيجة النهائية');
    console.log('='.repeat(80));
    console.log(`إجمالي الماركات: ${stats.total}`);
    console.log(`✅ مصنفة: ${stats.classified}`);
    console.log(`⚠️  غير مصنفة: ${stats.unclassified}`);
    console.log(`🔗 علاقات مضافة: ${stats.relations_added}`);
    console.log(`❌ أخطاء: ${stats.errors.length}`);
    
    if (stats.errors.length > 0) {
        console.log('\nالأخطاء:');
        stats.errors.slice(0, 10).forEach(err => console.log(`  - ${err}`));
    }
    
    // التحقق النهائي
    console.log('\n' + '='.repeat(80));
    console.log('🔍 التحقق النهائي');
    console.log('='.repeat(80));
    
    const { data: allRelations, error } = await supabase
        .from('brand_families')
        .select('*', { count: 'exact' });
    
    if (!error) {
        console.log(`✅ إجمالي العلاقات في قاعدة البيانات: ${allRelations.length}`);
    }
    
    // عرض إحصائيات العائلات
    const { data: families } = await supabase
        .from('families')
        .select('id, name');
    
    console.log('\n📊 توزيع الماركات على العائلات:');
    for (const family of families) {
        const { data: brands } = await supabase
            .from('brand_families')
            .select('brand_id')
            .eq('family_id', family.id);
        
        if (brands && brands.length > 0) {
            console.log(`  ${family.name}: ${brands.length} ماركة`);
        }
    }
    
    console.log('\n🎉 اكتمل الاستيراد!\n');
    
    return stats.errors.length === 0;
}

// تشغيل السكريبت
importBrandFamilies()
    .then(success => {
        if (success) {
            console.log('✓ السكريبت اكتمل بنجاح');
            process.exit(0);
        } else {
            console.log('⚠ السكريبت اكتمل مع أخطاء');
            process.exit(1);
        }
    })
    .catch(error => {
        console.error('❌ خطأ فادح:', error);
        process.exit(1);
    });
