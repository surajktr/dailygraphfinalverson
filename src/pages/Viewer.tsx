import { useState } from "react";
import { format } from "date-fns";
import Header from "@/components/Header";
import GraphViewer from "@/components/GraphViewer";

const Viewer = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [zoom, setZoom] = useState(100);
  const [drawingTool, setDrawingTool] = useState<"pencil" | "highlighter" | "eraser" | null>(null);
  const [headerVisible, setHeaderVisible] = useState(true);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 50));
  };

  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header
        date={selectedDate}
        onDateChange={setSelectedDate}
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        isVisible={headerVisible}
        setIsVisible={setHeaderVisible}
      />
      <main className={`flex-1 overflow-hidden transition-all duration-300 ${headerVisible ? 'mt-16' : 'mt-6'}`}>
        <GraphViewer
          date={formattedDate}
          zoom={zoom}
          drawingTool={drawingTool}
        />
      </main>
    </div>
  );
};

export default Viewer;
