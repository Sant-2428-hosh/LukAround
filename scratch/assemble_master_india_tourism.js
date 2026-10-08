const fs = require('fs');
const path = require('path');

console.log('Assembling Master India Tourism Database...');

// 1. Load States
const states = JSON.parse(fs.readFileSync(path.join(__dirname, 'states_data.json'), 'utf8'));

// 2. Load Cities
const cities = JSON.parse(fs.readFileSync(path.join(__dirname, 'all_cities.json'), 'utf8'));

// 3. Load Attractions
const up = JSON.parse(fs.readFileSync(path.join(__dirname, 'attractions_up.json'), 'utf8'));
const tn = JSON.parse(fs.readFileSync(path.join(__dirname, 'attractions_tn.json'), 'utf8'));
const ka = JSON.parse(fs.readFileSync(path.join(__dirname, 'attractions_karnataka.json'), 'utf8'));
const apRj = JSON.parse(fs.readFileSync(path.join(__dirname, 'attractions_ap_rajasthan.json'), 'utf8'));
const mhWb = JSON.parse(fs.readFileSync(path.join(__dirname, 'attractions_mh_wb.json'), 'utf8'));
const gujMpTg = JSON.parse(fs.readFileSync(path.join(__dirname, 'attractions_guj_mp_tg.json'), 'utf8'));
const last5 = JSON.parse(fs.readFileSync(path.join(__dirname, 'attractions_last5.json'), 'utf8'));

const allAttractions = [...up, ...tn, ...ka, ...apRj, ...mhWb, ...gujMpTg, ...last5];

// Ensure unique IDs
const attractionMap = new Map();
allAttractions.forEach(item => {
  if (!attractionMap.has(item.id)) {
    attractionMap.set(item.id, item);
  }
});
const uniqueAttractions = Array.from(attractionMap.values());

console.log(`Verified unique attractions: ${uniqueAttractions.length}`);

