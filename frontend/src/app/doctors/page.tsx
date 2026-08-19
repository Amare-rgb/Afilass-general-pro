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
        style={{ paddingTop: '0px' }}
      >
        {/* ==========================================================================
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
           2. DOCTOR FINDER COMPONENT (FILTERED BY SELECTED LOCATION)
           ========================================================================== */}
        <DoctorFinder 
          selectedLocation={selectedLocation} 
          showHeader={false} 
        />

        {/* ==========================================================================
           3. BOOKING & EMERGENCY QUICK CTA BANNER
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