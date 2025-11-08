import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [generateMessage, setGenerateMessage] = useState('');

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

  const handleGeneratePages = async () => {
    if (generating) return;
    
    if (!confirm('هل أنت متأكد من بدء توليد الصفحات؟ قد تستغرق العملية بعض الوقت.')) {
      return;
    }

    try {
      setGenerating(true);
      setGenerateMessage('جاري توليد الصفحات...');

      const response = await fetch('/api/admin/generate-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit: 100 })
      });

      const data = await response.json();

      if (data.success) {
        setGenerateMessage(`✅ ${data.message}`);
        // تحديث الإحصائيات
        setTimeout(() => {
          fetchStats();
          setGenerateMessage('');
        }, 3000);
      } else {
        setGenerateMessage(`❌ خطأ: ${data.error}`);
        setTimeout(() => setGenerateMessage(''), 5000);
      }
    } catch (error) {
      setGenerateMessage(`❌ خطأ: ${error.message}`);
      setTimeout(() => setGenerateMessage(''), 5000);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#64748b', fontSize: '1.125rem' }}>جاري تحميل البيانات...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ 
          background: 'white', 
          borderRadius: '1rem', 
          padding: '2rem', 
          maxWidth: '400px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>⚠️</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '0.5rem', textAlign: 'center' }}>
            خطأ في تحميل البيانات
          </h2>
          <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '1.5rem' }}>{error}</p>
          <button
            onClick={fetchStats}
            style={{
              width: '100%',
              padding: '0.75rem 1.5rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#2563eb'}
            onMouseOut={(e) => e.currentTarget.style.background = '#3b82f6'}
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

      <div style={{ minHeight: '100vh', background: '#f8fafc' }} dir="rtl">
        {/* Header */}
        <div style={{ 
          background: 'white', 
          borderBottom: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ 
            maxWidth: '1280px', 
            margin: '0 auto', 
            padding: '1.5rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h1 style={{ 
                fontSize: '1.875rem', 
                fontWeight: 'bold', 
                color: '#1e293b',
                margin: '0 0 0.25rem 0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <span style={{ fontSize: '2rem' }}>📊</span>
                لوحة التحكم
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
                Trade for Egypt - إدارة شبكة المواقع
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link
                href="/admin/sites"
                style={{
                  padding: '0.625rem 1.25rem',
                  background: '#3b82f6',
                  color: 'white',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s',
                  boxShadow: '0 1px 2px rgba(59, 130, 246, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#2563eb';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(59, 130, 246, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#3b82f6';
                  e.currentTarget.style.boxShadow = '0 1px 2px rgba(59, 130, 246, 0.3)';
                }}
              >
                <span>🌐</span>
                عرض المواقع
              </Link>
              <Link
                href="/"
                style={{
                  padding: '0.625rem 1.25rem',
                  background: 'white',
                  color: '#475569',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <span>🏠</span>
                الصفحة الرئيسية
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
          {/* Stats Cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <StatCard
              icon="📦"
              title="العائلات"
              value={stats?.stats?.totalFamilies || 0}
              description="عائلة منتجات"
              color="#3b82f6"
              link="/admin/families"
            />
            <StatCard
              icon="🏷️"
              title="الماركات"
              value={stats?.stats?.totalBrands || 0}
              description="ماركة تجارية"
              color="#0ea5e9"
              link="/admin/brands"
            />
            <StatCard
              icon="📱"
              title="المنتجات"
              value={stats?.stats?.totalProducts || 0}
              description="منتج مختلف"
              color="#64748b"
              link="/admin/products"
            />
            <StatCard
              icon="📄"
              title="الصفحات المولدة"
              value={stats?.stats?.generatedPages || 0}
              description={`من ${stats?.stats?.expectedPages?.toLocaleString() || 0} متوقعة`}
              color="#94a3b8"
            />
            <StatCard
              icon="🚀"
              title="توليد الصفحات"
              value="RUN TEST"
              description="اختبار وتوليد الصفحات"
              color="#8b5cf6"
              link="/admin/generate-pages"
            />
          </div>

          {/* Progress Section */}
          <div style={{
            background: 'white',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <h2 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  color: '#1e293b',
                  margin: '0 0 0.25rem 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span>⚡</span>
                  تقدم توليد الصفحات
                </h2>
                <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                  نسبة إنجاز المشروع الكلية
                </p>
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
                  {progressPercentage.toFixed(1)}%
                </div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>مكتمل</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{
              background: '#f1f5f9',
              borderRadius: '9999px',
              height: '1rem',
              overflow: 'hidden',
              marginBottom: '0.75rem'
            }}>
              <div style={{
                background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                height: '100%',
                width: `${progressPercentage}%`,
                transition: 'width 0.5s ease',
                borderRadius: '9999px'
              }}></div>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              fontSize: '0.875rem',
              color: '#64748b'
            }}>
              <span>{stats?.stats?.generatedPages?.toLocaleString() || 0} صفحة مولدة</span>
              <span>{stats?.stats?.expectedPages?.toLocaleString() || 0} صفحة متوقعة</span>
            </div>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {/* Recent Brands */}
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{
                background: 'white',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                border: '1px solid #e2e8f0'
              }}>
                <h2 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  color: '#1e293b',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span>🆕</span>
                  آخر الماركات المضافة
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {stats?.recentBrands?.slice(0, 5).map((brand, index) => (
                    <Link
                      key={index}
                      href={`/admin/sites/${brand.slug}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem',
                        background: '#f8fafc',
                        borderRadius: '0.5rem',
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                        border: '1px solid #e2e8f0'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = '#f1f5f9';
                        e.currentTarget.style.borderColor = '#3b82f6';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = '#f8fafc';
                        e.currentTarget.style.borderColor = '#e2e8f0';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          width: '2.5rem',
                          height: '2.5rem',
                          background: '#3b82f6',
                          borderRadius: '0.5rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '1.125rem'
                        }}>
                          {brand.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 style={{ 
                            fontWeight: '600', 
                            color: '#1e293b', 
                            margin: '0 0 0.25rem 0',
                            fontSize: '1rem'
                          }}>
                            {brand.name}
                          </h3>
                          <p style={{ 
                            fontSize: '0.75rem', 
                            color: '#64748b',
                            margin: 0
                          }}>
                            {brand.slug}.tradeforegypt.com
                          </p>
                        </div>
                      </div>
                      <span style={{ color: '#3b82f6', fontSize: '1.25rem' }}>←</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Family Distribution */}
            <div>
              <div style={{
                background: 'white',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                border: '1px solid #e2e8f0'
              }}>
                <h2 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  color: '#1e293b',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span>📊</span>
                  توزيع الماركات
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {stats?.familyDistribution?.slice(0, 5).map((family, index) => {
                    const colors = ['#3b82f6', '#0ea5e9', '#64748b', '#94a3b8', '#cbd5e1'];
                    const color = colors[index % colors.length];
                    const percentage = ((family.count / stats.stats.totalBrands) * 100).toFixed(1);
                    
                    return (
                      <div key={index}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between', 
                          marginBottom: '0.5rem' 
                        }}>
                          <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>
                            {family.name}
                          </span>
                          <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#1e293b' }}>
                            {family.count} ({percentage}%)
                          </span>
                        </div>
                        <div style={{ 
                          width: '100%', 
                          background: '#f1f5f9', 
                          borderRadius: '9999px', 
                          height: '0.5rem', 
                          overflow: 'hidden' 
                        }}>
                          <div style={{ 
                            height: '100%', 
                            borderRadius: '9999px', 
                            background: color,
                            width: `${percentage}%`,
                            transition: 'width 0.5s ease'
                          }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{
            background: 'white',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold',
              color: '#1e293b',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>⚡</span>
              إجراءات سريعة
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1rem' 
            }}>
              <Link
                href="/admin/sites"
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  padding: '1.25rem',
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#f1f5f9';
                  e.currentTarget.style.borderColor = '#3b82f6';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌐</div>
                <h3 style={{ fontWeight: 'bold', fontSize: '1rem', color: '#1e293b', marginBottom: '0.25rem' }}>
                  عرض جميع المواقع
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>إدارة ومعاينة المواقع</p>
              </Link>
              <button 
                onClick={handleGeneratePages}
                disabled={generating}
                style={{
                  background: generating ? '#e2e8f0' : '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  padding: '1.25rem',
                  cursor: generating ? 'not-allowed' : 'pointer',
                  textAlign: 'right',
                  transition: 'all 0.2s',
                  opacity: generating ? 0.6 : 1
                }}
                onMouseOver={(e) => {
                  if (!generating) {
                    e.currentTarget.style.background = '#f1f5f9';
                    e.currentTarget.style.borderColor = '#3b82f6';
                  }
                }}
                onMouseOut={(e) => {
                  if (!generating) {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{generating ? '⏳' : '🚀'}</div>
                <h3 style={{ fontWeight: 'bold', fontSize: '1rem', color: '#1e293b', marginBottom: '0.25rem' }}>
                  توليد الصفحات
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                  {generating ? 'جاري التوليد...' : 'بدء توليد تلقائي'}
                </p>
                {generateMessage && (
                  <p style={{ fontSize: '0.75rem', color: generateMessage.includes('✅') ? '#10b981' : '#ef4444', margin: '0.5rem 0 0 0', fontWeight: '600' }}>
                    {generateMessage}
                  </p>
                )}
              </button>
              <button
                onClick={fetchStats}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  padding: '1.25rem',
                  cursor: 'pointer',
                  textAlign: 'right',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#f1f5f9';
                  e.currentTarget.style.borderColor = '#3b82f6';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔄</div>
                <h3 style={{ fontWeight: 'bold', fontSize: '1rem', color: '#1e293b', marginBottom: '0.25rem' }}>
                  تحديث البيانات
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>إعادة تحميل الإحصائيات</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({ icon, title, value, description, color, link }) {
  const card = (
    <div style={{
      background: 'white',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e2e8f0',
      transition: 'all 0.2s',
      cursor: link ? 'pointer' : 'default'
    }}
    onMouseOver={(e) => {
      if (link) {
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }
    }}
    onMouseOut={(e) => {
      if (link) {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
        e.currentTarget.style.borderColor = '#e2e8f0';
        e.currentTarget.style.transform = 'translateY(0)';
      }
    }}>
      <div style={{
        width: '3rem',
        height: '3rem',
        background: color,
        borderRadius: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        marginBottom: '1rem'
      }}>
        {icon}
      </div>
      <p style={{ 
        fontSize: '0.75rem', 
        fontWeight: '600',
        color: '#64748b', 
        margin: '0 0 0.5rem 0',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {title}
      </p>
      <h3 style={{ 
        fontSize: '2rem', 
        fontWeight: 'bold', 
        color: '#1e293b', 
        margin: '0 0 0.25rem 0' 
      }}>
        {value.toLocaleString()}
      </h3>
      <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: 0 }}>
        {description}
      </p>
    </div>
  );

  if (link) {
    return <Link href={link} style={{ textDecoration: 'none' }}>{card}</Link>;
  }

  return card;
}
