import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { useParams, useNavigate } from "react-router-dom";
import GraphViewer from "@/components/GraphViewer";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import AdBanner from "@/components/AdBanner";

const Viewer = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();

  // Detect mobile device
  const [isMobile] = useState(() => 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  );
  
  // Initialize date from URL or localStorage or current date
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    if (date) {
      const parsedDate = parseISO(date);
      if (!isNaN(parsedDate.getTime())) return parsedDate;
    }
    const savedDate = localStorage.getItem('selectedDate');
    if (savedDate) {
      const parsedDate = new Date(savedDate);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    }
    return new Date();
  });

  // Keep state synced with URL date changes
  useEffect(() => {
    if (date) {
      const parsedDate = parseISO(date);
      if (!isNaN(parsedDate.getTime())) {
        setSelectedDate(parsedDate);
      }
    }
  }, [date]);
  
  const [zoom, setZoom] = useState(isMobile ? 95 : 100);
  const [drawingTool, setDrawingTool] = useState<"pencil" | "highlighter" | "eraser" | null>(null);

  const handleLoadSuccess = () => {
    // Clear localStorage after content is successfully loaded
    localStorage.removeItem('selectedDate');
  };

  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  const handleDateChange = (newDate: Date) => {
    const newFormattedDate = format(newDate, "yyyy-MM-dd");
    navigate(`/date/${newFormattedDate}`);
  };

  return (
    <>
      <SEO />
      <div>
        <GraphViewer
          date={formattedDate}
          zoom={zoom}
          onZoomChange={setZoom}
          drawingTool={drawingTool}
          onDateChange={handleDateChange}
          onLoadSuccess={handleLoadSuccess}
          isMobile={isMobile}
        />
        <Footer />
      </div>
    </>
  );
};

export default Viewer;
