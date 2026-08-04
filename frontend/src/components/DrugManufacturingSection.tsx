"use client";

import Link from "next/link";
import { ClipboardList, ShieldCheck, Archive, Handshake, ArrowRight, Building2, Heart, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function DrugManufacturingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="afilas-drug-manufacturing"
      ref={sectionRef}
      className="py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 overflow-hidden relative border-t border-b border-emerald-600"
      style={{
        background: "linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #f0fdf4 100%)",
      }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200 rounded-full opacity-20 -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-300 rounded-full opacity-10 -ml-48 -mb-48"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-100/20 rounded-full blur-3xl"></div>

      <div className="relative max-w-5xl mx-auto z-10">
        
        {/* Title Section with Hover Effects */}
        <div className={`text-center mb-6 transition-all duration-700 ease-out ${
          isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-95"
        }`}>
          <div className="flex items-center justify-center gap-2 mb-2 group/title">
            <Building2 className="w-5 h-5 text-emerald-600 group-hover/title:rotate-12 group-hover/title:scale-110 transition-all duration-500" />
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
              <span className="relative inline-block group-hover/title:text-emerald-600 transition-colors duration-300">
                Afilas
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 group-hover/title:w-full transition-all duration-500"></span>
              </span>
              <span className="text-emerald-600 relative inline-block group-hover/title:text-emerald-700 transition-colors duration-300 ml-1">
                Drug Manufacturing
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-700 group-hover/title:w-full transition-all duration-500 delay-100"></span>
              </span>
            </h1>
          </div>
          
          <div className="w-16 h-0.5 bg-emerald-600 mx-auto rounded-full mb-3 group-hover/title:w-24 transition-all duration-500"></div>
          
          <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed group-hover/title:text-gray-800 transition-colors duration-300">
            Safeguarding community health through local, high-quality, and compliant medicine production.
          </p>
        </div>

        {/* Main Description */}
        <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 mb-6 transition-all duration-700 ease-out hover:shadow-2xl hover:scale-[1.01] transform ${
          isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-95"
        }`} style={{ transitionDelay: "100ms" }}>
          <div className="flex items-start gap-3">
            <div className="bg-emerald-100 p-2 rounded-full mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <Heart className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed">
              Afilas Drug Manufacturing is committed to producing high-quality pharmaceutical products 
              that meet international standards. With state-of-the-art manufacturing facilities and 
              strict adherence to GMP guidelines, we ensure every product is safe, effective, and 
              reliable for patient use.
            </p>
          </div>
        </div>

        {/* Cards Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 transition-all duration-700 ease-out ${
          isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-95"
        }`} style={{ transitionDelay: "200ms" }}>
          
          {/* Manufacturing Capabilities */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-5 flex items-start gap-3 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer border border-transparent hover:border-emerald-200">
            <div className="bg-sky-100 p-2.5 rounded-full flex-shrink-0 group-hover:bg-sky-200 group-hover:scale-110 transition-all duration-300">
              <ClipboardList className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-sm mb-1 flex items-center gap-2">
                Manufacturing Capabilities
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full group-hover:bg-emerald-200 transition-colors">GMP</span>
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Dosage forms produced include Tablets, Capsules, Liquids, and Ointments designed for safe, reliable patient use.
              </p>
            </div>
          </div>

          {/* Quality Assurance & Compliance */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-5 flex items-start gap-3 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer border border-transparent hover:border-emerald-200">
            <div className="bg-emerald-100 p-2.5 rounded-full flex-shrink-0 group-hover:bg-emerald-200 group-hover:scale-110 transition-all duration-300">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-sm mb-1 flex items-center gap-2">
                Quality Assurance & Compliance
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full group-hover:bg-emerald-200 transition-colors">Certified</span>
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Strict adherence to GMP standards and regulatory approvals ensures every product meets international safety and quality benchmarks.
              </p>
            </div>
          </div>

          {/* Product Catalog */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-5 flex items-start gap-3 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer border border-transparent hover:border-emerald-200">
            <div className="bg-indigo-100 p-2.5 rounded-full flex-shrink-0 group-hover:bg-indigo-200 group-hover:scale-110 transition-all duration-300">
              <Archive className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-sm mb-1 flex items-center gap-2">
                Product Catalog
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full group-hover:bg-emerald-200 transition-colors">Searchable</span>
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                A searchable directory for healthcare providers, pharmacies, and distributors to quickly find suitable formulations and products.
              </p>
            </div>
          </div>

          {/* Partnership & B2B Inquiry */}
          <div className="group bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-5 flex items-start gap-3 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer border border-transparent hover:border-emerald-200">
            <div className="bg-rose-100 p-2.5 rounded-full flex-shrink-0 group-hover:bg-rose-200 group-hover:scale-110 transition-all duration-300">
              <Handshake className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-sm mb-1 flex items-center gap-2">
                Partnership & B2B Inquiry
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full group-hover:bg-emerald-200 transition-colors">Contact</span>
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Support for supply requests, contract manufacturing, and institutional distribution across public and private health networks.
              </p>
            </div>
          </div>
        </div>

        {/* Go to Pharma Page Button */}
        <div className={`text-center transition-all duration-700 ease-out ${
          isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-95"
        }`} style={{ transitionDelay: "300ms" }}>
          <Link
            href="/pharma"
            className="group inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm md:text-base px-6 md:px-8 py-2.5 md:py-3 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 relative overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            <span className="relative flex items-center gap-2">
              Go to Pharma Page
              <ChevronRight className="w-4 h-4 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110" />
            </span>
          </Link>
        </div>

      </div>
    </section>
  );
}