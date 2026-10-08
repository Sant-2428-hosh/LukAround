const fs = require('fs');
const path = require('path');

const navbarPath = path.join(__dirname, '..', 'frontend', 'src', 'components', 'Navbar.jsx');
let content = fs.readFileSync(navbarPath, 'utf8');

// 1. Clean CORE_NAV_TRANSLATIONS
const startMarker = 'const CORE_NAV_TRANSLATIONS = {';
const endMarker = 'const getNavLabel = (key, fallback) => {';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const newTranslations = `const CORE_NAV_TRANSLATIONS = {
    home: { en: "Home", ta: "முகப்பு", hi: "होम", te: "హోమ్", kn: "ಮುಖಪುಟ" },
    explore: { en: "Explore India", ta: "சுற்றுலா", hi: "भारत", te: "భారత్", kn: "ಭಾರತ" },
    states: { en: "States", ta: "மாநிலங்கள்", hi: "राज्य", te: "రాష్ట్రాలు", kn: "ರಾಜ್ಯಗಳು" },
    cities: { en: "Cities", ta: "நகரங்கள்", hi: "शहर", te: "నగరాలు", kn: "ನಗರಗಳು" },
    attractions: { en: "Attractions", ta: "இடங்கள்", hi: "आकर्षण", te: "ఆకర్షణలు", kn: "ಆಕರ್ಷಣೆಗಳು" },
    planner: { en: "Planner", ta: "திட்டம்", hi: "योजना", te: "ప్లానర్", kn: "ಯೋಜನೆ" },
    hotels: { en: "Hotels", ta: "விடுதிகள்", hi: "होटल", te: "హోటళ్ళు", kn: "ಹೋಟೆಲ್‌ಗಳು" },
    safety: { en: "Safety", ta: "பாதுகாப்பு", hi: "सुरक्षा", te: "భద్రత", kn: "ಸುರಕ್ಷತೆ" }
  };

  `;
  content = content.slice(0, startIndex) + newTranslations + content.slice(endIndex);
  console.log('Fixed CORE_NAV_TRANSLATIONS');
}

// 2. Fix navbar-left styling
content = content.replace(
  `          {/* ── 1. Left Section: Hamburger Button (Mobile) + Brand Logo ── */}
          <div
            className="navbar-left"
            style={{
              flex: "1 1 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: "clamp(0.35rem, 0.8vw, 0.75rem)",
              minWidth: 0
            }}
          >`,
  `          {/* ── 1. Left Section: Hamburger Button (Mobile) + Brand Logo ── */}
          <div
            className="navbar-left"
            style={{
              flex: "0 0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: "clamp(0.35rem, 0.8vw, 0.75rem)",
              flexShrink: 0,
              minWidth: "max-content"
            }}
          >`
);

// 3. Fix desktop-nav-links styling
content = content.replace(
  `          {/* ── 2. Center Section: Core Navigation Links (Protected against external translation mutilation) ── */}
          <nav
            className="desktop-nav-links notranslate"
            translate="no"
            data-no-translate="true"
            style={{
              flex: "0 0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >`,
  `          {/* ── 2. Center Section: Core Navigation Links (Protected against external translation mutilation) ── */}
          <nav
            className="desktop-nav-links notranslate"
            translate="no"
            data-no-translate="true"
            style={{
              flex: "1 1 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: 0
            }}
          >`
);

// 4. Fix navbar-right styling
content = content.replace(
  `          {/* ── 3. Right Section: Structured Utilities (Pinned to the Right) ── */}
          <div
            className="navbar-right"
            style={{
              flex: "1 1 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "clamp(0.2rem, 0.4vw, 0.45rem)",
              flexShrink: 0,
              minWidth: "max-content"
            }}
          >`,
  `          {/* ── 3. Right Section: Structured Utilities (Pinned to the Right) ── */}
          <div
            className="navbar-right"
            style={{
              flex: "0 0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "clamp(0.2rem, 0.4vw, 0.45rem)",
              flexShrink: 0,
              minWidth: "max-content"
            }}
          >`
);

// 5. Add navbar-brand-tagline class to tagline span
content = content.replace(
  `className="hide-on-mobile-compact"
                >
                  {t("Travel beyond the Ordinary")}`,
  `className="navbar-brand-tagline hide-on-mobile-compact"
                >
                  {t("Travel beyond the Ordinary")}`
);

fs.writeFileSync(navbarPath, content, 'utf8');
console.log('Saved updated Navbar.jsx');
