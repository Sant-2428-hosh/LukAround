import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HotelPanel from './HotelPanel';
import SafetyPanel from './SafetyPanel';
import BudgetSummary from './BudgetSummary';
import ImageLightbox from './ImageLightbox';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Compass, 
  Bus, 
  Tag, 
  Star,
  ExternalLink,
  IndianRupee,
  Navigation,
  Sun,
  Sunset,
  Info,
  Users,
  Footprints,
  Car,
  Download,
  ZoomIn
} from 'lucide-react';

const stopCardVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: (custom) => ({
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.38, 
      delay: custom * 0.1,
      ease: [0.25, 1, 0.5, 1] 
    }
  })
};

export default function ItineraryView({ data, lang = 'en', t = {} }) {
  const [lightboxImage, setLightboxImage] = useState(null);

  if (!data || !data.itinerary) return null;

  const { city, requestedDays, itinerary, transportOptions, meta } = data;
  const [activeDay, setActiveDay] = React.useState(1);

  const activeDaySchedule = itinerary.find(d => d.day === activeDay) || itinerary[0];

  const handlePrintPdf = () => {
    window.print();
  };

  const getIdealTimeBadge = (timeOfDay) => {
    switch ((timeOfDay || '').toLowerCase()) {
      case 'morning':
        return (
          <span className="badge badge-warning" style={{ fontSize: '0.75rem' }}>
            <Sun size={12} /> Ideal in Morning
          </span>
        );
      case 'afternoon':
        return (
          <span className="badge" style={{ fontSize: '0.75rem', background: 'rgba(255, 112, 67, 0.15)', color: '#FF7043', border: '1px solid rgba(255, 112, 67, 0.3)' }}>
            <Sun size={12} /> Ideal Midday / Indoor
          </span>
        );
      case 'evening':
        return (
          <span className="badge" style={{ fontSize: '0.75rem', background: 'rgba(168, 85, 247, 0.15)', color: '#C084FC', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
            <Sunset size={12} /> Ideal at Sunset / Evening
          </span>
        );
      default:
        return null;
    }
  };

  const getTransitIcon = (mode) => {
    const m = (mode || '').toLowerCase();
    if (m.includes('walk')) return <Footprints size={14} color="#34D399" />;
    if (m.includes('auto')) return <span style={{ fontSize: '0.9rem' }}>🛺</span>;
    if (m.includes('cab') || m.includes('taxi')) return <Car size={14} color="#38BDF8" />;
    return <Bus size={14} color="#FBBF24" />;
  };

  return (
    <div style={{ marginTop: '3rem' }}>
      
      {/* ITINERARY HEADER WITH DOWNLOAD/PRINT BUTTON */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="glass-card" 
        style={{ padding: '2rem', marginBottom: '2rem', borderLeft: '5px solid var(--primary-light)' }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div>
            <div className="badge badge-warning" style={{ marginBottom: '0.5rem' }}>
              <Compass size={13} /> SMART ITINERARY & TRANSIT ROUTER
            </div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>
              {city.name} — {requestedDays} Days Exploration Plan
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              {city.state}, India • Engine: <span style={{ color: 'var(--primary-light)', fontWeight: 600 }}>{meta?.engine || 'Proximity & Transit Router'}</span>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* DOWNLOAD / PRINT PDF BUTTON WITH MOTION */}
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 6px 20px rgba(56, 189, 248, 0.35)' }}
              whileTap={{ scale: 0.96 }}
              onClick={handlePrintPdf}
              className="btn btn-outline"
              style={{
                padding: '0.6rem 1.1rem',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                borderColor: '#38BDF8',
                color: '#38BDF8'
              }}
              title="Export itinerary to PDF or Print view"
            >
              <Download size={15} />
              <span>{t.downloadItineraryBtn || 'Download / Print PDF'}</span>
            </motion.button>

            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Duration</div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--primary-light)' }}>{requestedDays} Days</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* PHASE 7: BUDGET CALCULATOR SUMMARY CARD */}
      <BudgetSummary itineraryData={data} lang={lang} t={t} />

      {/* DAY NAVIGATION TABS WITH SMOOTH SPRING HOVER */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.75rem',
        marginBottom: '1.5rem'
      }}>
        {itinerary.map((dayItem) => {
          const isActive = dayItem.day === activeDay;
          return (
            <motion.button
              key={dayItem.day}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveDay(dayItem.day)}
              className="btn"
              style={{
                background: isActive ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)' : 'rgba(255, 255, 255, 0.05)',
                color: isActive ? '#fff' : 'var(--text-muted)',
                border: isActive ? 'none' : '1px solid var(--border-color)',
                padding: '0.65rem 1.3rem',
                borderRadius: 'var(--radius-sm)',
                whiteSpace: 'nowrap',
                boxShadow: isActive ? '0 4px 18px var(--primary-glow)' : 'none',
                cursor: 'pointer'
              }}
            >
              <Calendar size={16} /> Day {dayItem.day} ({dayItem.stops?.length || 0} Stops)
            </motion.button>
          );
        })}
      </div>

      {/* ACTIVE DAY SCHEDULE WITH INTERSECTION OBSERVER SCROLL ANIMATIONS */}
      <AnimatePresence mode="wait">
        {activeDaySchedule && (
          <motion.div 
            key={activeDaySchedule.day}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.28 }}
            style={{ marginBottom: '3rem' }}
          >
            <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#fff' }}>
                {activeDaySchedule.title}
              </h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Includes inter-stop transport guides & fare estimates
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {activeDaySchedule.stops?.map((stop, index) => {
                const transit = stop.transitToNext;
                const nextStop = activeDaySchedule.stops[index + 1];

                return (
                  <motion.div 
                    key={stop.order || index}
                    custom={index}
                    variants={stopCardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                  >
                    {/* STOP CARD WITH HOVER LIFT & LIGHTBOX ON CLICK */}
                    <motion.div 
                      whileHover={{ y: -3, borderColor: 'var(--border-glow)' }}
                      transition={{ duration: 0.22 }}
                      className="glass-card" 
                      style={{ padding: '1.6rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-start', position: 'relative' }}
                    >
                      
                      {/* Order Number Badge */}
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1.1rem',
                        color: '#fff',
                        flexShrink: 0,
                        boxShadow: '0 4px 15px var(--primary-glow)'
                      }}>
                        #{stop.order}
                      </div>

                      {/* Image Preview with Zoom-on-Hover and Click-to-Lightbox */}
                      {stop.imageUrl && (
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          onClick={() => setLightboxImage({
                            url: stop.imageUrl,
                            title: stop.name,
                            subtitle: stop.description,
                            category: stop.category,
                            rating: stop.rating
                          })}
                          style={{
                            width: '130px',
                            height: '100px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            flexShrink: 0,
                            position: 'relative',
                            cursor: 'pointer'
                          }}
                          title="Click to view full photo"
                        >
                          <img src={stop.imageUrl} alt={stop.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div style={{
                            position: 'absolute',
                            bottom: '4px',
                            right: '4px',
                            background: 'rgba(0,0,0,0.6)',
                            borderRadius: '4px',
                            padding: '2px 4px',
                            display: 'flex',
                            alignItems: 'center',
                            color: '#fff'
                          }}>
                            <ZoomIn size={12} />
                          </div>
                        </motion.div>
                      )}

                      <div style={{ flex: 1, minWidth: '240px' }}>
                        {/* Time & Category Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.4rem' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-light)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Clock size={16} /> {stop.suggestedTime}
                          </span>
                          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                            {getIdealTimeBadge(stop.idealTimeOfDay)}
                            <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                              <Tag size={12} /> {stop.category}
                            </span>
                            <span className="badge badge-warning" style={{ fontSize: '0.75rem' }}>
                              <Clock size={12} /> {stop.durationMins} Mins
                            </span>
                          </div>
                        </div>

                        {/* Attraction Title */}
                        <h4 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.4rem', color: '#fff' }}>
                          {stop.name}
                        </h4>

                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                          {stop.description}
                        </p>

                        {/* Special Travel Advisory Notes Banner */}
                        {stop.notes && (
                          <div style={{
                            marginBottom: '0.85rem',
                            fontSize: '0.8rem',
                            background: 'rgba(255, 87, 34, 0.12)',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '8px',
                            borderLeft: '3px solid var(--primary-light)',
                            color: 'var(--primary-light)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                          }}>
                            <Info size={14} color="var(--primary-light)" style={{ flexShrink: 0 }} />
                            <span><strong>{t.travelTipNotes || 'Travel Tip & Notes'}:</strong> {stop.notes}</span>
                          </div>
                        )}

                        {/* Meta Tags: Rating, Entry Fee, Hours, Crowd Level, Map */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: '#94A3B8' }}>
                          {stop.rating && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#FBBF24' }}>
                              <Star size={14} fill="#FBBF24" /> {stop.rating} Rating
                            </span>
                          )}

                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                            <IndianRupee size={13} /> {stop.entryFeeInr > 0 ? `Fee: ₹${stop.entryFeeInr}` : 'Free Entry'}
                          </span>

                          {stop.openingHours && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                              <Clock size={13} /> Hours: {stop.openingHours}
                            </span>
                          )}

                          {stop.crowdLevelByHour && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#34D399' }} title="Crowd pattern">
                              <Users size={13} /> Crowd: {stop.crowdLevelByHour}
                            </span>
                          )}

                          {stop.latitude && stop.longitude && (
                            <motion.a 
                              whileHover={{ scale: 1.05 }}
                              href={`https://www.google.com/maps/search/?api=1&query=${stop.latitude},${stop.longitude}`} 
                              target="_blank" 
                              rel="noreferrer"
                              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#38BDF8', fontWeight: 600 }}
                            >
                              <MapPin size={13} /> View Map <ExternalLink size={11} />
                            </motion.a>
                          )}
                        </div>
                      </div>

                    </motion.div>

                    {/* INTER-STOP "HOW TO GET HERE" STRIP WITH MOTION */}
                    {transit && nextStop && (
                      <motion.div 
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.08, duration: 0.25 }}
                        style={{
                          margin: '0.75rem 0 0 1.5rem',
                          padding: '1rem 1.25rem',
                          background: 'rgba(0, 229, 255, 0.08)',
                          border: '1px dashed rgba(0, 229, 255, 0.35)',
                          borderRadius: 'var(--radius-sm)',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.65rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--secondary-light)' }}>
                            <Navigation size={15} color="var(--secondary-light)" />
                            <span>{t.howToGetNext || 'HOW TO GET TO NEXT STOP'}: {nextStop.name} (~{transit.distanceKm} km)</span>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {t.recommendedMode || 'Recommended Mode'}: <strong style={{ color: 'var(--primary-light)' }}>{transit.recommendedMode}</strong>
                          </span>
                        </div>

                        {/* Transit Mode Chips */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                          {transit.modes?.map((m, mIdx) => (
                            <motion.div 
                              key={mIdx}
                              whileHover={{ scale: 1.05 }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                padding: '0.35rem 0.75rem',
                                background: m.recommended ? 'rgba(255, 87, 34, 0.22)' : 'rgba(255, 255, 255, 0.05)',
                                border: m.recommended ? '1px solid rgba(255, 87, 34, 0.45)' : '1px solid rgba(255, 255, 255, 0.08)',
                                borderRadius: '20px',
                                fontSize: '0.8rem'
                              }}
                            >
                              {getTransitIcon(m.mode)}
                              <span style={{ fontWeight: 600, color: m.recommended ? 'var(--primary-light)' : '#E5E7EB' }}>
                                {m.mode}
                              </span>
                              <span style={{ color: 'var(--text-muted)' }}>•</span>
                              <span style={{ color: '#34D399', fontWeight: 600 }}>
                                {m.fareInr > 0 ? `₹${m.fareInr}` : 'Free'}
                              </span>
                              <span style={{ color: 'var(--text-muted)' }}>({m.timeMins}m)</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PHASE 5: HOTEL LISTINGS PANEL */}
      <HotelPanel cityName={city?.name} t={t} onOpenLightbox={setLightboxImage} />

      {/* PHASE 6: PERSISTENT SAFETY & POLICE PANEL */}
      <SafetyPanel cityName={city?.name} t={t} />

      {/* LOCAL TRANSIT SUMMARY WITH SCROLL MOTION */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        style={{ marginTop: '2.5rem' }}
      >
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Bus size={20} color="var(--primary-light)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Local City Transit Guide — {city.name}</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
            {transportOptions?.map((item, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -2, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-sm)', transition: 'background 0.2s' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>
                  <span>{item.mode}</span>
                  <span style={{ color: '#34D399', fontSize: '0.8rem' }}>~₹{item.avg_cost_per_km_inr || 15}/km</span>
                </div>
                {item.tips && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {item.tips}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* REUSABLE IMAGE LIGHTBOX MODAL */}
      <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />

    </div>
  );
}
