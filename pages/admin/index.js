import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      console.log('Fetching stats...');
      const response = await fetch('/api/admin/stats');
      console.log('Response status:', response.status);
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      console.log('Data received:', data);
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
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
          <button 
            onClick={fetchStats}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
        <title>لوحة التحكم - Trade for Egypt</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-50" dir="rtl">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                لوحة التحكم - Trade for Egypt
              </h1>
              <div className="flex gap-4">
                <Link href="/admin/sites" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  عرض المواقع
                </Link>
                <Link href="/" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                  الصفحة الرئيسية
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* العائلات */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">العائلات</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats?.stats?.totalFamilies || 0}
                  </p>
                </div>
                <div className="bg-purple-100 rounded-full p-3">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
            </div>

            {/* الماركات */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">الماركات</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats?.stats?.totalBrands || 0}
                  </p>
                </div>
                <div className="bg-blue-100 rounded-full p-3">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* المنتجات */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">المنتجات</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats?.stats?.totalProducts || 0}
                  </p>
                </div>
                <div className="bg-green-100 rounded-full p-3">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
            </div>

            {/* الصفحات المولدة */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">الصفحات المولدة</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stats?.stats?.generatedPages || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    من {stats?.stats?.expectedPages || 0} متوقعة
                  </p>
                </div>
                <div className="bg-orange-100 rounded-full p-3">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">تقدم توليد الصفحات</h2>
              <span className="text-2xl font-bold text-blue-600">
                {stats?.stats?.progressPercentage || 0}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-6 rounded-full transition-all duration-500 flex items-center justify-center text-white text-sm font-semibold"
                style={{ width: `${stats?.stats?.progressPercentage || 0}%` }}
              >
                {stats?.stats?.progressPercentage > 5 && `${stats?.stats?.progressPercentage}%`}
              </div>
            </div>
            <div className="mt-4 flex justify-between text-sm text-gray-600">
              <span>{stats?.stats?.generatedPages || 0} صفحة مولدة</span>
              <span>{stats?.stats?.expectedPages || 0} صفحة متوقعة</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Brands */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">آخر الماركات المضافة</h2>
              <div className="space-y-3">
                {stats?.recentBrands?.map((brand) => (
                  <div key={brand.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div>
                      <p className="font-semibold text-gray-900">{brand.name}</p>
                      <p className="text-sm text-gray-500">{brand.slug}.tradeforegypt.com</p>
                    </div>
                    <Link href={`/admin/sites/${brand.slug}`} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      عرض →
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Family Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">توزيع الماركات حسب العائلات</h2>
              <div className="space-y-3">
                {stats?.familyDistribution?.slice(0, 10).map((family, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-700">{family.name}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ 
                            width: `${(family.count / stats?.stats?.totalBrands * 100)}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-900 w-8 text-left">
                        {family.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">إجراءات سريعة</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/admin/sites" className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">عرض جميع المواقع</p>
                  <p className="text-sm text-gray-600">إدارة ومعاينة المواقع</p>
                </div>
              </Link>

              <button 
                onClick={() => router.push('/admin/generate')}
                className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition text-right"
              >
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">توليد الصفحات</p>
                  <p className="text-sm text-gray-600">بدء توليد تلقائي</p>
                </div>
              </button>

              <button 
                onClick={fetchStats}
                className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition text-right"
              >
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">تحديث البيانات</p>
                  <p className="text-sm text-gray-600">إعادة تحميل الإحصائيات</p>
                </div>
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
