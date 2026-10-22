import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" className="scroll-smooth">
      <Head>
        {/* Google Search Console Verification Tags */}
        <meta name="google-site-verification" content="QBTbRBfM4UaFb99KTDYjmhcWqdv6owEV0e-apSLn-Yg" />
        <meta name="google-site-verification" content="pD9l-_LAF1RsTG4Rnm9PoxzFPDBZ2epWCg8kJ8Vjgu4" />

        {/* Preconnect for external media CDN */}
        <link rel="preconnect" href="https://ik.imagekit.io" />
        <link rel="dns-prefetch" href="https://ik.imagekit.io" />
      </Head>
      <body className="antialiased bg-[#050505] text-white">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
