const express = require('express');
const router = express.Router();

// In-memory cache to prevent duplicate external requests: Map<`${lang}:${text}`, string>
const translationCache = new Map();

const DELIMITER = ' \n[[LUK_SPLIT]]\n ';
const CHUNK_SIZE = 15; // Safe chunk size for web URL parameters

const USER_AGENT = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1';

function unescapeHtml(text) {
  if (!text || typeof text !== 'string') return text;
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

async function fetchTranslation(query, targetLang) {
  if (!query || typeof query !== 'string' || !targetLang || targetLang === 'en') return query;
  const trimmed = query.trim();

  // 1. Primary Engine: Google dict-chrome-ex client (Extremely reliable, high speed, no 429)
  try {
    const chromeUrl = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=auto&tl=${encodeURIComponent(targetLang)}&q=${encodeURIComponent(trimmed)}`;
    const res = await fetch(chromeUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data[0]) {
        const text = typeof data[0] === 'string' ? data[0] : (data[0][0] || '');
        if (text) return unescapeHtml(text.trim());
      } else if (typeof data === 'string' && data) {
        return unescapeHtml(data.trim());
      }
    }
  } catch (err) {
    // Continue to fallback
  }

  // 2. Secondary Engine: MyMemory API (if quota is available)
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=en|${encodeURIComponent(targetLang)}`;
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    if (res.ok) {
      const data = await res.json();
      const txt = data?.responseData?.translatedText;
      if (txt && !txt.startsWith('MYMEMORY WARNING')) {
        return unescapeHtml(txt.trim());
      }
    }
  } catch (err) {
    // Continue to fallback
  }

  // 3. Fallback: Google GTX endpoint
  try {
    const gtxUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(trimmed)}`;
    const res = await fetch(gtxUrl);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const full = data[0].map(item => item[0]).join('');
        if (full) return unescapeHtml(full.trim());
      }
    }
  } catch (err) {
    // Continue
  }

  return trimmed;
}

/**
 * Translates a single text string
 */
async function translateSingle(text, targetLang) {
  if (!text || typeof text !== 'string') return text;
  const trimmed = text.trim();
  if (!trimmed || !targetLang || targetLang === 'en') return text;

  const cacheKey = `${targetLang}:${trimmed}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  try {
    const translated = await fetchTranslation(trimmed, targetLang);
    if (translated) {
      translationCache.set(cacheKey, translated);
      return translated;
    }
  } catch (err) {
    console.warn(`[Translate Error] single "${trimmed.slice(0, 30)}..." into ${targetLang}:`, err.message);
  }

  return text;
}

/**
 * Translates a chunk of texts using delimiter
 */
async function translateChunk(texts, targetLang) {
  if (!texts || texts.length === 0) return [];
  if (targetLang === 'en') return texts;

  const results = new Array(texts.length);
  const uncachedIndices = [];
  const uncachedTexts = [];

  for (let i = 0; i < texts.length; i++) {
    const item = texts[i];
    if (typeof item !== 'string' || !item.trim()) {
      results[i] = item;
      continue;
    }
    const cacheKey = `${targetLang}:${item.trim()}`;
    if (translationCache.has(cacheKey)) {
      results[i] = translationCache.get(cacheKey);
    } else {
      uncachedIndices.push(i);
      uncachedTexts.push(item);
    }
  }

  if (uncachedTexts.length === 0) {
    return results;
  }

  // Translate all uncached items in parallel
  const translatedItems = await Promise.all(
    uncachedTexts.map(t => translateSingle(t, targetLang))
  );

  for (let k = 0; k < uncachedIndices.length; k++) {
    results[uncachedIndices[k]] = translatedItems[k];
  }

  return results;
}

/**
 * Translates an arbitrary array of texts by chunking
 */
async function translateBatch(texts, targetLang) {
  if (!Array.isArray(texts)) return [];
  if (targetLang === 'en' || texts.length === 0) return texts;

  const results = [];
  for (let i = 0; i < texts.length; i += CHUNK_SIZE) {
    const chunk = texts.slice(i, i + CHUNK_SIZE);
    const chunkResults = await translateChunk(chunk, targetLang);
    results.push(...chunkResults);
  }
  return results;
}

/**
 * Recursively translates text values in an arbitrary JSON object/array
 */
async function translateDeep(obj, targetLang, ignoredKeys = ['id', 'lat', 'lng', 'latitude', 'longitude', 'place_id', 'imageUrl', 'avatar', 'token', 'role', 'status', 'email']) {
  if (!obj || targetLang === 'en') return obj;

  if (typeof obj === 'string') {
    return await translateSingle(obj, targetLang);
  }

  if (Array.isArray(obj)) {
    return await Promise.all(obj.map(item => translateDeep(item, targetLang, ignoredKeys)));
  }

  if (typeof obj === 'object') {
    const clone = { ...obj };
    for (const key of Object.keys(clone)) {
      if (ignoredKeys.includes(key)) continue;
      if (typeof clone[key] === 'string' && clone[key].length > 1) {
        clone[key] = await translateSingle(clone[key], targetLang);
      } else if (typeof clone[key] === 'object' && clone[key] !== null) {
        clone[key] = await translateDeep(clone[key], targetLang, ignoredKeys);
      }
    }
    return clone;
  }

  return obj;
}

/**
 * POST /api/translate
 * Translates any real-time data or strings dynamically
 */
router.post('/', async (req, res) => {
  try {
    const { text, texts, data, targetLang } = req.body;
    const lang = targetLang || 'en';

    if (lang === 'en') {
      if (texts) return res.json({ success: true, translations: texts });
      if (data) return res.json({ success: true, data });
      return res.json({ success: true, translation: text || '' });
    }

    if (Array.isArray(texts)) {
      const translations = await translateBatch(texts, lang);
      return res.json({ success: true, translations });
    }

    if (typeof text === 'string') {
      const translation = await translateSingle(text, lang);
      return res.json({ success: true, translation });
    }

    if (data && typeof data === 'object') {
      const translatedData = await translateDeep(data, lang);
      return res.json({ success: true, data: translatedData });
    }

    return res.status(400).json({ error: 'Provide text, texts array, or data object' });
  } catch (err) {
    return res.status(500).json({ error: 'Translation failed', details: err.message });
  }
});

module.exports = router;
