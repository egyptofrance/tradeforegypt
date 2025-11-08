import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
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
      
      <Layout>
        {/* Banner Section */}
        <section className="section banner-service bg-grey-60 position-relative">
          <div className="box-banner-abs">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-xxl-8 col-xl-9 col-lg-12">
                  <div className="box-banner-service">
                    {/* Breadcrumb */}
                    <Breadcrumb brand={brand} product={product} keyword={keyword} />
                    
                    {/* Main Title */}
                    <h1 className="color-brand-1 mb-20 mt-20">
                      {keywordAr} {brand.name_ar || brand.name} {product.name}
                    </h1>
                    
                    {/* Rating */}
                    {rating && rating.rating_value && (
                      <div className="rating mb-20">
                        <span className="stars">{'⭐'.repeat(Math.round(rating.rating_value))}</span>
                        <span className="rating-text ms-2">{rating.rating_value} ({rating.rating_count} تقييم)</span>
                      </div>
                    )}
                    
                    {/* Description */}
                    <div className="row">
                      <div className="col-lg-10">
                        <p className="font-md color-grey-500" dangerouslySetInnerHTML={{ __html: content.intro }} />
                      </div>
                    </div>
                    
                    {/* Buttons */}
                    <div className="box-button mt-30">
                      <Link href={`/${brand.slug}`} className="btn btn-brand-1 hover-up">
                        عرض جميع منتجات {brand.name_ar || brand.name}
                        <svg className="w-6 h-6 icon-16 ms-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </Link>
                      <Link href={`#contact`} className="btn btn-default ms-2 hover-up">
                        معلومات التواصل
                        <svg className="w-6 h-6 icon-16 ms-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Banner Image */}
          <div className="row m-0">
            <div className="col-xxl-5 col-xl-6 col-lg-6" />
            <div className="col-xxl-7 col-xl-6 col-lg-6 pr-0">
              <div className="d-none d-lg-block ps-5">
                <Image 
                  className="w-100 d-block rounded" 
                  src={images.banner} 
                  alt={getImageAltText(brand, product, 'banner')}
                  width={800}
                  height={500}
                  priority
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* About Brand Section */}
        <section className="section mt-50">
          <div className="container">
            <div className="box-business-rd">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <div className="box-image-rd">
                    <Image 
                      src={images.logo} 
                      alt={getImageAltText(brand, null, 'logo')}
                      width={500}
                      height={500}
                      className="img-responsive"
                    />
                  </div>
                </div>
                <div className="col-lg-6">
                  <span className="btn btn-tag">عن الماركة</span>
                  <h3 className="color-brand-1 mt-10 mb-15">عن {brand.name_ar || brand.name}</h3>
                  <div className="font-md color-grey-400" dangerouslySetInnerHTML={{ __html: content.brandSection }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="section mt-50 bg-grey-60 pt-50 pb-50">
          <div className="container">
            <div className="text-center">
              <h2 className="color-brand-1 mb-20">خدمات {keywordAr} {brand.name_ar || brand.name} {product.name}</h2>
              <p className="font-lg color-gray-500">نقدم لكم أفضل الخدمات والدعم الفني المتكامل</p>
            </div>
            
            <div className="row mt-50">
              <div className="col-lg-10 mx-auto">
                <div className="font-md color-grey-400" dangerouslySetInnerHTML={{ __html: content.servicesSection }} />
              </div>
            </div>
          </div>
        </section>

        {/* Product Images Gallery */}
        <section className="section mt-50">
          <div className="container">
            <div className="text-center mb-40">
              <h2 className="color-brand-1">صور {brand.name_ar || brand.name} {product.name}</h2>
            </div>
            <div className="row">
              {images.productImages.map((img, index) => (
                <div key={index} className="col-lg-4 col-md-6 mb-30">
                  <div className="card-grid-style-2 hover-up">
                    <div className="image-box">
                      <Image 
                        src={img} 
                        alt={`${brand.name} ${product.name} - صورة ${index + 1}`}
                        width={400}
                        height={400}
                        className="img-responsive rounded"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="section mt-50" id="contact">
          <div className="container">
            <div className="box-contact">
              <div className="row align-items-center">
                <div className="col-lg-12">
                  <h3 className="color-brand-1 mb-15 text-center">معلومات التواصل مع {keywordAr} {brand.name_ar || brand.name}</h3>
                </div>
              </div>
              <div className="row mt-40">
                <div className="col-lg-4 col-md-6 mb-30">
                  <div className="card-grid-style-3 hover-up">
                    <div className="grid-3-img">
                      <div className="icon-contact">
                        <svg className="w-6 h-6 icon-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                    </div>
                    <h4 className="color-brand-1 mb-10">📞 الهاتف</h4>
                    <p className="color-grey-500">للتواصل مع {keywordAr} {brand.name_ar || brand.name}، يرجى الاتصال على الأرقام المتوفرة في الموقع الرسمي.</p>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 mb-30">
                  <div className="card-grid-style-3 hover-up">
                    <div className="grid-3-img">
                      <div className="icon-contact">
                        <svg className="w-6 h-6 icon-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                    <h4 className="color-brand-1 mb-10">📍 العنوان</h4>
                    <p className="color-grey-500">يمكنك زيارة {keywordAr} {brand.name_ar || brand.name} في الفروع المنتشرة في جميع أنحاء مصر.</p>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 mb-30">
                  <div className="card-grid-style-3 hover-up">
                    <div className="grid-3-img">
                      <div className="icon-contact">
                        <svg className="w-6 h-6 icon-32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <h4 className="color-brand-1 mb-10">🕐 مواعيد العمل</h4>
                    <p className="color-grey-500">{keywordAr} {brand.name_ar || brand.name} يعمل من السبت إلى الخميس من 9 صباحاً حتى 6 مساءً.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section mt-50 bg-grey-60 pt-50 pb-50">
          <div className="container">
            <div className="text-center mb-40">
              <h3 className="color-brand-1">أسئلة شائعة عن {keywordAr} {brand.name_ar || brand.name} {product.name}</h3>
            </div>
            <div className="row">
              <div className="col-lg-8 mx-auto">
                <div className="accordion" id="faqAccordion">
                  <div className="accordion-item mb-20">
                    <h2 className="accordion-header" id="heading1">
                      <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse1">
                        ما هو عنوان {keywordAr} {brand.name_ar || brand.name} {product.name}؟
                      </button>
                    </h2>
                    <div id="collapse1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                      <div className="accordion-body">
                        يمكنك العثور على عنوان {keywordAr} {brand.name_ar || brand.name} {product.name} في هذه الصفحة مع جميع معلومات التواصل.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item mb-20">
                    <h2 className="accordion-header" id="heading2">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse2">
                        كيف أتواصل مع {keywordAr} {brand.name_ar || brand.name}؟
                      </button>
                    </h2>
                    <div id="collapse2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div className="accordion-body">
                        يمكنك التواصل مع {keywordAr} {brand.name_ar || brand.name} عبر الأرقام والعناوين المتوفرة في هذه الصفحة.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item mb-20">
                    <h2 className="accordion-header" id="heading3">
                      <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse3">
                        هل {keywordAr} {brand.name_ar || brand.name} معتمد؟
                      </button>
                    </h2>
                    <div id="collapse3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                      <div className="accordion-body">
                        نعم، جميع معلومات {keywordAr} {brand.name_ar || brand.name} المذكورة هنا معتمدة ومحدثة.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Keywords */}
        <section className="section mt-50">
          <div className="container">
            <div className="text-center mb-30">
              <h4 className="color-brand-1">كلمات بحثية ذات صلة</h4>
            </div>
            <div className="text-center">
              <Link href={`/${brand.slug}`} className="btn btn-tag me-2 mb-2">{keywordAr} {brand.name_ar || brand.name}</Link>
              <Link href={`/${brand.slug}/${product.slug}`} className="btn btn-tag me-2 mb-2">{brand.name_ar || brand.name} {product.name}</Link>
              <span className="btn btn-tag me-2 mb-2">رقم {brand.name_ar || brand.name}</span>
              <span className="btn btn-tag me-2 mb-2">عنوان {brand.name_ar || brand.name}</span>
              <span className="btn btn-tag me-2 mb-2">{keywordAr} {brand.name_ar || brand.name} {product.name}</span>
              <span className="btn btn-tag me-2 mb-2">{brand.name_ar || brand.name} مصر</span>
              <span className="btn btn-tag me-2 mb-2">{product.name} {brand.name_ar || brand.name}</span>
              <span className="btn btn-tag me-2 mb-2">{family.name} {brand.name_ar || brand.name}</span>
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section className="section mt-50 mb-50">
          <div className="container">
            <div className="row">
              <div className="col-lg-10 mx-auto">
                <div className="font-md color-grey-400 text-center" dangerouslySetInnerHTML={{ __html: content.conclusion }} />
              </div>
            </div>
          </div>
        </section>

        {/* Previous/Next Links */}
        <PrevNextLinks prev={prevNext.prev} next={prevNext.next} />
      </Layout>
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
