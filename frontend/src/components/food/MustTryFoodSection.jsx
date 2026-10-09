import React from 'react';
import { Sparkles, Utensils, MapPin, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function MustTryFoodSection({
  dishes = [],
  destinationName = '',
  onSelectDish = null
}) {
  const { openDishlyWithPrompt } = useApp();

  if (!dishes || dishes.length === 0) return null;

  return (
    <div style={{ marginBottom: '2.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <span className="tourism-badge badge-earth" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={12} />
            <span>Must-Try Local Food</span>
          </span>
          <h3 className="tourism-heading" style={{ fontSize: '1.5rem', marginTop: '0.25rem' }}>
            Authentic Regional Specialties in {destinationName}
          </h3>
        </div>
        <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
          Culturally curated & verified dishes
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '1rem'
        }}
      >
        {dishes.map((dish, idx) => {
          const isVeg = (dish.dietary || '').toLowerCase().includes('veg') && !(dish.dietary || '').toLowerCase().includes('non');
          const isNonVeg = (dish.dietary || '').toLowerCase().includes('non');

          return (
            <div
              key={dish.id || idx}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
                position: 'relative'
              }}
            >
              {/* Top tag & dietary */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                <span
                  style={{
                    backgroundColor: '#FEF3C7',
                    color: '#B45309',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    textTransform: 'uppercase'
                  }}
                >
                  {dish.category || 'Local Specialty'}
                </span>

                {isVeg && (
                  <span
                    style={{
                      backgroundColor: '#ECFDF5',
                      color: '#059669',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      border: '1px solid #A7F3D0'
                    }}
                  >
                    Vegetarian
                  </span>
                )}
                {isNonVeg && (
                  <span
                    style={{
                      backgroundColor: '#FEF2F2',
                      color: '#DC2626',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      border: '1px solid #FECACA'
                    }}
                  >
                    Non-Vegetarian
                  </span>
                )}
              </div>

              {/* Dish Name */}
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.45rem' }}>
                {dish.name}
              </h4>

              {/* Description */}
              <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.55, margin: '0 0 0.85rem', flex: 1 }}>
                {dish.description}
              </p>

              {/* Known Establishments badge */}
              {dish.knownEstablishments && dish.knownEstablishments.length > 0 && (
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginBottom: '0.85rem' }}>
                  <strong style={{ color: '#334155' }}>Known at: </strong>
                  <span>{dish.knownEstablishments.slice(0, 3).join(', ')}</span>
                </div>
              )}

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                {onSelectDish && (
                  <button
                    type="button"
                    onClick={() => onSelectDish(dish.name)}
                    style={{
                      flex: 1,
                      backgroundColor: '#0F172A',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.45rem 0.65rem',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>Find Restaurants</span>
                    <ChevronRight size={12} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => openDishlyWithPrompt?.(`Where can I eat the best authentic ${dish.name} in ${destinationName}?`)}
                  style={{
                    backgroundColor: '#FFF7ED',
                    color: '#C2410C',
                    border: '1px solid #FFEDD5',
                    borderRadius: '8px',
                    padding: '0.45rem 0.65rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="Ask Dishly AI"
                >
                  <Sparkles size={12} />
                  <span>Ask Dishly</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
