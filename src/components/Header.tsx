import { CalendarIcon, Minus, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface HeaderProps {
  date: Date;
  onDateChange: (date: Date) => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

const Header = ({ date, onDateChange, zoom, onZoomIn, onZoomOut, isVisible, setIsVisible }: HeaderProps) => {

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 bg-background border-b border-border transition-all duration-300 overflow-hidden ${isVisible ? 'h-16' : 'h-0 opacity-0'}`}>
        <div className="flex items-center justify-between h-16 px-4 md:px-6 max-w-full">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl md:text-2xl font-bold text-primary">
              Dailygraph
            </h1>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 md:gap-2 bg-secondary rounded-lg p-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={onZoomOut}
                className="h-8 w-8"
                disabled={zoom <= 50}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[3rem] text-center">
                {zoom}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={onZoomIn}
                className="h-8 w-8"
                disabled={zoom >= 200}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Date Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 h-10 px-3"
                >
                  <CalendarIcon className="h-4 w-4" />
                  <span className="hidden sm:inline text-sm font-medium">
                    {format(date, "dd MMM yyyy")}
                  </span>
                  <span className="sm:hidden text-sm font-medium">
                    {format(date, "dd MMM")}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && onDateChange(newDate)}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                    sevenDaysAgo.setHours(0, 0, 0, 0);
                    const checkDate = new Date(date);
                    checkDate.setHours(0, 0, 0, 0);
                    return checkDate > today || checkDate < sevenDaysAgo;
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsVisible(!isVisible)}
        className={`fixed left-1/2 -translate-x-1/2 transition-all duration-300 h-6 w-12 rounded-t-none rounded-b-lg bg-background border border-border border-t-0 hover:bg-secondary z-50 ${isVisible ? 'top-16' : 'top-0'}`}
      >
        {isVisible ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>
    </>
  );
};

export default Header;
