"use client";

import { useLanguage } from "@/contexts/LanguageProvider";
import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ChevronRight, Activity, Server, Database } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// =========================================================================
// HERO ILLUSTRATION IMAGE PATH
// =========================================================================
export const DIAGNOSTICS_HERO_IMAGE_PATH = "/diagnostics-bg.jpg";

interface DiagnosticsHeroProps {
  title?: string;
  subtitle?: string;
  status?: 'healthy' | 'degraded' | 'unhealthy';
  version?: string;
}

export function HospitalHero({ 
  title = "Afilas General Hospital",
  subtitle = "Monitor your application health and performance",
  status = 'healthy',
  
}: DiagnosticsHeroProps) {
  const { t } = useLanguage();
  const [showScroll, setShowScroll] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);
  const [hasExited, setHasExited] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowScroll(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const isMobile = window.innerWidth < 640;
    if (isMobile) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setHasExited(false);
        } else {
          setHasExited(true);
          setIsInView(false);
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'healthy': return 'text-green-400';
      case 'degraded': return 'text-yellow-400';
      case 'unhealthy': return 'text-red-400';
      default: return 'text-white';
    }
  };

  const getStatusBgColor = () => {
    switch (status) {
      case 'healthy': return 'bg-green-500/20 border-green-500/30';
      case 'degraded': return 'bg-yellow-500/20 border-yellow-500/30';
      case 'unhealthy': return 'bg-red-500/20 border-red-500/30';
      default: return 'bg-white/10 border-white/20';
    }
  };

  const animClass = isInView
    ? "hero-text-enter"
    : hasExited
    ? "hero-text-exit"
    : "opacity-100 sm:opacity-0";

  return (
    <div
      ref={heroRef}
      className="relative h-screen min-h-screen overflow-hidden flex items-center py-0 bg-gradient-to-br from-green-900 via-emerald-800 to-teal-950"
    >
      {/* Background pattern overlay */}
      <div
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating decorative shapes */}
      <div className="hidden sm:block absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="floating-shape absolute top-10 left-10 w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm" />
        <div className="floating-shape absolute bottom-20 right-20 w-48 h-48 rounded-full bg-white/5 backdrop-blur-sm" />
        <div className="floating-shape absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-emerald-400/20 backdrop-blur-sm" />
        <div className="floating-shape absolute bottom-1/3 right-1/3 w-40 h-40 rounded-full bg-teal-400/10 backdrop-blur-sm" />
        <div className="floating-shape absolute top-1/3 right-10 w-20 h-20 rotate-45 bg-green-400/20 backdrop-blur-sm" />
      </div>

      <div className="absolute inset-0 bg-black/20 z-[1]" />

      {/* Content */}
      <div className="relative z-20 flex items-center justify-center w-full px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-y-8 lg:items-center lg:grid-cols-2 gap-x-12">
            {/* Left Column – Text and CTAs */}
            <div className="text-center lg:text-left">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getStatusBgColor()} mb-6 ${
                  isInView ? "hero-text-enter" : hasExited ? "hero-text-exit" : "opacity-100 sm:opacity-0"
                }`}
              >
                <Activity className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">
                  System Status: <span className={getStatusColor()}>{status.toUpperCase()}</span>
                </span>
              </div>

              <h1
                className={`text-4xl font-bold leading-tight text-white sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight drop-shadow-md ${animClass}`}
              >
                {title}
              </h1>

              <p
                className={`mt-4 text-lg text-white/80 leading-relaxed max-w-md mx-auto lg:mx-0 ${
                  isInView ? "hero-text-enter-d1" : hasExited ? "hero-text-exit" : "opacity-100 sm:opacity-0"
                }`}
              >
                {subtitle}
              </p>

             

              {/* Buttons */}
              <div
                className={`mt-8 flex flex-col sm:flex-row items-center gap-4 lg:justify-start ${
                  isInView ? "hero-text-enter-d3" : hasExited ? "hero-text-exit" : "opacity-100 sm:opacity-0"
                }`}
              >
                <Link
                  href="#services"
                  className="inline-flex items-center px-8 py-4 text-base font-bold text-green-900 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  View Services
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
                
              </div>
            </div>

            {/* Right Column – Image */}
            <div className="hidden lg:flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-xl lg:max-w-2xl">
                <div className="relative aspect-square rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center overflow-hidden shadow-2xl">
                  <Image
                    src="/afilas.jpg"
                    alt="Afilas General Hospital"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-green-500/30 rounded-full blur-xl pointer-events-none" />
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-emerald-400/30 rounded-full blur-xl pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
    
    </div>
  );
}

export default HospitalHero;