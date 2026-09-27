import React from 'react';
import { motion } from 'motion/react';

export default function PosterShowcase() {
  const imageUrl = "https://ik.imagekit.io/19imy4f1u/lite_1775827045701_StCqgulmx.png";

  return (
    <section id="poster-showcase" className="relative w-full min-h-[100dvh] bg-[#d5c3b5] flex items-center justify-center overflow-hidden py-20 font-sans">
      {/* Faded Background Image */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.15 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <img
          src={`${imageUrl}?tr=w-200,q-30,bl-5`}
          alt=""
          role="presentation"
          className="w-[200%] md:w-[100%] max-w-5xl h-auto object-cover transform -translate-y-10 md:-translate-y-20 blur-[3px]"
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
        />
      </motion.div>

      {/* Main Poster Container */}
      <div className="relative w-full max-w-sm md:max-w-md mx-auto z-10 flex items-center justify-center mt-12">

        {/* Skewed Grey Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute w-[80%] h-[60vh] min-h-[450px] bg-[#b0afac] border-[3px] border-[#5c4b43]/20 shadow-2xl"
          style={{ transform: 'skewX(-12deg)' }}
        >
            {/* Inner shadow for depth */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
        </motion.div>

        {/* Foreground Image */}
        <motion.img
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          src={`${imageUrl}?tr=w-600,q-80`}
          alt="Muhammad Saqib artistic poster showcase"
          className="relative z-20 w-[110%] md:w-[100%] max-w-none h-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.4)] transform translate-y-16 md:translate-y-24"
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
        />

        {/* Top Left Text (Saqib) */}
        <motion.div
          initial={{ opacity: 0, x: -50, rotate: -10 }}
          whileInView={{ opacity: 1, x: 0, rotate: -5 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="absolute top-[10%] left-[-10%] md:left-[-20%] z-30 w-56 h-32 flex items-center justify-center"
        >
          {/* Splatter Background */}
          <svg viewBox="0 0 200 120" className="absolute inset-0 w-full h-full text-[#5c4b43] fill-current drop-shadow-xl" preserveAspectRatio="none">
            <path d="M30,50 C20,30 40,20 70,25 C110,30 150,15 170,30 C190,45 185,70 160,90 C130,110 80,105 50,95 C20,85 40,70 30,50 Z" />
            <path d="M15,35 C10,30 20,25 25,30 C30,35 20,40 15,35 Z" />
            <path d="M10,60 C5,55 15,50 20,55 C25,60 15,65 10,60 Z" />
            <path d="M185,40 C180,35 190,30 195,35 C200,40 190,45 185,40 Z" />
            <path d="M175,80 C170,75 180,70 185,75 C190,80 180,85 175,80 Z" />
            <path d="M50,10 C45,5 55,0 60,5 C65,10 55,15 50,10 Z" />
            <path d="M130,110 C125,105 135,100 140,105 C145,110 135,115 130,110 Z" />
            <path d="M25,45 L35,40 L30,55 Z" />
            <path d="M165,35 L155,40 L160,25 Z" />
            <path d="M155,95 L165,90 L160,105 Z" />
            <path d="M45,90 L55,95 L50,80 Z" />
          </svg>
          <span className="relative z-10 text-white font-sans font-black text-5xl md:text-6xl tracking-wide" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.2)' }}>Saqib</span>
        </motion.div>

        {/* Bottom Center Text (Creative) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="absolute bottom-[-5%] md:bottom-[0%] left-1/2 transform -translate-x-1/2 z-30 w-64 h-24 flex items-center justify-center"
        >
          {/* Brush Background */}
          <svg viewBox="0 0 200 60" className="absolute inset-0 w-full h-full text-[#9c7a6c] fill-current drop-shadow-md" preserveAspectRatio="none">
            <path d="M15,30 Q30,15 100,20 T185,25 Q195,35 180,45 T20,50 Q5,40 15,30 Z" />
            <path d="M5,25 L25,28 L15,32 Z" />
            <path d="M195,35 L175,32 L185,28 Z" />
            <path d="M10,45 L30,42 L20,48 Z" />
            <path d="M190,48 L170,45 L180,52 Z" />
          </svg>
          <span className="relative z-10 font-cursive text-5xl md:text-6xl text-[#2a201a] transform -rotate-2" style={{ textShadow: '1px 1px 0px rgba(255,255,255,0.3)' }}>Creative</span>
        </motion.div>

        {/* Right Vertical Text (VISUALS) */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="absolute top-[35%] right-[-10%] md:right-[-15%] z-30"
        >
          <div className="bg-[#a68a7c] px-3 py-8 shadow-xl border border-white/10" style={{ transform: 'skewX(-12deg)' }}>
            <div className="flex flex-col items-center gap-3" style={{ transform: 'skewX(12deg)' }}>
              {['V', 'I', 'S', 'U', 'A', 'L', 'S'].map((letter, i) => (
                <span key={i} className="text-transparent font-sans font-black text-xl md:text-2xl leading-none opacity-90" style={{ WebkitTextStroke: '1px #4a3a32' }}>
                  {letter}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
