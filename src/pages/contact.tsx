import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ContactTeamPage from '../components/ContactTeamPage';

export default function ContactRoute() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>Hire Mr Saqib | Top Freelance Web Developer in Gojra, Faisalabad, Pakistan</title>
        <meta name="description" content="Get in touch with Mr Saqib (Saqib 242) for cutting-edge web design, custom software development, and expert Google ranking campaigns in Pakistan." />
        <meta name="keywords" content="saqib gojra, gojra developer, hire mr saqib, contact mr saqib, contact saqib 242, hire web developer Faisalabad, contact web designer Gojra, freelance developer Lahore, software engineer Karachi, contact Saqib Dev" />
      </Head>
      <div className="min-h-screen selection:bg-accent selection:text-white pb-24 bg-zinc-950 font-sans">
        <ContactTeamPage onBack={handleBack} />
      </div>
    </>
  );
}
