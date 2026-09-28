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
  const cleanPath = router.asPath.split('?')[0].split('#')[0];
  const canonicalUrl = `https://mrsaqib242.vercel.app${cleanPath === '/' ? '' : cleanPath}`;

  const unifiedSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://mrsaqib242.vercel.app/#website",
        "url": "https://mrsaqib242.vercel.app",
        "name": "Mr Saqib Developer Portfolio",
        "publisher": { "@id": "https://mrsaqib242.vercel.app/#person" }
      },
      {
        "@type": "Person",
        "@id": "https://mrsaqib242.vercel.app/#person",
        "name": "Muhammad Saqib",
        "alternateName": ["Saqib 242", "mr_saqib242"],
        "jobTitle": "Lead Full-Stack Web Architect & Generative AI Developer",
        "url": "https://mrsaqib242.vercel.app",
        "sameAs": [
          "https://github.com/mrsaqib242",
          "https://www.instagram.com/mr_saqib242"
        ],
        "knowsAbout": [
          "Next.js", "React", "TypeScript", "Node.js", "Generative AI", "Local SEO"
        ]
      },
      {
        "@type": "ProfessionalService",
        "@id": "https://mrsaqib242.vercel.app/#service",
        "name": "Mr Saqib Web Development & Local SEO Services",
        "url": "https://mrsaqib242.vercel.app",
        "founder": { "@id": "https://mrsaqib242.vercel.app/#person" },
        "areaServed": ["Gojra", "Faisalabad", "Lahore", "Islamabad", "Karachi"],
        "priceRange": "$$"
      },
      {
        "@type": "FAQPage",
        "@id": "https://mrsaqib242.vercel.app/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Who is Muhammad Saqib (Saqib242)?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Muhammad Saqib is a freelance full-stack web developer and local SEO integration expert based in Gojra, Faisalabad, Pakistan."
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
        <meta key="description" name="description" content="Mr Saqib (Saqib 242) is the top freelance full-stack web developer and local SEO integration expert in Gojra, Faisalabad, Lahore, and Islamabad, Pakistan." />
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
        <link rel="alternate" type="text/markdown" href="https://mrsaqib242.vercel.app/llms.txt" title="LLM Summary Index" />

        {/* Google Verification */}
        <meta name="google-site-verification" content="QBTbRBfM4UaFb99KTDYjmhcWqdv6owEV0e-apSLn-Yg" />
        <meta name="google-site-verification" content="pD9l-_LAF1RsTG4Rnm9PoxzFPDBZ2epWCg8kJ8Vjgu4" />

        {/* Geographic Targeting */}
        <meta name="geo.region" content="PK-PB" />
        <meta name="geo.placename" content="Gojra, Faisalabad, Punjab, Pakistan" />
        <meta name="geo.position" content="31.1481;72.6841" />
        <meta name="ICBM" content="31.1481, 72.6841" />

        {/* Favicons */}
        <link rel="icon" type="image/jpeg" sizes="32x32" href="https://ik.imagekit.io/shaban/SHABAN-1768573425069_nIPVZQOaT.jpg?tr=w-32,h-32,fo-auto,q-90" />
        <link rel="apple-touch-icon" sizes="180x180" href="https://ik.imagekit.io/shaban/SHABAN-1768573425069_nIPVZQOaT.jpg?tr=w-180,h-180,fo-auto,q-90" />

        {/* OpenGraph */}
        <meta key="og:type" property="og:type" content="website" />
        <meta key="og:title" property="og:title" content="Mr Saqib (Saqib 242) | Web Developer & SEO Expert" />
        <meta key="og:description" property="og:description" content="Top freelance full-stack web developer and local SEO integration expert in Pakistan." />
        <meta key="og:url" property="og:url" content={canonicalUrl} />
        <meta key="og:image" property="og:image" content="https://ik.imagekit.io/shaban/SHABAN-1768573425069_nIPVZQOaT.jpg?tr=w-1200,h-630,fo-auto,q-90" />
        <meta property="og:site_name" content="Mr Saqib Portfolio" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mr Saqib (Saqib 242) | Web Developer & SEO Expert" />
        <meta name="twitter:description" content="Top freelance full-stack web developer and local SEO integration expert in Pakistan." />
        <meta name="twitter:image" content="https://ik.imagekit.io/shaban/SHABAN-1768573425069_nIPVZQOaT.jpg?tr=w-1200,h-630,fo-auto,q-90" />
        
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

