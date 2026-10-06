const http = require('http');

function post(url, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const parsed = new URL(url);
    const req = http.request({
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, res => {
      let resp = '';
      res.on('data', chunk => resp += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(resp));
        } catch (e) {
          resolve({ raw: resp });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function run() {
  console.log('Testing POST /api/itinerary for Chennai (2 days)...');
  const plan = await post('http://localhost:5000/api/itinerary', { city: 'Chennai', days: 2 });
  console.log('Success:', plan.success, 'Days:', plan.itinerary?.length);
  if (plan.itinerary) {
    plan.itinerary.forEach(day => {
      console.log(`Day ${day.day} (${day.theme}):`);
      day.stops.forEach(s => {
        console.log(`  * [${s.order}] ${s.name} (${s.category})`);
        console.log(`    Image: ${s.imageUrl?.slice(0, 75)}`);
      });
    });
  }
}

run().catch(console.error);
