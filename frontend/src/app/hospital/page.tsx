"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DoctorFinder } from "@/components/DoctorFinder";
import { HospitalServices } from "@/components/HospitalDivision/HospitalServices";
import { useLanguage } from "@/contexts/LanguageProvider";
import {
  ArrowRight,
  Building2,
  Users,
  Heart,
  Brain,
  Bone,
  Shield,
  Ambulance,
  Play,
  Check,
  Award,
  Clock,
  Sparkles,
  PhoneCall,
  X,
} from "lucide-react";

const departments = [
  {
    slug: "cardiology",
    name: "Cardiology",
    description:
      "Heart and cardiovascular system care with advanced interventional procedures",
    icon: Heart,
    color: "text-red-500",
    bgColor: "bg-red-100 dark:bg-red-950/30",
  },
  {
    slug: "pediatrics",
    name: "Pediatrics",
    description:
      "Specialized care for children and infants in a child-friendly environment",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-950/30",
  },
  {
    slug: "neurology",
    name: "Neurology",
    description:
      "Brain and nervous system treatment with advanced diagnostic technology",
    icon: Brain,
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-950/30",
  },
  {
    slug: "orthopedics",
    name: "Orthopedics",
    description:
      "Bone and joint health management including surgical and non-surgical care",
    icon: Bone,
    color: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-950/30",
  },
  {
    slug: "oncology",
    name: "Oncology",
    description:
      "Cancer diagnosis and specialized treatment with comprehensive patient support",
    icon: Shield,
    color: "text-orange-500",
    bgColor: "bg-orange-100 dark:bg-orange-950/30",
  },
  {
    slug: "emergency",
    name: "Emergency Medicine",
    description:
      "24/7 emergency and trauma care with rapid response medical teams",
    icon: Ambulance,
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-950/30",
  },
];

const amenities = [
  {
    title: "ICU/CCU",
    desc: "Intensive care units with advanced monitoring and life support systems.",
    icon: Building2,
  },
  {
    title: "Surgery Suites",
    desc: "Modern operating rooms with latest equipment including robotic-assisted surgery.",
    icon: Sparkles,
  },
  {
    title: "Diagnostic Center",
    desc: "Advanced imaging and laboratory services including MRI, CT scans, and X-ray.",
    icon: Award,
  },
  {
    title: "Pharmacy",
    desc: "In-house pharmacy with comprehensive stock of medications available 24/7.",
    icon: Clock,
  },
  {
    title: "Blood Bank",
    desc: "Safe and tested blood transfusion services available around the clock.",
    icon: Shield,
  },
  {
    title: "Emergency Room",
    desc: "24/7 emergency services and trauma care with rapid response teams.",
    icon: PhoneCall,
  },
];

const trustLogos = [
  { name: "JCI ACCREDITED", badge: "Gold Standard" },
  { name: "MINISTRY OF HEALTH", badge: "Certified" },
  { name: "WORLD HEALTH ORG", badge: "Partner" },
  { name: "ISO 9001:2015", badge: "Certified Quality" },
];

