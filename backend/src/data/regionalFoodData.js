/**
 * Regional Food Database (Backend CommonJS module)
 * Iconic, must-try culinary specialties across all 15 prioritized Indian states.
 */
const regionalFoodData = [
  {
    "id": "tn-madurai-jigarthanda",
    "name": "Madurai Jigarthanda",
    "state": "Tamil Nadu",
    "stateSlug": "tamil-nadu",
    "city": "Madurai",
    "citySlug": "madurai",
    "category": "Beverage & Dessert",
    "dietary": "Vegetarian",
    "description": "A legendary chilled royal beverage made with badam pisin (almond gum), nannari sarsaparilla syrup, boiled full-cream milk, and creamy basundi/ice cream. A GI-tagged pride of Madurai.",
    "regionalRelevance": "Highest",
    "bestKnownIn": [
      "Madurai"
    ],
    "iconicLocations": [
      "Vilakkuthoon",
      "East Marret Street",
      "Near Meenakshi Amman Temple"
    ],
    "servingStyle": "Served ice-cold in tall glasses, topped with rich basundi scoop",
    "dishTags": [
      "Local Specialty",
      "Must-Try",
      "Vegetarian",
      "Dessert"
    ],
    "knownEstablishments": [
      "Famous Jigarthanda",
      "Murugan Idli Shop",
      "Sree Sabarees"
    ],
    "image": "https://upload.wikimedia.org/wikipedia/commons/4/46/Jigarthanda.JPG",
    "imageAlt": "Authentic Madurai Jigarthanda cold royal beverage with basundi ice cream",
    "imageCredit": "Photo: Wikimedia Commons",
    "imageLicense": "CC BY-SA 3.0",
    "imageSourceName": "Wikimedia Commons",
    "verified": true
  },
  {
    "id": "tn-madurai-bun-parotta",
    "name": "Madurai Bun Parotta",
    "state": "Tamil Nadu",
    "stateSlug": "tamil-nadu",
    "city": "Madurai",
    "citySlug": "madurai",
    "category": "Street Food & Local Specialty",
    "dietary": "Non-Vegetarian Options Available",
    "description": "Crispy on the outside, fluffy and layered like a bun on the inside, cooked on cast-iron griddles with generous butter, served alongside spicy local mutton or chicken salna.",
    "regionalRelevance": "High",
    "bestKnownIn": [
      "Madurai"
    ],
    "iconicLocations": [
      "KK Nagar",
      "Town Hall Road"
    ],
    "dishTags": [
      "Local Specialty",
      "Street Food",
      "Must-Try"
    ],
    "knownEstablishments": [
      "Kumar Mess",
      "Amma Mess",
      "Simmakkal Konar Mess"
    ],
    "image": "https://upload.wikimedia.org/wikipedia/commons/a/ae/Parotta_2.jpg",
    "imageAlt": "Layered fluffy South Indian Parotta with spicy salna",
    "imageCredit": "Photo: Wikimedia Commons",
    "imageLicense": "CC BY-SA 4.0",
    "imageSourceName": "Wikimedia Commons",
    "verified": true
  },
  {
    "id": "tn-madurai-kari-dosa",
    "name": "Kari Dosa",
    "state": "Tamil Nadu",
    "stateSlug": "tamil-nadu",
    "city": "Madurai",
    "citySlug": "madurai",
    "category": "Local Specialty",
    "dietary": "Non-Vegetarian",
    "description": "A three-layered specialty dosa featuring a thick rice-batter base, an omelette center, and a rich topping of minced spiced mutton (keema) slow-roasted to perfection.",
    "regionalRelevance": "High",
    "bestKnownIn": [
      "Madurai"
    ],
    "dishTags": [
      "Local Specialty",
      "Non-Vegetarian",
      "Must-Try"
    ],
    "knownEstablishments": [
      "Amma Mess",
      "Kumar Mess",
      "Konar Kadai"
    ],
    "image": "https://upload.wikimedia.org/wikipedia/commons/6/6c/Kari_dosai.JPG",
    "imageAlt": "Madurai Kari Dosai layered with spiced minced meat and eggs",
    "imageCredit": "Photo: Wikimedia Commons",
    "imageLicense": "CC BY-SA 4.0",
    "imageSourceName": "Wikimedia Commons",
    "verified": true
  },
  {
    "id": "tn-chennai-filter-coffee",
    "name": "Madras Filter Degree Coffee",
    "state": "Tamil Nadu",
    "stateSlug": "tamil-nadu",
    "city": "Chennai",
    "citySlug": "chennai",
    "category": "Beverage",
    "dietary": "Vegetarian",
    "description": "Dark-roasted coffee chicory decoction brewed through a traditional brass filter, frothed with boiled full-cream milk, and served in a classic stainless steel davarah and tumbler.",
    "regionalRelevance": "Highest",
    "bestKnownIn": [
      "Chennai",
      "Coimbatore",
      "Thanjavur"
    ],
    "dishTags": [
      "Breakfast",
      "Beverage",
      "Vegetarian",
      "Iconic"
    ],
    "knownEstablishments": [
      "Saravana Bhavan",
      "Murugan Idli Shop",
      "Ratna Cafe",
      "Sangeetha Veg Restaurant"
    ],
    "image": "https://upload.wikimedia.org/wikipedia/commons/5/51/Filter_kaapi.JPG",
    "imageAlt": "Traditional South Indian Madras Filter Coffee in brass davarah tumbler",
    "imageCredit": "Photo: Wikimedia Commons",
    "imageLicense": "CC BY-SA 3.0",
    "imageSourceName": "Wikimedia Commons",
    "verified": true
  },
  {
    "id": "tn-chennai-idli-sambar",
    "name": "Mylapore Ghee Podi Idli & Medu Vada",
    "state": "Tamil Nadu",
    "stateSlug": "tamil-nadu",
    "city": "Chennai",
    "citySlug": "chennai",
    "category": "Breakfast & Tiffin",
    "dietary": "Vegetarian",
    "description": "Steamed fluffy fermented rice cakes tossed in aromatic spiced lentil powder (gunpowder/podi) and pure desi ghee, served with shallot sambar and coconut chutney.",
    "regionalRelevance": "Highest",
    "bestKnownIn": [
      "Chennai",
      "Madurai",
      "Coimbatore"
    ],
    "dishTags": [
      "Breakfast",
      "Vegetarian",
      "Must-Try",
      "Pure Veg"
    ],
    "knownEstablishments": [
      "Saravana Bhavan",
      "Ratna Cafe",
      "Murugan Idli Shop",
      "ID By SPI"
    ],
    "image": "https://upload.wikimedia.org/wikipedia/commons/1/11/Idli_Sambar.JPG",
    "imageAlt": "Steamed South Indian Idli with hot shallot sambar and coconut chutney",
    "imageCredit": "Photo: Wikimedia Commons",
    "imageLicense": "CC BY-SA 3.0",
    "imageSourceName": "Wikimedia Commons",
    "verified": true
  },
  {
    "id": "tn-chettinad-chicken",
    "name": "Chettinad Pepper Chicken & Kozhi Varuval",
    "state": "Tamil Nadu",
    "stateSlug": "tamil-nadu",
    "city": "Chennai",
    "citySlug": "chennai",
    "category": "Regional Cuisine",
    "dietary": "Non-Vegetarian",
    "description": "Spicy, aromatic curry cooked using freshly stone-ground kalpasi (stone flower), marathi mokku, black peppercorns, roasted coconut, and shallots.",
    "regionalRelevance": "Highest",
    "bestKnownIn": [
      "Karaikudi",
      "Chennai",
      "Madurai"
    ],
    "dishTags": [
      "Regional Cuisine",
      "Non-Vegetarian",
      "Must-Try"
    ],
    "knownEstablishments": [
      "Anjappar Chettinad",
      "Karaikudi Restaurant",
      "Ponnusamy"
    ],
    "image": "https://upload.wikimedia.org/wikipedia/commons/d/db/Chettinad_Chicken_Fry-Home-AndhraPradesh-005.jpg",
    "imageAlt": "Spicy Chettinad Pepper Chicken with stone-ground spices",
    "imageCredit": "Photo: Wikimedia Commons",
    "imageLicense": "CC BY-SA 3.0",
    "imageSourceName": "Wikimedia Commons",
    "verified": true
  },
  {
    "id": "tn-mahabalipuram-seafood",
    "name": "Mahabalipuram Coastal Fish Fry & Prawn Curry",
    "state": "Tamil Nadu",
    "stateSlug": "tamil-nadu",
    "city": "Mahabalipuram",
    "citySlug": "mahabalipuram",
    "category": "Coastal & Seafood",
    "dietary": "Non-Vegetarian",
    "description": "Fresh catch of vanjaram (king mackerel) and tiger prawns marinated in red chili, turmeric, ginger-garlic and lemon, shallow-fried over iron tawas beside the Bay of Bengal.",
    "regionalRelevance": "High",
    "bestKnownIn": [
      "Mahabalipuram"
    ],
    "dishTags": [
      "Coastal",
      "Seafood",
      "Non-Vegetarian",
      "Must-Try"
    ],
    "knownEstablishments": [
      "Moonrakers Restaurant",
      "Seashore Garden Restaurant",
      "Nautilus Cafe"
    ],
    "image": "https://upload.wikimedia.org/wikipedia/commons/0/02/Food_at_Indic_Wikimedia_Hackathon_2023_03_Karivepillai_Meen_Varuval.jpg",
    "imageAlt": "Coastal Tamil Nadu Meen Varuval spiced crisp fish fry",
    "imageCredit": "Photo: Indic Wikimedia / CC BY-SA 4.0",
    "imageLicense": "CC BY-SA 4.0",
    "imageSourceName": "Wikimedia Commons",
    "verified": true
  },
  {
    "id": "rj-jaipur-dal-baati-churma",
    "name": "Rajasthani Dal Baati Churma",
    "state": "Rajasthan",
    "stateSlug": "rajasthan",
    "city": "Jaipur",
    "citySlug": "jaipur",
    "category": "Traditional Regional Thali",
    "dietary": "Vegetarian",
    "description": "Hard wheat dough balls baked over coal and drenched in pure desi ghee, served with five-lentil panchmel dal, spicy garlic chutney, and sweet cardamom churma.",
    "regionalRelevance": "Highest",
    "bestKnownIn": [
      "Jaipur",
      "Udaipur",
      "Jodhpur"
    ],
    "dishTags": [
      "Pure Veg",
      "Must-Try",
      "Local Food",
      "Traditional"
    ],
    "knownEstablishments": [
      "Laxmi Misthan Bhandar (LMB)",
      "Chokhi Dhani",
      "Tapri The Tea House",
      "Handi Restaurant"
    ],
    "image": "https://upload.wikimedia.org/wikipedia/commons/0/0b/DalBati.jpg",
    "imageAlt": "Traditional Rajasthani Dal Baati Churma served with desi ghee",
    "imageCredit": "Photo: Wikimedia Commons",
    "imageLicense": "CC BY-SA 3.0",
    "imageSourceName": "Wikimedia Commons",
    "verified": true
  },
  {
    "id": "rj-jaipur-laal-maas",
    "name": "Royal Rajputana Laal Maas",
    "state": "Rajasthan",
    "stateSlug": "rajasthan",
    "city": "Jaipur",
    "citySlug": "jaipur",
    "category": "Royal Non-Vegetarian",
    "dietary": "Non-Vegetarian",
    "description": "Fiery Rajput warrior mutton curry prepared with hand-pounded Mathania red chilies, mustard oil, cloves, and smoked with live charcoal (dhungar method).",
    "regionalRelevance": "Highest",
    "bestKnownIn": [
      "Jaipur",
      "Udaipur",
      "Jodhpur"
    ],
    "dishTags": [
      "Royal Cuisine",
      "Non-Vegetarian",
      "Must-Try",
      "Fine Dining"
    ],
    "knownEstablishments": [
      "1135 AD (Amer Fort)",
      "Handi Restaurant",
      "Niros Restaurant",
      "Baradari at City Palace"
    ],
    "image": "https://upload.wikimedia.org/wikipedia/commons/9/97/Laal-Maans.jpg",
    "imageAlt": "Royal Rajputana Laal Maas spiced red mutton curry with Mathania chilies",
    "imageCredit": "Photo: Wikimedia Commons",
    "imageLicense": "CC BY-SA 4.0",
    "imageSourceName": "Wikimedia Commons",
    "verified": true
  },
  {
    "id": "rj-jaipur-pyaaz-kachori",
    "name": "Rawat Pyaaz Kachori & Mawa Kachori",
    "state": "Rajasthan",
    "stateSlug": "rajasthan",
    "city": "Jaipur",
    "citySlug": "jaipur",
    "category": "Street Food & Sweets",
    "dietary": "Vegetarian",
    "description": "Flaky, crisp golden pastry pockets filled with spicy caramelized onions, kalonji (nigella seeds), and aromatic spices, accompanied by tamarind saunth chutney.",
    "regionalRelevance": "Highest",
    "bestKnownIn": [
      "Jaipur",
      "Jodhpur"
    ],
    "dishTags": [
      "Street Food",
      "Breakfast",
      "Must-Try",
      "Vegetarian"
    ],
    "knownEstablishments": [
      "Rawat Misthan Bhandar",
      "LMB Johari Bazaar",
      "Samrat Restaurant",
      "Tapri Central"
    ],
    "image": "https://upload.wikimedia.org/wikipedia/commons/a/a8/Pyaaz_ki_Kachori.jpg",
    "imageAlt": "Crisp golden flaky Rajasthani Pyaaz ki Kachori",
    "imageCredit": "Photo: Wikimedia Commons",
    "imageLicense": "CC BY-SA 3.0",
    "imageSourceName": "Wikimedia Commons",
    "verified": true
  },
  {
    "id": "ka-mysuru-masala-dosa",
    "name": "Mysore Masala Dosa",
    "state": "Karnataka",
    "stateSlug": "karnataka",
    "city": "Mysuru",
    "citySlug": "mysuru",
    "category": "Breakfast & Tiffin",
    "dietary": "Vegetarian",
    "description": "Thick yet crispy red-tinted rice-lentil crepe slathered with fiery red garlic-chili paste, loaded with spiced potato palya, and roasted in generous dollops of pure butter.",
    "regionalRelevance": "Highest",
    "bestKnownIn": [
      "Mysuru",
      "Bengaluru"
    ],
    "dishTags": [
      "Breakfast",
      "Pure Veg",
      "Must-Try",
      "Iconic"
    ],
    "knownEstablishments": [
      "Hotel Original Vinayaka Mylari",
      "Gayatri Tiffin Room (GTR)",
      "Dasaprakash",
      "MTR"
    ],
    "image": "https://upload.wikimedia.org/wikipedia/commons/d/d9/Mysore_masala_dosa_in_Mysuru%2C_July_2013.jpg",
    "imageAlt": "Authentic Mysore Masala Dosa with red chutney and spiced potato masala",
    "imageCredit": "Photo: Wikimedia Commons",
    "imageLicense": "CC BY-SA 2.0",
    "imageSourceName": "Wikimedia Commons",
    "verified": true
  },
  {
    "id": "ka-mysuru-pak",
    "name": "Original Royal Mysore Pak",
    "state": "Karnataka",
    "stateSlug": "karnataka",
    "city": "Mysuru",
    "citySlug": "mysuru",
    "category": "Traditional Sweet",
    "dietary": "Vegetarian",
    "description": "Invented in the royal kitchens of Mysore Palace by master chef Kakasura Madappa. Made exclusively with roasted gram flour (besan), pure desi ghee, and fragrant sugar syrup.",
    "regionalRelevance": "Highest",
    "bestKnownIn": [
      "Mysuru"
    ],
    "dishTags": [
      "Sweets & Desserts",
      "Pure Veg",
      "Must-Try",
      "Heritage"
    ],
    "knownEstablishments": [
      "Guru Sweets (Descendants of Creator)",
      "Mahalakshmi Sweets",
      "Indra Sweets"
    ],
    "image": "https://upload.wikimedia.org/wikipedia/commons/f/ff/Mysore_pak.jpg",
    "imageAlt": "Royal Mysore Pak sweet made of gram flour, sugar and pure ghee",
    "imageCredit": "Photo: Wikimedia Commons",
    "imageLicense": "CC BY-SA 3.0",
    "imageSourceName": "Wikimedia Commons",
    "verified": true
  },
  {
    "id": "ka-blr-bisi-bele-bath",
    "name": "Karnataka Bisi Bele Bath",
    "state": "Karnataka",
    "stateSlug": "karnataka",
    "city": "Bengaluru",
    "citySlug": "bengaluru",
    "category": "Traditional Regional Meal",
    "dietary": "Vegetarian",
    "description": "Hot lentil rice dish slow-cooked with toor dal, fresh seasonal vegetables, nutmeg, tamarind pulp, and roasted bisi bele bath masala, topped with ghee and boondi crisps.",
    "regionalRelevance": "Highest",
    "bestKnownIn": [
      "Bengaluru",
      "Mysuru"
    ],
    "dishTags": [
      "Pure Veg",
      "Local Food",
      "Must-Try"
    ],
    "knownEstablishments": [
      "Mavalli Tiffin Room (MTR)",
      "Vidyarthi Bhavan",
      "Central Tiffin Room (CTR)",
      "Taaza Thindi"
    ],
    "image": "https://upload.wikimedia.org/wikipedia/commons/0/04/Bisi_Bele_Bath_%28Bisibelebath%29.JPG",
    "imageAlt": "Karnataka Bisi Bele Bath hot lentil rice stew with spiced vegetables and boondi",
    "imageCredit": "Photo: Wikimedia Commons",
    "imageLicense": "CC BY-SA 3.0",
    "imageSourceName": "Wikimedia Commons",
    "verified": true
  },
  {
    "id": "up-agra-petha",
    "name": "Agra Panchhi Petha",
    "state": "Uttar Pradesh",
    "stateSlug": "uttar-pradesh",
    "city": "Agra",
    "citySlug": "agra",
    "category": "Traditional Sweet",
    "dietary": "Vegetarian",
    "description": "Translucent soft candy crafted from ash gourd (winter melon) boiled in sugar syrup and flavored with kewra water, saffron (kesar), and crushed pistachios. World-famous Agra heritage.",
    "regionalRelevance": "Highest",
    "bestKnownIn": [
      "Agra"
    ],
    "dishTags": [
      "Sweets & Desserts",
      "Must-Try",
      "Vegetarian",
      "Heritage"
    ],
    "knownEstablishments": [
      "Panchhi Petha (Hari Parvat Original)",
      "Bhagat Halwai",
      "Bikanervala Agra"
    ],
    "image": "https://upload.wikimedia.org/wikipedia/commons/b/bc/Petha_kesari.JPG",
    "imageAlt": "Agra Kesari Petha translucent candied ash gourd delicacy",
    "imageCredit": "Photo: Wikimedia Commons",
    "imageLicense": "CC BY-SA 3.0",
    "imageSourceName": "Wikimedia Commons",
    "verified": true
  },
  {
    "id": "up-varanasi-tamatar-chaat",
    "name": "Banarasi Tamatar Chaat & Palak Chaat",
    "state": "Uttar Pradesh",
    "stateSlug": "uttar-pradesh",
    "city": "Varanasi",
    "citySlug": "varanasi",
    "category": "Iconic Street Food",
    "dietary": "Vegetarian",
    "description": "Exclusive to Varanasi. Ripe tomatoes simmered with boiled potatoes, cashews, raisins, ginger, and hing, topped with a dash of sugar syrup, lemon juice, and crunchy namkeen.",
    "regionalRelevance": "Highest",
    "bestKnownIn": [
      "Varanasi"
    ],
    "dishTags": [
      "Street Food",
      "Must-Try",
      "Pure Veg",
      "Iconic"
    ],
    "knownEstablishments": [
      "Kashi Chaat Bhandar",
      "Deena Chaat Bhandar",
      "Shree Shivay",
      "Blue Lassi"
    ],
    "image": "https://upload.wikimedia.org/wikipedia/commons/7/78/Tamater_Chaat_%28Tomato_Chaat%29.jpg",
    "imageAlt": "Authentic Banarasi Tamatar Chaat served piping hot in earthenware bowl",
    "imageCredit": "Photo: Wikimedia Commons",
    "imageLicense": "CC BY-SA 3.0",
    "imageSourceName": "Wikimedia Commons",
    "verified": true
  },
  {
    "id": "up-lucknow-galouti-kebab",
    "name": "Lucknowi Galouti Kebab & Ulte Tawe Ka Parotta",
    "state": "Uttar Pradesh",
    "stateSlug": "uttar-pradesh",
    "city": "Lucknow",
    "citySlug": "lucknow",
    "category": "Royal Awadhi Cuisine",
    "dietary": "Non-Vegetarian",
    "description": "Invented for Nawab Asad-ud-Daula. Super-finely minced meat tenderized with raw papaya and over 160 secret spices, smoked with cloves and pan-seared to melt instantaneously.",
    "regionalRelevance": "Highest",
    "bestKnownIn": [
      "Lucknow"
    ],
    "dishTags": [
      "Royal Cuisine",
      "Must-Try",
      "Non-Vegetarian",
      "Heritage"
    ],
    "knownEstablishments": [
      "Tunday Kababi (Aminabad)",
      "Dastarkhwan",
      "Oudhyana at Vivanta",
      "Royal Cafe"
    ],
    "image": "https://upload.wikimedia.org/wikipedia/commons/d/d9/Galouti_Kabab_from_Tunday_Kababi_Lucknow_2009-01-06.jpg",
    "imageAlt": "Melt-in-mouth Awadhi Galouti Kebab from historic Tunday Kababi",
    "imageCredit": "Photo: Wikimedia Commons",
    "imageLicense": "CC BY-SA 2.0",
    "imageSourceName": "Wikimedia Commons",
    "verified": true
  },
  {
    "id": "kl-kochi-karimeen-pollichathu",
    "name": "Karimeen Pollichathu (Pearl Spot Fish)",
    "state": "Kerala",
    "stateSlug": "kerala",
    "city": "Kochi",
    "citySlug": "kochi",
    "category": "Coastal & Seafood",
    "dietary": "Non-Vegetarian",
    "description": "Kerala backwater pearl spot fish marinated in shallots, green chilies, ginger, and curry leaves, smothered in spicy tomato masala, wrapped in banana leaves and slow-roasted.",
    "regionalRelevance": "Highest",
    "bestKnownIn": [
      "Kochi",
      "Alappuzha",
      "Kumarakom"
    ],
    "dishTags": [
      "Seafood",
      "Coastal",
      "Must-Try",
      "Non-Vegetarian"
    ],
    "knownEstablishments": [
      "Paragon Restaurant",
      "Grand Pavilion",
      "Oceanos Seafood",
      "Fusion Bay Fort Kochi"
    ],
    "image": "https://upload.wikimedia.org/wikipedia/commons/6/6b/Karimeen_Pollichathu.jpg",
    "imageAlt": "Kerala Karimeen Pollichathu pearl spot fish roasted in banana leaf with spices",
    "imageCredit": "Photo: Wikimedia Commons",
    "imageLicense": "CC BY-SA 4.0",
    "imageSourceName": "Wikimedia Commons",
    "verified": true
  },
  {
    "id": "mh-mumbai-vada-pav",
    "name": "Mumbai Vada Pav & Pav Bhaji",
    "state": "Maharashtra",
    "stateSlug": "maharashtra",
    "city": "Mumbai",
    "citySlug": "mumbai",
    "category": "Iconic Street Food",
    "dietary": "Vegetarian",
    "description": "The heartbeat of Mumbai: spiced mashed potato fritter (batata vada) sandwiched in a soft pav, layered with spicy dry garlic chutney and fried green chilies, plus buttery mashed vegetable pav bhaji.",
    "regionalRelevance": "Highest",
    "bestKnownIn": [
      "Mumbai",
      "Pune"
    ],
    "dishTags": [
      "Street Food",
      "Must-Try",
      "Pure Veg",
      "Iconic"
    ],
    "knownEstablishments": [
      "Sardar Refreshments (Tardeo)",
      "Cannon Pav Bhaji",
      "Aaswad (Dadar)",
      "Britannia & Co."
    ],
    "image": "https://upload.wikimedia.org/wikipedia/commons/4/4e/Vada_Pav-Indian_street_food.JPG",
    "imageAlt": "Authentic Mumbai Vada Pav spiced potato fritter in bun with garlic chutney",
    "imageCredit": "Photo: Wikimedia Commons",
    "imageLicense": "CC BY-SA 3.0",
    "imageSourceName": "Wikimedia Commons",
    "verified": true
  },
  {
    "id": "wb-kolkata-kathi-roll",
    "name": "Kolkata Nizam Kathi Roll",
    "state": "West Bengal",
    "stateSlug": "west-bengal",
    "city": "Kolkata",
    "citySlug": "kolkata",
    "category": "Iconic Street Food",
    "dietary": "Non-Vegetarian & Veg Options",
    "description": "Invented at Nizam's in the 1930s. Flaky, layered parotta fried on a tawa with egg, rolled around skewer-grilled marinated mutton or chicken tikka, sliced red onions, green chilies, and lime.",
    "regionalRelevance": "Highest",
    "bestKnownIn": [
      "Kolkata"
    ],
    "dishTags": [
      "Street Food",
      "Must-Try",
      "Iconic"
    ],
    "knownEstablishments": [
      "Nizam's (New Market)",
      "Kusum Rolls (Park Street)",
      "Peter Cat",
      "Arsalan"
    ],
    "image": "https://upload.wikimedia.org/wikipedia/commons/f/fc/Kolkata_Rolls.jpg",
    "imageAlt": "Original Kolkata Kathi Roll skewer-roasted kebab rolled in paratha",
    "imageCredit": "Photo: Wikimedia Commons",
    "imageLicense": "CC BY-SA 3.0",
    "imageSourceName": "Wikimedia Commons",
    "verified": true
  },
  {
    "id": "gj-ahmedabad-gujarati-thali",
    "name": "Agashiye Grand Gujarati Thali",
    "state": "Gujarat",
    "stateSlug": "gujarat",
    "city": "Ahmedabad",
    "citySlug": "ahmedabad",
    "category": "Traditional Royal Thali",
    "dietary": "Vegetarian",
    "description": "An opulent multi-course vegetarian feast balancing sweet, salty, and spicy notes: sweet kadhi, seasonal undhiyu, dal, rotlis, puran poli, farsan, and shrikhand.",
    "regionalRelevance": "Highest",
    "bestKnownIn": [
      "Ahmedabad",
      "Surat",
      "Vadodara"
    ],
    "dishTags": [
      "Pure Veg",
      "Must-Try",
      "Royal Cuisine",
      "Traditional"
    ],
    "knownEstablishments": [
      "Agashiye (House of MG)",
      "Sasumaa Gujarati Thali",
      "Gordhan Thal",
      "Vishalla"
    ],
    "image": "https://upload.wikimedia.org/wikipedia/commons/a/a8/The_Gujarati_Thali.jpg",
    "imageAlt": "Authentic Gujarati Thali with kadhi, shaak, rotli, khichdi and farsan",
    "imageCredit": "Photo: Wikimedia Commons",
    "imageLicense": "CC BY-SA 3.0",
    "imageSourceName": "Wikimedia Commons",
    "verified": true
  },
  {
    "id": "mp-indore-poha-jalebi",
    "name": "Indori Poha & Crispy Jalebi",
    "state": "Madhya Pradesh",
    "stateSlug": "madhya-pradesh",
    "city": "Indore",
    "citySlug": "indore",
    "category": "Breakfast & Street Food",
    "dietary": "Vegetarian",
    "description": "Steamed flattened rice cooked with fennel seeds, turmeric, and pomegranate pearls, topped with spicy Ratlami sev and signature Jeeravan masala, paired with hot crispy jalebis.",
    "regionalRelevance": "Highest",
    "bestKnownIn": [
      "Indore",
      "Ujjain",
      "Bhopal"
    ],
    "dishTags": [
      "Breakfast",
      "Street Food",
      "Must-Try",
      "Pure Veg"
    ],
    "knownEstablishments": [
      "Vijay Chaat House",
      "Apna Sweets",
      "Guru Kripa",
      "Prashant Tiffin Centre"
    ],
    "image": "https://upload.wikimedia.org/wikipedia/commons/7/7c/Kanda_poha.jpg",
    "imageAlt": "Indori steamed Poha with sev, pomegranate seeds, and fresh coriander",
    "imageCredit": "Photo: Wikimedia Commons",
    "imageLicense": "CC BY-SA 3.0",
    "imageSourceName": "Wikimedia Commons",
    "verified": true
  },
  {
    "id": "ts-hyderabad-dum-biryani",
    "name": "Hyderabadi Dum Mutton Biryani",
    "state": "Telangana",
    "stateSlug": "telangana",
    "city": "Hyderabad",
    "citySlug": "hyderabad",
    "category": "Royal Nizami Cuisine",
    "dietary": "Non-Vegetarian",
    "description": "World-renowned aromatic basmati rice layered with raw marinated goat meat (kacchi dum style), cooked in sealed copper deghs over slow charcoal heat with saffron, fried onions, and whole spices.",
    "regionalRelevance": "Highest",
    "bestKnownIn": [
      "Hyderabad"
    ],
    "dishTags": [
      "Royal Cuisine",
      "Must-Try",
      "Non-Vegetarian",
      "Iconic"
    ],
    "knownEstablishments": [
      "Paradise Biryani (Secunderabad)",
      "Bawarchi (RTC X Roads)",
      "Shah Ghouse",
      "Pista House",
      "Jewel of Nizam"
    ],
    "image": "https://upload.wikimedia.org/wikipedia/commons/7/7c/Hyderabadi_Chicken_Biryani.jpg",
    "imageAlt": "Aromatic Hyderabadi Dum Biryani slow-cooked with basmati rice and saffron",
    "imageCredit": "Photo: Wikimedia Commons",
    "imageLicense": "CC BY-SA 3.0",
    "imageSourceName": "Wikimedia Commons",
    "verified": true
  },
  {
    "id": "pb-amritsar-kulcha",
    "name": "Amritsari Stuffed Kulcha & Chole",
    "state": "Punjab",
    "stateSlug": "punjab",
    "city": "Amritsar",
    "citySlug": "amritsar",
    "category": "Iconic Heritage Bread",
    "dietary": "Vegetarian",
    "description": "Crispy, multi-layered tandoor-baked flatbread stuffed with spiced potatoes, onions, and pomegranate seeds, hand-crushed with butter and served with tangy pindi chole.",
    "regionalRelevance": "Highest",
    "bestKnownIn": [
      "Amritsar"
    ],
    "dishTags": [
      "Breakfast",
      "Pure Veg",
      "Must-Try",
      "Iconic"
    ],
    "knownEstablishments": [
      "Bhai Kulwant Singh Kulchian",
      "Kesar Da Dhaba",
      "Bharawan Da Dhaba",
      "Brother's Dhaba"
    ],
    "image": "https://upload.wikimedia.org/wikipedia/commons/d/dd/Chole_Kulcha_Meal_-_Order_Food_Online_in_Mumbai_%2831013272937%29.jpg",
    "imageAlt": "Crisp tandoori Amritsari Stuffed Kulcha served with spicy Punjabi chole",
    "imageCredit": "Photo: Wikimedia Commons",
    "imageLicense": "CC BY-SA 2.0",
    "imageSourceName": "Wikimedia Commons",
    "verified": true
  },
  {
    "id": "br-patna-litti-chokha",
    "name": "Bihari Litti Chokha & Sattu Paratha",
    "state": "Bihar",
    "stateSlug": "bihar",
    "city": "Patna",
    "citySlug": "patna",
    "category": "Traditional Regional Meal",
    "dietary": "Vegetarian",
    "description": "The soul of Bihar: whole wheat dough balls stuffed with spiced roasted gram flour (sattu), ajwain, kalonji, and mustard oil, roasted over embers and dipped in pure desi ghee, served with smoky chokha.",
    "regionalRelevance": "Highest",
    "bestKnownIn": [
      "Patna",
      "Gaya",
      "Bodh Gaya"
    ],
    "dishTags": [
      "Pure Veg",
      "Must-Try",
      "Traditional",
      "Local Food"
    ],
    "knownEstablishments": [
      "Maurya Lok Street Stalls",
      "Brijwasi Sweets Patna",
      "Pind Balluchi Patna",
      "Be Happy Cafe Bodh Gaya"
    ],
    "image": "https://upload.wikimedia.org/wikipedia/commons/a/ae/Litti_Chokha_2.jpg",
    "imageAlt": "Traditional Bihari Litti Chokha roasted wheat balls with sattu and roasted eggplant mash",
    "imageCredit": "Photo: Wikimedia Commons",
    "imageLicense": "CC BY-SA 4.0",
    "imageSourceName": "Wikimedia Commons",
    "verified": true
  },
  {
    "id": "od-puri-dalma-pakhala",
    "name": "Odisha Dalma & Temple Mahaprasad (Abadha)",
    "state": "Odisha",
    "stateSlug": "odisha",
    "city": "Puri",
    "citySlug": "puri",
    "category": "Sacred Temple Cuisine",
    "dietary": "Vegetarian",
    "description": "Split toor dal slow-cooked in earthenware with raw banana, pumpkin, eggplant, and colocasia, tempered with ghee and roasted cumin-chili powder.",
    "regionalRelevance": "Highest",
    "bestKnownIn": [
      "Puri",
      "Bhubaneswar"
    ],
    "dishTags": [
      "Pure Veg",
      "Must-Try",
      "Traditional",
      "Sacred Heritage"
    ],
    "knownEstablishments": [
      "Ananda Bazaar (Jagannath Temple)",
      "Wildgrass Restaurant Puri",
      "Dalma Restaurant Bhubaneswar"
    ],
    "image": "https://upload.wikimedia.org/wikipedia/commons/1/13/Dalama_Odia_Cuisine.jpg",
    "imageAlt": "Traditional Odia Dalma lentil stew cooked with raw papaya, pumpkin, and roasted cumin",
    "imageCredit": "Photo: Wikimedia Commons",
    "imageLicense": "CC BY-SA 4.0",
    "imageSourceName": "Wikimedia Commons",
    "verified": true
  },
  {
    "id": "ap-vizag-gongura-mutton",
    "name": "Andhra MLA Pesarattu Upma with Allam Chutney",
    "state": "Andhra Pradesh",
    "stateSlug": "andhra-pradesh",
    "city": "Visakhapatnam",
    "citySlug": "visakhapatnam",
    "category": "Regional Spicy Delicacy",
    "dietary": "Non-Vegetarian & Veg Options",
    "description": "Crisp whole green gram crepe filled with fragrant savory upma and accompanied by spicy-tangy allam (ginger) chutney, Andhra Pradesh's undisputed breakfast signature.",
    "regionalRelevance": "Highest",
    "bestKnownIn": [
      "Visakhapatnam",
      "Vijayawada",
      "Tirupati"
    ],
    "dishTags": [
      "Regional Cuisine",
      "Must-Try",
      "Breakfast",
      "Local Food"
    ],
    "knownEstablishments": [
      "Subbayya Gari Hotel (Vizag & Tirupati)",
      "Sri Sairam Parlour",
      "Sea Inn (Raju Gari Dhaba)",
      "Andhra Spice Tirupati"
    ],
    "image": "https://upload.wikimedia.org/wikipedia/commons/6/6c/Pesarattu.jpg",
    "imageAlt": "Traditional green moong Pesarattu stuffed with seasoned Upma and ginger chutney",
    "imageCredit": "Photo: Wikimedia Commons",
    "imageLicense": "CC BY-SA 3.0",
    "imageSourceName": "Wikimedia Commons",
    "verified": true
  },
  {
    "id": "uk-rishikesh-kafuli-aloo-gutke",
    "name": "Garhwali Pahadi Thali & Kafuli",
    "state": "Uttarakhand",
    "stateSlug": "uttarakhand",
    "city": "Rishikesh",
    "citySlug": "rishikesh",
    "category": "Traditional Mountain Cuisine",
    "dietary": "Vegetarian",
    "description": "Nutritious mountain green curry made from spinach and wild fenugreek leaves slow-cooked in iron pots with rice paste and curd, paired with pahadi boiled potatoes tossed in aromatic jakhiya seeds.",
    "regionalRelevance": "Highest",
    "bestKnownIn": [
      "Rishikesh",
      "Haridwar",
      "Dehradun",
      "Nainital"
    ],
    "dishTags": [
      "Pure Veg",
      "Must-Try",
      "Mountain Cuisine",
      "Local Food"
    ],
    "knownEstablishments": [
      "Chotiwala Restaurant (Swarg Ashram)",
      "The Sitting Elephant",
      "Mohan Ji Puri Wale Haridwar"
    ],
    "image": "https://upload.wikimedia.org/wikipedia/commons/b/bd/Pahadi_thali%2Cbhandari_bhojnalaya%2Cdhanaulti%2Cuttarakhand_5.jpg",
    "imageAlt": "Traditional Garhwali Pahadi Thali from Dhanaulti, Uttarakhand",
    "imageCredit": "Photo: Wikimedia Commons",
    "imageLicense": "CC BY-SA 4.0",
    "imageSourceName": "Wikimedia Commons",
    "verified": true
  }
];

function getMustTryDishes(city, state) {
  return regionalFoodData.filter(d => {
    if (city && d.city.toLowerCase() === city.toLowerCase()) return true;
    if (state && d.state.toLowerCase() === state.toLowerCase()) return true;
    return false;
  });
}

module.exports = {
  regionalFoodData,
  getMustTryDishes
};
