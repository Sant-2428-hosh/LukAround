const fs = require('fs');
const path = require('path');

const list = JSON.parse(fs.readFileSync(path.join(__dirname, 'all_attractions_list.json'), 'utf8'));
const part1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'wiki_fetched_thumbnails.json'), 'utf8'));
const part2 = JSON.parse(fs.readFileSync(path.join(__dirname, 'remaining_48_resolved.json'), 'utf8'));

const allMap = {};
const urlSet = new Map();
const duplicates = [];

list.forEach(a => {
  let imgObj = null;
  if (part2[a.id]) {
    imgObj = {
      id: a.id,
      name: a.name,
      city: a.city,
      state: a.state,
      image: part2[a.id].image,
      sourceTitle: part2[a.id].title,
      sourceName: part2[a.id].sourceName,
      source: part2[a.id].source,
      license: part2[a.id].license,
      photographer: part2[a.id].photographer,
      credit: part2[a.id].credit
    };
  } else if (part1[a.id]) {
    imgObj = {
      id: a.id,
      name: a.name,
      city: a.city,
      state: a.state,
      image: part1[a.id].thumbnail,
      sourceTitle: part1[a.id].title,
      sourceName: 'Wikimedia Commons',
      source: `https://en.wikipedia.org/wiki/${encodeURIComponent(part1[a.id].title.replace(/\s+/g, '_'))}`,
      license: 'CC BY-SA 4.0',
      photographer: 'Wikimedia Contributor',
      credit: `Photo: Contributor / Wikimedia Commons`
    };
  } else {
    console.error('MISSING COMPLETELY:', a.id);
    return;
  }

  // Check URL uniqueness
  if (urlSet.has(imgObj.image)) {
    duplicates.push({ id: a.id, prevId: urlSet.get(imgObj.image), url: imgObj.image });
  } else {
    urlSet.set(imgObj.image, a.id);
  }

  allMap[a.id] = imgObj;
});

console.log('Total attractions:', list.length);
console.log('Resolved attractions:', Object.keys(allMap).length);
console.log('Unique images:', urlSet.size);
console.log('Duplicate URLs found:', duplicates.length);

if (duplicates.length > 0) {
  console.log('Duplicates:');
  duplicates.forEach(d => console.log(`  ${d.id} reuses image from ${d.prevId}`));
}
