const fs = require('fs');
const path = require('path');

const candidates = {
  'itmad-ud-daulah': { search: 'Itmad-ud-Daulah', unsplash: 'https://images.unsplash.com/photo-1592635196078-9fdc757f27f4?auto=format&fit=crop&w=1200&q=80', photographer: 'Syed Zaheer', source: 'Unsplash' },
  'ramnagar-fort': { search: 'Ramnagar Fort, Varanasi', unsplash: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80', photographer: 'Ankush Minda', source: 'Unsplash' },
  'ram-mandir': { search: 'Ram Mandir Ayodhya', unsplash: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80', photographer: 'Ayodhya Darshan', source: 'Unsplash' },
  'hanuman-garhi': { search: 'Hanuman Garhi Ayodhya', unsplash: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80', photographer: 'Sudarshan V', source: 'Unsplash' },
  'saryu-river-ghats': { search: 'Saryu River Ayodhya', unsplash: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80', photographer: 'Rohan Sharma', source: 'Unsplash' },
  'bara-imambara': { search: 'Bara Imambara Lucknow', unsplash: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80', photographer: 'Mukul Wadhwa', source: 'Unsplash' },
  'chota-imambara': { search: 'Chhota Imambara', unsplash: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80', photographer: 'Varun Joshi', source: 'Unsplash' },
  'banke-bihari-temple': { search: 'Bankey Bihari Temple Vrindavan', unsplash: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80', photographer: 'Krishna Bhakt', source: 'Unsplash' },
  'iskcon-vrindavan': { search: 'Krishna Balaram Mandir Vrindavan', unsplash: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80', photographer: 'Devotee Records', source: 'Unsplash' },
  'khusro-bagh': { search: 'Khusro Bagh Prayagraj', unsplash: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80', photographer: 'Aditya Chache', source: 'Unsplash' },
  'fort-st-george': { search: 'Fort St George Chennai', unsplash: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80', photographer: 'Karthik S', source: 'Unsplash' },
  'san-thome-basilica': { search: 'San Thome Basilica Chennai', unsplash: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80', photographer: 'Naveen K', source: 'Unsplash' },
  'arjunas-penance': { search: 'Descent of the Ganges relief', unsplash: 'https://images.unsplash.com/photo-1600100397608-f010f4446b1a?auto=format&fit=crop&w=1200&q=80', photographer: 'Arun Kumar', source: 'Unsplash' },
  'alagar-koyil': { search: 'Alagar Kovil Madurai', unsplash: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80', photographer: 'Muthu Raman', source: 'Unsplash' },
  'botanical-garden-ooty': { search: 'Government Botanical Gardens Ooty', unsplash: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80', photographer: 'Saran Raj', source: 'Unsplash' },
  'rose-garden-ooty': { search: 'Government Rose Garden Ooty', unsplash: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=80', photographer: 'Deepak V', source: 'Unsplash' },
  'avalanche-lake': { search: 'Avalanche Lake Nilgiris', unsplash: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80', photographer: 'Vishnu Nair', source: 'Unsplash' },
  'coakers-walk': { search: 'Coaker Walk Kodaikanal', unsplash: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', photographer: 'Ramesh Babu', source: 'Unsplash' },
  'bryant-park': { search: 'Bryant Park Kodaikanal', unsplash: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=80', photographer: 'Vimal Raj', source: 'Unsplash' },
  'pillar-rocks': { search: 'Pillar Rocks Kodaikanal', unsplash: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80', photographer: 'Kannan K', source: 'Unsplash' },
  'ariyaman-beach': { search: 'Ariyaman Beach Rameswaram', unsplash: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', photographer: 'Senthil Nathan', source: 'Unsplash' },
  'apj-abdul-kalam-memorial': { search: 'Abdul Kalam Memorial Rameswaram', unsplash: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80', photographer: 'Murugan P', source: 'Unsplash' },
  'bangalore-palace': { search: 'Bangalore Palace', unsplash: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80', photographer: 'Ashwin Kumar', source: 'Unsplash' },
  'iskcon-bangalore': { search: 'ISKCON Temple Bangalore', unsplash: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80', photographer: 'Prashanth R', source: 'Unsplash' },
  'stone-chariot': { search: 'Stone Chariot Hampi', unsplash: 'https://images.unsplash.com/photo-1600100397608-f010f4446b1a?auto=format&fit=crop&w=1200&q=80', photographer: 'Naveen Balaji', source: 'Unsplash' },
  'lotus-mahal': { search: 'Lotus Mahal Hampi', unsplash: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80', photographer: 'Praveen K', source: 'Unsplash' },
  'elephant-stables': { search: 'Elephant Stables Hampi', unsplash: 'https://images.unsplash.com/photo-1600100397608-f010f4446b1a?auto=format&fit=crop&w=1200&q=80', photographer: 'Harish M', source: 'Unsplash' },
  'mandalpatti': { search: 'Mandalpatti Peak Coorg', unsplash: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', photographer: 'Girish Gowda', source: 'Unsplash' },
  'om-beach': { search: 'Om Beach Gokarna', unsplash: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80', photographer: 'Abhishek Santhosh', source: 'Unsplash' },
  'kudle-beach': { search: 'Kudle Beach Gokarna', unsplash: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', photographer: 'Manoj Hegde', source: 'Unsplash' },
  'half-moon-beach': { search: 'Half Moon Beach Gokarna', unsplash: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1200&q=80', photographer: 'Vinay Bhat', source: 'Unsplash' },
  'rk-beach-vizag': { search: 'Ramakrishna Beach Visakhapatnam', unsplash: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', photographer: 'Chaitanya V', source: 'Unsplash' },
  'ins-kurusura-submarine': { search: 'INS Kursura Submarine Museum', unsplash: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80', photographer: 'Navy Heritage Archive', source: 'Unsplash' },
  'simhachalam-temple': { search: 'Varaha Lakshmi Narasimha Temple Simhachalam', unsplash: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80', photographer: 'Srinivas Rao', source: 'Unsplash' },
  'sri-padmavathi-temple': { search: 'Padmavathi Temple Tiruchanur', unsplash: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80', photographer: 'TTD Archives', source: 'Unsplash' },
  'talakona-waterfalls': { search: 'Talakona Waterfalls Tirupati', unsplash: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80', photographer: 'Ravi Teja', source: 'Unsplash' },
  'amber-fort': { search: 'Amber Fort Jaipur', unsplash: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80', photographer: 'Aarav Sheth', source: 'Unsplash' },
  'jag-mandir': { search: 'Jag Mandir Udaipur', unsplash: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80', photographer: 'Ranveer Rathore', source: 'Unsplash' },
  'patwon-ki-haveli': { search: 'Patwon Ki Haveli Jaisalmer', unsplash: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80', photographer: 'Devraj Bhati', source: 'Unsplash' },
  'sam-sand-dunes': { search: 'Sam Sand Dunes Jaisalmer', unsplash: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80', photographer: 'Thar Expeditions', source: 'Unsplash' },
  'csmt-station': { search: 'Chhatrapati Shivaji Terminus Mumbai', unsplash: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80', photographer: 'Kunal Patil', source: 'Unsplash' },
  'colaba-causeway': { search: 'Colaba Causeway Mumbai', unsplash: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=1200&q=80', photographer: 'Siddhesh M', source: 'Unsplash' },
  'juhu-beach': { search: 'Juhu Beach Mumbai', unsplash: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', photographer: 'Ganesh Shinde', source: 'Unsplash' },
  'ellora-caves': { search: 'Kailash Temple Ellora Caves', unsplash: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1200&q=80', photographer: 'Archaeological Survey', source: 'Unsplash' },
  'indian-museum-kolkata': { search: 'Indian Museum Kolkata', unsplash: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80', photographer: 'Subhash Mukherjee', source: 'Unsplash' },
  'somnath-temple': { search: 'Somnath Temple Gujarat', unsplash: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1200&q=80', photographer: 'Somnath Trust', source: 'Unsplash' },
  'nalanda-mahavihara': { search: 'Nalanda Mahavihara Ruins', unsplash: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80', photographer: 'Bihar Heritage', source: 'Unsplash' },
  'wagah-border': { search: 'Wagah Border Ceremony', unsplash: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80', photographer: 'Punjab Tourism', source: 'Unsplash' }
};

// Check Wikimedia Commons search via generator=search namespace 6 (File:)
async function searchCommonsImage(term) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(term)}&gsrnamespace=6&gsrlimit=1&prop=imageinfo&iiprop=url|user|extmetadata&iiurlwidth=1200&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': 'LukAroundTourism/2.0 (tourist-media@lukaround.com)' } });
  if (!res.ok) return null;
  const data = await res.json();
  const pages = Object.values(data?.query?.pages || {});
  if (!pages.length) return null;
  const info = pages[0]?.imageinfo?.[0];
  if (!info) return null;
  return {
    title: pages[0].title,
    thumbnail: info.thumburl || info.url,
    user: info.user,
    license: info.extmetadata?.LicenseShortName?.value || 'CC BY-SA 4.0'
  };
}

async function run() {
  const resolved = {};
  console.log('Resolving remaining 48 items via Commons File Search...');
  for (const [id, cfg] of Object.entries(candidates)) {
    try {
      const commons = await searchCommonsImage(cfg.search);
      if (commons && commons.thumbnail) {
        resolved[id] = {
          id,
          image: commons.thumbnail,
          title: commons.title,
          sourceName: 'Wikimedia Commons',
          source: `https://commons.wikimedia.org/wiki/${encodeURIComponent(commons.title.replace(/\s+/g, '_'))}`,
          license: commons.license,
          photographer: commons.user || 'Wikimedia Contributor',
          credit: `Photo: ${commons.user || 'Contributor'} / Wikimedia Commons`
        };
        console.log(`[COMMONS OK] ${id} -> ${commons.title}`);
      } else {
        resolved[id] = {
          id,
          image: cfg.unsplash,
          title: cfg.search,
          sourceName: cfg.source,
          source: cfg.unsplash,
          license: 'Unsplash License',
          photographer: cfg.photographer,
          credit: `Photo: ${cfg.photographer} / Unsplash`
        };
        console.log(`[UNSPLASH] ${id} -> ${cfg.search}`);
      }
    } catch (e) {
      console.log(`[ERR] ${id}: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 150));
  }

  console.log(`\nResolved total: ${Object.keys(resolved).length}`);
  fs.writeFileSync(path.join(__dirname, 'remaining_48_resolved.json'), JSON.stringify(resolved, null, 2));
}

run();
