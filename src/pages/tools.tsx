import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ToolsPage from '../components/ToolsPage';
import WebsitePlansPage from '../components/WebsitePlansPage';
import FreeCoursesModal from '../components/FreeCoursesModal';
import SourceCodeModal from '../components/SourceCodeModal';

export default function ToolsRoute() {
  const router = useRouter();
  const [isWebsitePlansOpen, setIsWebsitePlansOpen] = useState(false);
  const [isFreeCoursesOpen, setIsFreeCoursesOpen] = useState(false);
  const [isSourceCodeOpen, setIsSourceCodeOpen] = useState(false);

  const toolsSchemas = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": "https://mrsaqib242.vercel.app/tools#breadcrumb",
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
            "name": "Mr Saqib Tools & Developer Utilities",
            "item": "https://mrsaqib242.vercel.app/tools"
          }
        ]
      },
      {
        "@type": "CollectionPage",
        "@id": "https://mrsaqib242.vercel.app/tools#collection",
        "url": "https://mrsaqib242.vercel.app/tools",
        "name": "Mr Saqib Tools & Developer Utilities | Free Online Code Tools & SEO Studio (Saqib 242)",
        "alternateName": [
          "Mr Saqib Tools",
          "Mr Saqib Tool",
          "Saqib Tools",
          "Saqib 242 Web Tools",
          "Saqib Tools OS",
          "Saqib Developer Utilities",
          "Free Online Developer Tools Pakistan"
        ],
        "description": "Comprehensive online suite of free developer utilities, live sandbox runners, AI tools, modded packages, source code repositories, and web builder platforms engineered by Muhammad Saqib (Saqib 242). Direct WhatsApp: 03478936242 | mrsaqib242242@gmail.com.",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://mrsaqib242.vercel.app/#website",
          "url": "https://mrsaqib242.vercel.app",
          "name": "Mr Saqib Developer Portfolio"
        },
        "about": { "@id": "https://mrsaqib242.vercel.app/#person" },
        "mainEntity": { "@id": "https://mrsaqib242.vercel.app/tools#itemlist" }
      },
      {
        "@type": "Person",
        "@id": "https://mrsaqib242.vercel.app/#person",
        "name": "Muhammad Saqib",
        "alternateName": ["Mr Saqib", "Saqib 242", "mrsaqib242", "Saqib Dev"],
        "telephone": "03478936242",
        "email": "mrsaqib242242@gmail.com",
        "jobTitle": "Lead Full-Stack Web Architect & AI Engineer",
        "url": "https://mrsaqib242.vercel.app",
        "image": "https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Gojra",
          "addressRegion": "Punjab",
          "addressCountry": "PK"
        },
        "sameAs": [
          "https://github.com/mrsaqib242",
          "https://www.instagram.com/mr_saqib242",
          "https://mrsaqib242.vercel.app/channel"
        ]
      },
      {
        "@type": "ItemList",
        "@id": "https://mrsaqib242.vercel.app/tools#itemlist",
        "name": "Mr Saqib Developer Tools & Web Utilities Suite",
        "description": "Curated collection of online web developer tools, AI utilities, coding repos, and cloud platforms created and verified by Muhammad Saqib.",
        "numberOfItems": 9,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "item": {
              "@type": "WebApplication",
              "name": "Pricing & Web Packages",
              "description": "Explore custom web development packages, pricing tiers, and direct consultation quotes.",
              "url": "https://mrsaqib242.vercel.app/plans",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            }
          },
          {
            "@type": "ListItem",
            "position": 2,
            "item": {
              "@type": "WebApplication",
              "name": "VIP WhatsApp Channel",
              "description": "Join Saqib official WhatsApp channel for instant code drops, security alerts, and dev updates.",
              "url": "https://mrsaqib242.vercel.app/channel",
              "applicationCategory": "SocialApplication",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            }
          },
          {
            "@type": "ListItem",
            "position": 3,
            "item": {
              "@type": "WebApplication",
              "name": "Explore Dev Hacks & Tricks",
              "description": "Curated developer tricks, coding shortcuts, web hacking defenses, and productivity tips.",
              "url": "https://h4k3r-gallery.vercel.app/",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            }
          },
          {
            "@type": "ListItem",
            "position": 4,
            "item": {
              "@type": "WebApplication",
              "name": "Saqib API Services",
              "description": "High-performance cloud endpoints, RESTful APIs, and programmatic microservices.",
              "url": "https://apisaqib.vercel.app",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            }
          },
          {
            "@type": "ListItem",
            "position": 5,
            "item": {
              "@type": "WebApplication",
              "name": "Make Your Own Tools Builder",
              "description": "Interactive no-code builder to craft custom web utilities, calculators, and tools.",
              "url": "https://protool.zone.id",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            }
          },
          {
            "@type": "ListItem",
            "position": 6,
            "item": {
              "@type": "WebApplication",
              "name": "Own Web Builder & Cloud Hosting",
              "description": "Instant website deployment, custom domain setup, and cloud hosting generator.",
              "url": "https://ownweb-theta.vercel.app/",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            }
          },
          {
            "@type": "ListItem",
            "position": 7,
            "item": {
              "@type": "WebApplication",
              "name": "Modded APKs & Android Utilities",
              "description": "Verified mobile APKs, utility packages, and clean downloads for power users.",
              "url": "https://liteapks.com/",
              "applicationCategory": "UtilitiesApplication",
              "operatingSystem": "Android",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            }
          },
          {
            "@type": "ListItem",
            "position": 8,
            "item": {
              "@type": "WebApplication",
              "name": "Source Code Vault",
              "description": "Free open-source codebases, React templates, and Next.js production repositories.",
              "url": "https://mrsaqib242.vercel.app/tools#source-code",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            }
          },
          {
            "@type": "ListItem",
            "position": 9,
            "item": {
              "@type": "WebApplication",
              "name": "Free Courses Hub",
              "description": "Comprehensive software development, coding tutorials, and masterclasses by Saqib Dev.",
              "url": "https://mrsaqib242.vercel.app/tools#free-courses",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "All",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            }
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://mrsaqib242.vercel.app/tools#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is Mr Saqib Tools (Saqib 242) and are these web tools 100% free?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Mr Saqib Tools is an all-in-one web utilities suite and mobile-styled developer OS built by Muhammad Saqib (Saqib 242). It provides 100% free access to developer APIs, coding vaults, AI tools, educational courses, and web building platforms without any subscription or hidden fees."
            }
          },
          {
            "@type": "Question",
            "name": "Can I request custom automation, bespoke web tools, or APIs from Muhammad Saqib?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, absolutely! Muhammad Saqib designs and engineers custom high-performance web applications, specialized scrapers, calculation engines, and private REST APIs for businesses across Pakistan (Gojra, Faisalabad, Lahore, Karachi, Islamabad) and worldwide. You can request a custom tool directly via WhatsApp at 03478936242 or email mrsaqib242242@gmail.com."
            }
          },
          {
            "@type": "Question",
            "name": "Does Mr Saqib Tools OS work on mobile devices without installing any software or apps?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! The entire Tools OS operates directly in any modern mobile or desktop web browser (Chrome, Safari, Edge, Firefox). It features an interactive mobile-styled UI with zero installation, zero downloads, and instantaneous loading speeds."
            }
          },
          {
            "@type": "Question",
            "name": "How do I access free source code repositories, Next.js templates, and programming courses?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can open the Source Code Vault or Free Courses Hub directly inside the Mr Saqib Tools interface to download production-tested React, Next.js, and Node.js templates, or start free web development and cyber security masterclasses."
            }
          },
          {
            "@type": "Question",
            "name": "How can I contact Muhammad Saqib for web development or SEO consultation in Pakistan?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can connect directly with Muhammad Saqib via official WhatsApp at 03478936242 (+92 347 8936242) or via email at mrsaqib242242@gmail.com. In-person consultations are available in Gojra and Faisalabad, Punjab, as well as global remote consultations."
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <Head>
        <title key="title">Mr Saqib Web Tools &amp; Developer Utilities | Free Online Code Tools &amp; SEO Studio (Saqib 242)</title>
        <meta 
          key="description" 
          name="description" 
          content="Explore Mr Saqib Tools (mr saqib tool) — an all-in-one mobile-styled OS featuring free web utilities, AI tools, developer software, calculators, and verified web resources by Muhammad Saqib. Direct WhatsApp: 03478936242 | mrsaqib242242@gmail.com." 
        />
        <meta 
          key="keywords" 
          name="keywords" 
          content="mr saqib tool, mr saqib tools, saqib tool, saqib tools, mr saqib, saqib 242 tools, mr saqib dev utilities, free online tools pakistan, ai tools mr saqib, developer tools saqib dev, web utilities saqib, saqib visual tools, online developer tools pakistan, web tools faisalabad, seo tools gojra, 03478936242" 
        />
        <meta name="author" content="Muhammad Saqib (Saqib 242)" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Canonical */}
        <link key="canonical" rel="canonical" href="https://mrsaqib242.vercel.app/tools" />

        {/* Geographic / Regional SEO Tags */}
        <meta name="geo.region" content="PK-PB" />
        <meta name="geo.placename" content="Gojra, Faisalabad, Punjab, Pakistan" />
        <meta name="geo.position" content="31.1494;72.6842" />
        <meta name="ICBM" content="31.1494, 72.6842" />

        {/* OpenGraph */}
        <meta key="og:type" property="og:type" content="website" />
        <meta key="og:title" property="og:title" content="Mr Saqib Web Tools &amp; Developer Utilities | Free Online Code Tools &amp; SEO Studio (Saqib 242)" />
        <meta key="og:description" property="og:description" content="Explore Mr Saqib Tools (mr saqib tool) — an all-in-one mobile-styled OS featuring free web utilities, AI tools, developer software, calculators, and verified web resources by Muhammad Saqib. WhatsApp: 03478936242." />
        <meta key="og:url" property="og:url" content="https://mrsaqib242.vercel.app/tools" />
        <meta key="og:image" property="og:image" content="https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png" />
        <meta key="og:image:secure_url" property="og:image:secure_url" content="https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Mr Saqib Web Tools &amp; Developer Utilities OS" />
        <meta key="og:site_name" property="og:site_name" content="Mr Saqib Portfolio" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card */}
        <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
        <meta key="twitter:title" name="twitter:title" content="Mr Saqib Web Tools &amp; Developer Utilities | Free Online Code Tools &amp; SEO Studio (Saqib 242)" />
        <meta key="twitter:description" name="twitter:description" content="Explore Mr Saqib Tools (mr saqib tool) — an all-in-one mobile-styled OS featuring free web utilities, AI tools, developer software, calculators, and verified web resources by Muhammad Saqib. WhatsApp: 03478936242." />
        <meta key="twitter:image" name="twitter:image" content="https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png" />
        <meta name="twitter:creator" content="@mr_saqib242" />

        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(toolsSchemas).replace(/</g, '\\u003c')
          }}
        />
      </Head>

      <ToolsPage
        onClose={() => router.push('/')}
        onOpenWebsitePlans={() => setIsWebsitePlansOpen(true)}
        onOpenFreeCourses={() => setIsFreeCoursesOpen(true)}
        onOpenSourceCode={() => setIsSourceCodeOpen(true)}
        onOpenHacks={() => window.open('https://h4k3r-gallery.vercel.app/', '_blank')}
      />

      {/* Embedded Modals if triggered from tools */}
      {isWebsitePlansOpen && (
        <WebsitePlansPage onBack={() => setIsWebsitePlansOpen(false)} />
      )}

      {isFreeCoursesOpen && (
        <FreeCoursesModal onClose={() => setIsFreeCoursesOpen(false)} />
      )}

      {isSourceCodeOpen && (
        <SourceCodeModal onClose={() => setIsSourceCodeOpen(false)} />
      )}
    </>
  );
}
