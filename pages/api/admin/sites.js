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
    // جلب جميع الماركات مع معلومات العائلات
    const { data: brands, error: brandsError } = await supabase
      .from('brands')
      .select(`
        id,
        name,
        slug,
        logo_url,
        created_at,
        brand_families(
          families(name, slug)
        )
      `)
      .order('name');

    if (brandsError) throw brandsError;

    // جلب عدد المنتجات لكل عائلة
    const { data: products } = await supabase
      .from('products')
      .select('id, slug');

    const totalProducts = products?.length || 0;
    const keywordsCount = 6; // عدد الكلمات البحثية

    // حساب عدد الصفحات المتوقعة لكل ماركة
    const sitesData = await Promise.all(brands.map(async (brand) => {
      // عدد العائلات المرتبطة بالماركة
      const familiesCount = brand.brand_families?.length || 0;
      
      // عدد الصفحات المتوقعة = عدد المنتجات × عدد الكلمات البحثية
      const expectedPages = totalProducts * keywordsCount;

      // جلب عدد الصفحات المولدة لهذه الماركة
      const { count: generatedPages } = await supabase
        .from('page_content')
        .select('*', { count: 'exact', head: true })
        .eq('brand_id', brand.id);

      // حساب نسبة الإنجاز
      const progress = expectedPages > 0 
        ? ((generatedPages || 0) / expectedPages * 100).toFixed(2)
        : 0;

      return {
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        subdomain: `${brand.slug}.tradeforegypt.com`,
        logoUrl: brand.logo_url,
        familiesCount,
        families: brand.brand_families?.map(bf => bf.families?.name).filter(Boolean) || [],
        expectedPages,
        generatedPages: generatedPages || 0,
        progress: parseFloat(progress),
        status: parseFloat(progress) === 100 ? 'complete' : parseFloat(progress) > 0 ? 'in-progress' : 'pending',
        createdAt: brand.created_at
      };
    }));

    // ترتيب حسب نسبة الإنجاز (الأقل أولاً)
    sitesData.sort((a, b) => a.progress - b.progress);

    res.status(200).json({
      sites: sitesData,
      totalSites: sitesData.length,
      completedSites: sitesData.filter(s => s.status === 'complete').length,
      inProgressSites: sitesData.filter(s => s.status === 'in-progress').length,
      pendingSites: sitesData.filter(s => s.status === 'pending').length
    });
  } catch (error) {
    console.error('Error fetching sites:', error);
    res.status(500).json({ error: error.message });
  }
}
