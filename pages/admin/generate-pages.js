import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const KEYWORDS = [
  { slug: 'agency', name: 'توكيل' },
  { slug: 'maintenance', name: 'صيانة' },
  { slug: 'warranty', name: 'ضمان' },
  { slug: 'hotline', name: 'خط ساخن' },
  { slug: 'numbers', name: 'أرقام' },
  { slug: 'customer-service', name: 'خدمة عملاء' }
];

export default function GeneratePagesAdmin() {
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Test Page Generation
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedKeyword, setSelectedKeyword] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [testLoading, setTestLoading] = useState(false);
  
  // Stats
  const [stats, setStats] = useState({
    totalBrands: 0,
    totalProducts: 0,
    totalKeywords: 6,
    estimatedPages: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const { data: brandsData, error: brandsError } = await supabase
        .from('brands')
        .select('id, name, name_ar, slug')
        .order('name', { ascending: true });
      
      if (brandsError) throw brandsError;
      
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, name, slug')
        .order('name', { ascending: true });
      
      if (productsError) throw productsError;
      
      setBrands(brandsData);
      setProducts(productsData);
      
      // حساب الإحصائيات
      const totalPages = brandsData.length * productsData.length * KEYWORDS.length;
      setStats({
        totalBrands: brandsData.length,
        totalProducts: productsData.length,
        totalKeywords: KEYWORDS.length,
        estimatedPages: totalPages
      });
      
    } catch (err) {
      console.error('Error fetching data:', err);
      alert('حدث خطأ في جلب البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleRunTest = async () => {
    if (!selectedBrand || !selectedProduct || !selectedKeyword) {
      alert('يرجى اختيار الماركة والمنتج والكلمة المفتاحية');
      return;
    }

    setTestLoading(true);
    setTestResult(null);

    try {
      // بناء الرابط
      const testUrl = `/${selectedBrand}/${selectedProduct}/${selectedKeyword}`;
      const fullUrl = `${window.location.origin}${testUrl}`;
      
      // محاولة الوصول للصفحة
      const response = await fetch(testUrl);
      
      if (response.ok) {
        const html = await response.text();
        
        // استخراج معلومات SEO من HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const title = doc.querySelector('title')?.textContent || 'غير متوفر';
        const description = doc.querySelector('meta[name="description"]')?.content || 'غير متوفر';
        const canonical = doc.querySelector('link[rel="canonical"]')?.href || 'غير متوفر';
        
        setTestResult({
          success: true,
          url: fullUrl,
          title,
          description,
          canonical,
          statusCode: response.status,
          message: 'تم توليد الصفحة بنجاح! ✅'
        });
      } else {
        setTestResult({
          success: false,
          url: fullUrl,
          statusCode: response.status,
          message: `فشل توليد الصفحة (${response.status})`
        });
      }
    } catch (error) {
      console.error('Test error:', error);
      setTestResult({
        success: false,
        message: `خطأ: ${error.message}`
      });
    } finally {
      setTestLoading(false);
    }
  };

  const handleRevalidate = async () => {
    if (!selectedBrand || !selectedProduct || !selectedKeyword) {
      alert('يرجى اختيار الماركة والمنتج والكلمة المفتاحية');
      return;
    }

    try {
      const path = `/${selectedBrand}/${selectedProduct}/${selectedKeyword}`;
      const response = await fetch(`/api/revalidate?path=${encodeURIComponent(path)}`);
      const data = await response.json();
      
      if (data.revalidated) {
        alert('تم تحديث الصفحة بنجاح! ✅');
      } else {
        alert('فشل تحديث الصفحة');
      }
    } catch (error) {
      console.error('Revalidate error:', error);
      alert(`خطأ: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>جاري التحميل...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>توليد الصفحات | لوحة التحكم</title>
      </Head>

      <div className="admin-container">
        <div className="admin-header">
          <h1>🚀 توليد الصفحات</h1>
          <Link href="/admin">
            <button className="btn-secondary">← العودة للوحة التحكم</button>
          </Link>
        </div>

        {/* Statistics */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>عدد الماركات</h3>
            <p className="stat-number">{stats.totalBrands}</p>
          </div>
          <div className="stat-card">
            <h3>عدد المنتجات</h3>
            <p className="stat-number">{stats.totalProducts}</p>
          </div>
          <div className="stat-card">
            <h3>الكلمات المفتاحية</h3>
            <p className="stat-number">{stats.totalKeywords}</p>
          </div>
          <div className="stat-card highlight">
            <h3>إجمالي الصفحات المتوقعة</h3>
            <p className="stat-number">{stats.estimatedPages.toLocaleString()}</p>
          </div>
        </div>

        {/* Test Page Generation */}
        <div className="section-card">
          <h2>🧪 اختبار توليد صفحة واحدة (RUN TEST)</h2>
          <p className="section-description">
            اختر ماركة ومنتج وكلمة مفتاحية لتوليد صفحة تجريبية والتحقق من جميع عناصر SEO
          </p>

          <div className="form-grid">
            <div className="form-group">
              <label>الماركة</label>
              <select 
                value={selectedBrand} 
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="form-select"
              >
                <option value="">اختر الماركة</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.slug}>
                    {brand.name} {brand.name_ar && `(${brand.name_ar})`}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>المنتج</label>
              <select 
                value={selectedProduct} 
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="form-select"
              >
                <option value="">اختر المنتج</option>
                {products.map(product => (
                  <option key={product.id} value={product.slug}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>الكلمة المفتاحية</label>
              <select 
                value={selectedKeyword} 
                onChange={(e) => setSelectedKeyword(e.target.value)}
                className="form-select"
              >
                <option value="">اختر الكلمة</option>
                {KEYWORDS.map(kw => (
                  <option key={kw.slug} value={kw.slug}>
                    {kw.name} ({kw.slug})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="button-group">
            <button 
              onClick={handleRunTest}
              disabled={testLoading || !selectedBrand || !selectedProduct || !selectedKeyword}
              className="btn-primary btn-large"
            >
              {testLoading ? '⏳ جاري التوليد...' : '🧪 RUN TEST - توليد صفحة تجريبية'}
            </button>

            <button 
              onClick={handleRevalidate}
              disabled={!selectedBrand || !selectedProduct || !selectedKeyword}
              className="btn-secondary"
            >
              🔄 تحديث الصفحة (Revalidate)
            </button>
          </div>

          {/* Test Result */}
          {testResult && (
            <div className={`test-result ${testResult.success ? 'success' : 'error'}`}>
              <h3>{testResult.message}</h3>
              
              {testResult.success && (
                <>
                  <div className="result-info">
                    <p><strong>الرابط:</strong></p>
                    <a href={testResult.url} target="_blank" rel="noopener noreferrer" className="result-link">
                      {testResult.url}
                    </a>
                  </div>

                  <div className="result-info">
                    <p><strong>Title:</strong></p>
                    <p className="result-value">{testResult.title}</p>
                  </div>

                  <div className="result-info">
                    <p><strong>Meta Description:</strong></p>
                    <p className="result-value">{testResult.description}</p>
                  </div>

                  <div className="result-info">
                    <p><strong>Canonical URL:</strong></p>
                    <p className="result-value">{testResult.canonical}</p>
                  </div>

                  <div className="button-group">
                    <a href={testResult.url} target="_blank" rel="noopener noreferrer">
                      <button className="btn-primary">
                        👁️ فتح الصفحة في تبويب جديد
                      </button>
                    </a>
                  </div>
                </>
              )}

              {!testResult.success && (
                <p className="error-message">{testResult.message}</p>
              )}
            </div>
          )}
        </div>

        {/* Information */}
        <div className="info-card">
          <h3>ℹ️ معلومات مهمة</h3>
          <ul>
            <li>✅ <strong>التوليد التلقائي (ISR):</strong> الصفحات تُولد تلقائياً عند زيارتها لأول مرة</li>
            <li>✅ <strong>RUN TEST:</strong> لاختبار صفحة واحدة والتحقق من SEO</li>
            <li>✅ <strong>Revalidate:</strong> لتحديث صفحة موجودة بعد تعديل قاعدة البيانات</li>
            <li>⚠️ <strong>لا حاجة لزر RUN:</strong> لا تحاول توليد {stats.estimatedPages.toLocaleString()} صفحة دفعة واحدة!</li>
            <li>🔄 <strong>التحديث التلقائي:</strong> كل صفحة تُحدّث تلقائياً كل ساعة</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .admin-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
          font-family: 'Cairo', sans-serif;
          direction: rtl;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e0e0e0;
        }

        .admin-header h1 {
          font-size: 2rem;
          color: #333;
          margin: 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          text-align: center;
        }

        .stat-card.highlight {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .stat-card h3 {
          font-size: 0.95rem;
          margin: 0 0 0.5rem 0;
          color: #666;
        }

        .stat-card.highlight h3 {
          color: white;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: bold;
          margin: 0;
          color: #333;
        }

        .stat-card.highlight .stat-number {
          color: white;
        }

        .section-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin-bottom: 2rem;
        }

        .section-card h2 {
          font-size: 1.5rem;
          margin: 0 0 0.5rem 0;
          color: #333;
        }

        .section-description {
          color: #666;
          margin-bottom: 1.5rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #333;
        }

        .form-select {
          padding: 0.75rem;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          font-family: 'Cairo', sans-serif;
          transition: border-color 0.3s;
        }

        .form-select:focus {
          outline: none;
          border-color: #667eea;
        }

        .button-group {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn-primary, .btn-secondary {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          font-family: 'Cairo', sans-serif;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-large {
          padding: 1rem 2rem;
          font-size: 1.1rem;
        }

        .btn-secondary {
          background: white;
          color: #667eea;
          border: 2px solid #667eea;
        }

        .btn-secondary:hover {
          background: #667eea;
          color: white;
        }

        .test-result {
          margin-top: 2rem;
          padding: 1.5rem;
          border-radius: 12px;
          border: 2px solid;
        }

        .test-result.success {
          background: #f0fdf4;
          border-color: #22c55e;
        }

        .test-result.error {
          background: #fef2f2;
          border-color: #ef4444;
        }

        .test-result h3 {
          margin: 0 0 1rem 0;
          font-size: 1.2rem;
        }

        .result-info {
          margin-bottom: 1rem;
        }

        .result-info strong {
          color: #333;
        }

        .result-value {
          background: white;
          padding: 0.75rem;
          border-radius: 6px;
          margin-top: 0.5rem;
          font-size: 0.95rem;
          color: #666;
        }

        .result-link {
          display: inline-block;
          background: white;
          padding: 0.75rem;
          border-radius: 6px;
          margin-top: 0.5rem;
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
        }

        .result-link:hover {
          text-decoration: underline;
        }

        .info-card {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 12px;
          border-right: 4px solid #667eea;
        }

        .info-card h3 {
          margin: 0 0 1rem 0;
          color: #333;
        }

        .info-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .info-card li {
          padding: 0.5rem 0;
          color: #666;
          line-height: 1.6;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          font-size: 1.2rem;
          color: #666;
        }

        @media (max-width: 768px) {
          .admin-container {
            padding: 1rem;
          }

          .admin-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .button-group {
            flex-direction: column;
          }

          .btn-primary, .btn-secondary {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
