import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  const [translationData, setTranslationData] = useState<SentenceAnalysis[] | null>(null);

  // Font size state (managed internally for smooth zoom)
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
            // Fallback: extract from __INITIAL_DATA__
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

  // Process article text: wrap vocabulary words with interactive spans
  const processArticleBody = useCallback(
    (article: ArticleData): string => {
      if (!article || !article.text) return "";

      let html = article.text;

      // Wrap text in <p> tags if it's not already
      if (!html.includes("<p>")) {
        html = html
          .split("\n")
          .filter((line) => line.trim())
          .map((line) => `<p>${line.trim()}</p>`)
          .join("");
      }

      // Sort vocabulary words by length (longest first) to avoid partial matches
      const sortedVocab = [...article.vocabulary].sort(
        (a, b) => b.word.length - a.word.length
      );

      sortedVocab.forEach((vocab) => {
        const escaped = vocab.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp("\\b(" + escaped + ")\\b", "gi");
        const isLearned = learnedWords.includes(vocab.word.toLowerCase());
        const cls = isLearned ? "premium-vocab-word learned" : "premium-vocab-word";

        html = html.replace(
          regex,
          `<span class="${cls}" data-vocab-id="${vocab.word.toLowerCase()}">$1</span>`
        );
      });

      // Add book icon buttons after each paragraph
      html = html.replace(/<\/p>/g, (match) => {
        return ` <button class="premium-book-icon" type="button"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></button></p>`;
      });

      return html;
    },
    [learnedWords]
  );

  // Global click handler for vocab words and book icons
  useEffect(() => {
    if (!articles.length) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Handle vocab word click
      if (target.closest(".premium-vocab-word")) {
        const wordEl = target.closest(".premium-vocab-word") as HTMLElement;
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
      if (target.closest(".premium-book-icon")) {
        const btn = target.closest(".premium-book-icon") as HTMLElement;
        // Find the parent <p> tag
        const parentP = btn.closest("p");
        if (parentP) {
          const paraText = parentP.textContent || "";
          // Find matching sentence analyses
          for (const article of articles) {
            if (article.sentenceAnalyses && article.sentenceAnalyses.length > 0) {
              const matched = article.sentenceAnalyses.filter(
                (s) =>
                  paraText.includes(s.sentence.substring(0, 30)) ||
                  s.sentence.includes(paraText.substring(0, 30))
              );
              if (matched.length > 0) {
                setTranslationData(matched);
                return;
              }
            }
          }
          setTranslationData([
            { sentence: paraText.trim(), explanation: "Hindi translation not available." },
          ]);
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

  // Play audio
  const playAudio = (word: string) => {
    setIsAudioPlaying(true);
    const u = new SpeechSynthesisUtterance(word);
    u.lang = "en-US";
    u.rate = 0.9;
    u.onend = () => setTimeout(() => setIsAudioPlaying(false), 300);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  // Close popups
  const closePopup = () => {
    setPopupWord(null);
    setIsAudioPlaying(false);
  };
  const closeTranslation = () => setTranslationData(null);

  // Zoom handler
  const handleZoom = () => {
    const sizes = [14, 16, 18, 20, 22];
    const currentIndex = sizes.indexOf(fontSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    setFontSize(sizes[nextIndex]);
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
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(calYear, calMonth, 1).getDay();
  const selectedDay = new Date(date).getDate();
  const selectedMonth = new Date(date).getMonth();
  const selectedYear = new Date(date).getFullYear();
  const today = new Date();

  const prevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(calYear - 1);
    } else {
      setCalMonth(calMonth - 1);
    }
  };
  const nextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(calYear + 1);
    } else {
      setCalMonth(calMonth + 1);
    }
  };
  const selectDate = (day: number) => {
    const newDate = new Date(calYear, calMonth, day);
    onDateChange(newDate);
    setCalOpen(false);
  };

  // LOADING
  if (loading) {
    return (
      <div className="premium-container" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--accent-glow)", margin: "0 auto 16px", animation: "premium-gentle-pulse 1.5s infinite" }} />
          <p style={{ color: "var(--text-muted)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  // ERROR
  if (error || !articles.length) {
    return (
      <div className="premium-container" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 20 }}>
        <div style={{ textAlign: "center", padding: 24, background: "var(--bg-card)", borderRadius: 20, border: "1px solid var(--border)" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--accent)", marginBottom: 8 }}>Could not load content</h2>
          <p style={{ color: "var(--text-muted)" }}>{error || "Data unavailable"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-container">
      <div className="premium-ambient-bg" />

      <div className="premium-app-container">
        {/* Header */}
        <header className="premium-header">
          <div className="premium-header-content">
            <div className="premium-brand">
              <div className="premium-brand-icon">🌙</div>
              <span className="premium-brand-text">The Dailygraph</span>
            </div>

            <div className="premium-header-actions">
              {/* Dark Mode */}
              <button className="premium-icon-btn" onClick={() => setIsDark(!isDark)} title="Toggle theme">
                {isDark ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                )}
              </button>

              {/* Progress Ring */}
              <div className="premium-progress-ring-container" title={`${progressPercent}% learned`}>
                <svg className="premium-progress-ring-svg" width="44" height="44">
                  <circle className="premium-progress-ring-bg" cx="22" cy="22" r="18" />
                  <circle className="premium-progress-ring-fill" cx="22" cy="22" r="18" strokeDasharray={circumference} strokeDashoffset={offset} />
                </svg>
                <span className="premium-progress-text">{progressPercent}%</span>
              </div>

              {/* Zoom */}
              <button className="premium-icon-btn" onClick={handleZoom} title={`Text size: ${fontSize}px`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
              </button>

              {/* Calendar */}
              <button className="premium-icon-btn" onClick={() => setCalOpen(true)} title="Calendar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="premium-main-content">
          {articles.map((article, idx) => (
            <article key={idx} className="premium-article-card">
              <div className="premium-article-meta">
                <span className="premium-category-tag">Editorial</span>
                <span className="premium-read-time">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {Math.max(1, Math.ceil((article.text || "").split(" ").length / 200))} min read
                </span>
              </div>
              <h1 className="premium-article-title">{article.title}</h1>
              <div
                className="premium-article-body"
                style={{ fontSize: `${fontSize}px` }}
                dangerouslySetInnerHTML={{ __html: processArticleBody(article) }}
              />
            </article>
          ))}
        </main>
      </div>

      {/* =================== VOCAB POPUP =================== */}
      <div className={`premium-popup-overlay ${popupWord ? "active" : ""}`} onClick={closePopup} />
      <div className={`premium-definition-popup ${popupWord ? "active" : ""}`}>
        {popupWord && (
          <>
            <div className="premium-popup-header">
              <div className="premium-popup-word-section">
                <h2 className="premium-popup-word">{popupWord.word}</h2>
                <button className={`premium-audio-btn ${isAudioPlaying ? "playing" : ""}`} onClick={() => playAudio(popupWord.word)}>
                  <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                  <div className="premium-sound-waves">
                    <div className="premium-wave-bar" />
                    <div className="premium-wave-bar" />
                    <div className="premium-wave-bar" />
                  </div>
                </button>
              </div>
              <button className="premium-close-btn" onClick={closePopup}>✕</button>
            </div>
            <div className="premium-popup-divider" />
            <div className="premium-translation-section">
              <div className="premium-translation-label">Hindi Translation</div>
              <div className="premium-translation-text">{popupWord.hindi}</div>
            </div>
            <div className="premium-popup-divider" />
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
              className={`premium-mark-learned-btn ${learnedWords.includes(popupWord.word.toLowerCase()) ? "learned" : ""}`}
              onClick={() => toggleLearned(popupWord.word)}
            >
              {learnedWords.includes(popupWord.word.toLowerCase()) ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Learned</span>
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  <span>Mark as Learned</span>
                </>
              )}
            </button>
          </>
        )}
      </div>

      {/* =================== TRANSLATION POPUP =================== */}
      <div className={`premium-popup-overlay ${translationData ? "active" : ""}`} onClick={closeTranslation} style={{ zIndex: 300 }} />
      <div className={`premium-definition-popup ${translationData ? "active" : ""}`} style={{ zIndex: 301, maxHeight: "70vh", overflowY: "auto" }}>
        {translationData && (
          <>
            <div className="premium-popup-header">
              <h2 className="premium-popup-word" style={{ fontSize: 20 }}>📖 Hindi Translation</h2>
              <button className="premium-close-btn" onClick={closeTranslation}>✕</button>
            </div>
            <div className="premium-popup-divider" />
            {translationData.map((item, i) => (
              <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
                <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 8 }}>{item.sentence}</p>
                <p style={{ color: "var(--accent)", fontWeight: 600, fontSize: 17, lineHeight: 1.6, fontFamily: "'Noto Sans Devanagari', sans-serif" }}>{item.explanation}</p>
              </div>
            ))}
          </>
        )}
      </div>

      {/* =================== CALENDAR MODAL =================== */}
      <div className={`premium-cal-modal ${calOpen ? "active" : ""}`}>
        <div className="premium-cal-backdrop" onClick={() => setCalOpen(false)} />
        <div className="premium-cal-content">
          <div className="premium-cal-header">
            <h3 className="premium-cal-title">{monthNames[calMonth]} {calYear}</h3>
            <div className="premium-cal-nav">
              <button onClick={prevMonth}>◀</button>
              <button onClick={nextMonth}>▶</button>
              <button className="premium-close-btn" onClick={() => setCalOpen(false)} style={{ marginLeft: 8 }}>✕</button>
            </div>
          </div>
          <div className="premium-cal-grid">
            {dayLabels.map((d, i) => (
              <div key={`label-${i}`} className="premium-cal-day-label">{d}</div>
            ))}
            {/* Empty cells for offset */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {/* Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isActive = day === selectedDay && calMonth === selectedMonth && calYear === selectedYear;
              const isToday = day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
              return (
                <button
                  key={`day-${day}`}
                  className={`premium-cal-day ${isActive ? "active" : ""} ${isToday ? "today" : ""}`}
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
