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

        {/* Title Bar Icon & Favicons */}
        <link key="icon" rel="icon" type="image/png" sizes="32x32" href="https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png?tr=w-32,h-32,fo-auto,q-90" />
        <link key="apple-icon" rel="apple-touch-icon" sizes="180x180" href="https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png?tr=w-180,h-180,fo-auto,q-90" />
        <link key="shortcut-icon" rel="shortcut icon" href="https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png" />

        {/* OpenGraph & WhatsApp Preview */}
        <meta key="og:type" property="og:type" content="website" />
        <meta key="og:title" property="og:title" content="Mr Saqib | Cyber Security Expert &amp; Full-Stack App Developer" />
        <meta key="og:description" property="og:description" content="Hire Muhammad Saqib (Mr Saqib): Elite Cyber Security Expert &amp; Full-Stack App Developer building hardened Next.js, Node.js, and mobile architectures." />
        <meta key="og:url" property="og:url" content="https://mrsaqib242.vercel.app/" />
        <meta key="og:image" property="og:image" content="https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png" />
        <meta key="og:image:secure_url" property="og:image:secure_url" content="https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png" />
        <meta key="og:image:type" property="og:image:type" content="image/png" />
        <meta key="og:image:width" property="og:image:width" content="1200" />
        <meta key="og:image:height" property="og:image:height" content="630" />
        <meta key="og:site_name" property="og:site_name" content="Mr Saqib Portfolio" />

        {/* Twitter */}
        <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
        <meta key="twitter:title" name="twitter:title" content="Mr Saqib | Cyber Security Expert &amp; Full-Stack App Developer" />
        <meta key="twitter:description" name="twitter:description" content="Hire Muhammad Saqib (Mr Saqib): Elite Cyber Security Expert &amp; Full-Stack App Developer building hardened Next.js, Node.js, and mobile architectures." />
        <meta key="twitter:image" name="twitter:image" content="https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png" />
      </Head>
      <App />
    </>
  );
}
