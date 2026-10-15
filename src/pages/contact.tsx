import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ContactTeamPage from '../components/ContactTeamPage';

export default function ContactRoute() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  const contactSchemas = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://mrsaqib242.vercel.app/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Contact Mr Saqib",
            "item": "https://mrsaqib242.vercel.app/contact"
          }
        ]
      },
      {
        "@type": "ContactPage",
        "@id": "https://mrsaqib242.vercel.app/contact#contactpage",
        "name": "Contact Mr Saqib (Saqib 242) | Phone, WhatsApp & Office Details",
        "description": "Get in touch with Mr Saqib for web design, custom Next.js development, and AI software. Official WhatsApp, phone number, and quote form.",
        "url": "https://mrsaqib242.vercel.app/contact",
        "mainEntity": {
          "@type": "Person",
          "name": "Muhammad Saqib",
          "alternateName": ["Mr Saqib", "Saqib 242", "mrsaqib242", "Saqib Dev"],
          "telephone": "+923478936242",
          "email": "saqibsaqqibsaqib@gmail.com",
          "url": "https://mrsaqib242.vercel.app",
          "jobTitle": "Lead Full-Stack Web Architect & AI Engineer",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+923478936242",
            "contactType": "customer service",
            "availableLanguage": ["English", "Urdu", "Punjabi"],
            "areaServed": ["Pakistan", "Worldwide"]
          },
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Gojra",
            "addressRegion": "Punjab",
            "addressCountry": "PK"
          }
        }
      }
    ]
  };

  return (
    <>
      <Head>
        <title key="title">Mr Saqib Contact &amp; WhatsApp Number | Hire Web Developer (Saqib 242)</title>
        <meta key="description" name="description" content="Contact Mr Saqib (mr saqib contact / saqib 242). Get phone number, official WhatsApp (+92 347 8936242), email, office location in Gojra, Faisalabad, and instant project quotes." />
        <meta key="keywords" name="keywords" content="mr saqib contact, mr saqib contacts, contact mr saqib, contact saqib 242, hire mr saqib, mr saqib phone number, mr saqib whatsapp, saqib gojra contact, web developer faisalabad phone, contact saqib dev" />
        
        {/* Canonical */}
        <link key="canonical" rel="canonical" href="https://mrsaqib242.vercel.app/contact" />

        {/* OpenGraph */}
        <meta key="og:type" property="og:type" content="website" />
        <meta key="og:title" property="og:title" content="Mr Saqib Contact &amp; WhatsApp Number | Hire Web Developer (Saqib 242)" />
        <meta key="og:description" property="og:description" content="Contact Mr Saqib (mr saqib contact / saqib 242). Get phone number, official WhatsApp (+92 347 8936242), email, office location in Gojra, Faisalabad, and instant project quotes." />
        <meta key="og:url" property="og:url" content="https://mrsaqib242.vercel.app/contact" />
        <meta key="og:image" property="og:image" content="https://ik.imagekit.io/mrsaqib/mrsaqib242-img1_yPzIc8MWvY.png?tr=w-1200,h-630,fo-auto,q-90" />
        <meta key="og:site_name" property="og:site_name" content="Mr Saqib Portfolio" />

        {/* Twitter */}
        <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
        <meta key="twitter:title" name="twitter:title" content="Mr Saqib Contact &amp; WhatsApp Number | Hire Web Developer (Saqib 242)" />
        <meta key="twitter:description" name="twitter:description" content="Contact Mr Saqib (mr saqib contact / saqib 242). Get phone number, official WhatsApp (+92 347 8936242), email, office location in Gojra, Faisalabad, and instant project quotes." />
        <meta key="twitter:image" name="twitter:image" content="https://ik.imagekit.io/mrsaqib/mrsaqib242-img1_yPzIc8MWvY.png?tr=w-1200,h-630,fo-auto,q-90" />

        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(contactSchemas).replace(/</g, '\\u003c')
          }}
        />
      </Head>
      <div className="min-h-screen selection:bg-pink-300 selection:text-white pb-24 bg-[#F0F2F5] font-sans">
        <ContactTeamPage onBack={handleBack} />
      </div>
    </>
  );
}
