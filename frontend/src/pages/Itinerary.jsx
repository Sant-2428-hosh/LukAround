import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Compass, 
  MapPin, 
  Clock, 
  IndianRupee, 
  Footprints, 
  Car, 
  Bus, 
  Info, 
  Sun, 
  Sunset, 
  Sparkles, 
  Calendar,
  ShieldCheck,
  Building,
  Search,
  CheckCircle2,
  Navigation,
  Loader2
} from 'lucide-react';
import LeafletMap from '../components/LeafletMap';

const POPULAR_CITIES = [
  "Jaipur", "Hampi", "Goa", "Munnar", "Varanasi", "Bangalore", "Agra", "Chennai", "Delhi", "Rishikesh", "Kochi", "Pondicherry"
];

function getTimeSlotInfo(timeSlot = '', index = 0) {
  const lower = (timeSlot || '').toLowerCase();
  if (lower.includes('morning') || lower.includes('dawn') || lower.includes('09:') || lower.includes('10:') || lower.includes('11:') || index === 0) {
    return {
      label: timeSlot && !lower.includes('stop') ? timeSlot : 'Morning (09:00 AM – 12:30 PM)',
      className: 'time-slot-badge time-slot-morning',
      icon: '🌅'
    };
  }
  if (lower.includes('afternoon') || lower.includes('noon') || lower.includes('midday') || lower.includes('12:') || lower.includes('01:') || lower.includes('02:') || lower.includes('03:') || lower.includes('04:') || index === 1) {
    return {
      label: timeSlot && !lower.includes('stop') ? timeSlot : 'Afternoon (01:00 PM – 04:30 PM)',
      className: 'time-slot-badge time-slot-afternoon',
      icon: '☀️'
    };
  }
  return {
    label: timeSlot && !lower.includes('stop') ? timeSlot : 'Evening (05:00 PM – 08:30 PM)',
    className: 'time-slot-badge time-slot-evening',
    icon: '🌆'
  };
}

