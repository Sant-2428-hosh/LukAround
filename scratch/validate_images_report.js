const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'backend', 'src', 'data', 'indiaTourismData.json'), 'utf8'));

async function validateDataset() {
  console.log('====================================================');
  console.log('    INDIA TOURISM IMAGE VERIFICATION AUDIT REPORT   ');
  console.log('====================================================\n');

  const totalStates = data.states.length;
  const totalCities = data.cities.length;
  const totalAttractions = data.attractions.length;

  let imagesFound = 0;
  let imagesVerified = 0;
  let missingImages = 0;
  let missingAttribution = 0;

  const urlMap = new Map();
  const duplicates = [];

  // 1. Audit attractions
  data.attractions.forEach(a => {
    if (a.image && typeof a.image === 'string' && a.image.trim().length > 0) {
      imagesFound++;
      if (a.verified) imagesVerified++;
      if (!a.imageCredit || !a.imageSourceName) missingAttribution++;

      if (urlMap.has(a.image)) {
        duplicates.push({ id: a.id, name: a.name, originalId: urlMap.get(a.image), url: a.image });
      } else {
        urlMap.set(a.image, a.id);
      }
    } else {
      missingImages++;
    }
  });

  console.log(`Total states: ${totalStates}`);
  console.log(`Total cities/destinations: ${totalCities}`);
  console.log(`Total attractions: ${totalAttractions}`);
  console.log(`Images found: ${imagesFound}`);
  console.log(`Images verified: ${imagesVerified}`);
  console.log(`Missing images: ${missingImages}`);
  console.log(`Duplicate images: ${duplicates.length}`);
  console.log(`Missing attribution: ${missingAttribution}`);

  if (duplicates.length > 0) {
    console.log('\nDUPLICATES DETECTED:');
    duplicates.forEach(d => console.log(`  - ${d.name} (${d.id}) reuses image from ${d.originalId}`));
  }

  // Sample check of image URLs
  console.log('\nVerifying HTTP response for sample attraction images...');
  const sampleUrls = [
    data.attractions[0].image, // Taj Mahal
    data.attractions[6].image, // Kashi Vishwanath
    data.attractions[13].image, // Ram Mandir
    data.attractions[34].image, // Marina Beach
    data.attractions[47].image, // Meenakshi Amman Temple
    data.attractions[70].image, // Brihadeeswarar Temple
    data.attractions[77].image, // Bangalore Palace
    data.attractions[88].image, // Virupaksha Temple
    data.attractions[110].image, // Amber Fort
    data.attractions[136].image, // Gateway of India
    data.attractions[150].image, // Victoria Memorial
    data.attractions[158].image, // Sabarmati Ashram
    data.attractions[170].image, // Charminar
    data.attractions[173].image, // Munnar Tea Gardens
    data.attractions[180].image, // Mahabodhi Temple
    data.attractions[182].image, // Konark Sun Temple
    data.attractions[184].image, // Golden Temple Amritsar
    data.attractions[186].image  // Kedarnath Temple
  ];

  let brokenUrls = 0;
  for (const u of sampleUrls) {
    try {
      const res = await fetch(u, { method: 'HEAD', headers: { 'User-Agent': 'LukAround/2.0' } });
      const ok = res.status >= 200 && res.status < 400;
      if (!ok) {
        brokenUrls++;
        console.log(`  [FAIL ${res.status}] ${u.slice(0, 80)}...`);
      } else {
        console.log(`  [OK ${res.status}] ${u.slice(0, 80)}...`);
      }
    } catch (e) {
      brokenUrls++;
      console.log(`  [ERR] ${u.slice(0, 80)}: ${e.message}`);
    }
  }

  console.log(`\nBroken URLs in sample: ${brokenUrls}`);
  console.log('====================================================\n');
}

validateDataset();
