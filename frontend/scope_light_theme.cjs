const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'index.css');
let css = fs.readFileSync(cssPath, 'utf-8');

// The marker for light theme overrides
const marker = "/* ========================================================\n   GLOBAL LIGHT THEME EXPLICIT COLOR OVERRIDES\n   ======================================================== */";
const parts = css.split(marker);

if (parts.length > 1) {
  let lightThemeCSS = parts[1];
  
  // Replace all standalone selectors to be prefixed with [data-theme="light"]
  // e.g. .bg-slate-950, #root, main { ... } -> [data-theme="light"] .bg-slate-950, [data-theme="light"] #root, [data-theme="light"] main { ... }
  
  let newLightThemeCSS = lightThemeCSS.replace(/([^{}]+)\{/g, (match, selectors) => {
    // Skip if it contains @keyframes or is an empty/comment block
    if (selectors.includes('@') || selectors.trim() === '' || selectors.trim().startsWith('/*') && selectors.trim().endsWith('*/')) {
      return match;
    }
    
    // Some selectors might be preceded by comments
    let splitSelectors = selectors.split(',');
    let newSelectors = splitSelectors.map(sel => {
        let trimmed = sel.trim();
        // keep preceding comments if any
        let commentMatch = trimmed.match(/^(\/\*[\s\S]*?\*\/)\s*(.*)$/);
        let prefix = '';
        let actualSelector = trimmed;
        if (commentMatch) {
            prefix = commentMatch[1] + ' ';
            actualSelector = commentMatch[2].trim();
        }

        if (actualSelector === '' || actualSelector.startsWith('/*')) return sel;

        // Add scope
        if (actualSelector === 'html' || actualSelector === ':root') {
            return prefix + '[data-theme="light"]';
        }
        return prefix + '[data-theme="light"] ' + actualSelector;
    });

    return newSelectors.join(', ') + ' {';
  });

  fs.writeFileSync(cssPath, parts[0] + marker + "\n" + newLightThemeCSS);
  console.log("Successfully scoped light theme overrides to [data-theme=\"light\"].");
} else {
  console.log("Marker not found in index.css.");
}
