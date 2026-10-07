import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Compass } from 'lucide-react';

const DEFAULT_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1920&q=85',
    tagline: 'Imperial Rajasthan',
    headline: 'Discover the Timeless Grandeur of Jaipur',
    subtext: 'Walk through pink sandstone palaces, starlit hill forts, and vibrant bazaars with expert local itineraries.',
    ctaText: 'Explore Jaipur',
    ctaLink: '#smart-itinerary'
  },
  {
    image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1920&q=85',
    tagline: 'Kerala Western Ghats',
    headline: 'Breathe in the Misty Emerald Slopes of Munnar',
    subtext: 'Endless rolling tea plantations, rare Nilgiri Tahr sanctuaries, and cloud-draped mountain peaks.',
    ctaText: 'Discover Munnar',
    ctaLink: '#smart-itinerary'
  },
  {
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1920&q=85',
    tagline: 'Sacred Ganga Aarti',
    headline: 'Experience the Spiritual Awakening of Varanasi',
    subtext: 'Ancient stone river ghats, evening brass lamp ceremonies, and timeless spiritual heritage.',
    ctaText: 'Plan Varanasi Trip',
    ctaLink: '#smart-itinerary'
  },
  {
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1920&q=85',
    tagline: 'Sunlit Coastal Breeze',
    headline: 'Unwind Along the Golden Shores of Goa',
    subtext: 'Portuguese colonial architecture, serene palm-fringed coastlines, and fresh seaside culinary journeys.',
    ctaText: 'Explore Goa Stays',
    ctaLink: '#hotels'
  }
];

