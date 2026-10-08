const fs = require('fs');
const path = require('path');

const failed = JSON.parse(fs.readFileSync(path.join(__dirname, 'wiki_failed.json'), 'utf8'));

// Corrected article titles or Wikimedia Commons search terms
const FIXES = {
  'itmad-ud-daulah': 'Itmad-ud-Daulah',
  'bara-imambara': 'Bara Imambara',
  'hanuman-garhi': 'Hanuman Garhi',
  'ramnagar-fort': 'Ramnagar Fort',
  'saryu-river-ghats': 'Saryu',
  'ram-mandir': 'Ram Mandir',
  'chota-imambara': 'Chhota Imambara',
  'iskcon-vrindavan': 'Krishna Balaram Mandir',
  'banke-bihari-temple': 'Bankey Bihari Temple',
  'fort-st-george': 'Fort St. George, Chennai',
  'khusro-bagh': 'Khusro Bagh',
  'san-thome-basilica': 'San Thome Basilica',
  'arjunas-penance': 'Descent of the Ganges (Mahabalipuram)',
  'botanical-garden-ooty': 'Government Botanical Gardens (Ooty)',
  'coakers-walk': "Coaker's Walk",
  'rose-garden-ooty': 'Government Rose Garden, Ooty',
  'avalanche-lake': 'Avalanche Lake, Ooty',
  'alagar-koyil': 'Alagar Koyil',
  'ariyaman-beach': 'Ariyaman Beach',
  'apj-abdul-kalam-memorial': 'A. P. J. Abdul Kalam',
  'bryant-park': 'Kodaikanal',
  'pillar-rocks': 'Pillar Rocks',
  'bangalore-palace': 'Bangalore Palace',
  'iskcon-bangalore': 'ISKCON Bangalore',
  'om-beach': 'Gokarna',
  'stone-chariot': 'Vittala Temple, Hampi',
  'kudle-beach': 'Gokarna',
  'lotus-mahal': 'Lotus Mahal',
  'mandalpatti': 'Madikeri',
  'elephant-stables': 'Elephant Stables',
  'ins-kurusura-submarine': 'INS Kurusura (S20)',
  'half-moon-beach': 'Gokarna',
  'rk-beach-vizag': 'Ramakrishna Beach',
  'simhachalam-temple': 'Varaha Lakshmi Narasimha temple, Simhachalam',
  'sri-padmavathi-temple': 'Padmavathi Temple, Tiruchanur',
  'talakona-waterfalls': 'Talakona',
  'amber-fort': 'Amber Fort',
  'jag-mandir': 'Jag Mandir',
  'sam-sand-dunes': 'Sam, Jaisalmer',
  'patwon-ki-haveli': 'Patwon Ji Ki Haveli',
  'juhu-beach': 'Juhu Beach',
  'csmt-station': 'Chhatrapati Shivaji Terminus',
  'colaba-causeway': 'Colaba Causeway',
  'indian-museum-kolkata': 'Indian Museum (Kolkata)',
  'ellora-caves': 'Kailash temple, Ellora',
  'somnath-temple': 'Somnath temple',
  'nalanda-mahavihara': 'Nalanda Mahavihara',
  'wagah-border': 'Wagah border ceremony'
};

async function testFixes() {
  const resolved = {};
  const stillFailed = [];

  for (const item of failed) {
    const fixedTitle = FIXES[item.id] || item.title;
    // Try Wikipedia direct search or title
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(fixedTitle)}&utf8=&format=json&srlimit=1`;
    try {
      const sRes = await fetch(searchUrl, { headers: { 'User-Agent': 'LukAroundTourism/2.0 (tourist-media@lukaround.com)' } });
      const sData = await sRes.json();
      const bestTitle = sData?.query?.search?.[0]?.title || fixedTitle;

      const imgUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(bestTitle)}&prop=pageimages&pithumbsize=1200&format=json`;
      const iRes = await fetch(imgUrl, { headers: { 'User-Agent': 'LukAroundTourism/2.0 (tourist-media@lukaround.com)' } });
      const iData = await iRes.json();
      const page = Object.values(iData?.query?.pages || {})[0];
      const thumb = page?.thumbnail?.source;

      if (thumb) {
        resolved[item.id] = { id: item.id, title: bestTitle, thumbnail: thumb };
        console.log(`[RESOLVED] ${item.id} -> ${bestTitle}`);
      } else {
        stillFailed.push({ id: item.id, searched: bestTitle });
        console.log(`[STILL FAILED] ${item.id} -> ${bestTitle}`);
      }
    } catch (e) {
      stillFailed.push({ id: item.id, error: e.message });
    }
  }

  console.log(`\nNewly resolved: ${Object.keys(resolved).length}`);
  console.log(`Still failed: ${stillFailed.length}`);
  fs.writeFileSync(path.join(__dirname, 'wiki_resolved_part2.json'), JSON.stringify(resolved, null, 2));
}

testFixes();
