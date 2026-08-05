"use client";

import Link from "next/link";
import Image from "next/image";
import { Building2, ChevronRight, Heart, CheckCircle, Clock, Microscope, Users, Award } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageProvider";

// ============================================================
// CONFIGURATION – Change these to your own images
// ============================================================
const GENERAL_IMAGE = {
  src: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&q=80",
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

  // Feature list – using translations
  const features = [
    { icon: CheckCircle, label: t("general.feature1") },
    { icon: Microscope, label: t("general.feature2") },
    { icon: Clock, label: t("general.feature3") },
    { icon: Award, label: t("general.feature4") },
    { icon: Users, label: t("general.feature5") },
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
        {/* Section header */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-8 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-sm shadow-primary/5">
            <Building2 className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              {t("general.title")}
            </h2>
            {/* <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
              {t("general.subtitle")}
            </p> */}
          </div>
        </div>

        {/* Main content: two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left column – Feature list */}
          <div
            className={`space-y-4 transition-all duration-700 ease-out delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {/* Intro card with description (optional) */}
            {/* <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <p className="text-foreground/85 text-sm sm:text-base leading-relaxed">
                  {t("general.intro")}
                </p>
              </div>
            </div> */}

            {/* Feature list */}
            <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-sm space-y-3">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-sm text-foreground/80 leading-relaxed">
                      {feature.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <Link
              href="/hospital"
              className="group inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all duration-300 mt-2"
            >
              {t("general.cta")}
              <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Right column – Image with colorful gradient glow (no border, no badge) */}
          <div
            className={`relative transition-all duration-700 ease-out delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {/* Colorful gradient glow behind the image */}
            <div className="absolute -top-6 -right-6 w-64 h-64 bg-primary/30 rounded-full blur-3xl opacity-70" />
            <div className="absolute -bottom-6 -left-6 w-64 h-64 bg-secondary/30 rounded-full blur-3xl opacity-70" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />

            {/* Image container – no border */}
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