import Head from 'next/head';
import Link from 'next/link';
import {
  FaRobot,
  FaWhatsapp,
  FaArrowRight,
  FaCheckCircle,
  FaBolt,
  FaShieldAlt,
  FaTerminal,
  FaCode,
  FaKey,
  FaArrowLeft
} from 'react-icons/fa';

const PREVIEW_IMAGE = 'https://ik.imagekit.io/mrsaqib/mrsaqib242-img25_7oG52NZUY.png';

const schemaData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://www.mrsaqib.me/bot#software',
      name: 'Saqib MD Bot',
      alternateName: ['Saqib Bot', 'Saqib MD', 'Saqib WhatsApp Bot', 'Saqib-MD Bot', 'Saqib MD User Bot'],
      applicationCategory: 'CommunicationApplication',
      operatingSystem: 'Android, iOS, Windows, macOS, Linux, Cloud Engine',
      softwareVersion: '2.4.2',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock'
      },
      description: 'Saqib MD Bot is an elite multi-device WhatsApp user bot engineered by Muhammad Saqib (Saqib 242). Features lightning-fast auto replies, media downloaders, group moderation, and custom command modules.',
      url: 'https://www.mrsaqib.me/bot',
      downloadUrl: 'https://www.mrsaqib.me/pair',
      featureList: [
        'Multi-Device WhatsApp Web Pairing (SAQ1-BXMD)',
        'High-Speed Cloud Deployment & 11-Node Mega Cluster',
        'Automated Chat & Group Administration',
        'TikTok, YouTube, Facebook Media Downloader',
        'Custom Commands & Plugin Architecture',
        '24/7 Zero-Lag Uptime Engine'
      ],
      author: {
        '@type': 'Person',
        '@id': 'https://www.mrsaqib.me/#person',
        name: 'Muhammad Saqib',
        alternateName: ['Mr Saqib', 'Saqib 242', 'Saqib Dev', 'Saqib MD'],
        url: 'https://www.mrsaqib.me'
      }
    },
    {
      '@type': 'WebPage',
      '@id': 'https://www.mrsaqib.me/bot#webpage',
      url: 'https://www.mrsaqib.me/bot',
      name: 'Saqib MD Bot | Powerful WhatsApp User Bot by Muhammad Saqib',
      description: 'Official launch portal and gateway for Saqib MD Bot. Connect your WhatsApp, generate pairing codes (SAQ1-BXMD), and automate your daily tasks with ultrasonic speed.',
      inLanguage: ['en-US', 'ur-PK'],
      isPartOf: {
        '@type': 'WebSite',
        '@id': 'https://www.mrsaqib.me/#website',
        name: 'Mr Saqib Developer Portfolio',
        url: 'https://www.mrsaqib.me'
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
      '@id': 'https://www.mrsaqib.me/#person',
      name: 'Muhammad Saqib',
      alternateName: ['Mr Saqib', 'Saqib 242', 'Saqib Visuals', 'Saqib Dev', 'Saqib MD'],
      jobTitle: 'Lead Full-Stack Web Architect & Bot Engineer',
      telephone: '+923478936242',
      email: 'mrsaqib242242@gmail.com',
      url: 'https://www.mrsaqib.me',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Gojra',
        addressRegion: 'Punjab',
        addressCountry: 'PK'
      },
      sameAs: [
        'https://www.mrsaqib.me/pair',
        'https://wa.me/923478936242',
        'https://github.com/techai342',
        'https://instagram.com/mr_saqib242',
        'https://tiktok.com/@mr_saqib_242'
      ]
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://www.mrsaqib.me/bot#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Saqib MD Bot?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Saqib MD Bot (also known as Saqib Bot) is a multi-device WhatsApp user bot built by Muhammad Saqib. It provides automated intelligent chat controls, group moderation, fast media downloaders, and custom plugin integration.'
          }
        },
        {
          '@type': 'Question',
          name: 'How do I connect and launch Saqib MD Bot?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You can launch Saqib MD Bot directly by opening https://www.mrsaqib.me/pair. Enter your WhatsApp number to generate your instant pairing code (SAQ1-BXMD) and link your session in 5 seconds.'
          }
        },
        {
          '@type': 'Question',
          name: 'Is Saqib MD Bot free to use?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! Saqib MD Bot is 100% free and open for users. It is optimized for zero latency and runs seamlessly on modern cloud hosting.'
          }
        },
        {
          '@type': 'Question',
          name: 'Who created Saqib MD Bot?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Saqib MD Bot was created and engineered by Muhammad Saqib (Mr Saqib / Saqib 242), a full-stack engineer and cyber security specialist from Gojra, Punjab, Pakistan.'
          }
        }
      ]
    }
  ]
};

