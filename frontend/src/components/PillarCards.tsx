// src/components/PillarCards.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Building2, Microscope, Pill, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function PillarCards() {
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

  const pillars = [
    {
      id: "hospital",
      title: "Afilas General Hospital",
      description: "Compassionate, specialized patient care available 24/7.",
      image: "/Dr._Fsha-213x420.jpg",
      highlights: [
        "Inpatient/Outpatient",
        "Emergency",
        "Surgery",
        "Maternal & Child Health"
      ],
      longDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus do eiusmod tempor, esse enim, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      icon: Building2,
      color: "text-red-600",
      borderColor: "border-red-200",
      link: "/hospital",
      cta: "Explore Hospital Services",
      iconBg: "bg-red-50",
      tagColor: "bg-red-100 text-red-700",
      delay: "0"
    },
    {
      id: "diagnostic",
      title: "Afilas Diagnosis Center",
      description: "High-precision imaging and automated laboratory testing.",
      image: "/dr_dawit-213x420.jpg",
      highlights: [
        "Advanced Imaging (CT/MRI/X-Ray)",
        "Pathology",
        "Molecular Diagnostics"
      ],
      longDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus do eiusmod tempor, esse enim, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      icon: Microscope,
      color: "text-blue-600",
      borderColor: "border-blue-200",
      link: "/diagnostics",
      cta: "Book a Test / View Services",
      iconBg: "bg-blue-50",
      tagColor: "bg-blue-100 text-blue-700",
      delay: "150"
    },
    {
      id: "pharma",
      title: "Afilas Drug Manufacturing",
      description: "Quality-driven, accessible pharmaceutical production meeting international standards.",
      image: "/Dr_Abrham-213x420.jpg",
      highlights: [
        "Essential medicines",
        "High-standard formulation",
        "B28 distribution"
      ],
      longDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Purus do eiusmod tempor, esse enim, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      icon: Pill,
      color: "text-green-600",
      borderColor: "border-green-200",
      link: "/pharma",
      cta: "View Products & Capabilities",
      iconBg: "bg-green-50",
      tagColor: "bg-green-100 text-green-700",
      delay: "300"
    }
  ];

  return (
    <section
      ref={sectionRef}
      className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header with Animation */}
       
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className={`group bg-white dark:bg-gray-800 rounded-xl border ${pillar.borderColor} overflow-hidden transition-all duration-700 transform hover:shadow-xl hover:-translate-y-1 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-12 opacity-0"
                }`}
                style={{
                  transitionDelay: `${pillar.delay}ms`,
                }}
              >
                {/* Image and Content Side by Side */}
                <div className="flex flex-col sm:flex-row h-full">
                  {/* Image - Left Side */}
                  <div className="relative w-full sm:w-36 md:w-40 h-48 sm:h-auto flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <Image
                      src={pillar.image}
                      alt={pillar.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {/* Image overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Content - Right Side */}
                  <div className="flex-1 p-4 flex flex-col">
                    {/* Title with Icon */}
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`flex-shrink-0 w-7 h-7 rounded-full ${pillar.iconBg} flex items-center justify-center`}>
                        <Icon className={`w-3.5 h-3.5 ${pillar.color}`} />
                      </div>
                      <h3 className={`text-base font-bold ${pillar.color}`}>
                        {pillar.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {pillar.description}
                    </p>

                    {/* Highlights Section */}
                    <div className="mb-2">
                      <p className="text-[10px] font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                        Highlights
                      </p>
                      <div className="space-y-0.5">
                        {pillar.highlights.map((highlight, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1.5 transition-all duration-300 group-hover:translate-x-0.5"
                            style={{
                              transitionDelay: `${idx * 50}ms`,
                            }}
                          >
                            <span className={`w-1 h-1 rounded-full ${pillar.color.replace('text-', 'bg-')} flex-shrink-0`} />
                            <span className="text-xs text-gray-700 dark:text-gray-300">
                              {highlight}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Long Description */}
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-2 flex-1 line-clamp-2">
                      {pillar.longDescription}
                    </p>

                    {/* CTA Link */}
                    <Link
                      href={pillar.link}
                      className={`inline-flex items-center gap-1 ${pillar.color} font-semibold text-xs hover:underline transition-all group/link`}
                    >
                      {pillar.cta}
                      <ChevronRight className="w-3.5 h-3.5 transition-all duration-300 group-hover/link:translate-x-1 group-hover/link:scale-110" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}