const fs = require('fs');
let codeApi = fs.readFileSync('src/pages/api/analytics/list.ts', 'utf8');
codeApi = codeApi.replace(/\.limit\(300\);/g, '.limit(10000);');
fs.writeFileSync('src/pages/api/analytics/list.ts', codeApi);

let codeSvc = fs.readFileSync('src/lib/analyticsService.ts', 'utf8');
codeSvc = codeSvc.replace(/\.limit\(300\);/g, '.limit(10000);');
fs.writeFileSync('src/lib/analyticsService.ts', codeSvc);
