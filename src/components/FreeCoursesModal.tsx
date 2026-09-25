import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const courses = [
  { name: "DIGITAL PRODUCT CREATION 😗", url: "https://drive.google.com/drive/folders/1QLq5liqvVd5m9NXH-XB69DmRE4wsjPel?usp=sharing", icon: "📱" },
  { name: "ULTIMATE PAYPAL SOLUTION 🤩", url: "https://drive.google.com/file/d/1u44LO0h7o7BJKmhbBeUgfGbfq2X9gfKr/view?usp=drivesdk", icon: "💸" },
  { name: "GOOGLE ADS MASTERY 🌸", url: "https://drive.google.com/drive/folders/14ss-gDN2XwaC9hOPR4urPf4-7JFFDQki?usp=drive_link", icon: "📊" },
  { name: "GRAPHIC DESIGNING 💐", url: "https://drive.google.com/drive/folders/1lZGtW_JNy5GywEIa7oSNH34zRtPVH0DF", icon: "🎨" },
  { name: "WHATSAPP MARKETING 🤌", url: "https://drive.google.com/file/d/1KZfwOIWsiBPt1Z9oDCdE-FbB9bMRkhfy/view?usp=sharing", icon: "💬" },
  { name: "TIK TOK CRASH COURSE ⚡", url: "https://drive.google.com/file/d/1sqVF_RL8ZtV5l4KwdkBiE7JixBGvDNZ6/view?usp=drive_link", icon: "🎵" },
  { name: "GAMES DEVELOPMENT 🎼", url: "https://drive.google.com/drive/folders/1yoi5fdjP_wUjGRF1Ag9IhrizeYZBR8l3?usp=sharing", icon: "🎮" },
  { name: "VIDEO EDITING 💫", url: "https://drive.google.com/drive/folders/17tRu0w2PVb0CeQAXMaXxbkHgV_89GS2K?usp=drive_link", icon: "🎬" },
  { name: "WEB DESIGNING 👅", url: "https://drive.google.com/drive/folders/1Qeg14KlmZU9AqLtRHj1IJ7sgIj8InHgV?usp=drive_link", icon: "🌐" },
  { name: "SMART PHONE GRAPHIC DESIGN ♾️", url: "https://drive.google.com/drive/folders/1lZGtW_JNy5GywEIa7oSNH34zRtPVH0DF?usp=drive_link", icon: "📲" },
  { name: "AMAZON BOOK PUBLISHING 🎧", url: "https://drive.google.com/drive/folders/1UuW0yEnvc6THT8DuOokzaqLo9JO7Q5UU", icon: "📚" },
  { name: "AI ANIMATION 🔥", url: "https://drive.google.com/drive/folders/1-Ds0OK8vI_md67yJhB3wOXQ-nFmXywih", icon: "🤖" },
  { name: "AI PORTRAIT ☪️", url: "https://docs.google.com/document/d/1TphKx6BgnMt5N6z5ZceOZZfwqV8YwTfwQ8wfJMDjI5Q/edit?usp=drivesdk", icon: "🖼️" },
  { name: "SELLER INTEGRATION 🎭", url: "https://drive.google.com/drive/folders/1qaETitfTiOIYyCjbpxnH4RyP5rxXnYrl", icon: "🛒" },
  { name: "COPYWRITING 🚩", url: "https://drive.google.com/drive/folders/1VR9RlNotOXZNRP8WqfVVZJzkk2nHXZG9?usp=sharing", icon: "✍️" },
  { name: "DIGITAL MARKETING BLUEPRINT 😘", url: "https://drive.google.com/file/d/17IPhLvZgCbaUEI8wW1O8MCbNO6E1qI3S/view?usp=sharing", icon: "📈" },
  { name: "CHAT GPT CASH FLOW 😱", url: "https://drive.google.com/file/d/1bv8hiddtrHnZwyunMezqfqb3LpFYcSrz/view?usp=drive_link", icon: "💬💰" },
  { name: "YOUTUBE MONETIZATION ♨️", url: "https://drive.google.com/drive/folders/1NbVyEAqMAa3KWkOYG1glesTdL-BjhW_R", icon: "▶️" }
];

