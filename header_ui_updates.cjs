const fs = require('fs');
const path = 'C:/Users/Suraj/OneDrive/Desktop/MyProjects/dailygraphfinalverson/src/components/EditorialViewer.tsx';

let code = fs.readFileSync(path, 'utf8');

// 1. Rebuild Header to stack title on top, controls on bottom
const headerOriginal = `<header className={\`bg-white dark:bg-slate-900 p-4 sm:p-5 border-b-2 border-slate-200 dark:border-slate-700 \${headerHidden ? 'hidden' : ''}\`}>
      <div className="flex items-center justify-between w-full flex-nowrap overflow-x-auto overflow-y-hidden no-scrollbar pb-1 gap-2 sm:gap-4">
        <div className="flex-1 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="h-8 w-8"
          >
            {isDarkMode ? "☀️" : "🌙"}
          </Button>
        </div>
        <div className="flex-1 text-center">
          <h1 className="text-xl sm:text-4xl font-bold font-serif text-slate-900 dark:text-slate-100 whitespace-nowrap">
            The Dailygraph
          </h1>
        </div>
        <div className="flex justify-end items-center gap-1 sm:gap-2 shrink-0">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onZoomChange(Math.max(50, zoom - 10))}
              className="h-7 w-7 sm:h-9 sm:w-9"
            >
              <ZoomOut className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <span className="text-xs sm:text-sm font-medium min-w-[2.5rem] text-center">
              {zoom}%
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onZoomChange(Math.min(200, zoom + 10))}
              className="h-7 w-7 sm:h-9 sm:w-9"
            >
              <ZoomIn className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
          
          {/* Date Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 sm:h-9 px-2 sm:px-3">
                <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">{format(currentDate, "MMM d")}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={currentDate}
                onSelect={(d) => d && onDateChange(d)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          {/* Telegram Link */}
          <a 
            href="https://t.me/thedailygraph" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:opacity-80 shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.62 12c-.88-.25-.89-1.02.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.58c-.28 1.13-1.04 1.4-1.74.88L14.25 16l-4.12 3.9c-.78.72-1.4.34-1.63-.55z" />
            </svg>
          </a>
        </div>
      </div>
    </header>`;

const headerNew = `<header className={\`bg-white dark:bg-slate-900 p-2 sm:p-4 border-b-2 border-slate-200 dark:border-slate-700 \${headerHidden ? 'hidden' : ''}\`}>
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
          >
            {isDarkMode ? "☀️" : "🌙"}
          </Button>

          {/* Zoom Controls */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onZoomChange(Math.max(50, zoom - 10))}
              className="h-6 w-6 sm:h-7 sm:w-7"
            >
              <ZoomOut className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <span className="text-xs sm:text-sm font-medium w-8 text-center">
              {zoom}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onZoomChange(Math.min(200, zoom + 10))}
              className="h-6 w-6 sm:h-7 sm:w-7"
            >
              <ZoomIn className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
          
          {/* Date Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 sm:h-9 px-2 sm:px-3 bg-slate-100 dark:bg-slate-800">
                <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm font-semibold">{format(currentDate, "MMM d")}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={currentDate}
                onSelect={(d) => d && onDateChange(d)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          {/* Telegram Link */}
          <a 
            href="https://t.me/thedailygraph" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-blue-600 hover:opacity-80 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg"
            title="Join our Telegram"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.62 12c-.88-.25-.89-1.02.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.58c-.28 1.13-1.04 1.4-1.74.88L14.25 16l-4.12 3.9c-.78.72-1.4.34-1.63-.55z" />
            </svg>
          </a>
        </div>
      </div>
    </header>`;
code = code.replace(headerOriginal, headerNew);


// 2. Reduce Dialog Max Height & padding
code = code.replace(
  '<DialogContent className="w-[90vw] sm:w-80 max-w-sm p-4 rounded-lg">',
  '<DialogContent className="w-[95vw] sm:w-80 max-w-sm p-3 rounded-lg max-h-[60vh] overflow-y-auto">'
);
code = code.replace(
  '<DialogContent className="w-[90vw] sm:w-96 max-w-md p-4 rounded-lg">',
  '<DialogContent className="w-[95vw] sm:w-96 max-w-md p-3 rounded-lg max-h-[60vh] overflow-y-auto">'
);

// 3. Remove side gaps (make it 100% width on mobile)
code = code.replace(
  '<main \n          className="max-w-4xl mx-auto px-1 py-2 sm:p-4 transition-transform origin-top w-full"',
  '<main \n          className="max-w-4xl mx-auto px-0 py-2 sm:p-4 transition-transform origin-top w-full"'
);
code = code.replace(
  '<div className="page bg-white dark:bg-slate-800 p-2 sm:p-6 rounded-lg shadow-sm mb-2 w-full overflow-hidden">',
  '<div className="page bg-white dark:bg-slate-800 p-1 sm:p-6 rounded-lg shadow-sm mb-2 w-full overflow-hidden">'
);
code = code.replace(
  '<div className="page bg-white dark:bg-slate-800 p-3 sm:p-6 rounded-lg shadow-sm mb-2">',
  '<div className="page bg-white dark:bg-slate-800 p-1 sm:p-6 rounded-lg shadow-sm mb-2 w-full">'
);

// 4. Reduce gap between footer and vocabulary section
// We'll replace mb-6 and mb-2 on vocabulary section to mb-0
// The vocabulary section is rendered via <div className="page ... mb-2">
code = code.replace(
  '<div className="page bg-white dark:bg-slate-800 p-2 sm:p-6 rounded-lg shadow-sm mb-2 w-full overflow-hidden">',
  '<div className="page bg-white dark:bg-slate-800 p-1 sm:p-6 rounded-none sm:rounded-lg mb-1 w-full overflow-hidden">'
);
code = code.replace(
  '<div className="page bg-white dark:bg-slate-800 p-1 sm:p-6 rounded-lg shadow-sm mb-2 w-full">',
  '<div className="page bg-white dark:bg-slate-800 p-1 sm:p-6 rounded-none sm:rounded-lg mb-0 w-full">'
);

fs.writeFileSync(path, code);
console.log('UI exact replacements done!');
