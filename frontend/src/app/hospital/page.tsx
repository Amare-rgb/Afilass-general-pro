"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageProvider";
import {
  ArrowRight,
  Users,
  Heart,
  Brain,
  Bone,
  Shield,
  Ambulance,
  ChevronLeft, 
  ChevronRight,
  Loader2,       // new
  AlertCircle,
  MapPin,   // optional for error
} from "lucide-react";

const departments = [
  {
    slug: "cardiology",
    nameKey: "hospital.dept.cardiology.name",
    descKey: "hospital.dept.cardiology.desc",
    icon: Heart,
    color: "text-red-500",
    bgColor: "bg-red-100 dark:bg-red-950/30",
  },
  {
    slug: "pediatrics",
    nameKey: "hospital.dept.pediatrics.name",
    descKey: "hospital.dept.pediatrics.desc",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-950/30",
  },
  {
    slug: "neurology",
    nameKey: "hospital.dept.neurology.name",
    descKey: "hospital.dept.neurology.desc",
    icon: Brain,
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-950/30",
  },
  {
    slug: "orthopedics",
    nameKey: "hospital.dept.orthopedics.name",
    descKey: "hospital.dept.orthopedics.desc",
    icon: Bone,
    color: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-950/30",
  },
  {
    slug: "oncology",
    nameKey: "hospital.dept.oncology.name",
    descKey: "hospital.dept.oncology.desc",
    icon: Shield,
    color: "text-orange-500",
    bgColor: "bg-orange-100 dark:bg-orange-950/30",
  },
  {
    slug: "emergency",
    nameKey: "hospital.dept.emergency.name",
    descKey: "hospital.dept.emergency.desc",
    icon: Ambulance,
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-950/30",
  },
];

const amenitiesData = [
  {
    image: "https://images.unsplash.com/photo-1778151270902-cb0ca572f2ee?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // ICU
    titleKey: "hospital.amenity.item1.title",
    descKey: "hospital.amenity.item1.desc",
  },
  {
    image: "/lab2.jpg", // Surgery
    titleKey: "hospital.amenity.item2.title",
    descKey: "hospital.amenity.item2.desc",
  },
  {
    image: "/Afilas-Diagnosis-1.jpg", // Diagnostic
    titleKey: "hospital.amenity.item3.title",
    descKey: "hospital.amenity.item3.desc",
  },
  {
    image: "/Afilas-Pharmacy.jpg", // Pharmacy
    titleKey: "hospital.amenity.item4.title",
    descKey: "hospital.amenity.item4.desc",
  },
  {
    image: "https://images.unsplash.com/photo-1536856136534-bb679c52a9aa?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // Blood Bank
    titleKey: "hospital.amenity.item5.title",
    descKey: "hospital.amenity.item5.desc",
  },
  {
    image: "/Afilas-Hospital-emergency.jpg", // Emergency
    titleKey: "hospital.amenity.item6.title",
    descKey: "hospital.amenity.item6.desc",
  },
];

const mockDoctors = [
  {
    id: "mock-1",
    name: "Dr. Amanuel Kebede",
    title: "Senior Cardiologist",
    bio: "Specializing in interventional cardiology with over 15 years of experience.",
    photoUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
    specialization: "Cardiology",
    experience: 15,
    consultationFee: 1500,
    location: "Afilas General Hospital",
    availability: "Mon, Wed, Fri",
  },
  {
    id: "mock-2",
    name: "Dr. Selam Tesfaye",
    title: "Endocrinologist",
    bio: "Expert in diabetes management and metabolic health.",
    photoUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    specialization: "Endocrinology",
    experience: 12,
    consultationFee: 1200,
    location: "Afilas General Hospital",
    availability: "Tue, Thu, Sat",
  },
  {
    id: "mock-3",
    name: "Dr. Yonas Hailemariam",
    title: "Orthopedic Surgeon",
    bio: "Performing joint replacements and sports medicine procedures.",
    photoUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face",
    specialization: "Orthopedics",
    experience: 18,
    consultationFee: 2000,
    location: "Afilas General Hospital",
    availability: "Mon, Wed, Fri",
  },
  {
    id: "mock-4",
    name: "Dr. Meron Assefa",
    title: "Pediatrician",
    bio: "Providing comprehensive care from infancy through adolescence.",
    photoUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face",
    specialization: "Pediatrics",
    experience: 10,
    consultationFee: 1000,
    location: "Afilas General Hospital",
    availability: "Mon, Tue, Thu, Fri",
  },
];