export default function FreeCoursesModal({ onClose }: { onClose: () => void }) {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/90 p-3 md:p-8 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="w-full max-w-[450px] relative bg-gradient-to-b from-[#16171d] to-[#0b0c0f] rounded-3xl overflow-hidden mt-6 mb-6 pb-6 shadow-2xl border border-white/10"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700 transition"
        >
          <X size={18} />
        </button>

        <div className="p-5 pt-8 md:p-6 text-center">
          <div className="inline-flex items-center gap-2 bg-[#ffd7001f] border border-[#ffc80059] rounded-full px-4 py-1.5 mb-3 backdrop-blur-md font-semibold text-sm text-[#ffd966] shadow-[0_10px_20px_-10px_rgba(255,180,0,0.3)] tracking-wide">
            <span className="text-lg leading-none">🔥</span> PREMIUM PAID COURSES FREE <span className="text-lg leading-none">🤩</span>
          </div>
          
          <h1 className="text-3xl font-bold leading-tight mb-2 uppercase tracking-wide bg-gradient-to-b from-white to-[#e0c56e] text-transparent bg-clip-text drop-shadow-[0_6px_10px_rgba(0,0,0,0.25)]">
            SAQIB <span className="font-medium">•</span> GIFT
          </h1>

          <div className="bg-[#1e1f2b] border border-[#383b4a] rounded-full py-2.5 px-4 mt-3 mb-2 flex items-center justify-center gap-2 text-[#f7e05e] font-semibold text-base shadow-[0_8px_18px_rgba(0,0,0,0.6)] backdrop-blur-sm tracking-wide">
            <i className="not-italic text-xl leading-none">🎁</i> Gift by <span className="font-bold mx-1">SAQIB</span> — All Paid Courses Free <i className="text-xl not-italic leading-none">✨</i>
          </div>

          <div className="flex flex-col gap-3.5 mt-5">
            {courses.map((course, i) => (
              <a
                key={i}
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black/40 border border-white/10 rounded-[1.8rem] p-3 pl-4 flex items-center justify-between shadow-[0_18px_28px_-12px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-[#ffc83266] hover:shadow-[0_20px_30px_-10px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,180,0,0.3)] transition-all group backdrop-blur-md"
              >
                <div className="flex items-center gap-3 flex-1 text-left mr-2">
                  <span className="text-2xl drop-shadow-[0_6px_8px_rgba(0,0,0,1)] bg-white/5 w-10 h-10 flex items-center justify-center rounded-2xl shrink-0">
                    {course.icon}
                  </span>
                  <span className="font-bold text-[0.75rem] sm:text-[0.85rem] md:text-[0.95rem] text-[#f1f3f9] break-words leading-tight">
                    {course.name}
                  </span>
                </div>
                
                <button className="bg-gradient-to-br from-[#f9d56e] to-[#e6a800] text-[#0a0a0c] font-bold text-xs px-3 md:px-4 py-2 md:py-2.5 rounded-full shadow-[0_8px_16px_-5px_rgba(230,168,0,0.44),0_0_0_1px_rgba(255,255,200,0.5)] flex items-center gap-1 group-hover:bg-[#ffe083] group-hover:scale-[1.02] active:scale-[0.96] transition-all whitespace-nowrap shrink-0 group-hover:text-black">
                  GET <span className="text-[1rem] leading-none ml-0.5">↗</span>
                </button>
              </a>
            ))}
          </div>

          <div className="text-center mt-7 pt-4 text-xs text-[#8e8fa6] border-t border-dashed border-[#353849] flex flex-col gap-1.5 font-medium">
            <span>⏳ limited access • premium collection</span>
            <span className="font-bold bg-gradient-to-r from-[#f9e076] to-[#f5b81b] text-transparent bg-clip-text">✨ SAQIB • all paid course free ✨</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
