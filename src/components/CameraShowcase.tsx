import React from 'react';
import { motion } from 'motion/react';
import { ZapOff, RefreshCcw, Wand2, Menu, Focus } from 'lucide-react';

export default function CameraShowcase() {
  const imageUrl = "https://ik.imagekit.io/19imy4f1u/lite_1775825977045_QHpyNn2qc.png";

  // Calculate the frame boundaries to ensure perfect alignment
  // Top: 12vh, Bottom: 18vh
  // Left/Right: max(8vw, calc(50vw - 200px)) -> max width 400px
  const frameStyle = {
    top: '12vh',
    bottom: '18vh',
    left: 'max(8vw, calc(50vw - 200px))',
    right: 'max(8vw, calc(50vw - 200px))',
  };

  return (
    <section id="friend-showcase" className="relative w-full h-[100dvh] min-h-[700px] bg-zinc-900 overflow-hidden font-sans">
      {/* 1. Grayscale Background (Full Screen) */}
      <img 
        src={`${imageUrl}?tr=w-400,q-30,bl-2`} 
        alt="" 
        role="presentation"
        className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 blur-[2px]"
        referrerPolicy="no-referrer"
        loading="lazy"
        decoding="async"
      />

      {/* 2. Full Color Foreground (Clipped to Frame) */}
      <motion.img 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        src={`${imageUrl}?tr=w-800,q-80`} 
        alt="Visual focus portrait - Muhammad Saqib photography" 
        className="absolute inset-0 w-full h-full object-cover z-10"
        style={{
          clipPath: 'inset(12vh max(8vw, calc(50vw - 200px)) 18vh max(8vw, calc(50vw - 200px)) round 24px)'
        }}
        referrerPolicy="no-referrer"
        loading="lazy"
        decoding="async"
      />

      {/* 3. Camera UI Frame (Matches Clip Path exactly) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute border-[2px] border-white/90 flex flex-col justify-between p-4 md:p-6 shadow-2xl z-20 pointer-events-none"
        style={{
          ...frameStyle,
          borderRadius: '24px'
        }}
      >
        {/* Top Bar */}
        <div className="flex justify-between items-center text-white text-xs md:text-sm font-medium drop-shadow-md">
          <ZapOff className="w-4 h-4 md:w-5 md:h-5 drop-shadow-lg" />
          <span className="tracking-widest font-semibold drop-shadow-lg">HDR</span>
          <span className="tracking-widest font-bold drop-shadow-lg">AI</span>
          <Wand2 className="w-4 h-4 md:w-5 md:h-5 drop-shadow-lg" />
          <Focus className="w-4 h-4 md:w-5 md:h-5 drop-shadow-lg" />
          <Menu className="w-4 h-4 md:w-5 md:h-5 drop-shadow-lg" />
        </div>

        {/* Center Focus Ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 border border-white/50 flex items-center justify-center pointer-events-none">
          {/* Focus corners */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/80"></div>
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/80"></div>
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/80"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/80"></div>
          {/* Sun icon for exposure */}
          <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-4 h-4 border border-yellow-400 rounded-full flex items-center justify-center">
            <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="flex flex-col items-center gap-4 md:gap-6 text-white w-full pointer-events-auto">
          {/* Zoom */}
          <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold tracking-wider drop-shadow-md border border-white/20">
            1X
          </div>

          {/* Modes */}
          <div className="flex gap-3 md:gap-5 text-[11px] md:text-[13px] font-medium tracking-wide drop-shadow-md">
            <span className="opacity-70">Pro</span>
            <span className="opacity-70">Video</span>
            <span className="text-yellow-400 font-bold">Foto</span>
            <span className="opacity-70">Potret</span>
            <span className="opacity-70">Malam</span>
          </div>

          {/* Shutter Row */}
          <div className="flex justify-between items-center w-full px-2 md:px-4">
            {/* Gallery Preview */}
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white/80 overflow-hidden shadow-lg">
              <img src={`${imageUrl}?tr=w-100,q-50`} className="w-full h-full object-cover" alt="Gallery thumbnail" referrerPolicy="no-referrer" />
            </div>
            
            {/* Shutter Button */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-[3px] border-white flex items-center justify-center shadow-lg">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full"></div>
            </div>

            {/* Flip Camera */}
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center drop-shadow-lg bg-black/20 backdrop-blur-sm">
              <RefreshCcw className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* 4. Text Outside the Frame (Bottom Area) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="absolute bottom-6 left-0 w-full flex justify-between items-end text-white z-30"
        style={{
          paddingLeft: 'max(8vw, calc(50vw - 200px))',
          paddingRight: 'max(8vw, calc(50vw - 200px))'
        }}
      >
        {/* Bottom Left */}
        <div className="font-display text-lg md:text-2xl leading-none tracking-wider uppercase">
          SAQIB<br/>VISUALS
        </div>

        {/* Bottom Center */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-1 text-[8px] md:text-[10px] tracking-[0.2em] font-bold uppercase whitespace-nowrap opacity-80">
          END OF SAQIB STORY
        </div>

        {/* Bottom Right */}
        <div className="flex items-center gap-2 font-display text-lg md:text-2xl leading-none tracking-wider uppercase text-right">
          <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-white flex items-center justify-center">
            <div className="w-2 h-2 md:w-3 md:h-3 bg-white"></div>
          </div>
          <div>CREATIVE<br/>DESIGN</div>
        </div>
      </motion.div>
    </section>
  );
}
