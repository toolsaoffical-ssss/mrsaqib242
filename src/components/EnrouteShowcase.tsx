import React from 'react';
import { motion } from 'motion/react';
import { Instagram, Globe, MessageCircle } from 'lucide-react';

const Hexagon = ({ cx, cy, r, ...props }: { cx: number; cy: number; r: number; [key: string]: any }) => {
  const w = r * 0.866025; // r * sqrt(3)/2
  const points = `
    ${cx},${cy - r}
    ${cx + w},${cy - r / 2}
    ${cx + w},${cy + r / 2}
    ${cx},${cy + r}
    ${cx - w},${cy + r / 2}
    ${cx - w},${cy - r / 2}
  `;
  return <polygon points={points.trim()} {...props} />;
};

export default function EnrouteShowcase() {
  const imageUrl = "https://ik.imagekit.io/mrsaqib/mrsaqib242-img2_qZL3jHY-8w.png";

  // Hexagon grid configuration
  const R = 90;
  const gap = 4;
  const r = R - gap;
  
  // Centers for the jagged honeycomb pattern
  const centers = [
    // Col 1 (Protruding left)
    { cx: 78, cy: 405 },
    // Col 2
    { cx: 156, cy: 270 }, { cx: 156, cy: 540 },
    // Col 3
    { cx: 234, cy: 135 }, { cx: 234, cy: 405 }, { cx: 234, cy: 675 },
    // Col 4
    { cx: 312, cy: 0 }, { cx: 312, cy: 270 }, { cx: 312, cy: 540 }, { cx: 312, cy: 810 },
    // Col 5
    { cx: 390, cy: 135 }, { cx: 390, cy: 405 }, { cx: 390, cy: 675 },
  ];

  return (
    <section id="enroute-showcase" className="relative w-full min-h-[100dvh] bg-zinc-100 flex items-center justify-center py-20 font-sans">
      
      {/* Main Poster Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-[450px] aspect-[9/16] min-h-[800px] bg-white shadow-2xl overflow-hidden"
      >
        
        {/* Vertical Lines (Left) */}
        <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-zinc-300 z-10"></div>
        <div className="absolute left-10 top-12 bottom-24 w-[1px] bg-zinc-300 z-10"></div>

        {/* Vertical Lines (Right) */}
        <div className="absolute right-6 bottom-0 h-64 w-[2px] bg-zinc-300 z-10"></div>
        <div className="absolute right-10 bottom-0 h-48 w-[1px] bg-zinc-300 z-10"></div>

        {/* Date */}
        <div className="absolute top-12 left-16 text-sm font-bold text-zinc-700 tracking-wide z-20">
          jan, 13<sup className="text-[10px]">th</sup> 2023
        </div>

        {/* ENROUTE Vertical Text */}
        <div className="absolute left-16 bottom-32 origin-bottom-left -rotate-90 text-6xl font-black text-zinc-300 tracking-widest blur-[4px] opacity-60 z-10 select-none">
          ENROUTE
        </div>
        <div className="absolute left-12 bottom-32 origin-bottom-left -rotate-90 text-6xl font-black text-zinc-800 tracking-widest z-20 select-none">
          ENROUTE
        </div>

        {/* Social Icons */}
        <div className="absolute left-16 top-[45%] flex gap-6 text-zinc-800 z-20">
          <Instagram size={20} strokeWidth={2.5} />
          <Globe size={20} strokeWidth={2.5} />
          <MessageCircle size={20} strokeWidth={2.5} />
        </div>

        {/* Quote */}
        <div className="absolute left-16 bottom-48 w-64 text-[11px] leading-relaxed font-medium text-zinc-600 z-20">
          life is a journey without end,<br/>
          whatever will be at the end of your journey<br/>
          is a result what you have done in your life.
        </div>

        {/* Signature */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-zinc-500 flex items-center gap-2 z-20 whitespace-nowrap">
          instastory by <span className="font-cursive text-3xl text-zinc-800 -mt-2">Saqib</span>
        </div>

        {/* Hexagon Grid Image (Right Side) */}
        <div className="absolute top-0 right-[-50px] w-[400px] h-full z-10 pointer-events-none">
          <svg viewBox="0 0 400 800" className="w-full h-full drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)]">
            <defs>
              <clipPath id="hex-grid">
                {centers.map((c, i) => (
                  <Hexagon key={i} cx={c.cx} cy={c.cy} r={r} />
                ))}
              </clipPath>
            </defs>
            
            {/* Background color in case image is transparent */}
            <rect width="100%" height="100%" fill="#d4d4d8" clipPath="url(#hex-grid)" />
            
            {/* The Image */}
            <image 
              href={`${imageUrl}?tr=w-600,q-80`} 
              x="-100" 
              y="0" 
              width="600" 
              height="800" 
              preserveAspectRatio="xMidYMid slice" 
              clipPath="url(#hex-grid)" 
            />
          </svg>
        </div>

      </motion.div>
    </section>
  );
}
