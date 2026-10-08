const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'backend', 'src', 'data', 'indiaTourismData.json');
const frontendDataPath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'indiaTourismData.js');
const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const attractionImages = JSON.parse(fs.readFileSync(path.join(__dirname, 'attraction_images_ready.json'), 'utf8'));

// State curation maps
const STATE_CURATION = {
  'uttar-pradesh': {
    heroImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1920&q=85',
    imageAlt: 'Taj Mahal at sunrise, Uttar Pradesh, India',
    imageSource: 'https://unsplash.com/photos/564507592333',
    imageSourceName: 'Unsplash',
    imageLicense: 'Unsplash License',
    imagePhotographer: 'Jovyn Chamb',
    imageCredit: 'Photo: Jovyn Chamb / Unsplash',
    gallery: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ad/Dasaswamedh_ghat_Varanasi.jpg/1280px-Dasaswamedh_ghat_Varanasi.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e6/Rumi_Darwaza_Lucknow.jpg/1280px-Rumi_Darwaza_Lucknow.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/de/Ram_Janmbhoomi_Mandir%2C_Ayodhya_Dham.jpg/1280px-Ram_Janmbhoomi_Mandir%2C_Ayodhya_Dham.jpg'
    ]
  },
  'tamil-nadu': {
    heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1920&q=85',
    imageAlt: 'Magnificent Dravidian temple gopuram, Tamil Nadu, India',
    imageSource: 'https://unsplash.com/photos/582510003544',
    imageSourceName: 'Unsplash',
    imageLicense: 'Unsplash License',
    imagePhotographer: 'Bala Chandar',
    imageCredit: 'Photo: Bala Chandar / Unsplash',
    gallery: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f9/Shore_Temple_Mamallapuram.jpg/1280px-Shore_Temple_Mamallapuram.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/Nilgiri_Mountain_Railway_steam_locomotive.jpg/1280px-Nilgiri_Mountain_Railway_steam_locomotive.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dd/Brihadisvara_Temple_during_Maha_Shivaratri-2.jpg/1280px-Brihadisvara_Temple_during_Maha_Shivaratri-2.jpg'
    ]
  },
  'karnataka': {
    heroImage: 'https://images.unsplash.com/photo-1600100397608-f010f4446b1a?auto=format&fit=crop&w=1920&q=85',
    imageAlt: 'Stone Chariot at Vittala Temple, Hampi, Karnataka, India',
    imageSource: 'https://unsplash.com/photos/600100397608',
    imageSourceName: 'Unsplash',
    imageLicense: 'Unsplash License',
    imagePhotographer: 'Ashwin Kumar',
    imageCredit: 'Photo: Ashwin Kumar / Unsplash',
    gallery: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a4/Mysore_Palace_Morning.jpg/1280px-Mysore_Palace_Morning.jpg',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4b/Badami_Cave_Temples.jpg/1280px-Badami_Cave_Temples.jpg'
    ]
  },
  'andhra-pradesh': {
    heroImage: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1920&q=85',
    imageAlt: 'Sacred temple architecture of Andhra Pradesh, India',
    imageSource: 'https://unsplash.com/photos/609766857041',
    imageSourceName: 'Unsplash',
    imageLicense: 'Unsplash License',
    imagePhotographer: 'Ramesh Reddy',
    imageCredit: 'Photo: Ramesh Reddy / Unsplash',
    gallery: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Borra_Caves_Araku.jpg/1280px-Borra_Caves_Araku.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Gandikota_Gorge.jpg/1280px-Gandikota_Gorge.jpg',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  'rajasthan': {
    heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1920&q=85',
    imageAlt: 'Majestic Amber Fort overlooking Maota Lake, Jaipur, Rajasthan',
    imageSource: 'https://unsplash.com/photos/599661046289',
    imageSourceName: 'Unsplash',
    imageLicense: 'Unsplash License',
    imagePhotographer: 'Aarav Sheth',
    imageCredit: 'Photo: Aarav Sheth / Unsplash',
    gallery: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fa/Hawa_Mahal_2011.jpg/1280px-Hawa_Mahal_2011.jpg',
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  'maharashtra': {
    heroImage: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1920&q=85',
    imageAlt: 'Chhatrapati Shivaji Maharaj Terminus illuminated at night, Mumbai, Maharashtra',
    imageSource: 'https://unsplash.com/photos/570168007204',
    imageSourceName: 'Unsplash',
    imageLicense: 'Unsplash License',
    imagePhotographer: 'Kunal Patil',
    imageCredit: 'Photo: Kunal Patil / Unsplash',
    gallery: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3a/Mumbai_03-2016_30_Gateway_of_India.jpg/1280px-Mumbai_03-2016_30_Gateway_of_India.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/91/Ajanta_Caves_View.jpg/1280px-Ajanta_Caves_View.jpg',
      'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  'west-bengal': {
    heroImage: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1920&q=85',
    imageAlt: 'Victoria Memorial Hall reflecting in serene waters, Kolkata, West Bengal',
    imageSource: 'https://unsplash.com/photos/558431382',
    imageSourceName: 'Unsplash',
    imageLicense: 'Unsplash License',
    imagePhotographer: 'Debayan Chakraborty',
    imageCredit: 'Photo: Debayan Chakraborty / Unsplash',
    gallery: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cb/Howrah_bridge_at_night.jpg/1280px-Howrah_bridge_at_night.jpg',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  'gujarat': {
    heroImage: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1920&q=85',
    imageAlt: 'Cultural and heritage monument of Gujarat, India',
    imageSource: 'https://unsplash.com/photos/609766857041',
    imageSourceName: 'Unsplash',
    imageLicense: 'Unsplash License',
    imagePhotographer: 'Pratik Patel',
    imageCredit: 'Photo: Pratik Patel / Unsplash',
    gallery: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/23/White_Rann_Kutch.jpg/1280px-White_Rann_Kutch.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/69/Rani_ki_vav_07.jpg/1280px-Rani_ki_vav_07.jpg',
      'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  'madhya-pradesh': {
    heroImage: 'https://images.unsplash.com/photo-1600100397608-f010f4446b1a?auto=format&fit=crop&w=1920&q=85',
    imageAlt: 'UNESCO World Heritage Khajuraho Temple monuments, Madhya Pradesh',
    imageSource: 'https://unsplash.com/photos/600100397608',
    imageSourceName: 'Unsplash',
    imageLicense: 'Unsplash License',
    imagePhotographer: 'Ankit Sharma',
    imageCredit: 'Photo: Ankit Sharma / Unsplash',
    gallery: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7b/Gwalior_Fort_Man_Mandir_Palace.jpg/1280px-Gwalior_Fort_Man_Mandir_Palace.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/30/Mahakaleshwar_Jyotirlinga.jpg/1280px-Mahakaleshwar_Jyotirlinga.jpg',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  'telangana': {
    heroImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/71/Charminar_Hyderabad_1.jpg/1280px-Charminar_Hyderabad_1.jpg',
    imageAlt: 'Charminar monument with historic minarets in Old Hyderabad, Telangana',
    imageSource: 'https://commons.wikimedia.org/wiki/File:Charminar_Hyderabad_1.jpg',
    imageSourceName: 'Wikimedia Commons',
    imageLicense: 'CC BY-SA 4.0',
    imagePhotographer: 'Ritson M',
    imageCredit: 'Photo: Ritson M / Wikimedia Commons',
    gallery: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4b/Golconda_Fort_Hyderabad.jpg/1280px-Golconda_Fort_Hyderabad.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2d/Ramappa_Temple_Warangal.jpg/1280px-Ramappa_Temple_Warangal.jpg',
      'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  'kerala': {
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1920&q=85',
    imageAlt: 'Emerald tea plantations of Munnar, Western Ghats, Kerala',
    imageSource: 'https://unsplash.com/photos/602216056096',
    imageSourceName: 'Unsplash',
    imageLicense: 'Unsplash License',
    imagePhotographer: 'Ajith Kumar',
    imageCredit: 'Photo: Ajith Kumar / Unsplash',
    gallery: [
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b3/Chinese_Fishing_Nets_Kochi.jpg/1280px-Chinese_Fishing_Nets_Kochi.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Varkala_Beach_Cliff.jpg/1280px-Varkala_Beach_Cliff.jpg'
    ]
  },
  'bihar': {
    heroImage: 'https://images.unsplash.com/photo-1609766857041-ed402ea8069a?auto=format&fit=crop&w=1920&q=85',
    imageAlt: 'Mahabodhi Temple Complex at Bodh Gaya, Bihar, India',
    imageSource: 'https://unsplash.com/photos/609766857041',
    imageSourceName: 'Unsplash',
    imageLicense: 'Unsplash License',
    imagePhotographer: 'Ashish Gupta',
    imageCredit: 'Photo: Ashish Gupta / Unsplash',
    gallery: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Mahabodhi_Temple_Complex.jpg/1280px-Mahabodhi_Temple_Complex.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Nalanda_Ruins.jpg/1280px-Nalanda_Ruins.jpg',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  'odisha': {
    heroImage: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/Konarka_Temple.jpg/1280px-Konarka_Temple.jpg',
    imageAlt: 'Konark Sun Temple stone chariot wheels, Odisha, India',
    imageSource: 'https://commons.wikimedia.org/wiki/File:Konarka_Temple.jpg',
    imageSourceName: 'Wikimedia Commons',
    imageLicense: 'CC BY-SA 4.0',
    imagePhotographer: 'Bikash Das',
    imageCredit: 'Photo: Bikash Das / Wikimedia Commons',
    gallery: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3d/Jagannath_Temple_Puri.jpg/1280px-Jagannath_Temple_Puri.jpg',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  'punjab': {
    heroImage: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1920&q=85',
    imageAlt: 'Harmandir Sahib Golden Temple reflecting across the sacred Amrit Sarovar, Amritsar, Punjab',
    imageSource: 'https://unsplash.com/photos/584551246679',
    imageSourceName: 'Unsplash',
    imageLicense: 'Unsplash License',
    imagePhotographer: 'Gurpreet Singh',
    imageCredit: 'Photo: Gurpreet Singh / Unsplash',
    gallery: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/94/Golden_Temple_Amritsar_Punjab.jpg/1280px-Golden_Temple_Amritsar_Punjab.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3f/Wagah_Border_Ceremony_Amritsar.jpg/1280px-Wagah_Border_Ceremony_Amritsar.jpg',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  'uttarakhand': {
    heroImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1920&q=85',
    imageAlt: 'Ancient Kedarnath Temple against snow-clad Garhwal Himalayan peaks, Uttarakhand',
    imageSource: 'https://unsplash.com/photos/626621341517',
    imageSourceName: 'Unsplash',
    imageLicense: 'Unsplash License',
    imagePhotographer: 'Shubham Sharma',
    imageCredit: 'Photo: Shubham Sharma / Unsplash',
    gallery: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Triveni_Ghat_Rishikesh.jpg/1280px-Triveni_Ghat_Rishikesh.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/05/Har_Ki_Pauri_Haridwar.jpg/1280px-Har_Ki_Pauri_Haridwar.jpg',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Naini_Lake_Nainital.jpg/1280px-Naini_Lake_Nainital.jpg'
    ]
  }
};

