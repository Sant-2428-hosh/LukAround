/**
 * Universal Multi-Tier Translation Engine for LukAround
 * 
 * Layer 1: Google Website Translator Integration (seamless full-page DOM translation)
 * Layer 2: Fast Pre-compiled Multilingual Dictionary (instant 0ms response for 200+ core phrases)
 * Layer 3: Live DOM MutationObserver + Dynamic API Batch Translator (for arbitrary runtime text)
 */

// ─────────────────────────────────────────────────────────────
// PRE-COMPILED CORE UI DICTIONARY (0ms instant translation)
// ─────────────────────────────────────────────────────────────
export const STATIC_DICTIONARY = {
  hi: {
    // Brand & Navigation
    "Travel beyond the Ordinary": "असाधारण से परे यात्रा",
    "TRAVEL BEYOND THE ORDINARY": "असाधारण से परे यात्रा",
    "travel beyond the ordinary": "असाधारण से परे यात्रा",
    "travel india": "असाधारण से परे यात्रा",
    "Home": "होम",
    "Destinations": "गंतव्य",
    "Itinerary": "यात्रा योजना",
    "Hotels": "होटल",
    "Safety": "सुरक्षा",
    "Safety & SOS": "सुरक्षा और SOS",
    "Budget": "बजट",
    "Admin": "व्यवस्थापक",
    "Super Admin": "सुपर व्यवस्थापक",
    "Login": "लॉग इन",
    "Register": "पंजीकरण",
    "Logout": "लॉग आउट",
    "Sign In": "साइन इन",
    "Sign Up": "साइन अप",
    "Account": "खाता",
    "SOS": "SOS",

    // Hero & Search
    "Where in India are you heading?": "भारत में आप कहाँ जा रहे हैं?",
    "Select destination...": "गंतव्य चुनें...",
    "Travel Duration (Days)": "यात्रा अवधि (दिन)",
    "Travel Duration": "यात्रा अवधि",
    "Select Mood / Theme": "मूड / थीम चुनें",
    "Plan My Trip": "मेरी यात्रा की योजना बनाएं",
    "Planning your journey...": "आपकी यात्रा की योजना बन रही है...",
    "Days": "दिन",
    "Day": "दिन",
    "1 Day": "1 दिन",
    "2 Days": "2 दिन",
    "3 Days": "3 दिन",
    "5 Days": "5 दिन",
    "7 Days": "7 दिन",

    // Moods
    "Heritage & Forts": "विरासत और किले",
    "Relaxed Coastal": "तटीय विश्राम",
    "Hill Station Serenity": "हिल स्टेशन शांति",
    "Spiritual Pilgrimage": "आध्यात्मिक तीर्थयात्रा",
    "Romantic Getaway": "रोमांटिक यात्रा",
    "Quick Weekend": "त्वरित सप्ताहांत",
    "All Categories": "सभी श्रेणियां",
    "Heritage": "विरासत",
    "Coastal": "तटीय",
    "Hill Station": "हिल स्टेशन",
    "Spiritual": "आध्यात्मिक",

    // Home Features
    "Curated Travel Picks": "चुनिंदा यात्रा स्थल",
    "Destinations Worth Your Time": "आपके समय के लायक गंतव्य",
    "Zero backtracking routes": "सटीक और कुशल मार्ग",
    "24/7 Verified Helplines": "24/7 सत्यापित हेल्पलाइन",
    "Real police & medical aid": "वास्तविक पुलिस और चिकित्सा सहायता",
    "Transparent ₹ Budgets": "पारदर्शी ₹ बजट",
    "Entry fees & fare breakdown": "प्रवेश शुल्क और किराया विवरण",
    "Plan for Your Trip": "अपनी यात्रा की योजना बनाएं",
    "Explore All 11 Indian Cities": "सभी 11 भारतीय शहरों का अन्वेषण करें",
    "Explore Destinations": "गंतव्यों का अन्वेषण करें",
    "Avg:": "औसत:",
    "/day": "/दिन",

    // Itinerary & Planning
    "Smart Tourist Itinerary": "स्मार्ट पर्यटक यात्रा कार्यक्रम",
    "Morning": "सुबह",
    "Afternoon": "दोपहर",
    "Evening": "शाम",
    "Estimated Cost": "अनुमानित लागत",
    "Entry Fee": "प्रवेश शुल्क",
    "Free Entry": "निःशुल्क प्रवेश",
    "Transport": "परिवहन",
    "Highlights": "मुख्य आकर्षण",
    "Suggested Pace": "सुझाई गई गति",
    "Download PDF": "PDF डाउनलोड करें",
    "Download Itinerary": "यात्रा कार्यक्रम डाउनलोड करें",
    "Reset Itinerary": "रीसेट करें",
    "Generate New Plan": "नई योजना बनाएं",

    // Hotels
    "Book Now": "अभी बुक करें",
    "Book Hotel": "होटल बुक करें",
    "View Hotel": "होटल देखें",
    "Price per night": "प्रति रात मूल्य",
    "Amenities": "सुविधाएं",
    "Luxury Tier": "लक्जरी श्रेणी",
    "Comfort Tier": "आरामदायक श्रेणी",
    "Budget Tier": "बजट श्रेणी",
    "Verified Stay": "सत्यापित प्रवास",
    "Rating": "रेटिंग",
    "Reviews": "समीक्षाएं",

    // Safety & SOS
    "Emergency Contacts": "आपातकालीन संपर्क",
    "Emergency Helplines": "आपातकालीन हेल्पलाइन",
    "Police": "पुलिस",
    "Ambulance": "एम्बुलेंस",
    "Women Helpline": "महिला हेल्पलाइन",
    "Tourist Helpline": "पर्यटक हेल्पलाइन",
    "District Safety Index": "जिला सुरक्षा सूचकांक",
    "Safe to Travel": "यात्रा के लिए सुरक्षित",
    "Live Travel Advisory": "लाइव यात्रा सलाह",
    "Emergency SOS Triggered": "आपातकालीन SOS सक्रिय",
    "Tap to call immediately": "तुरंत कॉल करने के लिए टैप करें",

    // Footer & UI
    "Pages": "पृष्ठ",
    "Popular Cities": "लोकप्रिय शहर",
    "Helplines": "हेल्पलाइन",
    "Emergency": "आपातकाल",
    "Tourist Help": "पर्यटक सहायता",
    "All rights reserved.": "सर्वाधिकार सुरक्षित।",
    "Select Theme": "थीम चुनें",
    "Select Language": "भाषा चुनें",
    "Search": "खोजें"
  },

  ta: {
    // Brand & Navigation
    "Travel beyond the Ordinary": "வழக்கத்திற்கு அப்பாற்பட்ட பயணம்",
    "TRAVEL BEYOND THE ORDINARY": "வழக்கத்திற்கு அப்பாற்பட்ட பயணம்",
    "travel beyond the ordinary": "வழக்கத்திற்கு அப்பாற்பட்ட பயணம்",
    "travel india": "வழக்கத்திற்கு அப்பாற்பட்ட பயணம்",
    "Home": "முகப்பு",
    "Destinations": "இடங்கள்",
    "Itinerary": "திட்டம்",
    "Hotels": "தங்குமிடம்",
    "Safety": "பாதுகாப்பு",
    "Safety & SOS": "பாதுகாப்பு & SOS",
    "Budget": "பட்ஜெட்",
    "Admin": "அட்மின்",
    "Super Admin": "சூப்பர் அட்மின்",
    "Login": "உள்நுழைக",
    "Register": "பதிவுசெய்க",
    "Logout": "வெளியேறுக",
    "Sign In": "உள்நுழைக",
    "Sign Up": "பதிவு செய்க",
    "Account": "கணக்கு",
    "SOS": "SOS",

    // Hero & Search
    "Where in India are you heading?": "இந்தியாவில் நீங்கள் எங்கு செல்கிறீர்கள்?",
    "Select destination...": "இடத்தைத் தேர்ந்தெடுக்கவும்...",
    "Travel Duration (Days)": "பயணக் காலம் (நாட்கள்)",
    "Travel Duration": "பயணக் காலம்",
    "Select Mood / Theme": "மனநிலை / தீம் தேர்ந்தெடுக்கவும்",
    "Plan My Trip": "என் பயணத்தைத் திட்டமிடுங்கள்",
    "Planning your journey...": "உங்கள் பயணம் திட்டமிடப்படுகிறது...",
    "Days": "நாட்கள்",
    "Day": "நாள்",
    "1 Day": "1 நாள்",
    "2 Days": "2 நாட்கள்",
    "3 Days": "3 நாட்கள்",
    "5 Days": "5 நாட்கள்",
    "7 Days": "7 நாட்கள்",

    // Moods
    "Heritage & Forts": "பாரம்பரியம் & கோட்டைகள்",
    "Relaxed Coastal": "கடலோர அமைதி",
    "Hill Station Serenity": "மலைவாசஸ்தல அமைதி",
    "Spiritual Pilgrimage": "ஆன்மீக யாத்திரை",
    "Romantic Getaway": "காதல் பயணம்",
    "Quick Weekend": "விரைவு வார இறுதி",
    "All Categories": "அனைத்து பிரிவுகளும்",
    "Heritage": "பாரம்பரியம்",
    "Coastal": "கடலோரம்",
    "Hill Station": "மலைவாசஸ்தலம்",
    "Spiritual": "ஆன்மீகம்",

    // Home Features
    "Curated Travel Picks": "தேர்ந்தெடுக்கப்பட்ட பயணத் தேர்வுகள்",
    "Destinations Worth Your Time": "உங்கள் நேரத்திற்கு தகுதியான இடங்கள்",
    "Zero backtracking routes": "துல்லியமான பயண வழிகள்",
    "24/7 Verified Helplines": "24/7 சரிபார்க்கப்பட்ட உதவி எண்கள்",
    "Real police & medical aid": "உண்மையான காவல் & மருத்துவ உதவி",
    "Transparent ₹ Budgets": "வெளிப்படையான ₹ பட்ஜெட்",
    "Entry fees & fare breakdown": "நுழைவு கட்டணம் மற்றும் கட்டண விவரம்",
    "Plan for Your Trip": "உங்கள் பயணத்தைத் திட்டமிடுங்கள்",
    "Explore All 11 Indian Cities": "அனைத்து 11 இந்திய நகரங்களையும் ஆராயுங்கள்",
    "Explore Destinations": "இடங்களை ஆராயுங்கள்",
    "Avg:": "சராசரி:",
    "/day": "/நாள்",

    // Itinerary & Planning
    "Smart Tourist Itinerary": "ஸ்மார்ட் சுற்றுலா பயணத் திட்டம்",
    "Morning": "காலை",
    "Afternoon": "மதியம்",
    "Evening": "மாலை",
    "Estimated Cost": "மதிப்பிடப்பட்ட செலவு",
    "Entry Fee": "நுழைவு கட்டணம்",
    "Free Entry": "இலவச அனுமதி",
    "Transport": "போக்குவரத்து",
    "Highlights": "சிறப்பம்சங்கள்",
    "Suggested Pace": "பரிந்துரைக்கப்பட்ட வேகம்",
    "Download PDF": "PDF பதிவிறக்கவும்",
    "Download Itinerary": "பயணத்திட்டத்தை பதிவிறக்கவும்",
    "Reset Itinerary": "மீட்டமை",
    "Generate New Plan": "புதிய திட்டம் உருவாக்கவும்",

    // Hotels
    "Book Now": "இப்போதே முன்பதிவு செய்யுங்கள்",
    "Book Hotel": "ஹோட்டல் முன்பதிவு",
    "View Hotel": "ஹோட்டலைப் பார்க்கவும்",
    "Price per night": "ஒரு இரவுக்கான விலை",
    "Amenities": "வசதிகள்",
    "Luxury Tier": "சொகுசு பிரிவு",
    "Comfort Tier": "வசதியான பிரிவு",
    "Budget Tier": "பட்ஜெட் பிரிவு",
    "Verified Stay": "சரிபார்க்கப்பட்ட தங்குமிடம்",
    "Rating": "மதிப்பீடு",
    "Reviews": "மதிப்புரைகள்",

    // Safety & SOS
    "Emergency Contacts": "அவசர தொடர்புகள்",
    "Emergency Helplines": "அவசர உதவி எண்கள்",
    "Police": "காவல்துறை",
    "Ambulance": "ஆம்புலன்ஸ்",
    "Women Helpline": "பெண்கள் உதவி எண்",
    "Tourist Helpline": "சுற்றுலா உதவி எண்",
    "District Safety Index": "மாவட்ட பாதுகாப்பு குறியீடு",
    "Safe to Travel": "பயணிக்க பாதுகாப்பானது",
    "Live Travel Advisory": "நேரலை பயண ஆலோசனை",
    "Emergency SOS Triggered": "அவசர SOS செயல்படுத்தப்பட்டது",
    "Tap to call immediately": "உடனடியாக அழைக்க தட்டவும்",

    // Footer & UI
    "Pages": "பக்கங்கள்",
    "Popular Cities": "பிரபலமான நகரங்கள்",
    "Helplines": "உதவி எண்கள்",
    "Emergency": "அவசரம்",
    "Tourist Help": "சுற்றுலா உதவி",
    "All rights reserved.": "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
    "Select Theme": "தீம் தேர்வு",
    "Select Language": "மொழி தேர்வு",
    "Search": "தேடு"
  },

  te: {
    // Brand & Navigation
    "Travel beyond the Ordinary": "సాధారణానికి మించిన ప్రయాణం",
    "TRAVEL BEYOND THE ORDINARY": "సాధారణానికి మించిన ప్రయాణం",
    "travel beyond the ordinary": "సాధారణానికి మించిన ప్రయాణం",
    "travel india": "సాధారణానికి మించిన ప్రయాణం",
    "Home": "హోమ్",
    "Destinations": "గమ్యస్థానాలు",
    "Itinerary": "ప్రణాళిక",
    "Hotels": "హోటళ్ళు",
    "Safety": "భద్రత",
    "Safety & SOS": "భద్రత & SOS",
    "Budget": "బడ్జెట్",
    "Admin": "అడ్మిన్",
    "Super Admin": "సూపర్ అడ్మిన్",
    "Login": "లాగిన్",
    "Register": "రిజిస్టర్",
    "Logout": "లాగ్ అవుట్",
    "Sign In": "సైన్ ఇన్",
    "Sign Up": "సైన్ అప్",
    "Account": "ఖాతా",
    "SOS": "SOS",

    // Hero & Search
    "Where in India are you heading?": "భారతదేశంలో మీరు ఎక్కడికి వెళ్తున్నారు?",
    "Select destination...": "గమ్యాన్ని ఎంచుకోండి...",
    "Travel Duration (Days)": "ప్రయాణ వ్యవధి (రోజులు)",
    "Travel Duration": "ప్రయాణ వ్యవధి",
    "Select Mood / Theme": "మూడ్ / థీమ్ ఎంచుకోండి",
    "Plan My Trip": "నా ప్రయాణాన్ని ప్లాన్ చేయండి",
    "Planning your journey...": "మీ ప్రయాణం ప్లాన్ చేయబడుతోంది...",
    "Days": "రోజులు",
    "Day": "రోజు",
    "1 Day": "1 రోజు",
    "2 Days": "2 రోజులు",
    "3 Days": "3 రోజులు",
    "5 Days": "5 రోజులు",
    "7 Days": "7 రోజులు",

    // Moods
    "Heritage & Forts": "వారసత్వం & కోటలు",
    "Relaxed Coastal": "తీరప్రాంత ప్రశాంతత",
    "Hill Station Serenity": "హిల్ స్టేషన్ ప్రశాంతత",
    "Spiritual Pilgrimage": "ఆధ్యాత్మిక యాత్ర",
    "Romantic Getaway": "రొమాంటిక్ యాత్ర",
    "Quick Weekend": "త్వరిత వారాంతం",
    "All Categories": "అన్ని వర్గాలు",
    "Heritage": "వారసత్వం",
    "Coastal": "తీరప్రాంతం",
    "Hill Station": "హిల్ స్టేషన్",
    "Spiritual": "ఆధ్యాత్మికం",

    // Home Features
    "Curated Travel Picks": "ఎంచుకున్న ప్రయాణ ఎంపికలు",
    "Destinations Worth Your Time": "మీ సమయానికి విలువైన గమ్యస్థానాలు",
    "Zero backtracking routes": "ఖచ్చితమైన ప్రయాణ మార్గాలు",
    "24/7 Verified Helplines": "24/7 ధృవీకరించబడిన హెల్ప్‌లైన్లు",
    "Real police & medical aid": "నిజమైన పోలీసు & వైద్య సహాయం",
    "Transparent ₹ Budgets": "పారదర్శక ₹ బడ్జెట్లు",
    "Entry fees & fare breakdown": "ప్రవేశ రుసుము & ఛార్జీల వివరాలు",
    "Plan for Your Trip": "మీ ప్రయాణాన్ని ప్లాన్ చేయండి",
    "Explore All 11 Indian Cities": "మొత్తం 11 భారతీయ నగరాలను అన్వేషించండి",
    "Explore Destinations": "గమ్యస్థానాలను అన్వేషించండి",
    "Avg:": "సగటు:",
    "/day": "/రోజు",

    // Itinerary & Planning
    "Smart Tourist Itinerary": "స్మార్ట్ టూరిస్ట్ ప్రయాణ ప్రణాళిక",
    "Morning": "ఉదయం",
    "Afternoon": "మధ్యాహ్నం",
    "Evening": "సాయంత్రం",
    "Estimated Cost": "అంచనా వ్యయం",
    "Entry Fee": "ప్రవేశ రుసుము",
    "Free Entry": "ఉచిత ప్రవేశం",
    "Transport": "రవాణా",
    "Highlights": "ముఖ్యాంశాలు",
    "Suggested Pace": "సూచించిన వేగం",
    "Download PDF": "PDF డౌన్‌లోడ్ చేయండి",
    "Download Itinerary": "ప్రణాళిక డౌన్‌లోడ్ చేయండి",
    "Reset Itinerary": "రీసెట్ చేయండి",
    "Generate New Plan": "కొత్త ప్లాన్ సృష్టించండి",

    // Hotels
    "Book Now": "ఇప్పుడే బుక్ చేయండి",
    "Book Hotel": "హోటల్ బుక్ చేయండి",
    "View Hotel": "హోటల్ చూడండి",
    "Price per night": "రాత్రికి ధర",
    "Amenities": "సదుపాయాలు",
    "Luxury Tier": "లగ్జరీ విభాగం",
    "Comfort Tier": "కంఫర్ట్ విభాగం",
    "Budget Tier": "బడ్జెట్ విభాగం",
    "Verified Stay": "ధృవీకరించబడిన బస",
    "Rating": "రేటింగ్",
    "Reviews": "సమీక్షలు",

    // Safety & SOS
    "Emergency Contacts": "అత్యవసర పరిచయాలు",
    "Emergency Helplines": "అత్యవసర హెల్ప్‌లైన్లు",
    "Police": "పోలీసులు",
    "Ambulance": "అంబులెన్స్",
    "Women Helpline": "మహిళా హెల్ప్‌లైన్",
    "Tourist Helpline": "పర్యాటక హెల్ప్‌లైన్",
    "District Safety Index": "జిల్లా భద్రతా సూచిక",
    "Safe to Travel": "ప్రయాణానికి సురక్షితం",
    "Live Travel Advisory": "లైవ్ ప్రయాణ సలహా",
    "Emergency SOS Triggered": "అత్యవసర SOS ప్రారంభించబడింది",
    "Tap to call immediately": "వెంటనే కాల్ చేయడానికి నొక్కండి",

    // Footer & UI
    "Pages": "పేజీలు",
    "Popular Cities": "ప్రసిద్ధ నగరాలు",
    "Helplines": "హెల్ప్‌లైన్లు",
    "Emergency": "అత్యవసరం",
    "Tourist Help": "పర్యాటక సహాయం",
    "All rights reserved.": "అన్ని హక్కులూ ప్రత్యేకించబడ్డాయి.",
    "Select Theme": "థీమ్ ఎంచుకోండి",
    "Select Language": "భాషను ఎంచుకోండి",
    "Search": "శోధించండి"
  },

  kn: {
    // Brand & Navigation
    "Travel beyond the Ordinary": "ಸಾಮಾನ್ಯವನ್ನು ಮೀರಿದ ಪ್ರವಾಸ",
    "TRAVEL BEYOND THE ORDINARY": "ಸಾಮಾನ್ಯವನ್ನು ಮೀರಿದ ಪ್ರವಾಸ",
    "travel beyond the ordinary": "ಸಾಮಾನ್ಯವನ್ನು ಮೀರಿದ ಪ್ರವಾಸ",
    "travel india": "ಸಾಮಾನ್ಯವನ್ನು ಮೀರಿದ ಪ್ರವಾಸ",
    "Home": "ಮುಖಪುಟ",
    "Destinations": "ತಾಣಗಳು",
    "Itinerary": "ಪ್ರವಾಸ ಯೋಜನೆ",
    "Hotels": "ಹೋಟೆಲ್‌ಗಳು",
    "Safety": "ಸುರಕ್ಷತೆ",
    "Safety & SOS": "ಸುರಕ್ಷತೆ & SOS",
    "Budget": "ಬಜೆಟ್",
    "Admin": "ಅಡ್ಮಿನ್",
    "Super Admin": "ಸೂಪರ್ ಅಡ್ಮಿನ್",
    "Login": "ಲಾಗಿನ್",
    "Register": "ನೋಂದಣಿ",
    "Logout": "ಲಾಗ್ ಔಟ್",
    "Sign In": "ಸೈನ್ ಇನ್",
    "Sign Up": "ಸೈನ್ ಅಪ್",
    "Account": "ಖಾತೆ",
    "SOS": "SOS",

    // Hero & Search
    "Where in India are you heading?": "ಭಾರತದಲ್ಲಿ ನೀವು ಎಲ್ಲಿಗೆ ಹೋಗುತ್ತಿದ್ದೀರಿ?",
    "Select destination...": "ತಾಣವನ್ನು ಆಯ್ಕೆಮಾಡಿ...",
    "Travel Duration (Days)": "ಪ್ರವಾಸದ ಅವಧಿ (ದಿನಗಳು)",
    "Travel Duration": "ಪ್ರವಾಸದ ಅವಧಿ",
    "Select Mood / Theme": "ಮೂಡ್ / ಥೀಮ್ ಆಯ್ಕೆಮಾಡಿ",
    "Plan My Trip": "ನನ್ನ ಪ್ರವಾಸ ಯೋಜಿಸಿ",
    "Planning your journey...": "ನಿಮ್ಮ ಪ್ರವಾಸವನ್ನು ಯೋಜಿಸಲಾಗುತ್ತಿದೆ...",
    "Days": "ದಿನಗಳು",
    "Day": "ದಿನ",
    "1 Day": "1 ದಿನ",
    "2 Days": "2 ದಿನಗಳು",
    "3 Days": "3 ದಿನಗಳು",
    "5 Days": "5 ದಿನಗಳು",
    "7 Days": "7 ದಿನಗಳು",

    // Moods
    "Heritage & Forts": "ಪರಂಪರೆ ಮತ್ತು ಕೋಟೆಗಳು",
    "Relaxed Coastal": "ಕರಾವಳಿ ವಿಶ್ರಾಂತಿ",
    "Hill Station Serenity": "ಹಿಲ್ ಸ್ಟೇಷನ್ ಪ್ರಶಾಂತತೆ",
    "Spiritual Pilgrimage": "ಆಧ್ಯಾತ್ಮಿಕ ಯಾತ್ರೆ",
    "Romantic Getaway": "ರೋಮ್ಯಾಂಟಿಕ್ ಪ್ರವಾಸ",
    "Quick Weekend": "ತ್ವರಿತ ವಾರಾಂತ್ಯ",
    "All Categories": "ಎಲ್ಲಾ ವರ್ಗಗಳು",
    "Heritage": "ಪರಂಪರೆ",
    "Coastal": "ಕರಾವಳಿ",
    "Hill Station": "ಹಿಲ್ ಸ್ಟೇಷನ್",
    "Spiritual": "ಆಧ್ಯಾತ್ಮಿಕ",

    // Home Features
    "Curated Travel Picks": "ಆಯ್ಕೆಮಾಡಿದ ಪ್ರವಾಸದ ತಾಣಗಳು",
    "Destinations Worth Your Time": "ನಿಮ್ಮ ಸಮಯಕ್ಕೆ ತಕ್ಕ ತಾಣಗಳು",
    "Zero backtracking routes": "ನಿಖರವಾದ ಪ್ರಯಾಣ ಮಾರ್ಗಗಳು",
    "24/7 Verified Helplines": "24/7 ಪರಿಶೀಲಿಸಿದ ಸಹಾಯವಾಣಿಗಳು",
    "Real police & medical aid": "ನೈಜ ಪೊಲೀಸ್ ಮತ್ತು ವೈದ್ಯಕೀಯ ನೆರವು",
    "Transparent ₹ Budgets": "ಪಾರದರ್ಶಕ ₹ ಬಜೆಟ್",
    "Entry fees & fare breakdown": "ಪ್ರವೇಶ ಶುಲ್ಕ ಮತ್ತು ದರ ವಿವರಣೆ",
    "Plan for Your Trip": "ನಿಮ್ಮ ಪ್ರವಾಸವನ್ನು ಯೋಜಿಸಿ",
    "Explore All 11 Indian Cities": "ಎಲ್ಲಾ 11 ಭಾರತೀಯ ನಗರಗಳನ್ನು ಅನ್ವೇಷಿಸಿ",
    "Explore Destinations": "ತಾಣಗಳನ್ನು ಅನ್ವೇಷಿಸಿ",
    "Avg:": "ಸರಾಸರಿ:",
    "/day": "/ದಿನ",

    // Itinerary & Planning
    "Smart Tourist Itinerary": "ಸ್ಮಾರ್ಟ್ ಪ್ರವಾಸಿ ಪ್ರವಾಸ ಯೋಜನೆ",
    "Morning": "ಬೆಳಿಗ್ಗೆ",
    "Afternoon": "ಮಧ್ಯಾಹ್ನ",
    "Evening": "ಸಂಜೆ",
    "Estimated Cost": "ಅಂದಾಜು ವೆಚ್ಚ",
    "Entry Fee": "ಪ್ರವೇಶ ಶುಲ್ಕ",
    "Free Entry": "ಉಚಿತ ಪ್ರವೇಶ",
    "Transport": "ಸಾರಿಗೆ",
    "Highlights": "ಮುಖ್ಯಾಂಶಗಳು",
    "Suggested Pace": "ಸೂಚಿಸಲಾದ ವೇಗ",
    "Download PDF": "PDF ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
    "Download Itinerary": "ಪ್ರವಾಸ ಯೋಜನೆ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
    "Reset Itinerary": "ಮರುಹೊಂದಿಸಿ",
    "Generate New Plan": "ಹೊಸ ಯೋಜನೆ ರಚಿಸಿ",

    // Hotels
    "Book Now": "ಈಗಲೇ ಕಾಯ್ದಿರಿಸಿ",
    "Book Hotel": "ಹೋಟೆಲ್ ಕಾಯ್ದಿರಿಸಿ",
    "View Hotel": "ಹೋಟೆಲ್ ವೀಕ್ಷಿಸಿ",
    "Price per night": "ಪ್ರತಿ ರಾತ್ರಿಗೆ ಬೆಲೆ",
    "Amenities": "ಸೌಲಭ್ಯಗಳು",
    "Luxury Tier": "ಐಷಾರಾಮಿ ವರ್ಗ",
    "Comfort Tier": "ಆರಾಮದಾಯಕ ವರ್ಗ",
    "Budget Tier": "ಬಜೆಟ್ ವರ್ಗ",
    "Verified Stay": "ಪರಿಶೀಲಿಸಿದ ವಾಸ್ತವ್ಯ",
    "Rating": "ರೇಟಿಂಗ್",
    "Reviews": "ವಿಮರ್ಶೆಗಳು",

    // Safety & SOS
    "Emergency Contacts": "ತುರ್ತು ಸಂಪರ್ಕಗಳು",
    "Emergency Helplines": "ತುರ್ತು ಸಹಾಯವಾಣಿಗಳು",
    "Police": "ಪೊಲೀಸ್",
    "Ambulance": "ಅಂಬ್ಯುಲೆನ್ಸ್",
    "Women Helpline": "ಮಹಿಳಾ ಸಹಾಯವಾಣಿ",
    "Tourist Helpline": "ಪ್ರವಾಸಿ ಸಹಾಯವಾಣಿ",
    "District Safety Index": "ಜಿಲ್ಲಾ ಸುರಕ್ಷತಾ ಸೂಚ್ಯಂಕ",
    "Safe to Travel": "ಪ್ರಯಾಣಿಸಲು ಸುರಕ್ಷಿತ",
    "Live Travel Advisory": "ಲೈವ್ ಪ್ರವಾಸ ಸಲಹೆ",
    "Emergency SOS Triggered": "ತುರ್ತು SOS ಸಕ್ರಿಯಗೊಂಡಿದೆ",
    "Tap to call immediately": "ತಕ್ಷಣ ಕರೆ ಮಾಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ",

    // Footer & UI
    "Pages": "ಪುಟಗಳು",
    "Popular Cities": "ಜನಪ್ರಿಯ ನಗರಗಳು",
    "Helplines": "ಸಹಾಯವಾಣಿಗಳು",
    "Emergency": "ತುರ್ತು",
    "Tourist Help": "ಪ್ರವಾಸಿ ನೆರವು",
    "All rights reserved.": "ಎಲ್ಲ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.",
    "Select Theme": "ಥೀಮ್ ಆಯ್ಕೆಮಾಡಿ",
    "Select Language": "ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ",
    "Search": "ಹುಡುಕಿ"
  }
};

