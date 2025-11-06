const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://npnzcdugtqhqclfcgipb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wbnpjZHVndHFocWNsZmNnaXBiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjM4MTUxNSwiZXhwIjoyMDc3OTU3NTE1fQ.-1MU8CIYLOoFL5Kj7tOF38tlXqOfSHYvE9uw3Xj5i0c';

const supabase = createClient(supabaseUrl, supabaseKey);

// دالة لتحويل النص العربي إلى slug
function arabicToSlug(text) {
    const arabicToEnglish = {
        'صيانة': 'maintenance',
        'توكيل': 'agency',
        'ضمان': 'warranty',
        'خدمة عملاء': 'customer-service',
        'خط ساخن': 'hotline',
        'ارقام': 'numbers',
        'أرقام': 'numbers',
        'غسالة': 'washing-machine',
        'ثلاجة': 'refrigerator',
        'بوتاجاز': 'stove',
        'سخان': 'heater',
        'غسالة أطباق': 'dishwasher',
        'ديب فريزر': 'deep-freezer',
        'مجفف ملابس': 'dryer'
    };
    
    let slug = text.toLowerCase();
    
    // استبدال الكلمات العربية بالإنجليزية
    Object.keys(arabicToEnglish).forEach(arabic => {
        slug = slug.replace(arabic, arabicToEnglish[arabic]);
    });
    
    // إزالة المسافات الزائدة واستبدالها بـ -
    slug = slug.trim().replace(/\s+/g, '-');
    
    // إزالة أي أحرف غير مسموح بها
    slug = slug.replace(/[^a-z0-9\-]/g, '');
    
    // إزالة الشرطات المتعددة
    slug = slug.replace(/-+/g, '-');
    
    // إزالة الشرطات من البداية والنهاية
    slug = slug.replace(/^-+|-+$/g, '');
    
    return slug;
}

async function generatePaths() {
    console.log('جاري توليد المسارات لجميع الصفحات...\n');
    
    // جلب جميع الصفحات مع بيانات الماركة والمنتج
    const { data: pages, error } = await supabase
        .from('pages')
        .select(`
            *,
            brands:brand_id (name),
            products:product_id (name)
        `);
    
    if (error) {
        console.error('خطأ في جلب الصفحات:', error);
        return;
    }
    
    console.log(`عدد الصفحات: ${pages.length}\n`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const page of pages) {
        try {
            // استخراج الكلمة المفتاحية من العنوان
            const title = page.page_title;
            const brandName = page.brands?.name || '';
            const productName = page.products?.name || '';
            
            // توليد المسار
            let path = arabicToSlug(title);
            
            // إضافة اسم الماركة بالإنجليزية
            const brandSlug = brandName.toLowerCase().replace(/\s+/g, '-');
            path = `${path}-${brandSlug}`;
            
            // تحديث المسار في قاعدة البيانات
            const { error: updateError } = await supabase
                .from('pages')
                .update({ path: path })
                .eq('id', page.id);
            
            if (updateError) {
                console.error(`خطأ في تحديث الصفحة ${page.id}:`, updateError);
                errorCount++;
            } else {
                console.log(`✓ تم تحديث: ${page.id} -> ${path}`);
                successCount++;
            }
        } catch (err) {
            console.error(`خطأ في معالجة الصفحة ${page.id}:`, err);
            errorCount++;
        }
    }
    
    console.log(`\n=== النتائج ===`);
    console.log(`نجح: ${successCount}`);
    console.log(`فشل: ${errorCount}`);
}

generatePaths();
