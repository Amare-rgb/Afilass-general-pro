"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageProvider";
import {
  Heart,
  Star,
  Shield,
  Lightbulb,
  Users,
  CheckCircle2,
  Eye,
  Target,
  Award,
  UserCircle2,
  ChevronRight,
  Briefcase,
  Building2,
  Calendar,
  BookOpen,
} from "lucide-react";

// ============================================================
// SCROLL-IN-VIEW ANIMATION HOOK
// ============================================================
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// ============================================================
// SECTION WRAPPER (scroll‑animated)
// ============================================================
function AnimatedSection({
  id,
  children,
  className = "",
  delay = 0,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      id={id}
      ref={ref}
      className={`${className} transition-all duration-700 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </section>
  );
}

// ============================================================
// LEADERSHIP CARD COMPONENT
// ============================================================
function LeadershipCard({
  name,
  title,
  role,
  index,
}: {
  name: string;
  title: string;
  role: string;
  index: number;
}) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={`group relative flex items-start gap-4 p-5 rounded-2xl bg-card border border-border hover:border-teal-500/30 hover:shadow-lg hover:shadow-teal-500/5 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Avatar Circle */}
      <div className="shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 dark:from-teal-400 dark:to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-105 transition-transform">
        {name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-foreground group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
          {name}
        </h4>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
          {title}
        </p>
        <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-teal-500/10 dark:bg-teal-400/10 text-teal-700 dark:text-teal-400 text-[10px] font-semibold uppercase tracking-wider">
          {role}
        </span>
      </div>
    </div>
  );
}

// ============================================================
// MAIN ABOUT US PAGE
// ============================================================
export default function AboutUsPage() {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState("what-is-afilas");

  // Table of contents sections
  const tocSections = useMemo(
    () => [
      { id: "what-is-afilas", label: t("about.what_is_afilas"), icon: BookOpen },
      { id: "vision-mission", label: `${t("about.vision_title")} & ${t("about.mission_title")}`, icon: Eye },
      { id: "core-values", label: t("about.core_values_title"), icon: Star },
      { id: "board", label: t("about.board_title"), icon: Users },
      { id: "inspectors", label: t("about.inspectors_title"), icon: Shield },
      { id: "ceo", label: t("about.ceo_title"), icon: Award },
      { id: "directors", label: t("about.directors_title"), icon: Briefcase },
    ],
    [t]
  );

  // Core values data
  const coreValues = useMemo(
    () => [
      { icon: Heart, title: t("about.core_value_1_title"), desc: t("about.core_value_1_desc"), color: "from-rose-500 to-pink-600" },
      { icon: Star, title: t("about.core_value_2_title"), desc: t("about.core_value_2_desc"), color: "from-amber-500 to-orange-600" },
      { icon: Shield, title: t("about.core_value_3_title"), desc: t("about.core_value_3_desc"), color: "from-blue-500 to-indigo-600" },
      { icon: Lightbulb, title: t("about.core_value_4_title"), desc: t("about.core_value_4_desc"), color: "from-emerald-500 to-teal-600" },
      { icon: Users, title: t("about.core_value_5_title"), desc: t("about.core_value_5_desc"), color: "from-violet-500 to-purple-600" },
      { icon: CheckCircle2, title: t("about.core_value_6_title"), desc: t("about.core_value_6_desc"), color: "from-cyan-500 to-sky-600" },
    ],
    [t]
  );

  // Board of directors data
  const boardMembers = [
    { name: "Dr. Mequanint Yimer", title: "MD, Assistant Professor of Urology", role: "President" },
    { name: "Dr. Nebiyu Shitaye", title: "MD, Assistant Professor of General and Pediatrics Surgeon", role: "Vice President" },
    { name: "Dr. Nebiyat Embiale", title: "MD, Assistant Professor of General and Hepatopancreatobiliary Surgery", role: "Board Member" },
    { name: "Dr. Sisay Muluken", title: "MD, Assistant Professor of Plastic and Reconstructive Surgery", role: "Board Member" },
    { name: "Dr. Solomon Kassaye", title: "MD, Assistant Professor of Orthopedic Surgery", role: "Board Member" },
    { name: "Dr. Walelign Kindie", title: "MD, Assistant Professor of Gynecologic Oncology", role: "Board Member" },
  ];

  // Inspectors data
  const inspectors = [
    { name: "Dr. Aderaw Getie", title: "MD, Assistant Professor of Trauma and Arthroplasty Surgery", role: "Chair of Inspection Team" },
    { name: "Dr. Belaynew Zemed", title: "MD, Assistant Professor of Pediatric and Child Health", role: "Internal Auditor" },
    { name: "Mr. Gebrehiwot Assifaw", title: "BSc, MSc, PHD Candidate", role: "Internal Auditor" },
  ];

  // Directors data
  const directors = [
    { name: "Dr. Getnet Aschale", title: "MD, Pediatrician", role: "Medical Director" },
    { name: "Mr. Habitamu Ayehualem", title: "Masters in Public Health", role: "Managing Director" },
    { name: "Mr. Deguale Asnake", title: "Senior Accountant", role: "Finance & Property Administration Director" },
  ];

  // Intersection observer for active TOC tracking
  useEffect(() => {
    const sectionIds = tocSections.map((s) => s.id);
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { rootMargin: "-30% 0px -60% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [tocSections]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300">
      <Header />

      <main className="flex-grow">
        {/* ================= HERO / TITLE WITH WAVE ================= */}
        <section className="relative pt-32 sm:pt-36 pb-32 sm:pb-40 bg-teal-700 dark:bg-teal-900 overflow-hidden">
          {/* Decorative floating shapes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-16 left-[10%] w-72 h-72 rounded-full bg-teal-500/20 blur-3xl floating-shape" />
            <div className="absolute bottom-20 right-[15%] w-96 h-96 rounded-full bg-teal-400/10 blur-3xl floating-shape" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-teal-600/10 blur-[120px]" />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white/80 text-xs font-semibold uppercase tracking-wider border border-white/20 mb-6">
              <Building2 className="w-3.5 h-3.5" />
              <span>Afilas Group</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              {t("about.page_title")}
            </h1>

            <p className="mt-5 text-lg sm:text-xl text-white/70 max-w-2xl mx-auto">
              {t("about.meaning_text")}
            </p>

            {/* Quick stats */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 text-white">
                  <Calendar className="w-4 h-4 text-teal-300" />
                  <span className="text-xs font-semibold text-teal-200 uppercase tracking-wider">{t("about.established")}</span>
                </div>
                <p className="text-xl font-bold text-white mt-1">{t("about.established_year")}</p>
              </div>
              <div className="w-px h-10 bg-white/20 hidden sm:block" />
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 text-white">
                  <BookOpen className="w-4 h-4 text-teal-300" />
                  <span className="text-xs font-semibold text-teal-200 uppercase tracking-wider">{t("about.meaning")}</span>
                </div>
                <p className="text-xl font-bold text-white mt-1 italic">&ldquo;AFILAS&rdquo;</p>
              </div>
              <div className="w-px h-10 bg-white/20 hidden sm:block" />
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 text-white">
                  <Building2 className="w-4 h-4 text-teal-300" />
                  <span className="text-xs font-semibold text-teal-200 uppercase tracking-wider">Divisions</span>
                </div>
                <p className="text-xl font-bold text-white mt-1">3</p>
              </div>
            </div>
          </div>

          {/* SVG Wave */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
            <svg
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 120"
              preserveAspectRatio="xMidYMax slice"
              className="relative block w-full h-[80px] sm:h-[120px]"
            >
              <path
                d="M0,0 C150,90 350,-40 600,60 C850,160 1050,30 1200,0 L1200,120 L0,120 Z"
                className="fill-background"
              />
            </svg>
          </div>
        </section>

        {/* ================= MAIN CONTENT + TOC LAYOUT ================= */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex gap-10 xl:gap-16 relative">
            {/* ---- Sticky Table of Contents (Desktop sidebar) ---- */}
            <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
              <nav className="sticky top-32 space-y-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 px-3">
                  {t("about.toc_title")}
                </h3>
                {tocSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                        activeSection === section.id
                          ? "bg-teal-500/10 dark:bg-teal-400/10 text-teal-700 dark:text-teal-400 border-l-2 border-teal-600 dark:border-teal-400"
                          : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-foreground border-l-2 border-transparent"
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                        activeSection === section.id
                          ? "text-teal-600 dark:text-teal-400"
                          : "text-muted-foreground group-hover:text-foreground"
                      }`} />
                      <span className="truncate">{section.label}</span>
                    </a>
                  );
                })}
              </nav>
            </aside>

            {/* ---- Main content column ---- */}
            <div className="flex-1 min-w-0 space-y-20 sm:space-y-28">
              {/* ================= WHAT IS AFILAS ================= */}
              <AnimatedSection id="what-is-afilas" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 dark:bg-teal-400/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                    {t("about.what_is_afilas")}
                  </h2>
                </div>

                <div className="space-y-6 text-base leading-relaxed text-foreground/80">
                  <p>{t("about.what_is_afilas_p1")}</p>
                  <p>{t("about.what_is_afilas_p2")}</p>
                  <p>{t("about.what_is_afilas_p3")}</p>
                </div>

                {/* Timeline badges */}
                <div className="mt-10 grid sm:grid-cols-3 gap-4">
                  {[
                    { year: "2017", label: "Afilas Founded", desc: "Health Science Scholars" },
                    { year: "2018", label: "Hospital Opened", desc: "Afilas General Hospital" },
                    { year: "2022–2026", label: "Pharma & Diagnostics", desc: "APW & Diagnosis Center" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="relative p-5 rounded-2xl bg-card border border-border hover:border-teal-500/30 transition-all group"
                    >
                      <span className="text-3xl font-black text-teal-600/15 dark:text-teal-400/10 absolute top-3 right-4 group-hover:text-teal-600/25 dark:group-hover:text-teal-400/20 transition-colors">
                        {item.year}
                      </span>
                      <p className="text-sm font-bold text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </AnimatedSection>

              {/* ================= VISION & MISSION ================= */}
              <AnimatedSection id="vision-mission" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 dark:bg-teal-400/10 flex items-center justify-center">
                    <Eye className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                    {t("about.vision_title")} & {t("about.mission_title")}
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Vision Card */}
                  <div className="relative p-8 rounded-3xl bg-gradient-to-br from-teal-600 to-teal-800 dark:from-teal-700 dark:to-teal-900 text-white overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 blur-2xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center mb-5">
                        <Eye className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{t("about.vision_title")}</h3>
                      <p className="text-white/85 leading-relaxed text-sm">
                        {t("about.vision_text")}
                      </p>
                    </div>
                  </div>

                  {/* Mission Card */}
                  <div className="relative p-8 rounded-3xl bg-card border border-border overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-teal-500/5 blur-2xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-xl bg-teal-500/10 dark:bg-teal-400/10 flex items-center justify-center mb-5">
                        <Target className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-4">{t("about.mission_title")}</h3>
                      <ul className="space-y-3">
                        {[
                          t("about.mission_1"),
                          t("about.mission_2"),
                          t("about.mission_3"),
                          t("about.mission_4"),
                        ].map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                            <ChevronRight className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* ================= CORE VALUES ================= */}
              <AnimatedSection id="core-values" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 dark:bg-teal-400/10 flex items-center justify-center">
                    <Star className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                    {t("about.core_values_title")}
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {coreValues.map((value, idx) => {
                    const Icon = value.icon;
                    return (
                      <div
                        key={idx}
                        className="group p-6 rounded-2xl bg-card border border-border hover:border-teal-500/30 hover:shadow-lg hover:shadow-teal-500/5 transition-all duration-300"
                      >
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-base font-bold text-foreground mb-2">
                          {value.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {value.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </AnimatedSection>

              {/* ================= BOARD OF DIRECTORS ================= */}
              <AnimatedSection id="board" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 dark:bg-teal-400/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                    {t("about.board_title")}
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {boardMembers.map((m, i) => (
                    <LeadershipCard key={i} name={m.name} title={m.title} role={m.role} index={i} />
                  ))}
                </div>
              </AnimatedSection>

              {/* ================= INSPECTORS / INTERNAL AUDITORS ================= */}
              <AnimatedSection id="inspectors" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 dark:bg-teal-400/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                    {t("about.inspectors_title")}
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {inspectors.map((m, i) => (
                    <LeadershipCard key={i} name={m.name} title={m.title} role={m.role} index={i} />
                  ))}
                </div>
              </AnimatedSection>

              {/* ================= CEO ================= */}
              <AnimatedSection id="ceo" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 dark:bg-teal-400/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                    {t("about.ceo_title")}
                  </h2>
                </div>

                <div className="relative p-8 rounded-3xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border border-border overflow-hidden">
                  <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-teal-500/5 blur-3xl -translate-y-1/3 translate-x-1/3" />
                  <div className="relative z-10 flex items-center gap-6 flex-wrap sm:flex-nowrap">
                    <div className="shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 dark:from-teal-400 dark:to-teal-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-teal-500/20">
                      EA
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Dr. Enyew Abate</h3>
                      <p className="text-sm text-muted-foreground mt-1">MD, Assistant Professor of Gynecology and Obstetrics</p>
                      <span className="inline-block mt-3 px-4 py-1.5 rounded-full bg-teal-600 text-white text-xs font-bold tracking-wide shadow-md">
                        Chief Executive Officer
                      </span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* ================= DIRECTORS ================= */}
              <AnimatedSection id="directors" className="scroll-mt-28">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 dark:bg-teal-400/10 flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                    {t("about.directors_title")}
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {directors.map((m, i) => (
                    <LeadershipCard key={i} name={m.name} title={m.title} role={m.role} index={i} />
                  ))}
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
