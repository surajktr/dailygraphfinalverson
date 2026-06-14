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

// 2. Convert WordPopover to Dialog
const wordPopoverPattern = /<Popover open=\{open\} onOpenChange=\{setOpen\}>([\s\S]*?)<\/Popover>/;
// We can just text replace in the WordPopover component
code = code.replace(
  /<Popover open=\{open\} onOpenChange=\{setOpen\}>\s*<PopoverTrigger/g,
  '<Dialog open={open} onOpenChange={setOpen}>\n      <DialogTrigger'
);
code = code.replace(
  /<\/PopoverTrigger>\s*<PopoverContent className="w-\[90vw\] sm:w-80 max-w-\[calc\(100vw-2rem\)\] p-4 max-h-\[80vh\] overflow-y-auto">/g,
  '</DialogTrigger>\n      <DialogContent className="w-[90vw] sm:w-80 max-w-sm p-4 rounded-lg">'
);
code = code.replace(
  /<\/PopoverTrigger>\s*<PopoverContent className="w-\[90vw\] sm:w-96 max-w-\[calc\(100vw-2rem\)\] p-4 max-h-\[80vh\] overflow-y-auto">/g,
  '</DialogTrigger>\n      <DialogContent className="w-[90vw] sm:w-96 max-w-md p-4 rounded-lg">'
);
code = code.replace(/<\/PopoverContent>\s*<\/Popover>/g, '</DialogContent>\n    </Dialog>');

// 3. Update Header for single line
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

// 4. Reduce gaps on mobile
code = code.replace(
  '<main \n          className="max-w-4xl mx-auto p-2 sm:p-4 transition-transform origin-top"',
  '<main \n          className="max-w-4xl mx-auto px-1 py-2 sm:p-4 transition-transform origin-top w-full"'
);
code = code.replace(
  '<div className="page bg-white dark:bg-slate-800 p-3 sm:p-6 rounded-lg shadow-sm mb-2">',
  '<div className="page bg-white dark:bg-slate-800 p-2 sm:p-6 rounded-lg shadow-sm mb-2 w-full">'
);

fs.writeFileSync(path, code);
console.log('Mobile UI center dialog and single line header applied!');
