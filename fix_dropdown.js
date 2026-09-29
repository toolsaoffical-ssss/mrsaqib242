const fs = require('fs');
let code = fs.readFileSync('src/components/AdminToolsManager.tsx', 'utf8');

const target = '<div className="space-y-4 pt-2">';
const replacement = `<div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                        Popup Platform
                      </label>
                      <select
                        value={pageSettings.popup_platform || 'whatsapp'}
                        onChange={e => setPageSettings({ ...pageSettings, popup_platform: e.target.value })}
                        className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="whatsapp">WhatsApp</option>
                        <option value="tiktok">TikTok</option>
                        <option value="youtube">YouTube</option>
                        <option value="telegram">Telegram</option>
                        <option value="instagram">Instagram</option>
                      </select>
                    </div>`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/AdminToolsManager.tsx', code);
