const testList = [
  'Taj Mahal', 'Agra Fort', "Itmad-ud-Daulah's Tomb", 'Mehtab Bagh', 'Fatehpur Sikri',
  'Meenakshi Temple', 'Thirumalai Nayakkar Mahal', 'Brihadisvara Temple, Thanjavur',
  'Virupaksha Temple, Hampi', 'Vittala Temple, Hampi', 'Mysore Palace', 'Charminar',
  'Victoria Memorial, Kolkata', 'Howrah Bridge', 'Konark Sun Temple', 'Harmandir Sahib'
];

async function test() {
  for (const t of testList) {
    const url = 'https://en.wikipedia.org/w/api.php?action=query&titles=' + encodeURIComponent(t) + '&prop=pageimages|description&pithumbsize=1200&format=json';
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'LukAroundTourism/2.0 (tourist-media@lukaround.com)' } });
      const d = await res.json();
      const page = Object.values(d.query.pages)[0];
      console.log(t, '=>', page?.thumbnail?.source ? 'FOUND: ' + page.thumbnail.source.substring(0, 90) : 'NOT FOUND');
    } catch (e) {
      console.log(t, '=> ERROR:', e.message);
    }
  }
}
test();
