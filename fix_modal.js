const fs = require('fs');
let code = fs.readFileSync('src/components/AdminToolsManager.tsx', 'utf8');

code = code.replace(
  /className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black\/80 backdrop-blur-md overflow-y-auto"/g,
  'className="fixed inset-0 z-50 flex flex-col items-center justify-start p-4 bg-black/80 backdrop-blur-md overflow-y-auto"'
);

fs.writeFileSync('src/components/AdminToolsManager.tsx', code);
