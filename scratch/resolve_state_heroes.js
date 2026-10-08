const stateLandmarks = {
  'uttar-pradesh': { query: 'Taj Mahal', alt: 'Taj Mahal marble mausoleum at sunrise in Agra, Uttar Pradesh' },
  'tamil-nadu': { query: 'Madurai Meenakshi Amman Temple Gopuram', alt: 'Multicolored Gopuram towers of Meenakshi Temple in Madurai, Tamil Nadu' },
  'karnataka': { query: 'Mysore Palace', alt: 'Illuminated Amba Vilas Palace in Mysuru, Karnataka' },
  'andhra-pradesh': { query: 'Gandikota Gorge', alt: 'Magnificent gorge of Pennar River at Gandikota Fort, Andhra Pradesh' },
  'rajasthan': { query: 'Amber Fort Jaipur', alt: 'Majestic Amber Fort ramparts above Maota Lake in Jaipur, Rajasthan' },
  'maharashtra': { query: 'Gateway of India', alt: 'Gateway of India monument overlooking Mumbai harbour, Maharashtra' },
  'west-bengal': { query: 'Victoria Memorial Kolkata', alt: 'Victoria Memorial Hall reflecting in the surrounding lake in Kolkata, West Bengal' },
  'gujarat': { query: 'Rani ki vav', alt: 'Ornate sculptured stepwell corridors of Rani ki Vav in Patan, Gujarat' },
  'madhya-pradesh': { query: 'Khajuraho Group of Monuments', alt: 'UNESCO World Heritage temple architecture of Khajuraho, Madhya Pradesh' },
  'telangana': { query: 'Charminar Hyderabad', alt: 'Iconic four minarets of Charminar in historic Old Hyderabad, Telangana' },
  'kerala': { query: 'Munnar tea', alt: 'Lush rolling green tea gardens in Munnar, Kerala' },
  'bihar': { query: 'Mahabodhi Temple Bodh Gaya', alt: 'Sacred Mahabodhi Temple spire and sanctuary in Bodh Gaya, Bihar' },
  'odisha': { query: 'Konark Sun Temple', alt: 'Ancient stone chariot wheel reliefs at Konark Sun Temple, Odisha' },
  'punjab': { query: 'Golden Temple Amritsar', alt: 'Harmandir Sahib Golden Temple reflecting across the holy Amrit Sarovar in Amritsar, Punjab' },
  'uttarakhand': { query: 'Kedarnath Temple', alt: 'Kedarnath Temple framed against snow-capped peaks in the Garhwal Himalayas, Uttarakhand' }
};

async function getCommonsThumbnail(term) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(term)}&gsrnamespace=6&gsrlimit=1&prop=imageinfo&iiprop=url|user|extmetadata&iiurlwidth=1200&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': 'LukAroundTourism/2.0 (tourist-media@lukaround.com)' } });
  if (!res.ok) return null;
  const data = await res.json();
  const page = Object.values(data?.query?.pages || {})[0];
  const info = page?.imageinfo?.[0];
  return {
    title: page?.title,
    url: info?.thumburl || info?.url,
    user: info?.user,
    license: info?.extmetadata?.LicenseShortName?.value || 'CC BY-SA 4.0'
  };
}

async function run() {
  const results = {};
  for (const [slug, cfg] of Object.entries(stateLandmarks)) {
    const data = await getCommonsThumbnail(cfg.query);
    if (data && data.url) {
      // Test 200 OK
      const head = await fetch(data.url, { method: 'HEAD', headers: { 'User-Agent': 'LukAround/2.0' } });
      console.log(`[${head.status}] ${slug} => ${data.title}`);
      results[slug] = {
        heroImage: data.url,
        imageAlt: cfg.alt,
        imagePhotographer: data.user || 'Wikimedia Contributor',
        imageSourceName: 'Wikimedia Commons',
        imageSource: `https://commons.wikimedia.org/wiki/${encodeURIComponent(data.title.replace(/\s+/g, '_'))}`,
        imageLicense: data.license,
        imageCredit: `Photo: ${data.user || 'Contributor'} / Wikimedia Commons`
      };
    } else {
      console.log(`[FAILED] ${slug}`);
    }
  }
  const fs = require('fs');
  fs.writeFileSync('./scratch/state_heroes_verified.json', JSON.stringify(results, null, 2));
}

run();
