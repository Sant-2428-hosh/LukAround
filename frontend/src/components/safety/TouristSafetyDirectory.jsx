import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Phone,
  MapPin,
  Navigation,
  ExternalLink,
  Info,
  CheckCircle2,
  AlertTriangle,
  HeartPulse,
  Compass,
  Clock,
  Building2,
  Copy,
  Check,
  Search,
  Filter,
  Loader2,
  Radio,
  Siren,
  Shield
} from 'lucide-react';
import { getNearbyFacilitiesApi } from '../../api/client';
import {
  getNearbyEmergencyFacilities,
  OFFICIAL_EMERGENCY_SERVICES,
  getDestinationSafetyAdvisories
} from '../../utils/emergencyService';
import { states, cities, attractions } from '../../data/indiaTourismData';
import EmergencySOSModal from './EmergencySOSModal';

export default function TouristSafetyDirectory({
  destinationId = null,
  destination = null,
  initialState = null,
  initialCity = null,
  initialAttraction = null,
  showHeader = true,
  isEmbedded = false
}) {
  // 1. Resolve initial destination from destinationId, destination, or explicit props
  const resolvedTarget = useMemo(() => {
    // If destination object was passed
    if (destination) {
      if (destination.city && destination.state) {
        return {
          state: destination.state,
          city: destination.city,
          attractionId: destination.id || null
        };
      }
      if (destination.latitude && destination.state) {
        return {
          state: destination.state,
          city: destination.name,
          attractionId: null
        };
      }
      if (destination.name) {
        return {
          state: destination.name,
          city: null,
          attractionId: null
        };
      }
    }

    // If destinationId string was passed
    if (destinationId) {
      const dLower = String(destinationId).toLowerCase().trim();
      const attr = attractions.find(
        (a) => a.id.toLowerCase() === dLower || a.name.toLowerCase() === dLower
      );
      if (attr) {
        return { state: attr.state, city: attr.city, attractionId: attr.id };
      }
      const city = cities.find(
        (c) => c.id.toLowerCase() === dLower || c.name.toLowerCase() === dLower
      );
      if (city) {
        return { state: city.state, city: city.name, attractionId: null };
      }
      const state = states.find(
        (s) => s.id?.toLowerCase() === dLower || s.slug?.toLowerCase() === dLower || s.name.toLowerCase() === dLower
      );
      if (state) {
        return { state: state.name, city: null, attractionId: null };
      }
    }

    // Fallback to explicit initial props
    const sName = initialState?.name || (typeof initialState === 'string' ? initialState : null);
    const cName = initialCity?.name || (typeof initialCity === 'string' ? initialCity : null);
    const aId = initialAttraction?.id || (typeof initialAttraction === 'string' ? initialAttraction : null);

    if (sName || cName) {
      return {
        state: sName || (cName ? cities.find(c => c.name.toLowerCase() === cName.toLowerCase())?.state : null) || states[0]?.name || 'Rajasthan',
        city: cName || '',
        attractionId: aId || ''
      };
    }

    // Default to the first state in tourism directory (Rajasthan / Jaipur)
    const defState = states[0]?.name || 'Rajasthan';
    const defCity = cities.find(c => c.state?.toLowerCase() === defState.toLowerCase())?.name || 'Jaipur';
    return {
      state: defState,
      city: defCity,
      attractionId: ''
    };
  }, [destinationId, destination, initialState, initialCity, initialAttraction]);

  // Synchronous Cascading State
  const [selectedStateName, setSelectedStateName] = useState(resolvedTarget.state);

  const availableCities = useMemo(() => {
    return cities.filter(
      (c) => c.state?.toLowerCase() === (selectedStateName || '').toLowerCase()
    );
  }, [selectedStateName]);

  const [selectedCityName, setSelectedCityName] = useState(() => {
    if (resolvedTarget.city) return resolvedTarget.city;
    const match = cities.find(c => c.state?.toLowerCase() === (resolvedTarget.state || '').toLowerCase());
    return match?.name || '';
  });

  const availableAttractions = useMemo(() => {
    return attractions.filter(
      (a) => a.city?.toLowerCase() === (selectedCityName || '').toLowerCase()
    );
  }, [selectedCityName]);

  const [selectedAttractionId, setSelectedAttractionId] = useState(resolvedTarget.attractionId || '');

  // Synchronous handlers to prevent state desynchronization
  const handleStateChange = (newStateName) => {
    setSelectedStateName(newStateName);
    const matchingCities = cities.filter((c) => c.state?.toLowerCase() === newStateName.toLowerCase());
    const newCity = matchingCities[0]?.name || '';
    setSelectedCityName(newCity);
    const matchingAttrs = attractions.filter((a) => a.city?.toLowerCase() === newCity.toLowerCase());
    setSelectedAttractionId(matchingAttrs[0]?.id || '');
  };

  const handleCityChange = (newCityName) => {
    setSelectedCityName(newCityName);
    const matchingAttrs = attractions.filter((a) => a.city?.toLowerCase() === newCityName.toLowerCase());
    setSelectedAttractionId(matchingAttrs[0]?.id || '');
  };

  const handleAttractionChange = (newAttrId) => {
    setSelectedAttractionId(newAttrId);
  };

  // Sync when prop changes
  useEffect(() => {
    if (resolvedTarget.state && resolvedTarget.state !== selectedStateName) {
      setSelectedStateName(resolvedTarget.state);
    }
    if (resolvedTarget.city && resolvedTarget.city !== selectedCityName) {
      setSelectedCityName(resolvedTarget.city);
    }
    if (resolvedTarget.attractionId !== undefined && resolvedTarget.attractionId !== selectedAttractionId) {
      setSelectedAttractionId(resolvedTarget.attractionId);
    }
  }, [resolvedTarget]);

  // Search Radius & Active Category Tab
  const [selectedRadiusKm, setSelectedRadiusKm] = useState(10);
  const [activeCategoryTab, setActiveCategoryTab] = useState('all'); // 'all', 'police', 'hospitals', 'helplines', 'safety'
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(null);

  // Exact Destination & Origin Resolution
  const resolvedOrigin = useMemo(() => {
    if (selectedAttractionId) {
      const attr = attractions.find((a) => a.id === selectedAttractionId);
      if (attr?.coordinates?.latitude && attr?.coordinates?.longitude) {
        return {
          lat: attr.coordinates.latitude,
          lng: attr.coordinates.longitude,
          name: attr.name,
          type: 'attraction',
          city: attr.city,
          state: attr.state,
          id: attr.id,
          isVerified: true
        };
      }
    }

    const currentCityObj = cities.find(
      (c) => c.name?.toLowerCase() === (selectedCityName || '').toLowerCase() || c.id?.toLowerCase() === (selectedCityName || '').toLowerCase()
    );
    if (currentCityObj?.latitude && currentCityObj?.longitude) {
      return {
        lat: currentCityObj.latitude,
        lng: currentCityObj.longitude,
        name: currentCityObj.name,
        type: 'city',
        city: currentCityObj.name,
        state: currentCityObj.state,
        id: currentCityObj.id,
        isVerified: true
      };
    }

    const currentStateObj = states.find((s) => s.name?.toLowerCase() === (selectedStateName || '').toLowerCase());
    if (currentStateObj) {
      const firstCityInState = cities.find((c) => c.state?.toLowerCase() === currentStateObj.name.toLowerCase());
      if (firstCityInState?.latitude && firstCityInState?.longitude) {
        return {
          lat: firstCityInState.latitude,
          lng: firstCityInState.longitude,
          name: firstCityInState.name,
          type: 'city',
          city: firstCityInState.name,
          state: currentStateObj.name,
          id: firstCityInState.id,
          isVerified: true
        };
      }
    }

    return {
      lat: null,
      lng: null,
      name: selectedCityName || selectedStateName || 'Selected Destination',
      type: 'unknown',
      city: selectedCityName,
      state: selectedStateName,
      id: null,
      isVerified: false
    };
  }, [selectedAttractionId, selectedCityName, selectedStateName]);

  // Parameterized In-Memory Cache and Race-Condition Guard
  const cacheRef = useRef(new Map());
  const activeRequestIdRef = useRef(0);

  const [facilityState, setFacilityState] = useState({
    loading: true,
    error: null,
    allFacilities: [],
    policeStations: [],
    hospitals: [],
    outOfRadiusNotice: false,
    totalCount: 0,
    unresolvedLocation: false
  });

  // Asynchronous location-specific facility retrieval
  // ALWAYS fetch both police and hospitals for the destination so tabs are populated and instantaneous
  useEffect(() => {
    const currentReqId = ++activeRequestIdRef.current;
    const abortController = new AbortController();

    if (!resolvedOrigin.lat || !resolvedOrigin.lng) {
      setFacilityState({
        loading: false,
        error: null,
        allFacilities: [],
        policeStations: [],
        hospitals: [],
        outOfRadiusNotice: false,
        totalCount: 0,
        unresolvedLocation: !resolvedOrigin.isVerified
      });
      return;
    }

    const cacheKey = `emergency-facilities:${resolvedOrigin.lat.toFixed(4)}:${resolvedOrigin.lng.toFixed(4)}:${selectedRadiusKm}`;

    if (cacheRef.current.has(cacheKey)) {
      const cached = cacheRef.current.get(cacheKey);
      setFacilityState({
        loading: false,
        error: null,
        ...cached
      });
      return;
    }

    // Mark as loading to prevent stale data display
    setFacilityState((prev) => ({
      ...prev,
      loading: true,
      error: null
    }));

    async function fetchLocationFacilities() {
      try {
        const res = await getNearbyFacilitiesApi({
          lat: resolvedOrigin.lat,
          lng: resolvedOrigin.lng,
          city: selectedCityName,
          state: selectedStateName,
          radius: selectedRadiusKm,
          destination: resolvedOrigin.name,
          attractionId: selectedAttractionId || undefined,
          signal: abortController.signal
        });

        // Discard stale request responses
        if (currentReqId !== activeRequestIdRef.current) return;

        if (res && res.success) {
          const payload = {
            allFacilities: res.facilities || [],
            policeStations: res.policeStations || [],
            hospitals: res.hospitals || [],
            outOfRadiusNotice: (res.policeStations?.length === 0 || res.hospitals?.length === 0),
            totalCount: res.totalCount || 0,
            unresolvedLocation: false
          };
          cacheRef.current.set(cacheKey, payload);
          setFacilityState({
            loading: false,
            error: null,
            ...payload
          });
          return;
        }
        throw new Error(res?.error || 'Failed to fetch facilities');
      } catch (err) {
        if (err.name === 'AbortError') return;
        if (currentReqId !== activeRequestIdRef.current) return;

        // Fallback to strict client evaluation without cross-city leaks
        const fallback = getNearbyEmergencyFacilities({
          targetLat: resolvedOrigin.lat,
          targetLng: resolvedOrigin.lng,
          cityName: selectedCityName,
          stateName: selectedStateName,
          radiusKm: selectedRadiusKm,
          facilityTypeFilter: 'all'
        });

        const payload = {
          allFacilities: fallback.allFacilities,
          policeStations: fallback.policeStations,
          hospitals: fallback.hospitals,
          outOfRadiusNotice: fallback.outOfRadiusNotice,
          totalCount: fallback.totalCount,
          unresolvedLocation: fallback.unresolvedLocation || false
        };
        cacheRef.current.set(cacheKey, payload);
        setFacilityState({
          loading: false,
          error: null,
          ...payload
        });
      }
    }

    fetchLocationFacilities();

    return () => {
      abortController.abort();
    };
  }, [resolvedOrigin.lat, resolvedOrigin.lng, resolvedOrigin.name, selectedRadiusKm, selectedCityName, selectedStateName, selectedAttractionId]);

  // Destination Safety Advisories
  const safetyAdvisories = useMemo(() => {
    return getDestinationSafetyAdvisories(selectedCityName, selectedStateName);
  }, [selectedCityName, selectedStateName]);

  const handleCopyNumber = (phone, id) => {
    navigator.clipboard?.writeText(phone);
    setCopiedPhone(id);
    setTimeout(() => setCopiedPhone(null), 2500);
  };

  return (
    <section className="tourist-safety-system" id="safety-directory">
      <div className={isEmbedded ? '' : 'tourism-container'}>
        
        {/* Optional Header */}
        {showHeader && (
          <div style={{ maxWidth: '820px', marginBottom: '2rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
                border: '1px solid #FECACA',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                marginBottom: '0.75rem'
              }}
            >
              <ShieldCheck size={14} />
              <span>24/7 Verified Tourist Safety & Emergency Services</span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-display, serif)',
                fontSize: 'clamp(1.9rem, 3.2vw, 2.7rem)',
                fontWeight: 800,
                color: '#0F172A',
                lineHeight: 1.15,
                margin: '0 0 0.65rem 0'
              }}
            >
              Tourist Safety & Police Directory in {selectedCityName || selectedStateName}
            </h1>

            <p style={{ fontSize: '0.96rem', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
              Find real nearby hospitals, jurisdictional police stations, ambulance dispatch numbers, 
              and destination-specific safety guidance for your exact location.
            </p>
          </div>
        )}

        {/* ── Active Destination Selector Bar & SOS Button ── */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--tourism-sand-border, #E2E8F0)',
            borderRadius: '16px',
            padding: '1.25rem 1.5rem',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.05)',
            marginBottom: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.25rem'
          }}
        >
          {/* Cascading Controls */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', alignItems: 'center', flex: 1, minWidth: '280px' }}>
            
            {/* 1. State Selector */}
            <div style={{ minWidth: '150px' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748B', marginBottom: '0.25rem' }}>
                State / UT ({states.length} States)
              </label>
              <select
                value={selectedStateName}
                onChange={(e) => handleStateChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  backgroundColor: '#F8FAFC',
                  color: '#0F172A',
                  cursor: 'pointer'
                }}
              >
                {states.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* 2. City Selector */}
            <div style={{ minWidth: '160px' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748B', marginBottom: '0.25rem' }}>
                Destination City ({availableCities.length})
              </label>
              <select
                value={selectedCityName}
                onChange={(e) => handleCityChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  backgroundColor: '#F8FAFC',
                  color: '#0F172A',
                  cursor: 'pointer'
                }}
              >
                {availableCities.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* 3. Attraction / Search Origin Selector */}
            {availableAttractions.length > 0 && (
              <div style={{ minWidth: '180px', flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748B', marginBottom: '0.25rem' }}>
                  Tourist Attraction Origin
                </label>
                <select
                  value={selectedAttractionId}
                  onChange={(e) => handleAttractionChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    backgroundColor: '#F8FAFC',
                    color: '#0F172A',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">City Center ({selectedCityName})</option>
                  {availableAttractions.map((a) => (
                    <option key={a.id} value={a.id}>📍 {a.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* 4. Radius Selector */}
            <div style={{ minWidth: '120px' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748B', marginBottom: '0.25rem' }}>
                Search Radius
              </label>
              <select
                value={selectedRadiusKm}
                onChange={(e) => setSelectedRadiusKm(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  backgroundColor: '#F8FAFC',
                  color: '#0F172A',
                  cursor: 'pointer'
                }}
              >
                <option value={1}>Within 1 km</option>
                <option value={2}>Within 2 km</option>
                <option value={5}>Within 5 km</option>
                <option value={10}>Within 10 km</option>
                <option value={20}>Within 20 km</option>
              </select>
            </div>

          </div>

          {/* Emergency SOS Dialer Trigger Button */}
          <div style={{ flexShrink: 0 }}>
            <button
              type="button"
              onClick={() => setIsSosOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '0.75rem 1.35rem',
                fontSize: '0.9rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(220, 38, 38, 0.35)',
                transition: 'all 0.2s ease'
              }}
            >
              <ShieldAlert size={18} />
              <span>Open Emergency SOS Dialer</span>
            </button>
          </div>
        </div>

        {/* ── Active Origin Confirmation Banner (Geographic Transparency) ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.65rem',
            marginBottom: '1.25rem',
            padding: '0.75rem 1.15rem',
            backgroundColor: '#F8FAFC',
            borderRadius: '12px',
            border: '1px solid #E2E8F0'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#0F172A', fontWeight: 700 }}>
            <MapPin size={16} color="#DC2626" />
            <span>Active Destination Origin: <strong>{resolvedOrigin.name}</strong> ({selectedCityName}, {selectedStateName})</span>
            {resolvedOrigin.lat != null && (
              <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500, backgroundColor: '#FFFFFF', padding: '0.15rem 0.45rem', borderRadius: '4px', border: '1px solid #E2E8F0' }}>
                GPS: {resolvedOrigin.lat.toFixed(4)}, {resolvedOrigin.lng.toFixed(4)}
              </span>
            )}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>
            Radius: <strong>{selectedRadiusKm} km</strong> • {facilityState.loading ? (
              <span style={{ color: '#C85A32', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <Loader2 size={13} className="spin" /> Searching facilities...
              </span>
            ) : (
              <span>{facilityState.totalCount} verified facilities found</span>
            )}
          </div>
        </div>

        {/* Unresolved Location Warning */}
        {facilityState.unresolvedLocation && (
          <div
            style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '2rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#DC2626', fontWeight: 800 }}>
              <AlertTriangle size={18} />
              <span>Location Verification Notice</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#7F1D1D', margin: '0.5rem 0 0.75rem 0' }}>
              Verified coordinates for "{resolvedOrigin.name}" could not be confirmed. For genuine emergencies anywhere in India, dial unified national dispatch at <strong>112</strong>.
            </p>
          </div>
        )}

        {/* ── Category Filter Tabs ── */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginBottom: '1.75rem',
            borderBottom: '1px solid #E2E8F0',
            paddingBottom: '0.75rem'
          }}
        >
          {[
            { id: 'all', label: 'All Verified Facilities', icon: ShieldCheck },
            { id: 'police', label: `🚓 Police Stations (${facilityState.policeStations.length})`, icon: null },
            { id: 'hospitals', label: `🏥 Hospitals & Emergency (${facilityState.hospitals.length})`, icon: null },
            { id: 'helplines', label: '🚑 India Emergency Numbers (112 / 1363)', icon: null },
            { id: 'safety', label: '🛡️ Destination Safety Advice', icon: null }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveCategoryTab(tab.id)}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '9999px',
                fontSize: '0.82rem',
                fontWeight: 700,
                border: activeCategoryTab === tab.id ? '1px solid #DC2626' : '1px solid #CBD5E1',
                backgroundColor: activeCategoryTab === tab.id ? '#DC2626' : '#FFFFFF',
                color: activeCategoryTab === tab.id ? '#FFFFFF' : '#475569',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Central Emergency Contacts in India Section ── */}
        {(activeCategoryTab === 'all' || activeCategoryTab === 'helplines') && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--tourism-sand-border, #E2E8F0)',
              borderRadius: '16px',
              padding: '1.5rem',
              marginBottom: '2rem',
              boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Emergency Numbers in India
                </h2>
                <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                  Authoritative national helplines operating 24/7 across all states and union territories
                </span>
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#16A34A', backgroundColor: '#DCFCE7', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                ✓ Official Government Services
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem'
              }}
            >
              {OFFICIAL_EMERGENCY_SERVICES.map((srv) => (
                <div
                  key={srv.code}
                  style={{
                    backgroundColor: srv.isPrimary ? '#FEF2F2' : '#F8FAFC',
                    border: srv.isPrimary ? '1.5px solid #FECACA' : '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minWidth: 0
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '1.35rem', fontWeight: 900, color: srv.isPrimary ? '#DC2626' : '#0F172A' }}>
                        {srv.code}
                      </span>
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#475569', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                        {srv.badge}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
                      {srv.name}
                    </div>

                    <p style={{ fontSize: '0.75rem', color: '#64748B', lineHeight: 1.4, margin: '0 0 0.85rem 0' }}>
                      {srv.shortDesc}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: 'auto' }}>
                    <a
                      href={srv.telLink}
                      style={{
                        flex: 1,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.35rem',
                        padding: '0.45rem',
                        borderRadius: '6px',
                        backgroundColor: srv.isPrimary ? '#DC2626' : '#0F172A',
                        color: '#FFFFFF',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        textDecoration: 'none'
                      }}
                    >
                      <Phone size={13} />
                      <span>Call {srv.code}</span>
                    </a>

                    <a
                      href={srv.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open Official Portal"
                      style={{
                        padding: '0.45rem 0.65rem',
                        borderRadius: '6px',
                        backgroundColor: '#FFFFFF',
                        color: '#475569',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.75rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        textDecoration: 'none'
                      }}
                    >
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Core Facility Grid (Police, Hospitals, Safety) ── */}
        {(activeCategoryTab === 'all' || activeCategoryTab === 'police' || activeCategoryTab === 'hospitals') && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: activeCategoryTab === 'all' ? 'repeat(auto-fit, minmax(320px, 1fr))' : '1fr',
              gap: '1.5rem',
              alignItems: 'stretch',
              marginBottom: '3rem'
            }}
          >
            
            {/* CARD 1: Enhanced Local Police Stations & Tourist Assistance */}
            {(activeCategoryTab === 'all' || activeCategoryTab === 'police') && (
              <div
                className="card"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid var(--tourism-sand-border, #E2E8F0)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: 0,
                  boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.15rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#FCEEE8', color: '#C85A32', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        Local Police Stations & Tourist Assistance
                      </h2>
                      <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
                        Jurisdictional police stations near {resolvedOrigin.name} ({facilityState.policeStations.length} verified)
                      </span>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#C85A32', backgroundColor: '#FFF5F0', border: '1px solid #FED7AA', padding: '0.2rem 0.55rem', borderRadius: '6px' }}>
                    ✓ 24/7 Patrol & Tourist Assistance
                  </span>
                </div>

                {facilityState.loading ? (
                  <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: '#64748B' }}>
                    <Loader2 size={24} className="spin" style={{ margin: '0 auto 0.5rem auto', color: '#C85A32' }} />
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Locating police stations for {resolvedOrigin.name}...</div>
                  </div>
                ) : facilityState.policeStations.length === 0 ? (
                  /* Honest Empty State for Police Stations */
                  <div
                    style={{
                      padding: '2.5rem 1.5rem',
                      textAlign: 'center',
                      backgroundColor: '#F8FAFC',
                      borderRadius: '12px',
                      border: '1px dashed #CBD5E1',
                      margin: 'auto 0'
                    }}
                  >
                    <ShieldAlert size={36} color="#94A3B8" style={{ margin: '0 auto 0.75rem auto' }} />
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#334155', marginBottom: '0.35rem' }}>
                      No verified police stations found within this search radius.
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#64748B', maxWidth: '360px', margin: '0 auto 1.25rem auto', lineHeight: 1.5 }}>
                      No police outpost is situated directly within {selectedRadiusKm} km of {resolvedOrigin.name}. For immediate assistance anywhere in India, dial 112.
                    </p>
                    {selectedRadiusKm < 20 && (
                      <button
                        type="button"
                        onClick={() => setSelectedRadiusKm((prev) => (prev <= 5 ? 10 : 20))}
                        style={{
                          padding: '0.5rem 1.15rem',
                          borderRadius: '8px',
                          backgroundColor: '#C85A32',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Expand radius to {selectedRadiusKm <= 5 ? '10 km' : '20 km'}
                      </button>
                    )}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem', flex: 1 }}>
                    {facilityState.policeStations.map((ps) => (
                      <div
                        key={ps.id}
                        style={{
                          padding: '1.1rem',
                          backgroundColor: '#F8FAFC',
                          borderRadius: '12px',
                          border: '1px solid #E2E8F0',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.45rem',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {/* Title and Distance */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                          <div style={{ fontWeight: 800, fontSize: '0.96rem', color: '#0F172A', lineHeight: 1.3 }}>
                            {ps.name}
                          </div>
                          {ps.distanceKm != null && (
                            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#C85A32', backgroundColor: '#FFF5F0', border: '1px solid #FFEDD5', padding: '0.2rem 0.5rem', borderRadius: '5px', flexShrink: 0 }}>
                              ~{ps.distanceKm} km
                            </span>
                          )}
                        </div>

                        {/* Category and Service Badges */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#334155', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                            🏛️ {ps.categoryName || 'Local Police Precinct'}
                          </span>
                          {ps.facilityType === 'tourist_police' && (
                            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#C85A32', backgroundColor: '#FFEDD5', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                              🚓 Tourist Police Desk
                            </span>
                          )}
                          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#16A34A', backgroundColor: '#DCFCE7', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                            ✓ 24/7 Patrol & Helpdesk
                          </span>
                        </div>

                        {/* Address */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.8rem', color: '#64748B', lineHeight: 1.4 }}>
                          <MapPin size={14} style={{ flexShrink: 0, marginTop: '2px', color: '#C85A32' }} />
                          <span>{ps.address}</span>
                        </div>

                        {/* Road Transit Time */}
                        {ps.roadTime && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.74rem', color: '#10B981', fontWeight: 700 }}>
                            <Clock size={13} />
                            <span>Estimated Transit: {ps.roadTime}</span>
                          </div>
                        )}

                        {/* Phone & Verification Badge & Navigation Actions */}
                        <div style={{ marginTop: '0.4rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.6rem', borderTop: '1px solid #EEF2F6', paddingTop: '0.75rem' }}>
                          <div>
                            {ps.publicPhone ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                <a
                                  href={`tel:${ps.publicPhone}`}
                                  style={{
                                    fontSize: '0.88rem',
                                    fontWeight: 800,
                                    color: '#C85A32',
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    backgroundColor: '#FFF5F0',
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: '5px'
                                  }}
                                >
                                  <Phone size={13} /> {ps.publicPhone}
                                </a>
                                <button
                                  type="button"
                                  onClick={() => handleCopyNumber(ps.publicPhone, ps.id)}
                                  title="Copy Phone Number"
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
                                >
                                  {copiedPhone === ps.id ? <Check size={14} color="#16A34A" /> : <Copy size={14} />}
                                </button>
                              </div>
                            ) : (
                              <span style={{ fontSize: '0.74rem', color: '#64748B', fontStyle: 'italic' }}>
                                Contact number pending official update. Use 112 in emergency.
                              </span>
                            )}

                            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: ps.phoneVerificationStatus === 'officially_published' ? '#16A34A' : '#D97706', marginTop: '0.2rem' }}>
                              {ps.phoneVerificationStatus === 'officially_published' ? '✓ Officially Published Directory' : '⚠️ Public Listing — Official Confirmation Needed'}
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            {ps.mapsUrl && (
                              <a
                                href={ps.mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  fontSize: '0.74rem',
                                  fontWeight: 700,
                                  color: '#334155',
                                  backgroundColor: '#FFFFFF',
                                  border: '1px solid #CBD5E1',
                                  padding: '0.35rem 0.65rem',
                                  borderRadius: '6px',
                                  textDecoration: 'none',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem'
                                }}
                              >
                                <ExternalLink size={12} /> Map
                              </a>
                            )}
                            {ps.directionsUrl && (
                              <a
                                href={ps.directionsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  fontSize: '0.74rem',
                                  fontWeight: 700,
                                  color: '#FFFFFF',
                                  backgroundColor: '#C85A32',
                                  border: 'none',
                                  padding: '0.35rem 0.75rem',
                                  borderRadius: '6px',
                                  textDecoration: 'none',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem'
                                }}
                              >
                                <Navigation size={12} /> Directions
                              </a>
                            )}
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

                {/* Police Emergency Quick Footer */}
                <div
                  style={{
                    marginTop: '1.25rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#FFF7ED',
                    border: '1px solid #FFEDD5',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    fontSize: '0.76rem',
                    color: '#9A3412'
                  }}
                >
                  <div>
                    Emergency police dispatch anywhere in India: <strong>Dial 112</strong> or Women Helpline <strong>1091</strong>.
                  </div>
                  <a
                    href="tel:112"
                    style={{
                      padding: '0.3rem 0.7rem',
                      borderRadius: '6px',
                      backgroundColor: '#EA580C',
                      color: '#FFFFFF',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      textDecoration: 'none',
                      flexShrink: 0
                    }}
                  >
                    Call 112
                  </a>
                </div>
              </div>
            )}

            {/* CARD 2: Enhanced Nearby Hospitals & Trauma Care */}
            {(activeCategoryTab === 'all' || activeCategoryTab === 'hospitals') && (
              <div
                className="card"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid var(--tourism-sand-border, #E2E8F0)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: 0,
                  boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.15rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <HeartPulse size={20} />
                    </div>
                    <div>
                      <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        Nearby Hospitals & Trauma Care
                      </h2>
                      <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
                        Emergency medical facilities near {resolvedOrigin.name} ({facilityState.hospitals.length} verified)
                      </span>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#DC2626', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', padding: '0.2rem 0.55rem', borderRadius: '6px' }}>
                    ✓ 24/7 Casualty & Acute Trauma
                  </span>
                </div>

                {facilityState.loading ? (
                  <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: '#64748B' }}>
                    <Loader2 size={24} className="spin" style={{ margin: '0 auto 0.5rem auto', color: '#DC2626' }} />
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Locating hospitals near {resolvedOrigin.name}...</div>
                  </div>
                ) : facilityState.hospitals.length === 0 ? (
                  /* Honest Empty State for Hospitals */
                  <div
                    style={{
                      padding: '2.5rem 1.5rem',
                      textAlign: 'center',
                      backgroundColor: '#F8FAFC',
                      borderRadius: '12px',
                      border: '1px dashed #CBD5E1',
                      margin: 'auto 0'
                    }}
                  >
                    <HeartPulse size={36} color="#94A3B8" style={{ margin: '0 auto 0.75rem auto' }} />
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#334155', marginBottom: '0.35rem' }}>
                      No verified hospitals found within this search radius.
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#64748B', maxWidth: '360px', margin: '0 auto 1.25rem auto', lineHeight: 1.5 }}>
                      No verified acute emergency medical post is located directly within {selectedRadiusKm} km of {resolvedOrigin.name}. For immediate ambulance dispatch, dial 108 or 112.
                    </p>
                    {selectedRadiusKm < 20 && (
                      <button
                        type="button"
                        onClick={() => setSelectedRadiusKm((prev) => (prev <= 5 ? 10 : 20))}
                        style={{
                          padding: '0.5rem 1.15rem',
                          borderRadius: '8px',
                          backgroundColor: '#DC2626',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Expand radius to {selectedRadiusKm <= 5 ? '10 km' : '20 km'}
                      </button>
                    )}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem', flex: 1 }}>
                    {facilityState.hospitals.map((hp) => (
                      <div
                        key={hp.id}
                        style={{
                          padding: '1.1rem',
                          backgroundColor: '#F8FAFC',
                          borderRadius: '12px',
                          border: '1px solid #E2E8F0',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.45rem',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                          <div style={{ fontWeight: 800, fontSize: '0.96rem', color: '#0F172A', lineHeight: 1.3 }}>
                            {hp.name}
                          </div>
                          {hp.distanceKm != null && (
                            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#DC2626', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', padding: '0.2rem 0.5rem', borderRadius: '5px', flexShrink: 0 }}>
                              ~{hp.distanceKm} km
                            </span>
                          )}
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#334155', backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                            🏥 {hp.categoryName || 'Hospital & Trauma Care'}
                          </span>
                          {hp.emergencyDepartmentAvailable && (
                            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#DC2626', backgroundColor: '#FEE2E2', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                              24/7 Casualty & ICU
                            </span>
                          )}
                          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#16A34A', backgroundColor: '#DCFCE7', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                            ✓ Active Medical Center
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.8rem', color: '#64748B', lineHeight: 1.4 }}>
                          <MapPin size={14} style={{ flexShrink: 0, marginTop: '2px', color: '#DC2626' }} />
                          <span>{hp.address}</span>
                        </div>

                        {hp.roadTime && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.74rem', color: '#10B981', fontWeight: 700 }}>
                            <Clock size={13} />
                            <span>Estimated Transit: {hp.roadTime}</span>
                          </div>
                        )}

                        {/* Phone & Actions */}
                        <div style={{ marginTop: '0.4rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.6rem', borderTop: '1px solid #EEF2F6', paddingTop: '0.75rem' }}>
                          <div>
                            {hp.publicPhone ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                <a
                                  href={`tel:${hp.publicPhone}`}
                                  style={{
                                    fontSize: '0.88rem',
                                    fontWeight: 800,
                                    color: '#DC2626',
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    backgroundColor: '#FEF2F2',
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: '5px'
                                  }}
                                >
                                  <Phone size={13} /> {hp.publicPhone}
                                </a>
                                <button
                                  type="button"
                                  onClick={() => handleCopyNumber(hp.publicPhone, hp.id)}
                                  title="Copy Phone Number"
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
                                >
                                  {copiedPhone === hp.id ? <Check size={14} color="#16A34A" /> : <Copy size={14} />}
                                </button>
                              </div>
                            ) : (
                              <span style={{ fontSize: '0.74rem', color: '#64748B', fontStyle: 'italic' }}>
                                Dial 108 or 112 for ambulance emergency dispatch.
                              </span>
                            )}

                            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: hp.phoneVerificationStatus === 'officially_published' ? '#16A34A' : '#D97706', marginTop: '0.2rem' }}>
                              {hp.phoneVerificationStatus === 'officially_published' ? '✓ Officially Published Directory' : '⚠️ Public Listing — Official Confirmation Needed'}
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            {hp.mapsUrl && (
                              <a
                                href={hp.mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  fontSize: '0.74rem',
                                  fontWeight: 700,
                                  color: '#334155',
                                  backgroundColor: '#FFFFFF',
                                  border: '1px solid #CBD5E1',
                                  padding: '0.35rem 0.65rem',
                                  borderRadius: '6px',
                                  textDecoration: 'none',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem'
                                }}
                              >
                                <ExternalLink size={12} /> Map
                              </a>
                            )}
                            {hp.directionsUrl && (
                              <a
                                href={hp.directionsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  fontSize: '0.74rem',
                                  fontWeight: 700,
                                  color: '#FFFFFF',
                                  backgroundColor: '#DC2626',
                                  border: 'none',
                                  padding: '0.35rem 0.75rem',
                                  borderRadius: '6px',
                                  textDecoration: 'none',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem'
                                }}
                              >
                                <Navigation size={12} /> Directions
                              </a>
                            )}
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}

                {/* Hospital Emergency Quick Footer */}
                <div
                  style={{
                    marginTop: '1.25rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FEE2E2',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    fontSize: '0.76rem',
                    color: '#991B1B'
                  }}
                >
                  <div>
                    Need immediate ambulance medical dispatch? <strong>Dial 108</strong> (Toll-Free EMS Ambulance).
                  </div>
                  <a
                    href="tel:108"
                    style={{
                      padding: '0.3rem 0.7rem',
                      borderRadius: '6px',
                      backgroundColor: '#DC2626',
                      color: '#FFFFFF',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      textDecoration: 'none',
                      flexShrink: 0
                    }}
                  >
                    Call 108
                  </a>
                </div>
              </div>
            )}

            {/* CARD 3: Destination Travel Safety Tips */}
            {(activeCategoryTab === 'all' || activeCategoryTab === 'safety') && (
              <div
                className="card"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid var(--tourism-sand-border, #E2E8F0)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: 0,
                  boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.15rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      Travel Safety Tips ({selectedCityName || selectedStateName})
                    </h2>
                    <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
                      Official advisories from Ministry of Tourism & Local Administration
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1 }}>
                  {safetyAdvisories.map((adv, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '0.9rem',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '10px',
                        border: '1px solid #E2E8F0'
                      }}
                    >
                      <div style={{ fontWeight: 800, fontSize: '0.86rem', color: '#0F172A', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ color: '#16A34A', fontWeight: 900 }}>✓</span>
                        <span>{adv.title}</span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.45, margin: 0 }}>
                        {adv.detail}
                      </p>
                      <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '0.35rem', fontStyle: 'italic' }}>
                        Source: {adv.verifiedSource}
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    marginTop: '1.25rem',
                    padding: '0.85rem',
                    backgroundColor: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: '#1E40AF', fontWeight: 600 }}>
                    Emergency in India? Dial <strong>112</strong> or call Tourist Desk at <strong>1363</strong>.
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSosOpen(true)}
                    style={{
                      backgroundColor: '#2563EB',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.4rem 0.75rem',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      flexShrink: 0
                    }}
                  >
                    Open SOS
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Floating Emergency SOS Modal */}
      <EmergencySOSModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        nearestHospital={facilityState.hospitals[0] || null}
        nearestPolice={facilityState.policeStations[0] || null}
        currentDestinationName={resolvedOrigin.name}
      />
    </section>
  );
}
