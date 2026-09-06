import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, MapPin, Star, ExternalLink } from 'lucide-react';

export default function ImageLightbox({ image, onClose }) {
  if (!image) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(5, 8, 20, 0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          zIndex: 20000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          cursor: 'zoom-out'
        }}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-card"
          style={{
            maxWidth: '850px',
            width: '100%',
            overflow: 'hidden',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-glow)',
            boxShadow: '0 25px 70px rgba(0, 0, 0, 0.85)',
            background: 'rgba(12, 18, 36, 0.95)',
            cursor: 'default'
          }}
        >
          {/* Lightbox Image Viewport */}
          <div style={{ position: 'relative', width: '100%', maxHeight: '60vh', overflow: 'hidden', background: '#000' }}>
            <img
              src={image.url}
              alt={image.title || 'Tourist attraction'}
              style={{ width: '100%', height: '100%', maxHeight: '60vh', objectFit: 'cover', display: 'block' }}
            />

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(0, 0, 0, 0.65)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={20} />
            </motion.button>
          </div>

          {/* Caption & Metadata Footer */}
          <div style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="badge badge-warning" style={{ marginBottom: '0.35rem', fontSize: '0.75rem' }}>
                {image.category || 'ICONIC SIGHT'}
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>
                {image.title}
              </h3>
              {image.subtitle && (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {image.subtitle}
                </p>
              )}
            </div>

            {image.rating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#FBBF24', fontSize: '0.95rem', fontWeight: 700 }}>
                <Star size={16} fill="#FBBF24" /> {image.rating} Rating
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