export default function HeroSlider({
  slides = DEFAULT_SLIDES,
  autoPlayInterval = 7500,
  onSelectSlide
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [touchOffset, setTouchOffset] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchCurrentX = useRef(0);
  const touchCurrentY = useRef(0);
  const isSwiping = useRef(false);

  const totalSlides = slides.length;
  const currentSlide = slides[currentIndex] || slides[0];

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // ── Autoplay Timer ──
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    const timer = setInterval(() => {
      handleNext();
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [handleNext, isPaused, autoPlayInterval, totalSlides]);

  // ── Keyboard Navigation (Arrow Keys) ──
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // ── Mobile Touch Gesture Handling (Swipe Left / Swipe Right) ──
  const handleTouchStart = (e) => {
    if (!e.touches || !e.touches[0]) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchCurrentX.current = e.touches[0].clientX;
    touchCurrentY.current = e.touches[0].clientY;
    isSwiping.current = true;
    setIsPaused(true);
  };

  const handleTouchMove = (e) => {
    if (!isSwiping.current || !e.touches || !e.touches[0]) return;
    touchCurrentX.current = e.touches[0].clientX;
    touchCurrentY.current = e.touches[0].clientY;

    const diffX = touchCurrentX.current - touchStartX.current;
    const diffY = touchCurrentY.current - touchStartY.current;

    // Only apply visual drag if horizontal movement is dominant
    if (Math.abs(diffX) > Math.abs(diffY)) {
      setTouchOffset(diffX);
    }
  };

  const handleTouchEnd = () => {
    if (!isSwiping.current) return;
    isSwiping.current = false;
    setIsPaused(false);

    const diffX = touchCurrentX.current - touchStartX.current;
    const diffY = touchCurrentY.current - touchStartY.current;
    setTouchOffset(0);

    // If horizontal swipe exceeds threshold and is greater than vertical movement
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX < 0) {
        handleNext(); // Swiped left -> next destination
      } else {
        handlePrev(); // Swiped right -> previous destination
      }
    }
  };

  return (
    <section
      aria-label="Featured Travel Destinations Hero Slider"
      className="hero-slider-root"
      style={{
        position: 'relative',
        width: '100%',
        height: '80vh',
        minHeight: '560px',
        maxHeight: '780px',
        overflow: 'hidden',
        backgroundColor: '#111114',
        color: '#FFFFFF',
        userSelect: 'none',
        touchAction: 'pan-y'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* ── 1. BACKGROUND PHOTO WITH KEN BURNS & GRADIENT OVERLAY ── */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            transform: touchOffset ? `translateX(${touchOffset * 0.15}px)` : 'none',
            transition: isSwiping.current ? 'none' : 'transform 0.3s ease-out'
          }}
        >
          <motion.div
            animate={
              shouldReduceMotion
                ? { scale: 1 }
                : { scale: [1, 1.08] }
            }
            transition={{
              duration: 18,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut'
            }}
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              backgroundImage: `url(${currentSlide.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />

          {/* Unified Consistent Gradient Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.65) 100%)',
              pointerEvents: 'none'
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── 2. HERO CONTENT CONTAINER ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          height: '100%',
          maxWidth: '850px',
          margin: '0 auto',
          padding: '0 1.5rem',
          pointerEvents: 'none',
          transform: touchOffset ? `translateX(${touchOffset * 0.35}px)` : 'none',
          transition: isSwiping.current ? 'none' : 'transform 0.25s ease-out'
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${currentIndex}`}
            initial={{
              opacity: 0,
              x: shouldReduceMotion ? 0 : (direction > 0 ? 30 : -30),
              y: shouldReduceMotion ? 0 : 15
            }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{
              opacity: 0,
              x: shouldReduceMotion ? 0 : (direction > 0 ? -30 : 30),
              y: -10,
              transition: { duration: 0.25 }
            }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
          >
            {/* Tagline / Eyebrow Badge */}
            {currentSlide.tagline && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.35rem 0.95rem',
                  borderRadius: 'var(--radius-badge, 999px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.16)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  marginBottom: '1.25rem',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
                }}
              >
                <Compass size={14} style={{ color: '#FFFFFF' }} />
                <span>{currentSlide.tagline}</span>
              </div>
            )}

            {/* Headline */}
            <h1
              style={{
                fontFamily: 'var(--font-display, inherit)',
                fontSize: 'clamp(2rem, 5.2vw, 3.5rem)',
                fontWeight: 700,
                lineHeight: 1.18,
                letterSpacing: '-0.02em',
                color: '#FFFFFF',
                textShadow: '0 2px 12px rgba(0,0,0,0.5)',
                marginBottom: '1rem',
                maxWidth: '750px'
              }}
            >
              {currentSlide.headline}
            </h1>

            {/* Subtext */}
            <p
              style={{
                fontFamily: 'var(--font-body, inherit)',
                fontSize: 'clamp(0.92rem, 2vw, 1.1rem)',
                fontWeight: 400,
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.92)',
                maxWidth: '600px',
                marginBottom: '2rem',
                textShadow: '0 1px 6px rgba(0,0,0,0.4)'
              }}
            >
              {currentSlide.subtext}
            </p>

            {/* CTA Button */}
            <div style={{ pointerEvents: 'auto' }}>
              <a
                href={currentSlide.ctaLink || '#smart-itinerary'}
                onClick={() => onSelectSlide && onSelectSlide(currentSlide.tagline?.split(' ')[0] || 'Jaipur')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.55rem',
                  padding: '0.85rem 2.2rem',
                  borderRadius: 'var(--radius-btn, 12px)',
                  backgroundColor: 'var(--color-primary, #C0293C)',
                  color: '#FFFFFF',
                  fontSize: '0.96rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  boxShadow: '0 4px 18px rgba(192, 41, 60, 0.45)',
                  transition: 'background-color 0.2s, transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-dark, #9E1F30)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(122, 22, 38, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary, #C0293C)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 18px rgba(192, 41, 60, 0.45)';
                }}
              >
                <span>{currentSlide.ctaText || 'Explore Destinations'}</span>
                <ChevronRight size={18} />
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── 3. DESKTOP-ONLY SUBTLE EDGE CHEVRONS (Completely Hidden on Mobile) ── */}
      <button
        type="button"
        className="hero-desktop-arrow hero-desktop-arrow--prev"
        onClick={handlePrev}
        aria-label="Previous Slide"
        title="Previous destination (or swipe left/right)"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        type="button"
        className="hero-desktop-arrow hero-desktop-arrow--next"
        onClick={handleNext}
        aria-label="Next Slide"
        title="Next destination (or swipe left/right)"
      >
        <ChevronRight size={24} />
      </button>
    </section>
  );
}
