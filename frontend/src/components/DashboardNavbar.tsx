'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  LogOut,
  User,
  ChevronDown,
  Menu,
  X,
  Settings,
  Search,
  Bell,
  Sun,
  Moon
} from 'lucide-react';

interface DashboardNavbarProps {
  onMenuToggle?: (isOpen: boolean) => void;
}

export default function DashboardNavbar({ onMenuToggle }: DashboardNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const router = useRouter();

  const handleLogout = () => {
    // Add logout logic here
    router.push('/login');
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    if (onMenuToggle) {
      onMenuToggle(newState);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/admin/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // Add dark mode logic here
    document.documentElement.classList.toggle('dark');
  };

  return (
    <>
      {/* Top Horizontal Navbar - Fixed */}
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-50 h-20 shadow-sm transition-colors duration-200">
        <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <Link href="/admin" className="flex items-center gap-3">
              <div className="relative h-12 w-auto flex items-center">
                <Image
                  src="/logo-header-190x49-1.png"
                  alt="Afilas Hospital Logo"
                  width={190}
                  height={49}
                  className="object-contain dark:brightness-0 dark:invert"
                  priority
                  style={{ height: 'auto', width: 'auto' }}
                />
              </div>
            </Link>
          </div>

          {/* Center - Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search patients, appointments, doctors..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-clinical-500 focus:border-transparent transition-colors text-sm"
                />
              </div>
            </form>
          </div>

          {/* Right side - Actions and Profile */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
                aria-label="Notifications"
              >
                <Bell size={20} />
                {notificationCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </button>
            </div>

            {/* Settings Link */}
            <Link
              href="/admin/settings"
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Settings"
            >
              <Settings size={20} />
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Profile menu"
              >
                <div className="w-8 h-8 rounded-full bg-clinical-100 dark:bg-clinical-900 flex items-center justify-center">
                  <User className="w-5 h-5 text-clinical-600 dark:text-clinical-300" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Admin User</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Admin User</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">admin@afilashospital.com</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/admin/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </Link>
                      <Link
                        href="/admin/settings"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                      <hr className="my-1 border-gray-100 dark:border-gray-700" />
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden px-4 pb-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-clinical-500 focus:border-transparent transition-colors text-sm"
                  autoFocus
                />
              </div>
            </form>
          </div>
        )}
      </nav>

      {/* Mobile menu state management */}
      <input type="hidden" id="mobileMenuState" value={isMobileMenuOpen ? 'open' : 'closed'} />
    </>
  );
}