// In-memory runtime cache: { [langCode]: { [englishText]: translatedText } }
const translationCache = {
  hi: { ...STATIC_DICTIONARY.hi },
  ta: { ...STATIC_DICTIONARY.ta },
  te: { ...STATIC_DICTIONARY.te },
  kn: { ...STATIC_DICTIONARY.kn }
};

// Load persisted cache from localStorage on startup
try {
  const saved = localStorage.getItem('luk_translations_cache');
  if (saved) {
    const parsed = JSON.parse(saved);
    Object.keys(parsed).forEach((lang) => {
      translationCache[lang] = { ...translationCache[lang], ...parsed[lang] };
    });
  }
} catch {
  // Ignore localStorage parsing errors
}

function persistCache() {
  try {
    localStorage.setItem('luk_translations_cache', JSON.stringify(translationCache));
  } catch {
    // Ignore quota errors
  }
}

// Queue for debouncing uncached text batches
let pendingQueue = new Map(); // targetLang -> Set of strings
let queueTimer = null;
const listeners = new Set(); // Notify DOM or hooks when new translations land

/**
 * Register a listener when translations arrive
 */
export function onTranslationsUpdated(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/**
 * Process queued translation requests in a single batch via backend /api/translate
 */
async function flushQueue() {
  queueTimer = null;
  const currentQueues = pendingQueue;
  pendingQueue = new Map();

  for (const [targetLang, textSet] of currentQueues.entries()) {
    const texts = Array.from(textSet).filter((t) => t && t.trim() && !translationCache[targetLang]?.[t.trim()]);
    if (texts.length === 0 || targetLang === 'en') continue;

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts, targetLang })
      });

      if (!res.ok) continue;
      const data = await res.json();

      if (data && data.success && Array.isArray(data.translations)) {
        if (!translationCache[targetLang]) {
          translationCache[targetLang] = {};
        }

        texts.forEach((orig, idx) => {
          const translated = data.translations[idx];
          if (translated) {
            translationCache[targetLang][orig.trim()] = translated;
          }
        });

        persistCache();
        // Notify subscribers
        listeners.forEach((cb) => cb(targetLang));
      }
    } catch (err) {
      console.warn('[Translator] Batch request failed:', err);
    }
  }
}

