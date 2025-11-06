import Head from 'next/head';
import React from 'react';
import Layout from '../components/layout/Layout';
import { supabase } from '../lib/supabase';

const TestDB = ({ families, brands, products, pages, error }) => {
    return (
        <>
            <Head>
                <title>اختبار الاتصال بقاعدة البيانات</title>
            </Head>

            <Layout>
                <section className="section pt-90 pb-90">
                    <div className="container">
                        <h1 className="color-brand-1 mb-30">اختبار الاتصال بقاعدة البيانات Supabase</h1>
                        
                        {error && (
                            <div className="alert alert-danger">
                                <strong>خطأ:</strong> {error}
                            </div>
                        )}

                        {!error && (
                            <>
                                <div className="mb-50">
                                    <h3 className="color-brand-1">العائلات (Families)</h3>
                                    <p>عدد العائلات: {families?.length || 0}</p>
                                    <ul>
                                        {families?.slice(0, 5).map((family) => (
                                            <li key={family.id}>{family.name}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mb-50">
                                    <h3 className="color-brand-1">الماركات (Brands)</h3>
                                    <p>عدد الماركات: {brands?.length || 0}</p>
                                    <ul>
                                        {brands?.slice(0, 5).map((brand) => (
                                            <li key={brand.id}>{brand.name}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mb-50">
                                    <h3 className="color-brand-1">المنتجات (Products)</h3>
                                    <p>عدد المنتجات: {products?.length || 0}</p>
                                    <ul>
                                        {products?.slice(0, 5).map((product) => (
                                            <li key={product.id}>{product.name}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mb-50">
                                    <h3 className="color-brand-1">الصفحات (Pages)</h3>
                                    <p>عدد الصفحات: {pages?.length || 0}</p>
                                    <ul>
                                        {pages?.slice(0, 10).map((page) => (
                                            <li key={page.id}>
                                                <a href={`/brand/${page.slug}`}>{page.page_title}</a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </Layout>
        </>
    );
};

export async function getServerSideProps() {
    try {
        // جلب العائلات
        const { data: families, error: familiesError } = await supabase
            .from('families')
            .select('*');

        // جلب الماركات
        const { data: brands, error: brandsError } = await supabase
            .from('brands')
            .select('*');

        // جلب المنتجات
        const { data: products, error: productsError } = await supabase
            .from('products')
            .select('*');

        // جلب الصفحات
        const { data: pages, error: pagesError } = await supabase
            .from('pages')
            .select('*')
            .limit(10);

        if (familiesError || brandsError || productsError || pagesError) {
            return {
                props: {
                    error: 'حدث خطأ في الاتصال بقاعدة البيانات',
                    families: null,
                    brands: null,
                    products: null,
                    pages: null
                }
            };
        }

        return {
            props: {
                families: families || [],
                brands: brands || [],
                products: products || [],
                pages: pages || [],
                error: null
            }
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            props: {
                error: error.message,
                families: null,
                brands: null,
                products: null,
                pages: null
            }
        };
    }
}

export default TestDB;
