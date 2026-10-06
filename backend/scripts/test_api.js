const http = require('http');

function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ raw: data });
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('Testing /api/destinations/nearby?lat=13.0827&lng=80.2707 (Chennai)...');
  const nearby = await get('http://localhost:5000/api/destinations/nearby?lat=13.0827&lng=80.2707');
  console.log('Nearby status:', nearby.success, 'Count:', nearby.count, 'City:', nearby.location?.city);
  if (nearby.data) {
    nearby.data.forEach(d => {
      console.log(`  * ${d.city} (${d.category}): ${d.imageUrl}`);
    });
  }

  console.log('\nTesting /api/destinations/featured...');
  const featured = await get('http://localhost:5000/api/destinations/featured');
  console.log('Featured status:', featured.success, 'Count:', featured.count);
  if (featured.data) {
    featured.data.slice(0, 6).forEach(d => {
      console.log(`  * ${d.city} (${d.category}): ${d.imageUrl}`);
    });
  }

  console.log('\nTesting /api/destinations/search?q=chennai...');
  const search = await get('http://localhost:5000/api/destinations/search?q=chennai');
  console.log('Search status:', search.success, 'Count:', search.count);
  if (search.data) {
    search.data.slice(0, 6).forEach(d => {
      console.log(`  * ${d.city} (${d.category}): ${d.imageUrl}`);
    });
  }
}

run().catch(console.error);
