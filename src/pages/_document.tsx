import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" className="scroll-smooth">
      <Head>
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
