import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCities } from '../api/client';
import { MapPin, Calendar, Compass, Sparkles, ChevronDown, Check, Search } from 'lucide-react';

export default function CitySelector({
  selectedCity,
  setSelectedCity,
  days,
  setDays,
  onGenerate,
  loading,
  t = {}
}) {
  const [cities, setCities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    async function fetchCities() {
      const res = await getCities();
      if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
        setCities(res.data);
      } else {
        // Fallback default 11 seeded cities
        setCities([
          { id: 1, name: 'Bangalore', state: 'Karnataka' },
          { id: 2, name: 'Goa', state: 'Goa' },
          { id: 3, name: 'Chennai', state: 'Tamil Nadu' },
          { id: 4, name: 'Jaipur', state: 'Rajasthan' },
          { id: 5, name: 'Agra', state: 'Uttar Pradesh' },
          { id: 6, name: 'Kochin', state: 'Kerala' },
          { id: 7, name: 'Pondicherry', state: 'Puducherry' },
          { id: 8, name: 'Yercaud', state: 'Tamil Nadu' },
          { id: 9, name: 'Delhi', state: 'Delhi NCR' },
          { id: 10, name: 'Munnar', state: 'Kerala' },
          { id: 11, name: 'Varanasi', state: 'Uttar Pradesh' }
        ]);
      }
    }
    fetchCities();
  }, []);

  const filteredCities = cities.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.state && c.state.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelectCity = (cityName) => {
    setSelectedCity(cityName);
    setIsDropdownOpen(false);
    setSearchQuery('');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="glass-card" 
      style={{ padding: '2.25rem', maxWidth: '820px', margin: '0 auto' }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.75rem', marginBottom: '1.75rem' }}>
        
        {/* CITY SEARCHABLE DROPDOWN */}
        <div style={{ position: 'relative' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} color="var(--primary-light)" />
            {t.selectDestination || 'Select Destination City'}
          </label>

          <motion.button
            whileTap={{ scale: 0.99 }}
            type="button"
            className="input-field"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              cursor: 'pointer',
              textAlign: 'left',
              fontWeight: 700,
              fontSize: '1rem',
              color: '#fff'
            }}
          >
            <span>{selectedCity}</span>
            <motion.div
              animate={{ rotate: isDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={18} color="var(--text-muted)" />
            </motion.div>
          </motion.button>

          {/* DROPDOWN OVERLAY WITH MOTION */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.18 }}
                className="glass-card" 
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '0.5rem',
                  zIndex: 100,
                  padding: '0.75rem',
                  maxHeight: '280px',
                  overflowY: 'auto',
                  border: '1px solid var(--border-glow)',
                  boxShadow: '0 12px 35px rgba(0, 0, 0, 0.65)'
                }}
              >
                {/* Search Box inside Dropdown */}
                <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
                  <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Search 11 cities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.4rem 0.5rem 0.4rem 2rem',
                      fontSize: '0.85rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#fff'
                    }}
                    autoFocus
                  />
                </div>

                {/* City List Items */}
                {filteredCities.length === 0 ? (
                  <div style={{ padding: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    No matching city
                  </div>
                ) : (
                  filteredCities.map((c) => (
                    <motion.div
                      key={c.id || c.name}
                      whileHover={{ x: 3, backgroundColor: 'rgba(234, 88, 12, 0.2)' }}
                      onClick={() => handleSelectCity(c.name)}
                      style={{
                        padding: '0.6rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justify: 'space-between',
                        background: selectedCity === c.name ? 'rgba(234, 88, 12, 0.25)' : 'transparent',
                        color: selectedCity === c.name ? 'var(--primary-light)' : '#fff',
                        transition: 'background 0.15s'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{c.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.state}</div>
                      </div>
                      {selectedCity === c.name && <Check size={16} color="var(--primary-light)" />}
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* DAYS COUNTER */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} color="var(--secondary-light)" />
            {t.daysAvailable || 'Days Available (1-10 Days)'}
          </label>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <motion.button
              whileTap={{ scale: 0.92 }}
              type="button"
              className="btn btn-outline"
              onClick={() => setDays(Math.max(1, days - 1))}
              style={{ width: '45px', height: '45px', padding: 0, fontSize: '1.2rem', fontWeight: 700 }}
            >
              -
            </motion.button>
            
            <div className="input-field" style={{ flex: 1, textAlign: 'center', fontWeight: 800, fontSize: '1.1rem' }}>
              {days} {days === 1 ? 'Day' : 'Days'}
            </div>

            <motion.button
              whileTap={{ scale: 0.92 }}
              type="button"
              className="btn btn-outline"
              onClick={() => setDays(Math.min(10, days + 1))}
              style={{ width: '45px', height: '45px', padding: 0, fontSize: '1.2rem', fontWeight: 700 }}
            >
              +
            </motion.button>
          </div>
        </div>

      </div>

      {/* GENERATE ITINERARY ACTION BUTTON WITH MOTION */}
      <motion.button
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.985 }}
        onClick={() => onGenerate({ city: selectedCity, days })}
        disabled={loading}
        className="btn btn-primary"
        style={{
          width: '100%',
          padding: '1rem',
          fontSize: '1.05rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          gap: '0.5rem'
        }}
      >
        {loading ? (
          <>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
              <Compass size={18} />
            </motion.div>
            <span>{t.generatingBtn || 'Crafting Personalized Itinerary...'}</span>
          </>
        ) : (
          <>
            <Compass size={18} />
            <span>{t.generateBtn || 'Generate Smart Itinerary'}</span>
          </>
        )}
      </motion.button>
    </motion.div>
  );
}
