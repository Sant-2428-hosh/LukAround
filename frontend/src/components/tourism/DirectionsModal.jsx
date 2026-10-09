import React, { useState, useMemo } from 'react';
import {
  X,
  Navigation,
  MapPin,
  Compass,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Car,
  Footprints,
  Train,
  Bike,
  Plane,
  Building,
  Search,
  Crosshair
} from 'lucide-react';
import {
  buildGoogleMapsDirectionsUrl,
  MAJOR_AIRPORTS,
  MAJOR_RAILWAY_STATIONS,
  resolvePlaceLocation
} from '../../utils/googleMaps';
import { cities, attractions } from '../../data/indiaTourismData';

export default function DirectionsModal({
  isOpen,
  onClose,
  target, // Can be a Hotel, Attraction, or City
  hotel = null, // Backward-compatibility
  destination = null // Optional reference origin
}) {
  // Normalize target entity
  const effectiveTarget = target || hotel;
  if (!isOpen || !effectiveTarget) return null;

  const resolvedTarget = resolvePlaceLocation(effectiveTarget);

  // Origin option type: 'current' | 'custom' | 'city' | 'station' | 'airport' | 'attraction' | 'destination'
  const [originType, setOriginType] = useState(destination ? 'destination' : 'current');
  const [customOrigin, setCustomOrigin] = useState('');
  const [selectedCityId, setSelectedCityId] = useState(cities[0]?.id || '');
  const [selectedStationId, setSelectedStationId] = useState(MAJOR_RAILWAY_STATIONS[0]?.id || '');
  const [selectedAirportId, setSelectedAirportId] = useState(MAJOR_AIRPORTS[0]?.id || '');
  const [selectedAttractionId, setSelectedAttractionId] = useState(attractions[0]?.id || '');
  const [travelMode, setTravelMode] = useState('driving'); // 'driving' | 'walking' | 'transit' | 'bicycling'

  // Search filter inside selectors
  const [citySearch, setCitySearch] = useState('');
  const [stationSearch, setStationSearch] = useState('');
  const [airportSearch, setAirportSearch] = useState('');
  const [attractionSearch, setAttractionSearch] = useState('');

  // GPS Geolocation state
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsCoords, setGpsCoords] = useState(null);
  const [gpsError, setGpsError] = useState(null);

  // Filtered dropdown lists
  const filteredCities = useMemo(() => {
    if (!citySearch.trim()) return cities.slice(0, 30);
    return cities.filter(c =>
      c.name.toLowerCase().includes(citySearch.toLowerCase()) ||
      c.state.toLowerCase().includes(citySearch.toLowerCase())
    ).slice(0, 30);
  }, [citySearch]);

  const filteredStations = useMemo(() => {
    if (!stationSearch.trim()) return MAJOR_RAILWAY_STATIONS;
    return MAJOR_RAILWAY_STATIONS.filter(s =>
      s.name.toLowerCase().includes(stationSearch.toLowerCase()) ||
      s.city.toLowerCase().includes(stationSearch.toLowerCase())
    );
  }, [stationSearch]);

  const filteredAirports = useMemo(() => {
    if (!airportSearch.trim()) return MAJOR_AIRPORTS;
    return MAJOR_AIRPORTS.filter(a =>
      a.name.toLowerCase().includes(airportSearch.toLowerCase()) ||
      a.city.toLowerCase().includes(airportSearch.toLowerCase())
    );
  }, [airportSearch]);

  const filteredAttractions = useMemo(() => {
    if (!attractionSearch.trim()) return attractions.slice(0, 30);
    return attractions.filter(a =>
      a.name.toLowerCase().includes(attractionSearch.toLowerCase()) ||
      a.city.toLowerCase().includes(attractionSearch.toLowerCase())
    ).slice(0, 30);
  }, [attractionSearch]);

  const handleUseCurrentLocation = () => {
    setGpsError(null);
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setGpsLoading(false);
      },
      (error) => {
        setGpsLoading(false);
        setGpsError('Location access was denied or timed out. You can choose a starting city, airport, station, or enter an address below.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleLaunchDirections = () => {
    let chosenOrigin = null;

    if (originType === 'destination' && destination) {
      chosenOrigin = destination;
    } else if (originType === 'current') {
      if (gpsCoords) {
        chosenOrigin = gpsCoords;
      } else {
        // Leave origin null so Google Maps uses the user's current GPS location automatically
        chosenOrigin = null;
      }
    } else if (originType === 'custom' && customOrigin.trim()) {
      chosenOrigin = customOrigin.trim();
    } else if (originType === 'city') {
      const cityObj = cities.find(c => c.id === selectedCityId) || cities[0];
      chosenOrigin = cityObj;
    } else if (originType === 'station') {
      const stationObj = MAJOR_RAILWAY_STATIONS.find(s => s.id === selectedStationId) || MAJOR_RAILWAY_STATIONS[0];
      chosenOrigin = stationObj;
    } else if (originType === 'airport') {
      const airportObj = MAJOR_AIRPORTS.find(a => a.id === selectedAirportId) || MAJOR_AIRPORTS[0];
      chosenOrigin = airportObj;
    } else if (originType === 'attraction') {
      const attrObj = attractions.find(a => a.id === selectedAttractionId) || attractions[0];
      chosenOrigin = attrObj;
    }

    const directionsUrl = buildGoogleMapsDirectionsUrl(chosenOrigin, effectiveTarget, travelMode);
    window.open(directionsUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          maxWidth: '560px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '2rem',
          position: 'relative',
          border: '1px solid #E2E8F0'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: '#F1F5F9',
            border: 'none',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748B'
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
          <div style={{ backgroundColor: '#EFF6FF', padding: '0.55rem', borderRadius: '10px', color: '#1D4ED8' }}>
            <Navigation size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-primary, #0284C7)', letterSpacing: '0.5px' }}>
              Official Google Maps Routing
            </span>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Get Directions
            </h3>
          </div>
        </div>

        {/* Target Destination Preview */}
        <div style={{
          backgroundColor: '#F8FAFC',
          borderRadius: '12px',
          padding: '1rem',
          border: '1px solid #E2E8F0',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: '#EA4335',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <MapPin size={18} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Destination:</div>
            <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {resolvedTarget?.name || effectiveTarget.name}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
              {resolvedTarget?.city ? `${resolvedTarget.city}, ${resolvedTarget.state}` : resolvedTarget?.address}
            </div>
          </div>
        </div>

        {/* ── Starting Location Selection ── */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.6rem' }}>
            Where are you starting from?
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.4rem', marginBottom: '1rem' }}>
            {destination && (
              <button
                type="button"
                onClick={() => setOriginType('destination')}
                style={{
                  padding: '0.6rem 0.5rem',
                  borderRadius: '8px',
                  border: `2px solid ${originType === 'destination' ? 'var(--color-primary, #0284C7)' : '#E2E8F0'}`,
                  backgroundColor: originType === 'destination' ? '#F0F9FF' : '#FFFFFF',
                  color: originType === 'destination' ? '#0369A1' : '#475569',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                From {destination.name ? destination.name.slice(0, 14) : 'Selected Place'}
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setOriginType('current');
                if (!gpsCoords) handleUseCurrentLocation();
              }}
              style={{
                padding: '0.6rem 0.5rem',
                borderRadius: '8px',
                border: `2px solid ${originType === 'current' ? 'var(--color-primary, #0284C7)' : '#E2E8F0'}`,
                backgroundColor: originType === 'current' ? '#F0F9FF' : '#FFFFFF',
                color: originType === 'current' ? '#0369A1' : '#475569',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              <Crosshair size={13} />
              <span>Current GPS</span>
            </button>

            <button
              type="button"
              onClick={() => setOriginType('city')}
              style={{
                padding: '0.6rem 0.5rem',
                borderRadius: '8px',
                border: `2px solid ${originType === 'city' ? 'var(--color-primary, #0284C7)' : '#E2E8F0'}`,
                backgroundColor: originType === 'city' ? '#F0F9FF' : '#FFFFFF',
                color: originType === 'city' ? '#0369A1' : '#475569',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              <Building size={13} />
              <span>Choose City</span>
            </button>

            <button
              type="button"
              onClick={() => setOriginType('station')}
              style={{
                padding: '0.6rem 0.5rem',
                borderRadius: '8px',
                border: `2px solid ${originType === 'station' ? 'var(--color-primary, #0284C7)' : '#E2E8F0'}`,
                backgroundColor: originType === 'station' ? '#F0F9FF' : '#FFFFFF',
                color: originType === 'station' ? '#0369A1' : '#475569',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              <Train size={13} />
              <span>Railway Station</span>
            </button>

            <button
              type="button"
              onClick={() => setOriginType('airport')}
              style={{
                padding: '0.6rem 0.5rem',
                borderRadius: '8px',
                border: `2px solid ${originType === 'airport' ? 'var(--color-primary, #0284C7)' : '#E2E8F0'}`,
                backgroundColor: originType === 'airport' ? '#F0F9FF' : '#FFFFFF',
                color: originType === 'airport' ? '#0369A1' : '#475569',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              <Plane size={13} />
              <span>Airport</span>
            </button>

            <button
              type="button"
              onClick={() => setOriginType('custom')}
              style={{
                padding: '0.6rem 0.5rem',
                borderRadius: '8px',
                border: `2px solid ${originType === 'custom' ? 'var(--color-primary, #0284C7)' : '#E2E8F0'}`,
                backgroundColor: originType === 'custom' ? '#F0F9FF' : '#FFFFFF',
                color: originType === 'custom' ? '#0369A1' : '#475569',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Enter Address
            </button>
          </div>

          {/* Dynamic Origin Input Controls */}
          {originType === 'current' && (
            <div style={{ backgroundColor: '#F0FDF4', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #DCFCE7' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 600 }}>
                  {gpsLoading ? 'Detecting your device location...' : gpsCoords ? '✓ Current location detected' : 'Click to authorize browser location permission'}
                </span>
                <button
                  type="button"
                  onClick={handleUseCurrentLocation}
                  disabled={gpsLoading}
                  style={{
                    backgroundColor: '#16A34A',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {gpsLoading ? 'Locating...' : gpsCoords ? 'Re-detect' : 'Allow GPS'}
                </button>
              </div>
              {gpsError && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: '#B91C1C' }}>
                  {gpsError}
                </div>
              )}
            </div>
          )}

          {originType === 'city' && (
            <div>
              <div style={{ marginBottom: '0.4rem', position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Filter cities..."
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
              <select
                value={selectedCityId}
                onChange={(e) => setSelectedCityId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.9rem',
                  backgroundColor: '#FFFFFF'
                }}
              >
                {filteredCities.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}, {c.state}
                  </option>
                ))}
              </select>
            </div>
          )}

          {originType === 'station' && (
            <div>
              <div style={{ marginBottom: '0.4rem' }}>
                <input
                  type="text"
                  placeholder="Filter railway stations..."
                  value={stationSearch}
                  onChange={(e) => setStationSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
              <select
                value={selectedStationId}
                onChange={(e) => setSelectedStationId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.9rem',
                  backgroundColor: '#FFFFFF'
                }}
              >
                {filteredStations.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.city}, {s.state})
                  </option>
                ))}
              </select>
            </div>
          )}

          {originType === 'airport' && (
            <div>
              <div style={{ marginBottom: '0.4rem' }}>
                <input
                  type="text"
                  placeholder="Filter airports..."
                  value={airportSearch}
                  onChange={(e) => setAirportSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
              <select
                value={selectedAirportId}
                onChange={(e) => setSelectedAirportId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.9rem',
                  backgroundColor: '#FFFFFF'
                }}
              >
                {filteredAirports.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.city}, {a.state})
                  </option>
                ))}
              </select>
            </div>
          )}

          {originType === 'custom' && (
            <div>
              <input
                type="text"
                placeholder="e.g. Marina Beach Chennai or Connaught Place New Delhi"
                value={customOrigin}
                onChange={(e) => setCustomOrigin(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.9rem',
                  color: '#0F172A'
                }}
              />
            </div>
          )}
        </div>

        {/* ── Travel Mode Selector ── */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.6rem' }}>
            Travel Mode
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
            {[
              { mode: 'driving', label: 'Driving', icon: Car },
              { mode: 'walking', label: 'Walking', icon: Footprints },
              { mode: 'transit', label: 'Transit', icon: Train },
              { mode: 'bicycling', label: 'Bicycle', icon: Bike }
            ].map(({ mode, label, icon: Icon }) => (
              <button
                key={mode}
                type="button"
                onClick={() => setTravelMode(mode)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '0.65rem 0.4rem',
                  borderRadius: '8px',
                  border: `2px solid ${travelMode === mode ? '#0F172A' : '#E2E8F0'}`,
                  backgroundColor: travelMode === mode ? '#F8FAFC' : '#FFFFFF',
                  color: travelMode === mode ? '#0F172A' : '#64748B',
                  fontWeight: travelMode === mode ? 800 : 600,
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                <Icon size={18} color={travelMode === mode ? '#0F172A' : '#64748B'} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Launch Google Maps Directions Action Button */}
        <button
          type="button"
          onClick={handleLaunchDirections}
          style={{
            width: '100%',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            padding: '0.9rem',
            fontSize: '0.95rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)',
            transition: 'background-color 0.2s'
          }}
        >
          <Navigation size={18} color="#38BDF8" />
          <span>Launch Directions on Google Maps</span>
          <ExternalLink size={15} />
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#64748B', margin: '0.85rem 0 0' }}>
          Opens official Google Maps routing with verified destination coordinates and selected transit mode.
        </p>
      </div>
    </div>
  );
}
