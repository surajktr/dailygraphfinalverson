import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ChevronDown, ChevronUp, CalendarIcon, ZoomIn, ZoomOut } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

// Types for the editorial JSON structure
interface VocabularyWord {
  word: string;
  hindi: string;
  definition: string;
}

interface SentenceAnalysis {
  sentence: string;
  explanation: string;
}

interface Article {
  id: string;
  title: string;
  text: string;
  fullTranslationHindi: string;
  imageUrl: string;
  vocabulary: VocabularyWord[];
  sentenceAnalyses: SentenceAnalysis[];
}

interface Quiz {
  id: number;
  question: string;
  options: string[];
  answer: string;
  solution: string;
}

interface Synonym {
  id: number;
  english: string;
  hindi: string;
  englishSynonyms: string[];
}

interface OneWordSub {
  id: number;
  word: string;
  hindi: string;
  meaning: string;
}

interface Idiom {
  id: number;
  phrase: string;
  hindi: string;
  meaning: string;
}

interface ClozeQuestion {
  id: string;
  options: string[];
  answer: string;
  solution: string;
}

interface ClozeTest {
  title: string;
  passage: string;
  questions: ClozeQuestion[];
}

interface ParaJumble {
  id: number;
  sentences: string[];
  options: string[];
  answer: string;
  solution: string;
}

interface EditorialData {
  articles: Article[];
  articleQuizzes: Record<string, Quiz[]>;
  synonyms: Synonym[];
  oneWordSubstitutions: OneWordSub[];
  idioms: Idiom[];
  clozeTests: ClozeTest[];
  paraJumbles: ParaJumble[];
}

interface EditorialViewerProps {
  date: string;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onDateChange: (date: Date) => void;
  onLoadSuccess?: () => void;
  isMobile?: boolean;
}

// Word Popover Component
const WordPopover = ({ word, hindi, definition, children }: { word: string; hindi: string; definition: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <span 
          className="text-red-600 dark:text-red-400 font-semibold cursor-pointer hover:underline"
          onClick={() => setOpen(true)}
        >
          {children}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <button 
          onClick={() => setOpen(false)}
          className="absolute top-1 right-2 text-xl text-slate-400 hover:text-slate-600"
        >
          ×
        </button>
        <h4 className="font-bold text-lg text-slate-900 dark:text-slate-100">{word}</h4>
        <p className="text-blue-600 dark:text-blue-400 font-medium mt-1">{hindi}</p>
        <p className="text-slate-600 dark:text-slate-300 text-sm mt-2">{definition}</p>
      </PopoverContent>
    </Popover>
  );
};

