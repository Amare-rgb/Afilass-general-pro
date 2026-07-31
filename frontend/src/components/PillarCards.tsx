"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageProvider";
import { Heart, Microscope, Pill, ArrowRight, Check } from "lucide-react";

// ============================================================
// IMAGE PATHS – Change these to your own images
// ============================================================
const CARD_IMAGES = {
  hospital:
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80",
  diagnostics:
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80",
  pharma:
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80",
};

export function PillarCards() {
  const { t } = useLanguage();

  const pillars = [
    {
      id: "hospital",
      icon: Heart,
      titleKey: "nav.division.hospital",
      taglineKey: "pillars.hospital_tagline",
      descKey: "pillars.hospital_desc",
      highlights: [
        "pillars.hospital_highlights_1",
        "pillars.hospital_highlights_2",
        "pillars.hospital_highlights_3",
      ],
      ctaKey: "pillars.hospital_cta",
      href: "/hospital",
      image: CARD_IMAGES.hospital,
    },
    {
      id: "diagnostics",
      icon: Microscope,
      titleKey: "nav.division.diagnostics",
      taglineKey: "pillars.diagnostics_tagline",
      descKey: "pillars.diagnostics_desc",
      highlights: [
        "pillars.diagnostics_highlights_1",
        "pillars.diagnostics_highlights_2",
        "pillars.diagnostics_highlights_3",
      ],
      ctaKey: "pillars.diagnostics_cta",
      href: "/diagnostics",
      image: CARD_IMAGES.diagnostics,
    },
    {
      id: "pharma",
      icon: Pill,
      titleKey: "nav.division.pharma",
      taglineKey: "pillars.pharma_tagline",
      descKey: "pillars.pharma_desc",
      highlights: [
        "pillars.pharma_highlights_1",
        "pillars.pharma_highlights_2",
        "pillars.pharma_highlights_3",
      ],
      ctaKey: "pillars.pharma_cta",
      href: "/pharma",
      image: CARD_IMAGES.pharma,
    },
  ];

  return (
    <section className="h-screen w-full bg-background flex items-center justify-center overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {/* Section Header - Reduced margin */}
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            {t("pillars.title")}
          </h2>
          <p className="text-sm sm:text-base text-foreground/70 max-w-2xl mx-auto">
            {t("pillars.subtitle")}
          </p>
        </div>

        {/* Cards Grid - Reduced gap */}
        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            const descWords = t(pillar.descKey).split(" ");
            const highlightItems = pillar.highlights.map((key) => t(key));

            return (
              <div
                key={pillar.id}
                className="group relative aspect-[1/1.4] overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              >
                {/* Background Image with Zoom on Hover */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                  style={{ backgroundImage: `url(${pillar.image})` }}
                />

                {/* Dark Overlay for readability */}
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300" />

                {/* Card content - Reduced padding */}
                <div className="relative z-10 h-full w-full p-5 sm:p-6 flex flex-col justify-between text-white">
                  {/* Top: Title and Tagline */}
                  <div>
                    {/* Title - Smaller */}
                    <h3 className="text-xl sm:text-2xl font-bold mb-2 drop-shadow-md">
                      {t(pillar.titleKey)}
                    </h3>

                    {/* Tagline - Smaller */}
                    <p className="text-xs sm:text-sm font-semibold text-primary/90 mb-3 drop-shadow-md">
                      {t(pillar.taglineKey)}
                    </p>

                    {/* Animated Description - Smaller text */}
                    <div className="overflow-hidden mb-3">
                      <p className="text-xs sm:text-sm leading-relaxed text-white/90 transition-all duration-500 ease-[cubic-bezier(.25,.46,.45,.94)] group-hover:translate-y-0 translate-y-4 opacity-0 group-hover:opacity-100">
                        {descWords.map((word, idx) => (
                          <span
                            key={idx}
                            className="inline-block mr-1 transition-all duration-300 ease-[cubic-bezier(.25,.46,.45,.94)] group-hover:opacity-100 group-hover:translate-y-0 opacity-0 translate-y-2"
                            style={{
                              transitionDelay: `${idx * 20}ms`,
                            }}
                          >
                            {word}
                          </span>
                        ))}
                      </p>
                    </div>

                    {/* Animated Highlights - Reduced spacing */}
                    <ul className="space-y-1.5 mb-4 overflow-hidden">
                      {highlightItems.map((text, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-xs sm:text-sm text-white/90 transition-all duration-400 ease-[cubic-bezier(.25,.46,.45,.94)] group-hover:translate-y-0 group-hover:opacity-100 translate-y-3 opacity-0"
                          style={{
                            transitionDelay: `${150 + idx * 60}ms`,
                          }}
                        >
                          <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary shrink-0 mt-0.5" />
                          <span>{text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom: CTA and Icon */}
                  <div className="flex items-center justify-between mt-1">
                    {/* Animated CTA Button - Smaller */}
                    <Link
                      href={pillar.href}
                      className="group/btn inline-flex items-center gap-2 text-white font-medium transition-all duration-300"
                    >
                      <span className="relative pb-1 text-xs sm:text-sm uppercase tracking-[0.15em]">
                        {t(pillar.ctaKey)}
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-bottom-right group-hover/btn:origin-bottom-left" />
                      </span>
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 group-hover/btn:translate-x-0 -translate-x-1 group-hover/btn:scale-100 group-active/btn:scale-90"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="10"
                        viewBox="0 0 46 16"
                        fill="none"
                      >
                        <path
                          d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z"
                          transform="translate(30)"
                          fill="currentColor"
                        />
                      </svg>
                    </Link>

                    {/* Icon at bottom right - Smaller */}
                    <div className="text-white/30 group-hover:text-white transition-colors duration-300">
                      <Icon className="w-8 h-8 sm:w-10 sm:h-10" />
                    </div>
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