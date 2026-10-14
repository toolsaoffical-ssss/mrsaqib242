import React from 'react';
import { motion } from 'motion/react';
import { Heart, MessageCircle, Send, Bookmark, Home, Search, PlusSquare, User, MoreHorizontal, BadgeCheck } from 'lucide-react';

export default function SocialMagazineShowcase() {
  const imageUrl = "https://ik.imagekit.io/mrsaqib/mrsaqib242-img13_XhJhYKDvf.png";
  const redColor = "#E62B2B";

  return (
    <section id="social-magazine" className="relative w-full min-h-[100dvh] bg-[#f8f8f8] flex flex-col items-center justify-center py-20 font-sans overflow-hidden">
      
      {/* Blurred Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={`${imageUrl}?tr=w-100,q-20,bl-10`} 
          alt="Visual design background preview" 
          className="w-full h-full object-cover blur-2xl opacity-40 scale-110"
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-white/50 mix-blend-overlay"></div>
      </div>

      {/* Huge Background Typography */}
      <div className="absolute inset-0 z-0 flex flex-col justify-between py-10 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 0.9 }}
          transition={{ duration: 1 }}
          className="text-[180px] md:text-[250px] font-black leading-none tracking-tighter text-center"
          style={{ color: redColor }}
        >
          SAQIB
        </motion.div>
        <motion.div 
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 0.9 }}
          transition={{ duration: 1 }}
          className="text-[180px] md:text-[250px] font-black leading-none tracking-tighter text-center"
          style={{ color: redColor }}
        >
          VISUALS
        </motion.div>
      </div>

      {/* Main Card */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative z-10 w-full max-w-[400px] bg-white shadow-[0_30px_60px_rgba(0,0,0,0.15)] flex flex-col"
      >
        
        {/* Card Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <img src={`${imageUrl}?tr=w-80,q-55`} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-gray-200" referrerPolicy="no-referrer" />
            <span className="font-semibold text-sm text-gray-900">saqib.visuals</span>
            <BadgeCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-gray-100 hover:bg-gray-200 transition-colors px-4 py-1.5 rounded text-xs font-bold text-gray-800">
              Follow
            </button>
            <MoreHorizontal className="w-5 h-5 text-gray-500 cursor-pointer" />
          </div>
        </div>

        {/* Card Image Area */}
        <div className="relative w-full aspect-[4/5] bg-gray-100">
          <img src={`${imageUrl}?tr=w-500,q-75`} alt="Main Post" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          
          {/* Left Overlays: Tags */}
          <div className="absolute top-8 -left-4 flex flex-col gap-3 z-20">
            <div className="bg-[#E62B2B] text-white text-xs font-bold px-4 py-1.5 shadow-lg transform -rotate-2">
              Follow us
            </div>
            <div className="bg-[#E62B2B] text-white text-xs font-bold px-4 py-1.5 shadow-lg ml-6 transform rotate-1">
              saqib.project
            </div>
          </div>

          {/* Left Overlays: Square Cutouts */}
          <div className="absolute top-36 -left-6 flex flex-col gap-2 z-20">
            <motion.div whileHover={{ scale: 1.1 }} className="w-16 h-16 border-[3px] border-[#E62B2B] shadow-xl overflow-hidden bg-white">
              <img src={`${imageUrl}?tr=w-150,q-60`} className="w-full h-full object-cover scale-[2.5] origin-[50%_20%]" referrerPolicy="no-referrer" />
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} className="w-16 h-16 border-[3px] border-[#E62B2B] shadow-xl overflow-hidden bg-white ml-2">
              <img src={`${imageUrl}?tr=w-150,q-60`} className="w-full h-full object-cover scale-[2.5] origin-[50%_50%]" referrerPolicy="no-referrer" />
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} className="w-16 h-16 border-[3px] border-[#E62B2B] shadow-xl overflow-hidden bg-white">
              <img src={`${imageUrl}?tr=w-150,q-60`} className="w-full h-full object-cover scale-[2.5] origin-[50%_80%]" referrerPolicy="no-referrer" />
            </motion.div>
          </div>

          {/* Right Overlay: Large Text */}
          <div className="absolute top-12 -right-16 flex flex-col items-end z-20 pointer-events-none">
            <span className="font-black text-7xl leading-[0.85] tracking-tighter drop-shadow-xl" style={{ color: redColor }}>CREA</span>
            <span className="font-black text-7xl leading-[0.85] tracking-tighter text-transparent" style={{ WebkitTextStroke: `2px ${redColor}` }}>TIVE</span>
            <span className="font-black text-7xl leading-[0.85] tracking-tighter drop-shadow-xl" style={{ color: redColor }}>ART</span>
          </div>
        </div>

        {/* Card Footer (Engagement) */}
        <div className="px-4 py-3">
          <div className="flex justify-between items-center mb-3">
            <div className="flex gap-4">
              <Heart className="w-6 h-6 text-gray-800 cursor-pointer hover:text-red-500 transition-colors" />
              <MessageCircle className="w-6 h-6 text-gray-800 cursor-pointer hover:text-gray-500 transition-colors" />
              <Send className="w-6 h-6 text-gray-800 cursor-pointer hover:text-gray-500 transition-colors" />
            </div>
            <Bookmark className="w-6 h-6 text-gray-800 cursor-pointer hover:text-gray-500 transition-colors" />
          </div>
          
          <p className="text-sm text-gray-900 mb-1">
            Disukai oleh <span className="font-bold">arm.project</span> dan <span className="font-bold">jkt. zee</span>
          </p>
          <p className="text-sm text-gray-900 mb-1 font-medium">
            Bandung <span className="text-red-500">❤️</span>
          </p>
          <p className="text-sm text-gray-500 mb-1 cursor-pointer">
            Lihat semua 2006 komentar
          </p>
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
            12 Mei • Lihat terjemahan
          </p>
        </div>

        {/* Bottom Right Overlay: Barcode */}
        <div className="absolute -bottom-8 -right-4 bg-white p-2 shadow-2xl border border-gray-100 flex flex-col items-center z-30 transform rotate-2">
          <span className="font-black text-[11px] leading-tight text-center tracking-wide mb-1" style={{ color: redColor }}>
            MAKE IT<br/>SIMPLE
          </span>
          <div className="w-[70px] h-6 flex items-center justify-between px-1" style={{ backgroundColor: redColor }}>
            <div className="w-[2px] h-4 bg-white"></div>
            <div className="w-[1px] h-4 bg-white"></div>
            <div className="w-[3px] h-4 bg-white"></div>
            <div className="w-[1px] h-4 bg-white"></div>
            <div className="w-[2px] h-4 bg-white"></div>
            <div className="w-[4px] h-4 bg-white"></div>
            <div className="w-[1px] h-4 bg-white"></div>
            <div className="w-[2px] h-4 bg-white"></div>
            <div className="w-[1px] h-4 bg-white"></div>
            <div className="w-[3px] h-4 bg-white"></div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex justify-around items-center py-3 border-t border-gray-100 mt-2">
          <Home className="w-6 h-6 text-gray-800 cursor-pointer" />
          <Search className="w-6 h-6 text-gray-800 cursor-pointer" />
          <PlusSquare className="w-6 h-6 text-gray-800 cursor-pointer" />
          <Heart className="w-6 h-6 text-gray-800 cursor-pointer" />
          <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-300 cursor-pointer">
            <img src={`${imageUrl}?tr=w-80,q-55`} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        </div>

      </motion.div>

      {/* Bottom Text */}
      <div className="relative z-10 mt-16 max-w-md text-center px-6">
        <p className="text-[10px] md:text-xs font-bold text-gray-600 uppercase tracking-widest leading-relaxed">
          SEPERTI PIZZA YANG SELALU DI NANTI-NANTIKAN SEMUA ORANG SELALU NANTIKAN AKU YAH!. HALO AKU SAQIB
        </p>
      </div>

    </section>
  );
}