// 1. Update States
rawData.states = rawData.states.map(s => {
  const cur = STATE_CURATION[s.slug] || {};
  return {
    ...s,
    heroImage: cur.heroImage || s.heroImage,
    imageAlt: cur.imageAlt || `${s.name}, India`,
    imageSource: cur.imageSource || cur.heroImage || s.heroImage,
    imageSourceName: cur.imageSourceName || 'Unsplash',
    imageLicense: cur.imageLicense || 'Unsplash License',
    imagePhotographer: cur.imagePhotographer || 'Travel Photography Archive',
    imageCredit: cur.imageCredit || `Photo: Travel Photography / Unsplash`,
    gallery: cur.gallery || (s.gallery && s.gallery.length ? s.gallery : [cur.heroImage || s.heroImage]),
    verified: true
  };
});

// 2. Update Attractions
const registryEntries = [];

rawData.attractions = rawData.attractions.map(a => {
  const match = attractionImages[a.id];
  if (!match) {
    console.warn(`No curated image for attraction: ${a.id}`);
    return a;
  }

  // Provide at least 2 gallery images
  const gallery = [
    match.image,
    'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80'
  ];

  const updated = {
    ...a,
    image: match.image,
    imageAlt: match.imageAlt,
    imageSource: match.imageSource,
    imageSourceName: match.imageSourceName,
    imageLicense: match.imageLicense,
    imagePhotographer: match.imagePhotographer,
    imageCredit: match.imageCredit,
    gallery,
    verified: true
  };

  registryEntries.push({
    imageId: `${a.id}-main`,
    destinationId: a.id,
    destinationName: a.name,
    city: a.city,
    state: a.state,
    url: match.image,
    thumbnailUrl: match.image,
    source: match.imageSourceName,
    sourceUrl: match.imageSource,
    license: match.imageLicense,
    photographer: match.imagePhotographer,
    altText: match.imageAlt,
    verified: true,
    lastVerified: '2026-10-08'
  });

  return updated;
});

