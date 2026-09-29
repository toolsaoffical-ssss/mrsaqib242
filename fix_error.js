const fs = require('fs');
let code = fs.readFileSync('src/components/AdminToolsManager.tsx', 'utf8');

// Fix handleSaveTool
code = code.replace(
  /showToast\(`Saved locally \(\$\{res\.error\}\)`, 'error'\);\s*setIsAddToolModalOpen\(false\);\s*setIsEditToolModalOpen\(false\);\s*setEditingTool\(null\);\s*onRefresh\(\);/g,
  'showToast(`Error saving to DB: ${res.error}`, "error");\n        // DO NOT close modal on error so user can fix it'
);

// Fix handleSaveCategory
code = code.replace(
  /showToast\(`Saved locally \(\$\{res\.error\}\)`, 'error'\);\s*setIsAddCategoryModalOpen\(false\);\s*setIsEditCategoryModalOpen\(false\);\s*setEditingCategory\(null\);/g,
  'showToast(`Error saving category: ${res.error}`, "error");\n        // DO NOT close modal on error so user can fix it'
);

fs.writeFileSync('src/components/AdminToolsManager.tsx', code);
