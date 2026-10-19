import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaTiktok, FaSnapchatGhost } from 'react-icons/fa';
import { useProfileSettings } from '../hooks/useProfileSettings';

export default function Footer() {
  const { profile } = useProfileSettings();

  const socialLinks = [
    {
      name: 'Facebook',
      icon: FaFacebookF,
      gradient: 'bg-gradient-to-b from-[#1877F2] to-[#0C58C2]',
      href: profile.facebook_url || 'https://www.facebook.com/profile.php?id=100085188689033'
    },
    {
      name: 'Instagram',
      icon: FaInstagram,
      gradient: 'bg-gradient-to-tr from-[#FFC107] via-[#E1306C] to-[#833AB4]',
      href: profile.instagram_url || 'https://www.instagram.com/mr_saqib242'
    },
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      gradient: 'bg-gradient-to-b from-[#25D366] to-[#128C7E]',
      href: profile.whatsapp_url || (profile.phone ? `https://wa.me/${profile.phone.replace(/[^0-9]/g, '')}` : 'https://wa.me/923478936242')
    },
    {
      name: 'TikTok',
      icon: FaTiktok,
      gradient: 'bg-gradient-to-b from-[#111111] to-[#000000]',
      href: profile.tiktok_url || 'https://www.tiktok.com/@mr_saqib_242'
    },
    {
      name: 'Snapchat',
      icon: FaSnapchatGhost,
      gradient: 'bg-gradient-to-b from-[#FFFC00] to-[#D4D100]',
      href: profile.snapchat_url || 'https://www.snapchat.com/add/mrsaqib242'
    }
  ];

  return (
    <footer className="w-full bg-zinc-950 py-24 border-t border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="text-center mb-16 relative z-10">
        <h2 className="text-4xl font-black text-white tracking-wider uppercase mb-4">Connect With Me</h2>
        <p className="text-zinc-400 max-w-md mx-auto font-medium">Follow my creative journey and stay updated with my latest visual projects.</p>
      </div>

      {/* 3D Social Icons */}
      <div className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-3xl px-6 relative z-10">
        {socialLinks.map((social, index) => {
          const Icon = social.icon as React.ElementType;
          return (
            <motion.a
              key={social.name}
              href={social.href}
              aria-label={social.name}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
              whileHover={{ scale: 1.15, y: -8 }}
              whileTap={{ scale: 0.95 }}
              className="relative group rounded-full p-[4px] bg-white shadow-[0_15px_35px_rgba(0,0,0,0.5)] cursor-pointer"
            >
              {/* Glossy Inner Circle */}
              <div className={`flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full ${social.gradient} shadow-[inset_0_-6px_12px_rgba(0,0,0,0.4),inset_0_6px_12px_rgba(255,255,255,0.5)]`}>
                <Icon 
                  className={`w-8 h-8 md:w-10 md:h-10 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] ${social.name === 'Snapchat' ? 'text-black' : 'text-white'}`} 
                />
              </div>
            </motion.a>
          );
        })}
      </div>

      {/* Crawlable Internal Links for Googlebot & Users */}
      <nav aria-label="Footer Navigation" className="mt-14 mb-4 relative z-10 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-bold tracking-widest uppercase text-zinc-400">
        <Link href="/" className="hover:text-white transition-colors" title="Mr Saqib Home">Home</Link>
        <span className="text-zinc-700 hidden sm:inline">•</span>
        <Link href="/projects" className="hover:text-white transition-colors" title="Mr Saqib Projects &amp; Portfolio">Mr Saqib Projects</Link>
        <span className="text-zinc-700 hidden sm:inline">•</span>
        <Link href="/plans" className="hover:text-white transition-colors" title="Mr Saqib Plans &amp; Website Pricing">Mr Saqib Plans</Link>
        <span className="text-zinc-700 hidden sm:inline">•</span>
        <Link href="/skills" className="hover:text-white transition-colors" title="Mr Saqib Skills &amp; Tech Stack">Mr Saqib Skills</Link>
        <span className="text-zinc-700 hidden sm:inline">•</span>
        <Link href="/tools" className="hover:text-white transition-colors" title="Mr Saqib Tools (mr saqib tool) | Free Developer Utilities OS">Mr Saqib Tools</Link>
        <span className="text-zinc-700 hidden sm:inline">•</span>
        <Link href="/contact" className="hover:text-white transition-colors" title="Mr Saqib Contacts &amp; Hire Developer">Mr Saqib Contacts</Link>
      </nav>

      <div className="mt-8 text-zinc-500 text-xs font-bold tracking-[0.2em] uppercase relative z-10 flex flex-wrap items-center justify-center gap-2">
        <span>© {new Date().getFullYear()} {profile.brand_name || 'Saqib Visuals'}. All rights reserved.</span>
      </div>
    </footer>
  );
}
