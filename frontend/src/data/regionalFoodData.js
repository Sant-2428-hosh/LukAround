/**
 * REGIONAL FOOD KNOWLEDGE DATABASE (LukAround India Travel & Tourism)
 * Authoritative dataset covering authentic regional dishes, specialties,
 * and culinary heritage for all 15 priority Indian states and their major cities.
 * Compliant with Dishly AI Knowledge & Recommendation Engine specifications.
 */

export const regionalFoodData = [
  // ──────────────────────────────────────────────────────────────────────────
  // 1. TAMIL NADU
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "tn-madurai-jigarthanda",
    name: "Madurai Jigarthanda",
    state: "Tamil Nadu",
    stateSlug: "tamil-nadu",
    city: "Madurai",
    citySlug: "madurai",
    category: "Beverage & Dessert",
    dietary: "Vegetarian",
    description: "A legendary chilled royal beverage made with badam pisin (almond gum), nannari sarsaparilla syrup, boiled full-cream milk, and creamy basundi/ice cream. A GI-tagged pride of Madurai.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Madurai"],
    iconicLocations: ["Vilakkuthoon", "East Marret Street", "Near Meenakshi Amman Temple"],
    verifiedSources: ["Tamil Nadu Tourism", "Madurai Cultural Registry"],
    servingStyle: "Served ice-cold in tall glasses, topped with rich basundi scoop",
    dishTags: ["Local Specialty", "Must-Try", "Vegetarian", "Dessert"],
    knownEstablishments: ["Famous Jigarthanda", "Murugan Idli Shop", "Sree Sabarees"]
  },
  {
    id: "tn-madurai-bun-parotta",
    name: "Madurai Bun Parotta",
    state: "Tamil Nadu",
    stateSlug: "tamil-nadu",
    city: "Madurai",
    citySlug: "madurai",
    category: "Street Food & Local Specialty",
    dietary: "Non-Vegetarian Options Available",
    description: "Crispy on the outside, fluffy and layered like a bun on the inside, cooked on cast-iron griddles with generous butter, served alongside spicy local mutton or chicken salna.",
    regionalRelevance: "High",
    bestKnownIn: ["Madurai"],
    iconicLocations: ["KK Nagar", "Town Hall Road"],
    verifiedSources: ["Madurai Food Trail"],
    servingStyle: "Served hot with spicy salna curry and chicken/veg kurma",
    dishTags: ["Local Specialty", "Street Food", "Must-Try"],
    knownEstablishments: ["Kumar Mess", "Amma Mess", "Simmakkal Konar Mess"]
  },
  {
    id: "tn-madurai-kari-dosa",
    name: "Kari Dosa",
    state: "Tamil Nadu",
    stateSlug: "tamil-nadu",
    city: "Madurai",
    citySlug: "madurai",
    category: "Local Specialty",
    dietary: "Non-Vegetarian",
    description: "A three-layered specialty dosa featuring a thick rice-batter base, an omelette center, and a rich topping of minced spiced mutton (keema) slow-roasted to perfection.",
    regionalRelevance: "High",
    bestKnownIn: ["Madurai"],
    iconicLocations: ["Simmakkal", "Alagar Kovil Road"],
    verifiedSources: ["Madurai Culinary Guild"],
    servingStyle: "Served hot on banana leaf with mutton chukka gravy",
    dishTags: ["Local Specialty", "Non-Vegetarian", "Must-Try"],
    knownEstablishments: ["Amma Mess", "Kumar Mess", "Konar Kadai"]
  },
  {
    id: "tn-chennai-filter-coffee",
    name: "Madras Filter Degree Coffee",
    state: "Tamil Nadu",
    stateSlug: "tamil-nadu",
    city: "Chennai",
    citySlug: "chennai",
    category: "Beverage",
    dietary: "Vegetarian",
    description: "Dark-roasted coffee chicory decoction brewed through a traditional brass filter, frothed with boiled full-cream milk, and served in a classic stainless steel davarah and tumbler.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Chennai", "Coimbatore", "Thanjavur"],
    iconicLocations: ["Mylapore", "T. Nagar", "Triplicane"],
    verifiedSources: ["South Indian Heritage Trust"],
    servingStyle: "Poured between tumbler and davarah from a height to create thick froth",
    dishTags: ["Breakfast", "Beverage", "Vegetarian", "Iconic"],
    knownEstablishments: ["Saravana Bhavan", "Murugan Idli Shop", "Ratna Cafe", "Sangeetha Veg Restaurant"]
  },
  {
    id: "tn-chennai-idli-sambar",
    name: "Mylapore Ghee Podi Idli & Medu Vada",
    state: "Tamil Nadu",
    stateSlug: "tamil-nadu",
    city: "Chennai",
    citySlug: "chennai",
    category: "Breakfast & Tiffin",
    dietary: "Vegetarian",
    description: "Steamed fluffy fermented rice cakes tossed in aromatic spiced lentil powder (gunpowder/podi) and pure desi ghee, served with shallot sambar and coconut chutney.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Chennai", "Madurai", "Coimbatore"],
    iconicLocations: ["Mylapore Kapaleeshwarar Temple Lane", "Triplicane"],
    verifiedSources: ["Tamil Nadu Gastronomy Guild"],
    servingStyle: "Served on fresh plantain leaf with 3 varieties of chutneys and piping hot sambar",
    dishTags: ["Breakfast", "Vegetarian", "Must-Try", "Pure Veg"],
    knownEstablishments: ["Saravana Bhavan", "Ratna Cafe", "Murugan Idli Shop", "ID By SPI"]
  },
  {
    id: "tn-chettinad-chicken",
    name: "Chettinad Pepper Chicken & Kozhi Varuval",
    state: "Tamil Nadu",
    stateSlug: "tamil-nadu",
    city: "Chennai",
    citySlug: "chennai",
    category: "Regional Cuisine",
    dietary: "Non-Vegetarian",
    description: "Spicy, aromatic curry cooked using freshly stone-ground kalpasi (stone flower), marathi mokku, black peppercorns, roasted coconut, and shallots.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Karaikudi", "Chennai", "Madurai"],
    iconicLocations: ["T. Nagar", "Nungambakkam"],
    verifiedSources: ["Chettiar Heritage Society"],
    servingStyle: "Served with hot steamed Ponni rice or flaky parotta",
    dishTags: ["Regional Cuisine", "Non-Vegetarian", "Must-Try"],
    knownEstablishments: ["Anjappar Chettinad", "Karaikudi Restaurant", "Ponnusamy"]
  },
  {
    id: "tn-ooty-homemade-chocolates",
    name: "Ooty Homemade Artisanal Chocolates & Fudge",
    state: "Tamil Nadu",
    stateSlug: "tamil-nadu",
    city: "Ooty",
    citySlug: "ooty",
    category: "Dessert & Confectionery",
    dietary: "Vegetarian",
    description: "Rich, locally crafted Nilgiri chocolates including almond rock, dark rum truffle, hazelnut pralines, and white chocolate fudge prepared in mountain bakeries.",
    regionalRelevance: "High",
    bestKnownIn: ["Ooty", "Coonoor"],
    iconicLocations: ["Commercial Road", "Charing Cross"],
    verifiedSources: ["Nilgiri Tourism"],
    servingStyle: "Packaged fresh or sampled across mountain chocolatiers",
    dishTags: ["Sweets & Desserts", "Vegetarian", "Local Specialty"],
    knownEstablishments: ["King Star Confectionery", "Modern Stores Bakery", "Willy's Coffee Pub"]
  },
  {
    id: "tn-mahabalipuram-seafood",
    name: "Mahabalipuram Coastal Fish Fry & Prawn Curry",
    state: "Tamil Nadu",
    stateSlug: "tamil-nadu",
    city: "Mahabalipuram",
    citySlug: "mahabalipuram",
    category: "Coastal & Seafood",
    dietary: "Non-Vegetarian",
    description: "Fresh catch of vanjaram (king mackerel) and tiger prawns marinated in red chili, turmeric, ginger-garlic and lemon, shallow-fried over iron tawas beside the Bay of Bengal.",
    regionalRelevance: "High",
    bestKnownIn: ["Mahabalipuram"],
    iconicLocations: ["Othavadai Street", "Shore Temple Beach"],
    verifiedSources: ["Coromandel Coast Tourism"],
    servingStyle: "Served hot with onion rings, lemon wedges, and steamed coconut rice",
    dishTags: ["Coastal", "Seafood", "Non-Vegetarian", "Must-Try"],
    knownEstablishments: ["Moonrakers Restaurant", "Seashore Garden Restaurant", "Nautilus Cafe"]
  },
  {
    id: "tn-kanyakumari-banana-chips",
    name: "Kanyakumari Nendran Banana Chips & Fish Curry",
    state: "Tamil Nadu",
    stateSlug: "tamil-nadu",
    city: "Kanyakumari",
    citySlug: "kanyakumari",
    category: "Local Specialty",
    dietary: "Non-Vegetarian & Veg Options",
    description: "Thinly sliced raw Nendran plantains kettle-fried in pure cold-pressed coconut oil, alongside spicy clay-pot seer fish curry infused with kudampuli (cambodge).",
    regionalRelevance: "High",
    bestKnownIn: ["Kanyakumari"],
    iconicLocations: ["Beach Road", "Main Bazaar"],
    verifiedSources: ["Southern Coastal Trail"],
    servingStyle: "Freshly packed warm crisps and traditional coastal rice thalis",
    dishTags: ["Snacks", "Local Specialty", "Coastal"],
    knownEstablishments: ["Hotel Saravana Kanyakumari", "Sea View Restaurant", "The Ocean Restaurant"]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 2. RAJASTHAN
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "rj-jaipur-dal-baati-churma",
    name: "Rajasthani Dal Baati Churma",
    state: "Rajasthan",
    stateSlug: "rajasthan",
    city: "Jaipur",
    citySlug: "jaipur",
    category: "Traditional Regional Thali",
    dietary: "Vegetarian",
    description: "Hard wheat dough balls baked over coal and drenched in pure desi ghee, served with five-lentil panchmel dal, spicy garlic chutney, and sweet cardamom churma.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Jaipur", "Udaipur", "Jodhpur"],
    iconicLocations: ["Johari Bazaar", "MI Road", "Chokhi Dhani"],
    verifiedSources: ["Rajasthan Tourism Development Corp"],
    servingStyle: "Served as a ceremonial royal thali on brass plates",
    dishTags: ["Pure Veg", "Must-Try", "Local Food", "Traditional"],
    knownEstablishments: ["Laxmi Misthan Bhandar (LMB)", "Chokhi Dhani", "Tapri The Tea House", "Handi Restaurant"]
  },
  {
    id: "rj-jaipur-laal-maas",
    name: "Royal Rajputana Laal Maas",
    state: "Rajasthan",
    stateSlug: "rajasthan",
    city: "Jaipur",
    citySlug: "jaipur",
    category: "Royal Non-Vegetarian",
    dietary: "Non-Vegetarian",
    description: "Fiery Rajput warrior mutton curry prepared with hand-pounded Mathania red chilies, mustard oil, cloves, and smoked with live charcoal (dhungar method).",
    regionalRelevance: "Highest",
    bestKnownIn: ["Jaipur", "Udaipur", "Jodhpur"],
    iconicLocations: ["Amer Fort", "MI Road", "Civil Lines"],
    verifiedSources: ["Royal House of Jaipur Archives"],
    servingStyle: "Served with bajra roti (pearl millet bread) or garlic naan",
    dishTags: ["Royal Cuisine", "Non-Vegetarian", "Must-Try", "Fine Dining"],
    knownEstablishments: ["1135 AD (Amer Fort)", "Handi Restaurant", "Niros Restaurant", "Baradari at City Palace"]
  },
  {
    id: "rj-jaipur-pyaaz-kachori",
    name: "Rawat Pyaaz Kachori & Mawa Kachori",
    state: "Rajasthan",
    stateSlug: "rajasthan",
    city: "Jaipur",
    citySlug: "jaipur",
    category: "Street Food & Sweets",
    dietary: "Vegetarian",
    description: "Flaky, crisp golden pastry pockets filled with spicy caramelized onions, kalonji (nigella seeds), and aromatic spices, accompanied by tamarind saunth chutney.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Jaipur", "Jodhpur"],
    iconicLocations: ["Station Road, Sindhi Camp", "Johari Bazaar"],
    verifiedSources: ["Jaipur Culinary Trust"],
    servingStyle: "Served hot with sweet tamarind chutney and spicy mint relish",
    dishTags: ["Street Food", "Breakfast", "Must-Try", "Vegetarian"],
    knownEstablishments: ["Rawat Misthan Bhandar", "LMB Johari Bazaar", "Samrat Restaurant", "Tapri Central"]
  },
  {
    id: "rj-jaipur-ghewar",
    name: "Paneer Ghewar & Malai Ghewar",
    state: "Rajasthan",
    stateSlug: "rajasthan",
    city: "Jaipur",
    citySlug: "jaipur",
    category: "Traditional Sweet",
    dietary: "Vegetarian",
    description: "Honeycomb-textured disc made from clarified flour batter fried in ghee, soaked in saffron sugar syrup, and crowned with dense rabri, pistachios, and silver vark.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Jaipur"],
    iconicLocations: ["Johari Bazaar", "Tripolia Bazaar"],
    verifiedSources: ["Rajasthan Cultural Registry"],
    servingStyle: "Served chilled or warm during Teej and festive celebrations",
    dishTags: ["Sweets & Desserts", "Vegetarian", "Must-Try"],
    knownEstablishments: ["Laxmi Misthan Bhandar (LMB)", "Rawat Misthan Bhandar", "Kanha Sweets", "Bhagat Misthan Bhandar"]
  },
  {
    id: "rj-udaipur-gatte-ki-sabzi",
    name: "Mewari Gatte Ki Sabzi & Ker Sangri",
    state: "Rajasthan",
    stateSlug: "rajasthan",
    city: "Udaipur",
    citySlug: "udaipur",
    category: "Traditional Regional Cuisine",
    dietary: "Vegetarian",
    description: "Steamed and spiced gram flour dumplings simmered in a tangy yogurt-based gravy with mustard seeds, paired with desert-foraged capers (ker) and wild desert beans (sangri).",
    regionalRelevance: "High",
    bestKnownIn: ["Udaipur", "Jodhpur", "Bikaner"],
    iconicLocations: ["Lake Pichola Rooftops", "City Palace Road"],
    verifiedSources: ["Mewar Historical Archives"],
    servingStyle: "Served with hot phulkas and garlic chutney",
    dishTags: ["Pure Veg", "Local Food", "Must-Try"],
    knownEstablishments: ["Traditional Khana Restaurant", "Ambrai Restaurant", "Tribute Restaurant", "Upre by 1965"]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 3. KARNATAKA
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "ka-mysuru-masala-dosa",
    name: "Mysore Masala Dosa",
    state: "Karnataka",
    stateSlug: "karnataka",
    city: "Mysuru",
    citySlug: "mysuru",
    category: "Breakfast & Tiffin",
    dietary: "Vegetarian",
    description: "Thick yet crispy red-tinted rice-lentil crepe slathered with fiery red garlic-chili paste, loaded with spiced potato palya, and roasted in generous dollops of pure butter.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Mysuru", "Bengaluru"],
    iconicLocations: ["Agrahara", "Sayyaji Rao Road"],
    verifiedSources: ["Karnataka Tourism"],
    servingStyle: "Served on banana leaf with creamy coconut chutney and vegetable sambar",
    dishTags: ["Breakfast", "Pure Veg", "Must-Try", "Iconic"],
    knownEstablishments: ["Hotel Original Vinayaka Mylari", "Gayatri Tiffin Room (GTR)", "Dasaprakash", "MTR"]
  },
  {
    id: "ka-mysuru-pak",
    name: "Original Royal Mysore Pak",
    state: "Karnataka",
    stateSlug: "karnataka",
    city: "Mysuru",
    citySlug: "mysuru",
    category: "Traditional Sweet",
    dietary: "Vegetarian",
    description: "Invented in the royal kitchens of Mysore Palace by master chef Kakasura Madappa. Made exclusively with roasted gram flour (besan), pure desi ghee, and fragrant sugar syrup.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Mysuru"],
    iconicLocations: ["Sayyaji Rao Road", "Near Devaraja Market"],
    verifiedSources: ["Mysore Royal Family Palace Guild"],
    servingStyle: "Melt-in-mouth warm or room-temperature fudge squares",
    dishTags: ["Sweets & Desserts", "Pure Veg", "Must-Try", "Heritage"],
    knownEstablishments: ["Guru Sweets (Descendants of Creator)", "Mahalakshmi Sweets", "Indra Sweets"]
  },
  {
    id: "ka-blr-bisi-bele-bath",
    name: "Karnataka Bisi Bele Bath",
    state: "Karnataka",
    stateSlug: "karnataka",
    city: "Bengaluru",
    citySlug: "bengaluru",
    category: "Traditional Regional Meal",
    dietary: "Vegetarian",
    description: "Hot lentil rice dish slow-cooked with toor dal, fresh seasonal vegetables, nutmeg, tamarind pulp, and roasted bisi bele bath masala, topped with ghee and boondi crisps.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Bengaluru", "Mysuru"],
    iconicLocations: ["Gandhi Bazaar", "Malleshwaram", "Lalbagh Road"],
    verifiedSources: ["Karnataka Culinary Heritage Trust"],
    servingStyle: "Served piping hot with crispy boondi and potato chips",
    dishTags: ["Pure Veg", "Local Food", "Must-Try"],
    knownEstablishments: ["Mavalli Tiffin Room (MTR)", "Vidyarthi Bhavan", "Central Tiffin Room (CTR)", "Taaza Thindi"]
  },
  {
    id: "ka-coorg-pandi-curry",
    name: "Coorg Pandi Curry & Akki Roti",
    state: "Karnataka",
    stateSlug: "karnataka",
    city: "Coorg",
    citySlug: "coorg",
    category: "Regional Tribal Cuisine",
    dietary: "Non-Vegetarian",
    description: "Traditional Kodava meat curry slow-cooked with roasted black spices and authentic Kachampuli (dark wild Garcinia gummi-gutta vinegar), paired with soft rice flatbreads (akki roti).",
    regionalRelevance: "Highest",
    bestKnownIn: ["Madikeri", "Coorg"],
    iconicLocations: ["Madikeri Town", "Kushalnagar"],
    verifiedSources: ["Kodava Heritage Council"],
    servingStyle: "Served with hot Akki Roti or steamed Kadambuttu (rice dumplings)",
    dishTags: ["Regional Cuisine", "Non-Vegetarian", "Must-Try"],
    knownEstablishments: ["Raintree Restaurant", "Coorg Cuisine", "Tiger Tiger", "Folks Coorg"]
  },
  {
    id: "ka-mangaluru-ghee-roast",
    name: "Mangalorean Ghee Roast & Neer Dosa",
    state: "Karnataka",
    stateSlug: "karnataka",
    city: "Gokarna",
    citySlug: "gokarna",
    category: "Coastal Delicacy",
    dietary: "Non-Vegetarian & Veg Options",
    description: "Fiery coastal preparation originating in Kundapura. Chicken, prawns, or paneer slow-roasted in clarified butter with Byadagi chilies and roasted coriander, served with paper-thin Neer Dosas.",
    regionalRelevance: "High",
    bestKnownIn: ["Mangaluru", "Udupi", "Gokarna"],
    iconicLocations: ["Kudle Beach", "Gokarna Main Town"],
    verifiedSources: ["Coastal Karnataka Food Guide"],
    servingStyle: "Served with soft lacy Neer Dosa and coconut chutney",
    dishTags: ["Coastal", "Must-Try", "Regional Specialty"],
    knownEstablishments: ["Maharaja Restaurant Mangaluru", "Prema Restaurant Gokarna", "Namaste Cafe Gokarna"]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 4. UTTAR PRADESH
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "up-agra-petha",
    name: "Agra Panchhi Petha",
    state: "Uttar Pradesh",
    stateSlug: "uttar-pradesh",
    city: "Agra",
    citySlug: "agra",
    category: "Traditional Sweet",
    dietary: "Vegetarian",
    description: "Translucent soft candy crafted from ash gourd (winter melon) boiled in sugar syrup and flavored with kewra water, saffron (kesar), and crushed pistachios. World-famous Agra heritage.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Agra"],
    iconicLocations: ["Hari Parvat Crossing", "Sadar Bazaar", "Near Taj Mahal"],
    verifiedSources: ["Agra District Administration Tourism"],
    servingStyle: "Served chilled; available in Angoori, Kesar, and Paan varieties",
    dishTags: ["Sweets & Desserts", "Must-Try", "Vegetarian", "Heritage"],
    knownEstablishments: ["Panchhi Petha (Hari Parvat Original)", "Bhagat Halwai", "Bikanervala Agra"]
  },
  {
    id: "up-agra-bedmi-puri",
    name: "Agra Bedmi Puri & Aloo Sabzi",
    state: "Uttar Pradesh",
    stateSlug: "uttar-pradesh",
    city: "Agra",
    citySlug: "agra",
    category: "Breakfast & Street Food",
    dietary: "Vegetarian",
    description: "Crisp, puffed deep-fried wheat puris stuffed with coarsely ground spiced urad dal paste, served alongside spicy hing-infused potato curry and sour methi chutney.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Agra", "Mathura"],
    iconicLocations: ["Kinari Bazaar", "Belanganj", "Sadar Bazaar"],
    verifiedSources: ["Braj Culinary Records"],
    servingStyle: "Served piping hot in leaf donas with pickled green chilies",
    dishTags: ["Breakfast", "Street Food", "Must-Try", "Pure Veg"],
    knownEstablishments: ["Deviram Sweets", "Dasaprakash", "Shankara Vegis Restaurant", "Joney's Roti"]
  },
  {
    id: "up-varanasi-tamatar-chaat",
    name: "Banarasi Tamatar Chaat & Palak Chaat",
    state: "Uttar Pradesh",
    stateSlug: "uttar-pradesh",
    city: "Varanasi",
    citySlug: "varanasi",
    category: "Iconic Street Food",
    dietary: "Vegetarian",
    description: "Exclusive to Varanasi. Ripe tomatoes simmered with boiled potatoes, cashews, raisins, ginger, and hing, topped with a dash of sugar syrup, lemon juice, and crunchy namkeen.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Varanasi"],
    iconicLocations: ["Godowlia Chowk", "Dashashwamedh Ghat Lane"],
    verifiedSources: ["Kashi Culture Guild"],
    servingStyle: "Served steaming hot in earthen clay kulhad cups",
    dishTags: ["Street Food", "Must-Try", "Pure Veg", "Iconic"],
    knownEstablishments: ["Kashi Chaat Bhandar", "Deena Chaat Bhandar", "Shree Shivay", "Blue Lassi"]
  },
  {
    id: "up-varanasi-kachori-jalebi",
    name: "Banarasi Chhoti-Badi Kachori & Jalebi",
    state: "Uttar Pradesh",
    stateSlug: "uttar-pradesh",
    city: "Varanasi",
    citySlug: "varanasi",
    category: "Breakfast & Tiffin",
    dietary: "Vegetarian",
    description: "Varanasi morning ritual: crisp lentil-stuffed puris served with black chana and potato curry cooked without onion or garlic, followed by piping hot syrupy saffron jalebis.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Varanasi"],
    iconicLocations: ["Kachori Gali", "Thatheri Bazaar", "Assi Ghat"],
    verifiedSources: ["Varanasi Tourism Authority"],
    servingStyle: "Served fresh from morning vats onto sal leaves with clay kulhad tea",
    dishTags: ["Breakfast", "Pure Veg", "Must-Try", "Heritage"],
    knownEstablishments: ["Ram Bhandar (Thatheri Bazaar)", "The Ramada Kashi", "Madhur Milan", "Kashi Chaat Bhandar"]
  },
  {
    id: "up-lucknow-galouti-kebab",
    name: "Lucknowi Galouti Kebab & Ulte Tawe Ka Parotta",
    state: "Uttar Pradesh",
    stateSlug: "uttar-pradesh",
    city: "Lucknow",
    citySlug: "lucknow",
    category: "Royal Awadhi Cuisine",
    dietary: "Non-Vegetarian",
    description: "Invented for the toothless Nawab Asad-ud-Daula. Super-finely minced meat tenderized with raw papaya and over 160 secret spices, smoked with cloves and pan-seared to melt instantaneously.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Lucknow"],
    iconicLocations: ["Aminabad", "Chowk", "Hazratganj"],
    verifiedSources: ["Awadh Royal Heritage Foundation"],
    servingStyle: "Served atop saffron-infused Mughlai parotta with sliced onions and mint chutney",
    dishTags: ["Royal Cuisine", "Must-Try", "Non-Vegetarian", "Heritage"],
    knownEstablishments: ["Tunday Kababi (Aminabad)", "Dastarkhwan", "Oudhyana at Vivanta", "Royal Cafe"]
  },
  {
    id: "up-lucknow-basket-chaat",
    name: "Royal Cafe Basket Chaat (Tokri Chaat)",
    state: "Uttar Pradesh",
    stateSlug: "uttar-pradesh",
    city: "Lucknow",
    citySlug: "lucknow",
    category: "Street Food & Chaat",
    dietary: "Vegetarian",
    description: "An edible golden grated-potato basket packed with boiled chickpeas, spiced potatoes, dahi vada, whipped yogurt, sweet saunth, spicy coriander chutney, and pomegranate seeds.",
    regionalRelevance: "High",
    bestKnownIn: ["Lucknow"],
    iconicLocations: ["Hazratganj"],
    verifiedSources: ["Lucknow Gastronomy Society"],
    servingStyle: "Served chilled with layers of chutneys and crunchy sev",
    dishTags: ["Street Food", "Vegetarian", "Must-Try"],
    knownEstablishments: ["Royal Cafe (Hazratganj)", "Shukla Chaat House", "Prakash Kulfi"]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 5. KERALA
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "kl-kochi-karimeen-pollichathu",
    name: "Karimeen Pollichathu (Pearl Spot Fish)",
    state: "Kerala",
    stateSlug: "kerala",
    city: "Kochi",
    citySlug: "kochi",
    category: "Coastal & Seafood",
    dietary: "Non-Vegetarian",
    description: "Kerala backwater pearl spot fish marinated in shallots, green chilies, ginger, and curry leaves, smothered in spicy tomato masala, wrapped securely in banana leaves and slow-roasted.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Kochi", "Alappuzha", "Kumarakom"],
    iconicLocations: ["Fort Kochi", "Marine Drive", "Bolgatty"],
    verifiedSources: ["Kerala Tourism Department"],
    servingStyle: "Unwrapped hot at table on charred banana leaf with steamed Kerala red matta rice",
    dishTags: ["Seafood", "Coastal", "Must-Try", "Non-Vegetarian"],
    knownEstablishments: ["Paragon Restaurant", "Grand Pavilion", "Oceanos Seafood", "Fusion Bay Fort Kochi"]
  },
  {
    id: "kl-kochi-appam-stew",
    name: "Lacy Appam with Kerala Vegetable/Chicken Stew",
    state: "Kerala",
    stateSlug: "kerala",
    city: "Kochi",
    citySlug: "kochi",
    category: "Breakfast & Traditional Meal",
    dietary: "Vegetarian & Non-Veg Options",
    description: "Bowl-shaped fermented rice pancakes with crisp lacy edges and soft spongy coconut centers, served with aromatic coconut milk stew flavored with whole peppercorns, cinnamon, and ginger.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Kochi", "Munnar", "Kottayam"],
    iconicLocations: ["Fort Kochi", "Mattancherry"],
    verifiedSources: ["Kerala Culinary Heritage Trust"],
    servingStyle: "Served hot in deep bowls with fresh coconut milk swirl",
    dishTags: ["Breakfast", "Traditional", "Must-Try"],
    knownEstablishments: ["Kashi Art Cafe", "Malabar Junction", "Grand Hotel Restaurant", "Seagull Restaurant"]
  },
  {
    id: "kl-alappuzha-meen-curry",
    name: "Alappuzha Fish Curry & Kerala Sadya",
    state: "Kerala",
    stateSlug: "kerala",
    city: "Alappuzha",
    citySlug: "alappuzha",
    category: "Traditional Feast",
    dietary: "Vegetarian & Seafood Options",
    description: "Spicy backwater fish curry prepared in earthen clay pots (chatti) with Malabar tamarind (kodampuli) and coconut oil, alongside the traditional multi-course vegetarian banana leaf Sadya.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Alappuzha", "Kochi", "Thiruvananthapuram"],
    iconicLocations: ["Punnamada Lake", "Alappuzha Beach Road"],
    verifiedSources: ["Kerala Backwaters Food Trail"],
    servingStyle: "Served on broad plantain leaves with avial, thoran, sambar, and payasam",
    dishTags: ["Traditional", "Must-Try", "Seafood", "Pure Veg Option"],
    knownEstablishments: ["Thaff Restaurant", "Mushroom Restaurant", "Cassia Restaurant", "Harbour Restaurant"]
  },
  {
    id: "kl-munnar-cardamom-tea",
    name: "Munnar High-Grown Cardamom Tea & Puttu Kadala",
    state: "Kerala",
    stateSlug: "kerala",
    city: "Munnar",
    citySlug: "munnar",
    category: "Mountain Specialty",
    dietary: "Vegetarian",
    description: "Fresh orthodox black tea brewed from high-altitude plantations infused with green cardamom pods, paired with steamed cylindrical rice-flour cakes (puttu) and spicy black chickpea curry.",
    regionalRelevance: "High",
    bestKnownIn: ["Munnar"],
    iconicLocations: ["KDHP Tea Museum Road", "Old Munnar Market"],
    verifiedSources: ["Idukki District Tourism Promotion Council"],
    servingStyle: "Served steaming hot in mountain tea stalls alongside ripe banana",
    dishTags: ["Breakfast", "Beverage", "Must-Try", "Pure Veg"],
    knownEstablishments: ["Saravana Bhavan Munnar", "Rapsy Restaurant", "Silver Spoon", "Guru's Restaurant"]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 6. MAHARASHTRA
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "mh-mumbai-vada-pav",
    name: "Mumbai Vada Pav & Pav Bhaji",
    state: "Maharashtra",
    stateSlug: "maharashtra",
    city: "Mumbai",
    citySlug: "mumbai",
    category: "Iconic Street Food",
    dietary: "Vegetarian",
    description: "The heartbeat of Mumbai: spiced mashed potato fritter (batata vada) sandwiched in a soft pav, layered with spicy dry garlic chutney and fried green chilies, plus buttery mashed vegetable pav bhaji.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Mumbai", "Pune"],
    iconicLocations: ["Dadar", "Fort", "Juhu Beach", "Girgaon Chowpatty"],
    verifiedSources: ["Maharashtra Tourism Development Corporation"],
    servingStyle: "Served hot in brown paper with salted fried chilies and lashings of butter",
    dishTags: ["Street Food", "Must-Try", "Pure Veg", "Iconic"],
    knownEstablishments: ["Sardar Refreshments (Tardeo)", "Cannon Pav Bhaji", "Aaswad (Dadar)", "Britannia & Co."]
  },
  {
    id: "mh-mumbai-bombil-fry",
    name: "Bombay Duck (Bombil Fry) & Parsi Berry Pulao",
    state: "Maharashtra",
    stateSlug: "maharashtra",
    city: "Mumbai",
    citySlug: "mumbai",
    category: "Coastal & Heritage Cuisine",
    dietary: "Non-Vegetarian",
    description: "Crispy rava-crusted Bombay duck (lizardfish) shallow-fried with fiery Malvani red chilies, and iconic Irani-Parsi fragrant basmati pulao crowned with sour Iranian barberries and fried onions.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Mumbai"],
    iconicLocations: ["Ballard Estate", "Colaba", "Matunga", "Vile Parle"],
    verifiedSources: ["Mumbai Heritage Guild"],
    servingStyle: "Served with green chutney and onion rings",
    dishTags: ["Heritage", "Coastal", "Must-Try", "Non-Vegetarian"],
    knownEstablishments: ["Britannia & Co. (Ballard Estate)", "Bademiya (Colaba)", "Gajalee (Vile Parle)", "Mahesh Lunch Home"]
  },
  {
    id: "mh-pune-misal-pav",
    name: "Puneri Misal Pav & Sujata Mastani",
    state: "Maharashtra",
    stateSlug: "maharashtra",
    city: "Pune",
    citySlug: "pune",
    category: "Local Specialty",
    dietary: "Vegetarian",
    description: "Spicy sprouted moth bean curry served with a fiery red oily chili soup (tarri/rassa), topped with crunchy farsan, chopped onions, coriander, and lemon, paired with Pune's rich Mastani milkshake dessert.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Pune", "Kolhapur", "Nashik"],
    iconicLocations: ["FC Road", "Sadashiv Peth", "Camp"],
    verifiedSources: ["Pune Culinary Trust"],
    servingStyle: "Served in two bowls: dry crunchy farsan-moth base and piping hot spicy rassa kettle",
    dishTags: ["Breakfast", "Street Food", "Must-Try", "Vegetarian"],
    knownEstablishments: ["Vaishali Restaurant (FC Road)", "Kata Kirr", "Bedekar Misal", "Sujata Mastani"]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 7. WEST BENGAL
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "wb-kolkata-kathi-roll",
    name: "Kolkata Nizam Kathi Roll",
    state: "West Bengal",
    stateSlug: "west-bengal",
    city: "Kolkata",
    citySlug: "kolkata",
    category: "Iconic Street Food",
    dietary: "Non-Vegetarian & Veg Options",
    description: "Invented at Nizam's in the 1930s. Flaky, layered parotta fried on a tawa with egg, rolled around skewer-grilled marinated mutton or chicken tikka, sliced red onions, green chilies, and lime.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Kolkata"],
    iconicLocations: ["New Market", "Park Street", "Gariahat"],
    verifiedSources: ["Kolkata Culinary Guild"],
    servingStyle: "Wrapped in greaseproof paper roll for on-the-go savoring",
    dishTags: ["Street Food", "Must-Try", "Iconic"],
    knownEstablishments: ["Nizam's (New Market)", "Kusum Rolls (Park Street)", "Peter Cat", "Arsalan"]
  },
  {
    id: "wb-kolkata-rosogolla-mishti-doi",
    name: "K.C. Das Rosogolla & Baked Mishti Doi",
    state: "West Bengal",
    stateSlug: "west-bengal",
    city: "Kolkata",
    citySlug: "kolkata",
    category: "Traditional Sweets",
    dietary: "Vegetarian",
    description: "Soft, spongy cottage cheese (chhena) spheres boiled in clarified light sugar syrup, along with fermented sweet caramelized yogurt slow-baked in porous earthen clay pots.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Kolkata", "Darjeeling"],
    iconicLocations: ["Esplanade", "College Street", "Shyambazar"],
    verifiedSources: ["Bengal Heritage Confectionery Guild"],
    servingStyle: "Served chilled in clay pots (bhar) or warm from syrup vats",
    dishTags: ["Sweets & Desserts", "Must-Try", "Vegetarian", "Heritage"],
    knownEstablishments: ["K.C. Das (Esplanade)", "Balaram Mullick & Radharaman Mullick", "Bhim Chandra Nag", "Flurys"]
  },
  {
    id: "wb-kolkata-macher-jhol",
    name: "Shorshe Ilish & Macher Jhol",
    state: "West Bengal",
    stateSlug: "west-bengal",
    city: "Kolkata",
    citySlug: "kolkata",
    category: "Traditional Bengali Meal",
    dietary: "Non-Vegetarian",
    description: "Tender Hilsa or Rohu river fish simmered in a sharp, pungent paste of yellow and black mustard seeds with green chilies and mustard oil, or in light cumin-ginger jhol.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Kolkata"],
    iconicLocations: ["Ballygunge", "Salt Lake", "Park Street"],
    verifiedSources: ["Bengal Gastronomy Trust"],
    servingStyle: "Served hot over steamed fragrant Gobindobhog or basmati rice",
    dishTags: ["Traditional", "Must-Try", "Seafood", "Non-Vegetarian"],
    knownEstablishments: ["Bhojohori Manna", "6 Ballygunge Place", "Oh! Calcutta", "Kasturi Restaurant"]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 8. GUJARAT
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "gj-ahmedabad-gujarati-thali",
    name: "Agashiye Grand Gujarati Thali",
    state: "Gujarat",
    stateSlug: "gujarat",
    city: "Ahmedabad",
    citySlug: "ahmedabad",
    category: "Traditional Royal Thali",
    dietary: "Vegetarian",
    description: "An opulent multi-course vegetarian feast balancing sweet, salty, and spicy notes: sweet kadhi, seasonal undhiyu, dal, rotlis, puran poli, farsan, and shrikhand served on bell-metal plates.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Ahmedabad", "Surat", "Vadodara"],
    iconicLocations: ["The House of MG (Old City)", "Ashram Road"],
    verifiedSources: ["Gujarat Tourism Development Board"],
    servingStyle: "Served continuously in royal silver and kansa thalis with warm hospitality",
    dishTags: ["Pure Veg", "Must-Try", "Royal Cuisine", "Traditional"],
    knownEstablishments: ["Agashiye (House of MG)", "Sasumaa Gujarati Thali", "Gordhan Thal", "Vishalla"]
  },
  {
    id: "gj-ahmedabad-khaman-fafda",
    name: "Nylon Khaman Dhokla & Fafda-Jalebi",
    state: "Gujarat",
    stateSlug: "gujarat",
    city: "Ahmedabad",
    citySlug: "ahmedabad",
    category: "Breakfast & Farsan",
    dietary: "Vegetarian",
    description: "Melt-in-the-mouth steamed fermented gram-flour sponge tempered with mustard seeds, sesame, and green chilies, paired with crisp gram-flour fafda, sweet jalebis, and papaya sambharo.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Ahmedabad", "Surat", "Rajkot"],
    iconicLocations: ["Manek Chowk", "Nehrunagar", "Gandhi Road"],
    verifiedSources: ["Ahmedabad Municipal Heritage Cell"],
    servingStyle: "Served fresh with fried green chilies and grated raw papaya salad",
    dishTags: ["Breakfast", "Pure Veg", "Must-Try", "Street Food"],
    knownEstablishments: ["Das Khaman", "Chandra Villas", "Oshwal", "Manek Chowk Street Vendors"]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 9. MADHYA PRADESH
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "mp-indore-poha-jalebi",
    name: "Indori Poha & Crispy Jalebi",
    state: "Madhya Pradesh",
    stateSlug: "madhya-pradesh",
    city: "Indore",
    citySlug: "indore",
    category: "Breakfast & Street Food",
    dietary: "Vegetarian",
    description: "Steamed flattened rice cooked with fennel seeds, turmeric, and pomegranate pearls, topped with spicy Ratlami sev and signature Jeeravan masala, paired with hot crispy jalebis.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Indore", "Ujjain", "Bhopal"],
    iconicLocations: ["Chappan Dukan", "Sarafa Night Food Market"],
    verifiedSources: ["Madhya Pradesh Tourism"],
    servingStyle: "Served on paper plates with lemon wedge and generous sprinkle of sev and jeeravan",
    dishTags: ["Breakfast", "Street Food", "Must-Try", "Pure Veg"],
    knownEstablishments: ["Vijay Chaat House", "Apna Sweets", "Guru Kripa", "Prashant Tiffin Centre"]
  },
  {
    id: "mp-indore-bhutte-ka-kees",
    name: "Bhutte Ka Kees & Garadu",
    state: "Madhya Pradesh",
    stateSlug: "madhya-pradesh",
    city: "Indore",
    citySlug: "indore",
    category: "Street Food & Local Specialty",
    dietary: "Vegetarian",
    description: "Grated fresh tender sweet corn slow-cooked in spiced milk with mustard seeds, green chilies, and asafoetida, garnished with fresh grated coconut and lime juice.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Indore"],
    iconicLocations: ["Sarafa Bazaar (Night Market)", "Chappan Dukan"],
    verifiedSources: ["Indore Street Food Association"],
    servingStyle: "Served warm in small bowls with coriander and lime",
    dishTags: ["Street Food", "Must-Try", "Vegetarian", "Local Specialty"],
    knownEstablishments: ["Joshi Dahi Bada House (Sarafa)", "Vijay Chaat House", "Agrawal Sweets"]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 10. TELANGANA
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "ts-hyderabad-dum-biryani",
    name: "Hyderabadi Dum Mutton Biryani",
    state: "Telangana",
    stateSlug: "telangana",
    city: "Hyderabad",
    citySlug: "hyderabad",
    category: "Royal Nizami Cuisine",
    dietary: "Non-Vegetarian",
    description: "World-renowned aromatic basmati rice layered with raw marinated goat meat (kacchi dum style), cooked in sealed copper deghs over slow charcoal heat with saffron, fried onions, and whole spices.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Hyderabad"],
    iconicLocations: ["Charminar", "Secunderabad", "RTC X Roads", "Banjara Hills"],
    verifiedSources: ["Telangana Tourism & Nizami Trust"],
    servingStyle: "Served with Mirchi Ka Salan (curried chili gravy) and cooling cucumber raita",
    dishTags: ["Royal Cuisine", "Must-Try", "Non-Vegetarian", "Iconic"],
    knownEstablishments: ["Paradise Biryani (Secunderabad)", "Bawarchi (RTC X Roads)", "Shah Ghouse", "Pista House", "Jewel of Nizam"]
  },
  {
    id: "ts-hyderabad-irani-chai-osmania",
    name: "Charminar Irani Chai & Osmania Biscuits",
    state: "Telangana",
    stateSlug: "telangana",
    city: "Hyderabad",
    citySlug: "hyderabad",
    category: "Heritage Beverage & Cafe",
    dietary: "Vegetarian",
    description: "Thick, condensed sweetened milk tea infused with mawa and cardamom, paired with melt-in-the-mouth sweet-and-salty Osmania butter biscuits named after the Last Nizam.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Hyderabad"],
    iconicLocations: ["Opposite Charminar", "Abids", "Mehdipatnam"],
    verifiedSources: ["Hyderabad Heritage Society"],
    servingStyle: "Poured from brass samovars into white ceramic cups",
    dishTags: ["Beverage", "Breakfast", "Must-Try", "Heritage"],
    knownEstablishments: ["Nimrah Cafe and Bakery (Charminar)", "Subhan Bakery", "Cafe Niloufer", "Pista House"]
  },
  {
    id: "ts-hyderabad-haleem",
    name: "Hyderabadi Shahi Haleem & Double Ka Meetha",
    state: "Telangana",
    stateSlug: "telangana",
    city: "Hyderabad",
    citySlug: "hyderabad",
    category: "Royal Delicacy & Dessert",
    dietary: "Non-Vegetarian & Sweet",
    description: "GI-tagged stew of pounded meat, lentils, broken wheat, and pure desi ghee slow-cooked for 12 hours into a rich velvety paste, topped with fried cashews, golden onions, and mint.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Hyderabad"],
    iconicLocations: ["Charminar", "Tolichowki", "Gachibowli"],
    verifiedSources: ["GI Registry of India", "Telangana Tourism"],
    servingStyle: "Served hot with lime squeeze and fried onions, followed by saffron bread pudding",
    dishTags: ["Royal Cuisine", "Must-Try", "Heritage", "Sweets & Desserts"],
    knownEstablishments: ["Pista House", "Shah Ghouse", "Sarvi Restaurant", "Chutneys (Banjara Hills)"]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 11. PUNJAB
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "pb-amritsar-kulcha",
    name: "Amritsari Stuffed Kulcha & Chole",
    state: "Punjab",
    stateSlug: "punjab",
    city: "Amritsar",
    citySlug: "amritsar",
    category: "Iconic Heritage Bread",
    dietary: "Vegetarian",
    description: "Crispy, multi-layered tandoor-baked flatbread stuffed with spiced potatoes, onions, and pomegranate seeds, hand-crushed with butter and served with tangy pindi chole and tamarind-onion relish.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Amritsar"],
    iconicLocations: ["Chowk Passian", "Town Hall", "Near Golden Temple"],
    verifiedSources: ["Punjab Heritage & Tourism"],
    servingStyle: "Crushed with two hands so layers shatter; served with butter scoop and spiced chole",
    dishTags: ["Breakfast", "Pure Veg", "Must-Try", "Iconic"],
    knownEstablishments: ["Bhai Kulwant Singh Kulchian", "Kesar Da Dhaba", "Bharawan Da Dhaba", "Brother's Dhaba"]
  },
  {
    id: "pb-amritsar-kesar-dal-makhani",
    name: "Kesar Da Dhaba Dal Makhani & Lassi",
    state: "Punjab",
    stateSlug: "punjab",
    city: "Amritsar",
    citySlug: "amritsar",
    category: "Heritage Dhaba Cuisine",
    dietary: "Vegetarian",
    description: "Legendary black lentils slow-cooked overnight for 12 hours over dying coals with desi ghee and secret spices (est. 1916), paired with a giant clay-glass of rich malai-topped sweet lassi.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Amritsar", "Patiala"],
    iconicLocations: ["Chowk Passian (Historic Narrow Alley)", "Town Hall"],
    verifiedSources: ["Punjab Tourism Board"],
    servingStyle: "Served hot in brass bowls with crisp Lachha Parottas and creamy lassi",
    dishTags: ["Pure Veg", "Must-Try", "Heritage", "Local Food"],
    knownEstablishments: ["Kesar Da Dhaba (est. 1916)", "Bharawan Da Dhaba", "Ahuja Milk Centre (Famous Lassi)", "Makhan Fish Corner"]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 12. BIHAR
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "br-patna-litti-chokha",
    name: "Bihari Litti Chokha & Sattu Paratha",
    state: "Bihar",
    stateSlug: "bihar",
    city: "Patna",
    citySlug: "patna",
    category: "Traditional Regional Meal",
    dietary: "Vegetarian",
    description: "The soul of Bihar: whole wheat dough balls stuffed with spiced roasted gram flour (sattu), ajwain, kalonji, and mustard oil, roasted over cow-dung or coal embers and dipped in pure desi ghee, served with roasted eggplant-tomato chokha.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Patna", "Gaya", "Bodh Gaya"],
    iconicLocations: ["Maurya Lok Complex", "Dak Bungalow Crossing", "Boring Road"],
    verifiedSources: ["Bihar State Tourism Development Corp"],
    servingStyle: "Cracked open, soaked in hot ghee, served with smoky baingan chokha and garlic chutney",
    dishTags: ["Pure Veg", "Must-Try", "Traditional", "Local Food"],
    knownEstablishments: ["Maurya Lok Street Stalls", "Brijwasi Sweets Patna", "Pind Balluchi Patna", "Be Happy Cafe Bodh Gaya"]
  },
  {
    id: "br-nalanda-silao-khaja",
    name: "GI-Tagged Silao Khaja & Thekua",
    state: "Bihar",
    stateSlug: "bihar",
    city: "Bodh Gaya",
    citySlug: "bodh-gaya",
    category: "Heritage Sweet & Confectionery",
    dietary: "Vegetarian",
    description: "Crispy, multi-layered puffed pastry prepared between Nalanda and Rajgir from wheat flour and ghee, steeped in light sugar syrup, along with sacred jaggery-wheat Thekua offered during Chhath.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Silao", "Rajgir", "Bodh Gaya", "Patna"],
    iconicLocations: ["Silao Village", "Mahabodhi Temple Market"],
    verifiedSources: ["GI Registry of India", "Bihar Tourism"],
    servingStyle: "Served crisp at room temperature as heritage sweet snack",
    dishTags: ["Sweets & Desserts", "Must-Try", "Vegetarian", "Heritage"],
    knownEstablishments: ["Silao Khaja Bhandar", "Brijwasi Sweets", "Fujiya Green Bodh Gaya", "Be Happy Cafe"]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 13. ODISHA
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "od-puri-chhena-poda",
    name: "Odisha Chhena Poda & Pahala Rasagola",
    state: "Odisha",
    stateSlug: "odisha",
    city: "Puri",
    citySlug: "puri",
    category: "Traditional Baked Sweet",
    dietary: "Vegetarian",
    description: "Literally 'burnt cheese': fresh cottage cheese kneaded with sugar, cardamom, and cashews, wrapped in sal leaves and baked for hours until the caramelized golden-brown crust develops. GI-pride of Odisha.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Puri", "Bhubaneswar", "Cuttack"],
    iconicLocations: ["Grand Road (Bada Danda)", "Pahala Sweet Belt"],
    verifiedSources: ["Odisha Tourism Development Corporation"],
    servingStyle: "Sliced warm like cake with caramelized edges",
    dishTags: ["Sweets & Desserts", "Must-Try", "Vegetarian", "Heritage"],
    knownEstablishments: ["Grand Road Sweet Stalls", "Pahala Highway Hub", "Mayfair Lagoon Kanika", "Wildgrass Puri"]
  },
  {
    id: "od-puri-dalma-pakhala",
    name: "Odisha Dalma & Temple Mahaprasad (Abadha)",
    state: "Odisha",
    stateSlug: "odisha",
    city: "Puri",
    citySlug: "puri",
    category: "Sacred Temple Cuisine",
    dietary: "Vegetarian",
    description: "Split toor dal slow-cooked in earthenware with raw banana, pumpkin, eggplant, and colocasia, tempered with ghee and roasted cumin-chili powder, representing the sacred Mahaprasad traditions of Lord Jagannath.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Puri", "Bhubaneswar"],
    iconicLocations: ["Ananda Bazaar (Jagannath Temple)", "VIP Road"],
    verifiedSources: ["Shree Jagannath Temple Administration"],
    servingStyle: "Served on sal leaves or clay pots with steamed rice and Odia vegetable ghanta",
    dishTags: ["Pure Veg", "Must-Try", "Traditional", "Sacred Heritage"],
    knownEstablishments: ["Ananda Bazaar (Jagannath Temple)", "Wildgrass Restaurant Puri", "Dalma Restaurant Bhubaneswar", "Kanika Mayfair"]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 14. ANDHRA PRADESH
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "ap-vizag-gongura-mutton",
    name: "Andhra Gongura Mutton & Pesarattu Upma",
    state: "Andhra Pradesh",
    stateSlug: "andhra-pradesh",
    city: "Visakhapatnam",
    citySlug: "visakhapatnam",
    category: "Regional Spicy Delicacy",
    dietary: "Non-Vegetarian & Veg Options",
    description: "Tender goat meat slow-simmered in tangy sour red sorrel leaf (gongura) paste with green chilies, alongside golden whole green-gram dosas (pesarattu) stuffed with hot ginger rava upma.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Visakhapatnam", "Vijayawada", "Tirupati"],
    iconicLocations: ["Dwaraka Nagar", "Beach Road", "Siripuram"],
    verifiedSources: ["Andhra Pradesh Tourism"],
    servingStyle: "Served hot with ginger allam chutney and steamed Sona Masoori rice with ghee",
    dishTags: ["Regional Cuisine", "Must-Try", "Breakfast", "Local Food"],
    knownEstablishments: ["Subbayya Gari Hotel (Vizag & Tirupati)", "Sri Sairam Parlour", "Sea Inn (Raju Gari Dhaba)", "Andhra Spice Tirupati"]
  },
  {
    id: "ap-vizag-andhra-thali",
    name: "Subbayya Gari Butta Bojanam (Andhra Veg Meals)",
    state: "Andhra Pradesh",
    stateSlug: "andhra-pradesh",
    city: "Visakhapatnam",
    citySlug: "visakhapatnam",
    category: "Traditional Veg Feast",
    dietary: "Vegetarian",
    description: "Famous authentic Andhra meal served in bamboo baskets (butta): steaming rice with homemade ghee, podi, gongura pachadi, gutti vankaya (stuffed brinjal), pappu, rasam, and perugu (curd).",
    regionalRelevance: "Highest",
    bestKnownIn: ["Visakhapatnam", "Tirupati", "Rajahmundry"],
    iconicLocations: ["Dwaraka Nagar", "Bhimas Circle Tirupati"],
    verifiedSources: ["Andhra Gastronomy Guild"],
    servingStyle: "Served on banana leaf with endless refills of ghee and podi",
    dishTags: ["Pure Veg", "Must-Try", "Traditional", "Local Food"],
    knownEstablishments: ["Subbayya Gari Hotel", "Sri Sairam Parlour", "Bhimas Deluxe Tirupati", "Kamat Restaurant"]
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 15. UTTARAKHAND
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "uk-rishikesh-kafuli-aloo-gutke",
    name: "Garhwali Kafuli & Aloo Ke Gutke",
    state: "Uttarakhand",
    stateSlug: "uttarakhand",
    city: "Rishikesh",
    citySlug: "rishikesh",
    category: "Traditional Mountain Cuisine",
    dietary: "Vegetarian",
    description: "Nutritious mountain green curry made from spinach and wild fenugreek leaves slow-cooked in iron pots with rice paste and curd, paired with pahadi boiled potatoes tossed in aromatic jakhiya seeds (mountain mustard).",
    regionalRelevance: "Highest",
    bestKnownIn: ["Rishikesh", "Haridwar", "Dehradun", "Nainital"],
    iconicLocations: ["Swarg Ashram", "Tapovan", "Har Ki Pauri"],
    verifiedSources: ["Uttarakhand Tourism Development Board"],
    servingStyle: "Served with hot mandua (finger millet) roti and bhang ki chutney",
    dishTags: ["Pure Veg", "Must-Try", "Mountain Cuisine", "Local Food"],
    knownEstablishments: ["Chotiwala Restaurant (Swarg Ashram)", "The Sitting Elephant", "Mohan Ji Puri Wale Haridwar", "Machan Restaurant Nainital"]
  },
  {
    id: "uk-haridwar-puri-rabri-jalebi",
    name: "Haridwar Mathura Walon Ki Puri & Rabri Jalebi",
    state: "Uttarakhand",
    stateSlug: "uttarakhand",
    city: "Haridwar",
    citySlug: "haridwar",
    category: "Sacred Ghat Street Food",
    dietary: "Vegetarian",
    description: "Crispy fried puris served with fragrant hing-laced potato curry and dry spiced pumpkin (petha), concluded with thick lachhadar rabri ladled over fresh saffron jalebis near the sacred Ganga Ghats.",
    regionalRelevance: "Highest",
    bestKnownIn: ["Haridwar", "Rishikesh"],
    iconicLocations: ["Har Ki Pauri", "Moti Bazaar"],
    verifiedSources: ["Haridwar Cultural Archives"],
    servingStyle: "Served in fresh sal leaf donas facing the holy river Ganga",
    dishTags: ["Breakfast", "Pure Veg", "Must-Try", "Heritage"],
    knownEstablishments: ["Mathura Walon Ki Pracheen Dukan (Har Ki Pauri)", "Mohan Ji Puri Wale", "Chotiwala Swarg Ashram", "Brahm Kuti Haridwar"]
  }
];

/**
 * Filter must-try dishes by state, city, or attraction context
 */
export function getMustTryDishes({ state, city, attraction }) {
  if (!state && !city && !attraction) return regionalFoodData.slice(0, 8);

  const clean = (str = '') => str.toLowerCase().replace(/[^a-z0-9]/g, '');
  const targetCity = clean(city);
  const targetState = clean(state);

  // 1. Exact city matches
  if (targetCity) {
    const cityMatches = regionalFoodData.filter(d =>
      clean(d.city) === targetCity ||
      clean(d.citySlug) === targetCity ||
      d.bestKnownIn.some(b => clean(b) === targetCity)
    );
    if (cityMatches.length > 0) return cityMatches;
  }

  // 2. Exact state matches
  if (targetState) {
    const stateMatches = regionalFoodData.filter(d =>
      clean(d.state) === targetState ||
      clean(d.stateSlug) === targetState
    );
    if (stateMatches.length > 0) return stateMatches;
  }

  return regionalFoodData.slice(0, 6);
}

/**
 * Find dish by ID
 */
export function getDishById(id) {
  return regionalFoodData.find(d => d.id === id) || null;
}

export default regionalFoodData;
