const fs = require('fs');
const path = require('path');

const cardsPath = path.resolve(__dirname, '../frontend/src/components/ChatResponseCards.jsx');
let content = fs.readFileSync(cardsPath, 'utf8');

// Replace RestaurantsCard definition and implementation
const startMarker = "// ── Restaurants & Dining Card ─────────────────────────────────────────────────";
const endMarker = "// ── Dispatcher ────────────────────────────────────────────────────────────────";

const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error("Could not find markers in ChatResponseCards.jsx", { startIdx, endIdx });
  process.exit(1);
}

const newRestaurantsImpl = `// ── Restaurants & Dining Card ─────────────────────────────────────────────────

const getCuisineEmoji = (category = '', cuisine = '') => {
  const c = (category + ' ' + cuisine).toLowerCase();
  if (c.includes('veg') || c.includes('thali')) return '🥗';
  if (c.includes('street') || c.includes('snack') || c.includes('chaat')) return '🍢';
  if (c.includes('fine') || c.includes('palace') || c.includes('royal')) return '🍷';
  if (c.includes('cafe') || c.includes('tea') || c.includes('coffee')) return '☕';
  if (c.includes('fish') || c.includes('seafood') || c.includes('coastal')) return '🦞';
  if (c.includes('meat') || c.includes('biryani') || c.includes('curry')) return '🥘';
  return '🍽️';
};

export function RestaurantsCard({ data, city, onSelectSuggestion }) {
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
            <div className="chat-card-title">Top Dining Spots in {cityName}</div>
            <div className="chat-card-subtitle">
              <span>{displayList.length} hand-picked culinary spots & ratings</span>
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
            className={\`chat-filter-btn \${filter === cat ? 'chat-filter-btn--active' : ''}\`}
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
              <div className="chat-restaurant-identity">
                <span className="chat-restaurant-cuisine-icon">{getCuisineEmoji(rest.category, rest.cuisine)}</span>
                <div>
                  <div className="chat-restaurant-name">{rest.name}</div>
                  <div className="chat-restaurant-cuisine">{rest.cuisine}</div>
                </div>
              </div>
              <div className="chat-restaurant-rating">
                <Star size={11} fill="#F59E0B" color="#F59E0B" />
                <span>{rest.rating}</span>
                {rest.reviews && <span className="chat-restaurant-reviews">({rest.reviews})</span>}
              </div>
            </div>

            <div className="chat-restaurant-details">
              <span className="chat-restaurant-tag">{rest.category || 'Dining'}</span>
              <span className="chat-restaurant-price">{rest.priceForTwo}</span>
              <span className="chat-restaurant-area"><MapPin size={10} /> {rest.area}</span>
              {rest.timings && <span className="chat-restaurant-timings"><Clock size={9} /> {rest.timings}</span>}
            </div>

            {rest.mustTry && (
              <div className="chat-restaurant-must-try">
                <span className="must-try-label">Must Try:</span> {rest.mustTry}
              </div>
            )}

            <div className="chat-restaurant-footer">
              <span className="chat-restaurant-ambiance">{rest.ambiance || rest.highlight}</span>
              <div className="chat-restaurant-actions">
                {onSelectSuggestion && (
                  <button
                    type="button"
                    className="chat-restaurant-ask-btn"
                    onClick={() => onSelectSuggestion(\`Tell me about signature specialties and best time to visit \${rest.name} in \${cityName}\`)}
                    title="Ask Dishly about this restaurant"
                  >
                    <span>Ask Dishly</span>
                  </button>
                )}
                <a
                  href={\`https://www.google.com/maps/search/?api=1&query=\${encodeURIComponent(\`\${rest.name} \${cityName}\`)}\`}
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
          </div>
        ))}
      </div>
    </div>
  );
}

`;

content = content.slice(0, startIdx) + newRestaurantsImpl + content.slice(endIdx);

// Also update Dispatcher function to pass onSelectSuggestion
content = content.replace(
  "export default function ChatResponseCard({ type, data, city, days, compact = false }) {",
  "export default function ChatResponseCard({ type, data, city, days, compact = false, onSelectSuggestion }) {"
);
content = content.replace(
  "return <RestaurantsCard data={data} city={city} />;",
  "return <RestaurantsCard data={data} city={city} onSelectSuggestion={onSelectSuggestion} />;"
);

fs.writeFileSync(cardsPath, content, 'utf8');
console.log('✅ Successfully upgraded ChatResponseCards.jsx!');
