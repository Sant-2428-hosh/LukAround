import React, { useState } from 'react';
import { Camera, ShieldCheck } from 'lucide-react';

// Neutral architectural & scenic fallback patterns (Abstract textures, no monument or place misrepresentations)
const FALLBACK_CATEGORY_IMAGES = {
  heritage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
  spiritual: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
  nature: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=80',
  beaches: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  wildlife: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80',
  food: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
  default: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'
};

const ASPECT_RATIOS = {
  '16:9': '56.25%',
  '4:3': '75%',
  '1:1': '100%',
  '4:5': '125%',
  hero: '56.25%',
  card: '75%',
  square: '100%',
  mobile: '125%'
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

  const hasRatio = aspectRatio && ASPECT_RATIOS[aspectRatio];

  const wrapperStyle = hasRatio
    ? {
        position: 'relative',
        width: '100%',
        paddingBottom: ASPECT_RATIOS[aspectRatio],
        overflow: 'hidden',
        backgroundColor: '#0F172A',
        ...style
      }
    : {
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#0F172A',
        ...style
      };

  const finalImgStyle = hasRatio
    ? {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center',
        transition: 'transform 0.4s ease',
        ...imgStyle
      }
    : {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center',
        display: 'block',
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
