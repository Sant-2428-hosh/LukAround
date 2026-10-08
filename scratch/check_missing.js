const fs = require('fs');
const list = JSON.parse(fs.readFileSync('./scratch/all_attractions_list.json', 'utf8'));
const file = fs.readFileSync('./scratch/build_curated_attraction_images.js', 'utf8');

const missing = [];
list.forEach(a => {
  if (!file.includes(`'${a.id}':`)) {
    missing.push({ id: a.id, name: a.name, city: a.city, state: a.state });
  }
});

console.log('Total in list:', list.length);
console.log('Missing count:', missing.length);
if (missing.length > 0) {
  console.log('Missing:', JSON.stringify(missing, null, 2));
}
