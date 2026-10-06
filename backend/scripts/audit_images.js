/**
 * Script to verify all image URLs in curatedLandmarks.js
 * Shows which are Wikimedia (need proxy) vs Unsplash (always reliable)
 */
const { CURATED_DESTINATIONS } = require('../src/data/curatedLandmarks');

for (const [key, dest] of Object.entries(CURATED_DESTINATIONS)) {
  console.log(`\n=== ${dest.city} (${dest.attractions.length} spots) ===`);
  dest.attractions.forEach(a => {
    const isUnsplash = a.imageUrl.includes('unsplash.com');
    const isWiki = a.imageUrl.includes('wikipedia') || a.imageUrl.includes('wikimedia');
    const icon = isUnsplash ? '✅' : (isWiki ? '⚠️' : '❓');
    console.log(`  ${icon} ${a.name}`);
    if (isWiki) console.log(`     URL: ${a.imageUrl.slice(0, 80)}`);
  });
}
