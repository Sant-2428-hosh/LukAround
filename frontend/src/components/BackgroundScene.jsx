import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

export const SCENIC_WALLPAPERS = [
  {
    id: 'auto',
    name: 'City Auto-Sync',
    icon: '🧭',
    description: 'Auto-adapts to selected destination'
  },
  {
    id: 'taj',
    name: 'Taj Mahal Sunrise (Agra)',
    icon: '🕌',
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=2000&q=85'
  },
  {
    id: 'jaipur',
    name: 'Amber Fort & Hawa Mahal (Jaipur)',
    icon: '🏰',
    imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=2000&q=85'
  },
  {
    id: 'munnar',
    name: 'Emerald Tea Gardens (Munnar)',
    icon: '🍃',
    imageUrl: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=2000&q=85'
  },
  {
    id: 'varanasi',
    name: 'Sacred Ganga Ghats (Varanasi)',
    icon: '🛕',
    imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=2000&q=85'
  },
  {
    id: 'goa',
    name: 'Tropical Coastline (Goa)',
    icon: '🌴',
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2000&q=85'
  },
  {
    id: 'delhi',
    name: 'India Gate & Monuments (Delhi)',
    icon: '🏛️',
    imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=2000&q=85'
  },
  {
    id: 'bangalore',
    name: 'Bengaluru Palace & Gardens',
    icon: '👑',
    imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=2000&q=85'
  }
];

const CITY_WALLPAPERS = {
  'bangalore': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=2000&q=85',
  'goa': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2000&q=85',
  'chennai': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=2000&q=85',
  'jaipur': 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=2000&q=85',
  'agra': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=2000&q=85',
  'kochin': 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=2000&q=85',
  'pondicherry': 'https://images.unsplash.com/photo-1600100397608-f010e421d3fa?auto=format&fit=crop&w=2000&q=85',
  'yercaud': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=85',
  'delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=2000&q=85',
  'munnar': 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=2000&q=85',
  'varanasi': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=2000&q=85',
};

export default function BackgroundScene({ activeScene = 'auto', cityName = 'Bangalore' }) {
  const cityKey = (cityName || 'bangalore').toLowerCase();
  
  let currentImageUrl = '';
  if (activeScene === 'auto') {
    currentImageUrl = CITY_WALLPAPERS[cityKey] || CITY_WALLPAPERS['bangalore'];
  } else {
    const found = SCENIC_WALLPAPERS.find(s => s.id === activeScene);
    currentImageUrl = found?.imageUrl || CITY_WALLPAPERS['bangalore'];
  }

  // SUBTLE PARALLAX SCROLL EFFECT
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 1000], [0, 120]);
  const scaleParallax = useTransform(scrollY, [0, 1000], [1, 1.06]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 0,
      pointerEvents: 'none',
      overflow: 'hidden'
    }}>
      {/* SCENIC TOURIST LANDMARK PHOTO LAYER WITH PARALLAX & SMOOTH CROSS-FADE */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImageUrl}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            position: 'absolute',
            top: '-5%',
            left: '-5%',
            right: '-5%',
            bottom: '-5%',
            backgroundImage: `url(${currentImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            filter: 'saturate(1.2) contrast(1.1) brightness(0.95)',
            y: yParallax,
            scale: scaleParallax
          }}
        />
      </AnimatePresence>

      {/* LUXURY DARK GRADIENT VIGNETTE & BLUR MESH OVERLAY */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 50% 10%, rgba(6, 9, 20, 0.4) 0%, rgba(6, 9, 20, 0.85) 75%),
          linear-gradient(to bottom, rgba(5, 8, 20, 0.55) 0%, rgba(5, 8, 20, 0.92) 80%, rgba(5, 8, 20, 0.98) 100%)
        `,
        backdropFilter: 'blur(3px)',
        WebkitBackdropFilter: 'blur(3px)'
      }} />

      {/* AMBIENT MESH ORBS */}
      <div className="bg-ambient-orb-1" />
      <div className="bg-ambient-orb-2" />
    </div>
  );
}
