const express = require('express');
const router = express.Router();
const { realRestaurantData, getRestaurantsForContext } = require('../data/realRestaurantData');
const { regionalFoodData, getMustTryDishes } = require('../data/regionalFoodData');

const GROQ_KEY = process.env.GROQ_API_KEY || '';
const API_BASE = `http://localhost:${process.env.PORT || 5000}/api`;

// ── Curated Restaurant Database for Top Indian Destinations ───────────────────
const RESTAURANT_DATABASE = {
  'Jaipur': [
    {
      id: 'jpr-1',
      name: 'Laxmi Misthan Bhandar (LMB)',
      rating: 4.7,
      reviews: '5.2k',
      cuisine: 'Rajasthani & North Indian Thali',
      category: 'Pure Veg',
      priceForTwo: '₹650 for two',
      priceTier: '₹₹',
      area: 'Johari Bazaar, Old Walled City',
      mustTry: 'Royal Rajasthani Thali, Paneer Ghewar, Pyaaz Kachori',
      ambiance: 'Historic Heritage Landmark (est. 1727)',
      timings: '8:00 AM – 11:00 PM'
    },
    {
      id: 'jpr-2',
      name: '1135 AD',
      rating: 4.8,
      reviews: '2.8k',
      cuisine: 'Royal Rajputana & Mughlai Dining',
      category: 'Fine Dining',
      priceForTwo: '₹3,200 for two',
      priceTier: '₹₹₹₹',
      area: 'Amer Fort, Level 2',
      mustTry: 'Laal Maas, Safed Maas, Badam Ka Halwa',
      ambiance: 'Palatial Gold-leaf & Silver-carved Palace Dining',
      timings: '12:00 PM – 10:30 PM'
    },
    {
      id: 'jpr-3',
      name: 'Tapri The Tea House',
      rating: 4.8,
      reviews: '6.4k',
      cuisine: 'Artisan Teas & Indian Street Delicacies',
      category: 'Cafes & Casual',
      priceForTwo: '₹550 for two',
      priceTier: '₹₹',
      area: 'C-Scheme (Opposite Central Park)',
      mustTry: 'Kullad Chai, Bun Maska, Handi Khichdi, Dal Pakwan',
      ambiance: 'Vibrant Rooftop overlooking Central Park',
      timings: '7:30 AM – 10:00 PM'
    },
    {
      id: 'jpr-4',
      name: 'Handi Restaurant',
      rating: 4.6,
      reviews: '3.9k',
      cuisine: 'Clay-pot Handi Curries & Mughlai',
      category: 'Casual Dining',
      priceForTwo: '₹1,200 for two',
      priceTier: '₹₹',
      area: 'MI Road, Near Panch Batti',
      mustTry: 'Handi Meat, Mughlai Chicken, Roomali Roti',
      ambiance: 'Classic Open-terrace Charcoal BBQ Dining',
      timings: '12:00 PM – 11:00 PM'
    },
    {
      id: 'jpr-5',
      name: 'Chokhi Dhani Ethnic Restaurant',
      rating: 4.8,
      reviews: '12k',
      cuisine: 'Authentic Village Rajasthani Feast',
      category: 'Pure Veg',
      priceForTwo: '₹1,800 for two',
      priceTier: '₹₹₹',
      area: '12 Miles, Tonk Road',
      mustTry: 'Unlimited Chaupal Thali, Bajre Ki Roti, Gatte Ki Sabzi',
      ambiance: 'Live Folk Dances, Traditional Seating on Floor',
      timings: '5:00 PM – 11:00 PM'
    },
    {
      id: 'jpr-6',
      name: 'Rawat Misthan Bhandar',
      rating: 4.7,
      reviews: '8.5k',
      cuisine: 'Legendary Indian Snacks & Sweets',
      category: 'Street Food',
      priceForTwo: '₹300 for two',
      priceTier: '₹',
      area: 'Station Road, Sindhi Camp',
      mustTry: 'Iconic Pyaaz Kachori, Mawa Kachori, Jalebi',
      ambiance: 'Bustling Local Eatery, World-famous Takeaway',
      timings: '6:30 AM – 10:30 PM'
    }
  ],
  'Goa': [
    {
      id: 'goa-1',
      name: 'The Fisherman\'s Wharf',
      rating: 4.8,
      reviews: '7.1k',
      cuisine: 'Goan Seafood & Coastal Curries',
      category: 'Fine Dining',
      priceForTwo: '₹1,600 for two',
      priceTier: '₹₹₹',
      area: 'Cavelossim (Riverfront) & Panaji',
      mustTry: 'Kingfish Rawa Fry, Prawn Balchão, Crab Xec Xec',
      ambiance: 'Riverside open-air dining with live acoustic music',
      timings: '12:00 PM – 11:00 PM'
    },
    {
      id: 'goa-2',
      name: 'Gunpowder',
      rating: 4.8,
      reviews: '4.5k',
      cuisine: 'Peninsular South Indian & Coastal Flavors',
      category: 'Casual Dining',
      priceForTwo: '₹1,400 for two',
      priceTier: '₹₹',
      area: 'Assagao, North Goa',
      mustTry: 'Kerala Beef Roast, Pandi Curry, Appams, Sol Kadhi',
      ambiance: 'Restored Portuguese Villa Courtyard with boutique craft shops',
      timings: '12:00 PM – 11:00 PM'
    },
    {
      id: 'goa-3',
      name: 'Vinayak Family Restaurant',
      rating: 4.7,
      reviews: '5.9k',
      cuisine: 'Authentic Goan Fish Thali',
      category: 'Street Food',
      priceForTwo: '₹600 for two',
      priceTier: '₹',
      area: 'Assagao Fields, North Goa',
      mustTry: 'Special Goan Fish Thali, Chonak Rava Fry, Tisryo Sukha',
      ambiance: 'Unpretentious Local Diner overlooking emerald paddy fields',
      timings: '12:30 PM – 3:30 PM, 7:00 PM – 10:30 PM'
    },
    {
      id: 'goa-4',
      name: 'Thalassa',
      rating: 4.7,
      reviews: '9.2k',
      cuisine: 'Greek & Mediterranean Coastal',
      category: 'Fine Dining',
      priceForTwo: '₹2,600 for two',
      priceTier: '₹₹₹₹',
      area: 'Siolim Waterfront',
      mustTry: 'Souvlaki, Gyros, Grilled Calamari, Baklava',
      ambiance: 'Iconic sunset views over the backwaters with music',
      timings: '12:00 PM – 1:00 AM'
    },
    {
      id: 'goa-5',
      name: 'Martin\'s Corner',
      rating: 4.7,
      reviews: '8.8k',
      cuisine: 'Goan Coastal & Continental',
      category: 'Casual Dining',
      priceForTwo: '₹1,500 for two',
      priceTier: '₹₹',
      area: 'Betalbatim, South Goa',
      mustTry: 'Butter Garlic Crab, Pork Vindaloo, Bebinca with Ice Cream',
      ambiance: 'Celebrity-favorite Goan tavern with festive vibes',
      timings: '11:30 AM – 11:30 PM'
    }
  ],
  'Chennai': [
    {
      id: 'chn-1',
      name: 'Murugan Idli Shop',
      rating: 4.7,
      reviews: '9.8k',
      cuisine: 'Traditional Tamil Tiffin & Meals',
      category: 'Pure Veg',
      priceForTwo: '₹350 for two',
      priceTier: '₹',
      area: 'T. Nagar & Besant Nagar',
      mustTry: 'Soft Mallipoo Idli, Ghee Podi Idli, Onion Uthappam, Jigarthanda',
      ambiance: 'High-energy authentic South Indian Banana Leaf service',
      timings: '7:00 AM – 11:00 PM'
    },
    {
      id: 'chn-2',
      name: 'Rayar\'s Mess',
      rating: 4.8,
      reviews: '3.4k',
      cuisine: 'Heritage Mylapore Tiffin',
      category: 'Street Food',
      priceForTwo: '₹220 for two',
      priceTier: '₹',
      area: 'Mylapore (Near Kapaleeshwarar Temple)',
      mustTry: 'Crispy Medu Vada, Hot Ven Pongal with Ghee, Filter Kaapi',
      ambiance: '80-year-old intimate heritage lane mess',
      timings: '7:00 AM – 10:30 AM, 3:00 PM – 6:30 PM'
    },
    {
      id: 'chn-3',
      name: 'Annalakshmi Restaurant',
      rating: 4.8,
      reviews: '2.6k',
      cuisine: 'Temple-style Royal South Indian Thali',
      category: 'Pure Veg',
      priceForTwo: '₹1,600 for two',
      priceTier: '₹₹₹',
      area: 'Rukmani Lakshmipathy Road, Egmore',
      mustTry: 'Maharaja Thali, Payasam, Kootu, Rasam',
      ambiance: 'Art-gallery inspired sanctum with classical Carnatic music',
      timings: '12:00 PM – 3:00 PM, 7:00 PM – 10:00 PM'
    },
    {
      id: 'chn-4',
      name: 'Junior Kuppanna',
      rating: 4.6,
      reviews: '5.1k',
      cuisine: 'Kongu Nadu & Chettinad Non-Veg',
      category: 'Casual Dining',
      priceForTwo: '₹900 for two',
      priceTier: '₹₹',
      area: 'T. Nagar / Nungambakkam',
      mustTry: 'Mutton Chukka, Madurai Mutton Biryani, Pallipalayam Chicken',
      ambiance: 'Aromatic spicy South Indian feast on plantain leaf',
      timings: '11:30 AM – 11:00 PM'
    },
    {
      id: 'chn-5',
      name: 'The Flying Elephant (Park Hyatt)',
      rating: 4.9,
      reviews: '2.1k',
      cuisine: 'Multi-level Global & Pan-Asian Dining',
      category: 'Fine Dining',
      priceForTwo: '₹4,500 for two',
      priceTier: '₹₹₹₹',
      area: 'Guindy',
      mustTry: 'Dim Sums, Wood-fired Truffle Pizza, Signature Cocktails',
      ambiance: 'Architectural theater with 5 live cooking kitchens',
      timings: '7:00 PM – 1:00 AM'
    }
  ],
  'Varanasi': [
    {
      id: 'vns-1',
      name: 'Kashi Chat Bhandar',
      rating: 4.8,
      reviews: '8.4k',
      cuisine: 'Authentic Banarasi Street Chaat',
      category: 'Street Food',
      priceForTwo: '₹200 for two',
      priceTier: '₹',
      area: 'Godowlia Chowk',
      mustTry: 'Tamatar Chaat, Palak Patta Chaat, Dahi Golgappe',
      ambiance: 'Legendary street stall crowded with food lovers',
      timings: '2:00 PM – 10:30 PM'
    },
    {
      id: 'vns-2',
      name: 'Dolphin Restaurant',
      rating: 4.7,
      reviews: '2.3k',
      cuisine: 'North Indian & Awadhi Thali',
      category: 'Pure Veg',
      priceForTwo: '₹850 for two',
      priceTier: '₹₹',
      area: 'Man Mandir Ghat',
      mustTry: 'Banarasi Thali, Paneer Lababdar, Fresh Mint Lassi',
      ambiance: 'Spectacular Rooftop panoramic view of the holy river Ganga',
      timings: '7:30 AM – 10:00 PM'
    },
    {
      id: 'vns-3',
      name: 'Baati Chokha Restaurant',
      rating: 4.8,
      reviews: '5.6k',
      cuisine: 'Traditional Clay Oven Bhojpuri Delights',
      category: 'Casual Dining',
      priceForTwo: '₹650 for two',
      priceTier: '₹₹',
      area: 'Teliyabag & Anand Nagar',
      mustTry: 'Sattu Litti with Baingan Chokha, Desi Ghee Thali, Kheer',
      ambiance: 'Rustic village theme with charpoys and mud walls',
      timings: '11:00 AM – 11:00 PM'
    },
    {
      id: 'vns-4',
      name: 'Blue Lassi Shop',
      rating: 4.8,
      reviews: '6.2k',
      cuisine: 'Artisan Hand-churned Lassi',
      category: 'Street Food',
      priceForTwo: '₹160 for two',
      priceTier: '₹',
      area: 'Bangali Tola (Near Manikarnika Ghat)',
      mustTry: 'Pomegranate Lassi, Blueberry Rabri Lassi, Dry Fruit Malai Lassi',
      ambiance: 'Tiny 80-year-old shop covered with traveler passport photos',
      timings: '9:00 AM – 10:00 PM'
    }
  ],
  'Bangalore': [
    {
      id: 'blr-1',
      name: 'Vidyarthi Bhavan',
      rating: 4.8,
      reviews: '14k',
      cuisine: 'Historic Karnataka Tiffin',
      category: 'Pure Veg',
      priceForTwo: '₹260 for two',
      priceTier: '₹',
      area: 'Gandhi Bazaar, Basavanagudi',
      mustTry: 'Legendary Crispy Ghee Masala Dosa, Khara Bath, Filter Coffee',
      ambiance: 'Iconic 1943 heritage eatery adored by writers and foodies',
      timings: '6:30 AM – 11:30 AM, 2:00 PM – 8:00 PM'
    },
    {
      id: 'blr-2',
      name: 'Karavalli (The Gateway Hotel)',
      rating: 4.9,
      reviews: '3.1k',
      cuisine: 'Coastal Mangalorean & Kerala Seafood',
      category: 'Fine Dining',
      priceForTwo: '₹3,500 for two',
      priceTier: '₹₹₹₹',
      area: 'Residency Road',
      mustTry: 'Meen Pollichathu, Kori Gassi, Appams, Crab Milagu Fry',
      ambiance: 'Courtyard tiled Mangalorean colonial home under tamarind trees',
      timings: '12:30 PM – 3:00 PM, 7:00 PM – 11:00 PM'
    },
    {
      id: 'blr-3',
      name: 'Nagarjuna Restaurant',
      rating: 4.7,
      reviews: '9.2k',
      cuisine: 'Fiery Andhra Meals & Biryani',
      category: 'Casual Dining',
      priceForTwo: '₹850 for two',
      priceTier: '₹₹',
      area: 'Residency Road / Indiranagar',
      mustTry: 'Andhra Meals with Gongura Chutney, Chicken Sholay Kebab, Biryani',
      ambiance: 'High-speed authentic banana leaf Andhra dining',
      timings: '12:00 PM – 4:00 PM, 7:00 PM – 11:00 PM'
    },
    {
      id: 'blr-4',
      name: 'Toit Brewpub',
      rating: 4.8,
      reviews: '16k',
      cuisine: 'Craft Brews & European Pub Fare',
      category: 'Cafes & Casual',
      priceForTwo: '₹2,200 for two',
      priceTier: '₹₹₹',
      area: '100ft Road, Indiranagar',
      mustTry: 'Basmati Blonde Ale, Tin Man Wood-fired Pizza, Baked Nachos',
      ambiance: 'Pioneer multi-story microbrewery with electric pub energy',
      timings: '8:30 AM – 1:00 AM'
    }
  ],
  'Delhi': [
    {
      id: 'del-1',
      name: 'Karim\'s (Original)',
      rating: 4.7,
      reviews: '18k',
      cuisine: 'Royal Mughlai Heritage',
      category: 'Casual Dining',
      priceForTwo: '₹950 for two',
      priceTier: '₹₹',
      area: 'Gali Kababian, Jama Masjid, Old Delhi',
      mustTry: 'Mutton Korma, Mutton Nihari, Seekh Kebab, Khamiri Roti',
      ambiance: 'Centuries of Mughal royal chef lineage since 1913',
      timings: '11:00 AM – 11:30 PM'
    },
    {
      id: 'del-2',
      name: 'Bukhara (ITC Maurya)',
      rating: 4.9,
      reviews: '4.8k',
      cuisine: 'North-West Frontier Tandoori',
      category: 'Fine Dining',
      priceForTwo: '₹7,500 for two',
      priceTier: '₹₹₹₹',
      area: 'Diplomatic Enclave, Chanakyapuri',
      mustTry: 'World-famous Dal Bukhara (simmered 18 hours), Sikandari Raan',
      ambiance: 'Globally celebrated dining without cutlery in stone-clad rustic hall',
      timings: '12:30 PM – 2:45 PM, 7:00 PM – 11:45 PM'
    },
    {
      id: 'del-3',
      name: 'Gulati Restaurant',
      rating: 4.8,
      reviews: '8.1k',
      cuisine: 'North Indian & Punjabi Curries',
      category: 'Casual Dining',
      priceForTwo: '₹1,800 for two',
      priceTier: '₹₹₹',
      area: 'Pandara Road Market',
      mustTry: 'Butter Chicken, Dal Makhani, Kakori Kebab, Garlic Naan',
      ambiance: 'Delhi\'s premier culinary strip for late night curry cravings',
      timings: '12:00 PM – 12:00 AM'
    },
    {
      id: 'del-4',
      name: 'Saravana Bhavan',
      rating: 4.6,
      reviews: '9.5k',
      cuisine: 'South Indian Vegetarian',
      category: 'Pure Veg',
      priceForTwo: '₹600 for two',
      priceTier: '₹₹',
      area: 'Janpath / Connaught Place',
      mustTry: 'Ghee Roast Dosa, Mini Tiffin, Rava Kesari, Filter Coffee',
      ambiance: 'Fast, bustling South Indian staple in Central Delhi',
      timings: '8:00 AM – 11:00 PM'
    }
  ],
  'Kochi': [
    {
      id: 'koc-1',
      name: 'Paragon Restaurant',
      rating: 4.8,
      reviews: '11k',
      cuisine: 'Malabar & Coastal Kerala',
      category: 'Casual Dining',
      priceForTwo: '₹800 for two',
      priceTier: '₹₹',
      area: 'Lulu Mall / Aster Medcity Road',
      mustTry: 'Award-winning Malabar Mutton Biryani, Fish Mango Curry, Appam',
      ambiance: 'World-famous Calicut culinary legacy',
      timings: '11:00 AM – 11:00 PM'
    },
    {
      id: 'koc-2',
      name: 'Kashi Art Cafe',
      rating: 4.7,
      reviews: '4.6k',
      cuisine: 'Continental, Healthy Bowls & Artisan Coffee',
      category: 'Cafes & Casual',
      priceForTwo: '₹650 for two',
      priceTier: '₹₹',
      area: 'Burgher Street, Fort Kochi',
      mustTry: 'French Toast, Artisan Roast Coffee, Warm Chocolate Cake',
      ambiance: 'Contemporary art gallery garden cafe under leafy foliage',
      timings: '8:30 AM – 9:00 PM'
    },
    {
      id: 'koc-3',
      name: 'Oceanos Restaurant',
      rating: 4.7,
      reviews: '2.9k',
      cuisine: 'Seafood Specialities & Karimeen',
      category: 'Casual Dining',
      priceForTwo: '₹1,200 for two',
      priceTier: '₹₹',
      area: 'Elphinstone Road, Fort Kochi',
      mustTry: 'Karimeen Pollichathu, Tiger Prawns Pepper Fry, Kerala Parotta',
      ambiance: 'Cozy heritage boutique atmosphere',
      timings: '12:30 PM – 10:30 PM'
    }
  ],
  'Munnar': [
    {
      id: 'mun-1',
      name: 'Rapsy Restaurant',
      rating: 4.5,
      reviews: '3.7k',
      cuisine: 'Kerala Comfort Food & Breakfast',
      category: 'Street Food',
      priceForTwo: '₹400 for two',
      priceTier: '₹',
      area: 'Main Bazaar Road, Munnar Town',
      mustTry: 'Spanish Omelette, Malabar Beef Fry, Coin Parotta',
      ambiance: 'Historic backpacker-favorite diner in the heart of town',
      timings: '7:00 AM – 10:00 PM'
    },
    {
      id: 'mun-2',
      name: 'Saravana Bhavan Munnar',
      rating: 4.4,
      reviews: '5.2k',
      cuisine: 'Pure Veg South Indian Thali',
      category: 'Pure Veg',
      priceForTwo: '₹350 for two',
      priceTier: '₹',
      area: 'M.G. Road, Munnar',
      mustTry: 'South Indian Unlimited Meals, Ghee Podi Dosa, Filter Coffee',
      ambiance: 'Clean and bustling family vegetarian haven',
      timings: '6:30 AM – 10:30 PM'
    },
    {
      id: 'mun-3',
      name: 'Copper Castle Mountain View',
      rating: 4.7,
      reviews: '1.8k',
      cuisine: 'Multi-Cuisine & Kerala Specialities',
      category: 'Fine Dining',
      priceForTwo: '₹1,300 for two',
      priceTier: '₹₹₹',
      area: 'Kannandevan Hills, Munnar',
      mustTry: 'Kerala Duck Roast, Appam with Vegetable Stew, Grilled Fish',
      ambiance: 'Dramatic valley terrace dining facing mist-shrouded tea gardens',
      timings: '7:30 AM – 10:30 PM'
    }
  ],
  'Mumbai': [
    {
      id: 'mum-1',
      name: 'Britannia & Co. Restaurant',
      rating: 4.7,
      reviews: '6.5k',
      cuisine: 'Iconic Parsi & Irani Cuisine',
      category: 'Casual Dining',
      priceForTwo: '₹1,100 for two',
      priceTier: '₹₹',
      area: 'Ballard Estate, Fort',
      mustTry: 'Berry Pulao, Sali Boti, Caramel Custard, Raspberry Soda',
      ambiance: '1923 colonial cafe with vintage bentwood chairs and nostalgia',
      timings: '12:00 PM – 4:00 PM (Closed Sundays)'
    },
    {
      id: 'mum-2',
      name: 'Trishna',
      rating: 4.8,
      reviews: '4.2k',
      cuisine: 'Coastal Mangalorean Seafood',
      category: 'Fine Dining',
      priceForTwo: '₹2,600 for two',
      priceTier: '₹₹₹',
      area: 'Kala Ghoda, Fort',
      mustTry: 'World-famous Butter Garlic King Crab, Koliwada Prawns',
      ambiance: 'Legendary cozy seafood haunt acclaimed worldwide',
      timings: '12:00 PM – 3:30 PM, 6:30 PM – 11:30 PM'
    },
    {
      id: 'mum-3',
      name: 'Shree Thaker Bhojanalay',
      rating: 4.9,
      reviews: '5.8k',
      cuisine: 'Royal Gujarati & Rajasthani Thali',
      category: 'Pure Veg',
      priceForTwo: '₹1,400 for two',
      priceTier: '₹₹',
      area: 'Kalbadevi, Old Mumbai',
      mustTry: 'Unlimited Grand Thali with 5 types of rotis, Aamras, Farsan',
      ambiance: '1945 family-run dining hall serving the best Thali in Mumbai',
      timings: '11:30 AM – 3:30 PM, 7:00 PM – 10:30 PM'
    }
  ],
  'Hyderabad': [
    {
      id: 'hyd-1',
      name: 'Bawarchi & Paradise',
      rating: 4.8,
      reviews: '24k',
      cuisine: 'Authentic Hyderabadi Dum Biryani',
      category: 'Casual Dining',
      priceForTwo: '₹750 for two',
      priceTier: '₹₹',
      area: 'RTC X Roads & Secunderabad',
      mustTry: 'Mutton Dum Biryani, Mirchi Ka Salan, Double Ka Meetha',
      ambiance: 'The benchmark of traditional wood-fired Hyderabadi biryani',
      timings: '11:30 AM – 11:30 PM'
    },
    {
      id: 'hyd-2',
      name: 'Shah Ghouse Cafe',
      rating: 4.8,
      reviews: '14k',
      cuisine: 'Hyderabadi Mughlai & Irani Cafe',
      category: 'Street Food',
      priceForTwo: '₹600 for two',
      priceTier: '₹',
      area: 'Tolichowki & Charminar',
      mustTry: 'Famous Mutton Haleem, Boti Kebab, Irani Chai with Osmania Biscuit',
      ambiance: 'Historic aroma-filled hub for late night foodies',
      timings: '5:00 AM – 2:00 AM'
    },
    {
      id: 'hyd-3',
      name: 'Jewel of Nizam (The Minar)',
      rating: 4.9,
      reviews: '2.5k',
      cuisine: 'Royal Nizam Royal Court Feast',
      category: 'Fine Dining',
      priceForTwo: '₹4,200 for two',
      priceTier: '₹₹₹₹',
      area: 'The Golkonda Resort, Gandipet',
      mustTry: 'Anokhi Kheer, Kache Gosht Ki Biryani, Subz Dum Handi',
      ambiance: '100-foot high 5th-floor luxury tower with lake views',
      timings: '12:30 PM – 3:30 PM, 7:30 PM – 11:30 PM'
    }
  ],
  'Pondicherry': [
    {
      id: 'pon-1',
      name: 'Coromandel Cafe',
      rating: 4.8,
      reviews: '6.8k',
      cuisine: 'Franco-Tamil & Artisanal European',
      category: 'Cafes & Casual',
      priceForTwo: '₹1,400 for two',
      priceTier: '₹₹₹',
      area: 'Romain Rolland Street, White Town',
      mustTry: 'Smoked Salmon Benedict, Hot Chocolate, Artisanal Truffle Pasta',
      ambiance: 'Stunning 19th-century French colonial villa with lush courtyard',
      timings: '8:30 AM – 10:30 PM'
    },
    {
      id: 'pon-2',
      name: 'Café des Arts',
      rating: 4.7,
      reviews: '5.1k',
      cuisine: 'French Creperie & Artisan Coffee',
      category: 'Cafes & Casual',
      priceForTwo: '₹800 for two',
      priceTier: '₹₹',
      area: 'Suffren Street, White Town',
      mustTry: 'Nutella & Banana Crepe, Croque Monsieur, Fresh Hibiscus Iced Tea',
      ambiance: 'Vintage French townhouse with iconic yellow facade and bohemian art',
      timings: '9:00 AM – 7:00 PM (Closed Tue)'
    },
    {
      id: 'pon-3',
      name: 'Surguru Restaurant',
      rating: 4.6,
      reviews: '8.4k',
      cuisine: 'Pure Veg Traditional South Indian',
      category: 'Pure Veg',
      priceForTwo: '₹350 for two',
      priceTier: '₹',
      area: 'Mission Street, Heritage Town',
      mustTry: 'Crispy Ghee Roast Dosa, Ven Pongal, South Indian Special Meals',
      ambiance: 'Bustling authentic vegetarian diner loved by locals and travelers',
      timings: '7:00 AM – 10:30 PM'
    },
    {
      id: 'pon-4',
      name: 'Le Dupleix Restaurant',
      rating: 4.8,
      reviews: '3.2k',
      cuisine: 'French Gourmet & Coastal Seafood',
      category: 'Fine Dining',
      priceForTwo: '₹2,400 for two',
      priceTier: '₹₹₹',
      area: 'Rue de la Caserne, White Town',
      mustTry: 'Duck Confit, Grilled Tiger Prawns in Creole Sauce, Crepe Suzette',
      ambiance: 'Courtyard fine dining under a majestic 200-year-old neem tree',
      timings: '12:30 PM – 11:00 PM'
    },
    {
      id: 'pon-5',
      name: 'Tanto Pizzeria',
      rating: 4.7,
      reviews: '4.9k',
      cuisine: 'Authentic Wood-Fired Italian Pizzas',
      category: 'Casual Dining',
      priceForTwo: '₹950 for two',
      priceTier: '₹₹',
      area: 'Auroville Main Road / ECR',
      mustTry: 'Quattro Formaggi Pizza, Homemade Pesto Pasta, Sea Salt Gelato',
      ambiance: 'Open-air tropical garden with true Napoli wood-fired stone ovens',
      timings: '12:00 PM – 10:00 PM'
    }
  ],
  'Agra': [
    {
      id: 'agr-1',
      name: 'Pinch of Spice',
      rating: 4.7,
      reviews: '7.8k',
      cuisine: 'Royal Mughlai & North Indian Curries',
      category: 'Casual Dining',
      priceForTwo: '₹1,400 for two',
      priceTier: '₹₹',
      area: 'Fatehabad Road (Near Taj Mahal)',
      mustTry: 'Murg Boti Masala, Dal Makhani, Paneer Lababdar, Garlic Naan',
      ambiance: 'Upscale family dining acclaimed for rich aromatic Mughlai gravies',
      timings: '12:00 PM – 11:00 PM'
    },
    {
      id: 'agr-2',
      name: 'Peshawri (ITC Mughal)',
      rating: 4.9,
      reviews: '3.6k',
      cuisine: 'North-West Frontier & Clay Tandoor',
      category: 'Fine Dining',
      priceForTwo: '₹4,500 for two',
      priceTier: '₹₹₹₹',
      area: 'Fatehabad Road, Taj Ganj',
      mustTry: 'World-famous Dal Bukhara (simmered 18 hours), Sikandari Raan, Tandoori Jhinga',
      ambiance: 'Award-winning rustic earthen luxury hall with live open charcoal tandoor',
      timings: '12:30 PM – 3:00 PM, 7:00 PM – 11:30 PM'
    },
    {
      id: 'agr-3',
      name: 'Deviram Sweets & Restaurant',
      rating: 4.6,
      reviews: '6.2k',
      cuisine: 'Iconic Bedmi Puri & Agra Street Breakfast',
      category: 'Street Food',
      priceForTwo: '₹220 for two',
      priceTier: '₹',
      area: 'Pratap Pura & Sadar Bazaar',
      mustTry: 'Crispy Bedmi Puri with Spicy Aloo Sabzi, Hot Jalebi, Rabri',
      ambiance: '70-year-old morning breakfast pilgrimage beloved by Agra locals',
      timings: '7:00 AM – 10:00 PM'
    },
    {
      id: 'agr-4',
      name: 'Dasaprakash',
      rating: 4.6,
      reviews: '4.1k',
      cuisine: 'Pure Veg South Indian & North Indian Meals',
      category: 'Pure Veg',
      priceForTwo: '₹700 for two',
      priceTier: '₹₹',
      area: 'Meher Cinema Complex, Gwalior Road',
      mustTry: 'Special South Indian Maharaja Thali, Masala Dosa, Kulfi',
      ambiance: 'Quiet, spotless vegetarian sanctuary with vintage 1920s heritage',
      timings: '8:00 AM – 10:30 PM'
    },
    {
      id: 'agr-5',
      name: 'Panchhi Petha Store',
      rating: 4.8,
      reviews: '9.4k',
      cuisine: 'World-Famous Authentic Agra Petha & Sweets',
      category: 'Street Food',
      priceForTwo: '₹250 for two',
      priceTier: '₹',
      area: 'Sadar Bazaar / Hari Parvat',
      mustTry: 'Kesar Angoori Petha, Paan Petha, Chocolate Petha, Spicy Dalmoth',
      ambiance: 'The historic benchmark of GI-tagged authentic Agra Petha',
      timings: '9:00 AM – 10:30 PM'
    }
  ],
  'Yercaud': [
    {
      id: 'yer-1',
      name: 'Sweet Rascal',
      rating: 4.8,
      reviews: '2.4k',
      cuisine: 'Artisan Homestyle Continental & Anglo-Indian',
      category: 'Casual Dining',
      priceForTwo: '₹1,200 for two',
      priceTier: '₹₹',
      area: 'Tipperary Road, Yercaud',
      mustTry: 'Roast Lamb, Pepper Chicken, Handmade Pastas, Hot Apple Crumble',
      ambiance: 'Quirky boutique garden eatery filled with vintage curios and lush greenery',
      timings: '12:30 PM – 9:30 PM'
    },
    {
      id: 'yer-2',
      name: 'The Orange Restaurant',
      rating: 4.6,
      reviews: '3.1k',
      cuisine: 'Multi-Cuisine Hillside Dining with Views',
      category: 'Casual Dining',
      priceForTwo: '₹900 for two',
      priceTier: '₹₹',
      area: 'Grange Resort, Pakkoda Point Road',
      mustTry: 'Salem Kozhi Varuval, Tandoori Platter, Appam with Vegetable Stew',
      ambiance: 'Scenic hillside dining surrounded by citrus orange groves and silver oaks',
      timings: '7:30 AM – 10:30 PM'
    },
    {
      id: 'yer-3',
      name: 'Salem Heights (Grand Palace)',
      rating: 4.7,
      reviews: '1.9k',
      cuisine: 'Fine Dining with Shevaroy Valley Panoramas',
      category: 'Fine Dining',
      priceForTwo: '₹1,800 for two',
      priceTier: '₹₹₹',
      area: 'Killiyur Falls Road, Yercaud',
      mustTry: 'Chettinad Fish Curry, Butter Naan, Grilled Vegetables, Caramel Custard',
      ambiance: 'Rooftop cliffside perch overlooking emerald valley slopes and lake',
      timings: '7:00 AM – 10:30 PM'
    },
    {
      id: 'yer-4',
      name: 'Saravana Bhavan Elite Yercaud',
      rating: 4.5,
      reviews: '4.8k',
      cuisine: 'Pure Veg South Indian Tiffin & Meals',
      category: 'Pure Veg',
      priceForTwo: '₹350 for two',
      priceTier: '₹',
      area: 'Near Yercaud Lake & Bus Stand',
      mustTry: 'Hot Ghee Roast Dosa, Filter Kaapi, Full South Indian Lunch Meals',
      ambiance: 'Bustling, warm pure vegetarian haven right by the scenic lake promenade',
      timings: '7:00 AM – 10:00 PM'
    },
    {
      id: 'yer-5',
      name: 'Brook\'s Bistro',
      rating: 4.6,
      reviews: '1.6k',
      cuisine: 'Cozy Mountain Coffee House & Pizzas',
      category: 'Cafes & Casual',
      priceForTwo: '₹650 for two',
      priceTier: '₹₹',
      area: 'Lady\'s Seat Road',
      mustTry: 'Shevaroy Hill Single-Origin Filter Coffee, Handcrafted Burgers, Pizza',
      ambiance: 'Charming misty mountain cafe with scenic wooden balcony seating',
      timings: '9:00 AM – 9:00 PM'
    }
  ],
  'Udaipur': [
    {
      id: 'udr-1',
      name: 'Ambrai (Amet Haveli)',
      rating: 4.9,
      reviews: '7.8k',
      cuisine: 'Royal Mewari Heritage & North Indian',
      category: 'Fine Dining',
      priceForTwo: '₹2,600 for two',
      priceTier: '₹₹₹',
      area: 'Amet Haveli, Naga Nagri, Lake Pichola',
      mustTry: 'Mewari Mutton Laal Maas, Ker Sangri, Paneer Tikka Lababdar',
      ambiance: 'Spectacular water-edge dining directly facing City Palace & Lake Palace',
      timings: '12:30 PM – 3:30 PM, 6:30 PM – 11:00 PM'
    },
    {
      id: 'udr-2',
      name: 'Krishna Dal Baati Restro',
      rating: 4.8,
      reviews: '5.2k',
      cuisine: 'Authentic Unlimited Mewari Thali',
      category: 'Pure Veg',
      priceForTwo: '₹550 for two',
      priceTier: '₹',
      area: 'Jalsham Marg, Near Gulab Bagh',
      mustTry: 'Unlimited Dal Baati Churma, Gatte Ki Sabzi, Desi Ghee Baati, Chaas',
      ambiance: 'No-frills, 100% authentic Rajasthani dining overflowing with pure desi ghee',
      timings: '11:00 AM – 10:00 PM'
    },
    {
      id: 'udr-3',
      name: 'Jagat Niwas Rooftop Restaurant',
      rating: 4.8,
      reviews: '4.4k',
      cuisine: 'Palatial Lake View Rooftop Dining',
      category: 'Fine Dining',
      priceForTwo: '₹1,900 for two',
      priceTier: '₹₹₹',
      area: 'Lal Ghat, Lake Pichola',
      mustTry: 'Safed Maas, Murgh Tikka, Dahi Ke Kebab, Mewari Pulao',
      ambiance: 'Restored 17th-century haveli jharokhas perched over glowing waters',
      timings: '7:30 AM – 10:30 PM'
    },
    {
      id: 'udr-4',
      name: 'Jheel\'s Ginger Coffee & Bakery',
      rating: 4.7,
      reviews: '6.1k',
      cuisine: 'Waterfront Coffee & Italian Delights',
      category: 'Cafes & Casual',
      priceForTwo: '₹600 for two',
      priceTier: '₹₹',
      area: 'Gangaur Ghat, Old City',
      mustTry: 'Hazelnut Frappe, Thin Crust Wood-Fired Pizza, Banoffee Pie',
      ambiance: 'Rooftop cafe right above the lake ghat with breath-taking sunset vistas',
      timings: '8:00 AM – 10:00 PM'
    },
    {
      id: 'udr-5',
      name: 'Millets of Mewar',
      rating: 4.7,
      reviews: '3.8k',
      cuisine: 'Organic, Healthy & Vegan Mewari Fusion',
      category: 'Pure Veg',
      priceForTwo: '₹850 for two',
      priceTier: '₹₹',
      area: 'Outside Chandpole, Hanuman Ghat',
      mustTry: 'Millet Thali, Bajra Roti, Tofu Tikka Masala, Raw Papaya Salad',
      ambiance: 'Udaipur\'s pioneer organic healthy restaurant dedicated to ancient grains',
      timings: '10:00 AM – 10:30 PM'
    }
  ],
  'Kolkata': [
    {
      id: 'kol-1',
      name: 'Peter Cat',
      rating: 4.9,
      reviews: '14.5k',
      cuisine: 'Legendary Continental & Oriental Dining',
      category: 'Casual Dining',
      priceForTwo: '₹1,400 for two',
      priceTier: '₹₹',
      area: 'Park Street',
      mustTry: 'World-famous Chelo Kebab (with buttered rice & egg yolk), Sizzlers',
      ambiance: 'Iconic 1975 Park Street heritage restaurant with dim lamps and nostalgia',
      timings: '12:00 PM – 11:00 PM'
    },
    {
      id: 'kol-2',
      name: 'Arsalan',
      rating: 4.8,
      reviews: '16.2k',
      cuisine: 'Legendary Kolkata Mughlai & Biryani',
      category: 'Casual Dining',
      priceForTwo: '₹850 for two',
      priceTier: '₹₹',
      area: 'Park Circus 7-Point Crossing',
      mustTry: 'Kolkata Mutton Biryani (with golden potato), Mutton Chaap, Firni',
      ambiance: 'The reigning temple of Kolkata fragrant dum biryani and Awadhi chaap',
      timings: '11:00 AM – 11:30 PM'
    },
    {
      id: 'kol-3',
      name: '6 Ballygunge Place',
      rating: 4.8,
      reviews: '7.8k',
      cuisine: 'Heritage Bengali Grandmother Thalis',
      category: 'Casual Dining',
      priceForTwo: '₹1,300 for two',
      priceTier: '₹₹',
      area: 'Ballygunge & Salt Lake',
      mustTry: 'Daab Chingri (prawns in tender coconut), Kosha Mangsho, Luchi, Chitol Muitha',
      ambiance: 'Grand white heritage bungalow dedicated to 100-year-old Bengali recipes',
      timings: '12:30 PM – 3:30 PM, 7:00 PM – 10:30 PM'
    },
    {
      id: 'kol-4',
      name: 'Flurys',
      rating: 4.7,
      reviews: '9.3k',
      cuisine: '1927 European Tearoom & Confectionery',
      category: 'Cafes & Casual',
      priceForTwo: '₹900 for two',
      priceTier: '₹₹',
      area: 'Park Street',
      mustTry: 'English Breakfast, Rum Balls, Baba Cake, Darjeeling Tea',
      ambiance: 'British Raj era iconic tearoom patronized by Nobel laureates and film legends',
      timings: '7:30 AM – 10:30 PM'
    },
    {
      id: 'kol-5',
      name: 'Balaram Mullick & Radharaman Mullick',
      rating: 4.9,
      reviews: '8.1k',
      cuisine: 'Artisan Bengali Mishti & Sweets',
      category: 'Street Food',
      priceForTwo: '₹250 for two',
      priceTier: '₹',
      area: 'Bhowanipore / Park Street',
      mustTry: 'Baked Rosogolla, Mishti Doi, Nolen Gur Sandesh, Jalbhara',
      ambiance: '1885 heritage confectioner revolutionizing legendary Bengali sweets',
      timings: '7:00 AM – 10:30 PM'
    }
  ],
  'Amritsar': [
    {
      id: 'asr-1',
      name: 'Kesar Da Dhaba',
      rating: 4.8,
      reviews: '13.2k',
      cuisine: 'Centuries-Old Pure Desi Ghee Dhaba',
      category: 'Pure Veg',
      priceForTwo: '₹450 for two',
      priceTier: '₹',
      area: 'Chowk Passian, Near Town Hall',
      mustTry: 'Maa Ki Dal (slow simmered 24 hours), Laccha Paratha, Baingan Bharta, Phirni',
      ambiance: 'Heritage 1916 dhaba renowned across India for divine ghee lentils',
      timings: '11:00 AM – 11:00 PM'
    },
    {
      id: 'asr-2',
      name: 'Kulcha Land',
      rating: 4.8,
      reviews: '8.4k',
      cuisine: 'Crispy Stuffed Amritsari Kulcha',
      category: 'Street Food',
      priceForTwo: '₹280 for two',
      priceTier: '₹',
      area: 'Ranjit Avenue, Amritsar',
      mustTry: 'Amritsari Aloo Pyaaz Kulcha with Chole & Imli Chutney, Lassi',
      ambiance: 'Crisp, layered tandoor-baked kulchas drenched in fresh yellow butter',
      timings: '8:30 AM – 4:30 PM'
    },
    {
      id: 'asr-3',
      name: 'Beera Chicken Corner',
      rating: 4.7,
      reviews: '6.9k',
      cuisine: 'Legendary Tandoori & Roast Chicken',
      category: 'Street Food',
      priceForTwo: '₹600 for two',
      priceTier: '₹',
      area: 'Majitha Road, Amritsar',
      mustTry: 'Whole Tandoori Chicken, Keema Naan, Fish Tikka',
      ambiance: '1972 street icon celebrated by celebrity chefs worldwide',
      timings: '1:00 PM – 11:00 PM'
    },
    {
      id: 'asr-4',
      name: 'Ahuja Milk Centre',
      rating: 4.9,
      reviews: '7.1k',
      cuisine: 'World-Famous Kesar Lassi',
      category: 'Street Food',
      priceForTwo: '₹140 for two',
      priceTier: '₹',
      area: 'Near Hindu College, Dhab Khatikan',
      mustTry: 'Special Thick Kesar Malai Lassi with rabri, Phirni',
      ambiance: 'Ultra thick, spoon-eating saffron lassi that defines Amritsar',
      timings: '7:00 AM – 10:30 PM'
    }
  ],
  'Madurai': [
    {
      id: 'mdu-1',
      name: 'Amma Mess',
      rating: 4.8,
      reviews: '7.4k',
      cuisine: 'Legendary Madurai Non-Veg Culinary Art',
      category: 'Casual Dining',
      priceForTwo: '₹600 for two',
      priceTier: '₹',
      area: 'Mattuthavani & Alagar Kovil Road',
      mustTry: 'Famous Bone Marrow Omelette (Nalli Omelette), Kola Urundai, Meen Kuzhambu',
      ambiance: 'Celebrated across Tamil Nadu for intense roasted spices on banana leaves',
      timings: '11:30 AM – 10:30 PM'
    },
    {
      id: 'mdu-2',
      name: 'Murugan Idli Shop (Original)',
      rating: 4.8,
      reviews: '9.6k',
      cuisine: 'Fluffy Mallipoo Idlis & 4 Chutneys',
      category: 'Pure Veg',
      priceForTwo: '₹260 for two',
      priceTier: '₹',
      area: 'West Masi Street, Madurai',
      mustTry: 'Mallipoo Idli, Ghee Podi Dosa, Vada, Jigarthanda',
      ambiance: 'The legendary birthplace of the Murugan Idli empire',
      timings: '7:00 AM – 11:00 PM'
    },
    {
      id: 'mdu-3',
      name: 'Famous Jigarthanda',
      rating: 4.9,
      reviews: '12.1k',
      cuisine: 'Royal Chilled Traditional Beverage',
      category: 'Street Food',
      priceForTwo: '₹140 for two',
      priceTier: '₹',
      area: 'East Marret Street, Near South Gate',
      mustTry: 'Special Jigarthanda with Badam Pisin, condensed milk & basundi scoop',
      ambiance: 'GI-tagged heritage drink invented to soothe summer heat since 1977',
      timings: '9:00 AM – 11:30 PM'
    },
    {
      id: 'mdu-4',
      name: 'Konar Mess',
      rating: 4.7,
      reviews: '5.8k',
      cuisine: 'Traditional Kari Dosa & Mutton Chukka',
      category: 'Casual Dining',
      priceForTwo: '₹500 for two',
      priceTier: '₹',
      area: 'North Veli Street, Madurai',
      mustTry: 'Three-layered Kari Dosa (mutton mince & egg), Bun Parotta, Brain Roast',
      ambiance: '80-year-old culinary institution famous for its unique mutton dosa',
      timings: '11:00 AM – 11:00 PM'
    }
  ],
  'Ooty': [
    {
      id: 'oot-1',
      name: 'Nahar\'s Sidewalk Cafe',
      rating: 4.7,
      reviews: '5.2k',
      cuisine: 'Wood-Fired Pizzas & Mountain Cafe',
      category: 'Cafes & Casual',
      priceForTwo: '₹800 for two',
      priceTier: '₹₹',
      area: 'Commercial Road, Nahar Complex',
      mustTry: 'Wood-fired Farmhouse Pizza, Hot Garlic Bread, Artisan Hot Chocolate',
      ambiance: 'Warm Italian cafe on Ooty’s bustling shopping avenue',
      timings: '11:00 AM – 10:00 PM'
    },
    {
      id: 'oot-2',
      name: 'Earl\'s Secret (King\'s Cliff)',
      rating: 4.8,
      reviews: '3.7k',
      cuisine: 'Colonial Glasshouse Fine Dining',
      category: 'Fine Dining',
      priceForTwo: '₹1,800 for two',
      priceTier: '₹₹₹',
      area: 'King\'s Cliff, Havelock Road',
      mustTry: 'Roast Chicken with Rosemary, Shepherd\'s Pie, Pasta Alfredo, Sizzling Brownie',
      ambiance: 'Glass conservatory in a 130-year-old British manor with garden lawns',
      timings: '12:30 PM – 3:30 PM, 7:00 PM – 10:30 PM'
    },
    {
      id: 'oot-3',
      name: 'Shinkows Chinese Restaurant',
      rating: 4.6,
      reviews: '4.1k',
      cuisine: 'Authentic Chinese by 1954 Cantonese Family',
      category: 'Casual Dining',
      priceForTwo: '₹800 for two',
      priceTier: '₹₹',
      area: 'Commissioner\'s Road',
      mustTry: 'Chilli Chicken Hakka style, Pork Fried Rice, Sweet Corn Chicken Soup',
      ambiance: 'One of South India\'s oldest authentic Chinese family eateries',
      timings: '12:00 PM – 3:30 PM, 6:30 PM – 9:30 PM'
    },
    {
      id: 'oot-4',
      name: 'Moddy\'s Confectionery',
      rating: 4.9,
      reviews: '9.6k',
      cuisine: 'Artisan Nilgiri Homemade Chocolates & Bakery',
      category: 'Street Food',
      priceForTwo: '₹400 for two',
      priceTier: '₹',
      area: 'Garden Road / Commercial Road',
      mustTry: 'Fudge, Dark Truffles, Homemade Hot Chocolate, Ooty Varkey',
      ambiance: '1951 landmark confectionery famous throughout the Nilgiris',
      timings: '8:30 AM – 9:30 PM'
    }
  ],
  'Manali': [
    {
      id: 'mnl-1',
      name: 'Cafe 1947',
      rating: 4.8,
      reviews: '6.4k',
      cuisine: 'Riverside Italian & Acoustic Music',
      category: 'Cafes & Casual',
      priceForTwo: '₹1,100 for two',
      priceTier: '₹₹',
      area: 'Old Manali (Near Bridge, River Beas)',
      mustTry: 'Wood-fired Pizza "The Hobbit", Garlic Trout Fish, Pesto Pasta, Wine',
      ambiance: 'Stunning outdoor deck right above the roaring Beas mountain river',
      timings: '11:00 AM – 11:00 PM'
    },
    {
      id: 'mnl-2',
      name: 'The Lazy Dog Lounge',
      rating: 4.7,
      reviews: '5.2k',
      cuisine: 'Riverside Global Kitchen & Cocktails',
      category: 'Casual Dining',
      priceForTwo: '₹1,400 for two',
      priceTier: '₹₹',
      area: 'Manu Temple Road, Old Manali',
      mustTry: 'Grilled Himalayan Trout, Korean Bulgogi, Truffle Fries, Cocktails',
      ambiance: 'Chill bohemian lounge with wooden deck and mountain breeze',
      timings: '11:00 AM – 1:00 AM'
    },
    {
      id: 'mnl-3',
      name: 'Johnson\'s Cafe & Bar',
      rating: 4.8,
      reviews: '4.9k',
      cuisine: 'Colonial Garden Dining & Trout Specialist',
      category: 'Fine Dining',
      priceForTwo: '₹1,600 for two',
      priceTier: '₹₹₹',
      area: 'Circuit House Road, Siyal',
      mustTry: 'Signature Baked Trout in Almond Sauce, Wood-fired Pizza, Apple Crumble',
      ambiance: 'Cozy fireplace inside and lush apple orchard lawn outside',
      timings: '8:30 AM – 11:30 PM'
    },
    {
      id: 'mnl-4',
      name: 'Chopsticks Restaurant',
      rating: 4.6,
      reviews: '4.8k',
      cuisine: 'Tibetan Momos, Thukpa & Himachali Siddu',
      category: 'Street Food',
      priceForTwo: '₹600 for two',
      priceTier: '₹',
      area: 'Mall Road, Manali Town',
      mustTry: 'Steamed Mutton Momos, Gyathuk, Himachali Siddu with Ghee, Kothey',
      ambiance: 'Vibrant Tibetan eatery in the center of town with rich broth soups',
      timings: '10:00 AM – 11:00 PM'
    }
  ],
  'Rishikesh': [
    {
      id: 'rsh-1',
      name: 'The Sitting Elephant',
      rating: 4.8,
      reviews: '3.6k',
      cuisine: 'Rooftop River Ganges Fine Dining',
      category: 'Casual Dining',
      priceForTwo: '₹1,200 for two',
      priceTier: '₹₹',
      area: 'Hotel EllBee Ganga View, Haridwar Road',
      mustTry: 'North Indian Gourmet Thali, Paneer Pasanda, Garlic Naan',
      ambiance: 'Panoramic glass-facade overlooking the sacred Ganges and Rajaji hills',
      timings: '7:30 AM – 10:30 PM'
    },
    {
      id: 'rsh-2',
      name: 'Little Buddha Cafe',
      rating: 4.7,
      reviews: '5.9k',
      cuisine: 'Treehouse Vibe Cafe facing Ganga',
      category: 'Cafes & Casual',
      priceForTwo: '₹650 for two',
      priceTier: '₹₹',
      area: 'Laxman Jhula Road',
      mustTry: 'Falafel Platter, Shakshuka, Masala Chai, Banana Nutella Pancake',
      ambiance: 'Iconic bamboo treehouse cafe with sprawling cushions and river views',
      timings: '8:00 AM – 11:00 PM'
    },
    {
      id: 'rsh-3',
      name: 'Chotiwala Restaurant',
      rating: 4.5,
      reviews: '6.8k',
      cuisine: 'Heritage Pure Veg Sattvic Dining (est. 1958)',
      category: 'Pure Veg',
      priceForTwo: '₹450 for two',
      priceTier: '₹',
      area: 'Swarg Ashram (Near Ram Jhula)',
      mustTry: 'Sattvic Ghar Jaisa Thali, Chole Bhature, Puri Sabzi, Lassi',
      ambiance: 'Historic spiritual dining landmark marked by the famous painted Brahmin',
      timings: '7:00 AM – 10:30 PM'
    },
    {
      id: 'rsh-4',
      name: 'Beatles Cafe (Cafe Delmar)',
      rating: 4.8,
      reviews: '4.2k',
      cuisine: 'Vegan Burgers & Rock-n-Roll Memorabilia',
      category: 'Cafes & Casual',
      priceForTwo: '₹700 for two',
      priceTier: '₹₹',
      area: 'Paidal Marg, Tapovan',
      mustTry: 'Soy Vegan Burger, Raw Cheesecakes, Green Smoothies, Artisan Pour-over',
      ambiance: '60s Beatles-themed sanctuary overlooking the river valley',
      timings: '9:00 AM – 10:00 PM'
    }
  ],
  'Alleppey': [
    {
      id: 'alp-1',
      name: 'Thaff Dosa & Restaurant',
      rating: 4.6,
      reviews: '4.8k',
      cuisine: 'Malabar & Kerala Coastal Delights',
      category: 'Casual Dining',
      priceForTwo: '₹550 for two',
      priceTier: '₹',
      area: 'General Hospital Junction',
      mustTry: 'Kerala Beef Roast, Coin Parotta, Fish Pollichathu, Appam',
      ambiance: 'Local culinary anchor famous for spiced roasts and fluffy parottas',
      timings: '7:00 AM – 11:00 PM'
    },
    {
      id: 'alp-2',
      name: 'Cassia Restaurant',
      rating: 4.7,
      reviews: '2.5k',
      cuisine: 'Coastal Backwater Seafood & Cafe',
      category: 'Cafes & Casual',
      priceForTwo: '₹900 for two',
      priceTier: '₹₹',
      area: 'Near Beach Road, Cullen Road',
      mustTry: 'Karimeen Fish Curry, Prawns Roast with Coconut Slices, Pizza',
      ambiance: 'Charming boutique cafe with warm courtyard vibes',
      timings: '8:30 AM – 10:30 PM'
    },
    {
      id: 'alp-3',
      name: 'Halais Restaurant',
      rating: 4.6,
      reviews: '3.9k',
      cuisine: 'Traditional Thalassery & Malabar Biryani',
      category: 'Casual Dining',
      priceForTwo: '₹650 for two',
      priceTier: '₹',
      area: 'Near KSRTC Bus Stand',
      mustTry: 'Malabar Chicken Dum Biryani, Kanthari Chicken, Neychoru',
      ambiance: 'Beloved local feast house for authentic kaima rice biryanis',
      timings: '11:00 AM – 11:00 PM'
    }
  ],
  'Mysore': [
    {
      id: 'mys-1',
      name: 'Hotel Original Mylari',
      rating: 4.9,
      reviews: '11.8k',
      cuisine: 'World-Famous Melt-in-Mouth Butter Dosa',
      category: 'Pure Veg',
      priceForTwo: '₹180 for two',
      priceTier: '₹',
      area: 'Nazarbad Main Road, Mysuru',
      mustTry: 'Mylari Special Butter Masala Dosa (served on butter paper), Filter Coffee',
      ambiance: 'Tiny 80-year-old legend serving the softest, crispiest dosa in India',
      timings: '6:30 AM – 1:30 PM, 3:00 PM – 8:30 PM'
    },
    {
      id: 'mys-2',
      name: 'Guru Sweets',
      rating: 4.8,
      reviews: '6.4k',
      cuisine: 'Original Inventors of the Royal Mysore Pak',
      category: 'Street Food',
      priceForTwo: '₹200 for two',
      priceTier: '₹',
      area: 'Sayyaji Rao Road, Devaraja Market',
      mustTry: 'Original Royal Mysore Pak (melt-in-mouth ghee recipe created for the Maharaja)',
      ambiance: 'Heritage sweet shop run by descendants of royal palace chef Kakasura Madappa',
      timings: '8:00 AM – 10:00 PM'
    },
    {
      id: 'mys-3',
      name: 'RRR Restaurant',
      rating: 4.7,
      reviews: '7.9k',
      cuisine: 'Fiery Andhra & Karnataka Banana Leaf Biryani',
      category: 'Casual Dining',
      priceForTwo: '₹700 for two',
      priceTier: '₹',
      area: 'Gandhi Square, Near Clock Tower',
      mustTry: 'Mutton Biryani on Banana Leaf, Chicken Pepper Fry, Guntur Chicken',
      ambiance: 'Always packed with biryani purists looking for intense, rich flavors',
      timings: '11:30 AM – 11:00 PM'
    },
    {
      id: 'mys-4',
      name: 'Gufha Restaurant',
      rating: 4.6,
      reviews: '3.5k',
      cuisine: 'Cave Themed Frontier & Coastal Dining',
      category: 'Fine Dining',
      priceForTwo: '₹1,500 for two',
      priceTier: '₹₹₹',
      area: 'The President Hotel, Off Bangalore-Nilgiri Road',
      mustTry: 'Murgh Peshawari, Paneer Khurchan, Dal Makhani',
      ambiance: 'Intriguing subterranean cavern interior with stalactites and soft lanterns',
      timings: '12:00 PM – 3:30 PM, 7:00 PM – 11:00 PM'
    }
  ],
  'Pune': [
    {
      id: 'pne-1',
      name: 'Vaishali Restaurant',
      rating: 4.8,
      reviews: '14.2k',
      cuisine: 'Legendary FC Road South Indian Hangout',
      category: 'Pure Veg',
      priceForTwo: '₹400 for two',
      priceTier: '₹',
      area: 'Fergusson College Road, Shivajinagar',
      mustTry: 'Mysore Masala Dosa, Sev Potato Dahi Puri (SPDP), Filter Coffee',
      ambiance: 'Iconic cultural nerve-center of Pune students, poets, and intellectuals since 1949',
      timings: '7:00 AM – 11:00 PM'
    },
    {
      id: 'pne-2',
      name: 'Kayani Bakery',
      rating: 4.9,
      reviews: '12.8k',
      cuisine: '1955 Parsi Mawa Cakes & Shrewsbury Biscuits',
      category: 'Street Food',
      priceForTwo: '₹300 for two',
      priceTier: '₹',
      area: 'East Street, Camp, Pune',
      mustTry: 'World-famous Shrewsbury Butter Biscuits, Rich Mawa Cake, Brazil Nut Cookies',
      ambiance: 'Legendary queue-worthy bakery where batches sell out in minutes',
      timings: '7:30 AM – 1:00 PM, 3:30 PM – 8:00 PM (Closed Sun)'
    },
    {
      id: 'pne-3',
      name: 'Shabree Restaurant',
      rating: 4.7,
      reviews: '6.7k',
      cuisine: 'Authentic Maharashtrian Thali & Puran Poli',
      category: 'Pure Veg',
      priceForTwo: '₹750 for two',
      priceTier: '₹₹',
      area: 'FC Road, Deccan Gymkhana',
      mustTry: 'Grand Maharashtrian Thali, Puran Poli with Ghee, Pitla Bhakri, Kothimbir Vadi',
      ambiance: 'Traditional Maharashtrian hospitality serving authentic home-cooked delicacies',
      timings: '11:30 AM – 3:30 PM, 7:30 PM – 11:00 PM'
    },
    {
      id: 'pne-4',
      name: 'Cafe Goodluck',
      rating: 4.7,
      reviews: '9.2k',
      cuisine: '1935 Irani Cafe Bun Maska & Kheema',
      category: 'Casual Dining',
      priceForTwo: '₹450 for two',
      priceTier: '₹',
      area: 'Goodluck Chowk, Deccan Gymkhana',
      mustTry: 'Bun Maska with Irani Chai, Kheema Pav, Caramel Custard',
      ambiance: 'Pune\'s oldest operating Irani cafe with timeless marble tabletops',
      timings: '7:30 AM – 11:30 PM'
    }
  ],
  'Coorg': [
    {
      id: 'crg-1',
      name: 'Coorg Cuisine',
      rating: 4.8,
      reviews: '4.6k',
      cuisine: 'Traditional Kodava Pork & Rice Roti',
      category: 'Casual Dining',
      priceForTwo: '₹650 for two',
      priceTier: '₹',
      area: 'Main Road, Madikeri',
      mustTry: 'Famous Pandi Curry (Coorg Pork Curry), Akki Rotti, Bamboo Shoot Curry',
      ambiance: 'The benchmark for traditional homestyle Kodava family recipes',
      timings: '11:30 AM – 10:00 PM'
    },
    {
      id: 'crg-2',
      name: 'Raintree Restaurant',
      rating: 4.7,
      reviews: '3.1k',
      cuisine: 'Colonial Heritage Courtyard Dining',
      category: 'Fine Dining',
      priceForTwo: '₹1,400 for two',
      priceTier: '₹₹₹',
      area: 'Pension Lane, Madikeri',
      mustTry: 'Coorg Spiced Chicken Curry, Fish Fry, Appam, Filter Coffee Mousse',
      ambiance: 'A restored 140-year-old Kodava bungalow surrounded by misty rain trees',
      timings: '12:00 PM – 10:30 PM'
    },
    {
      id: 'crg-3',
      name: 'Big Cup Cafe',
      rating: 4.7,
      reviews: '3.9k',
      cuisine: 'Artisan Plantation Coffee Experience',
      category: 'Cafes & Casual',
      priceForTwo: '₹500 for two',
      priceTier: '₹₹',
      area: 'Mysore-Madikeri Road, Boikeri',
      mustTry: 'Single-origin Coorg Robusta/Arabica Pour-over, Coffee Brownie, Club Sandwiches',
      ambiance: 'Modern highway specialty roastery overlooking coffee estate bushes',
      timings: '9:00 AM – 9:00 PM'
    }
  ]
};

