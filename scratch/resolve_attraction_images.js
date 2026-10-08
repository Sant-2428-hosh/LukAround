const fs = require('fs');
const path = require('path');

const attractionsList = JSON.parse(fs.readFileSync(path.join(__dirname, 'all_attractions_list.json'), 'utf8'));

// Format queries as requested in prompt section 8:
// "[Place Name], [City], [State], India"
function makeQuery(a) {
  // Clean clean name
  let cleanName = a.name.replace(/\(.*?\)/g, '').replace(/&.*$/, '').trim();
  return `${cleanName}, ${a.city}, ${a.state}, India`;
}

async function fetchWikiImage(query, directTitle) {
  const searchTerm = directTitle || query;
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&utf8=&format=json&srlimit=1`;
  
  const sRes = await fetch(searchUrl, { headers: { 'User-Agent': 'LukAroundTourism/2.0 (tourist-media@lukaround.com)' } });
  if (!sRes.ok) return null;
  const sData = await sRes.json();
  const title = sData?.query?.search?.[0]?.title;
  if (!title) return null;

  const imgUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages|imageinfo&iiprop=user|extmetadata&pithumbsize=1200&format=json`;
  const iRes = await fetch(imgUrl, { headers: { 'User-Agent': 'LukAroundTourism/2.0 (tourist-media@lukaround.com)' } });
  if (!iRes.ok) return null;
  const iData = await iRes.json();
  const page = Object.values(iData?.query?.pages || {})[0];
  const thumb = page?.thumbnail?.source;
  if (!thumb) return null;

  return {
    matchedTitle: title,
    url: thumb,
    source: `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/\s+/g, '_'))}`,
    sourceName: 'Wikimedia Commons'
  };
}

async function run() {
  console.log(`Testing first 15 attractions...`);
  for (let i = 0; i < 15; i++) {
    const a = attractionsList[i];
    const q = makeQuery(a);
    try {
      const res = await fetchWikiImage(q);
      console.log(`[${i+1}] ${a.name} (${a.city}) =>`, res ? `MATCH: ${res.matchedTitle} -> ${res.url.slice(0, 70)}...` : 'NO MATCH');
    } catch (e) {
      console.log(`[${i+1}] ${a.name} => ERR: ${e.message}`);
    }
  }
}

run();
