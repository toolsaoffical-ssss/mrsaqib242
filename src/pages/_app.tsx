import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { useEffect } from 'react';
import '../index.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Programmatically clear old React/PWA service workers and client-side caches
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister().then((success) => {
            if (success) {
              console.log('Successfully unregistered legacy service worker.');
            }
          });
        }
      });
    }

    // Clear caches api
    if (typeof window !== 'undefined' && 'caches' in window) {
      caches.keys().then((keys) => {
        keys.forEach((key) => {
          caches.delete(key);
        });
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>Mr Saqib (Saqib 242) | Best Web Developer & Local SEO Expert in Faisalabad, Gojra, Pakistan</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="google-site-verification" content="QBTbRBfM4UaFb99KTDYjmhcWqdv6owEV0e-apSLn-Yg" />
        <meta name="google-site-verification" content="pD9l-_LAF1RsTG4Rnm9PoxzFPDBZ2epWCg8kJ8Vjgu4" />
        <meta name="description" content="Mr Saqib (also known as Saqib 242) is the top freelance full-stack web developer and local SEO integration expert in Gojra, Faisalabad, Lahore, Karachi, and Islamabad, Pakistan. Hire Mr Saqib for custom Next.js apps, WordPress, and Shopify solutions." />
        <meta name="keywords" content="saqib gojra, gojra developer, mr saqib, mr_saqib242, saqib 242, mr saqib developer, mr saqib web designer, best web developer in Pakistan, freelance web developer Gojra, website designer Faisalabad, React developer Lahore, software engineer Karachi, top web developer Islamabad, affordable web development Pakistan, Shopify expert Pakistan, WordPress developer Faisalabad, MERN stack developer Gojra, AI developer Pakistan, SEO expert Pakistan" />
        
        {/* Favicon / Title Bar Image */}
        <link rel="icon" type="image/jpeg" sizes="32x32" href="https://ik.imagekit.io/shaban/SHABAN-1768573425069_nIPVZQOaT.jpg?tr=w-32,h-32,fo-auto,q-90" />
        <link rel="icon" type="image/jpeg" sizes="16x16" href="https://ik.imagekit.io/shaban/SHABAN-1768573425069_nIPVZQOaT.jpg?tr=w-16,h-16,fo-auto,q-90" />
        <link rel="apple-touch-icon" sizes="180x180" href="https://ik.imagekit.io/shaban/SHABAN-1768573425069_nIPVZQOaT.jpg?tr=w-180,h-180,fo-auto,q-90" />
        <link rel="shortcut icon" href="https://ik.imagekit.io/shaban/SHABAN-1768573425069_nIPVZQOaT.jpg?tr=w-48,h-48,fo-auto,q-90" />
        {/* Preload Foreground Hero Image for Instant Loading */}
        <link rel="preload" as="image" href="https://ik.imagekit.io/19imy4f1u/lite_1775822697436_IXJPba-z2.png?tr=w-800,q-80" />

        {/* Geographic Targeting SEO Meta Tags */}
        <meta name="geo.region" content="PK-PB" />
        <meta name="geo.placename" content="Gojra, Faisalabad, Punjab, Pakistan" />
        <meta name="geo.position" content="31.1481;72.6841" />
        <meta name="ICBM" content="31.1481, 72.6841" />
        
        {/* OpenGraph social metadata (WhatsApp, Facebook, LinkedIn) */}
        <meta property="og:title" content="Mr Saqib (Saqib 242) | Best Web Developer & Local SEO Expert in Faisalabad, Gojra, Pakistan" />
        <meta property="og:description" content="Mr Saqib is the top freelance full-stack web developer, website designer, and AI expert in Pakistan. High performance solutions for Faisalabad, Lahore, Karachi, and Islamabad." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://ik.imagekit.io/shaban/SHABAN-1768573425069_nIPVZQOaT.jpg?tr=w-1200,h-630,fo-auto,q-90" />
        <meta property="og:image:secure_url" content="https://ik.imagekit.io/shaban/SHABAN-1768573425069_nIPVZQOaT.jpg?tr=w-1200,h-630,fo-auto,q-90" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Mr Saqib - Top Freelance Web Developer and Local SEO Expert in Pakistan" />
        <meta property="og:url" content="https://mrsaqib242.vercel.app" />
        <meta property="og:site_name" content="Mr Saqib Visuals & Web Portfolio" />

        {/* Twitter Card metadata */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mr Saqib (Saqib 242) | Best Web Developer & Local SEO Expert in Pakistan" />
        <meta name="twitter:description" content="Mr Saqib is the top freelance full-stack web developer and local SEO integration expert." />
        <meta name="twitter:image" content="https://ik.imagekit.io/shaban/SHABAN-1768573425069_nIPVZQOaT.jpg?tr=w-1200,h-630,fo-auto,q-90" />
        <meta name="twitter:image:alt" content="Mr Saqib - Web Portfolio" />
        
        {/* Local Business & Professional Service Structured Schema Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "name": "Mr Saqib (Saqib 242) - Best Web Developer & SEO Expert in Pakistan",
              "image": "https://ik.imagekit.io/shaban/SHABAN-1768573425069_nIPVZQOaT.jpg?tr=w-800,h-800,fo-auto,q-90",
              "url": "https://mrsaqib242.vercel.app",
              "telephone": "+923000000000",
              "priceRange": "$$",
              "description": "Premium Full-Stack Web Development, custom Generative AI / OpenAI integrations, custom responsive WordPress & Shopify designs, and expert localized SEO search campaigns by Mr Saqib in Gojra, Faisalabad, Lahore, Islamabad, and Karachi.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Gojra Road",
                "addressLocality": "Gojra",
                "addressRegion": "Punjab",
                "postalCode": "36000",
                "addressCountry": "PK"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 31.1481,
                "longitude": 72.6841
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday"
                ],
                "opens": "00:00",
                "closes": "23:59"
              },
              "sameAs": [
                "https://www.instagram.com/mr_saqib242",
                "https://github.com/mrsaqib242"
              ],
              "knowsAbout": [
                "Full-Stack Web Development",
                "Generative AI & LLM Integrations",
                "Search Engine Optimization (SEO)",
                "Generative Engine Optimization (GEO)",
                "Answer Engine Optimization (AEO)",
                "Next.js & React Frameworks",
                "Node.js Backend & API Development",
                "Shopify & WordPress Custom E-commerce",
                "MERN Stack Applications",
                "Graphic & Motion Design"
              ],
              "founder": {
                "@type": "Person",
                "name": "Mr Saqib",
                "alternateName": ["Saqib 242", "Muhammad Saqib"],
                "jobTitle": "Lead Full-Stack Architect & Generative AI Developer"
              },
              "areaServed": [
                { "@type": "AdministrativeArea", "name": "Gojra" },
                { "@type": "AdministrativeArea", "name": "Faisalabad" },
                { "@type": "AdministrativeArea", "name": "Lahore" },
                { "@type": "AdministrativeArea", "name": "Karachi" },
                { "@type": "AdministrativeArea", "name": "Islamabad" },
                { "@type": "AdministrativeArea", "name": "Rawalpindi" },
                { "@type": "AdministrativeArea", "name": "Sialkot" },
                { "@type": "AdministrativeArea", "name": "Punjab, Pakistan" }
              ]
            })
          }}
        />
      </Head>

      <Script 
        src="https://www.googletagmanager.com/gtag/js?id=G-F768LWQ7CB" 
        strategy="afterInteractive" 
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-F768LWQ7CB');
        `}
      </Script>

      <Component {...pageProps} />
    </>
  );
}
