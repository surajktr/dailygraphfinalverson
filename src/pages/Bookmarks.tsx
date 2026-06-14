import { useState, useEffect } from "react";
import { Download, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";

interface SavedVocab {
  word: string;
  hindi: string;
  definition: string;
  savedAt: string;
}

const Bookmarks = () => {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState<SavedVocab[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("saved_vocab");
    if (saved) {
      try {
        setBookmarks(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved vocabulary");
      }
    }
  }, []);

  const removeBookmark = (wordToRemove: string) => {
    const updated = bookmarks.filter((b) => b.word !== wordToRemove);
    setBookmarks(updated);
    localStorage.setItem("saved_vocab", JSON.stringify(updated));
    toast.success(`${wordToRemove} removed from bookmarks`);
  };

  const clearAll = () => {
    if (window.confirm("Are you sure you want to clear all your saved vocabulary?")) {
      setBookmarks([]);
      localStorage.removeItem("saved_vocab");
      toast.success("All bookmarks cleared");
    }
  };

  const downloadPrintableHTML = () => {
    if (bookmarks.length === 0) {
      toast.error("No bookmarks to download!");
      return;
    }

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Vocabulary Bookmarks</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12pt;
            line-height: 1.4;
            color: black;
            background: white;
            margin: 20px;
        }
        h1 {
            text-align: center;
            font-size: 18pt;
            margin-bottom: 20px;
            text-transform: uppercase;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid black;
            padding: 8px 12px;
            text-align: left;
            vertical-align: top;
        }
        th {
            background-color: #f0f0f0;
            font-weight: bold;
        }
        .word {
            font-weight: bold;
            font-size: 13pt;
        }
        .hindi {
            color: #333;
            font-weight: bold;
        }
        .definition {
            font-size: 11pt;
            color: #111;
        }
        @media print {
            body { margin: 0; }
            table { page-break-inside: auto; }
            tr { page-break-inside: avoid; page-break-after: auto; }
            button { display: none; }
        }
    </style>
</head>
<body>
    <button onclick="window.print()" style="margin-bottom: 20px; padding: 10px 20px; font-size: 14px; cursor: pointer;">🖨️ Print Document</button>
    <h1>My Saved Vocabulary</h1>
    <table>
        <thead>
            <tr>
                <th style="width: 20%;">Word</th>
                <th style="width: 30%;">Meaning (Hindi)</th>
                <th style="width: 50%;">Definition (English)</th>
            </tr>
        </thead>
        <tbody>
            ${bookmarks.map(b => `
            <tr>
                <td class="word">${b.word}</td>
                <td class="hindi">${b.hindi}</td>
                <td class="definition">${b.definition}</td>
            </tr>
            `).join("")}
        </tbody>
    </table>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dailygraph-bookmarks-${new Date().toISOString().split("T")[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Printable HTML downloaded successfully!");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Helmet>
        <title>Bookmarks | Dailygraph</title>
      </Helmet>

      {/* Basic header for Bookmarks page */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border h-16">
        <div className="flex items-center justify-between h-full px-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-primary">Bookmarks</h1>
          </div>
        </div>
      </header>

      <main className="pt-24 px-4 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold">Saved Vocabulary</h2>
            <p className="text-muted-foreground">You have {bookmarks.length} saved words.</p>
          </div>
          <div className="flex gap-2">
            {bookmarks.length > 0 && (
              <>
                <Button variant="outline" onClick={clearAll}>
                  Clear All
                </Button>
                <Button onClick={downloadPrintableHTML} className="gap-2">
                  <Download className="h-4 w-4" />
                  Print / Download
                </Button>
              </>
            )}
          </div>
        </div>

        {bookmarks.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-border rounded-lg">
            <h3 className="text-xl font-semibold mb-2">No bookmarks yet</h3>
            <p className="text-muted-foreground mb-4">
              Save difficult words from the editorial to study them later.
            </p>
            <Button onClick={() => navigate("/")}>Read Editorial</Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {bookmarks.map((vocab, index) => (
              <div key={index} className="dg-vocab-item relative pr-12">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 text-muted-foreground hover:text-destructive"
                  onClick={() => removeBookmark(vocab.word)}
                  title="Remove bookmark"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <h4 className="dg-vocab-word">{vocab.word}</h4>
                <p className="dg-vocab-hindi">{vocab.hindi}</p>
                <p className="dg-vocab-def">{vocab.definition}</p>
                <div className="text-xs text-muted-foreground mt-2">
                  Saved on {new Date(vocab.savedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Bookmarks;