// ── City Name Aliases & Normalization ──────────────────────────────────────────
const CITY_ALIASES = {
  'kochin': 'Kochi',
  'cochin': 'Kochi',
  'puducherry': 'Pondicherry',
  'pondy': 'Pondicherry',
  'bengaluru': 'Bangalore',
  'calcutta': 'Kolkata',
  'bombay': 'Mumbai',
  'madras': 'Chennai',
  'banaras': 'Varanasi',
  'benares': 'Varanasi',
  'kashi': 'Varanasi',
  'alappuzha': 'Alleppey',
  'mysuru': 'Mysore',
  'udhagamandalam': 'Ooty',
  'madikeri': 'Coorg',
  'poona': 'Pune'
};

/** Get curated restaurants with case-insensitive and alias matching */
function getRestaurantsForCity(cityName) {
  if (!cityName) return RESTAURANT_DATABASE['Jaipur'];
  const lower = cityName.toLowerCase().trim();
  const normalized = CITY_ALIASES[lower] || cityName;

  // Exact or case-insensitive match
  const matchKey = Object.keys(RESTAURANT_DATABASE).find(
    k => k.toLowerCase() === normalized.toLowerCase()
  );
  return matchKey ? RESTAURANT_DATABASE[matchKey] : null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const INDIAN_CITIES = [
  'Jaipur', 'Varanasi', 'Munnar', 'Goa', 'Agra', 'Delhi', 'Chennai',
  'Bangalore', 'Bengaluru', 'Pondicherry', 'Kochi', 'Kochin', 'Cochin', 'Yercaud', 'Mumbai', 'Kolkata',
  'Hyderabad', 'Pune', 'Rishikesh', 'Haridwar', 'Hampi', 'Mysore', 'Mysuru', 'Ooty', 'Darjeeling',
  'Shimla', 'Manali', 'Coorg', 'Alleppey', 'Alappuzha', 'Udaipur', 'Amritsar', 'Madurai',
  'Trivandrum', 'Jodhpur', 'Jaisalmer', 'Pushkar', 'Chandigarh', 'Bhubaneswar', 'Puri',
  'Tirupati', 'Rameswaram', 'Kanyakumari', 'Kovalam', 'Varkala', 'Mahabalipuram', 'Kodaikanal',
  'Lucknow', 'Ayodhya', 'Mathura', 'Vrindavan', 'Prayagraj', 'Ahmedabad', 'Surat', 'Indore',
  'Bhopal', 'Patna', 'Bodh Gaya', 'Visakhapatnam', 'Gokarna', 'Chikmagalur', 'Nashik'
];

const STOPWORDS = new Set(['what', 'best', 'top', 'famous', 'local', 'any', 'nice', 'good', 'popular', 'this', 'the', 'our', 'my', 'some', 'traditional', 'authentic', 'delicious', 'cheap', 'budget']);

/** Parse city name from message with full alias support and context preservation */
function extractCity(message, contextCity = null) {
  if (!message) return contextCity;
  const lower = message.toLowerCase();

  // 1. Direct alias check first
  for (const [alias, realCity] of Object.entries(CITY_ALIASES)) {
    if (new RegExp(`\\b${alias}\\b`, 'i').test(lower)) {
      return realCity;
    }
  }

  // 2. City name match against recognized Indian cities
  for (const city of INDIAN_CITIES) {
    if (new RegExp(`\\b${city.toLowerCase()}\\b`, 'i').test(lower)) {
      if (city.toLowerCase() === 'kochin' || city.toLowerCase() === 'cochin') return 'Kochi';
      if (city.toLowerCase() === 'mysore') return 'Mysuru';
      if (city.toLowerCase() === 'bangalore') return 'Bengaluru';
      return city;
    }
  }

  // If user has a valid active context city, stick to it!
  if (contextCity) return contextCity;

  return null;
}

/** Detect intent with heavy focus on culinary, restaurants & dining */
function detectIntent(message) {
  const lower = message.toLowerCase();

  // Strong food / dining / restaurant signals
  if (/\b(restaurant|restaurants|food|foods|eat|eating|eats|eatery|eateries|dine|dining|cafe|cafes|dishes|dish|breakfast|lunch|dinner|thali|biryani|street food|chaat|dosa|snack|snacks|dessert|sweets|sweet|bakery|craving|veg|vegetarian|non-veg|seafood|rooftop|fine dining|pure veg|cuisine|hungry|hunger)\b/.test(lower)) {
    return 'restaurants';
  }

  if (/\b(itinerary|plan|schedule|day|trip|visit|explore|tour|journey)\b/.test(lower)) return 'itinerary';
  if (/\b(hotel|stay|accommodation|resort|hostel|lodge)\b/.test(lower)) return 'hotels';
  if (/\b(safe|safety|crime|emergency|police|helpline|sos)\b/.test(lower)) return 'safety';
  if (/\b(budget|cost|price|expense|money|rupee|₹)\b/.test(lower)) return 'budget';

  // Default for this specialized culinary AI: restaurants
  return 'restaurants';
}

/** Generate custom restaurant discovery via Groq if unlisted */
async function groqRestaurantDiscovery(message, city) {
  if (!GROQ_KEY) return null;

  const prompt = `You are LukAround Culinary AI, India's foremost food and restaurant expert.
Recommend 4 best verified restaurants in "${city}" for the request: "${message}".

Return ONLY a valid JSON array of objects with exactly these fields:
[
  {
    "id": "1",
    "name": "Restaurant Name",
    "rating": 4.7,
    "reviews": "1.2k",
    "cuisine": "Cuisine type",
    "category": "Pure Veg" | "Non-Veg" | "Street Food" | "Fine Dining" | "Cafes & Casual",
    "priceForTwo": "₹600 for two",
    "priceTier": "₹₹",
    "area": "Neighborhood or street",
    "mustTry": "Top 2-3 dishes",
    "ambiance": "Short ambiance description",
    "timings": "Operating hours"
  }
]
No markdown wrapping, no backticks, only the raw JSON array.`;

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 650,
        temperature: 0.5
      })
    });
    if (!res.ok) return null;
    const data = await res.json();
    const raw = data?.choices?.[0]?.message?.content?.trim() || '';
    const clean = raw.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
    return JSON.parse(clean);
  } catch (err) {
    return null;
  }
}

