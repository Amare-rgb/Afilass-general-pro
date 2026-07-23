// components/SiteHeader.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { api } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext'; // Import the hook

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/departments', label: 'Departments' },
  { href: '/doctors', label: 'Doctors' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/news', label: 'News' },
  { href: '/contact', label: 'Contact' },
];

// Navigation labels for both languages
const NAV_LABELS: Record<string, { en: string; am: string }> = {
  'Home': { en: 'Home', am: 'መነሻ' },
  'About': { en: 'About', am: 'ስለ እኛ' },
  'Departments': { en: 'Departments', am: 'ክፍሎች' },
  'Doctors': { en: 'Doctors', am: 'ዶክተሮች' },
  'Gallery': { en: 'Gallery', am: 'ምስሎች' },
  'News': { en: 'News', am: 'ዜና' },
  'Contact': { en: 'Contact', am: 'አግኙን' },
};

// Top bar information items for horizontal scroll
const TOP_BAR_ITEMS_EN = [
  'topbar.location',
  'topbar.phone',
  'topbar.hours',
  'topbar.hospital',
  'topbar.multispecialty',
  'topbar.facilities',
  'topbar.doctors',
  'topbar.care',
];

const TOP_BAR_ITEMS_AM = [
  'topbar.location',
  'topbar.phone',
  'topbar.hours',
  'topbar.hospital',
  'topbar.multispecialty',
  'topbar.facilities',
  'topbar.doctors',
  'topbar.care',
];

// Types for API responses
interface Department {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

interface Doctor {
  id: string;
  name: string;
  title: string;
  slug: string;
  specialty?: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
}

// Static gallery categories
const GALLERY_CATEGORIES = [
  { id: '1', name: 'All Images', slug: 'all' },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { language, toggleLanguage, t } = useLanguage(); // Use the context
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [hoverDropdown, setHoverDropdown] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  
  // State for dynamic data
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fallback data in case API fails
  const FALLBACK_DEPARTMENTS: Department[] = [
    { id: '1', name: 'Anesthesia', slug: 'anesthesia' },
    { id: '2', name: 'Dermatology and Venereal Disease', slug: 'dermatology-and-venereal-disease' },
    { id: '3', name: 'Ear, Nose and Throat (ENT)', slug: 'ent' },
    { id: '4', name: 'Internal Medicine', slug: 'internal-medicine' },
  ];

  const FALLBACK_DOCTORS: Doctor[] = [
    { id: '1', name: 'Dr. Birhanu Yirga', title: 'General Surgeon', slug: 'dr-birhanu-yirga' },
    { id: '2', name: 'Dr. Fisha Gebeyehu', title: 'Neurosurgeon', slug: 'dr-fisha-gebeyehu' },
  ];

  // Fetch dynamic data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const deptResponse = await api.get<any>('/departments');
        let departmentsArray: Department[] = [];
        if (deptResponse) {
          if (deptResponse.data && Array.isArray(deptResponse.data)) {
            departmentsArray = deptResponse.data;
          } else if (Array.isArray(deptResponse)) {
            departmentsArray = deptResponse;
          }
        }
        setDepartments(departmentsArray.length > 0 ? departmentsArray : FALLBACK_DEPARTMENTS);

        const docResponse = await api.get<any>('/doctors');
        let doctorsArray: Doctor[] = [];
        if (docResponse) {
          if (docResponse.data && Array.isArray(docResponse.data)) {
            doctorsArray = docResponse.data;
          } else if (Array.isArray(docResponse)) {
            doctorsArray = docResponse;
          }
        }
        setDoctors(doctorsArray.length > 0 ? doctorsArray : FALLBACK_DOCTORS);
      } catch (err) {
        console.error('Error fetching data:', err);
        setDepartments(FALLBACK_DEPARTMENTS);
        setDoctors(FALLBACK_DOCTORS);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Detect system theme
  useEffect(() => {
    const checkTheme = () => {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      const isDarkMode = theme === 'system' ? systemTheme === 'dark' : theme === 'dark';
      setIsDark(isDarkMode);
      document.documentElement.classList.toggle('dark', isDarkMode);
    };
    checkTheme();
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkTheme);
    return () => mediaQuery.removeEventListener('change', checkTheme);
  }, [theme]);

