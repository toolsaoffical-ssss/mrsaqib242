const fs = require('fs');
let code = fs.readFileSync('src/components/AdminToolsManager.tsx', 'utf8');

// Remove all required attributes
code = code.replace(/<input\s+([^>]*?)required/g, '<input $1');
code = code.replace(/<select\s+([^>]*?)required/g, '<select $1');
code = code.replace(/<textarea\s+([^>]*?)required/g, '<textarea $1');

fs.writeFileSync('src/components/AdminToolsManager.tsx', code);
