"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";

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
  Loader2,
  AlertCircle,
  MapPin,
  Stethoscope,
  Activity,
  Baby,
  Bone as BoneIcon,
  Building2,
  CalendarDays,
  ClipboardList,
  Clock,
  Award,
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

const trustLogos = [
  { nameKey: "hospital.trust.item1_name", badgeKey: "hospital.trust.item1_badge" },
  { nameKey: "hospital.trust.item2_name", badgeKey: "hospital.trust.item2_badge" },
  { nameKey: "hospital.trust.item3_name", badgeKey: "hospital.trust.item3_badge" },
  { nameKey: "hospital.trust.item4_name", badgeKey: "hospital.trust.item4_badge" },
];

// Service images mapping
const serviceImages: Record<string, string> = {
  "General Consultation": "/services/consultation.jpg",
  "Cardiac Check-up": "/services/cardiac.jpg",
  "Pediatric Wellness Visit": "/services/pediatric.jpg",
  "Orthopedic Assessment": "/services/orthopedic.jpg",
  "General Medicine": "/services/general-medicine.jpg",
  "Cardiology": "/services/cardiology.jpg",
  "Pediatrics": "/services/pediatrics.jpg",
  "Orthopedics": "/services/orthopedics.jpg",
  "Neurology": "/services/neurology.jpg",
  "Dermatology": "/services/dermatology.jpg",
  "Gynecology": "/services/gynecology.jpg",
  "Ophthalmology": "/services/ophthalmology.jpg",
  "ENT": "/services/ent.jpg",
  "Urology": "/services/urology.jpg",
};

// Fallback service images
const fallbackServiceImages = [
  "/services/consultation.jpg",
  "/services/cardiac.jpg",
  "/services/pediatric.jpg",
  "/services/orthopedic.jpg",
];

