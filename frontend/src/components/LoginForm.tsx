// components/LoginForm.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export function LoginForm() {
  const router = useRouter();
  const { language } = useLanguage();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const role = localStorage.getItem('userRole') || 'USER';
      redirectBasedOnRole(role);
    }
  }, []);

  const t = (key: string) => {
    const map: Record<string, { en: string; am: string }> = {
      'title': { en: 'Welcome Back', am: 'እንኳን ደህና መጡ' },
      'subtitle': { en: 'Login to your account', am: 'ወደ መለያዎ ይግቡ' },
      'email': { en: 'Email', am: 'ኢሜል' },
      'emailPlaceholder': { en: 'you@example.com', am: 'እርስዎ@ምሳሌ.ኮም' },
      'password': { en: 'Password', am: 'የይለፍ ቃል' },
      'passwordPlaceholder': { en: 'Enter your password', am: 'የይለፍ ቃልዎን ያስገቡ' },
      'forgotPassword': { en: 'Forgot password?', am: 'የይለፍ ቃል ረሱ?' },
      'login': { en: 'Login', am: 'ግባ' },
      'loggingIn': { en: 'Logging in...', am: 'በመግባት ላይ...' },
      'noAccount': { en: "Don't have an account?", am: 'መለያ የለዎትም?' },
      'register': { en: 'Register', am: 'ይመዝገቡ' },
      'backHome': { en: 'Back to Home', am: 'ወደ መነሻ ተመለስ' },
      'errEmail': { en: 'Email is required', am: 'ኢሜል ያስፈልጋል' },
      'errEmailInvalid': { en: 'Valid email required', am: 'ትክክለኛ ኢሜል ያስፈልጋል' },
      'errPassword': { en: 'Password is required', am: 'የይለፍ ቃል ያስፈልጋል' },
      'errPasswordMin': { en: 'Password must be at least 6 characters', am: 'የይለፍ ቃል ቢያንስ 6 ቁምፊዎች መሆን አለበት' },
      'loginSuccess': { en: 'Login successful! 🎉', am: 'መግባት ተሳክቷል! 🎉' },
      'loginError': { en: 'Invalid email or password', am: 'የተሳሳተ ኢሜል ወይም የይለፍ ቃል' },
    };
    return map[key]?.[language as 'en' | 'am'] || key;
  };

  const isAm = language === 'am';

  // ============================================================
  // ✅ REDIRECT BASED ON ROLE
  // ============================================================
  const redirectBasedOnRole = (role: string) => {
    console.log(`🔄 Redirecting based on role: ${role}`);
    
    const normalizedRole = role.toUpperCase().trim();
    console.log(`➡️ Role: ${normalizedRole}`);
    
    // ✅ ADMIN → Admin Dashboard
    if (normalizedRole === 'ADMIN' || normalizedRole === 'SUPER_ADMIN') {
      console.log('🔑 Redirecting to admin dashboard...');
      setTimeout(() => {
        window.location.href = '/admin/dashboard';
      }, 500);
      return;
    }
    
    // ✅ USER → Home Page (generalsec)
    console.log('👤 Redirecting to home page...');
    setTimeout(() => {
      window.location.href = '/';
    }, 500);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.email.trim()) e.email = t('errEmail');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = t('errEmailInvalid');
    if (!formData.password) e.password = t('errPassword');
    else if (formData.password.length < 6) e.password = t('errPasswordMin');
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      console.log('📝 Login attempt:', { email: formData.email });

      const response: any = await api.post('/auth/login', {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      }, false);

      console.log('✅ Full login response:', JSON.stringify(response, null, 2));

      let token = null;
      let user = null;
      let role = 'USER';

      // Extract token and user from response
      if (response) {
        if (response.data) {
          token = response.data.token;
          user = response.data.user;
          if (user?.role) role = user.role;
        }
        if (!token && response.token) {
          token = response.token;
          user = response.user || response;
          if (user?.role) role = user.role;
        }
        if (!token && response.data?.data?.token) {
          token = response.data.data.token;
          user = response.data.data.user || response.data.data;
          if (user?.role) role = user.role;
        }
        if (!token && response.success && response.data) {
          token = response.data.token;
          user = response.data.user;
          if (user?.role) role = user.role;
        }
      }

      console.log('🔑 Extracted token:', token ? token.substring(0, 30) + '...' : 'NO TOKEN');
      console.log('👤 Extracted user:', user);
      console.log('🎭 User role:', role);

      if (token) {
        // ✅ Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user || { role: role }));
        localStorage.setItem('userRole', role);
        localStorage.setItem('isLoggedIn', 'true');
        
        // ✅ Session storage backup
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('userRole', role);
        sessionStorage.setItem('isLoggedIn', 'true');
        
        console.log('✅ Token stored successfully');
        console.log('✅ User role stored:', role);
        
        toast.success(t('loginSuccess'));
        
        // ✅ Redirect based on role
        redirectBasedOnRole(role);
        
      } else {
        console.error('❌ No token found in response');
        toast.error('Login failed: No token received from server');
        setErrors({ submit: 'No token received from server. Please try again.' });
      }
    } catch (error: any) {
      console.error('❌ Login error:', error);
      let errorMsg = t('loginError');
      if (error?.response?.status === 401) {
        errorMsg = 'Invalid email or password. Please try again.';
      } else if (error?.response?.status === 404) {
        errorMsg = 'User not found. Please check your email.';
      } else if (error?.message) {
        errorMsg = error.message;
      }
      toast.error(errorMsg);
      setErrors({ submit: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const inputClass = (field: string) => {
    const base = "w-full pl-8 pr-3 py-1.5 rounded-lg border-2 transition-all outline-none bg-white/80 text-sm";
    const err = errors[field] ? 'border-red-300 bg-red-50/50' : '';
    const focus = focusedField === field ? 'border-[#C5A059] shadow-sm shadow-[#C5A059]/20' : 'border-gray-200 hover:border-[#C5A059]/50';
    return `${base} ${err || focus}`;
  };

  return (
    <div className="w-full max-w-sm">
      <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
        {/* Back to Home Button */}
        <Link href="/" className="inline-flex items-center gap-1 text-gray-500 hover:text-[#C5A059] text-xs font-medium mb-2">
          <ArrowLeft className="w-3 h-3" />{t('backHome')}
        </Link>

        {/* Logo & Header */}
        <div className="text-center mb-3">
          <Image src="/logo-header-190x49-1.png" alt="Afilas" width={120} height={30} className="mx-auto mb-1" priority style={{ width: '120px', height: 'auto' }} />
          <h2 className={`text-base font-bold text-gray-800 ${isAm ? 'font-medium' : ''}`}>{t('title')}</h2>
          <p className={`text-[10px] text-gray-500 ${isAm ? 'font-medium' : ''}`}>{t('subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Email */}
          <div>
            <label className={`block text-[10px] font-semibold text-gray-700 mb-0.5 ${isAm ? 'font-medium' : ''}`}>{t('email')}</label>
            <div className="relative">
              <Mail className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className={inputClass('email')}
                placeholder={t('emailPlaceholder')}
                dir={isAm ? 'rtl' : 'ltr'}
              />
            </div>
            {errors.email && <p className={`mt-0.5 text-[9px] text-red-500 ${isAm ? 'font-medium' : ''}`}>{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className={`block text-[10px] font-semibold text-gray-700 mb-0.5 ${isAm ? 'font-medium' : ''}`}>{t('password')}</label>
            <div className="relative">
              <Lock className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                className={`${inputClass('password')} pr-7`}
                placeholder={t('passwordPlaceholder')}
                dir={isAm ? 'rtl' : 'ltr'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-3 h-3 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="w-3 h-3 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {errors.password && <p className={`mt-0.5 text-[9px] text-red-500 ${isAm ? 'font-medium' : ''}`}>{errors.password}</p>}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link href="/forgot-password" className={`text-[10px] text-[#C5A059] hover:text-[#B8963A] hover:underline ${isAm ? 'font-medium' : ''}`}>
              {t('forgotPassword')}
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-1.5 rounded-lg bg-gradient-to-r from-[#C5A059] to-[#B8963A] text-white font-semibold text-sm transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md hover:scale-[1.01]'} ${isAm ? 'font-medium' : ''}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('loggingIn')}
              </>
            ) : (
              <>
                {t('login')}
                <ArrowRight className="w-3.5 h-3.5 inline" />
              </>
            )}
          </button>

          {/* Register Link */}
          <p className={`text-center text-[10px] text-gray-600 ${isAm ? 'font-medium' : ''}`}>
            {t('noAccount')}{' '}
            <Link href="/register" className="text-[#C5A059] hover:text-[#B8963A] font-semibold hover:underline">
              {t('register')}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}