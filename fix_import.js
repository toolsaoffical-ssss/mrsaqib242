const fs = require('fs');
let code = fs.readFileSync('src/components/AdminToolsManager.tsx', 'utf8');

// Remove the incorrect import
code = code.replace(/  MessageCircle, motion, AnimatePresence } from 'motion\/react';/, 'motion, AnimatePresence } from \'motion/react\';');

// Add to the correct lucide-react block
code = code.replace(/import \{\n  Wrench,/, 'import {\n  MessageCircle,\n  Wrench,');

fs.writeFileSync('src/components/AdminToolsManager.tsx', code);
