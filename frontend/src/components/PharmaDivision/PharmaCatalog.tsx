'use client'

import { useLanguage } from '@/contexts/LanguageProvider'
import { useEffect, useRef, useState } from 'react'
import { ShoppingCart, MapPin, Calendar, Package, Eye, Pill } from 'lucide-react'

// Mock data in the exact backend format
interface PharmaProduct {
  id: string
  name: string
  description: string
  price: number
  duration: number
  image: string | null
  isActive: boolean
  location: string
  createdAt: string
  updatedAt: string
}

const mockProducts: PharmaProduct[] = [
  {
    id: 'cms4huonf00059rzgheidhvnd',
    name: 'Amoxicillin 500mg Capsules',
    description: 'Broad-spectrum antibiotic for bacterial infections. Manufactured under GMP standards.',
    price: 280,
    duration: 30,
    image: null,
    isActive: true,
    location: 'Afilas Drug Manufacturing',
    createdAt: '2026-07-28T10:09:25.323Z',
    updatedAt: '2026-07-28T10:09:25.323Z',
  },
  {
    id: 'cms4huonf00059rzgheidhvne',
    name: 'Metformin 850mg Tablets',
    description: 'First-line medication for type 2 diabetes management. Quality assured formulation.',
    price: 450,
    duration: 60,
    image: null,
    isActive: true,
    location: 'Afilas Drug Manufacturing',
    createdAt: '2026-07-25T08:30:00.000Z',
    updatedAt: '2026-07-25T08:30:00.000Z',
  },
  {
    id: 'cms4huonf00059rzgheidhvnf',
    name: 'Paracetamol 500mg Tablets',
    description: 'Effective pain relief and fever reduction. Locally produced, internationally certified.',
    price: 120,
    duration: 30,
    image: null,
    isActive: true,
    location: 'Afilas Drug Manufacturing',
    createdAt: '2026-07-20T14:15:00.000Z',
    updatedAt: '2026-07-20T14:15:00.000Z',
  },
  {
    id: 'cms4huonf00059rzgheidhvng',
    name: 'Omeprazole 20mg Capsules',
    description: 'Proton pump inhibitor for acid reflux and gastric ulcer treatment.',
    price: 350,
    duration: 30,
    image: null,
    isActive: true,
    location: 'Afilas Drug Manufacturing',
    createdAt: '2026-07-18T09:00:00.000Z',
    updatedAt: '2026-07-18T09:00:00.000Z',
  },
  {
    id: 'cms4huonf00059rzgheidhvnh',
    name: 'Ciprofloxacin 500mg Tablets',
    description: 'Fluoroquinolone antibiotic for urinary, respiratory, and skin infections.',
    price: 520,
    duration: 14,
    image: null,
    isActive: true,
    location: 'Afilas Drug Manufacturing',
    createdAt: '2026-07-15T11:45:00.000Z',
    updatedAt: '2026-07-15T11:45:00.000Z',
  },
  {
    id: 'cms4huonf00059rzgheidhvni',
    name: 'Ibuprofen 400mg Tablets',
    description: 'Non-steroidal anti-inflammatory drug for pain, inflammation, and fever.',
    price: 180,
    duration: 30,
    image: null,
    isActive: true,
    location: 'Afilas Drug Manufacturing',
    createdAt: '2026-07-12T16:20:00.000Z',
    updatedAt: '2026-07-12T16:20:00.000Z',
  },
]

// Generate deterministic gradient colors based on product name
function getProductGradient(name: string): string {
  const gradients = [
    'from-teal-500/30 via-emerald-400/20 to-cyan-500/10',
    'from-blue-500/30 via-indigo-400/20 to-purple-500/10',
    'from-emerald-500/30 via-green-400/20 to-teal-500/10',
    'from-amber-500/30 via-orange-400/20 to-yellow-500/10',
    'from-rose-500/30 via-pink-400/20 to-red-500/10',
    'from-violet-500/30 via-purple-400/20 to-indigo-500/10',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return gradients[Math.abs(hash) % gradients.length]
}

function getProductIcon(name: string): string {
  const icons = ['💊', '🧬', '🏥', '⚕️', '🩺', '💉']
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return icons[Math.abs(hash) % icons.length]
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function PharmaCatalog() {
  const { t } = useLanguage()
  const headerRef = useRef<HTMLDivElement>(null)
  const [headerVisible, setHeaderVisible] = useState(false)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [visibleCards, setVisibleCards] = useState<boolean[]>(
    new Array(mockProducts.length).fill(false)
  )

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
        { threshold: 0.15, rootMargin: '0px 0px -30px 0px' }
      )
      observer.observe(el)
      observers.push(observer)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  const activeProducts = mockProducts.filter(p => p.isActive)

  return (
    <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Section Header */}
      <div
        ref={headerRef}
        className={`text-center mb-16 transition-all duration-1000 ease-out ${
          headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
          <Pill className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-primary tracking-wide uppercase">
            {t('pharma.catalog.badge')}
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
          {t('pharma.catalog.title')}
        </h2>
        <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
          {t('pharma.catalog.subtitle')}
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeProducts.map((product, idx) => (
          <div
            key={product.id}
            ref={el => { cardRefs.current[idx] = el }}
            className={`group relative bg-card border border-border rounded-3xl overflow-hidden transition-all duration-700 ease-out hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 ${
              visibleCards[idx]
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-12'
            }`}
            style={{ transitionDelay: `${(idx % 3) * 100}ms` }}
          >
            {/* Product Image / Gradient Placeholder */}
            <div
              className={`relative w-full h-52 bg-gradient-to-br ${getProductGradient(
                product.name
              )} flex items-center justify-center overflow-hidden`}
            >
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <span className="text-5xl">{getProductIcon(product.name)}</span>
                  <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest">
                    {product.location}
                  </span>
                </div>
              )}

              {/* Status badge */}
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 backdrop-blur-sm border border-emerald-500/20">
                  {t('pharma.catalog.active')}
                </span>
              </div>

              {/* Duration badge */}
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-foreground/10 text-foreground/70 backdrop-blur-sm border border-foreground/10">
                  <Calendar className="w-3 h-3" />
                  {product.duration} {t('pharma.catalog.days')}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 space-y-4">
              {/* Name + Location */}
              <div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <MapPin className="w-3.5 h-3.5 text-foreground/40" />
                  <p className="text-xs text-foreground/50">{product.location}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-foreground/70 leading-relaxed line-clamp-2">
                {product.description}
              </p>

              {/* Meta info */}
              <div className="flex items-center gap-4 text-xs text-foreground/40">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(product.createdAt)}
                </span>
              </div>

              {/* Price + Action */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-foreground/50">{t('pharma.catalog.price')}</p>
                  <p className="text-2xl font-bold text-foreground">
                    ETB {product.price.toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="p-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl transition-all duration-200 hover:scale-105">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-primary/25">
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Hover accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </div>
        ))}
      </div>
    </section>
  )
}
