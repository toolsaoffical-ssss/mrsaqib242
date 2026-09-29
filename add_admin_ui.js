const fs = require('fs');
let code = fs.readFileSync('src/components/AdminToolsManager.tsx', 'utf8');

if (!code.includes('MessageCircle')) {
  code = code.replace(/import \{/, 'import {\n  MessageCircle,');
}

const newBlock = `

            {/* Section 3.5: WhatsApp Popup Marketing */}
            <div className="bg-[#121319] border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <span className="text-emerald-500"><MessageCircle size={16} /></span>
                  <span>WhatsApp Welcome Popup</span>
                </h4>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pageSettings.whatsapp_popup_enabled || false}
                    onChange={e => setPageSettings({ ...pageSettings, whatsapp_popup_enabled: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-bold text-zinc-300">Enable Popup</span>
                </label>
              </div>

              {pageSettings.whatsapp_popup_enabled && (
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Popup Title
                    </label>
                    <input
                      type="text"
                      value={pageSettings.whatsapp_popup_title || ''}
                      onChange={e => setPageSettings({ ...pageSettings, whatsapp_popup_title: e.target.value })}
                      className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      Popup Description / Message
                    </label>
                    <textarea
                      rows={2}
                      value={pageSettings.whatsapp_popup_description || ''}
                      onChange={e => setPageSettings({ ...pageSettings, whatsapp_popup_description: e.target.value })}
                      className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                      WhatsApp Channel Link
                    </label>
                    <input
                      type="text"
                      value={pageSettings.whatsapp_channel_link || ''}
                      onChange={e => setPageSettings({ ...pageSettings, whatsapp_channel_link: e.target.value })}
                      placeholder="https://whatsapp.com/channel/..."
                      className="w-full bg-[#181a24] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Section 4: Live Stats Display Counters */}`;

code = code.replace('{/* Section 4: Live Stats Display Counters */}', newBlock);

fs.writeFileSync('src/components/AdminToolsManager.tsx', code);
