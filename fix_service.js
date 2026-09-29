const fs = require('fs');
let code = fs.readFileSync('src/lib/toolsService.ts', 'utf8');

code = code.replace(
  /announcement_text: string;\n\s+show_announcement: boolean;/g,
  'announcement_text: string;\n  show_announcement: boolean;\n  announcement_color?: string;\n  announcement_speed?: string;\n  announcement_font?: string;'
);

code = code.replace(
  /announcement_text: '[^']*',\n\s+show_announcement: true,/g,
  'announcement_text: \'🔥 Live Update: New AI predictors, free source repos & web utilities updated today!\',\n  show_announcement: true,\n  announcement_color: \'text-orange-200\',\n  announcement_speed: \'normal\',\n  announcement_font: \'font-medium\','
);

fs.writeFileSync('src/lib/toolsService.ts', code);
