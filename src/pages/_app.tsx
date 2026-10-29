import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { Inter, Plus_Jakarta_Sans, Alex_Brush, Bodoni_Moda } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import { AnalyticsTracker } from '../components/AnalyticsTracker';

import '../index.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

const alexBrush = Alex_Brush({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cursive',
});

const bodoniModa = Bodoni_Moda({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
});

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Ensure every page always opens strictly from the top (0, 0)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      window.scrollTo(0, 0);

      const handleRouteChange = () => {
        window.scrollTo(0, 0);
      };

      router.events.on('routeChangeComplete', handleRouteChange);
      return () => {
        router.events.off('routeChangeComplete', handleRouteChange);
      };
    }
  }, [router.events]);

  const cleanPath = router.asPath.split('?')[0].split('#')[0];
  const canonicalUrl = `https://www.mrsaqib.me${cleanPath === '/' ? '' : cleanPath}`;

  const unifiedSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.mrsaqib.me/#website",
        "url": "https://www.mrsaqib.me",
        "name": "Mr Saqib Developer Portfolio",
        "publisher": { "@id": "https://www.mrsaqib.me/#person" }
      },
      {
        "@type": "Person",
        "@id": "https://www.mrsaqib.me/#person",
        "name": "Muhammad Saqib",
        "alternateName": ["Mr Saqib", "mrsaqib242", "Saqib 242", "Saqib Dev"],
        "telephone": "03478936242",
        "email": "mrsaqib242242@gmail.com",
        "jobTitle": "Cyber Security Expert & Full-Stack App Developer",
        "url": "https://www.mrsaqib.me",
        "description": "Muhammad Saqib (Mr Saqib) is an elite cyber security specialist, full-stack engineer, and cross-platform app architect recognized for building impenetrable digital systems.",
        "sameAs": [
          "https://github.com/mr-saqib-242",
          "https://github.com/mrsaqib242",
          "https://www.instagram.com/mr_saqib242",
          "https://t.me/mrsaqib242",
          "https://wa.me/923478936242",
          "https://www.whatsapp.com/channel/0029VbBTSK1EquiWrUt5uV1I"
        ],
        "knowsAbout": [
          "CyberSecurity", "ApplicationSecurity", "WebApplicationSecurity", "PenetrationTesting", 
          "ZeroTrustArchitecture", "DatabaseSecurity", "RowLevelSecurity", "Supabase", "PostgreSQL", 
          "NodeJs", "ExpressJs", "RESTfulAPI", "JSONWebToken", "NextJs", "ReactJs", "TypeScript", 
          "TailwindCSS", "FramerMotion", "ProgressiveWebApps", "MobileAppDevelopment"
        ]
      },
      {
        "@type": "ProfessionalService",
        "@id": "https://www.mrsaqib.me/#service",
        "name": "Mr Saqib Web Development & Local SEO Services",
        "url": "https://www.mrsaqib.me",
        "telephone": "03478936242",
        "email": "mrsaqib242242@gmail.com",
        "founder": { "@id": "https://www.mrsaqib.me/#person" },
        "areaServed": ["Gojra", "Faisalabad", "Lahore", "Islamabad", "Karachi"],
        "priceRange": "$$"
      },
            {
        "@type": "FAQPage",
        "@id": "https://www.mrsaqib.me/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What high-end web development services does Muhammad Saqib provide in Pakistan?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Based in Gojra, Pakistan, Muhammad Saqib (known online as mrsaqib242) engineers high-performance web applications using the Next.js 15 App Router and React 19. His specialized services include full-stack SaaS frontend development, creative visual arts, and sub-0.4 second Core Web Vitals optimization. By leveraging React Server Components (RSC) and edge computing deployments, MrSaqib delivers highly scalable, zero-hydration-error digital infrastructures for both enterprise and international local markets."
            }
          },
          {
            "@type": "Question",
            "name": "How does mrsaqib242 integrate AI chatbots into modern Next.js websites?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Muhammad Saqib integrates custom AI chatbots into Next.js architectures utilizing advanced Natural Language Processing (NLP) and Retrieval-Augmented Generation (RAG) models. Operating from Faisalabad, his integrations securely process enterprise data, which can reduce customer support response times by up to 80 percent and significantly increase user engagement metrics. These tailored AI solutions seamlessly blend generative AI capabilities with flawless frontend UI/UX design via strict TypeScript enforcement."
            }
          },
          {
            "@type": "Question",
            "name": "Why should international clients hire Muhammad Saqib for Next.js and AI projects?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "International clients hire Muhammad Saqib for his elite mastery of modern web architecture and generative AI integrations, delivering enterprise-grade code directly from Gojra, Pakistan. His comprehensive portfolio demonstrates a commitment to resolving complex technical challenges, including zero-hydration-error development and dynamic Answer Engine Optimization (AEO). MrSaqib provides a unique synthesis of high-end software engineering and creative visual arts, resulting in digital products that outperform competitors in both algorithmic visibility and aesthetic conversion rates."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className={`${inter.variable} ${plusJakartaSans.variable} ${alexBrush.variable} ${bodoniModa.variable} font-sans`}>
      <Head>
        <title key="title">Mr Saqib (Saqib 242) | Best Web Developer & Local SEO Expert in Faisalabad, Gojra, Pakistan</title>
        <meta key="viewport" name="viewport" content="width=device-width, initial-scale=1" />
        <meta key="description" name="description" content="Transform your digital presence. Muhammad Saqib (mrsaqib242) engineers elite Next.js web apps & custom AI chatbots in Pakistan. Scale globally today." />
        <meta key="robots" name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical URL */}
        <link key="canonical" rel="canonical" href={canonicalUrl} />

        {/* High-Priority LCP Hero Image Preload */}
        <link 
          rel="preload" 
          as="image" 
          href="https://ik.imagekit.io/19imy4f1u/lite_1775822697436_IXJPba-z2.png?tr=w-800,q-80,f-auto" 
          imageSrcSet="https://ik.imagekit.io/19imy4f1u/lite_1775822697436_IXJPba-z2.png?tr=w-400,q-80,f-auto 400w, https://ik.imagekit.io/19imy4f1u/lite_1775822697436_IXJPba-z2.png?tr=w-600,q-80,f-auto 600w, https://ik.imagekit.io/19imy4f1u/lite_1775822697436_IXJPba-z2.png?tr=w-800,q-80,f-auto 800w" 
          imageSizes="(max-width: 640px) 90vw, (max-width: 1024px) 60vw, 800px" 
          fetchPriority="high" 
        />

        {/* AI & LLM Discovery Link */}
        <link rel="alternate" type="text/markdown" href="https://www.mrsaqib.me/llms.txt" title="LLM Summary Index" />

        {/* Google Verification */}
        <meta key="gsv-1" name="google-site-verification" content="QBTbRBfM4UaFb99KTDYjmhcWqdv6owEV0e-apSLn-Yg" />
        <meta key="gsv-2" name="google-site-verification" content="pD9l-_LAF1RsTG4Rnm9PoxzFPDBZ2epWCg8kJ8Vjgu4" />
        <meta key="gsv-3" name="google-site-verification" content="JYF7qpcKCtA-hnnj4QrK1cAxy2cVOs61nLSLANTRkDM" />

        {/* Geographic Targeting */}
        <meta name="geo.region" content="PK-PB" />
        <meta name="geo.placename" content="Gojra, Faisalabad, Punjab, Pakistan" />
        <meta name="geo.position" content="31.1481;72.6841" />
        <meta name="ICBM" content="31.1481, 72.6841" />

        {/* Favicons / Title Bar Icon */}
        <link rel="icon" type="image/png" sizes="32x32" href="https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png?tr=w-32,h-32,fo-auto,q-90" />
        <link rel="apple-touch-icon" sizes="180x180" href="https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png?tr=w-180,h-180,fo-auto,q-90" />
        <link rel="shortcut icon" href="https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png" />

        {/* OpenGraph & WhatsApp Preview */}
        <meta key="og:type" property="og:type" content="website" />
        <meta key="og:title" property="og:title" content="Mr Saqib (Saqib 242) | Web Developer & SEO Expert" />
        <meta key="og:description" property="og:description" content="Transform your digital presence. Muhammad Saqib (mrsaqib242) engineers elite Next.js web apps & custom AI chatbots in Pakistan. Scale globally today." />
        <meta key="og:url" property="og:url" content={canonicalUrl} />
        <meta key="og:image" property="og:image" content="https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png" />
        <meta key="og:image:secure_url" property="og:image:secure_url" content="https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png" />
        <meta key="og:image:type" property="og:image:type" content="image/png" />
        <meta key="og:image:width" property="og:image:width" content="1200" />
        <meta key="og:image:height" property="og:image:height" content="630" />
        <meta key="og:site_name" property="og:site_name" content="Mr Saqib Portfolio" />

        {/* Twitter */}
        <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
        <meta key="twitter:title" name="twitter:title" content="Mr Saqib (Saqib 242) | Web Developer & SEO Expert" />
        <meta key="twitter:description" name="twitter:description" content="Transform your digital presence. Muhammad Saqib (mrsaqib242) engineers elite Next.js web apps & custom AI chatbots in Pakistan. Scale globally today." />
        <meta key="twitter:image" name="twitter:image" content="https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png" />
        <meta key="keywords" name="keywords" content="saqib gojra, gojra developer, mr saqib, mr saqib developer, saqib 242, web developer Faisalabad, website designer Gojra, freelance developer Lahore, software engineer Karachi" />
        
        {/* Unified Schema Graph */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(unifiedSchema).replace(/</g, '\\u003c'),
          }}
        />
      </Head>

      {process.env.NODE_ENV === 'production' && (
        <GoogleAnalytics gaId="G-F768LWQ7CB" />
      )}


      <AnalyticsTracker />
      <Component {...pageProps} />
    </div>
  );
}

