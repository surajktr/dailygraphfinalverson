const fs = require('fs');
const path = 'C:/Users/Suraj/OneDrive/Desktop/MyProjects/dailygraphfinalverson/src/components/EditorialViewer.tsx';

let code = fs.readFileSync(path, 'utf8');

// 1. Add Dialog imports
if (!code.includes('import { Dialog, DialogContent, DialogTrigger }')) {
  code = code.replace(
    'import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";',
    'import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";\nimport { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";'
  );
}

// 2. Exact Replacement for WordPopover to Dialog
const wordPopoverOriginal = `<Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <span 
          className="cursor-pointer font-bold text-blue-700 dark:text-blue-400 hover:text-blue-800 hover:underline decoration-blue-400 decoration-2 underline-offset-4 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200 inline-block px-1"
        >
          {children}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-[90vw] sm:w-80 max-w-[calc(100vw-2rem)] p-4 max-h-[80vh] overflow-y-auto">
        <button 
          onClick={() => setOpen(false)}
          className="absolute top-1 right-2 text-xl text-slate-400 hover:text-slate-600"
        >
          &times;
        </button>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">{word}</h3>
          <button 
            onClick={(e) => { e.stopPropagation(); speak(word); }}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
            title="Listen to pronunciation"
          >
            <Volume2 className="h-4 w-4" />
          </button>
        </div>
        <p className="text-blue-600 dark:text-blue-400 font-medium mt-1">{hindi}</p>
        <p className="text-slate-600 dark:text-slate-300 text-sm mt-2">{definition}</p>
      </PopoverContent>
    </Popover>`;

const wordPopoverNew = `<Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span 
          className="cursor-pointer font-bold text-blue-700 dark:text-blue-400 hover:text-blue-800 hover:underline decoration-blue-400 decoration-2 underline-offset-4 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200 inline-block px-1"
        >
          {children}
        </span>
      </DialogTrigger>
      <DialogContent className="w-[90vw] sm:w-80 max-w-sm p-4 rounded-lg">
        <button 
          onClick={() => setOpen(false)}
          className="absolute top-1 right-2 text-xl text-slate-400 hover:text-slate-600"
        >
          &times;
        </button>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">{word}</h3>
          <button 
            onClick={(e) => { e.stopPropagation(); speak(word); }}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
            title="Listen to pronunciation"
          >
            <Volume2 className="h-4 w-4" />
          </button>
        </div>
        <p className="text-blue-600 dark:text-blue-400 font-medium mt-1">{hindi}</p>
        <p className="text-slate-600 dark:text-slate-300 text-sm mt-2">{definition}</p>
      </DialogContent>
    </Dialog>`;

code = code.replace(wordPopoverOriginal, wordPopoverNew);

// 3. Exact Replacement for SentencePopover to Dialog
const sentencePopoverOriginal = `<Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button 
          className="inline-flex items-center justify-center mr-1 text-lg align-middle hover:scale-110 transition-transform"
          onClick={() => setOpen(true)}
          title="Read Hindi translation"
        >
          📖
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[90vw] sm:w-96 max-w-[calc(100vw-2rem)] p-4 max-h-[80vh] overflow-y-auto">
        <button 
          onClick={() => setOpen(false)}
          className="absolute top-1 right-2 text-xl text-slate-400 hover:text-slate-600"
        >
          &times;
        </button>
        <div className="mt-1">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 pb-2 border-b border-slate-200 dark:border-slate-700">
            {sentence}
          </p>
          <p className="text-base text-slate-900 dark:text-slate-100 font-medium">
            <span className="font-semibold text-amber-600">हिंदी अर्थ:</span> {explanation}
          </p>
        </div>
      </PopoverContent>
    </Popover>`;

const sentencePopoverNew = `<Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button 
          className="inline-flex items-center justify-center mr-1 text-lg align-middle hover:scale-110 transition-transform"
          onClick={() => setOpen(true)}
          title="Read Hindi translation"
        >
          📖
        </button>
      </DialogTrigger>
      <DialogContent className="w-[90vw] sm:w-96 max-w-md p-4 rounded-lg">
        <button 
          onClick={() => setOpen(false)}
          className="absolute top-1 right-2 text-xl text-slate-400 hover:text-slate-600"
        >
          &times;
        </button>
        <div className="mt-1">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 pb-2 border-b border-slate-200 dark:border-slate-700">
            {sentence}
          </p>
          <p className="text-base text-slate-900 dark:text-slate-100 font-medium">
            <span className="font-semibold text-amber-600">हिंदी अर्थ:</span> {explanation}
          </p>
        </div>
      </DialogContent>
    </Dialog>`;

code = code.replace(sentencePopoverOriginal, sentencePopoverNew);

// 4. Update Header for single line
code = code.replace(
  '<div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">',
  '<div className="flex items-center justify-between w-full flex-nowrap overflow-x-auto overflow-y-hidden no-scrollbar pb-1 gap-2 sm:gap-4">'
);
code = code.replace(
  '<h1 className="text-2xl sm:text-4xl font-bold font-serif text-slate-900 dark:text-slate-100 text-center w-full">',
  '<h1 className="text-xl sm:text-4xl font-bold font-serif text-slate-900 dark:text-slate-100 whitespace-nowrap">'
);
code = code.replace(
  '<div className="flex-1 flex justify-center sm:justify-end items-center gap-2 w-full flex-wrap">',
  '<div className="flex justify-end items-center gap-1 sm:gap-2 shrink-0">'
);
// Show Telegram icon on mobile
code = code.replace(
  'className="hidden sm:flex items-center gap-2 text-blue-600 hover:opacity-80"',
  'className="flex items-center gap-2 text-blue-600 hover:opacity-80 shrink-0"'
);

// 5. Reduce gaps on mobile
code = code.replace(
  '<main \n          className="max-w-4xl mx-auto p-2 sm:p-4 transition-transform origin-top"',
  '<main \n          className="max-w-4xl mx-auto px-1 py-2 sm:p-4 transition-transform origin-top w-full"'
);
code = code.replace(
  '<div className="page bg-white dark:bg-slate-800 p-3 sm:p-6 rounded-lg shadow-sm mb-2">',
  '<div className="page bg-white dark:bg-slate-800 p-2 sm:p-6 rounded-lg shadow-sm mb-2 w-full">'
);

// Specifically target ArticleSection padding
code = code.replace(
  '<div className="page bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-sm mb-6">',
  '<div className="page bg-white dark:bg-slate-800 p-2 sm:p-6 rounded-lg shadow-sm mb-2 w-full overflow-hidden">'
);

fs.writeFileSync(path, code);
console.log('Final safe ui apply successful!');