/**
 * Queue a string for background batch translation
 */
export function queueTranslation(text, targetLang) {
  if (!text || typeof text !== 'string' || !text.trim() || targetLang === 'en') return;
  const trimmed = text.trim();

  // Already cached?
  if (translationCache[targetLang]?.[trimmed]) return;

  if (!pendingQueue.has(targetLang)) {
    pendingQueue.set(targetLang, new Set());
  }
  pendingQueue.get(targetLang).add(trimmed);

  if (!queueTimer) {
    queueTimer = setTimeout(flushQueue, 60);
  }
}

/**
 * Synchronously get translation if cached, or queue it and return original
 */
export function getTranslationSync(text, targetLang) {
  if (!text || typeof text !== 'string') return text;
  if (!targetLang || targetLang === 'en') return text;
  const trimmed = text.trim();

  const cached = translationCache[targetLang]?.[trimmed];
  if (cached) {
    const leading = text.match(/^\s*/)[0];
    const trailing = text.match(/\s*$/)[0];
    return leading + cached + trailing;
  }

  queueTranslation(trimmed, targetLang);
  return text;
}

/**
 * Async single text translation (resolves when translated)
 */
export async function translateTextAsync(text, targetLang) {
  if (!text || typeof text !== 'string' || targetLang === 'en') return text;
  const trimmed = text.trim();

  if (translationCache[targetLang]?.[trimmed]) {
    return translationCache[targetLang][trimmed];
  }

  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: trimmed, targetLang })
    });
    const data = await res.json();
    if (data && data.success && data.translation) {
      if (!translationCache[targetLang]) translationCache[targetLang] = {};
      translationCache[targetLang][trimmed] = data.translation;
      persistCache();
      return data.translation;
    }
    return text;
  } catch {
    return text;
  }
}

