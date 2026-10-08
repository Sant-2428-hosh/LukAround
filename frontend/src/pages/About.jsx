import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Database,
  Layers,
  ShieldCheck,
  Award,
  Globe,
  MapPin,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function About() {
  return (
    <div className="tourism-page">
      {/* ── Page Header ── */}
      <div style={{
        background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
        color: '#FFFFFF',
        padding: '4.5rem 1.5rem',
        textAlign: 'center'
      }}>
        <div className="tourism-container" style={{ maxWidth: '850px' }}>
          <span className="tourism-badge badge-earth" style={{ marginBottom: '1rem' }}>
            Mission & Architecture
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900, marginBottom: '1rem' }}>
            About LukAround: Incredible India Tourism
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#94A3B8', lineHeight: 1.6, margin: '0 auto' }}>
            Building India's most comprehensive, scalable, and culturally authentic travel discovery platform, empowering travelers worldwide to discover the profound depth of Indian states, cities, and heritage wonders.
          </p>
        </div>
      </div>

      <div className="tourism-container" style={{ paddingTop: '3.5rem', maxWidth: '960px' }}>
        {/* Core Vision */}
        <section style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '2.5rem',
          border: '1px solid var(--tourism-sand-border)',
          boxShadow: 'var(--shadow-subtle)',
          marginBottom: '2.5rem'
        }}>
          <h2 className="tourism-heading" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>
            Our Primary Destination Hierarchy
          </h2>
          <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Unlike generic travel blogs or fragmented search results, LukAround models destination data using a strict relational hierarchy:
          </p>

          <div style={{
            backgroundColor: 'var(--tourism-sand)',
            borderRadius: '12px',
            padding: '1.25rem',
            fontFamily: 'monospace',
            fontSize: '0.92rem',
            color: 'var(--tourism-earth-dark)',
            lineHeight: 1.8,
            marginBottom: '1.5rem',
            border: '1px dashed var(--tourism-sand-border)'
          }}>
            India ➔ State ➔ City / Tourist Destination ➔ Places & Attractions ➔ Experiences ➔ Travel Information
          </div>

          <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.7 }}>
            Every state is populated with comprehensive overviews, best seasons to visit, major cities, top attractions, UNESCO World Heritage monuments, wildlife sanctuaries, religious sites, forts, palaces, lakes, adventure activities, local gastronomy, festivals, and transportation corridors.
          </p>
        </section>

        {/* Scalability Architecture */}
        <section style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '2.5rem',
          border: '1px solid var(--tourism-sand-border)',
          boxShadow: 'var(--shadow-subtle)',
          marginBottom: '2.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--tourism-forest)', marginBottom: '0.5rem' }}>
            <Database size={22} />
            <h3 style={{ fontSize: '1.6rem', color: '#0F172A', margin: 0, fontWeight: 800 }}>
              Future Scalability Roadmap
            </h3>
          </div>
          <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.7, marginBottom: '1.75rem' }}>
            The website and API architecture are structured to seamlessly scale without modifying component code:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {[
              'All 28 Indian States & 8 Union Territories',
              '1,000+ Verified Cities and Towns',
              '5,000+ Detailed Attraction Profiles',
              'Integrated Hotel & Homestay Bookings',
              'Train, Flight & Expressway Logistics',
              'Verified User Reviews & Travel Communities',
              'Offline-Ready Itinerary Planner',
              'AI Travel Assistant (Dishly & MindTrip)'
            ].map((feature, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <CheckCircle2 size={16} color="var(--tourism-forest)" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.9rem', color: '#1E293B', fontWeight: 600 }}>{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Content Integrity & Verification Policy */}
        <section style={{
          backgroundColor: 'var(--tourism-sand-light)',
          borderRadius: '16px',
          padding: '2.5rem',
          border: '1px solid var(--tourism-sand-border)',
          marginBottom: '3.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--tourism-earth)', marginBottom: '0.5rem' }}>
            <ShieldCheck size={22} />
            <h3 style={{ fontSize: '1.5rem', color: '#0F172A', margin: 0, fontWeight: 800 }}>
              Content Integrity & Factual Policy
            </h3>
          </div>
          <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.7, margin: 0 }}>
            In accordance with editorial standards, LukAround does not invent precise live operational details such as dynamic ticket prices, live queue times, or temporary seasonal restrictions unless verified by official state tourism boards or the Archaeological Survey of India (ASI). Tourism statistics reflect published 2024 Ministry of Tourism reports. Canonical names (e.g., Alappuzha with alias Alleppey; Bengaluru with alias Bangalore; Chhatrapati Sambhaji Nagar with alias Aurangabad) are strictly normalized across all URLs and database records.
          </p>
        </section>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Link
            to="/explore"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--tourism-earth)',
              color: '#FFFFFF',
              padding: '0.85rem 2rem',
              borderRadius: '9999px',
              fontWeight: 800,
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(200, 90, 50, 0.3)'
            }}
          >
            <span>Start Exploring India Now</span>
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </div>
  );
}
