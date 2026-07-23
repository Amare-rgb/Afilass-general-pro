'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  cta1: string;
  cta1Link: string;
  cta2: string;
  cta2Link: string;
  stats: { number: string; label: string }[];
}

interface HeroCarouselProps {
  slides: Slide[];
}

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setProgress(0);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Progress bar animation
  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 0.5;
      });
    }, 30);

    return () => clearInterval(progressTimer);
  }, [currentSlide]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setProgress(0);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setProgress(0);
  };

  return (
    <div className="relative h-[600px] md:h-[700px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image */}
          <div className="relative h-full w-full">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-6xl mx-auto px-5 w-full">
              <div className="max-w-2xl">
                {/* Hospital Name - General Text */}
                <div className="flex items-center gap-3 mb-4 animate-fadeInUp">
                  <div className="h-px w-8 bg-yellow-400"></div>
                  <span className="text-xs uppercase tracking-[0.3em] text-yellow-400 font-semibold">
                    Afilas General Hospital
                  </span>
                </div>
                
                {/* Subtitle - White with gold accent */}
                <p className="text-xs uppercase tracking-[0.3em] text-yellow-400 font-semibold mb-4 animate-fadeInUp animation-delay-100">
                  {slide.subtitle}
                </p>
                
                {/* Title - White */}
                <h1 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.05] mb-6 animate-fadeInUp animation-delay-200 text-white">
                  {slide.title}
                </h1>
                
                {/* Description - White with opacity */}
                <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-8 animate-fadeInUp animation-delay-300 max-w-xl">
                  {slide.description}
                </p>
                
                {/* Buttons */}
                <div className="flex flex-wrap gap-4 animate-fadeInUp animation-delay-400">
                  <Link
                    href={slide.cta1Link}
                    className="focus-ring rounded-sm bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-7 py-3.5 transition-all transform hover:scale-105"
                  >
                    {slide.cta1}
                  </Link>
                  <Link
                    href={slide.cta2Link}
                    className="focus-ring rounded-sm border-2 border-white text-white font-semibold px-7 py-3.5 hover:bg-white hover:text-black transition-all transform hover:scale-105"
                  >
                    {slide.cta2}
                  </Link>
                </div>

                {/* Stats - White */}
                <div className="flex gap-8 mt-8 animate-fadeInUp animation-delay-500">
                  {slide.stats && slide.stats.map((stat, idx) => (
                    <div key={idx} className="border-r border-white/30 pr-8 last:border-0 last:pr-0">
                      <p className="font-display text-3xl md:text-4xl text-yellow-400">{stat.number}</p>
                      <p className="text-xs text-white/70 uppercase tracking-wide">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows - White themed */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all backdrop-blur-sm border border-white/30 hover:border-white/60 shadow-lg"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all backdrop-blur-sm border border-white/30 hover:border-white/60 shadow-lg"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Scroll Progress Bar - White themed */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-1.5 bg-white/20 backdrop-blur-sm">
        <div 
          className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-300 ease-linear relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-400 rounded-full blur-sm opacity-70"></div>
        </div>
      </div>

      {/* Dots Indicator - White themed */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 ${
              index === currentSlide
                ? 'w-10 h-2.5 bg-white rounded-full shadow-lg'
                : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70 rounded-full border border-white/20'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}