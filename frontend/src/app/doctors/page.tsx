"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { DoctorFinder } from "@/components/DoctorFinder";
import { useLanguage } from "@/contexts/LanguageProvider";
import { 
  Users, 
  ChevronRight, 
  Building2, 
  Activity, 
  Pill, 
  Globe, 
  CheckCircle2,
  Calendar,
  PhoneCall
} from "lucide-react";

export default function DoctorsPage() {
  const { t } = useLanguage();
  const [selectedLocation, setSelectedLocation] = useState<string>("All");

  const locationPillars = [
    {
      id: "All",
      nameKey: "doctors.location.all",
      descKey: "doctors.location.all_desc",
      icon: Globe,
      color: "text-teal-600 dark:text-teal-400",
      bgColor: "bg-teal-500/10",
    },
    {
      id: "Afilas General Hospital",
      nameKey: "doctors.location.hospital",
      descKey: "doctors.location.hospital_desc",
      icon: Building2,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      id: "Afilas Diagnostic Center",
      nameKey: "doctors.location.diagnostics",
      descKey: "doctors.location.diagnostics_desc",
      icon: Activity,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      id: "Afilas Drug Manufacturing",
      nameKey: "doctors.location.pharma",
      descKey: "doctors.location.pharma_desc",
      icon: Pill,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-500/10",
    },
  ];

  return (
    <>
      {/* Navigation Header */}
      <Header />

<main 
  className="bg-background text-foreground min-h-screen"
  style={{ paddingTop: 'var(--header-offset, 120px)' }}
>        {/* ==========================================================================
           1. HERO / HEADER SECTION
           ========================================================================== */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background border-b border-border/50 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
          {/* Subtle background ambient light */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden opacity-30">
            <div className="absolute -top-24 left-1/3 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground mb-6">
              <Link href="/" className="hover:text-primary transition-colors">
                {t("nav.home")}
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/hospital" className="hover:text-primary transition-colors">
                {t("nav.hospital")}
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-foreground font-semibold">
                {t("doctors.hero.badge")}
              </span>
            </nav>

            {/* Hero Header */}
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-semibold mb-4">
                <Users className="w-4 h-4" />
                <span>{t("doctors.hero.badge")}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4 sm:mb-6 leading-tight">
                {t("doctors.hero.title")}
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                {t("doctors.hero.subtitle")}
              </p>
            </div>
          </div>
        </section>

        {/* ==========================================================================
           2. PILLAR / LOCATION FILTER SECTION (PAGE LEVEL IMPLEMENTATION)
           ========================================================================== */}
        <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 border-b border-border/40 bg-card/40">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                {t("doctors.location.filter_title")}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {t("doctors.location.filter_subtitle")}
              </p>
            </div>

            {/* Location Selector Grid (Obvious Active Indicator) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {locationPillars.map((pillar) => {
                const isSelected = selectedLocation === pillar.id;
                const IconComponent = pillar.icon;

                return (
                  <button
                    key={pillar.id}
                    onClick={() => setSelectedLocation(pillar.id)}
                    className={`relative p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                      isSelected
                        ? "bg-card border-primary ring-2 ring-primary/50 shadow-xl scale-[1.02]"
                        : "bg-card/80 border-border/80 hover:border-primary/40 hover:bg-card shadow-sm"
                    }`}
                  >
                    {/* Active Selection Badge (Visual Indicator) */}
                    {isSelected && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-primary text-primary-foreground text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t("doctors.location.active_badge")}</span>
                      </div>
                    )}

                    <div>
                      {/* Icon
                      <div className={`w-12 h-12 ${pillar.bgColor} rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                        <IconComponent className={`w-6 h-6 ${pillar.color}`} />
                      </div> */}

                      {/* Location Name */}
                      <h3 className={`text-base font-bold transition-colors ${isSelected ? "text-primary" : "text-foreground group-hover:text-primary"}`}>
                        {t(pillar.nameKey)}
                      </h3>

                      {/* Short Description */}
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        {t(pillar.descKey)}
                      </p>
                    </div>

                    {/* Bottom Status Bar */}
                    <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs font-semibold">
                      <span className={isSelected ? "text-primary font-bold" : "text-muted-foreground"}>
                        {isSelected ? "● Currently Filtering" : "Click to select"}
                      </span>
                      <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? "text-primary translate-x-1" : "text-muted-foreground"}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==========================================================================
           3. DOCTOR FINDER COMPONENT (FILTERED BY SELECTED LOCATION)
           ========================================================================== */}
        <DoctorFinder 
          selectedLocation={selectedLocation} 
          showHeader={false} 
        />

        {/* ==========================================================================
           4. BOOKING & EMERGENCY QUICK CTA BANNER
           ========================================================================== */}
        <section className="bg-primary/5 border-t border-border py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="max-w-xl">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Need Help Selecting a Specialist?
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Our medical receptionists and triage teams are ready 24/7 to guide you to the right doctor or clinic.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <Link
                href="/appointments"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-semibold hover:bg-primary/90 transition-all shadow-md active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                <span>{t("cta.book_appointment")}</span>
              </Link>
              <a
                href="tel:994"
                className="inline-flex items-center gap-2 border border-border bg-card text-foreground px-6 py-3 rounded-full text-sm font-semibold hover:bg-accent/10 transition-all shadow-sm active:scale-95"
              >
                <PhoneCall className="w-4 h-4 text-red-500" />
                <span>{t("cta.emergency_call")}</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      
    </>
  );
}
