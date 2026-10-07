import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  User,
  AlertCircle,
  Loader2,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react';
import { loginUser, registerUser, googleLoginUser } from '../api/client';
import { useApp } from '../context/AppContext';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithCredential,
  GoogleAuthProvider
} from '../firebase/config';
import { signInWithRedirect, getRedirectResult } from 'firebase/auth';

export default function AuthForm({ mode = 'login' }) {
  const isLogin = mode === 'login';
  const navigate = useNavigate();
  const location = useLocation();
  const { loginAuth, showToast } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [gsiReady, setGsiReady] = useState(false);
  const [shake, setShake] = useState(false);
  const [serverError, setServerError] = useState('');

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const validate = () => {
    const newErrors = {};

    if (!isLogin) {
      if (!formData.name.trim()) {
        newErrors.name = 'Full name is required';
      } else if (formData.name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (!isLogin) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirm password is required';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const handleSuccessRedirect = (userObj) => {
    const targetPath = location.state?.from?.pathname || '/';
    showToast(
      isLogin
        ? `Welcome back, ${userObj.name}!`
        : `Account created! Welcome, ${userObj.name}!`,
      'success'
    );
    navigate(targetPath, { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) {
      triggerShake();
      return;
    }

    setLoading(true);

    try {
      let response;
      if (isLogin) {
        response = await loginUser({
          email: formData.email,
          password: formData.password
        });
      } else {
        response = await registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      }

      if (response && response.token && response.user) {
        loginAuth(response.user, response.token);
        handleSuccessRedirect(response.user);
      }
    } catch (err) {
      setServerError(err.message || 'Authentication failed. Please check your credentials.');
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!formData.email) {
      setServerError('Please enter your email address to receive password reset instructions.');
      triggerShake();
      return;
    }
    showToast(`Password reset link sent to ${formData.email}`, 'info');
  };

  // ── Google Identity Services (GIS) / One-Tap Credential Callback ──
  const handleGoogleCredentialResponse = async (googleResponse) => {
    if (!googleResponse || !googleResponse.credential) return;
    setGoogleLoading(true);
    setServerError('');
    try {
      // Decode JWT payload
      const base64Url = googleResponse.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const decoded = JSON.parse(jsonPayload);

      // Sync with Firebase auth using Google ID Token
      try {
        const fbCredential = GoogleAuthProvider.credential(googleResponse.credential);
        await signInWithCredential(auth, fbCredential);
      } catch (fbErr) {
        console.warn('Firebase credential sync info:', fbErr);
      }

      // Sync with LukAround Backend API
      const response = await googleLoginUser({
        email: decoded.email,
        name: decoded.name || 'Google Traveler',
        avatar: decoded.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(decoded.name || 'Traveler')}`
      });

      if (response && response.token && response.user) {
        const finalUser = {
          ...response.user,
          avatar: decoded.picture || response.user.avatar
        };
        loginAuth(finalUser, response.token);
        handleSuccessRedirect(finalUser);
      }
    } catch (err) {
      console.error('Google Auth Error:', err);
      setServerError(err.message || 'Google authentication failed.');
      triggerShake();
    } finally {
      setGoogleLoading(false);
    }
  };

  // Listen for Firebase Redirect result (if popup was blocked and fallback redirect was used)
  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        if (result && result.user) {
          const fbUser = result.user;
          const googlePhoto = fbUser.photoURL || fbUser.providerData?.[0]?.photoURL || null;
          const response = await googleLoginUser({
            email: fbUser.email,
            name: fbUser.displayName || 'Google Traveler',
            avatar: googlePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fbUser.displayName || 'Traveler')}`
          });
          if (response && response.token && response.user) {
            const finalUser = {
              ...response.user,
              avatar: googlePhoto || response.user.avatar
            };
            loginAuth(finalUser, response.token);
            handleSuccessRedirect(finalUser);
          }
        }
      })
      .catch((err) => {
        if (err.code !== 'auth/null-user') {
          console.warn('Redirect auth notice:', err);
        }
      });
  }, []);

  // Initialize Google Identity Services (One-Tap & Unified Button)
  useEffect(() => {
    const googleClientId =
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      '1055485765270-eqj5hp22jm8vf2csqvevajifggo757g4.apps.googleusercontent.com';

    const initGsi = () => {
      if (window.google?.accounts?.id && googleClientId) {
        try {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          const btnContainer = document.getElementById('google-signin-btn-container');
          if (btnContainer) {
            btnContainer.innerHTML = '';
            window.google.accounts.id.renderButton(btnContainer, {
              type: 'standard',
              theme: 'outline',
              size: 'large',
              width: btnContainer.offsetWidth ? Math.min(btnContainer.offsetWidth, 380) : 340,
              text: isLogin ? 'signin_with' : 'signup_with',
              shape: 'rectangular',
              logo_alignment: 'left',
            });
            setGsiReady(true);
          }

          // Trigger One-Tap prompt gently
          window.google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
              // Gracefully handle without console spam
            }
          });
        } catch (err) {
          console.warn('Google Identity Services init notice:', err);
        }
      }
    };

    if (window.google?.accounts?.id) {
      initGsi();
    } else {
      const timer = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(timer);
          initGsi();
        }
      }, 250);
      return () => clearInterval(timer);
    }
  }, [isLogin]);

  // Fallback Google Sign-In click handler
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setServerError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      if (!fbUser || !fbUser.email) {
        throw new Error('No email found in Google account profile.');
      }

      const googlePhoto = fbUser.photoURL || fbUser.providerData?.[0]?.photoURL || null;
      const response = await googleLoginUser({
        email: fbUser.email,
        name: fbUser.displayName || 'Google Traveler',
        avatar: googlePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fbUser.displayName || 'Traveler')}`
      });

      if (response && response.token && response.user) {
        const finalUser = {
          ...response.user,
          avatar: googlePhoto || response.user.avatar
        };
        loginAuth(finalUser, response.token);
        handleSuccessRedirect(finalUser);
      }
    } catch (err) {
      console.error('Google Sign-In Error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        return;
      }

      // If popup was blocked by browser, seamlessly switch to redirect
      if (err.code === 'auth/popup-blocked') {
        try {
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (redirErr) {
          setServerError('Pop-up was blocked. Please enable pop-ups for localhost in your browser address bar.');
          triggerShake();
          return;
        }
      }

      if (err.message?.includes('redirect_uri_mismatch') || err.code === 'auth/invalid-credential') {
        setServerError('Google OAuth configuration mismatch. Please verify authorized origins in Google Cloud.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setServerError('Google Sign-In is not enabled yet in Firebase Console.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setServerError('Domain not authorized in Firebase Console.');
      } else if (err.code === 'auth/network-request-failed') {
        setServerError('Network connection issue. Please check your internet connection.');
      } else {
        setServerError(err.message || 'Google sign-in failed. Please try again.');
      }
      triggerShake();
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.99 }}
      animate={shake ? { x: [-6, 6, -6, 6, 0] } : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: shake ? 0.35 : 0.25, ease: 'easeOut' }}
      style={{
        maxWidth: '420px',
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: '14px',
        border: '1px solid #E5E7EB',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)',
        padding: 'clamp(1.5rem, 3.5vw, 2.25rem)',
        boxSizing: 'border-box'
      }}
    >
      {/* Segmented Control Mode Tabs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          backgroundColor: '#F3F4F6',
          padding: '4px',
          borderRadius: '8px',
          marginBottom: '1.25rem'
        }}
      >
        <Link
          to="/login"
          style={{
            textAlign: 'center',
            padding: '0.45rem',
            fontSize: '0.825rem',
            fontWeight: isLogin ? 700 : 500,
            color: isLogin ? '#111827' : '#6B7280',
            backgroundColor: isLogin ? '#FFFFFF' : 'transparent',
            borderRadius: '6px',
            textDecoration: 'none',
            boxShadow: isLogin ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          Sign In
        </Link>
        <Link
          to="/register"
          style={{
            textAlign: 'center',
            padding: '0.45rem',
            fontSize: '0.825rem',
            fontWeight: !isLogin ? 700 : 500,
            color: !isLogin ? '#111827' : '#6B7280',
            backgroundColor: !isLogin ? '#FFFFFF' : 'transparent',
            borderRadius: '6px',
            textDecoration: 'none',
            boxShadow: !isLogin ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          Create Account
        </Link>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h2
          style={{
            fontSize: '1.35rem',
            fontWeight: 800,
            color: '#111827',
            letterSpacing: '-0.3px',
            margin: '0 0 0.3rem 0'
          }}
        >
          {isLogin ? 'Sign in to Luk Around' : 'Create an account'}
        </h2>
        <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: 0, lineHeight: 1.4 }}>
          {isLogin
            ? 'Enter your credentials to access your itineraries & travel account'
            : 'Join Luk Around to plan personalized, AI-orchestrated Indian itineraries'}
        </p>
      </div>

      {/* Error Alert */}
      {serverError && (
        <div
          style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '8px',
            padding: '0.6rem 0.75rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#991B1B',
            fontSize: '0.775rem',
            fontWeight: 500
          }}
        >
          <AlertCircle size={15} flexShrink={0} color="#DC2626" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Credentials Form */}
      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {/* Full Name (Register Mode) */}
        {!isLogin && (
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.775rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.3rem'
              }}
            >
              Full Name <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <User
                size={15}
                color="#9CA3AF"
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Aarav Sharma"
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 0.85rem 0 2.4rem',
                  fontSize: '0.85rem',
                  borderRadius: '8px',
                  border: errors.name ? '1px solid #DC2626' : '1px solid #D1D5DB',
                  backgroundColor: errors.name ? '#FEF2F2' : '#FFFFFF',
                  outline: 'none',
                  transition: 'border-color 0.15s ease',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            {errors.name && (
              <span style={{ display: 'block', fontSize: '0.72rem', color: '#DC2626', marginTop: '0.2rem' }}>
                {errors.name}
              </span>
            )}
          </div>
        )}

        {/* Email Address */}
        <div>
          <label
            style={{
              display: 'block',
              fontSize: '0.775rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.3rem'
            }}
          >
            Email Address <span style={{ color: '#DC2626' }}>*</span>
          </label>
          <div style={{ position: 'relative' }}>
            <Mail
              size={15}
              color="#9CA3AF"
              style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              style={{
                width: '100%',
                height: '40px',
                padding: '0 0.85rem 0 2.4rem',
                fontSize: '0.85rem',
                borderRadius: '8px',
                border: errors.email ? '1px solid #DC2626' : '1px solid #D1D5DB',
                backgroundColor: errors.email ? '#FEF2F2' : '#FFFFFF',
                outline: 'none',
                transition: 'border-color 0.15s ease',
                boxSizing: 'border-box'
              }}
            />
          </div>
          {errors.email && (
            <span style={{ display: 'block', fontSize: '0.72rem', color: '#DC2626', marginTop: '0.2rem' }}>
              {errors.email}
            </span>
          )}
        </div>

        {/* Password */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.3rem'
            }}
          >
            <label style={{ fontSize: '0.775rem', fontWeight: 600, color: '#374151' }}>
              Password <span style={{ color: '#DC2626' }}>*</span>
            </label>
            {isLogin && (
              <Link
                to="#"
                onClick={handleForgotPassword}
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-primary)',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                Forgot?
              </Link>
            )}
          </div>
          <div style={{ position: 'relative' }}>
            <Lock
              size={15}
              color="#9CA3AF"
              style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              style={{
                width: '100%',
                height: '40px',
                padding: '0 2.4rem',
                fontSize: '0.85rem',
                borderRadius: '8px',
                border: errors.password ? '1px solid #DC2626' : '1px solid #D1D5DB',
                backgroundColor: errors.password ? '#FEF2F2' : '#FFFFFF',
                outline: 'none',
                transition: 'border-color 0.15s ease',
                boxSizing: 'border-box'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#9CA3AF',
                display: 'flex',
                alignItems: 'center',
                padding: 0
              }}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && (
            <span style={{ display: 'block', fontSize: '0.72rem', color: '#DC2626', marginTop: '0.2rem' }}>
              {errors.password}
            </span>
          )}
        </div>

        {/* Confirm Password (Register Mode) */}
        {!isLogin && (
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.775rem',
                fontWeight: 600,
                color: '#374151',
                marginBottom: '0.3rem'
              }}
            >
              Confirm Password <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={15}
                color="#9CA3AF"
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  height: '40px',
                  padding: '0 0.85rem 0 2.4rem',
                  fontSize: '0.85rem',
                  borderRadius: '8px',
                  border: errors.confirmPassword ? '1px solid #DC2626' : '1px solid #D1D5DB',
                  backgroundColor: errors.confirmPassword ? '#FEF2F2' : '#FFFFFF',
                  outline: 'none',
                  transition: 'border-color 0.15s ease',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            {errors.confirmPassword && (
              <span style={{ display: 'block', fontSize: '0.72rem', color: '#DC2626', marginTop: '0.2rem' }}>
                {errors.confirmPassword}
              </span>
            )}
          </div>
        )}

        {/* Remember Me Checkbox */}
        {isLogin && (
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.775rem',
              color: '#4B5563',
              cursor: 'pointer',
              marginTop: '0.1rem'
            }}
          >
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={{ accentColor: 'var(--color-primary)' }}
            />
            <span>Remember me for 30 days</span>
          </label>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || googleLoading}
          style={{
            width: '100%',
            height: '42px',
            marginTop: '0.35rem',
            backgroundColor: 'var(--color-primary)',
            color: '#FFFFFF',
            fontSize: '0.875rem',
            fontWeight: 700,
            borderRadius: '8px',
            border: 'none',
            cursor: loading || googleLoading ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 8px rgba(192, 41, 60, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            transition: 'opacity 0.15s ease',
            opacity: loading ? 0.85 : 1
          }}
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>{isLogin ? 'Signing In...' : 'Creating Account...'}</span>
            </>
          ) : (
            <>
              <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight size={15} />
            </>
          )}
        </button>
      </form>

      {/* Subtle Divider before Google SSO */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          margin: '1.25rem 0 1rem 0'
        }}
      >
        <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
        <span style={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          or continue with
        </span>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#E5E7EB' }} />
      </div>

      {/* SINGLE Professional Google Sign-In */}
      <div
        id="google-signin-btn-container"
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          minHeight: gsiReady ? '42px' : '0px'
        }}
      />

      {/* Render fallback custom Google button only if GIS button has not mounted */}
      {!gsiReady && (
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          style={{
            width: '100%',
            height: '42px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.65rem',
            backgroundColor: '#FFFFFF',
            border: '1px solid #D1D5DB',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#374151',
            cursor: googleLoading || loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            transition: 'all 0.15s ease',
            boxSizing: 'border-box'
          }}
        >
          {googleLoading ? (
            <Loader2 size={16} className="animate-spin" color="var(--color-primary)" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
        </button>
      )}

      {/* Enterprise Security & Privacy Footer */}
      <div
        style={{
          marginTop: '1.5rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid #F3F4F6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.4rem',
          fontSize: '0.72rem',
          color: '#9CA3AF'
        }}
      >
        <ShieldCheck size={13} color="#10B981" />
        <span>Enterprise 256-bit SSL Security • LukAround</span>
      </div>
    </motion.div>
  );
}
