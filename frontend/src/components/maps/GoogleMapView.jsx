import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Navigation,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  Layers,
  ShieldCheck,
  AlertCircle,
  Info,
  Key,
  X,
  Check
} from 'lucide-react';
import { buildGoogleMapsSearchUrl, buildGoogleMapsDirectionsUrl } from '../../utils/googleMaps';

/**
 * Creates custom SVG Icon for Leaflet map markers
 */
function createCustomLeafletIcon({ type = 'attraction', isSelected = false, label = '' }) {
  let bgColor = '#EA4335'; // Google Maps Red for attractions
  let borderColor = '#B91C1C';
  let iconSvg = `<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#FFFFFF"/>`;

  if (type === 'hotel') {
    bgColor = '#1D4ED8'; // Blue for hotels
    borderColor = '#1E40AF';
    iconSvg = `<path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" fill="#FFFFFF"/>`;
  } else if (type === 'city') {
    bgColor = '#D97706'; // Amber / Gold for cities
    borderColor = '#B45309';
    iconSvg = `<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FFFFFF"/>`;
  } else if (type === 'origin') {
    bgColor = '#8B5CF6'; // Purple for starting origin
    borderColor = '#6D28D9';
    iconSvg = `<circle cx="12" cy="12" r="5" fill="#FFFFFF"/><circle cx="12" cy="12" r="9" stroke="#FFFFFF" stroke-width="2" fill="none"/>`;
  }

  const width = isSelected ? 38 : 30;
  const height = isSelected ? 46 : 38;

  const svgHtml = `
    <div style="position: relative; width: ${width}px; height: ${height}px; filter: drop-shadow(0 3px 6px rgba(0,0,0,0.35)); transition: transform 0.2s ease;">
      <svg viewBox="0 0 24 28" width="${width}" height="${height}" style="overflow: visible;">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 16 12 16s12-7 12-16c0-6.627-5.373-12-12-12z" fill="${bgColor}" stroke="${borderColor}" stroke-width="1"/>
        <g transform="translate(0, 0)">${iconSvg}</g>
      </svg>
      ${isSelected ? `<div style="position: absolute; top: -6px; right: -6px; width: 12px; height: 12px; background: #10B981; border: 2px solid #FFFFFF; border-radius: 50%;"></div>` : ''}
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: 'custom-map-pin',
    iconSize: [width, height],
    iconAnchor: [width / 2, height],
    popupAnchor: [0, -height + 4]
  });
}

const TILE_PROVIDERS = {
  google: {
    name: 'Google Maps',
    url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    attribution: '© Google Maps'
  },
  osm: {
    name: 'OpenStreetMap',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors'
  },
  satellite: {
    name: 'Satellite',
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    attribution: '© Google Maps Imagery'
  }
};

export default function GoogleMapView({
  markers = [],
  center = { lat: 21.7679, lng: 78.8718 }, // Default to India center
  zoom = 5,
  selectedMarkerId = null,
  onMarkerSelect = null,
  onDirectionsClick = null,
  height = '500px',
  fitBounds = true,
  interactive = true,
  showControls = true,
  mapTitle = 'Interactive Google Map View'
}) {
  const containerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const googleMapRef = useRef(null);
  const leafletMarkersRef = useRef({});
  const googleMarkersRef = useRef({});
  const activeTileLayerRef = useRef(null);

  const [mapEngine, setMapEngine] = useState('loading'); // 'google', 'leaflet', 'error'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tileStyle, setTileStyle] = useState('google'); // 'google' | 'satellite' | 'osm'
  const [currentZoom, setCurrentZoom] = useState(zoom);

  // User-configured API key from localStorage or .env
  const [customApiKey, setCustomApiKey] = useState(() => {
    try {
      return typeof window !== 'undefined' ? (localStorage.getItem('user_google_maps_api_key') || '') : '';
    } catch {
      return '';
    }
  });
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiSaveFeedback, setApiSaveFeedback] = useState(null);

  const envKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const effectiveApiKey = (customApiKey && customApiKey.trim()) || (envKey && !envKey.includes('your_google_maps') ? envKey.trim() : '');
  const isGoogleKeyConfigured = Boolean(effectiveApiKey && effectiveApiKey.length > 20);

  // Normalize markers
  const validMarkers = useMemo(() => {
    return (markers || [])
      .map(m => {
        let lat = m.lat ?? m.latitude ?? (m.coordinates && m.coordinates.latitude);
        let lng = m.lng ?? m.longitude ?? (m.coordinates && m.coordinates.longitude);
        if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) return null;

        return {
          id: m.id || `${lat}-${lng}`,
          title: m.title || m.name || 'Location',
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          type: m.type || m.category || 'attraction',
          category: m.category || m.type || 'Sightseeing',
          city: m.city || '',
          state: m.state || '',
          address: m.address || '',
          rating: m.rating ?? m.guestRating ?? null,
          image: m.image || m.heroImage || null,
          starCategory: m.starCategory || null,
          priceLevel: m.priceLevel || null,
          website: m.website || null,
          raw: m
        };
      })
      .filter(Boolean);
  }, [markers]);

  // Try Google Maps first if key is configured, else fallback immediately to Leaflet
  useEffect(() => {
    let isCancelled = false;

    async function initMap() {
      if (isGoogleKeyConfigured) {
        try {
          const loader = new Loader({
            apiKey: effectiveApiKey,
            version: 'weekly',
            libraries: ['places']
          });

          await loader.load();
          if (isCancelled || !containerRef.current) return;

          // Native Google Maps
          const gMap = new window.google.maps.Map(containerRef.current, {
            center: { lat: center.lat, lng: center.lng },
            zoom: zoom,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            zoomControl: false,
            gestureHandling: interactive ? 'auto' : 'none'
          });

          googleMapRef.current = gMap;
          setMapEngine('google');
          return;
        } catch (err) {
          console.warn('Google Maps JS API load failed, switching to interactive fallback engine:', err);
        }
      }

      // Initialize Leaflet Interactive Fallback
      if (isCancelled || !containerRef.current) return;

      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }

      const lMap = L.map(containerRef.current, {
        center: [center.lat, center.lng],
        zoom: zoom,
        zoomControl: false,
        attributionControl: false
      });

      // Clean Tile Layer (Google Maps Roadmap or OpenStreetMap, 100% key-free and no watermark)
      const provider = TILE_PROVIDERS[tileStyle] || TILE_PROVIDERS.google;
      const baseLayer = L.tileLayer(provider.url, {
        maxZoom: 20,
        subdomains: 'abcd',
        attribution: provider.attribution
      }).addTo(lMap);
      activeTileLayerRef.current = baseLayer;

      lMap.on('zoomend', () => {
        setCurrentZoom(lMap.getZoom());
      });

      leafletMapRef.current = lMap;
      setMapEngine('leaflet');
    }

    initMap();

    return () => {
      isCancelled = true;
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
      googleMapRef.current = null;
    };
  }, [isGoogleKeyConfigured, effectiveApiKey]);

  // Dynamic Tile Layer Switcher (Street / Satellite / OpenStreetMap)
  useEffect(() => {
    if (mapEngine === 'leaflet' && leafletMapRef.current && activeTileLayerRef.current) {
      const provider = TILE_PROVIDERS[tileStyle] || TILE_PROVIDERS.google;
      leafletMapRef.current.removeLayer(activeTileLayerRef.current);
      const newLayer = L.tileLayer(provider.url, {
        maxZoom: 20,
        subdomains: 'abcd',
        attribution: provider.attribution
      }).addTo(leafletMapRef.current);
      activeTileLayerRef.current = newLayer;
    } else if (mapEngine === 'google' && googleMapRef.current) {
      if (tileStyle === 'satellite') {
        googleMapRef.current.setMapTypeId('hybrid');
      } else {
        googleMapRef.current.setMapTypeId('roadmap');
      }
    }
  }, [tileStyle, mapEngine]);

  // Update center & zoom if changed
  useEffect(() => {
    if (mapEngine === 'leaflet' && leafletMapRef.current) {
      if (!fitBounds || validMarkers.length === 0) {
        leafletMapRef.current.setView([center.lat, center.lng], zoom);
      }
    } else if (mapEngine === 'google' && googleMapRef.current) {
      if (!fitBounds || validMarkers.length === 0) {
        googleMapRef.current.setCenter({ lat: center.lat, lng: center.lng });
        googleMapRef.current.setZoom(zoom);
      }
    }
  }, [center.lat, center.lng, zoom, mapEngine, fitBounds, validMarkers.length]);

  // Render Markers on Map
  useEffect(() => {
    if (mapEngine === 'leaflet' && leafletMapRef.current) {
      const lMap = leafletMapRef.current;

      // Clear existing markers
      Object.values(leafletMarkersRef.current).forEach(m => m.remove());
      leafletMarkersRef.current = {};

      if (validMarkers.length === 0) return;

      const bounds = L.latLngBounds([]);

      validMarkers.forEach(item => {
        const isSelected = item.id === selectedMarkerId;
        const icon = createCustomLeafletIcon({
          type: item.type,
          isSelected,
          label: item.title
        });

        const marker = L.marker([item.lat, item.lng], { icon }).addTo(lMap);

        // Generate official Google Maps URLs
        const gMapsSearchUrl = buildGoogleMapsSearchUrl({
          name: item.title,
          address: item.address,
          city: item.city,
          state: item.state,
          latitude: item.lat,
          longitude: item.lng
        });

        const gMapsDirectionsUrl = buildGoogleMapsDirectionsUrl(
          null,
          {
            name: item.title,
            address: item.address,
            city: item.city,
            state: item.state,
            latitude: item.lat,
            longitude: item.lng
          },
          'driving'
        );

        // Rich InfoWindow content
        const popupContent = `
          <div style="font-family: inherit; min-width: 230px; max-width: 290px; padding: 2px;">
            ${item.image ? `
              <div style="height: 110px; width: 100%; border-radius: 8px; overflow: hidden; margin-bottom: 8px; background: #F1F5F9;">
                <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'"/>
              </div>
            ` : ''}
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 4px; margin-bottom: 4px;">
              <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #64748B;">
                ${item.type.toUpperCase()} ${item.city ? `• ${item.city}` : ''}
              </span>
              ${item.rating ? `
                <span style="font-size: 11px; font-weight: 700; color: #B45309; background: #FEF3C7; padding: 1px 6px; border-radius: 4px;">
                  ★ ${item.rating}
                </span>
              ` : ''}
            </div>
            <div style="font-weight: 800; font-size: 14px; color: #0F172A; line-height: 1.3; margin-bottom: 4px;">
              ${item.title}
            </div>
            ${item.address ? `
              <div style="font-size: 11px; color: #64748B; margin-bottom: 8px; line-height: 1.4;">
                ${item.address}
              </div>
            ` : ''}
            <div style="display: flex; gap: 6px; margin-top: 10px; flex-wrap: wrap;">
              <a href="${gMapsSearchUrl}" target="_blank" rel="noopener noreferrer" style="flex: 1; min-width: 100px; display: inline-flex; align-items: center; justify-content: center; gap: 4px; background: #EA4335; color: #FFFFFF; font-size: 11px; font-weight: 700; padding: 6px 10px; border-radius: 6px; text-decoration: none;">
                <span>View on Maps</span>
              </a>
              <a href="${gMapsDirectionsUrl}" target="_blank" rel="noopener noreferrer" style="flex: 1; min-width: 90px; display: inline-flex; align-items: center; justify-content: center; gap: 4px; background: #0F172A; color: #FFFFFF; font-size: 11px; font-weight: 700; padding: 6px 10px; border-radius: 6px; text-decoration: none;">
                <span>Directions</span>
              </a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, { maxWidth: 300, className: 'gmap-leaflet-popup' });

        marker.on('click', () => {
          if (onMarkerSelect) onMarkerSelect(item);
        });

        if (isSelected) {
          setTimeout(() => marker.openPopup(), 100);
        }

        leafletMarkersRef.current[item.id] = marker;
        bounds.extend([item.lat, item.lng]);
      });

      if (fitBounds && validMarkers.length > 0) {
        if (validMarkers.length === 1) {
          lMap.setView([validMarkers[0].lat, validMarkers[0].lng], 14);
        } else {
          lMap.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
        }
      }
    } else if (mapEngine === 'google' && googleMapRef.current) {
      const gMap = googleMapRef.current;

      // Clear existing google markers
      Object.values(googleMarkersRef.current).forEach(m => m.setMap(null));
      googleMarkersRef.current = {};

      if (validMarkers.length === 0) return;

      const bounds = new window.google.maps.LatLngBounds();

      validMarkers.forEach(item => {
        const isSelected = item.id === selectedMarkerId;

        const marker = new window.google.maps.Marker({
          position: { lat: item.lat, lng: item.lng },
          map: gMap,
          title: item.title,
          animation: isSelected ? window.google.maps.Animation.BOUNCE : null
        });

        const gMapsSearchUrl = buildGoogleMapsSearchUrl({
          name: item.title,
          address: item.address,
          city: item.city,
          state: item.state,
          latitude: item.lat,
          longitude: item.lng
        });

        const gMapsDirectionsUrl = buildGoogleMapsDirectionsUrl(
          null,
          {
            name: item.title,
            address: item.address,
            city: item.city,
            state: item.state,
            latitude: item.lat,
            longitude: item.lng
          },
          'driving'
        );

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="font-family: inherit; min-width: 220px; padding: 4px;">
              <div style="font-size: 11px; font-weight: 800; color: #64748B; text-transform: uppercase;">
                ${item.type}
              </div>
              <div style="font-weight: 800; font-size: 14px; color: #0F172A; margin: 4px 0;">
                ${item.title}
              </div>
              <div style="display: flex; gap: 6px; margin-top: 8px;">
                <a href="${gMapsSearchUrl}" target="_blank" rel="noopener noreferrer" style="background: #EA4335; color: #FFF; padding: 5px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; text-decoration: none;">
                  View on Maps
                </a>
                <a href="${gMapsDirectionsUrl}" target="_blank" rel="noopener noreferrer" style="background: #0F172A; color: #FFF; padding: 5px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; text-decoration: none;">
                  Directions
                </a>
              </div>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(gMap, marker);
          if (onMarkerSelect) onMarkerSelect(item);
        });

        if (isSelected) {
          infoWindow.open(gMap, marker);
        }

        googleMarkersRef.current[item.id] = marker;
        bounds.extend({ lat: item.lat, lng: item.lng });
      });

      if (fitBounds && validMarkers.length > 0) {
        if (validMarkers.length === 1) {
          gMap.setCenter({ lat: validMarkers[0].lat, lng: validMarkers[0].lng });
          gMap.setZoom(14);
        } else {
          gMap.fitBounds(bounds);
        }
      }
    }
  }, [validMarkers, mapEngine, selectedMarkerId, fitBounds, onMarkerSelect]);

  // Controls Handlers
  const handleZoomIn = () => {
    if (mapEngine === 'leaflet' && leafletMapRef.current) {
      leafletMapRef.current.zoomIn();
    } else if (mapEngine === 'google' && googleMapRef.current) {
      googleMapRef.current.setZoom(googleMapRef.current.getZoom() + 1);
    }
  };

  const handleZoomOut = () => {
    if (mapEngine === 'leaflet' && leafletMapRef.current) {
      leafletMapRef.current.zoomOut();
    } else if (mapEngine === 'google' && googleMapRef.current) {
      googleMapRef.current.setZoom(googleMapRef.current.getZoom() - 1);
    }
  };

  const cycleTileLayer = () => {
    const keys = ['google', 'satellite', 'osm'];
    const nextIdx = (keys.indexOf(tileStyle) + 1) % keys.length;
    setTileStyle(keys[nextIdx]);
  };

  const handleSaveApiKey = (e) => {
    if (e) e.preventDefault();
    const cleanKey = (apiKeyInput || '').trim();
    if (cleanKey.length > 20) {
      try {
        localStorage.setItem('user_google_maps_api_key', cleanKey);
      } catch (err) {
        console.error('Failed to save API key to localStorage', err);
      }
      setCustomApiKey(cleanKey);
      setApiSaveFeedback('saved');
      setTimeout(() => {
        setApiSaveFeedback(null);
        setShowApiKeyModal(false);
      }, 1000);
    } else {
      setApiSaveFeedback('invalid');
    }
  };

  const handleResetToOpenSource = () => {
    try {
      localStorage.removeItem('user_google_maps_api_key');
    } catch (err) {
      console.error('Failed to remove API key from localStorage', err);
    }
    setCustomApiKey('');
    setApiKeyInput('');
    setApiSaveFeedback('reset');
    setTimeout(() => {
      setApiSaveFeedback(null);
      setShowApiKeyModal(false);
    }, 1000);
  };

  const handleResetBounds = () => {
    if (mapEngine === 'leaflet' && leafletMapRef.current) {
      if (validMarkers.length > 1) {
        const bounds = L.latLngBounds(validMarkers.map(m => [m.lat, m.lng]));
        leafletMapRef.current.fitBounds(bounds, { padding: [40, 40] });
      } else {
        leafletMapRef.current.setView([center.lat, center.lng], zoom);
      }
    } else if (mapEngine === 'google' && googleMapRef.current) {
      if (validMarkers.length > 1) {
        const bounds = new window.google.maps.LatLngBounds();
        validMarkers.forEach(m => bounds.extend({ lat: m.lat, lng: m.lng }));
        googleMapRef.current.fitBounds(bounds);
      } else {
        googleMapRef.current.setCenter({ lat: center.lat, lng: center.lng });
        googleMapRef.current.setZoom(zoom);
      }
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      style={{
        position: isFullscreen ? 'fixed' : 'relative',
        top: isFullscreen ? 0 : 'auto',
        left: isFullscreen ? 0 : 'auto',
        width: isFullscreen ? '100vw' : '100%',
        height: isFullscreen ? '100vh' : height,
        zIndex: isFullscreen ? 99999 : 1,
        borderRadius: isFullscreen ? '0px' : '16px',
        overflow: 'hidden',
        border: '1px solid var(--tourism-sand-border)',
        boxShadow: isFullscreen ? 'none' : 'var(--shadow-subtle)',
        backgroundColor: '#F8FAFC'
      }}
    >
      {/* ── Map Canvas Container ── */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0
        }}
      />

      {/* ── Top Status, Layer & API Engine Bar ── */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          right: '56px',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          pointerEvents: 'none'
        }}
      >
        {/* Status Badge */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(8px)',
            borderRadius: '9999px',
            padding: '5px 12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            fontWeight: 700,
            color: '#0F172A',
            border: '1px solid rgba(226, 232, 240, 0.9)',
            pointerEvents: 'auto'
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: isGoogleKeyConfigured ? '#10B981' : '#2563EB',
              boxShadow: isGoogleKeyConfigured ? '0 0 6px #10B981' : '0 0 6px #2563EB'
            }}
          />
          <span>{isGoogleKeyConfigured ? 'Google Maps JS Engine' : 'Open-Source Map Engine (Google & OSM)'}</span>
          <span style={{ color: '#94A3B8' }}>•</span>
          <span style={{ color: '#64748B' }}>{validMarkers.length} Locations</span>
        </div>

        {/* Quick Layer Switcher */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(8px)',
            borderRadius: '9999px',
            padding: '2px 4px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px',
            border: '1px solid rgba(226, 232, 240, 0.9)',
            pointerEvents: 'auto'
          }}
        >
          {[
            { id: 'google', label: 'Roadmap' },
            { id: 'satellite', label: 'Satellite' },
            { id: 'osm', label: 'OpenStreetMap' }
          ].map(layer => {
            const isActive = tileStyle === layer.id;
            return (
              <button
                key={layer.id}
                type="button"
                onClick={() => setTileStyle(layer.id)}
                style={{
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: isActive ? 700 : 500,
                  borderRadius: '9999px',
                  border: 'none',
                  backgroundColor: isActive ? '#0F172A' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {layer.label}
              </button>
            );
          })}
        </div>

        {/* User API Key Self-Service Button */}
        <button
          type="button"
          onClick={() => {
            setApiKeyInput(customApiKey);
            setShowApiKeyModal(true);
          }}
          title="Configure Google Maps API Key or Use Open-Source"
          style={{
            backgroundColor: isGoogleKeyConfigured ? 'rgba(240, 253, 244, 0.96)' : 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${isGoogleKeyConfigured ? '#86EFAC' : 'rgba(226, 232, 240, 0.9)'}`,
            color: isGoogleKeyConfigured ? '#15803D' : '#334155',
            borderRadius: '9999px',
            padding: '5px 11px',
            fontSize: '11px',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
            pointerEvents: 'auto'
          }}
        >
          <Key size={12} color={isGoogleKeyConfigured ? '#15803D' : '#64748B'} />
          <span>{isGoogleKeyConfigured ? 'API Key Active' : 'Self-Config API Key'}</span>
        </button>

        {/* Verification Link Badge */}
        {!isGoogleKeyConfigured && (
          <div
            style={{
              backgroundColor: 'rgba(254, 243, 199, 0.96)',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              color: '#92400E',
              borderRadius: '9999px',
              padding: '5px 11px',
              fontSize: '11px',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              pointerEvents: 'auto'
            }}
          >
            <ShieldCheck size={12} color="#D97706" />
            <span>All markers link to verified Google Maps</span>
          </div>
        )}
      </div>

      {/* ── Right-Side Interactive Controls ── */}
      {showControls && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}
        >
          <button
            type="button"
            onClick={handleZoomIn}
            title="Zoom In"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1E293B',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              transition: 'background-color 0.2s'
            }}
          >
            <ZoomIn size={16} />
          </button>

          <button
            type="button"
            onClick={handleZoomOut}
            title="Zoom Out"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1E293B',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              transition: 'background-color 0.2s'
            }}
          >
            <ZoomOut size={16} />
          </button>

          <button
            type="button"
            onClick={cycleTileLayer}
            title={`Toggle Basemap Layer (Current: ${TILE_PROVIDERS[tileStyle]?.name || 'Roadmap'})`}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1E293B',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              transition: 'background-color 0.2s'
            }}
          >
            <Layers size={15} />
          </button>

          <button
            type="button"
            onClick={() => {
              setApiKeyInput(customApiKey);
              setShowApiKeyModal(true);
            }}
            title="Map Engine & API Key Setup"
            style={{
              backgroundColor: isGoogleKeyConfigured ? '#F0FDF4' : '#FFFFFF',
              border: isGoogleKeyConfigured ? '1px solid #86EFAC' : '1px solid #E2E8F0',
              borderRadius: '8px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isGoogleKeyConfigured ? '#15803D' : '#1E293B',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              transition: 'background-color 0.2s'
            }}
          >
            <Key size={15} />
          </button>

          <button
            type="button"
            onClick={handleResetBounds}
            title="Fit All Locations"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1E293B',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              transition: 'background-color 0.2s'
            }}
          >
            <RotateCcw size={15} />
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Map'}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1E293B',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              transition: 'background-color 0.2s'
            }}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      )}

      {/* ── Bottom Legend ── */}
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          zIndex: 10,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          borderRadius: '8px',
          padding: '6px 12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '11px',
          fontWeight: 600,
          border: '1px solid #E2E8F0',
          flexWrap: 'wrap'
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#1E293B' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#D97706' }} />
          <span>Cities</span>
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#1E293B' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EA4335' }} />
          <span>Attractions</span>
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#1E293B' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#1D4ED8' }} />
          <span>Hotels</span>
        </span>
      </div>

      {/* ── User Self-Service API Key & Engine Modal ── */}
      {showApiKeyModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100000,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setShowApiKeyModal(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '520px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid #E2E8F0',
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Key size={20} color="#2563EB" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#0F172A' }}>Map Engine & API Key Setup</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>Self-configure your personal Google Maps key or use Open-Source</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowApiKeyModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '8px'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Current Active Engine Status */}
            <div
              style={{
                backgroundColor: isGoogleKeyConfigured ? '#F0FDF4' : '#F8FAFC',
                border: `1px solid ${isGoogleKeyConfigured ? '#BBF7D0' : '#E2E8F0'}`,
                borderRadius: '12px',
                padding: '12px 14px',
                marginBottom: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: isGoogleKeyConfigured ? '#10B981' : '#2563EB'
                  }}
                />
                <span style={{ fontSize: '13px', fontWeight: 700, color: isGoogleKeyConfigured ? '#166534' : '#1E293B' }}>
                  {isGoogleKeyConfigured ? 'Google Maps JS Engine Active' : 'Open-Source Map Engine Active (Default)'}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>
                {isGoogleKeyConfigured
                  ? 'Your custom Google Maps API key is loaded. Native vector rendering and official Google controls are active.'
                  : '100% Free & Open-Source. Powered by OpenStreetMap & Google Maps basemaps. Zero watermark, zero cost, unlimited exploration.'}
              </p>
            </div>

            {/* API Key Form */}
            <form onSubmit={handleSaveApiKey} style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>
                Enter Your Google Maps API Key
              </label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={apiKeyInput}
                  onChange={e => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 18px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Check size={14} />
                  <span>Save</span>
                </button>
              </div>

              {/* Reset to Open Source Option */}
              {customApiKey && (
                <button
                  type="button"
                  onClick={handleResetToOpenSource}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#EF4444',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: '4px 0'
                  }}
                >
                  ✕ Remove key & switch back to Free Open-Source mode
                </button>
              )}

              {/* Feedback messages */}
              {apiSaveFeedback === 'saved' && (
                <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#16A34A', fontWeight: 600 }}>
                  ✓ API key saved! Initializing Google Maps JS Engine...
                </p>
              )}
              {apiSaveFeedback === 'reset' && (
                <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#2563EB', fontWeight: 600 }}>
                  ✓ Switched to Free Open-Source Engine.
                </p>
              )}
              {apiSaveFeedback === 'invalid' && (
                <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#DC2626', fontWeight: 600 }}>
                  ⚠ Please enter a valid API key (minimum 20 characters).
                </p>
              )}
            </form>

            {/* Explanatory Info Card */}
            <div
              style={{
                backgroundColor: '#F1F5F9',
                borderRadius: '10px',
                padding: '12px',
                fontSize: '11px',
                color: '#475569',
                lineHeight: 1.6
              }}
            >
              <div style={{ fontWeight: 700, color: '#1E293B', marginBottom: '4px' }}>💡 Quick Tips:</div>
              <div>• <strong>No key required:</strong> The default Open-Source Engine is completely free and requires zero setup.</div>
              <div>• <strong>Zero watermarks:</strong> Clean OpenStreetMap and Google basemaps render crisp tiles.</div>
              <div>• <strong>Google Maps Links:</strong> All markers, search links, and direction routes open directly in verified Google Maps (api=1).</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
