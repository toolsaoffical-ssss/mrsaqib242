import React from 'react';
import { motion } from 'motion/react';

// A custom SVG component to create the jagged torn paper edge effect
const RippedEdge = ({ className, inverted = false, shadow = false }: { className?: string, inverted?: boolean, shadow?: boolean }) => (
  <svg
    viewBox="0 0 1000 24"
    preserveAspectRatio="none"
    className={className}
    style={{ 
      transform: inverted ? 'rotate(180deg)' : 'none',
      filter: shadow ? (inverted ? 'drop-shadow(0px -8px 6px rgba(0,0,0,0.4))' : 'drop-shadow(0px -8px 6px rgba(0,0,0,0.4))') : 'none'
    }}
  >
    <path
      d="M0,24 L0,12 L15,18 L30,6 L45,20 L60,8 L75,15 L90,4 L105,18 L120,6 L135,22 L150,10 L165,18 L180,4 L195,16 L210,8 L225,20 L240,6 L255,18 L270,10 L285,22 L300,8 L315,16 L330,4 L345,20 L360,8 L375,18 L390,6 L405,22 L420,10 L435,18 L450,4 L465,16 L480,8 L495,20 L510,6 L525,18 L540,10 L555,22 L570,8 L585,16 L600,4 L615,20 L630,8 L645,18 L660,6 L675,22 L690,10 L705,18 L720,4 L735,16 L750,8 L765,20 L780,6 L795,18 L810,10 L825,22 L840,8 L855,16 L870,4 L885,20 L900,8 L915,18 L930,6 L945,22 L960,10 L975,18 L990,4 L1000,12 L1000,24 Z"
      fill="currentColor"
    />
  </svg>
);

export default function TornPaperShowcase() {
  const topImage = "https://ik.imagekit.io/shaban/SHABAN-1768575240340_5tz9dWXNo.jpg?tr=w-800,q-75";
  const middleImage = "https://ik.imagekit.io/shaban/SHABAN-1768575063823_VKv0h9E-k.jpg?tr=w-800,q-80";
  const bottomImage = "https://ik.imagekit.io/shaban/SHABAN-1768575265565_APidCqJd2.jpg?tr=w-800,q-75";

  return (
    <section className="w-full bg-zinc-900 flex flex-col relative overflow-hidden font-serif">
      
      {/* --- TOP SECTION (B&W) --- */}
      <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        <img 
          src={topImage} 
          alt="Muhammad Saqib monochrome artistic portrait" 
          className="w-full h-full object-cover grayscale contrast-125 brightness-75 object-top"
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-black/20"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute top-1/3 left-0 w-full text-center z-10 flex flex-col items-center px-4"
        >
          <span className="text-white/90 font-sans text-xs md:text-sm tracking-[0.4em] uppercase font-medium mb-3 drop-shadow-md">
            Name Member
          </span>
          <h2 className="text-white text-5xl md:text-7xl font-serif tracking-wide drop-shadow-xl">
            MUHAMMAD SAQIB
          </h2>
        </motion.div>
      </div>

      {/* --- MIDDLE SECTION (COLOR WITH TORN EDGES) --- */}
      <div className="relative w-full h-[60vh] md:h-[70vh] bg-white z-20">
        {/* Outer White Torn Edges (Casting shadow on top/bottom sections) */}
        <RippedEdge className="absolute -top-5 left-0 w-full h-6 text-white z-30" shadow={true} />
        <RippedEdge className="absolute -bottom-5 left-0 w-full h-6 text-white z-30" inverted={true} shadow={true} />

        {/* Inner Image Container */}
        <div className="absolute inset-0 py-4 md:py-6 overflow-hidden">
          <img 
            src={middleImage} 
            alt="Muhammad Saqib creative torn paper color portrait" 
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
          />
          
          {/* Inner White Torn Edges (Cutting into the image to make the image look torn) */}
          <RippedEdge className="absolute top-4 md:top-6 left-0 w-full h-4 md:h-5 text-white" inverted={true} />
          <RippedEdge className="absolute bottom-4 md:bottom-6 left-0 w-full h-4 md:h-5 text-white" />
          
          {/* Subtle watermark */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/40 font-sans text-sm italic tracking-widest mix-blend-overlay rotate-90 origin-right">
            Saqib.project
          </div>
        </div>
      </div>

      {/* --- BOTTOM SECTION (B&W) --- */}
      <div className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        <img 
          src={bottomImage} 
          alt="Muhammad Saqib artistic portrait photography" 
          className="w-full h-full object-cover grayscale contrast-125 brightness-50 object-center"
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute bottom-1/4 left-0 w-full text-center z-10 flex flex-col items-center px-6"
        >
          {/* Quote Icon */}
          <div className="flex gap-1.5 mb-6">
            <div className="w-2.5 h-7 bg-white rounded-sm shadow-lg"></div>
            <div className="w-2.5 h-7 bg-white rounded-sm shadow-lg"></div>
          </div>
          
          <h3 className="text-white text-2xl md:text-3xl font-serif font-bold mb-4 drop-shadow-md">
            Jikoushokai
          </h3>
          
          <p className="text-white/90 text-base md:text-lg font-serif max-w-2xl text-center leading-relaxed drop-shadow-md">
            Senyumku akan terekam jelas dalam ingatanmu seperti foto dengan sejuta warna. Namaku Saqib.
          </p>
          
          <p className="text-white text-xl md:text-2xl font-serif mt-3 drop-shadow-md italic">
            Always smile
          </p>
          
          {/* Toggle Graphic */}
          <div className="w-12 h-5 bg-white/30 rounded-full mt-8 relative flex items-center p-1 backdrop-blur-sm">
            <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
          </div>
          
          <p className="text-white/80 text-sm mt-5 font-sans tracking-widest">
            23 October 2002
          </p>
          <p className="text-white/50 text-xs mt-1.5 font-sans tracking-[0.2em] uppercase">
            Edit by: saqib.project
          </p>
        </motion.div>
      </div>

    </section>
  );
}
