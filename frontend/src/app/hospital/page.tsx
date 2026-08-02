"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DoctorFinder } from "@/components/DoctorFinder";
import HospitalHero from "@/components/HospitalDivision/HospitalHero"; // ✅ Ensure this import is correct
import { HospitalServices } from "@/components/HospitalDivision/HospitalServices";
import Link from "next/link";
import { 
  ArrowRight, 
  Building2, 
  Users, 
  Heart, 
  Brain, 
  Bone, 
  Shield, 
  Ambulance 
} from "lucide-react";

const departments = [
  {
    slug: "cardiology",
    name: "Cardiology",
    description: "Heart and cardiovascular system care with advanced interventional procedures",
    icon: Heart,
    color: "text-red-500",
    bgColor: "bg-red-100 dark:bg-red-950/30",
  },
  {
    slug: "pediatrics",
    name: "Pediatrics",
    description: "Specialized care for children and infants in a child-friendly environment",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-950/30",
  },
  {
    slug: "neurology",
    name: "Neurology",
    description: "Brain and nervous system treatment with advanced diagnostics",
    icon: Brain,
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-950/30",
  },
  {
    slug: "orthopedics",
    name: "Orthopedics",
    description: "Bone and joint health management including surgical and non-surgical care",
    icon: Bone,
    color: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-950/30",
  },
  {
    slug: "oncology",
    name: "Oncology",
    description: "Cancer diagnosis and treatment with comprehensive care",
    icon: Shield,
    color: "text-orange-500",
    bgColor: "bg-orange-100 dark:bg-orange-950/30",
  },
  {
    slug: "emergency",
    name: "Emergency Medicine",
    description: "24/7 emergency and trauma care with rapid response teams",
    icon: Ambulance,
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-950/30",
  },
];

export default function HospitalPage() {
  return (
    <>
      <Header />
      <main className="pt-32">
        <div className="relative">
          
          {/* ✅ USE THE CORRECT HERO COMPONENT */}
          <HospitalHero 
            title="Afilas General Hospital"
            subtitle="Providing world-class healthcare with compassion and advanced medical technology."
          />

          {/* Departments section */}
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
                  Comprehensive medical services across our specialized departments
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((dept) => {
                  const Icon = dept.icon;
                  return (
                    <Link
                      key={dept.slug}
                      href={`/hospital/departments/${dept.slug}`}
                      className="bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer"
                    >
                      <div className={`w-12 h-12 ${dept.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                        <Icon className={`w-6 h-6 ${dept.color}`} />
                      </div>
                      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition">
                        {dept.name}
                      </h3>
                      <p className="text-foreground/70 text-sm mb-4">
                        {dept.description}
                      </p>
                      <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all text-sm">
                        Learn More
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Amenities section */}
          <section className="relative z-10 bg-card py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-y border-border">
            <div className="max-w-7xl mx-auto w-full">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  Hospital Amenities
                </h2>
                <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                  World-class facilities and services for patient comfort and recovery
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: "ICU/CCU",
                    desc: "Intensive care units with advanced monitoring and life support systems.",
                  },
                  {
                    title: "Surgery Suites",
                    desc: "Modern operating rooms with latest equipment including robotic-assisted surgery.",
                  },
                  {
                    title: "Diagnostic Center",
                    desc: "Advanced imaging and laboratory services including MRI, CT scans, and X-ray.",
                  },
                  {
                    title: "Pharmacy",
                    desc: "In-house pharmacy with comprehensive stock of medications available 24/7.",
                  },
                  {
                    title: "Blood Bank",
                    desc: "Safe and tested blood transfusion services available around the clock.",
                  },
                  {
                    title: "Emergency Room",
                    desc: "24/7 emergency services and trauma care with rapid response teams.",
                  },
                ].map((amenity, idx) => (
                  <div key={idx} className="text-center space-y-3 p-6 hover:bg-accent/5 rounded-2xl transition">
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

          {/* Medical Services section - API Connected */}
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