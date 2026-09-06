import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../components/Header';
import CitySelector from '../components/CitySelector';
import ItineraryView from '../components/ItineraryView';
import HealthBadge from '../components/HealthBadge';
import Footer from '../components/Footer';
import SosModal from '../components/SosModal';
import BackgroundScene from '../components/BackgroundScene';
import { generateItinerary } from '../api/client';
import { i18n } from '../api/i18n';
import { Sparkles, Compass, AlertCircle, Loader2 } from 'lucide-react';

export default function HomePage() {
  const [selectedCity, setSelectedCity] = useState('Bangalore');
  const [days, setDays] = useState(3);
  const [itineraryData, setItineraryData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Background Scenery State
  const [activeScene, setActiveScene] = useState('auto');

  // Multi-Language State (English / Hindi)
  const [lang, setLang] = useState('en');
  const t = i18n[lang] || i18n.en;

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'hi' : 'en');
  };

  const handleGenerate = async ({ city, days }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateItinerary(city, days);
      setItineraryData(data);
    } catch (err) {
      console.error('Itinerary generation error:', err);
      setError(err.message || 'Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* REAL TOURIST LANDMARK SCENIC BACKGROUND LAYER WITH BLURS & ORBS */}
      <BackgroundScene activeScene={activeScene} cityName={selectedCity} />

      <Header 
        currentLang={lang} 
        onToggleLang={toggleLanguage} 
        activeScene={activeScene}
        onSelectScene={setActiveScene}
      />

      <main className="container" style={{ flex: 1, paddingBottom: '4rem', position: 'relative', zIndex: 1 }}>
        
        {/* HERO BANNER WITH MOTION */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{ textAlign: 'center', margin: '2rem 0 3rem 0' }}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="badge badge-warning" 
            style={{ margin: '0 auto 1rem auto' }}
          >
            <Sparkles size={13} /> {t.brandSubtitle || 'SMART CITY TOURIST ITINERARY'}
          </motion.div>

          <h1 style={{ fontSize: '3.1rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1.15 }}>
            {t.heroTitleLine1} <span className="gradient-text">{t.heroTitleLine2}</span>
          </h1>

          <p style={{ maxWidth: '640px', margin: '1.25rem auto 0 auto', color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>
            {t.heroSubtitle}
          </p>
        </motion.div>

        {/* CITY & DAYS SELECTOR CARD */}
        <CitySelector
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          days={days}
          setDays={setDays}
          onGenerate={handleGenerate}
          loading={loading}
          t={t}
        />

        {/* LOADING ANIMATION STATE (CUSTOM MOTION MANDALA & COMPASS) */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.25 }}
              className="glass-card"
              style={{
                maxWidth: '600px',
                margin: '2.5rem auto 0 auto',
                padding: '2.5rem 2rem',
                textAlign: 'center',
                border: '1px solid var(--border-glow)',
                background: 'rgba(10, 16, 35, 0.92)'
              }}
            >
              <div style={{ position: 'relative', width: '72px', height: '72px', margin: '0 auto 1.25rem auto' }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    border: '3px dashed var(--primary-light)',
                    position: 'absolute',
                    top: 0,
                    left: 0
                  }}
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                  style={{
                    width: '75%',
                    height: '75%',
                    borderRadius: '50%',
                    border: '2px solid var(--secondary-light)',
                    position: 'absolute',
                    top: '12.5%',
                    left: '12.5%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Compass size={24} color="var(--primary-light)" />
                </motion.div>
              </div>

              <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: '0.4rem' }}>
                {t.generatingBtn || 'Crafting Personalized Itinerary...'}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Optimizing geographic clusters, travel durations & time-of-day sequencing for {selectedCity}.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ERROR ADVISORY */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-card" 
              style={{ padding: '1rem 1.5rem', marginTop: '2rem', borderLeft: '4px solid #F43F5E', color: '#FDA4AF', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <AlertCircle size={18} />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ITINERARY RESULT DISPLAY WITH MOTION */}
        <AnimatePresence mode="wait">
          {itineraryData && !loading && (
            <motion.div
              key={itineraryData.city?.name + itineraryData.requestedDays}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <ItineraryView data={itineraryData} lang={lang} t={t} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* HEALTH STATUS FOOTER BADGE */}
        <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'center' }}>
          <HealthBadge />
        </div>
      </main>

      {/* FLOATING SOS BUTTON */}
      <SosModal cityName={selectedCity} t={t} />

      <Footer />
    </div>
  );
}
