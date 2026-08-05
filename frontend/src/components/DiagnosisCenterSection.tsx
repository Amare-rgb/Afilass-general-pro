"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Microscope,
  ChevronRight,
  Award,
  Clock,
  ShieldCheck,
  Smartphone,
  Briefcase,
  Droplet,
  HeartPulse,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageProvider";

// ============================================================
// CONFIGURATION – Change this to your own image
// ============================================================
const DIAGNOSTIC_IMAGE = {
  src: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
  alt: "Afilas Diagnostic Center - Advanced laboratory equipment",
};

// ============================================================
// COMPONENT
// ============================================================
export default function AfilasDiagnosticCenter() {
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

  const features = [
    {
      icon: Microscope,
      title: t("diagnostic.feature1_title"),
      note: t("diagnostic.feature1_desc"),
    },
    {
      icon: Clock,
      title: t("diagnostic.feature2_title"),
      note: t("diagnostic.feature2_desc"),
    },
    {
      icon: ShieldCheck,
      title: t("diagnostic.feature3_title"),
      note: t("diagnostic.feature3_desc"),
    },
    {
      icon: Smartphone,
      title: t("diagnostic.feature4_title"),
      note: t("diagnostic.feature4_desc"),
    },
  ];

  const packages = [
    {
      icon: Briefcase,
      name: t("diagnostic.package1_name"),
      note: t("diagnostic.package1_desc"),
    },
    {
      icon: Droplet,
      name: t("diagnostic.package2_name"),
      note: t("diagnostic.package2_desc"),
    },
    {
      icon: HeartPulse,
      name: t("diagnostic.package3_name"),
      note: t("diagnostic.package3_desc"),
    },
  ];

  return (
    <section
      id="afilas-diagnostic-center"
      ref={sectionRef}
      className={`w-full py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{
        // =========================================================
        // SHAPED SECTION – curve at the bottom
        // =========================================================
        clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 95%)",
        // Background color: visible ONLY in light mode
        // In dark mode, it becomes transparent
        backgroundColor: "var(--muted, #f1f5f9)",
        // Override in dark mode via a class approach
      }}
    >
      {/* Use a child div for the background so we can control it with Tailwind classes */}
      {/* The actual background div with conditional classes */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-muted/30 dark:bg-transparent" />

      {/* Decorative blurred circles – kept for extra depth */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/2 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-12 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="w-14 h-14 bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-sm shadow-primary/5">
            <Microscope className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              {t("diagnostic.title")}
            </h2>
            {/* <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
              {t("diagnostic.subtitle")}
            </p> */}
          </div>
        </div>

        {/* Two‑column layout: text + image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-16">
          {/* Left: About and features */}
          <div className="space-y-6">
            

            {/* Features grid 2x2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map(({ icon: Icon, title, note }, idx) => (
                <div key={idx} className="bg-card border border-border p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                    <h4 className="font-semibold text-foreground text-sm">
                      {title}
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Image with colorful glow */}
          <div className="relative">
            {/* Glow effects */}
            <div className="absolute -top-6 -right-6 w-64 h-64 bg-primary/30 rounded-full blur-3xl opacity-70" />
            <div className="absolute -bottom-6 -left-6 w-64 h-64 bg-secondary/30 rounded-full blur-3xl opacity-70" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />

            <div className="relative overflow-hidden shadow-xl shadow-primary/10 bg-card">
              <div className="aspect-[4/3] relative">
                <Image
                  src={DIAGNOSTIC_IMAGE.src}
                  alt={DIAGNOSTIC_IMAGE.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Health Packages Section */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-8 bg-primary" />
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                {t("diagnostic.packages_title")}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wider">
                {t("diagnostic.packages_subtitle")}
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {packages.map(({ icon: Icon, name, note }, idx) => (
              <div
                key={idx}
                className="border border-primary/30 p-6"
              >
                <div className="w-16 h-16 bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <p className="font-semibold text-foreground text-base mb-1">
                  {name}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {note}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-8">
            <Link
              href="/diagnostics"
              className="group inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all duration-300"
            >
              {t("diagnostic.cta")}
              <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}