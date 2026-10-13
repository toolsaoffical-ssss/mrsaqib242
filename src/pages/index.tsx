import React from 'react';
import Head from 'next/head';
import App from '../ClientApp';

export default function Home() {
  return (
    <>
      <Head>
        <title key="title">Mr Saqib (Saqib 242) | Portfolio, Projects, Plans &amp; Developer Tools</title>
        <meta key="description" name="description" content="Official portfolio of Mr Saqib (Saqib 242). Explore Mr Saqib projects, website plans, developer tools, technical skills, and direct contacts for high-end web development." />
        <meta key="keywords" name="keywords" content="mr saqib, saqib mr saqib, saqib 242, mr saqib projects, mr saqib plans, saqib projects, saqib plans, mr saqib tools, mr saqib contacts, web developer pakistan, saqib visuals" />
        <link key="canonical" rel="canonical" href="https://mrsaqib242.vercel.app/" />

        {/* OpenGraph */}
        <meta key="og:type" property="og:type" content="website" />
        <meta key="og:title" property="og:title" content="Mr Saqib (Saqib 242) | Portfolio, Projects, Plans &amp; Developer Tools" />
        <meta key="og:description" property="og:description" content="Official portfolio of Mr Saqib (Saqib 242). Explore Mr Saqib projects, website plans, developer tools, technical skills, and direct contacts." />
        <meta key="og:url" property="og:url" content="https://mrsaqib242.vercel.app/" />
        <meta key="og:image" property="og:image" content="https://ik.imagekit.io/shaban/SHABAN-1768573425069_nIPVZQOaT.jpg?tr=w-1200,h-630,fo-auto,q-90" />
        <meta key="og:site_name" property="og:site_name" content="Mr Saqib Portfolio" />

        {/* Twitter */}
        <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
        <meta key="twitter:title" name="twitter:title" content="Mr Saqib (Saqib 242) | Portfolio, Projects, Plans &amp; Developer Tools" />
        <meta key="twitter:description" name="twitter:description" content="Official portfolio of Mr Saqib (Saqib 242). Explore Mr Saqib projects, website plans, developer tools, technical skills, and direct contacts." />
        <meta key="twitter:image" name="twitter:image" content="https://ik.imagekit.io/shaban/SHABAN-1768573425069_nIPVZQOaT.jpg?tr=w-1200,h-630,fo-auto,q-90" />
      </Head>
      <App />
    </>
  );
}
