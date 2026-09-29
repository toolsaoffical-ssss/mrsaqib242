const fs = require('fs');
let code = fs.readFileSync('src/components/AdminToolsManager.tsx', 'utf8');

code = code.replace(/{pageSettings\.show_announcement && \(\s*<div>/, '{pageSettings.show_announcement && (<><div>');

code = code.replace(/                  <\/div>\s*\}\)\}\s*<\/div>\s*<\/div>/, '                  </div></>)}</div></div>');

fs.writeFileSync('src/components/AdminToolsManager.tsx', code);
