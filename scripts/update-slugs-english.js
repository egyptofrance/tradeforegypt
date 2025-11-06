const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://npnzcdugtqhqclfcgipb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wbnpjZHVndHFocWNsZmNnaXBiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjM4MTUxNSwiZXhwIjoyMDc3OTU3NTE1fQ.-1MU8CIYLOoFL5Kj7tOF38tlXqOfSHYvE9uw3Xj5i0c';

const supabase = createClient(supabaseUrl, supabaseKey);

// قاموس الترجمة من العربية إلى الإنجليزية
const translations = {
    // أنواع الخدمات
    'صيانة': 'maintenance',
    'توكيل': 'agency',
    'ضمان': 'warranty',
    'خدمة عملاء': 'customer-service',
    'خط ساخن': 'hotline',
    'ارقام': 'numbers',
    'أرقام': 'numbers',
    
    // المنتجات
    'غسالة': 'washing-machine',
    'ثلاجة': 'refrigerator',
    'بوتاجاز': 'stove',
    'سخان': 'heater',
    'غسالة أطباق': 'dishwasher',
    'ديب فريزر': 'deep-freezer',
    'مجفف ملابس': 'dryer',
    'مكيف': 'air-conditioner',
    'تلفزيون': 'television',
    'ميكروويف': 'microwave',
    'فرن': 'oven',
    'شفاط': 'hood',
    'مروحة': 'fan'
};

function generateEnglishSlug(pageTitle, brandName) {
    let slug = pageTitle.toLowerCase();
    
    // تحويل اسم الماركة إلى lowercase وإزالة المسافات
    const brandSlug = brandName.toLowerCase().replace(/\s+/g, '-');
    
    // إزالة اسم الماركة من العنوان أولاً لتجنب التكرار
    slug = slug.replace(brandName.toLowerCase(), '');
    
    // استبدال الكلمات العربية بالإنجليزية
    Object.keys(translations).forEach(arabic => {
        const regex = new RegExp(arabic, 'g');
        slug = slug.replace(regex, translations[arabic]);
    });
    
    // إزالة جميع الأحرف العربية المتبقية
    slug = slug.replace(/[\u0600-\u06FF]/g, '');
    
    // إزالة المسافات الزائدة واستبدالها بـ -
    slug = slug.trim().replace(/\s+/g, '-');
    
    // إزالة أي أحرف غير مسموح بها (نبقي فقط a-z, 0-9, -)
    slug = slug.replace(/[^a-z0-9\-]/g, '');
    
    // إزالة الشرطات المتعددة
    slug = slug.replace(/-+/g, '-');
    
    // إزالة الشرطات من البداية والنهاية
    slug = slug.replace(/^-+|-+$/g, '');
    
    // إضافة اسم الماركة في النهاية
    slug = `${slug}-${brandSlug}`;
    
    // تنظيف نهائي
    slug = slug.replace(/-+/g, '-').replace(/^-+|-+$/g, '');
    
    return slug;
}

async function updateSlugs() {
    console.log('🚀 جاري تحديث slugs لجميع الصفحات...\n');
    
    // جلب جميع الصفحات مع بيانات الماركة والمنتج
    const { data: pages, error } = await supabase
        .from('pages')
        .select(`
            *,
            brands:brand_id (name),
            products:product_id (name)
        `);
    
    if (error) {
        console.error('❌ خطأ في جلب الصفحات:', error);
        return;
    }
    
    console.log(`📊 عدد الصفحات: ${pages.length}\n`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const page of pages) {
        try {
            const title = page.page_title;
            const brandName = page.brands?.name || '';
            
            // توليد slug إنجليزي
            const englishSlug = generateEnglishSlug(title, brandName);
            
            // تحديث slug في قاعدة البيانات
            const { error: updateError } = await supabase
                .from('pages')
                .update({ slug: englishSlug })
                .eq('id', page.id);
            
            if (updateError) {
                console.error(`❌ خطأ في تحديث الصفحة ${page.id}:`, updateError);
                errorCount++;
            } else {
                console.log(`✅ ${page.id}: ${title} -> ${englishSlug}`);
                successCount++;
            }
        } catch (err) {
            console.error(`❌ خطأ في معالجة الصفحة ${page.id}:`, err);
            errorCount++;
        }
    }
    
    console.log(`\n📈 === النتائج ===`);
    console.log(`✅ نجح: ${successCount}`);
    console.log(`❌ فشل: ${errorCount}`);
    console.log(`📊 الإجمالي: ${pages.length}`);
}

updateSlugs();
