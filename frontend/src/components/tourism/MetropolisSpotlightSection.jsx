import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  MapPin,
  ArrowRight,
  Navigation,
  Compass,
  Building2,
  Utensils,
  Hotel,
  ShieldCheck,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import SafeImage from './SafeImage';
import DirectionsModal from './DirectionsModal';
import { buildGoogleMapsSearchUrl } from '../../utils/googleMaps';

const METROPOLIS_DATA = [
  {
    id: 'mumbai',
    name: 'Mumbai',
    tagline: 'The Maximum City & Financial Capital of India',
    state: 'Maharashtra',
    stateSlug: 'maharashtra',
    citySlug: 'mumbai',
    url: '/india/maharashtra/mumbai',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
    description: "From Victorian Gothic UNESCO landmarks and the sweeping Arabian Sea curve of Marine Drive to the ancient rock-cut Kanheri Caves and sizzling street food, Mumbai is a world unto itself.",
    attractionCount: 20,
    topSpots: [
      'Gateway of India',
      "Marine Drive (Queen's Necklace)",
      'CSMT World Heritage Station',
      'Elephanta Caves',
      'Haji Ali Dargah',
      'Siddhivinayak Temple',
      'Juhu Beach',
      'Bandra Fort & Sea Link',
      'CSMVS Museum',
      'Sanjay Gandhi National Park'
    ],
    foodHighlights: ['Mumbai Vada Pav', 'Pav Bhaji', 'Bombay Duck (Bombil Fry)', 'Parsi Berry Pulao'],
    hotelHighlights: ['The Taj Mahal Palace', 'The Oberoi Mumbai', 'Taj Lands End Bandra', 'Hotel Marine Plaza'],
    badge: '★ First-Class Destination',
    badgeColor: '#E11D48',
    latitude: 18.9220,
    longitude: 72.8347
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad',
    tagline: 'The City of Pearls, Nizami Splendour & Tech Hub',
    state: 'Telangana',
    stateSlug: 'telangana',
    citySlug: 'hyderabad',
    url: '/india/telangana/hyderabad',
    image: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/71/Charminar_Hyderabad_1.jpg/1280px-Charminar_Hyderabad_1.jpg',
    description: "A 400-year-old jewel where royal Qutb Shahi and Asaf Jahi dynasties left monumental forts, diamond-trading bazaars, acoustic palaces, and the world's most celebrated Biryani culture.",
    attractionCount: 20,
    topSpots: [
      'Charminar',
      'Golconda Fort',
      'Hussain Sagar Lake & Buddha',
      'Salar Jung Museum',
      'Chowmahalla Palace',
      'Qutb Shahi Tombs',
      'Mecca Masjid',
      'Birla Mandir',
      'Ramoji Film City',
      'Taj Falaknuma Palace'
    ],
    foodHighlights: ['Hyderabadi Dum Mutton Biryani', 'Irani Chai & Osmania Biscuits', 'Shahi Haleem', 'Double Ka Meetha'],
    hotelHighlights: ['Taj Falaknuma Palace', 'ITC Kohenur HITEC City', 'Taj Krishna Banjara Hills', 'Courtyard Marriott'],
    badge: '★ First-Class Destination',
    badgeColor: '#7C3AED',
    latitude: 17.3616,
    longitude: 78.4747
  }
];

