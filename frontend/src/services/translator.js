/**
 * Universal Real-Time Dynamic Translation Engine (No Hardcoded Dictionaries)
 * Translates any arbitrary real-time data (AI itineraries, hotel listings, safety feeds,
 * broadcasts, user reviews) and all rendered DOM text nodes on the fly.
 */

// Local in-memory cache: { [langCode]: { [englishText]: translatedText } }
const translationCache = {};

// Load persisted cache from localStorage on startup
try {
  const saved = localStorage.getItem('luk_translations_cache');
  if (saved) {
    const parsed = JSON.parse(saved);
    Object.assign(translationCache, parsed);
  }
} catch {
  // Ignore localStorage parsing errors
}

function persistCache() {
  try {
    localStorage.setItem('luk_translations_cache', JSON.stringify(translationCache));
  } catch {
    // Ignore quota errors
  }
}

// Queue for debouncing uncached text batches
let pendingQueue = new Map(); // targetLang -> Set of strings
let queueTimer = null;
const listeners = new Set(); // Notify DOM or hooks when new translations land

/**
 * Register a listener when translations arrive
 */
export function onTranslationsUpdated(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/**
 * Process queued translation requests in a single batch
 */
async function flushQueue() {
  queueTimer = null;
  const currentQueues = pendingQueue;
  pendingQueue = new Map();

  for (const [targetLang, textSet] of currentQueues.entries()) {
    const texts = Array.from(textSet).filter(t => t && t.trim());
    if (texts.length === 0 || targetLang === 'en') continue;

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts, targetLang })
      });

      if (!res.ok) continue;
      const data = await res.json();

      if (data && data.success && Array.isArray(data.translations)) {
        if (!translationCache[targetLang]) {
          translationCache[targetLang] = {};
        }

        texts.forEach((orig, idx) => {
          const translated = data.translations[idx];
          if (translated) {
            translationCache[targetLang][orig.trim()] = translated;
          }
        });

        persistCache();
        // Notify subscribers
        listeners.forEach(cb => cb(targetLang));
      }
    } catch (err) {
      console.warn('[Translator] Batch request failed:', err);
    }
  }
}

/**
 * Queue a string for background batch translation
 */
export function queueTranslation(text, targetLang) {
  if (!text || typeof text !== 'string' || !text.trim() || targetLang === 'en') return;
  const trimmed = text.trim();

  // Already cached?
  if (translationCache[targetLang]?.[trimmed]) return;

  if (!pendingQueue.has(targetLang)) {
    pendingQueue.set(targetLang, new Set());
  }
  pendingQueue.get(targetLang).add(trimmed);

  if (!queueTimer) {
    queueTimer = setTimeout(flushQueue, 40);
  }
}

/**
 * Synchronously get translation if cached, or queue it and return original
 */
export function getTranslationSync(text, targetLang) {
  if (!text || typeof text !== 'string') return text;
  if (!targetLang || targetLang === 'en') return text;
  const trimmed = text.trim();

  const cached = translationCache[targetLang]?.[trimmed];
  if (cached) {
    // Preserve leading/trailing whitespace if any
    const leading = text.match(/^\s*/)[0];
    const trailing = text.match(/\s*$/)[0];
    return leading + cached + trailing;
  }

  queueTranslation(trimmed, targetLang);
  return text;
}

/**
 * Async single text translation (resolves when translated)
 */
export async function translateTextAsync(text, targetLang) {
  if (!text || typeof text !== 'string' || targetLang === 'en') return text;
  const trimmed = text.trim();

  if (translationCache[targetLang]?.[trimmed]) {
    return translationCache[targetLang][trimmed];
  }

  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: trimmed, targetLang })
    });
    const data = await res.json();
    if (data && data.success && data.translation) {
      if (!translationCache[targetLang]) translationCache[targetLang] = {};
      translationCache[targetLang][trimmed] = data.translation;
      persistCache();
      return data.translation;
    }
    return text;
  } catch {
    return text;
  }
}

/**
 * Real-time dynamic translation for arbitrary objects or arrays
 * (e.g. real-time AI itinerary results, hotel lists, safety data)
 */
export async function translateRealtimeData(data, targetLang) {
  if (!data || targetLang === 'en') return data;

  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data, targetLang })
    });
    const result = await res.json();
    if (result && result.success && result.data) {
      return result.data;
    }
    return data;
  } catch (err) {
    console.warn('[Translator] Realtime data translation warning:', err);
    return data;
  }
}

// ─────────────────────────────────────────────────────────────
// DOM LIVE TRANSLATOR ENGINE
// Automatically translates all text nodes rendered into the DOM,
// without mutating React element hierarchies or triggering removeChild crashes.
// ─────────────────────────────────────────────────────────────

let currentDomLang = 'en';
let domObserver = null;
let isTranslatingDom = false;

