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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="text-4xl">📊</span>
                  لوحة التحكم
                </h1>
                <p className="text-sm text-gray-600 mt-2">
                  Trade for Egypt - إدارة شبكة المواقع
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/admin/sites"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <span className="text-xl">🌐</span>
                  عرض المواقع
                </Link>
                <Link
                  href="/"
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium shadow-sm flex items-center gap-2"
                >
                  <span className="text-xl">🏠</span>
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
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="text-3xl">⚡</span>
                  تقدم توليد الصفحات
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  نسبة إنجاز المشروع الكلية
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-blue-600">
                  {progressPercentage.toFixed(1)}%
                </div>
                <p className="text-sm text-gray-600 mt-1">مكتمل</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative">
              <div className="overflow-hidden h-6 mb-4 text-xs flex rounded-full bg-gray-200 shadow-inner">
                <div
                  style={{ width: `${progressPercentage}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span className="font-medium">
                  {stats?.stats?.generatedPages?.toLocaleString() || 0} صفحة مولدة
                </span>
                <span className="font-medium">
                  {stats?.stats?.expectedPages?.toLocaleString() || 0} صفحة متوقعة
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Brands */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-2xl">🆕</span>
                آخر الماركات المضافة
              </h2>
              <div className="space-y-3">
                {stats?.recentBrands?.slice(0, 5).map((brand, index) => (
                  <Link
                    key={index}
                    href={`/admin/sites/${brand.slug}`}
                    className="flex items-center justify-between p-4 bg-gray-50 hover:bg-blue-50 rounded-lg transition group border border-gray-200 hover:border-blue-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg group-hover:bg-blue-200 transition">
                        {brand.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition">
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
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="text-2xl">📊</span>
                توزيع الماركات حسب العائلات
              </h2>
              <div className="space-y-4">
                {stats?.familyDistribution?.slice(0, 5).map((family, index) => {
                  const colors = ['blue', 'green', 'purple', 'orange', 'pink'];
                  const color = colors[index % colors.length];
                  const percentage = ((family.count / stats.stats.totalBrands) * 100).toFixed(1);
                  
                  return (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {family.name}
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {family.count} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-3 rounded-full bg-${color}-500 transition-all duration-500`}
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
          <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="text-3xl">⚡</span>
              إجراءات سريعة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/admin/sites"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-6 transition group border border-white/20"
              >
                <div className="text-4xl mb-3">🌐</div>
                <h3 className="font-bold text-lg mb-2">عرض جميع المواقع</h3>
                <p className="text-sm text-blue-100">إدارة ومعاينة المواقع</p>
              </Link>
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-6 transition group border border-white/20 text-right">
                <div className="text-4xl mb-3">🚀</div>
                <h3 className="font-bold text-lg mb-2">توليد الصفحات</h3>
                <p className="text-sm text-blue-100">بدء توليد تلقائي</p>
              </button>
              <button
                onClick={fetchStats}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-6 transition group border border-white/20 text-right"
              >
                <div className="text-4xl mb-3">🔄</div>
                <h3 className="font-bold text-lg mb-2">تحديث البيانات</h3>
                <p className="text-sm text-blue-100">إعادة تحميل الإحصائيات</p>
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
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-3xl shadow-lg`}>
          {icon}
        </div>
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value.toLocaleString()}</p>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  );
}
