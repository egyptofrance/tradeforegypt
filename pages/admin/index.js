import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/stats');
      if (!response.ok) throw new Error('فشل تحميل البيانات');
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">جاري تحميل البيانات...</p>
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
            onClick={fetchStats}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  const progressPercentage = stats?.stats?.progressPercentage || 0;

  return (
    <>
      <Head>
        <title>لوحة التحكم - Trade for Egypt</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
        {/* Header */}
        <header className="bg-white shadow-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="text-3xl">📊</span>
                  لوحة التحكم
                </h1>
                <p className="text-xs text-gray-600 mt-1">
                  Trade for Egypt - إدارة شبكة المواقع
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/admin/sites"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md hover:shadow-lg flex items-center gap-2 text-sm"
                >
                  <span className="text-lg">🌐</span>
                  عرض المواقع
                </Link>
                <Link
                  href="/"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium shadow-sm flex items-center gap-2 text-sm"
                >
                  <span className="text-lg">🏠</span>
                  الصفحة الرئيسية
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              icon="📦"
              title="العائلات"
              value={stats?.stats?.totalFamilies || 0}
              color="purple"
              subtitle="عائلة منتجات"
            />
            <StatCard
              icon="🏷️"
              title="الماركات"
              value={stats?.stats?.totalBrands || 0}
              color="blue"
              subtitle="ماركة تجارية"
            />
            <StatCard
              icon="📱"
              title="المنتجات"
              value={stats?.stats?.totalProducts || 0}
              color="green"
              subtitle="منتج مختلف"
            />
            <StatCard
              icon="📄"
              title="الصفحات المولدة"
              value={stats?.stats?.generatedPages || 0}
              color="orange"
              subtitle={`من ${stats?.stats?.expectedPages?.toLocaleString() || 0} متوقعة`}
            />
          </div>

          {/* Progress Section */}
          <div className="bg-white rounded-lg shadow-md p-5 mb-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  تقدم توليد الصفحات
                </h2>
                <p className="text-xs text-gray-600 mt-1">
                  نسبة إنجاز المشروع الكلية
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">
                  {progressPercentage.toFixed(1)}%
                </div>
                <p className="text-xs text-gray-600">مكتمل</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative">
              <div className="overflow-hidden h-5 mb-3 text-xs flex rounded-full bg-gray-200 shadow-inner">
                <div
                  style={{ width: `${progressPercentage}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span className="font-medium">
                  {stats?.stats?.generatedPages?.toLocaleString() || 0} صفحة مولدة
                </span>
                <span className="font-medium">
                  {stats?.stats?.expectedPages?.toLocaleString() || 0} صفحة متوقعة
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {/* Recent Brands */}
            <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200 lg:col-span-2">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-xl">🆕</span>
                آخر الماركات المضافة
              </h2>
              <div className="space-y-2">
                {stats?.recentBrands?.slice(0, 5).map((brand, index) => (
                  <Link
                    key={index}
                    href={`/admin/sites/${brand.slug}`}
                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition group border border-gray-200 hover:border-blue-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm group-hover:bg-blue-200 transition">
                        {brand.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition">
                          {brand.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {brand.slug}.tradeforegypt.com
                        </p>
                      </div>
                    </div>
                    <span className="text-blue-600 group-hover:translate-x-1 transition">
                      ←
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Family Distribution */}
            <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-xl">📊</span>
                توزيع الماركات
              </h2>
              <div className="space-y-3">
                {stats?.familyDistribution?.slice(0, 5).map((family, index) => {
                  const colors = ['blue', 'green', 'purple', 'orange', 'pink'];
                  const color = colors[index % colors.length];
                  const percentage = ((family.count / stats.stats.totalBrands) * 100).toFixed(1);
                  
                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700">
                          {family.name}
                        </span>
                        <span className="text-xs font-bold text-gray-900">
                          {family.count} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full bg-${color}-500 transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-md p-5 text-white">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              إجراءات سريعة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Link
                href="/admin/sites"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 transition group border border-white/20"
              >
                <div className="text-3xl mb-2">🌐</div>
                <h3 className="font-bold text-base mb-1">عرض جميع المواقع</h3>
                <p className="text-xs text-blue-100">إدارة ومعاينة المواقع</p>
              </Link>
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 transition group border border-white/20 text-right">
                <div className="text-3xl mb-2">🚀</div>
                <h3 className="font-bold text-base mb-1">توليد الصفحات</h3>
                <p className="text-xs text-blue-100">بدء توليد تلقائي</p>
              </button>
              <button
                onClick={fetchStats}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 transition group border border-white/20 text-right"
              >
                <div className="text-3xl mb-2">🔄</div>
                <h3 className="font-bold text-base mb-1">تحديث البيانات</h3>
                <p className="text-xs text-blue-100">إعادة تحميل الإحصائيات</p>
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

function StatCard({ icon, title, value, color, subtitle }) {
  const colorClasses = {
    purple: 'from-purple-500 to-purple-600',
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
    pink: 'from-pink-500 to-pink-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-2xl shadow-md`}>
          {icon}
        </div>
      </div>
      <h3 className="text-xs font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mb-0.5">{value.toLocaleString()}</p>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  );
}