/**
 * Real-time dynamic translation for arbitrary objects or arrays
 * (e.g. real-time AI itinerary results, hotel lists, safety data)
 */
export async function translateRealtimeData(data, targetLang) {
  if (!data || targetLang === 'en') return data;

  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, targetLang })
    });
    const result = await res.json();
    if (result && result.success && result.data) {
      return result.data;
    }
    return data;
  } catch (err) {
    console.warn('[Translator] Realtime data translation warning:', err);
    return data;
  }
}

// ─────────────────────────────────────────────────────────────
// GOOGLE WEBSITE TRANSLATOR BRIDGE (Universal DOM Translation)
// ─────────────────────────────────────────────────────────────
// GOOGLE WEBSITE TRANSLATOR BRIDGE (Universal DOM Translation)
// ─────────────────────────────────────────────────────────────

/**
 * Completely purge all Google Translate cookies across all hosts, subdomains, and paths
 */
export function clearGoogleTranslateCookies() {
  if (typeof document === 'undefined') return;
  const host = window.location.hostname || '';
  const domainParts = host.split('.');

  const domains = [
    '',
    host,
    `.${host}`,
    'localhost',
    '.localhost',
    '127.0.0.1'
  ];

  if (domainParts.length > 1) {
    domains.push(`.${domainParts.slice(-2).join('.')}`);
  }

  const paths = ['/', window.location.pathname || '/', ''];

  domains.forEach((dom) => {
    paths.forEach((p) => {
      let base = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
      if (p) base += ` path=${p};`;
      if (dom) base += ` domain=${dom};`;
      document.cookie = base;

      let base2 = 'googtrans=; Max-Age=-99999999;';
      if (p) base2 += ` path=${p};`;
      if (dom) base2 += ` domain=${dom};`;
      document.cookie = base2;
    });
  });

  document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'googtrans=; Max-Age=0; path=/;';
}

