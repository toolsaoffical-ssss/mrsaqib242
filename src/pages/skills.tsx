import React from 'react';
import Head from 'next/head';
import MySkillsPage from '../components/MySkillsPage';

export default function Skills() {
  const skillsSchemas = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": "https://mrsaqib242.vercel.app/skills#breadcrumb",
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
            "name": "Skills & Tech Stack",
            "item": "https://mrsaqib242.vercel.app/skills"
          }
        ]
      },
      {
        "@type": "ProfilePage",
        "@id": "https://mrsaqib242.vercel.app/skills#profile",
        "name": "Mr Saqib | Cyber Security Expert & Full-Stack App Developer Skills",
        "alternateName": ["Mr Saqib Skills", "Saqib Skills", "Saqib Cyber Security", "Saqib 242 Skills", "Saqib Tech Stack"],
        "description": "Deep-dive into the technical expertise of Mr Saqib (mrsaqib242): Zero-Trust Cyber Security, Supabase RLS, Node.js Backends, Next.js Frontend, and Cross-Platform App Development.",
        "url": "https://mrsaqib242.vercel.app/skills",
        "mainEntity": {
          "@type": "Person",
          "name": "Muhammad Saqib",
          "alternateName": ["Mr Saqib", "Saqib 242", "mrsaqib242"],
          "jobTitle": "Cyber Security Expert & Full-Stack App Developer",
          "url": "https://mrsaqib242.vercel.app",
          "knowsAbout": [
            "CyberSecurity", "ApplicationSecurity", "WebApplicationSecurity", "PenetrationTesting", 
            "ZeroTrustArchitecture", "DatabaseSecurity", "RowLevelSecurity", "Supabase", "PostgreSQL", 
            "NodeJs", "ExpressJs", "RESTfulAPI", "JSONWebToken", "NextJs", "ReactJs", "TypeScript", 
            "TailwindCSS", "FramerMotion", "ProgressiveWebApps", "MobileAppDevelopment"
          ]
        }
      }
    ]
  };

  return (
    <>
      <Head>
        <title key="title">Mr Saqib Skills | Cyber Security Expert, Backend, Frontend &amp; App Developer (mrsaqib242)</title>
        <meta key="description" name="description" content="Explore Mr Saqib (mrsaqib242) engineering skills: Zero-Trust Cyber Security, Node.js Backends, Supabase RLS, Next.js Frontend, and Cross-Platform App Development." />
        <meta key="keywords" name="keywords" content="mr saqib skills, cyber security expert, backend developer, frontend developer, app developer, supabase rls security, node.js backend architect, next.js app router developer, saqib 242 skills" />
        
        {/* Canonical */}
        <link key="canonical" rel="canonical" href="https://mrsaqib242.vercel.app/skills" />

        {/* OpenGraph */}
        <meta key="og:type" property="og:type" content="website" />
        <meta key="og:title" property="og:title" content="Mr Saqib Skills | Cyber Security Expert, Backend, Frontend &amp; App Developer" />
        <meta key="og:description" property="og:description" content="Explore Mr Saqib (mrsaqib242) engineering skills: Zero-Trust Cyber Security, Node.js Backends, Supabase RLS, Next.js Frontend, and Cross-Platform App Development." />
        <meta key="og:url" property="og:url" content="https://mrsaqib242.vercel.app/skills" />
        <meta key="og:image" property="og:image" content="https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png" />
        <meta key="og:image:secure_url" property="og:image:secure_url" content="https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png" />
        <meta key="og:site_name" property="og:site_name" content="Mr Saqib Portfolio" />

        {/* Twitter */}
        <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
        <meta key="twitter:title" name="twitter:title" content="Mr Saqib Skills | Cyber Security Expert, Backend, Frontend &amp; App Developer" />
        <meta key="twitter:description" name="twitter:description" content="Explore Mr Saqib (mrsaqib242) engineering skills: Zero-Trust Cyber Security, Node.js Backends, Supabase RLS, Next.js Frontend, and Cross-Platform App Development." />
        <meta key="twitter:image" name="twitter:image" content="https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png" />

        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(skillsSchemas).replace(/</g, '\\u003c')
          }}
        />
      </Head>
      <main className="min-h-screen bg-black">
        <MySkillsPage onBack={() => window.location.href = '/'} />
      </main>
    </>
  );
}
