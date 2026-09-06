import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  ShieldAlert,
  Palette,
  Download,
  User,
  LogOut,
  Bookmark,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Crown,
  Shield,
  Menu,
  X,
  MapPin,
  Calendar,
  Building2,
  DollarSign,
  HeartHandshake,
  Globe
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import JSZip from 'jszip';

export default function Navbar() {
  const navigate = useNavigate();
  const {
    THEMES,
    currentTheme,
    handleThemeChange,
    themeDropdownOpen,
    setThemeDropdownOpen,
    LANGUAGES,
    currentLanguage,
    handleLanguageChange,
    languageDropdownOpen,
    setLanguageDropdownOpen,
    t,
    setIsSosModalOpen,
    user,
    logoutAuth,
    authToast,
    showToast,
    isSuperAdmin,
    isAdmin
  } = useApp();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Responsive mobile detection (strictly < 1024px)
  const [isMobileScreen, setIsMobileScreen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      setIsMobileScreen(isMobile);
      if (!isMobile) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Dropdown toggles that close siblings
  const toggleThemeDropdown = (e) => {
    e.stopPropagation();
    setThemeDropdownOpen(!themeDropdownOpen);
    setLanguageDropdownOpen(false);
    setUserDropdownOpen(false);
  };

  const toggleLanguageDropdown = (e) => {
    e.stopPropagation();
    setLanguageDropdownOpen(!languageDropdownOpen);
    setThemeDropdownOpen(false);
    setUserDropdownOpen(false);
  };

  const toggleUserDropdown = (e) => {
    e.stopPropagation();
    setUserDropdownOpen(!userDropdownOpen);
    setThemeDropdownOpen(false);
    setLanguageDropdownOpen(false);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      setThemeDropdownOpen(false);
      setLanguageDropdownOpen(false);
      setUserDropdownOpen(false);
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [setThemeDropdownOpen, setLanguageDropdownOpen]);

  // Lock body scroll when mobile left drawer is active
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (mobileMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [mobileMenuOpen]);

  // Clean core navigation links translated with t()
  const coreNavLinks = [
    { label: t("home"), path: "/", icon: <Compass size={15} color="var(--color-primary)" strokeWidth={2} /> },
    { label: t("destinations"), path: "/destinations", icon: <MapPin size={15} color="var(--color-ink-secondary)" strokeWidth={2} /> },
    { label: t("itinerary"), path: "/itinerary", icon: <Calendar size={15} color="var(--color-ink-secondary)" strokeWidth={2} /> },
    { label: t("hotels"), path: "/hotels", icon: <Building2 size={15} color="var(--color-ink-secondary)" strokeWidth={2} /> },
    { label: t("budget"), path: "/budget", icon: <DollarSign size={15} color="var(--color-ink-secondary)" strokeWidth={2} /> },
    { label: t("safety"), path: "/safety", icon: <HeartHandshake size={15} color="var(--color-ink-secondary)" strokeWidth={2} /> },
  ];

  // Export site packager
  async function handleExportSite() {
    setDownloading(true);
    try {
      const zip = new JSZip();
      const folder = zip.folder("luk-around-site");
      const assets = [];
      document.querySelectorAll("link[rel='stylesheet']").forEach((el) => {
        if (el.href) assets.push({ name: el.href.split("/").pop() || "style.css", url: el.href });
      });
      document.querySelectorAll("script[src]").forEach((el) => {
        if (el.src) assets.push({ name: el.src.split("/").pop() || "script.js", url: el.src });
      });
      await Promise.all(
        assets.map(async ({ name, url }) => {
          try {
            const res = await fetch(url);
            const blob = await res.blob();
            folder.file(name, blob);
          } catch { }
        })
      );
      const html = `<!DOCTYPE html><html><head><title>Luk Around</title></head><body><h1>Luk Around Travel Export</h1></body></html>`;
      folder.file("index.html", html);
      const blob = await zip.generateAsync({ type: "blob" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "luk-around-site.zip";
      a.click();
      showToast("Website assets packaged successfully!", "success");
    } catch (e) {
      console.error(e);
      showToast("Export packaging failed", "error");
    } finally {
      setDownloading(false);
    }
  }

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    await logoutAuth();
    showToast('Logged out successfully', 'success');
    navigate('/login');
  };

  // Find active theme object
  const activeThemeObj = THEMES?.find(t => t.id === currentTheme) || { color: '#C0293C' };

  return (
    <>
      {/* Toast Notification Banner */}
      {authToast && (
        <div
          style={{
            position: 'fixed',
            top: '72px',
            right: '20px',
            zIndex: 9999,
            backgroundColor: authToast.type === 'error' ? '#FEF2F2' : '#F0FDF4',
            color: authToast.type === 'error' ? '#991B1B' : '#166534',
            border: `1px solid ${authToast.type === 'error' ? '#FECACA' : '#BBF7D0'}`,
            borderRadius: 'var(--radius-button)',
            padding: '0.65rem 1rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            animation: 'fadeInSlide 0.25s ease-out'
          }}
        >
          {authToast.type === 'error' ? (
            <AlertCircle size={17} color="#DC2626" />
          ) : (
            <CheckCircle2 size={17} color="#16A34A" />
          )}
          <span>{authToast.message}</span>
        </div>
      )}

      {/* Main Sticky Navbar */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid var(--color-rule)",
          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.03)"
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1440px",
            boxSizing: "border-box",
            margin: "0 auto",
            height: "clamp(56px, 6vw, 64px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 clamp(0.5rem, 1.5vw, 1.25rem)",
            gap: "0.5rem"
          }}
        >
          {/* ── 1. Left Section: Hamburger Button (Mobile) + Brand Logo ── */}
          <div
            className="navbar-left"
            style={{
              flex: "1 1 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: "clamp(0.35rem, 0.8vw, 0.75rem)",
              minWidth: 0
            }}
          >
            {/* Hamburger Button — ONLY on Mobile screens (< 1024px) */}
            {isMobileScreen && (
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="mobile-nav-toggle notranslate"
                aria-label="Open navigation menu"
              >
                <div className="hamburger-bars">
                  <span />
                  <span />
                  <span />
                </div>
              </button>
            )}

            {/* Brand Logo — Desktop only, removed in mobile app view as requested */}
            <Link
              to="/"
              className="notranslate hide-on-mobile"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                textDecoration: "none",
                flexShrink: 0
              }}
            >
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "10px",
                  backgroundColor: "var(--color-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  boxShadow: "0 2px 8px rgba(192, 41, 60, 0.25)"
                }}
              >
                <Compass size={19} color="#FFFFFF" strokeWidth={2.2} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(1.1rem, 1.3vw, 1.25rem)",
                    fontWeight: 800,
                    color: "var(--color-ink)",
                    letterSpacing: "-0.3px",
                    whiteSpace: "nowrap"
                  }}
                >
                  Luk<span style={{ color: "var(--color-primary)" }}>Around</span>
                </span>
                <span
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    color: "var(--color-ink-tertiary)",
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap"
                  }}
                  className="hide-on-mobile-compact"
                >
                  {t("travel india")}
                </span>
              </div>
            </Link>
          </div>

          {/* ── 2. Center Section: Core Navigation Links (Background Layer Removed, Centered & Animated) ── */}
          <nav
            className="desktop-nav-links"
            style={{
              flex: "0 0 auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {coreNavLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `desktop-nav-item ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* ── 3. Right Section: Structured Utilities (Pinned to the Right) ── */}
          <div
            className="navbar-right"
            style={{
              flex: "1 1 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "clamp(0.2rem, 0.4vw, 0.45rem)",
              flexShrink: 0,
              minWidth: "max-content"
            }}
          >

            {/* 1. Super Admin / Admin Status Badge */}
            {isAdmin && (
              <Link
                to="/admin"
                className="notranslate hide-on-mobile"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  padding: "0.32rem clamp(0.45rem, 0.7vw, 0.65rem)",
                  borderRadius: "var(--radius-button)",
                  backgroundColor: isSuperAdmin ? "#FEF3C7" : "#CCFBF1",
                  border: `1px solid ${isSuperAdmin ? "#F59E0B" : "#14B8A6"}`,
                  color: isSuperAdmin ? "#B45309" : "#0F766E",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  transition: "all 0.15s ease",
                  whiteSpace: "nowrap",
                  flexShrink: 0
                }}
                title={isSuperAdmin ? t("adminCommandCenter") : t("adminPanel")}
              >
                {isSuperAdmin ? <Crown size={13} color="#D97706" strokeWidth={2.2} /> : <Shield size={13} color="#0D9488" strokeWidth={2.2} />}
                <span>{isSuperAdmin ? "Admin" : "Admin"}</span>
              </Link>
            )}

            {/* 2. Theme Selector (Polished Button with Visible Palette Icon & Active Color Dot) */}
            <div className="hide-on-mobile" style={{ position: "relative" }}>
              <button
                type="button"
                onClick={toggleThemeDropdown}
                style={{
                  height: "36px",
                  padding: "0 0.6rem",
                  borderRadius: "var(--radius-button)",
                  border: `1.5px solid ${themeDropdownOpen ? "var(--color-primary)" : "var(--color-rule)"}`,
                  backgroundColor: themeDropdownOpen ? "var(--color-primary-light)" : "#FFFFFF",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
                }}
                title={t("switchTheme")}
                aria-label={t("switchTheme")}
              >
                <Palette size={16} color="var(--color-primary)" strokeWidth={2.2} />
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: activeThemeObj.color || "var(--color-primary)",
                    border: "1px solid rgba(0,0,0,0.2)",
                    display: "inline-block"
                  }}
                />
              </button>

              {/* Theme Popover */}
              {themeDropdownOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    width: "280px",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid var(--color-rule)",
                    borderRadius: "var(--radius-card)",
                    boxShadow: "0 12px 35px rgba(0,0,0,0.12)",
                    padding: "0.75rem",
                    zIndex: 1000,
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.35rem"
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.725rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      color: "var(--color-ink-tertiary)",
                      padding: "0.25rem 0.5rem",
                      borderBottom: "1px solid var(--color-rule)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <span>{t("switchTheme")}</span>
                    <span style={{ fontSize: "0.65rem", color: "var(--color-primary)", fontWeight: 700 }}>
                      {THEMES.length} Themes
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", maxHeight: "300px", overflowY: "auto" }}>
                    {THEMES.map((theme) => {
                      const isActive = currentTheme === theme.id;
                      return (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => handleThemeChange(theme.id)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0.5rem 0.7rem",
                            borderRadius: "var(--radius-button)",
                            border: isActive ? `1.5px solid ${theme.color}` : "1px solid transparent",
                            backgroundColor: isActive ? "var(--color-canvas-subtle)" : "transparent",
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "background 0.15s"
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "2px", flexShrink: 0 }}>
                              <div style={{ width: "13px", height: "13px", borderRadius: "50%", backgroundColor: theme.color, border: "1px solid rgba(0,0,0,0.15)" }} />
                              <div style={{ width: "11px", height: "11px", borderRadius: "50%", backgroundColor: theme.dark, border: "1px solid rgba(0,0,0,0.15)" }} />
                            </div>
                            <div>
                              <div style={{ fontSize: "0.825rem", fontWeight: 700, color: "var(--color-ink)" }}>
                                {theme.name}
                              </div>
                              <div style={{ fontSize: "0.68rem", color: "var(--color-ink-tertiary)" }}>
                                {theme.subtitle}
                              </div>
                            </div>
                          </div>

                          {isActive && (
                            <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: theme.color }} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Multi-Language Switcher (Max 5 Languages: English, Hindi, Tamil, Telugu, Kannada) */}
            <div className="hide-on-mobile notranslate" data-no-translate="true" style={{ position: "relative" }}>
              <button
                type="button"
                className="notranslate"
                data-no-translate="true"
                onClick={toggleLanguageDropdown}
                style={{
                  height: "36px",
                  padding: "0 clamp(0.5rem, 1vw, 0.7rem)",
                  borderRadius: "var(--radius-button)",
                  border: `1.5px solid ${languageDropdownOpen ? "var(--color-primary)" : "var(--color-rule)"}`,
                  backgroundColor: languageDropdownOpen ? "var(--color-primary-light)" : "#FFFFFF",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
                }}
                title="Select Language"
                aria-label="Select Language"
              >
                <Globe size={15} color="var(--color-ink-secondary)" strokeWidth={2.2} />
                <span
                  className="notranslate"
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    color: "var(--color-ink)",
                    textTransform: "uppercase",
                    letterSpacing: "0.3px"
                  }}
                >
                  {currentLanguage}
                </span>
                <ChevronDown size={12} color="var(--color-ink-tertiary)" strokeWidth={2.2} />
              </button>

              {/* Language Selection Popover — strictly notranslate so other languages are never changed */}
              {languageDropdownOpen && (
                <div
                  className="notranslate"
                  data-no-translate="true"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    width: "230px",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid var(--color-rule)",
                    borderRadius: "var(--radius-card)",
                    boxShadow: "0 12px 35px rgba(0,0,0,0.12)",
                    padding: "0.6rem",
                    zIndex: 1000,
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.3rem"
                  }}
                >
                  <div
                    className="notranslate"
                    data-no-translate="true"
                    style={{
                      fontSize: "0.725rem",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      color: "var(--color-ink-tertiary)",
                      padding: "0.3rem 0.5rem 0.5rem",
                      borderBottom: "1px solid var(--color-rule)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <span className="notranslate">SELECT LANGUAGE</span>
                    <span className="notranslate" style={{ fontSize: "0.65rem", color: "var(--color-primary)", fontWeight: 700 }}>
                      5 Languages
                    </span>
                  </div>

                  <div className="notranslate" data-no-translate="true" style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    {LANGUAGES.map((lang) => {
                      const isSelected = currentLanguage === lang.code;
                      return (
                        <button
                          key={lang.id}
                          type="button"
                          className="notranslate"
                          data-no-translate="true"
                          onClick={() => handleLanguageChange(lang.code)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                            padding: "0.48rem 0.65rem",
                            borderRadius: "var(--radius-button)",
                            backgroundColor: isSelected ? "var(--color-primary-light)" : "transparent",
                            border: isSelected ? "1px solid var(--color-primary)" : "1px solid transparent",
                            color: isSelected ? "var(--color-primary)" : "var(--color-ink)",
                            fontWeight: isSelected ? 700 : 500,
                            fontSize: "0.84rem",
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "all 0.15s ease"
                          }}
                        >
                          <span className="notranslate" style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
                            <span className="notranslate" style={{ fontSize: "1rem" }}>{lang.flag}</span>
                            <span className="notranslate" style={{ fontWeight: isSelected ? 700 : 600 }}>{lang.nativeName}</span>
                            <span className="notranslate" style={{ fontSize: "0.72rem", color: "var(--color-ink-tertiary)" }}>
                              ({lang.name})
                            </span>
                          </span>
                          {isSelected && <CheckCircle2 size={15} color="var(--color-primary)" strokeWidth={2.2} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 4. Emergency SOS Pill Button */}
            <button
              type="button"
              onClick={() => setIsSosModalOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.38rem clamp(0.55rem, 1vw, 0.8rem)",
                backgroundColor: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: "var(--radius-button)",
                color: "#DC2626",
                fontSize: "0.78rem",
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(220, 38, 38, 0.08)",
                transition: "all 0.15s ease"
              }}
              title={t("emergencyHelpline")}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "#DC2626",
                  boxShadow: "0 0 6px #DC2626"
                }}
              />
              <ShieldAlert size={14} color="#DC2626" strokeWidth={2.2} />
              <span className="notranslate" style={{ fontWeight: 800 }}>SOS</span>
            </button>

            {/* 5. User Profile Capsule (Real Google Photo with referrerPolicy & fallback) */}
            {user ? (
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  onClick={toggleUserDropdown}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.28rem 0.6rem 0.28rem 0.35rem",
                    borderRadius: "var(--radius-full)",
                    border: `1.5px solid ${userDropdownOpen ? "var(--color-primary)" : "var(--color-rule)"}`,
                    backgroundColor: "#FFFFFF",
                    cursor: "pointer",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    transition: "all 0.15s ease"
                  }}
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name || 'User')}`}
                    alt={user.name || 'User'}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name || 'Traveler')}`;
                    }}
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "1.5px solid var(--color-rule)",
                      display: "block",
                      flexShrink: 0
                    }}
                  />
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "var(--color-ink)",
                      maxWidth: "85px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}
                    className="hide-on-mobile"
                  >
                    {user.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={13} color="var(--color-ink-tertiary)" strokeWidth={2} className="hide-on-mobile" />
                </button>

                {/* User Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      width: "260px",
                      backgroundColor: "#FFFFFF",
                      border: "1px solid var(--color-rule)",
                      borderRadius: "var(--radius-card)",
                      boxShadow: "0 12px 35px rgba(0,0,0,0.12)",
                      padding: "0.75rem",
                      zIndex: 1000,
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.4rem"
                    }}
                  >
                    {/* User Mini Header */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", paddingBottom: "0.6rem", borderBottom: "1px solid var(--color-rule)" }}>
                      <img
                        src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name || 'User')}`}
                        alt={user.name}
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name || 'Traveler')}`;
                        }}
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "1.5px solid var(--color-rule)",
                          flexShrink: 0
                        }}
                      />
                      <div style={{ overflow: "hidden", lineHeight: 1.2 }}>
                        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-ink)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                          {user.name}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "var(--color-ink-tertiary)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                          {user.email}
                        </div>
                        {isAdmin && (
                          <div style={{ display: "inline-flex", alignItems: "center", gap: "3px", marginTop: "3px", fontSize: "0.68rem", fontWeight: 800, color: isSuperAdmin ? "#B45309" : "#0F766E" }}>
                            {isSuperAdmin ? "👑 Super Admin" : "🛡️ Admin"}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Admin Direct Jump */}
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.6rem",
                          padding: "0.5rem 0.65rem",
                          fontSize: "0.825rem",
                          fontWeight: 700,
                          color: isSuperAdmin ? "#B45309" : "#0F766E",
                          backgroundColor: isSuperAdmin ? "#FEF3C7" : "#CCFBF1",
                          textDecoration: "none",
                          borderRadius: "var(--radius-button)",
                          transition: "background 0.15s"
                        }}
                      >
                        {isSuperAdmin ? <Crown size={15} color="#D97706" strokeWidth={2} /> : <Shield size={15} color="#0D9488" strokeWidth={2} />}
                        <span>{isSuperAdmin ? t("adminCommandCenter") : t("adminPanel")}</span>
                      </Link>
                    )}

                    <Link
                      to="/itinerary"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        padding: "0.5rem 0.65rem",
                        fontSize: "0.825rem",
                        fontWeight: 600,
                        color: "var(--color-ink)",
                        textDecoration: "none",
                        borderRadius: "var(--radius-button)",
                        transition: "background 0.15s"
                      }}
                    >
                      <Bookmark size={15} color="var(--color-primary)" strokeWidth={2} />
                      <span>{t("mySavedTrips")}</span>
                    </Link>

                    {/* Export Site Package */}
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleExportSite();
                      }}
                      disabled={downloading}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        padding: "0.5rem 0.65rem",
                        fontSize: "0.825rem",
                        fontWeight: 600,
                        color: "var(--color-ink)",
                        backgroundColor: "transparent",
                        border: "none",
                        borderRadius: "var(--radius-button)",
                        cursor: "pointer",
                        width: "100%",
                        textAlign: "left",
                        transition: "background 0.15s"
                      }}
                    >
                      <Download size={15} color="var(--color-ink-secondary)" strokeWidth={2} />
                      <span>{downloading ? t("packagingZip") : t("exportSite")}</span>
                    </button>

                    <div style={{ height: "1px", backgroundColor: "var(--color-rule)", margin: "0.2rem 0" }} />

                    {/* Sign Out */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem",
                        padding: "0.5rem 0.65rem",
                        fontSize: "0.825rem",
                        fontWeight: 700,
                        color: "#DC2626",
                        backgroundColor: "#FEF2F2",
                        border: "none",
                        borderRadius: "var(--radius-button)",
                        cursor: "pointer",
                        width: "100%",
                        textAlign: "left"
                      }}
                    >
                      <LogOut size={15} color="#DC2626" strokeWidth={2} />
                      <span>{t("signOut")}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                style={{
                  fontSize: "0.825rem",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  backgroundColor: "var(--color-primary)",
                  padding: "0.45rem 0.95rem",
                  borderRadius: "var(--radius-button)",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  boxShadow: "var(--shadow-rest)",
                  transition: "all 0.15s ease"
                }}
              >
                <User size={14} color="#FFFFFF" strokeWidth={2} />
                <span>{t("signIn")}</span>
              </Link>
            )}

          </div>
        </div>

        {/* ── Mobile Left Side Sliding Panel (STRICTLY MOBILE ONLY < 1024px) ── */}
        {isMobileScreen && (
          <>
            {/* Backdrop Overlay */}
            {mobileMenuOpen && (
              <div
                className="mobile-left-panel-backdrop"
                onClick={() => setMobileMenuOpen(false)}
              />
            )}

            {/* Sliding Drawer Panel */}
            <aside
              className="mobile-left-panel"
              style={{
                transform: mobileMenuOpen ? "translateX(0)" : "translateX(-100%)",
                transition: "transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
                visibility: mobileMenuOpen ? "visible" : "hidden"
              }}
            >
              {/* Drawer Top Bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1rem 1.25rem",
                  borderBottom: "1px solid var(--color-rule)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      backgroundColor: "var(--color-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#FFFFFF"
                    }}
                  >
                    <Compass size={18} color="#FFFFFF" strokeWidth={2.2} />
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.15rem",
                      fontWeight: 800,
                      color: "var(--color-ink)"
                    }}
                  >
                    Luk<span style={{ color: "var(--color-primary)" }}>Around</span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "var(--radius-button)",
                    border: "1px solid var(--color-rule)",
                    backgroundColor: "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer"
                  }}
                  aria-label="Close navigation menu"
                >
                  <X size={18} color="var(--color-ink)" strokeWidth={2.2} />
                </button>
              </div>

              {/* User Profile Capsule in Drawer */}
              <div style={{ padding: "0.85rem 1.1rem", borderBottom: "1px solid var(--color-rule)", backgroundColor: "var(--color-canvas-subtle)" }}>
                {user ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name || 'User')}`}
                      alt={user.name || 'User'}
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      style={{ width: "38px", height: "38px", borderRadius: "50%", objectFit: "cover", border: "1.5px solid var(--color-rule)" }}
                    />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--color-ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {user.name || user.email}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "var(--color-ink-tertiary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {user.email}
                      </div>
                      {isAdmin && (
                        <span style={{ display: "inline-block", marginTop: "3px", fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", padding: "1px 6px", borderRadius: "4px", backgroundColor: isSuperAdmin ? "#FEF3C7" : "#CCFBF1", color: isSuperAdmin ? "#B45309" : "#0F766E" }}>
                          {isSuperAdmin ? "Super Admin" : "Admin"}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      width: "100%",
                      padding: "0.55rem",
                      borderRadius: "var(--radius-button)",
                      backgroundColor: "var(--color-primary)",
                      color: "#FFFFFF",
                      fontSize: "0.84rem",
                      fontWeight: 700,
                      textDecoration: "none"
                    }}
                  >
                    <User size={15} color="#FFFFFF" strokeWidth={2.2} />
                    <span>{t("signIn")}</span>
                  </Link>
                )}
              </div>

              {/* Navigation Links in Drawer */}
              <div style={{ padding: "0.75rem 0.85rem", display: "flex", flexDirection: "column", gap: "0.3rem", flex: 1 }}>
                <div style={{ fontSize: "0.68rem", fontWeight: 800, textTransform: "uppercase", color: "var(--color-ink-tertiary)", padding: "0.2rem 0.5rem 0.35rem" }}>
                  Navigation
                </div>

                {coreNavLinks.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    style={({ isActive }) => ({
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      fontSize: "0.9rem",
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? "var(--color-primary)" : "var(--color-ink)",
                      padding: "0.6rem 0.8rem",
                      borderRadius: "var(--radius-button)",
                      backgroundColor: isActive ? "var(--color-primary-light)" : "transparent",
                      textDecoration: "none",
                      transition: "background 0.15s ease"
                    })}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                ))}

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      color: isSuperAdmin ? "#B45309" : "#0F766E",
                      padding: "0.6rem 0.8rem",
                      borderRadius: "var(--radius-button)",
                      backgroundColor: isSuperAdmin ? "#FEF3C7" : "#CCFBF1",
                      border: `1px solid ${isSuperAdmin ? "#F59E0B" : "#14B8A6"}`,
                      textDecoration: "none",
                      marginTop: "0.35rem"
                    }}
                  >
                    {isSuperAdmin ? <Crown size={16} color="#D97706" strokeWidth={2.2} /> : <Shield size={16} color="#0D9488" strokeWidth={2.2} />}
                    <span>{isSuperAdmin ? "Super Admin Center" : "Admin Panel"}</span>
                  </Link>
                )}
              </div>

              {/* Quick Actions at Bottom of Drawer */}
              <div style={{ padding: "0.85rem 1rem", borderTop: "1px solid var(--color-rule)", display: "flex", flexDirection: "column", gap: "0.75rem", backgroundColor: "var(--color-canvas-subtle)" }}>
                {/* Themes in Drawer */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <div style={{ fontSize: "0.68rem", fontWeight: 800, textTransform: "uppercase", color: "var(--color-ink-tertiary)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span>{t("switchTheme")}</span>
                    <span style={{ fontSize: "0.68rem", color: "var(--color-primary)", fontWeight: 700 }}>
                      {THEMES.find(th => th.id === currentTheme)?.name || "Theme"}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", overflowX: "auto", paddingBottom: "0.25rem" }}>
                    {THEMES.map((th) => {
                      const isAct = currentTheme === th.id;
                      return (
                        <button
                          key={th.id}
                          type="button"
                          onClick={() => handleThemeChange(th.id)}
                          title={th.name}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem",
                            padding: "0.35rem 0.65rem",
                            borderRadius: "var(--radius-full)",
                            border: isAct ? `1.5px solid ${th.color}` : "1px solid var(--color-rule)",
                            backgroundColor: isAct ? "#FFFFFF" : "transparent",
                            cursor: "pointer",
                            flexShrink: 0,
                            boxShadow: isAct ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                            transition: "all 0.15s ease"
                          }}
                        >
                          <div style={{ width: "11px", height: "11px", borderRadius: "50%", backgroundColor: th.color, border: "1px solid rgba(0,0,0,0.15)" }} />
                          <span style={{ fontSize: "0.74rem", fontWeight: isAct ? 700 : 500, color: isAct ? "var(--color-ink)" : "var(--color-ink-secondary)" }}>
                            {th.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Languages in Drawer — strictly notranslate */}
                <div className="notranslate" data-no-translate="true" style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  <div className="notranslate" style={{ fontSize: "0.68rem", fontWeight: 800, textTransform: "uppercase", color: "var(--color-ink-tertiary)" }}>
                    SELECT LANGUAGE
                  </div>
                  <div className="notranslate" data-no-translate="true" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.3rem" }}>
                    {LANGUAGES.map((lang) => {
                      const isSel = currentLanguage === lang.code;
                      return (
                        <button
                          key={lang.id}
                          type="button"
                          className="notranslate"
                          data-no-translate="true"
                          onClick={() => {
                            handleLanguageChange(lang.code);
                            setMobileMenuOpen(false);
                          }}
                          style={{
                            padding: "0.38rem 0.2rem",
                            borderRadius: "6px",
                            border: isSel ? "1.5px solid var(--color-primary)" : "1px solid var(--color-rule)",
                            backgroundColor: isSel ? "#FFFFFF" : "transparent",
                            color: isSel ? "var(--color-primary)" : "var(--color-ink)",
                            fontWeight: isSel ? 700 : 500,
                            fontSize: "0.74rem",
                            cursor: "pointer",
                            textAlign: "center"
                          }}
                        >
                          <span className="notranslate">{lang.flag} {lang.nativeName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* SOS Emergency button in drawer */}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsSosModalOpen(true);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4rem",
                    width: "100%",
                    padding: "0.55rem",
                    backgroundColor: "#FEF2F2",
                    border: "1px solid #FECACA",
                    borderRadius: "var(--radius-button)",
                    color: "#DC2626",
                    fontSize: "0.82rem",
                    fontWeight: 800,
                    cursor: "pointer"
                  }}
                >
                  <ShieldAlert size={15} color="#DC2626" strokeWidth={2.2} />
                  <span>SOS Helpline</span>
                </button>

                {user && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logoutAuth();
                      showToast("Signed out successfully", "info");
                      navigate('/');
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.4rem",
                      width: "100%",
                      padding: "0.5rem",
                      backgroundColor: "transparent",
                      border: "1px solid var(--color-rule)",
                      borderRadius: "var(--radius-button)",
                      color: "var(--color-ink-secondary)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      cursor: "pointer"
                    }}
                  >
                    <LogOut size={14} strokeWidth={2} />
                    <span>{t("signOut")}</span>
                  </button>
                )}
              </div>
            </aside>
          </>
        )}
      </header>
    </>
  );
}
