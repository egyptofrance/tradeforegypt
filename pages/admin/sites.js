import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

const ITEMS_PER_PAGE = 20;

export default function AdminSites() {
  const [sitesData, setSitesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/sites');
      if (!response.ok) throw new Error('Failed to fetch sites');
      const data = await response.json();
      setSitesData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredSites = sitesData?.sites?.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || site.status === filterStatus;
    return matchesSearch && matchesFilter;
  }) || [];

  // Pagination
  const totalPages = Math.ceil(filteredSites.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedSites = filteredSites.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'complete': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'complete': return 'مكتمل';
      case 'in-progress': return 'قيد التنفيذ';
      case 'pending': return 'قيد الانتظار';
      default: return 'غير معروف';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'complete': return '✅';
      case 'in-progress': return '⏳';
      case 'pending': return '⏸️';
      default: return '❓';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">جاري تحميل المواقع...</p>
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
          <button
            onClick={fetchSites}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>المواقع - لوحة التحكم</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
        {/* Header */}
        <header className="bg-white shadow-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="text-4xl">🌐</span>
                  المواقع
                </h1>
                <p className="text-sm text-gray-600 mt-2">
                  إجمالي {sitesData?.totalSites || 0} موقع
                </p>
              </div>
              <Link
                href="/admin"
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium shadow-sm flex items-center gap-2"
              >
                <span className="text-xl">←</span>
                العودة للوحة التحكم
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🌐</span>
                <h3 className="text-sm font-medium text-gray-600">إجمالي المواقع</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{sitesData?.totalSites || 0}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">✅</span>
                <h3 className="text-sm font-medium text-gray-600">مكتملة</h3>
              </div>
              <p className="text-3xl font-bold text-green-600">{sitesData?.completeSites || 0}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">⏳</span>
                <h3 className="text-sm font-medium text-gray-600">قيد التنفيذ</h3>
              </div>
              <p className="text-3xl font-bold text-yellow-600">{sitesData?.inProgressSites || 0}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">⏸️</span>
                <h3 className="text-sm font-medium text-gray-600">قيد الانتظار</h3>
              </div>
              <p className="text-3xl font-bold text-gray-600">{sitesData?.pendingSites || 0}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <span className="text-lg">🔍</span>
                  بحث
                </label>
                <input
                  type="text"
                  placeholder="ابحث عن ماركة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <span className="text-lg">🎯</span>
                  تصفية حسب الحالة
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option value="all">الكل</option>
                  <option value="complete">مكتمل</option>
                  <option value="in-progress">قيد التنفيذ</option>
                  <option value="pending">قيد الانتظار</option>
                </select>
              </div>
            </div>
            {(searchTerm || filterStatus !== 'all') && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  عرض {filteredSites.length} من {sitesData?.totalSites || 0} موقع
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('all');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  إعادة تعيين الفلاتر
                </button>
              </div>
            )}
          </div>

          {/* Sites Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedSites.map((site, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition overflow-hidden"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-bold">{site.name}</h3>
                    <span className="text-3xl">{getStatusIcon(site.status)}</span>
                  </div>
                  <p className="text-sm text-blue-100 font-mono">
                    {site.subdomain}
                  </p>
                </div>

                {/* Body */}
                <div className="p-6">
                  {/* Status */}
                  <div className="mb-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(site.status)}`}>
                      {getStatusIcon(site.status)} {getStatusText(site.status)}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">العائلات:</span>
                      <span className="font-semibold text-gray-900">{site.familyCount}</span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">التقدم</span>
                      <span className="font-semibold text-gray-900">{site.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${site.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                      <span>{site.generatedPages} مولدة</span>
                      <span>{site.expectedPages} متوقعة</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/sites/${site.slug}`}
                      className="flex-1 px-4 py-3 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 transition font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <span>📄</span>
                      عرض الصفحات
                    </Link>
                    <a
                      href={`https://${site.subdomain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium flex items-center justify-center"
                      title="فتح الموقع"
                    >
                      <span className="text-xl">↗</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredSites.length}
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