/**
 * Detect active language from localStorage or googtrans cookie
 */
export function detectActiveLanguage() {
  try {
    const saved = localStorage.getItem('luk_lang');
    if (saved && ['en', 'hi', 'ta', 'te', 'kn'].includes(saved.toLowerCase())) {
      // If user specifically picked English, clean rogue cookies and return English
      if (saved.toLowerCase() === 'en') {
        clearGoogleTranslateCookies();
        return 'en';
      }
      return saved.toLowerCase();
    }
    if (typeof document !== 'undefined' && document.cookie) {
      const match = document.cookie.match(/googtrans=\/[^/]+\/([a-z]{2})/i);
      if (match && match[1] && ['en', 'hi', 'ta', 'te', 'kn'].includes(match[1].toLowerCase())) {
        const lang = match[1].toLowerCase();
        try { localStorage.setItem('luk_lang', lang); } catch {}
        return lang;
      }
    }
  } catch {}
  return 'en';
}

/**
 * Programmatically triggers Google Website Translator for the whole page
 */
export function triggerGoogleTranslate(langCode) {
  const target = (langCode || 'en').toLowerCase();
  const host = typeof window !== 'undefined' ? window.location.hostname : '';

  // 1. Manage googtrans cookies for seamless persistence across reloads
  if (target === 'en') {
    clearGoogleTranslateCookies();
    try {
      const iframe = document.querySelector('iframe.goog-te-banner-frame');
      if (iframe) {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        const btn = doc?.querySelector('.goog-te-button button, [id*="restore"]');
        if (btn) btn.click();
      }
    } catch {}
    return;
  }

  const cookieValue = `/en/${target}`;
  document.cookie = `googtrans=${cookieValue}; path=/;`;
  if (host && host !== 'localhost' && host !== '127.0.0.1') {
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${host};`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=.${host};`;
    const parts = host.split('.');
    if (parts.length > 1) {
      document.cookie = `googtrans=${cookieValue}; path=/; domain=.${parts.slice(-2).join('.')};`;
    }
  }

  // 2. Locate and trigger Google Translate combo box (.goog-te-combo)
  const applyCombo = () => {
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      if (select.value !== target) {
        select.value = target;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
      return true;
    }
    return false;
  };

  if (!applyCombo()) {
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (applyCombo() || attempts > 25) {
        clearInterval(interval);
      }
    }, 120);
  }
}

