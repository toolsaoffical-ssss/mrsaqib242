import React from 'react';
import { motion } from 'motion/react';
import { Instagram, Send } from 'lucide-react';

export default function CreativeTypographyShowcase() {
  const userImageUrl = "https://ik.imagekit.io/mrsaqib/mrsaqib242-img1_yPzIc8MWvY.png?tr=w-500,q-80";
  const leafImageUrl = "https://images.unsplash.com/photo-1536882240095-0379873feb4e?q=60&w=400&auto=format&fit=crop";

  return (
    <section id="creative-typography" className="relative w-full min-h-[100dvh] bg-zinc-950 flex items-center justify-center py-20 font-sans overflow-hidden">
      
      {/* Main Poster Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-[450px] aspect-[9/16] min-h-[800px] bg-gradient-to-b from-zinc-600 to-zinc-950 shadow-2xl overflow-hidden rounded-md"
      >
        
        {/* Top Header (Black Curved Shape) */}
        <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 w-[110%] h-40 bg-[#0a0a0a] rounded-b-[100px] flex items-end justify-center pb-6 z-20 shadow-2xl">
          <motion.h2 
            className="font-display text-4xl tracking-wider uppercase"
            animate={{ backgroundPosition: ["0% 50%", "200% 50%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{
              backgroundImage: "linear-gradient(to right, #4285f4, #9b72cb, #d96570, #f9ab00, #4285f4)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              color: "transparent"
            }}
          >
            Saqib Visuals
          </motion.h2>
        </div>

        {/* Subtext */}
        <div className="absolute top-[150px] left-0 w-full text-center z-20">
          <p className="text-white text-[10px] tracking-[0.4em] font-light">
            C R E A T I V E &nbsp; T Y P O G R A P H Y
          </p>
        </div>

        {/* Pill Masked Image Area */}
        <div className="absolute top-[220px] left-0 w-full h-[500px] z-10">
          <svg width="0" height="0">
            <defs>
              <clipPath id="pill-mask-2">
                <rect x="80" y="0" width="320" height="60" rx="30" />
                <rect x="40" y="75" width="320" height="60" rx="30" />
                <rect x="80" y="150" width="320" height="60" rx="30" />
                <rect x="60" y="225" width="320" height="60" rx="30" />
                <rect x="100" y="300" width="320" height="60" rx="30" />
                <rect x="70" y="375" width="320" height="60" rx="30" />
              </clipPath>
            </defs>
          </svg>

          {/* The masked images */}
          <div 
            className="w-full h-full relative"
            style={{ clipPath: 'url(#pill-mask-2)' }}
          >
            {/* User Image (Base) */}
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${userImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            {/* Leaf Image (Overlay) */}
            <div 
              className="absolute inset-0 opacity-50 mix-blend-multiply"
              style={{
                backgroundImage: `url(${leafImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </div>
          
          {/* Pill Outlines (Shifted) */}
          <div className="absolute inset-0 pointer-events-none" style={{ transform: 'translate(-20px, 10px)' }}>
            <svg width="100%" height="100%" viewBox="0 0 450 500">
              <rect x="80" y="0" width="320" height="60" rx="30" fill="none" stroke="white" strokeWidth="1.5" />
              <rect x="40" y="75" width="320" height="60" rx="30" fill="none" stroke="white" strokeWidth="1.5" />
              <rect x="80" y="150" width="320" height="60" rx="30" fill="none" stroke="white" strokeWidth="1.5" />
              <rect x="60" y="225" width="320" height="60" rx="30" fill="none" stroke="white" strokeWidth="1.5" />
              <rect x="100" y="300" width="320" height="60" rx="30" fill="none" stroke="white" strokeWidth="1.5" />
              <rect x="70" y="375" width="320" height="60" rx="30" fill="none" stroke="white" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* Icons Row */}
        <div className="absolute bottom-12 left-0 w-full px-16 flex justify-between items-center z-20 text-white">
          <Instagram size={28} strokeWidth={2} />
          <Send size={28} strokeWidth={2} className="-rotate-45" />
        </div>

      </motion.div>
    </section>
  );
}
