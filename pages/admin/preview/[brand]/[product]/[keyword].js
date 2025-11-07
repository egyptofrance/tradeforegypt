import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function PreviewPage() {
  const router = useRouter();
  const { brand, product, keyword } = router.query;
  
  const [activeTab, setActiveTab] = useState('page');

  const previewUrl = `/${brand}/${product}/${keyword}`;
  const fullUrl = `https://${brand}.tradeforegypt.com/${product}/${keyword}`;

  // معلومات Meta Tags المتوقعة
  const expectedMeta = {
    title: `${keyword} ${brand} ${product} | Trade for Egypt`,
    description: `احصل على أفضل خدمات ${keyword} ${brand} ${product} في مصر. فريق محترف ومتخصص لخدمتك على مدار الساعة.`,
    canonical: fullUrl,
    keywords: `${keyword} ${brand}, ${brand} ${product}, ${keyword} ${brand} مصر`
  };

  // معلومات Schema المتوقعة
  const expectedSchema = {
    organization: {
      "@type": "Organization",
      "name": brand,
      "url": `https://tradeforegypt.com/${brand}`
    },
    product: {
      "@type": "Product",
      "name": `${brand} ${product}`
    },
    localBusiness: {
      "@type": "LocalBusiness",
      "name": `${brand} Service Center`
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home" },
        { "@type": "ListItem", "position": 2, "name": brand },
        { "@type": "ListItem", "position": 3, "name": product },
        { "@type": "ListItem", "position": 4, "name": keyword }
      ]
    },
    webPage: {
      "@type": "WebPage",
      "name": `${keyword} ${brand} ${product}`
    }
  };

  return (
    <>
      <Head>
        <title>معاينة - {brand} {product} {keyword}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-50" dir="rtl">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  معاينة الصفحة
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {brand} / {product} / {keyword}
                </p>
              </div>
              <div className="flex gap-2">
                <a 
                  href={fullUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                >
                  فتح في نافذة جديدة ↗
                </a>
                <Link href={`/admin/sites/${brand}`}>
                  <a className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm">
                    ← العودة
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('page')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition ${
                    activeTab === 'page'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  معاينة الصفحة
                </button>
                <button
                  onClick={() => setActiveTab('meta')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition ${
                    activeTab === 'meta'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Meta Tags
                </button>
                <button
                  onClick={() => setActiveTab('schema')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition ${
                    activeTab === 'schema'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Schema Markup
                </button>
                <button
                  onClick={() => setActiveTab('info')}
                  className={`px-6 py-3 text-sm font-medium border-b-2 transition ${
                    activeTab === 'info'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  معلومات الصفحة
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* Page Preview Tab */}
              {activeTab === 'page' && (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      معاينة مباشرة للصفحة
                    </p>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300">
                        📱 Mobile
                      </button>
                      <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded">
                        💻 Desktop
                      </button>
                    </div>
                  </div>
                  <div className="border border-gray-300 rounded-lg overflow-hidden" style={{ height: '600px' }}>
                    <iframe
                      src={previewUrl}
                      className="w-full h-full"
                      title="Page Preview"
                    />
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      💡 <strong>ملاحظة:</strong> إذا لم تظهر الصفحة، تأكد من أن الصفحة الديناميكية قد تم إنشاؤها في المشروع.
                    </p>
                  </div>
                </div>
              )}

              {/* Meta Tags Tab */}
              {activeTab === 'meta' && (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Title Tag</h3>
                    <code className="block text-sm bg-white p-3 rounded border border-gray-200">
                      {expectedMeta.title}
                    </code>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Meta Description</h3>
                    <code className="block text-sm bg-white p-3 rounded border border-gray-200">
                      {expectedMeta.description}
                    </code>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Canonical URL</h3>
                    <code className="block text-sm bg-white p-3 rounded border border-gray-200">
                      {expectedMeta.canonical}
                    </code>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Keywords</h3>
                    <code className="block text-sm bg-white p-3 rounded border border-gray-200">
                      {expectedMeta.keywords}
                    </code>
                  </div>

                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">اختبار SEO</h3>
                    <div className="space-y-2">
                      <a 
                        href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(fullUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-green-700 hover:text-green-900"
                      >
                        → اختبار في Google Rich Results Test
                      </a>
                      <a 
                        href={`https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(fullUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-green-700 hover:text-green-900"
                      >
                        → اختبار Open Graph في Facebook
                      </a>
                      <a 
                        href={`https://cards-dev.twitter.com/validator?url=${encodeURIComponent(fullUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-green-700 hover:text-green-900"
                      >
                        → اختبار Twitter Card
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Schema Tab */}
              {activeTab === 'schema' && (
                <div className="space-y-4">
                  {Object.entries(expectedSchema).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2 capitalize">
                        {key} Schema
                      </h3>
                      <pre className="text-xs bg-white p-3 rounded border border-gray-200 overflow-x-auto">
                        {JSON.stringify(value, null, 2)}
                      </pre>
                    </div>
                  ))}

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">اختبار Schema</h3>
                    <a 
                      href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(fullUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-700 hover:text-blue-900"
                    >
                      → اختبار في Google Rich Results Test
                    </a>
                  </div>
                </div>
              )}

              {/* Info Tab */}
              {activeTab === 'info' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-semibold text-gray-600 mb-1">الماركة</h3>
                      <p className="text-lg font-bold text-gray-900">{brand}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-semibold text-gray-600 mb-1">المنتج</h3>
                      <p className="text-lg font-bold text-gray-900">{product}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-semibold text-gray-600 mb-1">الكلمة البحثية</h3>
                      <p className="text-lg font-bold text-gray-900">{keyword}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="text-sm font-semibold text-gray-600 mb-1">السبدومين</h3>
                      <p className="text-lg font-bold text-gray-900">{brand}.tradeforegypt.com</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">المسار الكامل</h3>
                    <code className="block text-sm bg-white p-3 rounded border border-gray-200 break-all">
                      {fullUrl}
                    </code>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">المسار النسبي</h3>
                    <code className="block text-sm bg-white p-3 rounded border border-gray-200">
                      {previewUrl}
                    </code>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
