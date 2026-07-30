// components/RegisterForm.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ArrowLeft, 
  Sun, 
  Moon, 
  Globe,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageProvider';
import { useTheme } from '@/contexts/ThemeProvider';

export function RegisterForm() {
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  // Animation mode — starts empty so the initial animation triggers on mount
  const [activeMode, setActiveMode] = useState('');

  // Trigger the initial sign-in animation after 200ms (replicating template JS)
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveMode('sign-in');
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  // Toggle between sign-in and sign-up
  const toggle = () => {
    setActiveMode(prev => prev === 'sign-in' ? 'sign-up' : 'sign-in');
  };

  // Sign In State
  const [signInData, setSignInData] = useState({ identifier: '', password: '' });
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [signInErrors, setSignInErrors] = useState<Record<string, string>>({});
  const [isSignInLoading, setIsSignInLoading] = useState(false);

  // Sign Up State
  const [signUpData, setSignUpData] = useState({
    fullName: '', phone: '', email: '', password: '', confirmPassword: '',
  });
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showSignUpConfirmPassword, setShowSignUpConfirmPassword] = useState(false);
  const [signUpErrors, setSignUpErrors] = useState<Record<string, string>>({});
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);

  // Success toast
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isAmharic = language === 'am';

  // Translations
  const t = (key: string) => {
    const dict: Record<string, { en: string; am: string }> = {
      'nav.backHome': { en: 'Back to Home', am: 'ወደ መነሻ ተመለስ' },
      'signin.title': { en: 'Welcome Back', am: 'እንኳን ደህና መጡ' },
      'signin.subtitle': { en: 'Sign in to your Afilas account', am: 'ወደ አፊላስ መለያዎ ይግቡ' },
      'signin.field.identifier': { en: 'Email or Phone Number', am: 'ኢሜይል ወይም ስልክ ቁጥር' },
      'signin.field.identifier.placeholder': { en: 'Enter your email or phone', am: 'ኢሜይል ወይም ስልክ ቁጥር ያስገቡ' },
      'signin.field.password': { en: 'Password', am: 'የይለፍ ቃል' },
      'signin.field.password.placeholder': { en: 'Enter your password', am: 'የይለፍ ቃልዎን ያስገቡ' },
      'signin.forgot': { en: 'Forgot password?', am: 'የይለፍ ቃል ረስተዋል?' },
      'signin.btn': { en: 'Sign In', am: 'ግባ' },
      'signin.submitting': { en: 'Signing in...', am: 'በመግባት ላይ...' },
      'signin.noAccount': { en: "Don't have an account?", am: 'መለያ የለዎትም?' },
      'signin.toggleSignUp': { en: 'Sign up here', am: 'እዚህ ይመዝገቡ' },
      'signup.title': { en: 'Create Account', am: 'መለያ ይፍጠሩ' },
      'signup.subtitle': { en: 'Join Afilas Healthcare today', am: 'ዛሬ አፊላስ ጤና አጠባበቅን ይቀላቀሉ' },
      'signup.field.fullName': { en: 'Full Name', am: 'ሙሉ ስም' },
      'signup.field.fullName.placeholder': { en: 'Enter your full name', am: 'ሙሉ ስምዎን ያስገቡ' },
      'signup.field.phone': { en: 'Phone Number', am: 'ስልክ ቁጥር' },
      'signup.field.phone.placeholder': { en: '+251 911 234 567', am: '+251 911 234 567' },
      'signup.field.email': { en: 'Email (Optional)', am: 'ኢሜል (አማራጭ)' },
      'signup.field.email.placeholder': { en: 'you@example.com', am: 'እርስዎ@ምሳሌ.ኮም' },
      'signup.field.password': { en: 'Password', am: 'የይለፍ ቃል' },
      'signup.field.password.placeholder': { en: 'Min 8 characters', am: 'ቢያንስ 8 ቁምፊዎች' },
      'signup.field.confirmPassword': { en: 'Confirm Password', am: 'የይለፍ ቃል ያረጋግጡ' },
      'signup.field.confirmPassword.placeholder': { en: 'Re-enter your password', am: 'የይለፍ ቃልዎን ድጋሚ ያስገቡ' },
      'signup.btn': { en: 'Sign Up', am: 'ተመዝገብ' },
      'signup.submitting': { en: 'Creating account...', am: 'በመፍጠር ላይ...' },
      'signup.hasAccount': { en: 'Already have an account?', am: 'መለያ አለዎት?' },
      'signup.toggleSignIn': { en: 'Sign in here', am: 'እዚህ ይግቡ' },
      'err.identifier.required': { en: 'Email or phone number is required', am: 'ኢሜይል ወይም ስልክ ቁጥር ያስፈልጋል' },
      'err.password.required': { en: 'Password is required', am: 'የይለፍ ቃል ያስፈልጋል' },
      'err.fullName.required': { en: 'Full name is required', am: 'ሙሉ ስም ያስፈልጋል' },
      'err.fullName.min': { en: 'Name must be at least 2 characters', am: 'ስም ቢያንስ 2 ቁምፊዎች መሆን አለበት' },
      'err.phone.required': { en: 'Phone number is required', am: 'ስልክ ቁጥር ያስፈልጋል' },
      'err.phone.invalid': { en: 'Please enter a valid phone number', am: 'እባክዎ ትክክለኛ የስልክ ቁጥር ያስገቡ' },
      'err.email.invalid': { en: 'Please enter a valid email address', am: 'እባክዎ ትክክለኛ የኢሜይል አድራሻ ያስገቡ' },
      'err.password.min': { en: 'Password must be at least 8 characters', am: 'የይለፍ ቃል ቢያንስ 8 ቁምፊዎች መሆን አለበት' },
      'err.confirmPassword.required': { en: 'Please confirm your password', am: 'እባክዎ የይለፍ ቃልዎን ያረጋግጡ' },
      'err.confirmPassword.match': { en: 'Passwords do not match', am: 'የይለፍ ቃሎች አይዛመዱም' },
      'panel.welcome.title': { en: 'Welcome to Afilas', am: 'እንኳን ወደ አፊላስ በደህና መጡ' },
      'panel.welcome.desc': { en: 'Excellence in Healthcare, Precision Diagnostics & Quality Pharmaceuticals.', am: 'በጤና እንክብካቤ፣ ትክክለኛ ምርመራ እና ጥራት ያላቸው መድኃኒቶች ምርጥነት።' },
      'panel.join.title': { en: 'Join with Afilas', am: 'ከአፊላስ ጋር ይቀላቀሉ' },
      'panel.join.desc': { en: 'Create your account to access compassionate, specialized medical care.', am: 'ርህራሄ የተሞላበት ልዩ የህክምና አገልግሎቶችን ለማግኘት መለያዎን ይፍጠሩ።' },
      'success.signin': { en: 'Signed in successfully!', am: 'በተሳካ ሁኔታ ገብተዋል!' },
      'success.signup': { en: 'Account created successfully!', am: 'መለያዎ በተሳካ ሁኔታ ተፈጥሯል!' },
    };
    return dict[key]?.[language as 'en' | 'am'] || key;
  };

  // --- Sign In Validation ---
  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!signInData.identifier.trim()) errors.identifier = t('err.identifier.required');
    if (!signInData.password) errors.password = t('err.password.required');
    setSignInErrors(errors);
    if (Object.keys(errors).length === 0) {
      setIsSignInLoading(true);
      setTimeout(() => {
        setIsSignInLoading(false);
        setSuccessMessage(t('success.signin'));
        setTimeout(() => setSuccessMessage(null), 3000);
      }, 1200);
    }
  };

  // --- Sign Up Validation ---
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!signUpData.fullName.trim()) errors.fullName = t('err.fullName.required');
    else if (signUpData.fullName.trim().length < 2) errors.fullName = t('err.fullName.min');
    if (!signUpData.phone.trim()) errors.phone = t('err.phone.required');
    else if (!/^\+?[\d\s-]{9,}$/.test(signUpData.phone.trim())) errors.phone = t('err.phone.invalid');
    if (signUpData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signUpData.email.trim())) errors.email = t('err.email.invalid');
    if (!signUpData.password) errors.password = t('err.password.required');
    else if (signUpData.password.length < 8) errors.password = t('err.password.min');
    if (!signUpData.confirmPassword) errors.confirmPassword = t('err.confirmPassword.required');
    else if (signUpData.password !== signUpData.confirmPassword) errors.confirmPassword = t('err.confirmPassword.match');
    setSignUpErrors(errors);
    if (Object.keys(errors).length === 0) {
      setIsSignUpLoading(true);
      setTimeout(() => {
        setIsSignUpLoading(false);
        setSuccessMessage(t('success.signup'));
        setTimeout(() => setSuccessMessage(null), 3000);
      }, 1200);
    }
  };

  return (
    <div className={`auth-container ${activeMode}`}
      style={{ backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff' }}
    >
      {/* ==================== TOP HEADER CONTROLS ==================== */}
      <header style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem' }}>
        <Link
          href="/"
          className="group"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.4rem 1rem', borderRadius: '9999px',
            backgroundColor: theme === 'dark' ? 'rgba(30,41,59,0.85)' : 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`,
            color: theme === 'dark' ? '#e2e8f0' : '#475569',
            fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none',
            transition: 'all 0.2s',
          }}
        >
          <ArrowLeft style={{ width: 16, height: 16 }} />
          <span>{t('nav.backHome')}</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.4rem 0.8rem', borderRadius: '9999px',
              backgroundColor: theme === 'dark' ? 'rgba(30,41,59,0.85)' : 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`,
              color: theme === 'dark' ? '#e2e8f0' : '#475569',
              fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
            }}
          >
            <Globe style={{ width: 14, height: 14, color: theme === 'dark' ? '#14b8a6' : '#0f6e5f' }} />
            <span>{language === 'en' ? 'አማርኛ' : 'English'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            style={{
              padding: '0.5rem', borderRadius: '9999px',
              backgroundColor: theme === 'dark' ? 'rgba(30,41,59,0.85)' : 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`,
              color: theme === 'dark' ? '#fbbf24' : '#4f46e5',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
            }}
          >
            {theme === 'dark' ? <Sun style={{ width: 16, height: 16 }} /> : <Moon style={{ width: 16, height: 16 }} />}
          </button>
        </div>
      </header>

      {/* ==================== SUCCESS TOAST ==================== */}
      {successMessage && (
        <div style={{
          position: 'fixed', top: '4rem', left: '50%', transform: 'translateX(-50%)',
          zIndex: 50, display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.75rem 1.5rem', borderRadius: '0.75rem',
          backgroundColor: '#059669', color: '#fff', fontSize: '0.875rem', fontWeight: 600,
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        }}>
          <CheckCircle2 style={{ width: 20, height: 20 }} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* ==================== FORM SECTION ==================== */}
      <div className="auth-row">
        
        {/* ---- SIGN UP COLUMN (Left Side) ---- */}
        <div className="auth-col sign-up">
          <div className="auth-form-wrapper">
            <div className="auth-form sign-up"
              style={{
                backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                color: theme === 'dark' ? '#f1f5f9' : '#1e293b',
              }}
            >
              {/* Logo + Header */}
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <Image
                  src="/Afilas-icon.png"
                  alt="Afilas"
                  width={48}
                  height={48}
                  style={{ margin: '0 auto 0.5rem', display: 'block', objectFit: 'contain' }}
                  priority
                />
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0.25rem 0' }}>
                  {t('signup.title')}
                </h3>
                <p style={{ fontSize: '0.75rem', color: theme === 'dark' ? '#94a3b8' : '#64748b', margin: 0, fontWeight: 400 }}>
                  {t('signup.subtitle')}
                </p>
              </div>

              <form onSubmit={handleSignUpSubmit} noValidate>
                {/* Full Name */}
                <div className="auth-input-group">
                  <span className="auth-input-icon"><User style={{ width: 16, height: 16 }} /></span>
                  <input
                    type="text"
                    placeholder={t('signup.field.fullName.placeholder')}
                    value={signUpData.fullName}
                    onChange={(e) => { setSignUpData({ ...signUpData, fullName: e.target.value }); if(signUpErrors.fullName) setSignUpErrors(p => ({...p, fullName: ''})); }}
                    style={{ backgroundColor: theme === 'dark' ? '#0f172a' : '#f3f4f6', color: theme === 'dark' ? '#f1f5f9' : '#1e293b' }}
                  />
                  {signUpErrors.fullName && <div className="auth-error">{signUpErrors.fullName}</div>}
                </div>

                {/* Phone */}
                <div className="auth-input-group">
                  <span className="auth-input-icon"><Phone style={{ width: 16, height: 16 }} /></span>
                  <input
                    type="tel"
                    placeholder={t('signup.field.phone.placeholder')}
                    value={signUpData.phone}
                    onChange={(e) => { setSignUpData({ ...signUpData, phone: e.target.value }); if(signUpErrors.phone) setSignUpErrors(p => ({...p, phone: ''})); }}
                    style={{ backgroundColor: theme === 'dark' ? '#0f172a' : '#f3f4f6', color: theme === 'dark' ? '#f1f5f9' : '#1e293b' }}
                  />
                  {signUpErrors.phone && <div className="auth-error">{signUpErrors.phone}</div>}
                </div>

                {/* Email (Optional) */}
                <div className="auth-input-group">
                  <span className="auth-input-icon"><Mail style={{ width: 16, height: 16 }} /></span>
                  <input
                    type="email"
                    placeholder={t('signup.field.email.placeholder')}
                    value={signUpData.email}
                    onChange={(e) => { setSignUpData({ ...signUpData, email: e.target.value }); if(signUpErrors.email) setSignUpErrors(p => ({...p, email: ''})); }}
                    style={{ backgroundColor: theme === 'dark' ? '#0f172a' : '#f3f4f6', color: theme === 'dark' ? '#f1f5f9' : '#1e293b' }}
                  />
                  {signUpErrors.email && <div className="auth-error">{signUpErrors.email}</div>}
                </div>

                {/* Password */}
                <div className="auth-input-group">
                  <span className="auth-input-icon"><Lock style={{ width: 16, height: 16 }} /></span>
                  <input
                    type={showSignUpPassword ? 'text' : 'password'}
                    placeholder={t('signup.field.password.placeholder')}
                    value={signUpData.password}
                    onChange={(e) => { setSignUpData({ ...signUpData, password: e.target.value }); if(signUpErrors.password) setSignUpErrors(p => ({...p, password: ''})); }}
                    style={{ backgroundColor: theme === 'dark' ? '#0f172a' : '#f3f4f6', color: theme === 'dark' ? '#f1f5f9' : '#1e293b', paddingRight: '2.75rem' }}
                  />
                  <button type="button" className="auth-input-toggle" onClick={() => setShowSignUpPassword(!showSignUpPassword)}>
                    {showSignUpPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                  </button>
                  {signUpErrors.password && <div className="auth-error">{signUpErrors.password}</div>}
                </div>

                {/* Confirm Password */}
                <div className="auth-input-group">
                  <span className="auth-input-icon"><Lock style={{ width: 16, height: 16 }} /></span>
                  <input
                    type={showSignUpConfirmPassword ? 'text' : 'password'}
                    placeholder={t('signup.field.confirmPassword.placeholder')}
                    value={signUpData.confirmPassword}
                    onChange={(e) => { setSignUpData({ ...signUpData, confirmPassword: e.target.value }); if(signUpErrors.confirmPassword) setSignUpErrors(p => ({...p, confirmPassword: ''})); }}
                    style={{ backgroundColor: theme === 'dark' ? '#0f172a' : '#f3f4f6', color: theme === 'dark' ? '#f1f5f9' : '#1e293b', paddingRight: '2.75rem' }}
                  />
                  <button type="button" className="auth-input-toggle" onClick={() => setShowSignUpConfirmPassword(!showSignUpConfirmPassword)}>
                    {showSignUpConfirmPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                  </button>
                  {signUpErrors.confirmPassword && <div className="auth-error">{signUpErrors.confirmPassword}</div>}
                </div>

                {/* Submit */}
                <button type="submit" className="auth-submit-btn" disabled={isSignUpLoading} style={{ marginTop: '0.5rem' }}>
                  {isSignUpLoading ? t('signup.submitting') : (<>{t('signup.btn')} <ArrowRight style={{ width: 16, height: 16 }} /></>)}
                </button>

                <p style={{ textAlign: 'center', color: theme === 'dark' ? '#94a3b8' : '#64748b' }}>
                  <span>{t('signup.hasAccount')} </span>
                  <button type="button" className="auth-pointer" onClick={toggle}>
                    {t('signup.toggleSignIn')}
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* ---- SIGN IN COLUMN (Right Side) ---- */}
        <div className="auth-col sign-in">
          <div className="auth-form-wrapper">
            <div className="auth-form sign-in"
              style={{
                backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                color: theme === 'dark' ? '#f1f5f9' : '#1e293b',
              }}
            >
              {/* Logo + Header */}
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <Image
                  src="/Afilas-icon.png"
                  alt="Afilas"
                  width={48}
                  height={48}
                  style={{ margin: '0 auto 0.5rem', display: 'block', objectFit: 'contain' }}
                  priority
                />
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0.25rem 0' }}>
                  {t('signin.title')}
                </h3>
                <p style={{ fontSize: '0.75rem', color: theme === 'dark' ? '#94a3b8' : '#64748b', margin: 0, fontWeight: 400 }}>
                  {t('signin.subtitle')}
                </p>
              </div>

              <form onSubmit={handleSignInSubmit} noValidate>
                {/* Email/Phone */}
                <div className="auth-input-group">
                  <span className="auth-input-icon"><User style={{ width: 16, height: 16 }} /></span>
                  <input
                    type="text"
                    placeholder={t('signin.field.identifier.placeholder')}
                    value={signInData.identifier}
                    onChange={(e) => { setSignInData({ ...signInData, identifier: e.target.value }); if(signInErrors.identifier) setSignInErrors(p => ({...p, identifier: ''})); }}
                    style={{ backgroundColor: theme === 'dark' ? '#0f172a' : '#f3f4f6', color: theme === 'dark' ? '#f1f5f9' : '#1e293b' }}
                  />
                  {signInErrors.identifier && <div className="auth-error">{signInErrors.identifier}</div>}
                </div>

                {/* Password */}
                <div className="auth-input-group">
                  <span className="auth-input-icon"><Lock style={{ width: 16, height: 16 }} /></span>
                  <input
                    type={showSignInPassword ? 'text' : 'password'}
                    placeholder={t('signin.field.password.placeholder')}
                    value={signInData.password}
                    onChange={(e) => { setSignInData({ ...signInData, password: e.target.value }); if(signInErrors.password) setSignInErrors(p => ({...p, password: ''})); }}
                    style={{ backgroundColor: theme === 'dark' ? '#0f172a' : '#f3f4f6', color: theme === 'dark' ? '#f1f5f9' : '#1e293b', paddingRight: '2.75rem' }}
                  />
                  <button type="button" className="auth-input-toggle" onClick={() => setShowSignInPassword(!showSignInPassword)}>
                    {showSignInPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                  </button>
                  {signInErrors.password && <div className="auth-error">{signInErrors.password}</div>}
                </div>

                {/* Forgot Password */}
                <p style={{ textAlign: 'right', margin: '0.5rem 0' }}>
                  <button type="button" className="auth-pointer">{t('signin.forgot')}</button>
                </p>

                {/* Submit */}
                <button type="submit" className="auth-submit-btn" disabled={isSignInLoading}>
                  {isSignInLoading ? t('signin.submitting') : (<>{t('signin.btn')} <ArrowRight style={{ width: 16, height: 16 }} /></>)}
                </button>

                <p style={{ textAlign: 'center', color: theme === 'dark' ? '#94a3b8' : '#64748b' }}>
                  <span>{t('signin.noAccount')} </span>
                  <button type="button" className="auth-pointer" onClick={toggle}>
                    {t('signin.toggleSignUp')}
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== CONTENT OVERLAY SECTION ==================== */}
      <div className="auth-row auth-content-row">
        {/* Sign In content (Left side — visible when background covers left) */}
        <div className="auth-col">
          <div className="auth-text sign-in" style={{ textAlign: 'center' }}>
            <div className="auth-logo-circle">
              <Image src="/Afilas-icon.png" alt="Afilas" width={150} height={150} style={{ objectFit: 'contain' }} />
            </div>
            <h2>{t('panel.welcome.title')}</h2>
            <p>{t('panel.welcome.desc')}</p>
          </div>
        </div>
        {/* Sign Up content (Right side — visible when background covers right) */}
        <div className="auth-col">
          <div className="auth-text sign-up" style={{ textAlign: 'center' }}>
            <div className="auth-logo-circle">
              <Image src="/Afilas-icon.png" alt="Afilas" width={150} height={150} style={{ objectFit: 'contain' }} />
            </div>
            <h2>{t('panel.join.title')}</h2>
            <p>{t('panel.join.desc')}</p>
          </div>
        </div>
      </div>

    </div>
  );
}