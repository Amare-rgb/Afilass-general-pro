"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageProvider";

// ============================================================
// CONFIGURATION – Local image path
// ============================================================
const GENERAL_IMAGE = {
  src: "/Afilas-hospital.jpg",
  alt: "Afilas General Hospital building",
};

// ============================================================
// COMPONENT
// ============================================================
export function GeneralSec() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Feature list – using translations (icons replaced with emojis)
  const features = [
    { icon: "", label: t("general.feature1") },
    { icon: "", label: t("general.feature2") },
    { icon: "", label: t("general.feature3") },
    { icon: "", label: t("general.feature4") },
    { icon: "", label: t("general.feature5") },
  ];

  return (
    <section
      id="afilas-general-hospital"
      ref={sectionRef}
      className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden"
    >
      {/* Subtle background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* ============================================================
            Main content: two-column layout
            ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left column – Title Card + Feature list */}
          <div
            className={`space-y-3 transition-all duration-700 ease-out delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {/* ✅ TITLE CARD - GREEN TEXT (same color for normal & hover) */}
            <div className="transition-all duration-700 ease-out">
              <Link
                href="/hospital"
                className="group relative block transition-all duration-300 hover:scale-[1.02] active:scale-95"
              >
                {/* Glow effect behind the title card on hover - GREEN GLOW */}
                <div className="absolute -inset-1 bg-[#2d6a4f]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* The title card itself - NO BACKGROUND COLOR (transparent) */}
                <div className="relative bg-transparent group-hover:bg-transparent rounded-2xl px-8 py-4 shadow-none group-hover:shadow-xl transition-all duration-500">
                  {/* ✅ GREEN TEXT - SAME IN NORMAL AND HOVER */}
                  <h2 className="text-3xl sm:text-4xl font-bold text-[#2d6a4f] tracking-tight group-hover:text-[#2d6a4f] transition-colors duration-300">
                    {t("general.title")}
                  </h2>
                </div>
              </Link>
            </div>

            {/* Feature list */}
            <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-sm space-y-3">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs">{feature.icon}</span>
                  </div>
                  <span className="text-sm text-foreground/80 leading-relaxed">
                    {feature.label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA - Dark/Charcoal Button - UNCHANGED */}
            <div className="mt-8">
              <Link
                href="/hospital"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white font-medium text-sm rounded-full transition-all duration-300 group shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 hover:scale-[1.02] active:scale-95"
              >
                <span>{t("general.cta")}</span>
                <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>

          {/* Right column – Image with colorful gradient glow */}
          <div
            className={`relative transition-all duration-700 ease-out delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {/* Colorful gradient glow behind the image */}
            <div className="absolute -top-6 -right-6 w-64 h-64 bg-primary/30 rounded-full blur-3xl opacity-70" />
            <div className="absolute -bottom-6 -left-6 w-64 h-64 bg-secondary/30 rounded-full blur-3xl opacity-70" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />

            {/* Image container */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl shadow-primary/10 bg-card">
              <div className="aspect-[4/3] relative">
                <Image
                  src={GENERAL_IMAGE.src}
                  alt={GENERAL_IMAGE.alt}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}