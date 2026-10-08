const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../frontend/src/index.css');
let content = fs.readFileSync(cssPath, 'utf8');

const startMarker = '/* ── Restaurant Card Styles ── */';
const endMarker = '.chat-card-header {';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found! start:', startIndex, 'end:', endIndex);
  process.exit(1);
}

const replacement = `/* ── Michelin-Grade Dishly Restaurant Cards ── */
.chat-restaurant-filters {
  display: flex;
  gap: 0.4rem;
  padding: 0.55rem 0.85rem;
  background: #FDF4F5;
  overflow-x: auto;
  border-bottom: 1px solid #FCE7EA;
  scrollbar-width: none;
}

.chat-restaurant-filters::-webkit-scrollbar {
  display: none;
}

.chat-filter-btn {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.25rem 0.65rem !important;
  border-radius: 999px;
  border: 1px solid rgba(190, 18, 60, 0.2);
  background: #ffffff;
  color: var(--color-ink-secondary);
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 1px 3px rgba(0,0,0,0.03) !important;
  transition: all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.chat-filter-btn:hover {
  border-color: #BE123C;
  color: #BE123C;
  transform: translateY(-1px);
}

.chat-filter-btn--active {
  background: linear-gradient(135deg, #E11D48 0%, #9F1239 100%) !important;
  color: #ffffff !important;
  border-color: transparent !important;
  font-weight: 700;
  box-shadow: 0 3px 10px rgba(225, 29, 72, 0.3) !important;
}

.chat-restaurants-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  padding: 0.75rem 0.85rem;
  max-height: 310px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--color-rule) transparent;
}

.chat-restaurant-item {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.07);
  border-radius: 14px;
  padding: 0.7rem 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

.chat-restaurant-item:hover {
  border-color: #FECDD3;
  box-shadow: 0 8px 20px rgba(190, 18, 60, 0.1);
  transform: translateY(-2px);
}

.chat-restaurant-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
}

.chat-restaurant-name {
  font-size: 0.88rem;
  font-weight: 800;
  color: var(--color-ink);
  letter-spacing: -0.01em;
  line-height: 1.25;
}

.chat-restaurant-cuisine {
  font-size: 0.72rem;
  font-weight: 500;
  color: #64748B;
  margin-top: 0.15rem;
}

.chat-restaurant-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.74rem;
  font-weight: 800;
  color: #92400E;
  background: #FEF3C7;
  border: 1px solid #FDE68A;
  padding: 0.15rem 0.45rem;
  border-radius: 7px;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(245, 158, 11, 0.15);
}

.chat-restaurant-details {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.4rem;
  font-size: 0.69rem;
  color: var(--color-ink-tertiary);
}

.chat-restaurant-tag {
  background: #F1F5F9;
  color: #334155;
  padding: 0.15rem 0.5rem;
  border-radius: 5px;
  font-weight: 700;
  font-size: 0.67rem;
}

.chat-restaurant-price {
  font-weight: 700;
  color: #047857;
  background: #ECFDF5;
  border: 1px solid #A7F3D0;
  padding: 0.15rem 0.5rem;
  border-radius: 5px;
  font-size: 0.67rem;
}

.chat-restaurant-area {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  font-weight: 500;
}

.chat-restaurant-must-try {
  font-size: 0.73rem;
  background: #FFF1F2;
  border: 1px solid #FECDD3;
  border-radius: 8px;
  padding: 0.35rem 0.65rem;
  color: #9F1239;
  line-height: 1.4;
}

.chat-restaurant-must-try .must-try-label {
  font-weight: 800;
  margin-right: 0.2rem;
}

.chat-restaurant-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.2rem;
  padding-top: 0.35rem;
  border-top: 1px dashed rgba(0, 0, 0, 0.08);
}

.chat-restaurant-ambiance {
  font-size: 0.68rem;
  color: #64748B;
  font-style: italic;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 185px;
}

.chat-restaurant-map-link {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  color: #ffffff !important;
  font-weight: 700;
  font-size: 0.68rem;
  text-decoration: none;
  padding: 0.22rem 0.6rem;
  border-radius: 7px;
  background: linear-gradient(135deg, #E11D48 0%, #BE123C 100%);
  box-shadow: 0 2px 6px rgba(225, 29, 72, 0.25);
  transition: all 0.18s ease;
}

.chat-restaurant-map-link:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(225, 29, 72, 0.4);
  filter: brightness(1.05);
}

`;

const newContent = content.substring(0, startIndex) + replacement + content.substring(endIndex);
fs.writeFileSync(cssPath, newContent, 'utf8');
console.log('Successfully upgraded restaurant card styles using index markers!');
