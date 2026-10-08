const fs = require('fs');

function search(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(e => {
    const f = dir + '/' + e.name;
    if (e.isDirectory() && e.name !== 'node_modules' && e.name !== '.git' && e.name !== 'dist') {
      search(f);
    } else if (e.name.endsWith('.js') || e.name.endsWith('.jsx')) {
      const c = fs.readFileSync(f, 'utf8');
      if (c.includes('"destinations"') || c.includes("'destinations'")) {
        console.log(f);
      }
    }
  });
}

search('frontend/src');
