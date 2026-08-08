const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

const classPatternsToRemove = [
    /group-hover:scale-\d+\s*/g,
    /hover:scale-\d+\s*/g,
    /transition-transform\s*/g,
    /duration-\d+\s*/g,
    /hover:-translate-y-\d+\s*/g,
    /animate-float\s*/g,
    /animate-pulse-glow\s*/g,
    /animate-pulse\s*/g,
    /animate-in\s*/g,
    /fade-in\s*/g,
    /zoom-in(?:-\d+)?\s*/g,
    /slide-in-from-[a-z]+-\d+\s*/g,
    /animate-spin\s*/g // Optional: remove spinner animation if they want zero animations
];

walkDir(srcDir, (filePath) => {
    if (filePath.endsWith('.jsx') || filePath.endsWith('.css')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        
        classPatternsToRemove.forEach(pattern => {
            content = content.replace(pattern, '');
        });

        // specific fixes for empty classNames or trailing spaces
        content = content.replace(/className="\s+"/g, 'className=""');
        content = content.replace(/className=''/g, 'className=""');
        
        // Remove keyframes from index.css
        if (filePath.endsWith('index.css')) {
            content = content.replace(/@keyframes float \{[\s\S]*?\}\n/g, '');
            content = content.replace(/@keyframes pulse-glow \{[\s\S]*?\}\n/g, '');
            content = content.replace(/@keyframes shimmer \{[\s\S]*?\}\n/g, '');
            content = content.replace(/\.animate-float \{[\s\S]*?\}\n/g, '');
            content = content.replace(/\.animate-pulse-glow \{[\s\S]*?\}\n/g, '');
            // Also remove hover:shadow-2xl if they don't want hover effects
            content = content.replace(/hover:shadow-2xl/g, '');
            content = content.replace(/transition-all/g, '');
        }

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated: ${filePath}`);
        }
    }
});
console.log("Animation removal complete.");
