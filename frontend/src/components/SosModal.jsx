import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, PhoneCall, X } from 'lucide-react';

export default function SosModal({ cityName, t = {} }) {
  const [isOpen, setIsOpen] = useState(false);

  const emergencyNumbers = [
    { name: 'National Emergency', number: '112', tag: 'Police, Fire, Ambulance', bg: '#EF4444' },
    { name: 'Women\'s Safety Helpline', number: '1091', tag: '24/7 Toll-free assistance', bg: '#EC4899' },
    { name: 'National Tourist Helpline', number: '1363', tag: '24/7 Multi-lingual Tourist Desk', bg: '#F59E0B' },
    { name: 'Medical Emergency', number: '108', tag: 'Ambulance & Trauma Response', bg: '#10B981' },
  ];

  return (
    <>
      {/* FLOATING SOS BUTTON WITH MOTION PULSE */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          zIndex: 9999,
          padding: '0.85rem 1.4rem',
          background: 'linear-gradient(135deg, #E11D48 0%, #BE123C 100%)',
          color: '#fff',
          fontWeight: 800,
          fontSize: '0.9rem',
          borderRadius: '50px',
          border: '2px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 8px 24px rgba(225, 29, 72, 0.55), 0 0 0 4px rgba(225, 29, 72, 0.2)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        >
          <ShieldAlert size={20} color="#fff" />
        </motion.div>
        <span>{t.sosButtonLabel || 'EMERGENCY SOS'}</span>
      </motion.button>

      {/* OVERLAY MODAL WITH MOTION */}
      <AnimatePresence>
        {isOpen && (
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
              backdropFilter: 'blur(8px)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem'
            }}
          >
            <motion.div 
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="glass-card" 
              style={{
                maxWidth: '520px',
                width: '100%',
                padding: '2rem',
                border: '2px solid #E11D48',
                background: 'rgba(15, 23, 42, 0.96)',
                boxShadow: '0 20px 50px rgba(225, 29, 72, 0.45)',
                borderRadius: 'var(--radius-md)'
              }}
            >
              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(225, 29, 72, 0.2)' }}>
                    <ShieldAlert size={24} color="#FB7185" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
                      {t.sosModalTitle || 'Emergency Contacts & Police'}
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: '#FB7185' }}>
                      {t.sosModalSubtitle || 'Press numbers below to call immediately'}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setIsOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: '0.2rem' }}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Quick Dial List with Motion */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                {emergencyNumbers.map((item) => (
                  <motion.a
                    key={item.number}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    href={`tel:${item.number}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem 1.25rem',
                      background: 'rgba(255, 255, 255, 0.04)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      textDecoration: 'none',
                      transition: 'background 0.15s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: item.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '1.1rem',
                        color: '#fff'
                      }}>
                        <PhoneCall size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {item.tag}
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FB7185', background: 'rgba(225, 29, 72, 0.15)', padding: '0.3rem 0.8rem', borderRadius: '8px' }}>
                      {item.number}
                    </div>
                  </motion.a>
                ))}
              </div>

              <div style={{ textAlign: 'center' }}>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="btn btn-outline"
                  style={{ width: '100%', padding: '0.65rem' }}
                >
                  {t.closeModal || 'Close Modal'}
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