// 4. Categories
const categories = [
  {
    id: "heritage",
    name: "Heritage & Architecture",
    slug: "heritage",
    icon: "Landmark",
    heroImage: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80",
    tagline: "Millennia of Living History & Architectural Wonders",
    description: "Explore India's peerless architectural legacy spanning 3,000 years—from soaring Dravidian temple gopurams and monolithic rock-cut cave temples to impregnable Rajput hill citadels and symmetrical white marble Mughal mausoleums.",
    topDestinations: ["Taj Mahal", "Brihadeeswarar Temple", "Hampi Stone Chariot", "Amer Fort", "Kailash Temple Ellora", "Konark Sun Temple"],
    count: uniqueAttractions.filter(a => (a.category || []).includes("heritage") || a.type === "heritage" || a.type === "forts-palaces").length
  },
  {
    id: "spiritual",
    name: "Spiritual & Sacred Sites",
    slug: "spiritual",
    icon: "Flame",
    heroImage: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
    tagline: "Sacred Confluences, Jyotirlingas & Eternal Ghats",
    description: "Experience the timeless spiritual heartbeat of India. Journey across the 12 Jyotirlingas, the four supreme Char Dham holy abodes, eternal Ganga Aarti rituals along Varanasi's sacred ghats, and golden gurdwaras serving universal brotherhood.",
    topDestinations: ["Kashi Vishwanath (Varanasi)", "Golden Temple (Amritsar)", "Mahabodhi Temple (Bodh Gaya)", "Tirumala Balaji", "Meenakshi Temple", "Kedarnath Temple"],
    count: uniqueAttractions.filter(a => (a.category || []).includes("spiritual") || a.type === "spiritual").length
  },
  {
    id: "beaches",
    name: "Beaches & Coastal Escapes",
    slug: "beaches",
    icon: "Palmtree",
    heroImage: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80",
    tagline: "Sun-Kissed Sands, Red Cliffs & Arabian Sea Breezes",
    description: "Discover over 7,500 kilometers of sun-blessed coastline—from the golden crescent bays of Gokarna and dramatic red laterite cliffs of Varkala to the world-famous Marina promenade in Chennai and untouched white sands in Rameswaram.",
    topDestinations: ["Om Beach (Gokarna)", "Varkala Cliff Beach", "Marina Beach (Chennai)", "Yarada Beach (Vizag)", "Radhanagar", "Mahabalipuram Beach"],
    count: uniqueAttractions.filter(a => (a.category || []).includes("beaches") || a.type === "beaches").length
  },
  {
    id: "hill-stations",
    name: "Hill Stations & Mountains",
    slug: "hill-stations",
    icon: "Mountain",
    heroImage: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80",
    tagline: "Misty Valleys, Pine Cathedrals & Snow-Crowned Peaks",
    description: "Ascend to cool mountain retreats cradled by the Himalayas, Western Ghats, and Nilgiris. Ride vintage UNESCO toy trains through tea estates in Ooty and Darjeeling, boat across emerald mountain lakes in Nainital, and walk cloud-draped cliff ridges in Kodaikanal.",
    topDestinations: ["Ooty (Nilgiris)", "Darjeeling (Kanchenjunga)", "Munnar (Tea Hills)", "Kodaikanal", "Nainital Lake", "Coorg"],
    count: uniqueAttractions.filter(a => (a.category || []).includes("hill-stations") || a.type === "hill-stations").length
  },
  {
    id: "wildlife",
    name: "Wildlife & Nature Reserves",
    slug: "wildlife",
    icon: "Compass",
    heroImage: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80",
    tagline: "Royal Bengal Tigers, Asiatic Lions & Wild Elephants",
    description: "Immerse yourself in India's untamed wilderness. Track Royal Bengal Tigers prowling ancient stone ruins in Ranthambore and Jim Corbett, observe the world's last wild Asiatic Lions in Gir, and watch wild elephant herds bathe in the pristine waters of Periyar.",
    topDestinations: ["Ranthambore National Park", "Jim Corbett National Park", "Gir Forest (Asiatic Lions)", "Sundarbans Delta", "Periyar Wildlife Sanctuary", "Eravikulam (Nilgiri Tahr)"],
    count: uniqueAttractions.filter(a => (a.category || []).includes("wildlife") || a.type === "wildlife").length
  },
  {
    id: "adventure",
    name: "Adventure & Thrills",
    slug: "adventure",
    icon: "Compass",
    heroImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    tagline: "White-Water Rafting, Desert Safaris & High-Altitude Treks",
    description: "Fuel your wanderlust with high-octane expeditions across varied geography: battle Grade IV Himalayan white-water rapids in Rishikesh, bash 30-meter sand dunes in Jaisalmer's Thar Desert, and trek along boulder-strewn volcanic trails in Hampi.",
    topDestinations: ["White-Water Rafting (Rishikesh)", "Thar Desert Dune Bashing (Sam Dunes)", "High-Altitude Trek to Kedarnath", "Flying Fox Zipline (Mehrangarh)", "Pennar Gorge Kayaking (Gandikota)"],
    count: uniqueAttractions.filter(a => (a.category || []).includes("adventure") || a.type === "adventure").length
  },
  {
    id: "food",
    name: "Culinary Heritage & Food Trails",
    slug: "food",
    icon: "Coffee",
    heroImage: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80",
    tagline: "Royal Nawabi Dastarkhwans, Spicy Chettinad & Street Chaat",
    description: "Embark on an unforgettable sensory feast celebrating India's rich culinary traditions: melt-in-mouth Galouti Kebabs and Awadhi biryanis in Lucknow, fiery pepper crab in Chettinad, buttery pav bhaji on Juhu beach, and aromatic single-estate filter coffees.",
    topDestinations: ["Lucknow (Awadhi Kebabs)", "Madurai & Chettinad (Spicy curries)", "Amritsar (Kulcha & Lassi)", "Hyderabad (Dum Biryani)", "Kolkata (Kathi Rolls & Rosogolla)"],
    count: uniqueAttractions.filter(a => (a.category || []).includes("food") || a.type === "food" || a.type === "shopping").length
  },
  {
    id: "culture",
    name: "Culture, Arts & Festivals",
    slug: "culture",
    icon: "Sparkles",
    heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    tagline: "Living Folk Traditions, Classical Dance & World Records",
    description: "Celebrate the colorful kaleidoscope of India's living heritage: witness millions of earthen oil lamps ignite at Ayodhya's Deepotsav, dance at Gujarat's 9-night Navratri Garba, marvel at Kathakali theatre in Kerala, and experience the Pushkar Camel Fair.",
    topDestinations: ["Pushkar Camel Fair", "Ayodhya Deepotsav", "Kumbh Mela (Prayagraj)", "Mysuru Dasara", "Rann Utsav (Kutch)", "Khajuraho Dance Festival"],
    count: uniqueAttractions.filter(a => (a.category || []).includes("culture") || a.type === "culture").length
  }
];