export default function BotPage() {
  return (
    <div className="min-h-screen bg-[#070b12] text-white flex flex-col items-center justify-between p-4 relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-black">
      <Head>
        <title>Saqib MD Bot | Powerful WhatsApp User Bot by Muhammad Saqib (mrsaqib.me/bot)</title>
        <meta name="title" content="Saqib MD Bot | Powerful WhatsApp User Bot by Muhammad Saqib (mrsaqib.me/bot)" />
        <meta
          name="description"
          content="Saqib MD Bot is a high-speed multi-device WhatsApp user bot engineered by Muhammad Saqib. Automate chats, media downloading, group moderation, and AI chat. Pair instantly with code SAQ1-BXMD."
        />
        <meta
          name="keywords"
          content="saqib bot, saqib md, saqib md bot, saqib whatsapp bot, mr saqib bot, saqib bot pair, saqib md pairing code, saq1bxmd, saqib md multi device bot, download saqib md bot, saqib bot gojra, saqib bot faisalabad"
        />
        <meta name="author" content="Muhammad Saqib (Saqib 242)" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <link rel="canonical" href="https://www.mrsaqib.me/bot" />

        {/* Geographic / Regional SEO Tags */}
        <meta name="geo.region" content="PK-PB" />
        <meta name="geo.placename" content="Gojra, Faisalabad, Punjab, Pakistan" />
        <meta name="geo.position" content="31.1494;72.6842" />
        <meta name="ICBM" content="31.1494, 72.6842" />

        {/* OpenGraph & Twitter Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.mrsaqib.me/bot" />
        <meta property="og:site_name" content="Mr Saqib Developer Showcase" />
        <meta property="og:title" content="Saqib MD Bot | Powerful WhatsApp User Bot by Saqib" />
        <meta
          property="og:description"
          content="High-speed WhatsApp multi-device user bot with AI integration, media downloaders, and instant web pairing code (SAQ1-BXMD)."
        />
        <meta property="og:image" content={PREVIEW_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </Head>

      {/* Cyberpunk background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 w-full max-w-xl flex items-center justify-between py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <FaArrowLeft className="w-3 h-3" />
          <span>mrsaqib.me</span>
        </Link>
        <Link
          href="/pair"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-400 hover:bg-cyan-500/20 transition-all font-mono"
        >
          <FaKey className="w-3 h-3" />
          <span>Web Pair (/pair)</span>
        </Link>
      </header>

      {/* Main Glass Card */}
      <main className="relative z-10 max-w-md w-full my-auto bg-slate-900/85 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 text-center backdrop-blur-xl shadow-2xl shadow-cyan-950/60">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/25 flex items-center justify-center animate-pulse">
          <div className="w-full h-full bg-[#08171b] rounded-[14px] flex items-center justify-center">
            <FaRobot className="w-10 h-10 text-cyan-400" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-medium mb-3">
          <FaCheckCircle className="w-3 h-3 text-emerald-400" />
          <span>Official WhatsApp User Bot</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          Saqib MD Bot
        </h1>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          High-performance <span className="text-cyan-400 font-semibold">Saqib MD</span> multi-device cloud engine. Pair in 5 seconds and automate your WhatsApp workflows with 24/7 uptime.
        </p>

        {/* Feature badges */}
        <div className="grid grid-cols-3 gap-2 mb-6 text-[11px] text-slate-300">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2.5 flex flex-col items-center gap-1">
            <FaWhatsapp className="w-4 h-4 text-emerald-400" />
            <span className="font-medium">Multi-Device</span>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2.5 flex flex-col items-center gap-1">
            <FaBolt className="w-4 h-4 text-amber-400" />
            <span className="font-medium">Zero Latency</span>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2.5 flex flex-col items-center gap-1">
            <FaShieldAlt className="w-4 h-4 text-cyan-400" />
            <span className="font-medium">100% Free</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/pair"
            className="inline-flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-bold text-sm transition-all shadow-lg shadow-cyan-600/30 active:scale-[0.98]"
          >
            <FaKey className="w-4 h-4 text-black" />
            <span>Generate Pairing Code (/pair)</span>
            <FaArrowRight className="w-3.5 h-3.5 ml-1 text-black" />
          </Link>

          <a
            href="https://wa.me/923478936242?text=.pair"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-750 hover:border-emerald-500/40 text-slate-300 hover:text-white font-medium text-xs transition-all active:scale-[0.98]"
          >
            <FaWhatsapp className="w-4 h-4 text-emerald-400" />
            <span>Pair via WhatsApp Chat (.pair)</span>
          </a>
        </div>

        {/* SEO Information Section */}
        <article className="mt-8 pt-6 border-t border-slate-800/80 text-left text-xs text-slate-400 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-zinc-200 mb-1 flex items-center gap-2">
              <FaTerminal className="text-cyan-400 w-3.5 h-3.5" />
              About Saqib MD WhatsApp Bot
            </h2>
            <p className="text-[11px] leading-relaxed text-slate-400">
              <strong>Saqib MD Bot</strong> (commonly known as <em>saqib bot</em> or <em>saqib md</em>) is an automated WhatsApp bot system engineered by <strong>Muhammad Saqib</strong> (Saqib 242). It allows users to link their WhatsApp account via web pairing with custom code <code className="text-cyan-400 font-mono">SAQ1-BXMD</code>, download status videos, moderate groups, and execute custom plugins with 100% cloud uptime.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-zinc-200 mb-1 flex items-center gap-2">
              <FaCode className="text-emerald-400 w-3.5 h-3.5" />
              Key Features & Capabilities
            </h2>
            <ul className="text-[11px] list-disc list-inside space-y-1 text-slate-400">
              <li>Direct Web Pair Code generator for instant WhatsApp link.</li>
              <li>Multi-device synchronization without keeping phone connected.</li>
              <li>HD video & audio downloader (TikTok, YouTube, Reels, Facebook).</li>
              <li>Integrated AI chat powered by Codestral, Mistral, and SenseNova.</li>
              <li>Group security, anti-link protection, and auto-status seen.</li>
            </ul>
          </div>
        </article>

        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <span>Engineered by Muhammad Saqib</span>
          <span className="font-mono text-cyan-500/80">Saqib 242 • Gojra, PK</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-xl text-center py-4 text-xs text-slate-500 font-mono">
        © {new Date().getFullYear()} Mr Saqib (mrsaqib.me) • All rights reserved.
      </footer>
    </div>
  );
}
