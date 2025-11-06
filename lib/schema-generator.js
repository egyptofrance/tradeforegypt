// ============================================
// Trade for Egypt - Schema Markup Generator
// ============================================
// توليد Schema.org JSON-LD للنجوم الصفراء والسيو
// ============================================

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://tradeforegypt.com';

// ترجمة الكلمات المفتاحية
const KEYWORD_TRANSLATIONS = {
  'agency': 'توكيل',
  'customer-service': 'خدمة عملاء',
  'hotline': 'خط ساخن',
  'maintenance': 'صيانة',
  'numbers': 'أرقام',
  'warranty': 'ضمان'
};

/**
 * توليد Organization Schema
 * @param {Object} brand - بيانات الماركة
 * @returns {Object} - Schema JSON-LD
 */
export function generateOrganizationSchema(brand) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const logoUrl = brand.logo_url || `${supabaseUrl}/storage/v1/object/public/defaults/default-logo.png`;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': brand.name,
    'url': `${BASE_URL}/${brand.slug}`,
    'logo': logoUrl,
    'description': brand.description || `${brand.name} - دليل شامل لجميع المنتجات والخدمات في مصر`,
    'address': {
      '@type': 'PostalAddress',
      'addressCountry': 'EG',
      'addressLocality': 'القاهرة'
    },
    'contactPoint': {
      '@type': 'ContactPoint',
      'contactType': 'customer service',
      'availableLanguage': ['ar', 'en']
    }
  };
}

/**
 * توليد Product Schema (مع التقييمات للنجوم الصفراء)
 * @param {Object} brand - بيانات الماركة
 * @param {Object} product - بيانات المنتج
 * @param {Object} rating - بيانات التقييم
 * @returns {Object} - Schema JSON-LD
 */
export function generateProductSchema(brand, product, rating = null) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const imageUrl = product.photo_1 || `${supabaseUrl}/storage/v1/object/public/defaults/default-product.jpg`;
  
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': `${brand.name} ${product.name}`,
    'brand': {
      '@type': 'Brand',
      'name': brand.name
    },
    'image': imageUrl,
    'description': product.description || `${brand.name} ${product.name} - دليل شامل للمنتج مع معلومات التواصل والصيانة`,
    'offers': {
      '@type': 'Offer',
      'availability': 'https://schema.org/InStock',
      'priceCurrency': 'EGP'
    }
  };
  
  // إضافة التقييمات (النجوم الصفراء)
  if (rating && rating.rating_value && rating.rating_count > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      'ratingValue': rating.rating_value.toString(),
      'reviewCount': rating.rating_count.toString(),
      'bestRating': '5',
      'worstRating': '1'
    };
  }
  
  return schema;
}

/**
 * توليد LocalBusiness Schema
 * @param {Object} brand - بيانات الماركة
 * @param {Object} product - بيانات المنتج
 * @param {string} keyword - الكلمة المفتاحية
 * @returns {Object} - Schema JSON-LD
 */
export function generateLocalBusinessSchema(brand, product, keyword) {
  const keywordAr = KEYWORD_TRANSLATIONS[keyword] || keyword;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const logoUrl = brand.logo_url || `${supabaseUrl}/storage/v1/object/public/defaults/default-logo.png`;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': `${keywordAr} ${brand.name} ${product.name}`,
    'image': logoUrl,
    'url': `${BASE_URL}/${brand.slug}/${product.slug}/${keyword}`,
    'telephone': '+20-XXX-XXX-XXXX',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'العنوان',
      'addressLocality': 'القاهرة',
      'addressRegion': 'القاهرة',
      'postalCode': '11511',
      'addressCountry': 'EG'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 30.0444,
      'longitude': 31.2357
    },
    'openingHoursSpecification': {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
      'opens': '09:00',
      'closes': '18:00'
    },
    'priceRange': '$$'
  };
}

/**
 * توليد BreadcrumbList Schema
 * @param {Object} brand - بيانات الماركة
 * @param {Object} product - بيانات المنتج
 * @param {string} keyword - الكلمة المفتاحية
 * @returns {Object} - Schema JSON-LD
 */
