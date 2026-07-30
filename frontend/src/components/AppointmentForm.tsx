// components/AppointmentForm.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  User,
  Mail,
  CalendarDays,
  Clock,
  FileText,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Phone,
  Stethoscope,
  ClipboardList,
  Sun,
  Moon,
  Globe,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageProvider';
import { useTheme } from '@/contexts/ThemeProvider';

export function AppointmentForm() {
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [formData, setFormData] = useState({
    fullName: '',
    date: '',
    time: '',
    period: 'AM',
    email: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const isDark = theme === 'dark';

  // Translations
  const t = (key: string) => {
    const dict: Record<string, { en: string; am: string }> = {
      'page.title': { en: 'Book Your Appointment', am: 'ቀጠሮ ይያዙ' },
      'page.subtitle': { en: 'Schedule a visit with our specialists. Fill out the form below and our team will contact you to confirm your appointment.', am: 'ከባለሙያዎቻችን ጋር ጉብኝት ያቅዱ። ከታች ያለውን ቅጽ ይሙሉ እና ቡድናችን ቀጠሮዎን ለማረጋገጥ ያገኝዎታል።' },
      'nav.backHome': { en: 'Back to Home', am: 'ወደ መነሻ ተመለስ' },

      // Info section
      'info.title': { en: 'How It Works', am: 'እንዴት ይሰራል' },
      'info.step1.title': { en: 'Fill the Form', am: 'ቅጹን ይሙሉ' },
      'info.step1.desc': { en: 'Provide your details and preferred appointment time below.', am: 'ከዚህ በታች ዝርዝርዎን እና የሚፈልጉትን የቀጠሮ ጊዜ ያስገቡ።' },
      'info.step2.title': { en: 'We Call You', am: 'እኛ እንደውልልዎታለን' },
      'info.step2.desc': { en: 'Our reception team will call you within 24 hours to confirm.', am: 'የእንግዳ ተቀባይ ቡድናችን በ24 ሰዓት ውስጥ ለማረጋገጥ ይደውሉልዎታል።' },
      'info.step3.title': { en: 'Visit Us', am: 'ይጎብኙን' },
      'info.step3.desc': { en: 'Come to Afilas General Hospital at your confirmed time.', am: 'በተረጋገጠው ጊዜ ወደ አፊላስ ጠቅላላ ሆስፒታል ይምጡ።' },

      // Form fields
      'field.fullName': { en: 'Full Name *', am: 'ሙሉ ስም *' },
      'field.fullName.placeholder': { en: 'Enter your full name', am: 'ሙሉ ስምዎን ያስገቡ' },
      'field.date': { en: 'Preferred Date *', am: 'የሚፈለግ ቀን *' },
      'field.time': { en: 'Preferred Time *', am: 'የሚፈለግ ሰዓት *' },
      'field.time.placeholder': { en: 'e.g. 09:30', am: 'ምሳሌ 09:30' },
      'field.email': { en: 'Email Address', am: 'ኢሜል አድራሻ' },
      'field.email.placeholder': { en: 'you@example.com (optional)', am: 'እርስዎ@ምሳሌ.ኮም (አማራጭ)' },
      'field.description': { en: 'Type of Appointment', am: 'የቀጠሮ ዓይነት' },
      'field.description.placeholder': { en: 'e.g. General Checkup, Dental, Eye Exam...', am: 'ምሳሌ፡ አጠቃላይ ምርመራ፣ የጥርስ፣ የዓይን ምርመራ...' },

      // Validation
      'err.fullName.required': { en: 'Full name is required', am: 'ሙሉ ስም ያስፈልጋል' },
      'err.date.required': { en: 'Appointment date is required', am: 'የቀጠሮ ቀን ያስፈልጋል' },
      'err.time.required': { en: 'Appointment time is required', am: 'የቀጠሮ ሰዓት ያስፈልጋል' },
      'err.email.invalid': { en: 'Please enter a valid email address', am: 'እባክዎ ትክክለኛ የኢሜይል አድራሻ ያስገቡ' },

      // Buttons
      'btn.submit': { en: 'Book Appointment', am: 'ቀጠሮ ያስይዙ' },
      'btn.submitting': { en: 'Booking...', am: 'በማስያዝ ላይ...' },
      'btn.bookAnother': { en: 'Book Another Appointment', am: 'ሌላ ቀጠሮ ያስይዙ' },

      // Success
      'success.title': { en: 'Appointment Booked Successfully!', am: 'ቀጠሮ በተሳካ ሁኔታ ተይዟል!' },
      'success.desc': { en: 'Thank you for choosing Afilas General Hospital. Our team will call you soon to confirm your appointment. Please keep your phone available.', am: 'አፊላስ ጠቅላላ ሆስፒታልን ስለመረጡ እናመሰግናለን። ቡድናችን ቀጠሮዎን ለማረጋገጥ በቅርቡ ይደውሉልዎታል። እባክዎ ስልክዎን ይዘው ይቆዩ።' },
      'success.note': { en: '📞 Expect a call within 24 hours', am: '📞 በ24 ሰዓት ውስጥ ጥሪ ይጠብቁ' },
    };
    return dict[key]?.[language as 'en' | 'am'] || key;
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = t('err.fullName.required');
    if (!formData.date) errs.date = t('err.date.required');
    if (!formData.time) errs.time = t('err.time.required');
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = t('err.email.invalid');
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  const resetForm = () => {
    setFormData({ fullName: '', date: '', time: '', period: 'AM', email: '', description: '' });
    setErrors({});
    setIsSuccess(false);
  };

  const inputBg = isDark ? '#0f172a' : '#f3f4f6';
  const inputColor = isDark ? '#f1f5f9' : '#1e293b';
  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const cardBorder = isDark ? '#334155' : '#e2e8f0';
  const mutedText = isDark ? '#94a3b8' : '#64748b';
  const primaryColor = isDark ? '#14b8a6' : '#0f6e5f';

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: isDark ? '#0f172a' : '#f8fafc' }}>
      {/* ===== HEADER BAR ===== */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 20, padding: '0.75rem 1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: isDark ? 'rgba(15,23,42,0.9)' : 'rgba(248,250,252,0.9)',
        backdropFilter: 'blur(12px)', borderBottom: `1px solid ${cardBorder}`,
      }}>
        <Link href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.4rem 1rem', borderRadius: '9999px',
          backgroundColor: isDark ? 'rgba(30,41,59,0.85)' : 'rgba(255,255,255,0.85)',
          border: `1px solid ${cardBorder}`, color: isDark ? '#e2e8f0' : '#475569',
          fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none',
        }}>
          <ArrowLeft style={{ width: 16, height: 16 }} />
          <span>{t('nav.backHome')}</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button onClick={() => setLanguage(language === 'en' ? 'am' : 'en')} style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.4rem 0.8rem', borderRadius: '9999px',
            backgroundColor: isDark ? 'rgba(30,41,59,0.85)' : 'rgba(255,255,255,0.85)',
            border: `1px solid ${cardBorder}`, color: isDark ? '#e2e8f0' : '#475569',
            fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
          }}>
            <Globe style={{ width: 14, height: 14, color: primaryColor }} />
            <span>{language === 'en' ? 'አማርኛ' : 'English'}</span>
          </button>
          <button onClick={toggleTheme} style={{
            padding: '0.5rem', borderRadius: '9999px',
            backgroundColor: isDark ? 'rgba(30,41,59,0.85)' : 'rgba(255,255,255,0.85)',
            border: `1px solid ${cardBorder}`, cursor: 'pointer', display: 'flex', alignItems: 'center',
            color: isDark ? '#fbbf24' : '#4f46e5',
          }}>
            {isDark ? <Sun style={{ width: 16, height: 16 }} /> : <Moon style={{ width: 16, height: 16 }} />}
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '2.5rem 1.25rem 4rem' }}>

        {/* ===== PAGE HEADER ===== */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <Image src="/Afilas-icon.png" alt="Afilas" width={56} height={56}
            style={{ margin: '0 auto 1rem', objectFit: 'contain', display: 'block' }} priority />
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: isDark ? '#f1f5f9' : '#0f172a', margin: '0 0 0.5rem' }}>
            {t('page.title')}
          </h1>
          <p style={{ fontSize: '0.9rem', color: mutedText, maxWidth: '36rem', margin: '0 auto', lineHeight: 1.6 }}>
            {t('page.subtitle')}
          </p>
        </div>

        {/* ===== HOW IT WORKS STEPS ===== */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem',
          marginBottom: '2.5rem',
        }}>
          {[
            { icon: <ClipboardList style={{ width: 28, height: 28, color: primaryColor }} />, titleKey: 'info.step1.title', descKey: 'info.step1.desc', num: '1' },
            { icon: <Phone style={{ width: 28, height: 28, color: primaryColor }} />, titleKey: 'info.step2.title', descKey: 'info.step2.desc', num: '2' },
            { icon: <Stethoscope style={{ width: 28, height: 28, color: primaryColor }} />, titleKey: 'info.step3.title', descKey: 'info.step3.desc', num: '3' },
          ].map((step) => (
            <div key={step.num} style={{
              backgroundColor: cardBg, border: `1px solid ${cardBorder}`,
              borderRadius: '1rem', padding: '1.5rem', textAlign: 'center',
              transition: 'box-shadow 0.2s, transform 0.2s',
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%', margin: '0 auto 0.75rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: isDark ? 'rgba(20,184,166,0.1)' : 'rgba(15,110,95,0.08)',
              }}>
                {step.icon}
              </div>
              <div style={{
                fontSize: '0.65rem', fontWeight: 700, color: primaryColor,
                letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.25rem',
              }}>
                Step {step.num}
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: isDark ? '#f1f5f9' : '#1e293b', marginBottom: '0.35rem' }}>
                {t(step.titleKey)}
              </h3>
              <p style={{ fontSize: '0.78rem', color: mutedText, lineHeight: 1.5, margin: 0 }}>
                {t(step.descKey)}
              </p>
            </div>
          ))}
        </div>

        {/* ===== FORM CARD ===== */}
        <div style={{
          maxWidth: '38rem', margin: '0 auto',
          backgroundColor: cardBg, border: `1px solid ${cardBorder}`,
          borderRadius: '1.25rem', padding: '2rem 1.75rem',
          boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.06)',
        }}>
          {isSuccess ? (
            /* ===== SUCCESS STATE ===== */
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <div style={{
                width: 72, height: 72, borderRadius: '50%', margin: '0 auto 1.25rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: isDark ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.1)',
              }}>
                <CheckCircle2 style={{ width: 40, height: 40, color: '#10b981' }} />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: isDark ? '#f1f5f9' : '#1e293b', marginBottom: '0.75rem' }}>
                {t('success.title')}
              </h2>
              <p style={{ fontSize: '0.85rem', color: mutedText, lineHeight: 1.6, maxWidth: '28rem', margin: '0 auto 1rem' }}>
                {t('success.desc')}
              </p>
              <div style={{
                display: 'inline-block', padding: '0.6rem 1.25rem', borderRadius: '0.75rem',
                backgroundColor: isDark ? 'rgba(20,184,166,0.12)' : 'rgba(15,110,95,0.08)',
                color: primaryColor, fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem',
              }}>
                {t('success.note')}
              </div>
              <br />
              <button onClick={resetForm} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.7rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer',
                background: `linear-gradient(135deg, #0f6e5f, #14b8a6)`,
                color: '#fff', fontSize: '0.85rem', fontWeight: 600,
                transition: 'box-shadow 0.2s',
              }}>
                <CalendarDays style={{ width: 16, height: 16 }} />
                {t('btn.bookAnother')}
              </button>
            </div>
          ) : (
            /* ===== FORM STATE ===== */
            <form onSubmit={handleSubmit} noValidate>
              {/* Full Name */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: isDark ? '#cbd5e1' : '#475569', marginBottom: '0.35rem' }}>
                  {t('field.fullName')}
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', top: '50%', left: '0.85rem', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }}>
                    <User style={{ width: 16, height: 16 }} />
                  </span>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => { setFormData({ ...formData, fullName: e.target.value }); if (errors.fullName) setErrors(p => ({ ...p, fullName: '' })); }}
                    placeholder={t('field.fullName.placeholder')}
                    style={{
                      width: '100%', padding: '0.7rem 0.75rem 0.7rem 2.75rem', fontSize: '0.85rem',
                      borderRadius: '0.5rem', border: `2px solid ${errors.fullName ? '#ef4444' : 'transparent'}`,
                      outline: 'none', backgroundColor: inputBg, color: inputColor,
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => { if (!errors.fullName) e.target.style.borderColor = primaryColor; }}
                    onBlur={(e) => { if (!errors.fullName) e.target.style.borderColor = 'transparent'; }}
                  />
                </div>
                {errors.fullName && <div style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.2rem', fontWeight: 500 }}>{errors.fullName}</div>}
              </div>

              {/* Date & Time Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                {/* Date */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: isDark ? '#cbd5e1' : '#475569', marginBottom: '0.35rem' }}>
                    {t('field.date')}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', top: '50%', left: '0.85rem', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }}>
                      <CalendarDays style={{ width: 16, height: 16 }} />
                    </span>
                    <input
                      type="date"
                      value={formData.date}
                      min={today}
                      onChange={(e) => { setFormData({ ...formData, date: e.target.value }); if (errors.date) setErrors(p => ({ ...p, date: '' })); }}
                      style={{
                        width: '100%', padding: '0.7rem 0.75rem 0.7rem 2.75rem', fontSize: '0.85rem',
                        borderRadius: '0.5rem', border: `2px solid ${errors.date ? '#ef4444' : 'transparent'}`,
                        outline: 'none', backgroundColor: inputBg, color: inputColor,
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => { if (!errors.date) e.target.style.borderColor = primaryColor; }}
                      onBlur={(e) => { if (!errors.date) e.target.style.borderColor = 'transparent'; }}
                    />
                  </div>
                  {errors.date && <div style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.2rem', fontWeight: 500 }}>{errors.date}</div>}
                </div>

                {/* Time (12hr) */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: isDark ? '#cbd5e1' : '#475569', marginBottom: '0.35rem' }}>
                    {t('field.time')}
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <span style={{ position: 'absolute', top: '50%', left: '0.85rem', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }}>
                        <Clock style={{ width: 16, height: 16 }} />
                      </span>
                      <input
                        type="text"
                        value={formData.time}
                        onChange={(e) => { setFormData({ ...formData, time: e.target.value }); if (errors.time) setErrors(p => ({ ...p, time: '' })); }}
                        placeholder={t('field.time.placeholder')}
                        style={{
                          width: '100%', padding: '0.7rem 0.75rem 0.7rem 2.75rem', fontSize: '0.85rem',
                          borderRadius: '0.5rem', border: `2px solid ${errors.time ? '#ef4444' : 'transparent'}`,
                          outline: 'none', backgroundColor: inputBg, color: inputColor,
                          transition: 'border-color 0.2s',
                        }}
                        onFocus={(e) => { if (!errors.time) e.target.style.borderColor = primaryColor; }}
                        onBlur={(e) => { if (!errors.time) e.target.style.borderColor = 'transparent'; }}
                      />
                    </div>
                    <select
                      value={formData.period}
                      onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                      style={{
                        padding: '0.7rem 0.5rem', fontSize: '0.85rem', borderRadius: '0.5rem',
                        border: 'none', outline: 'none', backgroundColor: inputBg, color: inputColor,
                        fontWeight: 600, cursor: 'pointer', minWidth: '4rem',
                      }}
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                  {errors.time && <div style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.2rem', fontWeight: 500 }}>{errors.time}</div>}
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: isDark ? '#cbd5e1' : '#475569', marginBottom: '0.35rem' }}>
                  {t('field.email')}
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', top: '50%', left: '0.85rem', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }}>
                    <Mail style={{ width: 16, height: 16 }} />
                  </span>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => { setFormData({ ...formData, email: e.target.value }); if (errors.email) setErrors(p => ({ ...p, email: '' })); }}
                    placeholder={t('field.email.placeholder')}
                    style={{
                      width: '100%', padding: '0.7rem 0.75rem 0.7rem 2.75rem', fontSize: '0.85rem',
                      borderRadius: '0.5rem', border: `2px solid ${errors.email ? '#ef4444' : 'transparent'}`,
                      outline: 'none', backgroundColor: inputBg, color: inputColor,
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => { if (!errors.email) e.target.style.borderColor = primaryColor; }}
                    onBlur={(e) => { if (!errors.email) e.target.style.borderColor = 'transparent'; }}
                  />
                </div>
                {errors.email && <div style={{ color: '#ef4444', fontSize: '0.7rem', marginTop: '0.2rem', fontWeight: 500 }}>{errors.email}</div>}
              </div>

              {/* Description / Type */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: isDark ? '#cbd5e1' : '#475569', marginBottom: '0.35rem' }}>
                  {t('field.description')}
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', top: '0.85rem', left: '0.85rem', color: '#9ca3af', pointerEvents: 'none' }}>
                    <FileText style={{ width: 16, height: 16 }} />
                  </span>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder={t('field.description.placeholder')}
                    rows={3}
                    style={{
                      width: '100%', padding: '0.7rem 0.75rem 0.7rem 2.75rem', fontSize: '0.85rem',
                      borderRadius: '0.5rem', border: '2px solid transparent',
                      outline: 'none', backgroundColor: inputBg, color: inputColor,
                      resize: 'vertical', fontFamily: 'inherit',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => { e.target.style.borderColor = primaryColor; }}
                    onBlur={(e) => { e.target.style.borderColor = 'transparent'; }}
                  />
                </div>
              </div>

              {/* Submit */}
              <button type="submit" disabled={isLoading} style={{
                width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: 'none',
                background: 'linear-gradient(135deg, #0f6e5f, #14b8a6)',
                color: '#fff', fontSize: '1rem', fontWeight: 600, cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '0.5rem', transition: 'all 0.3s',
              }}>
                {isLoading ? t('btn.submitting') : (<>{t('btn.submit')} <ArrowRight style={{ width: 16, height: 16 }} /></>)}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
