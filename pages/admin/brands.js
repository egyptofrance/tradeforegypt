import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    meta_title: '',
    meta_description: '',
    logo_url: '',
    banner_url: '',
    cover_url: '',
    selectedFamilies: []
  });
  const [uploading, setUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

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
      alert('خطأ في تحميل البيانات: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (brand = null) => {
    if (brand) {
      setEditingBrand(brand);
      setFormData({
        name: brand.name || '',
        slug: brand.slug || '',
        description: brand.description || '',
        meta_title: brand.meta_title || '',
        meta_description: brand.meta_description || '',
        logo_url: brand.logo_url || '',
        banner_url: brand.banner_url || '',
        cover_url: brand.cover_url || '',
        selectedFamilies: brand.families?.map(f => f.id) || []
      });
    } else {
      setEditingBrand(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        meta_title: '',
        meta_description: '',
        logo_url: '',
        banner_url: '',
        cover_url: '',
        selectedFamilies: []
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBrand(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'name' && !editingBrand) {
      const slug = value
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleFamilyToggle = (familyId) => {
    setFormData(prev => ({
      ...prev,
      selectedFamilies: prev.selectedFamilies.includes(familyId)
        ? prev.selectedFamilies.filter(id => id !== familyId)
        : [...prev.selectedFamilies, familyId]
    }));
  };

  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${formData.slug || 'brand'}-${type}-${Date.now()}.${fileExt}`;
      const filePath = `brands/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('brands')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      setFormData(prev => ({
        ...prev,
        [`${type}_url`]: filePath
      }));

      alert(`تم رفع ${type === 'logo' ? 'الشعار' : type === 'banner' ? 'البنر' : 'الغلاف'} بنجاح!`);
    } catch (err) {
      alert(`خطأ في رفع الصورة: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      const brandData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        meta_title: formData.meta_title,
        meta_description: formData.meta_description,
        logo_url: formData.logo_url,
        banner_url: formData.banner_url,
        cover_url: formData.cover_url
      };

      let brandId;

      if (editingBrand) {
        const { error: updateError } = await supabase
          .from('brands')
          .update(brandData)
          .eq('id', editingBrand.id);
        
        if (updateError) throw updateError;
        brandId = editingBrand.id;
      } else {
        const { data: newBrand, error: insertError } = await supabase
          .from('brands')
          .insert([brandData])
          .select()
          .single();
        
        if (insertError) throw insertError;
        brandId = newBrand.id;
      }

      await supabase
        .from('brand_families')
        .delete()
        .eq('brand_id', brandId);

      if (formData.selectedFamilies.length > 0) {
        const relations = formData.selectedFamilies.map(familyId => ({
          brand_id: brandId,
          family_id: familyId
        }));

        const { error: relationsError } = await supabase
          .from('brand_families')
          .insert(relations);
        
        if (relationsError) throw relationsError;
      }

      alert(editingBrand ? 'تم تحديث الماركة بنجاح!' : 'تم إضافة الماركة بنجاح!');
      handleCloseModal();
      fetchData();
    } catch (err) {
      alert(`خطأ: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (brandId, brandName) => {
    if (!confirm(`هل أنت متأكد من حذف الماركة "${brandName}"؟`)) {
      return;
    }

    try {
      setLoading(true);
      
      await supabase
        .from('brand_families')
        .delete()
        .eq('brand_id', brandId);

      const { error: deleteError } = await supabase
        .from('brands')
        .delete()
        .eq('id', brandId);
      
      if (deleteError) throw deleteError;

      alert('تم حذف الماركة بنجاح!');
      fetchData();
    } catch (err) {
      alert(`خطأ في الحذف: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    brand.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBrands.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBrands = filteredBrands.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (loading && brands.length === 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', border: '4px solid #e5e7eb', borderTop: '4px solid #2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#6b7280', fontSize: '18px' }}>جاري تحميل الماركات...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>إدارة الماركات | Trade for Egypt</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)', padding: '32px 16px' }} dir="rtl">
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>إدارة الماركات</h1>
                <p style={{ color: '#6b7280' }}>إضافة وتعديل وحذف الماركات</p>
              </div>
              <Link href="/admin" style={{ padding: '12px 24px', background: '#4b5563', color: 'white', borderRadius: '8px', textDecoration: 'none', display: 'inline-block', transition: 'background 0.3s' }}>
                العودة للوحة التحكم
              </Link>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '16px' }}>
                <div style={{ color: '#2563eb', fontSize: '24px', fontWeight: 'bold' }}>{brands.length}</div>
                <div style={{ color: '#1e40af', fontSize: '14px' }}>إجمالي الماركات</div>
              </div>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '16px' }}>
                <div style={{ color: '#16a34a', fontSize: '24px', fontWeight: 'bold' }}>{families.length}</div>
                <div style={{ color: '#15803d', fontSize: '14px' }}>إجمالي العائلات</div>
              </div>
              <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '8px', padding: '16px' }}>
                <div style={{ color: '#9333ea', fontSize: '24px', fontWeight: 'bold' }}>{filteredBrands.length}</div>
                <div style={{ color: '#7e22ce', fontSize: '14px' }}>نتائج البحث</div>
              </div>
            </div>

            {/* Search and Add */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="ابحث عن ماركة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ flex: '1', minWidth: '200px', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '16px' }}
              />
              <button
                onClick={() => handleOpenModal()}
                style={{ padding: '12px 24px', background: '#2563eb', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500', whiteSpace: 'nowrap' }}
              >
                ➕ إضافة ماركة جديدة
              </button>
            </div>
          </div>

          {/* Brands Table */}
          <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <tr>
                    <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#374151' }}>#</th>
                    <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#374151' }}>الشعار</th>
                    <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#374151' }}>الاسم</th>
                    <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Slug</th>
                    <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#374151' }}>العائلات</th>
                    <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#374151' }}>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBrands.map((brand, index) => (
                    <tr key={brand.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6b7280' }}>{startIndex + index + 1}</td>
                      <td style={{ padding: '16px 24px' }}>
                        {brand.logo_url ? (
                          <img 
                            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${brand.logo_url}`}
                            alt={brand.name}
                            style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '4px' }}
                          />
                        ) : (
                          <div style={{ width: '48px', height: '48px', background: '#e5e7eb', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#9ca3af' }}>
                            لا يوجد
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '500', color: '#111827' }}>{brand.name}</td>
                      <td style={{ padding: '16px 24px', fontSize: '14px', color: '#6b7280', fontFamily: 'monospace' }}>{brand.slug}</td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {brand.families?.slice(0, 3).map(family => (
                            <span key={family.id} style={{ padding: '4px 8px', background: '#dbeafe', color: '#1e40af', fontSize: '12px', borderRadius: '4px' }}>
                              {family.name}
                            </span>
                          ))}
                          {brand.families?.length > 3 && (
                            <span style={{ padding: '4px 8px', background: '#f3f4f6', color: '#6b7280', fontSize: '12px', borderRadius: '4px' }}>
                              +{brand.families.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                          <button
                            onClick={() => handleOpenModal(brand)}
                            style={{ padding: '8px 16px', background: '#eab308', color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                          >
                            ✏️ تعديل
                          </button>
                          <button
                            onClick={() => handleDelete(brand.id, brand.name)}
                            style={{ padding: '8px 16px', background: '#ef4444', color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                          >
                            🗑️ حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ background: '#f9fafb', padding: '16px 24px', borderTop: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    عرض {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredBrands.length)} من {filteredBrands.length}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      style={{ padding: '8px 16px', background: 'white', border: '1px solid #d1d5db', borderRadius: '8px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
                    >
                      السابق
                    </button>
                    <span style={{ padding: '8px 16px', background: '#2563eb', color: 'white', borderRadius: '8px' }}>
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      style={{ padding: '8px 16px', background: 'white', border: '1px solid #d1d5db', borderRadius: '8px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
                    >
                      التالي
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal - سيتم إضافته في الجزء التالي */}
    </>
  );
}
