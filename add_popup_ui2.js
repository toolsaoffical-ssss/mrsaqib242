const fs = require('fs');
let code = fs.readFileSync('src/components/ToolsPage.tsx', 'utf8');

const popupJsx = `
      {/* WHATSAPP POPUP MODAL */}
      <AnimatePresence>
        {showWhatsappPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-gradient-to-b from-[#181a24] to-[#121319] border border-[#25D366]/30 rounded-[32px] p-6 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#25D366]/20 blur-[50px] rounded-full pointer-events-none" />
              
              <button
                onClick={dismissWhatsappPopup}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors z-10"
              >
                <X size={16} />
              </button>

              <div className="flex flex-col items-center text-center relative z-10 mt-2">
                <div className="w-16 h-16 rounded-2xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center mb-5 border border-[#25D366]/20 shadow-[0_0_30px_rgba(37,211,102,0.2)]">
                  <SiWhatsapp size={32} />
                </div>
                
                <h3 className="text-lg font-black text-white mb-2 leading-tight">
                  {settings.whatsapp_popup_title || 'Join Our WhatsApp Community!'}
                </h3>
                
                <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                  {settings.whatsapp_popup_description || 'Get early access to leaked source codes, premium modded APKs, AI tools, and secret hacks directly on your phone.'}
                </p>

                <a
                  href={settings.whatsapp_channel_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={dismissWhatsappPopup}
                  className="w-full py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 transition-all hover:scale-[1.02]"
                >
                  <SiWhatsapp size={18} />
                  <span>Join Channel Now</span>
                </a>
                
                <button
                  onClick={dismissWhatsappPopup}
                  className="mt-4 text-[11px] font-bold text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-widest"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}`;

code = code.replace(/    <\/motion\.div>\s*\n\s*\);\s*\n\}/, popupJsx);

fs.writeFileSync('src/components/ToolsPage.tsx', code);
