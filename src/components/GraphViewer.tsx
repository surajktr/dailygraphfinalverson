import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Canvas as FabricCanvas, PencilBrush } from "fabric";

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
  let tailwindScript = headEl.querySelector(
    "script[src*='cdn.tailwindcss.com']"
  ) as HTMLScriptElement | null;
  if (!tailwindScript) {
    tailwindScript = document.createElement("script");
    tailwindScript.src = "https://cdn.tailwindcss.com";
    tailwindScript.defer = true;
    headEl.appendChild(tailwindScript);
    headNodes.push(tailwindScript);
    await new Promise((resolve) => {
      tailwindScript!.addEventListener("load", resolve, { once: true });
    });
  }

  // Copy any <style> from the incoming HTML <head>
  doc.head?.querySelectorAll("style").forEach((styleTag) => {
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
    Array.from(s.attributes).forEach((attr) => ns.setAttribute(attr.name, attr.value));
    if (s.src) {
      await new Promise((resolve) => {
        ns.addEventListener("load", resolve, { once: true });
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
  drawingTool: "pencil" | "highlighter" | "eraser" | null;
}

const GraphViewer = ({ date, zoom, drawingTool }: GraphViewerProps) => {
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headNodesRef = useRef<Node[]>([]);
  const bodyScriptNodesRef = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const loadGraph = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch from database
        const { data, error: dbError } = await supabase
          .from("daily_graphs")
          .select("html_content")
          .eq("upload_date", date)
          .maybeSingle();

        if (dbError) throw dbError;

        if (data) {
          setHtmlContent(data.html_content);
        } else {
          setError("No graph found for this date");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load graph");
      } finally {
        setLoading(false);
      }
    };

    loadGraph();
  }, [date]);

  useEffect(() => {
    if (!htmlContent || !contentRef.current) return;

    // Cleanup previous
    bodyScriptNodesRef.current.forEach((n) => n.remove());
    bodyScriptNodesRef.current = [];

    headNodesRef.current.forEach((n) => {
      if (n.parentNode) n.parentNode.removeChild(n);
    });
    headNodesRef.current = [];

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    const run = async () => {
      await ensureExternalAssets(doc, headNodesRef.current);

      // Inject body content
      contentRef.current!.innerHTML = doc.body.innerHTML;
      
      // Enable pointer events for all interactive elements
      contentRef.current!.querySelectorAll('button, a, input, select, textarea, [onclick]').forEach(el => {
        (el as HTMLElement).style.pointerEvents = 'auto';
      });

      // Execute body scripts (inline and external) in order, then trigger DOMContentLoaded
      const bodyScripts = Array.from(doc.body.querySelectorAll("script"));
      for (const s of bodyScripts) {
        const ns = document.createElement("script");
        Array.from(s.attributes).forEach((attr) => ns.setAttribute(attr.name, attr.value));
        if (ns.hasAttribute("src")) {
          await new Promise((resolve) => {
            ns.addEventListener("load", resolve, { once: true });
            contentRef.current!.appendChild(ns);
          });
        } else {
          ns.text = s.text || s.textContent || "";
          contentRef.current!.appendChild(ns);
        }
        bodyScriptNodesRef.current.push(ns);
      }
      try {
        document.dispatchEvent(new Event("DOMContentLoaded"));
      } catch (e) {
        // no-op
      }
    };

    run();

    return () => {
      if (contentRef.current) contentRef.current.innerHTML = "";
      headNodesRef.current.forEach((n) => n.parentNode && n.parentNode.removeChild(n));
      headNodesRef.current = [];
      bodyScriptNodesRef.current.forEach((n) => n.remove());
      bodyScriptNodesRef.current = [];
    };
  }, [htmlContent]);

  // Initialize Fabric canvas once
  useEffect(() => {
    if (!canvasRef.current) return;
    const c = new FabricCanvas(canvasRef.current, {
      backgroundColor: "transparent",
    });
    fabricCanvasRef.current = c;

    const parent = canvasRef.current.parentElement;
    if (parent) {
      c.setDimensions({ width: parent.offsetWidth, height: parent.offsetHeight });
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
        height: parentElement.offsetHeight,
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
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-2">
          <p className="text-lg font-medium text-foreground">{error}</p>
          <p className="text-sm text-muted-foreground">Try selecting a different date</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-auto relative scrollbar-hide">
      <div 
        className="relative"
        style={{ 
          transform: `scale(${zoom / 100})`, 
          transformOrigin: 'top left', 
          width: `${100 / (zoom / 100)}%`, 
          height: `${100 / (zoom / 100)}%`,
          pointerEvents: 'auto'
        }}
      >
        <div ref={contentRef} className="w-full h-full" />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
          style={{ 
            pointerEvents: drawingTool ? 'auto' : 'none',
            zIndex: drawingTool ? 10 : 1
          }}
        />
      </div>
    </div>
  );
};

export default GraphViewer;