const trustLogos = [
  { nameKey: "hospital.trust.item1_name", badgeKey: "hospital.trust.item1_badge" },
  { nameKey: "hospital.trust.item2_name", badgeKey: "hospital.trust.item2_badge" },
  { nameKey: "hospital.trust.item3_name", badgeKey: "hospital.trust.item3_badge" },
  { nameKey: "hospital.trust.item4_name", badgeKey: "hospital.trust.item4_badge" },
];

export default function HospitalPage() {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  // Services state
const [services, setServices] = useState<any[]>([]);
const [servicesLoading, setServicesLoading] = useState(true);
const [servicesError, setServicesError] = useState<string | null>(null);
// Doctors state
const [doctors, setDoctors] = useState<any[]>([]);
const [doctorsLoading, setDoctorsLoading] = useState(true);
const [doctorsError, setDoctorsError] = useState<string | null>(null);
const [docImageFailed, setDocImageFailed] = useState<Record<string, boolean>>({});

useEffect(() => {
  let isMounted = true;

  async function fetchServices() {
    try {
      const response = await fetch('http://localhost:5000/api/services?location=Afilas%20General%20Hospital');
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      const result = await response.json();
      if (result.success && result.data && result.data.length > 0) {
        const active = result.data.filter((s: any) => s.isActive !== false);
        if (active.length > 0 && isMounted) {
          setServices(active.slice(0, 4)); // take first 4
          setServicesError(null);
        }
      }
    } catch (err) {
      console.warn('API not available, using mock data');
      // Fallback to mock data (copy from component or define inline)
      if (isMounted) {
        setServices(getFallbackServices());
        setServicesError('Offline mode - showing demo services');
      }
    } finally {
      if (isMounted) setServicesLoading(false);
    }
  }

  fetchServices();
  return () => { isMounted = false; };
}, []);

function getFallbackServices() {
  return [
    {
      id: 'fallback-1',
      name: 'General Consultation',
      description: 'Comprehensive consultation with a specialist physician.',
      price: 50,
      duration: 30,
      location: 'Afilas General Hospital',
      isActive: true,
    },
    {
      id: 'fallback-2',
      name: 'Cardiac Check-up',
      description: 'Full cardiac evaluation including ECG and stress test.',
      price: 120,
      duration: 45,
      location: 'Afilas General Hospital',
      isActive: true,
    },
    {
      id: 'fallback-3',
      name: 'Pediatric Wellness Visit',
      description: 'Growth monitoring, vaccinations, and general pediatric care.',
      price: 40,
      duration: 25,
      location: 'Afilas General Hospital',
      isActive: true,
    },
    {
      id: 'fallback-4',
      name: 'Orthopedic Assessment',
      description: 'Comprehensive bone, joint, and muscle examination.',
      price: 70,
      duration: 40,
      location: 'Afilas General Hospital',
      isActive: true,
    },
  ];
}

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
  // Auto‑play timer
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
  setCurrentIndex((prev) => (prev === amenitiesData.length - 1 ? 0 : prev + 1));
}, 4000);// change 4000 to your preferred interval (ms)
}, [amenitiesData.length]);

