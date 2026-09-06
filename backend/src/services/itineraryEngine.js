/**
 * Luk Around - Isolated Itinerary Generation Engine
 * Rule-Based Clustering & Sequencing Algorithm
 */

const MOCK_ATTRACTIONS_BY_CITY = {
  'bangalore': [
    { id: 1, name: 'Lalbagh Botanical Garden', category: 'Nature', description: '240-acre glasshouse botanical garden.', entryFeeInr: 30, openingHours: '6:00 AM - 7:00 PM', rating: 4.6, latitude: 12.9507, longitude: 77.5848, place_id: 'ChIJz-n2-7QUrjsRu67v16t34E', durationMins: 120, idealTimeOfDay: 'morning', crowdLevelByHour: 'Low 6:00-9:00 AM', notes: 'Early morning is best for pleasant walking weather and bird watching.' },
    { id: 2, name: 'Bangalore Palace', category: 'Historical', description: 'Tudor-style royal palace inspired by Windsor Castle.', entryFeeInr: 240, openingHours: '10:00 AM - 5:30 PM', rating: 4.5, latitude: 12.9988, longitude: 77.5922, place_id: 'ChIJ0_q3_8QUrjsRv78w27u45E', durationMins: 90, idealTimeOfDay: 'afternoon', crowdLevelByHour: 'High 1:00-4:00 PM', notes: 'Audio tour included in ticket. Photography fee applies.' },
    { id: 3, name: 'Cubbon Park', category: 'Nature', description: '300-acre green lung of the city.', entryFeeInr: 0, openingHours: '6:00 AM - 6:00 PM', rating: 4.6, latitude: 12.9763, longitude: 77.5929, place_id: 'ChIJ1_r4_9QUrjsRw89x38v56E', durationMins: 90, idealTimeOfDay: 'morning', crowdLevelByHour: 'Low in early morning', notes: 'No traffic on Sundays. Great for jogging.' },
    { id: 4, name: 'ISKCON Temple Bangalore', category: 'Spiritual', description: 'Grand neo-classical Dravidian shrine.', entryFeeInr: 0, openingHours: '4:15 AM - 8:30 PM', rating: 4.7, latitude: 13.0098, longitude: 77.5511, place_id: 'ChIJ2_s5_0QUrjsRx90y49w67E', durationMins: 60, idealTimeOfDay: 'evening', crowdLevelByHour: 'High 5:00-7:30 PM', notes: 'Prasadam distributed after evening Aarti.' },
    { id: 5, name: 'Visvesvaraya Industrial & Technological Museum', category: 'Science', description: 'Interactive science museum.', entryFeeInr: 85, openingHours: '9:30 AM - 6:00 PM', rating: 4.5, latitude: 12.9752, longitude: 77.5960, place_id: 'ChIJ3_t6_1QUrjsRy01z50x78E', durationMins: 120, idealTimeOfDay: 'afternoon', crowdLevelByHour: 'Moderate 11:00 AM-2:00 PM', notes: 'Great indoor spot to escape afternoon heat.' }
  ],
  'goa': [
    { id: 6, name: 'Basilica of Bom Jesus', category: 'Historical', description: 'UNESCO World Heritage 16th-century church in Old Goa.', entryFeeInr: 0, openingHours: '9:00 AM - 6:30 PM', rating: 4.7, latitude: 15.5009, longitude: 73.9116, place_id: 'ChIJ4_u7_267vzsRz12a61y89E', durationMins: 60, idealTimeOfDay: 'morning', crowdLevelByHour: 'Low 9:00-10:30 AM', notes: 'Modest dress code required inside sanctuary.' },
    { id: 7, name: 'Aguada Fort', category: 'Historical', description: '17th-century Portuguese fortress and lighthouse.', entryFeeInr: 50, openingHours: '9:30 AM - 6:00 PM', rating: 4.5, latitude: 15.4924, longitude: 73.7737, place_id: 'ChIJ5_v8_367vzsR023b72z90E', durationMins: 90, idealTimeOfDay: 'evening', crowdLevelByHour: 'High 4:30-6:00 PM (Sunset)', notes: 'Panoramas of Arabian Sea sunset are world-class.' },
    { id: 8, name: 'Calangute Beach', category: 'Beach', description: 'Queen of Beaches in North Goa.', entryFeeInr: 0, openingHours: 'Open 24 Hours', rating: 4.4, latitude: 15.5494, longitude: 73.7535, place_id: 'ChIJ6_w9_467vzsR134c830a12E', durationMins: 120, idealTimeOfDay: 'evening', crowdLevelByHour: 'High late afternoon', notes: 'Water sports operators active till 5:30 PM.' },
    { id: 9, name: 'Dudhsagar Waterfalls', category: 'Nature', description: 'Four-tiered 310m waterfall in Bhagwan Mahaveer Sanctuary.', entryFeeInr: 100, openingHours: '6:00 AM - 5:00 PM', rating: 4.8, latitude: 15.3144, longitude: 74.3143, place_id: 'ChIJ7_x0_567vzsR245d941b23E', durationMins: 240, idealTimeOfDay: 'morning', crowdLevelByHour: 'High mid-morning', notes: 'Jeep safari required from Kolem station.' }
  ],
  'chennai': [
    { id: 10, name: 'Marina Beach', category: 'Beach', description: 'World second longest urban beach.', entryFeeInr: 0, openingHours: 'Open 24 Hours', rating: 4.5, latitude: 13.0499, longitude: 80.2824, place_id: 'ChIJ8_y1_6plUjoR356e052c34E', durationMins: 90, idealTimeOfDay: 'evening', crowdLevelByHour: 'High 5:00-8:00 PM', notes: 'Enjoy seaside breeze and fresh sundal snacks.' },
    { id: 11, name: 'Kapaleeshwarar Temple', category: 'Spiritual', description: '7th-century Dravidian temple with 37m gopuram.', entryFeeInr: 0, openingHours: '5:00 AM - 9:00 PM', rating: 4.8, latitude: 13.0335, longitude: 80.2693, place_id: 'ChIJ9_z2_7plUjoR467f163d45E', durationMins: 60, idealTimeOfDay: 'morning', crowdLevelByHour: 'Low 6:00-8:00 AM', notes: 'Traditional filter coffee stalls nearby.' }
  ],
  'jaipur': [
    { id: 12, name: 'Hawa Mahal', category: 'Architecture', description: 'Pink sandstone Palace of Winds with 953 windows.', entryFeeInr: 200, openingHours: '9:00 AM - 5:00 PM', rating: 4.6, latitude: 26.9239, longitude: 75.8267, place_id: 'ChIJJbB3hEu-bTkRz0yL0gG3xjw', durationMins: 60, idealTimeOfDay: 'morning', crowdLevelByHour: 'Low 9:00-10:30 AM', notes: 'Morning sunlight glows directly on the pink facade, perfect for photos.' },
    { id: 13, name: 'City Palace Jaipur', category: 'Historical', description: 'Royal palace blending Rajput & Mughal design.', entryFeeInr: 300, openingHours: '9:30 AM - 5:00 PM', rating: 4.6, latitude: 26.9258, longitude: 75.8237, place_id: 'ChIJ_Y9_zUu-bTkRq2e2V_w7K-A', durationMins: 120, idealTimeOfDay: 'afternoon', crowdLevelByHour: 'High 2:00-4:30 PM', notes: 'Shaded palace corridors and indoor royal textile museum make this a great midday visit.' },
    { id: 14, name: 'Nahargarh Fort', category: 'Historical', description: 'Fortress offering sunset views of Pink City.', entryFeeInr: 200, openingHours: '10:00 AM - 10:00 PM', rating: 4.7, latitude: 26.9378, longitude: 75.8155, place_id: 'ChIJa_14_9--bTkR689h385f67E', durationMins: 120, idealTimeOfDay: 'evening', crowdLevelByHour: 'High 5:00-7:30 PM (Sunset)', notes: 'Famous Padao rooftop bar offers spectacular sunset views over Pink City skyline.' },
    { id: 15, name: 'Amber Palace (Amer Fort)', category: 'Historical', description: 'Majestic hilltop fort with Sheesh Mahal mirror palace.', entryFeeInr: 500, openingHours: '8:00 AM - 5:30 PM', rating: 4.8, latitude: 26.9855, longitude: 75.8513, place_id: 'ChIJFae3pU--bTkR3WshzK_Lwio', durationMins: 150, idealTimeOfDay: 'morning', crowdLevelByHour: 'High 10:00 AM-1:00 PM', notes: 'Elephant or jeep ride up fort ramparts available.' }
  ],
  'agra': [
    { id: 16, name: 'Taj Mahal', category: 'Wonder', description: 'Iconic white marble mausoleum of love built by Shah Jahan.', entryFeeInr: 1100, openingHours: 'Sunrise to Sunset (Closed Fridays)', rating: 4.9, latitude: 27.1751, longitude: 78.0421, place_id: 'ChIJk2b4_V1FddkRN387cWn_01E', durationMins: 180, idealTimeOfDay: 'morning', crowdLevelByHour: 'Low at Sunrise (5:45 AM)', notes: 'Enter via East Gate at sunrise for soft golden light and short security queues.' },
    { id: 17, name: 'Agra Fort', category: 'Historical', description: 'Massive red sandstone Mughal imperial city.', entryFeeInr: 600, openingHours: '6:00 AM - 6:00 PM', rating: 4.7, latitude: 27.1795, longitude: 78.0211, place_id: 'ChIJmZ5m6S1FddkRUXuH3v463uM', durationMins: 120, idealTimeOfDay: 'afternoon', crowdLevelByHour: 'Moderate 1:00-3:30 PM', notes: 'Diwan-i-Khas balcony offers stunning framed views of Taj Mahal across Yamuna River.' },
    { id: 18, name: 'Mehtab Bagh', category: 'Nature', description: 'Charbagh garden complex directly facing Taj Mahal across Yamuna.', entryFeeInr: 300, openingHours: '6:00 AM - 6:00 PM', rating: 4.5, latitude: 27.1800, longitude: 78.0418, place_id: 'ChIJb_25_01FddkR790i496g78E', durationMins: 75, idealTimeOfDay: 'evening', crowdLevelByHour: 'High 4:30-6:00 PM (Sunset)', notes: 'Unobstructed sunset reflections of Taj Mahal without crowds.' }
  ],
  'kochin': [
    { id: 19, name: 'Chinese Fishing Nets Fort Kochi', category: 'Cultural', description: 'Fixed cantilevered land installations set up by Chinese traders.', entryFeeInr: 0, openingHours: 'Open 24 Hours', rating: 4.5, latitude: 9.9674, longitude: 76.2431, place_id: 'ChIJc_36_176CDsR801j507h89E', durationMins: 60, idealTimeOfDay: 'evening', crowdLevelByHour: 'High 5:00-6:30 PM (Sunset)', notes: 'Silhouettes against Arabian Sea sunset create iconic photography.' },
    { id: 20, name: 'Mattancherry Palace (Dutch Palace)', category: 'Historical', description: 'Portuguese built palace featuring famous Hindu murals.', entryFeeInr: 5, openingHours: '9:45 AM - 1:00 PM, 2:00 PM - 4:45 PM (Closed Fridays)', rating: 4.4, latitude: 9.9583, longitude: 76.2594, place_id: 'ChIJd_47_276CDsR912k618i90E', durationMins: 60, idealTimeOfDay: 'morning', crowdLevelByHour: 'Moderate 10:00-11:30 AM', notes: 'Unique 16th century Kerala royal murals detailing Ramayana epics.' }
  ],
  'pondicherry': [
    { id: 21, name: 'Sri Aurobindo Ashram', category: 'Spiritual', description: 'Spiritual community founded by Sri Aurobindo in 1926.', entryFeeInr: 0, openingHours: '8:00 AM - 12:00 PM, 2:00 PM - 6:00 PM', rating: 4.6, latitude: 11.9360, longitude: 79.8340, place_id: 'ChIJe_58_39fUjoR023l729j01E', durationMins: 60, idealTimeOfDay: 'morning', crowdLevelByHour: 'Low 8:00-9:30 AM', notes: 'Maintain silence inside main Samadhi courtyard.' },
    { id: 22, name: 'Promenade Beach (Rock Beach)', category: 'Beach', description: '1.2km iconic seaside rock walkway.', entryFeeInr: 0, openingHours: 'Pedestrian only 5:00 PM - 6:00 AM', rating: 4.7, latitude: 11.9338, longitude: 79.8358, place_id: 'ChIJf_69_49fUjoR134m830k12E', durationMins: 90, idealTimeOfDay: 'evening', crowdLevelByHour: 'High 5:30-8:00 PM', notes: 'Vehicles banned in evening creating peaceful walking environment.' }
  ],
  'yercaud': [
    { id: 23, name: 'Yercaud Emerald Lake & Boat House', category: 'Nature', description: 'Picturesque natural lake surrounded by gardens and pine forests.', entryFeeInr: 30, openingHours: '9:00 AM - 5:30 PM', rating: 4.5, latitude: 11.7758, longitude: 78.2094, place_id: 'ChIJg_70_5g_qzsR245n941l23E', durationMins: 90, idealTimeOfDay: 'morning', crowdLevelByHour: 'Low 9:00-10:30 AM', notes: 'Pedal and motor boating available in calm morning waters.' },
    { id: 24, name: 'Lady\'s Seat Viewpoint', category: 'Nature', description: 'Natural rock formation offering panoramic views of Salem city valley.', entryFeeInr: 10, openingHours: '7:00 AM - 7:00 PM', rating: 4.6, latitude: 11.7681, longitude: 78.2045, place_id: 'ChIJh_81_6g_qzsR356o052m34E', durationMins: 60, idealTimeOfDay: 'evening', crowdLevelByHour: 'High 4:30-6:00 PM (Sunset)', notes: 'Telescope house available for viewing valley and hairpin turns below.' }
  ],
  'delhi': [
    { id: 25, name: 'Red Fort (Lal Qila)', category: 'Historical', description: 'Iconic 17th-century red sandstone Mughal fortress complex.', entryFeeInr: 50, openingHours: '9:30 AM - 4:30 PM (Closed Mondays)', rating: 4.5, latitude: 28.6562, longitude: 77.2410, place_id: 'ChIJi_92_7v9DDkR467p163n45E', durationMins: 120, idealTimeOfDay: 'morning', crowdLevelByHour: 'High 11:00 AM-2:00 PM', notes: 'Wear comfortable walking shoes. Sound & Light show available in evening.' },
    { id: 26, name: 'Qutub Minar', category: 'Historical', description: 'UNESCO World Heritage 73-meter brick minaret with intricate carvings.', entryFeeInr: 40, openingHours: '7:00 AM - 5:00 PM', rating: 4.6, latitude: 28.5244, longitude: 77.1855, place_id: 'ChIJj_03_8v9DDkR578q274o56E', durationMins: 90, idealTimeOfDay: 'morning', crowdLevelByHour: 'Low 8:00-9:30 AM', notes: 'Beautiful lush gardens surrounding monument. Great for photography.' },
    { id: 27, name: 'Humayun\'s Tomb', category: 'Historical', description: 'Stunning garden tomb precursor to Taj Mahal built in 1570.', entryFeeInr: 50, openingHours: '6:00 AM - 6:00 PM', rating: 4.7, latitude: 28.5933, longitude: 77.2507, place_id: 'ChIJk_14_9v9DDkR689r385p67E', durationMins: 100, idealTimeOfDay: 'afternoon', crowdLevelByHour: 'Moderate 2:00-4:00 PM', notes: 'Shaded charbagh gardens offer cool walk even during afternoon hours.' },
    { id: 28, name: 'India Gate & Kartavya Path', category: 'Monuments', description: 'Grand 42m war memorial arch flanked by ceremonial lawns.', entryFeeInr: 0, openingHours: 'Open 24 Hours', rating: 4.6, latitude: 28.6129, longitude: 77.2295, place_id: 'ChIJl_25_0v9DDkR790s496q78E', durationMins: 60, idealTimeOfDay: 'evening', crowdLevelByHour: 'High 6:00-8:30 PM', notes: 'Spectacular night illumination and street food vendors near lawns.' }
  ],
  'munnar': [
    { 
      id: 29, 
      name: 'Eravikulam National Park (Rajamalai)', 
      category: 'Nature', 
      description: 'Sanctuary for the endangered Nilgiri Tahr mountain goats with rolling shola grasslands under Anamudi Peak (2,695m).', 
      entryFeeInr: 200, 
      openingHours: '7:30 AM - 4:00 PM (Closed Feb-March for calving)', 
      rating: 4.8, 
      latitude: 10.1500, 
      longitude: 77.0667, 
      place_id: 'ChIJ8yv4cKtmBzsR_kY0c8-k-qU',
      durationMins: 180, 
      idealTimeOfDay: 'morning', 
      crowdLevelByHour: 'Low 7:30-9:00 AM, Peak 10:30 AM-1:30 PM', 
      notes: 'Book park tickets online in advance. Forest safari buses take visitors up through misty cloud forests.',
      imageUrl: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80'
    },
    { 
      id: 30, 
      name: 'KDHP Tata Tea Museum & Factory', 
      category: 'Cultural', 
      description: 'Century-old tea processing factory showcasing tea manufacturing, manual rolling machines, and live tea tasting sessions.', 
      entryFeeInr: 125, 
      openingHours: '9:00 AM - 5:00 PM (Closed Mondays)', 
      rating: 4.7, 
      latitude: 10.0889, 
      longitude: 77.0597, 
      place_id: 'ChIJw_92e85mBzsR-7f7Cg_E4-g',
      durationMins: 90, 
      idealTimeOfDay: 'morning', 
      crowdLevelByHour: 'Moderate 10:00 AM-1:00 PM', 
      notes: 'Watch the informative documentary film on Munnar tea heritage and taste fresh premium single-estate brews.',
      imageUrl: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80'
    },
    { 
      id: 31, 
      name: 'Mattupetty Dam & Lake', 
      category: 'Nature', 
      description: 'Scenic concrete gravity dam offering high-speed boating, pine forest trails, and elephant corridor sightings.', 
      entryFeeInr: 50, 
      openingHours: '9:30 AM - 5:00 PM', 
      rating: 4.5, 
      latitude: 10.1052, 
      longitude: 77.1235, 
      place_id: 'ChIJq0X3k4xnBzsR6j24F4tP_uU',
      durationMins: 90, 
      idealTimeOfDay: 'afternoon', 
      crowdLevelByHour: 'Moderate 1:00-3:30 PM', 
      notes: 'Speedboat rides provide stunning views of reflection waters framed by tea hills. Look out for wild elephants.',
      imageUrl: 'https://images.unsplash.com/photo-1616484178591-68c379ebf48c?auto=format&fit=crop&w=800&q=80'
    },
    { 
      id: 32, 
      name: 'Top Station & Valley Viewpoint', 
      category: 'Nature', 
      description: 'Highest viewpoint on the Munnar-Kodaikanal road (1,880m) offering 360-degree views of the Western Ghats and Theni Valley.', 
      entryFeeInr: 50, 
      openingHours: '6:00 AM - 6:30 PM', 
      rating: 4.9, 
      latitude: 10.1245, 
      longitude: 77.2435, 
      place_id: 'ChIJy4v1gXhnBzsR8u27H6mP8wQ',
      durationMins: 120, 
      idealTimeOfDay: 'evening', 
      crowdLevelByHour: 'Moderate at 4:00-6:00 PM (Sunset)', 
      notes: 'Historic terminus of the Kundala Valley railway. Unmatched sea of clouds view during sunrise and sunset.',
      imageUrl: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80'
    },
    { 
      id: 33, 
      name: 'Attukad Waterfalls & Spice Groves', 
      category: 'Nature', 
      description: 'Dramatic multi-tiered cascade surrounded by cardamom, pepper, and cinnamon plantations.', 
      entryFeeInr: 0, 
      openingHours: '6:00 AM - 6:00 PM', 
      rating: 4.6, 
      latitude: 10.0578, 
      longitude: 77.0421, 
      place_id: 'ChIJm1p8s65mBzsR7f39I7kQ9wE',
      durationMins: 75, 
      idealTimeOfDay: 'morning', 
      crowdLevelByHour: 'Low 8:00-10:30 AM', 
      notes: 'Narrow wooden bridge offers prime photo angles. Best visited right after monsoon for roaring water volume.',
      imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
    },
    { 
      id: 34, 
      name: 'Kundala Arch Dam & Shikara Lake', 
      category: 'Nature', 
      description: 'Asia’s first arch dam with tranquil boating on Kashmiri Shikaras amidst fragrant eucalyptus and pine groves.', 
      entryFeeInr: 40, 
      openingHours: '9:00 AM - 5:00 PM', 
      rating: 4.6, 
      latitude: 10.1340, 
      longitude: 77.1680, 
      place_id: 'ChIJn2q9t75mBzsR8g40J8lR0xE',
      durationMins: 90, 
      idealTimeOfDay: 'afternoon', 
      crowdLevelByHour: 'Moderate 2:00-4:30 PM', 
      notes: 'Rent a pedal boat or shikara to explore the quiet lake surrounded by purple Neela Kurinji slopes.',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Munnar_Kundala_Dam_%284224019133%29.jpg/960px-Munnar_Kundala_Dam_%284224019133%29.jpg'
    }
  ],
  'varanasi': [
    { id: 32, name: 'Dashashwamedh Ghat & Ganga Aarti', category: 'Spiritual', description: 'Sacred main ghat famous for grand evening Ganga Aarti ceremony.', entryFeeInr: 0, openingHours: 'Open 24 Hours (Aarti @ 6:30 PM)', rating: 4.9, latitude: 25.3076, longitude: 83.0104, place_id: 'ChIJ27w4n4_sjjkR2gZ8-fG7k-0', durationMins: 120, idealTimeOfDay: 'evening', crowdLevelByHour: 'High 5:30-8:00 PM', notes: 'Arrive by 5:30 PM or hire a rowboat for best Aarti ceremony views.' },
    { id: 33, name: 'Kashi Vishwanath Temple', category: 'Spiritual', description: 'One of the 12 sacred Jyotirlingas, features golden temple spire.', entryFeeInr: 0, openingHours: '3:00 AM - 11:00 PM', rating: 4.8, latitude: 25.3109, longitude: 83.0107, place_id: 'ChIJw89_64_sjjkR3hA9-gH8l-1', durationMins: 90, idealTimeOfDay: 'morning', crowdLevelByHour: 'High 6:00-9:00 AM', notes: 'Mobile phones and electronics must be deposited in secure locker counters.' },
    { id: 34, name: 'Sarnath Buddhist Complex', category: 'Historical', description: 'Sacred deer park site where Lord Buddha delivered his first sermon.', entryFeeInr: 25, openingHours: '8:00 AM - 6:00 PM', rating: 4.7, latitude: 25.3762, longitude: 83.0227, place_id: 'ChIJx90_74_sjjkR4iB0-hI9m-2', durationMins: 120, idealTimeOfDay: 'afternoon', crowdLevelByHour: 'Low 1:00-3:00 PM', notes: 'Peaceful monastery grounds with Ashoka Pillar and archaeological museum.' }
  ]
};

