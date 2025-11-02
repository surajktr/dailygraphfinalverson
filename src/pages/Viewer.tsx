import { useState, useEffect } from "react";
import { format } from "date-fns";
import GraphViewer from "@/components/GraphViewer";

const Viewer = () => {
  // Detect mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Initialize date from localStorage or use current date
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const savedDate = localStorage.getItem('selectedDate');
    if (savedDate) {
      const parsedDate = new Date(savedDate);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }
    return new Date();
  });
  
  const [zoom, setZoom] = useState(isMobile ? 95 : 100);
  const [drawingTool, setDrawingTool] = useState<"pencil" | "highlighter" | "eraser" | null>(null);

  const handleLoadSuccess = () => {
    // Clear localStorage after content is successfully loaded
    localStorage.removeItem('selectedDate');
  };

  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  const handleDateChange = (newDate: Date) => {
    // Save the new date to localStorage
    localStorage.setItem('selectedDate', newDate.toISOString());
    // Refresh the page to load the new content
    window.location.reload();
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <main className="flex-1 overflow-hidden">
        <GraphViewer
          date={formattedDate}
          zoom={zoom}
          onZoomChange={setZoom}
          drawingTool={drawingTool}
          onDateChange={handleDateChange}
          onLoadSuccess={handleLoadSuccess}
        />
      </main>
    </div>
  );
};

export default Viewer;
