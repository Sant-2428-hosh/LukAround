import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, ExternalLink, Compass } from 'lucide-react';

// In-memory geocode cache as fallback for locations without stored coordinates
const GEOCODE_CACHE = new Map();

// Helper to load Google Maps JavaScript API script once
let googleMapsScriptPromise = null;
function loadGoogleMapsScript(apiKey) {
  if (!apiKey) return Promise.reject(new Error('Missing API Key'));
  if (window.google && window.google.maps) return Promise.resolve(window.google.maps);

  if (!googleMapsScriptPromise) {
    googleMapsScriptPromise = new Promise((resolve, reject) => {
      const existingScript = document.getElementById('google-maps-js-sdk');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(window.google.maps));
        existingScript.addEventListener('error', (e) => reject(e));
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-maps-js-sdk';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google && window.google.maps) {
          resolve(window.google.maps);
        } else {
          reject(new Error('Google Maps SDK loaded but window.google.maps is undefined'));
        }
      };
      script.onerror = (err) => reject(err);
      document.head.appendChild(script);
    });
  }

  return googleMapsScriptPromise;
}

export default function LocationMap({
  lat,
  lng,
  placeId,
  address,
  title,
  height = '150px',
  zoom = 15,
  style = {}
}) {
  const mapContainerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const numLat = lat !== undefined && lat !== null ? Number(lat) : null;
  const numLng = lng !== undefined && lng !== null ? Number(lng) : null;
  const hasExactCoords = numLat !== null && numLng !== null && !isNaN(numLat) && !isNaN(numLng);

  const [resolvedCoords, setResolvedCoords] = useState(
    hasExactCoords ? { lat: numLat, lng: numLng } : null
  );

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  // Construct Google Maps turn-by-turn directions URL using destination_place_id for exact landmark targeting
  let directionsUrl = 'https://www.google.com/maps/dir/?api=1';
  if (placeId) {
    directionsUrl += `&destination=${encodeURIComponent(title || address || 'Destination')}&destination_place_id=${encodeURIComponent(placeId)}`;
  } else if (hasExactCoords) {
    directionsUrl += `&destination=${numLat},${numLng}`;
  } else {
    directionsUrl += `&destination=${encodeURIComponent(address || title || 'India')}`;
  }

  useEffect(() => {
    // If no API key provided, fall back gracefully to the interactive directions card
    if (!apiKey) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function initMap() {
      try {
        setLoading(true);
        setError(false);

        const maps = await loadGoogleMapsScript(apiKey);
        if (!isMounted || !mapContainerRef.current) return;

        let centerCoords = null;

        // 1. Primary: Use precise stored coordinates directly (ZERO geocoding latency)
        if (hasExactCoords) {
          centerCoords = { lat: numLat, lng: numLng };
        } else if (address || title) {
          // 2. Fallback: Log notice and use Geocoder only for legacy uncoordinated items
          console.warn(`[LocationMap] Missing stored coordinates for "${title || address}". Falling back to text geocoding.`);
          const geocodeKey = (address || title).trim().toLowerCase();

          if (GEOCODE_CACHE.has(geocodeKey)) {
            centerCoords = GEOCODE_CACHE.get(geocodeKey);
          } else {
            const geocoder = new maps.Geocoder();
            const res = await new Promise((resolveGeocode, rejectGeocode) => {
              geocoder.geocode({ address: address || title }, (results, status) => {
                if (status === 'OK' && results && results[0]) {
                  resolveGeocode(results[0].geometry.location);
                } else {
                  rejectGeocode(new Error(`Geocoding failed: ${status}`));
                }
              });
            });

            centerCoords = { lat: res.lat(), lng: res.lng() };
            GEOCODE_CACHE.set(geocodeKey, centerCoords);
          }
        }

        if (!centerCoords || !isMounted || !mapContainerRef.current) {
          setLoading(false);
          return;
        }

        setResolvedCoords(centerCoords);

        // 3. Render clean, focused preview map
        const mapInstance = new maps.Map(mapContainerRef.current, {
          center: centerCoords,
          zoom: zoom,
          disableDefaultUI: true,
          zoomControl: false,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: false,
          gestureHandling: 'none',
          styles: [
            { featureType: 'poi', stylers: [{ visibility: 'simplified' }] },
            { featureType: 'road', elementType: 'labels', stylers: [{ visibility: 'simplified' }] }
          ]
        });

        // 4. Add Marker Pin with InfoWindow
        const marker = new maps.Marker({
          position: centerCoords,
          map: mapInstance,
          title: title || address || 'Verified Location',
          animation: maps.Animation.DROP
        });

        const infoContent = `
          <div style="font-family: sans-serif; padding: 4px 6px; font-size: 12px; color: #111;">
            <strong>${title || address || 'Location'}</strong>
            <div style="font-size: 11px; color: #666; margin-top: 2px;">${address || ''}</div>
          </div>
        `;
        const infoWindow = new maps.InfoWindow({ content: infoContent });

        marker.addListener('click', () => {
          infoWindow.open(mapInstance, marker);
        });

        setLoading(false);
      } catch (err) {
        console.warn('LocationMap initialization notice:', err.message);
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }
    }

    initMap();

    return () => {
      isMounted = false;
    };
  }, [apiKey, numLat, numLng, hasExactCoords, placeId, address, title, zoom]);

  // Click handler to open turn-by-turn directions in Google Maps
  const handleMapClick = (e) => {
    e.stopPropagation();
    window.open(directionsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      onClick={handleMapClick}
      title="Click to open turn-by-turn directions in Google Maps"
      style={{
        position: 'relative',
        height: height,
        width: '100%',
        borderRadius: 'var(--radius-button)',
        overflow: 'hidden',
        cursor: 'pointer',
        border: '1px solid var(--color-rule)',
        backgroundColor: 'var(--color-canvas-warm)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        ...style
      }}
    >
      {/* 1. Interactive Google Map Container */}
      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '100%',
          opacity: loading || error || !apiKey ? 0 : 1,
          transition: 'opacity 0.3s ease'
        }}
      />

      {/* 2. Elegant Fallback Canvas (Shown when API key is missing or script failed) */}
      {(!apiKey || error) && !loading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1rem',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%)',
            border: '1px dashed var(--color-rule)'
          }}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.35rem',
              boxShadow: 'var(--shadow-rest)'
            }}
          >
            <MapPin size={16} />
          </div>

          <div
            style={{
              fontSize: '0.775rem',
              fontWeight: 700,
              color: 'var(--color-ink)',
              maxWidth: '90%',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              marginBottom: '0.15rem'
            }}
          >
            {title || address || 'Location Preview'}
          </div>

          <div
            style={{
              fontSize: '0.7rem',
              color: 'var(--color-ink-secondary)',
              maxWidth: '90%',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              marginBottom: '0.45rem'
            }}
          >
            {hasExactCoords ? `Lat: ${numLat.toFixed(4)}, Lng: ${numLng.toFixed(4)}` : (address || 'View on interactive map')}
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontSize: '0.725rem',
              fontWeight: 700,
              color: 'var(--color-primary)',
              backgroundColor: '#FFFFFF',
              padding: '0.25rem 0.65rem',
              borderRadius: 'var(--radius-button)',
              border: '1px solid rgba(192, 41, 60, 0.25)',
              boxShadow: 'var(--shadow-rest)'
            }}
          >
            <Navigation size={11} />
            <span>Get Directions on Google Maps</span>
          </div>
        </div>
      )}

      {/* 3. Skeleton Loading State */}
      {loading && apiKey && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'var(--color-canvas-warm)',
            gap: '0.5rem'
          }}
        >
          <div
            style={{
              width: '24px',
              height: '24px',
              border: '2px solid var(--color-primary-light)',
              borderTopColor: 'var(--color-primary)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }}
          />
          <span style={{ fontSize: '0.7rem', color: 'var(--color-ink-tertiary)', fontWeight: 600 }}>
            Loading Map Preview...
          </span>
        </div>
      )}

      {/* 4. Direction Badge Overlay (Hover & Click Affordance) */}
      <div
        style={{
          position: 'absolute',
          bottom: '0.45rem',
          right: '0.45rem',
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(4px)',
          color: 'var(--color-ink)',
          fontSize: '0.675rem',
          fontWeight: 700,
          padding: '0.2rem 0.5rem',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
          border: '1px solid rgba(0,0,0,0.08)',
          pointerEvents: 'none'
        }}
      >
        <Navigation size={10} color="var(--color-primary)" />
        <span>Directions</span>
        <ExternalLink size={9} color="var(--color-ink-tertiary)" />
      </div>
    </div>
  );
}
