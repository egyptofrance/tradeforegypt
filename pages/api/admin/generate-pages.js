import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// الكلمات المفتاحية الـ 6
const KEYWORDS = [
  { slug: 'agency', name_ar: 'توكيل', name_en: 'Agency' },
  { slug: 'maintenance', name_ar: 'صيانة', name_en: 'Maintenance' },
  { slug: 'warranty', name_ar: 'ضمان', name_en: 'Warranty' },
  { slug: 'customer-service', name_ar: 'خدمة عملاء', name_en: 'Customer Service' },
  { slug: 'hotline', name_ar: 'خط ساخن', name_en: 'Hotline' },
  { slug: 'numbers', name_ar: 'أرقام', name_en: 'Numbers' }
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { familyId, limit = 100 } = req.body;

    // جلب العائلات
    let familiesQuery = supabase.from('families').select('*');
    if (familyId) {
      familiesQuery = familiesQuery.eq('id', familyId);
    }
    const { data: families, error: familiesError } = await familiesQuery;
    
    if (familiesError) {
      throw new Error('فشل في جلب العائلات: ' + familiesError.message);
    }

    let totalGenerated = 0;
    let totalSkipped = 0;
    const results = [];

    for (const family of families) {
      // جلب المنتجات للعائلة
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('family_id', family.id)
        .limit(50);

      if (!products || products.length === 0) continue;

      // جلب الماركات المرتبطة بالعائلة
      const { data: brandFamilies } = await supabase
        .from('brand_families')
        .select('brand_id, brands(id, name, slug)')
        .eq('family_id', family.id);

      if (!brandFamilies || brandFamilies.length === 0) continue;

      const brands = brandFamilies.map(bf => bf.brands).filter(Boolean);

      // توليد الصفحات
      let familyGenerated = 0;
      let familySkipped = 0;

      for (const brand of brands) {
        for (const product of products) {
          for (const keyword of KEYWORDS) {
            // التحقق من وجود الصفحة
            const { data: existing } = await supabase
              .from('page_content')
              .select('id')
              .eq('brand_id', brand.id)
              .eq('product_id', product.id)
              .eq('keyword', keyword.slug)
              .single();

            if (existing) {
              familySkipped++;
              totalSkipped++;
              continue;
            }

            // توليد المحتوى
            const content = generatePageContent(brand, product, keyword, family);

            // حفظ الصفحة
            const { error: insertError } = await supabase
              .from('page_content')
              .insert([{
                brand_id: brand.id,
                product_id: product.id,
                keyword: keyword.slug,
                title: content.title,
                meta_description: content.metaDescription,
                content: content.content,
                h1: content.h1,
                h2_sections: content.h2Sections
              }]);

            if (!insertError) {
              familyGenerated++;
              totalGenerated++;
            }

            // حد أقصى للصفحات المولدة في request واحد
            if (totalGenerated >= limit) {
              break;
            }
          }
          if (totalGenerated >= limit) break;
        }
        if (totalGenerated >= limit) break;
      }

      results.push({
        family: family.name,
        generated: familyGenerated,
        skipped: familySkipped
      });

      if (totalGenerated >= limit) break;
    }

    res.status(200).json({
      success: true,
      message: `تم توليد ${totalGenerated} صفحة بنجاح`,
      totalGenerated,
      totalSkipped,
      results
    });

  } catch (error) {
    console.error('Error generating pages:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
}

function generatePageContent(brand, product, keyword, family) {
  const brandName = brand.name;
  const productName = product.name;
  const keywordAr = keyword.name_ar;
  const keywordEn = keyword.name_en;

  // العنوان الرئيسي
  const title = `${keywordAr} ${brandName} ${productName} - أفضل خدمة في مصر`;
  
  // الوصف التعريفي
  const metaDescription = `احصل على ${keywordAr} ${brandName} ${productName} من خلال مركز الخدمة المعتمد. خدمة عملاء متميزة، قطع غيار أصلية، وضمان شامل.`;

  // H1
  const h1 = `${keywordAr} ${brandName} ${productName}`;

  // المحتوى
  const content = `
<div class="page-content">
  <section class="intro">
    <p>نوفر لك أفضل خدمة ${keywordAr} لـ ${brandName} ${productName} في مصر. نحن المركز المعتمد الذي يضمن لك جودة الخدمة وسرعة الاستجابة.</p>
  </section>

  <section class="features">
    <h2>لماذا تختار ${keywordAr} ${brandName}؟</h2>
    <ul>
      <li>فريق فني متخصص ومدرب على أعلى مستوى</li>
      <li>قطع غيار أصلية 100%</li>
      <li>ضمان شامل على جميع الخدمات</li>
      <li>خدمة عملاء متاحة 24/7</li>
      <li>أسعار تنافسية وعروض مستمرة</li>
    </ul>
  </section>

  <section class="services">
    <h2>خدماتنا</h2>
    <p>نقدم مجموعة شاملة من الخدمات لـ ${brandName} ${productName}:</p>
    <ul>
      <li>الصيانة الدورية والوقائية</li>
      <li>الإصلاح الفوري للأعطال</li>
      <li>استبدال قطع الغيار</li>
      <li>الدعم الفني والاستشارات</li>
      <li>خدمة ما بعد البيع</li>
    </ul>
  </section>

  <section class="contact">
    <h2>تواصل معنا</h2>
    <p>للحصول على ${keywordAr} ${brandName} ${productName}، تواصل معنا الآن:</p>
    <ul>
      <li>الخط الساخن: 19XXX</li>
      <li>خدمة العملاء: متاحة على مدار الساعة</li>
      <li>الزيارة المنزلية: متوفرة في جميع المحافظات</li>
    </ul>
  </section>
</div>
  `.trim();

  // أقسام H2
  const h2Sections = [
    `لماذا تختار ${keywordAr} ${brandName}؟`,
    'خدماتنا',
    'تواصل معنا'
  ];

  return {
    title,
    metaDescription,
    h1,
    content,
    h2Sections
  };
}
