const { CURATED_DESTINATIONS } = require('../backend/src/data/curatedLandmarks.js');

async function checkUrl(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'LukAroundTravelApp/2.0 (contact@lukaround.com; travel-app) NodeFetch/3.0',
        'Accept': 'image/*,*/*'
      }
    });
    const len = res.headers.get('content-length');
    const type = res.headers.get('content-type');
    const buf = await res.arrayBuffer();
    return { status: res.status, len: buf.byteLength, type };
  } catch (err) {
    return { status: 'ERR', error: err.message };
  }
}

async function run() {
  const results = [];
  for (const [destKey, dest] of Object.entries(CURATED_DESTINATIONS)) {
    for (const a of dest.attractions) {
      const res = await checkUrl(a.imageUrl);
      const ok = res.status === 200 && res.len > 10000;
      results.push({ destKey, place: a.name, url: a.imageUrl, ...res, ok });
      console.log(`[${ok ? 'PASS' : 'FAIL'}] ${destKey} -> ${a.name}: ${res.status} (${res.len || 0} bytes)`);
    }
  }

  const failed = results.filter(r => !r.ok);
  console.log(`\nTOTAL: ${results.length}, PASSED: ${results.length - failed.length}, FAILED: ${failed.length}`);
  if (failed.length > 0) {
    console.log('\nFailed list:');
    failed.forEach(f => console.log(` - [${f.destKey}] ${f.place}: ${f.url} => ${f.status} (${f.len} bytes)`));
  }
}

run();
