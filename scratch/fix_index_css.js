const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'frontend', 'src', 'index.css');
let css = fs.readFileSync(cssPath, 'utf8');

const targetStr = '.desktop-nav-links {';
const nextBlockStr = '/* High visibility for all Lucide SVG icons inside nav buttons */';

const start = css.indexOf(targetStr);
const end = css.indexOf(nextBlockStr);

if (start !== -1 && end !== -1) {
  const newStyles = `.desktop-nav-links {
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
  css = css.slice(0, start) + newStyles + css.slice(end);
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('Successfully updated index.css');
} else {
  console.log('Target block not found:', start, end);
}
