// src/components/TrustSection.tsx
"use client";

import { useLanguage } from "@/contexts/LanguageProvider";
import { Stethoscope, Microscope, Shield, Heart } from "lucide-react";

export function TrustSection() {
  const { t } = useLanguage();

  const features = [
    {
      title: t("values.feature_1_title"),
      description: t("values.feature_1_desc"),
      icon: Stethoscope,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/30",
      iconBg: "bg-blue-100 dark:bg-blue-900/40",
      border: "border-blue-200 dark:border-blue-800",
    },
    {
      title: t("values.feature_2_title"),
      description: t("values.feature_2_desc"),
      icon: Microscope,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-950/30",
      iconBg: "bg-purple-100 dark:bg-purple-900/40",
      border: "border-purple-200 dark:border-purple-800",
    },
    {
      title: t("values.feature_3_title"),
      description: t("values.feature_3_desc"),
      icon: Shield,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-950/30",
      iconBg: "bg-green-100 dark:bg-green-900/40",
      border: "border-green-200 dark:border-green-800",
    },
  ];

  return (
    <section className="relative z-20 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider border border-primary/20 mb-4">
            <Heart className="w-3.5 h-3.5" />
            <span>Why Choose Afilas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            {t("values.headline")}
          </h2>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`group bg-card border ${feature.border} rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}
              >
                <div
                  className={`w-14 h-14 rounded-xl ${feature.iconBg} flex items-center justify-center mb-6`}
                >
                  <Icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className={`text-xl font-bold ${feature.color} mb-3`}>
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}