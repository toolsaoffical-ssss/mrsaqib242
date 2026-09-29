const fs = require('fs');
let code = fs.readFileSync('src/components/ToolsPage.tsx', 'utf8');

// Replace import
code = code.replace(/import \{ SiWhatsapp \} from 'react-icons\/si';/, "import { SiWhatsapp, SiTiktok, SiYoutube, SiTelegram, SiInstagram } from 'react-icons/si';");

// Replace state logic (remove localStorage check)
const newStateLogic = `  useEffect(() => {
    if (settings.whatsapp_popup_enabled && settings.whatsapp_channel_link) {
      const timer = setTimeout(() => {
        setShowWhatsappPopup(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [settings]);

  const dismissWhatsappPopup = () => {
    setShowWhatsappPopup(false);
  };`;

// The old useEffect might have `localStorage.getItem('whatsapp_popup_dismissed_v2')`. We'll just replace the whole block by matching up to dismissWhatsappPopup
const oldStateRegex = /useEffect\(\(\) => \{\s*if \(settings\.whatsapp_popup_enabled[\s\S]*?dismissWhatsappPopup = \(\) => \{\s*setShowWhatsappPopup\(false\);\s*localStorage\.setItem\('whatsapp_popup_dismissed_v2', 'true'\);\s*\};/g;

code = code.replace(oldStateRegex, newStateLogic);


// Build Dynamic Platform Render logic
const dynamicRender = `
      {/* WHATSAPP / SOCIAL POPUP MODAL */}
      <AnimatePresence>
        {showWhatsappPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={\`w-full max-w-sm bg-gradient-to-b from-[#181a24] to-[#121319] border rounded-[32px] p-6 shadow-2xl relative overflow-hidden \${
                settings.popup_platform === 'tiktok' ? 'border-[#ff0050]/30' :
                settings.popup_platform === 'youtube' ? 'border-[#ff0000]/30' :
                settings.popup_platform === 'telegram' ? 'border-[#229ED9]/30' :
                settings.popup_platform === 'instagram' ? 'border-[#E1306C]/30' :
                'border-[#25D366]/30' // whatsapp default
              }\`}
            >
              <div className={\`absolute -top-20 -right-20 w-40 h-40 blur-[50px] rounded-full pointer-events-none \${
                settings.popup_platform === 'tiktok' ? 'bg-[#ff0050]/20' :
                settings.popup_platform === 'youtube' ? 'bg-[#ff0000]/20' :
                settings.popup_platform === 'telegram' ? 'bg-[#229ED9]/20' :
                settings.popup_platform === 'instagram' ? 'bg-[#E1306C]/20' :
                'bg-[#25D366]/20' // whatsapp default
              }\`} />
              
              <button
                onClick={dismissWhatsappPopup}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-colors z-10"
              >
                <X size={16} />
              </button>

              <div className="flex flex-col items-center text-center relative z-10 mt-2">
                <div className={\`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 border shadow-xl \${
                  settings.popup_platform === 'tiktok' ? 'bg-[#ff0050]/10 text-[#ff0050] border-[#ff0050]/20 shadow-[0_0_30px_rgba(255,0,80,0.2)]' :
                  settings.popup_platform === 'youtube' ? 'bg-[#ff0000]/10 text-[#ff0000] border-[#ff0000]/20 shadow-[0_0_30px_rgba(255,0,0,0.2)]' :
                  settings.popup_platform === 'telegram' ? 'bg-[#229ED9]/10 text-[#229ED9] border-[#229ED9]/20 shadow-[0_0_30px_rgba(34,158,217,0.2)]' :
                  settings.popup_platform === 'instagram' ? 'bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] bg-opacity-10 text-white border-white/20 shadow-[0_0_30px_rgba(225,48,108,0.2)]' :
                  'bg-[#25D366]/10 text-[#25D366] border-[#25D366]/20 shadow-[0_0_30px_rgba(37,211,102,0.2)]'
                }\`}>
                  {settings.popup_platform === 'tiktok' ? <SiTiktok size={32} /> :
                   settings.popup_platform === 'youtube' ? <SiYoutube size={32} /> :
                   settings.popup_platform === 'telegram' ? <SiTelegram size={32} /> :
                   settings.popup_platform === 'instagram' ? <SiInstagram size={32} /> :
                   <SiWhatsapp size={32} />}
                </div>
                
                <h3 className="text-lg font-black text-white mb-2 leading-tight">
                  {settings.whatsapp_popup_title || 'Join Our Community!'}
                </h3>
                
                <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                  {settings.whatsapp_popup_description || 'Get early access to premium content.'}
                </p>

                <a
                  href={settings.whatsapp_channel_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={dismissWhatsappPopup}
                  className={\`w-full py-3.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.02] \${
                    settings.popup_platform === 'tiktok' ? 'bg-[#ff0050] hover:bg-[#e00046] text-white shadow-[#ff0050]/20' :
                    settings.popup_platform === 'youtube' ? 'bg-[#ff0000] hover:bg-[#e00000] text-white shadow-[#ff0000]/20' :
                    settings.popup_platform === 'telegram' ? 'bg-[#229ED9] hover:bg-[#1e8cc0] text-white shadow-[#229ED9]/20' :
                    settings.popup_platform === 'instagram' ? 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white shadow-[#E1306C]/20' :
                    'bg-[#25D366] hover:bg-[#20bd5a] text-black shadow-[#25D366]/20'
                  }\`}
                >
                  {settings.popup_platform === 'tiktok' ? <SiTiktok size={18} /> :
                   settings.popup_platform === 'youtube' ? <SiYoutube size={18} /> :
                   settings.popup_platform === 'telegram' ? <SiTelegram size={18} /> :
                   settings.popup_platform === 'instagram' ? <SiInstagram size={18} /> :
                   <SiWhatsapp size={18} />}
                  <span>Join / Follow Now</span>
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
      </AnimatePresence>`;

// Replace old popup JSX
const oldPopupRegex = /\{\/\* WHATSAPP POPUP MODAL \*\/\}(.|\n)*?<\/AnimatePresence>/g;
code = code.replace(oldPopupRegex, dynamicRender.trim());

fs.writeFileSync('src/components/ToolsPage.tsx', code);
