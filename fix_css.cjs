const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'premium.css');
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Max width
css = css.replace(/max-width: 480px;/g, 'max-width: 800px;');

// 2. Remove min-height 100vh from app-container
css = css.replace(/min-height: 100vh;/g, 'min-height: calc(100vh - 40px);');

// 3. Remove huge bottom padding from main-content
css = css.replace(/padding: 24px 20px 40px;/g, 'padding: 24px 20px 10px;');

fs.writeFileSync(cssPath, css);
console.log("Updated premium.css");
