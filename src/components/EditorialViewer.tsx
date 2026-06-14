import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";

interface VocabularyWord {
  word: string;
  hindi: string;
  definition: string;
  example?: string;
}

interface SentenceAnalysis {
  sentence: string;
  explanation: string;
}

interface ArticleData {
  title: string;
  titleHindi?: string;
  text: string;
  vocabulary: VocabularyWord[];
  sentenceAnalyses?: SentenceAnalysis[];
}

interface EditorialViewerProps {
  date: string;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onDateChange: (date: Date) => void;
  onLoadSuccess?: () => void;
  isMobile?: boolean;
}

// Speak with Indian English voice, fast
function speakWord(text: string, onDone?: () => void) {
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.9;
  utter.pitch = 1;

  const voices = window.speechSynthesis.getVoices();
  const indianVoice = voices.find(
    (v) =>
      v.lang === "en-IN" ||
      v.name.toLowerCase().includes("india") ||
      v.name.toLowerCase().includes("ravi") ||
      v.name.toLowerCase().includes("heera") ||
      v.name.toLowerCase().includes("priya")
  );
  if (indianVoice) utter.voice = indianVoice;
  else utter.lang = "en-IN";

  if (onDone) utter.onend = onDone;
  window.speechSynthesis.speak(utter);
}

