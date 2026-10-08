const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../frontend/src/index.css');
let content = fs.readFileSync(cssPath, 'utf8');

const targetStr = `.chat-send-btn.dishly-send-btn,
.chat-send-btn {
  width: 40px !important;
  min-width: 40px !important;
  height: 40px !important;
  min-height: 40px !important;
  padding: 0 !important;
  border-radius: 12px !important;
  border: none !important;
  background: var(--color-rule) !important;
  color: var(--color-ink-tertiary) !important;
  cursor: pointer;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  box-shadow: none !important;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.dishly-send-btn--active,
.chat-send-btn--active {
  background: linear-gradient(135deg, var(--color-primary, #C0293C) 0%, var(--color-primary-dark, #7A1626) 100%) !important;
  color: #fff !important;
  box-shadow: 0 4px 14px rgba(192,41,60,0.38) !important;
}

.dishly-send-btn--active:hover,
.chat-send-btn--active:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(192,41,60,0.48) !important;
}`;

const replacementStr = `.chat-send-btn.dishly-send-btn,
.chat-send-btn {
  width: 40px !important;
  min-width: 40px !important;
  height: 40px !important;
  min-height: 40px !important;
  padding: 0 !important;
  border-radius: 12px !important;
  border: 1.5px solid var(--color-rule) !important;
  background: var(--color-canvas-subtle) !important;
  color: var(--color-ink-secondary) !important;
  cursor: pointer;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  box-shadow: none !important;
  flex-shrink: 0;
  transition: all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.chat-send-btn.dishly-send-btn svg,
.chat-send-btn svg {
  stroke: #4A4A52 !important;
  stroke-width: 2.4 !important;
  display: block !important;
  transition: transform 0.2s ease, stroke 0.2s ease;
}

.chat-send-btn.dishly-send-btn:hover,
.chat-send-btn:hover {
  background: #FFE4E6 !important;
  border-color: var(--color-primary, #C0293C) !important;
  transform: translateY(-1px);
}

.chat-send-btn.dishly-send-btn:hover svg,
.chat-send-btn:hover svg {
  stroke: var(--color-primary, #C0293C) !important;
  transform: translateX(1.5px) translateY(-1.5px) scale(1.1);
}

.dishly-send-btn--active,
.chat-send-btn--active {
  background: linear-gradient(135deg, var(--color-primary, #C0293C) 0%, var(--color-primary-dark, #7A1626) 100%) !important;
  border-color: transparent !important;
  color: #fff !important;
  box-shadow: 0 4px 14px rgba(192,41,60,0.38) !important;
}

.dishly-send-btn--active svg,
.chat-send-btn--active svg {
  stroke: #ffffff !important;
}

.dishly-send-btn--active:hover,
.chat-send-btn--active:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(192,41,60,0.48) !important;
}

.dishly-send-btn--active:hover svg,
.chat-send-btn--active:hover svg {
  stroke: #ffffff !important;
  transform: translateX(2px) translateY(-2px) scale(1.08);
}`;

const normalize = str => str.replace(/\r\n/g, '\n');
const normalizedContent = normalize(content);
const normalizedTarget = normalize(targetStr);
const normalizedReplacement = normalize(replacementStr);

if (!normalizedContent.includes(normalizedTarget)) {
  console.error('Target CSS snippet for send-btn not found!');
  process.exit(1);
}

const updated = normalizedContent.replace(normalizedTarget, normalizedReplacement);
fs.writeFileSync(cssPath, updated.replace(/\n/g, '\r\n'), 'utf8');
console.log('Successfully updated Send button CSS with visible icon and hover states!');
