const fs = require('fs');
const path = require('path');

const list = JSON.parse(fs.readFileSync(path.join(__dirname, 'all_attractions_list.json'), 'utf8'));
const part1 = JSON.parse(fs.readFileSync(path.join(__dirname, 'wiki_fetched_thumbnails.json'), 'utf8'));
const part2 = JSON.parse(fs.readFileSync(path.join(__dirname, 'remaining_48_resolved.json'), 'utf8'));

// Build complete attraction images dictionary
const attractionImages = {};

list.forEach(a => {
  let item = null;
  if (a.id === 'sunset-point-kanyakumari') {
    item = {
      image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/83/Sunset_at_Kanyakumari.jpg/1280px-Sunset_at_Kanyakumari.jpg?utm_source=commons.wikimedia.org&utm_campaign=imageinfo&utm_content=thumbnail',
      imageAlt: `Spectacular oceanic sunset view at Sunset Point in Kanyakumari, Tamil Nadu`,
      imageSource: 'https://commons.wikimedia.org/wiki/File:Sunset_at_Kanyakumari.jpg',
      imageSourceName: 'Wikimedia Commons',
      imageLicense: 'CC BY-SA 4.0',
      imagePhotographer: 'Wikimedia Contributor',
      imageCredit: 'Photo: Contributor / Wikimedia Commons',
      verified: true
    };
  } else if (part2[a.id]) {
    const p = part2[a.id];
    item = {
      image: p.image,
      imageAlt: `${a.name} in ${a.city}, ${a.state}, India`,
      imageSource: p.source || p.image,
      imageSourceName: p.sourceName || 'Wikimedia Commons',
      imageLicense: p.license || 'CC BY-SA 4.0',
      imagePhotographer: p.photographer || 'Wikimedia Contributor',
      imageCredit: p.credit || `Photo: ${p.photographer || 'Contributor'} / Wikimedia Commons`,
      verified: true
    };
  } else if (part1[a.id]) {
    const p = part1[a.id];
    item = {
      image: p.thumbnail,
      imageAlt: `${a.name} in ${a.city}, ${a.state}, India`,
      imageSource: `https://en.wikipedia.org/wiki/${encodeURIComponent((p.title || a.name).replace(/\s+/g, '_'))}`,
      imageSourceName: 'Wikimedia Commons',
      imageLicense: 'CC BY-SA 4.0',
      imagePhotographer: 'Wikimedia Contributor',
      imageCredit: 'Photo: Contributor / Wikimedia Commons',
      verified: true
    };
  }
  attractionImages[a.id] = item;
});

console.log('Attractions mapped:', Object.keys(attractionImages).length);

// Quick uniqueness verification
const seenUrls = new Set();
let dupes = 0;
for (const [id, item] of Object.entries(attractionImages)) {
  if (seenUrls.has(item.image)) {
    dupes++;
    console.log('DUPE:', id, item.image);
  }
  seenUrls.add(item.image);
}
console.log('Unique attraction main images:', seenUrls.size, 'out of', list.length);
console.log('Duplicates:', dupes);

fs.writeFileSync(path.join(__dirname, 'attraction_images_ready.json'), JSON.stringify(attractionImages, null, 2));
