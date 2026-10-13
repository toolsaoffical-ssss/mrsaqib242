import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import MySkillsPage from '../components/MySkillsPage';

export default function SkillsRoute() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  const skillsSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "name": "Expert AI Development & Full-Stack Tech Stack | Mr Saqib",
    "description": "Deep-dive into the technical expertise of Mr Saqib (Saqib 242): React, Next.js, MERN Stack, WordPress, Shopify, and Generative AI chatbot automation.",
    "url": "https://mrsaqib242.vercel.app/skills",
    "mainEntity": {
      "@type": "Person",
      "name": "Muhammad Saqib",
      "alternateName": "Saqib 242",
      "jobTitle": "Lead Full-Stack Web Architect & AI Engineer",
      "knowsAbout": [
        "Next.js", "React", "TypeScript", "Node.js", "Generative AI", 
        "Local SEO", "Tailwind CSS", "PostgreSQL", "MongoDB", "Express.js", "Shopify", "WordPress"
      ]
    }
  };

  return (
    <>
      <Head>
        <title key="title">Expert AI Development &amp; Full-Stack Tech Stack | Mr Saqib</title>
        <meta key="description" name="description" content="Deep-dive into the technical expertise of Mr Saqib (Saqib 242): React, Next.js, MERN Stack, WordPress, Shopify, and Generative AI chatbot automation. Servicing Gojra and Faisalabad businesses." />
        <meta key="keywords" name="keywords" content="saqib gojra, gojra developer, mr saqib skills, saqib 242 tech stack, mr saqib ai expert, full stack developer skills, react engineer expertise Pakistan, MERN stack Faisalabad, AI chatbot developer, WordPress designer Punjab" />
        <meta key="og:title" property="og:title" content="Expert AI Development &amp; Full-Stack Tech Stack | Mr Saqib" />
        <meta key="og:description" property="og:description" content="Deep-dive into the technical expertise of Mr Saqib (Saqib 242): React, Next.js, MERN Stack, WordPress, Shopify, and Generative AI chatbot automation. Servicing Gojra and Faisalabad businesses." />
        <meta key="og:url" property="og:url" content="https://mrsaqib242.vercel.app/skills" />
        <meta key="twitter:title" name="twitter:title" content="Expert AI Development &amp; Full-Stack Tech Stack | Mr Saqib" />
        <meta key="twitter:description" name="twitter:description" content="Deep-dive into the technical expertise of Mr Saqib (Saqib 242): React, Next.js, MERN Stack, WordPress, Shopify, and Generative AI chatbot automation. Servicing Gojra and Faisalabad businesses." />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(skillsSchema).replace(/</g, '\\u003c')
          }}
        />
      </Head>
      <div className="min-h-screen selection:bg-accent selection:text-white pb-24 bg-zinc-950 font-sans">
        <MySkillsPage onBack={handleBack} />
      </div>
    </>
  );
}
