"use client";

import Link from "next/link";
import { Building2, ChevronRight, MapPin, Clock, Phone, Mail, Heart, Shield, Award } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { useLanguage } from "@/contexts/LanguageProvider";

export function GeneralSec() {
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
      id="afilas-general-hospital"
      ref={sectionRef}
      className="py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-8 overflow-hidden relative border-t border-b border-blue-600"
      style={{
        background: "linear-gradient(135deg, #f0f9ff 0%, #ffffff 50%, #f0f9ff 100%)",
      }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full opacity-20 -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 rounded-full opacity-10 -ml-48 -mb-48"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100/20 rounded-full blur-3xl"></div>

      <div className="relative max-w-5xl mx-auto z-10">
        
        {/* Title Section with Hover Effects */}
        <div className={`text-center mb-6 transition-all duration-700 ease-out ${
          isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-95"
        }`}>
          <div className="flex items-center justify-center gap-2 mb-2 group/title">
            <Building2 className="w-5 h-5 text-blue-600 group-hover/title:rotate-12 group-hover/title:scale-110 transition-all duration-500" />
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
              <span className="relative inline-block group-hover/title:text-blue-600 transition-colors duration-300">
                Afilas
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover/title:w-full transition-all duration-500"></span>
              </span>
              <span className="text-blue-600 relative inline-block group-hover/title:text-blue-700 transition-colors duration-300 ml-1">
                General Hospital
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-700 group-hover/title:w-full transition-all duration-500 delay-100"></span>
              </span>
            </h1>
          </div>
          
          <div className="w-16 h-0.5 bg-blue-600 mx-auto rounded-full mb-3 group-hover/title:w-24 transition-all duration-500"></div>
          
          <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed group-hover/title:text-gray-800 transition-colors duration-300">
            Compassionate, specialized patient care available 24/7.
          </p>
        </div>

        {/* Main Description */}
        <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 mb-6 transition-all duration-700 ease-out hover:shadow-2xl hover:scale-[1.01] transform ${
          isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-95"
        }`} style={{ transitionDelay: "100ms" }}>
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-full mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              <Heart className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-gray-700 text-sm md:text-base leading-relaxed">
              Afilas hospital is a multi-specialty hospital located around Felege Hiwot Hospital, 
              in front of Amhara public health institute, offshore Lake Tana with breathtaking view. 
              It is one of the private hospitals in the city, with over 10 specialty centers. 
              Afilas offers state-of-the-art diagnostic and therapeutic care in a one-stop medical center.
            </p>
          </div>
        </div>

        {/* Location & Contact Info with Hover Effects */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 transition-all duration-700 ease-out ${
          isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-95"
        }`} style={{ transitionDelay: "200ms" }}>
          
          {/* Location Card */}
         

          {/* Emergency Services Card */}
         
        </div>

        {/* CTA Button with Enhanced Hover */}
        <div className={`text-center transition-all duration-700 ease-out ${
          isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-95"
        }`} style={{ transitionDelay: "300ms" }}>
          <Link
            href="/hospital"
            className="group inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm md:text-base px-6 md:px-8 py-2.5 md:py-3 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 relative overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            <span className="relative flex items-center gap-2">
              Explore Hospital Services
              <ChevronRight className="w-4 h-4 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110" />
            </span>
          </Link>
        </div>

       
      </div>
    </section>
  );
}