const fs = require('fs');
const path = 'C:/Users/Suraj/OneDrive/Desktop/MyProjects/dailygraphfinalverson/src/components/EditorialViewer.tsx';

let code = fs.readFileSync(path, 'utf8');

// 1. Mobile-friendly Popovers
code = code.replace(
  '<PopoverContent className="w-80 p-4">',
  '<PopoverContent className="w-[90vw] sm:w-80 max-w-[calc(100vw-2rem)] p-4 max-h-[80vh] overflow-y-auto">'
);
code = code.replace(
  '<PopoverContent className="w-96 p-4">',
  '<PopoverContent className="w-[90vw] sm:w-96 max-w-[calc(100vw-2rem)] p-4 max-h-[80vh] overflow-y-auto">'
);

// 2. Mobile-friendly Header (Wrap header items)
code = code.replace(
  '<div className="flex justify-between items-center">',
  '<div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">'
);
// Make the logo/title smaller on mobile and wrap
code = code.replace(
  '<h1 className="text-2xl sm:text-4xl font-bold font-serif text-slate-900 dark:text-slate-100">',
  '<h1 className="text-2xl sm:text-4xl font-bold font-serif text-slate-900 dark:text-slate-100 text-center w-full">'
);
// Fix the zoom and date picker container on mobile
code = code.replace(
  '<div className="flex-1 flex justify-end items-center gap-2">',
  '<div className="flex-1 flex justify-center sm:justify-end items-center gap-2 w-full flex-wrap">'
);

// 3. Bold all texts
code = code.replace(
  '<p className="text-slate-800 dark:text-slate-200 leading-relaxed text-justify text-base">',
  '<p className="text-slate-800 dark:text-slate-200 leading-relaxed text-justify text-base font-medium">'
);
code = code.replace(
  '<span className="text-slate-700 dark:text-slate-300">{v.definition}</span>',
  '<span className="text-slate-700 dark:text-slate-300 font-medium">{v.definition}</span>'
);

// 4. Remove huge gap before footer
// Change min-h-screen to h-full in EditorialViewer to let Viewer.tsx handle the min-height
code = code.replace(
  /<div className="min-h-screen bg-slate-100 dark:bg-slate-900">/g,
  '<div className="h-full bg-slate-100 dark:bg-slate-900">'
);
// Also remove the bottom margin on Weekly Vocabulary if it exists
code = code.replace(
  '<div className="page bg-white dark:bg-slate-800 rounded-lg shadow-sm mb-6 overflow-hidden mt-8 border border-red-100 dark:border-red-900">',
  '<div className="page bg-white dark:bg-slate-800 rounded-lg shadow-sm mb-2 overflow-hidden mt-6 border border-red-100 dark:border-red-900">'
);
// Remove huge padding from main wrapper if any
code = code.replace(
  '<main \n          className="max-w-4xl mx-auto p-4 transition-transform origin-top"',
  '<main \n          className="max-w-4xl mx-auto p-2 sm:p-4 transition-transform origin-top"'
);
code = code.replace(
  '<div className="page bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-sm mb-6">',
  '<div className="page bg-white dark:bg-slate-800 p-3 sm:p-6 rounded-lg shadow-sm mb-2">'
);

fs.writeFileSync(path, code);
console.log('Mobile UI and Font changes applied successfully!');
