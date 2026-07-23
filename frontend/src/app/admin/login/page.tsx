// app/admin/login/page.tsx
'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '@/lib/api';
import { saveSession } from '@/lib/auth';
import { Admin } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

// ===== Define the expected response types =====
interface LoginResponse {
  token: string;
  user: Admin;
}

interface ApiResponseWrapper {
  success: boolean;
  data: LoginResponse;
}

export default function AdminLoginPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState('admin@afilashospital.com');
  const [password, setPassword] = useState('Admin@123456');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Check if backend is reachable
  useEffect(() => {
    async function checkBackend() {
      try {
        const response = await fetch('http://localhost:5000/health', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (response.ok) {
          setBackendStatus('online');
          console.log('✅ Backend is online');
        } else {
          setBackendStatus('offline');
          console.warn('⚠️ Backend is offline');
        }
      } catch (error) {
        setBackendStatus('offline');
        console.error('❌ Backend connection failed:', error);
      }
    }
    checkBackend();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (backendStatus === 'offline') {
      setError(t('admin.login.error_backend_offline'));
      setLoading(false);
      return;
    }

    try {
      console.log('🔐 Attempting login with:', { email });
      
      const response = await api.post<LoginResponse>('/auth/login', { 
        email, 
        password 
      });
      
      console.log('✅ Login response:', response);
      
      let token: string | undefined;
      let user: Admin | undefined;
      
      if (response && typeof response === 'object') {
        if ('token' in response && 'user' in response) {
          token = (response as { token: string; user: Admin }).token;
          user = (response as { token: string; user: Admin }).user;
        }
        else if ('success' in response && 'data' in response) {
          const wrapped = response as ApiResponseWrapper;
          if (wrapped.success && wrapped.data) {
            token = wrapped.data.token;
            user = wrapped.data.user;
          }
        }
        else if ('data' in response) {
          const data = (response as { data: LoginResponse }).data;
          if (data) {
            token = data.token;
            user = data.user;
          }
        }
      }
      
      if (token && user) {
        console.log('✅ Login successful, saving session...');
        saveSession(token, user);
        console.log('✅ Session saved, redirecting to dashboard...');
        router.replace('/admin/dashboard');
      } else {
        console.error('❌ Invalid response structure:', response);
        setError(t('admin.login.error_invalid_response'));
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      
      if (err instanceof ApiError) {
        if (err.status === 0) {
          setError(t('admin.login.error_connection'));
        } else if (err.status === 401) {
          setError(t('admin.login.error_invalid_credentials'));
        } else if (err.status === 404) {
          setError(t('admin.login.error_endpoint_not_found'));
        } else {
          setError(err.message || t('admin.login.error_general'));
        }
      } else {
        setError(t('admin.login.error_general'));
      }
    } finally {
      setLoading(false);
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-[#f7f5f0]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl text-clinical-800">Afilas Hospital</h1>
          <p className="text-sm text-clinical-600 mt-2">{t('admin.login.admin_dashboard')}</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full bg-white border border-clinical-200 rounded-lg shadow-lg p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-clay-600 font-semibold mb-2">{t('admin.login.staff_access')}</p>
          <h2 className="font-display text-2xl text-clinical-900 mb-6">{t('admin.login.sign_in')}</h2>

          {backendStatus === 'checking' && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-600">{t('admin.login.checking_backend')}</p>
            </div>
          )}
          
          {backendStatus === 'offline' && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">
                {t('admin.login.backend_offline')}
                <br />
                <code className="text-xs bg-red-100 px-2 py-1 rounded mt-1 inline-block">
                  cd backend && npm run dev
                </code>
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-clinical-800 mb-1.5" htmlFor="email">
                {t('admin.login.email_address')}
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="admin@afilashospital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus-ring w-full rounded-lg border border-clinical-300 px-4 py-2.5 focus:border-clinical-500 transition-colors"
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-clinical-800 mb-1.5" htmlFor="password">
                {t('admin.login.password')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder={t('admin.login.password_placeholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus-ring w-full rounded-lg border border-clinical-300 px-4 py-2.5 pr-12 focus:border-clinical-500 transition-colors"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-clinical-700 transition-colors focus:outline-none"
                  tabIndex={-1}
                  aria-label={showPassword ? t('admin.login.hide_password') : t('admin.login.show_password')}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || backendStatus === 'offline' || backendStatus === 'checking'}
            className="focus-ring w-full mt-6 rounded-lg bg-clinical-700 hover:bg-clinical-800 disabled:opacity-60 text-white font-semibold px-6 py-3 transition-colors duration-200"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('admin.login.signing_in')}
              </span>
            ) : (
              t('admin.login.sign_in')
            )}
          </button>

          {/* Back to Home Button */}
          <div className="mt-6 pt-6 border-t border-clinical-200">
            <Link 
              href="/"
              className="flex items-center justify-center gap-2 w-full text-clinical-600 hover:text-clinical-800 transition-colors duration-200 text-sm font-medium"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('button.back_to_home')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}