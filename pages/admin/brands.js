import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const ITEMS_PER_PAGE = 20;

export default function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      setError(err.message);
      console.error('Error fetching data:', err);
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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading && brands.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">جاري تحميل الماركات...</p>
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
            onClick={fetchData}
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
        <title>إدارة الماركات - لوحة التحكم</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
        {/* Header */}
        <header className="bg-white shadow-md border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="text-4xl">🏢</span>
                  إدارة الماركات
                </h1>
                <p className="text-sm text-gray-600 mt-2">
                  إجمالي {brands.length} ماركة
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
                <span className="text-3xl">🏢</span>
                <h3 className="text-sm font-medium text-gray-600">إجمالي الماركات</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">{brands.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">📂</span>
                <h3 className="text-sm font-medium text-gray-600">العائلات</h3>
              </div>
              <p className="text-3xl font-bold text-green-600">{families.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🔍</span>
                <h3 className="text-sm font-medium text-gray-600">نتائج البحث</h3>
              </div>
              <p className="text-3xl font-bold text-blue-600">{filteredBrands.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">📄</span>
                <h3 className="text-sm font-medium text-gray-600">الصفحة الحالية</h3>
              </div>
              <p className="text-3xl font-bold text-purple-600">{currentPage} / {totalPages || 1}</p>
            </div>
          </div>

          {/* Search and Add */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
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
              <div className="md:pt-7">
                <button
                  onClick={() => handleOpenModal()}
                  className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <span className="text-xl">➕</span>
                  إضافة ماركة جديدة
                </button>
              </div>
            </div>
            {searchTerm && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  عرض {filteredBrands.length} من {brands.length} ماركة
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  إعادة تعيين البحث
                </button>
              </div>
            )}
          </div>

          {/* Brands Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedBrands.map((brand) => (
              <div
                key={brand.id}
                className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition overflow-hidden"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-bold">{brand.name}</h3>
                    <span className="text-3xl">🏢</span>
                  </div>
                  <p className="text-sm text-blue-100 font-mono">
                    {brand.slug}
                  </p>
                </div>

                {/* Body */}
                <div className="p-6">
                  {/* Logo */}
                  {brand.logo_url && (
                    <div className="mb-4 flex justify-center">
                      <img 
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${brand.logo_url}`}
                        alt={brand.name}
                        className="h-16 object-contain"
                      />
                    </div>
                  )}

                  {/* Families */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-600 mb-2">العائلات:</p>
                    <div className="flex flex-wrap gap-2">
                      {brand.families?.slice(0, 3).map(family => (
                        <span key={family.id} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {family.name}
                        </span>
                      ))}
                      {brand.families?.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{brand.families.length - 3}
                        </span>
                      )}
                      {(!brand.families || brand.families.length === 0) && (
                        <span className="text-xs text-gray-400">لا توجد عائلات</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleOpenModal(brand)}
                      className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-sm font-medium"
                    >
                      ✏️ تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(brand.id, brand.name)}
                      className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
                    >
                      🗑️ حذف
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  عرض {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredBrands.length)} من {filteredBrands.length}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    السابق
                  </button>
                  <span className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    التالي
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal - will be added in next iteration */}
    </>
  );
}
