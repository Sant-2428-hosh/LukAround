import React, { useState } from 'react';
import {
  X,
  Navigation,
  MapPin,
  Compass,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { getGoogleMapsDirectionsUrl } from '../../utils/distance';

export default function DirectionsModal({
  isOpen,
  onClose,
  hotel,
  destination = null // optional parent attraction / city
}) {
  if (!isOpen || !hotel) return null;

  const [originType, setOriginType] = useState(destination ? 'destination' : 'current');
  const [customOrigin, setCustomOrigin] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsCoords, setGpsCoords] = useState(null);
  const [gpsError, setGpsError] = useState(null);

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
        setGpsError('Location access was denied or unavailable. You can enter a custom starting point below.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleLaunchDirections = () => {
    let finalUrl = '';
    const dest = `${hotel.latitude},${hotel.longitude}`;

    if (originType === 'destination' && destination) {
      const destCoords = destination.coordinates || { latitude: destination.latitude, longitude: destination.longitude };
      if (destCoords && destCoords.latitude) {
        finalUrl = `https://www.google.com/maps/dir/?api=1&origin=${destCoords.latitude},${destCoords.longitude}&destination=${dest}&travelmode=driving`;
      } else {
        finalUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(destination.name || destination.city)}&destination=${dest}&travelmode=driving`;
      }
    } else if (originType === 'current') {
      if (gpsCoords) {
        finalUrl = `https://www.google.com/maps/dir/?api=1&origin=${gpsCoords.latitude},${gpsCoords.longitude}&destination=${dest}&travelmode=driving`;
      } else {
        // Fallback to Google Maps default current location
        finalUrl = `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=driving`;
      }
    } else if (originType === 'custom' && customOrigin.trim()) {
      finalUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(customOrigin.trim())}&destination=${dest}&travelmode=driving`;
    } else {
      finalUrl = `https://www.google.com/maps/dir/?api=1&destination=${dest}&travelmode=driving`;
    }

    window.open(finalUrl, '_blank', 'noopener,noreferrer');
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
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(5px)',
        zIndex: 9999,
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
          borderRadius: '16px',
          width: '100%',
          maxWidth: '520px',
          padding: '2rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#64748B',
            padding: '4px'
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
          <div
            style={{
              backgroundColor: '#EFF6FF',
              color: '#0284C7',
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Navigation size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Get Driving Directions
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>
              Official Google Maps navigation to {hotel.name}
            </p>
          </div>
        </div>

        {/* Destination Target Card */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '10px',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}
        >
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94A3B8', fontWeight: 700, marginBottom: '4px' }}>
            Destination Hotel
          </div>
          <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem' }}>
            {hotel.name}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={13} color="#EA4335" />
            {hotel.address || `${hotel.city}, ${hotel.state}`}
          </div>
        </div>

        {/* Origin Selection */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1E293B', marginBottom: '0.75rem' }}>
            Select Starting Location:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {/* Option A: From Current Tourist Destination (if available) */}
            {destination && (
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: originType === 'destination' ? '2px solid var(--color-primary)' : '1px solid #E2E8F0',
                  backgroundColor: originType === 'destination' ? '#FFF5F5' : '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="radio"
                  name="origin"
                  value="destination"
                  checked={originType === 'destination'}
                  onChange={() => setOriginType('destination')}
                  style={{ accentColor: 'var(--color-primary)' }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A' }}>
                    From {destination.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                    Direct route from the tourist attraction
                  </div>
                </div>
              </label>
            )}

            {/* Option B: From Current GPS Location */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '0.75rem',
                borderRadius: '8px',
                border: originType === 'current' ? '2px solid var(--color-primary)' : '1px solid #E2E8F0',
                backgroundColor: originType === 'current' ? '#FFF5F5' : '#FFFFFF',
                cursor: 'pointer'
              }}
            >
              <input
                type="radio"
                name="origin"
                value="current"
                checked={originType === 'current'}
                onChange={() => {
                  setOriginType('current');
                  handleUseCurrentLocation();
                }}
                style={{ accentColor: 'var(--color-primary)' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A' }}>
                  From My Current GPS Location
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  {gpsLoading ? 'Acquiring GPS location...' : gpsCoords ? '✓ GPS location acquired' : 'Uses browser GPS (Never permanently stored)'}
                </div>
              </div>
            </label>

            {/* Option C: Custom Starting Address */}
            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '0.75rem',
                borderRadius: '8px',
                border: originType === 'custom' ? '2px solid var(--color-primary)' : '1px solid #E2E8F0',
                backgroundColor: originType === 'custom' ? '#FFF5F5' : '#FFFFFF',
                cursor: 'pointer'
              }}
            >
              <input
                type="radio"
                name="origin"
                value="custom"
                checked={originType === 'custom'}
                onChange={() => setOriginType('custom')}
                style={{ accentColor: 'var(--color-primary)', marginTop: '4px' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', marginBottom: '4px' }}>
                  Enter Starting Location / Address
                </div>
                {originType === 'custom' && (
                  <input
                    type="text"
                    placeholder="e.g. Airport, Railway Station, City Center"
                    value={customOrigin}
                    onChange={(e) => setCustomOrigin(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.45rem 0.65rem',
                      border: '1px solid #CBD5E1',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      marginTop: '4px'
                    }}
                  />
                )}
              </div>
            </label>
          </div>

          {gpsError && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: '#DC2626' }}>
              {gpsError}
            </div>
          )}
        </div>

        {/* Privacy Note */}
        <div
          style={{
            fontSize: '0.75rem',
            color: '#64748B',
            marginBottom: '1.5rem',
            backgroundColor: '#F8FAFC',
            padding: '0.65rem',
            borderRadius: '6px'
          }}
        >
          🔒 <strong>Privacy Assurance:</strong> Your GPS location is used exclusively in real time to calculate Google Maps directions and is never stored on our servers.
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleLaunchDirections}
          style={{
            width: '100%',
            backgroundColor: 'var(--color-primary)',
            color: '#FFFFFF',
            padding: '0.85rem 1.25rem',
            borderRadius: '8px',
            fontSize: '0.95rem',
            fontWeight: 800,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(192, 41, 60, 0.3)'
          }}
        >
          <span>Open Directions on Google Maps</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
