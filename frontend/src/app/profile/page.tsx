'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  ArrowLeft,
  Save,
  Edit2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageProvider';

export default function ProfilePage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setFormData({
          name: parsedUser.name || '',
          email: parsedUser.email || '',
          phone: parsedUser.phone || '',
          address: parsedUser.address || '',
          role: parsedUser.role || 'User'
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    setLoading(false);
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local storage
      const updatedUser = {
        ...user,
        name: formData.name,
        phone: formData.phone,
        address: formData.address
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setSuccessMessage(language === 'am' ? 'መገለጫ ተሳክቷል!' : 'Profile updated successfully!');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setErrorMessage(language === 'am' ? 'ስህተት ተከስቷል' : 'An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    const roleMap: Record<string, string> = {
      'SUPER_ADMIN': 'bg-purple-100 text-purple-700',
      'ADMIN': 'bg-blue-100 text-blue-700',
      'DOCTOR': 'bg-green-100 text-green-700',
      'USER': 'bg-gray-100 text-gray-700',
    };
    return roleMap[role?.toUpperCase()] || roleMap['USER'];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-3 text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-4 px-4 sm:py-6 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-teal-600 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{language === 'am' ? 'ተመለስ' : 'Back'}</span>
        </Link>

        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Header - White */}
          <div className="bg-white px-5 py-4 sm:px-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-teal-50 flex items-center justify-center">
                  <User className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h1 className="text-base font-semibold text-gray-800">
                    {formData.name || 'User'}
                  </h1>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(formData.role)}`}>
                      {formData.role || 'User'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formData.email}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 rounded-lg text-teal-700 transition-colors text-sm font-medium"
              >
                {isEditing ? (
                  <>
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>{language === 'am' ? 'ተመልከት' : 'View'}</span>
                  </>
                ) : (
                  <>
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>{language === 'am' ? 'አርትዕ' : 'Edit'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Body - Minimized */}
          <div className="p-4 sm:p-5">
            {/* Success/Error Messages */}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{successMessage}</span>
              </div>
            )}
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{errorMessage}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {language === 'am' ? 'ሙሉ ስም' : 'Full Name'}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                      placeholder={language === 'am' ? 'ሙሉ ስምዎን ያስገቡ' : 'Enter your full name'}
                    />
                  ) : (
                    <div className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 rounded-lg text-gray-700">
                      {formData.name || '—'}
                    </div>
                  )}
                </div>
              </div>

              {/* Email - Read Only */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {language === 'am' ? 'ኢሜል' : 'Email'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <div className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 rounded-lg text-gray-700">
                    {formData.email || '—'}
                  </div>
                </div>
                <p className="mt-0.5 text-[10px] text-gray-400">
                  {language === 'am' ? 'ኢሜል ሊቀየር አይችልም' : 'Email cannot be changed'}
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {language === 'am' ? 'ስልክ ቁጥር' : 'Phone Number'}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
                      placeholder={language === 'am' ? 'ስልክ ቁጥርዎን ያስገቡ' : 'Enter your phone number'}
                    />
                  ) : (
                    <div className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 rounded-lg text-gray-700">
                      {formData.phone || '—'}
                    </div>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {language === 'am' ? 'አድራሻ' : 'Address'}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={2}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors resize-none"
                      placeholder={language === 'am' ? 'አድራሻዎን ያስገቡ' : 'Enter your address'}
                    />
                  ) : (
                    <div className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 rounded-lg text-gray-700 min-h-[42px]">
                      {formData.address || '—'}
                    </div>
                  )}
                </div>
              </div>

              {/* Role - Read Only */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {language === 'am' ? 'ሚና' : 'Role'}
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <div className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 rounded-lg flex items-center justify-between">
                    <span className="text-gray-700">{formData.role || 'User'}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(formData.role)}`}>
                      {formData.role || 'User'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              {isEditing && (
                <div className="pt-3 border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>{language === 'am' ? 'በማስቀመጥ ላይ...' : 'Saving...'}</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>{language === 'am' ? 'አስቀምጥ' : 'Save Changes'}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}