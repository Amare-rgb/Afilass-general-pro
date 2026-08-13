"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageProvider";
import { Building2, Microscope, Pill, ArrowRight } from "lucide-react";
import { useTheme } from "@/contexts/ThemeProvider";

// ============================================================
// CONFIGURATION – Add your images here as an object
// ============================================================
const HERO_IMAGES = {
  hospital: {
    src: "./afilas.jpg",
    alt: "Afilas General Hospital",
    label: "Hospital",
  },
  diagnostics: {
    src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&q=80",
    alt: "Diagnostics Center",
    label: "Diagnostics",
  },
  pharma: {
    src: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1920&q=80",
    alt: "Pharmaceutical Manufacturing",
    label: "Pharma",
  },
  // 👇 Add more images here as needed
  emergency: {
    src: "/Afilas-Hospital-emergency.jpg",
    alt: "Emergency Services",
    label: "Emergency",
  },
  doctor: {
    src: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8aG9zcGl0YWx8ZW58MHx8MHx8fDA%3D",
    alt: "Emergency Services",
    label: "Emergency",
  },
  // research: {
  //   src: "https://images.unsplash.com/photo-1530026404488-8fd2ed1a9e6a?w=1920&q=80",
  //   alt: "Research Lab",
  //   label: "Research",
  // },
};

// Convert object to array for slideshow
const HERO_BACKGROUNDS = Object.values(HERO_IMAGES);

const SLIDE_INTERVAL = 3000; // milliseconds

// ============================================================
// HERO SECTION COMPONENT
// ============================================================
export function HeroSection() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

  // Auto-slide background images
  useEffect(() => {
    // Only auto-slide if there are images
    if (HERO_BACKGROUNDS.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_BACKGROUNDS.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!sectionRef.current || !isVisible || HERO_BACKGROUNDS.length === 0) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!isInView) return;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          setCurrentIndex((prev) => (prev + 1) % HERO_BACKGROUNDS.length);
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          setCurrentIndex((prev) =>
            prev === 0 ? HERO_BACKGROUNDS.length - 1 : prev - 1
          );
          break;
        case "Home":
          e.preventDefault();
          setCurrentIndex(0);
          break;
        case "End":
          e.preventDefault();
          setCurrentIndex(HERO_BACKGROUNDS.length - 1);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible]);

  const pillars = [
    {
      id: "hospital",
      title: t("pillars.card1_title"),
      subtitle: t("hero.hospital_subtitle"),
      icon: Building2,
      link: "/#afilas-general-hospital",
    },
    {
      id: "diagnostic",
      title: t("pillars.card2_title"),
      subtitle: t("hero.diagnostic_subtitle"),
      icon: Microscope,
      link: "/#afilas-diagnostic-center",
    },
    {
      id: "pharma",
      title: t("pillars.card3_title"),
      subtitle: t("hero.pharma_subtitle"),
      icon: Pill,
      link: "/#afilas-drug-manufacturing",
    },
  ];

  // Determine overlay opacity based on theme
  const isDark = theme === "dark";
  const overlayOpacity = isDark
    ? "from-black/70 via-black/50 to-black/80"
    : "from-black/30 via-black/15 to-black/40";

  // If no images, show a fallback
  if (HERO_BACKGROUNDS.length === 0) {
    return (
      <section className="relative min-h-screen w-full bg-foreground flex items-center justify-center">
        <div className="text-white/60 text-center">
          <p>No background images configured</p>
          <p className="text-sm mt-2">Add images to HERO_IMAGES object</p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-foreground"
      aria-label="Hero section with Afilas company overview"
    >
      {/* FADING BACKGROUND IMAGES with gradient mask */}
      {HERO_BACKGROUNDS.map((image, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
            idx === currentIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{
            // Apply mask so image is transparent on left and fully visible at 50% and beyond
            maskImage: "linear-gradient(to right, transparent 0%, black 50%, black 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 50%, black 100%)",
            maskSize: "100% 100%",
            WebkitMaskSize: "100% 100%",
          }}
        >
          <img
            src={image.src}
            alt={image.alt || ""}
            className="h-full w-full object-cover scale-105"
          />
          
          {/* Optional: Show image label during development */}
          {process.env.NODE_ENV === "development" && (
            <div className="absolute bottom-4 left-4 bg-black/50 text-white/70 text-xs px-2 py-1 rounded">
              {image.label || `Slide ${idx + 1}`}
            </div>
          )}
        </div>
      ))}

      {/* Dynamic overlay based on theme */}
      <div className={`absolute inset-0 bg-gradient-to-b ${overlayOpacity}`} />

      {/* Subtle overlay pattern for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.1)_100%)]" />

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col justify-end min-h-screen pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8">
        {/* Main text area — positioned at lower third */}
        <div className="max-w-4xl mx-auto w-full mb-10 sm:mb-14">
          {/* Company tagline */}
          <div
            className={`transition-all duration-1000 ease-out ${
              isLoaded && isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4"
            }`}
          >
            
          </div>

          {/* Headline */}
          <div
            className={`transition-all duration-1000 ease-out delay-150 ${
              isLoaded && isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.15] tracking-tight">
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
            <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg text-white/80 leading-relaxed max-w-2xl">
              {t("hero.subheadline")}
            </p>
          </div>

          {/* CTA row */}
          <div
            className={`flex flex-wrap gap-3 mt-6 sm:mt-8 transition-all duration-1000 ease-out delay-450 ${
              isLoaded && isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <Link
              href="/hospital#doctors"
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              {t("hero.find_doctor")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Three Pillar Cards */}
        <div
          className={`max-w-4xl mx-auto w-full transition-all duration-1000 ease-out delay-600 ${
            isLoaded && isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-12"
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <Link
                  key={pillar.id}
                  href={pillar.link}
                  className={`group flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/20 transition-all duration-300 hover:scale-[1.02]`}
                  style={{
                    transitionDelay: `${index * 100}ms`,
                  }}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/80 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-semibold leading-tight">
                      {pillar.title}
                    </p>
                    <p className="text-white/60 text-xs mt-0.5">
                      {pillar.subtitle}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/40 ml-auto flex-shrink-0 group-hover:text-white/70 group-hover:translate-x-0.5 transition-all duration-300" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Slide indicator dots */}
        <div
          className={`flex justify-center gap-1.5 mt-6 transition-all duration-1000 ease-out delay-800 ${
            isLoaded && isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          }`}
        >
          {HERO_BACKGROUNDS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "w-6 bg-primary"
                  : "w-1.5 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Keyboard navigation hint */}
        <div className="sr-only">
          <p>Use arrow keys to navigate slides. Press Home for first slide, End for last.</p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 right-4 z-20 hidden sm:flex items-center gap-2 text-white/20 text-xs font-mono">
        <span>← →</span>
        <span className="w-px h-3 bg-white/20" />
        <span>keyboard</span>
      </div>
    </section>
  );
}