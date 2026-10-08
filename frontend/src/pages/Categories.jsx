import React from 'react';
import { useParams, Link } from 'react-router-dom';
import CategoryCard from '../components/tourism/CategoryCard';
import AttractionCard from '../components/tourism/AttractionCard';
import { categories, attractions } from '../data/indiaTourismData';
import { Compass, ArrowRight, ChevronRight } from 'lucide-react';

export default function Categories() {
  const { categorySlug } = useParams();

  // If a specific category slug is passed in the URL (e.g. /categories/beaches)
  const selectedCategory = categorySlug
    ? categories.find(c => c.slug === categorySlug || c.id === categorySlug)
    : null;

  const categoryAttractions = selectedCategory
    ? attractions.filter(a =>
        (a.category || []).includes(selectedCategory.slug) ||
        a.type === selectedCategory.slug ||
        (a.tags || []).includes(selectedCategory.slug)
      )
    : [];

  return (
    <div className="tourism-page">
      {/* ── Banner ── */}
      <div style={{
        background: selectedCategory
          ? `linear-gradient(180deg, rgba(15,23,42,0.6) 0%, rgba(15,23,42,0.9) 100%), url(${selectedCategory.heroImage}) center/cover no-repeat`
          : 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
        color: '#FFFFFF',
        padding: '4rem 1.5rem',
        textAlign: 'center'
      }}>
        <div className="tourism-container" style={{ maxWidth: '850px' }}>
          {selectedCategory && (
            <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#CBD5E1', marginBottom: '1rem' }}>
              <Link to="/" style={{ color: '#E2E8F0', textDecoration: 'none' }}>Home</Link>
              <ChevronRight size={13} />
              <Link to="/categories" style={{ color: '#E2E8F0', textDecoration: 'none' }}>Categories</Link>
              <ChevronRight size={13} />
              <span style={{ color: '#FFFFFF', fontWeight: 700 }}>{selectedCategory.name}</span>
            </nav>
          )}

          <span className="tourism-badge badge-earth" style={{ marginBottom: '0.75rem' }}>
            {selectedCategory ? `${categoryAttractions.length} Verified Destinations` : 'Travel Experiences'}
          </span>

          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900, marginBottom: '0.75rem' }}>
            {selectedCategory ? selectedCategory.name : 'Explore India by Category'}
          </h1>

          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, margin: '0 auto' }}>
            {selectedCategory
              ? selectedCategory.description
              : 'Choose your journey based on passion: ancient heritage monuments, golden beaches, cloud-kissed hill stations, wildlife sanctuaries, or sacred pilgrimage routes.'}
          </p>
        </div>
      </div>

      <div className="tourism-container" style={{ paddingTop: '3.5rem' }}>
        {selectedCategory ? (
          <div>
            {/* Top Destinations inside this Category */}
            {selectedCategory.topDestinations && selectedCategory.topDestinations.length > 0 && (
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                padding: '1.5rem',
                border: '1px solid var(--tourism-sand-border)',
                marginBottom: '2.5rem'
              }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.75rem' }}>
                  Signature Destinations in {selectedCategory.name}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {selectedCategory.topDestinations.map((dest) => (
                    <span
                      key={dest}
                      style={{
                        backgroundColor: 'var(--tourism-sand)',
                        padding: '0.45rem 0.95rem',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: 'var(--tourism-earth)'
                      }}
                    >
                      ★ {dest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Attractions Grid for this Category */}
            <div style={{ marginBottom: '2rem' }}>
              <h2 className="tourism-heading" style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>
                All {selectedCategory.name} Places to Visit ({categoryAttractions.length})
              </h2>

              <div className="tourism-grid-4">
                {categoryAttractions.map((attraction) => (
                  <AttractionCard key={attraction.id} attraction={attraction} />
                ))}
              </div>
            </div>

            {/* Switch to Other Categories */}
            <div style={{ borderTop: '1px solid var(--tourism-sand-border)', paddingTop: '3.5rem', marginTop: '4rem' }}>
              <h3 className="tourism-heading" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                Explore Other Categories
              </h3>
              <div className="tourism-grid-4">
                {categories.filter(c => c.id !== selectedCategory.id).map((c) => (
                  <CategoryCard key={c.id} category={c} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* All Categories Grid view */
          <div>
            <div className="tourism-grid-4" style={{ marginBottom: '4rem' }}>
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
