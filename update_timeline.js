const fs = require('fs');
let code = fs.readFileSync('src/lib/inquiriesService.ts', 'utf8');

code = code.replace(
  /custom_features\?: string;/g,
  `custom_features?: string;\n  custom_timeline_date?: string;`
);

fs.writeFileSync('src/lib/inquiriesService.ts', code);
