const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://npnzcdugtqhqclfcgipb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5wbnpjZHVndHFocWNsZmNnaXBiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjM4MTUxNSwiZXhwIjoyMDc3OTU3NTE1fQ.-1MU8CIYLOoFL5Kj7tOF38tlXqOfSHYvE9uw3Xj5i0c';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log('جاري فحص هيكل جدول pages...\n');
    
    // جلب صفحة واحدة لمعرفة الأعمدة المتاحة
    const { data: page, error } = await supabase
        .from('pages')
        .select('*')
        .limit(1)
        .single();
    
    if (error) {
        console.error('خطأ:', error);
        return;
    }
    
    console.log('الأعمدة المتاحة في جدول pages:');
    console.log(Object.keys(page));
    console.log('\nمثال على البيانات:');
    console.log(JSON.stringify(page, null, 2));
}

checkSchema();