useEffect(() => {
  let isMounted = true;

  async function fetchDoctors() {
    try {
      setDoctorsLoading(true);
      const res = await fetch('http://localhost:5000/api/doctors');
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json = await res.json();

      let apiDoctors = [];
      if (json.success && Array.isArray(json.data)) apiDoctors = json.data;
      else if (Array.isArray(json)) apiDoctors = json;

      if (apiDoctors.length > 0 && isMounted) {
        const formatted = apiDoctors.map((doc: any) => {
          let photoUrl: string | null = null;
          const rawImage = doc.image || doc.photoUrl || null;
          if (rawImage) {
            if (/^https?:\/\//i.test(rawImage)) {
              photoUrl = rawImage;
            } else {
              const clean = rawImage.replace(/^\/+/, '');
              photoUrl = `http://localhost:5000/${clean}`;
            }
          }
          return {
            id: doc.id,
            name: doc.user ? `Dr. ${doc.user.firstName} ${doc.user.lastName}` : doc.name || "Doctor",
            title: doc.specialization || doc.title || "Specialist",
            bio: doc.bio || "Experienced medical professional.",
            photoUrl,
            specialization: doc.specialization || "General",
            experience: doc.experience || 0,
            education: doc.education || "",
            rating: doc.rating || 4.5,
            consultationFee: doc.consultationFee || 0,
            location: doc.location || "Afilas General Hospital",
            availability: doc.availability || "Mon - Fri",
          };
        });
        setDoctors(formatted.slice(0, 4)); // show only 4
        setDoctorsError(null);
      }
    } catch (err) {
      console.warn('API failed, using mock doctors');
      if (isMounted) {
        setDoctors(mockDoctors.slice(0, 4));
        setDoctorsError('Offline - showing demo doctors');
      }
    } finally {
      if (isMounted) setDoctorsLoading(false);
    }
  }

  fetchDoctors();
  return () => { isMounted = false; };
}, []);

