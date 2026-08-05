// src/components/PageContent.tsx
"use client";

import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { GeneralSec } from "@/components/generalsec";
import DiagnosisCenterSection from "@/components/DiagnosisCenterSection";
import { DoctorFinder } from "@/components/DoctorFinder";
import { Footer } from "@/components/Footer";
import DrugManufacturingSection from "@/components/DrugManufacturingSection";
import { UnifiedPillarsSection } from "@/components/Shared Essential";

export function PageContent() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section - Full viewport height */}
        <HeroSection />

        {/* Divider */}
        {/* <div className="w-full h-px bg-border" /> */}

        {/* General Hospital Section */}
        <GeneralSec />

        {/* Diagnosis Center Summary Section */}
        <DiagnosisCenterSection />

        {/* Drug Manufacturing Section */}
        <DrugManufacturingSection />

        {/* Three Pillars - Summary Cards */}
        {/* <UnifiedPillarsSection /> */}

        {/* Divider */}
        <div className="w-full h-px bg-border" />

        {/* Doctor Finder */}
        <DoctorFinder />
      </main>
      <Footer />
    </>
  );
}