export default function HospitalPage() {
  const { t } = useLanguage();

  // Scroll Reveal Observer Logic matching template JS
  useEffect(() => {
    const revealElements = document.querySelectorAll(
      ".reveal-left, .reveal-right, .reveal-up"
    );

    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -50px 0px",
      threshold: 0.15,
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-active");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach((el) => revealObserver.observe(el));

    return () => revealObserver.disconnect();
  }, []);

  return (
    <>
      {/* Top Header - Kept untouched */}
      <Header />

      <main className="pt-20 sm:pt-28 bg-background text-foreground transition-colors duration-300">
        {/* ==========================================================================
           1. HERO SECTION (Template Landing Page Layout)
           ========================================================================== */}
        <section className="hero-wrapper container mx-auto px-4 sm:px-6 lg:px-8 text-center pt-6 pb-12 relative">
          <div className="hero-content reveal-up max-w-4xl mx-auto">
            <p className="sub-headline text-xs sm:text-sm font-semibold uppercase tracking-widest text-primary mb-3">
              {t("hospital.sub_headline") || "Afilas General Hospital & Healthcare Network"}
            </p>
            <h1 className="headline text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6 text-foreground">
              Turn Health Concerns into <br className="hidden sm:block" />
              <span className="text-primary">Lifelong Wellness</span>
            </h1>

            <div className="hero-ctas flex flex-wrap justify-center items-center gap-4 mb-4">
              <a
                href="#doctors"
                className="btn btn-primary px-8 py-3.5 bg-primary text-primary-foreground font-bold rounded-lg shadow-lg hover:bg-primary/90 hover:scale-105 transition-all duration-200"
              >
                Book Appointment
              </a>
              <div className="glow-container">
                <a
                  href="#services"
                  className="btn btn-secondary px-8 py-3.5 bg-card text-foreground font-bold rounded-lg border border-border hover:bg-accent/10 transition-all duration-200 block"
                >
                  View Medical Services
                </a>
              </div>
            </div>

            <p className="pricing-note text-xs text-muted-foreground mb-10">
              24/7 Emergency Care • JCI Accredited • 50+ Senior Medical Specialists
            </p>

            {/* Hero Dashboard / Facility Showcase Mockup */}
            <div className="mockup-container hero-video-mockup reveal-up delay-1 max-w-4xl mx-auto h-[260px] sm:h-[420px] relative rounded-2xl overflow-hidden border border-border shadow-2xl group">
              <Image
                src="/afilas.jpg"
                alt="Afilas General Hospital Facility"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </section>

        {/* ==========================================================================
           2. LOGOS / TRUST SECTION (Template Section 4)
           ========================================================================== */}
        <section className="logos-wrapper container mx-auto px-4 sm:px-6 lg:px-8 text-center py-10 border-t border-border/40 reveal-up">
          <p className="logos-headline text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">
            TRUSTED BY LEADING HEALTHCARE PARTNERS & 50,000+ PATIENTS
          </p>
          <div className="logo-grid grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-center">
            {trustLogos.map((item, idx) => (
              <div
                key={idx}
                className="logo-item p-4 rounded-xl bg-card border border-border/60 hover:border-primary/40 transition-colors shadow-sm flex flex-col items-center justify-center"
              >
                <span className="font-extrabold text-sm sm:text-base text-foreground tracking-wide">
                  {item.name}
                </span>
                <span className="text-[11px] font-semibold text-primary mt-1">
                  {item.badge}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ==========================================================================
           3. WELCOME TO AFILAS GENERAL HOSPITAL SECTION
           ========================================================================== */}
        <section
          id="about"
          className="how-it-works-wrapper container mx-auto px-4 sm:px-6 lg:px-8 text-center py-12 sm:py-16"
        >
          <div className="step-card-wrapper step-with-glow reveal-up max-w-4xl mx-auto">
            <div className="step-card bg-card border border-border rounded-2xl p-8 sm:p-12 text-center shadow-lg">
              <h2 className="section-title text-2xl sm:text-4xl font-extrabold text-foreground mb-4">
                Welcome to Afilas General Hospital
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Afilas hospital is a multi-specialty hospital located around Felege Hiwot Hospital, in front of Amhara public health institute, offshore Lake Tana with breathtaking view. It is one of the private hospitals in the city, with over 10 specialty centers. Afilas offers state-of-the-art diagnostic and therapeutic care in a one-stop medical center.
              </p>
            </div>
          </div>
        </section>

        {/* ==========================================================================
           4. FEATURE 1: DEPARTMENTS SHOWCASE (Template Section 6)
           ========================================================================== */}
        <section className="feature-wrapper feature-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex flex-col lg:flex-row items-center gap-12">
          <div className="feature-mockup mockup-container w-full lg:w-1/2 h-[320px] sm:h-[400px] rounded-2xl border border-border shadow-lg relative overflow-hidden reveal-left">
            <Image
              src="/diagnostics-bg.jpg"
              alt="Medical Department Facility"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
              <div className="text-white">
                <span className="text-xs font-bold uppercase tracking-wider text-primary-foreground bg-primary px-3 py-1 rounded-md">
                  Clinical Excellence
                </span>
                <h4 className="text-xl font-bold mt-2">Comprehensive Medical Departments</h4>
              </div>
            </div>
          </div>

          <div className="feature-content w-full lg:w-1/2 text-left reveal-right">
            <h2 className="section-title text-2xl sm:text-4xl font-extrabold text-foreground mb-4">
              Specialized Medical Departments
            </h2>
            <p className="feature-text text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
              Our multidisciplinary teams of specialized physicians, surgeons, and healthcare practitioners deliver world-class medical outcomes using cutting-edge technologies.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {departments.map((dept) => {
                const Icon = dept.icon;
                return (
                  <Link
                    key={dept.slug}
                    href={`/hospital/departments/${dept.slug}`}
                    className="p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-md transition-all duration-300 group flex items-start gap-3"
                  >
                    <div
                      className={`w-10 h-10 ${dept.bgColor} rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className={`w-5 h-5 ${dept.color}`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                        {dept.name}
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        {dept.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==========================================================================
           5. FEATURE 2: HOSPITAL AMENITIES (Template Section 7)
           ========================================================================== */}
        <section className="feature-wrapper feature-2 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex flex-col-reverse lg:flex-row items-center gap-12">
          <div className="feature-content w-full lg:w-1/2 text-left reveal-left">
            <h2 className="section-title text-2xl sm:text-4xl font-extrabold text-foreground mb-4">
              World-Class Hospital Amenities
            </h2>
            <p className="feature-text text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
              Designed around patient dignity, safety, and rapid recovery. From 24/7 emergency response to advanced imaging labs and modern surgical suites.
            </p>

            <div className="glow-container">
              <a
                href="#services"
                className="btn btn-secondary px-6 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all inline-flex items-center gap-2"
              >
                Explore Facilities
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="feature-mockup mockup-container w-full lg:w-1/2 reveal-right">
            <div className="grid sm:grid-cols-2 gap-4 p-6 bg-card border border-border rounded-2xl shadow-xl">
              {amenities.map((amenity, idx) => {
                const Icon = amenity.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-background border border-border/80 hover:bg-accent/5 transition-colors"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground mb-1">
                      {amenity.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-normal">
                      {amenity.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==========================================================================
           6. STATS SECTION WITH GLOW CARD (Template Section 8)
           ========================================================================== */}
        <section className="stats-wrapper container mx-auto px-4 sm:px-6 lg:px-8 text-center py-16 sm:py-24">
          <h2 className="stats-title section-title text-2xl sm:text-4xl font-extrabold text-foreground mb-4 reveal-up max-w-3xl mx-auto">
            Excellence in Healthcare & Clinical Outcomes
          </h2>
          
          <div className="stats-card-container reveal-up delay-1 max-w-4xl mx-auto">
            <div className="stats-card bg-card border border-border rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6 shadow-xl">
              <div className="stat-item p-2">
                <p className="stat-label text-xs font-bold tracking-widest text-muted-foreground uppercase mb-2">
                  DEPARTMENTS
                </p>
                <p className="stat-number text-3xl sm:text-4xl font-black text-primary">
                  6+
                </p>
              </div>
              <div className="stat-item p-2">
                <p className="stat-label text-xs font-bold tracking-widest text-muted-foreground uppercase mb-2">
                  SPECIALISTS
                </p>
                <p className="stat-number text-3xl sm:text-4xl font-black text-primary">
                  50+
                </p>
              </div>
              <div className="stat-item p-2">
                <p className="stat-label text-xs font-bold tracking-widest text-muted-foreground uppercase mb-2">
                  BED CAPACITY
                </p>
                <p className="stat-number text-3xl sm:text-4xl font-black text-primary">
                  200+
                </p>
              </div>
              <div className="stat-item p-2">
                <p className="stat-label text-xs font-bold tracking-widest text-muted-foreground uppercase mb-2">
                  PATIENTS SERVED
                </p>
                <p className="stat-number text-3xl sm:text-4xl font-black text-primary">
                  50,000+
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================================
           7. PRICING & PACKAGES SECTION (Template Section 9)
           ========================================================================== */}
        <section
          id="pricing"
          className="pricing-cta-wrapper container mx-auto px-4 sm:px-6 lg:px-8 text-center py-16 sm:py-24"
        >
          <h2 className="section-title text-2xl sm:text-4xl font-extrabold text-foreground mb-4 reveal-up max-w-2xl mx-auto">
            Comprehensive Health Packages & Transparent Pricing
          </h2>

          <div className="pricing-card-container reveal-up delay-1 max-w-4xl mx-auto">
            <div className="pricing-card bg-card text-foreground rounded-2xl p-8 sm:p-12 flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl border border-border">
              <div className="pricing-left text-left w-full md:w-2/3">
                <ul className="features-list grid sm:grid-cols-2 gap-3 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>24/7 Emergency Support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>Diagnostic & Lab Testing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>Dedicated Senior Specialist</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>In-House Pharmacy Access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>Digital Medical Records</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    <span>Structured Follow-up Care</span>
                  </li>
                </ul>
              </div>

              <div className="pricing-right text-center md:text-right w-full md:w-1/3 flex flex-col items-center md:items-end">
                <p className="price-value text-3xl sm:text-4xl font-black text-primary mb-1">
                  ETB 1,200 <span className="price-period text-xs font-normal text-muted-foreground">/ consult</span>
                </p>
                <p className="text-xs text-muted-foreground mb-4">Transparent fees with zero hidden charges</p>
                <a
                  href="#doctors"
                  className="btn btn-primary px-6 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all text-sm block w-full text-center shadow-md"
                >
                  Book Your Consultation
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================================
           8. MEDICAL SERVICES SECTION (API Connected Component)
           ========================================================================== */}
        <div id="services" className="border-t border-border/50">
          <HospitalServices />
        </div>

        {/* ==========================================================================
           9. DOCTOR FINDER SECTION (Search & API Connected Component)
           ========================================================================== */}
        <div className="border-t border-border">
          <DoctorFinder />
        </div>

        {/* ==========================================================================
           10. TESTIMONIAL SECTION (Template Section 10)
           ========================================================================== */}
        <section className="testimonial-wrapper container mx-auto px-4 sm:px-6 lg:px-8 text-center py-10 sm:py-14 border-t border-border/40 reveal-up">
          <div className="testimonial-content max-w-2xl mx-auto">
            <div className="testimonial-profile mb-6">
              <div className="profile-pic-container w-16 h-16 rounded-full overflow-hidden mx-auto bg-muted border-2 border-primary shadow-md relative">
                <Image
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80"
                  alt="Dr. Selam Tesfaye"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <blockquote className="testimonial-quote text-base sm:text-lg font-medium text-foreground italic mb-6 leading-relaxed">
              “At Afilas General Hospital, our mission is to blend high-precision medical science with compassionate care. Every treatment plan is tailored specifically to ensure quick recovery and lasting health for our patients.”
            </blockquote>
            <div className="testimonial-author">
              <p className="author-name font-bold text-sm text-foreground">
                Dr. Selam Tesfaye
              </p>
              <p className="author-title text-xs text-muted-foreground">
                Chief Medical Officer & Senior Endocrinologist
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Footer - Kept untouched */}
      <Footer />
    </>
  );
}
