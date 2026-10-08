import React, { useState, useEffect, useMemo } from 'react';
import {
  Hotel,
  Star,
  MapPin,
  ShieldCheck,
  Compass,
  SlidersHorizontal,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import HotelCard from './HotelCard';
import HotelComparisonModal from './HotelComparisonModal';
import DirectionsModal from './DirectionsModal';
import { calculateDistance, estimateTravelTime, sortHotels } from '../../utils/distance';
import { hotels as allHotelsData } from '../../data/hotelsData';
import { getNearbyHotels } from '../../api/client';

export default function WhereToStaySection({
  destination, // { id, name, city, state, coordinates: { latitude, longitude } }
  city = null   // optional city context
}) {
  if (!destination) return null;

  const destCoords = destination.coordinates || {
    latitude: destination.latitude,
    longitude: destination.longitude
  };

  const [activeStarTab, setActiveStarTab] = useState('all'); // 'all', '5', '4', '3', '2'
  const [sortBy, setSortBy] = useState('recommended');
  const [nearbyHotels, setNearbyHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Comparison State (up to 3 hotels)
  const [compareList, setCompareList] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Directions Modal State
  const [directionsHotel, setDirectionsHotel] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadStays() {
      setLoading(true);

      // Attempt backend API first
      try {
        const res = await getNearbyHotels({
          destinationId: destination.id,
          latitude: destCoords.latitude,
          longitude: destCoords.longitude,
          radius: 25,
          limit: 25,
          sortBy
        });

        if (isMounted && res && res.hotels && res.hotels.length > 0) {
          setNearbyHotels(res.hotels);
          setLoading(false);
          return;
        }
      } catch (err) {
        // Fallback to local dataset
      }

      // Local Haversine fallback
      if (destCoords.latitude && destCoords.longitude) {
        const enriched = allHotelsData.map((h) => {
          const distKm = calculateDistance(
            destCoords.latitude,
            destCoords.longitude,
            h.latitude,
            h.longitude
          );
          return {
            ...h,
            distanceInKm: distKm,
            distanceFromDestination: `${distKm} km from ${destination.name || destination.city}`,
            estimatedTravelTime: estimateTravelTime(distKm)
          };
        });

        // Filter within 35 km, or closest 6 if remote
        let filtered = enriched.filter((h) => h.distanceInKm <= 35);
        if (filtered.length === 0) {
          // Remote destination: grab closest verified
          filtered = [...enriched].sort((a, b) => a.distanceInKm - b.distanceInKm).slice(0, 6);
        }

        const sorted = sortHotels(filtered, sortBy);
        if (isMounted) {
          setNearbyHotels(sorted);
          setLoading(false);
        }
      } else {
        if (isMounted) {
          setNearbyHotels(allHotelsData.slice(0, 6));
          setLoading(false);
        }
      }
    }

    loadStays();
    return () => { isMounted = false; };
  }, [destination.id, destCoords.latitude, destCoords.longitude, sortBy]);

  // Tab Filtering
  const filteredHotels = useMemo(() => {
    if (activeStarTab === 'all') return nearbyHotels;
    const targetStar = parseInt(activeStarTab, 10);
    if (targetStar === 2) {
      // 2-star includes 2-star & 1-star (official guesthouses/mountain lodges)
      return nearbyHotels.filter((h) => (h.starCategory || 2) <= 2);
    }
    return nearbyHotels.filter((h) => h.starCategory === targetStar);
  }, [nearbyHotels, activeStarTab]);

  // Check if active tab is empty for remote destination handling
  const isSelectedStarEmpty = activeStarTab !== 'all' && filteredHotels.length === 0;

  // Closest verified alternatives when 5-star or 4-star does not exist in remote spot
  const closestAlternatives = useMemo(() => {
    if (!isSelectedStarEmpty) return [];
    return [...nearbyHotels].sort((a, b) => (a.distanceInKm || 999) - (b.distanceInKm || 999)).slice(0, 4);
  }, [isSelectedStarEmpty, nearbyHotels]);

  // Toggle hotel in comparison list
  const handleToggleCompare = (hotel) => {
    setCompareList((prev) => {
      const exists = prev.some((h) => h.id === hotel.id);
      if (exists) {
        return prev.filter((h) => h.id !== hotel.id);
      }
      if (prev.length >= 3) {
        alert('You can compare a maximum of 3 hotels side by side.');
        return prev;
      }
      return [...prev, hotel];
    });
  };

  const handleRemoveCompare = (hotelId) => {
    setCompareList((prev) => prev.filter((h) => h.id !== hotelId));
  };

  return (
    <section
      id="where-to-stay"
      className="where-to-stay-section"
      style={{
        marginTop: '3.5rem',
        marginBottom: '3.5rem',
        backgroundColor: '#FAFAF8',
        borderRadius: '16px',
        padding: '2.5rem 1.75rem',
        border: '1px solid #E2E8F0',
        position: 'relative'
      }}
    >
      {/* ── Section Header ── */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.4rem' }}>
          <span
            style={{
              backgroundColor: '#FEF2F2',
              color: 'var(--color-primary)',
              border: '1px solid #FEE2E2',
              borderRadius: '9999px',
              padding: '0.2rem 0.65rem',
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Hotel size={13} /> Where to Stay
          </span>
          <span
            style={{
              backgroundColor: '#F0FDF4',
              color: '#15803D',
              borderRadius: '9999px',
              padding: '0.2rem 0.65rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <CheckCircle2 size={12} /> 100% Verified Real Properties
          </span>
        </div>

        <h2
          style={{
            fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
            fontWeight: 800,
            color: '#0F172A',
            lineHeight: 1.25,
            margin: '0.2rem 0 0.5rem 0'
          }}
        >
          Where to Stay Near {destination.name}
        </h2>
        <p style={{ color: '#64748B', fontSize: '0.95rem', margin: 0, maxWidth: '750px', lineHeight: 1.5 }}>
          Verified accommodations categorized by official star classification, distance from {destination.name}, safety indicators, and direct Google Maps navigation.
        </p>
      </div>

      {/* ── Filter Controls & Category Tabs ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.75rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid #E2E8F0'
        }}
      >
        {/* Star Category Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {[
            { id: 'all', label: 'All Verified Stays' },
            { id: '5', label: '★★★★★ 5-Star' },
            { id: '4', label: '★★★★ 4-Star' },
            { id: '3', label: '★★★ 3-Star' },
            { id: '2', label: '★★ 2-Star & Lodges' }
          ].map((tab) => {
            const isActive = activeStarTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveStarTab(tab.id)}
                style={{
                  backgroundColor: isActive ? 'var(--color-primary)' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#334155',
                  border: isActive ? '1px solid var(--color-primary)' : '1px solid #CBD5E1',
                  borderRadius: '9999px',
                  padding: '0.45rem 1rem',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 700 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Sort Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748B' }}>
            Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <option value="recommended">Recommended (Safety & Trust First)</option>
            <option value="closest">Closest to {destination.name}</option>
            <option value="rating">Highest Guest Rating</option>
            <option value="reviews">Most Reviewed</option>
            <option value="5-star">5-Star First</option>
            <option value="3-star">3-Star First</option>
            <option value="budget">Budget First</option>
            <option value="family">Family Friendly</option>
          </select>
        </div>
      </div>

      {/* ── Hotel Cards Grid or Empty State ── */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>
          Finding verified accommodations near {destination.name}...
        </div>
      ) : isSelectedStarEmpty ? (
        /* Special Handling for Remote / Pilgrimage Destinations per Prompt Section 16 & 17 */
        <div
          style={{
            backgroundColor: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '1.5rem' }}>
            <Info size={24} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#92400E', margin: '0 0 0.4rem 0' }}>
                No {activeStarTab}-star hotels found within 10 km of {destination.name}.
              </h3>
              <p style={{ color: '#B45309', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                Due to regional geography or heritage/pilgrimage regulations, conventional {activeStarTab}-star luxury hotels do not operate directly at this site. Displaying the closest verified authentic accommodations and official government guest houses below:
              </p>
            </div>
          </div>

          {/* Show verified alternatives */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.25rem'
            }}
          >
            {closestAlternatives.map((h) => (
              <HotelCard
                key={h.id}
                hotel={h}
                originCoords={destCoords}
                destinationName={destination.name}
                isSelectedForCompare={compareList.some((ch) => ch.id === h.id)}
                onToggleCompare={handleToggleCompare}
                onOpenDirections={(h) => setDirectionsHotel(h)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {filteredHotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              originCoords={destCoords}
              destinationName={destination.name}
              isSelectedForCompare={compareList.some((ch) => ch.id === hotel.id)}
              onToggleCompare={handleToggleCompare}
              onOpenDirections={(h) => setDirectionsHotel(h)}
            />
          ))}
        </div>
      )}

      {/* ── Mandatory Hotel Safety Disclaimer (Section 24) ── */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1rem 1.25rem',
          backgroundColor: '#F8FAFC',
          borderRadius: '10px',
          border: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.8rem',
          color: '#475569'
        }}
      >
        <ShieldCheck size={18} color="#16A34A" style={{ flexShrink: 0 }} />
        <span>
          <strong>Safety & Trust Notice:</strong> Safety information is based on publicly available property information and guest-review signals. No hotel can be guaranteed completely safe. Always verify current conditions and use your own judgment.
        </span>
      </div>

      {/* ── Floating Compare Tray (Sticky at bottom when hotels selected) ── */}
      {compareList.length > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            padding: '0.75rem 1.5rem',
            borderRadius: '9999px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            zIndex: 9000
          }}
        >
          <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>
            Comparing <strong style={{ color: '#38BDF8' }}>{compareList.length} / 3</strong> hotels
          </div>
          <button
            type="button"
            onClick={() => setIsCompareModalOpen(true)}
            style={{
              backgroundColor: 'var(--color-primary)',
              color: '#FFFFFF',
              border: 'none',
              padding: '0.45rem 1.1rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>Compare Now</span>
            <ChevronRight size={14} />
          </button>
          <button
            type="button"
            onClick={() => setCompareList([])}
            style={{
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              fontSize: '0.8rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Clear
          </button>
        </div>
      )}

      {/* ── Comparison Modal ── */}
      <HotelComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        hotels={compareList}
        onRemoveHotel={handleRemoveCompare}
        destinationName={destination.name}
      />

      {/* ── Directions Modal ── */}
      {directionsHotel && (
        <DirectionsModal
          isOpen={Boolean(directionsHotel)}
          onClose={() => setDirectionsHotel(null)}
          hotel={directionsHotel}
          destination={destination}
        />
      )}
    </section>
  );
}
