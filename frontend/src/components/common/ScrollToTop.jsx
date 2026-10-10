import { useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// In-memory cache of scroll positions for fast synchronous retrieval
const scrollRegistry = new Map();
const SESSION_STORAGE_KEY = 'lukaround_scroll_positions_v1';
const LAST_CLICKED_KEY = 'lukaround_last_visited_card_v1';

/**
 * Public helper: call when a user clicks on an attraction, city, category, or place card.
 * Records the card ID and exact scroll position so the user returns to this exact place.
 */
export function recordCardClick(itemId) {
  try {
    if (itemId && typeof window !== 'undefined') {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      const data = {
        id: String(itemId),
        time: Date.now(),
        path: window.location.pathname + window.location.search,
        y: scrollY
      };
      sessionStorage.setItem(LAST_CLICKED_KEY, JSON.stringify(data));
      // Also cache in memory registry
      scrollRegistry.set(data.path, { x: 0, y: scrollY, timestamp: Date.now() });
    }
  } catch (e) {
    // Graceful fallback if storage disabled
  }
}

/**
 * Universal Scroll Restoration & Management Component
 *
 * 1. For Back/Forward (POP navigation) or returning to listing/category pages:
 *    Restores the user's exact scroll position and brings the place they left off right into view.
 * 2. For fresh link clicks (PUSH navigation) to new destinations:
 *    Scrolls to the top (0, 0) cleanly.
 * 3. For anchor links (#section):
 *    Smoothly scrolls to the targeted element.
 */
export default function ScrollToTop() {
  const location = useLocation();
  const navigationType = useNavigationType(); // 'POP' | 'PUSH' | 'REPLACE'
  const isRestoringRef = useRef(false);
  const prevPathRef = useRef(location.pathname + location.search);
  const prevKeyRef = useRef(location.key);

  // Set browser native scrollRestoration to manual so it doesn't fight React rendering
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Continuously record scroll position on the active page
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (isRestoringRef.current) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
          const currentX = window.scrollX || window.pageXOffset || 0;
          const currentUrl = location.pathname + location.search;
          const entry = { x: currentX, y: currentY, timestamp: Date.now() };

          if (location.key) {
            scrollRegistry.set(location.key, entry);
          }
          scrollRegistry.set(currentUrl, entry);

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.key, location.pathname, location.search]);

  // Handle route navigation: Restore exact scroll or scroll to top
  useEffect(() => {
    const currentUrl = location.pathname + location.search;
    const currentKey = location.key;

    // 1. If in-page anchor hash is specified (e.g. #categories), scroll to target element
    if (location.hash) {
      const targetElement = document.querySelector(location.hash);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
        prevPathRef.current = currentUrl;
        prevKeyRef.current = currentKey;
        return;
      }
    }

    const isPop = navigationType === 'POP';

    // Retrieve saved position for this route from memory registry
    let savedPos = null;
    if (currentKey && scrollRegistry.has(currentKey)) {
      savedPos = scrollRegistry.get(currentKey);
    } else if (scrollRegistry.has(currentUrl)) {
      savedPos = scrollRegistry.get(currentUrl);
    }

    // Check if the user previously clicked a card from this page
    let lastClicked = null;
    try {
      const raw = sessionStorage.getItem(LAST_CLICKED_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Valid if clicked within 2 hours and matches this listing path
        if (parsed && (Date.now() - parsed.time < 7200000) && parsed.path === currentUrl) {
          lastClicked = parsed;
        }
      }
    } catch (e) {}

    const shouldRestore = isPop || Boolean(lastClicked && prevPathRef.current !== currentUrl);

    if (shouldRestore && (savedPos || lastClicked)) {
      const targetY = (savedPos && typeof savedPos.y === 'number')
        ? savedPos.y
        : (lastClicked ? lastClicked.y : 0);

      const targetId = lastClicked ? lastClicked.id : null;

      isRestoringRef.current = true;

      // Apply immediate instant scroll
      window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });

      // Run layout-aware loop to handle dynamic DOM mounting, cards rendering, and image loads
      let frameCount = 0;
      const maxFrames = 20; // Check over ~600-700ms

      const intervalId = setInterval(() => {
        frameCount++;

        // If a specific card was clicked, prioritize ensuring that card is in view
        if (targetId) {
          const cardEl = document.getElementById(`place-${targetId}`) ||
                         document.getElementById(`attraction-${targetId}`) ||
                         document.getElementById(`city-${targetId}`) ||
                         document.getElementById(`category-${targetId}`) ||
                         document.getElementById(`state-${targetId}`) ||
                         document.getElementById(`card-${targetId}`) ||
                         document.querySelector(`[data-place-id="${targetId}"]`);
          if (cardEl) {
            const rect = cardEl.getBoundingClientRect();
            // Check if card is comfortably inside or near viewport
            const isInView = rect.top >= 30 && rect.bottom <= (window.innerHeight + 180);
            if (!isInView) {
              cardEl.scrollIntoView({ block: 'center', behavior: 'instant' });
            }
            if (frameCount >= 6) {
              clearInterval(intervalId);
              isRestoringRef.current = false;
              return;
            }
          }
        }

        const docHeight = Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight
        );

        if (docHeight >= targetY || frameCount >= maxFrames) {
          window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });
          if (Math.abs(window.scrollY - targetY) < 15 || frameCount >= maxFrames) {
            clearInterval(intervalId);
            isRestoringRef.current = false;
          }
        } else {
          window.scrollTo({ top: targetY, left: 0, behavior: 'instant' });
        }
      }, 35);

      prevPathRef.current = currentUrl;
      prevKeyRef.current = currentKey;

      return () => {
        clearInterval(intervalId);
        isRestoringRef.current = false;
      };
    } else {
      // Clean forward navigation (PUSH) to a new place/page: start at the top!
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }

    prevPathRef.current = currentUrl;
    prevKeyRef.current = currentKey;
  }, [location.pathname, location.search, location.hash, location.key, navigationType]);

  return null;
}
