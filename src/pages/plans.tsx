import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import WebsitePlansPage from '../components/WebsitePlansPage';

export default function PlansRoute() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  const plansSchemas = {
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
            "name": "Mr Saqib Website Plans & Pricing",
            "item": "https://mrsaqib242.vercel.app/plans"
          }
        ]
      },
      {
        "@type": "Product",
        "@id": "https://mrsaqib242.vercel.app/plans#pricing",
        "name": "Mr Saqib Website Design & Development Packages",
        "description": "Premium, low-cost website design and custom full-stack development plans by Mr Saqib (Saqib 242) for startups, businesses, and e-commerce stores in Pakistan.",
        "url": "https://mrsaqib242.vercel.app/plans",
        "brand": {
          "@type": "Brand",
          "name": "Saqib Visuals"
        },
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "PKR",
          "lowPrice": "15000",
          "highPrice": "120000",
          "offerCount": "4",
          "priceValidUntil": "2027-12-31"
        }
      }
    ]
  };

  return (
    <>
      <Head>
        <title key="title">Mr Saqib Website Plans &amp; Pricing | Web Development Packages (Saqib 242)</title>
        <meta key="description" name="description" content="View Mr Saqib website plans and pricing (saqib 242 packages). Affordable web design, Next.js eCommerce, business landing pages, and AI chatbots in Pakistan." />
        <meta key="keywords" name="keywords" content="mr saqib website plans, mr saqib pricing, mr saqib, saqib 242 pricing, website design packages pakistan, affordable web development gojra, web designer faisalabad pricing, cheap website cost pakistan" />
        
        {/* Canonical */}
        <link key="canonical" rel="canonical" href="https://mrsaqib242.vercel.app/plans" />

        {/* OpenGraph */}
        <meta key="og:type" property="og:type" content="website" />
        <meta key="og:title" property="og:title" content="Mr Saqib Website Plans &amp; Pricing | Web Packages (Saqib 242)" />
        <meta key="og:description" property="og:description" content="View Mr Saqib website plans and pricing (saqib 242 packages). Affordable web design, Next.js eCommerce, business landing pages, and AI chatbots in Pakistan." />
        <meta key="og:url" property="og:url" content="https://mrsaqib242.vercel.app/plans" />
        <meta key="og:image" property="og:image" content="https://ik.imagekit.io/shaban/SHABAN-1768573425069_nIPVZQOaT.jpg?tr=w-1200,h-630,fo-auto,q-90" />
        <meta key="og:site_name" property="og:site_name" content="Mr Saqib Portfolio" />

        {/* Twitter */}
        <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
        <meta key="twitter:title" name="twitter:title" content="Mr Saqib Website Plans &amp; Pricing | Web Packages (Saqib 242)" />
        <meta key="twitter:description" name="twitter:description" content="View Mr Saqib website plans and pricing (saqib 242 packages). Affordable web design, Next.js eCommerce, business landing pages, and AI chatbots in Pakistan." />
        <meta key="twitter:image" name="twitter:image" content="https://ik.imagekit.io/shaban/SHABAN-1768573425069_nIPVZQOaT.jpg?tr=w-1200,h-630,fo-auto,q-90" />

        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(plansSchemas).replace(/</g, '\\u003c')
          }}
        />
      </Head>
      <div className="min-h-screen selection:bg-accent selection:text-white pb-24 bg-zinc-950 font-sans">
        <WebsitePlansPage onBack={handleBack} />
      </div>
    </>
  );
}
