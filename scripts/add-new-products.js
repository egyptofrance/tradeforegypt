const { createClient } = require('@supabase/supabase-js');
const newProductsData = require('./new-products.json');

const supabaseUrl = process.env.SUPABASE_URL || 'https://npnzcdugtqhqclfcgipb.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wbnpjZHVndHFocWNsZmNnaXBiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjM4MTUxNSwiZXhwIjoyMDc3OTU3NTE1fQ.-1MU8CIYLOoFL5Kj7tOF38tlXqOfSHYvE9uw3Xj5i0c';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addNewProducts() {
    console.log('🏗️  بدء إضافة المنتجات الجديدة...\n');
    
    let totalAdded = 0;
    let totalErrors = 0;
    
    for (const familyData of newProductsData) {
        console.log(`\n📦 العائلة: ${familyData.family_name} (ID: ${familyData.family_id})`);
        console.log('─'.repeat(60));
        
        let familySuccess = 0;
        let familyErrors = 0;
        
        for (const product of familyData.products) {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .insert({
                        family_id: familyData.family_id,
                        name: product.name,
                        slug: product.slug
                    })
                    .select();
                
                if (error) throw error;
                
                console.log(`   ✅ ${product.name} (${product.slug})`);
                familySuccess++;
                totalAdded++;
                
            } catch (error) {
                console.error(`   ❌ ${product.name}: ${error.message}`);
                familyErrors++;
                totalErrors++;
            }
        }
        
        console.log(`\n   📊 النتيجة: ${familySuccess} نجح، ${familyErrors} فشل`);
    }
    
    console.log('\n' + '═'.repeat(60));
    console.log('📊 النتيجة النهائية:');
    console.log(`   ✅ تمت إضافة: ${totalAdded} منتج`);
    console.log(`   ❌ فشلت: ${totalErrors} منتج`);
    console.log('═'.repeat(60));
    
    // التحقق من العدد الإجمالي
    const { data: allProducts, error } = await supabase
        .from('products')
        .select('id', { count: 'exact' });
    
    if (!error) {
        console.log(`\n📈 إجمالي المنتجات في قاعدة البيانات: ${allProducts.length}`);
    }
    
    // التحقق من العائلات الفارغة
    console.log('\n🔍 فحص العائلات بدون منتجات...');
    const { data: families } = await supabase
        .from('families')
        .select('id, name');
    
    const emptyFamilies = [];
    for (const family of families) {
        const { data: products } = await supabase
            .from('products')
            .select('id')
            .eq('family_id', family.id);
        
        if (!products || products.length === 0) {
            emptyFamilies.push(family);
        }
    }
    
    if (emptyFamilies.length === 0) {
        console.log('✅ جميع العائلات لديها منتجات!');
    } else {
        console.log(`⚠️  ${emptyFamilies.length} عائلات لا تزال فارغة:`);
        emptyFamilies.forEach(f => {
            console.log(`   - ${f.name} (ID: ${f.id})`);
        });
    }
    
    console.log('\n🎉 المرحلة الثانية مكتملة!\n');
    
    return totalErrors === 0;
}

// تشغيل السكريبت
addNewProducts()
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
