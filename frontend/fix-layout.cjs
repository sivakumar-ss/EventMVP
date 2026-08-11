const fs = require('fs');
const path = require('path');
const dir = 'b:/mvp/frontend/src/pages';
const replaceInDir = (d) => {
  fs.readdirSync(d).forEach(f => {
    const fp = path.join(d, f);
    if (fs.statSync(fp).isDirectory()) replaceInDir(fp);
    else if (f.endsWith('.jsx')) {
      let content = fs.readFileSync(fp, 'utf8');
      if (content.includes('flex-1 lg:ml-64 p-6 lg:p-10"')) {
        content = content.replace(/flex-1 lg:ml-64 p-6 lg:p-10"/g, 'flex-1 lg:ml-64 p-6 lg:p-10 min-w-0"');
        fs.writeFileSync(fp, content);
        console.log('Updated ' + fp);
      }
    }
  });
};
replaceInDir(dir);
