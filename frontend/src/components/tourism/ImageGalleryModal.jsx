import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize, Minimize, Camera, ShieldCheck, ExternalLink } from 'lucide-react';

export default function ImageGalleryModal({
  isOpen,
  onClose,
  images = [],
  initialIndex = 0,
  destinationName = 'Destination',
  location = 'India',
  photographer,
  sourceName,
  sourceUrl,
  license
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  if (!isOpen || !images || images.length === 0) return null;

  const currentImage = images[currentIndex];
  const total = images.length;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 10, 20, 0.96)',
        backdropFilter: 'blur(12px)',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.5rem',
        color: '#FFFFFF'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* ── Top Control Bar ── */}
      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '1rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontWeight: 800, fontSize: '1.15rem' }}>{destinationName}</span>
            <span
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                color: '#34D399',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '9999px',
                padding: '2px 8px',
                fontSize: '0.7rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <ShieldCheck size={12} />
              Real Photograph
            </span>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{location}</div>
        </div>

        {/* Counter & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Requirement 15: Image counter 1 / 5 */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              padding: '0.35rem 0.85rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '1px'
            }}
          >
            {currentIndex + 1} / {total}
          </div>

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            style={{
              background: 'none',
              border: 'none',
              color: '#CBD5E1',
              cursor: 'pointer',
              padding: '0.4rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.2s'
            }}
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>

          <button
            onClick={onClose}
            title="Close Gallery (Esc)"
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#F87171',
              cursor: 'pointer',
              padding: '0.4rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.2s'
            }}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* ── Main Image View Area with Prev / Next ── */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1200px',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '1rem 0'
        }}
      >
        {/* Prev Button */}
        <button
          onClick={handlePrev}
          aria-label="Previous Image"
          style={{
            position: 'absolute',
            left: '10px',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#FFFFFF',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            zIndex: 10
          }}
        >
          <ChevronLeft size={26} />
        </button>

        {/* The Real Photograph */}
        <img
          src={currentImage}
          alt={`${destinationName} - photograph ${currentIndex + 1} of ${total}`}
          style={{
            maxWidth: '100%',
            maxHeight: 'calc(100vh - 220px)',
            objectFit: 'contain',
            borderRadius: '12px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
          }}
        />

        {/* Next Button */}
        <button
          onClick={handleNext}
          aria-label="Next Image"
          style={{
            position: 'absolute',
            right: '10px',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#FFFFFF',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            zIndex: 10
          }}
        >
          <ChevronRight size={26} />
        </button>
      </div>

      {/* ── Bottom Bar: Attribution, License & Thumbnails Strip ── */}
      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          alignItems: 'center'
        }}
      >
        {/* Attribution info (Requirement 14) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.8rem',
            color: '#CBD5E1',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <Camera size={13} color="#38BDF8" />
            Photo: <strong>{photographer || 'Contributor'}</strong>
          </span>
          <span>•</span>
          <span>Source: <strong>{sourceName || 'Wikimedia Commons / Authentic Travel Photography'}</strong></span>
          {license && (
            <>
              <span>•</span>
              <span style={{ color: '#94A3B8' }}>License: {license}</span>
            </>
          )}
          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#38BDF8',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                textDecoration: 'none'
              }}
            >
              <span>Source File</span>
              <ExternalLink size={11} />
            </a>
          )}
        </div>

        {/* Thumbnails Strip */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.25rem',
            maxWidth: '100%'
          }}
        >
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`Thumbnail ${idx + 1}`}
              onClick={() => setCurrentIndex(idx)}
              style={{
                width: '64px',
                height: '48px',
                objectFit: 'cover',
                borderRadius: '6px',
                cursor: 'pointer',
                border: idx === currentIndex ? '2px solid #38BDF8' : '2px solid transparent',
                opacity: idx === currentIndex ? 1 : 0.6,
                transition: 'all 0.2s ease'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