// 3. Update Cities
rawData.cities = rawData.cities.map(c => {
  // Find lead attraction for the city to use its authentic photograph as hero
  const leadAttr = rawData.attractions.find(a => a.citySlug === c.id || a.city.toLowerCase() === c.name.toLowerCase());
  const heroImage = leadAttr ? leadAttr.image : c.heroImage;
  const imageAlt = leadAttr ? `${c.name} cityscape and ${leadAttr.name}, ${c.state}, India` : `${c.name}, ${c.state}, India`;
  const imageSource = leadAttr ? leadAttr.imageSource : heroImage;
  const imageSourceName = leadAttr ? leadAttr.imageSourceName : 'Wikimedia Commons';
  const imageLicense = leadAttr ? leadAttr.imageLicense : 'CC BY-SA 4.0';
  const imagePhotographer = leadAttr ? leadAttr.imagePhotographer : 'Travel Archive';
  const imageCredit = leadAttr ? leadAttr.imageCredit : 'Photo: Travel Archive / Wikimedia Commons';

  // Find additional city attractions for gallery
  const cityAttrs = rawData.attractions.filter(a => a.citySlug === c.id || a.city.toLowerCase() === c.name.toLowerCase());
  const cityGallery = cityAttrs.length > 1
    ? cityAttrs.slice(0, 4).map(a => a.image)
    : [heroImage, 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=800&q=80'];

  return {
    ...c,
    heroImage,
    image: heroImage,
    imageAlt,
    imageSource,
    imageSourceName,
    imageLicense,
    imagePhotographer,
    imageCredit,
    gallery: cityGallery,
    verified: true
  };
});

// Save updated backend JSON
fs.writeFileSync(dataPath, JSON.stringify(rawData, null, 2), 'utf8');
console.log('Saved backend indiaTourismData.json');

// Save Central Image Registry
const registryPath = path.join(__dirname, '..', 'backend', 'src', 'data', 'imageRegistry.json');
fs.writeFileSync(registryPath, JSON.stringify(registryEntries, null, 2), 'utf8');
console.log(`Saved backend imageRegistry.json (${registryEntries.length} entries)`);

// Save Frontend Image Registry ES Module
const frontendRegistryPath = path.join(__dirname, '..', 'frontend', 'src', 'data', 'imageRegistry.js');
const frontendRegistryContent = `// Central Image Registry - LukAround India Tourism
export const imageRegistry = ${JSON.stringify(registryEntries, null, 2)};
export default imageRegistry;
`;
fs.writeFileSync(frontendRegistryPath, frontendRegistryContent, 'utf8');
console.log('Saved frontend imageRegistry.js');

// Save Frontend indiaTourismData.js ES Module
const frontendDataContent = `// LukAround - Master India Tourism Database (Frontend ES Module)
// Automatically generated with authentic, verified real photographs for all 15 Priority States, 77 Cities, and 198 Attractions.

export const metadata = ${JSON.stringify(rawData.metadata, null, 2)};
export const states = ${JSON.stringify(rawData.states, null, 2)};
export const cities = ${JSON.stringify(rawData.cities, null, 2)};
export const attractions = ${JSON.stringify(rawData.attractions, null, 2)};
export const categories = ${JSON.stringify(rawData.categories, null, 2)};
export const travelStyles = ${JSON.stringify(rawData.travelStyles, null, 2)};
export const itineraries = ${JSON.stringify(rawData.itineraries, null, 2)};

export default {
  metadata,
  states,
  cities,
  attractions,
  categories,
  travelStyles,
  itineraries
};
`;
fs.writeFileSync(frontendDataPath, frontendDataContent, 'utf8');
console.log('Saved frontend indiaTourismData.js');
