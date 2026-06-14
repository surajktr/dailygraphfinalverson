const fs = require('fs');
const path = 'C:/Users/Suraj/OneDrive/Desktop/MyProjects/dailygraphfinalverson/src/components/EditorialViewer.tsx';

let code = fs.readFileSync(path, 'utf8');

// 1. Ensure SEO is imported
if (!code.includes('import SEO')) {
  code = code.replace('import { Helmet } from "react-helmet-async";', 'import SEO from "@/components/SEO";\nimport { Helmet } from "react-helmet-async";');
}

// 2. Add the FAQ Schema generator inside ArticleSection
const faqGeneratorCode = `
  // Generate FAQ Schema for Vocabulary
  const generateFaqSchema = () => {
    if (!article.vocabulary || article.vocabulary.length === 0) return null;
    
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": article.vocabulary.map(v => ({
        "@type": "Question",
        "name": \`What is the meaning of "\${v.word}" in Hindi?\`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": \`The Hindi meaning of "\${v.word}" is "\${v.hindi}". Definition: \${v.definition}\`
        }
      }))
    };
  };
`;

if (!code.includes('generateFaqSchema')) {
  code = code.replace(
    '  const [isSubmitted, setIsSubmitted] = useState(false);',
    '  const [isSubmitted, setIsSubmitted] = useState(false);\n' + faqGeneratorCode
  );
}

// 3. Replace the explicit Helmet block with SEO component
const helmetBlock = /<Helmet>[\s\S]*?<\/Helmet>/;

const seoBlock = `{/* Dynamic SEO for this specific article */}
      {article && (
        <SEO 
          title={\`\${article.title} - The Hindu Editorial Vocabulary\`}
          description={\`Read the daily editorial vocabulary and meaning for: \${article.title}. Enhance your reading comprehension and prepare for exams with Dailygraph.\`}
          keywords={\`Dailygraph, \${article.title}, vocabulary, editorial, english to hindi, reading comprehension\`}
          schema={generateFaqSchema() || undefined}
        />
      )}`;

code = code.replace(helmetBlock, seoBlock);

fs.writeFileSync(path, code);
console.log('SEO integrated successfully');
