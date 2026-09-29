const fs = require('fs');
let code = fs.readFileSync('src/components/AdminToolsManager.tsx', 'utf8');

const targetLabel = '                    <div>\n                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">\n                        Popup Title\n                      </label>';

const platformDropdown = `                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                        Popup Platform Type
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
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                        Popup Title
                      </label>`;

code = code.replace(targetLabel, platformDropdown);
fs.writeFileSync('src/components/AdminToolsManager.tsx', code);
