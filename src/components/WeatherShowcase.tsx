import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Copy } from 'lucide-react';

export default function WeatherShowcase() {
  const imageUrl = "https://ik.imagekit.io/shaban/SHABAN-1768575240340_5tz9dWXNo.jpg?tr=w-500,q-70";

  return (
    <section id="weather-showcase" className="relative w-full min-h-[100dvh] bg-zinc-950 flex items-center justify-center py-20 font-sans">
      
      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-[400px] min-h-[800px] bg-[#222222] shadow-2xl overflow-hidden flex flex-col"
      >
        
        {/* Top Section with Image and Chevrons */}
        <div className="relative w-full h-[550px]">
          {/* Bottom Yellow Band */}
          <div className="absolute inset-0 bg-[#FFB300]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 80px), 50% 100%, 0 calc(100% - 80px))' }}></div>
          
          {/* Dark Grey Band */}
          <div className="absolute top-0 left-0 right-0 bottom-[15px] bg-[#2a2a2a]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 80px), 50% 100%, 0 calc(100% - 80px))' }}></div>

          {/* Top Yellow Band */}
          <div className="absolute top-0 left-0 right-0 bottom-[65px] bg-[#FFB300]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 80px), 50% 100%, 0 calc(100% - 80px))' }}></div>

          {/* Image */}
          <div className="absolute top-0 left-0 right-0 bottom-[80px]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 80px), 50% 100%, 0 calc(100% - 80px))' }}>
            <img 
              src={imageUrl} 
              alt="Muhammad Saqib creative weather design showcase" 
              className="w-full h-full object-cover object-top" 
              referrerPolicy="no-referrer" 
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/20"></div>
          </div>

          {/* Text Overlay on Image */}
          <div className="absolute top-12 left-0 w-full flex flex-col items-center z-10 drop-shadow-xl select-none" aria-hidden="true">
            <div className="text-7xl font-black text-[#FFB300] tracking-wider mb-0" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>04:59</div>
            <div className="text-3xl font-black text-white tracking-[0.15em] uppercase mb-1" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>Sábado</div>
            <p className="text-xs font-bold text-white tracking-[0.3em]" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>0 8 &nbsp; j u n i o &nbsp; 2 0 1 9</p>
          </div>
        </div>

        {/* Bottom Section with Text */}
        <div className="flex-1 flex flex-col items-center justify-start pt-6 px-8 text-center">
          <h3 className="text-xl font-medium text-white mb-3 tracking-wide">Ciudad de México MX.</h3>
          <p className="text-[11px] text-zinc-300 leading-relaxed max-w-[260px] font-medium">
            El clima para hoy nubes rotas con 27°C con humedad de 30% y una velocidad de viento de 18kmh.
          </p>
          
          {/* Three Dots */}
          <div className="flex gap-2 mt-8">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFB300]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFB300]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFB300]"></div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 w-full h-20 flex justify-between items-center px-8 pb-4">
          <ArrowLeft className="text-[#FFB300] w-8 h-8" strokeWidth={3} />
          <span className="text-[#FFB300] font-serif text-xl tracking-widest">HOME</span>
          <Copy className="text-[#FFB300] w-7 h-7" strokeWidth={2.5} />
        </div>

      </motion.div>
    </section>
  );
}
