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

  return (
    <>
      <Head>
        <title>Tools &amp; Utilities OS | Muhammad Saqib Studio</title>
        <meta name="description" content="Explore verified web utilities, AI tools, developer resources, and free apps designed like a mobile home screen." />
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
