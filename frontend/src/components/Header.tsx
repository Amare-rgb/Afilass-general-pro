"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "@/contexts/ThemeProvider";
import { useLanguage } from "@/contexts/LanguageProvider";
import {
  ChevronDown,
  Globe,
  Menu,
  Moon,
  Phone,
  Sun,
  X,
  Building2,
  Microscope,
  Pill,
} from "lucide-react";

// ============================================================
// SCROLL DETECTION HOOK (Scroll position & Direction)
// ============================================================
function useScroll() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 10);

      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        // Scrolling down -> hide header
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up -> show header
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { isScrolled, isVisible };
}

// ============================================================
// HEADER COMPONENT
// ============================================================
export function Header() {
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const { isScrolled, isVisible: scrollVisible } = useScroll();
  const isVisible = scrollVisible || mobileOpen;
  const pathname = usePathname();
  const isHome = pathname === "/"; // Determine if it's the root page

  useEffect(() => {
    setMounted(true);
  }, []);

  // Dynamically switch links based on the page route
  const navLinks = useMemo(() => {
    if (isHome) {
      return [
        { label: t("nav.home"), href: "/" },
        { label: t("nav.blog") || "Blog", href: "/blogs" },
        { label: t("nav.about_us"), href: "/aboutUs" },
        { label: t("nav.contact_emergency"), href: "/#contact" },
      ];
    } else {
      return [
        { label: t("nav.home"), href: "/" },
        { label: t("nav.service") || "Service", href: "/services" },
        { label: t("nav.blog") || "Blog", href: "/blogs" },
        { label: t("nav.about_us"), href: "/aboutUs" },
      ];
    }
  }, [t, isHome]);

  const pillarItems = useMemo(
    () => [
      {
        label: t("nav.division.hospital"),
        href: "/hospital",
        description: t("nav.division.hospital_desc"),
        icon: Building2,
      },
      {
        label: t("nav.division.diagnostics"),
        href: "/diagnostics",
        description: t("nav.division.diagnostics_desc"),
        icon: Microscope,
      },
      {
        label: t("nav.division.pharma"),
        href: "/pharma",
        description: t("nav.division.pharma_desc"),
        icon: Pill,
      },
    ],
    [t],
  );

  return (
    <>
      {/* ============================================================
          TOP BAR – Emergency info (solid background when scrolled)
          ============================================================ */}
      <div
        className={`fixed top-0 z-50 w-full border-b transition-all duration-300 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${
          isScrolled
            ? "border-destructive/60 bg-destructive text-destructive-foreground"
            : "border-white/20 bg-transparent text-white"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-2 py-1 text-[10px] font-medium sm:px-4 sm:py-2 sm:text-xs lg:px-8">
          <p
            className={`whitespace-nowrap ${isScrolled ? "text-destructive-foreground/80" : "text-white/90"}`}
          >
            {t("topbar.emergency_available")}
          </p>
          <a
            href="tel:+251583201998"
            className={`inline-flex items-center gap-1 whitespace-nowrap transition-colors ${
              isScrolled
                ? "text-destructive-foreground/80 hover:text-destructive-foreground"
                : "text-white/90 hover:text-white"
            }`}
          >
            <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>{t("topbar.call")} +251 58 320 1998</span>
          </a>
        </div>
      </div>

      {/* ============================================================
          MAIN NAV – Datanova glass‑morphism (transparent at top, solid on scroll)
          ============================================================ */}
      <header
        className={`fixed start-1/2 top-[36px] z-40 mx-auto flex w-full max-w-sm flex-wrap rounded-2xl p-4 transition-all duration-300 ease-in-out sm:max-w-xl md:max-w-4xl md:flex-nowrap md:justify-start lg:max-w-5xl xl:max-w-6xl 2xl:max-w-[81rem]`}
        style={{
          transform: `translate(-50%, ${isVisible ? "0px" : "-160%"})`,
        }}
      >
        {" "}
        {/* ---- Header Background Layer (Separated so dropdown blur works) ---- */}
        <div
          className={`absolute inset-0 -z-10 rounded-2xl transition-all duration-300 ${
            isScrolled
              ? "border border-slate-200/80 bg-white/95 shadow-lg shadow-slate-200/50 backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-900/95 dark:shadow-slate-900/50"
              : "border border-white/20 bg-white/10 backdrop-blur-md shadow-lg shadow-black/10"
          }`}
        />
        <nav className="relative mx-auto w-full px-4 py-2 sm:px-6 lg:px-8 xl:flex xl:max-w-7xl xl:items-center xl:justify-between xl:gap-3 2xl:max-w-[85rem]">
          {/* ---- Logo ---- */}
          <div className="flex items-center justify-between gap-x-1">
            <Link
              href="/"
              className={`dm-sans flex-none text-2xl font-light transition-colors ${
                isScrolled
                  ? "text-slate-400 dark:text-slate-500"
                  : "text-white/80 hover:text-white"
              }`}
              aria-label="Afilas Group Logo"
              translate="no"
            >
              <span
                className={`font-semibold ${
                  isScrolled ? "text-teal-700 dark:text-teal-400" : "text-white"
                }`}
              >
                Afilas
              </span>
              Group
            </Link>

            {/* ---- Mobile menu toggle ---- */}
            <button
              type="button"
              className={`relative flex size-9 items-center justify-center rounded-lg border text-[12px] font-medium transition-colors focus:outline-none xl:hidden ${
                isScrolled
                  ? "border-slate-200 text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  : "border-white/30 text-white hover:bg-white/20"
              }`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? (
                <X className="size-4 shrink-0" />
              ) : (
                <svg
                  className="size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" x2="21" y1="6" y2="6" />
                  <line x1="3" x2="21" y1="12" y2="12" />
                  <line x1="3" x2="21" y1="18" y2="18" />
                </svg>
              )}
              <span className="sr-only">Toggle navigation</span>
            </button>
          </div>

          {/* ---- Desktop & Mobile nav ---- */}
          <div
            className={`${
              mobileOpen ? "max-h-[75vh] opacity-100" : "max-h-0 opacity-0"
            } grow basis-full overflow-hidden overflow-y-auto transition-all duration-300 xl:ml-12 xl:max-h-none xl:opacity-100 xl:overflow-visible 2xl:ml-20 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:bg-slate-100 dark:[&::-webkit-scrollbar-thumb]:bg-slate-600 dark:[&::-webkit-scrollbar-track]:bg-slate-800`}
          >
            <div className="flex flex-col gap-0.5 py-2 xl:flex-row xl:items-center xl:gap-1 xl:py-0">
              {/* ---- Nav links (Dynamic) ---- */}
              <div className="grow">
                <div className="flex flex-col gap-0.5 xl:flex-row xl:items-center xl:justify-evenly xl:gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center rounded-lg p-2 font-medium transition-colors focus:outline-none ${
                        isScrolled
                          ? "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                          : "text-white/90 hover:bg-white/20 hover:text-white"
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}

                  {/* ---- Afilas Group dropdown (desktop only) - ONLY ON HOME PAGE ---- */}
                  {isHome && (
                    <div
                      className="relative hidden xl:block"
                      onMouseEnter={() => setDropdownOpen(true)}
                      onMouseLeave={() => setDropdownOpen(false)}
                    >
                      <button
                        type="button"
                        className={`flex items-center rounded-lg p-2 font-medium transition-colors focus:outline-none ${
                          isScrolled
                            ? "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                            : "text-white/90 hover:bg-white/20 hover:text-white"
                        } ${
                          dropdownOpen
                            ? isScrolled
                              ? "bg-slate-100 dark:bg-slate-800"
                              : "bg-white/20"
                            : ""
                        }`}
                        aria-haspopup="menu"
                        aria-expanded={dropdownOpen}
                      >
                        {t("nav.group")}
                        <ChevronDown
                          className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                            dropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* ---- Mega‑menu dropdown ---- */}
                      <div
                        className={`absolute left-1/2 top-full z-50 mt-2 w-screen max-w-lg -translate-x-1/2 transform rounded-2xl p-6 transition-all duration-200 before:absolute before:-top-4 before:inset-x-0 before:h-4 before:content-[''] ${
                          isScrolled
                            ? "border border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-2xl dark:border-slate-700/80 dark:bg-slate-900/90"
                            : "border border-white/25 bg-white/20 backdrop-blur-2xl shadow-2xl shadow-black/20"
                        } ${
                          dropdownOpen
                            ? "pointer-events-auto translate-y-0 opacity-100"
                            : "pointer-events-none -translate-y-2 opacity-0"
                        }`}
                        role="menu"
                      >
                        <p
                          className={`text-sm ${
                            isScrolled
                              ? "text-slate-600 dark:text-slate-400"
                              : "text-white/90" // <-- FIXED TITLE TEXT HERE
                          }`}
                        >
                          {t("nav.group_dropdown_title")}
                        </p>
                        <hr
                          className={`my-4 ${
                            isScrolled
                              ? "border-teal-300 dark:border-teal-700"
                              : "border-white/20" // <-- FIXED DIVIDER COLOR HERE
                          }`}
                        />

                        <div className="grid gap-3 md:grid-cols-1">
                          {pillarItems.map((item) => {
                            const IconComponent = item.icon;
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                className={`group flex items-start gap-4 rounded-xl p-3 transition-colors focus:outline-none ${
                                  isScrolled
                                    ? "hover:bg-slate-100 dark:hover:bg-slate-800"
                                    : "hover:bg-white/20"
                                }`}
                                onClick={() => {
                                  setDropdownOpen(false);
                                  setMobileOpen(false);
                                }}
                              >
                                <div
                                  className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors ${
                                    isScrolled
                                      ? "bg-teal-100 text-teal-700 group-hover:bg-teal-200 dark:bg-teal-900/40 dark:text-teal-400 dark:group-hover:bg-teal-800/60"
                                      : "bg-white/20 text-white group-hover:bg-white/30"
                                  }`}
                                >
                                  <IconComponent className="h-5 w-5" />
                                </div>
                                <div>
                                  <p
                                    className={`text-sm font-medium ${
                                      isScrolled
                                        ? "text-slate-800 dark:text-slate-200"
                                        : "text-white"
                                    }`}
                                  >
                                    {item.label}
                                  </p>
                                  <p
                                    className={`text-sm ${
                                      isScrolled
                                        ? "text-slate-500 dark:text-slate-400"
                                        : "text-white/70"
                                    }`}
                                  >
                                    {item.description}
                                  </p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ---- Mobile: Pillar items as direct links - ONLY ON HOME PAGE ---- */}
                {isHome && (
                  <div className="xl:hidden">
                    <p
                      className={`mt-2 px-2 text-xs font-semibold uppercase ${
                        isScrolled
                          ? "text-slate-400 dark:text-slate-500"
                          : "text-white/60"
                      }`}
                    >
                      {t("nav.group")}
                    </p>
                    {pillarItems.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`flex items-start gap-3 rounded-lg px-2 py-2 transition-colors ${
                            isScrolled
                              ? "hover:bg-slate-100 dark:hover:bg-slate-800"
                              : "hover:bg-white/20"
                          }`}
                          onClick={() => setMobileOpen(false)}
                        >
                          <IconComponent
                            className={`mt-0.5 h-5 w-5 shrink-0 ${
                              isScrolled
                                ? "text-teal-600 dark:text-teal-400"
                                : "text-white"
                            }`}
                          />
                          <div>
                            <p
                              className={`text-sm font-medium ${
                                isScrolled
                                  ? "text-slate-800 dark:text-slate-200"
                                  : "text-white"
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
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ---- Right side: CTA + Dark toggle + Language ---- */}
              <div className="mt-5 flex flex-wrap items-center gap-x-1.5 xl:mt-0 xl:ml-6">
                {/* Language toggle */}
                <button
                  type="button"
                  onClick={() => setLanguage(language === "en" ? "am" : "en")}
                  className={`inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    isScrolled
                      ? "border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                      : "border-white/30 text-white hover:bg-white/20"
                  }`}
                  aria-label="Change language"
                >
                  <Globe className="h-4 w-4" />
                  <span>{language === "en" ? "EN" : "አማ"}</span>
                </button>

                {/* Dark mode toggle */}
                {mounted && (
                  <button
                    onClick={toggleTheme}
                    className={`inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      isScrolled
                        ? "border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                        : "border-white/30 text-white hover:bg-white/20"
                    }`}
                    aria-label="Toggle theme"
                  >
                    {theme === "light" ? (
                      <Moon className="h-4 w-4" />
                    ) : (
                      <Sun className="h-4 w-4" />
                    )}
                  </button>
                )}

                {/* Primary CTA */}
                <Link
                  href="/register"
                  className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                    isScrolled
                      ? "bg-gradient-to-r from-teal-600 to-teal-700 hover:shadow-teal-600/30 dark:from-teal-500 dark:to-teal-600"
                      : "bg-gradient-to-r from-white/30 to-white/20 backdrop-blur-sm hover:bg-white/40 hover:shadow-white/20"
                  }`}
                >
                  {t("cta.book_appointment")} / {t("cta.get_lab_results")}
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* ---- Spacer to prevent content from hiding behind fixed header (Only on subpages) ---- */}
      {/* {!isHome && (
        <div className="h-[calc(52px+80px+16px)] w-full" aria-hidden="true" />
      )} */}
    </>
  );
}
