import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const ITEMS_PER_PAGE = 20;

export default function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const { data: brandsData, error: brandsError } = await supabase
        .from('brands')
        .select('*')
        .order('name', { ascending: true });
      
      if (brandsError) throw brandsError;
      
      const { data: familiesData, error: familiesError } = await supabase
        .from('families')
        .select('*')
        .order('name', { ascending: true });
      
      if (familiesError) throw familiesError;
      
      const { data: relationsData } = await supabase
        .from('brand_families')
        .select('brand_id, family_id');
      
      const brandsWithFamilies = brandsData.map(brand => ({
        ...brand,
        families: relationsData
          .filter(rel => rel.brand_id === brand.id)
          .map(rel => familiesData.find(fam => fam.id === rel.family_id))
          .filter(Boolean)
      }));
      
      setBrands(brandsWithFamilies);
      setFamilies(familiesData);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBrands = brands.filter(brand =>
    brand.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBrands.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBrands = filteredBrands.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: '3rem', marginBottom: '1rem'}}>⏳</div>
          <p className="font-md color-grey-500">جاري تحميل الماركات...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>إدارة الماركات - لوحة التحكم</title>
      </Head>

      <div style={{minHeight: '100vh', background: '#f7f7f7', paddingBottom: '50px'}} dir="rtl">
        {/* Header */}
        <section className="section" style={{background: '#fff', borderBottom: '1px solid #e5e5e5', marginBottom: '30px'}}>
          <div className="container">
            <div className="row align-items-center" style={{padding: '30px 0'}}>
              <div className="col-lg-8">
                <h1 className="color-brand-1 mb-20" style={{fontSize: '2.5rem'}}>
                  🏢 إدارة الماركات
                </h1>
                <p className="font-md color-grey-500">
                  إجمالي {brands.length} ماركة • {families.length} عائلة
                </p>
              </div>
              <div className="col-lg-4 text-end">
                <Link href="/admin">
                  <a className="btn btn-default" style={{background: '#10b981', color: '#fff', border: 'none'}}>
                    ← العودة للوحة التحكم
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="container">
          {/* Stats Cards */}
          <div className="row" style={{marginBottom: '30px'}}>
            <div className="col-lg-3 col-md-6 mb-20">
              <div style={{
                background: '#fff',
                padding: '25px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: '1px solid #e5e5e5'
              }}>
                <div style={{fontSize: '2rem', marginBottom: '10px'}}>🏢</div>
                <p className="font-sm color-grey-500" style={{marginBottom: '5px'}}>إجمالي الماركات</p>
                <h3 className="color-brand-1" style={{fontSize: '2rem', fontWeight: 'bold', margin: 0}}>
                  {brands.length}
                </h3>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-20">
              <div style={{
                background: '#fff',
                padding: '25px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: '1px solid #e5e5e5'
              }}>
                <div style={{fontSize: '2rem', marginBottom: '10px'}}>📂</div>
                <p className="font-sm color-grey-500" style={{marginBottom: '5px'}}>العائلات</p>
                <h3 style={{fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#10b981'}}>
                  {families.length}
                </h3>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-20">
              <div style={{
                background: '#fff',
                padding: '25px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: '1px solid #e5e5e5'
              }}>
                <div style={{fontSize: '2rem', marginBottom: '10px'}}>🔍</div>
                <p className="font-sm color-grey-500" style={{marginBottom: '5px'}}>نتائج البحث</p>
                <h3 style={{fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#3b82f6'}}>
                  {filteredBrands.length}
                </h3>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 mb-20">
              <div style={{
                background: '#fff',
                padding: '25px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: '1px solid #e5e5e5'
              }}>
                <div style={{fontSize: '2rem', marginBottom: '10px'}}>📄</div>
                <p className="font-sm color-grey-500" style={{marginBottom: '5px'}}>الصفحة الحالية</p>
                <h3 style={{fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#8b5cf6'}}>
                  {currentPage} / {totalPages || 1}
                </h3>
              </div>
            </div>
          </div>

          {/* Search and Add */}
          <div style={{
            background: '#fff',
            padding: '25px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: '1px solid #e5e5e5',
            marginBottom: '30px'
          }}>
            <div className="row align-items-end">
              <div className="col-lg-8 mb-20">
                <label className="font-sm-bold color-brand-1 mb-10" style={{display: 'block'}}>
                  🔍 بحث عن ماركة
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="ابحث عن ماركة..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{
                    padding: '12px 20px',
                    fontSize: '1rem',
                    border: '2px solid #e5e5e5',
                    borderRadius: '8px'
                  }}
                />
              </div>
              <div className="col-lg-4 mb-20">
                <button className="btn btn-default w-100" style={{
                  background: 'linear-gradient(90deg, #3b82f6, #2563eb)',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 20px',
                  fontSize: '1rem',
                  fontWeight: 'bold'
                }}>
                  ➕ إضافة ماركة جديدة
                </button>
              </div>
            </div>
          </div>

          {/* Brands Grid */}
          <div className="row">
            {paginatedBrands.map((brand) => (
              <div key={brand.id} className="col-lg-4 col-md-6 mb-30">
                <div className="card-offer-style-2" style={{
                  background: '#fff',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  border: '1px solid #e5e5e5',
                  transition: 'all 0.3s'
                }}>
                  {/* Card Header */}
                  <div style={{
                    background: 'linear-gradient(90deg, #3b82f6, #2563eb)',
                    padding: '20px',
                    color: '#fff'
                  }}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <h4 style={{margin: 0, fontSize: '1.5rem', fontWeight: 'bold'}}>
                        {brand.name}
                      </h4>
                      <span style={{fontSize: '2rem'}}>🏢</span>
                    </div>
                    <p style={{
                      margin: '8px 0 0 0',
                      fontSize: '0.875rem',
                      opacity: 0.9,
                      fontFamily: 'monospace'
                    }}>
                      {brand.slug}
                    </p>
                  </div>

                  {/* Card Body */}
                  <div style={{padding: '20px'}}>
                    {/* Families */}
                    <div style={{marginBottom: '15px'}}>
                      <p className="font-sm-bold color-grey-500" style={{marginBottom: '10px'}}>
                        العائلات:
                      </p>
                      <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                        {brand.families?.slice(0, 3).map((family, idx) => (
                          <span key={idx} style={{
                            background: '#dbeafe',
                            color: '#1e40af',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}>
                            {family.name}
                          </span>
                        ))}
                        {brand.families?.length > 3 && (
                          <span style={{
                            background: '#f3f4f6',
                            color: '#6b7280',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}>
                            +{brand.families.length - 3}
                          </span>
                        )}
                        {(!brand.families || brand.families.length === 0) && (
                          <span className="font-sm color-grey-400" style={{fontStyle: 'italic'}}>
                            لا توجد عائلات
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{
                      display: 'flex',
                      gap: '10px',
                      paddingTop: '15px',
                      borderTop: '1px solid #e5e5e5'
                    }}>
                      <button className="btn btn-default" style={{
                        flex: 1,
                        background: '#f59e0b',
                        color: '#fff',
                        border: 'none',
                        padding: '10px',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}>
                        ✏️ تعديل
                      </button>
                      <button className="btn btn-default" style={{
                        flex: 1,
                        background: '#ef4444',
                        color: '#fff',
                        border: 'none',
                        padding: '10px',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}>
                        🗑️ حذف
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{
              background: '#fff',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: '1px solid #e5e5e5',
              marginTop: '30px'
            }}>
              <div className="row align-items-center">
                <div className="col-lg-6 mb-15">
                  <p className="font-sm color-grey-500">
                    عرض {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredBrands.length)} من {filteredBrands.length}
                  </p>
                </div>
                <div className="col-lg-6 mb-15">
                  <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '15px'}}>
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="btn btn-default"
                      style={{
                        background: currentPage === 1 ? '#d1d5db' : '#3b82f6',
                        color: '#fff',
                        border: 'none',
                        padding: '8px 20px',
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      السابق
                    </button>
                    <span className="font-sm-bold color-brand-1">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="btn btn-default"
                      style={{
                        background: currentPage === totalPages ? '#d1d5db' : '#3b82f6',
                        color: '#fff',
                        border: 'none',
                        padding: '8px 20px',
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                      }}
                    >
                      التالي
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
