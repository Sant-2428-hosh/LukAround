const queries = [
  'ooty', 'hampi', 'munnar', 'jaipur', 'goa', 'coorg',
  'kodaikanal', 'manali', 'pondicherry', 'alleppey',
  'wayanad', 'udaipur', 'mysore', 'darjeeling',
  'rishikesh', 'amritsar', 'varanasi', 'agra',
  'yercaud', 'delhi', 'bangalore', 'chennai', 'kochi'
];

async function verify() {
  console.log('Verifying all 23 destinations and all their attraction scenery photos...\n');
  let totalAttractions = 0;
  let passed = 0;
  let failed = 0;

  for (const q of queries) {
    try {
      const searchRes = await fetch(`http://localhost:5000/api/destinations/search?q=${encodeURIComponent(q)}`);
      const searchData = await searchRes.json();
      const items = searchData.data || [];
      console.log(`\n=== [${q.toUpperCase()}] (${items.length} attractions) ===`);

      for (const item of items) {
        totalAttractions++;
        const imgUrl = item.imageUrl.startsWith('http')
          ? item.imageUrl
          : `http://localhost:5000${item.imageUrl}`;

        try {
          const imgRes = await fetch(imgUrl);
          const buf = await imgRes.arrayBuffer();
          const ok = imgRes.status === 200 && buf.byteLength > 10000;
          if (ok) {
            passed++;
            console.log(`  [OK] ${item.city}: ${imgRes.status} (${Math.round(buf.byteLength / 1024)} KB)`);
          } else {
            failed++;
            console.log(`  [FAIL] ${item.city}: status ${imgRes.status}, size ${buf.byteLength}`);
          }
        } catch (err) {
          failed++;
          console.log(`  [ERR] ${item.city}: ${err.message}`);
        }
      }
    } catch (err) {
      console.log(`[ERR QUERY] ${q}: ${err.message}`);
    }
  }

  console.log(`\n=============================================`);
  console.log(`SUMMARY: ${totalAttractions} attractions tested`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log(`=============================================`);
}

verify();
