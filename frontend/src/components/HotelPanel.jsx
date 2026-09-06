import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getHotels } from '../api/client';
import { 
  Hotel, 
  Star, 
  MapPin, 
  Phone, 
  IndianRupee, 
  Filter,
  ExternalLink,
  Globe,
  X,
  Luggage,
  ZoomIn
} from 'lucide-react';

const hotelCardVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: (custom) => ({
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.35, 
      delay: custom * 0.08,
      ease: [0.25, 1, 0.5, 1] 
    }
  })
};

export default function HotelPanel({ cityName, t = {}, onOpenLightbox }) {
  const [selectedTier, setSelectedTier] = useState('all');
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBookingModal, setActiveBookingModal] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadHotels() {
      setLoading(true);
      const res = await getHotels(cityName || 'Bangalore', selectedTier);
      if (isMounted) {
        setHotels(res.data || []);
        setLoading(false);
      }
    }
    loadHotels();
    return () => { isMounted = false; };
  }, [cityName, selectedTier]);

  const tiers = [
    { id: 'all', label: t.allTiers || 'All Tiers' },
    { id: 'budget', label: `${t.budgetTier || 'Budget'} (₹900 - ₹2.5k)` },
    { id: 'mid-range', label: `${t.midRangeTier || 'Mid-Range'} (₹3.5k - ₹8.9k)` },
    { id: 'luxury', label: `${t.luxuryTier || 'Luxury'} (₹11.5k+)` },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4 }}
      style={{ marginTop: '3.5rem' }}
    >
      <div className="glass-card" style={{ padding: '2rem' }}>
        
        {/* PANEL HEADER */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div className="badge badge-warning" style={{ marginBottom: '0.4rem' }}>
              <Hotel size={13} /> VERIFIED ACCOMMODATIONS & DIRECT BOOKING
            </div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
              {t.whereToStayTitle || 'Where to Stay in'} {cityName}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Directly linked to official luxury chains, boutique stays, and verified OTAs (MakeMyTrip, Booking.com).
            </p>
          </div>

          {/* TIER FILTER TABS WITH MOTION */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {tiers.map((tItem) => {
              const isActive = selectedTier === tItem.id;
              return (
                <motion.button
                  key={tItem.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedTier(tItem.id)}
                  className="btn"
                  style={{
                    padding: '0.45rem 0.9rem',
                    fontSize: '0.8rem',
                    background: isActive ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)' : 'rgba(255, 255, 255, 0.05)',
                    color: isActive ? '#fff' : 'var(--text-muted)',
                    border: isActive ? 'none' : '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    boxShadow: isActive ? '0 4px 15px var(--primary-glow)' : 'none',
                    cursor: 'pointer'
                  }}
                >
                  <Filter size={12} /> {tItem.label}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* HOTELS GRID WITH SCROLL INTERSECTION OBSERVER */}
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Fetching verified hotel listings for {cityName}...
          </div>
        ) : hotels.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No hotels found matching "{selectedTier}" tier in {cityName}.
          </div>
        ) : (
          <div className="grid-3">
            {hotels.map((hotel, index) => {
              const websiteUrl = hotel.website_url || `https://www.google.com/search?q=${encodeURIComponent(hotel.name + ' ' + (cityName || ''))}`;
              const primaryBookingUrl = hotel.booking_url || websiteUrl;

              return (
                <motion.div 
                  key={hotel.id || hotel.name}
                  custom={index}
                  variants={hotelCardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.15 }}
                  whileHover={{ y: -3, borderColor: 'var(--border-glow)' }}
                  className="glass-card" 
                  style={{
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    background: 'rgba(255, 255, 255, 0.02)'
                  }}
                >
                  <div>
                    {/* Hotel Image with Zoom-on-Hover & Lightbox trigger */}
                    {hotel.image_url && (
                      <motion.div 
                        whileHover={{ scale: 1.04 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        style={{
                          height: '140px',
                          width: '100%',
                          borderRadius: 'var(--radius-sm)',
                          overflow: 'hidden',
                          marginBottom: '1rem',
                          position: 'relative',
                          cursor: 'pointer'
                        }}
                        onClick={() => onOpenLightbox && onOpenLightbox({
                          url: hotel.image_url,
                          title: hotel.name,
                          subtitle: `${hotel.distance_from_center_km || 2} km from city center • ${hotel.price_range} Tier`,
                          category: `${hotel.star_rating || 4}-Star Accommodation`,
                          rating: hotel.star_rating
                        })}
                      >
                        <img src={hotel.image_url} alt={hotel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          background: 'rgba(0, 0, 0, 0.65)',
                          backdropFilter: 'blur(4px)',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '6px',
                          color: '#fff',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          <Globe size={11} color="var(--primary-light)" /> Preview <ZoomIn size={10} />
                        </div>
                      </motion.div>
                    )}

                    {/* Header: Tier & Rating */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span className={`badge ${
                        hotel.price_range === 'Luxury' ? 'badge-warning' : 
                        hotel.price_range === 'Budget' ? 'badge-success' : 'badge-warning'
                      }`} style={{ fontSize: '0.75rem' }}>
                        {hotel.price_range}
                      </span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.15rem', color: '#FBBF24', fontSize: '0.85rem' }}>
                        {Array.from({ length: hotel.star_rating || 3 }).map((_, i) => (
                          <Star key={i} size={13} fill="#FBBF24" />
                        ))}
                      </div>
                    </div>

                    {/* Hotel Name with Direct Link */}
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>
                      <a 
                        href={websiteUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                      >
                        <span>{hotel.name}</span>
                        <ExternalLink size={14} color="var(--text-muted)" />
                      </a>
                    </h4>

                    {/* Distance & Address */}
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.75rem' }}>
                      <MapPin size={13} color="var(--primary-light)" />
                      <span><strong>{hotel.distance_from_center_km || 2.0} km</strong> from city center</span>
                    </div>

                    {/* Contact Phone */}
                    {hotel.contact_phone && (
                      <div style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.85rem' }}>
                        <Phone size={13} color="#34D399" />
                        <a href={`tel:${hotel.contact_phone}`} style={{ color: '#94A3B8', textDecoration: 'none' }}>
                          {hotel.contact_phone}
                        </a>
                      </div>
                    )}

                    {/* Amenities */}
                    {hotel.amenities && hotel.amenities.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                        {hotel.amenities.map((item, idx) => (
                          <span key={idx} style={{
                            fontSize: '0.725rem',
                            background: 'rgba(255, 255, 255, 0.06)',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            color: '#E5E7EB'
                          }}>
                            {item}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Nightly Price & Interactive Booking Footer */}
                  <div style={{
                    paddingTop: '0.75rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    flexWrap: 'wrap'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                        {t.nightlyRate || 'Avg Nightly Rate'}
                      </span>
                      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-light)', display: 'flex', alignItems: 'center' }}>
                        <IndianRupee size={16} />{Number(hotel.avg_nightly_rate_inr).toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* DUAL ACTION BUTTONS: DIRECT BOOK & PORTALS */}
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={primaryBookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{
                          padding: '0.4rem 0.85rem',
                          fontSize: '0.8rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          textDecoration: 'none'
                        }}
                      >
                        <Luggage size={13} />
                        <span>Book Stay</span>
                        <ExternalLink size={11} />
                      </motion.a>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setActiveBookingModal(hotel)}
                        className="btn btn-outline"
                        style={{ padding: '0.4rem 0.65rem', fontSize: '0.75rem' }}
                        title="View all booking portals (MakeMyTrip, Booking.com, Official Website)"
                      >
                        Portals
                      </motion.button>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* BOOKING PORTALS MODAL OVERLAY WITH MOTION */}
      <AnimatePresence>
        {activeBookingModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(10px)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem'
            }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="glass-card" 
              style={{
                maxWidth: '540px',
                width: '100%',
                padding: '2rem',
                background: 'rgba(12, 18, 36, 0.96)',
                border: '1px solid var(--border-glow)',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)'
              }}
            >
              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                  <span className="badge badge-warning" style={{ marginBottom: '0.3rem', fontSize: '0.75rem' }}>
                    INSTANT REDIRECTION PORTALS
                  </span>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff' }}>
                    Book {activeBookingModal.name}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Select your preferred portal to book directly with live pricing & discounts:
                  </p>
                </div>
                <button 
                  onClick={() => setActiveBookingModal(null)}
                  style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: '0.2rem' }}
                >
                  <X size={22} />
                </button>
              </div>

              {/* Portal Redirection Links List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {activeBookingModal.portals?.map((portal, pIdx) => (
                  <motion.a
                    key={pIdx}
                    whileHover={{ x: 3, borderColor: 'var(--primary-light)' }}
                    whileTap={{ scale: 0.98 }}
                    href={portal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.9rem 1.2rem',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: 'var(--radius-sm)',
                      textDecoration: 'none',
                      transition: 'background 0.15s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: 'rgba(255, 87, 34, 0.18)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Globe size={18} color="var(--primary-light)" />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
                          {portal.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {portal.label}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#34D399', background: 'rgba(52, 211, 153, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                        {portal.badge}
                      </span>
                      <ExternalLink size={15} color="#9CA3AF" />
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* Direct Call Option */}
              {activeBookingModal.contact_phone && (
                <div style={{
                  padding: '0.85rem 1rem',
                  background: 'rgba(52, 211, 153, 0.08)',
                  border: '1px solid rgba(52, 211, 153, 0.2)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.25rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#E5E7EB' }}>
                    <Phone size={16} color="#34D399" />
                    <span>Call Front Desk: <strong>{activeBookingModal.contact_phone}</strong></span>
                  </div>
                  <a
                    href={`tel:${activeBookingModal.contact_phone}`}
                    className="btn btn-outline"
                    style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem', borderColor: '#34D399', color: '#34D399' }}
                  >
                    Call Now
                  </a>
                </div>
              )}

              <button
                type="button"
                onClick={() => setActiveBookingModal(null)}
                className="btn btn-outline"
                style={{ width: '100%', padding: '0.6rem' }}
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