// ─────────────────────────────────────────────────────────────
// DOM LIVE TRANSLATOR ENGINE
// Automatically translates all text nodes rendered into the DOM,
// without mutating React element hierarchies or triggering removeChild crashes.
// ─────────────────────────────────────────────────────────────

let currentDomLang = 'en';
let domObserver = null;
let isTranslatingDom = false;

// Tags to strictly ignore during DOM translation
const IGNORED_TAGS = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'CODE', 'PRE', 'NOSCRIPT', 'SVG', 'PATH']);

function isNodeTranslatable(node) {
  if (!node || node.nodeType !== Node.TEXT_NODE) return false;
  const parent = node.parentElement;
  if (!parent) return false;

  if (IGNORED_TAGS.has(parent.tagName)) return false;
  if (parent.closest('.notranslate') || parent.closest('[data-no-translate="true"]')) return false;

  const val = node.nodeValue;
  if (!val) return false;
  const trimmed = val.trim();
  if (trimmed.length < 2) return false;
  // Ignore pure numbers, prices (e.g. ₹3,200), pure symbols, dates/times
  if (/^[\d\s,.:;₹$%&*+\-–—/()#@!?"'’]+$/.test(trimmed)) return false;

  return true;
}

function processTextNode(node, targetLang) {
  if (!isNodeTranslatable(node)) return;

  // Remember original English text
  if (typeof node.__lukOriginal === 'undefined') {
    node.__lukOriginal = node.nodeValue;
  }

  const orig = node.__lukOriginal;
  if (!orig) return;
  const trimmedOrig = orig.trim();

  // If target is English, restore original
  if (targetLang === 'en') {
    if (node.nodeValue !== orig) {
      node.nodeValue = orig;
    }
    node.__lukLang = 'en';
    return;
  }

  // If already translated to this language, skip
  if (node.__lukLang === targetLang) return;

  // Check cache
  const cached = translationCache[targetLang]?.[trimmedOrig];
  if (cached) {
    const leading = orig.match(/^\s*/)[0];
    const trailing = orig.match(/\s*$/)[0];
    node.nodeValue = leading + cached + trailing;
    node.__lukLang = targetLang;
  } else {
    // Queue for translation
    queueTranslation(trimmedOrig, targetLang);
  }
}

function scanAndTranslateTree(root, targetLang) {
  if (!root || !root.ownerDocument) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
  let textNode = walker.nextNode();
  while (textNode) {
    processTextNode(textNode, targetLang);
    textNode = walker.nextNode();
  }
}

/**
 * Start or update the DOM Live Translator for a target language
 */
export function setDomTranslatorLanguage(targetLang) {
  currentDomLang = targetLang || 'en';

  const rootEl = document.getElementById('root') || document.body;

  // Pause observer while making updates
  if (domObserver) {
    domObserver.disconnect();
  }

  isTranslatingDom = true;
  scanAndTranslateTree(rootEl, currentDomLang);
  isTranslatingDom = false;

  // Setup MutationObserver to automatically catch new dynamic content & text updates in the future
  if (!domObserver) {
    domObserver = new MutationObserver((mutations) => {
      if (isTranslatingDom || currentDomLang === 'en') return;

      isTranslatingDom = true;
      for (const m of mutations) {
        if (m.type === 'childList') {
          m.addedNodes.forEach((added) => {
            if (added.nodeType === Node.TEXT_NODE) {
              processTextNode(added, currentDomLang);
            } else if (added.nodeType === Node.ELEMENT_NODE) {
              scanAndTranslateTree(added, currentDomLang);
            }
          });
        } else if (m.type === 'characterData') {
          const targetNode = m.target;
          if (targetNode && targetNode.nodeType === Node.TEXT_NODE && targetNode.__lukLang !== currentDomLang) {
            targetNode.__lukOriginal = targetNode.nodeValue;
            processTextNode(targetNode, currentDomLang);
          }
        }
      }
      isTranslatingDom = false;
    });
  }

  domObserver.observe(rootEl, {
    childList: true,
    subtree: true,
    characterData: true
  });

  // Staggered follow-up scans to capture any deferred component renders or async fetches
  if (currentDomLang !== 'en') {
    setTimeout(() => {
      if (currentDomLang !== 'en') {
        isTranslatingDom = true;
        scanAndTranslateTree(rootEl, currentDomLang);
        isTranslatingDom = false;
      }
    }, 100);

    setTimeout(() => {
      if (currentDomLang !== 'en') {
        isTranslatingDom = true;
        scanAndTranslateTree(rootEl, currentDomLang);
        isTranslatingDom = false;
      }
    }, 400);

    setTimeout(() => {
      if (currentDomLang !== 'en') {
        isTranslatingDom = true;
        scanAndTranslateTree(rootEl, currentDomLang);
        isTranslatingDom = false;
      }
    }, 1200);
  }
}

// When new batch translations arrive from the server, update pending nodes in the DOM
onTranslationsUpdated((lang) => {
  if (lang === currentDomLang && currentDomLang !== 'en') {
    const rootEl = document.getElementById('root') || document.body;
    if (domObserver) domObserver.disconnect();
    isTranslatingDom = true;
    scanAndTranslateTree(rootEl, currentDomLang);
    isTranslatingDom = false;
    if (domObserver) {
      domObserver.observe(rootEl, { childList: true, subtree: true, characterData: true });
    }
  }
});

/**
 * Universal Master Language Switcher: coordinates Google Translate + Live DOM Translator + Persistence
 */
export function setWebsiteLanguage(langCode) {
  const target = (langCode || 'en').toLowerCase();
  try {
    localStorage.setItem('luk_lang', target);
  } catch {}

  // 1. Trigger Google Website Translator
  triggerGoogleTranslate(target);

  // 2. Trigger DOM Live Translator
  setDomTranslatorLanguage(target);
}
