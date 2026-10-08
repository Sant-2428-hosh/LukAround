const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'backend', 'src', 'data', 'indiaTourismData.json'), 'utf8'));

console.log('--- ALL 198 ATTRACTIONS IMAGE AUDIT ---');
const list = data.attractions.map((a, i) => {
  const url = a.image || '';
  const decoded = decodeURIComponent(url);
  const filename = decoded.split('/').pop().split('?')[0];
  return {
    index: i + 1,
    id: a.id,
    name: a.name,
    city: a.city,
    state: a.state,
    filename,
    url
  };
});

list.forEach(item => {
  console.log(`${item.index}. [${item.id}] ${item.name} (${item.city}, ${item.state}) => ${item.filename}`);
});
