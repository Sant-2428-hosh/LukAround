const { CURATED_DESTINATIONS } = require('../backend/src/data/curatedLandmarks.js');
const keys = ['darjeeling', 'rishikesh', 'amritsar', 'varanasi', 'agra'];

async function run() {
  for (const k of keys) {
    const dest = CURATED_DESTINATIONS[k];
    for (const a of dest.attractions) {
      await new Promise(r => setTimeout(r, 600));
      try {
        const res = await fetch(a.imageUrl, {
          headers: { 'User-Agent': 'LukAroundTravelApp/2.0 (contact@lukaround.com; tourism-app)' }
        });
        const len = res.headers.get('content-length');
        console.log(`[${res.status}] ${k} -> ${a.name}: ${len || '?'} bytes`);
      } catch (e) {
        console.log(`[ERR] ${k} -> ${a.name}: ${e.message}`);
      }
    }
  }
}
run();