// Haversine distance formula (in km)
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 2.5;
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round((R * c) * 10) / 10;
}

// Inter-stop transit calculation
function calculateInterStopTransit(fromStop, toStop) {
  if (!fromStop || !toStop) return null;

  const distanceKm = calculateHaversineDistance(
    fromStop.latitude, fromStop.longitude,
    toStop.latitude, toStop.longitude
  );

  let recommendedMode = 'Auto Rickshaw';
  let modes = [];

  if (distanceKm <= 1.2) {
    recommendedMode = 'Walking';
    modes = [
      { mode: 'Walking', recommended: true, fareInr: 0, timeMins: Math.ceil(distanceKm * 10), icon: 'walk', tips: 'Short scenic walk between nearby attractions.' },
      { mode: 'Auto Rickshaw', recommended: false, fareInr: 35, timeMins: 5, icon: 'auto', tips: 'Best for short city hops.' },
      { mode: 'Cab / Taxi App', recommended: false, fareInr: 60, timeMins: 5, icon: 'cab', tips: 'AC comfort via Uber/Ola app.' }
    ];
  } else if (distanceKm <= 4.0) {
    recommendedMode = 'Auto Rickshaw';
    modes = [
      { mode: 'Auto Rickshaw', recommended: true, fareInr: Math.round(30 + distanceKm * 14), timeMins: Math.ceil(distanceKm * 4 + 3), icon: 'auto', tips: 'Best for short city hops. Demand meter or negotiate fare.' },
      { mode: 'Cab / Taxi App', recommended: false, fareInr: Math.round(50 + distanceKm * 21), timeMins: Math.ceil(distanceKm * 3.5 + 2), icon: 'cab', tips: 'AC comfort via Uber/Ola app.' }
    ];
  } else {
    recommendedMode = 'Cab / Taxi App';
    modes = [
      { mode: 'Cab / Taxi App', recommended: true, fareInr: Math.round(50 + distanceKm * 22), timeMins: Math.ceil(distanceKm * 3 + 4), icon: 'cab', tips: 'AC comfort for longer city distance.' },
      { mode: 'Auto Rickshaw', recommended: false, fareInr: Math.round(30 + distanceKm * 15), timeMins: Math.ceil(distanceKm * 4 + 5), icon: 'auto', tips: 'Traditional open-air city transit.' },
      { mode: 'City Bus / Metro', recommended: false, fareInr: 20, timeMins: Math.ceil(distanceKm * 4.5 + 8), icon: 'bus', tips: 'Budget transit option.' }
    ];
  }

  return {
    from: fromStop.name,
    to: toStop.name,
    distanceKm: distanceKm,
    recommendedMode: recommendedMode,
    modes: modes
  };
}

