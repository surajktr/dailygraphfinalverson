const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'EditorialViewer.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix GraphData interface
content = content.replace(
  'vocabulary: VocabularyWord[];\n}',
  'vocabulary: VocabularyWord[];\n  sentenceAnalyses?: { sentence: string; explanation: string }[];\n}'
);

// 2. Add translation state
content = content.replace(
  'const popupRef = useRef<HTMLDivElement>(null);',
  'const popupRef = useRef<HTMLDivElement>(null);\n  const [translationParagraph, setTranslationParagraph] = useState<{ sentence: string; explanation: string }[] | null>(null);\n  const translationRef = useRef<HTMLDivElement>(null);'
);

// 3. Fix the vocabulary regex highlight issue
content = content.replace(
  /const regex = new RegExp\(`\\\\\\\\b\(\\\$\{escapedWord\}\)\\\\\\\\b`, 'gi'\);/g,
  "const regex = new RegExp('\\\\b' + escapedWord + '\\\\b', 'gi');"
);
// Also just in case the previous replace failed because of exact string:
content = content.replace(
  "const regex = new RegExp(`\\\\b(${escapedWord})\\\\b`, 'gi');",
  "const regex = new RegExp('\\\\b' + escapedWord + '\\\\b', 'gi');"
);

// 4. Update the book icon logic to wrap with a button and add data attributes
content = content.replace(
  /processedHtml = paragraphs\.map\(p => \{\s+if \(p\.trim\(\) && p\.includes\('<p>'\)\) \{\s+return p \+ ` <svg class="premium-book-icon"[\s\S]*?<\/svg><\/p>`;\s+\}\s+return p;\s+\}\)\.join\(''\);/,
  `processedHtml = paragraphs.map((p, idx) => {
      if (p.trim() && p.includes('<p>')) {
        // Strip tags for the paragraph text so we can match it
        const cleanText = p.replace(/<[^>]+>/g, '').trim();
        // Add a button wrapping the icon and attach a data-paragraph attribute containing the text
        const encodedText = cleanText.replace(/'/g, "&#39;").replace(/"/g, "&quot;");
        return p + \` <button class="premium-book-icon" data-paragraph-text="\${encodedText}"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></button></p>\`;
      }
      return p;
    }).join('');`
);

// 5. Update global click listener to handle book icon clicks
const oldClickListener = `      if (target.classList.contains('premium-vocab-word')) {
        const wordId = target.getAttribute('data-vocab-id');
        if (wordId) {
          // Find the word across all articles
          let vocabEntry = null;
          for (const article of data) {
            vocabEntry = article.vocabulary.find(v => v.word.toLowerCase() === wordId);
            if (vocabEntry) break;
          }
          if (vocabEntry) {
            setPopupWord(vocabEntry);
          }
        }
      }`;
      
const newClickListener = `      if (target.classList.contains('premium-vocab-word')) {
        const wordId = target.getAttribute('data-vocab-id');
        if (wordId) {
          let vocabEntry = null;
          for (const article of data) {
            vocabEntry = article.vocabulary.find(v => v.word.toLowerCase() === wordId);
            if (vocabEntry) break;
          }
          if (vocabEntry) {
            setPopupWord(vocabEntry);
          }
        }
      } else {
        const bookBtn = target.closest('.premium-book-icon');
        if (bookBtn) {
          const paraText = bookBtn.getAttribute('data-paragraph-text');
          if (paraText) {
             let sentences: { sentence: string; explanation: string }[] = [];
             for (const article of data) {
               if (article.sentenceAnalyses) {
                 // Very simple matching: if the paragraph contains the sentence
                 const matched = article.sentenceAnalyses.filter(s => 
                   paraText.includes(s.sentence.substring(0, 20)) || 
                   s.sentence.includes(paraText.substring(0, 20))
                 );
                 if (matched.length > 0) {
                   sentences = matched;
                   break;
                 }
               }
             }
             if (sentences.length > 0) {
                setTranslationParagraph(sentences);
             } else {
                setTranslationParagraph([{ sentence: paraText, explanation: "Translation not available for this paragraph." }]);
             }
          }
        }
      }`;
content = content.replace(oldClickListener, newClickListener);

// 6. Close translation popup function
content = content.replace(
  'const closePopup = () => setPopupWord(null);',
  'const closePopup = () => { setPopupWord(null); setTranslationParagraph(null); };'
);

// 7. Update Logo to just "Dailygraph"
content = content.replace(
  '<span className="premium-brand-text">The Dailygraph</span>',
  '<span className="premium-brand-text">Dailygraph</span>'
);

// 8. Update text Zoom (remove style scale, replace with fontSize on article-body)
content = content.replace(
  /className="premium-article-card" style=\{\{ transform: `scale\(\$\{zoom \/ 100\}\)`, transformOrigin: 'top center', marginBottom: '24px' \}\}/g,
  'className="premium-article-card" style={{ marginBottom: "24px" }}'
);
content = content.replace(
  /className="premium-article-body"\s+dangerouslySetInnerHTML=\{\{ __html: renderProcessedBody\(article\) \|\| '' \}\}/g,
  'className="premium-article-body"\n                style={{ fontSize: `${zoom}%` }}\n                dangerouslySetInnerHTML={{ __html: renderProcessedBody(article) || "" }}'
);

// 9. Update Calendar Icon
content = content.replace(
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' // User wanted EXACT same SVG, but my current one IS the same! Let me check what the user provided. They just said "caludner sohuld be like givne code should be ok". Maybe they want the popover to work? I will leave the SVG as is because it's literally the same path.
);

// 10. Remove checkmark SVG from "Mark as Learned" button
// The learned state SVG:
content = content.replace(
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  ''
);
// The unlearned state SVG:
content = content.replace(
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  ''
);

// 11. Add the translation popup markup below the vocab popup
const translationMarkup = `        {/* Translation Popup */}
        <div 
          className={\`premium-popup-overlay \${translationParagraph ? 'active' : ''}\`} 
          onClick={() => setTranslationParagraph(null)}
          style={{ zIndex: 300 }}
        ></div>
        <div className={\`premium-definition-popup \${translationParagraph ? 'active' : ''}\`} style={{ zIndex: 301, maxHeight: '80vh', overflowY: 'auto' }}>
          {translationParagraph && (
            <>
              <div className="premium-popup-header" style={{ position: 'sticky', top: 0, background: 'var(--bg-card)', paddingBottom: '16px', borderBottom: '1px solid var(--border)', zIndex: 10 }}>
                <h2 className="premium-popup-word" style={{ fontSize: '20px' }}>Hindi Translation</h2>
                <button className="premium-close-btn" onClick={() => setTranslationParagraph(null)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <div style={{ paddingTop: '16px' }}>
                {translationParagraph.map((item, i) => (
                  <div key={i} className="mb-4 pb-4 border-b border-[var(--border)] last:border-0">
                    <p className="text-[var(--text-secondary)] text-sm mb-2">{item.sentence}</p>
                    <p className="text-[var(--accent)] font-medium text-lg leading-relaxed font-devanagari">{item.explanation}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>`;

content = content.replace(
  '</div>\n    </div>\n  );\n}',
  translationMarkup + '\n      </div>\n    </div>\n  );\n}'
);

fs.writeFileSync(filePath, content);
console.log("Updated EditorialViewer.tsx successfully");
