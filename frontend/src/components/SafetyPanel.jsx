import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getSafetyInfo } from '../api/client';
import { 
  ShieldCheck, 
  PhoneCall, 
  MapPin, 
  Star,
  ExternalLink,
  Shield,
  LifeBuoy
} from 'lucide-react';

const safetyItemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (custom) => ({
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.3, 
      delay: custom * 0.06,
      ease: "easeOut" 
    }
  })
};

export default function SafetyPanel({ cityName, t = {} }) {
  const [safetyData, setSafetyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadSafety() {
      setLoading(true);
      const res = await getSafetyInfo(cityName || 'Bangalore');
      if (isMounted) {
        setSafetyData(res);
        setLoading(false);
      }
    }
    loadSafety();
    return () => { isMounted = false; };
  }, [cityName]);

  if (loading) {
    return (
      <div className="glass-card" style={{ padding: '1.5rem', marginTop: '2.5rem' }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Loading safety resources for {cityName}...
        </div>
      </div>
    );
  }

  const { city, overallSafetyRating, safetyStatusTag, nationalHelplines, policeStations } = safetyData || {};

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4 }}
      style={{ marginTop: '3rem' }}
    >
      <div className="glass-card" style={{ padding: '2rem', borderLeft: '5px solid #EF4444' }}>
        
        {/* PANEL HEADER */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div className="badge badge-danger" style={{ marginBottom: '0.4rem' }}>
              <ShieldCheck size={13} /> PERSISTENT SAFETY & POLICE ASSISTANCE
            </div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {t.safetyPanelTitle || 'Tourist Safety & Police Resources'} ({city || cityName})
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              24/7 National Emergency Helplines, Police Stations & Area Safety Ratings.
            </p>
          </div>

          {/* OVERALL SAFETY INDEX BADGE */}
          <motion.div 
            whileHover={{ scale: 1.03 }}
            style={{ background: 'rgba(244, 63, 94, 0.12)', border: '1px solid rgba(244, 63, 94, 0.35)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-sm)', textAlign: 'right' }}
          >
            <div style={{ fontSize: '0.75rem', color: '#FDA4AF', fontWeight: 700 }}>Area Safety Index</div>
            <div style={{ fontWeight: 800, fontSize: '1.3rem', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.3rem' }}>
              <Star size={16} fill="#34D399" color="#34D399" /> {overallSafetyRating || '4.8'} / 5.0
            </div>
            <div style={{ fontSize: '0.7rem', color: '#34D399', marginTop: '0.1rem' }}>
              {safetyStatusTag || 'Tourist Safe Precinct'}
            </div>
          </motion.div>
        </div>

        {/* NATIONAL & TOURIST HELPLINES QUICK DIAL GRID */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <LifeBuoy size={16} color="var(--primary-light)" /> {t.emergencyHelplinesTitle || 'National Emergency Quick-Dial Numbers'}
          </h4>

          <div className="grid-4">
            {nationalHelplines?.map((item, idx) => (
              <motion.a
                key={item.number}
                custom={idx}
                variants={safetyItemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ y: -3, borderColor: 'rgba(239, 68, 68, 0.5)' }}
                whileTap={{ scale: 0.98 }}
                href={`tel:${item.number}`}
                className="glass-card"
                style={{
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  textDecoration: 'none',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(244, 63, 94, 0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <PhoneCall size={18} color="#FDA4AF" />
                </div>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FDA4AF' }}>
                    {item.number}
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.description}
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>

        {/* POLICE STATIONS BY ZONE GRID */}
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Shield size={16} color="#34D399" /> {t.policePrecinctsTitle || 'Local Police Precincts in'} {city || cityName}
          </h4>

          <div className="grid-3">
            {policeStations?.map((st, idx) => (
              <motion.div 
                key={idx}
                custom={idx}
                variants={safetyItemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ y: -3 }}
                style={{
                  padding: '1.25rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                    {st.zone || 'Central Precinct'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#FBBF24', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <Star size={12} fill="#FBBF24" /> {st.area_safety_rating || 4.8} / 5.0
                  </span>
                </div>

                <h5 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>
                  {st.station_name}
                </h5>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.3rem' }}>
                  <MapPin size={14} color="var(--primary-light)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{st.address}</span>
                </p>

                <div style={{
                  paddingTop: '0.65rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem'
                }}>
                  <a href={`tel:${st.contact_number}`} style={{ color: '#FDA4AF', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <PhoneCall size={13} /> {st.contact_number}
                  </a>

                  {st.latitude && st.longitude && (
                    <motion.a 
                      whileHover={{ scale: 1.05 }}
                      href={`https://www.google.com/maps/search/?api=1&query=${st.latitude},${st.longitude}`}
                      target="_blank" 
                      rel="noreferrer"
                      style={{ color: '#38BDF8', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.2rem', fontWeight: 600 }}
                    >
                      Map <ExternalLink size={11} />
                    </motion.a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