export default function MetropolisSpotlightSection() {
  const [directionsModalOpen, setDirectionsModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);

  const handleDirections = (item, e) => {
    e.preventDefault();
    setSelectedDestination(item);
    setDirectionsModalOpen(true);
  };

  return (
    <section className="section-metropolis-spotlight" style={{ padding: '4.5rem 0', backgroundColor: '#F8FAFC' }}>
      <div className="tourism-container">

        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '0.35rem 0.9rem', borderRadius: '9999px', fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.75rem' }}>
            <Sparkles size={13} color="#2563EB" />
            <span>Spotlight Indian Metropolises</span>
          </div>
          <h2 className="tourism-heading section-heading-xl" style={{ margin: '0 0 0.75rem' }}>
            Explore Mumbai & Hyderabad<br />
            <span style={{ color: 'var(--tourism-earth)' }}>As First-Class Destinations</span>
          </h2>
          <p className="tourism-subtitle" style={{ margin: 0, fontSize: '0.95rem' }}>
            Complete 20-attraction tourism coverage, verified coordinates, nearby luxury hotels, Dishly culinary trails, and Google Maps direction routing.
          </p>
        </div>

        {/* Two Grand Showcase Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
          {METROPOLIS_DATA.map(metro => {
            return (
              <div
                key={metro.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1px solid #E2E8F0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
              >
                {/* Hero Image */}
                <div style={{ position: 'relative', width: '100%', height: '240px', overflow: 'hidden' }}>
                  <SafeImage
                    src={metro.image}
                    alt={metro.name}
                    aspectRatio="16:9"
                    verified={true}
                    loading="lazy"
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.2) 60%, transparent 100%)' }} />

                  {/* Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '14px',
                      left: '14px',
                      backgroundColor: metro.badgeColor,
                      color: '#FFFFFF',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      zIndex: 3
                    }}
                  >
                    {metro.badge}
                  </div>

                  {/* Attraction Count Pill */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '14px',
                      right: '14px',
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      color: '#0F172A',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      zIndex: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <CheckCircle2 size={13} color="#16A34A" />
                    <span>{metro.attractionCount} Verified Spots</span>
                  </div>

                  {/* Title overlay */}
                  <div style={{ position: 'absolute', bottom: '14px', left: '16px', right: '16px', zIndex: 3 }}>
                    <div style={{ color: '#F8FAFC', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {metro.state}
                    </div>
                    <h3 style={{ color: '#FFFFFF', fontSize: '1.75rem', fontWeight: 900, margin: '2px 0 0', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                      {metro.name}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.55, margin: '0 0 1.25rem' }}>
                    {metro.description}
                  </p>

                  {/* Top Spots Chips */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.76rem', fontWeight: 800, color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Building2 size={13} color="var(--tourism-earth)" />
                      <span>Major Verified Attractions ({metro.attractionCount})</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {metro.topSpots.slice(0, 6).map((spot, i) => (
                        <span
                          key={i}
                          style={{
                            backgroundColor: '#F1F5F9',
                            color: '#334155',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.74rem',
                            fontWeight: 600
                          }}
                        >
                          {spot}
                        </span>
                      ))}
                      <span style={{ backgroundColor: '#E2E8F0', color: '#475569', padding: '3px 8px', borderRadius: '6px', fontSize: '0.74rem', fontWeight: 700 }}>
                        +14 more
                      </span>
                    </div>
                  </div>

                  {/* Culinary & Hotel Highlights */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', backgroundColor: '#F8FAFC', padding: '0.85rem', borderRadius: '10px', border: '1px solid #E2E8F0', marginBottom: '1.5rem', fontSize: '0.75rem' }}>
                    <div>
                      <div style={{ fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                        <Utensils size={12} color="#D97706" />
                        <span>Dishly Food</span>
                      </div>
                      <div style={{ color: '#64748B', lineHeight: 1.4 }}>
                        {metro.foodHighlights.slice(0, 2).join(', ')}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                        <Hotel size={12} color="#0D9488" />
                        <span>Verified Stays</span>
                      </div>
                      <div style={{ color: '#64748B', lineHeight: 1.4 }}>
                        {metro.hotelHighlights.slice(0, 2).join(', ')}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
                    <Link
                      to={metro.url}
                      className="tourism-btn tourism-btn-primary"
                      style={{
                        flex: 1,
                        padding: '0.65rem 1rem',
                        fontSize: '0.85rem',
                        justifyContent: 'center',
                        textDecoration: 'none'
                      }}
                    >
                      <span>Explore {metro.name} Hub</span>
                      <ArrowRight size={14} />
                    </Link>

                    <button
                      type="button"
                      onClick={(e) => handleDirections(metro, e)}
                      className="tourism-btn tourism-btn-outline"
                      style={{
                        padding: '0.65rem 0.9rem',
                        fontSize: '0.82rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <Navigation size={14} />
                      <span>Directions</span>
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Directions Modal */}
      {directionsModalOpen && selectedDestination && (
        <DirectionsModal
          isOpen={directionsModalOpen}
          onClose={() => setDirectionsModalOpen(false)}
          destination={selectedDestination}
        />
      )}
    </section>
  );
}
