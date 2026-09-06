import React from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, Ticket, Bus, Hotel, Calculator } from 'lucide-react';

export default function BudgetSummary({ itineraryData, lang = 'en', t = {} }) {
  if (!itineraryData || !itineraryData.itinerary) return null;

  const { requestedDays, itinerary } = itineraryData;

  // Calculate Total Attraction Entry Fees
  let totalEntryFees = 0;
  let totalTransitCost = 0;

  itinerary.forEach(day => {
    day.stops?.forEach(stop => {
      totalEntryFees += Number(stop.entryFeeInr || 0);

      if (stop.transitToNext && stop.transitToNext.modes) {
        const recMode = stop.transitToNext.modes.find(m => m.recommended) || stop.transitToNext.modes[0];
        if (recMode) {
          totalTransitCost += Number(recMode.fareInr || 0);
        }
      }
    });
  });

  // Estimated accommodation cost (~₹4,500/night mid-range estimate)
  const estNightlyRate = 4500;
  const totalAccommodation = estNightlyRate * requestedDays;

  // Grand Total Estimated Budget
  const grandTotal = totalEntryFees + totalTransitCost + totalAccommodation;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="glass-card" 
      style={{
        padding: '1.75rem',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(10, 17, 40, 0.65) 0%, rgba(234, 88, 12, 0.18) 100%)',
        border: '1px solid rgba(251, 146, 60, 0.35)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'rgba(234, 88, 12, 0.2)', display: 'flex' }}>
            <Calculator size={20} color="#FB923C" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
              {t.budgetCalculatorTitle || 'Estimated Trip Budget Breakdown'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Calculated sum of entry fees, transit fares & mid-range hotel stay for {requestedDays} Days
            </p>
          </div>
        </div>

        {/* GRAND TOTAL BADGE */}
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', color: '#FB923C', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {t.grandTotalBudget || 'Total Estimated Budget'}
          </span>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', textShadow: '0 0 15px rgba(52, 211, 153, 0.3)' }}>
            <IndianRupee size={22} />{grandTotal.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* COST CATEGORIES GRID */}
      <div className="grid-3">
        {/* Attraction Entry Fees */}
        <motion.div 
          whileHover={{ y: -2 }}
          style={{ padding: '1.1rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
            <Ticket size={15} color="#38BDF8" />
            <span>{t.entryFeesTotal || 'Attraction Entry Fees'}</span>
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center' }}>
            <IndianRupee size={17} />{totalEntryFees.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '0.2rem' }}>
            Sum of all sight ticket entry fees
          </div>
        </motion.div>

        {/* Inter-Stop Transit */}
        <motion.div 
          whileHover={{ y: -2 }}
          style={{ padding: '1.1rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
            <Bus size={15} color="#FBBF24" />
            <span>{t.transitCostsTotal || 'Inter-Stop Transit'}</span>
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center' }}>
            <IndianRupee size={17} />{totalTransitCost.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '0.2rem' }}>
            Sum of recommended inter-stop fares
          </div>
        </motion.div>

        {/* Hotel Accommodation */}
        <motion.div 
          whileHover={{ y: -2 }}
          style={{ padding: '1.1rem', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
            <Hotel size={15} color="#C084FC" />
            <span>{t.stayEstimateTotal || 'Est. Hotel Accommodation'}</span>
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center' }}>
            <IndianRupee size={17} />{totalAccommodation.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '0.2rem' }}>
            {requestedDays} Nights @ ~₹4,500/night mid-range
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
}