// 5. Travel Styles
const travelStyles = [
  { id: "family", name: "Family Trips", description: "Safe, comfortable, and wonder-filled journeys suitable for all generations.", icon: "Users" },
  { id: "couples", name: "Couples & Honeymoon", description: "Romantic getaways with sunset boat rides, luxury palaces, and mist-wrapped hills.", icon: "Heart" },
  { id: "solo", name: "Solo Travel", description: "Soul-stirring adventures, peaceful ashrams, and budget-friendly backpacker hubs.", icon: "Compass" },
  { id: "friends", name: "Friends & Groups", description: "High-energy road trips, water sports, camping, and vibrant night markets.", icon: "Smile" },
  { id: "weekend", name: "Weekend Trips", description: "Quick, refreshing 2-3 day escapes easily accessible from major metropolitan hubs.", icon: "Clock" },
  { id: "luxury", name: "Royal Luxury", description: "Palace hotels, private heritage chauffeurs, and world-class fine dining.", icon: "Crown" },
  { id: "budget", name: "Budget Travel", description: "Authentic, high-value discoveries with local transport, ashrams, and street food.", icon: "DollarSign" },
  { id: "spiritual", name: "Spiritual Pilgrimage", description: "Devotional circuits across sacred rivers, jyotirlingas, and divine shrines.", icon: "Flame" },
  { id: "heritage", name: "Heritage & History", description: "Deep architectural explorations of UNESCO sites, forts, and ancient museums.", icon: "Landmark" },
  { id: "nature", name: "Nature & Wilderness", description: "Dense green forests, waterfalls, tea estates, and starry night skies.", icon: "Trees" },
  { id: "adventure", name: "Adventure & Thrills", description: "River rafting, desert safaris, rock climbing, and mountain trekking.", icon: "Zap" },
  { id: "beach", name: "Beach Leisure", description: "Laid-back days on golden sand, swimming in warm surf, and seafood shacks.", icon: "Palmtree" }
];

