import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function FamiliesManagement() {
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFamily, setEditingFamily] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '' });
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [familyProducts, setFamilyProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({ name: '', slug: '', description: '' });

  useEffect(() => {
    fetchFamilies();
  }, []);

  const fetchFamilies = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/families');
      const data = await response.json();
      
      // Fetch products count for each family
      const familiesWithProducts = await Promise.all(
        data.map(async (family) => {
          const productsRes = await fetch(`/api/admin/families?id=${family.id}&includeProducts=true`);
          const productsData = await productsRes.json();
          return {
            ...family,
            products: productsData.products || [],
            productsCount: productsData.products?.length || 0
          };
        })
      );
      
      setFamilies(familiesWithProducts);
    } catch (error) {
      console.error('Error fetching families:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingFamily ? 'PUT' : 'POST';
      const body = editingFamily 
        ? { ...formData, id: editingFamily.id }
        : formData;

      const response = await fetch('/api/admin/families', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        setShowModal(false);
        setEditingFamily(null);
        setFormData({ name: '', slug: '' });
        fetchFamilies();
      }
    } catch (error) {
      console.error('Error saving family:', error);
    }
  };

  const handleEdit = (family) => {
    setEditingFamily(family);
    setFormData({
      name: family.name,
      slug: family.slug
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذه العائلة؟')) return;

    try {
      const response = await fetch(`/api/admin/families?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchFamilies();
      }
    } catch (error) {
      console.error('Error deleting family:', error);
    }
  };

  const handleAddNew = () => {
    setEditingFamily(null);
    setFormData({ name: '', slug: '' });
    setShowModal(true);
  };

  const handleManageProducts = async (family) => {
    setSelectedFamily(family);
    setFamilyProducts(family.products || []);
    setShowProductsModal(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductFormData({ name: '', slug: '', description: '' });
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || ''
    });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const body = {
        ...productFormData,
        family_id: selectedFamily.id,
        ...(editingProduct && { id: editingProduct.id })
      };

      const response = await fetch('/api/admin/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        setEditingProduct(null);
        setProductFormData({ name: '', slug: '', description: '' });
        // Refresh products
        const productsRes = await fetch(`/api/admin/families?id=${selectedFamily.id}&includeProducts=true`);
        const productsData = await productsRes.json();
        setFamilyProducts(productsData.products || []);
        // Refresh families
        fetchFamilies();
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('حدث خطأ أثناء الحفظ');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;

    try {
      const response = await fetch(`/api/admin/products?id=${productId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Refresh products
        const productsRes = await fetch(`/api/admin/families?id=${selectedFamily.id}&includeProducts=true`);
        const productsData = await productsRes.json();
        setFamilyProducts(productsData.products || []);
        // Refresh families
        fetchFamilies();
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('حدث خطأ أثناء الحذف');
    }
  };

  return (
    <>
      <Head>
        <title>إدارة العائلات - Trade for Egypt</title>
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
                <span style={{ fontSize: '2rem' }}>📦</span>
                إدارة العائلات
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
                إدارة عائلات المنتجات في النظام
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={handleAddNew}
                style={{
                  padding: '0.625rem 1.25rem',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 1px 2px rgba(59, 130, 246, 0.3)'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#2563eb'}
                onMouseOut={(e) => e.currentTarget.style.background = '#3b82f6'}
              >
                + إضافة عائلة جديدة
              </button>
              <Link
                href="/admin"
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
                ← العودة للوحة التحكم
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                border: '4px solid #e2e8f0',
                borderTop: '4px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto'
              }}></div>
              <style jsx>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ) : (
            <div style={{
              background: 'white',
              borderRadius: '0.75rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              border: '1px solid #e2e8f0',
              overflow: 'hidden'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: '#475569', fontSize: '0.875rem' }}>
                      الاسم
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: '#475569', fontSize: '0.875rem' }}>
                      Slug
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', color: '#475569', fontSize: '0.875rem' }}>
                      المنتجات
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', color: '#475569', fontSize: '0.875rem' }}>
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {families.map((family) => (
                    <tr key={family.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '1rem', color: '#1e293b', fontWeight: '600' }}>
                        {family.name}
                      </td>
                      <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
                        {family.slug}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        {family.productsCount > 0 ? (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                            {family.products.slice(0, 3).map(product => (
                              <span
                                key={product.id}
                                style={{
                                  padding: '0.25rem 0.625rem',
                                  background: '#f0fdf4',
                                  color: '#16a34a',
                                  borderRadius: '0.375rem',
                                  fontSize: '0.75rem',
                                  fontWeight: '500'
                                }}
                              >
                                {product.name}
                              </span>
                            ))}
                            {family.productsCount > 3 && (
                              <span style={{ 
                                padding: '0.25rem 0.625rem',
                                color: '#64748b',
                                fontSize: '0.75rem',
                                fontWeight: '500'
                              }}>
                                +{family.productsCount - 3} منتج
                              </span>
                            )}
                          </div>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                            لا توجد منتجات
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => handleManageProducts(family)}
                            style={{
                              padding: '0.5rem 1rem',
                              background: '#10b981',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#059669'}
                            onMouseOut={(e) => e.currentTarget.style.background = '#10b981'}
                          >
                            📋 إدارة المنتجات
                          </button>
                          <button
                            onClick={() => handleEdit(family)}
                            style={{
                              padding: '0.5rem 1rem',
                              background: '#3b82f6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#2563eb'}
                            onMouseOut={(e) => e.currentTarget.style.background = '#3b82f6'}
                          >
                            تعديل
                          </button>
                          <button
                            onClick={() => handleDelete(family.id)}
                            style={{
                              padding: '0.5rem 1rem',
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.375rem',
                              fontSize: '0.875rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#dc2626'}
                            onMouseOut={(e) => e.currentTarget.style.background = '#ef4444'}
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }} onClick={() => setShowModal(false)}>
            <div style={{
              background: 'white',
              borderRadius: '0.75rem',
              padding: '2rem',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }} onClick={(e) => e.stopPropagation()}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', marginBottom: '1.5rem' }}>
                {editingFamily ? 'تعديل العائلة' : 'إضافة عائلة جديدة'}
              </h2>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>
                    اسم العائلة *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      transition: 'all 0.2s'
                    }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      transition: 'all 0.2s'
                    }}
                  />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>
                    الوصف
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      transition: 'all 0.2s',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{
                      padding: '0.625rem 1.25rem',
                      background: 'white',
                      color: '#475569',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '0.625rem 1.25rem',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#2563eb'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#3b82f6'}
                  >
                    {editingFamily ? 'تحديث' : 'إضافة'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Products Management Modal */}
        {showProductsModal && selectedFamily && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001,
            padding: '1rem'
          }} onClick={() => setShowProductsModal(false)}>
            <div style={{
              background: 'white',
              borderRadius: '0.75rem',
              padding: '2rem',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }} onClick={(e) => e.stopPropagation()}>
              <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
                  إدارة منتجات: {selectedFamily.name}
                </h2>
                <button
                  onClick={() => setShowProductsModal(false)}
                  style={{
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: '0.375rem',
                    padding: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '1.25rem',
                    lineHeight: 1
                  }}
                >
                  ×
                </button>
              </div>

              {/* Add/Edit Product Form */}
              <form onSubmit={handleSaveProduct} style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>
                      اسم المنتج *
                    </label>
                    <input
                      type="text"
                      value={productFormData.name}
                      onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>
                      Slug *
                    </label>
                    <input
                      type="text"
                      value={productFormData.slug}
                      onChange={(e) => setProductFormData({ ...productFormData, slug: e.target.value })}
                      required
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>
                    الوصف
                  </label>
                  <textarea
                    value={productFormData.description}
                    onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                    rows={2}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="submit"
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    {editingProduct ? 'تحديث' : 'إضافة'} المنتج
                  </button>
                  {editingProduct && (
                    <button
                      type="button"
                      onClick={handleAddProduct}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#94a3b8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        cursor: 'pointer'
                      }}
                    >
                      إلغاء التعديل
                    </button>
                  )}
                </div>
              </form>

              {/* Products List */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '0.5rem', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '600', color: '#475569', fontSize: '0.875rem' }}>
                        المنتج
                      </th>
                      <th style={{ padding: '0.75rem', textAlign: 'right', fontWeight: '600', color: '#475569', fontSize: '0.875rem' }}>
                        Slug
                      </th>
                      <th style={{ padding: '0.75rem', textAlign: 'center', fontWeight: '600', color: '#475569', fontSize: '0.875rem' }}>
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {familyProducts.length === 0 ? (
                      <tr>
                        <td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
                          لا توجد منتجات في هذه العائلة
                        </td>
                      </tr>
                    ) : (
                      familyProducts.map((product) => (
                        <tr key={product.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '0.75rem', color: '#1e293b', fontWeight: '600', fontSize: '0.875rem' }}>
                            {product.name}
                          </td>
                          <td style={{ padding: '0.75rem', color: '#64748b', fontSize: '0.875rem' }}>
                            {product.slug}
                          </td>
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                              <button
                                onClick={() => handleEditProduct(product)}
                                style={{
                                  padding: '0.375rem 0.75rem',
                                  background: '#3b82f6',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '0.375rem',
                                  fontSize: '0.75rem',
                                  cursor: 'pointer'
                                }}
                              >
                                تعديل
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                style={{
                                  padding: '0.375rem 0.75rem',
                                  background: '#ef4444',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '0.375rem',
                                  fontSize: '0.75rem',
                                  cursor: 'pointer'
                                }}
                              >
                                حذف
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
