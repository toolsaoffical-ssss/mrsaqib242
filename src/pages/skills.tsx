import React from 'react';
import Head from 'next/head';
import MySkillsPage from '../components/MySkillsPage';

export default function Skills() {
  const skillsSchemas = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.mrsaqib.me/skills#breadcrumb",
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
            "name": "Skills & Tech Stack",
            "item": "https://www.mrsaqib.me/skills"
          }
        ]
      },
      {
        "@type": "WebPage",
        "@id": "https://www.mrsaqib.me/skills#profile",
        "url": "https://www.mrsaqib.me/skills",
        "name": "Mr Saqib Skills | Full-Stack Developer & Cyber Security Expert Pakistan",
        "alternateName": [
          "Mr Saqib Skills",
          "Saqib 242 Skills",
          "Saqib Skills",
          "Saqib Cyber Security",
          "Saqib Tech Stack",
          "Muhammad Saqib Developer Skills"
        ],
        "description": "Deep-dive into the technical expertise of Mr Saqib (mrsaqib242): Zero-Trust Cyber Security, Supabase RLS, Node.js Backends, Next.js 15 Frontend, and Cross-Platform Mobile Applications in Pakistan.",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://www.mrsaqib.me/#website",
          "url": "https://www.mrsaqib.me",
          "name": "Mr Saqib Developer Portfolio"
        },
        "about": { "@id": "https://www.mrsaqib.me/#person" },
        "mainEntity": { "@id": "https://www.mrsaqib.me/#person" }
      },
      {
        "@type": "Person",
        "@id": "https://www.mrsaqib.me/#person",
        "name": "Muhammad Saqib",
        "alternateName": ["Mr Saqib", "Saqib 242", "mrsaqib242", "Saqib Dev"],
        "telephone": "03478936242",
        "email": "mrsaqib242242@gmail.com",
        "jobTitle": "Cyber Security Expert & Full-Stack App Developer",
        "url": "https://www.mrsaqib.me",
        "image": "https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Gojra",
          "addressRegion": "Punjab",
          "addressCountry": "PK"
        },
        "sameAs": [
          "https://github.com/mrsaqib242",
          "https://www.instagram.com/mr_saqib242"
        ],
        "knowsAbout": [
          {
            "@type": "DefinedTerm",
            "name": "Next.js 15 & React 19",
            "url": "https://en.wikipedia.org/wiki/Next.js",
            "description": "App Router, React Server Components (RSC), SSR, SSG, and sub-0.4s Core Web Vitals."
          },
          {
            "@type": "DefinedTerm",
            "name": "Cyber Security & Zero-Trust",
            "url": "https://en.wikipedia.org/wiki/Zero_trust_security_model",
            "description": "Supabase Row-Level Security (RLS), API Mirage Guard honeypot traps, and penetration testing."
          },
          {
            "@type": "DefinedTerm",
            "name": "Node.js & Express Architecture",
            "url": "https://en.wikipedia.org/wiki/Node.js",
            "description": "Asynchronous microservices, secure RESTful APIs, JWT authentication, and high-throughput servers."
          },
          {
            "@type": "DefinedTerm",
            "name": "Database Engineering",
            "description": "PostgreSQL, Supabase Cloud, MongoDB NoSQL, and SQLite architectures."
          },
          {
            "@type": "DefinedTerm",
            "name": "Mobile & PWA Apps",
            "description": "Progressive Web Apps with service worker offline caching, cross-platform React Native."
          },
          {
            "@type": "DefinedTerm",
            "name": "Creative Visuals & Branding",
            "description": "Saqib Visuals graphic posters, cinematic 4K video editing, and motion typography."
          }
        ],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Development & Security Services",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Full-Stack Next.js & React Web Application Development",
                "description": "Custom high-performance web applications built with Next.js 15, TypeScript, Tailwind CSS, and scalable backends.",
                "provider": { "@id": "https://www.mrsaqib.me/#person" },
                "areaServed": ["Pakistan", "Worldwide"]
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Cyber Security Hardening & Penetration Testing",
                "description": "Supabase Row-Level Security (RLS) enforcement, OWASP Top 10 vulnerability remediation, and API defense.",
                "provider": { "@id": "https://www.mrsaqib.me/#person" },
                "areaServed": ["Pakistan", "Worldwide"]
              }
            }
          ]
        }
      },
      {
        "@type": "ItemList",
        "@id": "https://www.mrsaqib.me/skills#skillset",
        "name": "Mr Saqib Technical Skills Inventory",
        "description": "Verified production competencies across Frontend, Backend, Cyber Security, and Mobile App engineering.",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Frontend & React Ecosystem",
            "description": "Next.js 15, React 19, TypeScript, Tailwind CSS, Vite, Framer Motion."
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Cyber Security & Defensive Architecture",
            "description": "Supabase Row-Level Security, API Mirage Guard, Bot Mitigation, Zero-Trust Hardening."
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Backend Runtimes & Database Systems",
            "description": "Node.js 20+, Express.js, PostgreSQL, Supabase, MongoDB, RESTful Microservices."
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "Mobile & Progressive Web Apps (PWA)",
            "description": "Service worker caching, offline capability, cross-platform touch interfaces."
          },
          {
            "@type": "ListItem",
            "position": 5,
            "name": "Visual Media & Creative Production",
            "description": "Saqib Visuals branding, Photoshop, Lightroom, 4K 60FPS cinematic video editing."
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://www.mrsaqib.me/skills#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What are Mr Saqib's primary full stack developer skills?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Mr Saqib (Saqib 242) specializes in end-to-end full stack web development using Next.js 15, React 19, TypeScript, Tailwind CSS, Node.js, Express, and PostgreSQL/MongoDB. He develops scalable, hardened digital platforms with sub-0.4 second Core Web Vitals."
            }
          },
          {
            "@type": "Question",
            "name": "Does Mr Saqib provide cyber security and penetration testing services in Pakistan?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Based in Gojra, Pakistan, Mr Saqib provides enterprise-grade cyber security hardening, Supabase Row-Level Security (RLS) enforcement, API Mirage Guard honeypot defense, OWASP vulnerability assessments, and web application pentesting for local and international clients."
            }
          },
          {
            "@type": "Question",
            "name": "What tech stack does Saqib 242 use for web and mobile development?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "His core tech stack includes Next.js 15 (App & Pages Router), React 19, TypeScript, Node.js 20+, Express.js, PostgreSQL, Supabase, MongoDB, Tailwind CSS, Vite, and Progressive Web App (PWA) offline architectures."
            }
          },
          {
            "@type": "Question",
            "name": "How can I contact or hire Mr Saqib for a project?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can contact Mr Saqib directly via official WhatsApp & Phone at 03478936242 (+92 347 8936242) or by email at mrsaqib242242@gmail.com for instant project quotes, custom web development, and cyber security audits."
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <Head>
        <title key="title">Mr Saqib Skills | Full-Stack Developer &amp; Cyber Security Expert Pakistan (Saqib 242)</title>
        <meta 
          key="description" 
          name="description" 
          content="Explore Mr Saqib's (Saqib 242) technical skills: Full-Stack Next.js 15 &amp; React 19 web development, Zero-Trust Cyber Security &amp; Supabase RLS, Node.js backends, and Mobile PWAs in Pakistan. Contact: 03478936242." 
        />
        <meta 
          key="keywords" 
          name="keywords" 
          content="mr saqib skills, saqib 242 skills, saqib skills, full stack developer skills pakistan, cyber security expert skills, next.js and react developer skills, mr saqib developer, web developer gojra faisalabad, node.js backend architect, supabase rls security, 03478936242, mrsaqib242242@gmail.com, saqib dev" 
        />
        
        {/* Canonical */}
        <link key="canonical" rel="canonical" href="https://www.mrsaqib.me/skills" />

        {/* OpenGraph & WhatsApp Preview */}
        <meta key="og:type" property="og:type" content="website" />
        <meta key="og:title" property="og:title" content="Mr Saqib Skills | Full-Stack Developer &amp; Cyber Security Expert Pakistan (Saqib 242)" />
        <meta key="og:description" property="og:description" content="Explore Mr Saqib's (Saqib 242) technical skills: Full-Stack Next.js 15 &amp; React 19 web development, Zero-Trust Cyber Security &amp; Supabase RLS, Node.js backends, and Mobile PWAs in Pakistan. Contact: 03478936242." />
        <meta key="og:url" property="og:url" content="https://www.mrsaqib.me/skills" />
        <meta key="og:image" property="og:image" content="https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png" />
        <meta key="og:image:secure_url" property="og:image:secure_url" content="https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png" />
        <meta key="og:image:type" property="og:image:type" content="image/png" />
        <meta key="og:image:width" property="og:image:width" content="1200" />
        <meta key="og:image:height" property="og:image:height" content="630" />
        <meta key="og:site_name" property="og:site_name" content="Mr Saqib Portfolio" />
        <meta key="og:locale" property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
        <meta key="twitter:title" name="twitter:title" content="Mr Saqib Skills | Full-Stack Developer &amp; Cyber Security Expert Pakistan (Saqib 242)" />
        <meta key="twitter:description" name="twitter:description" content="Explore Mr Saqib's (Saqib 242) technical skills: Full-Stack Next.js 15 &amp; React 19 web development, Zero-Trust Cyber Security &amp; Supabase RLS, Node.js backends, and Mobile PWAs in Pakistan." />
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
