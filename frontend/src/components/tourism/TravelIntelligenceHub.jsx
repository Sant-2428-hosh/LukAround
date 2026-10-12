import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Landmark,
  Building2,
  Sparkles,
  Award,
  Route,
  ArrowUpRight,
  ShieldCheck,
  Compass,
  Navigation,
  Sun,
  Activity,
  CheckCircle2
} from 'lucide-react';

/**
 * Animated number counter triggered smoothly when element enters viewport.
 */
function useInViewCounter(targetValue, duration = 1800, shouldStart = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;

    let startTime = null;
    let animationFrameId = null;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      // easeOutExpo curve for silky smooth landing
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * targetValue));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(targetValue);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [targetValue, duration, shouldStart]);

  return count;
}

const INTELLIGENCE_PILLARS = [
  {
    id: 'states',
    value: 15,
    suffix: '',
    title: 'Curated Indian States',
    subtitle: 'From Himalayan heights to tropical backwaters',
    badge: '15 Curated Regions',
    actionText: 'Explore States',
    link: '/states',
    color: '#C85A32', // Terracotta Earth
    bgColor: '#FFF5F0',
    borderColor: 'rgba(200, 90, 50, 0.2)',
    glowColor: 'rgba(200, 90, 50, 0.12)',
    icon: Landmark,
    highlight: 'Himalayas to Coastlines'
  },
  {
    id: 'cities',
    value: 212,
    suffix: '',
    title: 'Destination Cities',
    subtitle: 'Chartered with seasonality, weather & local transit',
    badge: 'Tier-1 to Hidden Gems',
    actionText: 'Browse Cities',
    link: '/cities',
    color: '#0D9488', // Teal Forest
    bgColor: '#F0FDF9',
    borderColor: 'rgba(13, 148, 136, 0.2)',
    glowColor: 'rgba(13, 148, 136, 0.12)',
    icon: Building2,
    highlight: '212 City Guides'
  },
  {
    id: 'attractions',
    value: 403,
    suffix: '+',
    title: 'Verified Attractions',
    subtitle: 'Detailed with ticket rates, entry hours & vantage tips',
    badge: 'Zero Hallucinations',
    actionText: 'Discover Sights',
    link: '/attractions',
    color: '#0284C7', // Azure Sky
    bgColor: '#F0F9FF',
    borderColor: 'rgba(2, 132, 199, 0.2)',
    glowColor: 'rgba(2, 132, 199, 0.12)',
    icon: Sparkles,
    highlight: 'Entry Fees & Timings'
  },
  {
    id: 'unesco',
    value: 48,
    suffix: '+',
    title: 'UNESCO Heritage Sites',
    subtitle: 'Living temples, ancient cave shrines & royal forts',
    badge: 'National Treasures',
    actionText: 'View Heritage',
    link: '/categories/heritage',
    color: '#D97706', // Royal Gold
    bgColor: '#FFFBEB',
    borderColor: 'rgba(217, 119, 6, 0.2)',
    glowColor: 'rgba(217, 119, 6, 0.12)',
    icon: Award,
    highlight: 'Cultural Marvels'
  },
  {
    id: 'itineraries',
    value: 6,
    suffix: ' Routes',
    title: 'Signature Itineraries',
    subtitle: 'Circadian day scheduling & Haversine zero-zigzag clustering',
    badge: '1–10 Day Custom Plans',
    actionText: 'Launch Planner',
    link: '/planner',
    color: '#9333EA', // Royal Purple
    bgColor: '#FAF5FF',
    borderColor: 'rgba(147, 51, 234, 0.2)',
    glowColor: 'rgba(147, 51, 234, 0.12)',
    icon: Route,
    highlight: 'AI Circadian Routing'
  }
];

const PLATFORM_SIGNATURES = [
  {
    icon: Navigation,
    title: 'Zero Zig-Zag Clustering',
    desc: 'Haversine distance algorithms group nearby monuments together to cut transit fatigue.'
  },
  {
    icon: Compass,
    title: 'Multi-Modal Fare Radar',
    desc: 'Fair local fare estimates for Auto Rickshaws, App Cabs (Ola/Uber), Bus & Metro lines.'
  },
  {
    icon: Sun,
    title: 'Circadian Time Sequencing',
    desc: 'Morning heritage, midday AC museums, sunset scenic spots & evening street bazaars.'
  },
  {
    icon: ShieldCheck,
    title: '24/7 Verified Tourist Safety',
    desc: 'Jurisdictional police precinct contacts and instant emergency SOS directory.',
    link: '/safety'
  }
];

