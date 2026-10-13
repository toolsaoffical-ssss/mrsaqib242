import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import MySkillsPage from '../components/MySkillsPage';

export default function SkillsRoute() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  const skillsSchemas = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://mrsaqib242.vercel.app/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Mr Saqib Skills & Tech Stack",
            "item": "https://mrsaqib242.vercel.app/skills"
          }
        ]
      },
      {
        "@type": "ProfilePage",
        "@id": "https://mrsaqib242.vercel.app/skills#profile",
        "name": "Mr Saqib Skills & Modern AI Tech Stack",
        "description": "Deep-dive into the technical expertise of Mr Saqib (Saqib 242): Next.js, React, TypeScript, Node.js, MERN Stack, and Generative AI chatbot automation.",
        "url": "https://mrsaqib242.vercel.app/skills",
        "mainEntity": {
          "@type": "Person",
          "name": "Muhammad Saqib",
          "alternateName": ["Mr Saqib", "Saqib 242", "mrsaqib242"],
          "jobTitle": "Lead Full-Stack Web Architect & AI Engineer",
          "url": "https://mrsaqib242.vercel.app",
          "knowsAbout": [
            "Next.js", "React", "TypeScript", "Node.js", "Generative AI", 
            "Local SEO", "Tailwind CSS", "PostgreSQL", "MongoDB", "Express.js", "Shopify", "WordPress"
          ]
        }
      }
    ]
  };

  return (
    <>
      <Head>
        <title key="title">Mr Saqib Skills &amp; Tech Stack | Full-Stack &amp; AI Engineer (Saqib 242)</title>
        <meta key="description" name="description" content="Explore Mr Saqib skills (saqib 242 skills). Full-Stack Web Development, Next.js 15, React 19, TypeScript, Python, and Generative AI Chatbots in Pakistan." />
        <meta key="keywords" name="keywords" content="mr saqib skills, mr saqib tech stack, saqib 242 skills, mr saqib ai expert, freelance developer skills gojra, full stack developer faisalabad, mern stack developer saqib" />
        
        {/* Canonical */}
        <link key="canonical" rel="canonical" href="https://mrsaqib242.vercel.app/skills" />

        {/* OpenGraph */}
        <meta key="og:type" property="og:type" content="website" />
        <meta key="og:title" property="og:title" content="Mr Saqib Skills &amp; Tech Stack | Full-Stack &amp; AI Engineer (Saqib 242)" />
        <meta key="og:description" property="og:description" content="Explore Mr Saqib skills (saqib 242 skills). Full-Stack Web Development, Next.js 15, React 19, TypeScript, Python, and Generative AI Chatbots in Pakistan." />
        <meta key="og:url" property="og:url" content="https://mrsaqib242.vercel.app/skills" />
        <meta key="og:image" property="og:image" content="https://ik.imagekit.io/shaban/SHABAN-1768573425069_nIPVZQOaT.jpg?tr=w-1200,h-630,fo-auto,q-90" />
        <meta key="og:site_name" property="og:site_name" content="Mr Saqib Portfolio" />

        {/* Twitter */}
        <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
        <meta key="twitter:title" name="twitter:title" content="Mr Saqib Skills &amp; Tech Stack | Full-Stack &amp; AI Engineer (Saqib 242)" />
        <meta key="twitter:description" name="twitter:description" content="Explore Mr Saqib skills (saqib 242 skills). Full-Stack Web Development, Next.js 15, React 19, TypeScript, Python, and Generative AI Chatbots in Pakistan." />
        <meta key="twitter:image" name="twitter:image" content="https://ik.imagekit.io/shaban/SHABAN-1768573425069_nIPVZQOaT.jpg?tr=w-1200,h-630,fo-auto,q-90" />

        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(skillsSchemas).replace(/</g, '\\u003c')
          }}
        />
      </Head>
      <div className="min-h-screen selection:bg-accent selection:text-white pb-24 bg-zinc-950 font-sans">
        <MySkillsPage onBack={handleBack} />
      </div>
    </>
  );
}
