import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CalendarIcon, ZoomIn, ZoomOut, ChevronDown, ChevronUp } from "lucide-react";
import { Canvas as FabricCanvas, PencilBrush } from "fabric";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// Helper to load external assets once and inject styles/scripts so the HTML works as-is
const ensureExternalAssets = async (doc: Document, headNodes: Node[]) => {
  const headEl = document.head;

  // Google Fonts
  const fontsHref = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lora:wght@700&display=swap";
  if (!headEl.querySelector(`link[data-injected-fonts="inter-lora"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = fontsHref;
    link.setAttribute("data-injected-fonts", "inter-lora");
    headEl.appendChild(link);
    headNodes.push(link);
  }

  // Tailwind CDN (needed because content classes are dynamic)
  let tailwindScript = headEl.querySelector("script[src*='cdn.tailwindcss.com']") as HTMLScriptElement | null;
  if (!tailwindScript) {
    tailwindScript = document.createElement("script");
    tailwindScript.src = "https://cdn.tailwindcss.com";
    tailwindScript.defer = true;
    headEl.appendChild(tailwindScript);
    headNodes.push(tailwindScript);
    await new Promise(resolve => {
      tailwindScript!.addEventListener("load", resolve, {
        once: true
      });
    });
  }

  // Copy any <style> from the incoming HTML <head>
  doc.head?.querySelectorAll("style").forEach(styleTag => {
    const clone = styleTag.cloneNode(true);
    headEl.appendChild(clone);
    headNodes.push(clone);
  });

  // Execute head scripts (both external and inline) in order
  const headScripts = Array.from(doc.head?.querySelectorAll("script") || []);
  for (const s of headScripts) {
    // Skip Tailwind CDN if we already injected it above
    const isTailwindCdn = s.getAttribute("src")?.includes("cdn.tailwindcss.com");
    if (isTailwindCdn) continue;
    const ns = document.createElement("script");
    Array.from(s.attributes).forEach(attr => ns.setAttribute(attr.name, attr.value));
    if (s.src) {
      await new Promise(resolve => {
        ns.addEventListener("load", resolve, {
          once: true
        });
        document.head.appendChild(ns);
      });
    } else {
      ns.textContent = s.textContent || "";
      document.head.appendChild(ns);
    }
    headNodes.push(ns);
  }
};
interface GraphViewerProps {
  date: string;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  drawingTool: "pencil" | "highlighter" | "eraser" | null;
  onDateChange: (date: Date) => void;
  onLoadSuccess?: () => void;
  isMobile?: boolean;
}
const GraphViewer = ({
  date,
  zoom,
  onZoomChange,
  drawingTool,
  onDateChange,
  onLoadSuccess,
  isMobile = false
}: GraphViewerProps) => {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [headerHidden, setHeaderHidden] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headNodesRef = useRef<Node[]>([]);
  const bodyScriptNodesRef = useRef<HTMLElement[]>([]);
  const bodyObserverRef = useRef<MutationObserver | null>(null);
  const externalBodyNodesRef = useRef<Set<HTMLElement>>(new Set());
  const injectionActiveRef = useRef<boolean>(false);
  useEffect(() => {
    const loadGraph = async () => {
      // Reset content first to force re-render
      setHtmlContent("");
      setLoading(true);
      setError(null);
      try {
        const {
          data,
          error: dbError
        } = await supabase.from("daily_graphs").select("html_content").eq("upload_date", date).maybeSingle();
        if (dbError) throw dbError;
        if (data && data.html_content) {
          setHtmlContent(data.html_content);
          onLoadSuccess?.();
        } else {
          setError("No content found for this date");
          setHtmlContent("");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load content");
        setHtmlContent("");
      } finally {
        setLoading(false);
      }
    };
    loadGraph();
  }, [date]);
  useEffect(() => {
    // Clear content immediately when htmlContent becomes empty
    if (!htmlContent) {
      // Also clean up any previously injected assets and external overlays
      bodyScriptNodesRef.current.forEach(n => n.remove());
      bodyScriptNodesRef.current = [];
      headNodesRef.current.forEach(n => {
        try {
          n.parentNode?.removeChild(n);
        } catch {}
      });
      headNodesRef.current = [];
      if (bodyObserverRef.current) {
        bodyObserverRef.current.disconnect();
        bodyObserverRef.current = null;
      }
      externalBodyNodesRef.current.forEach(n => {
        if (n.hasAttribute("data-radix-portal") || n.closest("[data-sonner-toaster]") || n.hasAttribute("data-sonner-toaster")) return;
        try {
          if (n.parentNode && n.parentNode.contains(n)) {
            n.parentNode.removeChild(n);
          }
        } catch (e) {
          // Node already removed or inaccessible
        }
      });
      externalBodyNodesRef.current.clear();
      if (contentRef.current) {
        contentRef.current.innerHTML = "";
      }
      return;
    }
    if (!contentRef.current) return;

    // Cleanup previous
    bodyScriptNodesRef.current.forEach(n => n.remove());
    bodyScriptNodesRef.current = [];
    headNodesRef.current.forEach(n => {
      if (n.parentNode) n.parentNode.removeChild(n);
    });
    headNodesRef.current = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const run = async () => {
      // Clean up old external nodes before loading new content
      externalBodyNodesRef.current.forEach(n => {
        if (n.hasAttribute("data-radix-portal") || n.closest("[data-sonner-toaster]") || n.hasAttribute("data-sonner-toaster")) return;
        try {
          if (n.parentNode && n.parentNode.contains(n)) {
            n.parentNode.removeChild(n);
          }
        } catch (e) {
          // Node already removed or inaccessible
        }
      });
      externalBodyNodesRef.current.clear();

      // Start observing the document body for nodes appended outside the app root (#root)
      if (bodyObserverRef.current) {
        bodyObserverRef.current.disconnect();
      }
      injectionActiveRef.current = true;
      bodyObserverRef.current = new MutationObserver(mutations => {
        for (const mutation of mutations) {
          mutation.addedNodes.forEach(node => {
            if (injectionActiveRef.current && node instanceof HTMLElement && !node.closest("#root") && !node.hasAttribute("data-radix-portal") && !node.closest("[data-sonner-toaster]") && !node.hasAttribute("data-sonner-toaster")) {
              externalBodyNodesRef.current.add(node);
              node.setAttribute("data-gv-external", "true");
            }
          });
        }
      });
      bodyObserverRef.current.observe(document.body, {
        childList: true,
        subtree: true
      });
      await ensureExternalAssets(doc, headNodesRef.current);

      // Inject body content
      if (!contentRef.current) return;
      contentRef.current.innerHTML = doc.body.innerHTML;

      // Execute body scripts (inline and external) in order, then trigger DOMContentLoaded
      const bodyScripts = Array.from(doc.body.querySelectorAll("script"));
      for (const s of bodyScripts) {
        const ns = document.createElement("script");
        Array.from(s.attributes).forEach(attr => ns.setAttribute(attr.name, attr.value));
        if (ns.hasAttribute("src")) {
          await new Promise(resolve => {
            ns.addEventListener("load", resolve, {
              once: true
            });
            if (!contentRef.current) return;
            contentRef.current.appendChild(ns);
          });
        } else {
          ns.text = s.text || s.textContent || "";
          if (!contentRef.current) return;
          contentRef.current.appendChild(ns);
        }
        bodyScriptNodesRef.current.push(ns);
      }
      try {
        document.dispatchEvent(new Event("DOMContentLoaded"));
        // Some uploaded pages reveal content on window "load" only
        window.dispatchEvent(new Event("load"));
      } catch (e) {
        // no-op
      }
      // Stop capturing nodes after injection completes
      injectionActiveRef.current = false;
      if (bodyObserverRef.current) {
        bodyObserverRef.current.disconnect();
        bodyObserverRef.current = null;
      }
    };
    run();
    return () => {
      if (contentRef.current) contentRef.current.innerHTML = "";
      headNodesRef.current.forEach(n => {
        try {
          n.parentNode?.removeChild(n);
        } catch {}
      });
      headNodesRef.current = [];
      bodyScriptNodesRef.current.forEach(n => n.remove());
      bodyScriptNodesRef.current = [];
      if (bodyObserverRef.current) {
        bodyObserverRef.current.disconnect();
        bodyObserverRef.current = null;
      }
      externalBodyNodesRef.current.forEach(n => {
        if (n.hasAttribute("data-radix-portal") || n.closest("[data-sonner-toaster]") || n.hasAttribute("data-sonner-toaster")) return;
        try {
          if (n.parentNode && n.parentNode.contains(n)) {
            n.parentNode.removeChild(n);
          }
        } catch (e) {
          // Node already removed or inaccessible
        }
      });
      externalBodyNodesRef.current.clear();
    };
  }, [htmlContent]);

  // Initialize Fabric canvas once
  useEffect(() => {
    if (!canvasRef.current) return;
    const c = new FabricCanvas(canvasRef.current, {
      backgroundColor: "transparent"
    });
    fabricCanvasRef.current = c;
    const parent = canvasRef.current.parentElement;
    if (parent) {
      c.setDimensions({
        width: parent.offsetWidth,
        height: parent.offsetHeight
      });
    }
    return () => {
      c.dispose();
      fabricCanvasRef.current = null;
    };
  }, []);

  // Update canvas dimensions when zoom changes
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    const parentElement = canvasRef.current?.parentElement;
    if (parentElement) {
      canvas.setDimensions({
        width: parentElement.offsetWidth,
        height: parentElement.offsetHeight
      });
    }
  }, [zoom]);
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    if (drawingTool === "pencil") {
      canvas.isDrawingMode = true;
      const brush = new PencilBrush(canvas);
      brush.color = "#000000";
      brush.width = 2;
      canvas.freeDrawingBrush = brush;
    } else if (drawingTool === "highlighter") {
      canvas.isDrawingMode = true;
      const brush = new PencilBrush(canvas);
      brush.color = "rgba(255, 255, 0, 0.4)";
      brush.width = 20;
      canvas.freeDrawingBrush = brush;
    } else if (drawingTool === "eraser") {
      canvas.isDrawingMode = true;
      const brush = new PencilBrush(canvas);
      brush.color = "#ffffff";
      brush.width = 20;
      canvas.freeDrawingBrush = brush;
    } else {
      canvas.isDrawingMode = false;
    }
  }, [drawingTool]);
  if (loading) {
    return <div className="w-full h-full flex flex-col">
      {/* Header with branding and calendar */}
        <div className="flex items-center justify-between p-2 sm:p-4 bg-background border-b border-border">
          <h1 className="text-base sm:text-xl font-bold text-primary">Dailygraph</h1>
          <div className="h-8 w-24 sm:h-10 sm:w-32 bg-muted animate-pulse rounded-md" />
        </div>
        
        {/* Skeleton Content */}
        <div className="flex-1 p-4 space-y-4 overflow-hidden">
          <div className="h-48 bg-muted animate-pulse rounded-lg" />
          <div className="space-y-3">
            <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
            <div className="h-4 bg-muted animate-pulse rounded w-full" />
            <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
          </div>
          <div className="h-32 bg-muted animate-pulse rounded-lg" />
          <div className="space-y-3">
            <div className="h-4 bg-muted animate-pulse rounded w-full" />
            <div className="h-4 bg-muted animate-pulse rounded w-4/5" />
          </div>
        </div>
      </div>;
  }
  
  const currentDate = new Date(date);
  
  if (error) {
    return <div className="w-full h-full flex flex-col relative">
      {/* Header with branding, zoom controls, and date picker */}
      {!headerHidden && (
        <div className="flex items-center justify-between gap-2 p-2 sm:p-3 bg-background border-b border-border">
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
                  <span className="text-xs sm:text-sm font-medium">
                    {format(currentDate, "dd MMM yyyy")}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={currentDate}
                  onSelect={newDate => newDate && onDateChange(newDate)}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const earliest = new Date(today);
                    earliest.setDate(today.getDate() - 6); // last 7 days inclusive
                    const checkDate = new Date(date);
                    checkDate.setHours(0, 0, 0, 0);
                    return checkDate > today || checkDate < earliest;
                  }}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setHeaderHidden(true)}
              className="h-7 w-7 sm:h-9 sm:w-9"
            >
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {/* Show header button when hidden */}
      {headerHidden && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => setHeaderHidden(false)}
          className="absolute top-2 right-2 z-20 h-7 w-7 sm:h-9 sm:w-9"
        >
          <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      )}
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-foreground">{error}</p>
          <p className="text-sm text-muted-foreground">Try selecting a different date</p>
        </div>
      </div>
    </div>;
  }
  
  return <div className="w-full h-full flex flex-col relative">
      {/* Header with branding, zoom controls, and date picker */}
      {!headerHidden && (
        <div className="flex items-center justify-between gap-2 p-2 sm:p-3 bg-background border-b border-border">
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
                  <span className="text-xs sm:text-sm font-medium">
                    {format(currentDate, "dd MMM yyyy")}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={currentDate}
                  onSelect={newDate => newDate && onDateChange(newDate)}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const earliest = new Date(today);
                    earliest.setDate(today.getDate() - 6); // last 7 days inclusive
                    const checkDate = new Date(date);
                    checkDate.setHours(0, 0, 0, 0);
                    return checkDate > today || checkDate < earliest;
                  }}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setHeaderHidden(true)}
              className="h-7 w-7 sm:h-9 sm:w-9"
            >
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      )}
      
      {/* Show header button when hidden */}
      {headerHidden && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => setHeaderHidden(false)}
          className="absolute top-2 right-2 z-20 h-7 w-7 sm:h-9 sm:w-9"
        >
          <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-x-auto overflow-y-auto relative sm:hide-scrollbar">
        <div className="relative" style={{
        transform: `scale(${zoom / 100})`,
        transformOrigin: 'top left',
        width: `${100 / (zoom / 100)}%`,
        height: `${100 / (zoom / 100)}%`
      }}>
          <div ref={contentRef} className="w-full h-full" />
          <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" style={{
          pointerEvents: drawingTool ? 'auto' : 'none',
          zIndex: drawingTool ? 10 : -10,
          display: drawingTool ? 'block' : 'none'
        }} />
        </div>
      </div>
    </div>;
};
export default GraphViewer;
