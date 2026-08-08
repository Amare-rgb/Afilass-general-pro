"use client";

// =========================================================================
// HERO ILLUSTRATION IMAGE PATH
// Easily change this path to replace the image inside the hero illustration card.
// Supports local public folder paths (e.g., "/slider-3-bdr.jpg") or full URLs.
// The image will automatically resize & scale (object-cover) inside the card.
// =========================================================================
export const DIAGNOSTICS_HERO_IMAGE_PATH = "/lab2.jpg";

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
    <div ref={heroRef} className="relative min-h-screen py-12 lg:py-0 overflow-hidden flex items-center justify-center">
      {/* Background pattern overlay - retained pattern with high-contrast primary tint */}
      <div
        className="absolute inset-0 z-0 opacity-15 dark:opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230f6e5f' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating decorative shapes */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="floating-shape absolute top-10 left-10 w-32 h-32 rounded-full bg-primary/10 dark:bg-primary/20 backdrop-blur-sm border border-primary/10" />
        <div className="floating-shape absolute bottom-20 right-20 w-48 h-48 rounded-full bg-teal-500/10 dark:bg-teal-400/10 backdrop-blur-sm border border-teal-500/10" />
        <div className="floating-shape absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-emerald-500/10 dark:bg-emerald-400/15 backdrop-blur-sm" />
        <div className="floating-shape absolute bottom-1/3 right-1/3 w-40 h-40 rounded-full bg-cyan-500/10 dark:bg-cyan-400/10 backdrop-blur-sm" />
        <div className="floating-shape absolute top-1/3 right-10 w-20 h-20 rotate-45 bg-primary/15 dark:bg-primary/20 backdrop-blur-sm" />
        <div className="floating-shape absolute bottom-10 left-1/4 w-16 h-16 rounded-lg bg-teal-400/15 dark:bg-teal-300/20 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-20 flex items-center justify-center w-full px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-y-8 lg:items-center lg:grid-cols-2 gap-x-12">
            {/* Left Column – Text and CTAs */}
            <div className="text-center lg:text-left">
              <h1
                className={`text-4xl font-extrabold leading-tight text-foreground sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight ${animClass}`}
              >
                {t("diagnostics.hero.title")}
              </h1>

              <p
                className={`mt-4 text-lg text-muted-foreground font-medium leading-relaxed max-w-md mx-auto lg:mx-0 ${
                  isInView ? "hero-text-enter-d1" : hasExited ? "hero-text-exit" : "opacity-0"
                }`}
              >
                {t("diagnostics.hero.subtitle")}
              </p>

              {/* Buttons */}
              <div
                className={`mt-8 flex flex-col sm:flex-row items-center gap-4 lg:justify-start ${
                  isInView ? "hero-text-enter-d3" : hasExited ? "hero-text-exit" : "opacity-0"
                }`}
              >
                <Link
                  href="#packages"
                  className="inline-flex items-center px-8 py-4 text-base font-bold text-primary-foreground bg-primary hover:bg-primary/90 rounded-full shadow-lg shadow-primary/20 transition-all hover:scale-105"
                >
                  {t("diagnostics.hero.cta1")}
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center px-8 py-4 text-base font-bold text-foreground bg-muted hover:bg-muted/80 border border-border rounded-full transition-all hover:scale-105"
                >
                  {t("diagnostics.hero.cta2")}
                </Link>
              </div>
            </div>

            {/* Right Column – Illustration Photo Card */}
            <div className="hidden lg:flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-md lg:max-w-lg">
                <div className="relative aspect-square rounded-2xl bg-card border border-border flex items-center justify-center overflow-hidden shadow-2xl">
                  <img
                    src={DIAGNOSTICS_HERO_IMAGE_PATH}
                    alt=""
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/20 rounded-full blur-xl pointer-events-none" />
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-teal-400/20 rounded-full blur-xl pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      {showScroll && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 scroll-indicator flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-sm font-semibold tracking-widest uppercase">
            {t("diagnostics.hero.scroll")}
          </span>
          <ArrowDown className="w-6 h-6 animate-bounce text-primary" />
        </div>
      )}
    </div>
  );
}