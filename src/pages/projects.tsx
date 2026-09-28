import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AllProjectsPage from '../components/AllProjectsPage';

export default function ProjectsRoute() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>Creative Web Portfolios & AI Projects | Mr Saqib Pakistan</title>
        <meta name="description" content="Explore the complete showcase of high-performance web applications, AI integrations, and creative visual projects designed by Mr Saqib for clients across Pakistan." />
        <meta name="keywords" content="saqib gojra, gojra developer, mr saqib portfolio, saqib 242 projects, web portfolio mr saqib, software projects Pakistan, React applications Faisalabad, AI chatbot showcase Gojra, nextjs web design Lahore" />
      </Head>
      <div className="min-h-screen selection:bg-accent selection:text-white pb-24 bg-zinc-950 font-sans">
        <AllProjectsPage onBack={handleBack} />
      </div>
    </>
  );
}
