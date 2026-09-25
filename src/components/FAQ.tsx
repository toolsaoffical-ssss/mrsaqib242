import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "Who is Muhammad Saqib (Saqib242) and what is his background?",
    answer: "Muhammad Saqib, known online as Saqib242 or Saqib Dev, is a premier full-stack web developer, freelance software engineer, and local SEO expert based in Gojra, Faisalabad, Pakistan. He has a rich background in building scalable web apps using Next.js, React, Node.js, MERN stack, as well as developing custom AI integrations and design solutions."
  },
  {
    question: "What web development and AI services does Saqib provide?",
    answer: "Saqib specializes in high-performance React & Next.js applications, custom WordPress & Shopify e-commerce designs, backend database architectures (MongoDB, PostgreSQL), secure API development, and advanced Generative AI integrations (such as OpenAI and Gemini APIs). He serves clients globally and locally in Faisalabad, Lahore, Karachi, and Islamabad."
  },
  {
    question: "How does Muhammad Saqib optimize websites for fast speeds and SEO?",
    answer: "Websites are optimized using advanced techniques including next/dynamic lazy loading, image asset optimization (such as ImageKit.io width/quality parameters), server-side rendering (SSR), minimized CSS bundles, clean semantic HTML structures, and comprehensive geographic/local business schema markup for top-tier Google ranking and AI search visibility."
  },
  {
    question: "How can I contact Muhammad Saqib for a custom website or AI project?",
    answer: "You can reach out directly to Muhammad Saqib (mr_saqib242) by visiting the contact form section of this website, using the instant WhatsApp chat integration, or reviewing our custom website packages and starting a campaign immediately."
  },
  {
    question: "Are the courses and resources on this portfolio really free?",
    answer: "Yes, all premium courses, shared source codes, graphic templates, and developer toolkits displayed on this platform are 100% free of charge. They are gifted to the local Pakistani and global developer community to support learning and technical growth."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Generate FAQ Schema dynamically for high AEO/GEO indexing
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section id="faq" className="py-20 md:py-32 px-6 max-w-4xl mx-auto font-sans">
      {/* Inject FAQ Schema for AI Crawler / SGE optimization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <div className="text-center mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 rounded-full px-4 py-1.5 mb-6 text-sm font-medium text-zinc-300"
        >
          <HelpCircle size={16} className="text-cyan-500" />
          <span>F.A.Q</span>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tight text-white mb-6"
        >
          Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-600">Questions</span>
        </motion.h2>
      </div>

      <div className="flex flex-col gap-4">
        {faqs.map((faq, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`border ${openIndex === index ? 'border-cyan-500/50 bg-zinc-900/60' : 'border-zinc-800 bg-zinc-900/30'} rounded-2xl overflow-hidden transition-colors duration-300 backdrop-blur-sm`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
            >
              <span className={`font-bold text-lg ${openIndex === index ? 'text-white' : 'text-zinc-300'}`}>
                {faq.question}
              </span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180 bg-cyan-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                <ChevronDown size={18} />
              </div>
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="px-6 pb-6 text-zinc-400 leading-relaxed border-t border-zinc-800/50 pt-4 mt-2">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
