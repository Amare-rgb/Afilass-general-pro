'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { getToken, getStoredAdmin, clearSession } from '@/lib/auth';
import { Admin } from '@/lib/types';
import { 
  LogOut,
  ArrowLeft,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  UserCircle,
  Shield,
  ChevronDown,
  Crown,
  Loader2,
  LayoutDashboard,
  Building2 // ✅ Added Icon for Departments
} from 'lucide-react';

// Define navigation item type with sub-items
interface NavItem {
  href: string;
  label: string;
  icon?: any;
  subItems?: { href: string; label: string }[];
}

// Navigation with sub-items for each location - NO ICONS
const NAV: NavItem[] = [
  { 
    href: '/admin/dashboard', 
    label: 'Dashboard',
    icon: LayoutDashboard
  },
  { 
    href: '/admin/dashboard/afilas-general', 
    label: 'Afilas General Hospital',
    subItems: [
      { href: '/admin/appointments/afilas-general', label: 'Appointments' },
      { href: '/admin/doctors/afilas-general', label: 'Doctors' },
      { href: '/admin/user/afilas-general', label: 'Users' },
      { href: '/admin/services/afilas-general', label: 'Services' },
      { href: '/admin/blog/afilas-general', label: 'Blog' },
      { href: '/admin/departments', label: 'Departments' }, // ✅ ADDED HERE
    ]
  },
  { 
    href: '/admin/dashboard/afilas-diagnosis', 
    label: 'Afilas Diagnosis Center',
    subItems: [
      { href: '/admin/appointments/afilas-diagnosis', label: 'Appointments' },
      { href: '/admin/doctors/afilas-diagnosis', label: 'Doctors' },
      { href: '/admin/user/afilas-diagnosis', label: 'Users' },
      { href: '/admin/services/afilas-diagnosis', label: 'Services' },
      { href: '/admin/blog/afilas-diagnosis', label: 'Blog' },
      { href: '/admin/departments', label: 'Departments' }, // ✅ ADDED HERE
    ]
  },
  { 
    href: '/admin/dashboard/afilas-drug', 
    label: 'Afilas Drug Manufacturing',
    subItems: [
      { href: '/admin/appointments/afilas-drug', label: 'Appointments' },
      { href: '/admin/doctors/afilas-drug', label: 'Doctors' },
      { href: '/admin/user/afilas-drug', label: 'Users' },
      { href: '/admin/services/afilas-drug', label: 'Services' },
      { href: '/admin/blog/afilas-drug', label: 'Blog' },
      { href: '/admin/departments', label: 'Departments' }, // ✅ ADDED HERE
    ]
  },
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New appointment booked', time: 'Just now', read: false },
    { id: 2, title: 'Patient feedback received', time: '1 hour ago', read: false },
    { id: 3, title: 'Doctor schedule updated', time: '3 hours ago', read: true },
    { id: 4, title: 'System maintenance tonight', time: '1 day ago', read: true },
  ]);
  const [notificationLoading, setNotificationLoading] = useState(false);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const searchModalRef = useRef<HTMLDivElement>(null);

  const isLoginPage = pathname === '/admin/login';

  // Handle click outside for dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
      if (searchModalRef.current && !searchModalRef.current.contains(event.target as Node) && !(event.target as Element).closest('.search-trigger')) {
        setSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when modal opens
  useEffect(() => {
    if (searchOpen && searchRef.current) {
      setTimeout(() => {
        searchRef.current?.focus();
      }, 100);
    }
  }, [searchOpen]);

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
    const adminData = getStoredAdmin();
    console.log(' Admin data from storage:', adminData);
    setAdmin(adminData);
    setChecked(true);
  }, [isLoginPage, router]);

  // Fetch real notifications
  useEffect(() => {
    if (admin) {
      fetchNotifications();
    }
  }, [admin]);

  const fetchNotifications = async () => {
    setNotificationLoading(true);
    try {
      const token = getToken();
      if (!token) {
        console.log('No token found, skipping notifications fetch');
        setNotificationLoading(false);
        return;
      }
      
      const response = await fetch('http://localhost:5000/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(' Notifications response:', data);
        
        if (data && data.notifications) {
          setNotifications(data.notifications);
        } else if (Array.isArray(data)) {
          setNotifications(data);
        } else if (data && data.data && Array.isArray(data.data)) {
          setNotifications(data.data);
        }
      } else {
        console.error('Failed to fetch notifications:', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setNotificationLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setSearchLoading(true);
    try {
      const token = getToken();
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(searchQuery)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results || data.data || []);
      } else {
        console.error('Search failed:', response.status);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchClick = () => {
    setSearchOpen(true);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSearchResultClick = (result: any) => {
    closeSearch();
    if (result.path) {
      router.push(result.path);
    }
  };

  const toggleDropdown = (href: string) => {
    setOpenDropdowns(prev => 
      prev.includes(href) 
        ? prev.filter(item => item !== href)
        : [...prev, href]
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  if (isLoginPage) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  if (!checked) {
    return <div className="min-h-screen bg-gray-50" />;
  }

  // ============================================================
  // ✅ FIXED: Logout function - Redirect to Home Page
  // ============================================================
  function handleLogout() {
    // Clear all session data
    clearSession();
    
    // Clear all localStorage items
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('admin');
    
    // Clear sessionStorage
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('isLoggedIn');
    
    // ✅ Redirect to home page (not login page)
    window.location.href = '/';
  }

  const getPageTitle = () => {
    // Check if it's the main dashboard
    if (pathname === '/admin/dashboard') {
      return 'Dashboard';
    }
    
    // Check if it's a dashboard page
    const dashboardMatch = pathname.match(/\/admin\/dashboard\/(afilas-general|afilas-diagnosis|afilas-drug)/);
    if (dashboardMatch) {
      const location = dashboardMatch[1];
      const locationNames: { [key: string]: string } = {
        'afilas-general': 'Afilas General Hospital',
        'afilas-diagnosis': 'Afilas Diagnosis Center',
        'afilas-drug': 'Afilas Drug Manufacturing'
      };
      return locationNames[location] || 'Dashboard';
    }

    // Check if it's a sub-page
    const subMatch = pathname.match(/\/admin\/(appointments|doctors|user|services|blog|departments)\/(afilas-general|afilas-diagnosis|afilas-drug)/);
    if (subMatch) {
      const section = subMatch[1];
      const location = subMatch[2];
      const sectionNames: { [key: string]: string } = {
        'appointments': 'Appointments',
        'doctors': 'Doctors',
        'user': 'Users',
        'services': 'Services',
        'blog': 'Blog',
        'departments': 'Departments' // ✅ Added here
      };
      const locationNames: { [key: string]: string } = {
        'afilas-general': 'Afilas General Hospital',
        'afilas-diagnosis': 'Afilas Diagnosis Center',
        'afilas-drug': 'Afilas Drug Manufacturing'
      };
      return `${sectionNames[section]} - ${locationNames[location]}`;
    }

    // Check if it's the global departments page
    if (pathname === '/admin/departments') {
      return 'Departments';
    }

    return 'Dashboard';
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!admin?.name) return 'A';
    return admin.name.charAt(0).toUpperCase();
  };

  // Get full name for display
  const getDisplayName = () => {
    if (!admin?.name) return 'Admin';
    return admin.name;
  };

  // Check if a nav item is active
  const isNavActive = (item: NavItem) => {
    if (item.href === '/admin/dashboard') {
      return pathname === '/admin/dashboard';
    }
    return pathname === item.href || pathname.startsWith(item.href + '/');
  };

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

        {/* Navigation with sub-items - NO ICONS */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map((item) => {
            const isActive = isNavActive(item);
            const isDropdownOpen = openDropdowns.includes(item.href);
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isDashboard = item.href === '/admin/dashboard';

            return (
              <div key={item.href} className="relative">
                {isDashboard ? (
                  // Dashboard link - direct navigation with WHITE background
                  <Link
                    href={item.href}
                    className={`
                      flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 group relative cursor-pointer
                      ${isActive
                        ? 'bg-white border border-gray-300 text-gray-700 shadow-sm hover:bg-gray-50'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                      }
                      ${!sidebarOpen && 'justify-center'}
                    `}
                    title={!sidebarOpen ? item.label : undefined}
                  >
                    {sidebarOpen ? (
                      <>
                        <LayoutDashboard size={18} className={`mr-2 ${isActive ? 'text-gray-600' : 'text-gray-400 dark:text-gray-500'}`} />
                        <span className="flex-1 font-bold text-left">{item.label}</span>
                      </>
                    ) : (
                      <LayoutDashboard size={20} className={isActive ? 'text-gray-600' : 'text-gray-400 dark:text-gray-500'} />
                    )}
                    {isActive && sidebarOpen && (
                      <span className="ml-auto w-1.5 h-6 rounded-full bg-green-500" />
                    )}
                    {isActive && !sidebarOpen && (
                      <span className="absolute right-0 w-1 h-8 bg-green-500 rounded-full" />
                    )}
                  </Link>
                ) : (
                  // Location buttons with dropdown
                  <button
                    onClick={() => hasSubItems && toggleDropdown(item.href)}
                    className={`
                      flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 group relative cursor-pointer
                      ${isActive
                        ? 'bg-green-600 text-white shadow-md hover:bg-green-700'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-300'
                      }
                      ${!sidebarOpen && 'justify-center'}
                    `}
                    title={!sidebarOpen ? item.label : undefined}
                  >
                    {sidebarOpen ? (
                      <>
                        <span className="flex-1 font-bold text-left">{item.label}</span>
                        {hasSubItems && (
                          <ChevronDown 
                            size={16} 
                            className={`transition-transform duration-200 ${
                              isDropdownOpen ? 'rotate-180' : ''
                            } ${
                              isActive
                                ? 'text-white/70'
                                : 'text-gray-400 dark:text-gray-500'
                            }`}
                          />
                        )}
                      </>
                    ) : (
                      <span className="text-xs font-bold">{item.label.charAt(0)}</span>
                    )}
                    {isActive && sidebarOpen && (
                      <span className="ml-auto w-1.5 h-6 rounded-full bg-white/50" />
                    )}
                    {isActive && !sidebarOpen && (
                      <span className="absolute right-0 w-1 h-8 bg-green-500 rounded-full" />
                    )}
                  </button>
                )}

                {/* Sub-items dropdown - NO ICONS */}
                {hasSubItems && sidebarOpen && isDropdownOpen && (
                  <div className="mt-1 ml-4 space-y-0.5 border-l-2 border-gray-200 dark:border-gray-700 pl-3">
                    {item.subItems!.map((subItem) => {
                      const isSubActive = pathname === subItem.href || pathname.startsWith(subItem.href + '/');
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`
                            flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-200
                            ${isSubActive
                              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 font-medium'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-300'
                            }
                          `}
                        >
                          <span>{subItem.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
          {admin && (
            <div className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors ${
              !sidebarOpen && 'justify-center'
            }`}>
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-white font-semibold shrink-0 shadow-md">
                {getUserInitials()}
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-300 truncate">{getDisplayName()}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{admin.email}</p>
                </div>
              )}
            </div>
          )}

          {/* ✅ FIXED: Logout button - Redirects to Home Page */}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-bold transition-colors ${
              !sidebarOpen && 'justify-center'
            } text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300`}
            title={!sidebarOpen ? 'Logout' : undefined}
          >
            <LogOut size={20} className="shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>

          <Link
            href="/"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-colors ${
              !sidebarOpen && 'justify-center'
            } text-gray-500 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-300`}
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
          <div className="flex flex-col px-4 sm:px-6">
            {/* System Title - WHITE BACKGROUND */}
            <div className="flex items-center justify-center py-2 bg-blue-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
              <h1 className="text-sm font-bold text-gray-800 dark:text-white tracking-wider uppercase">
                Afilas Hospital - Three Branch Management System
              </h1>
            </div>
            
            {/* Navbar Content */}
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                  aria-label="Open menu"
                >
                  <Menu size={24} className="text-gray-600 dark:text-gray-300" />
                </button>
                <div className="hidden sm:block">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white">{getPageTitle()}</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Welcome back, {getDisplayName()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                {/* Search Icon */}
                <button
                  onClick={handleSearchClick}
                  className="search-trigger p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                  aria-label="Search"
                >
                  <Search size={20} className="text-gray-600 dark:text-gray-300" />
                </button>

                {/* Notification Bell - Centered on Mobile */}
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => setNotificationOpen(!notificationOpen)}
                    className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors relative"
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
                    <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden 
                      sm:right-0 sm:left-auto
                      left-1/2 -translate-x-1/2 sm:translate-x-0">
                      {/* Compact Header */}
                      <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
                        <h3 className="text-xs font-bold text-gray-800 dark:text-white">Notifications</h3>
                        {unreadCount > 0 && (
                          <button 
                            onClick={markAllAsRead}
                            className="text-[10px] text-green-600 hover:text-green-700 font-bold"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      {/* Compact List */}
                      <div className="max-h-56 overflow-y-auto">
                        {notificationLoading ? (
                          <div className="px-3 py-4 text-center">
                            <Loader2 className="w-5 h-5 text-green-500 animate-spin mx-auto" />
                          </div>
                        ) : notifications.length === 0 ? (
                          <div className="px-3 py-4 text-center">
                            <Bell size={20} className="text-gray-300 mx-auto mb-1" />
                            <p className="text-xs text-gray-500">No notifications</p>
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => markAsRead(notif.id)}
                              className={`px-3 py-2 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0 ${
                                !notif.read ? 'bg-green-50/50 dark:bg-green-900/10' : ''
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                {!notif.read && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></span>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-gray-800 dark:text-white truncate">{notif.title}</p>
                                  <p className="text-[10px] text-gray-500 dark:text-gray-400">{notif.time}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Compact Footer */}
                      <div className="px-3 py-1.5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <Link
                          href="/admin/notifications"
                          className="block text-center text-[10px] text-green-600 hover:text-green-700 font-bold py-0.5"
                          onClick={() => setNotificationOpen(false)}
                        >
                          View all
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors pr-2 py-1"
                    aria-label="Profile menu"
                  >
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white flex items-center justify-center font-bold text-sm shadow-md">
                        {getUserInitials()}
                      </div>
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                        {getDisplayName()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{admin?.email}</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                      <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-white flex items-center justify-center font-bold text-xl shadow-lg">
                              {getUserInitials()}
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-gray-800 dark:text-white text-base">{getDisplayName()}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{admin?.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/admin/profile"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                          onClick={() => setProfileOpen(false)}
                        >
                          <UserCircle size={18} className="text-gray-400 dark:text-gray-500" />
                          <span className="font-bold">My Profile</span>
                        </Link>
                        <Link
                          href="/admin/security"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                          onClick={() => setProfileOpen(false)}
                        >
                          <Shield size={18} className="text-gray-400 dark:text-gray-500" />
                          <span className="font-bold">Security</span>
                        </Link>
                        <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
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
                          <span className="font-bold">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Search Modal */}
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-sm" onClick={closeSearch}>
            <div 
              ref={searchModalRef}
              className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                <Search size={20} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
                <form onSubmit={handleSearch} className="flex-1">
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search patients, doctors, appointments..."
                    className="w-full bg-transparent border-none outline-none text-base text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                    autoFocus
                  />
                </form>
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                      searchRef.current?.focus();
                    }}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X size={16} className="text-gray-400" />
                  </button>
                )}
                <button
                  onClick={closeSearch}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              {/* Search Results */}
              <div className="max-h-96 overflow-y-auto">
                {searchLoading ? (
                  <div className="p-8 text-center">
                    <Loader2 className="w-8 h-8 text-green-500 animate-spin mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Searching...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="p-2">
                    {searchResults.map((result, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearchResultClick(result)}
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
                      >
                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-sm flex-shrink-0">
                          {result.type?.charAt(0) || 'R'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 dark:text-white">{result.name || result.title || 'Result'}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {result.type || 'Item'} • {result.location || 'General'}
                          </p>
                        </div>
                        <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="p-8 text-center">
                    <Search size={32} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No results found for "{searchQuery}"</p>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Search size={32} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Type to start searching...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

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
                  className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                >
                  <X size={24} className="text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-120px)]">
                {NAV.map((item) => {
                  const isActive = isNavActive(item);
                  const isDropdownOpen = openDropdowns.includes(item.href);
                  const hasSubItems = item.subItems && item.subItems.length > 0;
                  const isDashboard = item.href === '/admin/dashboard';

                  return (
                    <div key={item.href}>
                      {isDashboard ? (
                        <Link
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-bold transition-all ${isActive
                              ? 'bg-white border border-gray-300 text-gray-700 shadow-sm'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                          }`}
                        >
                          <LayoutDashboard size={18} className="mr-2" />
                          <span className="flex-1 text-left">{item.label}</span>
                        </Link>
                      ) : (
                        <button
                          onClick={() => hasSubItems && toggleDropdown(item.href)}
                          className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-bold transition-all ${isActive
                              ? 'bg-green-600 text-white'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-300'
                          }`}
                        >
                          <span className="flex-1 text-left">{item.label}</span>
                          {hasSubItems && (
                            <ChevronDown 
                              size={16} 
                              className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                            />
                          )}
                        </button>
                      )}
                      {hasSubItems && isDropdownOpen && (
                        <div className="pl-6 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 ml-4">
                          {item.subItems!.map((subItem) => {
                            const isSubActive = pathname === subItem.href || pathname.startsWith(subItem.href + '/');
                            return (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center px-3 py-2 rounded-lg text-sm transition-all ${isSubActive
                                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 font-medium'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-300'
                                }`}
                              >
                                <span>{subItem.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  {admin && (
                    <div className="px-4 py-2 mb-2">
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{getDisplayName()}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{admin.email}</p>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-bold"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                  <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-500 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg font-bold"
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
        <main className="p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}