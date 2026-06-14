const fs = require('fs');
const path = 'C:/Users/Suraj/OneDrive/Desktop/MyProjects/dailygraphfinalverson/src/components/GraphViewer.tsx';
let code = fs.readFileSync(path, 'utf8');

const targetContent = `            try {
              const parsed = typeof data.html_content === 'string' 
                ? JSON.parse(data.html_content) 
                : data.html_content;
              setJsonData(parsed);
              setIsJsonContent(true);
            } catch {
              // It's HTML content
              setHtmlContent(contentStr);
              setIsJsonContent(false);
            }`;

const replacementContent = `            let wasExtracted = false;
            try {
              const parsed = typeof data.html_content === 'string' 
                ? JSON.parse(data.html_content) 
                : data.html_content;
              setJsonData(parsed);
              setIsJsonContent(true);
              wasExtracted = true;
            } catch {
              // Extract embedded JSON from the HTML string if it exists
              if (typeof data.html_content === 'string' && data.html_content.includes('__INITIAL_DATA__')) {
                try {
                  const match = data.html_content.match(/window\\.__INITIAL_DATA__\\s*=\\s*(\\{.*\\});\\s*<\\/script>/s);
                  if (match && match[1]) {
                    const parsed = JSON.parse(match[1]);
                    setJsonData(parsed);
                    setIsJsonContent(true);
                    wasExtracted = true;
                  }
                } catch (e) {
                  console.error("Failed to parse embedded JSON", e);
                }
              }
              
              if (!wasExtracted) {
                // It's raw HTML content (fallback)
                setHtmlContent(contentStr);
                setIsJsonContent(false);
              }
            }`;

if (code.includes(targetContent)) {
  code = code.replace(targetContent, replacementContent);
  fs.writeFileSync(path, code);
  console.log('Successfully updated GraphViewer JSON extraction logic!');
} else {
  console.log('Could not find target content in GraphViewer.tsx. Check string matching.');
}
