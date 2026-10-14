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
            "name": "Mr Saqib Tools",
            "item": "https://mrsaqib242.vercel.app/tools"
          }
        ]
      },
      {
        "@type": "WebApplication",
        "@id": "https://mrsaqib242.vercel.app/tools#webapp",
        "name": "Mr Saqib Tools OS - Free AI & Web Utilities",
        "url": "https://mrsaqib242.vercel.app/tools",
        "description": "Comprehensive suite of free web developer utilities, AI chatbots, APK downloaders, speed testers, and productivity apps engineered by Mr Saqib (Saqib 242).",
        "applicationCategory": "DeveloperApplication",
        "operatingSystem": "All (Web, Android, iOS, Windows, Linux)",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "author": {
          "@type": "Person",
          "name": "Muhammad Saqib",
          "alternateName": ["Mr Saqib", "Saqib 242", "mrsaqib242"],
          "url": "https://mrsaqib242.vercel.app"
        }
      }
    ]
  };

  return (
    <>
      <Head>
        <title key="title">Mr Saqib Tools | Free AI Web Utilities, Dev Apps &amp; Online Software (Saqib 242)</title>
        <meta key="description" name="description" content="Explore Mr Saqib Tools (mr saqib tool) — an all-in-one mobile-styled OS featuring free web utilities, AI tools, developer software, calculators, and verified web resources by Muhammad Saqib." />
        <meta key="keywords" name="keywords" content="mr saqib tool, mr saqib tools, saqib tool, saqib tools, mr saqib, saqib 242 tools, mr saqib dev utilities, free online tools pakistan, ai tools mr saqib, developer tools saqib dev, web utilities saqib, saqib visual tools" />
        
        {/* Canonical */}
        <link key="canonical" rel="canonical" href="https://mrsaqib242.vercel.app/tools" />

        {/* OpenGraph */}
        <meta key="og:type" property="og:type" content="website" />
        <meta key="og:title" property="og:title" content="Mr Saqib Tools | Free AI Web Utilities &amp; Software (Saqib 242)" />
        <meta key="og:description" property="og:description" content="Explore Mr Saqib Tools (mr saqib tool) — an all-in-one mobile-styled OS featuring free web utilities, AI tools, developer software, calculators, and verified web resources by Muhammad Saqib." />
        <meta key="og:url" property="og:url" content="https://mrsaqib242.vercel.app/tools" />
        <meta key="og:image" property="og:image" content="https://ik.imagekit.io/mrsaqib/mrsaqib242-img1_yPzIc8MWvY.png?tr=w-1200,h-630,fo-auto,q-90" />
        <meta key="og:site_name" property="og:site_name" content="Mr Saqib Portfolio" />

        {/* Twitter */}
        <meta key="twitter:card" name="twitter:card" content="summary_large_image" />
        <meta key="twitter:title" name="twitter:title" content="Mr Saqib Tools | Free AI Web Utilities &amp; Software (Saqib 242)" />
        <meta key="twitter:description" name="twitter:description" content="Explore Mr Saqib Tools (mr saqib tool) — an all-in-one mobile-styled OS featuring free web utilities, AI tools, developer software, calculators, and verified web resources by Muhammad Saqib." />
        <meta key="twitter:image" name="twitter:image" content="https://ik.imagekit.io/mrsaqib/mrsaqib242-img1_yPzIc8MWvY.png?tr=w-1200,h-630,fo-auto,q-90" />

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
