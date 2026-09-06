import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { IndianRupee, Ticket, Car, Building, Sparkles, ArrowRight } from 'lucide-react';

export default function Budget() {
  const {
    selectedCity,
    setSelectedCity,
    days,
    setDays,
    itineraryData,
    loadingItinerary,
    handleGenerateItinerary
  } = useApp();

  const [searchParams, setSearchParams] = useSearchParams();

  const CITIES = [
    "Jaipur", "Munnar", "Varanasi", "Goa", "Chennai", "Agra", "Bangalore", "Kochin", "Pondicherry", "Yercaud", "Delhi"
  ];

  useEffect(() => {
    const qCity = searchParams.get('city');
    const qDays = searchParams.get('days');

    if (qCity && qCity !== selectedCity) {
      setSelectedCity(qCity);
      const parsedDays = qDays ? parseInt(qDays, 10) : days;
      if (qDays) setDays(parsedDays);
      handleGenerateItinerary(qCity, parsedDays);
    }
  }, [searchParams]);

  const onCityChange = (city) => {
    setSelectedCity(city);
    setSearchParams({ city, days });
    handleGenerateItinerary(city, days);
  };

  const onDaysChange = (newDays) => {
    setDays(newDays);
    setSearchParams({ city: selectedCity, days: newDays });
    handleGenerateItinerary(selectedCity, newDays);
  };

  // Calculations
  let totalEntryFees = 0;
  let totalTransitCost = 0;
  const attractionsList = [];

  if (itineraryData?.itinerary) {
    itineraryData.itinerary.forEach((d) => {
      d.stops?.forEach((s) => {
        const fee = Number(s.entryFeeInr || 0);
        totalEntryFees += fee;
        attractionsList.push({ name: s.name, fee, day: d.day });

        if (s.transitToNext?.modes) {
          const rec = s.transitToNext.modes.find((m) => m.recommended) || s.transitToNext.modes[0];
          if (rec) totalTransitCost += Number(rec.fareInr || 0);
        }
      });
    });
  }

  const requestedDaysCount = itineraryData?.requestedDays || days;
  const estHotelStay = 4500 * requestedDaysCount;
  const grandTotalBudget = totalEntryFees + totalTransitCost + estHotelStay;

  return (
    <div style={{ backgroundColor: "var(--color-canvas)", minHeight: "85vh", padding: "3.5rem 0 5rem 0" }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ maxWidth: "700px", marginBottom: "2.5rem" }}>
          <span className="badge badge-primary" style={{ marginBottom: "0.5rem" }}>
            Transparent Cost Breakdown
          </span>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.85rem, 3.5vw, 2.8rem)", fontWeight: 700, lineHeight: 1.15, marginBottom: "0.6rem" }}>
            Trip Budget Breakdown: {selectedCity} ({requestedDaysCount} Days)
          </h1>
          <p style={{ fontSize: "1rem", color: "var(--color-ink-secondary)", lineHeight: 1.6 }}>
            Accurate estimation of ticket entry fees, intra-city transit fares, and average boutique hotel stays.
          </p>
        </div>

        {/* City and Days Controls */}
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
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--color-ink-tertiary)", marginBottom: "0.35rem" }}>
              Destination
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

          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--color-ink-tertiary)", marginBottom: "0.35rem" }}>
              Trip Days
            </label>
            <div style={{ display: "flex", gap: "0.35rem" }}>
              {[1, 2, 3, 4, 5, 7].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => onDaysChange(num)}
                  style={{
                    padding: "0.5rem 0.85rem",
                    borderRadius: "var(--radius-button)",
                    fontSize: "0.825rem",
                    fontWeight: 700,
                    border: days === num ? "1px solid var(--color-primary)" : "1px solid var(--color-rule)",
                    backgroundColor: days === num ? "var(--color-primary)" : "#FFFFFF",
                    color: days === num ? "#FFFFFF" : "var(--color-ink)",
                    cursor: "pointer",
                    boxShadow: "var(--shadow-rest)"
                  }}
                >
                  {num}D
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Budget Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
          
          {/* Card 1: Entry Fees */}
          <div className="card" style={{ padding: "1.5rem", backgroundColor: "#FFFFFF" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-primary)", marginBottom: "0.75rem" }}>
              <Ticket size={20} />
              <span style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase" }}>Monument Entry Fees</span>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-ink)" }}>
              ₹{totalEntryFees.toLocaleString()}
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--color-ink-tertiary)", marginTop: "0.35rem" }}>
              Includes {attractionsList.length} attractions across {requestedDaysCount} days
            </p>
          </div>

          {/* Card 2: Transit */}
          <div className="card" style={{ padding: "1.5rem", backgroundColor: "#FFFFFF" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-primary)", marginBottom: "0.75rem" }}>
              <Car size={20} />
              <span style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase" }}>Local Transit Modes</span>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-ink)" }}>
              ₹{totalTransitCost.toLocaleString()}
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--color-ink-tertiary)", marginTop: "0.35rem" }}>
              Recommended auto-rickshaws, cabs & bus connections
            </p>
          </div>

          {/* Card 3: Hotel Stays */}
          <div className="card" style={{ padding: "1.5rem", backgroundColor: "#FFFFFF" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-primary)", marginBottom: "0.75rem" }}>
              <Building size={20} />
              <span style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase" }}>Est. Hotel Stays</span>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-ink)" }}>
              ₹{estHotelStay.toLocaleString()}
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--color-ink-tertiary)", marginTop: "0.35rem" }}>
              ~₹4,500/night mid-range stay ({requestedDaysCount} nights)
            </p>
          </div>

          {/* Card 4: Grand Total */}
          <div className="card" style={{ padding: "1.5rem", backgroundColor: "var(--color-primary)", color: "#FFFFFF" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem", opacity: 0.9 }}>
              <IndianRupee size={20} />
              <span style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase" }}>Estimated Total Budget</span>
            </div>
            <div style={{ fontSize: "2.2rem", fontWeight: 800 }}>
              ₹{grandTotalBudget.toLocaleString()}
            </div>
            <p style={{ fontSize: "0.75rem", opacity: 0.85, marginTop: "0.35rem" }}>
              Per person total estimate in ₹
            </p>
          </div>
        </div>

        {/* Attractions Ticket Price Table */}
        <div className="card" style={{ padding: "1.75rem", backgroundColor: "#FFFFFF", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.25rem" }}>
            Attractions Entrance Ticket Breakdown
          </h2>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--color-rule)", color: "var(--color-ink-tertiary)" }}>
                  <th style={{ padding: "0.75rem 0" }}>Day</th>
                  <th style={{ padding: "0.75rem 0" }}>Attraction Name</th>
                  <th style={{ padding: "0.75rem 0", textAlign: "right" }}>Ticket Price (INR)</th>
                </tr>
              </thead>
              <tbody>
                {attractionsList.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid var(--color-rule)" }}>
                    <td style={{ padding: "0.75rem 0", fontWeight: 700, color: "var(--color-primary)" }}>Day {item.day}</td>
                    <td style={{ padding: "0.75rem 0" }}>{item.name}</td>
                    <td style={{ padding: "0.75rem 0", textAlign: "right", fontWeight: 700 }}>
                      {item.fee > 0 ? `₹${item.fee}` : <span style={{ color: "var(--color-primary)" }}>Free Entry</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA to Plan Trip */}
        <div style={{ textAlign: "center" }}>
          <Link
            to={`/itinerary?city=${selectedCity}&days=${requestedDaysCount}`}
            className="btn btn-primary"
            style={{ padding: "0.85rem 2rem", fontSize: "0.95rem", gap: "0.5rem" }}
          >
            <span>View Full Day-by-Day Itinerary for {selectedCity}</span>
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
}
