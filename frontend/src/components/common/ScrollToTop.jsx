import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Universal ScrollToTop Component
 *
 * Listens to every navigation / route change in React Router and immediately
 * resets the scroll position to the top of the viewport (0, 0).
 *
 * Ensures all CTA buttons ("Explore More", cards, navigation links, etc.)
 * load the destination page cleanly from the very top instead of retaining
 * the prior page's scroll position.
 */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // If navigating to an in-page anchor hash (e.g., #attractions), scroll to that element
    if (hash) {
      const targetElement = document.querySelector(hash);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }

    // Reset window and document scroll position instantly to the top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });

    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }
  }, [pathname, search, hash]);

  return null;
}
