import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function BrandPages() {
  const router = useRouter();
  const { brand } = router.query;
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterKeyword, setFilterKeyword] = useState('all');

  useEffect(() => {
    if (brand) {
      fetchPages();
    }
  }, [brand]);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/pages?brandSlug=${brand}`);
      if (!response.ok) throw new Error('Failed to fetch pages');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredPages = data?.pages?.filter(page => {
    const matchesSearch = page.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.keywordAr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || page.status === filterStatus;
    const matchesKeyword = filterKeyword === 'all' || page.keyword === filterKeyword;
    return matchesSearch && matchesStatus && matchesKeyword;
  }) || [];

  const keywords = [
    { slug: 'agency', nameAr: 'توكيل' },
    { slug: 'maintenance', nameAr: 'صيانة' },
    { slug: 'guarantee', nameAr: 'ضمان' },
    { slug: 'hotline', nameAr: 'خط ساخن' },
    { slug: 'numbers', nameAr: 'أرقام' },
    { slug: 'customer-service', nameAr: 'خدمة عملاء' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل الصفحات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️ خطأ في تحميل البيانات</div>
          <p className="text-gray-600">{error}</p>
          <Link href="/admin/sites" className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            العودة للمواقع
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{data?.brand?.name} - صفحات الموقع</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-50" dir="rtl">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                {data?.brand?.logoUrl && (
                  <img 
                    src={data.brand.logoUrl} 
                    alt={data.brand.name}
                    className="w-12 h-12 object-contain"
                  />
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {data?.brand?.name}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {data?.brand?.subdomain}
                  </p>
                </div>
              </div>
              <Link href="/admin/sites" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                ← العودة للمواقع
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">تقدم توليد الصفحات</h2>
              <span className="text-2xl font-bold text-blue-600">
                {data?.stats?.progress || 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-6 rounded-full transition-all duration-500 flex items-center justify-center text-white text-sm font-semibold"
                style={{ width: `${data?.stats?.progress || 0}%` }}
              >
                {data?.stats?.progress > 5 && `${data?.stats?.progress}%`}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {data?.stats?.totalPages || 0}
                </p>
                <p className="text-sm text-gray-600">إجمالي الصفحات</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {data?.stats?.generatedPages || 0}
                </p>
                <p className="text-sm text-gray-600">مولدة</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">
                  {data?.stats?.pendingPages || 0}
                </p>
                <p className="text-sm text-gray-600">قيد الانتظار</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  بحث
                </label>
                <input
                  type="text"
                  placeholder="ابحث عن منتج..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الكلمة البحثية
                </label>
                <select
                  value={filterKeyword}
                  onChange={(e) => setFilterKeyword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">الكل</option>
                  {keywords.map(kw => (
                    <option key={kw.slug} value={kw.slug}>{kw.nameAr}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الحالة
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">الكل</option>
                  <option value="generated">مولدة</option>
                  <option value="pending">قيد الانتظار</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pages Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المنتج
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الكلمة البحثية
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المسار
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      إجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPages.map((page, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {page.productName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {page.product}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {page.keywordAr}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 break-all">
                          {page.path}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          page.status === 'generated' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {page.statusAr}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <Link href={`/admin/preview${page.path}`} className="text-blue-600 hover:text-blue-800 font-medium">
                            معاينة
                          </Link>
                          <a 
                            href={page.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-800"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredPages.length === 0 && (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-gray-600">لا توجد صفحات تطابق البحث</p>
              </div>
            )}
          </div>

          {/* Pagination Info */}
          {filteredPages.length > 0 && (
            <div className="mt-4 text-center text-sm text-gray-600">
              عرض {filteredPages.length} من {data?.stats?.totalPages || 0} صفحة
            </div>
          )}
        </main>
      </div>
    </>
  );
}