export default function Itinerary() {
  const {
    selectedCity,
    setSelectedCity,
    days,
    setDays,
    itineraryData,
    loadingItinerary,
    activeDay,
    setActiveDay,
    handleGenerateItinerary,
    userLocation,
    detectUserLocation
  } = useApp();

  const [searchParams, setSearchParams] = useSearchParams();
  const [cityInput, setCityInput] = useState(selectedCity || 'Jaipur');

  // Keep input in sync with selectedCity
  useEffect(() => {
    if (selectedCity) setCityInput(selectedCity);
  }, [selectedCity]);

  // Deep-link query param support & automatic plan synchronization
  useEffect(() => {
    const qCity = searchParams.get('city');
    const qDays = searchParams.get('days');

    if (qCity || qDays) {
      const targetCity = qCity || selectedCity;
      const targetDays = qDays ? parseInt(qDays, 10) : days;
      if (targetCity !== selectedCity) {
        setSelectedCity(targetCity);
        setCityInput(targetCity);
      }
      if (targetDays !== days) setDays(targetDays);
      handleGenerateItinerary(targetCity, targetDays);
    } else if (!itineraryData) {
      handleGenerateItinerary(selectedCity, days);
    }
  }, [searchParams]);

  const onCitySelect = (city) => {
    setCityInput(city);
    setSelectedCity(city);
    setSearchParams({ city, days });
    handleGenerateItinerary(city, days);
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    const cleanCity = cityInput.trim();
    if (!cleanCity) return;
    setSelectedCity(cleanCity);
    setSearchParams({ city: cleanCity, days });
    handleGenerateItinerary(cleanCity, days);
  };

  const onDaysChange = (newDays) => {
    setDays(newDays);
    setSearchParams({ city: selectedCity, days: newDays });
    handleGenerateItinerary(selectedCity, newDays);
  };

  const onUseMyLocation = () => {
    if (userLocation?.city) {
      onCitySelect(userLocation.city);
    } else {
      detectUserLocation(true);
    }
  };

  const activeDaySchedule = itineraryData?.itinerary?.find((d) => d.day === activeDay) || itineraryData?.itinerary?.[0];

  const totalStops = itineraryData?.itinerary?.reduce((acc, d) => acc + (d.stops?.length || 0), 0) || 0;
  const totalFees = itineraryData?.itinerary?.reduce((acc, d) => acc + (d.stops?.reduce((sAcc, s) => sAcc + Number(s.entryFeeInr || 0), 0) || 0), 0) || 0;

  return (
    <div style={{ backgroundColor: "var(--color-canvas)", minHeight: "85vh", padding: "3rem 0 5rem 0" }}>
      <div className="container">
        
        {/* ── Planner Controls Bar ── */}
        <div style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid var(--color-rule)",
          borderRadius: "var(--radius-card)",
          boxShadow: "var(--shadow-rest)",
          padding: "2rem",
          marginBottom: "2.5rem"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1.5rem" }}>
            <div style={{ maxWidth: "560px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                <span className="badge badge-primary">
                  ✨ Groq AI &amp; Geoapify Real-Time
                </span>
                {userLocation?.city && (
                  <span className="badge" style={{ backgroundColor: "var(--color-canvas-warm)", border: "1px solid var(--color-rule)" }}>
                    📍 Near {userLocation.city}
                  </span>
                )}
              </div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 3.5vw, 2.3rem)", fontWeight: 700, lineHeight: 1.2 }}>
                Smart Day-by-Day Travel Itinerary
              </h1>
              <p style={{ fontSize: "0.9rem", color: "var(--color-ink-secondary)", marginTop: "0.4rem" }}>
                Generate real-time, geo-clustered routes for any destination in India with multi-modal transit, entry fees, and morning/afternoon/evening schedules.
              </p>
            </div>

            {/* Location & Quick Action Button */}
            {userLocation?.city && userLocation.city !== selectedCity && (
              <button
                type="button"
                onClick={onUseMyLocation}
                className="btn btn-outline"
                style={{ fontSize: "0.85rem", padding: "0.5rem 1rem", gap: "0.4rem" }}
              >
                <MapPin size={15} color="var(--color-primary)" />
                <span>Plan in My City ({userLocation.city})</span>
              </button>
            )}
          </div>

          {/* Form Controls: City Search Input + Duration Pills + Submit */}
          <form onSubmit={onFormSubmit} style={{ marginTop: "1.5rem", display: "flex", flexWrap: "wrap", gap: "1.25rem", alignItems: "flex-end" }}>
            
            {/* Custom City Search Input */}
            <div style={{ flex: "1 1 280px", minWidth: "240px" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--color-ink-tertiary)", marginBottom: "0.4rem" }}>
                Destination City / Place
              </label>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Search size={16} color="var(--color-ink-tertiary)" style={{ position: "absolute", left: "1rem", pointerEvents: "none" }} />
                <input
                  type="text"
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  placeholder="e.g. Hampi, Jaipur, Bangalore, Varanasi…"
                  list="city-datalist"
                  style={{
                    width: "100%",
                    padding: "0.7rem 1rem 0.7rem 2.5rem",
                    borderRadius: "var(--radius-button)",
                    border: "1px solid var(--color-rule)",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    backgroundColor: "var(--color-canvas-warm)",
                    color: "var(--color-ink)",
                    outline: "none"
                  }}
                />
                <datalist id="city-datalist">
                  {POPULAR_CITIES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Duration Buttons */}
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--color-ink-tertiary)", marginBottom: "0.4rem" }}>
                Duration
              </label>
              <div style={{ display: "flex", gap: "0.35rem" }}>
                {[1, 2, 3, 4, 5, 7].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => onDaysChange(num)}
                    style={{
                      padding: "0.6rem 0.9rem",
                      borderRadius: "var(--radius-button)",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      border: days === num ? "1px solid var(--color-primary)" : "1px solid var(--color-rule)",
                      backgroundColor: days === num ? "var(--color-primary)" : "#FFFFFF",
                      color: days === num ? "#FFFFFF" : "var(--color-ink)",
                      cursor: "pointer",
                      boxShadow: "var(--shadow-rest)",
                      transition: "all 0.15s"
                    }}
                  >
                    {num}D
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <div>
              <button
                type="submit"
                disabled={loadingItinerary}
                className="btn btn-primary"
                style={{ padding: "0.7rem 1.6rem", fontSize: "0.92rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                {loadingItinerary ? <Loader2 size={17} className="spin" /> : <Sparkles size={17} />}
                <span>{loadingItinerary ? "Generating AI Plan…" : "Generate AI Plan"}</span>
              </button>
            </div>
          </form>

          {/* Quick Popular City Pills */}
          <div style={{ marginTop: "1rem", display: "flex", gap: "0.4rem", flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--color-ink-tertiary)", fontWeight: 600, marginRight: "0.25rem" }}>Popular:</span>
            {POPULAR_CITIES.slice(0, 8).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onCitySelect(c)}
                style={{
                  fontSize: "0.75rem",
                  padding: "0.25rem 0.6rem",
                  borderRadius: "9999px",
                  border: selectedCity.toLowerCase() === c.toLowerCase() ? "1px solid var(--color-primary)" : "1px solid var(--color-rule)",
                  backgroundColor: selectedCity.toLowerCase() === c.toLowerCase() ? "var(--color-primary-light)" : "#FFFFFF",
                  color: selectedCity.toLowerCase() === c.toLowerCase() ? "var(--color-primary)" : "var(--color-ink)",
                  fontWeight: selectedCity.toLowerCase() === c.toLowerCase() ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.15s"
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* ── Loading State ── */}
        {loadingItinerary && (
          <div style={{
            backgroundColor: "#FFFFFF",
            border: "1px solid var(--color-rule)",
            borderRadius: "var(--radius-card)",
            padding: "4rem 2rem",
            textAlign: "center",
            boxShadow: "var(--shadow-rest)",
            marginBottom: "2.5rem"
          }}>
            <div style={{ display: "inline-block", width: "48px", height: "48px", border: "4px solid var(--color-primary-light)", borderTopColor: "var(--color-primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginTop: "1.25rem", color: "var(--color-ink)" }}>
              Crafting Real-Time AI Itinerary for {selectedCity}…
            </h3>
            <p style={{ fontSize: "0.9rem", color: "var(--color-ink-secondary)", maxWidth: "500px", margin: "0.5rem auto 0" }}>
              Connecting to Groq AI &amp; Geoapify Places API to extract verified attractions, calculate morning/afternoon/evening slots, entry tickets, and transit fares.
            </p>
          </div>
        )}

        {/* ── Itinerary Results ── */}
        {!loadingItinerary && itineraryData && (
          <div>
            
            {/* ── 📋 Master Plan Deck ── */}
            <div
              className="card"
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid var(--color-rule)",
                borderRadius: "var(--radius-card)",
                boxShadow: "var(--shadow-rest)",
                padding: "2rem",
                marginBottom: "2.5rem"
              }}
            >
              {/* Header & Export Actions */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
                <div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "var(--color-primary)", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.3rem" }}>
                    <Sparkles size={14} /> Real-Time Master Plan
                  </div>
                  <h2 style={{ fontSize: "1.55rem", fontWeight: 800 }}>
                    {selectedCity} • {itineraryData.requestedDays || days} Days Master Itinerary
                  </h2>
                  <p style={{ fontSize: "0.875rem", color: "var(--color-ink-secondary)", marginTop: "0.2rem" }}>
                    {itineraryData.source === 'groq_ai_geoapify' ? 'AI-optimized route using live Geoapify coordinates and Groq reasoning.' : 'Optimized day-by-day travel route with ticket fees and inter-stop transit.'}
                  </p>
                </div>

                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <button
                    onClick={() => {
                      let text = `=== LUK AROUND — ${selectedCity.toUpperCase()} ${itineraryData.requestedDays || days}-DAY TRAVEL PLAN ===\n\n`;
                      itineraryData.itinerary?.forEach((d) => {
                        text += `DAY ${d.day}: ${(d.theme || d.title || '').toUpperCase()}\n`;
                        d.stops?.forEach((s, idx) => {
                          text += `  ${idx + 1}. [${s.timeSlot || 'Stop'}] ${s.name} (Duration: ${s.durationHours || 1.5}h | Entry: ₹${s.entryFeeInr || 0})\n     Tip: ${s.tip || s.description || ''}\n`;
                          if (s.transitToNext) {
                            text += `     -> Transit: ${s.transitToNext.distanceKm} km via ${s.transitToNext.mode || 'Cab'} (~${s.transitToNext.durationMins || 15} mins)\n`;
                          }
                        });
                        text += `\n`;
                      });
                      text += `EMERGENCY HELPLINES:\n- National Emergency: 112\n- Tourist Helpline: 1363\n- Women's Helpline: 1091\n`;

                      const blob = new Blob([text], { type: "text/plain" });
                      const a = document.createElement("a");
                      a.href = URL.createObjectURL(blob);
                      a.download = `${selectedCity.toLowerCase()}-${days}day-itinerary.txt`;
                      a.click();
                    }}
                    className="btn btn-outline"
                    style={{ fontSize: "0.8rem", padding: "0.45rem 0.85rem", gap: "0.3rem" }}
                  >
                    📥 Export Plan Text
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="btn btn-outline"
                    style={{ fontSize: "0.8rem", padding: "0.45rem 0.85rem" }}
                  >
                    🖨️ Print Voucher
                  </button>
                  <Link
                    to={`/budget?city=${selectedCity}&days=${itineraryData.requestedDays || days}`}
                    className="btn btn-primary"
                    style={{ fontSize: "0.8rem", padding: "0.45rem 0.85rem", gap: "0.3rem" }}
                  >
                    <IndianRupee size={13} /> Full Budget Breakdown
                  </Link>
                </div>
              </div>

              {/* Plan Statistics Metric Bar */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "1rem",
                padding: "1rem 1.25rem",
                backgroundColor: "var(--color-canvas-warm)",
                border: "1px solid var(--color-rule)",
                borderRadius: "var(--radius-button)",
                marginBottom: "2rem"
              }}>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-ink-tertiary)", textTransform: "uppercase", fontWeight: 700 }}>Total Duration</span>
                  <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--color-ink)" }}>{itineraryData.requestedDays || days} Days Planned</div>
                </div>

                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-ink-tertiary)", textTransform: "uppercase", fontWeight: 700 }}>Total Attractions</span>
                  <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--color-primary)" }}>
                    {totalStops} Sequenced Stops
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-ink-tertiary)", textTransform: "uppercase", fontWeight: 700 }}>Total Entry Fees</span>
                  <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--color-ink)" }}>
                    ₹{totalFees}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-ink-tertiary)", textTransform: "uppercase", fontWeight: 700 }}>Recommended Transit</span>
                  <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--color-ink)" }}>
                    {itineraryData.itinerary?.[0]?.stops?.[0]?.transitToNext?.mode || 'Auto Rickshaw / Cab'}
                  </div>
                </div>
              </div>

              {/* Day-by-Day Cards Carousel */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
                {itineraryData.itinerary?.map((d) => {
                  const isCurrentDay = activeDay === d.day;
                  const dayEntryTotal = d.stops?.reduce((acc, s) => acc + Number(s.entryFeeInr || 0), 0) || 0;

                  return (
                    <div
                      key={d.day}
                      onClick={() => setActiveDay(d.day)}
                      style={{
                        padding: "1.25rem",
                        borderRadius: "var(--radius-button)",
                        backgroundColor: isCurrentDay ? "var(--color-primary-light)" : "var(--color-canvas-warm)",
                        border: isCurrentDay ? "1.5px solid var(--color-primary)" : "1px solid var(--color-rule)",
                        boxShadow: isCurrentDay ? "var(--shadow-hover)" : "var(--shadow-rest)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between"
                      }}
                    >
                      <div>
                        {/* Day Card Header */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                          <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--color-primary)", textTransform: "uppercase" }}>
                            Day {d.day}
                          </span>
                          <span style={{ fontSize: "0.75rem", color: "var(--color-ink-tertiary)", fontWeight: 700 }}>
                            {d.stops?.length || 0} Stops • ₹{dayEntryTotal}
                          </span>
                        </div>

                        <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--color-ink)", marginBottom: "0.75rem" }}>
                          {d.theme || d.title || `Day ${d.day} Sightseeing`}
                        </div>

                        {/* Sequenced Stop List */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
                          {d.stops?.length > 0 ? (
                            d.stops.map((s, sIdx) => {
                              const slot = getTimeSlotInfo(s.timeSlot, sIdx);
                              return (
                                <div
                                  key={sIdx}
                                  style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: "0.5rem",
                                    fontSize: "0.8rem",
                                    padding: "0.4rem 0.5rem",
                                    backgroundColor: isCurrentDay ? "#FFFFFF" : "var(--color-canvas)",
                                    borderRadius: "4px",
                                    border: "1px solid var(--color-rule)"
                                  }}
                                >
                                  <span style={{
                                    width: "18px",
                                    height: "18px",
                                    borderRadius: "50%",
                                    backgroundColor: "var(--color-primary)",
                                    color: "#fff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "0.65rem",
                                    fontWeight: 800,
                                    flexShrink: 0,
                                    marginTop: "1px"
                                  }}>
                                    {sIdx + 1}
                                  </span>
                                  <div style={{ flexGrow: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 700, color: "var(--color-ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                      {s.name}
                                    </div>
                                    <div style={{ fontSize: "0.7rem", color: "var(--color-ink-tertiary)" }}>
                                      {slot.icon} {s.timeSlot || 'Stop'} • ₹{s.entryFeeInr || 0}
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div style={{ fontSize: "0.8rem", color: "var(--color-ink-tertiary)", fontStyle: "italic", padding: "0.5rem 0" }}>
                              Free exploration &amp; local leisure day
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Footer Switcher */}
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingTop: "0.6rem",
                        borderTop: isCurrentDay ? "1px solid rgba(192, 41, 60, 0.2)" : "1px solid var(--color-rule)",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        color: isCurrentDay ? "var(--color-primary)" : "var(--color-ink-secondary)"
                      }}>
                        <span>{isCurrentDay ? "✓ Active Schedule Below" : "Click to view full schedule"}</span>
                        <span>➔</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Links to Hotels, Safety & Budget for this City */}
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "2rem", flexWrap: "wrap" }}>
              <Link to={`/hotels?city=${selectedCity}`} className="btn btn-outline" style={{ fontSize: "0.825rem", padding: "0.45rem 0.9rem" }}>
                <Building size={14} /> Stays in {selectedCity}
              </Link>
              <Link to={`/safety?city=${selectedCity}`} className="btn btn-outline" style={{ fontSize: "0.825rem", padding: "0.45rem 0.9rem" }}>
                <ShieldCheck size={14} /> Safety &amp; Police in {selectedCity}
              </Link>
              <Link to={`/budget?city=${selectedCity}`} className="btn btn-outline" style={{ fontSize: "0.825rem", padding: "0.45rem 0.9rem" }}>
                <IndianRupee size={14} /> View Full Trip Budget
              </Link>
            </div>

            {/* Day Switcher Tabs */}
            <div style={{ display: "flex", gap: "0.6rem", borderBottom: "1px solid var(--color-rule)", paddingBottom: "1rem", marginBottom: "2rem", overflowX: "auto" }}>
              {itineraryData.itinerary?.map((d) => {
                const isActive = activeDay === d.day;
                return (
                  <button
                    key={d.day}
                    type="button"
                    onClick={() => setActiveDay(d.day)}
                    style={{
                      padding: "0.65rem 1.25rem",
                      borderRadius: "var(--radius-button)",
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      border: isActive ? "1px solid var(--color-primary)" : "1px solid var(--color-rule)",
                      backgroundColor: isActive ? "var(--color-primary-light)" : "#FFFFFF",
                      color: isActive ? "var(--color-primary)" : "var(--color-ink)",
                      boxShadow: "var(--shadow-rest)",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}
                  >
                    <span>Day {d.day}</span>
                    <span style={{ fontSize: "0.75rem", opacity: 0.8, fontWeight: 500 }}>({d.stops?.length || 0} stops)</span>
                  </button>
                );
              })}
            </div>

            {/* ── Active Day Detailed Schedule ── */}
            {activeDaySchedule && (
              <div>
                <div style={{ marginBottom: "2rem" }}>
                  <span className="badge badge-primary" style={{ marginBottom: "0.4rem" }}>
                    Day {activeDaySchedule.day} Cluster
                  </span>
                  <h2 style={{ fontSize: "1.6rem", fontWeight: 700 }}>
                    {activeDaySchedule.theme || activeDaySchedule.title || `Day ${activeDaySchedule.day} Sightseeing`}
                  </h2>
                  <p style={{ fontSize: "0.95rem", color: "var(--color-ink-secondary)", marginTop: "0.2rem" }}>
                    {activeDaySchedule.summary || `Optimized route covering ${activeDaySchedule.stops?.length || 0} sequential attractions.`}
                  </p>
                </div>

                {/* Timeline Stops */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {activeDaySchedule.stops?.map((stop, sIdx) => {
                    const slot = getTimeSlotInfo(stop.timeSlot, sIdx);

                    return (
                      <div key={stop.attractionId || sIdx}>
                        
                        {/* Stop Card */}
                        <div
                          className="itinerary-stop-card"
                          style={{
                            backgroundColor: "#FFFFFF",
                            border: "1px solid var(--color-rule)",
                            borderRadius: "var(--radius-card)",
                            boxShadow: "var(--shadow-rest)",
                            padding: "1.5rem",
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                            gap: "1.5rem",
                            alignItems: "center"
                          }}
                        >
                          {/* Stop Photo if available */}
                          {stop.imageUrl && (
                            <div style={{ height: "200px", borderRadius: "var(--radius-button)", overflow: "hidden" }}>
                              <img src={stop.imageUrl} alt={stop.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                          )}

                          <div>
                            {/* Slot Badge and Number */}
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
                              <span style={{
                                width: "24px",
                                height: "24px",
                                borderRadius: "50%",
                                backgroundColor: "var(--color-primary)",
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyCenter: "center",
                                fontSize: "0.75rem",
                                fontWeight: 800
                              }}>
                                {sIdx + 1}
                              </span>
                              <span className={slot.className}>
                                <span>{slot.icon}</span>
                                <span>{slot.label}</span>
                              </span>
                              {stop.category && (
                                <span className="badge" style={{ backgroundColor: "var(--color-canvas-warm)", fontSize: "0.7rem" }}>
                                  {stop.category}
                                </span>
                              )}
                            </div>

                            <h3 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.4rem" }}>
                              {stop.name}
                            </h3>
                            <p style={{ fontSize: "0.85rem", color: "var(--color-ink-secondary)", lineHeight: 1.5, marginBottom: "0.8rem" }}>
                              {stop.description}
                            </p>

                            {stop.tip && (
                              <div style={{
                                padding: "0.5rem 0.75rem",
                                backgroundColor: "var(--color-canvas-warm)",
                                borderLeft: "3px solid #D97706",
                                borderRadius: "4px",
                                fontSize: "0.8rem",
                                color: "var(--color-ink)",
                                marginBottom: "1rem"
                              }}>
                                <strong>💡 Insider Tip:</strong> {stop.tip}
                              </div>
                            )}

                            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", fontSize: "0.8rem", color: "var(--color-ink-secondary)", marginBottom: "1rem" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                <Clock size={14} color="var(--color-primary)" />
                                <span>{stop.durationHours ? `${stop.durationHours}h recommended` : "1.5h"}</span>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                <IndianRupee size={14} color="var(--color-primary)" />
                                <span>Entry: {stop.entryFeeInr ? `₹${stop.entryFeeInr}` : "Free"}</span>
                              </div>
                              {stop.openingHours && (
                                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                                  <Info size={14} color="var(--color-primary)" />
                                  <span>{stop.openingHours}</span>
                                </div>
                              )}
                            </div>

                            {/* Embedded OpenStreetMap Preview via LeafletMap */}
                            <div style={{ marginTop: "0.75rem" }}>
                              <LeafletMap
                                lat={stop.latitude || stop.lat}
                                lng={stop.longitude || stop.lng}
                                title={stop.name}
                                address={`${stop.name}, ${selectedCity}, India`}
                                height="130px"
                                zoom={14}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Inter-Stop Multi-Modal Transit Connector */}
                        {stop.transitToNext && (
                          <div className="transit-connector">
                            <div style={{ fontWeight: 700, color: "var(--color-ink)", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                              <span>Transit to {stop.transitToNext.toName || "Next Attraction"}</span>
                              <span style={{ fontSize: "0.75rem", color: "var(--color-ink-tertiary)" }}>
                                ({stop.transitToNext.distanceKm} km away)
                              </span>
                            </div>

                            <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
                              {stop.transitToNext.modes?.map((m, mIdx) => (
                                <div
                                  key={mIdx}
                                  className={`transit-mode-chip ${m.recommended ? 'transit-mode-chip--recommended' : ''}`}
                                >
                                  {m.mode === "Walking" && <Footprints size={14} color="var(--color-primary)" />}
                                  {m.mode === "Auto Rickshaw" && <Car size={14} color="var(--color-primary)" />}
                                  {m.mode === "Cab" && <Car size={14} color="var(--color-primary)" />}
                                  {m.mode === "Bus" && <Bus size={14} color="var(--color-primary)" />}
                                  <span>{m.mode}</span>
                                  <span style={{ color: "var(--color-ink-tertiary)", fontSize: "0.72rem" }}>~{m.durationMins}m</span>
                                  <span style={{ fontWeight: 700 }}>₹{m.fareInr}</span>
                                  {m.recommended && (
                                    <span style={{ fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", marginLeft: "0.2rem" }}>
                                      (Best)
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
