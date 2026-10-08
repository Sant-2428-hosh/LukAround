const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../frontend/src/index.css');
let content = fs.readFileSync(cssPath, 'utf8');

const startMarker = '/* ── Toggle Button ── */';
const endMarker = '/* ── Rich Response Cards (inside chat) ── */';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error('Markers not found! start:', startIndex, 'end:', endIndex);
  process.exit(1);
}

const replacement = `/* ── Dishly Floating Toggle Button ── */
.dishly-toggle-btn {
  position: fixed;
  bottom: 1.75rem;
  right: 1.75rem;
  z-index: 9000;
  padding: 6px 14px 6px 8px !important;
  min-height: 52px;
  border-radius: 9999px;
  background: linear-gradient(135deg, var(--color-primary, #C0293C) 0%, var(--color-primary-dark, #7A1626) 100%);
  color: #fff;
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  cursor: pointer;
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 28px rgba(192, 41, 60, 0.38), 0 3px 10px rgba(0, 0, 0, 0.18);
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dishly-toggle-btn:hover {
  transform: translateY(-2px) scale(1.04);
  box-shadow: 0 12px 36px rgba(192, 41, 60, 0.48), 0 4px 14px rgba(0, 0, 0, 0.22);
}

.dishly-toggle-btn--open {
  width: 52px !important;
  min-width: 52px !important;
  height: 52px !important;
  padding: 0 !important;
  border-radius: 50% !important;
  background: linear-gradient(135deg, #374151 0%, #111827 100%) !important;
}

.dishly-toggle-btn--pulse {
  animation: dishlyPulse 2.4s cubic-bezier(0.66, 0, 0, 1) infinite;
}

@keyframes dishlyPulse {
  0%   { box-shadow: 0 8px 28px rgba(192, 41, 60, 0.38), 0 0 0 0 rgba(192, 41, 60, 0.55); }
  70%  { box-shadow: 0 8px 28px rgba(192, 41, 60, 0.38), 0 0 0 16px rgba(192, 41, 60, 0); }
  100% { box-shadow: 0 8px 28px rgba(192, 41, 60, 0.38), 0 0 0 0 rgba(192, 41, 60, 0); }
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
  padding: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
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
  font-size: 0.92rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: #ffffff;
}

.dishly-toggle-tag {
  font-size: 0.58rem;
  font-weight: 800;
  color: #FFE4E6;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.dishly-toggle-sparkle {
  color: #FDE047;
  animation: dishlySparkle 2s ease infinite;
}

@keyframes dishlySparkle {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.9; }
  50% { transform: scale(1.25) rotate(15deg); opacity: 1; }
}

.dishly-unread-dot {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 11px;
  height: 11px;
  background: #10B981;
  border-radius: 50%;
  border: 2px solid #ffffff;
  animation: chatBlink 1.5s ease infinite;
}

@keyframes chatBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* ── Dishly Panel ── */
.chat-panel.dishly-panel,
.chat-panel {
  position: fixed;
  bottom: 5.6rem;
  right: 1.75rem;
  z-index: 9000;
  width: 415px;
  max-width: calc(100vw - 2rem);
  height: 565px;
  max-height: calc(100vh - 7rem);
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.85);
  border-radius: 24px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.22), 0 8px 24px rgba(192, 41, 60, 0.12);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: translateY(20px) scale(0.96);
  opacity: 0;
  pointer-events: none;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
  transform-origin: bottom right;
}

.chat-panel--open {
  transform: translateY(0) scale(1) !important;
  opacity: 1 !important;
  pointer-events: all !important;
}

/* ── Dishly Header ── */
.chat-panel-header.dishly-header,
.chat-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.1rem;
  background: linear-gradient(135deg, var(--color-primary, #C0293C) 0%, var(--color-primary-dark, #7A1626) 100%);
  color: #ffffff;
  flex-shrink: 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
  position: relative;
  z-index: 10;
}

.chat-panel-header-left.dishly-header-left,
.chat-panel-header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

/* LukAround Logo Emblem */
.dishly-logo-badge {
  width: 38px;
  height: 38px;
  background: #ffffff;
  border-radius: 12px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
  flex-shrink: 0;
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
  width: 10px;
  height: 10px;
  background: #10B981;
  border: 2px solid #ffffff;
  border-radius: 50%;
  box-shadow: 0 0 6px #10B981;
  animation: chatBlink 1.8s ease infinite;
}

.dishly-title-row {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.dishly-brand-name {
  font-size: 1.05rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: #ffffff;
  font-family: var(--font-body);
}

.dishly-ai-badge {
  font-size: 0.58rem;
  font-weight: 800;
  background: rgba(255, 255, 255, 0.22);
  color: #FFE4E6;
  padding: 2px 6px;
  border-radius: 6px;
  letter-spacing: 0.05em;
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.dishly-sub {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.92);
  margin-top: 2px;
}

.chat-online-dot {
  width: 6px;
  height: 6px;
  background: #4ADE80;
  border-radius: 50%;
  box-shadow: 0 0 6px #4ADE80;
  animation: chatBlink 2s ease infinite;
}

/* ── Header Actions & High-Contrast Visible Cross Button ── */
.dishly-header-actions,
.chat-panel-header-actions {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.chat-header-btn.dishly-action-btn,
.chat-header-btn.dishly-close-btn,
.chat-header-btn {
  padding: 0 !important;
  width: 32px !important;
  min-width: 32px !important;
  height: 32px !important;
  min-height: 32px !important;
  border-radius: 10px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  box-shadow: none !important;
  border: 1px solid rgba(255, 255, 255, 0.28) !important;
  background: rgba(255, 255, 255, 0.16) !important;
  color: #ffffff !important;
  cursor: pointer;
  position: relative;
  transition: all 0.18s ease;
}

.dishly-action-btn:hover,
.chat-header-btn:hover {
  background: rgba(255, 255, 255, 0.28) !important;
  transform: translateY(-1px);
}

.dishly-action-btn--active {
  background: #ffffff !important;
  color: var(--color-primary, #C0293C) !important;
  border-color: #ffffff !important;
}

.dishly-action-btn--active svg {
  stroke: var(--color-primary, #C0293C) !important;
}

.dishly-history-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #F59E0B;
  color: #ffffff;
  font-size: 0.58rem;
  font-weight: 800;
  min-width: 15px;
  height: 15px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
  border: 1.5px solid var(--color-primary-dark, #7A1626);
}

/* CRITICAL: High-Contrast Visible Cross / Close Button */
.chat-header-btn.dishly-close-btn {
  background: rgba(0, 0, 0, 0.35) !important;
  border: 1.5px solid rgba(255, 255, 255, 0.55) !important;
  color: #ffffff !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25) !important;
}

.chat-header-btn.dishly-close-btn:hover {
  background: #DC2626 !important;
  border-color: #EF4444 !important;
  color: #ffffff !important;
  transform: scale(1.08);
}

.chat-header-btn.dishly-close-btn svg {
  stroke: #ffffff !important;
  stroke-width: 2.8 !important;
  display: block !important;
}

/* ── Location Quick-Adaptation Bar ── */
.chat-location-bar.dishly-location-bar,
.chat-location-bar {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.85rem;
  background: #FFF1F2;
  border-bottom: 1px solid #FFE4E6;
  flex-shrink: 0;
  overflow: hidden;
}

.chat-location-bar-label {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.68rem;
  font-weight: 700;
  color: #BE123C;
  white-space: nowrap;
  flex-shrink: 0;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.chat-location-chips {
  display: flex;
  align-items: center;
  gap: 0.35rem;
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
  padding: 0.25rem 0.65rem !important;
  border-radius: 999px;
  background: #fff;
  color: var(--color-ink-secondary);
  border: 1px solid rgba(190, 18, 60, 0.2);
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  box-shadow: none !important;
  transition: all 0.15s ease;
}

.chat-location-pill:hover {
  background: #FEE2E2;
  color: #BE123C;
  border-color: #BE123C;
  transform: translateY(-1px);
}

.chat-location-pill--active {
  background: linear-gradient(135deg, #E11D48 0%, #BE123C 100%) !important;
  color: #fff !important;
  border-color: #BE123C !important;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(190, 18, 60, 0.28) !important;
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
  padding: 0.75rem 1rem;
  background: #ffffff;
  border-bottom: 1px solid var(--color-rule);
}

.dishly-history-header-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dishly-history-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--color-ink);
}

.dishly-history-new-btn {
  padding: 0.35rem 0.75rem !important;
  font-size: 0.76rem !important;
  font-weight: 700 !important;
  border-radius: 8px !important;
  background: var(--color-primary-light, #FFE4E6) !important;
  color: var(--color-primary, #C0293C) !important;
  border: 1px solid rgba(192, 41, 60, 0.25) !important;
  cursor: pointer;
  display: inline-flex !important;
  align-items: center;
  gap: 0.35rem;
  box-shadow: none !important;
  transition: all 0.15s ease;
}

.dishly-history-new-btn:hover {
  background: var(--color-primary, #C0293C) !important;
  color: #ffffff !important;
}

.dishly-history-list {
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dishly-history-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 1.5rem;
  gap: 0.5rem;
  color: var(--color-ink-tertiary);
}

.dishly-history-empty-title {
  font-size: 0.9rem;
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
  gap: 0.65rem;
  padding: 0.65rem 0.8rem;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid var(--color-rule);
  cursor: pointer;
  transition: all 0.18s ease;
  position: relative;
}

.dishly-history-item:hover {
  border-color: rgba(190, 18, 60, 0.35);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
}

.dishly-history-item--active {
  border-color: var(--color-primary, #C0293C);
  background: #FFFBFB;
  box-shadow: 0 2px 8px rgba(192, 41, 60, 0.12);
}

.dishly-history-item-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
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
  font-size: 0.82rem;
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
  font-size: 0.68rem;
  color: var(--color-ink-tertiary);
  margin-top: 2px;
}

.dishly-history-city-tag {
  background: #FFE4E6;
  color: #BE123C;
  padding: 1px 5px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.64rem;
}

.dishly-history-delete-btn {
  padding: 0 !important;
  width: 26px !important;
  height: 26px !important;
  border-radius: 6px !important;
  background: transparent !important;
  border: none !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer;
  box-shadow: none !important;
  opacity: 0.6;
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
  padding: 0.75rem 1rem;
  background: #ffffff;
  border-top: 1px solid var(--color-rule);
  display: flex;
  justify-content: flex-end;
}

.dishly-clear-all-btn {
  padding: 0.35rem 0.75rem !important;
  font-size: 0.72rem !important;
  font-weight: 600 !important;
  color: #EF4444 !important;
  background: #FEF2F2 !important;
  border: 1px solid #FECDD3 !important;
  border-radius: 6px !important;
  cursor: pointer;
  display: inline-flex !important;
  align-items: center;
  gap: 0.35rem;
  box-shadow: none !important;
}

.dishly-clear-all-btn:hover {
  background: #FEE2E2 !important;
}

/* ── Messages Area ── */
.chat-messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  background: linear-gradient(180deg, #FAFAF8 0%, #FFFFFF 100%);
  scrollbar-width: thin;
  scrollbar-color: var(--color-rule) transparent;
}

.chat-messages-area::-webkit-scrollbar { width: 4px; }
.chat-messages-area::-webkit-scrollbar-thumb { background: var(--color-rule); border-radius: 2px; }

/* ── Message Row ── */
.chat-msg-row {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  animation: chatMsgIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes chatMsgIn {
  from { opacity: 0; transform: translateY(10px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0); }
}

.chat-msg-user {
  flex-direction: row-reverse;
}

/* ── Avatars with LukAround Logo Branding ── */
.chat-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}

.chat-avatar.dishly-bot-avatar {
  background: #ffffff !important;
  border: 1.5px solid rgba(190, 18, 60, 0.25) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
  padding: 3px !important;
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
  max-width: 84%;
}

.chat-msg-user .chat-bubble-wrap {
  align-items: flex-end;
}

.chat-bubble {
  padding: 0.65rem 0.9rem;
  border-radius: 16px;
  font-size: 0.84rem;
  line-height: 1.55;
  position: relative;
  max-width: 100%;
}

.chat-bubble-bot {
  background: #fff;
  color: var(--color-ink);
  border: 1px solid var(--color-rule);
  border-top-left-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.chat-bubble-user {
  background: linear-gradient(135deg, var(--color-primary, #C0293C) 0%, var(--color-primary-dark, #7A1626) 100%);
  color: #fff;
  border-top-right-radius: 4px;
  box-shadow: 0 2px 8px rgba(192,41,60,0.3);
}

.chat-bubble-content {
  position: relative;
}

.chat-copy-btn {
  position: absolute;
  bottom: 4px;
  right: 6px;
  width: 20px !important;
  height: 20px !important;
  min-width: 20px !important;
  min-height: 20px !important;
  padding: 0 !important;
  border: none !important;
  background: rgba(0,0,0,0.04) !important;
  border-radius: 4px !important;
  color: var(--color-ink-tertiary) !important;
  cursor: pointer;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  box-shadow: none !important;
  opacity: 0.7;
  transition: opacity 0.15s ease;
}

.chat-copy-btn:hover {
  opacity: 1;
  background: rgba(0,0,0,0.08) !important;
}

.chat-cursor {
  display: inline;
  animation: chatCursorBlink 0.7s step-end infinite;
  color: var(--color-primary);
}

@keyframes chatCursorBlink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0; }
}

/* ── Typing Indicator ── */
.chat-typing-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0.7rem 0.9rem;
  width: fit-content;
}

.chat-typing-indicator span {
  width: 6px;
  height: 6px;
  background: var(--color-primary);
  border-radius: 50%;
  animation: chatTypeDot 1.2s ease infinite;
}

.chat-typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.chat-typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

@keyframes chatTypeDot {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30%           { transform: translateY(-6px); opacity: 1; }
}

/* ── Suggestion Chips ── */
.chat-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.25rem;
}

.chat-chip {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.3rem 0.65rem !important;
  border-radius: 100px;
  background: var(--color-primary-light, #FFE4E6);
  color: var(--color-primary, #C0293C);
  border: 1px solid rgba(192,41,60,0.2);
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  box-shadow: none !important;
}

.chat-chip:hover {
  background: var(--color-primary, #C0293C) !important;
  color: #fff !important;
  border-color: var(--color-primary, #C0293C) !important;
  transform: translateY(-1px);
}

/* ── Voice Input Listening Banner ── */
.dishly-listening-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.45rem 0.9rem;
  background: #FFF1F2;
  border-top: 1px solid #FECDD3;
  border-bottom: 1px solid #FECDD3;
  animation: dishlyFadeIn 0.2s ease;
}

.dishly-listening-status {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.74rem;
  font-weight: 700;
  color: #BE123C;
}

.dishly-listening-dot {
  width: 8px;
  height: 8px;
  background: #EF4444;
  border-radius: 50%;
  animation: chatBlink 1s infinite;
}

.dishly-soundwave {
  display: flex;
  align-items: center;
  gap: 3px;
  height: 16px;
}

.dishly-soundwave span {
  width: 3px;
  background: #BE123C;
  border-radius: 2px;
  animation: soundwave 1s ease-in-out infinite;
}

.dishly-soundwave span:nth-child(1) { height: 6px; animation-delay: 0.1s; }
.dishly-soundwave span:nth-child(2) { height: 14px; animation-delay: 0.3s; }
.dishly-soundwave span:nth-child(3) { height: 10px; animation-delay: 0.15s; }
.dishly-soundwave span:nth-child(4) { height: 16px; animation-delay: 0.4s; }
.dishly-soundwave span:nth-child(5) { height: 8px; animation-delay: 0.2s; }

@keyframes soundwave {
  0%, 100% { transform: scaleY(0.4); }
  50% { transform: scaleY(1); }
}

.dishly-listening-stop-btn {
  padding: 0.2rem 0.55rem !important;
  font-size: 0.7rem !important;
  font-weight: 700 !important;
  border-radius: 6px !important;
  background: #BE123C !important;
  color: #fff !important;
  border: none !important;
  cursor: pointer;
  box-shadow: none !important;
}

/* ── Input Area ── */
.chat-input-area.dishly-input-area,
.chat-input-area {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.65rem 0.85rem;
  border-top: 1px solid var(--color-rule);
  background: #fff;
  flex-shrink: 0;
}

.chat-input.dishly-input,
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
}

.chat-input.dishly-input:focus,
.chat-input:focus {
  border-color: var(--color-primary, #C0293C);
  box-shadow: 0 0 0 3px var(--color-primary-light, #FFE4E6);
  background: #fff;
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
  background: var(--color-canvas-subtle) !important;
  color: var(--color-ink-secondary) !important;
  cursor: pointer;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  box-shadow: none !important;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.dishly-mic-btn:hover {
  background: #FFE4E6 !important;
  border-color: var(--color-primary, #C0293C) !important;
  color: var(--color-primary, #C0293C) !important;
  transform: translateY(-1px);
}

.dishly-mic-btn--active {
  background: #EF4444 !important;
  border-color: #DC2626 !important;
  color: #ffffff !important;
  animation: micPulse 1.2s infinite !important;
}

@keyframes micPulse {
  0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); }
  70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
  100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
}

/* Send Button */
.chat-send-btn.dishly-send-btn,
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
}

.dishly-input-hint,
.chat-input-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  font-size: 0.65rem;
  color: var(--color-ink-tertiary);
  padding: 0 1rem 0.45rem;
  background: #fff;
  flex-shrink: 0;
}

`;

const newContent = content.substring(0, startIndex) + replacement + content.substring(endIndex);
fs.writeFileSync(cssPath, newContent, 'utf8');
console.log('Successfully applied Dishly CSS styles!');
