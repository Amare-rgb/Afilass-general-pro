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
  LogIn,
  UserPlus,
  User,
} from "lucide-react";

// ============================================================
// SCROLL DETECTION HOOK
// ============================================================
function useScroll() {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return { isScrolled };
}

// ============================================================
// CUSTOM HOOK: Click outside detection
// ============================================================
function useClickOutside(ref: React.RefObject<HTMLElement>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
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
  const [groupDropdownOpen, setGroupDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [appointmentDropdownOpen, setAppointmentDropdownOpen] = useState(false);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);

  const groupDropdownRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const themeDropdownRef = useRef<HTMLDivElement>(null);
  const appointmentDropdownRef = useRef<HTMLDivElement>(null);
  const authDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { isScrolled } = useScroll();
  const pathname = usePathname();
  const router = useRouter();

  const isTransparentPage = ["/", "/blogs", "/aboutUs"].includes(pathname);
  const isSolid = isScrolled || !isTransparentPage;
  const isHome = pathname === "/";
  const isBranchPage = ["/hospital", "/diagnostics", "/pharma"].includes(pathname);

  useClickOutside(groupDropdownRef, () => setGroupDropdownOpen(false));
  useClickOutside(languageDropdownRef, () => setLanguageDropdownOpen(false));
  useClickOutside(themeDropdownRef, () => setThemeDropdownOpen(false));
  useClickOutside(appointmentDropdownRef, () => setAppointmentDropdownOpen(false));
  useClickOutside(authDropdownRef, () => setAuthDropdownOpen(false));
  useClickOutside(mobileMenuRef, () => setMobileOpen(false));

  useEffect(() => setMounted(true), []);

  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) setShowHeader(false);
      else if (currentScrollY < lastScrollY.current) setShowHeader(true);
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const pillarItems = useMemo(
    () => [
      {
        id: "hospital",
        label: "Afilas General Hospital",
        href: "/hospital",
        description: "Compassionate, specialized patient care available 24/7.",
        icon: Building2,
      },
      {
        id: "diagnostics",
        label: "Afilas Diagnosis Center",
        href: "/diagnostics",
        description: "High-precision imaging and automated laboratory testing.",
        icon: Microscope,
      },
      {
        id: "pharma",
        label: "Afilas Drug Manufacturing",
        href: "/pharma",
        description: "Quality-driven, accessible pharmaceutical production meeting international standards.",
        icon: Pill,
      },
    ],
    [],
  );

  const activeBranchItem = useMemo(() => {
    if (pathname.startsWith("/hospital")) return pillarItems.find(item => item.id === "hospital") || null;
    if (pathname.startsWith("/diagnostics")) return pillarItems.find(item => item.id === "diagnostics") || null;
    if (pathname.startsWith("/pharma")) return pillarItems.find(item => item.id === "pharma") || null;
    return null;
  }, [pathname, pillarItems]);

  const handleBranchSelect = (href: string) => {
    setGroupDropdownOpen(false);
    setMobileOpen(false);
    router.push(href);
  };

  const closeAll = () => {
    setGroupDropdownOpen(false);
    setLanguageDropdownOpen(false);
    setThemeDropdownOpen(false);
    setMobileOpen(false);
    setAppointmentDropdownOpen(false);
    setAuthDropdownOpen(false);
  };

  const goHome = () => router.push("/");
  const getThemeLabel = () => (theme === "light" ? "Light" : theme === "dark" ? "Dark" : "System");
  const getLanguageLabel = () => (language === "en" ? "English" : "አማርኛ");

  return (
    <>
      {/* TOP BAR */}
      <div className={`topbar fixed top-0 z-50 w-full border-b transition-all duration-300 ease-in-out ${isSolid ? "border-destructive/60 bg-destructive text-destructive-foreground" : "border-white/20 bg-transparent text-white"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-2 py-1 text-[10px] font-medium sm:px-4 sm:py-2 sm:text-xs lg:px-8">
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span className={`whitespace-nowrap ${isSolid ? "text-destructive-foreground/80" : "text-white/90"}`}>{t("topbar.emergency_available")}</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:+251983201998" className={`inline-flex items-center gap-1 whitespace-nowrap transition-colors ${isSolid ? "text-destructive-foreground/80 hover:text-destructive-foreground" : "text-white/90 hover:text-white"}`}>
              <span>{t("topbar.call")} +251 98 320 1998</span>
            </a>
          </div>
        </div>
      </div>

      {/* SEPARATE BRANCH TITLE BANNER (ABOVE THE HEADER) */}
      {activeBranchItem && (
        <div 
          className="fixed z-45 w-full flex justify-center pt-1 pointer-events-none"
          style={{ top: "var(--topbar-height, 36px)" }}
        >
          <div className="bg-teal-600/90 dark:bg-teal-800/90 backdrop-blur-md text-white px-5 py-1.5 rounded-full border border-teal-400/30 shadow-lg flex items-center gap-3 pointer-events-auto">
            {(() => {
              const IconComponent = activeBranchItem.icon;
              return <IconComponent className="h-4 w-4" />;
            })()}
            <span className="text-xs sm:text-sm font-bold tracking-wide uppercase">
              {activeBranchItem.label}
            </span>
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); goHome(); }} 
              className="ml-1 rounded-full p-0.5 transition-colors hover:bg-white/20 text-white/80 hover:text-white"
              aria-label="Clear selected branch"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {/* MAIN HEADER */}
      <header 
        className={`fixed left-1/2 z-40 mx-auto flex w-[95vw] max-w-[1400px] -translate-x-1/2 rounded-2xl transition-all duration-500 ease-in-out transform ${showHeader ? "translate-y-0" : "-translate-y-[calc(100%+20px)]"}`} 
        id="main-header" 
        style={{ 
          top: activeBranchItem ? "calc(var(--topbar-height, 36px) + 44px)" : "var(--topbar-height, 36px)" 
        }}
      >
        <div className={`absolute inset-0 -z-10 rounded-2xl transition-all duration-300 ${isSolid ? "border border-slate-200/80 bg-white/95 shadow-lg shadow-slate-200/50 backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-900/95 dark:shadow-slate-900/50" : "border-transparent bg-transparent shadow-none"}`} />

        <nav className="relative flex w-full items-center justify-between gap-2 px-2 py-2 sm:px-4 lg:px-6">
          
          {/* LOGO (Always on left) */}
          <div className="flex flex-1 items-center justify-start gap-2 overflow-hidden">
            <Link href="/" className="flex flex-col items-start gap-0 flex-shrink-0" aria-label="Afilas Group Logo" translate="no" onClick={goHome}>
              <div className="relative h-6 w-auto sm:h-9">
                <Image src="/Afilas-Logo-Light.png" alt="Afilas Share Company Logo" width={190} height={49} className="object-contain block dark:hidden" priority style={{ height: 'auto', width: 'auto', maxHeight: '24px' }} />
                <Image src="/Afilas-Logo-Dark.png" alt="Afilas Share Company Logo" width={190} height={49} className="object-contain hidden dark:block" priority style={{ height: 'auto', width: 'auto', maxHeight: '24px' }} />
              </div>
              <span className={`mt-0.5 text-[6px] sm:text-[10px] font-medium tracking-wide uppercase ${isSolid ? "text-slate-500 dark:text-slate-400" : "text-white/70"}`}>Share Company</span>
            </Link>
          </div>

          {/* DESKTOP NAVIGATION - MOVED TO THE FAR LEFT */}
          <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-start ml-4 xl:ml-6">
            <div className="flex items-center gap-1 xl:gap-2">
              
              {/* HOME BUTTON */}
              <Link href="/" className={`flex items-center rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${isSolid ? "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" : "text-white/90 hover:bg-white/20 hover:text-white"}`}>
                {t("nav.home") || "Home"}
              </Link>

              {/* AFILAS GROUP BRANCH DROPDOWN */}
              <div className="relative" ref={groupDropdownRef}>
                <button type="button" onClick={() => setGroupDropdownOpen(!groupDropdownOpen)} className={`flex items-center rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${isSolid ? "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" : "text-white/90 hover:bg-white/20 hover:text-white"} ${groupDropdownOpen ? (isSolid ? "bg-slate-100 dark:bg-slate-800" : "bg-white/20") : ""}`} aria-haspopup="menu" aria-expanded={groupDropdownOpen}>
                  {t("nav.group") || "Afilas Group"}
                  <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${groupDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {groupDropdownOpen && (
                  <div className={`absolute left-0 top-full z-50 mt-3 w-[800px] max-w-[90vw] rounded-2xl p-6 transition-all duration-300 shadow-2xl ${isSolid ? "bg-white/95 backdrop-blur-xl border border-slate-200/80 dark:bg-slate-900/95 dark:border-slate-700/80" : "bg-white/10 backdrop-blur-2xl border border-white/25"}`} role="menu">
                    <div className="text-center mb-6">
                      <p className={`text-sm font-bold tracking-wide uppercase ${isSolid ? "text-slate-800 dark:text-slate-200" : "text-white"}`}>Explore Our Divisions</p>
                      <div className={`w-12 h-0.5 mx-auto mt-2 rounded-full ${isSolid ? "bg-teal-600" : "bg-white/50"}`}></div>
                    </div>
                    <div className="grid grid-cols-3 gap-5">
                      {pillarItems.map((item) => {
                        const IconComponent = item.icon;
                        const isSelected = activeBranchItem?.id === item.id;
                        return (
                          <button key={item.id} onClick={() => handleBranchSelect(item.href)} className={`group flex flex-col items-center text-center rounded-xl p-6 transition-all duration-300 hover:scale-[1.02] ${isSolid ? `hover:bg-slate-100 dark:hover:bg-slate-800 border-2 ${isSelected ? 'border-teal-500 dark:border-teal-400 bg-slate-100 dark:bg-slate-800' : 'border-transparent'}` : `hover:bg-white/20 border-2 ${isSelected ? 'border-white/60 bg-white/20' : 'border-transparent'}`}`}>
                            <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 ${isSolid ? "bg-slate-100 dark:bg-slate-800" : "bg-white/20"}`}>
                              <IconComponent className={`h-8 w-8 ${isSolid ? "text-slate-700 dark:text-slate-300" : "text-white"}`} />
                            </div>
                            <div className="space-y-1.5">
                              <p className={`text-sm font-bold uppercase tracking-wide ${isSolid ? "text-slate-800 dark:text-slate-200" : "text-white"}`}>{item.label}</p>
                              <p className={`text-[10px] leading-relaxed max-w-[180px] mx-auto ${isSolid ? "text-slate-500 dark:text-slate-400" : "text-white/80"}`}>{item.description}</p>
                              {isSelected && <span className="inline-block mt-2 px-3 py-0.5 text-[9px] font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30 rounded-full border border-teal-200 dark:border-teal-800">✓ Currently Active</span>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* PER-BRANCH DROPDOWN MENU (Contact, Services, Doctors) */}
              {isBranchPage && activeBranchItem && (
                <div className="relative group">
                  <button className={`flex items-center rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${isSolid ? "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" : "text-white/90 hover:bg-white/20 hover:text-white"}`}>
                    {activeBranchItem.label.split(" ").slice(1).join(" ")} Menu
                    <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:rotate-180" />
                  </button>
                  <div className="absolute left-0 top-full z-50 mt-2 w-[240px] rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-xl border border-slate-200/80 bg-white/95 backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/95 p-2">
                    <div className="flex flex-col gap-1">
                      <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 mb-1">Quick Links</div>
                      <Link href="/contact" className="flex items-center rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors">
                        Contact & Emergency
                      </Link>
                      <Link href="/services" className="flex items-center rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors">
                        Services
                      </Link>
                      <Link href="/doctors" className="flex items-center rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors">
                        Doctors
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Global Links (Always Visible) */}
              <Link href="/aboutUs" className={`flex items-center rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${isSolid ? "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" : "text-white/90 hover:bg-white/20 hover:text-white"}`}>About Us</Link>
              <Link href="/blogs" className={`flex items-center rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${isSolid ? "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" : "text-white/90 hover:bg-white/20 hover:text-white"}`}>Blog</Link>
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
            
            {/* Appointment (Book) Button */}
            <div className="relative" ref={appointmentDropdownRef}>
              <button type="button" onClick={() => setAppointmentDropdownOpen(!appointmentDropdownOpen)} className={`inline-flex items-center rounded-lg px-1.5 sm:px-3 py-0.5 sm:py-1.5 text-[9px] sm:text-xs lg:text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg whitespace-nowrap ${isSolid ? "bg-gradient-to-r from-teal-600 to-teal-700 hover:shadow-teal-600/30 dark:from-teal-500 dark:to-teal-600" : "bg-gradient-to-r from-white/30 to-white/20 backdrop-blur-sm hover:bg-white/40 hover:shadow-white/20"} ${appointmentDropdownOpen ? (isSolid ? "ring-2 ring-teal-400" : "ring-2 ring-white/50") : ""}`} aria-haspopup="true" aria-expanded={appointmentDropdownOpen}>
                <Calendar className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                <span className="text-[7px] sm:text-xs lg:text-sm whitespace-nowrap ml-0.5 sm:ml-1">Book</span>
                <ChevronDown className={`h-1.5 w-1.5 sm:h-3 sm:w-3 ml-0.5 sm:ml-1 transition-transform duration-200 ${appointmentDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {appointmentDropdownOpen && (
                <div className={`absolute right-0 top-full z-50 mt-2 w-[200px] rounded-2xl p-2 transition-all duration-200 ${isSolid ? "border border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-2xl dark:border-slate-700/80 dark:bg-slate-900/95" : "border border-white/25 bg-white/20 backdrop-blur-2xl shadow-2xl shadow-black/20"}`}>
                  <Link href="/appointments/hospital" onClick={() => setAppointmentDropdownOpen(false)} className={`flex w-full items-center rounded-lg px-3 py-2.5 text-sm transition-colors ${isSolid ? "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" : "text-white/90 hover:bg-white/20 hover:text-white"}`}>
                    <div className="flex flex-col"><span className="font-medium">General Hospital</span><span className="text-[10px] opacity-70">Book at Afilas General Hospital</span></div>
                  </Link>
                  <Link href="/appointments/diagnosis" onClick={() => setAppointmentDropdownOpen(false)} className={`flex w-full items-center rounded-lg px-3 py-2.5 text-sm transition-colors ${isSolid ? "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" : "text-white/90 hover:bg-white/20 hover:text-white"}`}>
                    <div className="flex flex-col"><span className="font-medium">Diagnosis Center</span><span className="text-[10px] opacity-70">Book lab tests & scans</span></div>
                  </Link>
                  <Link href="/orders/pharma" onClick={() => setAppointmentDropdownOpen(false)} className={`flex w-full items-center rounded-lg px-3 py-2.5 text-sm transition-colors ${isSolid ? "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" : "text-white/90 hover:bg-white/20 hover:text-white"}`}>
                    <div className="flex flex-col"><span className="font-medium">Drug Manufacturing</span><span className="text-[10px] opacity-70">Order medications & supplies</span></div>
                  </Link>
                </div>
              )}
            </div>

            {/* NEW: Login / Register Dropdown (Next to Book button) */}
            {mounted && (
              <div className="relative" ref={authDropdownRef}>
                <button 
                  type="button" 
                  onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
                  className={`inline-flex items-center gap-1 rounded-lg border px-1.5 sm:px-2 py-0.5 sm:py-1 text-[9px] sm:text-xs lg:text-sm font-medium transition-colors ${isSolid ? "border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800" : "border-white/30 text-white hover:bg-white/20"} ${authDropdownOpen ? (isSolid ? "bg-slate-100 dark:bg-slate-800" : "bg-white/20") : ""}`}
                >
                  <User className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                  <span className="hidden sm:inline text-xs">Account</span>
                  <ChevronDown className={`h-1.5 w-1.5 sm:h-3 sm:w-3 transition-transform duration-200 ${authDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {authDropdownOpen && (
                  <div className={`absolute right-0 top-full z-50 mt-2 w-[160px] sm:w-[180px] rounded-2xl p-2 transition-all duration-200 ${isSolid ? "border border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-2xl dark:border-slate-700/80 dark:bg-slate-900/95" : "border border-white/25 bg-white/20 backdrop-blur-2xl shadow-2xl shadow-black/20"}`}>
                    <Link href="/login" onClick={() => setAuthDropdownOpen(false)} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${isSolid ? "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" : "text-white/90 hover:bg-white/20 hover:text-white"}`}>
                      <LogIn className="h-4 w-4" /><span>Login</span>
                    </Link>
                    <Link href="/register" onClick={() => setAuthDropdownOpen(false)} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${isSolid ? "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" : "text-white/90 hover:bg-white/20 hover:text-white"}`}>
                      <UserPlus className="h-4 w-4" /><span>Register</span>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Language */}
            <div className="relative" ref={languageDropdownRef}>
              <button type="button" onClick={() => { setLanguageDropdownOpen(!languageDropdownOpen); setThemeDropdownOpen(false); }} className={`inline-flex items-center gap-0.5 sm:gap-1 rounded-lg border px-1 sm:px-2 py-0.5 sm:py-1 text-[9px] sm:text-xs lg:text-sm font-medium transition-colors ${isSolid ? "border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800" : "border-white/30 text-white hover:bg-white/20"} ${languageDropdownOpen ? (isSolid ? "bg-slate-100 dark:bg-slate-800" : "bg-white/20") : ""}`} aria-label="Change language">
                <Globe className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                <span className="hidden sm:inline text-xs">{getLanguageLabel()}</span>
                <ChevronDown className={`h-1.5 w-1.5 sm:h-3 sm:w-3 transition-transform duration-200 ${languageDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {languageDropdownOpen && (
                <div className={`absolute right-0 top-full z-50 mt-2 w-[160px] sm:w-[180px] rounded-2xl p-2 transition-all duration-200 ${isSolid ? "border border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-2xl dark:border-slate-700/80 dark:bg-slate-900/95" : "border border-white/25 bg-white/20 backdrop-blur-2xl shadow-2xl shadow-black/20"}`}>
                  <button onClick={() => { setLanguage("en"); setLanguageDropdownOpen(false); }} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${language === "en" ? (isSolid ? "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400" : "bg-white/30 text-white") : (isSolid ? "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" : "text-white/90 hover:bg-white/20 hover:text-white")}`}>
                    <Globe className="h-4 w-4" /><span>English</span>{language === "en" && <span className="ml-auto text-xs">✓</span>}
                  </button>
                  <button onClick={() => { setLanguage("am"); setLanguageDropdownOpen(false); }} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${language === "am" ? (isSolid ? "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400" : "bg-white/30 text-white") : (isSolid ? "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" : "text-white/90 hover:bg-white/20 hover:text-white")}`}>
                    <Globe className="h-4 w-4" /><span>አማርኛ</span>{language === "am" && <span className="ml-auto text-xs">✓</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Theme */}
            {mounted && (
              <div className="relative" ref={themeDropdownRef}>
                <button type="button" onClick={() => { setThemeDropdownOpen(!themeDropdownOpen); setLanguageDropdownOpen(false); }} className={`inline-flex items-center gap-0.5 sm:gap-1 rounded-lg border px-1 sm:px-2 py-0.5 sm:py-1 text-[9px] sm:text-xs lg:text-sm font-medium transition-colors ${isSolid ? "border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800" : "border-white/30 text-white hover:bg-white/20"} ${themeDropdownOpen ? (isSolid ? "bg-slate-100 dark:bg-slate-800" : "bg-white/20") : ""}`} aria-label="Toggle theme">
                  {theme === "light" ? <Sun className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" /> : theme === "dark" ? <Moon className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" /> : <Monitor className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />}
                  <span className="hidden sm:inline text-xs">{getThemeLabel()}</span>
                  <ChevronDown className={`h-1.5 w-1.5 sm:h-3 sm:w-3 transition-transform duration-200 ${themeDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                {themeDropdownOpen && (
                  <div className={`absolute right-0 top-full z-50 mt-2 w-[160px] sm:w-[180px] rounded-2xl p-2 transition-all duration-200 ${isSolid ? "border border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-2xl dark:border-slate-700/80 dark:bg-slate-900/95" : "border border-white/25 bg-white/20 backdrop-blur-2xl shadow-2xl shadow-black/20"}`}>
                    <button onClick={() => { setTheme("light"); setThemeDropdownOpen(false); }} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${theme === "light" ? (isSolid ? "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400" : "bg-white/30 text-white") : (isSolid ? "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" : "text-white/90 hover:bg-white/20 hover:text-white")}`}>
                      <Sun className="h-4 w-4" /><span>Light</span>{theme === "light" && <span className="ml-auto text-xs">✓</span>}
                    </button>
                    <button onClick={() => { setTheme("dark"); setThemeDropdownOpen(false); }} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${theme === "dark" ? (isSolid ? "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400" : "bg-white/30 text-white") : (isSolid ? "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" : "text-white/90 hover:bg-white/20 hover:text-white")}`}>
                      <Moon className="h-4 w-4" /><span>Dark</span>{theme === "dark" && <span className="ml-auto text-xs">✓</span>}
                    </button>
                    <button onClick={() => { setTheme("system"); setThemeDropdownOpen(false); }} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${theme === "system" ? (isSolid ? "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400" : "bg-white/30 text-white") : (isSolid ? "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" : "text-white/90 hover:bg-white/20 hover:text-white")}`}>
                      <Monitor className="h-4 w-4" /><span>System</span>{theme === "system" && <span className="ml-auto text-xs">✓</span>}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile toggle */}
            <button type="button" className={`relative flex size-6 sm:size-8 lg:size-9 items-center justify-center rounded-lg border text-[12px] font-medium transition-colors focus:outline-none lg:hidden flex-shrink-0 ${isSolid ? "border-slate-200 text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" : "border-white/30 text-white hover:bg-white/20"}`} onClick={() => setMobileOpen(!mobileOpen)} aria-expanded={mobileOpen} aria-label="Toggle navigation">
              {mobileOpen ? <X className="size-3 sm:size-4 shrink-0" /> : <Menu className="size-3 sm:size-4 shrink-0" />}
              <span className="sr-only">{t("nav.toggle_menu") || "Toggle navigation"}</span>
            </button>
          </div>
        </nav>

        {/* MOBILE MENU */}
        <div ref={mobileMenuRef} className={`${mobileOpen ? "max-h-[85vh] opacity-100" : "max-h-0 opacity-0"} absolute left-0 right-0 top-full mt-2 overflow-hidden overflow-y-auto rounded-2xl transition-all duration-300 lg:hidden ${isSolid ? "border border-slate-200/80 bg-white/95 shadow-lg dark:border-slate-700/80 dark:bg-slate-900/95" : "border border-white/20 bg-white/10 backdrop-blur-md shadow-lg"}`}>
          <div className="flex flex-col gap-0.5 p-4">
            
            {/* HOME BUTTON (First in Mobile too) */}
            <Link href="/" className={`flex items-center rounded-lg p-3 font-medium transition-colors ${isSolid ? "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" : "text-white/90 hover:bg-white/20 hover:text-white"}`} onClick={closeAll}>
              {t("nav.home") || "Home"}
            </Link>

            <button type="button" onClick={() => setGroupDropdownOpen(!groupDropdownOpen)} className={`flex w-full items-center justify-between rounded-lg p-3 font-medium transition-colors ${isSolid ? "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" : "text-white/90 hover:bg-white/20 hover:text-white"}`}>
              <span>{t("nav.group") || "Afilas Group"}</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${groupDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {groupDropdownOpen && (
              <div className="ml-4 space-y-1 border-l-2 pl-2">
                {pillarItems.map((item) => {
                  const IconComponent = item.icon;
                  const isSelected = activeBranchItem?.id === item.id;
                  return (
                    <button key={item.id} onClick={() => handleBranchSelect(item.href)} className={`flex w-full items-start gap-3 rounded-lg px-3 py-2 transition-colors ${isSolid ? `hover:bg-slate-100 dark:hover:bg-slate-800 ${isSelected ? 'bg-slate-100 dark:bg-slate-800' : ''}` : `hover:bg-white/20 ${isSelected ? 'bg-white/30' : ''}`}`}>
                      <IconComponent className={`mt-0.5 h-5 w-5 shrink-0 ${isSolid ? "text-slate-700 dark:text-slate-300" : "text-white"}`} />
                      <div className="flex-1 text-left">
                        <p className={`text-sm font-bold uppercase tracking-wide ${isSolid ? "text-slate-800 dark:text-slate-200" : "text-white"}`}>{item.label}</p>
                        <p className={`text-xs ${isSolid ? "text-slate-500 dark:text-slate-400" : "text-white/60"}`}>{item.description}</p>
                      </div>
                      {isSelected && <span className="text-teal-600 dark:text-teal-400 text-xs font-semibold">✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
            
            <Link href="/aboutUs" className={`flex items-center rounded-lg p-3 font-medium transition-colors ${isSolid ? "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" : "text-white/90 hover:bg-white/20 hover:text-white"}`} onClick={closeAll}>
              {t("nav.about_us") || "About Us"}
            </Link>
            <Link href="/blogs" className={`flex items-center rounded-lg p-3 font-medium transition-colors ${isSolid ? "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" : "text-white/90 hover:bg-white/20 hover:text-white"}`} onClick={closeAll}>
              {t("nav.blog") || "Blog"}
            </Link>
            
            {/* Branch-specific Mobile Links (Contact, Services, Doctors) */}
            {isBranchPage && (
               <div className="ml-4 space-y-1 border-l-2 border-teal-500 dark:border-teal-400 pl-2 mt-2">
                 <p className="text-xs font-bold text-teal-600 dark:text-teal-400 px-3 py-1">Branch Links</p>
                 <Link href="/contact" className={`flex items-center rounded-lg p-3 font-medium transition-colors ${isSolid ? "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" : "text-white/90 hover:bg-white/20 hover:text-white"}`} onClick={closeAll}>
                   Contact & Emergency
                 </Link>
                 <Link href="/services" className={`flex items-center rounded-lg p-3 font-medium transition-colors ${isSolid ? "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" : "text-white/90 hover:bg-white/20 hover:text-white"}`} onClick={closeAll}>
                   Services
                 </Link>
                 <Link href="/doctors" className={`flex items-center rounded-lg p-3 font-medium transition-colors ${isSolid ? "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" : "text-white/90 hover:bg-white/20 hover:text-white"}`} onClick={closeAll}>
                   Doctors
                 </Link>
               </div>
            )}

            <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 px-1">Book Services</p>
              <Link href="/appointments/hospital" className={`flex items-center rounded-lg p-3 transition-colors ${isSolid ? "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" : "text-white/90 hover:bg-white/20 hover:text-white"}`} onClick={closeAll}>
                <div><div className="font-medium">General Hospital</div><div className="text-xs opacity-70">Book at Afilas General Hospital</div></div>
              </Link>
              <Link href="/appointments/diagnosis" className={`flex items-center rounded-lg p-3 transition-colors ${isSolid ? "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" : "text-white/90 hover:bg-white/20 hover:text-white"}`} onClick={closeAll}>
                <div><div className="font-medium">Diagnosis Center</div><div className="text-xs opacity-70">Book lab tests & scans</div></div>
              </Link>
              <Link href="/orders/pharma" className={`flex items-center rounded-lg p-3 transition-colors ${isSolid ? "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" : "text-white/90 hover:bg-white/20 hover:text-white"}`} onClick={closeAll}>
                <div><div className="font-medium">Drug Manufacturing</div><div className="text-xs opacity-70">Order medications & supplies</div></div>
              </Link>
            </div>
            
            {/* Mobile Login & Register */}
            {mounted && (
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center gap-4 justify-center">
                <Link href="/login" className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${isSolid ? "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" : "text-white/90 hover:bg-white/20 hover:text-white"}`} onClick={closeAll}>
                  <LogIn className="h-4 w-4" /> Login
                </Link>
                <div className="h-5 w-px bg-slate-300 dark:bg-slate-600"></div>
                <Link href="/register" className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${isSolid ? "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" : "text-white/90 hover:bg-white/20 hover:text-white"}`} onClick={closeAll}>
                  <UserPlus className="h-4 w-4" /> Register
                </Link>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
              <div className="relative">
                <button type="button" onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)} className={`inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${isSolid ? "border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800" : "border-white/30 text-white hover:bg-white/20"}`}>
                  <Globe className="h-4 w-4" /><span>{getLanguageLabel()}</span><ChevronDown className="h-3 w-3" />
                </button>
                {languageDropdownOpen && (
                  <div className="absolute left-0 top-full mt-1 w-full min-w-[160px] rounded-xl border bg-white p-1 shadow-lg dark:bg-slate-900">
                    <button onClick={() => { setLanguage("en"); setLanguageDropdownOpen(false); }} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${language === "en" ? "bg-teal-100 dark:bg-teal-900/40" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
                      <span>English</span>{language === "en" && <span className="ml-auto">✓</span>}
                    </button>
                    <button onClick={() => { setLanguage("am"); setLanguageDropdownOpen(false); }} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${language === "am" ? "bg-teal-100 dark:bg-teal-900/40" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
                      <span>አማርኛ</span>{language === "am" && <span className="ml-auto">✓</span>}
                    </button>
                  </div>
                )}
              </div>
              {mounted && (
                <div className="relative">
                  <button type="button" onClick={() => setThemeDropdownOpen(!themeDropdownOpen)} className={`inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${isSolid ? "border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800" : "border-white/30 text-white hover:bg-white/20"}`}>
                    {theme === "light" ? <Sun className="h-4 w-4" /> : theme === "dark" ? <Moon className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                    <span>{getThemeLabel()}</span><ChevronDown className="h-3 w-3" />
                  </button>
                  {themeDropdownOpen && (
                    <div className="absolute left-0 top-full mt-1 w-full min-w-[160px] rounded-xl border bg-white p-1 shadow-lg dark:bg-slate-900">
                      <button onClick={() => { setTheme("light"); setThemeDropdownOpen(false); }} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${theme === "light" ? "bg-teal-100 dark:bg-teal-900/40" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
                        <Sun className="h-4 w-4" /><span>Light</span>{theme === "light" && <span className="ml-auto">✓</span>}
                      </button>
                      <button onClick={() => { setTheme("dark"); setThemeDropdownOpen(false); }} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${theme === "dark" ? "bg-teal-100 dark:bg-teal-900/40" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
                        <Moon className="h-4 w-4" /><span>Dark</span>{theme === "dark" && <span className="ml-auto">✓</span>}
                      </button>
                      <button onClick={() => { setTheme("system"); setThemeDropdownOpen(false); }} className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${theme === "system" ? "bg-teal-100 dark:bg-teal-900/40" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
                        <Monitor className="h-4 w-4" /><span>System</span>{theme === "system" && <span className="ml-auto">✓</span>}
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
    } catch (e) { /* ignore */ }
  };

  setHeaderOffset();
  window.addEventListener('resize', setHeaderOffset);
}