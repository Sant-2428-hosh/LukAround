async function testWikiMeta(title) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages|imageinfo&iiprop=user|extmetadata&pithumbsize=1200&format=json`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'LukAroundTourism/2.0 (tourist-media@lukaround.com)' } });
    const data = await res.json();
    const page = Object.values(data?.query?.pages || {})[0];
    const thumb = page?.thumbnail?.source;
    const pageTitle = page?.title;
    console.log(title, '=> Page:', pageTitle);
    console.log('  Thumb:', thumb ? thumb.slice(0, 100) : 'none');
  } catch (err) {
    console.log(title, '=> ERR:', err.message);
  }
}

async function run() {
  await testWikiMeta('Taj Mahal');
  await testWikiMeta('Meenakshi Temple');
  await testWikiMeta('Brihadisvara Temple');
  await testWikiMeta('Golconda Fort');
}

run();
