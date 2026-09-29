const fs = require('fs');
let code = fs.readFileSync('src/components/ToolsPage.tsx', 'utf8');

code = code.replace(/object-cover object-center relative z-10 select-none p-1\.5/g, 'object-cover object-center relative z-10 select-none');
code = code.replace(/object-cover p-1\.5/g, 'object-cover');
code = code.replace(/object-cover p-1/g, 'object-cover');

fs.writeFileSync('src/components/ToolsPage.tsx', code);