// 6. Multi-Day Suggested Itineraries
const itineraries = [
  {
    id: "rajasthan-royal-splendour-3d",
    title: "3 Days in Royal Rajasthan: Jaipur & Pushkar",
    state: "Rajasthan",
    destination: "Jaipur & Pushkar",
    durationDays: 3,
    travelStyle: "heritage",
    budget: "moderate",
    heroImage: "https://images.unsplash.com/photo-1598324789736-4861f89564a0?auto=format&fit=crop&w=1200&q=80",
    summary: "Experience the ultimate 3-day royal circuit through the Pink City of Jaipur and the sacred desert oasis of Pushkar. Marvel at the golden ramparts of Amber Fort, the 953 honeycomb windows of Hawa Mahal, and the tranquil evening ghats of Pushkar Lake.",
    days: [
      {
        dayNumber: 1,
        title: "Fortresses & Palaces of the Pink City",
        morning: "Ascend the cobbled slopes of Amber Fort to explore the Sheesh Mahal mirror palace and Ganesh Pol courtyards.",
        afternoon: "Tour the royal Chandra Mahal and courtyards of City Palace; study astronomical stone instruments at UNESCO Jantar Mantar.",
        evening: "Capture golden hour photos in front of Hawa Mahal's 953 pink jharokhas; enjoy sunset views over Jaipur from the ramparts of Nahargarh Fort."
      },
      {
        dayNumber: 2,
        title: "Water Palaces & Old Jaipur Bazaars",
        morning: "Admire the floating illusion of Jal Mahal on Man Sagar Lake followed by traditional block printing workshops in Amer village.",
        afternoon: "Savor authentic Rajasthani Dal Baati Churma at LMB in Johari Bazaar; shop for Blue Pottery and gemstone jewellery in Bapu Bazaar.",
        evening: "Drive through the Aravalli Hills towards the sacred town of Pushkar; check into your desert heritage haveli."
      },
      {
        dayNumber: 3,
        title: "Sacred Oasis & Desert Sunset in Pushkar",
        morning: "Participate in early morning prayers at the 14th-century Jagatpita Brahma Temple and walk barefoot along the sacred 52 stone ghats.",
        afternoon: "Browse vibrant handicraft lanes for rose water, camel leather bags, and embroidered textiles; sip sweet falooda lassi by the lake.",
        evening: "Embark on a sunset camel safari into the Thar Desert dunes as folk musicians play the ravanahatha under the evening sky."
      }
    ]
  },
  {
    id: "tamil-nadu-temple-trail-5d",
    title: "5 Days Tamil Nadu Temple & Heritage Trail",
    state: "Tamil Nadu",
    destination: "Chennai, Mahabalipuram, Thanjavur & Madurai",
    durationDays: 5,
    travelStyle: "spiritual",
    budget: "moderate",
    heroImage: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80",
    summary: "Journey through 1,500 years of unbroken Dravidian architectural brilliance: from the sea-carved Pallava monoliths of Mahabalipuram to the 216-foot granite Vimana of Thanjavur's Big Temple and the multi-tiered gopurams of Madurai.",
    days: [
      {
        dayNumber: 1,
        title: "Colonial Chennai & Pallava Ocean Shore",
        morning: "Visit the 7th-century Kapaleeshwarar Temple in Mylapore and historic San Thome Basilica.",
        afternoon: "Drive along the scenic East Coast Road (ECR) to UNESCO World Heritage site Mahabalipuram.",
        evening: "Explore the monolithic Pancha Rathas and watch the waves crash against the 8th-century Shore Temple at sunset."
      },
      {
        dayNumber: 2,
        title: "Monolithic Wonders & Descent of the Ganga",
        morning: "Marvel at Arjuna's Penance bas-relief and pose by the gravity-defying Krishna's Butter Ball.",
        afternoon: "Depart for the ancient Chola imperial capital of Thanjavur across the fertile Kaveri Delta.",
        evening: "Arrive in Thanjavur; stroll through the illuminated moat surrounding the Brihadeeswarar Temple complex."
      },
      {
        dayNumber: 3,
        title: "The Chola Granite Marvel in Thanjavur",
        morning: "Tour Brihadeeswarar Temple (Big Temple), studying its 81-ton monolithic granite cupola and thousand-year-old Tamil inscriptions.",
        afternoon: "Visit the Thanjavur Maratha Palace, Saraswathi Mahal Library, and royal bronze casting ateliers.",
        evening: "Drive through the Chettinad heritage mansion belt towards Madurai; dinner featuring authentic Chettinad pepper chicken."
      },
      {
        dayNumber: 4,
        title: "The Soul of Madurai & Goddess Meenakshi",
        morning: "Enter the magnificent Meenakshi Amman Temple to marvel at the Hall of 1,000 Pillars and sacred Golden Lotus Pond.",
        afternoon: "Explore the monumental 82-foot stucco arches of Thirumalai Nayakkar Palace and the historic Gandhi Memorial Museum.",
        evening: "Witness the divine 9:00 PM Bed-Chamber palanquin procession inside Meenakshi Temple with nadaswaram music."
      },
      {
        dayNumber: 5,
        title: "Jasmine Markets & Alagar Hills Departure",
        morning: "Walk through Madurai's bustling wholesale jasmine flower market (Madurai Malli) and taste fluffy Idlis at Murugan Idli Shop.",
        afternoon: "Take a scenic drive to Alagar Koyil temple nestled in forested hills; taste sacred pepper dosai prasad.",
        evening: "Transfer to Madurai Airport or Railway Station for onward travel."
      }
    ]
  },
  {
    id: "kerala-backwaters-and-hills-5d",
    title: "5 Days Kerala Backwaters, Tea Hills & Coast",
    state: "Kerala",
    destination: "Kochi, Munnar & Alappuzha",
    durationDays: 5,
    travelStyle: "nature",
    budget: "luxury",
    heroImage: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80",
    summary: "Discover God's Own Country: explore colonial Portuguese and Dutch history in Fort Kochi, breathe fresh cardamom air in the mist-wrapped tea plantations of Munnar, and cruise silent emerald lagoons on a private thatched houseboat in Alleppey.",
    days: [
      {
        dayNumber: 1,
        title: "Colonial Charm of Fort Kochi",
        morning: "Stroll along Fort Kochi to watch fishermen operate the 14th-century Chinese Fishing Nets against the morning tide.",
        afternoon: "Visit the 16th-century Mattancherry Palace with its Ramayana murals and browse antique shops in historic Jew Town.",
        evening: "Attend an authentic Kathakali classical dance performance with live makeup demonstration; dine on fresh grilled seafood."
      },
      {
        dayNumber: 2,
        title: "Ascent into the Misty Tea Hills of Munnar",
        morning: "Drive through lush Western Ghats mountain roads, stopping at Cheeyappara and Valara waterfalls.",
        afternoon: "Arrive in Munnar; walk through aromatic cardamom, cinnamon, and pepper spice gardens.",
        evening: "Check into a cliffside tea estate bungalow; sip fresh single-estate brew as evening fog blankets the hills."
      },
      {
        dayNumber: 3,
        title: "Tea Plantations & Endangered Nilgiri Tahr",
        morning: "Board the eco-safari bus at Eravikulam National Park to spot the rare Nilgiri Tahr grazing near Anamudi Peak.",
        afternoon: "Tour the Tata Tea Museum for an artisan tea tasting session and live CTC manufacturing demonstration.",
        evening: "Enjoy pedal boating at Mattupetty Dam reservoir and panoramic views from Top Station looking into Tamil Nadu."
      },
      {
        dayNumber: 4,
        title: "Houseboat Living on Alleppey Backwaters",
        morning: "Scenic descent from the mountains towards the palm-fringed backwater hub of Alappuzha (Alleppey).",
        afternoon: "Board your private luxury thatched Kettuvallam houseboat; glide silently through Vembanad Lake and narrow palm canals.",
        evening: "Feast on freshly caught Pearl Spot (Karimeen) fish and Kerala Sadya prepared by your onboard chef under starry skies."
      },
      {
        dayNumber: 5,
        title: "Sunrise Canal Cruise & Departure",
        morning: "Wake up to mist drifting over water lilies; take a quiet morning canoe ride through rural village coir-making canals.",
        afternoon: "Disembark from the houseboat; stroll along Alappuzha Beach and its historic 160-year-old colonial pier.",
        evening: "Transfer to Cochin International Airport (COK) for your flight home."
      }
    ]
  },
  {
    id: "uttar-pradesh-spiritual-circuit-4d",
    title: "4 Days Spiritual Heartland: Varanasi, Ayodhya & Lucknow",
    state: "Uttar Pradesh",
    destination: "Varanasi, Ayodhya & Lucknow",
    durationDays: 4,
    travelStyle: "spiritual",
    budget: "moderate",
    heroImage: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
    summary: "A profound spiritual and cultural odyssey across the holy rivers Ganga and Saryu to the Nawabi capital of Lucknow. Experience dawn boat rides along Varanasi's 84 ghats, darshan at the grand new Ram Mandir in Ayodhya, and Awadhi culinary royalty.",
    days: [
      {
        dayNumber: 1,
        title: "The Eternal City of Kashi (Varanasi)",
        morning: "Sunrise wooden boat ride along the 84 sacred ghats; witness morning snan and classical Subah-e-Banaras ragas at Assi Ghat.",
        afternoon: "Walk through the Kashi Vishwanath Corridor to take darshan of the gold-spired Shiva Jyotirlinga.",
        evening: "Witness the magnificent choreographed evening Dashashwamedh Ganga Aarti from stone steps; release floating marigold lamps."
      },
      {
        dayNumber: 2,
        title: "Buddha's Sarnath & Road to Ayodhya",
        morning: "Visit Sarnath (10 km away) to meditate by the 43-meter Dhamek Stupa and see the Ashokan Lion Capital at the museum.",
        afternoon: "Scenic highway drive or Vande Bharat Express ride to the holy city of Ayodhya on the sacred Saryu River.",
        evening: "Attend the serene evening Saryu River Aarti at Naya Ghat; walk the illuminated pathways of Ram Ki Paidi."
      },
      {
        dayNumber: 3,
        title: "Sacred Ayodhya & Shri Ram Janmabhoomi",
        morning: "Climb the 76 steps to Hanuman Garhi fortress temple before sacred darshan at the magnificent new Shri Ram Janmabhoomi Mandir.",
        afternoon: "Visit the ornate Bundeli palace temple of Kanak Bhawan; sample traditional Ayodhya pedas and rabri.",
        evening: "Drive on the Purvanchal Expressway to the regal city of Lucknow; check into your heritage hotel."
      },
      {
        dayNumber: 4,
        title: "Nawabi Heritage & Awadhi Gastronomy in Lucknow",
        morning: "Navigate the mysterious 3D labyrinth of Bhulbhulaiya atop the monumental Bara Imambara and admire Rumi Darwaza.",
        afternoon: "Walk through the British Residency ruins; shop for authentic GI-tagged Chikankari embroidery in Hazratganj.",
        evening: "Feast on melt-in-mouth Galouti and Tunday Kebabs with Ulte Tawe Ka Paratha in Aminabad before departure."
      }
    ]
  },
  {
    id: "karnataka-heritage-wonders-4d",
    title: "4 Days Karnataka Heritage: Hampi & Badami",
    state: "Karnataka",
    destination: "Hampi & Badami",
    durationDays: 4,
    travelStyle: "heritage",
    budget: "moderate",
    heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    summary: "Explore the golden ruins of the Vijayanagara Empire at UNESCO World Heritage Hampi, and the 6th-century Chalukyan rock-cut cave temples of Badami overlooking emerald Agastya Lake.",
    days: [
      {
        dayNumber: 1,
        title: "Sacred Ruins & Boulder Landscapes of Hampi",
        morning: "Receive morning blessings from Lakshmi the elephant at Virupaksha Temple; explore ancient Hampi Bazaar ruins.",
        afternoon: "Hike up boulder-strewn Hemakuta Hill to view early Chalukyan shrines and the giant Kadalekalu Ganesha monolithic statue.",
        evening: "Climb Matanga Hill for an unforgettable 360-degree sunset view over the Tungabhadra River and ruined empire."
      },
      {
        dayNumber: 2,
        title: "The Stone Chariot & Royal Enclosure",
        morning: "Tour the Vittala Temple complex, marveling at the world-famous Stone Chariot and testing the acoustic musical pillars.",
        afternoon: "Explore the royal Zenana Enclosure, the Indo-Islamic Lotus Mahal, and the 11 grand domed Elephant Stables.",
        evening: "Coracle boat ride on the rushing waters of the Tungabhadra River; cafe hopping in bohemian Sanapur village."
      },
      {
        dayNumber: 3,
        title: "Rock-Cut Caves of Badami & Agastya Lake",
        morning: "Drive to Badami; climb through the four 6th-century rock-cut cave temples chiseled into soaring red sandstone cliffs.",
        afternoon: "Admire the 18-armed dancing Nataraja in Cave 1 and colossal Vishnu sculptures in Cave 3 overlooking Agastya Lake.",
        evening: "Walk around the quiet shores of Agastya Lake to watch sunset reflect off the water plinth of Bhutanatha Temple."
      },
      {
        dayNumber: 4,
        title: "UNESCO Pattadakal & Cradle of Temple Architecture",
        morning: "Visit the UNESCO World Heritage temple complex at Pattadakal (22 km) displaying early Dravidian and Nagara temple fusions.",
        afternoon: "Explore the historic 5th-century rock temples of Aihole (Durga Temple and Lad Khan Temple).",
        evening: "Return to Hubballi or Bengaluru for onward travel."
      }
    ]
  },
  {
    id: "uttarakhand-himalayan-expedition-5d",
    title: "5 Days Devbhoomi Uttarakhand: Rishikesh, Nainital & Corbett",
    state: "Uttarakhand",
    destination: "Rishikesh, Haridwar, Jim Corbett & Nainital",
    durationDays: 5,
    travelStyle: "adventure",
    budget: "moderate",
    heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    summary: "The ultimate Himalayan sampler: from holy evening Ganga Aartis and white-water rapids in Rishikesh and Haridwar to wild Bengal Tiger safaris in Jim Corbett and boating on emerald Naini Lake.",
    days: [
      {
        dayNumber: 1,
        title: "Holy River & Evening Aarti in Haridwar",
        morning: "Take the cable car up to Mansa Devi Temple on Bilwa Parvat overlooking the Ganga valley.",
        afternoon: "Walk through the bustling Moti Bazaar; taste hot kachoris and rabri jalebi.",
        evening: "Secure stone seats at Har Ki Pauri for the awe-inspiring evening Ganga Aarti with flaming brass lamps and floating diyas."
      },
      {
        dayNumber: 2,
        title: "Yoga & White-Water Rafting in Rishikesh",
        morning: "Experience thrilling Grade III/IV white-water river rafting from Shivpuri, navigating Roller Coaster and Golf Course rapids.",
        afternoon: "Walk across Ram Jhula; explore The Beatles Ashram (Chaurasi Kutia) with its psychedelic murals.",
        evening: "Attend the serene sunset Ganga Aarti at Parmarth Niketan facing the majestic Shiva statue in the river."
      },
      {
        dayNumber: 3,
        title: "Tiger Safari in India's Oldest National Park",
        morning: "Scenic drive through the Shivalik foothills to Jim Corbett National Park.",
        afternoon: "Board an open-top 4x4 Gypsy safari into Bijrani or Jhirna zones; track Bengal Tigers, Asian elephants, and spotted deer.",
        evening: "Relax around a bonfire at your riverside jungle resort along the Kosi River."
      },
      {
        dayNumber: 4,
        title: "Emerald Mountain Lake in Nainital",
        morning: "Drive through Kumaoni pine ridges to the picturesque hill station of Nainital (6,350 ft).",
        afternoon: "Yachting and pedal boating on the emerald waters of Naini Lake; visit the sacred lakeside Naina Devi Temple.",
        evening: "Take the aerial ropeway cable car to Snow View Point for vistas of Mount Nanda Devi; stroll the lively Mall Road."
      },
      {
        dayNumber: 5,
        title: "Himalayan Viewpoints & Departure",
        morning: "Horseback ride or nature hike to Tiffin Top (Dorothy's Seat) for 360-degree vistas over Kumaon hills.",
        afternoon: "Shop for aromatic hand-carved decorative candles and fresh fruit jams at Tibetan Market.",
        evening: "Transfer to Kathgodam railway station or Pantnagar airport for departure."
      }
    ]
  }
];

