// src/components/SharedEssential.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageProvider";

/* ---------- Reveal-on-scroll wrapper ---------- */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={`transition-all duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

// ==================== THREE PILLARS - SIMPLE CARDS ====================
export function UnifiedPillarsSection() {
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
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const pillars = [
    {
      id: 1,
      title: t("pillars.card1_title"),
      tag: t("pillars.card1_tag") || "24/7 Care",
      description: t("pillars.card1_desc"),
      highlights: [
        t("pillars.card1_highlight1"),
        t("pillars.card1_highlight2"),
        t("pillars.card1_highlight3"),
      ],
      cta: t("pillars.card1_cta"),
      ctaLink: "/hospital",
    },
    {
      id: 2,
      title: t("pillars.card2_title"),
      tag: t("pillars.card2_tag") || "Precision",
      description: t("pillars.card2_desc"),
      highlights: [
        t("pillars.card2_highlight1"),
        t("pillars.card2_highlight2"),
        t("pillars.card2_highlight3"),
      ],
      cta: t("pillars.card2_cta"),
      ctaLink: "/diagnostics",
    },
    {
      id: 3,
      title: t("pillars.card3_title"),
      tag: t("pillars.card3_tag") || "GMP Certified",
      description: t("pillars.card3_desc"),
      highlights: [
        t("pillars.card3_highlight1"),
        t("pillars.card3_highlight2"),
        t("pillars.card3_highlight3"),
      ],
      cta: t("pillars.card3_cta"),
      ctaLink: "/pharma",
    },
  ];

  return (
    <section
      id="three-pillars"
      ref={sectionRef}
      className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-muted/50"
    >
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className={`mb-10 transition-all duration-600 ease-out ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}>
          <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-medium mb-2">
            {t("pillars.header_badge")}
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            {t("pillars.header_title")}
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-lg">
            {t("pillars.header_subtitle")}
          </p>
        </div>

        {/* Three Cards */}
        <div className="grid md:grid-cols-3 gap-4 sm:gap-5">
          {pillars.map((pillar, index) => {
            return (
              <div
                key={pillar.id}
                className={`group bg-card rounded-xl border border-border p-5 sm:p-6 hover:border-primary/30 transition-all duration-500 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: `${150 + index * 100}ms` }}
              >
                {/* Icon placeholder - removed icon */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">✦</span>
                  </div>
                  <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {pillar.tag}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {pillar.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {pillar.description}
                </p>

                {/* Highlights */}
                <div className="space-y-1.5 mb-5">
                  {pillar.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-sm text-foreground/70"
                    >
                      <span className="text-primary text-xs">◆</span>
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <Link
                  href={pillar.ctaLink}
                  className="group/link inline-flex items-center gap-1.5 text-primary font-semibold text-sm hover:gap-2.5 transition-all duration-300"
                >
                  {pillar.cta}
                  <span className="text-xs">→</span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ==================== AFILAS GENERAL HOSPITAL - FULL PAGE ====================
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
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="afilas-general-hospital"
      ref={sectionRef}
      className="py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 overflow-hidden relative border-t border-b border-blue-600"
      style={{
        background: "linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #f0f9ff 100%)",
      }}
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full opacity-20 -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 rounded-full opacity-10 -ml-48 -mb-48"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100/20 rounded-full blur-3xl"></div>

      <div className="relative max-w-5xl mx-auto z-10">
        
        <div className={`text-center mb-6 transition-all duration-700 ease-out ${
          isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-95"
        }`}>
          <div className="flex items-center justify-center gap-2 mb-2 group/title">
            <span className="text-2xl text-blue-600">🏥</span>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
              <span className="relative inline-block group-hover/title:text-blue-600 transition-colors duration-300">
                Afilas
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover/title:w-full transition-all duration-500"></span>
              </span>
              <span className="text-blue-600 relative inline-block group-hover/title:text-blue-700 transition-colors duration-300 ml-1">
                General Hospital
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-700 group-hover/title:w-full transition-all duration-500 delay-100"></span>
              </span>
            </h1>
          </div>
          
          <div className="w-16 h-0.5 bg-blue-600 mx-auto rounded-full mb-3 group-hover/title:w-24 transition-all duration-500"></div>
          
          <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed group-hover/title:text-gray-800 transition-colors duration-300">
            Compassionate, specialized patient care available 24/7.
          </p>
        </div>

        <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 mb-6 transition-all duration-700 ease-out hover:shadow-2xl hover:scale-[1.01] transform ${
          isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-95"
        }`} style={{ transitionDelay: "100ms" }}>
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-full mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <span className="text-blue-600 text-sm">❤️</span>
            </div>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed">
              Afilas hospital is a multi-specialty hospital located around Felege Hiwot Hospital, 
              in front of Amhara public health institute, offshore Lake Tana with breathtaking view. 
              It is one of the private hospitals in the city, with over 10 specialty centers. 
              Afilas offers state-of-the-art diagnostic and therapeutic care in a one-stop medical center.
            </p>
          </div>
        </div>

        <div className={`text-center transition-all duration-700 ease-out ${
          isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-95"
        }`} style={{ transitionDelay: "300ms" }}>
          <Link
            href="/hospital"
            className="group inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm md:text-base px-6 md:px-8 py-2.5 md:py-3 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 relative overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            <span className="relative flex items-center gap-2">
              Explore Hospital Services
              <span className="text-xs group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ==================== AFILAS DIAGNOSTIC CENTER - FULL PAGE ====================
export function DiagnosticCenterSection() {
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
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="afilas-diagnostic-center"
      ref={sectionRef}
      className="py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 overflow-hidden relative border-t border-b border-sky-600"
      style={{
        background: "linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #f0f9ff 100%)",
      }}
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-200 rounded-full opacity-20 -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-300 rounded-full opacity-10 -ml-48 -mb-48"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sky-100/20 rounded-full blur-3xl"></div>

      <div className="relative max-w-5xl mx-auto z-10">
        
        <div className={`text-center mb-6 transition-all duration-700 ease-out ${
          isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-95"
        }`}>
          <div className="flex items-center justify-center gap-2 mb-2 group/title">
            <span className="text-2xl text-sky-600">🔬</span>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
              <span className="relative inline-block group-hover/title:text-sky-600 transition-colors duration-300">
                Afilas
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-600 group-hover/title:w-full transition-all duration-500"></span>
              </span>
              <span className="text-sky-600 relative inline-block group-hover/title:text-sky-700 transition-colors duration-300 ml-1">
                Diagnostic Center
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-700 group-hover/title:w-full transition-all duration-500 delay-100"></span>
              </span>
            </h1>
          </div>
          
          <div className="w-16 h-0.5 bg-sky-600 mx-auto rounded-full mb-3 group-hover/title:w-24 transition-all duration-500"></div>
          
          <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed group-hover/title:text-gray-800 transition-colors duration-300">
            Fast, precise, and reliable diagnostic results driving accurate medical decisions.
          </p>
        </div>

        <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 mb-6 transition-all duration-700 ease-out hover:shadow-2xl hover:scale-[1.01] transform ${
          isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-95"
        }`} style={{ transitionDelay: "100ms" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-sky-100 p-2 rounded-full">
              <span className="text-sky-600 text-sm">⭐</span>
            </div>
            <h3 className="font-bold text-lg text-gray-800">About Afilas Diagnostic Center</h3>
          </div>
          
          <p className="text-gray-700 text-sm md:text-base leading-relaxed mb-6">
            <span className="font-semibold text-sky-600">Afilas Diagnostic Center</span> is a 
            state-of-the-art diagnostic facility dedicated to providing accurate, timely, and 
            reliable diagnostic services to support better healthcare outcomes.
          </p>

          <div className="text-center">
            <Link
              href="/diagnostics"
              className="group inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm"
            >
              Go To Diagnostic Center
              <span className="text-xs transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==================== AFILAS DRUG MANUFACTURING - FULL PAGE ====================
export function DrugManufacturingSection() {
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
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const manufacturingCards = [
    {
      title: "Manufacturing Capabilities",
      tag: "GMP",
      iconBg: "sky",
      description: "Dosage forms produced include Tablets, Capsules, Liquids, and Ointments designed for safe, reliable patient use.",
    },
    {
      title: "Quality Assurance & Compliance",
      tag: "Certified",
      iconBg: "emerald",
      description: "Strict adherence to GMP standards and regulatory approvals ensures every product meets international safety and quality benchmarks.",
    },
    {
      title: "Product Catalog",
      tag: "Searchable",
      iconBg: "indigo",
      description: "A searchable directory for healthcare providers, pharmacies, and distributors to quickly find suitable formulations and products.",
    },
    {
      title: "Partnership & B2B Inquiry",
      tag: "Contact",
      iconBg: "rose",
      description: "Support for supply requests, contract manufacturing, and institutional distribution across public and private health networks.",
    },
  ];

  const iconEmojis = {
    sky: "🔬",
    emerald: "🛡️",
    indigo: "📚",
    rose: "🤝",
  };

  return (
    <section
      id="afilas-drug-manufacturing"
      ref={sectionRef}
      className="py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 overflow-hidden relative border-t border-b border-emerald-600"
      style={{
        background: "linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #f0fdf4 100%)",
      }}
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200 rounded-full opacity-20 -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-300 rounded-full opacity-10 -ml-48 -mb-48"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-100/20 rounded-full blur-3xl"></div>

      <div className="relative max-w-5xl mx-auto z-10">
        
        <div className={`text-center mb-6 transition-all duration-700 ease-out ${
          isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-95"
        }`}>
          <div className="flex items-center justify-center gap-2 mb-2 group/title">
            <span className="text-2xl text-emerald-600">💊</span>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
              <span className="relative inline-block group-hover/title:text-emerald-600 transition-colors duration-300">
                Afilas
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 group-hover/title:w-full transition-all duration-500"></span>
              </span>
              <span className="text-emerald-600 relative inline-block group-hover/title:text-emerald-700 transition-colors duration-300 ml-1">
                Drug Manufacturing
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-700 group-hover/title:w-full transition-all duration-500 delay-100"></span>
              </span>
            </h1>
          </div>
          
          <div className="w-16 h-0.5 bg-emerald-600 mx-auto rounded-full mb-3 group-hover/title:w-24 transition-all duration-500"></div>
          
          <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed group-hover/title:text-gray-800 transition-colors duration-300">
            Safeguarding community health through local, high-quality, and compliant medicine production.
          </p>
        </div>

        <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 mb-6 transition-all duration-700 ease-out hover:shadow-2xl hover:scale-[1.01] transform ${
          isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-95"
        }`} style={{ transitionDelay: "100ms" }}>
          <div className="flex items-start gap-3">
            <div className="bg-emerald-100 p-2 rounded-full mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <span className="text-emerald-600 text-sm">❤️</span>
            </div>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed">
              Afilas Drug Manufacturing is committed to producing high-quality pharmaceutical products 
              that meet international standards. With state-of-the-art manufacturing facilities and 
              strict adherence to GMP guidelines, we ensure every product is safe, effective, and 
              reliable for patient use.
            </p>
          </div>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 transition-all duration-700 ease-out ${
          isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-95"
        }`} style={{ transitionDelay: "200ms" }}>
          {manufacturingCards.map((card, index) => {
            const bgColor = {
              sky: "bg-sky-100 group-hover:bg-sky-200",
              emerald: "bg-emerald-100 group-hover:bg-emerald-200",
              indigo: "bg-indigo-100 group-hover:bg-indigo-200",
              rose: "bg-rose-100 group-hover:bg-rose-200",
            }[card.iconBg] || "bg-gray-100";

            const textColor = {
              sky: "text-sky-600",
              emerald: "text-emerald-600",
              indigo: "text-indigo-600",
              rose: "text-rose-600",
            }[card.iconBg] || "text-gray-600";

            const emoji = iconEmojis[card.iconBg as keyof typeof iconEmojis] || "📌";

            return (
              <div
                key={index}
                className="group bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-5 flex items-start gap-3 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer border border-transparent hover:border-emerald-200"
              >
                <div className={`${bgColor} p-2.5 rounded-full flex-shrink-0 group-hover:scale-110 transition-all duration-300`}>
                  <span className={`text-lg ${textColor}`}>{emoji}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm mb-1 flex items-center gap-2">
                    {card.title}
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full group-hover:bg-emerald-200 transition-colors">
                      {card.tag}
                    </span>
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{card.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className={`text-center transition-all duration-700 ease-out ${
          isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-95"
        }`} style={{ transitionDelay: "300ms" }}>
          <Link
            href="/pharma"
            className="group inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm md:text-base px-6 md:px-8 py-2.5 md:py-3 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 relative overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            <span className="relative flex items-center gap-2">
              Go to Pharma Page
              <span className="text-xs group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ==================== ABOUT US - FULL PAGE ====================
export function AboutUsSection() {
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
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const coreValues = [
    { title: "Compassion", desc: "We treat every patient with kindness, empathy, and genuine care." },
    { title: "Excellence", desc: "We pursue the highest standards of medical practice and service delivery." },
    { title: "Integrity", desc: "We uphold honesty, transparency, and ethical conduct in all operations." },
    { title: "Innovation", desc: "We embrace modern medical technologies and continuously improve our processes." },
    { title: "Teamwork", desc: "We work collaboratively to deliver comprehensive, patient-centered care." },
    { title: "Accountability", desc: "We take responsibility for our actions and strive for measurable results." },
  ];

  return (
    <section
      id="about-us"
      ref={sectionRef}
      className="py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 overflow-hidden relative border-t border-b border-purple-600"
      style={{
        background: "linear-gradient(135deg, #faf5ff 0%, #ffffff 50%, #faf5ff 100%)",
      }}
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full opacity-20 -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-300 rounded-full opacity-10 -ml-48 -mb-48"></div>

      <div className="relative max-w-5xl mx-auto z-10">
        
        <div className={`text-center mb-6 transition-all duration-700 ease-out ${
          isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-95"
        }`}>
          <div className="flex items-center justify-center gap-2 mb-2 group/title">
            <span className="text-2xl text-purple-600">🏢</span>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
              About <span className="text-purple-600">Afilas</span>
            </h1>
          </div>
          
          <div className="w-16 h-0.5 bg-purple-600 mx-auto rounded-full mb-3 group-hover/title:w-24 transition-all duration-500"></div>
          
          <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Unifying clinical expertise, technology, and local manufacturing for accessible healthcare.
          </p>
        </div>

        <div className={`grid md:grid-cols-2 gap-4 mb-6 transition-all duration-700 ease-out ${
          isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-95"
        }`} style={{ transitionDelay: "100ms" }}>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-purple-600 text-sm">⭐</span>
              <h3 className="font-bold text-lg text-gray-800">Vision</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Aspiring to provide the perfect patient experience through innovative and compassionate care in the region by 2030.
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-purple-600 text-sm">❤️</span>
              <h3 className="font-bold text-lg text-gray-800">Mission</h3>
            </div>
            <ul className="text-sm text-gray-600 leading-relaxed space-y-1 list-disc list-inside">
              <li>Provide cost effective, compassionate, respectful, and high quality healthcare.</li>
              <li>Offer highly equitable corporate social responsibility.</li>
              <li>Enhance the culture of Employee engagement.</li>
              <li>Promote Customer satisfaction, health and wellness.</li>
            </ul>
          </div>
        </div>

        <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 transition-all duration-700 ease-out ${
          isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-95"
        }`} style={{ transitionDelay: "200ms" }}>
          <h3 className="font-bold text-lg text-gray-800 text-center mb-4">Statement of Core Values</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {coreValues.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-3 border border-purple-100 text-center hover:shadow-md transition-all duration-300">
                <h4 className="font-semibold text-purple-600 text-sm">{value.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 transition-all duration-700 ease-out ${
          isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-95"
        }`} style={{ transitionDelay: "300ms" }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-purple-600 text-sm">🛡️</span>
            <h3 className="font-bold text-lg text-gray-800">Quality & Safety Commitment</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-purple-50 rounded-xl p-3 text-center">
              <span className="text-xs font-semibold text-purple-700">Infection Control</span>
            </div>
            <div className="bg-purple-50 rounded-xl p-3 text-center">
              <span className="text-xs font-semibold text-purple-700">Standard Operating Procedures</span>
            </div>
            <div className="bg-purple-50 rounded-xl p-3 text-center">
              <span className="text-xs font-semibold text-purple-700">Regulatory Certifications</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}