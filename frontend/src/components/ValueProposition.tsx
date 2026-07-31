"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageProvider";
import { Award, Zap, Heart } from "lucide-react";

// ============================================================
// CUSTOM HOOK: Detect if element is in viewport
// ============================================================
function useInView(ref: React.RefObject<HTMLElement>) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.15 }, // Trigger when 15% visible
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return isInView;
}

// ============================================================
// COMPONENT
// ============================================================
export function ValueProposition() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef);

  const features = [
    {
      icon: Heart,
      titleKey: "values.feature_1_title",
      descKey: "values.feature_1_desc",
    },
    {
      icon: Zap,
      titleKey: "values.feature_2_title",
      descKey: "values.feature_2_desc",
    },
    {
      icon: Award,
      titleKey: "values.feature_3_title",
      descKey: "values.feature_3_desc",
    },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="bg-card py-24 border-y border-border overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with fade-in */}
        <div
          className={`text-center mb-16 transition-all duration-700 ease-out ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t("values.headline")}
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            // Staggered animation delay per card
            const delay = idx * 150;

            return (
              <div
                key={idx}
                className={`text-center space-y-4 transition-all duration-700 ease-out ${
                  isInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${delay}ms` }}
              >
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  {t(feature.descKey)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
