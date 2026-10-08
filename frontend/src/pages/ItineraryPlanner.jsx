import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { itineraries, states, cities, attractions, travelStyles } from '../data/indiaTourismData';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Compass,
  DollarSign,
  Sun,
  Sunset,
  Moon,
  CheckCircle2,
  Share2,
  Printer,
  ArrowRight
} from 'lucide-react';

export default function ItineraryPlanner() {
  const location = useLocation();
  const preSelectedItinerary = location.state?.selectedItinerary || null;
  const preSelectedDest = location.state?.defaultDestination || 'Rajasthan';

  // State
  const [destination, setDestination] = useState(preSelectedDest);
  const [durationDays, setDurationDays] = useState(preSelectedItinerary?.durationDays || 3);
  const [travelStyle, setTravelStyle] = useState(preSelectedItinerary?.travelStyle || 'heritage');
  const [budget, setBudget] = useState(preSelectedItinerary?.budget || 'moderate');
  const [selectedInterests, setSelectedInterests] = useState(['Monuments', 'Local Food', 'Photography']);
  const [currentItinerary, setCurrentItinerary] = useState(preSelectedItinerary || itineraries[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  const ALL_INTERESTS = [
    'Monuments', 'Temples & Spiritual', 'Local Food', 'Photography',
    'Beaches', 'Hill Treks', 'Shopping & Crafts', 'Wildlife Safari'
  ];

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      // First attempt backend dynamic generator API
      const res = await fetch('/api/tourism/itinerary/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          durationDays,
          travelStyle,
          budget,
          interests: selectedInterests
        })
      });

      const data = await res.json();
      if (data.success && data.itinerary) {
        setCurrentItinerary(data.itinerary);
        setIsGenerating(false);
        return;
      }
    } catch (err) {
      console.warn('Backend itinerary API unavailable, generating locally:', err);
    }

    // Local fallback generator
    setTimeout(() => {
      const destTerm = (destination || 'Rajasthan').toLowerCase();
      const relevantAttractions = attractions.filter(a =>
        a.state.toLowerCase().includes(destTerm) ||
        a.city.toLowerCase().includes(destTerm) ||
        a.name.toLowerCase().includes(destTerm)
      );

      const pool = relevantAttractions.length > 0 ? relevantAttractions : attractions.slice(0, 15);
      const daysCount = parseInt(durationDays, 10) || 3;
      const days = [];

      for (let i = 1; i <= daysCount; i++) {
        const morningAttr = pool[(i * 3 - 3) % pool.length];
        const afternoonAttr = pool[(i * 3 - 2) % pool.length];
        const eveningAttr = pool[(i * 3 - 1) % pool.length];

        days.push({
          dayNumber: i,
          title: `Day ${i}: Highlights of ${morningAttr.city || destination}`,
          morning: `Begin your day at ${morningAttr.name}. ${morningAttr.shortDescription || 'Experience morning darshan and peaceful garden walkways.'}`,
          afternoon: `Head towards ${afternoonAttr.name}. Savor regional specialties for lunch and explore the heritage halls and courtyards.`,
          evening: `Conclude with sunset views at ${eveningAttr.name}. Relax at seaside or cliffside cafes as evening lights illuminate the monument.`
        });
      }

      setCurrentItinerary({
        id: `plan-${Date.now()}`,
        title: `${daysCount} Days in ${destination} (${travelStyle.toUpperCase()} Style)`,
        destination,
        durationDays: daysCount,
        travelStyle,
        budget,
        heroImage: pool[0]?.image || 'https://images.unsplash.com/photo-1598324789736-4861f89564a0?auto=format&fit=crop&w=1200&q=80',
        summary: `A personalized ${daysCount}-day ${travelStyle} travel circuit discovering the iconic highlights, culinary gems, and cultural heritage of ${destination}.`,
        days
      });

      setIsGenerating(false);
    }, 350);
  };

  return (
    <div className="tourism-page">
      {/* ── Page Header ── */}
      <div style={{
        background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
        color: '#FFFFFF',
        padding: '3.5rem 1.5rem',
        textAlign: 'center'
      }}>
        <div className="tourism-container" style={{ maxWidth: '800px' }}>
          <span className="tourism-badge badge-earth" style={{ marginBottom: '0.75rem' }}>
            Smart Trip Planner
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 900, marginBottom: '0.75rem' }}>
            India Travel Itinerary Generator
          </h1>
          <p style={{ fontSize: '1rem', color: '#94A3B8', lineHeight: 1.6 }}>
            Customize your dream India journey. Choose your destination, days, travel style, and interests to generate an optimized Morning, Afternoon, and Evening day-by-day plan.
          </p>
        </div>
      </div>

      <div className="tourism-container" style={{ paddingTop: '2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 380px) minmax(0, 1fr)', gap: '2rem' }}>

          {/* ── Left Column: Itinerary Configuration Form (Section 29) ── */}
          <div>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '1.75rem',
              border: '1px solid var(--tourism-sand-border)',
              boxShadow: 'var(--shadow-subtle)',
              position: 'sticky',
              top: '90px'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Compass size={18} color="var(--tourism-earth)" />
                <span>Trip Preferences</span>
              </h3>

              <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Destination */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                    Destination (State or City)
                  </label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="e.g., Rajasthan, Tamil Nadu, Varanasi, Kerala"
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      border: '1px solid var(--tourism-sand-border)',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                    required
                  />
                </div>

                {/* Number of Days */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                    Trip Duration ({durationDays} Days)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="7"
                    value={durationDays}
                    onChange={(e) => setDurationDays(parseInt(e.target.value, 10))}
                    style={{ width: '100%', accentColor: 'var(--tourism-earth)' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94A3B8' }}>
                    <span>1 Day</span>
                    <span>3 Days</span>
                    <span>5 Days</span>
                    <span>7 Days</span>
                  </div>
                </div>

                {/* Travel Style */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                    Travel Style
                  </label>
                  <select
                    value={travelStyle}
                    onChange={(e) => setTravelStyle(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      border: '1px solid var(--tourism-sand-border)',
                      fontSize: '0.9rem',
                      outline: 'none',
                      backgroundColor: 'var(--tourism-sand)'
                    }}
                  >
                    <option value="heritage">Heritage & Palaces</option>
                    <option value="spiritual">Spiritual Pilgrimage</option>
                    <option value="nature">Nature & Hill Stations</option>
                    <option value="family">Family Friendly</option>
                    <option value="couples">Couples & Romantic</option>
                    <option value="adventure">Adventure & Thrills</option>
                    <option value="food">Culinary & Food Trail</option>
                  </select>
                </div>

                {/* Budget */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                    Budget Preference
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                    {['budget', 'moderate', 'luxury'].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBudget(b)}
                        style={{
                          padding: '0.5rem',
                          borderRadius: '8px',
                          border: '1.5px solid',
                          borderColor: budget === b ? 'var(--tourism-earth)' : 'var(--tourism-sand-border)',
                          backgroundColor: budget === b ? 'var(--tourism-earth-light)' : '#FFFFFF',
                          color: budget === b ? 'var(--tourism-earth-dark)' : '#475569',
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          textTransform: 'capitalize',
                          cursor: 'pointer'
                        }}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                    Key Interests
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {ALL_INTERESTS.map((interest) => {
                      const isSelected = selectedInterests.includes(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          style={{
                            padding: '0.35rem 0.65rem',
                            borderRadius: '9999px',
                            border: '1px solid',
                            borderColor: isSelected ? 'var(--tourism-forest)' : 'var(--tourism-sand-border)',
                            backgroundColor: isSelected ? 'var(--tourism-forest-light)' : '#FFFFFF',
                            color: isSelected ? 'var(--tourism-forest-dark)' : '#64748B',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {isSelected ? '✓ ' : ''}{interest}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isGenerating}
                  style={{
                    backgroundColor: 'var(--tourism-earth)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '0.85rem',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 14px rgba(200, 90, 50, 0.35)'
                  }}
                >
                  <Sparkles size={16} />
                  <span>{isGenerating ? 'Generating Itinerary...' : 'Generate Day-by-Day Plan'}</span>
                </button>
              </form>
            </div>
          </div>

          {/* ── Right Column: Generated Itinerary View (Section 29) ── */}
          <div>
            {currentItinerary && (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid var(--tourism-sand-border)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-subtle)',
                marginBottom: '3rem'
              }}>
                {/* Header Banner */}
                <div style={{ position: 'relative', height: '240px' }}>
                  <img
                    src={currentItinerary.heroImage}
                    alt={currentItinerary.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(15,23,42,0.85) 100%)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '1.75rem'
                  }}>
                    <div>
                      <div style={{
                        display: 'inline-flex',
                        gap: '0.4rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(6px)',
                        color: '#FFFFFF',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '9999px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        marginBottom: '0.5rem'
                      }}>
                        {currentItinerary.durationDays} Days • {currentItinerary.travelStyle} Style • {currentItinerary.budget}
                      </div>
                      <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                        {currentItinerary.title}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div style={{ padding: '1.75rem', borderBottom: '1px solid var(--tourism-sand-border)', backgroundColor: 'var(--tourism-sand-light)' }}>
                  <p style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.6, margin: 0 }}>
                    {currentItinerary.summary}
                  </p>
                </div>

                {/* Day-by-Day Morning / Afternoon / Evening Breakdown */}
                <div style={{ padding: '1.75rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {currentItinerary.days.map((day) => (
                      <div
                        key={day.dayNumber}
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: '12px',
                          border: '1.5px solid var(--tourism-sand-border)',
                          overflow: 'hidden'
                        }}
                      >
                        {/* Day Header */}
                        <div style={{
                          backgroundColor: 'var(--tourism-sand)',
                          padding: '0.85rem 1.25rem',
                          borderBottom: '1px solid var(--tourism-sand-border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}>
                          <span style={{ fontSize: '1rem', fontWeight: 900, color: '#0F172A' }}>
                            {day.title || `Day ${day.dayNumber}`}
                          </span>
                          <span style={{
                            backgroundColor: 'var(--tourism-earth)',
                            color: '#FFFFFF',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            padding: '0.2rem 0.55rem',
                            borderRadius: '4px'
                          }}>
                            Day {day.dayNumber}
                          </span>
                        </div>

                        {/* Segments */}
                        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {/* Morning */}
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              backgroundColor: '#FEF3C7',
                              color: '#D97706',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <Sun size={17} />
                            </div>
                            <div>
                              <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0F172A', marginBottom: '0.2rem' }}>
                                Morning Experience
                              </div>
                              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                                {day.morning}
                              </p>
                            </div>
                          </div>

                          {/* Afternoon */}
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              backgroundColor: '#FCEEE8',
                              color: 'var(--tourism-earth)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <Sunset size={17} />
                            </div>
                            <div>
                              <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0F172A', marginBottom: '0.2rem' }}>
                                Afternoon Exploration
                              </div>
                              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                                {day.afternoon}
                              </p>
                            </div>
                          </div>

                          {/* Evening */}
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              backgroundColor: '#E0F2FE',
                              color: 'var(--tourism-sky)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <Moon size={17} />
                            </div>
                            <div>
                              <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0F172A', marginBottom: '0.2rem' }}>
                                Evening Magic & Dinner
                              </div>
                              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                                {day.evening}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
