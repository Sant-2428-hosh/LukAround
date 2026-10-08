const fs = require('fs');
const path = require('path');

const cssPath = path.resolve(__dirname, '../frontend/src/index.css');
let css = fs.readFileSync(cssPath, 'utf8');

const startMarker = "/* ── Section Shell ── */\r\n.hcs-section {";
const startMarkerLF = "/* ── Section Shell ── */\n.hcs-section {";
let startIdx = css.indexOf(startMarker);
if (startIdx === -1) startIdx = css.indexOf(startMarkerLF);

const endMarker = "/* ==========================================================================\r\n   SITE FOOTER";
const endMarkerLF = "/* ==========================================================================\n   SITE FOOTER";
let endIdx = css.indexOf(endMarker);
if (endIdx === -1) endIdx = css.indexOf(endMarkerLF);

if (startIdx === -1 || endIdx === -1) {
  console.error("Could not find start/end markers for .hcs- in index.css", { startIdx, endIdx });
  process.exit(1);
}

const newHcsCSS = `/* ── Section Shell ── */
.hcs-section {
  position: relative;
  padding: 5.5rem 1.5rem 4.5rem;
  overflow: hidden;
  background: radial-gradient(circle at 50% -10%, #201138 0%, #110926 42%, #080516 78%, #04030d 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  isolation: isolate;
}

/* Atmospheric Ambient Glowing Orbs */
.hcs-orb {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(90px);
  opacity: 0.45;
  animation: hcsOrbFloat 14s ease-in-out infinite alternate;
}

.hcs-orb--left {
  width: 540px;
  height: 540px;
  left: -180px;
  top: -120px;
  background: radial-gradient(circle, #E11D48 0%, #9F1239 40%, rgba(159, 18, 57, 0) 70%);
  animation-delay: 0s;
}

.hcs-orb--right {
  width: 520px;
  height: 520px;
  right: -160px;
  bottom: -100px;
  background: radial-gradient(circle, #F59E0B 0%, #D97706 35%, rgba(217, 119, 6, 0) 70%);
  opacity: 0.32;
  animation-delay: -6s;
}

.hcs-orb--center {
  width: 460px;
  height: 460px;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(99, 102, 241, 0.28) 0%, rgba(139, 92, 246, 0.12) 45%, transparent 70%);
  animation-delay: -9s;
}

@keyframes hcsOrbFloat {
  0%   { transform: translateY(0) scale(1); }
  50%  { transform: translateY(-22px) scale(1.08) rotate(4deg); }
  100% { transform: translateY(24px) scale(0.96) rotate(-3deg); }
}

/* Starlight constellation particle grid overlay */
.hcs-starlight-grid {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px),
    radial-gradient(rgba(225, 29, 72, 0.15) 1px, transparent 1px);
  background-size: 36px 36px, 72px 72px;
  background-position: 0 0, 18px 18px;
  pointer-events: none;
  z-index: 0;
  opacity: 0.75;
}

/* Top & Bottom gradient vignettes */
.hcs-section::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 60px;
  background: linear-gradient(to bottom, rgba(4, 3, 13, 0.8), transparent);
  pointer-events: none;
  z-index: 1;
}

.hcs-section::after {
  content: "";
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 100px;
  background: linear-gradient(to bottom, transparent, rgba(4, 3, 13, 0.85));
  pointer-events: none;
  z-index: 1;
}

/* ── Centered Container ── */
.hcs-container {
  position: relative;
  z-index: 2;
  max-width: 860px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.65rem;
  text-align: center;
}

/* ── Luxury Glowing Badge ── */
.hcs-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.38rem 1.15rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #FFE4E6;
  font-size: 0.73rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.3);
  animation: hcsFadeSlideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  transition: all 0.25s ease;
}

.hcs-badge:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.35);
  transform: translateY(-1.5px);
  box-shadow: 0 8px 24px rgba(225, 29, 72, 0.25);
}

.hcs-badge-dot {
  width: 7px;
  height: 7px;
  background: #10B981;
  border-radius: 50%;
  box-shadow: 0 0 8px #10B981;
  animation: chatBlink 1.8s ease infinite;
}

.hcs-badge-sparkle {
  color: #FDE047;
  animation: dishlySparkle 2.2s infinite ease-in-out;
}

/* ── Hero Headline with Radiant Shimmer ── */
.hcs-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 2.85rem);
  font-weight: 800;
  color: #ffffff;
  line-height: 1.18;
  letter-spacing: -0.025em;
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.6);
  animation: hcsFadeSlideDown 0.65s 0.05s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.hcs-title__accent {
  background: linear-gradient(120deg, #FF6B6B 0%, #FFA07A 25%, #FFD166 50%, #FF6B6B 75%, #FFA07A 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
  animation: hcsTextShimmer 4s linear infinite;
  text-shadow: none;
}

@keyframes hcsTextShimmer {
  to { background-position: 200% center; }
}

/* ── Hero Subtitle ── */
.hcs-subtitle {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.72);
  line-height: 1.65;
  max-width: 580px;
  letter-spacing: -0.01em;
  animation: hcsFadeSlideDown 0.7s 0.1s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.hcs-subtitle em {
  color: #FDE047;
  font-style: normal;
  font-weight: 700;
}

/* ── Search Container & Floating Capsule Dock ── */
.hcs-search-wrap {
  width: 100%;
  position: relative;
  animation: hcsFadeSlideDown 0.75s 0.15s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.hcs-search-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #ffffff;
  border: 2px solid rgba(255, 255, 255, 0.9);
  border-radius: 22px;
  padding: 0.5rem 0.55rem 0.5rem 0.85rem;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.15),
    0 24px 64px -14px rgba(0, 0, 0, 0.6),
    0 0 45px rgba(225, 29, 72, 0.16),
    inset 0 1px 1px rgba(255, 255, 255, 0.9);
  transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}

.hcs-search-bar--focused {
  border-color: #E11D48;
  box-shadow:
    0 0 0 4px rgba(225, 29, 72, 0.22),
    0 28px 75px -12px rgba(0, 0, 0, 0.7),
    0 0 60px rgba(225, 29, 72, 0.3),
    inset 0 1px 1px rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
}

/* Compass Shield Icon Badge */
.hcs-search-icon-badge {
  width: 42px;
  height: 42px;
  border-radius: 13px;
  background: #FFF1F2;
  border: 1px solid #FFE4E6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #BE123C;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(190, 18, 60, 0.1);
  transition: transform 0.25s ease, background 0.25s ease;
}

.hcs-search-bar--focused .hcs-search-icon-badge {
  background: #FFE4E6;
  color: #9F1239;
  transform: rotate(25deg);
}

.hcs-search-compass {
  transition: transform 0.3s ease;
}

/* Input Wrapper & Typewriter Input */
.hcs-input-inner {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 0.35rem;
}

.hcs-search-input {
  width: 100%;
  border: none;
  background: transparent;
  font-family: var(--font-body);
  font-size: 0.96rem;
  font-weight: 600;
  color: #0F172A;
  outline: none;
  letter-spacing: -0.01em;
}

.hcs-search-input::placeholder {
  color: #94A3B8;
  font-weight: 500;
  transition: opacity 0.2s ease;
}

.hcs-clear-btn {
  width: 24px !important;
  height: 24px !important;
  min-width: 24px !important;
  min-height: 24px !important;
  padding: 0 !important;
  border: none !important;
  border-radius: 50% !important;
  background: #F1F5F9 !important;
  color: #64748B !important;
  cursor: pointer;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  box-shadow: none !important;
  transition: all 0.15s ease;
  margin-left: 0.25rem;
}

.hcs-clear-btn:hover {
  background: #E2E8F0 !important;
  color: #0F172A !important;
}

/* Trip Duration Segmented Control */
.hcs-duration-group {
  display: flex;
  gap: 2px;
  background: #F1F5F9;
  border-radius: 14px;
  padding: 3px;
  flex-shrink: 0;
}

.hcs-dur-btn {
  padding: 0.38rem 0.75rem !important;
  border-radius: 11px !important;
  border: none !important;
  background: transparent !important;
  color: #64748B !important;
  font-size: 0.76rem !important;
  font-weight: 800 !important;
  font-family: var(--font-body);
  cursor: pointer;
  white-space: nowrap;
  box-shadow: none !important;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  letter-spacing: 0.01em;
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
}

.hcs-dur-short {
  display: none;
}

.hcs-dur-btn:hover:not(.hcs-dur-btn--active) {
  background: rgba(0, 0, 0, 0.06) !important;
  color: #0F172A !important;
}

.hcs-dur-btn--active {
  background: linear-gradient(135deg, #E11D48 0%, #BE123C 100%) !important;
  color: #ffffff !important;
  box-shadow: 0 3px 10px rgba(225, 29, 72, 0.35) !important;
  transform: scale(1.02);
}

/* Vertical Divider */
.hcs-divider {
  width: 1px;
  height: 30px;
  background: #E2E8F0;
  flex-shrink: 0;
  margin: 0 0.15rem;
}

/* ── Primary CTA Button (Plan My Trip) ── */
.hcs-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.4rem !important;
  border-radius: 16px !important;
  border: none !important;
  background: linear-gradient(135deg, #E11D48 0%, #BE123C 50%, #9F1239 100%) !important;
  color: #ffffff !important;
  font-family: var(--font-body);
  font-size: 0.9rem !important;
  font-weight: 800 !important;
  letter-spacing: 0.01em;
  white-space: nowrap;
  flex-shrink: 0;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(225, 29, 72, 0.45) !important;
  min-width: 145px;
  position: relative;
  overflow: hidden;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.hcs-cta:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 10px 28px rgba(225, 29, 72, 0.6) !important;
}

.hcs-cta:active:not(:disabled) {
  transform: translateY(0) scale(0.98);
}

.hcs-cta-arrow {
  transition: transform 0.2s ease;
}

.hcs-cta:hover .hcs-cta-arrow {
  transform: translateX(3px);
}

/* Shimmer beam across CTA */
.hcs-cta::after {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    60deg,
    transparent 20%,
    rgba(255, 255, 255, 0.22) 45%,
    rgba(255, 255, 255, 0.4) 50%,
    rgba(255, 255, 255, 0.22) 55%,
    transparent 80%
  );
  transform: rotate(25deg) translateX(-150%);
  animation: hcsCtaShimmer 4.5s infinite ease-in-out;
  pointer-events: none;
}

@keyframes hcsCtaShimmer {
  0%   { transform: rotate(25deg) translateX(-150%); }
  25%  { transform: rotate(25deg) translateX(150%); }
  100% { transform: rotate(25deg) translateX(150%); }
}

.hcs-cta__spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2.5px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: hcsSpin 0.7s linear infinite;
}

@keyframes hcsSpin { to { transform: rotate(360deg); } }

/* ── Smart Autocomplete & Quick Inspiration Floating Dropdown ── */
.hcs-autocomplete {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  right: 0;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  box-shadow:
    0 24px 64px -12px rgba(0, 0, 0, 0.35),
    0 8px 24px -4px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 200;
  animation: hcsFadeSlideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1) both;
  text-align: left;
}

.hcs-dropdown-section-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.7rem 1.15rem 0.45rem;
  font-size: 0.7rem;
  font-weight: 800;
  color: #94A3B8;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

/* Autocomplete item */
.hcs-autocomplete__item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 1.15rem;
  border: none;
  border-bottom: 1px solid #F1F5F9;
  background: none;
  cursor: pointer;
  font-family: var(--font-body);
  transition: all 0.15s ease;
}

.hcs-autocomplete__item:last-child {
  border-bottom: none;
}

.hcs-autocomplete__item:hover {
  background: #FFF1F2;
}

.hcs-autocomplete__item-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.hcs-autocomplete__pin-ring {
  width: 30px;
  height: 30px;
  border-radius: 9px;
  background: #FFF1F2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #BE123C;
  flex-shrink: 0;
}

.hcs-autocomplete__city-info {
  display: flex;
  flex-direction: column;
}

.hcs-autocomplete__city {
  font-size: 0.92rem;
  font-weight: 800;
  color: #0F172A;
}

.hcs-autocomplete__state {
  font-size: 0.72rem;
  color: #64748B;
  font-weight: 500;
}

.hcs-autocomplete__item-right {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.hcs-autocomplete__rating {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.72rem;
  font-weight: 800;
  color: #92400E;
  background: #FEF3C7;
  padding: 0.15rem 0.45rem;
  border-radius: 6px;
}

.hcs-autocomplete__cta {
  font-size: 0.76rem;
  font-weight: 800;
  color: #BE123C;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  background: rgba(190, 18, 60, 0.08);
  opacity: 0.9;
  transition: all 0.15s ease;
}

.hcs-autocomplete__item:hover .hcs-autocomplete__cta {
  background: #BE123C;
  color: #ffffff;
}

/* Quick Inspirations Grid in Dropdown */
.hcs-dropdown-inspirations {
  padding-bottom: 0.5rem;
}

.hcs-inspiration-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  padding: 0.35rem 0.85rem 0.65rem;
}

.hcs-inspiration-card {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.65rem 0.85rem;
  border-radius: 12px;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  cursor: pointer;
  text-align: left;
  transition: all 0.18s ease;
}

.hcs-inspiration-card:hover {
  background: #FFF1F2;
  border-color: #FECDD3;
  transform: translateY(-1.5px);
}

.hcs-inspiration-icon {
  font-size: 1.25rem;
  line-height: 1;
}

.hcs-inspiration-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.hcs-inspiration-title {
  font-size: 0.82rem;
  font-weight: 800;
  color: #0F172A;
}

.hcs-inspiration-sub {
  font-size: 0.68rem;
  color: #64748B;
  font-weight: 500;
}

.hcs-inspiration-arrow {
  color: #94A3B8;
  transition: transform 0.18s ease;
}

.hcs-inspiration-card:hover .hcs-inspiration-arrow {
  color: #BE123C;
  transform: translateX(2px);
}

/* ── Frosted Glass Mood / Category Filter Row ── */
.hcs-mood-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.55rem;
  animation: hcsFadeSlideDown 0.8s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.hcs-mood {
  display: flex;
  align-items: center;
  gap: 0.42rem;
  padding: 0.45rem 1.05rem !important;
  border-radius: 9999px !important;
  border: 1px solid rgba(255, 255, 255, 0.18) !important;
  background: rgba(255, 255, 255, 0.08) !important;
  color: rgba(255, 255, 255, 0.85) !important;
  font-family: var(--font-body);
  font-size: 0.82rem !important;
  font-weight: 700 !important;
  cursor: pointer;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
  transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
  letter-spacing: 0.01em;
}

.hcs-mood:hover {
  background: rgba(255, 255, 255, 0.16) !important;
  border-color: rgba(255, 255, 255, 0.38) !important;
  color: #ffffff !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25) !important;
}

.hcs-mood--active {
  color: #ffffff !important;
  transform: translateY(-2px);
  font-weight: 800 !important;
}

.hcs-mood-icon {
  font-size: 0.95rem;
  line-height: 1;
}

/* ── Trending Hotspots Pill Bar with Ratings ── */
.hcs-picks {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.55rem;
  justify-content: center;
  animation: hcsFadeSlideDown 0.85s 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.hcs-picks__label {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.74rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.55);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.hcs-flame-icon {
  color: #FF5E62;
  animation: dishlyPulse 2s infinite ease-in-out;
}

.hcs-picks-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.hcs-pick-btn {
  display: inline-flex !important;
  align-items: center;
  gap: 0.35rem;
  padding: 0.32rem 0.85rem !important;
  border-radius: 9999px !important;
  border: 1px solid rgba(255, 255, 255, 0.16) !important;
  background: rgba(255, 255, 255, 0.07) !important;
  color: rgba(255, 255, 255, 0.88) !important;
  font-family: var(--font-body);
  font-size: 0.79rem !important;
  font-weight: 700 !important;
  cursor: pointer;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12) !important;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.hcs-pick-btn:hover {
  background: rgba(255, 255, 255, 0.18) !important;
  border-color: rgba(255, 255, 255, 0.38) !important;
  color: #ffffff !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25) !important;
}

.hcs-pick-rating {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 0.68rem;
  color: #FDE047;
  font-weight: 800;
  opacity: 0.9;
}

/* Surprise Me Button */
.hcs-pick-btn--surprise {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.25) 100%) !important;
  border-color: rgba(245, 158, 11, 0.4) !important;
  color: #FDE68A !important;
}

.hcs-pick-btn--surprise:hover {
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%) !important;
  color: #ffffff !important;
  border-color: transparent !important;
  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.4) !important;
}

/* ── Trust & Quality Assurance Ribbon ── */
.hcs-trust-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.5rem;
  padding: 0.4rem 1.2rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.74rem;
  color: rgba(255, 255, 255, 0.65);
  font-weight: 600;
  animation: hcsFadeSlideDown 0.9s 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.hcs-trust-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.hcs-trust-check {
  color: #10B981;
}

.hcs-trust-dot {
  color: rgba(255, 255, 255, 0.25);
}

/* Shared Entry Animation */
@keyframes hcsFadeSlideDown {
  from { opacity: 0; transform: translateY(-16px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Responsive Adaptations ── */
@media (max-width: 768px) {
  .hcs-section { padding: 4rem 1rem 3rem; }
  .hcs-title { font-size: 1.85rem; }
  .hcs-subtitle { font-size: 0.88rem; }
  .hcs-search-bar {
    flex-wrap: wrap;
    padding: 0.65rem;
    gap: 0.6rem;
    border-radius: 20px;
  }
  .hcs-search-icon-badge {
    width: 36px;
    height: 36px;
  }
  .hcs-search-input { font-size: 0.9rem; }
  .hcs-dur-full { display: none; }
  .hcs-dur-short { display: inline; }
  .hcs-duration-group {
    order: 3;
    width: 100%;
    justify-content: center;
  }
  .hcs-divider { display: none; }
  .hcs-cta {
    order: 4;
    width: 100%;
    justify-content: center;
  }
  .hcs-inspiration-grid {
    grid-template-columns: 1fr;
  }
}
`;

css = css.slice(0, startIdx) + newHcsCSS + "\n\n" + css.slice(endIdx);
fs.writeFileSync(cssPath, css, 'utf8');
console.log('✅ Successfully replaced .hcs- styles in index.css with world-class design!');
