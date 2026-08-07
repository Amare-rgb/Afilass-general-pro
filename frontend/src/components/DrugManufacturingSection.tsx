"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Pill,
  ClipboardList,
  ShieldCheck,
  Archive,
  Handshake,
  ChevronRight,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageProvider";

// ============================================================
// CONFIGURATION – Change this to your own image
// ============================================================
const PHARMA_IMAGE = {
  src: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
  alt: "Afilas Drug Manufacturing - Pharmaceutical production",
};

// ============================================================
// COMPONENT
// ============================================================
export default function DrugManufacturingSection() {
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

  const capabilities = [
    {
      icon: ClipboardList,
      title: t("pharma.card1_title"),
      description: t("pharma.card1_desc"),
    },
    {
      icon: ShieldCheck,
      title: t("pharma.card2_title"),
      description: t("pharma.card2_desc"),
    },
    {
      icon: Archive,
      title: t("pharma.card3_title"),
      description: t("pharma.card3_desc"),
    },
    {
      icon: Handshake,
      title: t("pharma.card4_title"),
      description: t("pharma.card4_desc"),
    },
  ];

  return (
    <section
      id="afilas-drug-manufacturing"
      ref={sectionRef}
      className="w-full py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        // Slanted top: left side starts lower, right side higher
        clipPath: "polygon(0 12%, 100% 0, 100% 100%, 0 100%)",
      }}
    >
      {/* Background color – visible only in light mode */}
      {/* Using a more visible color with higher opacity */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-muted/70 dark:bg-transparent" />

      {/* Decorative blurred circles for depth */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* ============================================================
            ROW 1: Title (on its own, left aligned)
            ============================================================ */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-10 transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="w-14 h-14 bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-sm shadow-primary/5">
            <Pill className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              {t("pharma.title")}
            </h2>
            {/* <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
              {t("pharma.subtitle")}
            </p> */}
          </div>
        </div>

        {/* ============================================================
            ROW 2: Two Columns – Image (Left) | Capabilities (Right)
            ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start mb-10">
          {/* LEFT COLUMN – Image only */}
          <div
            className={`transition-all duration-700 ease-out delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div className="relative overflow-hidden shadow-xl shadow-primary/10">
              <div className="aspect-[4/3] relative">
                <Image
                  src={PHARMA_IMAGE.src}
                  alt={PHARMA_IMAGE.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN – Capabilities only (no title, no CTA) */}
          <div
            className={`space-y-6 transition-all duration-700 ease-out delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {capabilities.map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <div
                  key={idx}
                  className="flex items-start gap-5"
                >
                  <div className="w-14 h-14 bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-foreground">
                      {cap.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-0.5">
                      {cap.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================
            ROW 3: CTA (on its own, left aligned, below everything)
            ============================================================ */}
        <div
          className={`transition-all duration-700 ease-out delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <Link
            href="/pharma"
            className="group inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all duration-300"
          >
            {t("pharma.cta")}
            <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}