'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { getToken, getStoredAdmin, clearSession } from '@/lib/auth';
import { Admin } from '@/lib/types';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Building2, 
  Newspaper, 
  Image as ImageIcon,
  LogOut,
  ArrowLeft,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Bell,
  Settings,
  Search,
  UserCircle,
  Mail,
  Shield,
  ChevronDown,
  Crown,
  Activity,
  HelpCircle,
  Moon,
  Sun,
  ClipboardList // Added for Services
} from 'lucide-react';

// FIX: Changed href from '/admin' to '/admin/dashboard'
const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/appointments', label: 'Appointments', icon: Calendar },
  { href: '/admin/doctors', label: 'Doctors', icon: Users },
  { href: '/admin/departments', label: 'Departments', icon: Building2 },
  { href: '/admin/services', label: 'Services', icon: ClipboardList }, // Added Services
  { href: '/admin/news', label: 'News', icon: Newspaper },
  { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [checked, setChecked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isLoginPage) {
      setChecked(true);
      return;
    }
    const token = getToken();
    if (!token) {
      router.replace('/admin/login');
      return;
    }
    setAdmin(getStoredAdmin());
    setChecked(true);
  }, [isLoginPage, router]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/admin/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  if (isLoginPage) {
    return <div className="min-h-screen bg-clinical-50">{children}</div>;
  }

  if (!checked) {
    return <div className="min-h-screen bg-clinical-50" />;
  }

  function handleLogout() {
    clearSession();
    router.replace('/admin/login');
  }

  const getPageTitle = () => {
    const currentNav = NAV.find(item => pathname === item.href || pathname.startsWith(item.href + '/'));
    return currentNav?.label || 'Dashboard';
  };

  const notifications = [
    { id: 1, title: 'New appointment booked', time: '5 min ago', read: false },
    { id: 2, title: 'Patient feedback received', time: '1 hour ago', read: false },
    { id: 3, title: 'Doctor schedule updated', time: '3 hours ago', read: true },
    { id: 4, title: 'System maintenance tonight', time: '1 day ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shrink-0 transition-all duration-300 shadow-lg fixed h-screen z-50`}
      >
        {/* Logo Section */}
        <div className={`px-4 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center ${
          sidebarOpen ? 'justify-between' : 'justify-center'
        }`}>
          <Link href="/admin/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image
              src="/logo-header-190x49-1.png"
              alt="Afilas Hospital"
              width={sidebarOpen ? 160 : 40}
              height={sidebarOpen ? 41 : 40}
              className="object-contain dark:brightness-0 dark:invert"
              priority
            />
          </Link>
          {sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              aria-label="Expand sidebar"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                  active
                    ? 'bg-clinical-700 text-white shadow-md hover:bg-clinical-800'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                } ${!sidebarOpen && 'justify-center'}`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <item.icon 
                  size={20} 
                  className={`shrink-0 transition-colors ${
                    active 
                      ? 'text-white' 
                      : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                  }`} 
                />
                {sidebarOpen && <span>{item.label}</span>}
                {active && sidebarOpen && (
                  <span className="ml-auto w-1.5 h-6 rounded-full bg-white/50" />
                )}
                {active && !sidebarOpen && (
                  <span className="absolute right-0 w-1 h-8 bg-white rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
          {admin && (
            <div className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
              !sidebarOpen && 'justify-center'
            }`}>
              <div className="w-8 h-8 rounded-full bg-clinical-100 dark:bg-clinical-900 flex items-center justify-center text-clinical-700 dark:text-clinical-300 font-semibold shrink-0">
                {admin.name?.charAt(0) || 'A'}
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{admin.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{admin.email}</p>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-colors ${
              !sidebarOpen && 'justify-center'
            } text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300`}
            title={!sidebarOpen ? 'Logout' : undefined}
          >
            <LogOut size={20} className="shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>

          <Link
            href="/"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              !sidebarOpen && 'justify-center'
            } text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200`}
            title={!sidebarOpen ? 'Back to site' : undefined}
          >
            <ArrowLeft size={20} className="shrink-0" />
            {sidebarOpen && <span>Back to site</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Top Navbar */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Open menu"
              >
                <Menu size={24} className="text-gray-600 dark:text-gray-300" />
              </button>
              <div className="hidden sm:block">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{getPageTitle()}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Welcome back, {admin?.name || 'Admin'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 bg-gray-50 dark:bg-gray-900 rounded-lg px-3 py-1.5 border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-clinical-500 focus-within:border-transparent transition-all">
                <Search size={18} className="text-gray-400 dark:text-gray-500" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search patients, doctors..."
                  className="bg-transparent border-none outline-none text-sm w-32 lg:w-48 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
                />
              </form>

              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hidden sm:block"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <Sun size={20} className="text-gray-600 dark:text-gray-300" />
                ) : (
                  <Moon size={20} className="text-gray-600 dark:text-gray-300" />
                )}
              </button>

              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
                  aria-label="Notifications"
                >
                  <Bell size={20} className="text-gray-600 dark:text-gray-300" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {notificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800 dark:text-white">Notifications</h3>
                      <button className="text-xs text-clinical-600 hover:text-clinical-700 font-medium">
                        Mark all as read
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0 ${
                            !notif.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                          }`}
                        >
                          <p className="text-sm font-medium text-gray-800 dark:text-white">{notif.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notif.time}</p>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                      <Link
                        href="/admin/notifications"
                        className="block text-center text-sm text-clinical-600 hover:text-clinical-700 font-medium py-1"
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/admin/settings"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hidden sm:block"
                aria-label="Settings"
              >
                <Settings size={20} className="text-gray-600 dark:text-gray-300" />
              </Link>

              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors pr-2 py-1"
                  aria-label="Profile menu"
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-clinical-600 to-clinical-700 text-white flex items-center justify-center font-semibold text-sm shadow-md">
                      {admin?.name?.charAt(0) || 'A'}
                    </div>
                    <div className="absolute -top-1 -right-1">
                      <Crown size={12} className="text-yellow-500" />
                    </div>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      {admin?.name || 'Admin'}
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 font-medium">
                        Super Admin
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{admin?.email}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                    <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-clinical-50 to-white dark:from-gray-700 dark:to-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-clinical-600 to-clinical-700 text-white flex items-center justify-center font-semibold text-xl shadow-lg">
                            {admin?.name?.charAt(0) || 'A'}
                          </div>
                          <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-0.5 border-2 border-white dark:border-gray-800">
                            <Crown size={12} className="text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 dark:text-white text-base">{admin?.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{admin?.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 font-medium flex items-center gap-1">
                              <Crown size={10} />
                              Super Admin
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium flex items-center gap-1">
                              <Activity size={10} />
                              Online
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/admin/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <UserCircle size={18} className="text-gray-400 dark:text-gray-500" />
                        My Profile
                      </Link>
                      <Link
                        href="/admin/settings"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <Settings size={18} className="text-gray-400 dark:text-gray-500" />
                        Account Settings
                      </Link>
                      <Link
                        href="/admin/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <Mail size={18} className="text-gray-400 dark:text-gray-500" />
                        Email Preferences
                      </Link>
                      <Link
                        href="/admin/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <Shield size={18} className="text-gray-400 dark:text-gray-500" />
                        Security
                      </Link>
                      <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                      <Link
                        href="/admin/help"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <HelpCircle size={18} className="text-gray-400 dark:text-gray-500" />
                        Help & Support
                      </Link>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 py-1">
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
                      >
                        <LogOut size={18} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
            <div className="absolute left-0 top-0 h-full w-72 bg-white dark:bg-gray-800 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <Image
                  src="/logo-header-190x49-1.png"
                  alt="Afilas Hospital"
                  width={120}
                  height={31}
                  className="object-contain dark:brightness-0 dark:invert"
                  priority
                />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={24} className="text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              <nav className="p-4 space-y-1">
                {NAV.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        active
                          ? 'bg-clinical-700 text-white'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon size={20} />
                      {item.label}
                    </Link>
                  );
                })}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  {admin && (
                    <div className="px-4 py-2 mb-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{admin.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{admin.email}</p>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                  <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ArrowLeft size={20} />
                    Back to Site
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}