const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'frontend', 'src', 'index.css');
let css = fs.readFileSync(cssPath, 'utf8');

const targetStart = '/* Desktop screens (>= 1024px: Laptops, Desktops, Ultrawide) */';
const targetEnd = '/* High visibility for all Lucide SVG icons inside nav buttons */';

const startIndex = css.indexOf(targetStart);
const endIndex = css.indexOf(targetEnd);

if (startIndex !== -1 && endIndex !== -1) {
  const correctedBlock = `/* Desktop screens (>= 1024px: Laptops, Desktops, Ultrawide) */
@media (min-width: 1024px) {
  .mobile-nav-toggle {
    display: none !important;
  }
  .mobile-left-panel {
    display: none !important;
  }
  .mobile-left-panel-backdrop {
    display: none !important;
  }
  .mobile-nav-drawer {
    display: none !important;
  }
  .desktop-nav-links {
    display: flex !important;
  }
}

/* Mobile & Tablet screens (< 1024px) */
@media (max-width: 1023px) {
  .mobile-nav-toggle {
    display: flex !important;
  }
  .desktop-nav-links {
    display: none !important;
  }
  .hide-on-mobile {
    display: none !important;
  }
}

/* Small mobile screens (< 640px) */
@media (max-width: 639px) {
  .hide-on-mobile-compact {
    display: none !important;
  }
}

/* Mobile Nav Toggle Button & Crisp 3-Bar Hamburger */
.mobile-nav-toggle {
  width: 40px !important;
  height: 40px !important;
  min-width: 40px !important;
  max-width: 40px !important;
  padding: 0 !important;
  margin: 0 !important;
  border-radius: var(--radius-button) !important;
  border: 1.5px solid var(--color-rule) !important;
  background-color: #FFFFFF !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer !important;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
  flex-shrink: 0 !important;
  transition: all 0.15s ease !important;
}

.mobile-nav-toggle:hover {
  border-color: var(--color-primary) !important;
  background-color: var(--color-primary-light) !important;
}

.hamburger-bars {
  width: 20px;
  height: 13px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  pointer-events: none;
}

.hamburger-bars span {
  display: block !important;
  width: 20px !important;
  height: 2.2px !important;
  background-color: #111114 !important;
  border-radius: 99px !important;
}

/* ==========================================================================
   DESKTOP NAV LINKS — Sleek, modern, background-free with animated indicator
   ========================================================================== */
.desktop-nav-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(0.2rem, 0.55vw, 0.85rem);
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
  flex: 1 1 auto;
  min-width: 0;
}

.desktop-nav-item {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.38rem clamp(0.32rem, 0.5vw, 0.65rem);
  font-size: clamp(0.76rem, 0.8vw, 0.88rem);
  font-weight: 500;
  color: var(--color-ink-secondary);
  text-decoration: none;
  letter-spacing: 0.15px;
  background: transparent;
  transition: color 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
  flex-shrink: 0;
  cursor: pointer;
}

.desktop-nav-item:hover {
  color: var(--color-primary);
  transform: translateY(-1.5px);
}

.desktop-nav-item.active {
  font-weight: 700;
  color: var(--color-primary);
}

/* Sleek animated indicator line at bottom */
.desktop-nav-item::after {
  content: '';
  position: absolute;
  bottom: 0px;
  left: 50%;
  width: 0;
  height: 2.5px;
  background: var(--color-primary);
  border-radius: 9999px;
  transform: translateX(-50%);
  transition: width 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease;
  opacity: 0;
  box-shadow: 0 1px 6px rgba(192, 41, 60, 0.3);
}

.desktop-nav-item.active::after {
  width: 75%;
  opacity: 1;
}

.desktop-nav-item:hover:not(.active)::after {
  width: 40%;
  opacity: 0.45;
}

/* Responsive adjustment for Laptops (1024px to 1320px) — Compact mode so Tamil & all languages never overflow */
@media (max-width: 1320px) {
  .desktop-nav-links {
    gap: clamp(0.15rem, 0.35vw, 0.45rem) !important;
  }
  .desktop-nav-item {
    padding: 0.32rem clamp(0.25rem, 0.35vw, 0.42rem) !important;
    font-size: 0.77rem !important;
  }
  .navbar-brand-tagline {
    display: none !important;
  }
}

@media (max-width: 1140px) {
  .desktop-nav-links {
    gap: 0.12rem !important;
  }
  .desktop-nav-item {
    padding: 0.28rem 0.3rem !important;
    font-size: 0.74rem !important;
    letter-spacing: 0 !important;
  }
}

`;
  css = css.slice(0, startIndex) + correctedBlock + css.slice(endIndex);
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('Fixed CSS structure and media query braces');
} else {
  console.log('Start or end marker not found:', startIndex, endIndex);
}
