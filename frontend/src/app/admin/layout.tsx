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
  Newspaper, 
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
  ClipboardList,
  Hospital,
  Users as UsersIcon,
  ChevronRight as ChevronRightIcon,
  Stethoscope,
  Building2,
  BookOpen,
  Pill,
  Microscope,
  Factory
} from 'lucide-react';

// Define the dropdown item type
interface DropdownItem {
  href: string;
  label: string;
}

// Define navigation item type
interface NavItem {
  href: string;
  label: string;
  icon: any;
  dropdown?: DropdownItem[];
}

// Appointments location data - points to appointments pages
const APPOINTMENTS_LOCATIONS = [
  { href: '/admin/appointments/afilas-general', label: 'Afilas General Hospital' },
  { href: '/admin/appointments/afilas-diagnosis', label: 'Afilas Diagnosis Center' },
  { href: '/admin/appointments/afilas-drug', label: 'Afilas Drug Manufacturing' },
];

// Doctors location data - points to doctors pages
const DOCTORS_LOCATIONS = [
  { href: '/admin/doctors/afilas-general', label: 'Afilas General Hospital' },
  { href: '/admin/doctors/afilas-diagnosis', label: 'Afilas Diagnosis Center' },
  { href: '/admin/doctors/afilas-drug', label: 'Afilas Drug Manufacturing' },
];

// Users location data - points to user pages
const USERS_LOCATIONS = [
  { href: '/admin/user/all', label: 'All Users' },
  { href: '/admin/user/afilas-general', label: 'Afilas General Hospital' },
  { href: '/admin/user/afilas-diagnosis', label: 'Afilas Diagnosis Center' },
  { href: '/admin/user/afilas-drug', label: 'Afilas Drug Manufacturing' },
];

// Services location data - points to services pages
const SERVICES_LOCATIONS = [
  { href: '/admin/services/afilas-general', label: 'Afilas General Hospital' },
  { href: '/admin/services/afilas-diagnosis', label: 'Afilas Diagnosis Center' },
  { href: '/admin/services/afilas-drug', label: 'Afilas Drug Manufacturing' },
];

// Blog location data - points to blog pages by location
const BLOG_LOCATIONS = [
  { href: '/admin/blog/afilas-general', label: 'Afilas General Hospital' },
  { href: '/admin/blog/afilas-diagnosis', label: 'Afilas Diagnosis Center' },
  { href: '/admin/blog/afilas-drug', label: 'Afilas Drug Manufacturing' },
];

// Navigation configuration with dropdowns
const NAV: NavItem[] = [
  { 
    href: '/admin/dashboard', 
    label: 'Dashboard', 
    icon: LayoutDashboard
  },
  { 
    href: '/admin/appointments', 
    label: 'Appointments', 
    icon: Calendar,
    dropdown: APPOINTMENTS_LOCATIONS
  },
  { 
    href: '/admin/doctors', 
    label: 'Doctors', 
    icon: Stethoscope,
    dropdown: DOCTORS_LOCATIONS
  },
  { 
    href: '/admin/user', 
    label: 'Users', 
    icon: UsersIcon,
    dropdown: USERS_LOCATIONS
  },
  { 
    href: '/admin/services', 
    label: 'Services', 
    icon: ClipboardList,
    dropdown: SERVICES_LOCATIONS
  },
  { 
    href: '/admin/blog', 
    label: 'Blog', 
    icon: BookOpen,
    dropdown: BLOG_LOCATIONS
  },
];