function PillarCard({ pillar, isVisible }) {
  const count = useInViewCounter(pillar.value, 1800, isVisible);
  const IconComponent = pillar.icon;

  return (
    <Link
      to={pillar.link}
      className="t-intel-card"
      style={{
        '--card-accent': pillar.color,
        '--card-bg': pillar.bgColor,
        '--card-border': pillar.borderColor,
        '--card-glow': pillar.glowColor
      }}
    >
      {/* Top Header inside card */}
      <div className="t-intel-card-header">
        <div className="t-intel-icon-wrapper">
          <IconComponent size={22} strokeWidth={2.2} />
        </div>
        <span className="t-intel-pill-badge">{pillar.badge}</span>
      </div>

      {/* Main Counter & Value */}
      <div className="t-intel-counter-wrap">
        <div className="t-intel-counter-number">
          {count}
          <span className="t-intel-suffix">{pillar.suffix}</span>
        </div>
        <h3 className="t-intel-pillar-title">{pillar.title}</h3>
      </div>

      {/* Descriptive content */}
      <p className="t-intel-pillar-desc">{pillar.subtitle}</p>

      {/* Interactive Footer */}
      <div className="t-intel-card-footer">
        <span className="t-intel-action-text">{pillar.actionText}</span>
        <span className="t-intel-action-arrow">
          <ArrowUpRight size={16} />
        </span>
      </div>

      {/* Ambient hover light gradient */}
      <div className="t-intel-glow-effect" />
    </Link>
  );
}

export default function TravelIntelligenceHub() {
  const sectionRef = useRef(null);
  const [hasEnteredView, setHasEnteredView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setHasEnteredView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="travel-intelligence-hub" id="travel-intelligence">
      <div className="tourism-container">
        
        {/* Luxury Hub Header */}
        <div className="t-intel-header">
          <div className="t-intel-badge">
            <span className="t-intel-pulse-dot" />
            <Activity size={13} className="t-intel-badge-icon" />
            <span>LUKAROUND TOURISM INTELLIGENCE RADAR</span>
          </div>

          <div className="t-intel-title-row">
            <div>
              <h2 className="t-intel-heading">
                Verified Indian Travel Infrastructure
              </h2>
              <p className="t-intel-subheading">
                Zero hallucinated routes. Real jurisdictional safety contacts, authentic ticket pricing, 
                and circadian day-by-day scheduling curated from active regional datasets.
              </p>
            </div>

            <div className="t-intel-trust-tag">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span>100% Geo-Validated Datasets</span>
            </div>
          </div>
        </div>

        {/* 5 Distinctive Pillars */}
        <div className="t-intel-grid">
          {INTELLIGENCE_PILLARS.map((pillar) => (
            <PillarCard key={pillar.id} pillar={pillar} isVisible={hasEnteredView} />
          ))}
        </div>

        {/* Signature Architecture Features Strip */}
        <div className="t-intel-signatures-bar">
          <div className="t-intel-sig-label">
            <span className="t-intel-sig-tag">CORE CAPABILITIES</span>
            <span className="t-intel-sig-sub">How LukAround Protects Your Journey</span>
          </div>

          <div className="t-intel-sig-grid">
            {PLATFORM_SIGNATURES.map((sig, idx) => (
              <div key={idx} className="t-intel-sig-item">
                <div className="t-intel-sig-icon">
                  <sig.icon size={18} />
                </div>
                <div className="t-intel-sig-content">
                  <div className="t-intel-sig-title">
                    {sig.title}
                    {sig.link && (
                      <Link to={sig.link} className="t-intel-sig-link" title="Open Safety Directory">
                        <ArrowUpRight size={13} />
                      </Link>
                    )}
                  </div>
                  <div className="t-intel-sig-desc">{sig.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
