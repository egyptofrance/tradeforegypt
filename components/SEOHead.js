import Head from 'next/head';

const SEOHead = ({ page }) => {
    const baseUrl = 'https://tradeforegypt.com';
    const currentUrl = `${baseUrl}/brand/${page.slug}`;
    
    // الأسواق المستهدفة
    const markets = [
        { locale: 'ar-EG', country: 'مصر' },
        { locale: 'ar-SA', country: 'السعودية' },
        { locale: 'ar-AE', country: 'الإمارات' },
        { locale: 'fr-FR', country: 'فرنسا' },
        { locale: 'en-GB', country: 'بريطانيا' },
        { locale: 'en-US', country: 'أمريكا' }
    ];
    
    return (
        <Head>
            {/* Basic Meta Tags */}
            <title>{page.seo_meta_title || page.page_title}</title>
            <meta name="description" content={page.seo_meta_description} />
            <meta name="keywords" content={page.target_keyword} />
            
            {/* Canonical URL */}
            <link rel="canonical" href={page.canonical_url || currentUrl} />
            
            {/* hreflang Tags for International Targeting */}
            {markets.map((market) => (
                <link
                    key={market.locale}
                    rel="alternate"
                    hrefLang={market.locale}
                    href={`${currentUrl}?market=${market.locale}`}
                />
            ))}
            
            {/* Default hreflang */}
            <link rel="alternate" hrefLang="x-default" href={currentUrl} />
            
            {/* Open Graph Tags */}
            <meta property="og:title" content={page.seo_meta_title || page.page_title} />
            <meta property="og:description" content={page.seo_meta_description} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:type" content="website" />
            <meta property="og:locale" content="ar_EG" />
            
            {/* Twitter Card Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={page.seo_meta_title || page.page_title} />
            <meta name="twitter:description" content={page.seo_meta_description} />
            
            {/* Robots Meta */}
            <meta name="robots" content="index, follow" />
            <meta name="googlebot" content="index, follow" />
            
            {/* Language */}
            <meta httpEquiv="content-language" content="ar" />
            
            {/* Viewport */}
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            
            {/* Structured Data (JSON-LD) */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Service",
                        "name": page.page_title,
                        "description": page.seo_meta_description,
                        "url": currentUrl,
                        "provider": {
                            "@type": "Organization",
                            "name": "Trade For Egypt"
                        },
                        "areaServed": markets.map(m => ({
                            "@type": "Country",
                            "name": m.country
                        }))
                    })
                }}
            />
        </Head>
    );
};

export default SEOHead;
