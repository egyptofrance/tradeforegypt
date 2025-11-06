import Head from 'next/head';
import Image from 'next/image';
import { getBrandBySlug, getProductBySlug, getFamilyById, getRating, checkBrandProductRelation } from '@/lib/supabase';
import { generateAllSEO } from '@/lib/seo-generator';
import { generateAllSchemas } from '@/lib/schema-generator';
import { generatePageContent } from '@/lib/content-generator';
import { calculatePrevNext, resolvePrevNextLink } from '@/lib/navigation-helper';
import { getBrandLogo, getBrandBanner, getProductImages, getImageAltText } from '@/lib/image-handler';
import SchemaMarkup from '@/components/SchemaMarkup';
import Breadcrumb from '@/components/Breadcrumb';
import PrevNextLinks from '@/components/PrevNextLinks';

// الكلمات المفتاحية المسموحة
const ALLOWED_KEYWORDS = ['agency', 'customer-service', 'hotline', 'maintenance', 'numbers', 'warranty'];

// ترجمة الكلمات المفتاحية
const KEYWORD_TRANSLATIONS = {
  'agency': 'توكيل',
  'customer-service': 'خدمة عملاء',
  'hotline': 'خط ساخن',
  'maintenance': 'صيانة',
  'numbers': 'أرقام',
  'warranty': 'ضمان'
};

