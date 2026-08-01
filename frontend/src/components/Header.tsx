"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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
// HEADER COMPONENT
// ============================================================
export function Header() {
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [groupDropdownOpen, setGroupDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const { isScrolled } = useScroll();
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  useEffect(() => {
    setMounted(true);
    // Check if there's a saved branch in localStorage
    const savedBranch = localStorage.getItem('selected-branch');
    if (savedBranch) {
      setSelectedBranch(savedBranch);
    }
  }, []);

  // Navigation links - About Us ONLY on Home page
  const navLinks = useMemo(() => {
    const links = [
      { label: t("nav.home"), href: "/" },
      { label: t("nav.service") || "Services", href: "/services" },
      { label: t("nav.blog") || "Blog", href: "/blogs" },
    ];
    
    // About Us ONLY on Home page
    if (isHome) {
      links.push({ label: t("nav.about_us"), href: "/aboutUs" });
    }
    
    // Contact & Emergency - on Home page use #contact, otherwise /contact
    links.push({ label: t("nav.contact_emergency"), href: isHome ? "/#contact" : "/contact" });
    
    return links;
  }, [t, isHome]);

  // Afilas Group branches - with bold colors and icons in front
  const pillarItems = useMemo(
    () => [
      {
        id: "hospital",
        label: t("nav.division.hospital"),
        href: "/hospital",
        description: t("nav.division.hospital_desc"),
        icon: Building2,
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-100 dark:bg-red-900/30",
        hoverBg: "hover:bg-red-50 dark:hover:bg-red-900/20",
        borderColor: "border-red-200 dark:border-red-800",
      },
      {
        id: "diagnostics",
        label: t("nav.division.diagnostics"),
        href: "/diagnostics",
        description: t("nav.division.diagnostics_desc"),
        icon: Microscope,
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
        hoverBg: "hover:bg-blue-50 dark:hover:bg-blue-900/20",
        borderColor: "border-blue-200 dark:border-blue-800",
      },
      {
        id: "pharma",
        label: t("nav.division.pharma"),
        href: "/pharma",
        description: t("nav.division.pharma_desc"),
        icon: Pill,
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-100 dark:bg-green-900/30",
        hoverBg: "hover:bg-green-50 dark:hover:bg-green-900/20",
        borderColor: "border-green-200 dark:border-green-800",
      },
    ],
    [t],
  );

  // Handle branch selection - Navigate to the branch page
  const handleBranchSelect = (branchId: string, branchLabel: string, branchHref: string) => {
    setSelectedBranch(branchLabel);
    localStorage.setItem('selected-branch', branchLabel);
    setGroupDropdownOpen(false);
    setMobileOpen(false);
    // Navigate to the branch page
    router.push(branchHref);
  };

  // Clear selected branch - Navigate to home
  const clearSelectedBranch = () => {
    setSelectedBranch(null);
    localStorage.removeItem('selected-branch');
    router.push('/');
  };

  // Close all dropdowns
  const closeAll = () => {
    setGroupDropdownOpen(false);
    setLanguageDropdownOpen(false);
    setThemeDropdownOpen(false);
    setMobileOpen(false);
  };

  // Get current theme label
  const getThemeLabel = (): string => {
    if (theme === "light") return "Light";
    if (theme === "dark") return "Dark";
    if (theme === "system") return "System";
    return "System";
  };

  // Get current language label
  const getLanguageLabel = (): string => {
    return language === "en" ? "English" : "አማርኛ";
  };

  // Get selected branch color
  const getSelectedBranchColor = () => {
    const branch = pillarItems.find(item => item.label === selectedBranch);
    return branch ? branch.color : "text-teal-600 dark:text-teal-400";
  };

  // Get selected branch href
  const getSelectedBranchHref = () => {
    const branch = pillarItems.find(item => item.label === selectedBranch);
    return branch ? branch.href : "/";
  };

  // Get selected branch icon
  const getSelectedBranchIcon = () => {
    const branch = pillarItems.find(item => item.label === selectedBranch);
    return branch ? branch.icon : Building2;
  };

  return (
    <>
      {/* ============================================================
          TOP BAR – Emergency info
          ============================================================ */}
      <div
        className={`fixed top-0 z-50 w-full border-b transition-all duration-300 ease-in-out ${
          isScrolled
            ? "border-destructive/60 bg-destructive text-destructive-foreground"
            : "border-white/20 bg-transparent text-white"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-2 py-1 text-[10px] font-medium sm:px-4 sm:py-2 sm:text-xs lg:px-8">
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span
              className={`whitespace-nowrap ${isScrolled ? "text-destructive-foreground/80" : "text-white/90"}`}
            >
              {t("topbar.emergency_available")}
            </span>
          </div>
          <a
            href="tel:+251983201998"
            className={`inline-flex items-center gap-1 whitespace-nowrap transition-colors ${
              isScrolled
                ? "text-destructive-foreground/80 hover:text-destructive-foreground"
                : "text-white/90 hover:text-white"
            }`}
          >
            <span>{t("topbar.call")} +251 98 320 1998</span>
          </a>
        </div>
      </div>

      
      <header
        className={`fixed left-1/2 top-[36px] z-40 mx-auto flex w-[95vw] max-w-[1400px] -translate-x-1/2 rounded-2xl transition-all duration-300 ease-in-out`}
      >
        {/* Header Background */}
        <div
          className={`absolute inset-0 -z-10 rounded-2xl transition-all duration-300 ${
            isScrolled
              ? "border border-slate-200/80 bg-white/95 shadow-lg shadow-slate-200/50 backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-900/95 dark:shadow-slate-900/50"
              : "border border-white/20 bg-white/10 backdrop-blur-md shadow-lg shadow-black/10"
          }`}
        />
        
        <nav className="relative flex w-full items-center justify-between gap-2 px-2 py-2 sm:px-4 lg:px-6">
          {/* Logo with Selected Branch Name - ALWAYS VISIBLE on ALL devices */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 min-w-0 max-w-[40%] sm:max-w-none">
            <Link
              href="/"
              className="flex flex-col items-start gap-0 flex-shrink-0"
              aria-label="Afilas Group Logo"
              translate="no"
              onClick={clearSelectedBranch}
            >
              <div className="relative h-6 w-auto sm:h-9">
                <Image
                  src="/logo-header-190x49-1.png"
                  alt="Afilas Share Company Logo"
                  width={190}
                  height={49}
                  className="object-contain"
                  priority
                  style={{ 
                    height: 'auto', 
                    width: 'auto',
                    maxHeight: '24px',
                    filter: isScrolled ? 'none' : 'brightness(0) invert(1)'
                  }}
                />
              </div>
              
              <span
                className={`mt-0.5 text-[6px] sm:text-[10px] font-medium tracking-wide uppercase ${
                  isScrolled ? "text-slate-500 dark:text-slate-400" : "text-white/70"
                }`}
              >
                Share Company
              </span>
            </Link>

            {/* Selected Branch Display - Front of Logo - ALWAYS VISIBLE */}
            {selectedBranch && (
              <div className="flex items-center gap-0.5 sm:gap-1 ml-0.5 sm:ml-1 pl-1 sm:pl-2 border-l border-slate-300 dark:border-slate-600 min-w-0">
                <div className="flex items-center gap-0.5 sm:gap-1 min-w-0">
                  {(() => {
                    const IconComponent = getSelectedBranchIcon();
                    return (
                      <IconComponent 
                        className={`h-3 w-3 sm:h-5 sm:w-5 flex-shrink-0 ${isScrolled ? getSelectedBranchColor() : "text-white"}`} 
                      />
                    );
                  })()}
                  <span
                    className={`text-[8px] sm:text-sm font-bold uppercase tracking-wide truncate max-w-[50px] sm:max-w-none ${
                      isScrolled ? getSelectedBranchColor() : "text-white"
                    }`}
                  >
                    {selectedBranch}
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      clearSelectedBranch();
                    }}
                    className={`rounded-full p-0.5 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700 flex-shrink-0 ${
                      isScrolled ? "text-slate-500" : "text-white/70"
                    }`}
                    aria-label="Clear selected branch"
                  >
                    <X className="h-2 w-2 sm:h-3 sm:w-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center">
            <div className="flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
                    isScrolled
                      ? "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                      : "text-white/90 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Afilas Group Dropdown - Desktop only */}
          <div className="hidden lg:flex lg:items-center lg:gap-2">
            <div
              className="relative"
              onMouseEnter={() => setGroupDropdownOpen(true)}
              onMouseLeave={() => setGroupDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setGroupDropdownOpen(!groupDropdownOpen)}
                className={`flex items-center rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
                  isScrolled
                    ? "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    : "text-white/90 hover:bg-white/20 hover:text-white"
                } ${
                  groupDropdownOpen
                    ? isScrolled
                      ? "bg-slate-100 dark:bg-slate-800"
                      : "bg-white/20"
                    : ""
                }`}
                aria-haspopup="menu"
                aria-expanded={groupDropdownOpen}
              >
                {t("nav.group") || "Afilas Group"}
                <ChevronDown
                  className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                    groupDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Group Dropdown - 3 branches */}
              {groupDropdownOpen && (
                <div
                  className={`absolute right-0 top-full z-50 mt-2 w-[750px] rounded-2xl p-6 transition-all duration-200 ${
                    isScrolled
                      ? "border border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-2xl dark:border-slate-700/80 dark:bg-slate-900/95"
                      : "border border-white/25 bg-white/20 backdrop-blur-2xl shadow-2xl shadow-black/20"
                  }`}
                  role="menu"
                >
                  <p
                    className={`text-sm text-center ${
                      isScrolled
                        ? "text-slate-600 dark:text-slate-400"
                        : "text-white/90"
                    }`}
                  >
                    {t("nav.group_dropdown_title") || "Explore Our Divisions"}
                  </p>
                  <hr
                    className={`my-4 ${
                      isScrolled
                        ? "border-teal-300 dark:border-teal-700"
                        : "border-white/20"
                    }`}
                  />

                  <div className="grid grid-cols-3 gap-4">
                    {pillarItems.map((item) => {
                      const IconComponent = item.icon;
                      const isSelected = selectedBranch === item.label;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleBranchSelect(item.id, item.label, item.href)}
                          className={`group flex flex-col items-center text-center rounded-xl p-4 transition-all duration-300 transform hover:scale-105 ${
                            isScrolled
                              ? `hover:bg-slate-100 dark:hover:bg-slate-800 ${item.hoverBg} ${
                                  isSelected ? `${item.bgColor} ring-2 ${item.borderColor}` : ''
                                }`
                              : `hover:bg-white/20 ${
                                  isSelected ? 'bg-white/30 ring-2 ring-white/50' : ''
                                }`
                          }`}
                        >
                          <div
                            className={`mb-3 flex h-12 w-12 items-center justify-center rounded-lg transition-colors ${
                              isScrolled
                                ? `${item.bgColor} group-hover:${item.bgColor}`
                                : "bg-white/20 text-white group-hover:bg-white/30"
                            }`}
                          >
                            <IconComponent className={`h-6 w-6 ${isScrolled ? item.color : "text-white"}`} />
                          </div>
                          <div>
                            <p
                              className={`text-sm font-bold uppercase tracking-wide ${
                                isScrolled
                                  ? item.color
                                  : "text-white"
                              }`}
                            >
                              {item.label}
                            </p>
                            <p
                              className={`text-xs mt-1 ${
                                isScrolled
                                  ? "text-slate-500 dark:text-slate-400"
                                  : "text-white/70"
                              }`}
                            >
                              {item.description}
                            </p>
                            {isSelected && (
                              <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 mt-1 block">
                                ✓ Selected
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Controls with Dropdowns - MINIMIZED BOOK APPOINTMENT */}
          <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
            {/* Language Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setLanguageDropdownOpen(!languageDropdownOpen);
                  setThemeDropdownOpen(false);
                }}
                className={`inline-flex items-center gap-0.5 sm:gap-1 rounded-lg border px-1 sm:px-2 py-0.5 sm:py-1 text-[9px] sm:text-xs lg:text-sm font-medium transition-colors ${
                  isScrolled
                    ? "border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    : "border-white/30 text-white hover:bg-white/20"
                } ${
                  languageDropdownOpen
                    ? isScrolled
                      ? "bg-slate-100 dark:bg-slate-800"
                      : "bg-white/20"
                    : ""
                }`}
                aria-label="Change language"
              >
                <Globe className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                <span className="hidden sm:inline text-xs">{getLanguageLabel()}</span>
                <ChevronDown
                  className={`h-1.5 w-1.5 sm:h-3 sm:w-3 transition-transform duration-200 ${
                    languageDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {languageDropdownOpen && (
                <div
                  className={`absolute right-0 top-full z-50 mt-2 w-[160px] sm:w-[180px] rounded-2xl p-2 transition-all duration-200 ${
                    isScrolled
                      ? "border border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-2xl dark:border-slate-700/80 dark:bg-slate-900/95"
                      : "border border-white/25 bg-white/20 backdrop-blur-2xl shadow-2xl shadow-black/20"
                  }`}
                >
                  <button
                    onClick={() => {
                      setLanguage("en");
                      setLanguageDropdownOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                      language === "en"
                        ? isScrolled
                          ? "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400"
                          : "bg-white/30 text-white"
                        : isScrolled
                        ? "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                        : "text-white/90 hover:bg-white/20 hover:text-white"
                    }`}
                  >
                    <Globe className="h-4 w-4" />
                    <span>English</span>
                    {language === "en" && (
                      <span className="ml-auto text-xs">✓</span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage("am");
                      setLanguageDropdownOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                      language === "am"
                        ? isScrolled
                          ? "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400"
                          : "bg-white/30 text-white"
                        : isScrolled
                        ? "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                        : "text-white/90 hover:bg-white/20 hover:text-white"
                    }`}
                  >
                    <Globe className="h-4 w-4" />
                    <span>አማርኛ</span>
                    {language === "am" && (
                      <span className="ml-auto text-xs">✓</span>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Theme Dropdown */}
            {mounted && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setThemeDropdownOpen(!themeDropdownOpen);
                    setLanguageDropdownOpen(false);
                  }}
                  className={`inline-flex items-center gap-0.5 sm:gap-1 rounded-lg border px-1 sm:px-2 py-0.5 sm:py-1 text-[9px] sm:text-xs lg:text-sm font-medium transition-colors ${
                    isScrolled
                      ? "border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                      : "border-white/30 text-white hover:bg-white/20"
                  } ${
                    themeDropdownOpen
                      ? isScrolled
                        ? "bg-slate-100 dark:bg-slate-800"
                        : "bg-white/20"
                      : ""
                  }`}
                  aria-label="Toggle theme"
                >
                  {theme === "light" ? (
                    <Sun className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                  ) : theme === "dark" ? (
                    <Moon className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                  ) : (
                    <Monitor className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
                  )}
                  <span className="hidden sm:inline text-xs">{getThemeLabel()}</span>
                  <ChevronDown
                    className={`h-1.5 w-1.5 sm:h-3 sm:w-3 transition-transform duration-200 ${
                      themeDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {themeDropdownOpen && (
                  <div
                    className={`absolute right-0 top-full z-50 mt-2 w-[160px] sm:w-[180px] rounded-2xl p-2 transition-all duration-200 ${
                      isScrolled
                        ? "border border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-2xl dark:border-slate-700/80 dark:bg-slate-900/95"
                        : "border border-white/25 bg-white/20 backdrop-blur-2xl shadow-2xl shadow-black/20"
                    }`}
                  >
                    <button
                      onClick={() => {
                        setTheme("light");
                        setThemeDropdownOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                        theme === "light"
                          ? isScrolled
                            ? "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400"
                            : "bg-white/30 text-white"
                          : isScrolled
                          ? "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                          : "text-white/90 hover:bg-white/20 hover:text-white"
                      }`}
                    >
                      <Sun className="h-4 w-4" />
                      <span>Light</span>
                      {theme === "light" && (
                        <span className="ml-auto text-xs">✓</span>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setTheme("dark");
                        setThemeDropdownOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                        theme === "dark"
                          ? isScrolled
                            ? "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400"
                            : "bg-white/30 text-white"
                          : isScrolled
                          ? "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                          : "text-white/90 hover:bg-white/20 hover:text-white"
                      }`}
                    >
                      <Moon className="h-4 w-4" />
                      <span>Dark</span>
                      {theme === "dark" && (
                        <span className="ml-auto text-xs">✓</span>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setTheme("system");
                        setThemeDropdownOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                        theme === "system"
                          ? isScrolled
                            ? "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400"
                            : "bg-white/30 text-white"
                          : isScrolled
                          ? "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                          : "text-white/90 hover:bg-white/20 hover:text-white"
                      }`}
                    >
                      <Monitor className="h-4 w-4" />
                      <span>System</span>
                      {theme === "system" && (
                        <span className="ml-auto text-xs">✓</span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Primary CTA - MINIMIZED: Only icon + "Appointment" text */}
            <Link
              href="/register"
              className={`inline-flex items-center rounded-lg px-1.5 sm:px-2.5 py-0.5 sm:py-1.5 text-[9px] sm:text-xs lg:text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg whitespace-nowrap ${
                isScrolled
                  ? "bg-gradient-to-r from-teal-600 to-teal-700 hover:shadow-teal-600/30 dark:from-teal-500 dark:to-teal-600"
                  : "bg-gradient-to-r from-white/30 to-white/20 backdrop-blur-sm hover:bg-white/40 hover:shadow-white/20"
              }`}
            >
              <Calendar className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
              <span className="text-[7px] sm:text-xs lg:text-sm whitespace-nowrap ml-0.5 sm:ml-1">Appointment</span>
            </Link>

            {/* Mobile menu toggle - ALWAYS VISIBLE on mobile */}
            <button
              type="button"
              className={`relative flex size-6 sm:size-8 lg:size-9 items-center justify-center rounded-lg border text-[12px] font-medium transition-colors focus:outline-none lg:hidden flex-shrink-0 ${
                isScrolled
                  ? "border-slate-200 text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  : "border-white/30 text-white hover:bg-white/20"
              }`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? (
                <X className="size-3 sm:size-4 shrink-0" />
              ) : (
                <Menu className="size-3 sm:size-4 shrink-0" />
              )}
              <span className="sr-only">{t("nav.toggle_menu") || "Toggle navigation"}</span>
            </button>
          </div>
        </nav>

        {/* Mobile Navigation - Shows ALL buttons when hamburger is clicked */}
        <div
          className={`${
            mobileOpen ? "max-h-[85vh] opacity-100" : "max-h-0 opacity-0"
          } absolute left-0 right-0 top-full mt-2 overflow-hidden overflow-y-auto rounded-2xl transition-all duration-300 lg:hidden ${
            isScrolled
              ? "border border-slate-200/80 bg-white/95 shadow-lg dark:border-slate-700/80 dark:bg-slate-900/95"
              : "border border-white/20 bg-white/10 backdrop-blur-md shadow-lg"
          }`}
        >
          <div className="flex flex-col gap-0.5 p-4">
            {/* ALL Mobile Nav Links - ALWAYS visible when menu is open */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center rounded-lg p-3 font-medium transition-colors ${
                  isScrolled
                    ? "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    : "text-white/90 hover:bg-white/20 hover:text-white"
                }`}
                onClick={closeAll}
              >
                {link.label}
              </Link>
            ))}

            {/* Afilas Group - Mobile */}
            <hr className={`my-2 ${isScrolled ? "border-slate-200 dark:border-slate-700" : "border-white/20"}`} />
            
            <button
              type="button"
              onClick={() => setGroupDropdownOpen(!groupDropdownOpen)}
              className={`flex w-full items-center justify-between rounded-lg p-3 font-medium transition-colors ${
                isScrolled
                  ? "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  : "text-white/90 hover:bg-white/20 hover:text-white"
              }`}
            >
              <span>{t("nav.group") || "Afilas Group"}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  groupDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {groupDropdownOpen && (
              <div className="ml-4 space-y-1 border-l-2 pl-2">
                {pillarItems.map((item) => {
                  const IconComponent = item.icon;
                  const isSelected = selectedBranch === item.label;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleBranchSelect(item.id, item.label, item.href)}
                      className={`flex w-full items-start gap-3 rounded-lg px-3 py-2 transition-colors ${
                        isScrolled
                          ? `hover:bg-slate-100 dark:hover:bg-slate-800 ${item.hoverBg} ${
                              isSelected ? `${item.bgColor}` : ''
                            }`
                          : `hover:bg-white/20 ${
                              isSelected ? 'bg-white/30' : ''
                            }`
                      }`}
                    >
                      <IconComponent
                        className={`mt-0.5 h-5 w-5 shrink-0 ${
                          isScrolled ? item.color : "text-white"
                        }`}
                      />
                      <div className="flex-1 text-left">
                        <p
                          className={`text-sm font-bold uppercase tracking-wide ${
                            isScrolled ? item.color : "text-white"
                          }`}
                        >
                          {item.label}
                        </p>
                        <p
                          className={`text-xs ${
                            isScrolled
                              ? "text-slate-500 dark:text-slate-400"
                              : "text-white/60"
                          }`}
                        >
                          {item.description}
                        </p>
                      </div>
                      {isSelected && (
                        <span className="text-teal-600 dark:text-teal-400 text-xs font-semibold">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Mobile Controls */}
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
              {/* Language Dropdown - Mobile */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                  className={`inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    isScrolled
                      ? "border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                      : "border-white/30 text-white hover:bg-white/20"
                  }`}
                >
                  <Globe className="h-4 w-4" />
                  <span>{getLanguageLabel()}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
                {languageDropdownOpen && (
                  <div className="absolute left-0 top-full mt-1 w-full min-w-[160px] rounded-xl border bg-white p-1 shadow-lg dark:bg-slate-900">
                    <button
                      onClick={() => {
                        setLanguage("en");
                        setLanguageDropdownOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                        language === "en" ? "bg-teal-100 dark:bg-teal-900/40" : "hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span>English</span>
                      {language === "en" && <span className="ml-auto">✓</span>}
                    </button>
                    <button
                      onClick={() => {
                        setLanguage("am");
                        setLanguageDropdownOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                        language === "am" ? "bg-teal-100 dark:bg-teal-900/40" : "hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span>አማርኛ</span>
                      {language === "am" && <span className="ml-auto">✓</span>}
                    </button>
                  </div>
                )}
              </div>

              {/* Theme Dropdown - Mobile */}
              {mounted && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                    className={`inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      isScrolled
                        ? "border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        : "border-white/30 text-white hover:bg-white/20"
                    }`}
                  >
                    {theme === "light" ? (
                      <Sun className="h-4 w-4" />
                    ) : theme === "dark" ? (
                      <Moon className="h-4 w-4" />
                    ) : (
                      <Monitor className="h-4 w-4" />
                    )}
                    <span>{getThemeLabel()}</span>
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  {themeDropdownOpen && (
                    <div className="absolute left-0 top-full mt-1 w-full min-w-[160px] rounded-xl border bg-white p-1 shadow-lg dark:bg-slate-900">
                      <button
                        onClick={() => {
                          setTheme("light");
                          setThemeDropdownOpen(false);
                        }}
                        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                          theme === "light" ? "bg-teal-100 dark:bg-teal-900/40" : "hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <Sun className="h-4 w-4" />
                        <span>Light</span>
                        {theme === "light" && <span className="ml-auto">✓</span>}
                      </button>
                      <button
                        onClick={() => {
                          setTheme("dark");
                          setThemeDropdownOpen(false);
                        }}
                        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                          theme === "dark" ? "bg-teal-100 dark:bg-teal-900/40" : "hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <Moon className="h-4 w-4" />
                        <span>Dark</span>
                        {theme === "dark" && <span className="ml-auto">✓</span>}
                      </button>
                      <button
                        onClick={() => {
                          setTheme("system");
                          setThemeDropdownOpen(false);
                        }}
                        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                          theme === "system" ? "bg-teal-100 dark:bg-teal-900/40" : "hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <Monitor className="h-4 w-4" />
                        <span>System</span>
                        {theme === "system" && <span className="ml-auto">✓</span>}
                      </button>
                    </div>
                  )}
                </div>
              )}

              <Link
                href="/register"
                className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all duration-300 ${
                  isScrolled
                    ? "bg-gradient-to-r from-teal-600 to-teal-700 dark:from-teal-500 dark:to-teal-600"
                    : "bg-gradient-to-r from-white/30 to-white/20 backdrop-blur-sm"
                }`}
                onClick={closeAll}
              >
                <Calendar className="h-4 w-4 mr-1" />
                Appointment
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}