const titles = [
  // Yercaud
  'Yercaud', 'Kiliyur Falls', 'Pagoda Point, Yercaud', 'Shevaroy Hills',
  // Delhi
  'Qutb Minar', 'Red Fort', "Humayun's Tomb", 'India Gate', 'Lotus Temple',
  // Bangalore
  'Lal Bagh', 'Bangalore Palace', 'Cubbon Park', "Tipu Sultan's Summer Palace",
  // Chennai
  'Kapaleeshwarar Temple', 'Marina Beach', 'San Thome Basilica', 'Fort St. George, India',
  // Kochi
  'Chinese fishing nets', 'Mattancherry Palace', 'Paradesi Synagogue', 'Fort Kochi'
];

async function run() {
  for (const t of titles) {
    await new Promise(r => setTimeout(r, 250));
    try {
      const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(t)}&prop=pageimages&pithumbsize=960&format=json`;
      const res = await fetch(url, { headers: { 'User-Agent': 'LukAround/2.0 (contact@lukaround.com)' } });
      const data = await res.json();
      const page = Object.values(data?.query?.pages || {})[0];
      const thumb = page?.thumbnail?.source;
      console.log(`${t} => ${thumb || 'NONE'}`);
    } catch (err) {
      console.log(`${t} => ERROR: ${err.message}`);
    }
  }
}

run();
