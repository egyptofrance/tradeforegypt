import Head from 'next/head';
import { Tajawal } from 'next/font/google';
import "swiper/css";
import "swiper/css/navigation";
import "react-modal-video/css/modal-video.css"
import '../public/assets/css/style.css';
import '../styles/globals.css';
import { useEffect, useState } from "react";
import Preloader from '../components/elements/Preloader';

const tajawal = Tajawal({
  weight: ['300', '400', '500', '700', '800'],
  subsets: ['arabic'],
  display: 'swap',
});

function MyApp({ Component, pageProps }) {
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 2000);

        const WOW = require('wowjs');
        window.wow = new WOW.WOW({
            live: false
        });
        window.wow.init();
    }, []);
    return (
        <>
            <style jsx global>{`
                html {
                    font-family: ${tajawal.style.fontFamily};
                }
            `}</style>
            {!loading ? (
                <Component {...pageProps} />
            ) : (
                <Preloader />
            )}
        </>
    )
}

export default MyApp
