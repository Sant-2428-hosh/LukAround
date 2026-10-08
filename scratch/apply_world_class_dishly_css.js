const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../frontend/src/index.css');
let content = fs.readFileSync(cssPath, 'utf8');

const startMarker = '/* ── Dishly Floating Toggle Button ── */';
const endMarker = '/* ── Rich Response Cards (inside chat) ── */';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found! start:', startIndex, 'end:', endIndex);
  process.exit(1);
}

const replacement = `/* ── World-Class Dishly Floating Launcher Capsule ── */
.dishly-launcher-wrap {
  position: fixed;
  bottom: 1.75rem;
  right: 1.75rem;
  z-index: 9000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

/* Floating Hover Tooltip Pill */
.dishly-launcher-hover-pill {
  background: rgba(17, 17, 20, 0.88);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  color: #ffffff;
  font-size: 0.73rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
  pointer-events: none;
  opacity: 0;
  transform: translateY(6px) scale(0.96);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
}

.dishly-launcher-wrap:hover .dishly-launcher-hover-pill {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.dishly-hover-sparkle {
  color: #FDE047;
  animation: dishlySparkle 2s ease infinite;
}

/* Floating Toggle Button Capsule */
.dishly-toggle-btn {
  position: relative;
  padding: 6px 14px 6px 8px !important;
  min-height: 52px;
  border-radius: 9999px;
  background: linear-gradient(135deg, #C0293C 0%, #881337 50%, #4C0519 100%);
  color: #fff;
  border: 1.5px solid rgba(255, 255, 255, 0.45);
  cursor: pointer;
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 32px -4px rgba(192, 41, 60, 0.48), 0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.6);
  transition: all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dishly-toggle-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 16px 42px -4px rgba(192, 41, 60, 0.6), 0 6px 16px rgba(0, 0, 0, 0.26), inset 0 1px 1px rgba(255, 255, 255, 0.8);
}

.dishly-toggle-btn:active {
  transform: translateY(0) scale(0.98);
}

.dishly-toggle-btn--open {
  width: 52px !important;
  min-width: 52px !important;
  height: 52px !important;
  padding: 0 !important;
  border-radius: 50% !important;
  background: linear-gradient(135deg, #27272A 0%, #09090B 100%) !important;
  border-color: rgba(255, 255, 255, 0.25) !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4) !important;
}

.dishly-toggle-btn--pulse {
  animation: dishlyPulse 2.6s cubic-bezier(0.66, 0, 0, 1) infinite;
}

@keyframes dishlyPulse {
  0%   { box-shadow: 0 10px 32px -4px rgba(192, 41, 60, 0.48), 0 0 0 0 rgba(192, 41, 60, 0.6); }
  70%  { box-shadow: 0 10px 32px -4px rgba(192, 41, 60, 0.48), 0 0 0 18px rgba(192, 41, 60, 0); }
  100% { box-shadow: 0 10px 32px -4px rgba(192, 41, 60, 0.48), 0 0 0 0 rgba(192, 41, 60, 0); }
}

.dishly-toggle-inner {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dishly-toggle-logo-ring {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #ffffff;
  padding: 3.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.22), inset 0 0 0 1px rgba(0,0,0,0.06);
  flex-shrink: 0;
  transition: transform 0.25s ease;
}

.dishly-toggle-btn:hover .dishly-toggle-logo-ring {
  transform: rotate(5deg) scale(1.05);
}

.dishly-toggle-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.dishly-toggle-text-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.1;
}

.dishly-toggle-title {
  font-size: 0.94rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #ffffff;
  font-family: var(--font-body);
}

.dishly-toggle-tag {
  font-size: 0.58rem;
  font-weight: 800;
  color: #FFE4E6;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0.92;
}

.dishly-toggle-sparkle-pill {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FDE047;
  flex-shrink: 0;
}

@keyframes dishlySparkle {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.9; }
  50% { transform: scale(1.25) rotate(15deg); opacity: 1; }
}

.dishly-unread-dot {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: #10B981;
  border-radius: 50%;
  border: 2.5px solid #ffffff;
  box-shadow: 0 0 8px #10B981;
  animation: chatBlink 1.5s ease infinite;
}

@keyframes chatBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* ── World-Class Dishly Main Panel Shell ── */
.chat-panel.dishly-panel,
.chat-panel {
  position: fixed;
  bottom: 5.8rem;
  right: 1.75rem;
  z-index: 9000;
  width: 425px;
  max-width: calc(100vw - 1.8rem);
  height: 580px;
  max-height: calc(100vh - 7rem);
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(36px) saturate(190%);
  -webkit-backdrop-filter: blur(36px) saturate(190%);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 26px;
  box-shadow: 0 32px 90px -15px rgba(0, 0, 0, 0.28), 0 12px 36px -6px rgba(192, 41, 60, 0.16), inset 0 1px 1px rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: translateY(24px) scale(0.95);
  opacity: 0;
  pointer-events: none;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
  transform-origin: bottom right;
}

.chat-panel--open {
  transform: translateY(0) scale(1) !important;
  opacity: 1 !important;
  pointer-events: all !important;
}

/* ── Luxury Header ── */
.chat-panel-header.dishly-header,
.chat-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.95rem 1.15rem;
  background: linear-gradient(135deg, #9F1239 0%, #881337 40%, #580B1F 100%);
  color: #ffffff;
  flex-shrink: 0;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.16);
  position: relative;
  z-index: 10;
}

.chat-panel-header-left.dishly-header-left,
.chat-panel-header-left {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

/* 3D Glass Logo Capsule */
.dishly-logo-badge {
  width: 42px;
  height: 42px;
  background: #ffffff;
  border-radius: 13px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.22), inset 0 0 0 1px rgba(0,0,0,0.06);
  flex-shrink: 0;
  transition: transform 0.25s ease;
}

.dishly-logo-badge:hover {
  transform: scale(1.05);
}

.dishly-header-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.dishly-online-beacon {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 11px;
  height: 11px;
  background: #10B981;
  border: 2.5px solid #ffffff;
  border-radius: 50%;
  box-shadow: 0 0 8px #10B981;
  animation: chatBlink 1.8s ease infinite;
}

.dishly-title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dishly-brand-name {
  font-size: 1.12rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #ffffff;
  font-family: var(--font-body);
}

.dishly-ai-badge {
  font-size: 0.6rem;
  font-weight: 800;
  background: rgba(255, 255, 255, 0.22);
  color: #FFE4E6;
  padding: 2.5px 7px;
  border-radius: 6px;
  letter-spacing: 0.05em;
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: inline-flex;
  align-items: center;
  gap: 3px;
}

.dishly-sub {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.73rem;
  color: rgba(255, 255, 255, 0.94);
  margin-top: 2px;
}

.dishly-current-city {
  color: #FDE047;
  font-weight: 700;
}

.chat-online-dot {
  width: 6px;
  height: 6px;
  background: #4ADE80;
  border-radius: 50%;
  box-shadow: 0 0 6px #4ADE80;
  animation: chatBlink 2s ease infinite;
}

/* ── Action Buttons Cluster ── */
.dishly-header-actions,
.chat-panel-header-actions {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.chat-header-btn.dishly-action-btn,
.chat-header-btn.dishly-close-btn,
.chat-header-btn {
  padding: 0 !important;
  width: 34px !important;
  min-width: 34px !important;
  height: 34px !important;
  min-height: 34px !important;
  border-radius: 11px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  box-shadow: none !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  background: rgba(255, 255, 255, 0.16) !important;
  color: #ffffff !important;
  cursor: pointer;
  position: relative;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dishly-action-btn:hover,
.chat-header-btn:hover {
  background: rgba(255, 255, 255, 0.28) !important;
  transform: translateY(-1.5px);
}

.dishly-new-chat-btn:hover svg {
  transform: rotate(90deg);
  transition: transform 0.25s ease;
}

.dishly-action-btn--active {
  background: #ffffff !important;
  color: #9F1239 !important;
  border-color: #ffffff !important;
}

.dishly-action-btn--active svg {
  stroke: #9F1239 !important;
}

.dishly-history-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #F59E0B;
  color: #ffffff;
  font-size: 0.58rem;
  font-weight: 800;
  min-width: 16px;
  height: 16px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
  border: 1.5px solid #580B1F;
}

/* CRITICAL: High-Contrast Visible Cross Symbol Button */
.chat-header-btn.dishly-close-btn {
  background: rgba(0, 0, 0, 0.35) !important;
  border: 1.5px solid rgba(255, 255, 255, 0.6) !important;
  color: #ffffff !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25) !important;
}

.chat-header-btn.dishly-close-btn:hover {
  background: #E11D48 !important;
  border-color: #FDA4AF !important;
  color: #ffffff !important;
  transform: scale(1.08) rotate(90deg);
  box-shadow: 0 4px 12px rgba(225, 29, 72, 0.45) !important;
}

.chat-header-btn.dishly-close-btn svg {
  stroke: #ffffff !important;
  stroke-width: 2.8 !important;
  display: block !important;
}

/* ── Location Quick-Adaptation Ribbon ── */
.chat-location-bar.dishly-location-bar,
.chat-location-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.95rem;
  background: #FFF1F2;
  border-bottom: 1px solid #FFE4E6;
  flex-shrink: 0;
  overflow: hidden;
}

.chat-location-bar-label {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.68rem;
  font-weight: 800;
  color: #9F1239;
  white-space: nowrap;
  flex-shrink: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.chat-location-chips {
  display: flex;
  align-items: center;
  gap: 0.38rem;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 2px 0;
}

.chat-location-chips::-webkit-scrollbar {
  display: none;
}

.chat-location-pill {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.25rem 0.68rem !important;
  border-radius: 999px;
  background: #ffffff;
  color: var(--color-ink-secondary);
  border: 1px solid rgba(190, 18, 60, 0.18);
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.03) !important;
  transition: all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.chat-location-pill:hover {
  background: #FEE2E2;
  color: #9F1239;
  border-color: #BE123C;
  transform: translateY(-1.5px);
}

.chat-location-pill--active {
  background: linear-gradient(135deg, #E11D48 0%, #9F1239 100%) !important;
  color: #fff !important;
  border-color: transparent !important;
  font-weight: 700;
  box-shadow: 0 3px 10px rgba(225, 29, 72, 0.32) !important;
  transform: scale(1.03);
}

/* ── History Drawer Overlay ── */
.dishly-history-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #FAF9F6;
  overflow: hidden;
  animation: dishlyFadeIn 0.22s ease-out;
}

@keyframes dishlyFadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.dishly-history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 1.1rem;
  background: #ffffff;
  border-bottom: 1px solid var(--color-rule);
}

.dishly-history-header-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dishly-history-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-ink);
}

.dishly-history-new-btn {
  padding: 0.38rem 0.85rem !important;
  font-size: 0.76rem !important;
  font-weight: 700 !important;
  border-radius: 9px !important;
  background: var(--color-primary-light, #FFE4E6) !important;
  color: var(--color-primary, #C0293C) !important;
  border: 1px solid rgba(192, 41, 60, 0.25) !important;
  cursor: pointer;
  display: inline-flex !important;
  align-items: center;
  gap: 0.35rem;
  box-shadow: none !important;
  transition: all 0.18s ease;
}

.dishly-history-new-btn:hover {
  background: var(--color-primary, #C0293C) !important;
  color: #ffffff !important;
  transform: translateY(-1px);
}

.dishly-history-list {
  flex: 1;
  overflow-y: auto;
  padding: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.dishly-history-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3.5rem 1.5rem;
  gap: 0.6rem;
  color: var(--color-ink-tertiary);
}

.dishly-empty-icon-ring {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #FFE4E6;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.25rem;
}

.dishly-history-empty-title {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--color-ink-secondary);
}

.dishly-history-empty-sub {
  font-size: 0.78rem;
  line-height: 1.5;
  max-width: 280px;
}

.dishly-history-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.85rem;
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid var(--color-rule);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}

.dishly-history-item:hover {
  border-color: rgba(190, 18, 60, 0.35);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
  transform: translateY(-1.5px);
}

.dishly-history-item--active {
  border-color: #E11D48;
  background: #FFFDFD;
  box-shadow: 0 2px 10px rgba(225, 29, 72, 0.12);
}

.dishly-history-item-icon {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: var(--color-canvas-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dishly-history-item-body {
  flex: 1;
  min-width: 0;
}

.dishly-history-item-title {
  font-size: 0.84rem;
  font-weight: 700;
  color: var(--color-ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dishly-history-item-meta {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.69rem;
  color: var(--color-ink-tertiary);
  margin-top: 2px;
}

.dishly-history-city-tag {
  background: #FFE4E6;
  color: #9F1239;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.65rem;
}

.dishly-history-delete-btn {
  padding: 0 !important;
  width: 28px !important;
  height: 28px !important;
  border-radius: 7px !important;
  background: transparent !important;
  border: none !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer;
  box-shadow: none !important;
  opacity: 0.55;
  transition: all 0.15s ease;
}

.dishly-history-delete-btn:hover {
  opacity: 1;
  background: #FEE2E2 !important;
}

.dishly-history-delete-btn:hover svg {
  color: #EF4444 !important;
}

.dishly-history-footer {
  padding: 0.8rem 1.1rem;
  background: #ffffff;
  border-top: 1px solid var(--color-rule);
  display: flex;
  justify-content: flex-end;
}

.dishly-clear-all-btn {
  padding: 0.35rem 0.8rem !important;
  font-size: 0.72rem !important;
  font-weight: 600 !important;
  color: #EF4444 !important;
  background: #FEF2F2 !important;
  border: 1px solid #FECDD3 !important;
  border-radius: 7px !important;
  cursor: pointer;
  display: inline-flex !important;
  align-items: center;
  gap: 0.35rem;
  box-shadow: none !important;
}

.dishly-clear-all-btn:hover {
  background: #FEE2E2 !important;
}

/* ── Messages Stream ── */
.chat-messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.95rem;
  background: linear-gradient(180deg, #FAFAF8 0%, #FFFFFF 100%);
  scrollbar-width: thin;
  scrollbar-color: var(--color-rule) transparent;
}

.chat-messages-area::-webkit-scrollbar { width: 5px; }
.chat-messages-area::-webkit-scrollbar-thumb { background: var(--color-rule); border-radius: 3px; }

/* ── Message Row ── */
.chat-msg-row {
  display: flex;
  gap: 0.6rem;
  align-items: flex-start;
  animation: chatMsgIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes chatMsgIn {
  from { opacity: 0; transform: translateY(12px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.chat-msg-user {
  flex-direction: row-reverse;
}

/* ── Avatars with LukAround Logo Branding ── */
.chat-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}

.chat-avatar.dishly-bot-avatar {
  background: #ffffff !important;
  border: 1.5px solid rgba(190, 18, 60, 0.28) !important;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08) !important;
  padding: 3.5px !important;
  overflow: hidden !important;
}

.dishly-avatar-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.chat-avatar-user {
  background: linear-gradient(135deg, #4A4A52 0%, #111114 100%);
  color: #fff;
}

/* ── Message Bubble ── */
.chat-bubble-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 85%;
}

.chat-msg-user .chat-bubble-wrap {
  align-items: flex-end;
}

.chat-bubble {
  padding: 0.75rem 1rem;
  border-radius: 18px;
  font-size: 0.85rem;
  line-height: 1.58;
  position: relative;
  max-width: 100%;
  letter-spacing: -0.01em;
}

.chat-bubble-bot {
  background: #ffffff;
  color: var(--color-ink);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-top-left-radius: 4px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.05);
}

.chat-bubble-user {
  background: linear-gradient(135deg, #BE123C 0%, #881337 100%);
  color: #fff;
  border-top-right-radius: 4px;
  box-shadow: 0 4px 14px rgba(190, 18, 60, 0.32);
}

.chat-bubble-content {
  position: relative;
}

.chat-copy-btn {
  position: absolute;
  bottom: 5px;
  right: 6px;
  width: 22px !important;
  height: 22px !important;
  min-width: 22px !important;
  min-height: 22px !important;
  padding: 0 !important;
  border: none !important;
  background: rgba(0,0,0,0.04) !important;
  border-radius: 5px !important;
  color: var(--color-ink-tertiary) !important;
  cursor: pointer;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  box-shadow: none !important;
  opacity: 0.7;
  transition: all 0.15s ease;
}

.chat-copy-btn:hover {
  opacity: 1;
  background: rgba(0,0,0,0.08) !important;
  transform: scale(1.08);
}

.chat-cursor {
  display: inline;
  animation: chatCursorBlink 0.7s step-end infinite;
  color: #BE123C;
}

@keyframes chatCursorBlink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

/* ── Typing Indicator ── */
.chat-typing-indicator.dishly-typing-bubble {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0.75rem 1rem;
  width: fit-content;
}

.dishly-dot {
  width: 6px;
  height: 6px;
  background: #E11D48;
  border-radius: 50%;
  animation: chatTypeDot 1.2s ease infinite;
}

.dishly-dot:nth-child(2) { animation-delay: 0.2s; }
.dishly-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes chatTypeDot {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.35; }
  30%           { transform: translateY(-7px); opacity: 1; }
}

/* ── Interactive Smart Suggestion Chips ── */
.chat-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 0.35rem;
}

.chat-chip.dishly-smart-chip {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.35rem 0.75rem !important;
  border-radius: 100px;
  background: #FFF1F2;
  color: #9F1239;
  border: 1px solid rgba(225, 29, 72, 0.2);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  white-space: nowrap;
  box-shadow: 0 1px 4px rgba(0,0,0,0.02) !important;
  display: inline-flex !important;
  align-items: center;
  gap: 0.35rem;
}

.dishly-chip-sparkle {
  color: #F59E0B;
  opacity: 0.7;
}

.chat-chip.dishly-smart-chip:hover {
  background: linear-gradient(135deg, #E11D48 0%, #9F1239 100%) !important;
  color: #fff !important;
  border-color: transparent !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(225, 29, 72, 0.28) !important;
}

.chat-chip.dishly-smart-chip:hover .dishly-chip-sparkle {
  color: #ffffff;
  opacity: 1;
}

/* ── Voice Input Listening Banner ── */
.dishly-listening-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background: #FFF1F2;
  border-top: 1px solid #FECDD3;
  border-bottom: 1px solid #FECDD3;
  animation: dishlyFadeIn 0.2s ease;
}

.dishly-listening-status {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: #9F1239;
}

.dishly-listening-dot {
  width: 9px;
  height: 9px;
  background: #EF4444;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.6);
  animation: chatBlink 1s infinite;
}

.dishly-soundwave {
  display: flex;
  align-items: center;
  gap: 3.5px;
  height: 18px;
}

.dishly-soundwave span {
  width: 3px;
  background: #BE123C;
  border-radius: 3px;
  animation: soundwave 1s ease-in-out infinite;
}

.dishly-soundwave span:nth-child(1) { height: 6px; animation-delay: 0.1s; }
.dishly-soundwave span:nth-child(2) { height: 16px; animation-delay: 0.3s; }
.dishly-soundwave span:nth-child(3) { height: 11px; animation-delay: 0.15s; }
.dishly-soundwave span:nth-child(4) { height: 18px; animation-delay: 0.4s; }
.dishly-soundwave span:nth-child(5) { height: 8px; animation-delay: 0.2s; }

@keyframes soundwave {
  0%, 100% { transform: scaleY(0.4); }
  50% { transform: scaleY(1); }
}

.dishly-listening-stop-btn {
  padding: 0.25rem 0.65rem !important;
  font-size: 0.72rem !important;
  font-weight: 700 !important;
  border-radius: 7px !important;
  background: #9F1239 !important;
  color: #fff !important;
  border: none !important;
  cursor: pointer;
  box-shadow: none !important;
}

/* ── Modern Floating Input Dock ── */
.chat-input-area.dishly-input-area,
.chat-input-area {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  background: #ffffff;
  flex-shrink: 0;
}

.chat-input.dishly-input,
.chat-input {
  flex: 1;
  border: 1.5px solid var(--color-rule);
  border-radius: 14px;
  padding: 0.58rem 0.9rem;
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--color-ink);
  resize: none !important;
  height: 40px;
  min-height: 40px !important;
  max-height: 80px;
  background: #F8F8FA;
  transition: all 0.2s ease;
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
}

.chat-input.dishly-input:focus,
.chat-input:focus {
  border-color: #E11D48;
  box-shadow: 0 0 0 3px rgba(225, 29, 72, 0.15);
  background: #ffffff;
  outline: none;
}

/* Microphone Button */
.chat-mic-btn.dishly-mic-btn,
.chat-mic-btn {
  width: 40px !important;
  min-width: 40px !important;
  height: 40px !important;
  min-height: 40px !important;
  padding: 0 !important;
  border-radius: 12px !important;
  border: 1.5px solid var(--color-rule) !important;
  background: #F8F8FA !important;
  color: var(--color-ink-secondary) !important;
  cursor: pointer;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  box-shadow: none !important;
  flex-shrink: 0;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dishly-mic-btn:hover {
  background: #FFE4E6 !important;
  border-color: #BE123C !important;
  color: #BE123C !important;
  transform: translateY(-1.5px);
}

.dishly-mic-btn--active {
  background: #EF4444 !important;
  border-color: #DC2626 !important;
  color: #ffffff !important;
  animation: micPulse 1.2s infinite !important;
}

@keyframes micPulse {
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); }
  70% { box-shadow: 0 0 0 12px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}

/* Send / Quick Discover Button */
.chat-send-btn.dishly-send-btn,
.chat-send-btn {
  width: 40px !important;
  min-width: 40px !important;
  height: 40px !important;
  min-height: 40px !important;
  padding: 0 !important;
  border-radius: 12px !important;
  border: 1.5px solid var(--color-rule) !important;
  background: #F8F8FA !important;
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
  border-color: #BE123C !important;
  transform: translateY(-1.5px);
}

.chat-send-btn.dishly-send-btn:hover svg,
.chat-send-btn:hover svg {
  stroke: #BE123C !important;
  transform: translateX(1.5px) translateY(-1.5px) scale(1.1);
}

.dishly-send-btn--active,
.chat-send-btn--active {
  background: linear-gradient(135deg, #E11D48 0%, #9F1239 100%) !important;
  border-color: transparent !important;
  color: #fff !important;
  box-shadow: 0 4px 14px rgba(225, 29, 72, 0.38) !important;
}

.dishly-send-btn--active svg,
.chat-send-btn--active svg {
  stroke: #ffffff !important;
}

.dishly-send-btn--active:hover,
.chat-send-btn--active:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(225, 29, 72, 0.48) !important;
}

.dishly-send-btn--active:hover svg,
.chat-send-btn--active:hover svg {
  stroke: #ffffff !important;
  transform: translateX(2px) translateY(-2px) scale(1.08);
}

.dishly-input-hint,
.chat-input-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-size: 0.67rem;
  color: var(--color-ink-tertiary);
  padding: 0 1rem 0.5rem;
  background: #fff;
  flex-shrink: 0;
}

.dishly-hint-badge {
  color: #9F1239;
  font-weight: 700;
}

`;

const newContent = content.substring(0, startIndex) + replacement + content.substring(endIndex);
fs.writeFileSync(cssPath, newContent, 'utf8');
console.log('Successfully applied World-Class Dishly styling to index.css!');
