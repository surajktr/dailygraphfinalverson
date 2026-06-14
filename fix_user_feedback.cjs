const fs = require('fs');
const path = require('path');

const tsxPath = path.join(__dirname, 'src', 'components', 'EditorialViewer.tsx');
let tsxContent = fs.readFileSync(tsxPath, 'utf8');

// 1. Replace the paragraph logic with sentence logic
const targetString = `      // Add book icon buttons after each paragraph
      html = html.replace(/<\\/p>/g, (match) => {
        return \` <button class="premium-book-icon" type="button"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></button></p>\`;
      });`;

const newSentenceLogic = `      // Add book icon buttons before each analyzed sentence
      if (article.sentenceAnalyses) {
        article.sentenceAnalyses.forEach(s => {
          if (s.sentence && s.sentence.length > 5) {
            const escapedSentence = s.sentence.replace(/[.*+?^\${}()|[\\]\\\\]/g, "\\\\$&");
            const regex = new RegExp("(" + escapedSentence + ")", "g");
            const encodedHint = s.explanation.replace(/'/g, "&#39;").replace(/"/g, "&quot;");
            
            html = html.replace(regex, \`<button class="premium-book-icon" data-translation="\${encodedHint}" type="button"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg></button> $1\`);
          }
        });
      }`;

tsxContent = tsxContent.split(targetString).join(newSentenceLogic);

// 2. Change the global click listener
const oldClickTarget = `      // Handle book icon click
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
      }`;

const newClickLogic = `      // Handle book icon click
      if (target.closest(".premium-book-icon")) {
        const btn = target.closest(".premium-book-icon") as HTMLElement;
        const translation = btn.getAttribute("data-translation");
        if (translation) {
          setTranslationData([
            { sentence: "Sentence Translation", explanation: translation }
          ]);
        }
      }`;

tsxContent = tsxContent.split(oldClickTarget).join(newClickLogic);

fs.writeFileSync(tsxPath, tsxContent);
console.log("Updated EditorialViewer");
