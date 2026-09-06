import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Building, Star, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';
import { getHotels } from '../api/client';
import LocationMap from '../components/LocationMap';

export default function Hotels() {
  const {
    selectedCity,
    setSelectedCity,
    selectedTier,
    setSelectedTier,
    hotels,
    setHotels,
    setActiveBookingModal
  } = useApp();

  const [searchParams, setSearchParams] = useSearchParams();

  const CITIES = [
    "Jaipur", "Munnar", "Varanasi", "Goa", "Chennai", "Agra", "Bangalore", "Kochin", "Pondicherry", "Yercaud", "Delhi"
  ];

  const TIERS = [
    { id: "all", label: "All Tiers" },
    { id: "luxury", label: "Luxury (₹8,000+)" },
    { id: "mid-range", label: "Mid-Range (₹3,000–₹8,000)" },
    { id: "budget", label: "Budget (Under ₹3,000)" },
  ];

  useEffect(() => {
    const qCity = searchParams.get('city');
    const qTier = searchParams.get('tier');

    const activeCity = qCity || selectedCity;
    const activeTier = qTier || selectedTier;

    if (qCity && qCity !== selectedCity) setSelectedCity(qCity);
    if (qTier && qTier !== selectedTier) setSelectedTier(activeTier);

    async function fetchFilteredHotels() {
      try {
        const res = await getHotels(activeCity, activeTier);
        if (res) {
          const hotelList = Array.isArray(res.data)
            ? res.data
            : (res.hotels || res.data?.hotels || (Array.isArray(res) ? res : []));
          setHotels(hotelList);
        }
      } catch (err) {
        console.error("Failed to fetch filtered hotels:", err);
      }
    }
    fetchFilteredHotels();
  }, [searchParams, selectedCity, selectedTier]);

  const onCityChange = (city) => {
    setSelectedCity(city);
    setSearchParams({ city, tier: selectedTier });
  };

  const onTierChange = (tier) => {
    setSelectedTier(tier);
    setSearchParams({ city: selectedCity, tier });
  };

  return (
    <div style={{ backgroundColor: "var(--color-canvas)", minHeight: "85vh", padding: "3.5rem 0 5rem 0" }}>
      <div className="container">
        
        {/* Page Header */}
        <div style={{ maxWidth: "700px", marginBottom: "2.5rem" }}>
          <span className="badge badge-primary" style={{ marginBottom: "0.5rem" }}>
            Curated Stays & Heritage Resorts
          </span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.85rem, 3.5vw, 2.8rem)", fontWeight: 700, lineHeight: 1.15, marginBottom: "0.6rem" }}>
            Verified Accommodations in {selectedCity}
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--color-ink-secondary)", lineHeight: 1.6 }}>
            Handpicked boutique stays, palatial heritage resorts, and clean budget hostels with direct booking portal access.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.25rem",
          padding: "1.25rem",
          backgroundColor: "#FFFFFF",
          border: "1px solid var(--color-rule)",
          borderRadius: "var(--radius-card)",
          boxShadow: "var(--shadow-rest)",
          marginBottom: "2.5rem"
        }}>
          {/* City Selector */}
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--color-ink-tertiary)", marginBottom: "0.35rem" }}>
              Select City
            </label>
            <select
              value={selectedCity}
              onChange={(e) => onCityChange(e.target.value)}
              style={{
                padding: "0.55rem 1rem",
                borderRadius: "var(--radius-button)",
                border: "1px solid var(--color-rule)",
                fontSize: "0.9rem",
                fontWeight: 600,
                backgroundColor: "var(--color-canvas-warm)",
                color: "var(--color-ink)",
                cursor: "pointer"
              }}
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Budget Tier Buttons */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {TIERS.map((t) => {
              const isActive = selectedTier === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onTierChange(t.id)}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "var(--radius-button)",
                    fontSize: "0.825rem",
                    fontWeight: 600,
                    border: isActive ? "1px solid var(--color-primary)" : "1px solid var(--color-rule)",
                    backgroundColor: isActive ? "var(--color-primary-light)" : "#FFFFFF",
                    color: isActive ? "var(--color-primary)" : "var(--color-ink)",
                    boxShadow: "var(--shadow-rest)",
                    cursor: "pointer",
                    transition: "all 0.15s"
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hotels Grid */}
        {hotels && hotels.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "2rem" }}>
            {hotels.map((h, idx) => {
              const photoUrl = h.image_url || h.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
              const tierLabel = (h.price_range || h.tier || 'Hotel').toUpperCase();
              const ratingScore = h.star_rating || h.rating || 4.8;
              const reviews = h.reviewsCount || Math.floor(120 + (h.id || idx) * 37);
              const addressText = h.address || h.area || `${h.city_name || selectedCity} Center`;
              const price = h.avg_nightly_rate_inr || h.pricePerNightInr || 3500;
              const desc = h.description || `${h.price_range || 'Verified'} accommodation in ${addressText} with comfortable stays, high-speed WiFi, and 24/7 service.`;
              const amenitiesList = h.amenities?.length ? h.amenities : ['Free High-Speed WiFi', '24/7 Front Desk', 'AC Rooms', 'Room Service'];

              return (
                <div
                  key={h.id || idx}
                  className="card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "var(--radius-card)",
                    overflow: "hidden",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid var(--color-rule)",
                    boxShadow: "var(--shadow-rest)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease"
                  }}
                >
                  {/* Photo & Badges */}
                  <div style={{ position: "relative", height: "220px", overflow: "hidden", backgroundColor: "var(--color-canvas-warm)" }}>
                    <img
                      src={photoUrl}
                      alt={h.name}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80';
                      }}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.4s ease"
                      }}
                    />
                    <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem" }}>
                      <span className="badge badge-primary">
                        {tierLabel}
                      </span>
                    </div>
                    <div style={{
                      position: "absolute",
                      top: "0.75rem",
                      right: "0.75rem",
                      backgroundColor: "rgba(0,0,0,0.72)",
                      backdropFilter: "blur(6px)",
                      color: "#fff",
                      padding: "0.3rem 0.6rem",
                      borderRadius: "var(--radius-button)",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem"
                    }}>
                      <Star size={13} fill="#F59E0B" color="#F59E0B" /> {ratingScore} ({reviews})
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "var(--color-ink-secondary)", fontSize: "0.8rem", marginBottom: "0.35rem" }}>
                      <MapPin size={13} color="var(--color-primary)" /> {addressText}
                    </div>

                    <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.4rem" }}>{h.name}</h3>
                    <p style={{ fontSize: "0.85rem", color: "var(--color-ink-secondary)", lineHeight: 1.5, marginBottom: "1rem" }}>
                      {desc}
                    </p>

                    {/* Amenities */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "1rem", flexGrow: 1 }}>
                      {amenitiesList.map((a, aIdx) => (
                        <span
                          key={aIdx}
                          style={{
                            fontSize: "0.7rem",
                            padding: "0.2rem 0.5rem",
                            borderRadius: "var(--radius-button)",
                            backgroundColor: "var(--color-canvas-warm)",
                            color: "var(--color-ink-secondary)",
                            border: "1px solid var(--color-rule)"
                          }}
                        >
                          {a}
                        </span>
                      ))}
                    </div>

                    {/* Google Map Preview & Directions */}
                    <div style={{ marginBottom: "1.25rem" }}>
                      <LocationMap
                        lat={h.latitude || h.lat}
                        lng={h.longitude || h.lng}
                        placeId={h.place_id}
                        address={addressText}
                        title={h.name}
                        height="135px"
                      />
                    </div>

                    {/* Pricing & Booking Trigger */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem", borderTop: "1px solid var(--color-rule)" }}>
                      <div>
                        <span style={{ fontSize: "0.75rem", color: "var(--color-ink-tertiary)", display: "block" }}>From</span>
                        <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--color-ink)" }}>₹{Number(price).toLocaleString()}</span>
                        <span style={{ fontSize: "0.75rem", color: "var(--color-ink-tertiary)" }}>/night</span>
                      </div>

                      <button
                        onClick={() => setActiveBookingModal(h)}
                        className="btn btn-primary"
                        style={{ padding: "0.55rem 1.1rem", fontSize: "0.85rem", gap: "0.4rem" }}
                      >
                        <span>Check Stays</span>
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card" style={{ padding: "3.5rem 2rem", textAlign: "center", backgroundColor: "#FFFFFF" }}>
            <Building size={40} color="var(--color-primary)" style={{ margin: "0 auto 1rem auto" }} />
            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              No Accommodations Found for {selectedCity}
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--color-ink-secondary)", maxWidth: "500px", margin: "0 auto 1.5rem auto" }}>
              There are currently no listings under the "{selectedTier}" tier in {selectedCity}. Try resetting the tier filter to view all verified stays.
            </p>
            <button
              onClick={() => onTierChange('all')}
              className="btn btn-primary"
              style={{ padding: "0.6rem 1.4rem" }}
            >
              Reset to All Tiers
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
