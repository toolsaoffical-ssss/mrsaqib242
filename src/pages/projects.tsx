import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import AllProjectsPage from '../components/AllProjectsPage';

export default function ProjectsRoute() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  const projectsSchemas = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.mrsaqib.me/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Mr Saqib Projects",
            "item": "https://www.mrsaqib.me/projects"
          }
        ]
      },
      {
        "@type": "CollectionPage",
        "@id": "https://www.mrsaqib.me/projects#collection",
        "name": "Mr Saqib Projects & Portfolio Showcase",
        "alternateName": ["Mr Saqib Projects", "Saqib Projects", "Saqib Mr Saqib Projects", "Saqib 242 Projects", "Saqib Portfolio"],
        "description": "Showcase of high-performance Next.js web applications, e-commerce stores, and generative AI systems developed by Mr Saqib (Saqib 242).",
        "url": "https://www.mrsaqib.me/projects",
        "creator": {
          "@type": "Person",
          "name": "Muhammad Saqib",
          "alternateName": ["Mr Saqib", "Saqib 242", "mrsaqib242"],
          "url": "https://www.mrsaqib.me"
        }
      }
    ]
  };

  return (
    <>
      <Head>
        <title key="title">Mr Saqib Projects &amp; Portfolio | Saqib Full-Stack Web Apps &amp; Software (Saqib 242)</title>
        <meta key="description" name="description" content="Explore all Mr Saqib projects (saqib projects portfolio). High-performance Next.js web applications, e-commerce stores, custom AI systems, and SaaS tools built by Mr Saqib (Saqib 242)." />
        <meta key="keywords" name="keywords" content="mr saqib projects, saqib projects, saqib mr saqib projects, mr saqib portfolio, saqib 242 projects, web development projects pakistan, react apps gojra, nextjs portfolio mr saqib, full stack projects faisalabad" />
        
        {/* Canonical */}
        <link key="canonical" rel="canonical" href="https://www.mrsaqib.me/projects" />

        {/* OpenGraph */}
        <meta key="og:type" property="og:type" content="website" />
        <meta key="og:title" property="og:title" content="Mr Saqib Projects &amp; Portfolio | Saqib Web Apps (Saqib 242)" />
        <meta key="og:description" property="og:description" content="Explore all Mr Saqib projects (saqib projects portfolio). High-performance Next.js web applications, e-commerce stores, custom AI systems, and SaaS tools built by Mr Saqib (Saqib 242)." />
        <meta key="og:url" property="og:url" content="https://www.mrsaqib.me/projects" />
        <meta key="og:image" property="og:image" content="https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png" />
        <meta key="og:image:secure_url" property="og:image:secure_url" content="https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png" />
        <meta key="og:site_name" property="og:site_name" content="Mr Saqib Portfolio" />

        {/* Twitter */}
        <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
        <meta key="twitter:title" name="twitter:title" content="Mr Saqib Projects &amp; Portfolio | Saqib Web Apps (Saqib 242)" />
        <meta key="twitter:description" name="twitter:description" content="Explore all Mr Saqib projects (saqib projects portfolio). High-performance Next.js web applications, e-commerce stores, custom AI systems, and SaaS tools built by Mr Saqib (Saqib 242)." />
        <meta key="twitter:image" name="twitter:image" content="https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png" />

        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(projectsSchemas).replace(/</g, '\\u003c')
          }}
        />
      </Head>
      <div className="min-h-screen selection:bg-accent selection:text-white pb-24 bg-zinc-950 font-sans">
        <AllProjectsPage onBack={handleBack} />
      </div>
    </>
  );
}
