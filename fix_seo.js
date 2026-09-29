const fs = require('fs');
let code = fs.readFileSync('src/ClientApp.tsx', 'utf8');

code = code.replace(
  /onClick=\{\(e\) => \{ e\.preventDefault\(\); window\.location\.hash = "#all-projects"; \}\} onClick=\{\(\) => setIsMobileMenuOpen\(false\)\}/g,
  'onClick={(e) => { e.preventDefault(); window.location.hash = "#all-projects"; setIsMobileMenuOpen(false); }}'
);

code = code.replace(
  /onClick=\{\(e\) => \{ e\.preventDefault\(\); window\.location\.hash = "#skills-page"; \}\} onClick=\{\(\) => setIsMobileMenuOpen\(false\)\}/g,
  'onClick={(e) => { e.preventDefault(); window.location.hash = "#skills-page"; setIsMobileMenuOpen(false); }}'
);

code = code.replace(
  /onClick=\{\(e\) => \{ e\.preventDefault\(\); window\.location\.hash = "#website-plans"; \}\} onClick=\{\(\) => setIsMobileMenuOpen\(false\)\}/g,
  'onClick={(e) => { e.preventDefault(); window.location.hash = "#website-plans"; setIsMobileMenuOpen(false); }}'
);

code = code.replace(
  /onClick=\{\(e\) => \{ e\.preventDefault\(\); window\.location\.hash = "#contact-team"; \}\} onClick=\{\(\) => setIsMobileMenuOpen\(false\)\}/g,
  'onClick={(e) => { e.preventDefault(); window.location.hash = "#contact-team"; setIsMobileMenuOpen(false); }}'
);

fs.writeFileSync('src/ClientApp.tsx', code);
