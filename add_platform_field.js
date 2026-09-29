const fs = require('fs');
let code = fs.readFileSync('src/lib/toolsService.ts', 'utf8');

code = code.replace(
  /whatsapp_popup_enabled: boolean;/g,
  `whatsapp_popup_enabled: boolean;\n  popup_platform?: string;`
);

code = code.replace(
  /whatsapp_popup_enabled: false,/g,
  `whatsapp_popup_enabled: false,\n  popup_platform: 'whatsapp',`
);

fs.writeFileSync('src/lib/toolsService.ts', code);