// Article Section Component
const ArticleSection = ({ article, quizzes }: { article: Article; quizzes?: Quiz[] }) => {
  const [showTranslation, setShowTranslation] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Highlight vocabulary words in text
  const highlightText = (text: string, vocabulary: VocabularyWord[]) => {
    let result = text;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    
    // Simple approach: wrap each word that matches vocabulary
    const words = text.split(/(\s+)/);
    
    return words.map((word, i) => {
      const cleanWord = word.replace(/[.,!?;:'"()]/g, '').toLowerCase();
      const vocabItem = vocabulary.find(v => v.word.toLowerCase() === cleanWord);
      
      if (vocabItem) {
        return (
          <WordPopover key={i} word={vocabItem.word} hindi={vocabItem.hindi} definition={vocabItem.definition}>
            {word}
          </WordPopover>
        );
      }
      return word;
    });
  };

  return (
    <div className="page bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-sm mb-6">
      {/* Article Header */}
      <div className="border-b-2 border-slate-200 dark:border-slate-700 pb-4 mb-4">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
          {article.title}
        </h2>
      </div>
      
      {/* Article Image */}
      {article.imageUrl && (
        <div className="mb-4">
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}
      
      {/* Article Text */}
      <div className="prose prose-slate dark:prose-invert max-w-none mb-4">
        <p className="text-slate-800 dark:text-slate-200 leading-relaxed text-justify">
          {highlightText(article.text, article.vocabulary)}
        </p>
      </div>
      
      {/* Hindi Translation Toggle */}
      <div className="mt-4">
        <Button 
          variant="outline" 
          onClick={() => setShowTranslation(!showTranslation)}
          className="w-full justify-between"
        >
          <span>📖 Hindi Translation</span>
          {showTranslation ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        {showTranslation && (
          <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-justify">
              {article.fullTranslationHindi}
            </p>
          </div>
        )}
      </div>
      
      {/* Sentence Analysis */}
      {article.sentenceAnalyses && article.sentenceAnalyses.length > 0 && (
        <div className="mt-4">
          <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100 mb-3">
            📝 Sentence Analysis
          </h3>
          <div className="space-y-3">
            {article.sentenceAnalyses.map((analysis, i) => (
              <div key={i} className="border-l-4 border-blue-500 pl-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-r-lg">
                <p className="text-slate-800 dark:text-slate-200 font-medium italic">
                  "{analysis.sentence}"
                </p>
                <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">
                  ➡️ {analysis.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Vocabulary Grid */}
      {article.vocabulary && article.vocabulary.length > 0 && (
        <div className="mt-6">
          <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100 mb-3">
            📚 Vocabulary
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {article.vocabulary.map((v, i) => (
              <div key={i} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                <span className="font-semibold text-red-600 dark:text-red-400">{v.word}</span>
                <span className="text-blue-600 dark:text-blue-400 ml-2">({v.hindi})</span>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{v.definition}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Quiz Button */}
      {quizzes && quizzes.length > 0 && (
        <div className="mt-6">
          <Button 
            onClick={() => setShowQuiz(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            📝 Take Quiz ({quizzes.length} questions)
          </Button>
        </div>
      )}
      
      {/* Quiz Modal */}
      {showQuiz && quizzes && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif font-bold text-xl">Quiz: {article.title}</h3>
              <button onClick={() => { setShowQuiz(false); setIsSubmitted(false); setSelectedAnswers({}); }} className="text-2xl">×</button>
            </div>
            
            <div className="space-y-6">
              {quizzes.map((q) => (
                <div key={q.id} className="border-b border-slate-200 dark:border-slate-700 pb-4">
                  <p className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    {q.id}. {q.question}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, oi) => {
                      const isSelected = selectedAnswers[q.id] === opt;
                      const isCorrect = opt === q.answer;
                      let className = "flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors ";
                      
                      if (isSubmitted) {
                        if (isCorrect) className += "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
                        else if (isSelected) className += "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
                        else className += "bg-slate-100 dark:bg-slate-700";
                      } else {
                        className += isSelected 
                          ? "bg-blue-100 dark:bg-blue-900" 
                          : "hover:bg-slate-100 dark:hover:bg-slate-700";
                      }
                      
                      return (
                        <label key={oi} className={className}>
                          <input
                            type="radio"
                            name={`quiz-${q.id}`}
                            value={opt}
                            checked={isSelected}
                            disabled={isSubmitted}
                            onChange={() => setSelectedAnswers(prev => ({ ...prev, [q.id]: opt }))}
                            className="form-radio h-4 w-4 text-blue-600"
                          />
                          <span>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                  {isSubmitted && (
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      💡 {q.solution}
                    </p>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex gap-2">
              {!isSubmitted ? (
                <Button onClick={() => setIsSubmitted(true)} className="bg-green-600 hover:bg-green-700">
                  Submit
                </Button>
              ) : (
                <Button onClick={() => { setIsSubmitted(false); setSelectedAnswers({}); }} variant="outline">
                  Try Again
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Synonyms Section
const SynonymsSection = ({ synonyms }: { synonyms: Synonym[] }) => (
  <div className="page bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-sm mb-6">
    <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-slate-100 border-b-2 border-slate-200 dark:border-slate-700 pb-3 mb-4">
      🔤 Synonyms
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {synonyms.map((s) => (
        <div key={s.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
          <span className="font-bold text-slate-900 dark:text-slate-100">{s.english}</span>
          <span className="text-blue-600 dark:text-blue-400 ml-2 text-sm">({s.hindi})</span>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            ≈ {s.englishSynonyms.join(", ")}
          </p>
        </div>
      ))}
    </div>
  </div>
);

// One Word Substitutions Section
const OneWordSection = ({ items }: { items: OneWordSub[] }) => (
  <div className="page bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-sm mb-6">
    <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-slate-100 border-b-2 border-slate-200 dark:border-slate-700 pb-3 mb-4">
      🎯 One Word Substitutions
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map((item) => (
        <div key={item.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
          <span className="font-bold text-purple-600 dark:text-purple-400">{item.word}</span>
          <span className="text-blue-600 dark:text-blue-400 ml-2 text-sm">({item.hindi})</span>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{item.meaning}</p>
        </div>
      ))}
    </div>
  </div>
);

// Idioms Section
const IdiomsSection = ({ idioms }: { idioms: Idiom[] }) => (
  <div className="page bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-sm mb-6">
    <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-slate-100 border-b-2 border-slate-200 dark:border-slate-700 pb-3 mb-4">
      💬 Idioms & Phrases
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {idioms.map((idiom) => (
        <div key={idiom.id} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
          <span className="font-bold text-amber-600 dark:text-amber-400 uppercase text-sm">{idiom.phrase}</span>
          <span className="text-blue-600 dark:text-blue-400 ml-2 text-xs">({idiom.hindi})</span>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{idiom.meaning}</p>
        </div>
      ))}
    </div>
  </div>
);

// Cloze Test Section
const ClozeTestSection = ({ clozeTests }: { clozeTests: ClozeTest[] }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  if (!clozeTests || clozeTests.length === 0) return null;
  
  const test = clozeTests[0]; // Show first cloze test
  
  return (
    <div className="page bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-sm mb-6 cloze-test-card">
      <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-slate-100 border-b-2 border-slate-200 dark:border-slate-700 pb-3 mb-4">
        📝 {test.title}
      </h2>
      
      {/* Passage */}
      <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg mb-4">
        <p className="text-slate-800 dark:text-slate-200 leading-relaxed text-justify">
          {test.passage}
        </p>
      </div>
      
      {/* Questions Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="outline" 
          size="sm"
          disabled={currentQuestion === 0}
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
        >
          Previous
        </Button>
        <span className="text-sm text-slate-600 dark:text-slate-400">
          Question {currentQuestion + 1} of {test.questions.length}
        </span>
        <Button 
          variant="outline"
          size="sm"
          disabled={currentQuestion === test.questions.length - 1}
          onClick={() => setCurrentQuestion(Math.min(test.questions.length - 1, currentQuestion + 1))}
        >
          Next
        </Button>
      </div>
      
      {/* Current Question */}
      {test.questions.map((q, i) => (
        <div key={q.id} className={`quiz-question ${i !== currentQuestion ? 'hidden' : ''}`}>
          <p className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
            Blank ({q.id}):
          </p>
          <div className="grid grid-cols-2 gap-2">
            {q.options.map((opt, oi) => {
              const isSelected = selectedAnswers[q.id] === opt;
              const answerNum = q.answer.match(/^\d+/)?.[0];
              const isCorrect = answerNum === String(oi + 1);
              let className = "flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors ";
              
              if (isSubmitted) {
                if (isCorrect) className += "bg-green-100 dark:bg-green-900";
                else if (isSelected && !isCorrect) className += "bg-red-100 dark:bg-red-900";
                else className += "bg-slate-100 dark:bg-slate-700";
              } else {
                className += isSelected ? "bg-blue-100 dark:bg-blue-900" : "hover:bg-slate-200 dark:hover:bg-slate-700";
              }
              
              return (
                <label key={oi} className={className}>
                  <input
                    type="radio"
                    name={`cloze-${q.id}`}
                    value={opt}
                    checked={isSelected}
                    disabled={isSubmitted}
                    onChange={() => setSelectedAnswers(prev => ({ ...prev, [q.id]: opt }))}
                    className="form-radio"
                  />
                  <span className="text-slate-800 dark:text-slate-200">{opt}</span>
                </label>
              );
            })}
          </div>
          {isSubmitted && (
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-3 rounded">
              💡 {q.solution}
            </p>
          )}
        </div>
      ))}
      
      {/* Submit / Reset */}
      <div className="mt-4 flex gap-2">
        {!isSubmitted ? (
          <Button onClick={() => setIsSubmitted(true)} className="bg-green-600 hover:bg-green-700">
            Submit
          </Button>
        ) : (
          <Button onClick={() => { setIsSubmitted(false); setSelectedAnswers({}); setCurrentQuestion(0); }} variant="outline">
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

// Para Jumble Section
const ParaJumbleSection = ({ paraJumbles }: { paraJumbles: ParaJumble[] }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  if (!paraJumbles || paraJumbles.length === 0) return null;
  
  return (
    <div className="page bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-sm mb-6 parajumble-card">
      <h2 className="font-serif text-xl font-bold text-slate-900 dark:text-slate-100 border-b-2 border-slate-200 dark:border-slate-700 pb-3 mb-4">
        🔀 Para Jumbles
      </h2>
      
      {/* Questions Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="outline" 
          size="sm"
          disabled={currentQuestion === 0}
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
        >
          Previous
        </Button>
        <span className="text-sm text-slate-600 dark:text-slate-400">
          Question {currentQuestion + 1} of {paraJumbles.length}
        </span>
        <Button 
          variant="outline"
          size="sm"
          disabled={currentQuestion === paraJumbles.length - 1}
          onClick={() => setCurrentQuestion(Math.min(paraJumbles.length - 1, currentQuestion + 1))}
        >
          Next
        </Button>
      </div>
      
      {paraJumbles.map((pj, i) => (
        <div key={pj.id} className={`quiz-question ${i !== currentQuestion ? 'hidden' : ''}`}>
          {/* Sentences */}
          <div className="space-y-2 mb-4">
            {pj.sentences.map((s, si) => (
              <div key={si} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border-l-4 border-blue-500">
                <p className="text-slate-800 dark:text-slate-200">{s}</p>
              </div>
            ))}
          </div>
          
          {/* Options */}
          <p className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
            Choose the correct order:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {pj.options.map((opt, oi) => {
              const isSelected = selectedAnswers[pj.id] === opt;
              const correctMatch = pj.answer.match(/\(([a-z])\)/i);
              const correctLetter = correctMatch?.[1]?.toLowerCase();
              const optionLetter = String.fromCharCode(97 + oi);
              const isCorrect = optionLetter === correctLetter;
              
              let className = "flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors ";
              
              if (isSubmitted) {
                if (isCorrect) className += "bg-green-100 dark:bg-green-900";
                else if (isSelected && !isCorrect) className += "bg-red-100 dark:bg-red-900";
                else className += "bg-slate-100 dark:bg-slate-700";
              } else {
                className += isSelected ? "bg-blue-100 dark:bg-blue-900" : "hover:bg-slate-200 dark:hover:bg-slate-700";
              }
              
              return (
                <label key={oi} className={className}>
                  <input
                    type="radio"
                    name={`pj-${pj.id}`}
                    value={opt}
                    checked={isSelected}
                    disabled={isSubmitted}
                    onChange={() => setSelectedAnswers(prev => ({ ...prev, [pj.id]: opt }))}
                    className="form-radio"
                  />
                  <span className="text-slate-800 dark:text-slate-200">({String.fromCharCode(97 + oi)}) {opt}</span>
                </label>
              );
            })}
          </div>
          
          {isSubmitted && (
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 p-3 rounded">
              💡 {pj.solution}
            </p>
          )}
        </div>
      ))}
      
      {/* Submit / Reset */}
      <div className="mt-4 flex gap-2">
        {!isSubmitted ? (
          <Button onClick={() => setIsSubmitted(true)} className="bg-green-600 hover:bg-green-700">
            Submit
          </Button>
        ) : (
          <Button onClick={() => { setIsSubmitted(false); setSelectedAnswers({}); setCurrentQuestion(0); }} variant="outline">
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};

// Main Editorial Viewer Component
const EditorialViewer = ({
  date,
  zoom,
  onZoomChange,
  onDateChange,
  onLoadSuccess,
  isMobile = false
}: EditorialViewerProps) => {
  const [data, setData] = useState<EditorialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
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
          // Try to parse as JSON first
          try {
            const jsonData = JSON.parse(dbData.html_content);
            setData(jsonData);
            onLoadSuccess?.();
          } catch {
            // If not JSON, it's HTML - show error for now
            setError("Content is in HTML format. Please upload JSON for the new viewer.");
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
    
    loadContent();
  }, [date]);

  const currentDate = new Date(date);

  // Header Component
  const Header = () => (
    <header className={`bg-white dark:bg-slate-900 p-4 sm:p-5 border-b-2 border-slate-200 dark:border-slate-700 ${headerHidden ? 'hidden' : ''}`}>
      <div className="flex justify-between items-center">
        <div className="flex-1 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="h-8 w-8"
          >
            {isDarkMode ? "☀️" : "🌙"}
          </Button>
        </div>
        <div className="flex-1 text-center">
          <h1 className="text-2xl sm:text-4xl font-bold font-serif text-slate-900 dark:text-slate-100">
            The Dailygraph
          </h1>
        </div>
        <div className="flex-1 flex justify-end items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onZoomChange(Math.max(50, zoom - 10))}
              className="h-7 w-7 sm:h-9 sm:w-9"
            >
              <ZoomOut className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <span className="text-xs sm:text-sm font-medium min-w-[2.5rem] text-center">
              {zoom}%
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onZoomChange(Math.min(200, zoom + 10))}
              className="h-7 w-7 sm:h-9 sm:w-9"
            >
              <ZoomIn className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
          
          {/* Date Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 sm:h-9 px-2 sm:px-3">
                <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="text-xs sm:text-sm">{format(currentDate, "MMM d")}</span>
              </Button>
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
          
          {/* Telegram Link */}
          <a 
            href="https://t.me/thedailygraph" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 text-blue-600 hover:opacity-80"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.62 12c-.88-.25-.89-1.02.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.58c-.28 1.13-1.04 1.4-1.74.88L14.25 16l-4.12 3.9c-.78.72-1.4.34-1.63-.55z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );

  // Hide Header Toggle
  const HeaderToggle = () => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setHeaderHidden(!headerHidden)}
      className="fixed top-2 left-2 z-50 h-6 w-6 p-0 bg-background/80"
    >
      {headerHidden ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
    </Button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={isDarkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
          <Header />
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <p className="text-slate-600 dark:text-slate-400 mb-4">{error || "No content available"}</p>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Select Another Date
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
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
        </div>
      </div>
    );
  }

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
        <HeaderToggle />
        <Header />
        
        <main 
          className="max-w-4xl mx-auto p-4 transition-transform origin-top"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          {/* Articles */}
          {data.articles?.map((article) => (
            <ArticleSection 
              key={article.id} 
              article={article} 
              quizzes={data.articleQuizzes?.[article.id]}
            />
          ))}
          
          {/* Synonyms */}
          {data.synonyms && data.synonyms.length > 0 && (
            <SynonymsSection synonyms={data.synonyms} />
          )}
          
          {/* One Word Substitutions */}
          {data.oneWordSubstitutions && data.oneWordSubstitutions.length > 0 && (
            <OneWordSection items={data.oneWordSubstitutions} />
          )}
          
          {/* Idioms */}
          {data.idioms && data.idioms.length > 0 && (
            <IdiomsSection idioms={data.idioms} />
          )}
          
          {/* Cloze Tests */}
          {data.clozeTests && data.clozeTests.length > 0 && (
            <ClozeTestSection clozeTests={data.clozeTests} />
          )}
          
          {/* Para Jumbles */}
          {data.paraJumbles && data.paraJumbles.length > 0 && (
            <ParaJumbleSection paraJumbles={data.paraJumbles} />
          )}
        </main>
      </div>
    </div>
  );
};

export default EditorialViewer;
