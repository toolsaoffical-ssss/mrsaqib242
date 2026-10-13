import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import WebsitePlansPage from '../components/WebsitePlansPage';

export default function PlansRoute() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  const plansSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Affordable Website Development Plans & Pricing Pakistan",
    "description": "Premium website design and development plans by Mr Saqib for startups, e-commerce, and enterprises.",
    "url": "https://mrsaqib242.vercel.app/plans",
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "PKR",
      "lowPrice": "15000",
      "highPrice": "120000",
      "offerCount": "4"
    }
  };

  return (
    <>
      <Head>
        <title key="title">Affordable Website Development Plans &amp; Pricing in Pakistan | Mr Saqib</title>
        <meta key="description" name="description" content="View our low-cost, premium website design and development plans by Mr Saqib. Perfect business packages for startups and manufacturers in Faisalabad, Lahore, Karachi, and Islamabad." />
        <meta key="keywords" name="keywords" content="saqib gojra, gojra developer, mr saqib website plans, saqib 242 pricing, website plans Pakistan, web design pricing Faisalabad, cheap web development Gojra, e-commerce store packages Lahore, business website pricing Karachi" />
        <meta key="og:title" property="og:title" content="Affordable Website Development Plans &amp; Pricing in Pakistan | Mr Saqib" />
        <meta key="og:description" property="og:description" content="View our low-cost, premium website design and development plans by Mr Saqib. Perfect business packages for startups and manufacturers in Faisalabad, Lahore, Karachi, and Islamabad." />
        <meta key="og:url" property="og:url" content="https://mrsaqib242.vercel.app/plans" />
        <meta key="twitter:title" name="twitter:title" content="Affordable Website Development Plans &amp; Pricing in Pakistan | Mr Saqib" />
        <meta key="twitter:description" name="twitter:description" content="View our low-cost, premium website design and development plans by Mr Saqib. Perfect business packages for startups and manufacturers in Faisalabad, Lahore, Karachi, and Islamabad." />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(plansSchema).replace(/</g, '\\u003c')
          }}
        />
      </Head>
      <div className="min-h-screen selection:bg-accent selection:text-white pb-24 bg-zinc-950 font-sans">
        <WebsitePlansPage onBack={handleBack} />
      </div>
    </>
  );
}
