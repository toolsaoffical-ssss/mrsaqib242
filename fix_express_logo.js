const fs = require('fs');
let code = fs.readFileSync('src/components/ContactTeamPage.tsx', 'utf8');

// Add SiExpress to react-icons/si import
code = code.replace(
  "import { SiWhatsapp, SiInstagram, SiTiktok, SiFacebook, SiSnapchat } from 'react-icons/si';",
  "import { SiWhatsapp, SiInstagram, SiTiktok, SiFacebook, SiSnapchat, SiExpress } from 'react-icons/si';"
);

// Replace the express img tag with SiExpress
const target = `<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" alt="Express.js" className="w-full h-full object-contain dark:invert" />`;
const replacement = `<SiExpress size={28} className="text-zinc-800" />`;

code = code.replace(target, replacement);

fs.writeFileSync('src/components/ContactTeamPage.tsx', code);
