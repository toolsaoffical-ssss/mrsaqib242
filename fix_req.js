const fs = require('fs');
let code = fs.readFileSync('src/components/AdminToolsManager.tsx', 'utf8');

code = code.replace(
  /<label className="block text-\[10px\] font-bold uppercase tracking-wider text-zinc-400 mb-1\.5">\s*Target URL or Action \*\s*<\/label>\s*<input\s+type="text"\s+required/g,
  '<label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">\n                      Target URL or Action\n                    </label>\n                    <input\n                      type="text"'
);

fs.writeFileSync('src/components/AdminToolsManager.tsx', code);