// Component for dropdown menu items with click functionality
const DropdownMenu = ({ 
  items, 
  isOpen, 
  onClose, 
  isSidebarOpen,
  currentPath,
  parentLabel
}: { 
  items: DropdownItem[]; 
  isOpen: boolean; 
  onClose: () => void;
  isSidebarOpen: boolean;
  currentPath: string;
  parentLabel: string;
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className={`
        ${isSidebarOpen ? 'relative mt-1' : 'absolute left-full top-0 ml-2'}
        space-y-0.5
        w-full
      `}
    >
      {items.map((item) => {
        const isActive = currentPath === item.href || currentPath.startsWith(item.href + '/');
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`
              group flex items-center justify-between px-4 py-2 rounded-lg text-sm transition-all duration-200
              ${isActive 
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 font-medium' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-300'
              }
              ${!isSidebarOpen && 'min-w-[200px]'}
              w-full
            `}
          >
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
              <span className="font-normal">{item.label}</span>
            </span>
            {isActive && (
              <ChevronRightIcon size={14} className="text-green-500" />
            )}
          </Link>
        );
      })}
    </div>
  );
};

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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New appointment booked', time: '5 min ago', read: false },
    { id: 2, title: 'Patient feedback received', time: '1 hour ago', read: false },
    { id: 3, title: 'Doctor schedule updated', time: '3 hours ago', read: true },
    { id: 4, title: 'System maintenance tonight', time: '1 day ago', read: true },
  ]);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

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
    const adminData = getStoredAdmin();
    console.log('📋 Admin data from storage:', adminData);
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
    try {
      const response = await fetch('/api/notifications', {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setNotifications(data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/admin/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const toggleDropdown = (href: string) => {
    setOpenDropdown(openDropdown === href ? null : href);
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
    const locationMatch = pathname.match(/\/admin\/(appointments|doctors|user|services|blog)\/(afilas-general|afilas-diagnosis|afilas-drug)/);
    if (locationMatch) {
      const location = locationMatch[2];
      const locationNames: { [key: string]: string } = {
        'afilas-general': 'Afilas General Hospital',
        'afilas-diagnosis': 'Afilas Diagnosis Center',
        'afilas-drug': 'Afilas Drug Manufacturing'
      };
      const section = locationMatch[1];
      const sectionNames: { [key: string]: string } = {
        'appointments': 'Appointments',
        'doctors': 'Doctors',
        'user': 'Users',
        'services': 'Services',
        'blog': 'Blog'
      };
      return `${sectionNames[section]} - ${locationNames[location]}`;
    }

    const currentNav = NAV.find(item => pathname === item.href || pathname.startsWith(item.href + '/'));
    return currentNav?.label || 'Dashboard';
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
            const hasDropdown = item.dropdown && item.dropdown.length > 0;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const isDropdownOpen = openDropdown === item.href;
            const isDropdownItemActive = hasDropdown && item.dropdown?.some(d => pathname === d.href || pathname.startsWith(d.href + '/'));

            return (
              <div key={item.href} className="relative">
                <Link
                  href={hasDropdown ? '#' : item.href}
                  onClick={(e) => {
                    if (hasDropdown) {
                      e.preventDefault();
                      toggleDropdown(item.href);
                    }
                  }}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative cursor-pointer
                    ${isActive || isDropdownItemActive
                      ? 'bg-green-600 text-white shadow-md hover:bg-green-700'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-300'
                    }
                    ${!sidebarOpen && 'justify-center'}
                    ${hasDropdown && isDropdownOpen && 'bg-green-50 dark:bg-green-900/20'}
                  `}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <item.icon 
                    size={20} 
                    className={`shrink-0 transition-colors ${
                      isActive || isDropdownItemActive
                        ? 'text-white' 
                        : 'text-gray-400 dark:text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400'
                    }`} 
                  />
                  {sidebarOpen && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {hasDropdown && (
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform duration-200 ${
                            isDropdownOpen ? 'rotate-180' : ''
                          } ${
                            isActive || isDropdownItemActive
                              ? 'text-white/70'
                              : 'text-gray-400 dark:text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400'
                          }`}
                        />
                      )}
                    </>
                  )}
                  {(isActive || isDropdownItemActive) && sidebarOpen && (
                    <span className="ml-auto w-1.5 h-6 rounded-full bg-white/50" />
                  )}
                  {(isActive || isDropdownItemActive) && !sidebarOpen && (
                    <span className="absolute right-0 w-1 h-8 bg-green-500 rounded-full" />
                  )}
                </Link>

                {/* Dropdown Menu - Click only */}
                {hasDropdown && sidebarOpen && (
                  <div className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${isDropdownOpen ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}
                  `}>
                    <DropdownMenu 
                      items={item.dropdown!} 
                      isOpen={isDropdownOpen}
                      onClose={() => setOpenDropdown(null)}
                      isSidebarOpen={sidebarOpen}
                      currentPath={pathname}
                      parentLabel={item.label}
                    />
                  </div>
                )}

                {/* Dropdown for collapsed sidebar - appears as popup on click */}
                {hasDropdown && !sidebarOpen && isDropdownOpen && (
                  <div 
                    className="absolute left-full top-0 ml-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 min-w-[220px] p-2 z-50"
                  >
                    <div className="text-xs font-medium text-green-600 dark:text-green-400 px-3 py-1.5 border-b border-gray-100 dark:border-gray-700 mb-1">
                      {item.label}
                    </div>
                    <DropdownMenu 
                      items={item.dropdown!} 
                      isOpen={true}
                      onClose={() => setOpenDropdown(null)}
                      isSidebarOpen={false}
                      currentPath={pathname}
                      parentLabel={item.label}
                    />
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
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-semibold shrink-0 shadow-md">
                {getUserInitials()}
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{getDisplayName()}</p>
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
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                aria-label="Open menu"
              >
                <Menu size={24} className="text-gray-600 dark:text-gray-300" />
              </button>
              <div className="hidden sm:block">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{getPageTitle()}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Welcome back, {getDisplayName()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 bg-gray-50 dark:bg-gray-900 rounded-lg px-3 py-1.5 border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent transition-all">
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

              {/* Notification Bell */}
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
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800 dark:text-white">Notifications</h3>
                      {unreadCount > 0 && (
                        <button 
                          onClick={markAllAsRead}
                          className="text-xs text-green-600 hover:text-green-700 font-medium"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                          <Bell size={32} className="text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">No notifications</p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => markAsRead(notif.id)}
                            className={`px-4 py-3 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0 ${
                              !notif.read ? 'bg-green-50 dark:bg-green-900/20' : ''
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              {!notif.read && (
                                <span className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></span>
                              )}
                              <div>
                                <p className="text-sm font-medium text-gray-800 dark:text-white">{notif.title}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notif.time}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                      <Link
                        href="/admin/notifications"
                        className="block text-center text-sm text-green-600 hover:text-green-700 font-medium py-1"
                        onClick={() => setNotificationOpen(false)}
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/admin/settings"
                className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors hidden sm:block"
                aria-label="Settings"
              >
                <Settings size={20} className="text-gray-600 dark:text-gray-300" />
              </Link>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors pr-2 py-1"
                  aria-label="Profile menu"
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-600 to-green-700 text-white flex items-center justify-center font-semibold text-sm shadow-md">
                      {getUserInitials()}
                    </div>
                    <div className="absolute -top-1 -right-1">
                      <Crown size={12} className="text-yellow-500" />
                    </div>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      {getDisplayName()}
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 font-medium">
                        Admin
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{admin?.email}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                    <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-white dark:from-gray-700 dark:to-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-green-600 to-green-700 text-white flex items-center justify-center font-semibold text-xl shadow-lg">
                            {getUserInitials()}
                          </div>
                          <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-0.5 border-2 border-white dark:border-gray-800">
                            <Crown size={12} className="text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 dark:text-white text-base">{getDisplayName()}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{admin?.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 font-medium flex items-center gap-1">
                              <Crown size={10} />
                              Admin
                            </span>
                           
                          </div>
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
                        My Profile
                      </Link>
                      <Link
                        href="/admin/settings"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <Settings size={18} className="text-gray-400 dark:text-gray-500" />
                        Account Settings
                      </Link>
                      <Link
                        href="/admin/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <Mail size={18} className="text-gray-400 dark:text-gray-500" />
                        Email Preferences
                      </Link>
                      <Link
                        href="/admin/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                        onClick={() => setProfileOpen(false)}
                      >
                        <Shield size={18} className="text-gray-400 dark:text-gray-500" />
                        Security
                      </Link>
                      <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                      <Link
                        href="/admin/help"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
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
                  className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                >
                  <X size={24} className="text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-120px)]">
                {NAV.map((item) => {
                  const hasDropdown = item.dropdown && item.dropdown.length > 0;
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  const isDropdownItemActive = hasDropdown && item.dropdown?.some(d => pathname === d.href || pathname.startsWith(d.href + '/'));
                  const isDropdownOpen = openDropdown === item.href;

                  return (
                    <div key={item.href}>
                      <Link
                        href={hasDropdown ? '#' : item.href}
                        onClick={(e) => {
                          if (hasDropdown) {
                            e.preventDefault();
                            toggleDropdown(item.href);
                          } else {
                            setMobileMenuOpen(false);
                          }
                        }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                          isActive || isDropdownItemActive
                            ? 'bg-green-600 text-white'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-300'
                        }`}
                      >
                        <item.icon size={20} />
                        <span className="flex-1">{item.label}</span>
                        {hasDropdown && (
                          <ChevronDown 
                            size={16} 
                            className={`transition-transform duration-200 ${
                              isDropdownOpen ? 'rotate-180' : ''
                            }`}
                          />
                        )}
                      </Link>
                      {hasDropdown && isDropdownOpen && (
                        <div className="pl-12 mt-1 space-y-1">
                          {item.dropdown!.map((subItem) => {
                            const isSubActive = pathname === subItem.href || pathname.startsWith(subItem.href + '/');
                            return (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                                  isSubActive
                                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-300'
                                }`}
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                <span className="font-normal">{subItem.label}</span>
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
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{getDisplayName()}</p>
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
                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-500 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg"
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