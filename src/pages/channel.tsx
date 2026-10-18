import { useEffect } from 'react';
import Head from 'next/head';
import { FaWhatsapp, FaExternalLinkAlt, FaCheckCircle, FaBell, FaCode, FaShieldAlt } from 'react-icons/fa';

const WHATSAPP_CHANNEL_URL = 'https://www.whatsapp.com/channel/0029VbBTSK1EquiWrUt5uV1I';
const PREVIEW_IMAGE = 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png';

const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://mrsaqib242.vercel.app/channel#webpage',
      url: 'https://mrsaqib242.vercel.app/channel',
      name: 'Mr Saqib Official WhatsApp Channel | Live Tech Drops & Source Codes',
      description: 'Official verified VIP WhatsApp Channel of Muhammad Saqib (Mr Saqib / Saqib 242). Free web development source codes, Next.js templates, AI tools, cyber security audits, and daily tech updates.',
      inLanguage: ['en-US', 'ur-PK'],
      isPartOf: {
        '@type': 'WebSite',
        '@id': 'https://mrsaqib242.vercel.app/#website',
        name: 'Mr Saqib Developer Portfolio',
        url: 'https://mrsaqib242.vercel.app'
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: PREVIEW_IMAGE,
        width: 1200,
        height: 630
      }
    },
    {
      '@type': 'Person',
      '@id': 'https://mrsaqib242.vercel.app/#person',
      name: 'Muhammad Saqib',
      alternateName: ['Mr Saqib', 'Saqib 242', 'Saqib Visuals'],
      jobTitle: 'Lead Full-Stack Web Architect & Cyber Security Specialist',
      telephone: '+923478936242',
      email: 'mrsaqib242242@gmail.com',
      url: 'https://mrsaqib242.vercel.app',
      sameAs: [
        WHATSAPP_CHANNEL_URL,
        'https://github.com/techai342',
        'https://instagram.com/mr_saqib242',
        'https://wa.me/923478936242'
      ]
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://mrsaqib242.vercel.app/channel#breadcrumb',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://mrsaqib242.vercel.app'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Official WhatsApp Channel',
          item: 'https://mrsaqib242.vercel.app/channel'
        }
      ]
    }
  ]
};

export default function ChannelRedirectPage() {
  useEffect(() => {
    // Immediate client-side redirection
    if (typeof window !== 'undefined') {
      window.location.replace(WHATSAPP_CHANNEL_URL);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#070b12] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      <Head>
        {/* Instant 0ms Redirect Script: executes before hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if(typeof window!=="undefined"){window.location.replace("${WHATSAPP_CHANNEL_URL}");}`
          }}
        />

        {/* DNS Prefetch & Preconnect for Lightning Fast Network Handshake */}
        <link rel="dns-prefetch" href="https://www.whatsapp.com" />
        <link rel="preconnect" href="https://www.whatsapp.com" crossOrigin="anonymous" />
        <link rel="preload" as="image" href={PREVIEW_IMAGE} />

        {/* Primary Search Engine Meta Tags */}
        <title>Mr Saqib Official WhatsApp Channel | Live Tech Drops & Source Codes</title>
        <meta name="title" content="Mr Saqib Official WhatsApp Channel | Live Tech Drops & Source Codes" />
        <meta
          name="description"
          content="Official verified VIP WhatsApp Channel of Muhammad Saqib (Mr Saqib / Saqib 242). Get free source codes, Next.js templates, web tools, cyber security insights, and instant tech drops (03478936242)."
        />
        <meta
          name="keywords"
          content="Mr Saqib whatsapp channel, saqib whatsapp channel, saqib 242 whatsapp channel, mr saqib channel, join saqib channel, muhammad saqib whatsapp 03478936242, web developer whatsapp channel pakistan, full stack developer whatsapp, tech drops pakistan"
        />
        <meta name="author" content="Muhammad Saqib (Saqib 242)" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href="https://mrsaqib242.vercel.app/channel" />

        {/* Fallback Refresh Meta */}
        <meta httpEquiv="refresh" content={`0; url=${WHATSAPP_CHANNEL_URL}`} />

        {/* OpenGraph / WhatsApp Rich Preview Card */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://mrsaqib242.vercel.app/channel" />
        <meta property="og:site_name" content="Mr Saqib Developer Showcase" />
        <meta property="og:title" content="Join Mr Saqib Official WhatsApp Channel" />
        <meta
          property="og:description"
          content="Exclusive full-stack code drops, developer tools, Next.js source codes, and instant tech announcements by Muhammad Saqib (03478936242)."
        />
        <meta property="og:image" content={PREVIEW_IMAGE} />
        <meta property="og:image:secure_url" content={PREVIEW_IMAGE} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://mrsaqib242.vercel.app/channel" />
        <meta name="twitter:title" content="Join Mr Saqib Official WhatsApp Channel" />
        <meta
          name="twitter:description"
          content="Get instant access to free source code drops, live developer tools, and exclusive tech tutorials by Mr Saqib."
        />
        <meta name="twitter:image" content={PREVIEW_IMAGE} />
        <meta name="twitter:creator" content="@mr_saqib242" />

        {/* Favicon & Touch Icons */}
        <link rel="icon" href={PREVIEW_IMAGE} />
        <link rel="apple-touch-icon" href={PREVIEW_IMAGE} />

        {/* Structured Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </Head>

      {/* Cyberpunk background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative z-10 max-w-md w-full bg-slate-900/85 border border-emerald-500/30 rounded-2xl p-8 text-center backdrop-blur-xl shadow-2xl shadow-emerald-950/60">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-400 p-0.5 shadow-lg shadow-emerald-500/25 flex items-center justify-center animate-pulse">
          <div className="w-full h-full bg-[#081b13] rounded-[14px] flex items-center justify-center">
            <FaWhatsapp className="w-10 h-10 text-emerald-400" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium mb-3">
          <FaCheckCircle className="w-3 h-3 text-emerald-400" />
          <span>Verified Official Community</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          Redirecting to WhatsApp Channel...
        </h1>
        <p className="text-sm text-slate-400 mb-5 leading-relaxed">
          Connecting to <span className="text-emerald-400 font-semibold">Mr Saqib VIP Channel</span> for code drops, project source files, and live developer updates.
        </p>

        {/* Feature badges */}
        <div className="grid grid-cols-3 gap-2 mb-6 text-[11px] text-slate-300">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>Free Codes</span>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaBell className="w-3.5 h-3.5 text-amber-400" />
            <span>Live Drops</span>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2 flex flex-col items-center gap-1">
            <FaShieldAlt className="w-3.5 h-3.5 text-emerald-400" />
            <span>VIP Access</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs text-emerald-400/90 font-mono font-medium">Opening WhatsApp application...</span>
        </div>

        <a
          href={WHATSAPP_CHANNEL_URL}
          className="inline-flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-600/30 active:scale-[0.98]"
        >
          <FaWhatsapp className="w-4 h-4" />
          <span>Click Here if Not Redirected</span>
          <FaExternalLinkAlt className="w-3 h-3 opacity-70 ml-1" />
        </a>

        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <span>Official Developer Portal</span>
          <span className="font-mono text-emerald-500/80">Saqib242 • Gojra, PK</span>
        </div>
      </div>
    </div>
  );
}
