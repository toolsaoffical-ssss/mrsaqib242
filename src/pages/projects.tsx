import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AllProjectsPage from '../components/AllProjectsPage';

export default function ProjectsRoute() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  const projectsSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Creative Web Portfolios & AI Projects | Mr Saqib Pakistan",
    "description": "Explore the complete showcase of high-performance web applications, AI integrations, and creative visual projects designed by Mr Saqib for clients across Pakistan.",
    "url": "https://mrsaqib242.vercel.app/projects",
    "creator": {
      "@type": "Person",
      "name": "Muhammad Saqib",
      "alternateName": "Saqib 242",
      "url": "https://mrsaqib242.vercel.app"
    }
  };

  return (
    <>
      <Head>
        <title key="title">Creative Web Portfolios &amp; AI Projects | Mr Saqib Pakistan</title>
        <meta key="description" name="description" content="Explore the complete showcase of high-performance web applications, AI integrations, and creative visual projects designed by Mr Saqib for clients across Pakistan." />
        <meta key="keywords" name="keywords" content="saqib gojra, gojra developer, mr saqib portfolio, saqib 242 projects, web portfolio mr saqib, software projects Pakistan, React applications Faisalabad, AI chatbot showcase Gojra, nextjs web design Lahore" />
        <meta key="og:title" property="og:title" content="Creative Web Portfolios &amp; AI Projects | Mr Saqib Pakistan" />
        <meta key="og:description" property="og:description" content="Explore the complete showcase of high-performance web applications, AI integrations, and creative visual projects designed by Mr Saqib for clients across Pakistan." />
        <meta key="og:url" property="og:url" content="https://mrsaqib242.vercel.app/projects" />
        <meta key="twitter:title" name="twitter:title" content="Creative Web Portfolios &amp; AI Projects | Mr Saqib Pakistan" />
        <meta key="twitter:description" name="twitter:description" content="Explore the complete showcase of high-performance web applications, AI integrations, and creative visual projects designed by Mr Saqib for clients across Pakistan." />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(projectsSchema).replace(/</g, '\\u003c')
          }}
        />
      </Head>
      <div className="min-h-screen selection:bg-accent selection:text-white pb-24 bg-zinc-950 font-sans">
        <AllProjectsPage onBack={handleBack} />
      </div>
    </>
  );
}