// Tags to strictly ignore during DOM translation
const IGNORED_TAGS = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'CODE', 'PRE', 'NOSCRIPT', 'SVG', 'PATH']);

function isNodeTranslatable(node) {
  if (!node || node.nodeType !== Node.TEXT_NODE) return false;
  const parent = node.parentElement;
  if (!parent) return false;

  if (IGNORED_TAGS.has(parent.tagName)) return false;
  if (parent.closest('.notranslate') || parent.closest('[data-no-translate="true"]')) return false;

  const val = node.nodeValue;
  if (!val) return false;
  const trimmed = val.trim();
  if (trimmed.length < 2) return false;
  // Ignore pure numbers, prices (e.g. ₹3,200), pure symbols, dates/times
  if (/^[\d\s,.:;₹$%&*+\-–—/()#@!?"'’]+$/.test(trimmed)) return false;

  return true;
}

function processTextNode(node, targetLang) {
  if (!isNodeTranslatable(node)) return;

  // Remember original English text
  if (typeof node.__lukOriginal === 'undefined') {
    node.__lukOriginal = node.nodeValue;
  }

  const orig = node.__lukOriginal;
  if (!orig) return;
  const trimmedOrig = orig.trim();

  // If target is English, restore original
  if (targetLang === 'en') {
    if (node.nodeValue !== orig) {
      node.nodeValue = orig;
    }
    node.__lukLang = 'en';
    return;
  }

  // If already translated to this language, skip
  if (node.__lukLang === targetLang) return;

  // Check cache
  const cached = translationCache[targetLang]?.[trimmedOrig];
  if (cached) {
    const leading = orig.match(/^\s*/)[0];
    const trailing = orig.match(/\s*$/)[0];
    node.nodeValue = leading + cached + trailing;
    node.__lukLang = targetLang;
  } else {
    // Queue for translation
    queueTranslation(trimmedOrig, targetLang);
  }
}

function scanAndTranslateTree(root, targetLang) {
  if (!root || !root.ownerDocument) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
  let textNode = walker.nextNode();
  while (textNode) {
    processTextNode(textNode, targetLang);
    textNode = walker.nextNode();
  }
}

/**
 * Start or update the DOM Live Translator for a target language
 */
export function setDomTranslatorLanguage(targetLang) {
  currentDomLang = targetLang || 'en';

  const rootEl = document.getElementById('root') || document.body;

  // Pause observer while making updates
  if (domObserver) {
    domObserver.disconnect();
  }

  isTranslatingDom = true;
  scanAndTranslateTree(rootEl, currentDomLang);
  isTranslatingDom = false;

  // Setup MutationObserver to automatically catch new dynamic content & text updates
  if (!domObserver) {
    domObserver = new MutationObserver((mutations) => {
      if (isTranslatingDom || currentDomLang === 'en') return;

      isTranslatingDom = true;
      for (const m of mutations) {
        if (m.type === 'childList') {
          m.addedNodes.forEach((added) => {
            if (added.nodeType === Node.TEXT_NODE) {
              processTextNode(added, currentDomLang);
            } else if (added.nodeType === Node.ELEMENT_NODE) {
              scanAndTranslateTree(added, currentDomLang);
            }
          });
        } else if (m.type === 'characterData') {
          const targetNode = m.target;
          if (targetNode && targetNode.nodeType === Node.TEXT_NODE && targetNode.__lukLang !== currentDomLang) {
            targetNode.__lukOriginal = targetNode.nodeValue;
            processTextNode(targetNode, currentDomLang);
          }
        }
      }
      isTranslatingDom = false;
    });
  }

  domObserver.observe(rootEl, {
    childList: true,
    subtree: true,
    characterData: true
  });

  // Follow-up scans to capture any deferred or asynchronous component mounts
  if (currentDomLang !== 'en') {
    setTimeout(() => {
      if (currentDomLang !== 'en') {
        isTranslatingDom = true;
        scanAndTranslateTree(rootEl, currentDomLang);
        isTranslatingDom = false;
      }
    }, 150);

    setTimeout(() => {
      if (currentDomLang !== 'en') {
        isTranslatingDom = true;
        scanAndTranslateTree(rootEl, currentDomLang);
        isTranslatingDom = false;
      }
    }, 450);
  }
}

// When new batch translations arrive from the server, update pending nodes in the DOM
onTranslationsUpdated((lang) => {
  if (lang === currentDomLang && currentDomLang !== 'en') {
    const rootEl = document.getElementById('root') || document.body;
    if (domObserver) domObserver.disconnect();
    isTranslatingDom = true;
    scanAndTranslateTree(rootEl, currentDomLang);
    isTranslatingDom = false;
    if (domObserver) {
      domObserver.observe(rootEl, { childList: true, subtree: true, characterData: true });
    }
  }
});

