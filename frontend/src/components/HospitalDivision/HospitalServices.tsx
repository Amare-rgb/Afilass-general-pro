"use client";

import { useLanguage } from "@/contexts/LanguageProvider";
import { useEffect, useRef, useState } from "react";
import { Clock, MapPin, DollarSign, Stethoscope } from "lucide-react";

// Mock data matching your schema
const mockServices = [
  {
    id: "cms4huonf00059rzgheidhvnd",
    name: "General Consultation",
    description: "Comprehensive consultation with a specialist physician.",
    price: 50,
    duration: 30,
    image: null,
    isActive: true,
    location: "Afilas General Hospital - Outpatient Clinic",
    createdAt: "2026-07-28T10:09:25.323Z",
    updatedAt: "2026-07-28T10:09:25.323Z",
    departmentId: null,
    department: null,
  },
  {
    id: "cms4huonf00059rzgheidhvn1",
    name: "Cardiac Check-up",
    description: "Full cardiac evaluation including ECG and specialist review.",
    price: 120,
    duration: 45,
    image: null,
    isActive: true,
    location: "Afilas General Hospital - Cardiology Dept",
    createdAt: "2026-07-28T10:09:25.323Z",
    updatedAt: "2026-07-28T10:09:25.323Z",
    departmentId: null,
    department: null,
  },
  {
    id: "cms4huonf00059rzgheidhvn2",
    name: "Pediatric Wellness Visit",
    description: "Growth monitoring, vaccinations, and general pediatric care.",
    price: 40,
    duration: 25,
    image: null,
    isActive: true,
    location: "Afilas General Hospital - Pediatrics",
    createdAt: "2026-07-28T10:09:25.323Z",
    updatedAt: "2026-07-28T10:09:25.323Z",
    departmentId: null,
    department: null,
  },
  {
    id: "cms4huonf00059rzgheidhvn3",
    name: "Orthopedic Assessment",
    description: "Bone, joint, and muscle examination with X‑ray if needed.",
    price: 70,
    duration: 40,
    image: null,
    isActive: true,
    location: "Afilas General Hospital - Orthopedics",
    createdAt: "2026-07-28T10:09:25.323Z",
    updatedAt: "2026-07-28T10:09:25.323Z",
    departmentId: null,
    department: null,
  },
  {
    id: "cms4huonf00059rzgheidhvn4",
    name: "Neurology Consultation",
    description: "In‑depth neurological examination and treatment planning.",
    price: 90,
    duration: 50,
    image: null,
    isActive: true,
    location: "Afilas General Hospital - Neurology",
    createdAt: "2026-07-28T10:09:25.323Z",
    updatedAt: "2026-07-28T10:09:25.323Z",
    departmentId: null,
    department: null,
  },
  {
    id: "cms4huonf00059rzgheidhvn5",
    name: "Emergency Triage",
    description: "Rapid assessment and stabilisation for emergency cases.",
    price: 30,
    duration: 20,
    image: null,
    isActive: true,
    location: "Afilas General Hospital - ER",
    createdAt: "2026-07-28T10:09:25.323Z",
    updatedAt: "2026-07-28T10:09:25.323Z",
    departmentId: null,
    department: null,
  },
];

// Custom hook for scroll‑reveal animation
function useInView(ref: React.RefObject<HTMLElement>) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return isInView;
}

export function HospitalServices() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="bg-background py-20 sm:py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ease-out ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t(
              "hospital.services.title",
              // "Our Medical Services"
            )}
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            {t(
              "hospital.services.subtitle",
              //   "Comprehensive care tailored to your health needs"
            )}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockServices.map((service, index) => {
            // Stagger animation delay
            const delay = index * 100;
            return (
              <ServiceCard
                key={service.id}
                service={service}
                index={index}
                isInView={isInView}
                delay={delay}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Individual service card with its own animation
function ServiceCard({
  service,
  index,
  isInView,
  delay,
}: {
  service: (typeof mockServices)[0];
  index: number;
  isInView: boolean;
  delay: number;
}) {
  const { t } = useLanguage();

  return (
    <div
      className={`bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-500 group flex flex-col ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Icon / Image placeholder */}
      <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <Stethoscope className="w-7 h-7 text-primary" />
      </div>

      <h3 className="text-xl font-bold text-foreground mb-2">{service.name}</h3>
      <p className="text-foreground/70 text-sm flex-1 mb-4">
        {service.description}
      </p>

      <div className="space-y-2 text-sm text-foreground/60 border-t border-border pt-4 mt-auto">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-primary" />
          <span>
            ${service.price} {t("hospital.services.per_visit")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <span>{service.duration} min</span>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <span>{service.location}</span>
        </div>
      </div>

      <button className="mt-6 w-full bg-primary text-primary-foreground py-2.5 rounded-full font-semibold hover:bg-primary/90 transition-colors">
        {t("hospital.services.book")}
      </button>
    </div>
  );
}
