const fs = require('fs');
const filePath = 'C:/Users/Suraj/OneDrive/Desktop/MyProjects/dailygraphfinalverson/src/components/EditorialViewer.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// 1. Remove the Article Image block
const articleImagePattern = /\{\/\* Article Image \*\/\}\s*\{article\.imageUrl && \([\s\S]*?<img[\s\S]*?\/>\s*<\/div>\s*\)\}/;
code = code.replace(articleImagePattern, '');

// 2. Remove Synonyms, One Word, Idioms, Cloze Tests, Para Jumbles from the main render block
const blocksToRemove = [
  /\{\/\* Synonyms \*\/\}\s*\{data\.synonyms[\s\S]*?\}\s*\)/,
  /\{\/\* One Word Substitutions \*\/\}\s*\{data\.oneWordSubstitutions[\s\S]*?\}\s*\)/,
  /\{\/\* Idioms \*\/\}\s*\{data\.idioms[\s\S]*?\}\s*\)/,
  /\{\/\* Cloze Tests \*\/\}\s*\{data\.clozeTests[\s\S]*?\}\s*\)/,
  /\{\/\* Para Jumbles \*\/\}\s*\{data\.paraJumbles[\s\S]*?\}\s*\)/
];

blocksToRemove.forEach(pattern => {
  code = code.replace(pattern, '');
});

fs.writeFileSync(filePath, code);
console.log('UI sections removed successfully.');
