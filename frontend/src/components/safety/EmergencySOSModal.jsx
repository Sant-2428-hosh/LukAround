import React, { useState } from 'react';
import {
  ShieldAlert,
  Phone,
  MapPin,
  Navigation,
  Share2,
  Copy,
  Check,
  X,
  ExternalLink,
  AlertTriangle,
  HeartPulse
} from 'lucide-react';

export default function EmergencySOSModal({
  isOpen,
  onClose,
  nearestHospital,
  nearestPolice,
  currentDestinationName = 'Your Location'
}) {
  const [copiedNumber, setCopiedNumber] = useState(null);
  const [locationSharing, setLocationSharing] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [copiedLocation, setCopiedLocation] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (number, label) => {
    navigator.clipboard?.writeText(number);
    setCopiedNumber(label);
    setTimeout(() => setCopiedNumber(null), 2500);
  };

  const handleGetLocation = () => {
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setLocationSharing(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setUserLocation({
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
          accuracy: Math.round(accuracy),
          mapsUrl: `https://www.google.com/maps?q=${latitude},${longitude}`
        });
        setLocationSharing(false);
      },
      (err) => {
        setLocationSharing(false);
        if (err.code === 1) {
          setLocationError('Location access was denied. Please enable permission to share your location.');
        } else {
          setLocationError('Unable to retrieve current coordinates. Please try again.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleCopyLocation = () => {
    if (!userLocation) return;
    const textToShare = `EMERGENCY ALERT: I am at https://www.google.com/maps?q=${userLocation.latitude},${userLocation.longitude} (Accuracy: within ${userLocation.accuracy}m). Please assist.`;
    navigator.clipboard?.writeText(textToShare);
    setCopiedLocation(true);
    setTimeout(() => setCopiedLocation(false), 3000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sos-modal-title"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        overflowY: 'auto'
      }}
    >
      <div
        style={{
          maxWidth: '560px',
          width: '100%',
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '2px solid #EF4444',
          padding: '1.75rem',
          boxShadow: '0 25px 60px rgba(239, 68, 68, 0.25), 0 20px 40px rgba(0,0,0,0.4)',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <ShieldAlert size={24} />
            </div>
            <div>
              <h2 id="sos-modal-title" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.2 }}>
                Emergency SOS Dialer
              </h2>
              <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
                Location: {currentDestinationName}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Emergency Dialer"
            style={{
              background: '#F1F5F9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748B'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Critical Notice */}
        <div
          style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.6rem',
            fontSize: '0.82rem',
            color: '#991B1B',
            lineHeight: 1.45
          }}
        >
          <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>In immediate life-threatening danger, dial 112 directly.</strong> Calls connect to police, fire, or ambulance dispatch.
          </div>
        </div>

        {/* Primary National Emergency Call Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '1.25rem' }}>
          {/* 112 National Emergency */}
          <a
            href="tel:112"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.15rem 0.75rem',
              backgroundColor: '#DC2626',
              color: '#FFFFFF',
              borderRadius: '14px',
              textDecoration: 'none',
              textAlign: 'center',
              boxShadow: '0 6px 16px rgba(220, 38, 38, 0.35)',
              transition: 'transform 0.2s ease'
            }}
          >
            <Phone size={22} style={{ marginBottom: '0.35rem' }} />
            <span style={{ fontSize: '1.65rem', fontWeight: 900, lineHeight: 1 }}>112</span>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, marginTop: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              National Emergency
            </span>
            <span style={{ fontSize: '0.68rem', opacity: 0.9 }}>Police · Fire · Medical</span>
          </a>

          {/* 1363 Tourist Helpline */}
          <a
            href="tel:1363"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.15rem 0.75rem',
              backgroundColor: '#0284C7',
              color: '#FFFFFF',
              borderRadius: '14px',
              textDecoration: 'none',
              textAlign: 'center',
              boxShadow: '0 6px 16px rgba(2, 132, 199, 0.35)',
              transition: 'transform 0.2s ease'
            }}
          >
            <Phone size={22} style={{ marginBottom: '0.35rem' }} />
            <span style={{ fontSize: '1.65rem', fontWeight: 900, lineHeight: 1 }}>1363</span>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, marginTop: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Tourist Helpline
            </span>
            <span style={{ fontSize: '0.68rem', opacity: 0.9 }}>24/7 Multi-Lingual</span>
          </a>
        </div>

        {/* Nearest Local Facilities Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
          {/* Nearest Hospital */}
          {nearestHospital && (
            <div
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '0.85rem 1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', fontWeight: 800, color: '#DC2626', textTransform: 'uppercase' }}>
                  <HeartPulse size={13} />
                  <span>Nearest Emergency Hospital</span>
                  {nearestHospital.distanceKm != null && <span>({nearestHospital.distanceKm} km)</span>}
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {nearestHospital.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  {nearestHospital.publicPhone || 'Dial 108 for ambulance dispatch'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.45rem', flexShrink: 0 }}>
                {nearestHospital.publicPhone && (
                  <a
                    href={`tel:${nearestHospital.publicPhone}`}
                    className="btn btn-primary"
                    style={{ padding: '0.45rem 0.75rem', fontSize: '0.78rem', backgroundColor: '#DC2626', textDecoration: 'none' }}
                  >
                    <Phone size={13} /> Call
                  </a>
                )}
                {nearestHospital.directionsUrl && (
                  <a
                    href={nearestHospital.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                    style={{ padding: '0.45rem 0.75rem', fontSize: '0.78rem', textDecoration: 'none' }}
                  >
                    <Navigation size={13} /> Route
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Nearest Police */}
          {nearestPolice && (
            <div
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '0.85rem 1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '0.75rem'
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', fontWeight: 800, color: '#C85A32', textTransform: 'uppercase' }}>
                  <MapPin size={13} />
                  <span>Local Police Precinct</span>
                  {nearestPolice.distanceKm != null && <span>({nearestPolice.distanceKm} km)</span>}
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {nearestPolice.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  {nearestPolice.publicPhone || 'Dial 112 for police dispatch'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.45rem', flexShrink: 0 }}>
                {nearestPolice.publicPhone && (
                  <a
                    href={`tel:${nearestPolice.publicPhone}`}
                    className="btn btn-primary"
                    style={{ padding: '0.45rem 0.75rem', fontSize: '0.78rem', backgroundColor: '#C85A32', textDecoration: 'none' }}
                  >
                    <Phone size={13} /> Call
                  </a>
                )}
                {nearestPolice.directionsUrl && (
                  <a
                    href={nearestPolice.directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                    style={{ padding: '0.45rem 0.75rem', fontSize: '0.78rem', textDecoration: 'none' }}
                  >
                    <Navigation size={13} /> Route
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Share Location Assistance Feature */}
        <div
          style={{
            backgroundColor: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: '14px',
            padding: '1rem',
            marginBottom: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#166534', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Share2 size={15} /> Share Location with Trusted Contact
            </span>
            {!userLocation && (
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={locationSharing}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  backgroundColor: '#16A34A',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.35rem 0.75rem',
                  cursor: 'pointer'
                }}
              >
                {locationSharing ? 'Locating...' : 'Get GPS Location'}
              </button>
            )}
          </div>

          <p style={{ fontSize: '0.75rem', color: '#14532D', margin: '0 0 0.5rem 0', lineHeight: 1.45 }}>
            Requires deliberate browser permission. Generates a verifiable Google Maps link to send to your family or embassy.
            <em> Note: This does not automatically dispatch police.</em>
          </p>

          {locationError && (
            <div style={{ fontSize: '0.75rem', color: '#DC2626', marginTop: '0.35rem', fontWeight: 600 }}>
              ⚠️ {locationError}
            </div>
          )}

          {userLocation && (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #86EFAC',
                borderRadius: '8px',
                padding: '0.65rem 0.85rem',
                marginTop: '0.5rem'
              }}
            >
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.3rem' }}>
                📍 Coordinates: {userLocation.latitude}, {userLocation.longitude} (±{userLocation.accuracy}m)
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleCopyLocation}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.35rem 0.65rem',
                    backgroundColor: copiedLocation ? '#DCFCE7' : '#F1F5F9',
                    color: copiedLocation ? '#166534' : '#334155',
                    border: '1px solid #CBD5E1',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  {copiedLocation ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedLocation ? 'Copied Alert Link!' : 'Copy Alert Link'}</span>
                </button>

                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `EMERGENCY ALERT: I am at https://www.google.com/maps?q=${userLocation.latitude},${userLocation.longitude}. Please assist.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.35rem 0.65rem',
                    backgroundColor: '#25D366',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    textDecoration: 'none'
                  }}
                >
                  <Share2 size={13} /> Share on WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            width: '100%',
            padding: '0.75rem',
            borderRadius: '12px',
            backgroundColor: '#F1F5F9',
            color: '#334155',
            fontWeight: 700,
            fontSize: '0.88rem',
            border: '1px solid #CBD5E1',
            cursor: 'pointer'
          }}
        >
          Close Emergency Dialer
        </button>
      </div>
    </div>
  );
}
