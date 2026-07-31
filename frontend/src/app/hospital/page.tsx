"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DoctorFinder } from "@/components/DoctorFinder";
// ✅ FIX: Use default import (no curly braces) because your HospitalHero.tsx uses "export default"
import HospitalHero from "@/components/HospitalDivision/HospitalHero"; 
import { HospitalServices } from "@/components/HospitalDivision/HospitalServices";
import { ArrowRight, Stethoscope, Building2, Users } from "lucide-react";

export default function HospitalPage() {
  const departments = [
    {
      name: "Cardiology",
      description: "Heart and cardiovascular system care",
      icon: Stethoscope,
    },
    {
      name: "Pediatrics",
      description: "Specialized care for children and infants",
      icon: Building2,
    },
    {
      name: "Neurology",
      description: "Brain and nervous system treatment",
      icon: Users,
    },
    {
      name: "Orthopedics",
      description: "Bone and joint health management",
      icon: Stethoscope,
    },
    {
      name: "Oncology",
      description: "Cancer diagnosis and treatment",
      icon: Building2,
    },
    {
      name: "Emergency Medicine",
      description: "24/7 emergency and trauma care",
      icon: Users,
    },
  ];

  return (
    <>
      <Header />
      <main className="pt-32"> {/* Added padding-top to push content below header */}
        {/* Main container */}
        <div className="relative">
          {/* Hero section – sticky parallax hero on desktop */}
          <HospitalHero />

          {/* Departments section – standard scrolling content section */}
          <section
            id="departments"
            className="relative z-10 bg-background py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-border"
          >
            <div className="max-w-7xl mx-auto w-full">
              <div className="mb-12 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  Our Departments
                </h2>
                <p className="text-lg text-foreground/70">
                  Comprehensive medical services across our specialized
                  departments
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((dept, idx) => {
                  const Icon = dept.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all group cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2">
                        {dept.name}
                      </h3>
                      <p className="text-foreground/70 text-sm mb-4">
                        {dept.description}
                      </p>
                      <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all text-sm">
                        Learn More
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Amenities section – standard scrolling content section */}
          <section className="relative z-10 bg-card py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-y border-border">
            <div className="max-w-7xl mx-auto w-full">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  Hospital Amenities
                </h2>
                <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                  World-class facilities and services for patient comfort and
                  recovery
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: "ICU/CCU",
                    desc: "Intensive care units with advanced monitoring",
                  },
                  {
                    title: "Surgery Suites",
                    desc: "Modern operating rooms with latest equipment",
                  },
                  {
                    title: "Diagnostic Center",
                    desc: "Advanced imaging and laboratory services",
                  },
                  {
                    title: "Pharmacy",
                    desc: "In-house pharmacy with comprehensive stock",
                  },
                  {
                    title: "Blood Bank",
                    desc: "Safe and tested blood transfusion services",
                  },
                  {
                    title: "Emergency Room",
                    desc: "24/7 emergency services and trauma care",
                  },
                ].map((amenity, idx) => (
                  <div key={idx} className="text-center space-y-3 p-6">
                    <div className="w-14 h-14 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center mx-auto">
                      <Building2 className="w-7 h-7 text-accent" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">
                      {amenity.title}
                    </h3>
                    <p className="text-foreground/70 text-sm">
                      {amenity.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Medical Services section */}
          <div className="relative z-10">
            <HospitalServices />
          </div>

          {/* Doctor Finder section */}
          <div className="relative z-10 bg-background border-t border-border">
            <DoctorFinder />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}