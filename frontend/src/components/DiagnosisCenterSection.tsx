"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageProvider";

// ============================================================
// CONFIGURATION – Change this to your own image
// ============================================================
const DIAGNOSTIC_IMAGE = {
  src: "/download.jpeg",
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
      title: t("diagnostic.feature1_title"),
      note: t("diagnostic.feature1_desc"),
    },
    {
      title: t("diagnostic.feature2_title"),
      note: t("diagnostic.feature2_desc"),
    },
    {
      title: t("diagnostic.feature3_title"),
      note: t("diagnostic.feature3_desc"),
    },
    {
      title: t("diagnostic.feature4_title"),
      note: t("diagnostic.feature4_desc"),
    },
  ];

  const packages = [
    {
      name: t("diagnostic.package1_name"),
      note: t("diagnostic.package1_desc"),
    },
    {
      name: t("diagnostic.package2_name"),
      note: t("diagnostic.package2_desc"),
    },
    {
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
        clipPath: "polygon(50% 100%, 100% 98%, 100% 0, 0 0, 0 98%)",
        backgroundColor: "var(--muted, #f1f5f9)",
      }}
    >
      {/* Background div with conditional classes */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-muted/30 dark:bg-transparent" />

      {/* Decorative blurred circles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/2 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* ============================================================
            Main content: two-column layout
            ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start mb-16">
          {/* Left: Title Card + About and features */}
          <div className="space-y-3">
            
            {/* ✅ TITLE CARD - SOFT BLUE TEXT, SAME COLOR NORMAL & HOVER */}
            <div className="transition-all duration-700 ease-out">
              <Link
                href="/diagnostics"
                className="group relative block transition-all duration-300 hover:scale-[1.02] active:scale-95"
              >
                {/* Soft blue glow effect behind the title card on hover */}
                <div className="absolute -inset-1 bg-[#4A90D9]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* The title card itself - NO BACKGROUND COLOR (transparent) */}
                <div className="relative bg-transparent group-hover:bg-transparent rounded-2xl px-8 py-4 shadow-none group-hover:shadow-xl transition-all duration-500">
                  {/* ✅ SOFT BLUE TEXT - SAME IN NORMAL AND HOVER */}
                  <h2 className="text-3xl sm:text-4xl font-bold text-[#4A90D9] tracking-tight group-hover:text-[#4A90D9] transition-colors duration-300">
                    {t("diagnostic.title")}
                  </h2>
                </div>
              </Link>
            </div>

            {/* Features grid 2x2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.map(({ title, note }, idx) => (
                <div key={idx} className="bg-card border border-border p-4">
                  <div className="flex items-center gap-2 mb-1.5">
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

            <div className="relative overflow-hidden shadow-xl shadow-primary/10 bg-card group">
              <div className="aspect-[4/3] relative">
                <Image
                  src={DIAGNOSTIC_IMAGE.src}
                  alt={DIAGNOSTIC_IMAGE.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
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
            {packages.map(({ name, note }, idx) => (
              <div
                key={idx}
                className="border border-primary/30 p-6"
              >
                <div className="w-16 h-16 bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-2xl">🩺</span>
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

          {/* CTA - Custom Button now displayed on the RIGHT SIDE - UNCHANGED */}
          <div className="mt-8 flex justify-end">
            <Link
              href="/diagnostics"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#7DB99E] hover:bg-[#6CA88D] text-[#0e4b14] font-medium text-base rounded-full transition-all duration-300 group shadow-[0_4px_6px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_10px_rgba(0,0,0,0.4)] hover:scale-[1.02] active:scale-95"
            >
              <span>{t("diagnostic.cta")}</span>
              <span className="text-sm transition-transform duration-300 group-hover:translate-x-1 text-[#0e4b14]">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}