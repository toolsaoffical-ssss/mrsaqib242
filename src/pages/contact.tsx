import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ContactTeamPage from '../components/ContactTeamPage';

export default function ContactRoute() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Hire Mr Saqib | Top Freelance Web Developer in Gojra, Faisalabad, Pakistan",
    "description": "Get in touch with Mr Saqib (Saqib 242) for cutting-edge web design, custom software development, and expert Google ranking campaigns in Pakistan.",
    "url": "https://mrsaqib242.vercel.app/contact",
    "mainEntity": {
      "@type": "Person",
      "name": "Muhammad Saqib",
      "alternateName": "Saqib 242",
      "telephone": "+92343673242",
      "url": "https://mrsaqib242.vercel.app",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Gojra",
        "addressRegion": "Punjab",
        "addressCountry": "PK"
      }
    }
  };

  return (
    <>
      <Head>
        <title key="title">Hire Mr Saqib | Top Freelance Web Developer in Gojra, Faisalabad, Pakistan</title>
        <meta key="description" name="description" content="Get in touch with Mr Saqib (Saqib 242) for cutting-edge web design, custom software development, and expert Google ranking campaigns in Pakistan." />
        <meta key="keywords" name="keywords" content="saqib gojra, gojra developer, hire mr saqib, contact mr saqib, contact saqib 242, hire web developer Faisalabad, contact web designer Gojra, freelance developer Lahore, software engineer Karachi, contact Saqib Dev" />
        <meta key="og:title" property="og:title" content="Hire Mr Saqib | Top Freelance Web Developer in Gojra, Faisalabad, Pakistan" />
        <meta key="og:description" property="og:description" content="Get in touch with Mr Saqib (Saqib 242) for cutting-edge web design, custom software development, and expert Google ranking campaigns in Pakistan." />
        <meta key="og:url" property="og:url" content="https://mrsaqib242.vercel.app/contact" />
        <meta key="twitter:title" name="twitter:title" content="Hire Mr Saqib | Top Freelance Web Developer in Gojra, Faisalabad, Pakistan" />
        <meta key="twitter:description" name="twitter:description" content="Get in touch with Mr Saqib (Saqib 242) for cutting-edge web design, custom software development, and expert Google ranking campaigns in Pakistan." />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(contactSchema).replace(/</g, '\\u003c')
          }}
        />
      </Head>
      <div className="min-h-screen selection:bg-accent selection:text-white pb-24 bg-zinc-950 font-sans">
        <ContactTeamPage onBack={handleBack} />
      </div>
    </>
  );
}
