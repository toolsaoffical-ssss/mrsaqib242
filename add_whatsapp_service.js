const fs = require('fs');
let code = fs.readFileSync('src/lib/toolsService.ts', 'utf8');

code = code.replace(
  /announcement_font\?: string;/g,
  `announcement_font?: string;
  whatsapp_popup_enabled: boolean;
  whatsapp_popup_title: string;
  whatsapp_popup_description: string;
  whatsapp_channel_link: string;`
);

code = code.replace(
  /announcement_font: 'font-medium',/g,
  `announcement_font: 'font-medium',
  whatsapp_popup_enabled: false,
  whatsapp_popup_title: 'Join Our WhatsApp Community! 🚀',
  whatsapp_popup_description: 'Get early access to leaked source codes, premium modded APKs, AI tools, and secret hacks directly on your phone.',
  whatsapp_channel_link: 'https://whatsapp.com/channel/your_channel_id',`
);

fs.writeFileSync('src/lib/toolsService.ts', code);
