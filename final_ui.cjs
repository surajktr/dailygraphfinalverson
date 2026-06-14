const fs = require('fs');
const path = 'C:/Users/Suraj/OneDrive/Desktop/MyProjects/dailygraphfinalverson/src/components/EditorialViewer.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Header Layout
const headerOldStart = `<header className={\`bg-white dark:bg-slate-900 p-4 sm:p-5 border-b-2 border-slate-200 dark:border-slate-700 \${headerHidden ? 'hidden' : ''}\`}>
      <div className="flex items-center justify-between w-full flex-nowrap overflow-x-auto overflow-y-hidden no-scrollbar pb-1 gap-2 sm:gap-4">
        <div className="flex-1 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="h-8 w-8"
          >`;

const headerNewStart = `<header className={\`bg-white dark:bg-slate-900 p-2 sm:p-4 border-b-2 border-slate-200 dark:border-slate-700 \${headerHidden ? 'hidden' : ''}\`}>
      <div className="flex flex-col items-center justify-center w-full gap-2 sm:gap-4">
        {/* Top Line: Title */}
        <h1 className="text-2xl sm:text-4xl font-bold font-serif text-slate-900 dark:text-slate-100">
          The Dailygraph
        </h1>
        {/* Bottom Line: Controls */}
        <div className="flex justify-center items-center gap-2 sm:gap-4 w-full flex-wrap">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="h-8 w-8 bg-slate-100 dark:bg-slate-800 rounded-lg"
            title="Toggle Dark Mode"
          >`;

code = code.replace(headerOldStart, headerNewStart);

// Header middle part
const headerOldMid = `</Button>
        </div>
        <div className="flex-1 text-center">
          <h1 className="text-xl sm:text-4xl font-bold font-serif text-slate-900 dark:text-slate-100 whitespace-nowrap">
            The Dailygraph
          </h1>
        </div>
        <div className="flex justify-end items-center gap-1 sm:gap-2 shrink-0">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1">`;

const headerNewMid = `</Button>
          {/* Zoom Controls */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">`;

code = code.replace(headerOldMid, headerNewMid);

// Header controls styling
code = code.replace(
  'className="h-7 w-7 sm:h-9 sm:w-9"',
  'className="h-6 w-6 sm:h-7 sm:w-7"'
);
code = code.replace(
  'className="h-7 w-7 sm:h-9 sm:w-9"',
  'className="h-6 w-6 sm:h-7 sm:w-7"'
);
code = code.replace(
  'className="text-xs sm:text-sm font-medium min-w-[2.5rem] text-center"',
  'className="text-xs sm:text-sm font-medium w-8 text-center"'
);
code = code.replace(
  'className="h-7 sm:h-9 px-2 sm:px-3"',
  'className="h-8 sm:h-9 px-2 sm:px-3 bg-slate-100 dark:bg-slate-800 border-none"'
);

// Header telegram link styling
code = code.replace(
  'className="flex items-center gap-2 text-blue-600 hover:opacity-80 shrink-0"',
  'className="flex items-center text-blue-600 hover:opacity-80 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg"'
);


// 2. Dialog Max Height
code = code.replaceAll(
  'className="w-[90vw] sm:w-80 max-w-[calc(100vw-2rem)] p-4 max-h-[80vh] overflow-y-auto"',
  'className="w-[95vw] sm:w-80 max-w-sm p-3 rounded-lg max-h-[60vh] overflow-y-auto"'
);
code = code.replaceAll(
  'className="w-[90vw] sm:w-96 max-w-[calc(100vw-2rem)] p-4 max-h-[80vh] overflow-y-auto"',
  'className="w-[95vw] sm:w-96 max-w-md p-3 rounded-lg max-h-[60vh] overflow-y-auto"'
);


// 3. Side Gaps and Bottom Gaps
code = code.replace(
  'className="max-w-4xl mx-auto p-4 transition-transform origin-top"',
  'className="max-w-4xl mx-auto px-0 py-2 sm:p-4 transition-transform origin-top w-full"'
);

// We replace the outer containers for Article and Vocabulary.
// For ArticleSection:
code = code.replace(
  '<div className="page bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-sm mb-6">',
  '<div className="page bg-white dark:bg-slate-800 p-2 sm:p-6 rounded-none sm:rounded-lg mb-2 w-full overflow-hidden">'
);

// For WeeklyVocabulary:
code = code.replace(
  'className="page bg-white dark:bg-slate-800 rounded-lg shadow-sm mb-2 overflow-hidden mt-6 border border-red-100 dark:border-red-900"',
  'className="page bg-white dark:bg-slate-800 rounded-none sm:rounded-lg shadow-sm mb-0 overflow-hidden mt-6 border border-red-100 dark:border-red-900 w-full"'
);


fs.writeFileSync(path, code);
console.log('Final UI exact replacements done!');
