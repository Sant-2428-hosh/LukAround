import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronDown, Compass } from 'lucide-react';

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
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const totalSlides = slides.length;
  const currentSlide = slides[currentIndex] || slides[0];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;
    const timer = setInterval(() => {
      handleNext();
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [handleNext, isPaused, autoPlayInterval, totalSlides]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  return (
    <section
      aria-label="Featured Travel Destinations Hero Slider"
      style={{
        position: 'relative',
        width: '100%',
        height: '80vh',
        minHeight: '560px',
        maxHeight: '780px',
        overflow: 'hidden',
        backgroundColor: '#111114',
        color: '#FFFFFF',
        userSelect: 'none'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── 1. BACKGROUND PHOTO WITH KEN BURNS & GRADIENT OVERLAY ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{ position: 'absolute', inset: 0, zIndex: 0 }}
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
              background: 'linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.35))',
              pointerEvents: 'none'
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── 2. HERO CONTENT CONTAINER (ONE CLEAR VISUAL HIERARCHY) ── */}
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
          pointerEvents: 'none'
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${currentIndex}`}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15, transition: { duration: 0.25 } }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            {/* 1. One Eyebrow / Badge Label */}
            {currentSlide.tagline && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.3rem 0.8rem',
                  borderRadius: 'var(--radius-badge)',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  marginBottom: '1.25rem',
                  boxShadow: 'var(--shadow-rest)'
                }}
              >
                <Compass size={13} style={{ color: '#FFFFFF' }} />
                <span>{currentSlide.tagline}</span>
              </div>
            )}

            {/* 2. One Headline (One Font Weight: Bold, One Size) */}
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 700,
                lineHeight: 1.18,
                letterSpacing: '-0.02em',
                color: '#FFFFFF',
                textShadow: '0 2px 10px rgba(0,0,0,0.4)',
                marginBottom: '1rem',
                maxWidth: '750px'
              }}
            >
              {currentSlide.headline}
            </h1>

            {/* 3. One Subtext Line (Lighter Weight, Smaller, max-width ~600px) */}
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
                fontWeight: 400,
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.9)',
                maxWidth: '600px',
                marginBottom: '2rem',
                textShadow: '0 1px 4px rgba(0,0,0,0.3)'
              }}
            >
              {currentSlide.subtext}
            </p>

            {/* 4. One CTA Button (--color-primary background, White text, 8px radius) */}
            <div style={{ pointerEvents: 'auto' }}>
              <a
                href={currentSlide.ctaLink || '#smart-itinerary'}
                onClick={() => onSelectSlide && onSelectSlide(currentSlide.tagline?.split(' ')[0] || 'Jaipur')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.85rem 2rem',
                  borderRadius: 'var(--radius-btn)',
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(192, 41, 60, 0.4)',
                  transition: 'background-color 0.2s, transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(122, 22, 38, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(192, 41, 60, 0.4)';
                }}
              >
                <span>{currentSlide.ctaText || 'Explore Destinations'}</span>
                <ChevronRight size={17} />
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── 3. NAVIGATION ARROWS ── */}
      <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '1.5rem', zIndex: 20 }}>
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Slide"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-rest)',
            transition: 'background-color 0.2s, transform 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.7)';
            e.currentTarget.style.transform = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.4)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <ChevronLeft size={22} />
        </button>
      </div>

      <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '1.5rem', zIndex: 20 }}>
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Slide"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-rest)',
            transition: 'background-color 0.2s, transform 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.7)';
            e.currentTarget.style.transform = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.4)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* ── 4. SLIDE DOT INDICATORS ── */}
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: 0,
          right: 0,
          zIndex: 20,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.6rem'
        }}
      >
        {slides.map((_, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={`dot-${idx}`}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              style={{
                height: '8px',
                width: isActive ? '28px' : '8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: isActive ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.4)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: 'var(--shadow-rest)'
              }}
            />
          );
        })}
      </div>
    </section>
  );
}
