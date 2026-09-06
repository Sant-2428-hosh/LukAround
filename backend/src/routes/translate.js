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

/**
 * Fetch translation from Google Mobile Web Translation Engine (High reliability, zero 429 rate limits)
 */
async function fetchGoogleTranslate(query, targetLang) {
  const url = `https://translate.google.com/m?sl=auto&tl=${encodeURIComponent(targetLang)}&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    }
  });

  if (!res.ok) {
    throw new Error(`Google translate returned status ${res.status}`);
  }

  const html = await res.text();
  const match = html.match(/<div class="result-container">(.*?)<\/div>/s);
  if (match && match[1]) {
    return unescapeHtml(match[1].trim());
  }
  throw new Error('Could not parse result-container from response');
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
    const translated = await fetchGoogleTranslate(trimmed, targetLang);
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

  if (uncachedTexts.length === 1) {
    const tr = await translateSingle(uncachedTexts[0], targetLang);
    results[uncachedIndices[0]] = tr;
    return results;
  }

  // Batch translate multiple uncached texts
  try {
    const joined = uncachedTexts.join(DELIMITER);
    const full = await fetchGoogleTranslate(joined, targetLang);
    const split = full.split(/\[\[LUK_SPLIT\]\]/i).map(s => s.trim());

    if (split.length === uncachedTexts.length) {
      for (let k = 0; k < split.length; k++) {
        const original = uncachedTexts[k];
        const translated = split[k] || original;
        translationCache.set(`${targetLang}:${original.trim()}`, translated);
        results[uncachedIndices[k]] = translated;
      }
      return results;
    }
  } catch (err) {
    console.warn(`[Translate Error] Batch into ${targetLang} failed, translating individually:`, err.message);
  }

  // Fallback to translating individual items
  for (let m = 0; m < uncachedTexts.length; m++) {
    const original = uncachedTexts[m];
    const tr = await translateSingle(original, targetLang);
    results[uncachedIndices[m]] = tr;
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
