import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Sparkles, MapPin, Palette, Check, Image as ImageIcon } from 'lucide-react';
import { SCENIC_WALLPAPERS } from './BackgroundScene';
import logoMark from '../assets/logo-mark.png';

const THEMES = [
  { id: 'sunset', name: 'Sunset Terracotta', icon: '🌅', color: '#FF5722' },
  { id: 'emerald', name: 'Emerald Oasis', icon: '🌿', color: '#10B981' },
  { id: 'lotus', name: 'Jaipur Lotus', icon: '🌸', color: '#F43F5E' },
  { id: 'gold', name: 'Maharaja Gold', icon: '👑', color: '#F59E0B' },
  { id: 'himalaya', name: 'Himalayan Mystic', icon: '🏔️', color: '#0284C7' },
  { id: 'varanasi', name: 'Varanasi Twilight', icon: '🛕', color: '#EA580C' },
  { id: 'goa', name: 'Goa Sunset Breeze', icon: '🌊', color: '#EC4899' },
];

export default function Header({ currentLang = 'en', onToggleLang, activeScene = 'auto', onSelectScene }) {
  const [currentTheme, setCurrentTheme] = useState('sunset');
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showSceneMenu, setShowSceneMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const selectTheme = (themeId) => {
    setCurrentTheme(themeId);
    document.documentElement.setAttribute('data-theme', themeId);
    setShowThemeMenu(false);
  };

  const handleSelectScene = (sceneId) => {
    if (onSelectScene) {
      onSelectScene(sceneId);
    }
    setShowSceneMenu(false);
  };

  return (
    <motion.header 
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: isScrolled ? '0.75rem 0' : '1.25rem 0',
        background: isScrolled ? 'rgba(6, 9, 20, 0.85)' : 'rgba(6, 9, 20, 0.35)',
        backdropFilter: isScrolled ? 'blur(20px)' : 'blur(8px)',
        WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'blur(8px)',
        borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(255, 255, 255, 0.06)',
        boxShadow: isScrolled ? '0 10px 30px rgba(0, 0, 0, 0.45)' : 'none',
        transition: 'padding 0.25s ease, background 0.25s ease, box-shadow 0.25s ease',
        marginBottom: '2rem'
      }}
    >
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* LOGO WITH MOTION */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <motion.div 
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            transition={{ duration: 0.25 }}
            style={{
              width: isScrolled ? '38px' : '44px',
              height: isScrolled ? '38px' : '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'width 0.25s ease, height 0.25s ease'
            }}
          >
            <img
              src={logoMark}
              alt="LukAround"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))'
              }}
            />
          </motion.div>
          <div>
            <h1 style={{ fontSize: isScrolled ? '1.25rem' : '1.45rem', fontWeight: 800, color: '#fff', lineHeight: 1.1, transition: 'font-size 0.25s ease' }}>
              {currentLang === 'hi' ? 'लुक अराउंड' : 'Luk Around'}
            </h1>
            <span style={{ fontSize: '0.68rem', color: 'var(--primary-light)', fontWeight: 700, letterSpacing: '1.2px' }}>
              TRAVEL BEYOND THE ORDINARY
            </span>
          </div>
        </div>

        {/* NAVIGATION, PALETTE & SCENERY SWITCHERS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <span className="badge badge-teal" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <MapPin size={12} /> 11 Cities
          </span>

          {/* SCENERY BACKGROUND SWITCHER */}
          <div style={{ position: 'relative' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowSceneMenu(!showSceneMenu);
                setShowThemeMenu(false);
              }}
              className="btn"
              style={{
                padding: '0.45rem 0.85rem',
                fontSize: '0.8rem',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer'
              }}
              title="Change Tourist Background Picture"
            >
              <ImageIcon size={14} color="var(--secondary-light)" />
              <span>Scenery</span>
            </motion.button>

            {/* SCENIC WALLPAPER DROPDOWN */}
            <AnimatePresence>
              {showSceneMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  className="glass-card"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '0.5rem',
                    padding: '0.5rem',
                    minWidth: '240px',
                    maxHeight: '320px',
                    overflowY: 'auto',
                    zIndex: 1000,
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.75)',
                    border: '1px solid var(--border-teal)'
                  }}
                >
                  <div style={{ padding: '0.35rem 0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Choose Tourist Background
                  </div>
                  {SCENIC_WALLPAPERS.map((sc) => (
                    <motion.div
                      key={sc.id}
                      whileHover={{ x: 2, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                      onClick={() => handleSelectScene(sc.id)}
                      style={{
                        padding: '0.5rem 0.65rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: activeScene === sc.id ? 'rgba(0, 229, 255, 0.15)' : 'transparent',
                        color: activeScene === sc.id ? 'var(--secondary-light)' : '#fff',
                        fontSize: '0.825rem',
                        fontWeight: activeScene === sc.id ? 700 : 500
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1rem' }}>{sc.icon}</span>
                        <span>{sc.name}</span>
                      </div>
                      {activeScene === sc.id && <Check size={14} color="var(--secondary-light)" />}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* PALETTE THEME SELECTOR BUTTON */}
          <div style={{ position: 'relative' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowThemeMenu(!showThemeMenu);
                setShowSceneMenu(false);
              }}
              className="btn"
              style={{
                padding: '0.45rem 0.85rem',
                fontSize: '0.8rem',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer'
              }}
              title="Change Color Palette (7 Themes)"
            >
              <Palette size={14} color="var(--primary-light)" />
              <span>Palette</span>
            </motion.button>

            {/* THEME MENU DROPDOWN (7 THEMES) */}
            <AnimatePresence>
              {showThemeMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  className="glass-card"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: '0.5rem',
                    padding: '0.5rem',
                    minWidth: '220px',
                    maxHeight: '340px',
                    overflowY: 'auto',
                    zIndex: 1000,
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.75)',
                    border: '1px solid var(--border-glow)'
                  }}
                >
                  <div style={{ padding: '0.35rem 0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Choose Palette (7 Themes)
                  </div>
                  {THEMES.map((theme) => (
                    <motion.div
                      key={theme.id}
                      whileHover={{ x: 2, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                      onClick={() => selectTheme(theme.id)}
                      style={{
                        padding: '0.5rem 0.65rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: currentTheme === theme.id ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                        color: currentTheme === theme.id ? 'var(--primary-light)' : '#fff',
                        fontSize: '0.85rem',
                        fontWeight: currentTheme === theme.id ? 700 : 500
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1rem' }}>{theme.icon}</span>
                        <span>{theme.name}</span>
                      </div>
                      {currentTheme === theme.id && <Check size={14} color="var(--primary-light)" />}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* LANGUAGE SWITCHER BUTTON WITH MOTION */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleLang}
            className="btn"
            style={{
              padding: '0.45rem 0.85rem',
              fontSize: '0.8rem',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#fff',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer'
            }}
            title="Switch Language (English / हिंदी)"
          >
            <Globe size={14} color="var(--primary-light)" />
            <span>{currentLang === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}</span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
