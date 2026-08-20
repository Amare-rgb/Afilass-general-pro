// components/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useRef } from "react";
import { useTheme } from "@/contexts/ThemeProvider";
import { useLanguage } from "@/contexts/LanguageProvider";
import {
  ChevronDown,
  Globe,
  Moon,
  Phone,
  Sun,
  X,
  Building2,
  Microscope,
  Pill,
  Calendar,
  Menu,
  Monitor,
  User,
  LogIn,
  UserPlus,
  Settings,
  LogOut,
  UserCircle,
  HelpCircle,
  Stethoscope,
} from "lucide-react";

// ============================================================
// SCROLL DETECTION HOOK
// ============================================================
function useScroll() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { isScrolled };
}

// ============================================================
// CUSTOM HOOK: Click outside detection
// ============================================================
function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  handler: () => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

// ============================================================
// HEADER COMPONENT
// ============================================================
export function Header() {
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [appointmentDropdownOpen, setAppointmentDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Refs for dropdowns
  const moreDropdownRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const themeDropdownRef = useRef<HTMLDivElement>(null);
  const appointmentDropdownRef = useRef<HTMLDivElement>(null);
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const { isScrolled } = useScroll();
  const pathname = usePathname();
  const router = useRouter();

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        setIsLoggedIn(true);
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  // Which pages get the transparent/glass effect at the top?
  const isTransparentPage = ["/", "/blogs", "/aboutUs"].includes(pathname);

  // SIMPLE RULE: Solid if scrolled OR not on a transparent page
  const isSolid = isScrolled || !isTransparentPage;

  const isHome = pathname === "/";

  // Click outside handlers
  useClickOutside(moreDropdownRef, () => setMoreDropdownOpen(false));
  useClickOutside(languageDropdownRef, () => setLanguageDropdownOpen(false));
  useClickOutside(themeDropdownRef, () => setThemeDropdownOpen(false));
  useClickOutside(appointmentDropdownRef, () => setAppointmentDropdownOpen(false));
  useClickOutside(accountDropdownRef, () => setAccountDropdownOpen(false));
  useClickOutside(mobileMenuRef, () => setMobileOpen(false));

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // ============================================================
  // Afilas Group branches
  // ============================================================
  const pillarItems = useMemo(
    () => [
      {
        id: "hospital",
        label: t("nav.division.hospital") || "General Hospital",
        href: "/hospital",
        description: t("nav.division.hospital_desc"),
        icon: Building2,
      },
      {
        id: "diagnostics",
        label: t("nav.division.diagnostics") || "Diagnosis Center",
        href: "/diagnostics",
        description: t("nav.division.diagnostics_desc"),
        icon: Microscope,
      },
      {
        id: "pharma",
        label: t("nav.division.pharma") || "Drug Manufacturing",
        href: "/pharma",
        description: t("nav.division.pharma_desc"),
        icon: Pill,
      },
    ],
    [t],
  );

  // "More" menu items with Departments added
  const moreItems = useMemo(
    () => [
      { 
        id: "departments", 
        label: t("nav.departments") || "Departments", 
        href: "/departments",
        icon: Stethoscope,
      },
      { id: "aboutUs", label: t("nav.about_us") || "About Us", href: "/aboutUs" },
      { id: "blogs", label: t("nav.blog") || "Blog", href: "/blogs" },
      { id: "contact", label: t("nav.contact_emergency") || "Contact & Emergency", href: "/contact" },
      { id: "services", label: t("nav.service") || "Services", href: "/services" },
    ],
    [t],
  );

  // Account dropdown items for logged in users
  const accountItems = useMemo(
    () => [
      { id: "profile", label: t("nav.profile") || "My Profile", href: "/profile", icon: UserCircle },
      { id: "settings", label: t("nav.settings") || "Settings", href: "/settings", icon: Settings },
    ],
    [t],
  );

  // ============================================================
  // SCROLL DIRECTION – hide/show main header on scroll down/up
  // ============================================================
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setShowHeader(false);
      } else if (currentScrollY < lastScrollY.current) {
        setShowHeader(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Derive the active branch item from the current path
  const activeBranchItem = useMemo(() => {
    if (pathname.startsWith("/hospital")) {
      return pillarItems.find(item => item.id === "hospital") || null;
    }
    if (pathname.startsWith("/diagnostics")) {
      return pillarItems.find(item => item.id === "diagnostics") || null;
    }
    if (pathname.startsWith("/pharma")) {
      return pillarItems.find(item => item.id === "pharma") || null;
    }
    return null;
  }, [pathname, pillarItems]);

  const isActiveLink = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const goHome = () => {
    router.push("/");
  };

  const closeAll = () => {
    setMoreDropdownOpen(false);
    setLanguageDropdownOpen(false);
    setThemeDropdownOpen(false);
    setMobileOpen(false);
    setAppointmentDropdownOpen(false);
    setAccountDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setAccountDropdownOpen(false);
    router.push('/');
  };

  const getThemeLabel = (): string => {
    if (theme === "light") return t("theme.light") || "Light";
    if (theme === "dark") return t("theme.dark") || "Dark";
    return t("theme.system") || "System";
  };

  const getLanguageLabel = (): string => {
    return language === "en" ? "English" : "አማርኛ";
  };

  return (
    <>
      {/* ============================================================
          TOP BAR
          ============================================================ */}
      <div
        className={`topbar fixed top-0 z-50 w-full border-b transition-all duration-300 ease-in-out ${
          isSolid
            ? "border-destructive/60 bg-destructive text-destructive-foreground"
            : "border-white/20 bg-transparent text-white"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-2 py-1 text-[10px] font-medium sm:px-4 sm:py-2 sm:text-xs lg:px-8">
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span
              className={`whitespace-nowrap ${
                isSolid ? "text-destructive-foreground/80" : "text-white/90"
              }`}
            >
              {t("topbar.emergency_available")}
            </span>
          </div>
          <a
            href="tel:+251983201998"
            className={`inline-flex items-center gap-1 whitespace-nowrap transition-colors ${
              isSolid
                ? "text-destructive-foreground/80 hover:text-destructive-foreground"
                : "text-white/90 hover:text-white"
            }`}
          >
            <span>{t("topbar.call")} +251 98 320 1998</span>
          </a>
        </div>
      </div>

      <header
        className={`fixed left-1/2 z-40 mx-auto flex w-[95vw] max-w-[1400px] -translate-x-1/2 rounded-2xl transition-all duration-500 ease-in-out transform ${
          showHeader ? "translate-y-0" : "-translate-y-[calc(100%+20px)]"
        }`}
        id="main-header"
        style={{ top: "var(--topbar-height, 36px)" }}
      >
        {/* Header Background */}
        <div
          className={`absolute inset-0 -z-10 rounded-2xl transition-all duration-300 ${
            isSolid
              ? "border border-[#4A90D9]/20 bg-white/95 shadow-lg shadow-[#4A90D9]/10 backdrop-blur-sm dark:border-[#2d6a4f]/30 dark:bg-slate-900/95 dark:shadow-[#2d6a4f]/10"
              : "border-transparent bg-transparent shadow-none"
          }`}
        />

        <nav className="relative flex w-full items-center justify-between gap-2 px-2 py-2 sm:px-4 lg:px-6">
          
          {/* ============================================================
              FIXED LOGO SECTION
              ============================================================ */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 min-w-0 max-w-[40%] sm:max-w-none">
            <Link
              href="/"
              className="flex items-center gap-2 flex-shrink-0"
              aria-label="Afilas Group Logo"
              translate="no"
              onClick={goHome}
            >
              {/* Icon Logo */}
              <div className="relative h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                <Image
                  src="/Afilas-Icon.png"
                  alt="Afilas Icon"
                  width={40}
                  height={40}
                  className="object-contain"
                  priority
                />
              </div>
              
              {/* Text Logo */}
              <div className="flex flex-col items-start -mt-1 sm:mt-0">
                <span className={`text-[8px] sm:text-[10px] font-medium tracking-wide uppercase ${
                  isSolid ? "text-[#4A90D9] dark:text-[#2d6a4f]" : "text-white/70"
                }`}>
                  Share Company
                </span>
              </div>
            </Link>
          </div>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center">
            <div className="flex items-center gap-1 xl:gap-2">
              {!isHome && (
                <Link
                  href="/"
                  className={`flex items-center rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
                    isSolid
                      ? "text-[#2d6a4f] hover:bg-[#4A90D9]/10 dark:text-[#4A90D9] dark:hover:bg-[#2d6a4f]/10"
                      : "text-white/90 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  {t("nav.home") || "Home"}
                </Link>
              )}

              {/* MAIN DIVISIONS */}
              {pillarItems
                .filter((item) => !activeBranchItem || item.id === activeBranchItem.id)
                .map((item) => {
                  const active = isActiveLink(item.href);
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={`flex items-center rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                        active
                          ? isSolid
                            ? "bg-[#4A90D9]/15 text-[#2d6a4f] dark:bg-[#2d6a4f]/20 dark:text-[#4A90D9]"
                            : "bg-white/25 text-white"
                          : isSolid
                            ? "text-[#2d6a4f] hover:bg-[#4A90D9]/10 hover:text-[#4A90D9] dark:text-[#4A90D9] dark:hover:bg-[#2d6a4f]/10 dark:hover:text-[#2d6a4f]"
                            : "text-white/90 hover:bg-white/25 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}

              {/* DOCTORS */}
              <Link
                href="/doctors"
                className={`flex items-center rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
                  isActiveLink("/doctors")
                    ? isSolid
                      ? "bg-[#4A90D9]/15 text-[#2d6a4f] dark:bg-[#2d6a4f]/20 dark:text-[#4A90D9]"
                      : "bg-white/25 text-white"
                    : isSolid
                      ? "text-[#2d6a4f] hover:bg-[#4A90D9]/10 hover:text-[#4A90D9] dark:text-[#4A90D9] dark:hover:bg-[#2d6a4f]/10 dark:hover:text-[#2d6a4f]"
                      : "text-white/90 hover:bg-white/20 hover:text-white"
                }`}
              >
                {t("nav.doctors") || "Doctors"}
              </Link>

              {/* ============================================================
                  MORE DROPDOWN (Includes DEPARTMENTS, THEME & ACCOUNT)
                  ============================================================ */}
              <div className="relative" ref={moreDropdownRef}>
                <button
                  type="button"
                  onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                  className={`flex items-center rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
                    isSolid
                      ? "text-[#2d6a4f] hover:bg-[#4A90D9]/10 dark:text-[#4A90D9] dark:hover:bg-[#2d6a4f]/10"
                      : "text-white/90 hover:bg-white/20 hover:text-white"
                  } ${moreDropdownOpen ? (isSolid ? "bg-[#4A90D9]/10 dark:bg-[#2d6a4f]/10" : "bg-white/20") : ""}`}
                  aria-haspopup="menu"
                  aria-expanded={moreDropdownOpen}
                >
                  {t("nav.more") || "More"}
                  <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${moreDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {moreDropdownOpen && (
                  <div className={`absolute right-0 top-full z-50 mt-3 w-[220px] rounded-2xl p-2 transition-all duration-300 shadow-2xl ${
                    isSolid
                      ? "bg-white/95 backdrop-blur-xl border border-[#4A90D9]/20 dark:bg-slate-900/95 dark:border-[#2d6a4f]/30"
                      : "bg-white/10 backdrop-blur-2xl border border-white/25"
                  }`} role="menu">
                    
                    {/* STANDARD MORE LINKS (Including Departments) */}
                    {moreItems.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => setMoreDropdownOpen(false)}
                        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                          isActiveLink(item.href)
                            ? isSolid
                              ? "bg-[#4A90D9]/15 text-[#2d6a4f] dark:bg-[#2d6a4f]/20 dark:text-[#4A90D9]"
                              : "bg-white/30 text-white"
                            : isSolid
                              ? "text-[#2d6a4f] hover:bg-[#4A90D9]/10 dark:text-[#4A90D9] dark:hover:bg-[#2d6a4f]/10"
                              : "text-white/90 hover:bg-white/20 hover:text-white"
                        }`}
                      >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        {item.label}
                      </Link>
                    ))}

                    {/* DIVIDER */}
                    <div className={`my-1 border-t ${isSolid ? "border-[#4A90D9]/20 dark:border-[#2d6a4f]/30" : "border-white/20"}`}></div>

                    {/* THEME MENU INSIDE MORE */}
                    <div className="relative" ref={themeDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors ${
                          isSolid
                            ? "text-[#2d6a4f] hover:bg-[#4A90D9]/10 dark:text-[#4A90D9] dark:hover:bg-[#2d6a4f]/10"
                            : "text-white/90 hover:bg-white/20 hover:text-white"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {theme === "light" ? <Sun className="h-4 w-4" /> : theme === "dark" ? <Moon className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                          {getThemeLabel()}
                        </span>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${themeDropdownOpen ? "rotate-180" : ""}`} />
                      </button>
                      
                      {themeDropdownOpen && (
                        <div className={`mt-1 ml-2 space-y-1 rounded-lg p-1 border ${isSolid ? "border-[#4A90D9]/20 dark:border-[#2d6a4f]/30 bg-white/50 dark:bg-slate-900/50" : "border-white/20 bg-white/10"}`}>
                          <button onClick={() => { setTheme("light"); setThemeDropdownOpen(false); }} className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors ${theme === "light" ? (isSolid ? "bg-[#4A90D9]/15 text-[#2d6a4f]" : "bg-white/30 text-white") : (isSolid ? "text-[#2d6a4f] hover:bg-[#4A90D9]/10" : "text-white/90 hover:bg-white/20")}`}>
                            <Sun className="h-3.5 w-3.5" /><span>{t("theme.light") || "Light"}</span>{theme === "light" && <span className="ml-auto text-xs">✓</span>}
                          </button>
                          <button onClick={() => { setTheme("dark"); setThemeDropdownOpen(false); }} className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors ${theme === "dark" ? (isSolid ? "bg-[#4A90D9]/15 text-[#2d6a4f]" : "bg-white/30 text-white") : (isSolid ? "text-[#2d6a4f] hover:bg-[#4A90D9]/10" : "text-white/90 hover:bg-white/20")}`}>
                            <Moon className="h-3.5 w-3.5" /><span>{t("theme.dark") || "Dark"}</span>{theme === "dark" && <span className="ml-auto text-xs">✓</span>}
                          </button>
                          <button onClick={() => { setTheme("system"); setThemeDropdownOpen(false); }} className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors ${theme === "system" ? (isSolid ? "bg-[#4A90D9]/15 text-[#2d6a4f]" : "bg-white/30 text-white") : (isSolid ? "text-[#2d6a4f] hover:bg-[#4A90D9]/10" : "text-white/90 hover:bg-white/20")}`}>
                            <Monitor className="h-3.5 w-3.5" /><span>{t("theme.system") || "System"}</span>{theme === "system" && <span className="ml-auto text-xs">✓</span>}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* ACCOUNT MENU INSIDE MORE */}
                    <div className="relative" ref={accountDropdownRef}>
                      <button
                        type="button"
                        onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors ${
                          isSolid
                            ? "text-[#2d6a4f] hover:bg-[#4A90D9]/10 dark:text-[#4A90D9] dark:hover:bg-[#2d6a4f]/10"
                            : "text-white/90 hover:bg-white/20 hover:text-white"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {isLoggedIn ? user?.name?.split(' ')[0] || 'Account' : t("nav.account") || "Account"}
                        </span>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${accountDropdownOpen ? "rotate-180" : ""}`} />
                      </button>

                      {accountDropdownOpen && (
                        <div className={`mt-1 ml-2 space-y-1 rounded-lg p-1 border ${isSolid ? "border-[#4A90D9]/20 dark:border-[#2d6a4f]/30 bg-white/50 dark:bg-slate-900/50" : "border-white/20 bg-white/10"}`}>
                          {isLoggedIn ? (
                            <>
                              {/* User Info */}
                              <div className="px-2 py-2 border-b border-[#4A90D9]/20 dark:border-[#2d6a4f]/30 mb-1">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-full bg-[#4A90D9]/20 flex items-center justify-center">
                                    <UserCircle className="w-4 h-4 text-[#2d6a4f] dark:text-[#4A90D9]" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-[#2d6a4f] dark:text-[#4A90D9] truncate">
                                      {user?.name || 'User'}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {accountItems.map((item) => (
                                <Link
                                  key={item.id}
                                  href={item.href}
                                  onClick={() => { setAccountDropdownOpen(false); setMoreDropdownOpen(false); }}
                                  className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors ${
                                    isActiveLink(item.href)
                                      ? isSolid
                                        ? "bg-[#4A90D9]/15 text-[#2d6a4f] dark:bg-[#2d6a4f]/20 dark:text-[#4A90D9]"
                                        : "bg-white/30 text-white"
                                      : isSolid
                                        ? "text-[#2d6a4f] hover:bg-[#4A90D9]/10 dark:text-[#4A90D9] dark:hover:bg-[#2d6a4f]/10"
                                        : "text-white/90 hover:bg-white/20 hover:text-white"
                                  }`}
                                >
                                  <item.icon className="h-3.5 w-3.5" />
                                  {item.label}
                                </Link>
                              ))}

                              {/* Divider & Logout */}
                              <div className="border-t border-[#4A90D9]/20 dark:border-[#2d6a4f]/30 my-1"></div>
                              <button
                                onClick={() => { handleLogout(); setMoreDropdownOpen(false); }}
                                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                              >
                                <LogOut className="h-3.5 w-3.5" />
                                {t("nav.logout") || "Logout"}
                              </button>
                            </>
                          ) : (
                            <>
                              <Link
                                href="/login"
                                onClick={() => { setAccountDropdownOpen(false); setMoreDropdownOpen(false); }}
                                className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors ${
                                  isSolid
                                    ? "text-[#2d6a4f] hover:bg-[#4A90D9]/10 dark:text-[#4A90D9] dark:hover:bg-[#2d6a4f]/10"
                                    : "text-white/90 hover:bg-white/20 hover:text-white"
                                }`}
                              >
                                <LogIn className="h-3.5 w-3.5" />
                                {t("nav.sign_in") || "Sign In"}
                              </Link>
                              <Link
                                href="/register"
                                onClick={() => { setAccountDropdownOpen(false); setMoreDropdownOpen(false); }}
                                className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-sm transition-colors ${
                                  isSolid
                                    ? "text-[#2d6a4f] hover:bg-[#4A90D9]/10 dark:text-[#4A90D9] dark:hover:bg-[#2d6a4f]/10"
                                    : "text-white/90 hover:bg-white/20 hover:text-white"
                                }`}
                              >
                                <UserPlus className="h-3.5 w-3.5" />
                                {t("nav.create_account") || "Create Account"}
                              </Link>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Controls (Language & Appointment) */}
          <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
            {/* LANGUAGE BUTTON */}
            <div className="relative" ref={languageDropdownRef}>
              <button
                type="button"
                onClick={() => { setLanguageDropdownOpen(!languageDropdownOpen); setThemeDropdownOpen(false); setAccountDropdownOpen(false); }}
                className={`inline-flex items-center gap-0.5 sm:gap-1 rounded-lg border px-1 sm:px-2 py-0.5 sm:py-1 text-[9px] sm:text-xs lg:text-sm font-medium transition-colors ${
                  isSolid
                    ? "border-[#4A90D9]/30 text-[#2d6a4f] hover:bg-[#4A90D9]/10 dark:border-[#2d6a4f]/30 dark:text-[#4A90D9] dark:hover:bg-[#2d6a4f]/10"
                    : "border-white/30 text-white hover:bg-white/20"
                } ${languageDropdownOpen ? (isSolid ? "bg-[#4A90D9]/10 dark:bg-[#2d6a4f]/10" : "bg-white/20") : ""}`}
                aria-label="Change language"
              >
                <Globe className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                <span className="hidden sm:inline text-xs">{getLanguageLabel()}</span>
                <ChevronDown className={`h-1.5 w-1.5 sm:h-3 sm:w-3 transition-transform duration-200 ${languageDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {languageDropdownOpen && (
                <div className={`absolute right-0 top-full z-50 mt-2 w-[160px] sm:w-[180px] rounded-2xl p-2 transition-all duration-200 ${
                  isSolid
                    ? "border border-[#4A90D9]/20 bg-white/95 backdrop-blur-xl shadow-2xl dark:border-[#2d6a4f]/30 dark:bg-slate-900/95"
                    : "border border-white/25 bg-white/20 backdrop-blur-2xl shadow-2xl shadow-black/20"
                }`}>
                  <button onClick={() => { setLanguage("en"); setLanguageDropdownOpen(false); }} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${language === "en" ? (isSolid ? "bg-[#4A90D9]/15 text-[#2d6a4f] dark:bg-[#2d6a4f]/20 dark:text-[#4A90D9]" : "bg-white/30 text-white") : (isSolid ? "text-[#2d6a4f] hover:bg-[#4A90D9]/10 dark:text-[#4A90D9] dark:hover:bg-[#2d6a4f]/10" : "text-white/90 hover:bg-white/20 hover:text-white")}`}>
                    <Globe className="h-4 w-4" /><span>English</span>{language === "en" && <span className="ml-auto text-xs">✓</span>}
                  </button>
                  <button onClick={() => { setLanguage("am"); setLanguageDropdownOpen(false); }} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${language === "am" ? (isSolid ? "bg-[#4A90D9]/15 text-[#2d6a4f] dark:bg-[#2d6a4f]/20 dark:text-[#4A90D9]" : "bg-white/30 text-white") : (isSolid ? "text-[#2d6a4f] hover:bg-[#4A90D9]/10 dark:text-[#4A90D9] dark:hover:bg-[#2d6a4f]/10" : "text-white/90 hover:bg-white/20 hover:text-white")}`}>
                    <Globe className="h-4 w-4" /><span>አማርኛ</span>{language === "am" && <span className="ml-auto text-xs">✓</span>}
                  </button>
                </div>
              )}
            </div>

            {/* APPOINTMENT BUTTON */}
            <div className="relative" ref={appointmentDropdownRef}>
              <button
                type="button"
                onClick={() => setAppointmentDropdownOpen(!appointmentDropdownOpen)}
                className={`inline-flex items-center rounded-lg px-1.5 sm:px-3 py-0.5 sm:py-1.5 text-[9px] sm:text-xs lg:text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg whitespace-nowrap ${
                  isSolid
                    ? "border border-[#4A90D9]/30 text-[#2d6a4f] hover:bg-[#4A90D9]/10 dark:border-[#2d6a4f]/30 dark:text-[#4A90D9] dark:hover:bg-[#2d6a4f]/10"
                    : "border-white/30 text-white hover:bg-white/40 hover:shadow-white/20"
                } ${appointmentDropdownOpen ? (isSolid ? "bg-[#4A90D9]/10 dark:bg-[#2d6a4f]/10" : "bg-white/20") : ""}`}
                aria-haspopup="true"
                aria-expanded={appointmentDropdownOpen}
              >
                <Calendar className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                <span className="text-[7px] sm:text-xs lg:text-sm whitespace-nowrap ml-0.5 sm:ml-1">{t("nav.book") || "Book"}</span>
                <ChevronDown className={`h-1.5 w-1.5 sm:h-3 sm:w-3 ml-0.5 sm:ml-1 transition-transform duration-200 ${appointmentDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {appointmentDropdownOpen && (
                <div className={`absolute right-0 top-full z-50 mt-2 w-[200px] rounded-2xl p-2 transition-all duration-200 ${
                  isSolid
                    ? "border border-[#4A90D9]/20 bg-white/95 backdrop-blur-xl shadow-2xl dark:border-[#2d6a4f]/30 dark:bg-slate-900/95"
                    : "border border-white/25 bg-white/20 backdrop-blur-2xl shadow-2xl shadow-black/20"
                }`}>
                  <Link href="/appointments/hospital" onClick={() => setAppointmentDropdownOpen(false)} className={`flex w-full items-center rounded-lg px-3 py-2.5 text-sm transition-colors ${isSolid ? "text-[#2d6a4f] hover:bg-[#4A90D9]/10 dark:text-[#4A90D9] dark:hover:bg-[#2d6a4f]/10" : "text-white/90 hover:bg-white/20 hover:text-white"}`}>
                    <div className="flex flex-col"><span className="font-medium text-[#2d6a4f] dark:text-[#4A90D9]">{t("nav.division.hospital") || "General Hospital"}</span><span className="text-[10px] opacity-70 text-[#4A90D9] dark:text-[#2d6a4f]">{t("nav.book_at_hospital") || "Book at Afilas General Hospital"}</span></div>
                  </Link>
                  <Link href="/appointments/diagnosis" onClick={() => setAppointmentDropdownOpen(false)} className={`flex w-full items-center rounded-lg px-3 py-2.5 text-sm transition-colors ${isSolid ? "text-[#2d6a4f] hover:bg-[#4A90D9]/10 dark:text-[#4A90D9] dark:hover:bg-[#2d6a4f]/10" : "text-white/90 hover:bg-white/20 hover:text-white"}`}>
                    <div className="flex flex-col"><span className="font-medium text-[#2d6a4f] dark:text-[#4A90D9]">{t("nav.division.diagnostics") || "Diagnosis Center"}</span><span className="text-[10px] opacity-70 text-[#4A90D9] dark:text-[#2d6a4f]">{t("nav.book_lab_tests") || "Book lab tests & scans"}</span></div>
                  </Link>
                  <Link href="/appointments/pharma" onClick={() => setAppointmentDropdownOpen(false)} className={`flex w-full items-center rounded-lg px-3 py-2.5 text-sm transition-colors ${isSolid ? "text-[#2d6a4f] hover:bg-[#4A90D9]/10 dark:text-[#4A90D9] dark:hover:bg-[#2d6a4f]/10" : "text-white/90 hover:bg-white/20 hover:text-white"}`}>
                    <div className="flex flex-col"><span className="font-medium text-[#2d6a4f] dark:text-[#4A90D9]">{t("nav.division.pharma") || "Drug Manufacturing"}</span><span className="text-[10px] opacity-70 text-[#4A90D9] dark:text-[#2d6a4f]">{t("nav.order_medications") || "Order medications & supplies"}</span></div>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              type="button"
              className={`relative flex size-6 sm:size-8 lg:size-9 items-center justify-center rounded-lg border text-[12px] font-medium transition-colors focus:outline-none lg:hidden flex-shrink-0 ${
                isSolid
                  ? "border-[#4A90D9]/30 text-[#2d6a4f] hover:bg-[#4A90D9]/10 dark:border-[#2d6a4f]/30 dark:text-[#4A90D9] dark:hover:bg-[#2d6a4f]/10"
                  : "border-white/30 text-white hover:bg-white/20"
              }`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="size-3 sm:size-4 shrink-0" /> : <Menu className="size-3 sm:size-4 shrink-0" />}
              <span className="sr-only">{t("nav.toggle_menu") || "Toggle navigation"}</span>
            </button>
          </div>
        </nav>

        {/* MOBILE MENU */}
        <div
          ref={mobileMenuRef}
          className={`${mobileOpen ? "max-h-[85vh] opacity-100" : "max-h-0 opacity-0"} absolute left-0 right-0 top-full mt-2 overflow-hidden overflow-y-auto rounded-2xl transition-all duration-300 lg:hidden ${
            isSolid
              ? "border border-[#4A90D9]/20 bg-white/95 shadow-lg dark:border-[#2d6a4f]/30 dark:bg-slate-900/95"
              : "border border-white/20 bg-white/10 backdrop-blur-md shadow-lg"
          }`}
        >
          <div className="flex flex-col gap-0.5 p-4">
            {!isHome && (
              <Link href="/" className={`flex items-center rounded-lg p-3 font-medium transition-colors ${isSolid ? "text-[#2d6a4f] hover:bg-[#4A90D9]/10 dark:text-[#4A90D9] dark:hover:bg-[#2d6a4f]/10" : "text-white/90 hover:bg-white/20 hover:text-white"}`} onClick={closeAll}>
                {t("nav.home") || "Home"}
              </Link>
            )}

            {/* MAIN DIVISIONS */}
            {pillarItems
              .filter((item) => !activeBranchItem || item.id === activeBranchItem.id)
              .map((item) => {
                const active = isActiveLink(item.href);
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={closeAll}
                    className={`flex items-center rounded-lg p-3 font-medium transition-all duration-200 ${active
                        ? isSolid
                          ? "bg-[#4A90D9]/15 text-[#2d6a4f] dark:bg-[#2d6a4f]/20 dark:text-[#4A90D9]"
                          : "bg-white/25 text-white"
                        : isSolid
                          ? "text-[#2d6a4f] hover:bg-[#4A90D9]/10 hover:text-[#4A90D9] dark:text-[#4A90D9] dark:hover:bg-[#2d6a4f]/10 dark:hover:text-[#2d6a4f]"
                          : "text-white/90 hover:bg-white/25 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

            {/* DOCTORS */}
            <Link
              href="/doctors"
              onClick={closeAll}
              className={`flex items-center rounded-lg p-3 font-medium transition-colors ${isActiveLink("/doctors")
                  ? isSolid
                    ? "bg-[#4A90D9]/15 text-[#2d6a4f] dark:bg-[#2d6a4f]/20 dark:text-[#4A90D9]"
                    : "bg-white/25 text-white"
                  : isSolid
                    ? "text-[#2d6a4f] hover:bg-[#4A90D9]/10 dark:text-[#4A90D9] dark:hover:bg-[#2d6a4f]/10"
                    : "text-white/90 hover:bg-white/20 hover:text-white"
              }`}
            >
              {t("nav.doctors") || "Doctors"}
            </Link>

            {/* MORE with Departments in mobile */}
            <button
              type="button"
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              className={`flex w-full items-center justify-between rounded-lg p-3 font-medium transition-colors ${isSolid ? "text-[#2d6a4f] hover:bg-[#4A90D9]/10 dark:text-[#4A90D9] dark:hover:bg-[#2d6a4f]/10" : "text-white/90 hover:bg-white/20 hover:text-white"}`}
            >
              <span>{t("nav.more") || "More"}</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${moreDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {moreDropdownOpen && (
              <div className="ml-4 space-y-1 border-l-2 pl-2">
                {moreItems.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={closeAll}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${isActiveLink(item.href)
                        ? isSolid
                          ? "bg-[#4A90D9]/15 text-[#2d6a4f] dark:bg-[#2d6a4f]/20 dark:text-[#4A90D9]"
                          : "bg-white/25 text-white"
                        : isSolid
                          ? "text-[#2d6a4f] hover:bg-[#4A90D9]/10 dark:text-[#4A90D9] dark:hover:bg-[#2d6a4f]/10"
                          : "text-white/90 hover:bg-white/20 hover:text-white"
                    }`}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            {/* MOBILE BOOK SECTION */}
            <div className="mt-4 border-t border-[#4A90D9]/20 dark:border-[#2d6a4f]/30 pt-4">
              <p className="text-xs font-medium text-[#4A90D9] dark:text-[#2d6a4f] mb-2 px-1">{t("nav.book_services") || "Book Services"}</p>
              <Link href="/appointments/hospital" className={`flex items-center rounded-lg p-3 transition-colors ${isSolid ? "text-[#2d6a4f] hover:bg-[#4A90D9]/10 dark:text-[#4A90D9] dark:hover:bg-[#2d6a4f]/10" : "text-white/90 hover:bg-white/20 hover:text-white"}`} onClick={closeAll}>
                <div><div className="font-medium">{t("nav.division.hospital") || "General Hospital"}</div><div className="text-xs opacity-70 text-[#4A90D9] dark:text-[#2d6a4f]">{t("nav.book_at_hospital") || "Book at Afilas General Hospital"}</div></div>
              </Link>
              <Link href="/appointments/diagnosis" className={`flex items-center rounded-lg p-3 transition-colors ${isSolid ? "text-[#2d6a4f] hover:bg-[#4A90D9]/10 dark:text-[#4A90D9] dark:hover:bg-[#2d6a4f]/10" : "text-white/90 hover:bg-white/20 hover:text-white"}`} onClick={closeAll}>
                <div><div className="font-medium">{t("nav.division.diagnostics") || "Diagnosis Center"}</div><div className="text-xs opacity-70 text-[#4A90D9] dark:text-[#2d6a4f]">{t("nav.book_lab_tests") || "Book lab tests & scans"}</div></div>
              </Link>
              <Link href="/appointments/pharma" className={`flex items-center rounded-lg p-3 transition-colors ${isSolid ? "text-[#2d6a4f] hover:bg-[#4A90D9]/10 dark:text-[#4A90D9] dark:hover:bg-[#2d6a4f]/10" : "text-white/90 hover:bg-white/20 hover:text-white"}`} onClick={closeAll}>
                <div><div className="font-medium">{t("nav.division.pharma") || "Drug Manufacturing"}</div><div className="text-xs opacity-70 text-[#4A90D9] dark:text-[#2d6a4f]">{t("nav.order_medications") || "Order medications & supplies"}</div></div>
              </Link>
            </div>

            {/* Mobile Account Section */}
            <div className="mt-4 border-t border-[#4A90D9]/20 dark:border-[#2d6a4f]/30 pt-4">
              <p className="text-xs font-medium text-[#4A90D9] dark:text-[#2d6a4f] mb-2 px-1">{t("nav.account") || "Account"}</p>
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-[#4A90D9]/20 flex items-center justify-center">
                      <UserCircle className="w-5 h-5 text-[#2d6a4f] dark:text-[#4A90D9]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#2d6a4f] dark:text-[#4A90D9] truncate">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.email || ''}
                      </p>
                    </div>
                  </div>
                  {accountItems.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={closeAll}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${isSolid
                          ? "text-[#2d6a4f] hover:bg-[#4A90D9]/10 dark:text-[#4A90D9] dark:hover:bg-[#2d6a4f]/10"
                          : "text-white/90 hover:bg-white/20 hover:text-white"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20`}
                  >
                    <LogOut className="h-4 w-4" />
                    {t("nav.logout") || "Logout"}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={closeAll}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isSolid
                        ? "text-[#2d6a4f] hover:bg-[#4A90D9]/10 dark:text-[#4A90D9] dark:hover:bg-[#2d6a4f]/10"
                        : "text-white/90 hover:bg-white/20 hover:text-white"
                    }`}
                  >
                    <LogIn className="h-4 w-4" />
                    {t("nav.sign_in") || "Sign In"}
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeAll}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isSolid
                        ? "text-[#2d6a4f] hover:bg-[#4A90D9]/10 dark:text-[#4A90D9] dark:hover:bg-[#2d6a4f]/10"
                        : "text-white/90 hover:bg-white/20 hover:text-white"
                    }`}
                  >
                    <UserPlus className="h-4 w-4" />
                    {t("nav.create_account") || "Create Account"}
                  </Link>
                </>
              )}
            </div>

            {/* Language & Theme */}
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#4A90D9]/20 dark:border-[#2d6a4f]/30 pt-4">
              <div className="relative">
                <button type="button" onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)} className={`inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${isSolid ? "border-[#4A90D9]/30 text-[#2d6a4f] hover:bg-[#4A90D9]/10 dark:border-[#2d6a4f]/30 dark:text-[#4A90D9] dark:hover:bg-[#2d6a4f]/10" : "border-white/30 text-white hover:bg-white/20"}`}>
                  <Globe className="h-4 w-4" /><span>{getLanguageLabel()}</span><ChevronDown className="h-3 w-3" />
                </button>
                {languageDropdownOpen && (
                  <div className="absolute left-0 top-full mt-1 w-full min-w-[160px] rounded-xl border bg-white p-1 shadow-lg dark:bg-slate-900">
                    <button onClick={() => { setLanguage("en"); setLanguageDropdownOpen(false); }} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${language === "en" ? "bg-[#4A90D9]/15 text-[#2d6a4f]" : "hover:bg-[#4A90D9]/10"}`}>
                      <span>English</span>{language === "en" && <span className="ml-auto">✓</span>}
                    </button>
                    <button onClick={() => { setLanguage("am"); setLanguageDropdownOpen(false); }} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${language === "am" ? "bg-[#4A90D9]/15 text-[#2d6a4f]" : "hover:bg-[#4A90D9]/10"}`}>
                      <span>አማርኛ</span>{language === "am" && <span className="ml-auto">✓</span>}
                    </button>
                  </div>
                )}
              </div>
              {mounted && (
                <div className="relative">
                  <button type="button" onClick={() => setThemeDropdownOpen(!themeDropdownOpen)} className={`inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${isSolid ? "border-[#4A90D9]/30 text-[#2d6a4f] hover:bg-[#4A90D9]/10 dark:border-[#2d6a4f]/30 dark:text-[#4A90D9] dark:hover:bg-[#2d6a4f]/10" : "border-white/30 text-white hover:bg-white/20"}`}>
                    {theme === "light" ? <Sun className="h-4 w-4" /> : theme === "dark" ? <Moon className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                    <span>{getThemeLabel()}</span><ChevronDown className="h-3 w-3" />
                  </button>
                  {themeDropdownOpen && (
                    <div className="absolute left-0 top-full mt-1 w-full min-w-[160px] rounded-xl border bg-white p-1 shadow-lg dark:bg-slate-900">
                      <button onClick={() => { setTheme("light"); setThemeDropdownOpen(false); }} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${theme === "light" ? "bg-[#4A90D9]/15 text-[#2d6a4f]" : "hover:bg-[#4A90D9]/10"}`}>
                        <Sun className="h-4 w-4" /><span>{t("theme.light") || "Light"}</span>{theme === "light" && <span className="ml-auto">✓</span>}
                      </button>
                      <button onClick={() => { setTheme("dark"); setThemeDropdownOpen(false); }} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${theme === "dark" ? "bg-[#4A90D9]/15 text-[#2d6a4f]" : "hover:bg-[#4A90D9]/10"}`}>
                        <Moon className="h-4 w-4" /><span>{t("theme.dark") || "Dark"}</span>{theme === "dark" && <span className="ml-auto">✓</span>}
                      </button>
                      <button onClick={() => { setTheme("system"); setThemeDropdownOpen(false); }} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${theme === "system" ? "bg-[#4A90D9]/15 text-[#2d6a4f]" : "hover:bg-[#4A90D9]/10"}`}>
                        <Monitor className="h-4 w-4" /><span>{t("theme.system") || "System"}</span>{theme === "system" && <span className="ml-auto">✓</span>}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

// Set CSS variable for header offset
if (typeof window !== 'undefined') {
  const setHeaderOffset = () => {
    try {
      const topbar = document.querySelector('.topbar') as HTMLElement | null;
      const header = document.querySelector('#main-header') as HTMLElement | null;
      const topbarH = topbar ? topbar.offsetHeight : 0;
      const headerH = header ? header.offsetHeight : 0;
      
      let total = topbarH + headerH + 8;

      const path = window.location.pathname;
      if (path.startsWith('/diagnostics') || path.startsWith('/pharma')) {
        total += 100;
      }

      document.documentElement.style.setProperty('--header-offset', `${total}px`);
      document.documentElement.style.setProperty('--topbar-height', `${topbarH}px`);
    } catch (e) {
      /* ignore */
    }
  };

  setHeaderOffset();
  window.addEventListener('resize', setHeaderOffset);
}