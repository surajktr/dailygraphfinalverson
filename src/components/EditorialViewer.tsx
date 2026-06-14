import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTheme } from "next-themes";
import { Volume2, ZoomIn, Calendar as CalendarIcon, Check, X, Moon, Sun } from "lucide-react";

interface VocabularyWord {
  word: string;
  hindi: string;
  definition: string;
  example: string;
}

interface GraphData {
  title: string;
  titleHindi: string;
  text: string;
  vocabulary: VocabularyWord[];
}

interface EditorialViewerProps {
  date: string;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onDateChange: (date: Date) => void;
  onLoadSuccess?: () => void;
  isMobile?: boolean;
}

export default function EditorialViewer({
  date,
  zoom,
  onZoomChange,
  onDateChange,
  onLoadSuccess,
  isMobile
}: EditorialViewerProps) {
  const [data, setData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [learnedWords, setLearnedWords] = useState<string[]>([]);
  const { theme, setTheme } = useTheme();

  // Popup state
  const [popupWord, setPopupWord] = useState<VocabularyWord | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Load learned words
  useEffect(() => {
    const saved = localStorage.getItem('learnedWords');
    if (saved) {
      try {
        setLearnedWords(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse learned words", e);
      }
    }
  }, []);

  // Fetch data
  useEffect(() => {
    const fetchGraph = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: dbData, error: dbError } = await supabase
          .from("daily_graphs")
          .select("html_content")
          .eq("upload_date", date)
          .maybeSingle();

        if (dbError) throw dbError;

        if (dbData && dbData.html_content) {
          let parsedData: GraphData | null = null;
          
          try {
            parsedData = typeof dbData.html_content === 'string' 
              ? JSON.parse(dbData.html_content) 
              : dbData.html_content;
          } catch (e) {
            // Check for __INITIAL_DATA__ fallback
            if (typeof dbData.html_content === 'string' && dbData.html_content.includes('__INITIAL_DATA__')) {
              try {
                const match = dbData.html_content.match(/window\.__INITIAL_DATA__\s*=\s*(\{[\s\S]*?\});\s*<\/script>/);
                if (match && match[1]) {
                  parsedData = JSON.parse(match[1]);
                }
              } catch (e2) {}
            }
          }

          if (parsedData && parsedData.text && parsedData.vocabulary) {
            setData(parsedData);
            onLoadSuccess?.();
          } else {
            setError("Invalid JSON format found for this date.");
          }
        } else {
          setError("No content found for this date");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load content");
      } finally {
        setLoading(false);
      }
    };

    fetchGraph();
  }, [date, onLoadSuccess]);

  // Process article body to add interactive vocabulary words
  const renderProcessedBody = () => {
    if (!data) return null;
    
    // Sort words by length descending so longer phrases get matched first
    const sortedVocab = [...data.vocabulary].sort((a, b) => b.word.length - a.word.length);
    
    let processedHtml = data.text;

    sortedVocab.forEach((vocab) => {
      // Create a case-insensitive regex that ensures whole word match, accounting for punctuation
      const escapedWord = vocab.word.replace(/[.*+?^${}()|[\]\\]/g, '\$&');
      const regex = new RegExp(`\\\\b(${escapedWord})\\\\b`, 'gi');
      
      const isLearned = learnedWords.includes(vocab.word.toLowerCase());
      const classNames = isLearned ? 'premium-vocab-word learned' : 'premium-vocab-word';
      
      processedHtml = processedHtml.replace(regex, (match) => {
        // We use a custom attribute to safely store the word ID for the click handler
        return `<span class="${classNames}" data-vocab-id="${vocab.word.toLowerCase()}">${match}</span>`;
      });
    });

    // Add book icons to paragraphs
    const paragraphs = processedHtml.split('</p>').filter(p => p.trim());
    processedHtml = paragraphs.map(p => {
      if (p.trim() && p.includes('<p>')) {
        return p + ` <svg class="premium-book-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></p>`;
      }
      return p;
    }).join('');

    return processedHtml;
  };

  // Add click listeners to vocabulary words
  useEffect(() => {
    if (!data) return;

    const handleWordClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('premium-vocab-word')) {
        const wordId = target.getAttribute('data-vocab-id');
        if (wordId) {
          const vocabEntry = data.vocabulary.find(v => v.word.toLowerCase() === wordId);
          if (vocabEntry) {
            setPopupWord(vocabEntry);
          }
        }
      }
    };

    document.addEventListener('click', handleWordClick);
    return () => document.removeEventListener('click', handleWordClick);
  }, [data]);

  const toggleLearned = (word: string) => {
    const w = word.toLowerCase();
    const newLearned = learnedWords.includes(w)
      ? learnedWords.filter(item => item !== w)
      : [...learnedWords, w];
    
    setLearnedWords(newLearned);
    localStorage.setItem('learnedWords', JSON.stringify(newLearned));
  };

  const playAudio = (word: string) => {
    setIsAudioPlaying(true);
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onend = () => {
      setTimeout(() => setIsAudioPlaying(false), 300);
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const closePopup = () => setPopupWord(null);

  // Calculate progress
  const totalWords = data?.vocabulary.length || 0;
  const learnedCount = data ? data.vocabulary.filter(v => learnedWords.includes(v.word.toLowerCase())).length : 0;
  const progressPercent = totalWords > 0 ? Math.round((learnedCount / totalWords) * 100) : 0;
  
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progressPercent / 100) * circumference;

  if (loading) {
    return (
      <div className="premium-container flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-muted mb-4"></div>
          <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="premium-container flex items-center justify-center p-4">
        <div className="text-center p-6 bg-card rounded-lg border border-red-100 shadow-sm">
          <h2 className="text-xl font-bold text-red-600 mb-2">Could not load content</h2>
          <p className="text-muted-foreground">{error || "Data unavailable"}</p>
        </div>
      </div>
    );
  }

  const currentDate = new Date(date);

  return (
    <div className={`premium-container ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="premium-ambient-bg"></div>

      <div className="premium-app-container">
        {/* Header */}
        <header className="premium-header">
          <div className="premium-header-content">
            <div className="premium-brand">
              <div className="premium-brand-icon">
                <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              </div>
              <span className="premium-brand-text">The Dailygraph</span>
            </div>
            
            <div className="premium-header-actions">
              <button 
                className="premium-icon-btn" 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                title="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              
              <div className="premium-progress-ring-container" title="Daily progress">
                <svg className="premium-progress-ring-svg" width="44" height="44">
                  <circle className="premium-progress-ring-bg" cx="22" cy="22" r="18"/>
                  <circle 
                    className="premium-progress-ring-fill" 
                    cx="22" cy="22" r="18" 
                    strokeDasharray={circumference} 
                    strokeDashoffset={offset}
                  />
                </svg>
                <span className="premium-progress-text">{progressPercent}%</span>
              </div>
              
              <button 
                className="premium-icon-btn" 
                onClick={() => onZoomChange(zoom >= 140 ? 80 : zoom + 20)}
                title="Adjust text size"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
              </button>
              
              <Popover>
                <PopoverTrigger asChild>
                  <button className="premium-icon-btn" title="Calendar">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  </button>
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
          </div>
        </header>

        {/* Main Content */}
        <main className="premium-main-content">
          <article className="premium-article-card" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}>
            <div className="premium-article-meta">
              <span className="premium-category-tag">Editorial</span>
              <span className="premium-read-time">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {Math.max(1, Math.ceil(data.text.split(' ').length / 200))} min read
              </span>
            </div>

            <h1 className="premium-article-title">{data.title}</h1>

            <div 
              className="premium-article-body" 
              dangerouslySetInnerHTML={{ __html: renderProcessedBody() || '' }} 
            />
          </article>
        </main>

        {/* Definition Popup */}
        <div 
          className={`premium-popup-overlay ${popupWord ? 'active' : ''}`} 
          onClick={closePopup}
        ></div>
        
        <div className={`premium-definition-popup ${popupWord ? 'active' : ''}`} ref={popupRef}>
          {popupWord && (
            <>
              <div className="premium-popup-header">
                <div className="premium-popup-word-section">
                  <h2 className="premium-popup-word">{popupWord.word}</h2>
                  <button 
                    className={`premium-audio-btn ${isAudioPlaying ? 'playing' : ''}`}
                    onClick={() => playAudio(popupWord.word)}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                    <div className="premium-sound-waves">
                      <div className="premium-wave-bar"></div>
                      <div className="premium-wave-bar"></div>
                      <div className="premium-wave-bar"></div>
                    </div>
                  </button>
                </div>
                <button className="premium-close-btn" onClick={closePopup}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              <div className="premium-popup-divider"></div>

              <div className="premium-translation-section">
                <div className="premium-translation-label">Hindi Translation</div>
                <div className="premium-translation-text">{popupWord.hindi}</div>
              </div>

              <div className="premium-definition-section">
                <div className="premium-translation-label">Definition</div>
                <div className="premium-definition-text">{popupWord.definition}</div>
              </div>

              {popupWord.example && (
                <div className="premium-example-section">
                  <div className="premium-example-label">Example</div>
                  <div className="premium-example-text">{popupWord.example}</div>
                </div>
              )}

              <button 
                className={`premium-mark-learned-btn ${learnedWords.includes(popupWord.word.toLowerCase()) ? 'learned' : ''}`}
                onClick={() => toggleLearned(popupWord.word)}
              >
                {learnedWords.includes(popupWord.word.toLowerCase()) ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    <span>Learned</span>
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <span>Mark as Learned</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
