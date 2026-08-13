"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageProvider";
import {
  Phone,
  Mail,
  MapPin,
  PhoneCall,
  FlaskRound as Flask,
  Package,
  Shield,
} from "lucide-react";

// ============================================================
// CUSTOM HOOK: Detect if element is in viewport
// ============================================================
function useInView(ref: React.RefObject<HTMLElement>) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return isInView;
}

// ============================================================
// COMPONENT
// ============================================================
export function Footer() {
  const { t } = useLanguage();
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef);

  return (
    <footer
      ref={footerRef}
      className={`w-full bg-[#EFEFEF] dark:bg-slate-900/90 text-[#1A1A1A] dark:text-white font-sans pt-12 pb-8 px-8 md:px-16 border-t border-[#E2E2E2] dark:border-slate-700 transition-all duration-700 ease-out ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Top Section: Logo & Nav Links */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16 md:mb-24">
          {/* Logo - matches navbar style */}
          <div className="md:col-span-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-2xl font-bold tracking-tight"
            >
              <span className="font-light text-slate-400 dark:text-slate-500">
                <span className="font-semibold text-teal-700 dark:text-teal-400">
                  Afilas
                </span>
                shar company
              </span>
            </Link>
            <p className="text-[#888888] dark:text-slate-400 text-sm mt-3 max-w-xs">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Column 1: Quick Links */}
          <div className="md:col-span-3">
            <h3 className="text-[#888888] dark:text-slate-400 font-normal text-base mb-4">
              {t("footer.quick_links")}
            </h3>
            <ul className="space-y-3 text-[#1A1A1A] dark:text-white font-normal text-base">
              <li>
                <Link
                  href="/#about"
                  className="hover:opacity-75 transition-opacity"
                >
                  {t("nav.about_us")}
                </Link>
              </li>
              <li>
                <Link
                  href="/hospital#departments"
                  className="hover:opacity-75 transition-opacity"
                >
                  {t("footer.hospital_departments")}
                </Link>
              </li>
              <li>
                <Link
                  href="/diagnostics#packages"
                  className="hover:opacity-75 transition-opacity"
                >
                  {t("footer.diagnostic_packages")}
                </Link>
              </li>
              <li>
                <Link
                  href="/pharma#catalog"
                  className="hover:opacity-75 transition-opacity"
                >
                  {t("footer.pharma_catalog")}
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="hover:opacity-75 transition-opacity"
                >
                  {t("footer.careers_news")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Contact Info */}
          <div className="md:col-span-3">
            <h3 className="text-[#888888] dark:text-slate-400 font-normal text-base mb-4">
              {t("contact")}
            </h3>
            <ul className="space-y-3 text-[#1A1A1A] dark:text-white font-normal text-base">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#888888] dark:text-slate-400 shrink-0 mt-0.5" />
                <span className="hover:opacity-75 transition-opacity">
                  {t("footer.address")}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#888888] dark:text-slate-400 shrink-0 mt-0.5" />
                <span className="hover:opacity-75 transition-opacity">
                  +251 58 320 4167
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-[#888888] dark:text-slate-400 shrink-0 mt-0.5" />
                <span className="hover:opacity-75 transition-opacity">
                  info@afilaspmms.com
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3: Emergency & Support */}
          <div className="md:col-span-3">
            <h3 className="text-[#888888] dark:text-slate-400 font-normal text-base mb-4">
              {t("footer.emergency_support")}
            </h3>
            <ul className="space-y-4 text-[#1A1A1A] dark:text-white font-normal text-base">
              <li>
                <div className="flex items-start gap-2">
                  <PhoneCall className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{t("footer.emergency_hotline_label")}</p>
                    <p className="text-lg font-bold text-red-600 dark:text-red-400">
                      8560
                    </p>
                    <p className="text-xs text-[#888888] dark:text-slate-400">
                      {t("footer.available_24_7")}
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-2">
                  <Flask className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">{t("footer.lab_results")}</p>
                    <Link
                      href="/diagnostics#results"
                      className="text-xs text-primary hover:underline transition-opacity"
                    >
                      {t("footer.lab_results_link")}
                    </Link>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-start gap-2">
                  <Package className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">
                      {t("footer.pharma_inquiries")}
                    </p>
                    <p className="text-xs text-[#888888] dark:text-slate-400">
                      {t("footer.pharma_inquiries_contact")}
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright & Compliance Badges */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[#777777] dark:text-slate-400 text-sm pt-8 border-t border-[#E2E2E2] dark:border-slate-700">
          <div className="flex flex-wrap items-center gap-6">
            <span>{t("footer.copyright")} {t("footer.rights_reserved")}</span>
            <Link
              href="/privacy"
              className="hover:text-[#1A1A1A] dark:hover:text-white transition-colors"
            >
              {t("footer.privacy_policy")}
            </Link>
            <Link
              href="/terms"
              className="hover:text-[#1A1A1A] dark:hover:text-white transition-colors"
            >
              {t("footer.terms_of_use")}
            </Link>
          </div>

          {/* Compliance Badges - unchanged */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-[#2B2B2B] dark:bg-slate-700 text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-sm gap-1.5">
              <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor">
                <path d="M6 0L0 2.5V6.5C0 10.2 2.6 13.6 6 14C9.4 13.6 12 10.2 12 6.5V2.5L6 0ZM6 7V11H5V7H3V6H9V7H6Z" />
              </svg>
              <span>ISO</span>
              <span className="text-[8px] font-light tracking-normal opacity-80">GMP</span>
            </div>
            <div className="w-6 h-6 rounded-full bg-[#1A1A1A] dark:bg-slate-700 flex items-center justify-center text-white text-[6px] font-bold relative">
              <span>Q</span>
              <div className="absolute inset-0 border border-dashed border-white/40 rounded-full scale-110" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}