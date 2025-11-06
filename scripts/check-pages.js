const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://npnzcdugtqhqclfcgipb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wbnpjZHVndHFocWNsZmNnaXBiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjM4MTUxNSwiZXhwIjoyMDc3OTU3NTE1fQ.-1MU8CIYLOoFL5Kj7tOF38tlXqOfSHYvE9uw3Xj5i0c';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPages() {
    console.log('جاري فحص جدول الصفحات...\n');
    
    // جلب أول 10 صفحات
    const { data: pages, error } = await supabase
        .from('pages')
        .select('*')
        .limit(10);
    
    if (error) {
        console.error('خطأ:', error);
        return;
    }
    
    console.log(`عدد الصفحات المسترجعة: ${pages.length}\n`);
    
    pages.forEach((page, index) => {
        console.log(`--- الصفحة ${index + 1} ---`);
        console.log(`ID: ${page.id}`);
        console.log(`Path: ${page.path}`);
        console.log(`Title: ${page.page_title}`);
        console.log(`Brand ID: ${page.brand_id}`);
        console.log(`Product ID: ${page.product_id}`);
        console.log('');
    });
}

checkPages();
