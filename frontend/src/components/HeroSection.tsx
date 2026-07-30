"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageProvider";

// ============================================================
// CONFIGURATION – Change these to your own images
// ============================================================
const HERO_BACKGROUNDS = [
  // "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1920&q=80", // Hospital
  "./afilas.jpg", // Hospital
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&q=80", // Diagnostics
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1920&q=80", // Pharma
];

const SLIDE_INTERVAL = 3000; // milliseconds

// ============================================================
// HERO SECTION COMPONENT
// ============================================================
export function HeroSection() {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto‑advance with fade
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_BACKGROUNDS.length);
    }, SLIDE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* ============================================================
          FADING BACKGROUND IMAGES
          ============================================================ */}
      {HERO_BACKGROUNDS.map((src, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <img src={src} alt="" className="h-full w-full object-cover" />
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
        </div>
      ))}

      {/* ============================================================
          CONTENT OVERLAY – Left aligned on mobile, centered on desktop
          ============================================================ */}
      <div className="relative z-10 flex min-h-screen items-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl mx-auto lg:text-center">
          {/* Left-aligned on mobile, centered on desktop */}
          <div className="text-left lg:text-center">
            {/* Headline */}
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight drop-shadow-lg">
              {t("hero.headline")}
            </h1>

            {/* Subheadline */}
            <p className="mt-4 text-lg text-white/90 sm:text-xl leading-relaxed drop-shadow-md max-w-2xl lg:mx-auto">
              {t("hero.subheadline")}
            </p>

            {/* CTAs - Left aligned on mobile, centered on desktop */}
            <div className="mt-8 flex flex-col sm:flex-row items-start lg:items-center justify-start lg:justify-center gap-4 sm:gap-5 lg:mt-12">
              <Link
                href="/hospital#doctors"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-primary border border-transparent rounded-xl hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg"
              >
                {t("hero.cta_doctor")}
              </Link>
              <Link
                href="/diagnostics"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 shadow-lg"
              >
                {t("hero.cta_diagnostic")}
              </Link>
              <Link
                href="/pharma"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 shadow-lg"
              >
                {t("hero.cta_pharma")}
              </Link>
            </div>

            {/* Trust Badges - Left aligned on mobile, centered on desktop */}
            <div className="mt-6 flex flex-wrap items-center justify-start lg:justify-center gap-x-4 gap-y-2 text-sm font-medium text-white/90 drop-shadow-md">
              <span className="flex items-center gap-1.5">
                <span className="text-primary font-bold text-base">✓</span>
                {t("hero.badge_emergency")}
              </span>
              <span className="hidden sm:inline text-white/30 select-none">
                |
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-primary font-bold text-base">✓</span>
                {t("hero.badge_iso")}
              </span>
              <span className="hidden sm:inline text-white/30 select-none">
                |
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-primary font-bold text-base">✓</span>
                {t("hero.badge_lab")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicator dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {HERO_BACKGROUNDS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? "w-8 bg-primary"
                : "w-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
