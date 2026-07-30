"use client";

import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { PillarCards } from "@/components/PillarCards";
import { ValueProposition } from "@/components/ValueProposition";
import { DoctorFinder } from "@/components/DoctorFinder";
import { Footer } from "@/components/Footer";

export function PageContent() {
  return (
    <>
      <Header />
      <main>
        {/* Sticky Slides Container */}
        <div className="relative">
          {/* Slide 1: Hero */}
          <div className="sticky top-0 h-screen overflow-hidden z-0">
            <HeroSection />
          </div>

          {/* Slide 2: Pillar Cards */}
          <div 
          className="sticky top-0 h-screen overflow-hidden z-0"
          >
            <PillarCards />
          </div>
        </div>

        {/* Normal scrolling sections below */}
        <ValueProposition />
        <DoctorFinder />
        {/* <HealthPackages /> */}
        {/* <PharmaCatalog /> */}
      </main>
      <Footer />
    </>
  );
}