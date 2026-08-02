// src/components/PageContent.tsx
"use client";

import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { PillarCards } from "@/components/PillarCards";
import { TrustSection } from "@/components/TrustSection";
import { DoctorFinder } from "@/components/DoctorFinder";
import { Footer } from "@/components/Footer";

export function PageContent() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section - Full viewport height, static */}
        <HeroSection />
        
        {/* Pillar Cards Section - Normal scroll */}
        <PillarCards />
        
        {/* Trust Section */}
        <TrustSection />
        
        {/* Doctor Finder */}
        <DoctorFinder />
      </main>
      <Footer />
    </>
  );
}