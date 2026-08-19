"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageProvider";

// ============================================================
// CONFIGURATION – Change this to your own image
// ============================================================
const PHARMA_IMAGE = {
  src: "/istockphoto-2176619368-612x612.jpg",
  alt: "Afilas Drug share- Pharmaceutical production",
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

  // ✅ Connected to Language Provider
  const capabilities = [
    {
      title: t("pharma.card1_title") || "Manufacturing Capabilities",
      description: t("pharma.card1_desc") || "Dosage forms produced include Tablets, Capsules, Liquids, and Ointments designed for safe, reliable patient use.",
    },
    {
      title: t("pharma.card2_title") || "Quality Assurance & Compliance",
      description: t("pharma.card2_desc") || "Strict adherence to GMP standards and regulatory approvals ensures every product meets international safety and quality benchmarks.",
    },
    {
      title: t("pharma.card3_title") || "Product Catalog",
      description: t("pharma.card3_desc") || "A searchable directory for healthcare providers, pharmacies, and distributors to quickly find suitable formulations and products.",
    },
    {
      title: t("pharma.card4_title") || "Partnership & B2B Inquiry",
      description: t("pharma.card4_desc") || "Support for supply requests, contract manufacturing, and institutional distribution across public and private health networks.",
    },
  ];

  return (
    <section
      id="afilas-drug-manufacturing"
      ref={sectionRef}
      className="w-full py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        // Slanted top: left side starts lower, right side higher
        clipPath: "polygon(53% 0, 100% 3%, 100% 97%, 51% 100%, 0 97%, 0 3%)",
        backgroundColor: "var(--muted, #f1f5f9)",
      }}
    >
      {/* Background color – visible only in light mode */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-muted/70 dark:bg-transparent" />

      {/* Decorative blurred circles for depth */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* ============================================================
            Two Columns – Title Card + Image (Left) | Capabilities (Right)
            ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start mb-6">
          
          {/* LEFT COLUMN – Title Card on TOP of the Image */}
          <div
            className={`space-y-4 transition-all duration-700 ease-out delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {/* ✅ TITLE CARD - Connected to Language Provider */}
            <div className="transition-all duration-700 ease-out">
              <Link
                href="/pharma"
                className="group relative block transition-all duration-300 hover:scale-[1.02] active:scale-95"
              >
                {/* Dark green glow effect behind the title card on hover */}
                <div className="absolute -inset-1 bg-[#4B5B4D]/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* The title card itself - NO BACKGROUND COLOR (transparent) */}
                <div className="relative bg-transparent group-hover:bg-transparent rounded-2xl px-8 py-4 shadow-none group-hover:shadow-xl transition-all duration-500">
                  <h2 className="text-3xl sm:text-4xl font-bold text-[#4B5B4D] tracking-tight group-hover:text-[#4B5B4D] transition-colors duration-300">
                    {t("pharma.hero.title") || "Afilas Drug Share Company"}
                  </h2>
                </div>
              </Link>
            </div>

            {/* Image - Placed directly BELOW the title card */}
            <div className="relative overflow-hidden shadow-xl shadow-primary/10 group">
              <div className="aspect-[4/3] relative">
                <Image
                  src={PHARMA_IMAGE.src}
                  alt={PHARMA_IMAGE.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN – Capabilities List only */}
          <div
            className={`space-y-6 transition-all duration-700 ease-out delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {capabilities.map((cap, idx) => {
              return (
                <div
                  key={idx}
                  className="flex items-start gap-5"
                >
                  <div className="w-14 h-14 bg-primary/10 flex items-center justify-center flex-shrink-0">
                   
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
            CTA Button perfectly CENTERED inside its container - UNCHANGED
            ============================================================ */}
        <div className="pt-2 flex justify-center">
          <Link
            href="/pharma"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#1A7B7F] hover:bg-[#16686B] text-[#E8E5DC] font-medium text-base rounded-full transition-all duration-300 group shadow-[0_4px_6px_rgba(0,0,0,0.3)] hover:shadow-[0_6px_10px_rgba(0,0,0,0.4)] hover:scale-[1.02] active:scale-95"
          >
            <span>{t("pharma.cta") || "Go to Pharma Page"}</span>
            <span className="text-base transition-transform duration-300 group-hover:translate-x-1 text-[#E8E5DC]">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}