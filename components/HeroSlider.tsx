'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Compass } from 'lucide-react';

export interface Slide {
  image: string;
  headline: string;
  subtext: string;
  ctaText?: string;
  ctaLink?: string;
  tagline?: string;
}

export interface HeroSliderProps {
  slides?: Slide[];
  autoPlayInterval?: number;
}

const DEFAULT_SLIDES: Slide[] = [
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
  autoPlayInterval = 7500
}: HeroSliderProps) {
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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  return (
    <section
      aria-label="Featured Travel Destinations Hero Slider"
      className="relative w-full h-[80vh] min-h-[560px] max-h-[780px] overflow-hidden bg-[#111114] text-white select-none"
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
          className="absolute inset-0 z-0"
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
            className="relative w-full h-full will-change-transform"
          >
            <Image
              src={currentSlide.image}
              alt={currentSlide.headline}
              fill
              priority={currentIndex === 0}
              quality={90}
              sizes="100vw"
              className="object-cover object-center"
            />
          </motion.div>

          {/* Unified Consistent Gradient Overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.35))' }}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── 2. HERO CONTENT CONTAINER (ONE CLEAR VISUAL HIERARCHY) ── */}
      <div className="relative z-10 flex flex-col justify-center items-center text-center h-full max-w-[850px] mx-auto px-6 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${currentIndex}`}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15, transition: { duration: 0.25 } }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            {/* 1. One Eyebrow / Badge Label */}
            {currentSlide.tagline && (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-[8px] bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-bold tracking-wider uppercase mb-5 shadow-sm">
                <Compass size={13} className="text-white" />
                <span>{currentSlide.tagline}</span>
              </div>
            )}

            {/* 2. One Headline (One Font Weight: Bold, One Size) */}
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.18] text-white drop-shadow-md mb-4 max-w-[750px]">
              {currentSlide.headline}
            </h1>

            {/* 3. One Subtext Line (Lighter Weight, Smaller, max-width ~600px) */}
            <p className="text-sm sm:text-base md:text-lg font-normal text-white/90 max-w-[600px] leading-relaxed mb-8 drop-shadow">
              {currentSlide.subtext}
            </p>

            {/* 4. One CTA Button (--color-primary background, White text, 8px radius) */}
            <div className="pointer-events-auto">
              <Link
                href={currentSlide.ctaLink || '#destinations'}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-[8px] bg-[#C0293C] hover:bg-[#7A1626] text-white text-base font-semibold tracking-wide transition-all duration-200 shadow-md hover:-translate-y-0.5 hover:shadow-lg"
              >
                <span>{currentSlide.ctaText || 'Explore Destinations'}</span>
                <ChevronRight size={17} />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── 3. NAVIGATION ARROWS ── */}
      <div className="absolute top-1/2 -translate-y-1/2 left-6 z-20">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105"
        >
          <ChevronLeft size={22} />
        </button>
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 right-6 z-20">
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Slide"
          className="w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* ── 4. SLIDE DOT INDICATORS ── */}
      <div className="absolute bottom-8 inset-x-0 z-20 flex justify-center items-center gap-2.5">
        {slides.map((_, idx) => {
          const isActive = idx === currentIndex;
          return (
            <button
              key={`dot-${idx}`}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer shadow-sm ${
                isActive
                  ? 'w-7 bg-[#C0293C]'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          );
        })}
      </div>
    </section>
  );
}