export default function EditorialViewer({
  date,
  zoom,
  onZoomChange,
  onDateChange,
  onLoadSuccess,
  isMobile,
}: EditorialViewerProps) {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [learnedWords, setLearnedWords] = useState<string[]>([]);
  const [isDark, setIsDark] = useState(false);

  // Popup state
  const [popupWord, setPopupWord] = useState<VocabularyWord | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Calendar state
  const [calOpen, setCalOpen] = useState(false);
  const [calMonth, setCalMonth] = useState(new Date(date).getMonth());
  const [calYear, setCalYear] = useState(new Date(date).getFullYear());

  // Translation popup state
  const [translationData, setTranslationData] = useState<{ sentence: string; explanation: string } | null>(null);

  // Font size state
  const [fontSize, setFontSize] = useState(16);

  // Load learned words from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("learnedWords");
      if (saved) setLearnedWords(JSON.parse(saved));
    } catch {}
  }, []);

  // Load dark mode preference
  useEffect(() => {
    const saved = localStorage.getItem("dailygraph-dark");
    if (saved === "true") setIsDark(true);
  }, []);

  // Apply dark mode to document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("dailygraph-dark", String(isDark));
  }, [isDark]);

  // Preload voices
  useEffect(() => {
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener("voiceschanged", () => {}, { once: true });
    }
  }, []);

  // Fetch data from Supabase
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
          let parsedData: any = null;

          try {
            parsedData =
              typeof dbData.html_content === "string"
                ? JSON.parse(dbData.html_content)
                : dbData.html_content;
          } catch {
            if (
              typeof dbData.html_content === "string" &&
              dbData.html_content.includes("__INITIAL_DATA__")
            ) {
              try {
                const match = dbData.html_content.match(
                  /window\.__INITIAL_DATA__\s*=\s*(\{[\s\S]*?\});\s*<\/script>/
                );
                if (match && match[1]) {
                  parsedData = JSON.parse(match[1]);
                }
              } catch {}
            }
          }

          if (parsedData && parsedData.articles && parsedData.articles.length > 0) {
            setArticles(parsedData.articles);
            const title = parsedData.articles[0].title;
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            const currentUrl = new URL(window.location.href);
            // Don't replace if it's already in the URL
            if (!currentUrl.pathname.endsWith(slug)) {
              window.history.replaceState(null, '', `/date/${date}/${slug}`);
            }
            onLoadSuccess?.();
          } else {
            setError("No content available for this date.");
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
  }, [date]);

  // Process article text: wrap vocabulary words and insert book icons before sentences
  const processArticleBody = useCallback(
    (article: ArticleData): string => {
      if (!article || !article.text) return "";

      let html = article.text;

      // Wrap text in <p> tags if not already
      if (!html.includes("<p>")) {
        html = html
          .split("\n")
          .filter((line) => line.trim())
          .map((line) => `<p>${line.trim()}</p>`)
          .join("");
      }

      // 1. Add book icon before each analyzed sentence FIRST
      if (article.sentenceAnalyses) {
        article.sentenceAnalyses.forEach((s) => {
          if (s.sentence && s.sentence.length > 8) {
            // Escape the sentence text for use in regex
            // Also replace spaces with \s+ to handle varying whitespace
            let escapedSentence = s.sentence.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            escapedSentence = escapedSentence.replace(/\\\s| /g, "\\s+");
            // Encode translation for data attribute
            const encodedTranslation = encodeURIComponent(s.explanation);
            const btnHtml = `<button class="dg-book-btn" data-translation="${encodedTranslation}" type="button" title="Translate sentence"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></button>`;
            
            try {
              const sentenceRegex = new RegExp("(" + escapedSentence + ")", "i");
              html = html.replace(sentenceRegex, btnHtml + "$1");
            } catch {}
          }
        });
      }

      // 2. Wrap vocabulary words with interactive spans SECOND
      // Sort vocabulary words by length (longest first) to avoid partial matches
      const sortedVocab = [...article.vocabulary].sort(
        (a, b) => b.word.length - a.word.length
      );

      sortedVocab.forEach((vocab) => {
        const escaped = vocab.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        // (?![^<]*>) prevents replacing text inside HTML tags (like data-translation)
        const regex = new RegExp("(?![^<]*>)\\b(" + escaped + ")\\b", "gi");
        const isLearned = learnedWords.includes(vocab.word.toLowerCase());
        const cls = isLearned ? "dg-vocab-word learned" : "dg-vocab-word";

        html = html.replace(
          regex,
          `<span class="${cls}" data-vocab-id="${vocab.word.toLowerCase()}">$1</span>`
        );
      });

      return html;
    },
    [learnedWords]
  );

  // Global click handler
  useEffect(() => {
    if (!articles.length) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Handle vocab word click
      if (target.closest(".dg-vocab-word")) {
        const wordEl = target.closest(".dg-vocab-word") as HTMLElement;
        const wordId = wordEl.getAttribute("data-vocab-id");
        if (wordId) {
          for (const article of articles) {
            const found = article.vocabulary.find(
              (v) => v.word.toLowerCase() === wordId
            );
            if (found) {
              setPopupWord(found);
              return;
            }
          }
        }
      }

      // Handle book icon click
      if (target.closest(".dg-book-btn")) {
        const btn = target.closest(".dg-book-btn") as HTMLElement;
        const encoded = btn.getAttribute("data-translation");
        if (encoded) {
          try {
            const explanation = decodeURIComponent(encoded);
            setTranslationData({ sentence: "Sentence Translation", explanation });
          } catch {
            setTranslationData({ sentence: "Sentence Translation", explanation: encoded });
          }
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [articles]);

  // Toggle learned
  const toggleLearned = (word: string) => {
    const w = word.toLowerCase();
    const newList = learnedWords.includes(w)
      ? learnedWords.filter((x) => x !== w)
      : [...learnedWords, w];
    setLearnedWords(newList);
    localStorage.setItem("learnedWords", JSON.stringify(newList));
  };

  // Toggle bookmark
  const toggleBookmark = (v: VocabularyWord) => {
      const saved = localStorage.getItem('saved_vocab');
      const bookmarks = saved ? JSON.parse(saved) : [];
      const isSaved = savedBookmarks.includes(v.word);
      
      if (!isSaved) {
          bookmarks.push({ word: v.word, hindi: v.hindi, definition: v.definition, savedAt: new Date().toISOString() });
          localStorage.setItem('saved_vocab', JSON.stringify(bookmarks));
          setSavedBookmarks([...savedBookmarks, v.word]);
          toast.success(`${v.word} bookmarked!`);
      } else {
          const newBookmarks = bookmarks.filter((b: any) => b.word !== v.word);
          localStorage.setItem('saved_vocab', JSON.stringify(newBookmarks));
          setSavedBookmarks(savedBookmarks.filter(w => w !== v.word));
          toast.info(`${v.word} removed from bookmarks`);
      }
  };

  // Play audio with Indian voice
  const playAudio = (word: string) => {
    setIsAudioPlaying(true);
    speakWord(word, () => setTimeout(() => setIsAudioPlaying(false), 200));
  };

  const closePopup = () => {
    setPopupWord(null);
    setIsAudioPlaying(false);
    window.speechSynthesis.cancel();
  };
  const closeTranslation = () => setTranslationData(null);

  const handleZoom = () => {
    const sizes = [14, 16, 18, 20, 22];
    const idx = sizes.indexOf(fontSize);
    setFontSize(sizes[(idx + 1) % sizes.length]);
  };

  // Progress calculation
  const totalWords = articles.reduce((acc, a) => acc + a.vocabulary.length, 0);
  const learnedCount = articles.reduce(
    (acc, a) =>
      acc + a.vocabulary.filter((v) => learnedWords.includes(v.word.toLowerCase())).length,
    0
  );
  const progressPercent = totalWords > 0 ? Math.round((learnedCount / totalWords) * 100) : 0;
  const circumference = 2 * Math.PI * 18;
  const offset = circumference - (progressPercent / 100) * circumference;

  // Calendar helpers
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const dayLabels = ["Su","Mo","Tu","We","Th","Fr","Sa"];
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(calYear, calMonth, 1).getDay();
  const selDate = new Date(date);
  const selectedDay = selDate.getDate();
  const selectedMonth = selDate.getMonth();
  const selectedYear = selDate.getFullYear();
  const today = new Date();

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); }
    else setCalMonth(calMonth - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); }
    else setCalMonth(calMonth + 1);
  };
  const selectDate = (day: number) => {
    onDateChange(new Date(calYear, calMonth, day));
    setCalOpen(false);
  };

  if (loading) {
    return (
      <div className="dg-container dg-center">
        <div className="dg-loader">
          <div className="dg-spinner" />
          <p>Loading today's editorial…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dg-container">

      {/* ===== HEADER ===== */}
      <header className="dg-header">
        <div className="dg-header-inner">
          <div className="dg-brand">
            <div className="dg-brand-icon">📰</div>
            <span className="dg-brand-name">The Dailygraph</span>
          </div>

          <div className="dg-header-actions">
            {/* Dark mode */}
            <button className="dg-icon-btn" onClick={() => setIsDark(!isDark)} title="Toggle theme">
              {isDark ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>

            {/* Progress ring */}
            <div className="dg-progress-ring" title={`${progressPercent}% learned`}>
              <svg width="44" height="44" style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)" }}>
                <circle cx="22" cy="22" r="18" fill="none" stroke="var(--dg-border)" strokeWidth="3" />
                <circle cx="22" cy="22" r="18" fill="none" stroke="var(--dg-accent)" strokeWidth="3"
                  strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
                  style={{ transition: "stroke-dashoffset 1s ease" }} />
              </svg>
              <span className="dg-progress-text">{progressPercent}%</span>
            </div>

            {/* Zoom */}
            <button className="dg-icon-btn" onClick={handleZoom} title={`Font: ${fontSize}px`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
            </button>

            {/* Calendar */}
            <button className="dg-icon-btn" onClick={() => setCalOpen(true)} title="Pick date">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </button>

            {/* Bookmarks Page Link */}
            <button className="dg-icon-btn" onClick={() => window.location.href = '/bookmarks'} title="View Bookmarks">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
            </button>

            {/* Telegram */}
            <a href="https://t.me/thedailygraph" target="_blank" rel="noreferrer" className="dg-icon-btn" title="Join Telegram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </a>
          </div>
        </div>
      </header>

      {/* ===== ARTICLES OR ERROR ===== */}
      {(error || !articles.length) ? (
        <main className="dg-main dg-center" style={{ minHeight: "60vh" }}>
          <div className="dg-error-box">
            <h2>Could not load content</h2>
            <p>{error || "Data unavailable for this date."}</p>
          </div>
        </main>
      ) : (
        <main className="dg-main">
          <SEO 
            title={`${articles[0].title} | Dailygraph`}
            description={articles[0].text.substring(0, 160).replace(/<[^>]+>/g, '') + "..."}
            ogUrl={window.location.href}
          />
        {articles.map((article, idx) => (
          <section key={idx} className="dg-article">
            {/* Article meta */}
            <div className="dg-article-meta">
              <span className="dg-tag">Editorial</span>
              <span className="dg-read-time">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {Math.max(1, Math.ceil((article.text || "").split(" ").length / 200))} min
              </span>
            </div>

            {/* Title */}
            <h1 className="dg-article-title">{article.title}</h1>

            {/* Body */}
            <div
              className="dg-article-body"
              style={{ fontSize: `${fontSize}px` }}
              dangerouslySetInnerHTML={{ __html: processArticleBody(article) }}
            />

            {/* ===== VOCAB LIST ===== */}
            {article.vocabulary && article.vocabulary.length > 0 && (
              <div className="dg-vocab-list">
                <div className="dg-vocab-list-header">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                  <span>Difficult Words</span>
                  <span className="dg-vocab-count">{article.vocabulary.length}</span>
                </div>
                <div className="dg-vocab-items">
                  {article.vocabulary.map((v, vi) => {
                    const isLearned = learnedWords.includes(v.word.toLowerCase());
                    return (
                      <div key={vi} className={`dg-vocab-item ${isLearned ? "learned" : ""}`}>
                        <div className="dg-vocab-item-top">
                          <span className="dg-vocab-word-text">{v.word}</span>
                          <div className="flex gap-1">
                            <button
                              className="dg-speak-btn"
                              title="Speak"
                              onClick={() => speakWord(v.word)}
                            >
                              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                              </svg>
                            </button>
                            <button
                              className={`dg-save-btn bg-background text-foreground border border-border p-1 rounded-sm hover:bg-secondary cursor-pointer shadow-sm transition-all ${savedBookmarks.includes(v.word) ? 'text-red-500' : ''}`}
                              title="Bookmark"
                              onClick={() => toggleBookmark(v)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={savedBookmarks.includes(v.word) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                            </button>
                          </div>
                            <button
                              className={`dg-learned-pill ${isLearned ? "learned" : ""}`}
                              onClick={() => toggleLearned(v.word)}
                            >
                              {isLearned ? "Learned" : "Mark"}
                            </button>
                        </div>
                        <div className="dg-vocab-hindi">{v.hindi}</div>
                        <div className="dg-vocab-def">{v.definition}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        ))}
      </main>
      )}

      {/* ===== VOCAB POPUP (bottom sheet) ===== */}
      <div className={`dg-overlay ${popupWord ? "active" : ""}`} onClick={closePopup} />
      <div className={`dg-sheet ${popupWord ? "active" : ""}`}>
        {popupWord && (
          <>
            <div className="dg-sheet-header">
              <div className="dg-sheet-word-row">
                <h2 className="dg-sheet-word">{popupWord.word}</h2>
                <button
                  className={`dg-audio-btn ${isAudioPlaying ? "playing" : ""}`}
                  onClick={() => playAudio(popupWord.word)}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" fill="none" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
              </div>
              <button className="dg-close" onClick={closePopup}>✕</button>
            </div>

            <div className="dg-divider" />

            <div className="dg-section">
              <div className="dg-label">Hindi</div>
              <div className="dg-hindi-text">{popupWord.hindi}</div>
            </div>

            <div className="dg-divider" />

            <div className="dg-section">
              <div className="dg-label">Definition</div>
              <div className="dg-def-text">{popupWord.definition}</div>
            </div>

            {popupWord.example && (
              <div className="dg-example-box">
                <div className="dg-label" style={{ color: "var(--dg-accent)", marginBottom: 6 }}>Example</div>
                <div className="dg-example-text">{popupWord.example}</div>
              </div>
            )}

            <button
              className={`dg-mark-btn ${learnedWords.includes(popupWord.word.toLowerCase()) ? "learned" : ""}`}
              onClick={() => toggleLearned(popupWord.word)}
            >
              {learnedWords.includes(popupWord.word.toLowerCase()) ? (
                <>Learned</>
              ) : (
                <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> Mark as Learned</>
              )}
            </button>
          </>
        )}
      </div>

      {/* ===== TRANSLATION POPUP (bottom sheet) ===== */}
      <div className={`dg-overlay ${translationData ? "active" : ""}`} onClick={closeTranslation} style={{ zIndex: 310 }} />
      <div className={`dg-sheet ${translationData ? "active" : ""}`} style={{ zIndex: 311 }}>
        {translationData && (
          <>
            <div className="dg-sheet-header">
              <h2 className="dg-sheet-word" style={{ fontSize: 18 }}>📖 Hindi Translation</h2>
              <button className="dg-close" onClick={closeTranslation}>✕</button>
            </div>
            <div className="dg-divider" />
            <div className="dg-hindi-text" style={{ fontSize: 20, lineHeight: 1.7, padding: "8px 0" }}>
              {translationData.explanation}
            </div>
          </>
        )}
      </div>

      {/* ===== CALENDAR MODAL ===== */}
      <div className={`dg-cal-modal ${calOpen ? "active" : ""}`}>
        <div className="dg-cal-backdrop" onClick={() => setCalOpen(false)} />
        <div className="dg-cal-sheet">
          <div className="dg-cal-head">
            <h3 className="dg-cal-title">{monthNames[calMonth]} {calYear}</h3>
            <div className="dg-cal-nav">
              <button onClick={prevMonth}>‹</button>
              <button onClick={nextMonth}>›</button>
              <button className="dg-close" onClick={() => setCalOpen(false)}>✕</button>
            </div>
          </div>
          <div className="dg-cal-grid">
            {dayLabels.map((d, i) => (
              <div key={`l${i}`} className="dg-cal-label">{d}</div>
            ))}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`e${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isActive = day === selectedDay && calMonth === selectedMonth && calYear === selectedYear;
              const isToday = day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
              return (
                <button
                  key={`d${day}`}
                  className={`dg-cal-day ${isActive ? "active" : ""} ${isToday ? "today" : ""}`}
                  onClick={() => selectDate(day)}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
