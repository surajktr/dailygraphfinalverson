const fs = require('fs');
const filePath = 'C:/Users/Suraj/OneDrive/Desktop/MyProjects/dailygraphfinalverson/src/components/EditorialViewer.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// Update WordPopover
code = code.replace(
  'className="text-red-600 dark:text-red-400 font-semibold cursor-pointer hover:underline"',
  'className="text-red-600 dark:text-red-400 font-semibold cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors px-1 rounded"'
);

// Update SentencePopover
code = code.replace(
  /<button[\s\S]*?className="inline-flex items-center justify-center mr-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 align-middle"[\s\S]*?>\s*<BookOpen className="h-4 w-4" \/>\s*<\/button>/m,
  '<button className="inline-flex items-center justify-center mr-1 text-lg align-middle hover:scale-110 transition-transform" onClick={() => setOpen(true)} title="See Hindi explanation">📖</button>'
);

// Update Section Backgrounds
code = code.replace(/bg-blue-600 text-white px-4 py-3/g, 'bg-gradient-to-r from-blue-700 to-blue-500 text-white px-4 py-3');

// Update Headers
code = code.replace(/<h2 className="font-bold text-lg uppercase tracking-wide">/g, '<h2 className="font-serif font-bold text-lg uppercase tracking-wide">');
code = code.replace(/<h3 className="text-center font-bold text-xl text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wide">/g, '<h3 className="text-center font-serif font-bold text-xl text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wide">');

fs.writeFileSync(filePath, code);
console.log('UI updated successfully!');