// Combine into master database object
const masterDatabase = {
  metadata: {
    title: "LukAround - India Tourism & Travel Discovery Master Database",
    version: "2.0.0",
    generatedAt: new Date().toISOString(),
    totalStates: states.length,
    totalCities: cities.length,
    totalAttractions: uniqueAttractions.length,
    totalCategories: categories.length,
    totalTravelStyles: travelStyles.length,
    totalItineraries: itineraries.length
  },
  states: states,
  cities: cities,
  attractions: uniqueAttractions,
  categories: categories,
  travelStyles: travelStyles,
  itineraries: itineraries
};

// 7. Write to backend
const backendDataPath = path.join(__dirname, '..', 'backend', 'src', 'data', 'indiaTourismData.json');
fs.writeFileSync(backendDataPath, JSON.stringify(masterDatabase, null, 2));
console.log(`Wrote master database to: ${backendDataPath}`);

// 8. Write to frontend as ES module
const frontendDataDir = path.join(__dirname, '..', 'frontend', 'src', 'data');
if (!fs.existsSync(frontendDataDir)) {
  fs.mkdirSync(frontendDataDir, { recursive: true });
}
const frontendJsPath = path.join(frontendDataDir, 'indiaTourismData.js');
const esmContent = `// LukAround - Master India Tourism Database (Frontend ES Module)
// Automatically generated with complete schemas for all 15 Priority States, 77 Cities, and 198+ Attractions.

export const metadata = ${JSON.stringify(masterDatabase.metadata, null, 2)};
export const states = ${JSON.stringify(masterDatabase.states, null, 2)};
export const cities = ${JSON.stringify(masterDatabase.cities, null, 2)};
export const attractions = ${JSON.stringify(masterDatabase.attractions, null, 2)};
export const categories = ${JSON.stringify(masterDatabase.categories, null, 2)};
export const travelStyles = ${JSON.stringify(masterDatabase.travelStyles, null, 2)};
export const itineraries = ${JSON.stringify(masterDatabase.itineraries, null, 2)};

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

fs.writeFileSync(frontendJsPath, esmContent);
console.log(`Wrote frontend ES module to: ${frontendJsPath}`);

console.log('Master database compilation complete!');
