"use client";

import { useLanguage } from "@/contexts/LanguageProvider";
import Link from "next/link";
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

export function DiagnosticsHero({ 
  title = "System Diagnostics",
  subtitle = "Monitor your application health and performance",
  status = 'healthy',
  version = '1.0.0'
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
      className="relative sm:sticky sm:top-0 h-screen min-h-screen overflow-hidden flex items-center py-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950"
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
        <div className="floating-shape absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-blue-400/20 backdrop-blur-sm" />
        <div className="floating-shape absolute bottom-1/3 right-1/3 w-40 h-40 rounded-full bg-indigo-400/10 backdrop-blur-sm" />
        <div className="floating-shape absolute top-1/3 right-10 w-20 h-20 rotate-45 bg-purple-400/20 backdrop-blur-sm" />
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

              {/* Stats */}
              <div
                className={`mt-8 flex flex-col sm:flex-row items-center gap-4 lg:justify-start ${
                  isInView ? "hero-text-enter-d2" : hasExited ? "hero-text-exit" : "opacity-100 sm:opacity-0"
                }`}
              >
                <div className="flex -space-x-3 overflow-hidden">
                  <div className="inline-block w-12 h-12 rounded-full ring-2 ring-white bg-white/20 flex items-center justify-center text-white font-bold">
                    <Server className="w-6 h-6" />
                  </div>
                  <div className="inline-block w-12 h-12 rounded-full ring-2 ring-white bg-white/20 flex items-center justify-center text-white font-bold">
                    <Database className="w-6 h-6" />
                  </div>
                  <div className="inline-block w-12 h-12 rounded-full ring-2 ring-white bg-primary/40 flex items-center justify-center text-white font-bold text-sm">
                    v{version}
                  </div>
                </div>
                <p className="text-sm text-white/80">
                  All systems operational • Last checked: {new Date().toLocaleTimeString()}
                </p>
              </div>

              {/* Buttons */}
              <div
                className={`mt-8 flex flex-col sm:flex-row items-center gap-4 lg:justify-start ${
                  isInView ? "hero-text-enter-d3" : hasExited ? "hero-text-exit" : "opacity-100 sm:opacity-0"
                }`}
              >
                <Link
                  href="#services"
                  className="inline-flex items-center px-8 py-4 text-base font-bold text-primary bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  View Services
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  href="/api/diagnostics"
                  className="inline-flex items-center px-8 py-4 text-base font-bold text-white bg-primary/30 backdrop-blur-sm border border-white/30 rounded-full hover:bg-primary/40 transition-all hover:scale-105"
                >
                  API Status
                </Link>
              </div>
            </div>

            {/* Right Column – Illustration */}
            <div className="hidden lg:flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-xl lg:max-w-2xl">
                <div className="relative aspect-square rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center overflow-hidden shadow-2xl">
                  <div className="flex flex-col items-center justify-center text-white p-8">
                    <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                      <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm border border-white/10">
                        <Activity className="w-8 h-8 mx-auto mb-2 text-green-400" />
                        <p className="text-sm font-semibold">API</p>
                        <p className="text-xs text-green-400">Healthy</p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm border border-white/10">
                        <Database className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                        <p className="text-sm font-semibold">Database</p>
                        <p className="text-xs text-blue-400">Connected</p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm border border-white/10">
                        <Server className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                        <p className="text-sm font-semibold">Redis</p>
                        <p className="text-xs text-purple-400">Connected</p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-4 text-center backdrop-blur-sm border border-white/10">
                        <Activity className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                        <p className="text-sm font-semibold">Workers</p>
                        <p className="text-xs text-yellow-400">Active</p>
                      </div>
                    </div>
                    <p className="mt-6 text-sm text-white/60">All systems operational</p>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/30 rounded-full blur-xl pointer-events-none" />
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-blue-400/30 rounded-full blur-xl pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      {showScroll && (
        <div className="hidden sm:flex absolute bottom-10 left-1/2 -translate-x-1/2 z-10 scroll-indicator flex-col items-center gap-2 text-white/80">
          <span className="text-sm tracking-widest uppercase">Scroll</span>
          <ArrowDown className="w-6 h-6 animate-bounce" />
        </div>
      )}
    </div>
  );
}

export default DiagnosticsHero;