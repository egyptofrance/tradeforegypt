import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import styles from '../../styles/Admin.module.css';

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
      <div className={styles.loading}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p>جاري تحميل البيانات...</p>
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
      <div className={styles.loading}>
        <div style={{ 
          background: 'white', 
          borderRadius: '1rem', 
          padding: '2rem', 
          maxWidth: '400px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center' }}>⚠️</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a202c', marginBottom: '0.5rem', textAlign: 'center' }}>
            خطأ في تحميل البيانات
          </h2>
          <p style={{ color: '#718096', textAlign: 'center', marginBottom: '1.5rem' }}>{error}</p>
          <button
            onClick={fetchStats}
            className={`${styles.btn} ${styles.btnPrimary}`}
            style={{ width: '100%' }}
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

      <div className={styles.container} dir="rtl">
        {/* Header */}
        <div className={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 className={styles.headerTitle}>
                <span style={{ fontSize: '2rem' }}>📊</span>
                لوحة التحكم
              </h1>
              <p className={styles.headerSubtitle}>
                Trade for Egypt - إدارة شبكة المواقع
              </p>
            </div>
            <div className={styles.headerActions}>
              <Link href="/admin/sites" className={`${styles.btn} ${styles.btnPrimary}`}>
                <span style={{ fontSize: '1.25rem' }}>🌐</span>
                عرض المواقع
              </Link>
              <Link href="/" className={`${styles.btn} ${styles.btnSecondary}`}>
                <span style={{ fontSize: '1.25rem' }}>🏠</span>
                الصفحة الرئيسية
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <StatCard
            icon="📦"
            title="العائلات"
            value={stats?.stats?.totalFamilies || 0}
            description="عائلة منتجات"
            color="#9f7aea"
          />
          <StatCard
            icon="🏷️"
            title="الماركات"
            value={stats?.stats?.totalBrands || 0}
            description="ماركة تجارية"
            color="#667eea"
          />
          <StatCard
            icon="📱"
            title="المنتجات"
            value={stats?.stats?.totalProducts || 0}
            description="منتج مختلف"
            color="#48bb78"
          />
          <StatCard
            icon="📄"
            title="الصفحات المولدة"
            value={stats?.stats?.generatedPages || 0}
            description={`من ${stats?.stats?.expectedPages?.toLocaleString() || 0} متوقعة`}
            color="#ed8936"
          />
        </div>

        {/* Progress Section */}
        <div className={styles.progressSection}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 className={styles.sectionTitle}>
                <span style={{ fontSize: '1.75rem' }}>⚡</span>
                تقدم توليد الصفحات
              </h2>
              <p className={styles.sectionSubtitle}>
                نسبة إنجاز المشروع الكلية
              </p>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#667eea' }}>
                {progressPercentage.toFixed(1)}%
              </div>
              <p style={{ fontSize: '0.875rem', color: '#718096', margin: 0 }}>مكتمل</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${progressPercentage}%` }}
            >
              {progressPercentage > 5 && `${progressPercentage.toFixed(1)}%`}
            </div>
          </div>
          <div className={styles.progressStats}>
            <span>{stats?.stats?.generatedPages?.toLocaleString() || 0} صفحة مولدة</span>
            <span>{stats?.stats?.expectedPages?.toLocaleString() || 0} صفحة متوقعة</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Recent Brands */}
          <div style={{ gridColumn: 'span 2' }}>
            <div className={styles.progressSection}>
              <h2 className={styles.sectionTitle}>
                <span style={{ fontSize: '1.5rem' }}>🆕</span>
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
                      background: '#f7fafc',
                      borderRadius: '0.75rem',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      border: '2px solid #e2e8f0'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#edf2f7';
                      e.currentTarget.style.borderColor = '#667eea';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#f7fafc';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '3rem',
                        height: '3rem',
                        background: '#667eea',
                        borderRadius: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.25rem'
                      }}>
                        {brand.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 style={{ 
                          fontWeight: '600', 
                          color: '#1a202c', 
                          margin: '0 0 0.25rem 0',
                          fontSize: '1.1rem'
                        }}>
                          {brand.name}
                        </h3>
                        <p style={{ 
                          fontSize: '0.875rem', 
                          color: '#718096',
                          margin: 0
                        }}>
                          {brand.slug}.tradeforegypt.com
                        </p>
                      </div>
                    </div>
                    <span style={{ color: '#667eea', fontSize: '1.5rem' }}>←</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Family Distribution */}
          <div>
            <div className={styles.progressSection}>
              <h2 className={styles.sectionTitle}>
                <span style={{ fontSize: '1.5rem' }}>📊</span>
                توزيع الماركات
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {stats?.familyDistribution?.slice(0, 5).map((family, index) => {
                  const colors = ['#667eea', '#48bb78', '#9f7aea', '#ed8936', '#f56565'];
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
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#4a5568' }}>
                          {family.name}
                        </span>
                        <span style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#1a202c' }}>
                          {family.count} ({percentage}%)
                        </span>
                      </div>
                      <div style={{ 
                        width: '100%', 
                        background: '#e2e8f0', 
                        borderRadius: '9999px', 
                        height: '0.75rem', 
                        overflow: 'hidden' 
                      }}>
                        <div
                          style={{ 
                            height: '100%', 
                            borderRadius: '9999px', 
                            background: color,
                            width: `${percentage}%`,
                            transition: 'width 0.5s ease'
                          }}
                        ></div>
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
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '1rem',
          padding: '2rem',
          color: 'white',
          boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
        }}>
          <h2 style={{ 
            fontSize: '1.75rem', 
            fontWeight: 'bold', 
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <span style={{ fontSize: '2rem' }}>⚡</span>
            إجراءات سريعة
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1rem' 
          }}>
            <Link
              href="/admin/sites"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                textDecoration: 'none',
                color: 'white',
                transition: 'all 0.2s ease',
                border: '2px solid rgba(255, 255, 255, 0.2)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🌐</div>
              <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                عرض جميع المواقع
              </h3>
              <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: 0 }}>إدارة ومعاينة المواقع</p>
            </Link>
            <button 
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                color: 'white',
                transition: 'all 0.2s ease',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                textAlign: 'right'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🚀</div>
              <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                توليد الصفحات
              </h3>
              <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: 0 }}>بدء توليد تلقائي</p>
            </button>
            <button
              onClick={fetchStats}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                color: 'white',
                transition: 'all 0.2s ease',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                textAlign: 'right'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔄</div>
              <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                تحديث البيانات
              </h3>
              <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: 0 }}>إعادة تحميل الإحصائيات</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({ icon, title, value, description, color }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statIcon} style={{ 
        width: '4rem',
        height: '4rem',
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
        borderRadius: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '2rem',
        marginBottom: '1rem',
        boxShadow: `0 4px 15px ${color}40`
      }}>
        {icon}
      </div>
      <p className={styles.statLabel}>{title}</p>
      <h3 className={styles.statValue}>{value.toLocaleString()}</h3>
      <p className={styles.statDescription}>{description}</p>
    </div>
  );
}
