import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function FamiliesManagement() {
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFamily, setEditingFamily] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' });

  useEffect(() => {
    fetchFamilies();
  }, []);

  const fetchFamilies = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/families');
      const data = await response.json();
      setFamilies(data);
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
        setFormData({ name: '', slug: '', description: '' });
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
      slug: family.slug,
      description: family.description || ''
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
    setFormData({ name: '', slug: '', description: '' });
    setShowModal(true);
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
                      الوصف
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
                      <td style={{ padding: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
                        {family.description || '-'}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
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
      </div>
    </>
  );
}
