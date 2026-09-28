import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import WebsitePlansPage from '../components/WebsitePlansPage';

export default function PlansRoute() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>Affordable Website Development Plans & Pricing in Pakistan | Mr Saqib</title>
        <meta name="description" content="View our low-cost, premium website design and development plans by Mr Saqib. Perfect business packages for startups and manufacturers in Faisalabad, Lahore, Karachi, and Islamabad." />
        <meta name="keywords" content="saqib gojra, gojra developer, mr saqib website plans, saqib 242 pricing, website plans Pakistan, web design pricing Faisalabad, cheap web development Gojra, e-commerce store packages Lahore, business website pricing Karachi" />
      </Head>
      <div className="min-h-screen selection:bg-accent selection:text-white pb-24 bg-zinc-950 font-sans">
        <WebsitePlansPage onBack={handleBack} />
      </div>
    </>
  );
}
