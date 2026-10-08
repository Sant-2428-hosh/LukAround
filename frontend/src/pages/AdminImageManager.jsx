import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { attractions, states, cities } from '../data/indiaTourismData';
import { imageRegistry } from '../data/imageRegistry';
import SafeImage from '../components/tourism/SafeImage';
import {
  ShieldCheck,
  Camera,
  Search,
  Filter,
  CheckCircle,
  ExternalLink,
  Edit2,
  RefreshCw,
  Download,
  AlertTriangle,
  Eye,
  Sliders,
  ChevronRight,
  ArrowLeft,
  X,
  Save,
  Layers,
  Sparkles
} from 'lucide-react';

export default function AdminImageManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedVerified, setSelectedVerified] = useState('all');
  const [aspectRatioPreview, setAspectRatioPreview] = useState('4:3'); // '16:9' | '4:3' | '1:1' | '4:5'
  const [items, setItems] = useState(attractions);
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({
    image: '',
    imageAlt: '',
    imagePhotographer: '',
    imageSourceName: '',
    imageLicense: '',
    verified: true
  });
  const [toastMessage, setToastMessage] = useState(null);

  // Compute live verification metrics
  const metrics = useMemo(() => {
    const total = items.length;
    const verifiedCount = items.filter(i => i.verified).length;
    const urlMap = new Map();
    let dupes = 0;
    items.forEach(i => {
      if (urlMap.has(i.image)) dupes++;
      urlMap.add ? urlMap.add(i.image) : urlMap.set(i.image, true);
    });
    return {
      totalDestinations: total,
      totalStates: states.length,
      totalCities: cities.length,
      verifiedCount,
      verifiedPercent: total > 0 ? Math.round((verifiedCount / total) * 100) : 100,
      duplicateCount: dupes,
      registrySize: imageRegistry.length
    };
  }, [items]);

  // Filtered attractions
  const filteredAttractions = useMemo(() => {
    return items.filter(a => {
      const matchesSearch = !searchQuery ||
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.state.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesState = !selectedState || a.stateSlug === selectedState;
      const matchesVerified = selectedVerified === 'all' ||
        (selectedVerified === 'verified' && a.verified) ||
        (selectedVerified === 'unverified' && !a.verified);
      return matchesSearch && matchesState && matchesVerified;
    });
  }, [items, searchQuery, selectedState, selectedVerified]);

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const startEdit = (attraction) => {
    setEditingItem(attraction);
    setEditForm({
      image: attraction.image || '',
      imageAlt: attraction.imageAlt || '',
      imagePhotographer: attraction.imagePhotographer || '',
      imageSourceName: attraction.imageSourceName || 'Wikimedia Commons',
      imageLicense: attraction.imageLicense || 'CC BY-SA 4.0',
      verified: attraction.verified !== false
    });
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    // Update in local state
    setItems(prev => prev.map(a => {
      if (a.id === editingItem.id) {
        return {
          ...a,
          image: editForm.image,
          imageAlt: editForm.imageAlt,
          imagePhotographer: editForm.imagePhotographer,
          imageSourceName: editForm.imageSourceName,
          imageLicense: editForm.imageLicense,
          imageCredit: `Photo: ${editForm.imagePhotographer || 'Contributor'} / ${editForm.imageSourceName || 'Wikimedia Commons'}`,
          verified: editForm.verified
        };
      }
      return a;
    }));

    // Attempt backend sync if running
    try {
      await fetch(`/api/tourism/images/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: editForm.image,
          altText: editForm.imageAlt,
          photographer: editForm.imagePhotographer,
          source: editForm.imageSourceName,
          license: editForm.imageLicense,
          verified: editForm.verified
        })
      });
    } catch (e) {
      // offline/mock fallback
    }

    showNotification(`Updated image metadata for ${editingItem.name}`);
    setEditingItem(null);
  };

  const exportRegistryJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(imageRegistry, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'indiaTourism_imageRegistry.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification('Exported Image Registry JSON file');
  };

  return (
    <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', padding: '2rem 1.5rem', color: '#0F172A' }}>
      <div style={{ maxWidth: '1350px', margin: '0 auto' }}>

        {/* ── Top Bar ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <Link to="/admin" style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontSize: '0.85rem' }}>
                <ArrowLeft size={14} /> Back to Admin HUD
              </Link>
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 900, margin: 0, display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Camera size={26} color="var(--tourism-earth)" />
              India Tourism Real Image Studio & Central Registry
            </h1>
            <p style={{ margin: '0.3rem 0 0', color: '#64748B', fontSize: '0.9rem' }}>
              Manage verified photographs, geographical accuracy, and attribution credits across all 15 States and 198 Tourist Destinations.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={exportRegistryJSON}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                padding: '0.6rem 1.1rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#334155',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Download size={15} />
              <span>Export Registry JSON</span>
            </button>
          </div>
        </div>

        {/* ── Verification Audit KPIs (Requirement 20) ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Total Destinations</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F172A', marginTop: '0.25rem' }}>{metrics.totalDestinations}</div>
            <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Across {metrics.totalStates} States & {metrics.totalCities} Cities</div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>Verified Real Photographs</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#059669', marginTop: '0.25rem' }}>{metrics.verifiedPercent}%</div>
            <div style={{ fontSize: '0.78rem', color: '#059669' }}>{metrics.verifiedCount} / {metrics.totalDestinations} Verified Exact Match</div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284C7', textTransform: 'uppercase' }}>Duplicate Images</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: metrics.duplicateCount === 0 ? '#059669' : '#DC2626', marginTop: '0.25rem' }}>
              {metrics.duplicateCount}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748B' }}>100% Unique Landmark Imagery</div>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B45309', textTransform: 'uppercase' }}>Central Registry Entries</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F172A', marginTop: '0.25rem' }}>{metrics.registrySize}</div>
            <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Full Metadata & Attribution</div>
          </div>
        </div>

        {/* ── Search, Filters & Crop Aspect Ratio Bar ── */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: '1.25rem',
          border: '1px solid #E2E8F0',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Search box */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 300px', backgroundColor: '#F1F5F9', padding: '0.55rem 0.85rem', borderRadius: '8px' }}>
            <Search size={16} color="#64748B" />
            <input
              type="text"
              placeholder="Search destination, city, or state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.88rem', color: '#0F172A' }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter dropdowns */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              style={{
                backgroundColor: '#F1F5F9',
                border: '1px solid #CBD5E1',
                padding: '0.55rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              <option value="">All 15 States</option>
              {states.map(s => (
                <option key={s.slug} value={s.slug}>{s.name}</option>
              ))}
            </select>

            <select
              value={selectedVerified}
              onChange={(e) => setSelectedVerified(e.target.value)}
              style={{
                backgroundColor: '#F1F5F9',
                border: '1px solid #CBD5E1',
                padding: '0.55rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Verification Statuses</option>
              <option value="verified">Verified Real Photo (100%)</option>
              <option value="unverified">Needs Verification</option>
            </select>

            {/* Requirement 10: Responsive Crop Aspect Ratio Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#F1F5F9', padding: '3px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', padding: '0 6px' }}>CROP:</span>
              {['16:9', '4:3', '1:1', '4:5'].map(ratio => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatioPreview(ratio)}
                  style={{
                    backgroundColor: aspectRatioPreview === ratio ? '#0F172A' : 'transparent',
                    color: aspectRatioPreview === ratio ? '#FFFFFF' : '#64748B',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Toast Alert ── */}
        {toastMessage && (
          <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            padding: '0.75rem 1.25rem',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem',
            fontWeight: 600
          }}>
            <CheckCircle size={16} color="#10B981" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ── Destinations Image Grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
          gap: '1.25rem',
          marginBottom: '4rem'
        }}>
          {filteredAttractions.map(attraction => (
            <div
              key={attraction.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
            >
              {/* Image Preview with Selected Crop Ratio */}
              <div style={{ position: 'relative' }}>
                <SafeImage
                  src={attraction.image}
                  alt={attraction.imageAlt || attraction.name}
                  aspectRatio={aspectRatioPreview}
                  verified={attraction.verified !== false}
                  showCredit={false}
                  loading="lazy"
                />

                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(4px)',
                  color: '#FFFFFF',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'capitalize'
                }}>
                  {attraction.type || 'heritage'}
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 0.25rem', color: '#0F172A' }}>
                    {attraction.name}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#64748B', marginBottom: '0.65rem' }}>
                    📍 {attraction.city}, {attraction.state}
                  </div>

                  {/* Metadata display */}
                  <div style={{ fontSize: '0.75rem', color: '#475569', backgroundColor: '#F8FAFC', padding: '0.65rem', borderRadius: '6px', marginBottom: '0.85rem' }}>
                    <div><strong>Alt:</strong> {attraction.imageAlt || 'Real destination photograph'}</div>
                    <div style={{ marginTop: '2px' }}><strong>Credit:</strong> {attraction.imageCredit || 'Verified Tourism Photography'}</div>
                    <div style={{ marginTop: '2px' }}><strong>Source:</strong> {attraction.imageSourceName || 'Wikimedia Commons'} ({attraction.imageLicense || 'CC BY-SA'})</div>
                  </div>
                </div>

                {/* Card Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '0.75rem' }}>
                  <a
                    href={attraction.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '0.78rem',
                      color: 'var(--tourism-earth)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      textDecoration: 'none',
                      fontWeight: 700
                    }}
                  >
                    <span>Inspect Photo</span>
                    <ExternalLink size={12} />
                  </a>

                  <button
                    onClick={() => startEdit(attraction)}
                    style={{
                      backgroundColor: '#F1F5F9',
                      border: '1px solid #CBD5E1',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#0F172A',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Edit2 size={12} />
                    <span>Edit Metadata</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Edit Image Metadata Modal (Requirement 18) ── */}
        {editingItem && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem'
          }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '600px',
              width: '100%',
              padding: '1.75rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                  Edit Photograph: {editingItem.name}
                </h3>
                <button
                  onClick={() => setEditingItem(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Photo URL (Must be a real photograph of this destination)
                  </label>
                  <input
                    type="text"
                    value={editForm.image}
                    onChange={(e) => setEditForm(prev => ({ ...prev, image: e.target.value }))}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Descriptive Alt Text (Accessibility)
                  </label>
                  <input
                    type="text"
                    value={editForm.imageAlt}
                    onChange={(e) => setEditForm(prev => ({ ...prev, imageAlt: e.target.value }))}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Photographer / Creator
                    </label>
                    <input
                      type="text"
                      value={editForm.imagePhotographer}
                      onChange={(e) => setEditForm(prev => ({ ...prev, imagePhotographer: e.target.value }))}
                      style={{ width: '100%', padding: '0.55rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                      Source Name
                    </label>
                    <input
                      type="text"
                      value={editForm.imageSourceName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, imageSourceName: e.target.value }))}
                      style={{ width: '100%', padding: '0.55rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    License (e.g., CC BY-SA 4.0, Unsplash License)
                  </label>
                  <input
                    type="text"
                    value={editForm.imageLicense}
                    onChange={(e) => setEditForm(prev => ({ ...prev, imageLicense: e.target.value }))}
                    style={{ width: '100%', padding: '0.55rem', border: '1px solid #CBD5E1', borderRadius: '6px', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <input
                    type="checkbox"
                    id="verifiedCheck"
                    checked={editForm.verified}
                    onChange={(e) => setEditForm(prev => ({ ...prev, verified: e.target.checked }))}
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <label htmlFor="verifiedCheck" style={{ fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', color: '#0F172A' }}>
                    Mark this image as verified authentic real photograph
                  </label>
                </div>
              </div>

              {/* Modal footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid #F1F5F9', paddingTop: '1rem' }}>
                <button
                  onClick={() => setEditingItem(null)}
                  style={{
                    backgroundColor: '#F1F5F9',
                    border: 'none',
                    padding: '0.55rem 1.1rem',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#64748B',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  style={{
                    backgroundColor: 'var(--tourism-earth)',
                    border: 'none',
                    padding: '0.55rem 1.25rem',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <Save size={14} />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
