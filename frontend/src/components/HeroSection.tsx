"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageProvider";
import { ArrowRight } from "lucide-react";
import { useTheme } from "@/contexts/ThemeProvider";

// ============================================================
// CONFIGURATION – Image & Video files (must be in /public folder)
// ============================================================
const HERO_STILL_IMAGE = "/Afilas-hospital.jpg"; // First frame
const HERO_VIDEOS = [
  "/3735734-hd_1920_1080_25fps.mp4", // Video 1
  "/istockphoto-1496722049-mp4-480x480-is.mp4", // Video 2
];

// ============================================================
// HERO SECTION COMPONENT
// ============================================================
export function HeroSection() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true); // Shows image first
  const [isVideoReady, setIsVideoReady] = useState(false);

  // Intersection Observer for viewport detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Initial load animation
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // ============================================================
  // VIDEO & IMAGE TRANSITION LOGIC
  // ============================================================
  
  // Step 1: Show the static image for a moment, then fade to video
  useEffect(() => {
    if (!isVisible) return;
    
    const timer = setTimeout(() => {
      setIsTransitioning(false); // Hides image, shows video
      setIsVideoReady(true);
    }, 1500); // Show image for 1.5 seconds

    return () => clearTimeout(timer);
  }, [isVisible]);

  // Step 2: Handle video end to swap to next video in playlist
  const handleVideoEnded = useCallback(() => {
    setCurrentVideoIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % HERO_VIDEOS.length;
      return nextIndex;
    });
  }, []);

  // Step 3: When video index changes, reload the new video
  useEffect(() => {
    if (videoRef.current && isVideoReady) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {
        // Auto-play might be blocked; we handle silently
      });
    }
  }, [currentVideoIndex, isVideoReady]);

  // ============================================================
  // PILLARS (NOW MINIMIZED & SMOOTH BLUE STYLED)
  // ============================================================
  const pillars = [
    {
      id: "hospital",
      title: "Afilas General Hospital",
      subtitle: "24/7 Patient Care",
      link: "/#afilas-general-hospital",
    },
    {
      id: "diagnostic",
      title: "Afilas Diagnostic Center",
      subtitle: "Precision Testing",
      link: "/#afilas-diagnostic-center",
    },
    {
      id: "pharma",
      title: "Afilas Drug Manufacturing",
      subtitle: "GMP Certified",
      link: "/#afilas-drug-manufacturing",
    },
  ];

  // Determine overlay opacity based on theme
  const isDark = theme === "dark";
  const overlayOpacity = isDark
    ? "from-black/70 via-black/50 to-black/80"
    : "from-black/30 via-black/15 to-black/40";

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-foreground"
      aria-label="Hero section with Afilas company overview"
    >
      {/* ============================================================
          BACKGROUND LAYER
          ============================================================ */}
      
      {/* 1. STATIC IMAGE (Shows first, then fades out) */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          isTransitioning ? "opacity-100" : "opacity-0"
        }`}
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 50%, black 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 50%, black 100%)",
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
        }}
      >
        <img
          src={HERO_STILL_IMAGE}
          alt="Afilas General Hospital"
          className="h-full w-full object-cover"
        />
      </div>

      {/* 2. VIDEO PLAYER (Fades in after image) */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          !isTransitioning && isVideoReady ? "opacity-100" : "opacity-0"
        }`}
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 50%, black 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 50%, black 100%)",
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
        }}
      >
        <video
          ref={videoRef}
          key={currentVideoIndex}
          className="h-full w-full object-cover"
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnded}
        >
          <source src={HERO_VIDEOS[currentVideoIndex]} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Dynamic overlay based on theme */}
      <div className={`absolute inset-0 bg-gradient-to-b ${overlayOpacity}`} />

      {/* Subtle overlay pattern for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.1)_100%)]" />

      {/* ============================================================
          CONTENT
          ============================================================ */}
      <div className="relative z-10 flex flex-col justify-end min-h-screen pb-6 sm:pb-10 px-4 sm:px-6 lg:px-8">
        
        {/* Main text area — positioned at lower third */}
        <div className="max-w-4xl mx-auto w-full mb-8 sm:mb-12">
          
          {/* ✅ HEADLINE */}
          <div
            className={`transition-all duration-1000 ease-out delay-150 ${
              isLoaded && isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-[1.15] tracking-tight text-center">
              {t("hero.headline")}
            </h1>
          </div>

          {/* Subheadline */}
          <div
            className={`transition-all duration-1000 ease-out delay-300 ${
              isLoaded && isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg text-white/80 leading-relaxed max-w-2xl mx-auto text-center">
              {t("hero.subheadline")}
            </p>
          </div>

          {/* CTA row */}
          <div
            className={`flex justify-center gap-3 mt-6 sm:mt-8 transition-all duration-1000 ease-out delay-450 ${
              isLoaded && isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <Link
              href="#doctors"
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              {t("hero.find_doctor")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ============================================================
            MINIMIZED SMOOTH BLUE PILLAR CARDS
            ============================================================ */}
        <div
          className={`max-w-5xl mx-auto w-full transition-all duration-1000 ease-out delay-600 ${
            isLoaded && isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          }`}
        >
          {/* Added gap-3 for tighter spacing and flex-wrap for responsiveness */}
          <div className="flex flex-row flex-wrap items-center justify-center gap-3">
            {pillars.map((pillar, index) => (
              <Link
                key={pillar.id}
                href={pillar.link}
                // 👇 CHANGED: bg-black/80 to bg-blue-600/80 for smooth blue color
                className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-blue-600/80 backdrop-blur-sm border border-blue-400/30 hover:bg-blue-600 hover:border-blue-300/50 transition-all duration-300 hover:scale-[1.02]"
                style={{
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                  <p className="text-white text-xs font-semibold tracking-wide leading-tight">
                    {pillar.title}
                  </p>
                  <p className="text-white/80 text-[10px] sm:text-[11px] leading-tight">
                    {pillar.subtitle}
                  </p>
                </div>
                <ArrowRight className="w-3 h-3 text-white/70 ml-0.5 flex-shrink-0 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" />
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}