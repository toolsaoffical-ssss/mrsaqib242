const fs = require('fs');
let code = fs.readFileSync('src/components/AdminToolsManager.tsx', 'utf8');

code = code.replace(
  /<input\s+type="url"\s+value=\{toolFormData\.logo_url/g,
  '<input\n                          type="text"\n                          value={toolFormData.logo_url'
);

fs.writeFileSync('src/components/AdminToolsManager.tsx', code);
