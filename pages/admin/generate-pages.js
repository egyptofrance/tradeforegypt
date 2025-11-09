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
  const [allProducts, setAllProducts] = useState([]); // جميع المنتجات
  const [filteredProducts, setFilteredProducts] = useState([]); // المنتجات المفلترة
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  
  // Test Page Generation
  const [selectedBrandId, setSelectedBrandId] = useState('');
  const [selectedBrandSlug, setSelectedBrandSlug] = useState('');
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
    fetchInitialData();
  }, []);

  // جلب المنتجات عند اختيار ماركة
  useEffect(() => {
    if (selectedBrandId) {
      fetchProductsByBrand(selectedBrandId);
    } else {
      setFilteredProducts([]);
      setSelectedProduct('');
    }
  }, [selectedBrandId]);

  const fetchInitialData = async () => {
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
      setAllProducts(productsData);
      
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

  const fetchProductsByBrand = async (brandId) => {
    try {
      setProductsLoading(true);
      setFilteredProducts([]);
      setSelectedProduct('');
      
      const response = await fetch(`/api/products-by-brand?brandId=${brandId}`);
      const data = await response.json();
      
      if (data.success) {
        setFilteredProducts(data.products);
      } else {
        alert('حدث خطأ في جلب المنتجات');
      }
      
    } catch (err) {
      console.error('Error fetching products by brand:', err);
      alert('حدث خطأ في جلب المنتجات');
    } finally {
      setProductsLoading(false);
    }
  };

  const handleBrandChange = (e) => {
    const brandId = e.target.value;
    setSelectedBrandId(brandId);
    
    // البحث عن slug الماركة
    const brand = brands.find(b => b.id === parseInt(brandId));
    setSelectedBrandSlug(brand ? brand.slug : '');
  };

  const handleRunTest = async () => {
    if (!selectedBrandSlug || !selectedProduct || !selectedKeyword) {
      alert('يرجى اختيار الماركة والمنتج والكلمة المفتاحية');
      return;
    }

    setTestLoading(true);
    setTestResult(null);

    try {
      // بناء الرابط
      const testUrl = `/${selectedBrandSlug}/${selectedProduct}/${selectedKeyword}`;
      const fullUrl = `${window.location.origin}${testUrl}`;
      
      // محاولة الوصول للصفحة
      const response = await fetch(testUrl);
      
      if (response.ok) {
        const html = await response.text();
        
        // استخراج Title
        const titleMatch = html.match(/<title>(.*?)<\/title>/);
        const title = titleMatch ? titleMatch[1] : 'غير متوفر';
        
        // استخراج Meta Description
        const descMatch = html.match(/<meta name="description" content="(.*?)"/);
        const description = descMatch ? descMatch[1] : 'غير متوفر';
        
        // استخراج Canonical
        const canonicalMatch = html.match(/<link rel="canonical" href="(.*?)"/);
        const canonical = canonicalMatch ? canonicalMatch[1] : fullUrl;
        
        setTestResult({
          success: true,
          url: fullUrl,
          title,
          description,
          canonical,
          status: response.status
        });
      } else {
        setTestResult({
          success: false,
          url: fullUrl,
          error: `فشل توليد الصفحة (${response.status})`,
          status: response.status
        });
      }
      
    } catch (error) {
      setTestResult({
        success: false,
        url: `/${selectedBrandSlug}/${selectedProduct}/${selectedKeyword}`,
        error: error.message,
        status: 'خطأ'
      });
    } finally {
      setTestLoading(false);
    }
  };

  const handleRevalidate = async () => {
    if (!selectedBrandSlug || !selectedProduct || !selectedKeyword) {
      alert('يرجى اختيار الماركة والمنتج والكلمة المفتاحية');
      return;
    }

    setTestLoading(true);

    try {
      const path = `/${selectedBrandSlug}/${selectedProduct}/${selectedKeyword}`;
      const response = await fetch(`/api/revalidate?path=${encodeURIComponent(path)}`);
      const data = await response.json();
      
      if (data.revalidated) {
        alert(`✅ تم تحديث الصفحة: ${path}`);
        // إعادة اختبار الصفحة
        await handleRunTest();
      } else {
        alert(`❌ فشل تحديث الصفحة: ${data.message}`);
      }
      
    } catch (error) {
      alert(`❌ خطأ: ${error.message}`);
    } finally {
      setTestLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">جاري التحميل...</span>
          </div>
          <p className="mt-3">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>توليد الصفحات - Trade for Egypt</title>
      </Head>

      <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '2rem' }} dir="rtl">
        {/* Header */}
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            background: 'white', 
            borderRadius: '1rem', 
            padding: '2rem', 
            marginBottom: '2rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h1 style={{ margin: 0, fontSize: '2rem', color: '#333' }}>
                🚀 توليد الصفحات
              </h1>
              <Link href="/admin" style={{ 
                padding: '0.75rem 1.5rem', 
                background: '#6c757d', 
                color: 'white', 
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: '600'
              }}>
                ← العودة للوحة التحكم
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            <div style={{ 
              background: '#667eea', 
              color: 'white', 
              padding: '2rem', 
              borderRadius: '1rem',
              boxShadow: '0 4px 12px rgba(102,126,234,0.3)'
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', opacity: 0.9 }}>إجمالي الصفحات المتوقعة</h3>
              <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold' }}>
                {stats.estimatedPages.toLocaleString()}
              </p>
            </div>
            
            <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#666' }}>الكلمات المفتاحية</h3>
              <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold', color: '#333' }}>
                {stats.totalKeywords}
              </p>
            </div>
            
            <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#666' }}>عدد المنتجات</h3>
              <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold', color: '#333' }}>
                {stats.totalProducts}
              </p>
            </div>
            
            <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#666' }}>عدد الماركات</h3>
              <p style={{ margin: 0, fontSize: '2.5rem', fontWeight: 'bold', color: '#333' }}>
                {stats.totalBrands}
              </p>
            </div>
          </div>

          {/* Test Section */}
          <div style={{ 
            background: 'white', 
            borderRadius: '1rem', 
            padding: '2rem', 
            marginBottom: '2rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem', color: '#333' }}>
              🧪 اختبار توليد صفحة واحدة (RUN TEST)
            </h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              اختر ماركة ومنتج وكلمة مفتاحية لتوليد صفحة تجريبية والتحقق من جميع عناصر SEO
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {/* الماركة */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                  الماركة
                </label>
                <select 
                  value={selectedBrandId}
                  onChange={handleBrandChange}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    borderRadius: '0.5rem', 
                    border: '2px solid #e0e0e0',
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">اختر الماركة</option>
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name} ({brand.name_ar || brand.name})
                    </option>
                  ))}
                </select>
              </div>

              {/* المنتج */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                  المنتج
                </label>
                <select 
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  disabled={!selectedBrandId || productsLoading}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    borderRadius: '0.5rem', 
                    border: '2px solid #e0e0e0',
                    fontSize: '1rem',
                    cursor: selectedBrandId ? 'pointer' : 'not-allowed',
                    background: !selectedBrandId || productsLoading ? '#f5f5f5' : 'white'
                  }}
                >
                  <option value="">
                    {productsLoading ? 'جاري التحميل...' : selectedBrandId ? 'اختر المنتج' : 'اختر الماركة أولاً'}
                  </option>
                  {filteredProducts.map(product => (
                    <option key={product.id} value={product.slug}>
                      {product.name}
                    </option>
                  ))}
                </select>
                {selectedBrandId && filteredProducts.length === 0 && !productsLoading && (
                  <p style={{ color: '#dc3545', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    ⚠️ لا توجد منتجات مرتبطة بهذه الماركة
                  </p>
                )}
              </div>

              {/* الكلمة المفتاحية */}
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#333' }}>
                  الكلمة المفتاحية
                </label>
                <select 
                  value={selectedKeyword}
                  onChange={(e) => setSelectedKeyword(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '0.75rem', 
                    borderRadius: '0.5rem', 
                    border: '2px solid #e0e0e0',
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">اختر الكلمة</option>
                  {KEYWORDS.map(keyword => (
                    <option key={keyword.slug} value={keyword.slug}>
                      {keyword.name} ({keyword.slug})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={handleRunTest}
                disabled={testLoading || !selectedBrandSlug || !selectedProduct || !selectedKeyword}
                style={{
                  padding: '1rem 2rem',
                  background: testLoading ? '#ccc' : '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: testLoading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(102,126,234,0.3)'
                }}
              >
                {testLoading ? '⏳ جاري التوليد...' : '🧪 RUN TEST - توليد صفحة تجريبية'}
              </button>

              <button
                onClick={handleRevalidate}
                disabled={testLoading || !selectedBrandSlug || !selectedProduct || !selectedKeyword}
                style={{
                  padding: '1rem 2rem',
                  background: testLoading ? '#ccc' : 'white',
                  color: '#667eea',
                  border: '2px solid #667eea',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: testLoading ? 'not-allowed' : 'pointer'
                }}
              >
                🔄 تحديث الصفحة (Revalidate)
              </button>
            </div>

            {/* Test Result */}
            {testResult && (
              <div style={{ 
                marginTop: '2rem', 
                padding: '1.5rem', 
                background: testResult.success ? '#d4edda' : '#f8d7da',
                border: `2px solid ${testResult.success ? '#c3e6cb' : '#f5c6cb'}`,
                borderRadius: '0.5rem'
              }}>
                <h3 style={{ margin: '0 0 1rem 0', color: testResult.success ? '#155724' : '#721c24' }}>
                  {testResult.success ? '✅ نجح توليد الصفحة!' : '❌ فشل توليد الصفحة'}
                </h3>
                
                {testResult.success ? (
                  <>
                    <p style={{ margin: '0.5rem 0' }}><strong>الرابط:</strong> <a href={testResult.url} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>{testResult.url}</a></p>
                    <p style={{ margin: '0.5rem 0' }}><strong>Title:</strong> {testResult.title}</p>
                    <p style={{ margin: '0.5rem 0' }}><strong>Description:</strong> {testResult.description}</p>
                    <p style={{ margin: '0.5rem 0' }}><strong>Canonical:</strong> {testResult.canonical}</p>
                    <p style={{ margin: '0.5rem 0' }}><strong>Status:</strong> {testResult.status}</p>
                  </>
                ) : (
                  <>
                    <p style={{ margin: '0.5rem 0' }}><strong>الخطأ:</strong> {testResult.error}</p>
                    <p style={{ margin: '0.5rem 0' }}><strong>الرابط:</strong> {testResult.url}</p>
                    <p style={{ margin: '0.5rem 0', color: '#721c24' }}>
                      💡 تأكد من أن الماركة والمنتج مرتبطين في قاعدة البيانات (جدول brand_families)
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div style={{ 
            background: '#e7f3ff', 
            border: '2px solid #b3d9ff',
            borderRadius: '1rem', 
            padding: '1.5rem'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#004085', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ℹ️ معلومات مهمة
            </h3>
            <ul style={{ margin: 0, paddingRight: '1.5rem', color: '#004085' }}>
              <li style={{ marginBottom: '0.5rem' }}>✅ <strong>التوليد التلقائي (ISR):</strong> الصفحات تُولد تلقائياً عند زيارتها لأول مرة</li>
              <li style={{ marginBottom: '0.5rem' }}>✅ <strong>RUN TEST:</strong> لاختبار صفحة واحدة والتحقق من SEO</li>
              <li style={{ marginBottom: '0.5rem' }}>✅ <strong>Revalidate:</strong> لتحديث صفحة موجودة بعد تعديل قاعدة البيانات</li>
              <li style={{ marginBottom: '0.5rem' }}>⚠️ <strong>لا حاجة لزر RUN:</strong> لا تحاول توليد 194,688 صفحة دفعة واحدة!</li>
              <li style={{ marginBottom: '0.5rem' }}>🔄 <strong>التحديث التلقائي:</strong> كل صفحة تُحدّث تلقائياً كل ساعة</li>
              <li>🔗 <strong>القوائم الديناميكية:</strong> عند اختيار ماركة، تظهر فقط المنتجات المرتبطة بها</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
