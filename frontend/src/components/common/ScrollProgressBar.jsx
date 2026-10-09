import React, { useState, useEffect } from 'react';

/**
 * Global Top Scroll Progress Bar
 * Provides active visual scroll progress across every section of the website.
 */
export default function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (scrollHeight > 0) {
        const progress = (window.scrollY / scrollHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${scrollProgress}%`,
        height: '3.5px',
        background: 'linear-gradient(90deg, #E11D48 0%, #F59E0B 45%, #10B981 100%)',
        zIndex: 99999,
        transition: 'width 0.08s ease-out',
        boxShadow: '0 0 10px rgba(225, 29, 72, 0.45)',
        pointerEvents: 'none'
      }}
      aria-hidden="true"
    />
  );
}