export default function HospitalPage() {
  const { t } = useLanguage();
  // Services state
  const [services, setServices] = useState<any[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

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
            setServices(active.slice(0, 4));
            setServicesError(null);
          }
        }
      } catch (err) {
        console.warn('API not available, using mock data');
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

  function getAppointmentLink(service: any) {
    const loc = service.location || 'Afilas General Hospital';
    let basePath = '/appointments/hospital';
    if (loc === 'Afilas Diagnosis Center') {
      basePath = '/appointments/diagnosis';
    } else if (loc === 'Afilas Drug Manufacturing') {
      basePath = '/appointments/pharma';
    }
    const param = service.name ? `${service.name} - ${loc}` : loc;
    return `${basePath}?${encodeURIComponent(param)}`;
  }

  function getServiceImage(serviceName: string): string {
    if (serviceImages[serviceName]) {
      return serviceImages[serviceName];
    }
    for (const [key, value] of Object.entries(serviceImages)) {
      if (serviceName.toLowerCase().includes(key.toLowerCase()) || 
          key.toLowerCase().includes(serviceName.toLowerCase())) {
        return value;
      }
    }
    const index = services.findIndex(s => s.name === serviceName);
    return fallbackServiceImages[index % fallbackServiceImages.length] || '/services/default.jpg';
  }

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
        image: '/services/consultation.jpg',
      },
      {
        id: 'fallback-2',
        name: 'Cardiac Check-up',
        description: 'Full cardiac evaluation including ECG and stress test.',
        price: 120,
        duration: 45,
        location: 'Afilas General Hospital',
        isActive: true,
        image: '/services/cardiac.jpg',
      },
      {
        id: 'fallback-3',
        name: 'Pediatric Wellness Visit',
        description: 'Growth monitoring, vaccinations, and general pediatric care.',
        price: 40,
        duration: 25,
        location: 'Afilas General Hospital',
        isActive: true,
        image: '/services/pediatric.jpg',
      },
      {
        id: 'fallback-4',
        name: 'Orthopedic Assessment',
        description: 'Comprehensive bone, joint, and muscle examination.',
        price: 70,
        duration: 40,
        location: 'Afilas General Hospital',
        isActive: true,
        image: '/services/orthopedic.jpg',
      },
    ];
  }

  const getIconForService = (serviceName: string) => {
    if (serviceName.toLowerCase().includes('cardiac') || serviceName.toLowerCase().includes('heart')) {
      return Heart;
    }
    if (serviceName.toLowerCase().includes('pediatric') || serviceName.toLowerCase().includes('child')) {
      return Baby;
    }
    if (serviceName.toLowerCase().includes('orthopedic') || serviceName.toLowerCase().includes('bone')) {
      return BoneIcon;
    }
    if (serviceName.toLowerCase().includes('neurology') || serviceName.toLowerCase().includes('brain')) {
      return Brain;
    }
    return Stethoscope;
  };

  // Scroll Reveal Observer Logic
  useEffect(() => {
    const revealElements = document.querySelectorAll(
      ".reveal-left, .reveal-right, .reveal-up"
    );

    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -50px 0px",
      threshold: 0.15,
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-active");
          revealObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach((el) => revealObserver.observe(el));

    return () => {
      revealObserver.disconnect();
    };
  }, []);

  const handleImageError = (serviceId: string) => {
    setImageErrors(prev => ({ ...prev, [serviceId]: true }));
  };

  return (
    <>
      <Header />

      <main 
        className="bg-background text-foreground transition-colors duration-300 min-h-screen"
        style={{ paddingTop: '0px' }}
      >
        {/* ==========================================================================
           1. HERO SECTION - REMOVED SIDE GAPS (px-0 on parent container)
           ========================================================================== */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          {/* Changed `px-4 sm:px-6 lg:px-8` to `px-0` to remove side gaps */}
          <div className="container mx-auto px-0">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
              
              {/* LEFT SIDE - Content */}
              <div className="flex-1 max-w-2xl space-y-5 reveal-left">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                  <Building2 className="w-4 h-4" />
                  <span>Premium Healthcare Network</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                  <span className="text-foreground">Afilas General Hospital</span>
                  <br />
                  <span className="text-primary">&amp; Healthcare Network</span>
                </h1>

                {/* Description */}
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl">
                  Providing world-class medical care with advanced technology, 
                  expert specialists, and compassionate service across Ethiopia.
                </p>

                {/* Key Features */}
                <div className="flex flex-wrap gap-4 pt-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>24/7 Emergency</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Award className="w-4 h-4 text-primary" />
                    <span>JCI Accredited</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4 text-primary" />
                    <span>50+ Specialists</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-3 pt-3">
                  {/* Book Appointment Button */}
                  <Link
                    href="/appointments/hospital"
                    className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-7 py-3.5 rounded-xl font-bold text-base shadow-lg hover:shadow-xl hover:bg-primary/90 hover:scale-105 transition-all duration-300"
                  >
                    <CalendarDays className="w-5 h-5" />
                    <span>Book Appointment</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  {/* View Medical Services Button */}
                  <Link
                    href="#services"
                    className="group inline-flex items-center gap-3 bg-card text-foreground px-7 py-3.5 rounded-xl font-bold text-base border-2 border-border hover:border-primary hover:bg-primary/5 hover:scale-105 transition-all duration-300"
                  >
                    <ClipboardList className="w-5 h-5" />
                    <span>View Medical Services</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* RIGHT SIDE - Full Image */}
              <div className="flex-1 w-full max-w-2xl reveal-right">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl group h-[400px] sm:h-[450px] lg:h-[480px]">
                  <Image
                    src="/afilas.jpg"
                    alt="Afilas General Hospital & Healthcare Network"
                    fill
                    priority
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================================================
           2. LOGOS / TRUST SECTION - REMOVED SIDE GAPS
           ========================================================================== */}
        <section className="logos-wrapper container mx-auto px-0 text-center pt-8 pb-8 reveal-up">
          <p className="logos-headline text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">
            {t("hospital.trust.headline")}
          </p>
          <div className="logo-grid grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-center px-4 sm:px-6 lg:px-8">
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
           3. WELCOME TO AFILAS GENERAL HOSPITAL SECTION - REMOVED SIDE GAPS
           ========================================================================== */}
        <section
          id="about"
          className="how-it-works-wrapper container mx-auto px-0 text-center py-12 sm:py-16"
        >
          <div className="step-card-wrapper reveal-up max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
           4. SPECIALIZED MEDICAL DEPARTMENTS - REMOVED SIDE GAPS
           ========================================================================== */}
        <section className="feature-wrapper feature-1 container mx-auto px-0 py-12 sm:py-16 flex flex-col lg:flex-row items-start gap-10 lg:gap-14">
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

          <div className="feature-content w-full lg:flex-1 text-left reveal-right px-4 sm:px-6 lg:px-8">
            <h2 className="section-title text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground mb-3">
              {t("hospital.dept.title")}
            </h2>
            <p className="feature-text text-sm sm:text-base text-muted-foreground mb-8 leading-relaxed max-w-xl">
              {t("hospital.dept.subtitle")}
            </p>

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
           5. MEDICAL SERVICES SECTION WITH IMAGES - REMOVED SIDE GAPS
           ========================================================================== */}
        <section id="services" className="border-t border-border/50 py-16 sm:py-20 bg-background">
          <div className="container mx-auto px-0">
            <div className="text-center mb-12 px-4 sm:px-6 lg:px-8">
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
                <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                  {services.map((service, index) => {
                    const Icon = getIconForService(service.name);
                    const imageUrl = service.image || getServiceImage(service.name);
                    const hasError = imageErrors[service.id];
                    
                    return (
                      <div
                        key={service.id}
                        className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col sm:flex-row"
                      >
                        {/* Service Image (Left Side) */}
                        <div className="relative h-48 sm:h-auto sm:w-5/12 w-full shrink-0 bg-gradient-to-r from-primary/10 to-primary/5">
                          {!hasError ? (
                            <Image
                              src={imageUrl}
                              alt={service.name}
                              fill
                              className="object-cover"
                              onError={() => handleImageError(service.id)}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/5">
                              <Icon className="w-16 h-16 text-primary/40" />
                            </div>
                          )}
                          <div className="absolute top-3 right-3 bg-primary/90 text-white text-xs font-bold px-3 py-1 rounded-full">
                            {service.price ? `${service.price} ETB` : 'Contact'}
                          </div>
                        </div>

                        {/* Service Content (Right Side) */}
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className="w-5 h-5 text-primary" />
                            <h3 className="font-bold text-foreground text-lg">
                              {service.name}
                            </h3>
                          </div>
                          
                          <p className="text-muted-foreground text-sm line-clamp-2 flex-1">
                            {service.description}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground">
                            {service.duration && (
                              <span className="flex items-center gap-1">
                                <Activity className="w-3 h-3" />
                                {service.duration} min
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {service.location || 'Afilas General Hospital'}
                            </span>
                          </div>
                          
                          <Link
                            href={getAppointmentLink(service)}
                            className="mt-4 w-full bg-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors text-center"
                          >
                            {t("hospital.sec_services.book_btn")}
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-center mt-10 px-4 sm:px-6 lg:px-8">
                  <Link
                    href="/services?location=Afilas%20General%20Hospital"
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
              <p className="text-center text-muted-foreground py-8 px-4 sm:px-6 lg:px-8">{t("hospital.sec_services.empty_msg")}</p>
            )}
          </div>
        </section>

      </main>
    </>
  );
}