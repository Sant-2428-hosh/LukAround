import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

// Load Leaflet CSS + JS from CDN once
let leafletLoadPromise = null;
function loadLeaflet() {
  if (window.L) return Promise.resolve(window.L);
  if (leafletLoadPromise) return leafletLoadPromise;

  leafletLoadPromise = new Promise((resolve, reject) => {
    // CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }

    // JS
    const script = document.createElement('script');
    script.id = 'leaflet-js';
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV/XN/WPeA=';
    script.crossOrigin = '';
    script.onload = () => resolve(window.L);
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return leafletLoadPromise;
}

// Track mounted maps to prevent duplicate initialization
const mountedMaps = new WeakMap();

export default function LeafletMap({
  lat,
  lng,
  title,
  address,
  height = '150px',
  zoom = 13,
  style = {}
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'

  const numLat = lat !== undefined && lat !== null ? Number(lat) : null;
  const numLng = lng !== undefined && lng !== null ? Number(lng) : null;
  const hasCoords = numLat !== null && numLng !== null && !isNaN(numLat) && !isNaN(numLng);

  // Build Google Maps directions URL (opens on click)
  const directionsUrl = hasCoords
    ? `https://www.google.com/maps/dir/?api=1&destination=${numLat},${numLng}`
    : `https://www.google.com/maps/search/${encodeURIComponent(title || address || 'India')}`;

  useEffect(() => {
    if (!hasCoords) {
      setStatus('error');
      return;
    }

    let isMounted = true;
    let leafletMap = null;

    async function init() {
      try {
        const L = await loadLeaflet();
        if (!isMounted || !containerRef.current) return;

        // Prevent double-init on re-render
        if (mountedMaps.has(containerRef.current)) {
          mountedMaps.get(containerRef.current).remove();
        }

        leafletMap = L.map(containerRef.current, {
          center: [numLat, numLng],
          zoom,
          zoomControl: false,
          attributionControl: false,
          dragging: false,
          scrollWheelZoom: false,
          doubleClickZoom: false,
          boxZoom: false,
          keyboard: false,
          tap: false,
          touchZoom: false,
        });

        mountedMaps.set(containerRef.current, leafletMap);

        // OpenStreetMap tile layer (free, no API key)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        }).addTo(leafletMap);

        // Custom styled marker
        const markerIcon = L.divIcon({
          html: `<div style="
            width:28px; height:28px; border-radius:50% 50% 50% 0;
            background:var(--color-primary,#C0293C);
            transform:rotate(-45deg);
            border:3px solid #fff;
            box-shadow:0 2px 8px rgba(0,0,0,0.35);
          "></div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 28],
          popupAnchor: [0, -30],
          className: '',
        });

        const marker = L.marker([numLat, numLng], { icon: markerIcon }).addTo(leafletMap);
        if (title) {
          marker.bindPopup(`<strong style="font-size:12px;">${title}</strong>`, { closeButton: false });
        }

        mapRef.current = leafletMap;
        if (isMounted) setStatus('ready');
      } catch (err) {
        console.warn('[LeafletMap] init error:', err.message);
        if (isMounted) setStatus('error');
      }
    }

    init();

    return () => {
      isMounted = false;
      if (leafletMap) {
        leafletMap.remove();
        if (containerRef.current) mountedMaps.delete(containerRef.current);
      }
    };
  }, [numLat, numLng, zoom, title]);

  return (
    <div
      onClick={() => window.open(directionsUrl, '_blank', 'noopener,noreferrer')}
      title="Click to open directions in Google Maps"
      style={{
        position: 'relative',
        height,
        width: '100%',
        borderRadius: 'var(--radius-button)',
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid var(--color-rule)',
        backgroundColor: 'var(--color-canvas-warm)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        ...style,
      }}
    >
      {/* Leaflet map container */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          opacity: status === 'ready' ? 1 : 0,
          transition: 'opacity 0.4s ease',
          pointerEvents: 'none', // Parent div handles click
        }}
      />

      {/* Loading skeleton */}
      {status === 'loading' && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          backgroundColor: 'var(--color-canvas-warm)',
        }}>
          <div style={{
            width: '22px', height: '22px',
            border: '2px solid var(--color-primary-light)',
            borderTopColor: 'var(--color-primary)',
            borderRadius: '50%',
            animation: 'spin 0.9s linear infinite',
          }} />
          <span style={{ fontSize: '0.68rem', color: 'var(--color-ink-tertiary)', fontWeight: 600 }}>
            Loading map…
          </span>
        </div>
      )}

      {/* Error / no-coords fallback */}
      {status === 'error' && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '0.4rem',
          background: 'linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%)',
          padding: '1rem', textAlign: 'center',
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            backgroundColor: 'var(--color-primary-light)',
            color: 'var(--color-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <MapPin size={16} />
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-ink)' }}>
            {title || 'Location'}
          </div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
            fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-primary)',
            backgroundColor: '#fff', padding: '0.2rem 0.6rem',
            borderRadius: 'var(--radius-button)',
            border: '1px solid rgba(192,41,60,0.2)',
          }}>
            <Navigation size={10} />
            <span>Get Directions</span>
          </div>
        </div>
      )}

      {/* Bottom badge overlay */}
      {status === 'ready' && (
        <div style={{
          position: 'absolute', bottom: '0.4rem', right: '0.4rem',
          backgroundColor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(4px)',
          color: 'var(--color-ink)',
          fontSize: '0.66rem', fontWeight: 700,
          padding: '0.18rem 0.45rem',
          borderRadius: '4px',
          display: 'flex', alignItems: 'center', gap: '0.25rem',
          boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
          border: '1px solid rgba(0,0,0,0.08)',
          pointerEvents: 'none',
        }}>
          <Navigation size={9} color="var(--color-primary)" />
          <span>Directions</span>
          <ExternalLink size={8} color="var(--color-ink-tertiary)" />
        </div>
      )}
    </div>
  );
}