// Start timer on mount, clear on unmount
useEffect(() => {
  resetTimer();
  return () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };
}, [resetTimer]);

  return (
    <>
      {/* Top Header - Kept untouched */}
      <Header />

      <main className="pt-20 sm:pt-28 bg-background text-foreground transition-colors duration-300">
     
{/* ==========================================================================
   1. HERO SECTION – Hourglass Shape, Full Width, Thin Border
   ========================================================================== */}
<section className="hero-wrapper container mx-auto px-4 sm:px-6 lg:px-8 text-center pt-6 pb-16 relative">
  <div className="hero-content reveal-up max-w-4xl mx-auto">
    
    <h1 className="headline text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6 text-foreground">
      {t("hospital.hero.headline_prefix")}<br className="hidden sm:block" />
      <span className="text-primary">{t("hospital.hero.headline_span")}</span>
    </h1>

    <div className="hero-ctas flex flex-wrap justify-center items-center gap-4 mb-4">
      <a
        href="#doctors"
        className="btn btn-primary px-8 py-3.5 bg-primary text-primary-foreground font-bold rounded-lg shadow-lg hover:bg-primary/90 hover:scale-105 transition-all duration-200"
      >
        {t("hospital.hero.book_btn")}
      </a>
      <a
        href="#services"
        className="btn btn-secondary px-8 py-3.5 bg-card text-foreground font-bold rounded-lg border border-border hover:bg-accent/10 transition-all duration-200 block"
      >
        {t("hospital.hero.view_services_btn")}
      </a>
    </div>

    <p className="pricing-note text-xs text-muted-foreground mb-10">
      {/* 24/7 Emergency Care • JCI Accredited • 50+ Senior Medical Specialists */}
    </p>

    {/* Hero Facility Showcase Mockup */}
    <div className="mockup-container reveal-up delay-1 max-w-4xl mx-auto h-[260px] sm:h-[420px] relative rounded-2xl overflow-hidden border border-border shadow-2xl group">
      <Image
        src="/afilas.jpg"
        alt={t("hospital.hero.img_alt")}
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
        <section className="logos-wrapper container mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 pb-8 reveal-up">
          <p className="logos-headline text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">
            {t("hospital.trust.headline")}
          </p>
          <div className="logo-grid grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-center">
            {trustLogos.map((item, idx) => (
              <div
                key={idx}
                className="logo-item p-4 rounded-xl bg-card border border-border/60 hover:border-primary/40 transition-colors shadow-sm flex flex-col items-center justify-center"
              >
                <span className="font-extrabold text-sm sm:text-base text-foreground tracking-wide">
                  {t(item.nameKey)}
                </span>
                <span className="text-[11px] font-semibold text-primary mt-1">
                  {t(item.badgeKey)}
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
          <div className="step-card-wrapper reveal-up max-w-4xl mx-auto">
            <div className="step-card bg-card border border-border rounded-2xl p-8 sm:p-12 text-center shadow-lg">
              <h2 className="section-title text-2xl sm:text-4xl font-extrabold text-foreground mb-4">
                {t("hospital.welcome.title")}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                {t("hospital.welcome.desc")}
              </p>
            </div>
          </div>
        </section>

 {/* ==========================================================================
   4. SPECIALIZED MEDICAL DEPARTMENTS (REDESIGNED)
   ========================================================================== */}
<section className="feature-wrapper feature-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex flex-col lg:flex-row items-start gap-10 lg:gap-14">
  {/* LEFT – Image */}
  <div className="feature-mockup mockup-container w-full lg:w-[42%] h-[300px] sm:h-[380px] lg:h-[480px] rounded-none border border-border shadow-xl relative overflow-hidden reveal-left shrink-0">
    <Image
      src="/Afilas-Hospital-Departments.jpg"
      alt={t("hospital.hero.img_alt")}
      fill
      className="object-cover"
      priority
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-8">
      <span className="inline-block text-xs font-bold uppercase tracking-wider text-white bg-primary/90 px-4 py-1.5 w-fit mb-2">
        {t("hospital.dept.badge")}
      </span>
      <h4 className="text-xl sm:text-2xl font-bold text-white leading-tight">
        {t("hospital.dept.overlay_title_1")}<br />{t("hospital.dept.overlay_title_2")}
      </h4>
    </div>
  </div>

  {/* RIGHT – Content + Cards */}
  <div className="feature-content w-full lg:flex-1 text-left reveal-right">
    <h2 className="section-title text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground mb-3">
      {t("hospital.dept.title")}
    </h2>
    <p className="feature-text text-sm sm:text-base text-muted-foreground mb-8 leading-relaxed max-w-xl">
      {t("hospital.dept.subtitle")}
    </p>

    {/* 3-column grid for departments with larger cards and row gap */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 gap-y-6">
      {departments.map((dept) => {
        const Icon = dept.icon;
        return (
          <Link
            key={dept.slug}
            href={`/hospital/departments/${dept.slug}`}
            className="group flex flex-col items-start gap-3 p-5 border border-border/70 hover:border-primary/60 transition-all duration-300 hover:shadow-md"
          >
            <div className="w-12 h-12 bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
              <Icon className="w-6 h-6 text-primary" strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                {t(dept.nameKey)}
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                {t(dept.descKey)}
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
<section className="py-12 sm:py-16 bg-background border-t border-border/40">
  <style>{`
  .amenity-card {
    position: relative;
    overflow: hidden;
    cursor: pointer;
  }
  .amenity-caption {
    position: absolute;
    inset: 0;
    padding: 2em;
    text-align: center;
    color: #fff;
    text-transform: uppercase;
    backface-visibility: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    padding-bottom: 2.5rem;
  }
  /* Gradient overlay (like .front .caption:before) */
  .amenity-caption::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(72,76,97,0) 0%, rgba(72,76,97,0.9) 75%);
    content: '';
    opacity: 0;
    transform: translate3d(0, 50%, 0);
    transition: opacity 0.35s, transform 0.35s;
    pointer-events: none;
  }
  .amenity-card:hover .amenity-caption::before {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
  /* Title - larger, bolder, always visible */
  .amenity-title {
    font-size: 2.2em;
    font-weight: 800;
    word-spacing: -0.05em;
    letter-spacing: 0.02em;
    color: #ffffff;
    transition: transform 0.35s, color 0.35s;
    transform: translate3d(0, 0, 0);
    position: relative;
    z-index: 1;
    margin: 0;
    text-shadow: 
      0 4px 12px rgba(0, 0, 0, 0.6),
      0 2px 4px rgba(0, 0, 0, 0.4),
      0 0 30px rgba(0, 0, 0, 0.3);
  }
  .amenity-title span {
    font-weight: 900;
  }
  .amenity-card:hover .amenity-title {
    color: #fff;
    transform: translate3d(0, -100px, 0);
    text-shadow: 
      0 4px 16px rgba(0, 0, 0, 0.8),
      0 2px 8px rgba(0, 0, 0, 0.5),
      0 0 40px rgba(0, 0, 0, 0.4);
  }
  /* Underline line - thicker, brighter */
  .amenity-title::after {
    position: absolute;
    bottom: -14px;
    left: 50%;
    transform: translateX(-50%) scaleX(0.3);
    width: 120px;
    height: 4px;
    background: #fff;
    content: '';
    transition: transform 0.4s ease;
    transform-origin: center;
    box-shadow: 0 2px 8px rgba(255, 255, 255, 0.3);
  }
  .amenity-card:hover .amenity-title::after {
    transform: translateX(-50%) scaleX(3.8);
    box-shadow: 0 2px 12px rgba(255, 255, 255, 0.69);
  }
  /* Description - larger, more visible */
  .amenity-desc {
    letter-spacing: 0.5px;
    font-size: 100%;
    text-transform: none;
    font-weight: 400;
    opacity: 0;
    transform: translate3d(0, 50px, 0);
    transition: opacity 0.4s, transform 0.4s;
    margin-top: 2rem;
    z-index: 1;
    max-width: 85%;
    text-shadow: 
      0 2px 8px rgba(0, 0, 0, 0.6),
      0 1px 4px rgba(0, 0, 0, 0.4);
    color: #fff;
    line-height: 1.6;
  }
  .amenity-card:hover .amenity-desc {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
  /* Ensure image doesn't zoom */
  .amenity-image {
    transition: none;
  }
`}</style>
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground text-center mb-10">
      {t("hospital.amenity.main_title")}
    </h2>

    <div className="relative max-w-4xl mx-auto">
      <div className="relative overflow-hidden rounded-2xl shadow-xl aspect-[4/3] sm:aspect-[16/9]">
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {amenitiesData.map((item, idx) => (
            <div
              key={idx}
              className="w-full flex-shrink-0 h-full relative amenity-card group"
            >
              {/* Background image – no zoom */}
              <div
                className="absolute inset-0 bg-cover bg-center amenity-image"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              {/* Caption overlay */}
              <div className="amenity-caption">
                <h3 className="amenity-title">
                  {t(item.titleKey)}
                </h3>
                <p className="amenity-desc">{t(item.descKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => {
          setCurrentIndex((prev) => (prev === 0 ? amenitiesData.length - 1 : prev - 1));
          resetTimer();
        }}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-6 bg-background/80 backdrop-blur-sm border border-border rounded-full p-2 shadow-md hover:bg-background transition-colors z-10"
        aria-label="Previous"
      >
        <ChevronLeft className="w-5 h-5 text-foreground" />
      </button>
      <button
        onClick={() => {
          setCurrentIndex((prev) => (prev === amenitiesData.length - 1 ? 0 : prev + 1));
          resetTimer();
        }}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-6 bg-background/80 backdrop-blur-sm border border-border rounded-full p-2 shadow-md hover:bg-background transition-colors z-10"
        aria-label="Next"
      >
        <ChevronRight className="w-5 h-5 text-foreground" />
      </button>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {amenitiesData.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrentIndex(idx);
              resetTimer();
            }}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              idx === currentIndex
                ? "w-8 bg-primary"
                : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  </div>
</section>

       {/* ==========================================================================
   8. MEDICAL SERVICES – Custom API‑driven Section (max 4)
   ========================================================================== */}
<section id="services" className="border-t border-border/50 py-16 sm:py-20 bg-background">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12">
      <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
        {t("hospital.sec_services.title")}
      </h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        {t("hospital.sec_services.subtitle")}
      </p>
      {servicesError && (
        <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2 flex items-center justify-center gap-1">
          <AlertCircle className="w-4 h-4" /> {servicesError}
        </p>
      )}
    </div>

    {servicesLoading ? (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    ) : (
      <>
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-card border border-border rounded-xl p-5 flex flex-col sm:flex-row gap-4 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Left: Title only (no icon) */}
              <div className="sm:w-1/3">
                <h3 className="font-bold text-foreground text-lg leading-tight">
                  {service.name}
                </h3>
              </div>

              {/* Vertical divider (hidden on mobile) */}
              <div className="hidden sm:block w-px bg-border self-stretch mx-2" style={{ height: 'auto', minHeight: '3rem' }} />

              {/* Right: Details (text only, no icons) */}
              <div className="flex-1 flex flex-col gap-1 text-sm">
                <p className="text-muted-foreground line-clamp-2">{service.description}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-muted-foreground">
                  {service.price && (
                    <span>{t("hospital.sec_services.price_label")} {service.price}</span>
                  )}
                  {service.duration && (
                    <span>{t("hospital.sec_services.duration_label")} {service.duration} {t("hospital.sec_services.min_unit")}</span>
                  )}
                  <span>{t("hospital.sec_services.location_label")} {service.location || t("hospital.sec_services.default_location")}</span>
                </div>
                <button className="mt-2 self-start bg-primary text-primary-foreground px-5 py-1.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors">
                  {t("hospital.sec_services.book_btn")}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Services Button */}
<div className="text-center mt-10">
  <Link
    href="/services"
    className="inline-flex items-center gap-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-2.5 font-medium transition-colors duration-300"
  >
    <span>{t("hospital.sec_services.view_all_btn")}</span>
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  </Link>
</div>
      </>
    )}

    {!servicesLoading && services.length === 0 && !servicesError && (
      <p className="text-center text-muted-foreground py-8">{t("hospital.sec_services.empty_msg")}</p>
    )}
  </div>
</section>

      {/* ==========================================================================
   9. DOCTOR SECTION – Custom API‑driven (max 4) – Large Cards (No Fee)
   ========================================================================== */}
<section id="doctors" className="border-t border-border/50 py-16 sm:py-20 bg-background">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-12">
      <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
        {t("hospital.sec_doc.title")}
      </h2>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        {t("hospital.sec_doc.subtitle")}
      </p>
      {doctorsError && (
        <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2 flex items-center justify-center gap-1">
          <AlertCircle className="w-4 h-4" /> {doctorsError}
        </p>
      )}
    </div>

    {doctorsLoading ? (
      <div className="flex justify-center items-center py-16">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    ) : (
      <>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-card border border-border rounded-none overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              {/* Circular image – remains large */}
              <div className="pt-10 px-6 flex justify-center">
                <div className="relative w-48 h-48 rounded-full overflow-hidden bg-muted border-2 border-primary/20">
                  {doctor.photoUrl && !docImageFailed[doctor.id] ? (
                    <Image
                      src={doctor.photoUrl}
                      alt={doctor.name}
                      fill
                      unoptimized
                      className="object-cover"
                      onError={() => setDocImageFailed((prev) => ({ ...prev, [doctor.id]: true }))}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-primary/30 bg-muted">
                      {doctor.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                  )}
                </div>
              </div>

              {/* Content – smaller text sizes */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-foreground text-center">
                  {doctor.name}
                </h3>
                <p className="text-base font-semibold text-primary text-center">
                  {doctor.title}
                </p>

                {/* Key Info Grid – smaller text */}
                <div className="grid grid-cols-2 gap-2 mt-4 border-t border-b border-border/50 py-4">
                  <div className="text-center">
                    <span className="block text-[10px] font-bold text-foreground/60 uppercase tracking-wider">{t("hospital.sec_doc.experience_label")}</span>
                    <span className="block text-base font-bold text-foreground">{doctor.experience}{t("hospital.sec_doc.yrs_suffix")}</span>
                  </div>
                  <div className="text-center border-l border-border/50">
                    <span className="block text-[10px] font-bold text-foreground/60 uppercase tracking-wider">{t("hospital.sec_doc.available_label")}</span>
                    <span className="block text-base font-bold text-foreground">{doctor.availability}</span>
                  </div>
                </div>

                {/* Bio – smaller */}
                <p className="text-sm text-muted-foreground leading-relaxed mt-3 line-clamp-2">
                  {doctor.bio}
                </p>

                {/* Location – smaller */}
                <div className="flex items-center gap-1 mt-auto pt-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>{doctor.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Doctors Button */}
        <div className="text-center mt-12">
          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-2.5 font-medium transition-colors duration-300"
          >
            <span>{t("hospital.sec_doc.view_all_btn")}</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </>
    )}

    {!doctorsLoading && doctors.length === 0 && !doctorsError && (
      <p className="text-center text-muted-foreground py-8">{t("hospital.sec_doc.empty_msg")}</p>
    )}
  </div>
</section>

      </main>

      {/* Bottom Footer - Kept untouched */}
      <Footer />
    </>
  );
}
