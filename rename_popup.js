const fs = require('fs');
let code = fs.readFileSync('src/components/AdminToolsManager.tsx', 'utf8');
code = code.replace(/<span>WhatsApp Welcome Popup<\/span>/g, '<span>Social Welcome Popup</span>');
code = code.replace(/WhatsApp Channel Link/g, 'Social Profile / Channel Link');
fs.writeFileSync('src/components/AdminToolsManager.tsx', code);
