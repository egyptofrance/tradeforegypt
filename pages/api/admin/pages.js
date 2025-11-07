import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { brandSlug } = req.query;

  if (!brandSlug) {
    return res.status(400).json({ error: 'Brand slug is required' });
  }

  try {
    // جلب معلومات الماركة
    const { data: brand, error: brandError } = await supabase
      .from('brands')
      .select('id, name, slug, logo_url')
      .eq('slug', brandSlug)
      .single();

    if (brandError || !brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    // جلب جميع المنتجات
    const { data: products } = await supabase
      .from('products')
      .select('id, name, slug')
      .order('name');

    // الكلمات البحثية
    const keywords = [
      { slug: 'agency', nameAr: 'توكيل' },
      { slug: 'maintenance', nameAr: 'صيانة' },
      { slug: 'guarantee', nameAr: 'ضمان' },
      { slug: 'hotline', nameAr: 'خط ساخن' },
      { slug: 'numbers', nameAr: 'أرقام' },
      { slug: 'customer-service', nameAr: 'خدمة عملاء' }
    ];

    // توليد قائمة جميع الصفحات المتوقعة
    const allPages = [];
    products?.forEach(product => {
      keywords.forEach(keyword => {
        allPages.push({
          brand: brand.slug,
          brandName: brand.name,
          product: product.slug,
          productName: product.name,
          keyword: keyword.slug,
          keywordAr: keyword.nameAr,
          path: `/${brand.slug}/${product.slug}/${keyword.slug}`,
          url: `https://${brand.slug}.tradeforegypt.com/${product.slug}/${keyword.slug}`,
          productId: product.id,
          brandId: brand.id
        });
      });
    });

    // جلب الصفحات المولدة من page_content
    const { data: generatedContent } = await supabase
      .from('page_content')
      .select('brand_id, product_id, keyword')
      .eq('brand_id', brand.id);

    // تحديد حالة كل صفحة
    const pagesWithStatus = allPages.map(page => {
      const isGenerated = generatedContent?.some(
        gc => gc.product_id === page.productId && gc.keyword === page.keyword
      );

      return {
        ...page,
        status: isGenerated ? 'generated' : 'pending',
        statusAr: isGenerated ? 'مولدة' : 'قيد الانتظار'
      };
    });

    // حساب الإحصائيات
    const totalPages = pagesWithStatus.length;
    const generatedPages = pagesWithStatus.filter(p => p.status === 'generated').length;
    const pendingPages = totalPages - generatedPages;
    const progress = totalPages > 0 ? ((generatedPages / totalPages) * 100).toFixed(2) : 0;

    res.status(200).json({
      brand: {
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        logoUrl: brand.logo_url,
        subdomain: `${brand.slug}.tradeforegypt.com`
      },
      pages: pagesWithStatus,
      stats: {
        totalPages,
        generatedPages,
        pendingPages,
        progress: parseFloat(progress)
      }
    });
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ error: error.message });
  }
}
