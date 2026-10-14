import React from 'react';
import Head from 'next/head';
import App from '../ClientApp';

export default function Home() {
  return (
    <>
      <Head>
        <title key="title">Mr Saqib | Cyber Security Expert &amp; Full-Stack App Developer</title>
        <meta key="description" name="description" content="Hire Muhammad Saqib (Mr Saqib): Elite Cyber Security Expert &amp; Full-Stack App Developer building hardened Next.js, Node.js, and mobile architectures." />
        <meta key="keywords" name="keywords" content="mr saqib, mrsaqib242, cyber security expert, backend developer, frontend developer, app developer, supabase rls security, next.js security, web developer pakistan, saqib visuals" />
        <link key="canonical" rel="canonical" href="https://mrsaqib242.vercel.app/" />

        {/* OpenGraph */}
        <meta key="og:type" property="og:type" content="website" />
        <meta key="og:title" property="og:title" content="Mr Saqib | Cyber Security Expert &amp; Full-Stack App Developer" />
        <meta key="og:description" property="og:description" content="Hire Muhammad Saqib (Mr Saqib): Elite Cyber Security Expert &amp; Full-Stack App Developer building hardened Next.js, Node.js, and mobile architectures." />
        <meta key="og:url" property="og:url" content="https://mrsaqib242.vercel.app/" />
        <meta key="og:image" property="og:image" content="https://ik.imagekit.io/19imy4f1u/lite_1791955994422_-jhmpCKzP.webp?tr=w-1200,h-630,fo-auto,q-90" />
        <meta key="og:site_name" property="og:site_name" content="Mr Saqib Portfolio" />

        {/* Twitter */}
        <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
        <meta key="twitter:title" name="twitter:title" content="Mr Saqib | Cyber Security Expert &amp; Full-Stack App Developer" />
        <meta key="twitter:description" name="twitter:description" content="Hire Muhammad Saqib (Mr Saqib): Elite Cyber Security Expert &amp; Full-Stack App Developer building hardened Next.js, Node.js, and mobile architectures." />
        <meta key="twitter:image" name="twitter:image" content="https://ik.imagekit.io/19imy4f1u/lite_1791955994422_-jhmpCKzP.webp?tr=w-1200,h-630,fo-auto,q-90" />
      </Head>
      <App />
    </>
  );
}
