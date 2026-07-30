"use client";

// =========================================================================
// HERO ILLUSTRATION IMAGE PATH
// Easily change this path to replace the image inside the hero illustration card.
// Supports local public folder paths (e.g., "/slider-3-bdr.jpg") or full URLs.
// The image will automatically resize & scale (object-cover) inside the card.
// =========================================================================
export const DIAGNOSTICS_HERO_IMAGE_PATH = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ06ABaH9gWCQFOInvL463yO6DzZCBFK-VkECRtvrArEQ&s";

import { useLanguage } from "@/contexts/LanguageProvider";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ChevronRight, Microscope, Activity } from "lucide-react";

export function DiagnosticsHero() {
  const { t } = useLanguage();
  const [showScroll, setShowScroll] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasExited, setHasExited] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowScroll(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Intersection observer for text enter/exit animation
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setHasExited(false);
        } else if (isInView) {
          setHasExited(true);
          setIsInView(false);
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isInView]);

  const animClass = isInView
    ? "hero-text-enter"
    : hasExited
    ? "hero-text-exit"
    : "opacity-0";

  return (
    <div ref={heroRef} 
    className="sticky top-0 h-screen overflow-hidden bg-gradient-to-br from-teal-800 via-teal-900 to-slate-950">
      {/* Background pattern overlay */}
      <div
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating decorative shapes */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="floating-shape absolute top-10 left-10 w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm" />
        <div className="floating-shape absolute bottom-20 right-20 w-48 h-48 rounded-full bg-white/5 backdrop-blur-sm" />
        <div className="floating-shape absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-teal-400/20 backdrop-blur-sm" />
        <div className="floating-shape absolute bottom-1/3 right-1/3 w-40 h-40 rounded-full bg-blue-400/10 backdrop-blur-sm" />
        <div className="floating-shape absolute top-1/3 right-10 w-20 h-20 rotate-45 bg-cyan-400/20 backdrop-blur-sm" />
        <div className="floating-shape absolute bottom-10 left-1/4 w-16 h-16 rounded-lg bg-teal-300/20 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-20 flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-y-8 lg:items-center lg:grid-cols-2 gap-x-12">
            {/* Left Column – Text and CTAs */}
            <div className="text-center lg:text-left">
              <h1
                className={`text-4xl font-bold leading-tight text-white sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight drop-shadow-md ${animClass}`}
              >
                {t("diagnostics.hero.title")}
              </h1>

              <p
                className={`mt-4 text-lg text-white/80 leading-relaxed max-w-md mx-auto lg:mx-0 ${
                  isInView ? "hero-text-enter-d1" : hasExited ? "hero-text-exit" : "opacity-0"
                }`}
              >
                {t("diagnostics.hero.subtitle")}
              </p>

              {/* Social proof */}
              <div
                className={`mt-8 flex flex-col sm:flex-row items-center gap-4 lg:justify-start ${
                  isInView ? "hero-text-enter-d2" : hasExited ? "hero-text-exit" : "opacity-0"
                }`}
              >
                <div className="flex -space-x-3 overflow-hidden">
                  <div className="inline-block w-12 h-12 rounded-full ring-2 ring-white bg-white/20 flex items-center justify-center text-white font-bold">
                    <Microscope className="w-6 h-6" />
                  </div>
                  <div className="inline-block w-12 h-12 rounded-full ring-2 ring-white bg-white/20 flex items-center justify-center text-white font-bold">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div className="inline-block w-12 h-12 rounded-full ring-2 ring-white bg-primary/40 flex items-center justify-center text-white font-bold text-sm">
                    10k+
                  </div>
                </div>
                <p className="text-sm text-white/80">
                  {t("diagnostics.hero.social_proof")}
                </p>
              </div>

              {/* Buttons */}
              <div
                className={`mt-8 flex flex-col sm:flex-row items-center gap-4 lg:justify-start ${
                  isInView ? "hero-text-enter-d3" : hasExited ? "hero-text-exit" : "opacity-0"
                }`}
              >
                <Link
                  href="#services"
                  className="inline-flex items-center px-8 py-4 text-base font-bold text-primary bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  {t("diagnostics.hero.cta1")}
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center px-8 py-4 text-base font-bold text-white bg-primary/30 backdrop-blur-sm border border-white/30 rounded-full hover:bg-primary/40 transition-all hover:scale-105"
                >
                  {t("diagnostics.hero.cta2")}
                </Link>
              </div>
            </div>

            {/* Right Column – Illustration Photo Card */}
            <div className="hidden lg:flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-md lg:max-w-lg">
                <div className="relative aspect-square rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center overflow-hidden shadow-2xl">
                  <img
                    src={DIAGNOSTICS_HERO_IMAGE_PATH}
                    alt="Afilas Diagnostics Center"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/30 rounded-full blur-xl pointer-events-none" />
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-teal-400/30 rounded-full blur-xl pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      {showScroll && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 scroll-indicator flex flex-col items-center gap-2 text-white/80">
          <span className="text-sm tracking-widest uppercase">
            {t("diagnostics.hero.scroll")}
          </span>
          <ArrowDown className="w-6 h-6 animate-bounce" />
        </div>
      )}
    </div>
  );
}
