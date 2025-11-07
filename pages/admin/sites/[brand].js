import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

const ITEMS_PER_PAGE = 20;

export default function BrandPages() {
  const router = useRouter();
  const { brand } = router.query;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKeyword, setFilterKeyword] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (brand) {
      fetchPages();
    }
  }, [brand]);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/pages?brand=${brand}`);
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
    const matchesSearch = 
      page.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.productSlug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesKeyword = filterKeyword === 'all' || page.keywordSlug === filterKeyword;
    const matchesStatus = filterStatus === 'all' || page.status === filterStatus;
    return matchesSearch && matchesKeyword && matchesStatus;
  }) || [];

  // Pagination
  const totalPages = Math.ceil(filteredPages.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedPages = filteredPages.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterKeyword, filterStatus]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'generated': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'generated': return 'مولدة';
      case 'pending': return 'قيد الانتظار';
      default: return 'غير معروف';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'generated': return '✅';
      case 'pending': return '⏸️';
      default: return '❓';
    }
  };

  const getKeywordText = (slug) => {
    const keywords = {
      'agency': 'توكيل',
      'maintenance': 'صيانة',
      'guarantee': 'ضمان',
      'hotline': 'خط ساخن',
      'numbers': 'أرقام',
      'customer-service': 'خدمة عملاء'
    };
    return keywords[slug] || slug;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">جاري تحميل الصفحات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <div className="text-red-600 text-5xl mb-4 text-center">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">خطأ في تحميل البيانات</h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <Link
            href="/admin/sites"
            className="block w-full px-6 py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition font-medium"
          >
            العودة للمواقع
          </Link>
        </div>
      </div>
    );
  }

  const progressPercentage = data?.brand?.progress || 0;

  return (
    <>
      <Head>
        <title>{data?.brand?.name} - صفحات الموقع</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
        {/* Header */}
        <header className="bg-white shadow-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {data?.brand?.name}
                  </h1>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {data?.totalPages} صفحة
                  </span>
                </div>
                <p className="text-sm text-gray-600 font-mono">
                  {data?.brand?.subdomain}
                </p>
              </div>
              <Link
                href="/admin/sites"
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium shadow-sm flex items-center gap-2"
              >
                <span className="text-xl">←</span>
                العودة للمواقع
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                تقدم توليد الصفحات
              </h2>
              <span className="text-3xl font-bold text-blue-600">
                {progressPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-4">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{data?.totalPages}</p>
                <p className="text-sm text-gray-600">إجمالي الصفحات</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{data?.generatedPages}</p>
                <p className="text-sm text-gray-600">مولدة</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-600">{data?.pendingPages}</p>
                <p className="text-sm text-gray-600">قيد الانتظار</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <span className="text-lg">🔍</span>
                  بحث
                </label>
                <input
                  type="text"
                  placeholder="ابحث عن منتج..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <span className="text-lg">🔑</span>
                  الكلمة البحثية
                </label>
                <select
                  value={filterKeyword}
                  onChange={(e) => setFilterKeyword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option value="all">الكل</option>
                  <option value="agency">توكيل</option>
                  <option value="maintenance">صيانة</option>
                  <option value="guarantee">ضمان</option>
                  <option value="hotline">خط ساخن</option>
                  <option value="numbers">أرقام</option>
                  <option value="customer-service">خدمة عملاء</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <span className="text-lg">🎯</span>
                  الحالة
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option value="all">الكل</option>
                  <option value="generated">مولدة</option>
                  <option value="pending">قيد الانتظار</option>
                </select>
              </div>
            </div>
            {(searchTerm || filterKeyword !== 'all' || filterStatus !== 'all') && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  عرض {filteredPages.length} من {data?.totalPages || 0} صفحة
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterKeyword('all');
                    setFilterStatus('all');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  إعادة تعيين الفلاتر
                </button>
              </div>
            )}
          </div>

          {/* Pages Table */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      المنتج
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      الكلمة البحثية
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      المسار
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                      إجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedPages.map((page, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {page.productName}
                          </div>
                          <div className="text-xs text-gray-500 font-mono">
                            {page.productSlug}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {getKeywordText(page.keywordSlug)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {page.path}
                        </code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(page.status)}`}>
                          {getStatusIcon(page.status)} {getStatusText(page.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/preview/${brand}/${page.productSlug}/${page.keywordSlug}`}
                            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                          >
                            👁️ معاينة
                          </Link>
                          <span className="text-gray-300">|</span>
                          <a
                            href={`https://${brand}.tradeforegypt.com/${page.productSlug}/${page.keywordSlug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-800 font-medium flex items-center gap-1"
                          >
                            ↗ فتح
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredPages.length}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          )}
        </main>
      </div>
    </>
  );
}

function Pagination({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) {
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Info */}
        <div className="text-sm text-gray-700">
          عرض <span className="font-semibold">{startIndex}</span> إلى{' '}
          <span className="font-semibold">{endIndex}</span> من{' '}
          <span className="font-semibold">{totalItems}</span> نتيجة
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          {/* Previous */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            السابق
          </button>

          {/* Page Numbers */}
          <div className="hidden md:flex items-center gap-1">
            {getPageNumbers().map((page, index) => (
              page === '...' ? (
                <span key={index} className="px-3 py-2 text-gray-500">...</span>
              ) : (
                <button
                  key={index}
                  onClick={() => onPageChange(page)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    currentPage === page
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              )
            ))}
          </div>

          {/* Mobile page indicator */}
          <div className="md:hidden px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-medium">
            {currentPage} / {totalPages}
          </div>

          {/* Next */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            التالي
          </button>
        </div>
      </div>
    </div>
  );
}
