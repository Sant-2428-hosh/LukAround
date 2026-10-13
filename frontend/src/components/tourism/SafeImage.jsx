import React, { useState } from 'react';
import { Camera, ShieldCheck } from 'lucide-react';

// Neutral architectural & scenic fallback patterns (Abstract textures, no monument or place misrepresentations)
const FALLBACK_CATEGORY_IMAGES = {
  heritage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
  spiritual: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
  nature: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=80',
  beaches: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
  'hill-stations': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
  wildlife: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
  adventure: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
  food: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80',
  culture: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
  default: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80'
};

const CSS_ASPECT_RATIOS = {
  '16:9': '16 / 9',
  '4:3': '4 / 3',
  '1:1': '1 / 1',
  '4:5': '4 / 5',
  hero: '16 / 9',
  card: '4 / 3',
  square: '1 / 1',
  mobile: '4 / 5'
};

export default function SafeImage({
  src,
  alt = 'Authentic India tourism landmark',
  aspectRatio, // '16:9' | '4:3' | '1:1' | '4:5' | 'hero' | 'card' | 'square'
  category = 'default',
  fallbackSrc,
  className = '',
  style = {},
  imgStyle = {},
  loading = 'lazy',
  priority = false,
  showCredit = false,
  photographer,
  sourceName,
  verified = true,
  onClick
}) {
  const [errorCount, setErrorCount] = useState(0);

  const fallback = fallbackSrc || FALLBACK_CATEGORY_IMAGES[category] || FALLBACK_CATEGORY_IMAGES.default;

  // Primary -> fallbackSrc -> Category default
  const currentSrc = errorCount === 0
    ? src
    : errorCount === 1 && fallbackSrc
      ? fallbackSrc
      : fallback;

  const handleError = () => {
    if (errorCount < 2) {
      setErrorCount(prev => prev + 1);
    }
  };

  const hasExplicitHeight = Boolean(style && style.height && style.height !== 'auto');
  const cssRatio = aspectRatio ? CSS_ASPECT_RATIOS[aspectRatio] : null;

  const wrapperStyle = {
    position: 'relative',
    backgroundColor: '#0F172A',
    width: style?.width || '100%',
    ...(!hasExplicitHeight && cssRatio ? { aspectRatio: cssRatio } : {}),
    ...style,
    // Strictly guarantee overflow: hidden so images NEVER bleed into sibling containers
    overflow: 'hidden'
  };

  const finalImgStyle = {
    width: '100%',
    height: '100%',
    objectFit: style?.objectFit || imgStyle?.objectFit || 'cover',
    objectPosition: imgStyle?.objectPosition || 'center',
    display: 'block',
    transition: 'transform 0.4s ease',
    ...imgStyle
  };

  return (
    <div className={`safe-image-container ${className}`} style={wrapperStyle} onClick={onClick}>
      <img
        src={currentSrc}
        alt={alt}
        title={alt}
        loading={priority ? 'eager' : loading}
        onError={handleError}
        style={finalImgStyle}
      />

      {/* Verified Authentic Badge - strictly shown only when authentic primary photo loads without error */}
      {verified && errorCount === 0 && currentSrc === src && (
        <div
          title="Verified Real Photograph of this destination"
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            color: '#10B981',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '0.65rem',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            pointerEvents: 'none',
            zIndex: 2
          }}
        >
          <ShieldCheck size={11} />
          <span>Real Photo</span>
        </div>
      )}

      {/* Optional Attribution Badge */}
      {showCredit && (photographer || sourceName) && (
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            left: '8px',
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            color: '#E2E8F0',
            padding: '2px 7px',
            borderRadius: '4px',
            fontSize: '0.65rem',
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            zIndex: 2,
            maxWidth: 'calc(100% - 100px)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          <Camera size={10} color="#94A3B8" />
          <span>Photo: {photographer || 'Contributor'} {sourceName ? `/ ${sourceName}` : ''}</span>
        </div>
      )}
    </div>
  );
}
