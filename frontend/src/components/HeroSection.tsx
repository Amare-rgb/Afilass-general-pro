"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageProvider";
import { CheckCircle, Building2, Microscope, Pill, ArrowRight } from "lucide-react";

// ============================================================
// CONFIGURATION – Change these to your own images
// ============================================================
const HERO_BACKGROUNDS = [
  "./afilas.jpg", // Hospital
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&q=80", // Diagnostics
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1920&q=80", // Pharma
];

const SLIDE_INTERVAL = 3000; // milliseconds

// ============================================================
// PILLAR CARDS COMPONENT (Embedded inside Hero, NO IMAGES)
// ============================================================
function PillarCards() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const pillars = [
    {
      id: "hospital",
      title: "Afilas General Hospital",
      description: "Compassionate, specialized patient care available 24/7.",
      highlights: ["Inpatient/Outpatient", "Emergency", "Surgery", "Maternal & Child Health"],
      longDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus do eiusmod tempor, esse enim, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      icon: Building2,
      color: "text-red-600",
      borderColor: "border-red-200",
      // Replaced image with a clean solid gradient
      cardBg: "bg-gradient-to-br from-red-50 to-white dark:from-red-950/20 dark:to-gray-800",
      link: "/hospital",
      cta: "Explore Hospital Services",
      iconBg: "bg-red-100 dark:bg-red-900/30",
      delay: "0",
    },
    {
      id: "diagnostic",
      title: "Afilas Diagnosis Center",
      description: "High-precision imaging and automated laboratory testing.",
      highlights: ["Advanced Imaging (CT/MRI/X-Ray)", "Pathology", "Molecular Diagnostics"],
      longDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus do eiusmod tempor, esse enim, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      icon: Microscope,
      color: "text-blue-600",
      borderColor: "border-blue-200",
      cardBg: "bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/20 dark:to-gray-800",
      link: "/diagnostics",
      cta: "Book a Test / View Services",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      delay: "150",
    },
    {
      id: "pharma",
      title: "Afilas Drug Manufacturing",
      description: "Quality-driven, accessible pharmaceutical production meeting international standards.",
      highlights: ["Essential medicines", "High-standard formulation", "B28 distribution"],
      longDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus do eiusmod tempor, esse enim, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      icon: Pill,
      color: "text-green-600",
      borderColor: "border-green-200",
      cardBg: "bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-gray-800",
      link: "/pharma",
      cta: "View Products & Capabilities",
      iconBg: "bg-green-100 dark:bg-green-900/30",
      delay: "300",
    },
  ];

  return (
    <div
      ref={sectionRef}
      className="w-full max-w-7xl mx-auto mt-4 lg:mt-6 px-4 sm:px-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
        {pillars.map((pillar, index) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.id}
              className={`group relative flex flex-col rounded-2xl border ${pillar.borderColor} ${pillar.cardBg} overflow-hidden transition-all duration-700 transform hover:shadow-lg hover:-translate-y-1 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
              }`}
              style={{ transitionDelay: `${pillar.delay}ms` }}
            >
              {/* Top Accent Color Bar - Replaces the image */}
              <div className={`h-2 w-full ${pillar.borderColor.replace('border-', 'bg-')}`} />

              {/* Content Area */}
              <div className="flex-1 p-6 flex flex-col">
                
                {/* Header with Icon */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-xl ${pillar.iconBg} flex items-center justify-center flex-shrink-0 shadow-sm border ${pillar.borderColor}`}>
                    <Icon className={`w-6 h-6 ${pillar.color}`} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold ${pillar.color} leading-tight`}>{pillar.title}</h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{pillar.description}</p>

                {/* Highlights */}
                <div className="mb-4 space-y-1.5">
                  <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Highlights</p>
                  {pillar.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-2 transition-all duration-300 group-hover:translate-x-1">
                      <CheckCircle className={`w-4 h-4 ${pillar.color} flex-shrink-0`} />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{highlight}</span>
                    </div>
                  ))}
                </div>

                {/* Long Description - REDUCED GAP BELOW (Changed from mb-6 to mb-3) */}
                <p className="text-xs text-gray-500 dark:text-gray-500 leading-relaxed mb-3 flex-1 line-clamp-2">{pillar.longDescription}</p>

                {/* CTA Button */}
                <Link
                  href={pillar.link}
                  className={`group/cta inline-flex items-center justify-between w-full px-5 py-3 rounded-xl border ${pillar.borderColor} ${pillar.iconBg} hover:shadow-md transition-all duration-300`}
                >
                  <span className={`text-sm font-semibold ${pillar.color}`}>{pillar.cta}</span>
                  <ArrowRight className={`w-4 h-4 ${pillar.color} transition-transform duration-300 group-hover/cta:translate-x-1`} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// HERO SECTION COMPONENT
// ============================================================
export function HeroSection() {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_BACKGROUNDS.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-background flex flex-col justify-center">
      {/* FADING BACKGROUND IMAGES */}
      {HERO_BACKGROUNDS.map((src, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentIndex ? "opacity-100" : "opacity-0"}`}
        >
          <img src={src} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/50 dark:bg-black/70" />
        </div>
      ))}

      {/* CONTENT OVERLAY */}
      <div className="relative z-10 flex flex-col justify-center items-center min-h-screen pt-24 sm:pt-28 pb-6 sm:pb-8 px-4 sm:px-6 lg:px-8">
        
        {/* TOP TEXT SECTION */}
        <div className="w-full max-w-4xl mx-auto lg:text-center mb-6 lg:mb-10">
          <div className="text-left lg:text-center">
            <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl sm:leading-tight lg:text-5xl lg:leading-tight drop-shadow-lg">
              {t("hero.headline")}
            </h1>
            <p className="mt-3 text-sm font-medium text-white/95 sm:text-base sm:leading-relaxed lg:text-lg leading-relaxed drop-shadow-md max-w-2xl lg:mx-auto">
              {t("hero.subheadline")}
            </p>
          </div>
        </div>

        <div className="w-full max-w-6xl mx-auto mb-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
            <Link
              href="/hospital#doctors"
              className="flex-1 min-w-[180px] inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-full font-semibold shadow-lg border border-blue-700 hover:bg-blue-700 transition"
            >
              Find a Doctor
            </Link>
            <Link
              href="/diagnostics"
              className="flex-1 min-w-[180px] inline-flex items-center justify-center px-6 py-3 bg-yellow-400 text-slate-950 rounded-full font-semibold shadow-lg border border-yellow-500 hover:bg-yellow-300 transition"
            >
              Book Diagnostic Test
            </Link>
            <Link
              href="/pharma"
              className="flex-1 min-w-[180px] inline-flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-full font-semibold shadow-lg border border-blue-600 hover:bg-blue-600 transition"
            >
              Explore Pharma Division
            </Link>
          </div>
        </div>

        {/* PILLAR CARDS - Displayed Inside Hero Section (No Images) */}
        <PillarCards />

      </div>

      {/* Slide indicator dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {HERO_BACKGROUNDS.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "w-8 bg-primary" : "w-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}