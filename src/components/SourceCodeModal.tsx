import React from 'react';
import { motion } from 'motion/react';
import { X, ExternalLink } from 'lucide-react';

const links = [
  { name: '22 HTML Source Code Zip', url: 'https://www.mediafire.com/file/ttlaygipd4qi98t/FTGM-ALL-TOOL-LEAKED-BY-FT.ZIP/file', colors: 'from-[#f59e0b] to-[#b45309] shadow-[0_10px_20px_rgba(245,158,11,0.3)]', textColor: 'text-white' },
  { name: 'Portfolio', url: 'https://shortpro.vercel.app/Portfolio', colors: 'from-[#2b88d8] to-[#155799] shadow-[0_10px_20px_rgba(43,136,216,0.3)]', textColor: 'text-white' },
  { name: 'Portfolio 2', url: 'https://shortpro.vercel.app/Portfolio2', colors: 'from-[#ff9a44] to-[#fc6076] shadow-[0_10px_20px_rgba(252,96,118,0.3)]', textColor: 'text-white' },
  { name: 'Sim Database', url: 'https://shortpro.vercel.app/Simdatabas', colors: 'from-[#1e293b] to-[#0f172a] shadow-[0_10px_20px_rgba(15,23,42,0.5)]', textColor: 'text-white' },
  { name: 'TikTok', url: 'https://shortpro.vercel.app/TikTok', colors: 'from-[#f8fafc] to-[#cbd5e1] shadow-[0_10px_20px_rgba(255,255,255,0.2)]', textColor: 'text-[#0f172a]' },
  { name: 'Sensitive', url: 'https://shortpro.vercel.app/Sensitivit', colors: 'from-[#ef4444] to-[#991b1b] shadow-[0_10px_20px_rgba(239,68,68,0.3)]', textColor: 'text-white' },
  { name: 'Camera Hack', url: 'https://shortpro.vercel.app/Camerahack', colors: 'from-[#ec4899] to-[#be185d] shadow-[0_10px_20px_rgba(236,72,153,0.3)]', textColor: 'text-white' },
  { name: 'Hosting', url: 'https://shortpro.vercel.app/Hosting', colors: 'from-[#8b5cf6] to-[#5b21b6] shadow-[0_10px_20px_rgba(139,92,246,0.3)]', textColor: 'text-white' },
  { name: 'Hosting (Alt)', url: 'https://shortpro.vercel.app/Hosting', colors: 'from-[#14b8a6] to-[#0f766e] shadow-[0_10px_20px_rgba(20,184,166,0.3)]', textColor: 'text-white' },
];

export function SourceCodeModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-[#161616] p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] w-full max-w-md max-h-[90vh] md:max-h-[85vh] flex flex-col shadow-2xl relative border border-white/5"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="absolute top-4 right-4 md:top-6 md:right-6 text-white/40 hover:text-white transition-colors p-2 bg-white/5 hover:bg-white/10 rounded-full z-20"
          onClick={onClose}
        >
          <X size={18} className="md:w-5 md:h-5" />
        </button>

        <div className="text-center mb-5 md:mb-6 shrink-0 mt-4 md:mt-0 relative z-10">
          <h2 className="font-display text-2xl md:text-3xl text-white mb-1 md:mb-2 uppercase tracking-widest font-bold leading-tight">Source Code</h2>
          <p className="text-white/40 text-[10px] md:text-xs uppercase tracking-[0.3em] mb-4">Private Links</p>
          
          <a
            href="https://whatsapp.com/channel/" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-[#1a1a1a] border border-[#25D366]/30 hover:bg-[#25D366]/10 text-white px-4 py-2.5 w-[90%] max-w-[260px] mx-auto rounded-full font-bold text-[10px] md:text-[11px] uppercase tracking-wide transition-all duration-300 shadow-lg shadow-[#25D366]/10"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-5 h-5" />
            Join Channel for Passwords
          </a>
        </div>
        
        <div className="flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto pr-2 pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {links.map((link, i) => (
            <motion.a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative w-full py-3 px-5 md:px-6 rounded-xl flex items-center justify-between
                bg-gradient-to-b ${link.colors}
                border-t-[1px] border-white/30 border-b-[3px] border-black/40
                group overflow-hidden
              `}
            >
              {/* Glossy top highlight */}
              <div className="absolute top-0 left-0 right-0 h-[40%] bg-gradient-to-b from-white/30 to-transparent rounded-t-xl pointer-events-none"></div>
              {/* Glow overlay */}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 pointer-events-none"></div>
              
              <span className={`font-bold text-xs md:text-sm uppercase tracking-widest ${link.textColor} z-10 drop-shadow-md`}>
                {link.name}
              </span>
              
              <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-black/10 flex items-center justify-center z-10 shadow-inner group-hover:bg-black/20 transition-colors">
                <ExternalLink size={12} className={`${link.textColor} opacity-90`} />
              </div>
            </motion.a>
          ))}
        </div>
        
        <div className="mt-4 text-center shrink-0">
            <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Powered by Saqib</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default SourceCodeModal;
