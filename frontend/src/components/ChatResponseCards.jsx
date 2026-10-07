import React, { useState } from 'react';
import {
  MapPin, Star, IndianRupee, Calendar, ShieldCheck,
  ChevronDown, ChevronUp, Sun, Sunset, Clock,
  Hotel, Navigation, AlertTriangle, Phone, Thermometer,
  ArrowRight, ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// ── Utility ───────────────────────────────────────────────────────────────────

function fmt(n) { return n?.toLocaleString('en-IN') || '0'; }

// ── Itinerary Card ────────────────────────────────────────────────────────────

export function ItineraryCard({ data, city, days, compact = false }) {
  const navigate = useNavigate();
  const { setSelectedCity, setDays, handleGenerateItinerary } = useApp();
  const [openDay, setOpenDay] = useState(0);

  const itinerary = data?.itinerary || data;
  if (!itinerary) return null;

  // Normalize: handle both array and object formats
  let dayPlans = [];
  if (Array.isArray(itinerary)) {
    dayPlans = itinerary;
  } else if (itinerary.days && Array.isArray(itinerary.days)) {
    dayPlans = itinerary.days;
  } else if (typeof itinerary === 'object') {
    // try to find a days array inside
    const keys = Object.keys(itinerary);
    const daysKey = keys.find(k => Array.isArray(itinerary[k]));
    if (daysKey) dayPlans = itinerary[daysKey];
  }

  const displayDays = dayPlans.slice(0, compact ? 2 : 3);
  const cityName = city || itinerary.city || 'Your Destination';
  const totalBudget = itinerary.totalBudget || itinerary.budget || null;

  const goToItinerary = () => {
    setSelectedCity(cityName);
    setDays(days || 3);
    handleGenerateItinerary(cityName, days || 3);
    navigate(`/itinerary?city=${encodeURIComponent(cityName)}&days=${days || 3}`);
  };

  const slotIcon = (slot = '', idx = 0) => {
    const s = slot.toLowerCase();
    if (s.includes('morning') || idx === 0) return '🌅';
    if (s.includes('afternoon') || idx === 1) return '☀️';
    return '🌆';
  };

  return (
    <div className="chat-rich-card chat-itinerary-card">
      {/* Header */}
      <div className="chat-card-header">
        <div className="chat-card-header-left">
          <span className="chat-card-emoji">🗓️</span>
          <div>
            <div className="chat-card-title">{days || dayPlans.length}-Day {cityName} Plan</div>
            {totalBudget && (
              <div className="chat-card-subtitle">
                <IndianRupee size={11} />
                {fmt(totalBudget.min || totalBudget)} – {fmt(totalBudget.max || totalBudget * 1.5)} est. total
              </div>
            )}
          </div>
        </div>
        <div className="chat-card-badge">{cityName}</div>
      </div>

      {/* Day tabs */}
      {displayDays.length > 0 ? (
        <div className="chat-day-list">
          {displayDays.map((day, di) => {
            const stops = day.stops || day.places || day.activities || [];
            const isOpen = openDay === di;
            return (
              <div key={di} className="chat-day-item">
                <button
                  className="chat-day-header"
                  onClick={() => setOpenDay(isOpen ? -1 : di)}
                >
                  <span className="chat-day-num">Day {day.day || di + 1}</span>
                  <span className="chat-day-theme">{day.theme || day.title || `${cityName} Highlights`}</span>
                  {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {isOpen && (
                  <div className="chat-day-stops">
                    {stops.slice(0, 3).map((stop, si) => (
                      <div key={si} className="chat-stop-item">
                        <span className="chat-stop-icon">{slotIcon(stop.timeSlot || stop.time || '', si)}</span>
                        <div className="chat-stop-content">
                          <div className="chat-stop-name">{stop.place || stop.name || stop.title || `Stop ${si + 1}`}</div>
                          {stop.description && (
                            <div className="chat-stop-desc">{stop.description.slice(0, 80)}…</div>
                          )}
                          {stop.estimatedCost && (
                            <div className="chat-stop-cost">
                              <IndianRupee size={10} /> {fmt(stop.estimatedCost)}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="chat-card-empty">Itinerary is being generated…</div>
      )}

      {/* Action buttons */}
      <div className="chat-card-actions">
        <button className="chat-action-btn chat-action-primary" onClick={goToItinerary}>
          <span>Full Itinerary</span>
          <ArrowRight size={13} />
        </button>
        <button className="chat-action-btn chat-action-outline" onClick={() => navigate(`/hotels?city=${encodeURIComponent(cityName)}`)}>
          <Hotel size={13} />
          <span>Hotels</span>
        </button>
      </div>
    </div>
  );
}

// ── Hotel Card ────────────────────────────────────────────────────────────────

export function HotelCard({ hotel, compact = false }) {
  if (!hotel) return null;
  const price = hotel.pricePerNight || hotel.price || hotel.avgPrice;
  const name = hotel.name || hotel.hotelName || 'Hotel';
  const rating = hotel.rating || hotel.starRating || 4.0;
  const amenities = hotel.amenities || hotel.features || [];
  const address = hotel.address || hotel.location || hotel.area || '';

  return (
    <div className="chat-hotel-item">
      <div className="chat-hotel-image">
        {hotel.imageUrl || hotel.image ? (
          <img src={hotel.imageUrl || hotel.image} alt={name} />
        ) : (
          <div className="chat-hotel-placeholder">🏨</div>
        )}
        {hotel.tier && <span className="chat-hotel-tier">{hotel.tier}</span>}
      </div>
      <div className="chat-hotel-info">
        <div className="chat-hotel-name">{name}</div>
        {address && <div className="chat-hotel-addr"><MapPin size={10} /> {address.slice(0, 40)}</div>}
        <div className="chat-hotel-meta">
          <span className="chat-hotel-rating">
            <Star size={10} fill="#F59E0B" color="#F59E0B" /> {Number(rating).toFixed(1)}
          </span>
          {price && (
            <span className="chat-hotel-price">
              <IndianRupee size={10} />{fmt(price)}/night
            </span>
          )}
        </div>
        {!compact && amenities.length > 0 && (
          <div className="chat-hotel-amenities">
            {amenities.slice(0, 3).map((a, i) => (
              <span key={i} className="chat-amenity-chip">{a}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function HotelsCard({ data, city, days }) {
  const navigate = useNavigate();
  const hotels = Array.isArray(data) ? data : (data?.hotels || []);
  const cityName = city || 'Your Destination';

  if (!hotels.length) return null;

  return (
    <div className="chat-rich-card">
      <div className="chat-card-header">
        <div className="chat-card-header-left">
          <span className="chat-card-emoji">🏨</span>
          <div>
            <div className="chat-card-title">Stays in {cityName}</div>
            <div className="chat-card-subtitle">{hotels.length} options found</div>
          </div>
        </div>
      </div>
      <div className="chat-hotel-list">
        {hotels.slice(0, 3).map((hotel, i) => (
          <HotelCard key={i} hotel={hotel} compact />
        ))}
      </div>
      <div className="chat-card-actions">
        <button className="chat-action-btn chat-action-primary" onClick={() => navigate(`/hotels?city=${encodeURIComponent(cityName)}`)}>
          <span>All Hotels</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}

// ── Safety Card ───────────────────────────────────────────────────────────────

export function SafetyCard({ data, city }) {
  const cityName = city || data?.city || 'Your Destination';
  const safetyLevel = data?.overallSafety || data?.safetyLevel || data?.rating || 'Generally Safe';
  const tips = data?.tips || data?.safetyTips || data?.advice || [];
  const helplines = data?.helplines || data?.emergencyNumbers || [];

  const levelColor = {
    'Very Safe': '#10B981', 'Safe': '#10B981', 'Moderate': '#F59E0B',
    'Caution': '#F59E0B', 'Exercise Caution': '#EF4444', 'High Risk': '#EF4444',
    'Generally Safe': '#10B981'
  };

  return (
    <div className="chat-rich-card chat-safety-card">
      <div className="chat-card-header">
        <div className="chat-card-header-left">
          <span className="chat-card-emoji">🛡️</span>
          <div>
            <div className="chat-card-title">Safety in {cityName}</div>
            <div className="chat-safety-level" style={{ color: levelColor[safetyLevel] || '#10B981' }}>
              {safetyLevel}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency numbers */}
      <div className="chat-helplines">
        {[
          { name: 'Emergency', number: '112' },
          { name: 'Tourist Help', number: '1363' },
          { name: 'Medical', number: '108' },
          ...(helplines.slice(0, 2) || [])
        ].slice(0, 3).map((h, i) => (
          <a key={i} href={`tel:${h.number}`} className="chat-helpline-item">
            <Phone size={12} />
            <span className="chat-helpline-name">{h.name}</span>
            <span className="chat-helpline-num">{h.number}</span>
          </a>
        ))}
      </div>

      {/* Tips */}
      {tips.length > 0 && (
        <div className="chat-safety-tips">
          {tips.slice(0, 2).map((tip, i) => (
            <div key={i} className="chat-safety-tip">
              <AlertTriangle size={11} color="#F59E0B" />
              <span>{typeof tip === 'string' ? tip.slice(0, 80) : tip.tip || ''}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Explore / Places Card ─────────────────────────────────────────────────────

export function ExploreCard({ data, city, onPlanTrip }) {
  const navigate = useNavigate();
  const { setSelectedCity, handleGenerateItinerary } = useApp();
  const places = Array.isArray(data) ? data : [];
  const cityName = city || 'India';

  if (!places.length) return null;

  return (
    <div className="chat-rich-card">
      <div className="chat-card-header">
        <div className="chat-card-header-left">
          <span className="chat-card-emoji">📍</span>
          <div>
            <div className="chat-card-title">Top Spots in {cityName}</div>
            <div className="chat-card-subtitle">{places.length} attractions</div>
          </div>
        </div>
      </div>
      <div className="chat-explore-grid">
        {places.slice(0, 4).map((place, i) => (
          <div key={i} className="chat-explore-item">
            {place.imageUrl && (
              <div className="chat-explore-img">
                <img src={place.imageUrl} alt={place.city || place.name} />
              </div>
            )}
            <div className="chat-explore-info">
              <div className="chat-explore-name">{place.city || place.name || 'Place'}</div>
              <div className="chat-explore-category">{place.category}</div>
              {place.rating && (
                <div className="chat-explore-rating">
                  <Star size={9} fill="#F59E0B" color="#F59E0B" /> {place.rating}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="chat-card-actions">
        <button className="chat-action-btn chat-action-primary" onClick={() => {
          setSelectedCity(cityName);
          handleGenerateItinerary(cityName, 3);
          navigate(`/itinerary?city=${encodeURIComponent(cityName)}`);
        }}>
          <span>Plan This Trip</span>
          <ArrowRight size={13} />
        </button>
        <button className="chat-action-btn chat-action-outline" onClick={() => navigate('/destinations')}>
          <span>All Destinations</span>
        </button>
      </div>
    </div>
  );
}

// ── Budget Card ───────────────────────────────────────────────────────────────

export function BudgetCard({ data, city, days }) {
  const cityName = data?.city || city || 'Your Trip';
  const perDay = data?.perDay || {};
  const total = data?.total || {};
  const numDays = data?.days || days || 3;

  return (
    <div className="chat-rich-card chat-budget-card">
      <div className="chat-card-header">
        <div className="chat-card-header-left">
          <span className="chat-card-emoji">💰</span>
          <div>
            <div className="chat-card-title">{numDays}-Day {cityName} Budget</div>
            <div className="chat-card-subtitle">Per-day estimate in ₹</div>
          </div>
        </div>
      </div>
      <div className="chat-budget-grid">
        <div className="chat-budget-item chat-budget-low">
          <div className="chat-budget-label">Budget</div>
          <div className="chat-budget-value">₹{fmt(perDay.min || 1800)}</div>
          <div className="chat-budget-sub">/day</div>
        </div>
        <div className="chat-budget-item chat-budget-mid">
          <div className="chat-budget-label">Comfortable</div>
          <div className="chat-budget-value">₹{fmt(perDay.avg || 3000)}</div>
          <div className="chat-budget-sub">/day</div>
        </div>
        <div className="chat-budget-item chat-budget-high">
          <div className="chat-budget-label">Premium</div>
          <div className="chat-budget-value">₹{fmt(perDay.max || 5000)}</div>
          <div className="chat-budget-sub">/day</div>
        </div>
      </div>
      <div className="chat-budget-total">
        Total for {numDays} days: <strong>₹{fmt(total.min || perDay.min * numDays)} – ₹{fmt(total.max || perDay.max * numDays)}</strong>
      </div>
    </div>
  );
}

// ── Season Card ───────────────────────────────────────────────────────────────

export function SeasonCard({ data, city }) {
  const cityName = data?.city || city || 'Your Destination';
  return (
    <div className="chat-rich-card">
      <div className="chat-card-header">
        <div className="chat-card-header-left">
          <span className="chat-card-emoji">🌤️</span>
          <div>
            <div className="chat-card-title">Best Time to Visit {cityName}</div>
          </div>
        </div>
      </div>
      <div className="chat-season-info">
        <div className="chat-season-item chat-season-good">
          <Calendar size={14} />
          <div>
            <div className="chat-season-label">Ideal Season</div>
            <div className="chat-season-value">{data?.best || 'Oct – Mar'}</div>
          </div>
        </div>
        <div className="chat-season-item chat-season-temp">
          <Thermometer size={14} />
          <div>
            <div className="chat-season-label">Temperature</div>
            <div className="chat-season-value">{data?.temp || '15–30°C'}</div>
          </div>
        </div>
        <div className="chat-season-item chat-season-warn">
          <AlertTriangle size={14} />
          <div>
            <div className="chat-season-label">Avoid</div>
            <div className="chat-season-value">{data?.avoid || 'Peak monsoon'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Restaurants & Dining Card ─────────────────────────────────────────────────

export function RestaurantsCard({ data, city }) {
  const [filter, setFilter] = useState('All');
  const restaurants = Array.isArray(data) ? data : (data?.restaurants || []);
  const cityName = city || data?.city || 'Your Destination';

  const categories = ['All', 'Pure Veg', 'Street Food', 'Fine Dining', 'Cafes & Casual'];

  const filtered = restaurants.filter(r => {
    if (filter === 'All') return true;
    const cat = (r.category || '').toLowerCase();
    const cui = (r.cuisine || '').toLowerCase();
    if (filter === 'Pure Veg') return cat.includes('veg') || cui.includes('veg');
    if (filter === 'Street Food') return cat.includes('street') || r.priceTier === '₹';
    if (filter === 'Fine Dining') return cat.includes('fine') || r.priceTier === '₹₹₹' || r.priceTier === '₹₹₹₹';
    if (filter === 'Cafes & Casual') return cat.includes('cafe') || (r.ambiance || '').toLowerCase().includes('cafe') || cat.includes('casual');
    return true;
  });

  const displayList = filtered.length > 0 ? filtered : restaurants;

  return (
    <div className="chat-rich-card chat-restaurants-card">
      <div className="chat-card-header">
        <div className="chat-card-header-left">
          <span className="chat-card-emoji">🍽️</span>
          <div>
            <div className="chat-card-title">Top Restaurants in {cityName}</div>
            <div className="chat-card-subtitle">
              <span>{displayList.length} verified culinary spots & ratings</span>
            </div>
          </div>
        </div>
        <div className="chat-card-badge">{cityName}</div>
      </div>

      {/* Filter Tabs */}
      <div className="chat-restaurant-filters">
        {categories.map(cat => (
          <button
            key={cat}
            className={`chat-filter-btn ${filter === cat ? 'chat-filter-btn--active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Restaurant List */}
      <div className="chat-restaurants-list">
        {displayList.map((rest, idx) => (
          <div key={rest.id || idx} className="chat-restaurant-item">
            <div className="chat-restaurant-top">
              <div>
                <div className="chat-restaurant-name">{rest.name}</div>
                <div className="chat-restaurant-cuisine">{rest.cuisine}</div>
              </div>
              <div className="chat-restaurant-rating">
                <Star size={11} fill="#F59E0B" color="#F59E0B" />
                <span>{rest.rating}</span>
              </div>
            </div>

            <div className="chat-restaurant-details">
              <span className="chat-restaurant-tag">{rest.category || 'Dining'}</span>
              <span className="chat-restaurant-price">{rest.priceForTwo}</span>
              <span className="chat-restaurant-area"><MapPin size={10} /> {rest.area}</span>
            </div>

            {rest.mustTry && (
              <div className="chat-restaurant-must-try">
                <span className="must-try-label">Must Try:</span> {rest.mustTry}
              </div>
            )}

            <div className="chat-restaurant-footer">
              <span className="chat-restaurant-ambiance">{rest.ambiance || rest.highlight}</span>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${rest.name} ${cityName}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="chat-restaurant-map-link"
                title="View on Google Maps"
              >
                <span>Directions</span>
                <ExternalLink size={10} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Dispatcher ────────────────────────────────────────────────────────────────

/**
 * Renders the appropriate rich card based on response type
 */
export default function ChatResponseCard({ type, data, city, days, compact = false }) {
  switch (type) {
    case 'restaurants':
    case 'food':
    case 'dining':
      return <RestaurantsCard data={data} city={city} />;
    case 'itinerary':
      return <ItineraryCard data={data} city={city} days={days} compact={compact} />;
    case 'hotels':
      return <HotelsCard data={data} city={city} days={days} />;
    case 'safety':
      return <SafetyCard data={data} city={city} />;
    case 'explore':
      return <ExploreCard data={data} city={city} />;
    case 'budget':
      return <BudgetCard data={data} city={city} days={days} />;
    case 'season':
      return <SeasonCard data={data} city={city} />;
    default:
      return null;
  }
}
