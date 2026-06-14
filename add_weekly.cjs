const fs = require('fs');
const filePath = 'C:/Users/Suraj/OneDrive/Desktop/MyProjects/dailygraphfinalverson/src/components/EditorialViewer.tsx';
let code = fs.readFileSync(filePath, 'utf8');

const weeklyVocabCode = `
// Weekly Vocabulary Aggregator
const WeeklyVocabulary = ({ currentDate }: { currentDate: string }) => {
  const [vocabData, setVocabData] = useState<{date: string, words: VocabularyWord[]}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklyVocab = async () => {
      setLoading(true);
      try {
        const endDate = new Date(currentDate);
        const startDate = new Date(currentDate);
        startDate.setDate(endDate.getDate() - 6);
        
        const startStr = format(startDate, 'yyyy-MM-dd');
        const endStr = format(endDate, 'yyyy-MM-dd');
        
        const { data, error } = await supabase
          .from("daily_graphs")
          .select("upload_date, html_content")
          .gte("upload_date", startStr)
          .lte("upload_date", endStr)
          .order("upload_date", { ascending: false });
          
        if (error) throw error;
        
        const aggregated: {date: string, words: VocabularyWord[]}[] = [];
        
        data?.forEach(row => {
          try {
             // It could be string or object
             const parsed = typeof row.html_content === 'string' 
               ? JSON.parse(row.html_content) 
               : row.html_content;
             
             let dayWords: VocabularyWord[] = [];
             if (parsed && parsed.articles) {
               parsed.articles.forEach((a: any) => {
                 if (a.vocabulary) {
                   dayWords = [...dayWords, ...a.vocabulary];
                 }
               });
             }
             if (dayWords.length > 0) {
               aggregated.push({
                 date: row.upload_date,
                 words: dayWords
               });
             }
          } catch (e) {
            // ignore parse errors for old html data
          }
        });
        
        setVocabData(aggregated);
      } catch (err) {
        console.error("Failed to fetch weekly vocab", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWeeklyVocab();
  }, [currentDate]);

  if (loading) return <div className="p-4 flex justify-center"><Loader2 className="animate-spin text-blue-500 h-6 w-6" /></div>;
  if (vocabData.length === 0) return null;

  return (
    <div className="page bg-white dark:bg-slate-800 rounded-lg shadow-sm mb-6 overflow-hidden mt-8 border border-red-100 dark:border-red-900">
      <div className="bg-gradient-to-r from-red-600 to-red-400 text-white px-4 py-3">
        <h2 className="font-serif font-bold text-xl uppercase tracking-wide flex items-center gap-2">
          📚 Weekly Vocabulary Revision
        </h2>
        <p className="text-red-100 text-sm mt-1">Reviewing words from the last 6 days</p>
      </div>
      <div className="p-4 sm:p-6">
        {vocabData.map((day, idx) => (
          <div key={idx} className="mb-8 last:mb-0 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 border-b-2 border-red-200 dark:border-red-800 pb-2 mb-4 text-lg">
              {format(new Date(day.date), "EEEE, MMM d, yyyy")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              {day.words.map((v, i) => (
                <div key={i} className="py-2 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 rounded transition-colors">
                  <div className="flex items-start gap-2 flex-wrap">
                    <span className="font-bold text-red-600 dark:text-red-400 min-w-[20px]">{i + 1}.</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{v.word}</span>
                    <button 
                      onClick={() => speakWord(v.word)}
                      className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-blue-600 -mt-0.5"
                      title="Listen"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-red-600 dark:text-red-400 font-medium">({v.hindi}):</span>
                    <span className="text-slate-700 dark:text-slate-300">{v.definition}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Editorial Viewer Component
`;

code = code.replace('// Main Editorial Viewer Component', weeklyVocabCode);

// Now insert the component in the render
const renderTarget = `{data.paraJumbles && data.paraJumbles.length > 0 && (
            <ParaJumbleSection paraJumbles={data.paraJumbles} />
          )}`;

const insertion = `{data.paraJumbles && data.paraJumbles.length > 0 && (
            <ParaJumbleSection paraJumbles={data.paraJumbles} />
          )}
          
          {/* Weekly Vocabulary Revision */}
          <WeeklyVocabulary currentDate={date} />`;

code = code.replace(renderTarget, insertion);

fs.writeFileSync(filePath, code);
console.log('WeeklyVocabulary component added successfully!');