// Sequence attractions by ideal time of day
function sequenceClusterByTimeOfDay(cluster) {
  const timeOrder = { 'morning': 1, 'afternoon': 2, 'evening': 3 };
  return [...cluster].sort((a, b) => {
    const orderA = timeOrder[(a.idealTimeOfDay || a.ideal_time_of_day || '').toLowerCase()] || 2;
    const orderB = timeOrder[(b.idealTimeOfDay || b.ideal_time_of_day || '').toLowerCase()] || 2;
    return orderA - orderB;
  });
}

function generateDayWiseItinerary(attractionsInput, numDays) {
  let attractionsList = [];
  if (Array.isArray(attractionsInput) && attractionsInput.length > 0) {
    attractionsList = attractionsInput;
  } else if (typeof attractionsInput === 'string') {
    const cityKey = attractionsInput.trim().toLowerCase();
    const matchedKey = Object.keys(MOCK_ATTRACTIONS_BY_CITY).find(k => cityKey.includes(k) || k.includes(cityKey)) || 'bangalore';
    attractionsList = MOCK_ATTRACTIONS_BY_CITY[matchedKey] || MOCK_ATTRACTIONS_BY_CITY['bangalore'];
  } else {
    attractionsList = MOCK_ATTRACTIONS_BY_CITY['bangalore'];
  }

  const validDays = Math.min(Math.max(parseInt(numDays) || 1, 1), 10);
  const dayClusters = Array.from({ length: validDays }, () => []);

  attractionsList.forEach((attraction, index) => {
    const dayIndex = index % validDays;
    dayClusters[dayIndex].push(attraction);
  });

  const formattedItinerary = dayClusters.map((cluster, dayIdx) => {
    const dayNum = dayIdx + 1;
    const sequencedStops = sequenceClusterByTimeOfDay(cluster);

    let currentTimeMins = 9 * 60; // Start at 9:00 AM

    const formattedStops = sequencedStops.map((stop, stopIdx) => {
      const startHours = Math.floor(currentTimeMins / 60);
      const startMins = currentTimeMins % 60;
      const startAmPm = startHours >= 12 ? 'PM' : 'AM';
      const formattedStartHours = startHours > 12 ? startHours - 12 : (startHours === 0 ? 12 : startHours);
      const startTimeStr = `${formattedStartHours}:${startMins < 10 ? '0' : ''}${startMins} ${startAmPm}`;

      const visitDuration = parseInt(stop.avg_visit_duration_mins || stop.durationMins || 90);
      currentTimeMins += visitDuration;

      const endHours = Math.floor(currentTimeMins / 60);
      const endMins = currentTimeMins % 60;
      const endAmPm = endHours >= 12 ? 'PM' : 'AM';
      const formattedEndHours = endHours > 12 ? endHours - 12 : (endHours === 0 ? 12 : endHours);
      const endTimeStr = `${formattedEndHours}:${endMins < 10 ? '0' : ''}${endMins} ${endAmPm}`;

      const nextStopInCluster = sequencedStops[stopIdx + 1] || null;
      const transitInfo = nextStopInCluster ? calculateInterStopTransit(stop, nextStopInCluster) : null;

      currentTimeMins += 25; // 25 mins transit gap

      return {
        id: stop.id,
        name: stop.name,
        order: stopIdx + 1,
        suggestedTime: `${startTimeStr} - ${endTimeStr}`,
        durationMins: visitDuration,
        category: stop.category || 'Sightseeing',
        description: stop.description || '',
        entryFeeInr: parseFloat(stop.entry_fee_inr || stop.entryFeeInr || 0),
        rating: parseFloat(stop.rating || 4.5),
        latitude: parseFloat(stop.latitude || 0),
        longitude: parseFloat(stop.longitude || 0),
        lat: parseFloat(stop.latitude || 0),
        lng: parseFloat(stop.longitude || 0),
        place_id: stop.place_id || '',
        imageUrl: stop.image_url || stop.imageUrl || '',
        openingHours: stop.opening_hours || stop.openingHours || '9:00 AM - 6:00 PM',
        idealTimeOfDay: stop.ideal_time_of_day || stop.idealTimeOfDay || 'morning',
        crowdLevelByHour: stop.crowd_level_by_hour || stop.crowdLevelByHour || 'Moderate',
        notes: stop.notes || '',
        transitToNext: transitInfo
      };
    });

    const categories = Array.from(new Set(formattedStops.map(s => s.category))).filter(Boolean);
    const dayTitle = categories.length > 0
      ? `Day ${dayNum}: ${categories.slice(0, 2).join(' & ')} Sights`
      : `Day ${dayNum}: City Exploration`;

    return {
      day: dayNum,
      title: dayTitle,
      stops: formattedStops
    };
  });

  return formattedItinerary;
}

module.exports = {
  generateDayWiseItinerary,
  generateRuleBasedItinerary: generateDayWiseItinerary,
  calculateHaversineDistance,
  calculateInterStopTransit,
  MOCK_ATTRACTIONS_BY_CITY
};
