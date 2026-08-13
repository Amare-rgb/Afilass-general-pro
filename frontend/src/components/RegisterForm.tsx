// components/RegisterForm.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, Eye, EyeOff, CheckCircle, ArrowRight, Home, ArrowLeft, Building2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const LOCATIONS = [
  { value: 'Afilas General Hospital', labelEn: 'Afilas General Hospital', labelAm: '🏥 አፊላስ አጠቃላይ ሆስፒታል' },
  { value: 'Afilas Diagnosis Center', labelEn: 'Afilas Diagnosis Center', labelAm: '🔬 አፊላስ የምርመራ ማዕከል' },
  { value: 'Afilas Drug Manufacturing', labelEn: 'Afilas Drug Manufacturing', labelAm: '💊 አፊላስ የመድኃኒት ማምረቻ' },
];

export function RegisterForm() {
  const router = useRouter();
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '', 
    email: '',
    phone: '',
    location: '', 
    password: '',
    confirmPassword: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const t = (key: string) => {
    const map: Record<string, { en: string; am: string }> = {
      'title': { en: 'Create Account', am: 'መለያ ይፍጠሩ' },
      'subtitle': { en: 'Join Afilas Hospital', am: 'አፊላስ ሆስፒታል ይቀላቀሉ' },
      'success': { en: 'Registration Successful! 🎉', am: 'ምዝገባ ተሳክቷል! 🎉' },
      'welcome': { en: 'Welcome to Afilas Hospital', am: 'እንኳን ወደ አፊላስ ሆስፒታል በደህና መጡ' },
      'continue': { en: 'Continue', am: 'ቀጥል' },
      'backHome': { en: 'Back to Home', am: 'ወደ መነሻ ተመለስ' },
      'fullName': { en: 'Full Name', am: 'ሙሉ ስም' },
      'fullNamePlaceholder': { en: 'Enter full name', am: 'ሙሉ ስም ያስገቡ' },
      'email': { en: 'Email', am: 'ኢሜል' },
      'emailPlaceholder': { en: 'you@example.com', am: 'እርስዎ@ምሳሌ.ኮም' },
      'phone': { en: 'Phone', am: 'ስልክ' },
      'phonePlaceholder': { en: '+251 9XX XXX XXX', am: '+251 9XX XXX XXX' },
      'location': { en: 'Location', am: 'ቦታ' },
      'locationPlaceholder': { en: 'Select location', am: 'ቦታ ይምረጡ' },
      'password': { en: 'Password', am: 'የይለፍ ቃል' },
      'passwordPlaceholder': { en: 'Min 6 characters', am: 'ቢያንስ 6 ቁምፊ' },
      'confirmPassword': { en: 'Confirm Password', am: 'የይለፍ ቃል ያረጋግጡ' },
      'confirmPlaceholder': { en: 'Confirm password', am: 'የይለፍ ቃል ያረጋግጡ' },
      'errName': { en: 'Full name required', am: 'ሙሉ ስም ያስፈልጋል' },
      'errNameMin': { en: 'Min 2 characters', am: 'ቢያንስ 2 ቁምፊ' },
      'errEmail': { en: 'Email required', am: 'ኢሜል ያስፈልጋል' },
      'errEmailInvalid': { en: 'Valid email required', am: 'ትክክለኛ ኢሜል ያስፈልጋል' },
      'errPhone': { en: 'Phone required', am: 'ስልክ ያስፈልጋል' },
      'errPhoneInvalid': { en: 'Valid phone required', am: 'ትክክለኛ ስልክ ያስፈልጋል' },
      'errLocation': { en: 'Select location', am: 'ቦታ ይምረጡ' },
      'errPassword': { en: 'Password required', am: 'የይለፍ ቃል ያስፈልጋል' },
      'errPasswordMin': { en: 'Min 6 characters', am: 'ቢያንስ 6 ቁምፊ' },
      'errMatch': { en: 'Passwords do not match', am: 'የይለፍ ቃሎች አይዛመዱም' },
      'create': { en: 'Create Account', am: 'መለያ ይፍጠሩ' },
      'creating': { en: 'Creating...', am: 'በመፍጠር...' },
      'signin': { en: 'Sign in', am: 'ግባ' },
      'already': { en: 'Already have an account?', am: 'መለያ አለዎት?' },
    };
    return map[key]?.[language as 'en' | 'am'] || key;
  };

  const getLabel = (loc: typeof LOCATIONS[0]) => language === 'am' ? loc.labelAm : loc.labelEn;
  const isAm = language === 'am';

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = t('errName');
    else if (formData.name.trim().length < 2) e.name = t('errNameMin');
    if (!formData.email.trim()) e.email = t('errEmail');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = t('errEmailInvalid');
    if (!formData.phone.trim()) e.phone = t('errPhone');
    else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone.trim())) e.phone = t('errPhoneInvalid');
    if (!formData.location) e.location = t('errLocation');
    if (!formData.password) e.password = t('errPassword');
    else if (formData.password.length < 6) e.password = t('errPasswordMin');
    if (formData.password !== formData.confirmPassword) e.confirmPassword = t('errMatch');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      // ✅ Send data with correct field names matching backend
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        location: formData.location,
        password: formData.password,
        role: 'USER',
        isActive: true
      };

      console.log('📝 Registration payload:', payload);

      const response = await api.post('/users', payload, false);

      console.log('✅ Registration response:', response);

      toast.success('Registration successful! 🎉');
      setIsSuccess(true);
      
      setTimeout(() => {
        setFormData({ name: '', email: '', phone: '', location: '', password: '', confirmPassword: '' });
        setIsSuccess(false);
        router.push('/login');
      }, 3000);
    } catch (error: any) {
      console.error('❌ Registration failed:', error);
      const errorMsg = error.message || error.error || 'Registration failed. Please try again.';
      toast.error(errorMsg);
      setErrors({ submit: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  const change = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const inpClass = (field: string) => {
    const base = "w-full pl-8 pr-3 py-1.5 rounded-lg border-2 transition-all outline-none bg-white/80 text-sm";
    const err = errors[field] ? 'border-red-300 bg-red-50/50' : '';
    const focus = focusedField === field ? 'border-[#C5A059] shadow-sm shadow-[#C5A059]/20' : 'border-gray-200 hover:border-[#C5A059]/50';
    return `${base} ${err || focus}`;
  };

  const selClass = (field: string) => {
    const base = "w-full pl-8 pr-8 py-1.5 rounded-lg border-2 transition-all outline-none bg-white/80 text-sm appearance-none";
    const err = errors[field] ? 'border-red-300 bg-red-50/50' : '';
    const focus = focusedField === field ? 'border-[#C5A059] shadow-sm shadow-[#C5A059]/20' : 'border-gray-200 hover:border-[#C5A059]/50';
    return `${base} ${err || focus}`;
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-1.5" strokeWidth={1.5} />
            <h3 className={`text-base font-bold text-green-700 ${isAm ? 'font-medium' : ''}`}>{t('success')}</h3>
            <p className={`text-green-600 mt-0.5 text-xs ${isAm ? 'font-medium' : ''}`}>{t('welcome')}</p>
            <div className="flex flex-col gap-1.5 mt-2.5">
              <button onClick={() => router.push('/login')} className="px-4 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs">{t('continue')}</button>
              <Link href="/" className="px-4 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-xs flex items-center justify-center gap-1"><Home className="w-3 h-3" />{t('backHome')}</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
        <Link href="/" className="inline-flex items-center gap-1 text-gray-500 hover:text-[#C5A059] text-xs font-medium mb-2">
          <ArrowLeft className="w-3 h-3" />{t('backHome')}
          </Link>

        <div className="text-center mb-3">
          <Image src="/logo-header-190x49-1.png" alt="Afilas" width={120} height={30} className="mx-auto mb-1" priority style={{ width: '120px', height: 'auto' }} />
          <h2 className={`text-base font-bold text-gray-800 ${isAm ? 'font-medium' : ''}`}>{t('title')}</h2>
          <p className={`text-[10px] text-gray-500 ${isAm ? 'font-medium' : ''}`}>{t('subtitle')}</p>
        </div>

        <form onSubmit={submit} className="space-y-2">
          {/* Full Name */}
          <div>
            <label className={`block text-[10px] font-semibold text-gray-700 mb-0.5 ${isAm ? 'font-medium' : ''}`}>{t('fullName')}</label>
            <div className="relative">
              <User className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
              <input type="text" name="name" value={formData.name} onChange={change} onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)} className={inpClass('name')} placeholder={t('fullNamePlaceholder')} dir={isAm ? 'rtl' : 'ltr'} />
            </div>
            {errors.name && <p className={`mt-0.5 text-[9px] text-red-500 ${isAm ? 'font-medium' : ''}`}>{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className={`block text-[10px] font-semibold text-gray-700 mb-0.5 ${isAm ? 'font-medium' : ''}`}>{t('email')}</label>
            <div className="relative">
              <Mail className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
              <input type="email" name="email" value={formData.email} onChange={change} onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)} className={inpClass('email')} placeholder={t('emailPlaceholder')} dir={isAm ? 'rtl' : 'ltr'} />
            </div>
            {errors.email && <p className={`mt-0.5 text-[9px] text-red-500 ${isAm ? 'font-medium' : ''}`}>{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className={`block text-[10px] font-semibold text-gray-700 mb-0.5 ${isAm ? 'font-medium' : ''}`}>{t('phone')}</label>
            <div className="relative">
              <Phone className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
              <input type="tel" name="phone" value={formData.phone} onChange={change} onFocus={() => setFocusedField('phone')} onBlur={() => setFocusedField(null)} className={inpClass('phone')} placeholder={t('phonePlaceholder')} dir={isAm ? 'rtl' : 'ltr'} />
            </div>
            {errors.phone && <p className={`mt-0.5 text-[9px] text-red-500 ${isAm ? 'font-medium' : ''}`}>{errors.phone}</p>}
          </div>

          {/* Location Dropdown */}
          <div>
            <label className={`block text-[10px] font-semibold text-gray-700 mb-0.5 ${isAm ? 'font-medium' : ''}`}>{t('location')}</label>
            <div className="relative">
              <Building2 className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
              <select name="location" value={formData.location} onChange={change} onFocus={() => setFocusedField('location')} onBlur={() => setFocusedField(null)} className={selClass('location')} dir={isAm ? 'rtl' : 'ltr'}>
                <option value="">{t('locationPlaceholder')}</option>
                {LOCATIONS.map((loc) => <option key={loc.value} value={loc.value}>{getLabel(loc)}</option>)}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
            {errors.location && <p className={`mt-0.5 text-[9px] text-red-500 ${isAm ? 'font-medium' : ''}`}>{errors.location}</p>}
          </div>

          {/* Password */}
          <div>
            <label className={`block text-[10px] font-semibold text-gray-700 mb-0.5 ${isAm ? 'font-medium' : ''}`}>{t('password')}</label>
            <div className="relative">
              <Lock className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
              <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={change} onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)} className={`${inpClass('password')} pr-7`} placeholder={t('passwordPlaceholder')} dir={isAm ? 'rtl' : 'ltr'} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2">{showPassword ? <EyeOff className="w-3 h-3 text-gray-400 hover:text-gray-600" /> : <Eye className="w-3 h-3 text-gray-400 hover:text-gray-600" />}</button>
            </div>
            {errors.password && <p className={`mt-0.5 text-[9px] text-red-500 ${isAm ? 'font-medium' : ''}`}>{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className={`block text-[10px] font-semibold text-gray-700 mb-0.5 ${isAm ? 'font-medium' : ''}`}>{t('confirmPassword')}</label>
            <div className="relative">
              <Lock className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
              <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={change} onFocus={() => setFocusedField('confirmPassword')} onBlur={() => setFocusedField(null)} className={`${inpClass('confirmPassword')} pr-7`} placeholder={t('confirmPlaceholder')} dir={isAm ? 'rtl' : 'ltr'} />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2 top-1/2 -translate-y-1/2">{showConfirmPassword ? <EyeOff className="w-3 h-3 text-gray-400 hover:text-gray-600" /> : <Eye className="w-3 h-3 text-gray-400 hover:text-gray-600" />}</button>
            </div>
            {errors.confirmPassword && <p className={`mt-0.5 text-[9px] text-red-500 ${isAm ? 'font-medium' : ''}`}>{errors.confirmPassword}</p>}
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={isLoading} className={`w-full py-1.5 rounded-lg bg-gradient-to-r from-[#C5A059] to-[#B8963A] text-white font-semibold text-sm transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md hover:scale-[1.01]'} ${isAm ? 'font-medium' : ''}`}>
            {isLoading ? <><svg className="animate-spin h-3.5 w-3.5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> {t('creating')}</> : <>{t('create')} <ArrowRight className="w-3.5 h-3.5 inline" /></>}
          </button>

          {/* Login Link */}
          <p className={`text-center text-[10px] text-gray-600 ${isAm ? 'font-medium' : ''}`}>
            {t('already')} <Link href="/login" className="text-[#C5A059] hover:text-[#B8963A] font-semibold hover:underline">{t('signin')}</Link>
          </p>
        </form>
      </div>
    </div>
  );
}