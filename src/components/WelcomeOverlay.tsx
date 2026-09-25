import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function WelcomeOverlay() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const shown = sessionStorage.getItem('has_shown_welcome_overlay');
      if (shown) {
        setShow(false);
      } else {
        setShow(true);
        sessionStorage.setItem('has_shown_welcome_overlay', 'true');
        const timer = setTimeout(() => {
          setShow(false);
        }, 3000); // 3000ms to allow all letter delays and branding animations to complete beautifully
        return () => clearTimeout(timer);
      }
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-[#EAE8E3] flex items-center justify-center overflow-hidden pointer-events-none"
        >
          <div className="flex items-center gap-6 md:gap-12 scale-90 sm:scale-100">
            {/* Left text: SAQIB VISUAL */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="flex items-center gap-4 md:gap-6"
            >
              <h1 className="text-zinc-900 tracking-[0.4em] font-serif uppercase" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                <span className="text-sm md:text-xl font-medium tracking-[0.5em]">Saqib</span>
                <span className="text-sm md:text-xl font-medium tracking-[0.5em] mt-4">Visual</span>
              </h1>
              <div className="w-[1px] h-32 md:h-48 bg-zinc-400"></div>
            </motion.div>

            {/* Right graphic: SV */}
            <motion.div 
              className="relative w-36 h-40 md:w-48 md:h-64 flex items-center justify-center font-serif text-zinc-900"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                className="absolute top-0 md:-top-4 left-0 md:left-2 text-[100px] md:text-[150px] leading-none"
              >
                S
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
                className="absolute -bottom-2 md:-bottom-4 right-4 md:right-4 text-[100px] md:text-[190px] leading-none translate-y-[9%]"
              >
                V
              </motion.div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 text-zinc-500 text-[10px] tracking-[0.3em] font-bold uppercase"
          >
            <div className="w-4 h-[1px] bg-zinc-400" />
            Loading Experience
            <div className="w-4 h-[1px] bg-zinc-400" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
