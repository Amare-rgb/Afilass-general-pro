'use client'

import { useLanguage } from '@/contexts/LanguageProvider'
import { healthPackages } from '@/lib/mockData'
import { Check, ArrowRight } from 'lucide-react'

export function HealthPackages() {
  const { t } = useLanguage()

  return (
    <section className="bg-card py-24 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('packages.title')}
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Choose the perfect health package for your needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {healthPackages.map((pkg, idx) => (
            <div
              key={pkg.id}
              className={`rounded-2xl p-8 border transition-all hover:shadow-lg hover:-translate-y-1 ${
                idx === 1
                  ? 'bg-primary/5 border-primary/30 ring-2 ring-primary/20'
                  : 'bg-background border-border hover:border-primary/30'
              }`}
            >
              {idx === 1 && (
                <div className="mb-4 inline-flex items-center px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-bold">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold text-foreground mb-2">{pkg.name}</h3>
              <p className="text-foreground/70 text-sm mb-6">{pkg.description}</p>

              <div className="mb-8">
                <div className="text-4xl font-bold text-foreground">
                  ETB {pkg.price}
                  <span className="text-sm text-foreground/70 font-normal">/package</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {pkg.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
                  idx === 1
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-primary/10 text-primary hover:bg-primary/20'
                }`}
              >
                Get Package
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
