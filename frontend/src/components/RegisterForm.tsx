// components/RegisterForm.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff,
  CheckCircle,
  ArrowRight,
  Home,
  ArrowLeft
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function RegisterForm() {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Translation function for form labels
  const translate = (key: string) => {
    const translations: Record<string, { en: string; am: string }> = {
      'register.title': { en: 'Create Account', am: 'መለያ ይፍጠሩ' },
      'register.subtitle': { en: 'Join Afilas Hospital', am: 'አፊላስ ሆስፒታል ይቀላቀሉ' },
      'register.success': { en: 'Registration Successful! 🎉', am: 'ምዝገባ ተሳክቷል! 🎉' },
      'register.welcome': { en: 'Welcome to Afilas Hospital', am: 'እንኳን ወደ አፊላስ ሆስፒታል በደህና መጡ' },
      'register.continue': { en: 'Continue', am: 'ቀጥል' },
      'register.backHome': { en: 'Back to Home', am: 'ወደ መነሻ ተመለስ' },
      
      'field.fullName': { en: 'Full Name', am: 'ሙሉ ስም' },
      'field.fullName.placeholder': { en: 'Enter your full name', am: 'ሙሉ ስምዎን ያስገቡ' },
      'field.email': { en: 'Email Address', am: 'ኢሜል አድራሻ' },
      'field.email.placeholder': { en: 'you@example.com', am: 'እርስዎ@ምሳሌ.ኮም' },
      'field.phone': { en: 'Phone Number', am: 'ስልክ ቁጥር' },
      'field.phone.placeholder': { en: '+1 234 567 8900', am: '+1 234 567 8900' },
      'field.password': { en: 'Password', am: 'የይለፍ ቃል' },
      'field.password.placeholder': { en: 'Min 8 characters', am: 'ቢያንስ 8 ቁምፊዎች' },
      'field.confirmPassword': { en: 'Confirm Password', am: 'የይለፍ ቃል ያረጋግጡ' },
      'field.confirmPassword.placeholder': { en: 'Confirm your password', am: 'የይለፍ ቃልዎን ያረጋግጡ' },
      
      'error.fullName.required': { en: 'Full name is required', am: 'ሙሉ ስም ያስፈልጋል' },
      'error.fullName.min': { en: 'Name must be at least 2 characters', am: 'ስም ቢያንስ 2 ቁምፊዎች መሆን አለበት' },
      'error.email.required': { en: 'Email is required', am: 'ኢሜል ያስፈልጋል' },
      'error.email.invalid': { en: 'Please enter a valid email address', am: 'እባክዎ ትክክለኛ የኢሜል አድራሻ ያስገቡ' },
      'error.phone.required': { en: 'Phone number is required', am: 'ስልክ ቁጥር ያስፈልጋል' },
      'error.phone.invalid': { en: 'Please enter a valid phone number', am: 'እባክዎ ትክክለኛ የስልክ ቁጥር ያስገቡ' },
      'error.password.required': { en: 'Password is required', am: 'የይለፍ ቃል ያስፈልጋል' },
      'error.password.min': { en: 'Password must be at least 8 characters', am: 'የይለፍ ቃል ቢያንስ 8 ቁምፊዎች መሆን አለበት' },
      'error.password.match': { en: 'Passwords do not match', am: 'የይለፍ ቃሎች አይዛመዱም' },
      
      'button.create': { en: 'Create Account', am: 'መለያ ይፍጠሩ' },
      'button.creating': { en: 'Creating...', am: 'በመፍጠር ላይ...' },
      'button.signin': { en: 'Sign in', am: 'ግባ' },
      'button.already': { en: 'Already have an account?', am: 'መለያ አለዎት?' },
    };
    
    return translations[key]?.[language as keyof typeof translations[typeof key]] || key;
  };

  // Update validation to use translations
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = translate('error.fullName.required');
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = translate('error.fullName.min');
    }

    if (!formData.email.trim()) {
      newErrors.email = translate('error.email.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = translate('error.email.invalid');
    }

    if (!formData.phone.trim()) {
      newErrors.phone = translate('error.phone.required');
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone.trim())) {
      newErrors.phone = translate('error.phone.invalid');
    }

    if (!formData.password) {
      newErrors.password = translate('error.password.required');
    } else if (formData.password.length < 8) {
      newErrors.password = translate('error.password.min');
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = translate('error.password.match');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSuccess(true);
      setTimeout(() => {
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
        });
        setIsSuccess(false);
      }, 2500);
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const inputClasses = (fieldName: string) => {
    const base = "w-full pl-9 pr-3 py-2 rounded-lg border-2 transition-all duration-200 outline-none bg-white/80 text-sm";
    const error = errors[fieldName] ? 'border-red-300 bg-red-50/50' : '';
    const focus = focusedField === fieldName 
      ? 'border-[#C5A059] shadow-sm shadow-[#C5A059]/20' 
      : 'border-gray-200 hover:border-[#C5A059]/50';
    return `${base} ${error || focus}`;
  };

  // Check if current language is Amharic
  const isAmharic = language === 'am';

  if (isSuccess) {
    return (
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 text-center">
            <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-2" strokeWidth={1.5} />
            <h3 className={`text-lg font-bold text-green-700 ${isAmharic ? 'font-medium' : ''}`}>
              {translate('register.success')}
            </h3>
            <p className={`text-green-600 mt-1 text-xs ${isAmharic ? 'font-medium' : ''}`}>
              {translate('register.welcome')}
            </p>
            <div className="flex flex-col gap-2 mt-3">
              <button 
                onClick={() => setIsSuccess(false)}
                className="px-5 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs"
              >
                {translate('register.continue')}
              </button>
              <Link
                href="/"
                className="px-5 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs flex items-center justify-center gap-1.5"
              >
                <Home className="w-3.5 h-3.5" />
                {translate('register.backHome')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-100">
        {/* Back to Home Button */}
        <div className="flex justify-start mb-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-gray-500 hover:text-[#C5A059] transition-colors text-xs font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {translate('register.backHome')}
          </Link>
        </div>

        {/* Logo & Header - Minimized */}
        <div className="text-center mb-4">
          <div className="flex justify-center mb-2">
            <Image
              src="/logo-header-190x49-1.png"
              alt="Afilas General Hospital"
              width={140}
              height={36}
              className="h-auto w-auto"
              priority
              style={{ width: '140px', height: 'auto' }}
            />
          </div>
          <h2 className={`text-lg font-bold text-gray-800 ${isAmharic ? 'font-medium' : ''}`}>
            {translate('register.title')}
          </h2>
          <p className={`text-[11px] text-gray-500 ${isAmharic ? 'font-medium' : ''}`}>
            {translate('register.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Full Name */}
          <div>
            <label className={`block text-[11px] font-semibold text-gray-700 mb-0.5 ${isAmharic ? 'font-medium' : ''}`}>
              {translate('field.fullName')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <User className="h-3.5 w-3.5 text-gray-400" />
              </div>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                onFocus={() => setFocusedField('fullName')}
                onBlur={() => setFocusedField(null)}
                className={inputClasses('fullName')}
                placeholder={translate('field.fullName.placeholder')}
                dir={isAmharic ? 'rtl' : 'ltr'}
              />
            </div>
            {errors.fullName && (
              <p className={`mt-0.5 text-[10px] text-red-500 ${isAmharic ? 'font-medium' : ''}`}>
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className={`block text-[11px] font-semibold text-gray-700 mb-0.5 ${isAmharic ? 'font-medium' : ''}`}>
              {translate('field.email')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <Mail className="h-3.5 w-3.5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className={inputClasses('email')}
                placeholder={translate('field.email.placeholder')}
                dir={isAmharic ? 'rtl' : 'ltr'}
              />
            </div>
            {errors.email && (
              <p className={`mt-0.5 text-[10px] text-red-500 ${isAmharic ? 'font-medium' : ''}`}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className={`block text-[11px] font-semibold text-gray-700 mb-0.5 ${isAmharic ? 'font-medium' : ''}`}>
              {translate('field.phone')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <Phone className="h-3.5 w-3.5 text-gray-400" />
              </div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
                className={inputClasses('phone')}
                placeholder={translate('field.phone.placeholder')}
                dir={isAmharic ? 'rtl' : 'ltr'}
              />
            </div>
            {errors.phone && (
              <p className={`mt-0.5 text-[10px] text-red-500 ${isAmharic ? 'font-medium' : ''}`}>
                {errors.phone}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className={`block text-[11px] font-semibold text-gray-700 mb-0.5 ${isAmharic ? 'font-medium' : ''}`}>
              {translate('field.password')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <Lock className="h-3.5 w-3.5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                className={`${inputClasses('password')} pr-8`}
                placeholder={translate('field.password.placeholder')}
                dir={isAmharic ? 'rtl' : 'ltr'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className={`mt-0.5 text-[10px] text-red-500 ${isAmharic ? 'font-medium' : ''}`}>
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className={`block text-[11px] font-semibold text-gray-700 mb-0.5 ${isAmharic ? 'font-medium' : ''}`}>
              {translate('field.confirmPassword')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                <Lock className="h-3.5 w-3.5 text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField(null)}
                className={`${inputClasses('confirmPassword')} pr-8`}
                placeholder={translate('field.confirmPassword.placeholder')}
                dir={isAmharic ? 'rtl' : 'ltr'}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className={`mt-0.5 text-[10px] text-red-500 ${isAmharic ? 'font-medium' : ''}`}>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button - Minimized */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-lg bg-gradient-to-r from-[#C5A059] to-[#B8963A] text-white font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-1.5 ${
              isLoading 
                ? 'opacity-70 cursor-not-allowed' 
                : 'hover:shadow-md hover:scale-[1.01] active:scale-[0.98]'
            } ${isAmharic ? 'font-medium' : ''}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {translate('button.creating')}
              </>
            ) : (
              <>
                {translate('button.create')}
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>

          {/* Login Link - Minimized */}
          <p className={`text-center text-[11px] text-gray-600 mt-2 ${isAmharic ? 'font-medium' : ''}`}>
            {translate('button.already')}{' '}
            <Link href="/login" className="text-[#C5A059] hover:text-[#B8963A] font-semibold hover:underline transition-colors">
              {translate('button.signin')}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}