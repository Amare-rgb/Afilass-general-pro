"use client";

import Link from "next/link";
import {
  Building2,
  ArrowRight,
  FlaskConical,
  Microscope,
  Bug,
  ShieldCheck,
  Waves,
  ScanLine,
  Scan,
  Activity,
  Briefcase,
  Droplet,
  HeartPulse,
  Smartphone,
  Lock,
  ChevronRight,
  Award,
  Clock,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/* ---------- Reveal-on-scroll wrapper ---------- */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
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

/* ---------- Data ---------- */
const LAB_SERVICES = [
  { icon: Microscope, name: "Hematology", note: "Blood count & clotting studies" },
  { icon: FlaskConical, name: "Biochemistry", note: "Organ & metabolic panels" },
  { icon: Bug, name: "Microbiology", note: "Culture & sensitivity testing" },
  { icon: ShieldCheck, name: "Immunology", note: "Antibody & antigen screening" },
];

const PACKAGES = [
  {
    icon: Briefcase,
    name: "Executive Wellness",
    note: "A full-body baseline for busy schedules — bloodwork, imaging, and a same-week consult.",
  },
  {
    icon: Droplet,
    name: "Diabetic Care",
    note: "Glucose, HbA1c, kidney and eye screening tracked together for ongoing management.",
  },
  {
    icon: HeartPulse,
    name: "Women's / Men's Health",
    note: "Comprehensive screening built around the checks that matter most at each life stage.",
  },
];

export default function AfilasDiagnosticCenter() {
  return (
    <section className="w-full py-20 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#0284c7 1px, transparent 1px), linear-gradient(90deg, #0284c7 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-6xl mx-auto">
        
        {/* ===== AFILAS DIAGNOSTIC CENTER - MINIMIZED CENTERED ===== */}
        <Reveal className="mb-16">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Building2 className="w-5 h-5 text-sky-600" />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">
                Afilas <span className="text-sky-600">Diagnostic Center</span>
              </h2>
            </div>
            
            <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
              Fast, precise, and reliable diagnostic results driving accurate medical decisions.
            </p>
          </div>
        </Reveal>

        {/* About Afilas Diagnostic Center - Fully Centered */}
        <Reveal delay={100} className="mb-16">
          <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-3xl border border-sky-200 p-8 md:p-10 hover:shadow-xl transition-all duration-500 hover:scale-[1.01]">
            {/* Header - Centered */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-sky-600 p-2.5 rounded-xl">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-serif font-bold text-2xl text-slate-900 text-center">
                About Afilas Diagnostic Center
              </h3>
            </div>
            
            {/* Description - Centered */}
            <p className="text-slate-700 text-sm md:text-base leading-relaxed max-w-3xl mx-auto mb-6 text-center">
              <span className="font-semibold text-sky-700">Afilas Diagnostic Center</span> is a 
              state-of-the-art diagnostic facility dedicated to providing accurate, timely, and 
              reliable diagnostic services to support better healthcare outcomes.
            </p>
            
            {/* Features Grid - Centered */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-6">
              <div className="bg-white/60 rounded-xl p-4 border border-sky-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Microscope className="w-4 h-4 text-sky-600" />
                  <h4 className="font-semibold text-slate-800 text-sm">Comprehensive Testing</h4>
                </div>
                <p className="text-xs text-slate-600 text-center">
                  From routine blood work to specialized diagnostic tests.
                </p>
              </div>
              
              <div className="bg-white/60 rounded-xl p-4 border border-sky-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-sky-600" />
                  <h4 className="font-semibold text-slate-800 text-sm">Quick Turnaround</h4>
                </div>
                <p className="text-xs text-slate-600 text-center">
                  Results delivered within 24-48 hours with digital access.
                </p>
              </div>
              
              <div className="bg-white/60 rounded-xl p-4 border border-sky-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                  <h4 className="font-semibold text-slate-800 text-sm">Quality Assurance</h4>
                </div>
                <p className="text-xs text-slate-600 text-center">
                  Advanced equipment with international quality standards.
                </p>
              </div>
              
              <div className="bg-white/60 rounded-xl p-4 border border-sky-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Smartphone className="w-4 h-4 text-sky-600" />
                  <h4 className="font-semibold text-slate-800 text-sm">Digital Convenience</h4>
                </div>
                <p className="text-xs text-slate-600 text-center">
                  Secure online access to reports anytime, anywhere.
                </p>
              </div>
            </div>

            {/* Go To Diagnostic Center Button - Centered */}
            <div className="flex justify-center mt-4">
              <Link
                href="/diagnostics"
                className="group inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Go To Diagnostic Center
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Specialized Health Check Packages - Centered with Enhanced Hover */}
        <Reveal delay={150} className="mb-16">
          <div className="text-center mb-6">
            <h3 className="font-serif font-bold text-3xl text-slate-900">
              Specialized Health Check Packages
            </h3>
            <p className="text-sm uppercase tracking-widest text-slate-400 mt-2">
              Comprehensive screening for every life stage
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {PACKAGES.map(({ icon: Icon, name, note }) => (
              <div
                key={name}
                className="group rounded-2xl bg-gradient-to-b from-sky-50 to-white border border-sky-100 p-6 hover:border-sky-400 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center cursor-pointer"
              >
                <div className="bg-sky-600 w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-sky-700 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                  <Icon className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <p className="font-semibold text-slate-900 group-hover:text-sky-700 transition-colors duration-300 text-lg mb-1">
                  {name}
                </p>
                <p className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors duration-300 leading-relaxed">
                  {note}
                </p>
                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-xs text-sky-600 font-medium">Learn More →</span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

      </div>
    </section>
  );
}