async function getCommonsFileUrl(fileName) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(fileName)}&prop=imageinfo&iiprop=url&iiurlwidth=1200&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': 'LukAroundTourism/2.0 (tourist-media@lukaround.com)' } });
  const data = await res.json();
  const page = Object.values(data?.query?.pages || {})[0];
  const info = page?.imageinfo?.[0];
  return info?.thumburl || info?.url;
}

async function test() {
  const files = [
    'Ellora_caves_Kailash_temple.jpg',
    'Hampi_virupaksha_temple.jpg',
    'Mysore_Palace_Morning.jpg',
    'Taj_Mahal_(Edited).jpeg',
    'Charminar_Hyderabad_1.jpg'
  ];
  for (const f of files) {
    const u = await getCommonsFileUrl(f);
    console.log(f, '=>', u);
    if (u) {
      const check = await fetch(u, { method: 'HEAD', headers: { 'User-Agent': 'LukAroundTourism/2.0 (tourist-media@lukaround.com)' } });
      console.log('  Status:', check.status);
    }
  }
}

test();
