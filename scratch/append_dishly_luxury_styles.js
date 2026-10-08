const fs = require('fs');
const path = require('path');

const cssPath = path.resolve(__dirname, '../frontend/src/index.css');
let css = fs.readFileSync(cssPath, 'utf8');

const luxuryRules = `
/* ── Dishly World-Class Luxury Polish & Micro-Interactions ── */

.dishly-toggle-btn {
  overflow: hidden;
}

.dishly-toggle-btn::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    60deg,
    transparent 20%,
    rgba(255, 255, 255, 0.25) 45%,
    rgba(255, 255, 255, 0.45) 50%,
    rgba(255, 255, 255, 0.25) 55%,
    transparent 80%
  );
  transform: rotate(25deg) translateX(-150%);
  animation: dishlySpecularShimmer 5.5s infinite ease-in-out;
  pointer-events: none;
  border-radius: 9999px;
}

@keyframes dishlySpecularShimmer {
  0%   { transform: rotate(25deg) translateX(-150%); }
  22%  { transform: rotate(25deg) translateX(150%); }
  100% { transform: rotate(25deg) translateX(150%); }
}

/* Chat bubble actions: Audio TTS and Copy Buttons */
.chat-bubble-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  position: absolute;
  bottom: 5px;
  right: 6px;
  z-index: 2;
}

.chat-action-icon-btn {
  width: 22px !important;
  height: 22px !important;
  min-width: 22px !important;
  min-height: 22px !important;
  padding: 0 !important;
  border: none !important;
  background: rgba(0, 0, 0, 0.05) !important;
  border-radius: 6px !important;
  color: var(--color-ink-tertiary) !important;
  cursor: pointer;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  box-shadow: none !important;
  opacity: 0.75;
  transition: all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.chat-action-icon-btn:hover {
  opacity: 1;
  background: rgba(0, 0, 0, 0.1) !important;
  transform: scale(1.12);
  color: var(--color-ink) !important;
}

.chat-action-icon-btn--speaking {
  opacity: 1 !important;
  background: #FFE4E6 !important;
  color: #E11D48 !important;
  animation: speakingPulse 1.2s infinite;
}

@keyframes speakingPulse {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(225, 29, 72, 0.4); }
  50% { transform: scale(1.14); box-shadow: 0 0 0 5px rgba(225, 29, 72, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(225, 29, 72, 0); }
}

/* Restaurant Identity & Actions */
.chat-restaurant-identity {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.chat-restaurant-cuisine-icon {
  font-size: 1.15rem;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: #FFF1F2;
  border: 1px solid #FFE4E6;
  flex-shrink: 0;
}

.chat-restaurant-reviews {
  font-size: 0.62rem;
  font-weight: 600;
  color: #78350F;
  margin-left: 2px;
}

.chat-restaurant-timings {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.65rem;
  color: #64748B;
  background: #F8FAFC;
  padding: 0.12rem 0.45rem;
  border-radius: 4px;
}

.chat-restaurant-actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.chat-restaurant-ask-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.22rem 0.55rem !important;
  font-size: 0.68rem !important;
  font-weight: 700 !important;
  border-radius: 7px !important;
  background: #FFF1F2 !important;
  color: #BE123C !important;
  border: 1px solid rgba(190, 18, 60, 0.25) !important;
  cursor: pointer;
  box-shadow: none !important;
  transition: all 0.18s ease;
}

.chat-restaurant-ask-btn:hover {
  background: #BE123C !important;
  color: #ffffff !important;
  transform: translateY(-1px);
}
`;

// Only append if not already present
if (!css.includes('dishlySpecularShimmer')) {
  css += '\n' + luxuryRules + '\n';
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('✅ Successfully added Dishly luxury rules to index.css!');
} else {
  console.log('ℹ️ Dishly luxury rules already present in index.css.');
}
