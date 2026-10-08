const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../frontend/src/index.css');
let content = fs.readFileSync(cssPath, 'utf8');

const targetStr = `.chat-input.dishly-input,
.chat-input {
  flex: 1;
  border: 1.5px solid var(--color-rule);
  border-radius: 14px;
  padding: 0.6rem 0.85rem;
  font-family: var(--font-body);
  font-size: 0.84rem;
  color: var(--color-ink);
  resize: none;
  min-height: 40px;
  max-height: 90px;
  background: var(--color-canvas-warm);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  line-height: 1.45;
}`;

const replacementStr = `.chat-input.dishly-input,
.chat-input {
  flex: 1;
  border: 1.5px solid var(--color-rule);
  border-radius: 14px;
  padding: 0.55rem 0.85rem;
  font-family: var(--font-body);
  font-size: 0.84rem;
  color: var(--color-ink);
  resize: none !important;
  height: 40px;
  min-height: 40px !important;
  max-height: 80px;
  background: var(--color-canvas-warm);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  line-height: 1.35;
  overflow-y: hidden !important;
  overflow-x: hidden !important;
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
}

.chat-input.dishly-input::-webkit-scrollbar,
.chat-input::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}

.chat-input.dishly-input::placeholder,
.chat-input::placeholder {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  color: var(--color-ink-tertiary);
  line-height: 1.35;
}`;

// Normalize line endings for replacement
const normalize = str => str.replace(/\r\n/g, '\n');
const normalizedContent = normalize(content);
const normalizedTarget = normalize(targetStr);
const normalizedReplacement = normalize(replacementStr);

if (!normalizedContent.includes(normalizedTarget)) {
  console.error('Target CSS snippet not found!');
  process.exit(1);
}

const updated = normalizedContent.replace(normalizedTarget, normalizedReplacement);
fs.writeFileSync(cssPath, updated.replace(/\n/g, '\r\n'), 'utf8');
console.log('Successfully updated input CSS to eliminate scrollbar and fit content!');