export default function ProductPage({ brand, product, family, keyword, seo, schemas, content, prevNext, images, rating }) {
  const keywordAr = KEYWORD_TRANSLATIONS[keyword] || keyword;
  
  // دالة لتمييز الكلمة البحثية في النص
  const highlightKeyword = (text) => {
    if (!text) return '';
    
    const keywords = [
      keywordAr,
      brand.name,
      product.name,
      `${keywordAr} ${brand.name}`,
      `${brand.name} ${product.name}`,
      `${keywordAr} ${brand.name} ${product.name}`
    ];
    
    let highlightedText = text;
    
    keywords.forEach((kw, index) => {
      const regex = new RegExp(`(${kw})`, 'gi');
      const styles = [
        'font-weight: bold; color: #0066cc;',
        'font-weight: bold; font-style: italic;',
        'font-weight: bold; text-decoration: underline;',
        'font-weight: bold; color: #cc6600;'
      ];
      const style = styles[index % styles.length];
      highlightedText = highlightedText.replace(regex, `<span style="${style}">$1</span>`);
    });
    
    return highlightedText;
  };
  
  return (
    <>
      {/* SEO Head */}
      <Head>
        <title>{seo.title}</title>
        <meta name="description" content={seo.metaDescription} />
        <meta name="keywords" content={seo.keywords} />
        <link rel="canonical" href={seo.canonicalUrl} />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seo.ogTitle} />
        <meta property="og:description" content={seo.ogDescription} />
        <meta property="og:url" content={seo.canonicalUrl} />
        <meta property="og:image" content={seo.ogImage} />
        <meta property="og:locale" content="ar_EG" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo.ogTitle} />
        <meta name="twitter:description" content={seo.ogDescription} />
        <meta name="twitter:image" content={seo.ogImage} />
        
        {/* Additional */}
        <meta name="robots" content="index, follow" />
        <meta name="language" content="Arabic" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      
      {/* Schema Markup */}
      <SchemaMarkup schemas={schemas} />
      
      {/* Main Content */}
      <div className="page-container">
        {/* Header */}
        <header className="page-header">
          <div className="brand-logo">
            <Image 
              src={images.logo} 
              alt={getImageAltText(brand, null, 'logo')}
              width={120}
              height={120}
              priority
            />
          </div>
          <div className="brand-info">
            <h1 className="main-title" dangerouslySetInnerHTML={{ __html: highlightKeyword(seo.h1) }} />
            {rating && rating.rating_value && (
              <div className="rating">
                <span className="stars">{'⭐'.repeat(Math.round(rating.rating_value))}</span>
                <span className="rating-text">{rating.rating_value} ({rating.rating_count} تقييم)</span>
              </div>
            )}
          </div>
        </header>
        
        {/* Breadcrumb */}
        <Breadcrumb brand={brand} product={product} keyword={keyword} />
        
        {/* Banner Image */}
        <div className="banner-image">
          <Image 
            src={images.banner} 
            alt={getImageAltText(brand, product, 'banner')}
            width={1200}
            height={400}
            priority
          />
        </div>
        
        {/* Main Content */}
        <main className="main-content">
          {/* Introduction */}
          <section className="content-section intro-section">
            <div dangerouslySetInnerHTML={{ __html: highlightKeyword(content.intro) }} />
          </section>
          
          {/* Product Images Gallery */}
          <section className="product-images">
            <h2 dangerouslySetInnerHTML={{ __html: highlightKeyword(`صور ${brand.name} ${product.name}`) }} />
            <div className="images-grid">
              {images.productImages.map((img, index) => (
                <div key={index} className="image-item">
                  <Image 
                    src={img} 
                    alt={`${brand.name} ${product.name} - صورة ${index + 1}`}
                    width={400}
                    height={400}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </section>
          
          {/* About Brand */}
          <section className="content-section brand-section">
            <h2 dangerouslySetInnerHTML={{ __html: highlightKeyword(`عن ${brand.name}`) }} />
            <div dangerouslySetInnerHTML={{ __html: highlightKeyword(content.brandSection) }} />
          </section>
          
          {/* Services */}
          <section className="content-section services-section">
            <h2 dangerouslySetInnerHTML={{ __html: highlightKeyword(`خدمات ${keywordAr} ${brand.name} ${product.name}`) }} />
            <div dangerouslySetInnerHTML={{ __html: highlightKeyword(content.servicesSection) }} />
          </section>
          
          {/* Contact Information */}
          <section className="content-section contact-section">
            <h3 dangerouslySetInnerHTML={{ __html: highlightKeyword(`معلومات التواصل مع ${keywordAr} ${brand.name}`) }} />
            <div className="contact-info">
              <div className="contact-item">
                <h4>📞 الهاتف</h4>
                <p>للتواصل مع <strong className="keyword">{keywordAr} {brand.name}</strong>، يرجى الاتصال على الأرقام المتوفرة في الموقع الرسمي.</p>
              </div>
              <div className="contact-item">
                <h4>📍 العنوان</h4>
                <p>يمكنك زيارة <strong className="keyword">{keywordAr} {brand.name}</strong> في الفروع المنتشرة في جميع أنحاء مصر.</p>
              </div>
              <div className="contact-item">
                <h4>🕐 مواعيد العمل</h4>
                <p><strong className="keyword">{keywordAr} {brand.name}</strong> يعمل من السبت إلى الخميس من 9 صباحاً حتى 6 مساءً.</p>
              </div>
            </div>
          </section>
          
          {/* FAQ Section */}
          <section className="content-section faq-section">
            <h3 dangerouslySetInnerHTML={{ __html: highlightKeyword(`أسئلة شائعة عن ${keywordAr} ${brand.name} ${product.name}`) }} />
            <div className="faq-list">
              <div className="faq-item">
                <h4 className="faq-question" dangerouslySetInnerHTML={{ __html: highlightKeyword(`ما هو عنوان ${keywordAr} ${brand.name} ${product.name}؟`) }} />
                <p className="faq-answer">يمكنك العثور على عنوان <strong className="keyword">{keywordAr} {brand.name} {product.name}</strong> في هذه الصفحة مع جميع معلومات التواصل.</p>
              </div>
              <div className="faq-item">
                <h4 className="faq-question" dangerouslySetInnerHTML={{ __html: highlightKeyword(`كيف أتواصل مع ${keywordAr} ${brand.name}؟`) }} />
                <p className="faq-answer">يمكنك التواصل مع <strong className="keyword">{keywordAr} {brand.name}</strong> عبر الأرقام والعناوين المتوفرة في هذه الصفحة.</p>
              </div>
              <div className="faq-item">
                <h4 className="faq-question" dangerouslySetInnerHTML={{ __html: highlightKeyword(`هل ${keywordAr} ${brand.name} معتمد؟`) }} />
                <p className="faq-answer">نعم، جميع معلومات <strong className="keyword">{keywordAr} {brand.name}</strong> المذكورة هنا معتمدة ومحدثة.</p>
              </div>
            </div>
          </section>
          
          {/* Related Keywords */}
          <section className="content-section related-keywords">
            <h4>كلمات بحثية ذات صلة:</h4>
            <div className="keywords-list">
              <span className="keyword-tag">{keywordAr} {brand.name}</span>
              <span className="keyword-tag">{brand.name} {product.name}</span>
              <span className="keyword-tag">رقم {brand.name}</span>
              <span className="keyword-tag">عنوان {brand.name}</span>
              <span className="keyword-tag">{keywordAr} {brand.name} {product.name}</span>
              <span className="keyword-tag">{brand.name} مصر</span>
              <span className="keyword-tag">{product.name} {brand.name}</span>
              <span className="keyword-tag">{family.name} {brand.name}</span>
            </div>
          </section>
          
          {/* Conclusion */}
          <section className="content-section conclusion-section">
            <div dangerouslySetInnerHTML={{ __html: highlightKeyword(content.conclusion) }} />
          </section>
        </main>
        
        {/* Previous/Next Links */}
        <PrevNextLinks prev={prevNext.prev} next={prevNext.next} />
        
        {/* Footer */}
        <footer className="page-footer">
          <p>آخر تحديث: {new Date().toLocaleDateString('ar-EG')}</p>
          <p>جميع المعلومات محدثة ومعتمدة من <strong>{brand.name}</strong></p>
        </footer>
      </div>
      
      {/* Styles */}
      <style jsx>{`
        .page-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: 'Cairo', 'Segoe UI', Tahoma, sans-serif;
          direction: rtl;
          line-height: 1.8;
        }
        
        .page-header {
          display: flex;
          align-items: center;
          gap: 2rem;
          margin-bottom: 2rem;
          padding: 2rem;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          border-radius: 12px;
        }
        
        .brand-logo {
          flex-shrink: 0;
        }
        
        .main-title {
          font-size: 2.5rem;
          color: #1a1a1a;
          margin: 0 0 1rem 0;
          font-weight: 700;
        }
        
        .rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.1rem;
        }
        
        .stars {
          color: #ffc107;
          font-size: 1.3rem;
        }
        
        .banner-image {
          width: 100%;
          height: 400px;
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          margin: 2rem 0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .banner-image img {
          object-fit: cover;
        }
        
        .main-content {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        
        .content-section {
          margin-bottom: 3rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .content-section:last-child {
          border-bottom: none;
        }
        
        .content-section h2 {
          font-size: 2rem;
          color: #0066cc;
          margin: 0 0 1.5rem 0;
          font-weight: 600;
        }
        
        .content-section h3 {
          font-size: 1.6rem;
          color: #cc6600;
          margin: 0 0 1rem 0;
          font-weight: 600;
        }
        
        .content-section h4 {
          font-size: 1.3rem;
          color: #333;
          margin: 0 0 0.8rem 0;
          font-weight: 600;
        }
        
        .content-section p {
          font-size: 1.1rem;
          color: #444;
          line-height: 2;
          margin-bottom: 1rem;
        }
        
        .keyword {
          font-weight: bold;
          color: #0066cc;
        }
        
        .product-images {
          margin: 3rem 0;
        }
        
        .images-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-top: 1.5rem;
        }
        
        .image-item {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: transform 0.3s;
        }
        
        .image-item:hover {
          transform: scale(1.05);
        }
        
        .contact-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 1.5rem;
        }
        
        .contact-item {
          padding: 1.5rem;
          background: #f8f9fa;
          border-radius: 8px;
          border-right: 4px solid #0066cc;
        }
        
        .faq-list {
          margin-top: 1.5rem;
        }
        
        .faq-item {
          margin-bottom: 1.5rem;
          padding: 1.5rem;
          background: #f8f9fa;
          border-radius: 8px;
        }
        
        .faq-question {
          color: #0066cc;
          margin-bottom: 0.8rem;
        }
        
        .faq-answer {
          color: #555;
        }
        
        .related-keywords {
          background: #f0f8ff;
          padding: 2rem;
          border-radius: 8px;
        }
        
        .keywords-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.8rem;
          margin-top: 1rem;
        }
        
        .keyword-tag {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: white;
          border: 2px solid #0066cc;
          border-radius: 20px;
          color: #0066cc;
          font-weight: 600;
          font-size: 0.95rem;
        }
        
        .page-footer {
          margin-top: 3rem;
          padding: 2rem;
          text-align: center;
          background: #f5f5f5;
          border-radius: 8px;
          color: #666;
        }
        
        @media (max-width: 768px) {
          .page-container {
            padding: 1rem;
          }
          
          .page-header {
            flex-direction: column;
            text-align: center;
          }
          
          .main-title {
            font-size: 1.8rem;
          }
          
          .banner-image {
            height: 250px;
          }
          
          .images-grid {
            grid-template-columns: 1fr;
          }
          
          .contact-info {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}

export async function getStaticProps({ params }) {
  try {
    const { brand: brandSlug, product: productSlug, keyword } = params;
    
    // التحقق من الكلمة المفتاحية
    if (!ALLOWED_KEYWORDS.includes(keyword)) {
      return { notFound: true };
    }
    
    // 1. جلب البيانات
    const brand = await getBrandBySlug(brandSlug);
    const product = await getProductBySlug(productSlug);
    
    if (!brand || !product) {
      return { notFound: true };
    }
    
    // التحقق من العلاقة بين الماركة والمنتج
    const isValid = await checkBrandProductRelation(brand.id, product.id);
    if (!isValid) {
      return { notFound: true };
    }
    
    const family = await getFamilyById(product.family_id);
    const rating = await getRating(brand.id, product.id);
    
    // 2. توليد السيو
    const seo = generateAllSEO(brand, product, keyword);
    
    // 3. توليد Schema Markup
    const schemas = generateAllSchemas(brand, product, keyword, rating, seo.title, seo.metaDescription);
    
    // 4. توليد المحتوى
    const content = generatePageContent(brand, product, keyword, family);
    
    // 5. حساب Previous/Next
    let prevNext = await calculatePrevNext(brand, product, keyword);
    
    // حل Previous/Next إذا كان يحتاج لجلب منتجات
    if (prevNext.prev && prevNext.prev.needsProductFetch) {
      prevNext.prev = await resolvePrevNextLink(prevNext.prev);
    }
    if (prevNext.next && prevNext.next.needsProductFetch) {
      prevNext.next = await resolvePrevNextLink(prevNext.next);
    }
    
    // 6. جلب الصور
    const images = {
      logo: getBrandLogo(brand),
      banner: getBrandBanner(brand),
      productImages: getProductImages(product)
    };
    
    return {
      props: {
        brand,
        product,
        family,
        keyword,
        seo,
        schemas,
        content,
        prevNext,
        images,
        rating
      },
      revalidate: 3600 // ساعة واحدة
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return { notFound: true };
  }
}

export async function getStaticPaths() {
  // في البداية، لا نبني أي صفحات
  // الصفحات تُبنى on-demand عند الزيارة الأولى
  return {
    paths: [],
    fallback: 'blocking'
  };
}
