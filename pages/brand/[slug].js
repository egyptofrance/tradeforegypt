import Head from 'next/head';
import React from 'react';
import Layout from '../../components/layout/Layout';
import { supabase } from '../../lib/supabase';
import SEOHead from '../../components/SEOHead';

const BrandPage = ({ page }) => {
    if (!page) {
        return (
            <Layout>
                <div className="container mt-50 mb-50">
                    <h1>الصفحة غير موجودة</h1>
                </div>
            </Layout>
        );
    }

    return (
        <>
            <SEOHead page={page} />

            <Layout>
                <section className="section pt-90">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <h1 className="color-brand-1 mb-30">{page.page_title}</h1>
                                <div 
                                    className="content" 
                                    dangerouslySetInnerHTML={{ __html: page.page_content }}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </Layout>
        </>
    );
};

export async function getStaticPaths() {
    try {
        // جلب جميع الصفحات من قاعدة البيانات
        const { data: pages, error } = await supabase
            .from('pages')
            .select('slug');

        if (error) {
            console.error('Error fetching paths:', error);
            return {
                paths: [],
                fallback: 'blocking'
            };
        }

        // تحويل المسارات إلى الصيغة المطلوبة
        const paths = pages.map((page) => ({
            params: { slug: page.slug }
        }));  

        return {
            paths,
            fallback: 'blocking'
        };
    } catch (error) {
        console.error('Error in getStaticPaths:', error);
        return {
            paths: [],
            fallback: 'blocking'
        };
    }
}

export async function getStaticProps({ params }) {
    try {
        const { slug } = params;

        // جلب بيانات الصفحة من قاعدة البيانات
        const { data: page, error } = await supabase
            .from('pages')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error || !page) {
            console.error('Error fetching page:', error);
            return {
                notFound: true,
                revalidate: 60
            };
        }

        return {
            props: {
                page
            },
            revalidate: 3600 // إعادة التوليد كل ساعة
        };
    } catch (error) {
        console.error('Error in getStaticProps:', error);
        return {
            notFound: true,
            revalidate: 60
        };
    }
}

export default BrandPage;
