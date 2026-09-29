const fs = require('fs');
let code = fs.readFileSync('src/components/AdminToolsManager.tsx', 'utf8');

const regex = /<div className="space-y-4 pt-2">\s*<div>\s*<label className="block text-\[10px\] font-bold uppercase tracking-wider text-zinc-400 mb-1\.5">\s*Popup Title\s*<\/label>/;

const replacement = `<div className="space-y-4 pt-2">
                    <div>
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

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('src/components/AdminToolsManager.tsx', code);
    console.log("Successfully replaced!");
} else {
    console.log("Regex did not match!");
}
