"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HospitalServices } from "@/components/HospitalDivision/HospitalServices";
import { useLanguage } from "@/contexts/LanguageProvider";
import { 
  Stethoscope, 
  Clock, 
  Award, 
  ShieldCheck, 
  ChevronRight,
  PhoneCall,
  Calendar
} from "lucide-react";

export default function ServicesPage() {
  const { t } = useLanguage();

  return (
    <>
      {/* Navigation Header */}
      <Header />

      <main className="pt-24 sm:pt-28 bg-background text-foreground transition-colors duration-300 min-h-screen">
        {/* ==========================================================================
           1. SERVICES HERO / HEADER SECTION
           ========================================================================== */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background border-b border-border/50 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
          {/* Subtle background ambient blobs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden opacity-30">
            <div className="absolute -top-24 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
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
                {t("nav.service")}
              </span>
            </nav>

            {/* Badge & Title */}
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-semibold mb-4">
                <Stethoscope className="w-4 h-4" />
                <span>{t("services.hero.badge")}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4 sm:mb-6 leading-tight">
                {t("services.hero.title")}
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
                {t("services.hero.subtitle")}
              </p>

              {/* Highlight Stats Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
                <div className="bg-card border border-border/80 rounded-xl p-4 flex items-center space-x-3 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("services.stat.available")}</p>
                    <p className="text-sm font-bold text-foreground">24/7 Access</p>
                  </div>
                </div>

                <div className="bg-card border border-border/80 rounded-xl p-4 flex items-center space-x-3 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("services.stat.specialists")}</p>
                    <p className="text-sm font-bold text-foreground">Expert Care</p>
                  </div>
                </div>

                <div className="bg-card border border-border/80 rounded-xl p-4 flex items-center space-x-3 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t("services.stat.accredited")}</p>
                    <p className="text-sm font-bold text-foreground">Certified Standards</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================================
           2. SERVICES CONTENT COMPONENT WITH LIVE SEARCH
           ========================================================================== */}
        <HospitalServices showHeader={false} />

        {/* ==========================================================================
           3. EMERGENCY & BOOKING QUICK CTA BANNER
           ========================================================================== */}
        <section className="bg-primary/5 border-y border-border py-12 sm:py-16 px-4 sm:px-6 lg:px-8 my-8">
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
