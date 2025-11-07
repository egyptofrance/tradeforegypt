import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // جلب الإحصائيات من general_stats view
    const { data: stats, error: statsError } = await supabase
      .from('general_stats')
      .select('*')
      .single();

    if (statsError) throw statsError;

    // حساب عدد الصفحات المتوقعة
    // عدد الماركات × عدد المنتجات × 6 كلمات بحثية
    const expectedPages = (stats.total_brands || 0) * (stats.total_products || 0) * 6;

    // حساب عدد الصفحات المولدة (من page_content)
    const { count: generatedPages } = await supabase
      .from('page_content')
      .select('*', { count: 'exact', head: true });

    // حساب نسبة الإنجاز
    const progressPercentage = expectedPages > 0 
      ? ((generatedPages || 0) / expectedPages * 100).toFixed(2)
      : 0;

    // جلب آخر 5 ماركات تم إضافتها
    const { data: recentBrands } = await supabase
      .from('brands')
      .select('id, name, slug, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    // جلب توزيع الماركات حسب العائلات
    const { data: familyDistribution } = await supabase
      .from('brand_families')
      .select('family_id, families(name)')
      .order('family_id');

    // تجميع البيانات
    const familyCounts = {};
    familyDistribution?.forEach(item => {
      const familyName = item.families?.name || 'Unknown';
      familyCounts[familyName] = (familyCounts[familyName] || 0) + 1;
    });

    const response = {
      stats: {
        totalFamilies: stats.total_families || 0,
        totalBrands: stats.total_brands || 0,
        totalProducts: stats.total_products || 0,
        totalRelations: stats.total_relations || 0,
        generatedPages: generatedPages || 0,
        expectedPages: expectedPages,
        progressPercentage: parseFloat(progressPercentage)
      },
      recentBrands: recentBrands || [],
      familyDistribution: Object.entries(familyCounts).map(([name, count]) => ({
        name,
        count
      }))
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: error.message });
  }
}