/** Dynamic suggestion chips focused on food & restaurants */
function getRestaurantSuggestions(city) {
  const c = city || 'your city';
  return [
    `🍛 Top restaurants in ${c}`,
    `🍢 Famous street food in ${c}`,
    `🥗 Pure Veg spots in ${c}`,
    `🍷 Rooftop & Fine Dining in ${c}`,
    `☕ Best breakfast & cafes in ${c}`
  ];
}

// ── Routes ───────────────────────────────────────────────────────────────────

/**
 * POST /api/chat/message
 * Handles restaurant & culinary discovery conversations
 */
router.post('/message', async (req, res) => {
  try {
    const {
      message = '',
      city: contextCity = 'Jaipur',
      state: contextState = '',
      attraction: contextAttraction = '',
      coordinates = null,
      dietary: contextDietary = 'All',
      radius: contextRadius = 5
    } = req.body;

    const explicitCity = extractCity(message, null);
    const city = explicitCity || contextCity || 'Jaipur';
    const state = contextState || '';
    const attraction = explicitCity ? '' : (contextAttraction || '');
    const intent = detectIntent(message);
    const lower = message.toLowerCase();

    // Determine category / dietary filters from query
    let categoryFilter = 'All';
    let dietaryFilter = contextDietary || 'All';

    if (/veg|vegetarian|pure veg/i.test(lower) && !/non-veg/i.test(lower)) {
      dietaryFilter = 'Vegetarian';
      categoryFilter = 'Vegetarian';
    } else if (/non-veg|meat|chicken|mutton|seafood|fish/i.test(lower)) {
      dietaryFilter = 'Non-Vegetarian';
      categoryFilter = 'Non-Vegetarian';
    } else if (/street food|chaat|snack/i.test(lower)) {
      categoryFilter = 'Street Food';
    } else if (/fine dining|luxury|romantic|rooftop/i.test(lower)) {
      categoryFilter = 'Premium Dining';
    } else if (/cafe|coffee|breakfast|tea|bakery/i.test(lower)) {
      categoryFilter = 'Breakfast';
    } else if (/sweet|dessert|mithai/i.test(lower)) {
      categoryFilter = 'Sweets & Desserts';
    }

    const lat = coordinates?.latitude || coordinates?.lat || null;
    const lng = coordinates?.longitude || coordinates?.lng || null;

    // 1. Get real verified restaurants
    let matchedRestaurants = getRestaurantsForContext({
      state,
      city,
      attraction,
      lat,
      lng,
      radius: contextRadius,
      category: categoryFilter,
      dietary: dietaryFilter
    });

    // 2. Fall back to curated city list if empty
    if (!matchedRestaurants || matchedRestaurants.length === 0) {
      matchedRestaurants = getRestaurantsForCity(city);
    }

    // 3. Fall back to Groq AI discovery if still empty
    if (!matchedRestaurants || matchedRestaurants.length === 0) {
      matchedRestaurants = await groqRestaurantDiscovery(message, city);
    }

    // 4. Default fallback
    if (!matchedRestaurants || matchedRestaurants.length === 0) {
      matchedRestaurants = getRestaurantsForCity('Jaipur');
    }

    // Fetch must-try food for current destination
    const mustTryDishes = getMustTryDishes({ state, city, attraction });

    // Ensure all restaurants have valid Google Maps URLs, distances and directions
    const enrichedRestaurants = (matchedRestaurants || []).map(r => {
      const q = r.name ? `${r.name} ${r.address || r.area || city}` : city;
      let dist = r.distanceKm != null ? r.distanceKm : null;
      if (dist == null && lat != null && lng != null && r.latitude != null && r.longitude != null) {
        const R = 6371;
        const dLat = (r.latitude - lat) * Math.PI / 180;
        const dLon = (r.longitude - lng) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat * Math.PI / 180) * Math.cos(r.latitude * Math.PI / 180) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        dist = Math.round(R * c * 10) / 10;
      }

      const mapsUri = r.googleMapsUri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
      const dirDest = r.latitude && r.longitude ? `${r.latitude},${r.longitude}` : encodeURIComponent(q);
      const dirOrigin = lat && lng ? `&origin=${lat},${lng}` : '';
      const dirUri = r.directionsUrl || `https://www.google.com/maps/dir/?api=1&destination=${dirDest}${dirOrigin}&travelmode=driving`;

      return {
        ...r,
        distanceKm: dist,
        googleMapsUri: mapsUri,
        directionsUrl: dirUri
      };
    });

    if (lat != null && lng != null) {
      enrichedRestaurants.sort((a, b) => {
        if (a.distanceKm != null && b.distanceKm != null) return a.distanceKm - b.distanceKm;
        return (b.rating || 0) - (a.rating || 0);
      });
    }

    // Generate personalized Dishly response text
    const destLabel = attraction ? `${attraction} in ${city}` : (state ? `${city}, ${state}` : city);
    let responseText = '';

    if (/what should i try|must try|famous food|specialty|specialities|local food/i.test(lower)) {
      const topDishes = mustTryDishes.slice(0, 3).map(d => `**${d.name}**`).join(', ');
      responseText = `When visiting ${destLabel}, you must definitely savor ${topDishes}! Here are verified iconic establishments known for authentic regional preparations:`;
    } else if (/near this|near the temple|around here|nearby|within/i.test(lower) && attraction) {
      responseText = `Here are the top-rated verified dining spots near **${attraction}** with actual walking & driving distances and Google Maps directions:`;
    } else if (/pure veg|vegetarian/i.test(lower)) {
      responseText = `Looking for pure vegetarian food in ${destLabel}? Here are verified, highly-rated vegetarian restaurants, thali houses, and traditional tiffin spots:`;
    } else if (/budget|cheap|affordable/i.test(lower)) {
      responseText = `Here are great budget-friendly eateries and famous local food spots in ${destLabel} with verified guest reviews:`;
    } else {
      responseText = `Here are the top verified restaurants and culinary landmarks in ${destLabel}! From authentic regional specialties to highly reviewed dining spots:`;
    }

    return res.json({
      success: true,
      type: 'restaurants',
      text: responseText,
      data: enrichedRestaurants.slice(0, 8),
      mustTry: mustTryDishes.slice(0, 4),
      city,
      state,
      attraction,
      suggestions: [
        `🍛 Must-try food in ${city}`,
        `🥗 Pure veg restaurants near ${attraction || city}`,
        `🍢 Famous street food in ${city}`,
        `📍 Top-rated places within 2 km`
      ]
    });

  } catch (err) {
    console.error('[Chat Message] Error:', err.message);
    return res.json({
      success: true,
      type: 'restaurants',
      text: 'Here are delicious culinary recommendations to explore:',
      data: getRestaurantsForCity('Jaipur'),
      city: 'Jaipur',
      suggestions: getRestaurantSuggestions('Jaipur')
    });
  }
});

/**
 * GET /api/chat/restaurants?city=X
 * Direct API to retrieve restaurants for any selected city
 */
router.get('/restaurants', (req, res) => {
  const city = req.query.city || 'Jaipur';
  const data = getRestaurantsForCity(city) || getRestaurantsForCity('Jaipur');
  res.json({
    success: true,
    city,
    data,
    suggestions: getRestaurantSuggestions(city)
  });
});

/**
 * GET /api/chat/suggestions?city=X
 * Returns culinary suggestion chips
 */
router.get('/suggestions', (req, res) => {
  const { city = 'Jaipur' } = req.query;
  res.json({
    success: true,
    suggestions: getRestaurantSuggestions(city),
    city
  });
});

module.exports = router;
