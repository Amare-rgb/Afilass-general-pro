"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HospitalServices } from "@/components/HospitalDivision/HospitalServices";
import { useLanguage } from "@/contexts/LanguageProvider";
import { 
  Stethoscope, 
  ChevronRight, 
  Building2, 
  Activity, 
  Pill, 
  Globe, 
  CheckCircle2,
  Calendar,
  PhoneCall
} from "lucide-react";

function ServicesContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedLocation, setSelectedLocation] = useState<string>("All");

  const locationPillars = [
    {
      id: "All",
      label: "All Divisions",
      nameKey: "doctors.location.all",
      descKey: "doctors.location.all_desc",
      icon: Globe,
      color: "text-teal-600 dark:text-teal-400",
      bgColor: "bg-teal-500/10",
      breadcrumbName: null,
    },
    {
      id: "Afilas General Hospital",
      label: "Afilas General Hospital",
      nameKey: "doctors.location.hospital",
      descKey: "doctors.location.hospital_desc",
      icon: Building2,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10",
      breadcrumbName: "Afilas General Hospital",
    },
    {
      id: "Afilas Diagnostic Center",
      label: "Afilas Diagnostic Center",
      nameKey: "doctors.location.diagnostics",
      descKey: "doctors.location.diagnostics_desc",
      icon: Activity,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-500/10",
      breadcrumbName: "Afilas Diagnostic Center",
    },
    {
      id: "Afilas Drug Manufacturing",
      label: "Afilas Drug Manufacturing",
      nameKey: "doctors.location.pharma",
      descKey: "doctors.location.pharma_desc",
      icon: Pill,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-500/10",
      breadcrumbName: "Afilas Drug Manufacturing",
    },
  ];

  // Helper function to match URL parameter to pillar location ID
  const matchLocationFromParam = (param: string | null): string => {
    if (!param) return "All";
    const lower = param.toLowerCase();
    if (lower.includes("hospital") || lower.includes("general")) {
      return "Afilas General Hospital";
    }
    if (lower.includes("diagnos") || lower.includes("center")) {
      return "Afilas Diagnostic Center";
    }
    if (lower.includes("pharma") || lower.includes("drug") || lower.includes("manufactur")) {
      return "Afilas Drug Manufacturing";
    }
    return "All";
  };

  // Sync selected location from URL parameter on initial mount and change
  useEffect(() => {
    const locParam = searchParams.get("location");
    const matched = matchLocationFromParam(locParam);
    setSelectedLocation(matched);
  }, [searchParams]);

  // Handle location button selection & URL search query update
  const handleSelectLocation = (locationId: string) => {
    setSelectedLocation(locationId);
    if (locationId === "All") {
      router.push("/services", { scroll: false });
    } else {
      router.push(`/services?location=${encodeURIComponent(locationId)}`, { scroll: false });
    }
  };

  const activePillar = locationPillars.find((p) => p.id === selectedLocation);

  return (
    <>
      {/* Navigation Header */}
      <Header />

      <main className="pt-24 sm:pt-28 bg-background text-foreground transition-colors duration-300 min-h-screen">
        {/* ==========================================================================
           1. SERVICES HERO & DYNAMIC BREADCRUMBS SECTION
           ========================================================================== */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background border-b border-border/50 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
          {/* Ambient background light */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden opacity-30">
            <div className="absolute -top-24 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Dynamic Breadcrumbs: Home > Services (> Selected Location) */}
            <nav className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground mb-6 flex-wrap">
              <Link href="/" className="hover:text-primary transition-colors">
                {t("nav.home")}
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              {selectedLocation !== "All" && activePillar ? (
                <>
                  <Link 
                    href="/services" 
                    onClick={(e) => {
                      e.preventDefault();
                      handleSelectLocation("All");
                    }}
                    className="hover:text-primary transition-colors"
                  >
                    {t("nav.service")}
                  </Link>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-foreground font-semibold">
                    {t(activePillar.nameKey)}
                  </span>
                </>
              ) : (
                <span className="text-foreground font-semibold">
                  {t("nav.service")}
                </span>
              )}
            </nav>

            {/* Badge & Headline */}
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-semibold mb-4">
                <Stethoscope className="w-4 h-4" />
                <span>{t("services.hero.badge")}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4 sm:mb-6 leading-tight">
                {t("services.hero.title")}
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                {t("services.hero.subtitle")}
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

            {/* Location Filter Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {locationPillars.map((pillar) => {
                const isSelected = selectedLocation === pillar.id;
                const IconComponent = pillar.icon;

                return (
                  <button
                    key={pillar.id}
                    onClick={() => handleSelectLocation(pillar.id)}
                    className={`relative p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                      isSelected
                        ? "bg-card border-primary ring-2 ring-primary/50 shadow-xl scale-[1.02]"
                        : "bg-card/80 border-border/80 hover:border-primary/40 hover:bg-card shadow-sm"
                    }`}
                  >
                    {/* Active Selection Badge */}
                    {isSelected && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-primary text-primary-foreground text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t("doctors.location.active_badge")}</span>
                      </div>
                    )}

                    <div>
                      {/* Icon */}
                      <div className={`w-12 h-12 ${pillar.bgColor} rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                        <IconComponent className={`w-6 h-6 ${pillar.color}`} />
                      </div>

                      {/* Location Name */}
                      <h3 className={`text-base font-bold transition-colors ${isSelected ? "text-primary" : "text-foreground group-hover:text-primary"}`}>
                        {t(pillar.nameKey)}
                      </h3>

                      {/* Short Description */}
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        {t(pillar.descKey)}
                      </p>
                    </div>

                    {/* Bottom Status Indicator */}
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
           3. SERVICES CONTENT COMPONENT (FILTERED BY LOCATION & FRONTEND SEARCH)
           ========================================================================== */}
        <HospitalServices 
          selectedLocation={selectedLocation} 
          showHeader={false} 
        />

        {/* ==========================================================================
           4. EMERGENCY & BOOKING QUICK CTA BANNER
           ========================================================================== */}
        <section className="bg-primary/5 border-t border-border py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="max-w-xl">
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Need Immediate Medical Care or Consultation?
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Our emergency department and specialist doctors are available round-the-clock at Afilas General Hospital.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <Link
                href="/contact"
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
      <Footer />
    </>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ServicesContent />
    </Suspense>
  );
}