'use client'

import { useLanguage } from '@/contexts/LanguageProvider'
import { useEffect, useRef, useState } from 'react'
import {
  HeartPulse,
  Cpu,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'

interface ValueCard {
  titleKey: string
  descKey: string
  icon: React.ElementType
  highlights: string[]
  gradient: string
  iconBg: string
}

const valueCards: ValueCard[] = [
  {
    titleKey: 'pharma.why.card1_title',
    descKey: 'pharma.why.card1_desc',
    icon: HeartPulse,
    highlights: [
      'pharma.why.card1_h1',
      'pharma.why.card1_h2',
      'pharma.why.card1_h3',
    ],
    gradient: 'from-teal-500/20 via-emerald-500/10 to-transparent',
    iconBg: 'bg-teal-500/15 text-teal-600 dark:text-teal-400',
  },
  {
    titleKey: 'pharma.why.card2_title',
    descKey: 'pharma.why.card2_desc',
    icon: Cpu,
    highlights: [
      'pharma.why.card2_h1',
      'pharma.why.card2_h2',
      'pharma.why.card2_h3',
    ],
    gradient: 'from-blue-500/20 via-indigo-500/10 to-transparent',
    iconBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  },
  {
    titleKey: 'pharma.why.card3_title',
    descKey: 'pharma.why.card3_desc',
    icon: ShieldCheck,
    highlights: [
      'pharma.why.card3_h1',
      'pharma.why.card3_h2',
      'pharma.why.card3_h3',
    ],
    gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    iconBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  },
]

export function PharmaWhyChoose() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visibleCards, setVisibleCards] = useState<boolean[]>([false, false, false])
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    cardRefs.current.forEach((el, idx) => {
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleCards(prev => {
              const next = [...prev]
              next[idx] = true
              return next
            })
            observer.unobserve(el)
          }
        },
        { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [])

  // Section header observer
  const headerRef = useRef<HTMLDivElement>(null)
  const [headerVisible, setHeaderVisible] = useState(false)

  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Subtle background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          ref={headerRef}
          className={`text-center mb-20 transition-all duration-1000 ease-out ${
            headerVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary tracking-wide uppercase">
              {t('pharma.why.badge')}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            {t('pharma.why.title')}
          </h2>
          <p className="text-lg text-foreground/70 max-w-3xl mx-auto leading-relaxed">
            {t('pharma.why.subtitle')}
          </p>
        </div>

        {/* Value Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {valueCards.map((card, idx) => {
            const Icon = card.icon
            return (
              <div
                key={idx}
                ref={el => { cardRefs.current[idx] = el }}
                className={`pharma-scroll-card group relative bg-card border border-border rounded-3xl p-8 lg:p-10 overflow-hidden transition-all duration-700 ease-out hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 ${
                  visibleCards[idx]
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-16'
                }`}
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                {/* Gradient background overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-2xl ${card.iconBg} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-8 h-8" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-4">
                    {t(card.titleKey)}
                  </h3>

                  {/* Description */}
                  <p className="text-foreground/70 leading-relaxed mb-8">
                    {t(card.descKey)}
                  </p>

                  {/* Highlights */}
                  <ul className="space-y-3">
                    {card.highlights.map((hKey, hIdx) => (
                      <li
                        key={hIdx}
                        className="flex items-start gap-3 text-sm text-foreground/80"
                      >
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{t(hKey)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div
          className={`text-center mt-16 transition-all duration-1000 ease-out delay-500 ${
            headerVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <a
            href="#b2b-inquiry"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-full hover:shadow-lg hover:shadow-primary/25 hover:scale-105 transition-all duration-300"
          >
            {t('pharma.why.cta')}
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  )
}
