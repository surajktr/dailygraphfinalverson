const fs = require('fs');
const path = 'C:/Users/Suraj/OneDrive/Desktop/MyProjects/dailygraphfinalverson/src/components/GraphViewer.tsx';
let code = fs.readFileSync(path, 'utf8');

// The original header block in GraphViewer looks like this:
// <div className="flex items-center justify-between gap-2 p-2 sm:p-3 bg-background border-b border-border">
//   <h1 className="text-base sm:text-xl font-bold text-primary">Dailygraph</h1>

// We want to replace it with the exact stacked layout used in EditorialViewer:
// <div className="flex flex-col items-center justify-center w-full gap-2 sm:gap-4 p-2 sm:p-4 bg-background border-b border-border">
//   <h1 className="text-2xl sm:text-4xl font-bold font-serif text-primary">The Dailygraph</h1>
//   <div className="flex justify-center items-center gap-2 sm:gap-4 w-full flex-wrap">
//      ... zoom and calendar ...
//   </div>
// </div>

const headerOld = `        <div className="flex items-center justify-between gap-2 p-2 sm:p-3 bg-background border-b border-border">
          <h1 className="text-base sm:text-xl font-bold text-primary">Dailygraph</h1>
          
          {/* Zoom controls and calendar */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onZoomChange(Math.max(50, zoom - 10))}
              className="h-7 w-7 sm:h-9 sm:w-9"
            >
              <ZoomOut className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <span className="text-xs sm:text-sm font-medium min-w-[2.5rem] sm:min-w-[3rem] text-center">
              {isMobile ? zoom + 5 : zoom}%
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onZoomChange(Math.min(200, zoom + 10))}
              className="h-7 w-7 sm:h-9 sm:w-9"
            >
              <ZoomIn className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1 sm:gap-2 h-7 sm:h-9 px-2 sm:px-3">
                  <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4" />
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
          </div>
        </div>`;

const headerNew = `        <div className="flex flex-col items-center justify-center w-full gap-2 sm:gap-4 p-2 sm:p-4 bg-background border-b border-border">
          {/* Top Line: Title */}
          <h1 className="text-2xl sm:text-4xl font-bold font-serif text-primary">
            The Dailygraph
          </h1>
          
          {/* Bottom Line: Controls */}
          <div className="flex justify-center items-center gap-2 sm:gap-4 w-full flex-wrap">
            {/* Zoom Controls */}
            <div className="flex items-center bg-muted/30 rounded-lg p-1 border border-border">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onZoomChange(Math.max(50, zoom - 10))}
                className="h-6 w-6 sm:h-7 sm:w-7"
              >
                <ZoomOut className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <span className="text-xs sm:text-sm font-medium w-8 text-center">
                {isMobile ? zoom + 5 : zoom}%
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
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 sm:h-9 px-2 sm:px-3 bg-muted/30 border-none">
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
          </div>
        </div>`;

// Replace in both error view and success view
code = code.replaceAll(headerOld, headerNew);
fs.writeFileSync(path, code);
console.log('Successfully updated legacy GraphViewer header layout!');
