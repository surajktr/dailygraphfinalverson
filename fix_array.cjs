const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'EditorialViewer.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update state type
content = content.replace(
  'const [data, setData] = useState<GraphData | null>(null);',
  'const [data, setData] = useState<GraphData[] | null>(null);'
);

// 2. Update parsing validation
content = content.replace(
  'if (parsedData && parsedData.text && parsedData.vocabulary) {',
  'if (parsedData && parsedData.articles && parsedData.articles.length > 0) {'
);
content = content.replace(
  'setData(parsedData);',
  'setData(parsedData.articles);'
);

// 3. Update renderProcessedBody
content = content.replace(
  'const renderProcessedBody = () => {',
  'const renderProcessedBody = (article: GraphData) => {'
);
content = content.replace(
  'if (!data) return null;',
  'if (!article) return null;'
);
content = content.replace(
  'const sortedVocab = [...data.vocabulary].sort((a, b) => b.word.length - a.word.length);',
  'const sortedVocab = [...article.vocabulary].sort((a, b) => b.word.length - a.word.length);'
);
content = content.replace(
  'let processedHtml = data.text;',
  'let processedHtml = article.text;'
);

// 4. Update click listener
content = content.replace(
  /const handleWordClick = \(e: MouseEvent\) => {[\s\S]*?if \(wordId\) {[\s\S]*?const vocabEntry = data\.vocabulary\.find\(v => v\.word\.toLowerCase\(\) === wordId\);/m,
  `const handleWordClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('premium-vocab-word')) {
        const wordId = target.getAttribute('data-vocab-id');
        if (wordId) {
          // Find the word across all articles
          let vocabEntry = null;
          for (const article of data) {
            vocabEntry = article.vocabulary.find(v => v.word.toLowerCase() === wordId);
            if (vocabEntry) break;
          }
`
);

// 5. Update progress ring calculation
content = content.replace(
  'const totalWords = data?.vocabulary.length || 0;',
  'const totalWords = data ? data.reduce((acc, curr) => acc + curr.vocabulary.length, 0) : 0;'
);
content = content.replace(
  'const learnedCount = data ? data.vocabulary.filter(v => learnedWords.includes(v.word.toLowerCase())).length : 0;',
  'const learnedCount = data ? data.reduce((acc, curr) => acc + curr.vocabulary.filter(v => learnedWords.includes(v.word.toLowerCase())).length, 0) : 0;'
);

// 6. Update JSX rendering
const jsxOld = `<main className="premium-main-content">
          <article className="premium-article-card" style={{ transform: \`scale(\${zoom / 100})\`, transformOrigin: 'top center' }}>
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
        </main>`;

const jsxNew = `<main className="premium-main-content">
          {data.map((article, idx) => (
            <article key={idx} className="premium-article-card" style={{ transform: \`scale(\${zoom / 100})\`, transformOrigin: 'top center', marginBottom: '24px' }}>
              <div className="premium-article-meta">
                <span className="premium-category-tag">Editorial</span>
                <span className="premium-read-time">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {Math.max(1, Math.ceil(article.text.split(' ').length / 200))} min read
                </span>
              </div>

              <h1 className="premium-article-title">{article.title}</h1>

              <div 
                className="premium-article-body" 
                dangerouslySetInnerHTML={{ __html: renderProcessedBody(article) || '' }} 
              />
            </article>
          ))}
        </main>`;

content = content.replace(jsxOld, jsxNew);

fs.writeFileSync(filePath, content);
console.log("Updated EditorialViewer.tsx successfully!");
