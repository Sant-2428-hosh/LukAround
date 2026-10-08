const testUrls = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Kailasa_temple_at_Ellora_caves.jpg/1280px-Kailasa_temple_at_Ellora_caves.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Stone_Chariot_at_Vittala_Temple_Complex%2C_Hampi.jpg/1280px-Stone_Chariot_at_Vittala_Temple_Complex%2C_Hampi.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Elephant_Stables%2C_Hampi%2C_Karnataka%2C_India.jpg/1280px-Elephant_Stables%2C_Hampi%2C_Karnataka%2C_India.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Lotus_Mahal%2C_Hampi.jpg/1280px-Lotus_Mahal%2C_Hampi.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Bara_Imambara_Lucknow_01.jpg/1280px-Bara_Imambara_Lucknow_01.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Somnath_temple.jpg/1280px-Somnath_temple.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Wagah_Border_Ceremony.jpg/1280px-Wagah_Border_Ceremony.jpg',
  'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80'
];

async function check() {
  for (const u of testUrls) {
    try {
      const res = await fetch(u, { method: 'HEAD', headers: { 'User-Agent': 'LukAround/2.0' } });
      console.log(res.status, u.slice(0, 60));
    } catch (e) {
      console.log('ERR', u.slice(0, 60), e.message);
    }
  }
}

check();