export function generateBreadcrumbSchema(brand, product, keyword) {
  const keywordAr = KEYWORD_TRANSLATIONS[keyword] || keyword;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'الرئيسية',
        'item': BASE_URL
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': brand.name,
        'item': `${BASE_URL}/${brand.slug}`
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': product.name,
        'item': `${BASE_URL}/${brand.slug}/${product.slug}`
      },
      {
        '@type': 'ListItem',
        'position': 4,
        'name': keywordAr,
        'item': `${BASE_URL}/${brand.slug}/${product.slug}/${keyword}`
      }
    ]
  };
}

/**
 * توليد WebPage Schema
 * @param {Object} brand - بيانات الماركة
 * @param {Object} product - بيانات المنتج
 * @param {string} keyword - الكلمة المفتاحية
 * @param {string} title - عنوان الصفحة
 * @param {string} description - وصف الصفحة
 * @returns {Object} - Schema JSON-LD
 */
export function generateWebPageSchema(brand, product, keyword, title, description) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': title,
    'description': description,
    'url': `${BASE_URL}/${brand.slug}/${product.slug}/${keyword}`,
    'inLanguage': 'ar',
    'isPartOf': {
      '@type': 'WebSite',
      'name': 'Trade for Egypt',
      'url': BASE_URL
    },
    'about': {
      '@type': 'Thing',
      'name': `${brand.name} ${product.name}`
    },
    'mainEntity': {
      '@type': 'Service',
      'name': `${KEYWORD_TRANSLATIONS[keyword]} ${brand.name} ${product.name}`,
      'provider': {
        '@type': 'Organization',
        'name': brand.name
      }
    }
  };
}

/**
 * توليد FAQPage Schema (اختياري)
 * @param {Object} brand - بيانات الماركة
 * @param {Object} product - بيانات المنتج
 * @param {string} keyword - الكلمة المفتاحية
 * @returns {Object} - Schema JSON-LD
 */
export function generateFAQSchema(brand, product, keyword) {
  const keywordAr = KEYWORD_TRANSLATIONS[keyword] || keyword;
  
  const faqs = {
    'agency': [
      {
        question: `ما هو عنوان توكيل ${brand.name} ${product.name}؟`,
        answer: `يمكنك العثور على عنوان توكيل ${brand.name} ${product.name} في هذه الصفحة مع جميع معلومات التواصل.`
      },
      {
        question: `كيف أتواصل مع توكيل ${brand.name}؟`,
        answer: `يمكنك التواصل مع توكيل ${brand.name} عبر الأرقام والعناوين المتوفرة في هذه الصفحة.`
      }
    ],
    'maintenance': [
      {
        question: `أين أجد مركز صيانة ${brand.name} ${product.name}؟`,
        answer: `مراكز صيانة ${brand.name} ${product.name} متوفرة في جميع أنحاء مصر. تجد العناوين والأرقام في هذه الصفحة.`
      },
      {
        question: `هل صيانة ${brand.name} معتمدة؟`,
        answer: `نعم، جميع مراكز الصيانة المذكورة هنا معتمدة من ${brand.name}.`
      }
    ],
    'warranty': [
      {
        question: `ما هي مدة ضمان ${brand.name} ${product.name}؟`,
        answer: `مدة الضمان تختلف حسب المنتج. يرجى التواصل مع التوكيل للحصول على التفاصيل.`
      },
      {
        question: `هل يشمل الضمان الصيانة المجانية؟`,
        answer: `نعم، الضمان يشمل الصيانة المجانية للأعطال المشمولة.`
      }
    ]
  };
  
  const selectedFAQs = faqs[keyword] || faqs['agency'];
  
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': selectedFAQs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };
}

/**
 * توليد جميع Schemas دفعة واحدة
 * @param {Object} brand - بيانات الماركة
 * @param {Object} product - بيانات المنتج
 * @param {string} keyword - الكلمة المفتاحية
 * @param {Object} rating - بيانات التقييم
 * @param {string} title - عنوان الصفحة
 * @param {string} description - وصف الصفحة
 * @returns {Array} - مصفوفة من Schemas
 */
export function generateAllSchemas(brand, product, keyword, rating, title, description) {
  return [
    generateOrganizationSchema(brand),
    generateProductSchema(brand, product, rating),
    generateLocalBusinessSchema(brand, product, keyword),
    generateBreadcrumbSchema(brand, product, keyword),
    generateWebPageSchema(brand, product, keyword, title, description),
    // generateFAQSchema(brand, product, keyword) // اختياري
  ];
}
