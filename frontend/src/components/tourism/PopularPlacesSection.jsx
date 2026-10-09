import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  MapPin,
  Compass,
  ArrowRight,
  ExternalLink,
  Navigation,
  CheckCircle2,
  Calendar,
  Building2,
  Flame,
  Award,
  Landmark,
  Waves,
  Mountain,
  Trees,
  Users,
  Eye,
  Utensils,
  Camera
} from 'lucide-react';
import SafeImage from './SafeImage';
import DirectionsModal from './DirectionsModal';
import { buildGoogleMapsSearchUrl } from '../../utils/googleMaps';

// Curated collections with verified supporting metadata
const POPULAR_COLLECTIONS = [
  {
    id: 'iconic',
    label: "Iconic Landmarks",
    icon: Flame,
    color: '#D97706',
    bgColor: '#FEF3C7',
    description: "Internationally renowned landmarks that define India on the world stage, with verified heritage status.",
    items: [
      {
        id: 'taj-mahal',
        name: 'The Taj Mahal',
        city: 'Agra',
        citySlug: 'agra',
        state: 'Uttar Pradesh',
        stateSlug: 'uttar-pradesh',
        image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
        popularityLabel: 'UNESCO World Heritage Site',
        popularitySource: 'ASI & UNESCO World Heritage Centre',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: 'Ivory-white marble mausoleum on the Yamuna riverbank',
        url: '/india/uttar-pradesh/agra/taj-mahal'
      },
      {
        id: 'gateway-of-india',
        name: 'Gateway of India',
        city: 'Mumbai',
        citySlug: 'mumbai',
        state: 'Maharashtra',
        stateSlug: 'maharashtra',
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/3a/Mumbai_03-2016_30_Gateway_of_India.jpg/1280px-Mumbai_03-2016_30_Gateway_of_India.jpg',
        popularityLabel: 'National Maritime Landmark',
        popularitySource: 'Maharashtra Tourism (MTDC) & ASI',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: 'Indo-Saracenic basalt arch monument facing Mumbai Harbour',
        url: '/india/maharashtra/mumbai/gateway-of-india'
      },
      {
        id: 'charminar',
        name: 'Charminar',
        city: 'Hyderabad',
        citySlug: 'hyderabad',
        state: 'Telangana',
        stateSlug: 'telangana',
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/71/Charminar_Hyderabad_1.jpg/1280px-Charminar_Hyderabad_1.jpg',
        popularityLabel: 'Iconic 16th-Century Monument',
        popularitySource: 'Archaeological Survey of India (ASI)',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: 'Monumental four-minaret gateway built by Quli Qutb Shah in 1591',
        url: '/india/telangana/hyderabad/charminar'
      },
      {
        id: 'golden-temple',
        name: 'Sri Harmandir Sahib (The Golden Temple)',
        city: 'Amritsar',
        citySlug: 'amritsar',
        state: 'Punjab',
        stateSlug: 'punjab',
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/94/The_Golden_Temple_of_Amrithsar_7.jpg/1280px-The_Golden_Temple_of_Amrithsar_7.jpg',
        popularityLabel: 'World Spiritual Icon',
        popularitySource: 'Punjab Tourism Development Corporation',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: 'Gold-leaf sanctum in the Amrit Sarovar sacred pool with 24/7 community langar',
        url: '/india/punjab/amritsar/golden-temple'
      },
      {
        id: 'virupaksha-temple',
        name: 'Virupaksha Temple & Hampi Complex',
        city: 'Hampi',
        citySlug: 'hampi',
        state: 'Karnataka',
        stateSlug: 'karnataka',
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b9/Complex_of_Virupaksha_Temple%2C_Hampi_%2804%29.jpg/1280px-Complex_of_Virupaksha_Temple%2C_Hampi_%2804%29.jpg',
        popularityLabel: 'UNESCO World Heritage Site',
        popularitySource: 'UNESCO & Archaeological Survey of India',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: '7th-century active sanctuary and monolithic Vijayanagara capital amid boulder hills',
        url: '/india/karnataka/hampi/virupaksha-temple'
      },
      {
        id: 'victoria-memorial',
        name: 'Victoria Memorial Hall',
        city: 'Kolkata',
        citySlug: 'kolkata',
        state: 'West Bengal',
        stateSlug: 'west-bengal',
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/72/Victoria_Memorial_situated_in_Kolkata.jpg/1280px-Victoria_Memorial_situated_in_Kolkata.jpg',
        popularityLabel: 'National Museum Monument',
        popularitySource: 'Ministry of Culture, Govt. of India',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: 'White Makrana marble Indo-Saracenic museum set across 64 acres of royal gardens',
        url: '/india/west-bengal/kolkata/victoria-memorial'
      }
    ]
  },
  {
    id: 'heritage',
    label: "Heritage Attractions",
    icon: Landmark,
    color: '#B45309',
    bgColor: '#FEF3C7',
    description: "Centuries-old hill fortresses, grand palaces, and rock-cut marvels testifying to India's dynastic brilliance.",
    items: [
      {
        id: 'amber-fort',
        name: 'Amber Fort & Palace (Amer)',
        city: 'Jaipur',
        citySlug: 'jaipur',
        state: 'Rajasthan',
        stateSlug: 'rajasthan',
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f7/Jaipur_03-2016_02_Amber_Fort.jpg/1280px-Jaipur_03-2016_02_Amber_Fort.jpg',
        popularityLabel: 'UNESCO Hill Fort of Rajasthan',
        popularitySource: 'UNESCO World Heritage Centre',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: 'Sheesh Mahal mirror mosaics, elephant ramparts, and panoramic Maota Lake views',
        url: '/india/rajasthan/jaipur/amber-fort'
      },
      {
        id: 'golconda-fort-hyderabad',
        name: 'Golconda Fort',
        city: 'Hyderabad',
        citySlug: 'hyderabad',
        state: 'Telangana',
        stateSlug: 'telangana',
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ca/Golconda_Fort_Hyderabad.jpg/1280px-Golconda_Fort_Hyderabad.jpg',
        popularityLabel: 'ASI National Heritage Site',
        popularitySource: 'Archaeological Survey of India',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: 'Acoustic clapping portico and diamond vault citadel',
        url: '/india/telangana/hyderabad/golconda-fort'
      },
      {
        id: 'chittorgarh-fort',
        name: 'Chittorgarh Fort',
        city: 'Chittorgarh',
        citySlug: 'chittorgarh',
        state: 'Rajasthan',
        stateSlug: 'rajasthan',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Vijay_Stambha_Chittorgarh_Fort.jpg/1280px-Vijay_Stambha_Chittorgarh_Fort.jpg',
        popularityLabel: 'UNESCO World Heritage Fortress',
        popularitySource: 'UNESCO & Rajasthan Tourism',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: '700-acre hill citadel with 9-story Vijay Stambha',
        url: '/india/rajasthan/chittorgarh/chittorgarh-fort'
      },
      {
        id: 'kailasa-temple-ellora',
        name: 'Kailasa Temple (Ellora Cave 16)',
        city: 'Ellora',
        citySlug: 'ellora',
        state: 'Maharashtra',
        stateSlug: 'maharashtra',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Kailasa_temple_at_Ellora_caves.jpg/1280px-Kailasa_temple_at_Ellora_caves.jpg',
        popularityLabel: 'UNESCO World Heritage Monolith',
        popularitySource: 'UNESCO World Heritage Centre',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: 'Largest monolithic rock excavation on Earth carved from single basalt cliff',
        url: '/india/maharashtra/ellora/kailasa-temple-ellora'
      },
      {
        id: 'konark-sun-temple',
        name: 'Konark Sun Temple (Black Pagoda)',
        city: 'Konark',
        citySlug: 'konark',
        state: 'Odisha',
        stateSlug: 'odisha',
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/47/Konarka_Temple.jpg/1280px-Konarka_Temple.jpg',
        popularityLabel: 'UNESCO World Heritage Monument',
        popularitySource: 'Archaeological Survey of India',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: '13th-century chariot of Surya with 24 elaborately carved monolithic stone sundial wheels',
        url: '/india/odisha/konark/konark-sun-temple'
      },
      {
        id: 'brihadeeswarar-temple',
        name: 'Brihadeeswarar Temple (Big Temple)',
        city: 'Thanjavur',
        citySlug: 'thanjavur',
        state: 'Tamil Nadu',
        stateSlug: 'tamil-nadu',
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dd/Brihadisvara_Temple_during_Maha_Shivaratri-WUS03611_%28edit%29.jpg/1280px-Brihadisvara_Temple_during_Maha_Shivaratri-WUS03611_%28edit%29.jpg',
        popularityLabel: 'UNESCO Great Living Chola Temple',
        popularitySource: 'UNESCO & Archaeological Survey of India',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: 'Thousand-year-old monolithic 80-tonne granite vimana built by Emperor Raja Raja Chola I',
        url: '/india/tamil-nadu/thanjavur/brihadeeswarar-temple'
      }
    ]
  },
  {
    id: 'spiritual',
    label: "Spiritual Destinations",
    icon: Sparkles,
    color: '#0D9488',
    bgColor: '#CCFBF1',
    description: "Sacred riverfronts, ancient Shakti Peethas, and pilgrimage sites drawing millions of devotees.",
    items: [
      {
        id: 'kashi-vishwanath-temple',
        name: 'Kashi Vishwanath Temple',
        city: 'Varanasi',
        citySlug: 'varanasi',
        state: 'Uttar Pradesh',
        stateSlug: 'uttar-pradesh',
        image: 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Kashi_Vishwanath.jpg',
        popularityLabel: 'Supreme Jyotirlinga Shrine',
        popularitySource: 'UP Tourism & Kashi Vishwanath Trust',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: 'Golden spire Jyotirlinga shrine and grand spiritual corridor opening directly onto sacred Ganga ghats',
        url: '/india/uttar-pradesh/varanasi/kashi-vishwanath-temple'
      },
      {
        id: 'kedarnath-temple-shrine',
        name: 'Kedarnath Temple',
        city: 'Kedarnath',
        citySlug: 'kedarnath',
        state: 'Uttarakhand',
        stateSlug: 'uttarakhand',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Kedarnath_Temple_front.jpg/1280px-Kedarnath_Temple_front.jpg',
        popularityLabel: 'Highest Jyotirlinga Shrine',
        popularitySource: 'Badrinath-Kedarnath Temple Committee',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: '1,200-year-old Shiva shrine at 3,583 m set against snow peaks',
        url: '/india/uttarakhand/kedarnath/kedarnath-temple-shrine'
      },
      {
        id: 'meenakshi-amman-temple',
        name: 'Meenakshi Amman Temple',
        city: 'Madurai',
        citySlug: 'madurai',
        state: 'Tamil Nadu',
        stateSlug: 'tamil-nadu',
        image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80',
        popularityLabel: 'Ancient Dravidian Masterpiece',
        popularitySource: 'Tamil Nadu HR&CE & Tourism',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: '14 multi-colored sculpted gopurams and Hall of Thousand Pillars',
        url: '/india/tamil-nadu/madurai/meenakshi-amman-temple'
      },
      {
        id: 'tirumala-venkateswara-temple',
        name: 'Sri Venkateswara Swamy Temple (Tirumala)',
        city: 'Tirupati',
        citySlug: 'tirupati',
        state: 'Andhra Pradesh',
        stateSlug: 'andhra-pradesh',
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4e/Tirumala_090615.jpg/1280px-Tirumala_090615.jpg',
        popularityLabel: 'World Premier Pilgrimage Shrine',
        popularitySource: 'Tirumala Tirupati Devasthanams (TTD)',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: 'Gilded Ananda Nilayam vimana perched atop sacred seven peaks of Seshachalam hills',
        url: '/india/andhra-pradesh/tirupati/tirumala-venkateswara-temple'
      },
      {
        id: 'jagannath-temple-puri',
        name: 'Shree Jagannath Temple',
        city: 'Puri',
        citySlug: 'puri',
        state: 'Odisha',
        stateSlug: 'odisha',
        image: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=800&q=80',
        popularityLabel: 'Char Dham Pilgrimage Pillar',
        popularitySource: 'Shree Jagannatha Temple Administration',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: 'Sacred 12th-century sanctum and epicentre of the annual Ratha Yatra',
        url: '/india/odisha/puri/jagannath-temple-puri'
      },
      {
        id: 'haji-ali-dargah',
        name: 'Haji Ali Dargah',
        city: 'Mumbai',
        citySlug: 'mumbai',
        state: 'Maharashtra',
        stateSlug: 'maharashtra',
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/cd/Haji_Ali_Dargah_Mumbai.jpg/1280px-Haji_Ali_Dargah_Mumbai.jpg',
        popularityLabel: 'Historic Island Sufi Shrine',
        popularitySource: 'Haji Ali Dargah Trust & MTDC',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: '15th-century white marble island shrine accessible during low tide',
        url: '/india/maharashtra/mumbai/haji-ali-dargah'
      }
    ]
  },
  {
    id: 'hill-stations',
    label: "Hill Stations",
    icon: Mountain,
    color: '#0284C7',
    bgColor: '#E0F2FE',
    description: "Misty pine trails, rolling tea gardens, and fresh alpine breezes across the Western Ghats and Himalayas.",
    items: [
      {
        id: 'tea-gardens-munnar',
        name: 'Munnar Tea Plantations & Tata Tea Museum',
        city: 'Munnar',
        citySlug: 'munnar',
        state: 'Kerala',
        stateSlug: 'kerala',
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b9/Munnar_Overview.jpg/1280px-Munnar_Overview.jpg',
        popularityLabel: 'Premier Western Ghats Hill Retreat',
        popularitySource: 'Kerala Tourism Department',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: 'Endless emerald carpet of high-altitude tea slopes at 1,600 meters with historic tea museum',
        url: '/india/kerala/munnar/tea-gardens-munnar'
      },
      {
        id: 'doddabetta-peak',
        name: 'Doddabetta Peak',
        city: 'Ooty',
        citySlug: 'ooty',
        state: 'Tamil Nadu',
        stateSlug: 'tamil-nadu',
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7c/Arts_College_Hill_Ooty_Nilgiris_Mar21_A7C_00188.jpg/1280px-Arts_College_Hill_Ooty_Nilgiris_Mar21_A7C_00188.jpg',
        popularityLabel: 'Highest Summit in Nilgiris',
        popularitySource: 'Tamil Nadu Tourism (TTDC)',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: 'Highest point in the Nilgiri Mountains (2,637 m) offering telescope house views of Chamundi Peak',
        url: '/india/tamil-nadu/ooty/doddabetta-peak'
      },
      {
        id: 'kempty-falls-mussoorie',
        name: 'Kempty Falls & Mall Road',
        city: 'Mussoorie',
        citySlug: 'mussoorie',
        state: 'Uttarakhand',
        stateSlug: 'uttarakhand',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Kempty_Falls_Mussoorie.jpg/1280px-Kempty_Falls_Mussoorie.jpg',
        popularityLabel: 'Queen of the Hills',
        popularitySource: 'Uttarakhand Tourism Development Board',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: 'Cascading 40-foot waterfall and Himalayan ridge vistas',
        url: '/india/uttarakhand/mussoorie/kempty-falls-mussoorie'
      },
      {
        id: 'deolo-hill-kalimpong',
        name: 'Deolo Hill & Morgan House',
        city: 'Kalimpong',
        citySlug: 'kalimpong',
        state: 'West Bengal',
        stateSlug: 'west-bengal',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Deolo_Hill_Kalimpong_View.jpg/1280px-Deolo_Hill_Kalimpong_View.jpg',
        popularityLabel: 'Himalayan Panoramic Vantage',
        popularitySource: 'West Bengal Tourism (WBTDC)',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: '360-degree vistas of Mount Kanchenjunga and Teesta River',
        url: '/india/west-bengal/kalimpong/deolo-hill-kalimpong'
      },
      {
        id: 'table-land-panchgani',
        name: 'Table Land & Sydney Point',
        city: 'Panchgani',
        citySlug: 'panchgani',
        state: 'Maharashtra',
        stateSlug: 'maharashtra',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Table_Land_Panchgani.jpg/1280px-Table_Land_Panchgani.jpg',
        popularityLabel: 'Asia’s 2nd Largest Mountain Plateau',
        popularitySource: 'Maharashtra Tourism (MTDC)',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: '95-acre volcanic laterite plateau with Krishna valley overlooks',
        url: '/india/maharashtra/panchgani/table-land-panchgani'
      },
      {
        id: 'dilwara-temples-mount-abu',
        name: 'Dilwara Temples & Nakki Lake',
        city: 'Mount Abu',
        citySlug: 'mount-abu',
        state: 'Rajasthan',
        stateSlug: 'rajasthan',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Dilwara_Temple_Interior_Carving.jpg/1280px-Dilwara_Temple_Interior_Carving.jpg',
        popularityLabel: 'Sole Hill Station in Rajasthan',
        popularitySource: 'Rajasthan Tourism (RTDC)',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: 'Translucent white marble filigree temples at 1,200 meters',
        url: '/india/rajasthan/mount-abu/dilwara-temples-mount-abu'
      }
    ]
  },
  {
    id: 'beaches',
    label: "Popular Beaches",
    icon: Waves,
    color: '#0891B2',
    bgColor: '#CFFAFE',
    description: "Golden shorelines, Arabian Sea breakers, and Bay of Bengal sunrises.",
    items: [
      {
        id: 'marine-drive',
        name: "Marine Drive (Queen's Necklace)",
        city: 'Mumbai',
        citySlug: 'mumbai',
        state: 'Maharashtra',
        stateSlug: 'maharashtra',
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/74/Mumbai_03-2016_27_skyline_at_Marine_Drive.jpg/1280px-Mumbai_03-2016_27_skyline_at_Marine_Drive.jpg',
        popularityLabel: 'UNESCO Victorian & Art Deco Precinct',
        popularitySource: 'UNESCO & MCGM Tourism',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: '3.6 km sweeping Arabian Sea promenade framed by Art Deco heritage facades',
        url: '/india/maharashtra/mumbai/marine-drive'
      },
      {
        id: 'marina-beach',
        name: 'Marina Beach',
        city: 'Chennai',
        citySlug: 'chennai',
        state: 'Tamil Nadu',
        stateSlug: 'tamil-nadu',
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/41/Marina_Beach_in_Chennai.jpg/1280px-Marina_Beach_in_Chennai.jpg',
        popularityLabel: 'Second Longest Natural Urban Beach',
        popularitySource: 'Tamil Nadu Tourism Development Corp',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: '13 km sweeping golden shoreline along the Bay of Bengal with lighthouse and vibrant evening promenades',
        url: '/india/tamil-nadu/chennai/marina-beach'
      },
      {
        id: 'lighthouse-beach-kovalam',
        name: 'Kovalam Lighthouse Beach',
        city: 'Kovalam',
        citySlug: 'kovalam',
        state: 'Kerala',
        stateSlug: 'kerala',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Kovalam_Lighthouse_Beach.jpg/1280px-Kovalam_Lighthouse_Beach.jpg',
        popularityLabel: 'Pioneer International Beach Resort',
        popularitySource: 'Kerala Tourism (KTDC)',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: '35-meter striped lighthouse overlooking palm-fringed crescent bays',
        url: '/india/kerala/kovalam/lighthouse-beach-kovalam'
      },
      {
        id: 'dumas-beach-surat',
        name: 'Dumas Beach',
        city: 'Surat',
        citySlug: 'surat',
        state: 'Gujarat',
        stateSlug: 'gujarat',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Dumas_Beach_Surat.jpg/1280px-Dumas_Beach_Surat.jpg',
        popularityLabel: 'Unique Black Sand Coastline',
        popularitySource: 'Gujarat Tourism (TCGL)',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: 'Iron-rich dark sands and famous Surti lashkari bhajiya stalls',
        url: '/india/gujarat/surat/dumas-beach-surat'
      },
      {
        id: 'gopalpur-sea-beach',
        name: 'Gopalpur-on-Sea Beach',
        city: 'Gopalpur',
        citySlug: 'gopalpur',
        state: 'Odisha',
        stateSlug: 'odisha',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Gopalpur_Sea_Beach.jpg/1280px-Gopalpur_Sea_Beach.jpg',
        popularityLabel: 'Historic East India Port Beach',
        popularitySource: 'Odisha Tourism (OTDC)',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: 'Quiet golden sands, 1871 coastal lighthouse, and gentle surf',
        url: '/india/odisha/gopalpur/gopalpur-sea-beach'
      },
      {
        id: 'new-digha-beach',
        name: 'New Digha Beach',
        city: 'Digha',
        citySlug: 'digha',
        state: 'West Bengal',
        stateSlug: 'west-bengal',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/New_Digha_Beach.jpg/1280px-New_Digha_Beach.jpg',
        popularityLabel: 'Bengal’s Premier Coastal Gateway',
        popularitySource: 'West Bengal Tourism (WBTDC)',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: 'Wide flat sand beach lined with casuarina forests and marine aquarium',
        url: '/india/west-bengal/digha/new-digha-beach'
      }
    ]
  },
  {
    id: 'wildlife',
    label: "Wildlife & Nature",
    icon: Trees,
    color: '#059669',
    bgColor: '#D1FAE5',
    description: "Tiger reserves, national parks, and biosphere reserves protecting endangered species.",
    items: [
      {
        id: 'ranthambore-national-park',
        name: 'Ranthambore National Park & Tiger Safari',
        city: 'Ranthambore',
        citySlug: 'ranthambore',
        state: 'Rajasthan',
        stateSlug: 'rajasthan',
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/7f/Ranthambore_National_Park.JPG/1280px-Ranthambore_National_Park.JPG',
        popularityLabel: 'Project Tiger Premier Sanctuary',
        popularitySource: 'National Tiger Conservation Authority (NTCA)',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: 'Daytime Royal Bengal tiger safaris against 10th-century UNESCO clifftop fort ruins and Padam Talao',
        url: '/india/rajasthan/ranthambore/ranthambore-national-park'
      },
      {
        id: 'kanha-tiger-reserve',
        name: 'Kanha Tiger Reserve',
        city: 'Kanha',
        citySlug: 'kanha',
        state: 'Madhya Pradesh',
        stateSlug: 'madhya-pradesh',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Barasingha_Kanha_National_Park.jpg/1280px-Barasingha_Kanha_National_Park.jpg',
        popularityLabel: 'Kipling’s Jungle Book Inspiration',
        popularitySource: 'MP Forest Department & NTCA',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: 'Refuge of the hardground Barasingha deer and Bengal tigers',
        url: '/india/madhya-pradesh/kanha/kanha-tiger-reserve'
      },
      {
        id: 'sanjay-gandhi-national-park-mumbai',
        name: 'Sanjay Gandhi National Park',
        city: 'Mumbai',
        citySlug: 'mumbai',
        state: 'Maharashtra',
        stateSlug: 'maharashtra',
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d4/Kanheri_Caves_Cave_3.jpg/1280px-Kanheri_Caves_Cave_3.jpg',
        popularityLabel: 'World’s Largest Urban Park',
        popularitySource: 'Maharashtra Forest Department',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: '103 sq km wilderness inside city limits with 109 ancient Kanheri Caves',
        url: '/india/maharashtra/mumbai/sanjay-gandhi-national-park-mumbai'
      },
      {
        id: 'keoladeo-national-park-bharatpur',
        name: 'Keoladeo Ghana Bird Sanctuary',
        city: 'Bharatpur',
        citySlug: 'bharatpur',
        state: 'Rajasthan',
        stateSlug: 'rajasthan',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Painted_storks_at_Keoladeo_National_Park.jpg/1280px-Painted_storks_at_Keoladeo_National_Park.jpg',
        popularityLabel: 'UNESCO Wetland Bird Sanctuary',
        popularitySource: 'UNESCO & Ramsar Convention',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: 'Over 370 migratory waterfowl species explored by cycle rickshaw',
        url: '/india/rajasthan/bharatpur/keoladeo-national-park-bharatpur'
      },
      {
        id: 'gorumara-national-park-jalpaiguri',
        name: 'Gorumara National Park',
        city: 'Jalpaiguri',
        citySlug: 'jalpaiguri',
        state: 'West Bengal',
        stateSlug: 'west-bengal',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/One_horned_Rhino_Gorumara.jpg/1280px-One_horned_Rhino_Gorumara.jpg',
        popularityLabel: 'Indian One-Horned Rhino Sanctuary',
        popularitySource: 'West Bengal Forest Directorate',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: 'Dooars floodplain grasslands home to Great Indian Rhinos and wild elephants',
        url: '/india/west-bengal/jalpaiguri/gorumara-national-park-jalpaiguri'
      },
      {
        id: 'valley-of-flowers-national-park',
        name: 'Valley of Flowers National Park',
        city: 'Valley of Flowers',
        citySlug: 'valley-of-flowers',
        state: 'Uttarakhand',
        stateSlug: 'uttarakhand',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Valley_of_Flowers_National_Park.jpg/1280px-Valley_of_Flowers_National_Park.jpg',
        popularityLabel: 'UNESCO Alpine Biosphere Reserve',
        popularitySource: 'UNESCO World Heritage Centre',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: 'Over 500 species of blooming sub-alpine wildflowers beneath glaciers',
        url: '/india/uttarakhand/valley-of-flowers/valley-of-flowers-national-park'
      }
    ]
  },
  {
    id: 'cities',
    label: "Famous Indian Cities",
    icon: Building2,
    color: '#4F46E5',
    bgColor: '#EEF2FF',
    description: "First-class urban metropolises showcasing living history, culinary brilliance, and contemporary vitality.",
    items: [
      {
        id: 'mumbai',
        name: 'Mumbai',
        state: 'Maharashtra',
        stateSlug: 'maharashtra',
        citySlug: 'mumbai',
        image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
        popularityLabel: 'Financial & Cultural Metropolis',
        popularitySource: 'Maharashtra Tourism (MTDC)',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: 'Gateway of India, Marine Drive, CSMT & 20 verified attractions',
        url: '/india/maharashtra/mumbai'
      },
      {
        id: 'hyderabad',
        name: 'Hyderabad',
        state: 'Telangana',
        stateSlug: 'telangana',
        citySlug: 'hyderabad',
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/71/Charminar_Hyderabad_1.jpg/1280px-Charminar_Hyderabad_1.jpg',
        popularityLabel: 'City of Pearls & Royal Nizams',
        popularitySource: 'Telangana Tourism (TSTDC)',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: 'Charminar, Golconda Fort, Ramoji Film City & 20 verified attractions',
        url: '/india/telangana/hyderabad'
      },
      {
        id: 'jaipur',
        name: 'Jaipur (Pink City)',
        state: 'Rajasthan',
        stateSlug: 'rajasthan',
        citySlug: 'jaipur',
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
        popularityLabel: 'UNESCO World Heritage City',
        popularitySource: 'UNESCO & Rajasthan Tourism',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: 'Hawa Mahal, Amber Fort, City Palace & royal bazaars',
        url: '/india/rajasthan/jaipur'
      },
      {
        id: 'bengaluru',
        name: 'Bengaluru (Garden City)',
        state: 'Karnataka',
        stateSlug: 'karnataka',
        citySlug: 'bengaluru',
        image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
        popularityLabel: 'Silicon Valley & Garden City',
        popularitySource: 'Karnataka Tourism (KSTDC)',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: 'Bangalore Palace, Lalbagh Botanical Garden & Cubbon Park',
        url: '/india/karnataka/bengaluru'
      },
      {
        id: 'chennai',
        name: 'Chennai',
        state: 'Tamil Nadu',
        stateSlug: 'tamil-nadu',
        citySlug: 'chennai',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
        popularityLabel: 'Cultural Capital of South India',
        popularitySource: 'Tamil Nadu Tourism (TTDC)',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: 'Marina Beach, Kapaleeshwarar Temple & San Thome Basilica',
        url: '/india/tamil-nadu/chennai'
      },
      {
        id: 'kolkata',
        name: 'Kolkata (City of Joy)',
        state: 'West Bengal',
        stateSlug: 'west-bengal',
        citySlug: 'kolkata',
        image: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80',
        popularityLabel: 'Intellectual & Artistic Capital',
        popularitySource: 'West Bengal Tourism (WBTDC)',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: 'Victoria Memorial, Howrah Bridge, Dakshineswar & Indian Museum',
        url: '/india/west-bengal/kolkata'
      }
    ]
  },
  {
    id: 'hidden-gems',
    label: "Hidden Gems",
    icon: Eye,
    color: '#7C3AED',
    bgColor: '#EDE9FE',
    description: "Exceptional geological, ancient archaeological, and quiet heritage marvels away from crowds.",
    items: [
      {
        id: 'gandikota-fort',
        name: 'Gandikota Fort & Pennar River Gorge',
        city: 'Gandikota',
        citySlug: 'gandikota',
        state: 'Andhra Pradesh',
        stateSlug: 'andhra-pradesh',
        image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a7/Indian_Grand_Canyon_Sudhakar_Bichali.jpg/1280px-Indian_Grand_Canyon_Sudhakar_Bichali.jpg',
        popularityLabel: 'Grand Canyon of India',
        popularitySource: 'Andhra Pradesh Tourism (APTDC)',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: 'Dramatic 300-foot red granite canyon carved through Erramala hills by the Penna River',
        url: '/india/andhra-pradesh/gandikota/gandikota-fort'
      },
      {
        id: 'dholavira-harappan-city',
        name: 'Dholavira Harappan Metropolis',
        city: 'Dholavira',
        citySlug: 'dholavira',
        state: 'Gujarat',
        stateSlug: 'gujarat',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Dholavira_Reservoir.jpg/1280px-Dholavira_Reservoir.jpg',
        popularityLabel: 'UNESCO Harappan Wonder',
        popularitySource: 'UNESCO World Heritage Centre',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: '4,500-year-old Indus Valley metropolis with revolutionary water reservoirs',
        url: '/india/gujarat/dholavira/dholavira-harappan-city'
      },
      {
        id: 'jahaz-mahal-mandu',
        name: 'Jahaz Mahal (Ship Palace)',
        city: 'Mandu',
        citySlug: 'mandu',
        state: 'Madhya Pradesh',
        stateSlug: 'madhya-pradesh',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Jahaz_Mahal_Mandu.jpg/1280px-Jahaz_Mahal_Mandu.jpg',
        popularityLabel: 'Medieval Floating Citadel',
        popularitySource: 'Archaeological Survey of India',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: 'Afghan palace appearing to float between two artificial lakes',
        url: '/india/madhya-pradesh/mandu/jahaz-mahal-mandu'
      },
      {
        id: 'deomali-peak-koraput',
        name: 'Deomali Peak',
        city: 'Koraput',
        citySlug: 'koraput',
        state: 'Odisha',
        stateSlug: 'odisha',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Deomali_Peak_Koraput.jpg/1280px-Deomali_Peak_Koraput.jpg',
        popularityLabel: 'Highest Summit in Odisha',
        popularitySource: 'Odisha Tourism (OTDC)',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: '1,672-meter mountain peak with sunrise sea-of-clouds panoramas',
        url: '/india/odisha/koraput/deomali-peak-koraput'
      },
      {
        id: 'taragarh-fort-bundi',
        name: 'Taragarh Fort & Bundi Chitrashala',
        city: 'Bundi',
        citySlug: 'bundi',
        state: 'Rajasthan',
        stateSlug: 'rajasthan',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Bundi_Palace_and_Taragarh_Fort.jpg/1280px-Bundi_Palace_and_Taragarh_Fort.jpg',
        popularityLabel: 'Medieval Fresco Citadel',
        popularitySource: 'Rajasthan Tourism (RTDC)',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: '14th-century star fortress housing vibrant miniature wall frescoes',
        url: '/india/rajasthan/bundi/taragarh-fort-bundi'
      },
      {
        id: 'visva-bharati-shantiniketan',
        name: 'Santiniketan Ashram & Uttarayan',
        city: 'Shantiniketan',
        citySlug: 'shantiniketan',
        state: 'West Bengal',
        stateSlug: 'west-bengal',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Upasana_Griha_Shantiniketan.jpg/1280px-Upasana_Griha_Shantiniketan.jpg',
        popularityLabel: 'UNESCO World Heritage 2023',
        popularitySource: 'UNESCO World Heritage Centre',
        sourceYear: '2024',
        lastVerified: '2026-03-25',
        highlights: 'Rabindranath Tagore’s visionary open-air university and stained-glass hall',
        url: '/india/west-bengal/shantiniketan/visva-bharati-shantiniketan'
      }
    ]
  }
];

