const fs = require('fs');
const path = require('path');

const cssFile = path.join(__dirname, 'src', 'premium.css');
let content = fs.readFileSync(cssFile, 'utf8');

// Replace declarations and usages safely
// Be careful with --accent-bg, --accent-glow, we only want exact --accent
// Let's use regex to replace var(--name) and --name:
const replacements = ['card', 'muted', 'accent', 'border'];

for (const name of replacements) {
  // Replace usage: var(--name) or var(--name, ... )
  const usageRegex = new RegExp(`var\\(--${name}\\)`, 'g');
  content = content.replace(usageRegex, `var(--dg-${name})`);
  
  // Replace declaration: --name:
  const declRegex = new RegExp(`--${name}:`, 'g');
  content = content.replace(declRegex, `--dg-${name}:`);
}

// Special check for --accent-bg or --accent-glow since they might have been renamed?
// No, the regex only matches `--accent:` exact.
// But wait, `--accent-bg` wasn't matched because of the colon. 
// However, did we match var(--accent-bg)? No, because `var(--accent)` has a closing bracket. 
// What about `var(--border)`? Matches perfectly.

fs.writeFileSync(cssFile, content, 'utf8');
console.log('Replaced variables successfully');
