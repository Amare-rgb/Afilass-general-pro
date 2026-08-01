// app/hospital/departments/[slug]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { 
  ArrowLeft, 
  Heart, 
  Brain, 
  Bone, 
  Shield, 
  Ambulance,
  Users
} from "lucide-react";
import { useState } from "react";

const departmentData = {
  cardiology: {
    id: "cardiology",
    name: "Cardiology",
    icon: Heart,
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-800",
    description: "Heart and cardiovascular system care with advanced interventional procedures",
    about: "Our Cardiology Department provides complete cardiovascular care, from prevention and diagnosis to treatment and rehabilitation. We offer advanced procedures including cardiac catheterization, angioplasty, pacemaker implantation, and cardiac surgery. Our team of internationally trained cardiologists, cardiac surgeons, and support staff work together to provide personalized care for every patient."
  },
  pediatrics: {
    id: "pediatrics",
    name: "Pediatrics",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
    description: "Specialized care for children and infants in a child-friendly environment",
    about: "The Pediatrics Department provides comprehensive medical care for children from birth through adolescence. Our team of pediatricians, pediatric specialists, and child life specialists create a warm, welcoming environment focused on the unique needs of young patients and their families. We offer preventive care, acute illness management, and chronic disease treatment with a child-centered approach."
  },
  neurology: {
    id: "neurology",
    name: "Neurology",
    icon: Brain,
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    borderColor: "border-purple-200 dark:border-purple-800",
    description: "Brain and nervous system treatment with advanced diagnostics",
    about: "Our Neurology Department offers comprehensive care for patients with neurological conditions including stroke, epilepsy, multiple sclerosis, Parkinson's disease, and Alzheimer's disease. We utilize the latest diagnostic technologies including MRI, CT, and EEG, combined with evidence-based treatments and rehabilitation programs."
  },
  orthopedics: {
    id: "orthopedics",
    name: "Orthopedics",
    icon: Bone,
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-200 dark:border-green-800",
    description: "Bone and joint health management including surgical and non-surgical care",
    about: "The Orthopedics Department provides complete musculoskeletal care including diagnosis, treatment, and rehabilitation. Our services cover everything from sports injuries and fractures to complex joint replacements and spinal surgery. We use minimally invasive techniques, robotic-assisted surgery, and comprehensive rehabilitation programs."
  },
  oncology: {
    id: "oncology",
    name: "Oncology",
    icon: Shield,
    color: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    borderColor: "border-orange-200 dark:border-orange-800",
    description: "Cancer diagnosis and treatment with comprehensive care",
    about: "Our Oncology Department provides integrated cancer care including prevention, early detection, treatment, and supportive care. We offer a full range of treatment modalities including chemotherapy, radiation therapy, immunotherapy, targeted therapy, and surgical oncology. Our multidisciplinary team works together to create personalized treatment plans."
  },
  emergency: {
    id: "emergency",
    name: "Emergency Medicine",
    icon: Ambulance,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-800",
    description: "24/7 emergency and trauma care with rapid response teams",
    about: "Our Emergency Medicine Department provides round-the-clock emergency care for all medical emergencies and trauma cases. We are equipped with a Level I Trauma Center, specialized teams for cardiac emergencies, stroke, and pediatric emergencies. Our board-certified emergency physicians and trauma surgeons are ready to handle any emergency situation."
  }
};

export default function DepartmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const department = departmentData[slug as keyof typeof departmentData];
  
  if (!department) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32">
          <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Department Not Found</h1>
            <p className="text-foreground/70 mb-8">The department you're looking for doesn't exist.</p>
            <button
              onClick={() => router.push("/hospital")}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Hospital
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const IconComponent = department.icon;

  return (
    <>
      <Header />
      <main className="pt-24 lg:pt-32">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/30 blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl" />
          </div>
         
        </div>

        {/* About Section - Only Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-2xl p-8 md:p-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">About {department.name}</h2>
              <p className="text-foreground/80 leading-relaxed text-lg">
                {department.about}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}