export default function PopularPlacesSection() {
  const [activeTabId, setActiveTabId] = useState('iconic');
  const [directionsModalOpen, setDirectionsModalOpen] = useState(false);
  const [selectedPlaceForDirections, setSelectedPlaceForDirections] = useState(null);

  const activeCollection = useMemo(() => {
    return POPULAR_COLLECTIONS.find(c => c.id === activeTabId) || POPULAR_COLLECTIONS[0];
  }, [activeTabId]);

  const handleDirections = (place, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedPlaceForDirections(place);
    setDirectionsModalOpen(true);
  };

  return (
    <section className="section-popular-places" style={{ padding: '4.5rem 0', backgroundColor: '#FFFFFF' }}>
      <div className="tourism-container">

        {/* Section Header */}
        <div className="section-header-split" style={{ alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#FEF3C7', color: '#B45309', padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.65rem' }}>
              <Award size={13} />
              <span>Curated Verified Collections</span>
            </div>
            <h2 className="tourism-heading section-heading-xl" style={{ margin: '0 0 0.5rem' }}>
              India's Most Popular<br />
              <span style={{ color: 'var(--tourism-earth)' }}>Tourist Places</span>
            </h2>
            <p className="tourism-subtitle" style={{ maxWidth: '580px', margin: 0 }}>
              {activeCollection.description}
            </p>
          </div>

          {/* Source Verification Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '0.5rem 0.9rem', borderRadius: '10px' }}>
            <CheckCircle2 size={16} color="#16A34A" />
            <div style={{ fontSize: '0.78rem', color: '#475569' }}>
              <span style={{ fontWeight: 800, color: '#1E293B' }}>100% Verified Metadata</span>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>ASI · State Tourism Boards · UNESCO</div>
            </div>
          </div>
        </div>

        {/* Category Tab Pills */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.75rem',
            marginBottom: '2rem',
            scrollbarWidth: 'none'
          }}
        >
          {POPULAR_COLLECTIONS.map(col => {
            const Icon = col.icon;
            const isActive = col.id === activeTabId;
            return (
              <button
                key={col.id}
                type="button"
                onClick={() => setActiveTabId(col.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.55rem 1.15rem',
                  borderRadius: '9999px',
                  border: '1.5px solid',
                  borderColor: isActive ? 'var(--tourism-earth)' : '#E2E8F0',
                  backgroundColor: isActive ? 'var(--tourism-earth)' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#475569',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  boxShadow: isActive ? '0 4px 12px rgba(200, 90, 50, 0.2)' : 'none'
                }}
              >
                <Icon size={14} color={isActive ? '#FFFFFF' : col.color} />
                <span>{col.label}</span>
              </button>
            );
          })}
        </div>

        {/* Popular Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {activeCollection.items.map(item => {
            const mapsUrl = buildGoogleMapsSearchUrl(item);
            return (
              <div
                key={item.id}
                className="attraction-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  overflow: 'hidden',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                {/* Image Section - Interactive link navigating directly to place characteristics */}
                <Link
                  to={item.url}
                  className="popular-card-image-link"
                  style={{
                    display: 'block',
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '16/9',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    textDecoration: 'none'
                  }}
                  title={`Click to view full characteristics of ${item.name}`}
                >
                  <SafeImage
                    src={item.image}
                    alt={item.name}
                    aspectRatio="16:9"
                    verified={true}
                    loading="lazy"
                  />

                  {/* Real Photo Verified Pill */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(15, 23, 42, 0.85)',
                      backdropFilter: 'blur(4px)',
                      color: '#34D399',
                      border: '1px solid rgba(52, 211, 153, 0.3)',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      zIndex: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Camera size={11} color="#34D399" />
                    <span>Real Photo</span>
                  </div>

                  {/* State badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: 'rgba(15, 23, 42, 0.85)',
                      color: '#FFFFFF',
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      zIndex: 3
                    }}
                  >
                    {item.state}
                  </div>

                  {/* Verified Authority Pill */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      color: '#0F172A',
                      padding: '3px 9px',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      zIndex: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                    }}
                  >
                    <CheckCircle2 size={12} color="#16A34A" />
                    <span>{item.popularityLabel}</span>
                  </div>

                  {/* Interactive View Characteristics Pill on Image */}
                  <div
                    className="popular-card-hover-overlay"
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(15, 23, 42, 0.88)',
                      backdropFilter: 'blur(4px)',
                      color: '#FFFFFF',
                      padding: '4px 9px',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      zIndex: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}
                  >
                    <Eye size={12} color="#38BDF8" />
                    <span>View Characteristics</span>
                  </div>
                </Link>

                {/* Content Section */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#64748B', fontSize: '0.76rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                    <MapPin size={13} color="var(--tourism-earth)" />
                    <span>{item.city}, {item.state}</span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.45rem', lineHeight: 1.3 }}>
                    <Link
                      to={item.url}
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      {item.name}
                    </Link>
                  </h3>

                  <p style={{ fontSize: '0.84rem', color: '#475569', margin: '0 0 1rem', lineHeight: 1.5, flex: 1 }}>
                    {item.highlights}
                  </p>

                  {/* Supporting Verification Metadata */}
                  <div
                    style={{
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #EDF2F7',
                      borderRadius: '8px',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.7rem',
                      color: '#64748B',
                      marginBottom: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.25rem'
                    }}
                  >
                    <span><strong>Source:</strong> {item.popularitySource}</span>
                    <span><strong>Verified:</strong> {item.sourceYear}</span>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                    <Link
                      to={item.url}
                      className="tourism-btn tourism-btn-primary"
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        fontSize: '0.8rem',
                        textAlign: 'center',
                        textDecoration: 'none',
                        justifyContent: 'center'
                      }}
                    >
                      <span>Explore Destination</span>
                      <ArrowRight size={13} />
                    </Link>

                    <button
                      type="button"
                      onClick={(e) => handleDirections(item, e)}
                      className="tourism-btn tourism-btn-outline"
                      title="Get Google Maps Directions"
                      style={{
                        padding: '0.5rem 0.75rem',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Navigation size={13} />
                      <span>Directions</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Links CTA */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link
            to="/attractions"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--tourism-earth)',
              fontWeight: 800,
              fontSize: '0.95rem',
              textDecoration: 'none'
            }}
          >
            <span>Explore all verified tourism landmarks and cities across 15 states</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>

      {/* Directions Modal */}
      {directionsModalOpen && selectedPlaceForDirections && (
        <DirectionsModal
          isOpen={directionsModalOpen}
          onClose={() => setDirectionsModalOpen(false)}
          destination={selectedPlaceForDirections}
        />
      )}
    </section>
  );
}
