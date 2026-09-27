import React from 'react';

export default function JarvisLoader({ text = 'S.A.Q.I.B.' }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-[#020617] flex flex-col items-center justify-center z-[9999] overflow-hidden font-mono">
      {/* Background Grid & Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
      
      {/* HUD Container */}
      <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
        
        {/* Outer dashed spinning ring */}
        <div className="absolute inset-0 rounded-full border border-cyan-500/30 border-dashed animate-[spin_10s_linear_infinite]" style={{ borderWidth: '2px' }} />
        
        {/* Secondary reverse spinning ring */}
        <div className="absolute inset-2 rounded-full border border-cyan-400/40 animate-[spin_8s_linear_infinite_reverse]" style={{ borderStyle: 'dotted', borderWidth: '3px' }} />
        
        {/* Thick segmented ring */}
        <div className="absolute inset-6 rounded-full border-[6px] border-cyan-500/20 border-t-cyan-400/80 border-b-cyan-400/80 animate-[spin_4s_linear_infinite]" />
        
        {/* Inner solid glowing ring */}
        <div className="absolute inset-10 rounded-full border-2 border-cyan-300/50 shadow-[0_0_15px_rgba(34,211,238,0.4)_inset,0_0_15px_rgba(34,211,238,0.4)] animate-[pulse_2s_ease-in-out_infinite]" />
        
        {/* Center Core */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-cyan-300 font-black text-3xl md:text-5xl tracking-[0.2em] md:tracking-[0.3em] drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-[pulse_1.5s_ease-in-out_infinite]">
            {text}
          </div>
          <div className="mt-2 text-cyan-400/70 text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase">
            System Initialization
          </div>
        </div>

        {/* HUD Accents */}
        <div className="absolute top-1/2 -left-8 md:-left-16 w-6 md:w-12 h-[1px] bg-cyan-400/50" />
        <div className="absolute top-1/2 -right-8 md:-right-16 w-6 md:w-12 h-[1px] bg-cyan-400/50" />
        <div className="absolute -top-8 md:-top-16 left-1/2 w-[1px] h-6 md:h-12 bg-cyan-400/50" />
        <div className="absolute -bottom-8 md:-bottom-16 left-1/2 w-[1px] h-6 md:h-12 bg-cyan-400/50" />
      </div>
      
      {/* Bottom status text */}
      <div className="absolute bottom-12 flex flex-col items-center gap-2">
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping" />
          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping [animation-delay:0.2s]" />
          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping [animation-delay:0.4s]" />
        </div>
        <p className="text-cyan-500/60 text-[10px] uppercase tracking-[0.3em] font-bold">
          Verifying Identity & Device Integrity...
        </p>
      </div>
    </div>
  );
}
