const fs = require('fs');
let code = fs.readFileSync('src/lib/inquiriesService.ts', 'utf8');

code = code.replace(
  /admin_notes\?: string;/g,
  `admin_notes?: string;\n  custom_budget_amount?: string;\n  custom_features?: string;\n  reference_links?: string;`
);

fs.writeFileSync('src/lib/inquiriesService.ts', code);
