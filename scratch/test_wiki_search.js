const list = [
  'Itmad-ud-Daulah Tomb Agra',
  'Brihadisvara Temple Thanjavur',
  'Vittala Temple Hampi',
  'Harmandir Sahib Golden Temple Amritsar',
  'Shore Temple Mahabalipuram',
  'Kedarnath Temple',
  'Pamban Bridge Rameswaram',
  'Vivekananda Rock Memorial Kanyakumari',
  'Sun Temple Konark',
  'Ellora Caves Kailash Temple',
  'Ajanta Caves'
];

async function testSearch() {
  for (const q of list) {
    const searchUrl = 'https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=' + encodeURIComponent(q) + '&utf8=&format=json&srlimit=1';
    try {
      const sRes = await fetch(searchUrl, { headers: { 'User-Agent': 'LukAroundTourism/2.0 (tourist-media@lukaround.com)' } });
      const sData = await sRes.json();
      const title = sData.query.search[0]?.title;
      if (!title) {
        console.log(q, '=> NO SEARCH RESULT');
        continue;
      }
      const imgUrl = 'https://en.wikipedia.org/w/api.php?action=query&titles=' + encodeURIComponent(title) + '&prop=pageimages|description&pithumbsize=1200&format=json';
      const iRes = await fetch(imgUrl, { headers: { 'User-Agent': 'LukAroundTourism/2.0 (tourist-media@lukaround.com)' } });
      const iData = await iRes.json();
      const page = Object.values(iData.query.pages)[0];
      console.log(q, '=> Title:', title, '=> Img:', page?.thumbnail?.source ? 'OK' : 'NO THUMB');
    } catch (e) {
      console.log(q, '=> ERROR:', e.message);
    }
  }
}
testSearch();
