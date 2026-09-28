import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import MySkillsPage from '../components/MySkillsPage';

export default function SkillsRoute() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>Expert AI Development & Full-Stack Tech Stack | Mr Saqib</title>
        <meta name="description" content="Deep-dive into the technical expertise of Mr Saqib (Saqib 242): React, Next.js, MERN Stack, WordPress, Shopify, and Generative AI chatbot automation. Servicing Gojra and Faisalabad businesses." />
        <meta name="keywords" content="saqib gojra, gojra developer, mr saqib skills, saqib 242 tech stack, mr saqib ai expert, full stack developer skills, react engineer expertise Pakistan, MERN stack Faisalabad, AI chatbot developer, WordPress designer Punjab" />
      </Head>
      <div className="min-h-screen selection:bg-accent selection:text-white pb-24 bg-zinc-950 font-sans">
        <MySkillsPage onBack={handleBack} />
      </div>
    </>
  );
}