  // About dropdown items with translations
  const aboutItems = [
    { key: 'about.what', href: '/about#what-is-afilas' },
    { key: 'about.vision', href: '/about#vision-mission' },
    { key: 'about.values', href: '/about#core-values' },
    { key: 'about.board', href: '/about#board-of-directors' },
    { key: 'about.specialists', href: '/doctors' },
  ];

  // Theme options
  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
  ];

  const getThemeLabel = () => {
    const option = themeOptions.find(t => t.value === theme);
    return option ? option.label : 'System';
  };

  const handleThemeChange = (value: 'light' | 'dark' | 'system') => {
    setTheme(value);
    setHoverDropdown(null);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setHoverDropdown(null);
    }, 300);
  };

  // Get translated top bar items
  const topBarItems = TOP_BAR_ITEMS_EN.map(key => t(key));

  const getNavLabel = (label: string) => {
    return NAV_LABELS[label]?.[language as keyof typeof NAV_LABELS[typeof label]] || label;
  };

  // Sort departments alphabetically
  const sortedDepartments = [...departments].sort((a, b) => a.name.localeCompare(b.name));
  const sortedDoctors = [...doctors].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <header className="sticky top-0 z-40">
      {/* Top Bar */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#C5A059] text-white py-2 border-b border-[#B8963A]/30">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(255,215,0,0.2)_0%,_transparent_50%)] animate-pulse-slow"></div>
          </div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-5">
          <div className="overflow-hidden">
            <div className="flex gap-6 w-max animate-scroll-topbar">
              {topBarItems.map((item, index) => (
                <div key={index} className="flex items-center whitespace-nowrap group">
                  <span className="text-xs md:text-sm text-white/90 group-hover:text-white transition-colors duration-300">
                    {item}
                  </span>
                  {index < topBarItems.length - 1 && (
                    <span className="w-px h-3 bg-white/20 mx-3"></span>
                  )}
                </div>
              ))}
              {topBarItems.map((item, index) => (
                <div key={`duplicate-${index}`} className="flex items-center whitespace-nowrap group">
                  <span className="text-xs md:text-sm text-white/90 group-hover:text-white transition-colors duration-300">
                    {item}
                  </span>
                  {index < topBarItems.length - 1 && (
                    <span className="w-px h-3 bg-white/20 mx-3"></span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white/95 dark:bg-gray-900 backdrop-blur border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center focus-ring rounded-sm flex-shrink-0">
              <Image
                src="/logo-header-190x49-1.png"
                alt="Afilas General Hospital"
                width={190}
                height={49}
                className="h-auto w-auto"
                priority
                style={{ width: '190px', height: 'auto' }}
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-5">
              {NAV.map((item) => {
                const active = pathname === item.href;
                const label = getNavLabel(item.label);
                
                // About dropdown
                if (item.label === 'About') {
                  return (
                    <div 
                      key={item.href} 
                      className="relative"
                      onMouseEnter={() => setHoverDropdown('about')}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Link
                        href="/about"
                        className={`focus-ring rounded-sm text-sm tracking-wide transition-colors relative flex items-center gap-1 py-2 ${
                          active || pathname?.startsWith('/about') ? 'text-[#8B6B3A] font-semibold' : `${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700/80 hover:text-[#8B6B3A]'}`
                        }`}
                      >
                        {label}
                        <svg className={`w-3 h-3 transition-transform duration-200 ${hoverDropdown === 'about' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </Link>
                      {hoverDropdown === 'about' && (
                        <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50">
                          {aboutItems.map((aboutItem) => (
                            <Link
                              key={aboutItem.href}
                              href={aboutItem.href}
                              className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-[#C5A059] hover:text-white transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0"
                              onClick={() => setHoverDropdown(null)}
                            >
                              {t(aboutItem.key)}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }
                
                // Departments dropdown
                if (item.label === 'Departments') {
                  return (
                    <div 
                      key={item.href} 
                      className="relative"
                      onMouseEnter={() => setHoverDropdown('departments')}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Link
                        href="/departments"
                        className={`focus-ring rounded-sm text-sm tracking-wide transition-colors relative flex items-center gap-1 py-2 ${
                          active || pathname?.startsWith('/departments') ? 'text-[#8B6B3A] font-semibold' : `${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700/80 hover:text-[#8B6B3A]'}`
                        }`}
                      >
                        {label}
                        <svg className={`w-3 h-3 transition-transform duration-200 ${hoverDropdown === 'departments' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </Link>
                      {hoverDropdown === 'departments' && (
                        <div className="absolute top-full left-0 mt-1 w-72 max-h-80 overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50">
                          {loading ? (
                            <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
                          ) : sortedDepartments.length > 0 ? (
                            sortedDepartments.map((dept) => (
                              <Link
                                key={dept.id}
                                href={`/departments#${dept.slug}`}
                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-[#C5A059] hover:text-white transition-colors border-b border-gray-50 dark:border-gray-700 last:border-0"
                                onClick={() => setHoverDropdown(null)}
                              >
                                {dept.name}
                              </Link>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-sm text-gray-500">No departments found</div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }
                
                // Doctors dropdown
                if (item.label === 'Doctors') {
                  return (
                    <div 
                      key={item.href} 
                      className="relative"
                      onMouseEnter={() => setHoverDropdown('doctors')}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Link
                        href="/doctors"
                        className={`focus-ring rounded-sm text-sm tracking-wide transition-colors relative flex items-center gap-1 py-2 ${
                          active || pathname?.startsWith('/doctors') ? 'text-[#8B6B3A] font-semibold' : `${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700/80 hover:text-[#8B6B3A]'}`
                        }`}
                      >
                        {label}
                        <svg className={`w-3 h-3 transition-transform duration-200 ${hoverDropdown === 'doctors' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </Link>
                      {hoverDropdown === 'doctors' && (
                        <div className="absolute top-full left-0 mt-1 w-72 max-h-80 overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50">
                          {loading ? (
                            <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
                          ) : sortedDoctors.length > 0 ? (
                            sortedDoctors.map((doctor) => (
                              <Link
                                key={doctor.id}
                                href={`/doctors/${doctor.slug}`}
                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-[#C5A059] hover:text-white transition-colors border-b border-gray-50 dark:border-gray-700 last:border-0"
                                onClick={() => setHoverDropdown(null)}
                              >
                                {doctor.name} {doctor.title ? `- ${doctor.title}` : ''}
                              </Link>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-sm text-gray-500">No doctors found</div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }
                
                // Gallery dropdown
                if (item.label === 'Gallery') {
                  return (
                    <div 
                      key={item.href} 
                      className="relative"
                      onMouseEnter={() => setHoverDropdown('gallery')}
                      onMouseLeave={handleMouseLeave}
                    >
                      <Link
                        href="/gallery"
                        className={`focus-ring rounded-sm text-sm tracking-wide transition-colors relative flex items-center gap-1 py-2 ${
                          active || pathname?.startsWith('/gallery') ? 'text-[#8B6B3A] font-semibold' : `${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700/80 hover:text-[#8B6B3A]'}`
                        }`}
                      >
                        {label}
                        <svg className={`w-3 h-3 transition-transform duration-200 ${hoverDropdown === 'gallery' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </Link>
                      {hoverDropdown === 'gallery' && (
                        <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50">
                          {GALLERY_CATEGORIES.map((category) => (
                            <Link
                              key={category.id}
                              href={category.slug === 'all' ? '/gallery' : `/gallery/${category.slug}`}
                              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-[#C5A059] hover:text-white transition-colors border-b border-gray-50 dark:border-gray-700"
                              onClick={() => setHoverDropdown(null)}
                            >
                              {category.name}
                            </Link>
                          ))}
                          <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                          <Link
                            href="/services"
                            className="block px-4 py-2 text-sm font-semibold text-[#C5A059] hover:bg-[#C5A059] hover:text-white transition-colors"
                            onClick={() => setHoverDropdown(null)}
                          >
                            {language === 'en' ? '📋 Our Services' : '📋 አገልግሎቶች'}
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                }

                // Regular nav items
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`focus-ring rounded-sm text-sm tracking-wide transition-colors relative py-2 group ${
                      active ? 'text-[#8B6B3A] font-semibold' : `${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700/80 hover:text-[#8B6B3A]'}`
                    }`}
                  >
                    {label}
                    {active && (
                      <span className="absolute -bottom-0 left-0 right-0 h-0.5 bg-[#C5A059] rounded-full"></span>
                    )}
                    <span className="absolute -bottom-0 left-0 right-0 h-0.5 bg-[#C5A059] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </Link>
                );
              })}
            </nav>

            <div className="hidden lg:flex items-center gap-2">
              {/* Theme Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setHoverDropdown('theme')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className="focus-ring rounded-full border-2 border-[#C5A059] text-[#8B6B3A] dark:text-gray-300 hover:bg-[#C5A059] hover:text-white text-sm font-semibold px-2.5 py-1.5 transition-all duration-300 flex items-center gap-0.5 min-w-[40px] justify-center"
                >
                  <span className="text-base">{getThemeLabel().charAt(0)}</span>
                  <svg className={`w-3 h-3 transition-transform duration-200 ${hoverDropdown === 'theme' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {hoverDropdown === 'theme' && (
                  <div className="absolute top-full right-0 mt-1 w-44 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50">
                    {themeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleThemeChange(option.value as 'light' | 'dark' | 'system')}
                        className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                          theme === option.value 
                            ? 'bg-[#C5A059] text-white' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-[#C5A059] hover:text-white'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Language Switcher - Uses context toggle */}
              <button
                onClick={toggleLanguage}
                className="focus-ring rounded-full border-2 border-[#C5A059] text-[#8B6B3A] dark:text-gray-300 hover:bg-[#C5A059] hover:text-white text-sm font-semibold px-2.5 py-1.5 transition-all duration-300 min-w-[40px]"
              >
                {language === 'en' ? 'አማ' : 'EN'}
              </button>

              {/* Book Appointment Button */}
              <Link
                href="/appointment"
                className="focus-ring rounded-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-3 py-2 transition-all duration-300 hover:shadow-lg whitespace-nowrap"
              >
                {t('button.appointment')}
              </Link>
              
              {/* Login Button */}
              <Link
                href="/login"
                className="focus-ring rounded-full border-2 border-[#C5A059] text-[#8B6B3A] dark:text-gray-300 hover:bg-[#C5A059] hover:text-white text-sm font-semibold px-3.5 py-2 transition-all duration-300 whitespace-nowrap"
              >
                {t('button.login')}
              </Link>
              
              {/* Register Button */}
              <Link
                href="/register"
                className="focus-ring rounded-full bg-[#C5A059] hover:bg-[#B8963A] text-white text-sm font-semibold px-3.5 py-2 transition-all duration-300 hover:shadow-lg whitespace-nowrap"
              >
                {t('button.register')}
              </Link>
            </div>

            <button
              className="lg:hidden focus-ring rounded-sm p-2 text-[#8B6B3A] dark:text-gray-300"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <nav className="max-w-6xl mx-auto px-5 py-4 flex flex-col gap-3">
              {NAV.map((item) => {
                const label = getNavLabel(item.label);
                return (
                  <Link key={item.href} href={item.href} className="text-[#8B6B3A] dark:text-gray-300 text-sm py-1" onClick={() => setOpen(false)}>
                    {label}
                  </Link>
                );
              })}
              <div className="flex flex-col gap-3 mt-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                {/* Mobile About submenu */}
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">
                    {t('nav.about')}
                  </p>
                  {aboutItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-sm text-[#8B6B3A] dark:text-gray-300 hover:text-[#C5A059] py-1 pl-2 border-l-2 border-[#C5A059]"
                      onClick={() => setOpen(false)}
                    >
                      {t(item.key)}
                    </Link>
                  ))}
                </div>
                
                {/* Mobile Departments submenu */}
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">
                    {t('nav.departments')}
                  </p>
                  {loading ? (
                    <div className="text-sm text-gray-500 py-1 pl-2">Loading...</div>
                  ) : sortedDepartments.length > 0 ? (
                    sortedDepartments.map((dept) => (
                      <Link
                        key={dept.id}
                        href={`/departments#${dept.slug}`}
                        className="text-sm text-[#8B6B3A] dark:text-gray-300 hover:text-[#C5A059] py-1 pl-2 border-l-2 border-[#C5A059]"
                        onClick={() => setOpen(false)}
                      >
                        {dept.name}
                      </Link>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 py-1 pl-2">No departments available</div>
                  )}
                </div>
                
                {/* Mobile Doctors submenu */}
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">
                    {t('nav.doctors')}
                  </p>
                  {loading ? (
                    <div className="text-sm text-gray-500 py-1 pl-2">Loading...</div>
                  ) : sortedDoctors.length > 0 ? (
                    sortedDoctors.map((doctor) => (
                      <Link
                        key={doctor.id}
                        href={`/doctors/${doctor.slug}`}
                        className="text-sm text-[#8B6B3A] dark:text-gray-300 hover:text-[#C5A059] py-1 pl-2 border-l-2 border-[#C5A059]"
                        onClick={() => setOpen(false)}
                      >
                        {doctor.name} {doctor.title ? `- ${doctor.title}` : ''}
                      </Link>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 py-1 pl-2">No doctors available</div>
                  )}
                </div>

                {/* Mobile Gallery */}
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">
                    {t('nav.gallery')}
                  </p>
                  <div className="pl-2 border-l-2 border-[#C5A059]">
                    {GALLERY_CATEGORIES.map((category) => (
                      <Link
                        key={`mobile-gallery-${category.id}`}
                        href={category.slug === 'all' ? '/gallery' : `/gallery/${category.slug}`}
                        className="text-sm text-[#8B6B3A] dark:text-gray-300 hover:text-[#C5A059] py-1 pl-3 block"
                        onClick={() => setOpen(false)}
                      >
                        • {category.name}
                      </Link>
                    ))}
                    <Link
                      href="/services"
                      className="text-sm font-semibold text-[#C5A059] hover:text-[#B8963A] py-1 pl-3 block mt-1 border-t border-gray-200 dark:border-gray-700 pt-2"
                      onClick={() => setOpen(false)}
                    >
                      {language === 'en' ? '📋 Our Services →' : '📋 አገልግሎቶች →'}
                    </Link>
                  </div>
                </div>
                
                {/* Mobile Theme */}
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">
                    {t('button.theme')}
                  </p>
                  {themeOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        handleThemeChange(option.value as 'light' | 'dark' | 'system');
                        setOpen(false);
                      }}
                      className={`text-sm font-semibold px-4 py-2.5 rounded-full text-center transition-colors ${
                        theme === option.value
                          ? 'bg-[#C5A059] text-white'
                          : 'border-2 border-[#C5A059] text-[#8B6B3A] dark:text-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                
                {/* Mobile Language */}
                <button
                  onClick={() => {
                    toggleLanguage();
                    setOpen(false);
                  }}
                  className="text-[#8B6B3A] dark:text-gray-300 text-sm font-semibold px-4 py-2.5 rounded-full text-center border-2 border-[#C5A059]"
                >
                  {language === 'en' ? 'አማርኛ' : 'English'}
                </button>
                
                <Link
                  href="/appointment"
                  className="bg-green-600 text-white text-sm font-semibold px-4 py-2.5 rounded-full text-center"
                  onClick={() => setOpen(false)}
                >
                  {t('button.appointment')}
                </Link>
                <Link
                  href="/login"
                  className="border-2 border-[#C5A059] text-[#8B6B3A] dark:text-gray-300 text-sm font-semibold px-4 py-2.5 rounded-full text-center"
                  onClick={() => setOpen(false)}
                >
                  {t('button.login')}
                </Link>
                <Link
                  href="/register"
                  className="bg-[#C5A059] text-white text-sm font-semibold px-4 py-2.5 rounded-full text-center"
                  onClick={() => setOpen(false)}
                >
                  {t('button.register')}
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
        @keyframes scroll-topbar {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-scroll-topbar {
          animation: scroll-topbar 25s linear infinite;
        }
        .animate-scroll-topbar:hover {
          animation-play-state: paused;
        }
      `}</style>
    </header>
  );
}