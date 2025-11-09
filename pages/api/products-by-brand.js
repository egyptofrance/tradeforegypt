import { supabase } from '@/lib/supabase';

export default async function handler(req, res) {
  // التحقق من الطريقة
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { brandId } = req.query;

  // التحقق من brandId
  if (!brandId) {
    return res.status(400).json({ message: 'brandId is required' });
  }

  try {
    // جلب المنتجات المرتبطة بالماركة عبر brand_families
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id,
        name,
        slug,
        family_id,
        families!inner (
          id,
          name,
          brand_families!inner (
            brand_id
          )
        )
      `)
      .eq('families.brand_families.brand_id', brandId)
      .order('name', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        message: 'Failed to fetch products',
        error: error.message 
      });
    }

    // إزالة التكرار (نفس المنتج قد يظهر أكثر من مرة)
    const uniqueProducts = products.filter((product, index, self) =>
      index === self.findIndex((p) => p.id === product.id)
    );

    // تنظيف البيانات
    const cleanedProducts = uniqueProducts.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      family_id: product.family_id
    }));

    return res.status(200).json({
      success: true,
      count: cleanedProducts.length,
      products: cleanedProducts
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
}
