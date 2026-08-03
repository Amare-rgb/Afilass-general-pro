'use client'

import { useLanguage } from '@/contexts/LanguageProvider'
import { useEffect, useRef, useState } from 'react'
import { ShoppingCart, MapPin, Calendar, Eye, Pill, PackageX, Loader2, RefreshCw } from 'lucide-react'
import { medicalServicesApi, MedicalService } from '@/lib/medicalServices'

const LOCATION = 'Afilas Drug Manufacturing'

function getProductGradient(name: string = ''): string {
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

function getProductIcon(name: string = ''): string {
  const icons = ['💊', '🧬', '🏥', '⚕️', '🩺', '💉']
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return icons[Math.abs(hash) % icons.length]
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

export function PharmaCatalog() {
  const { t } = useLanguage()
  const [products, setProducts] = useState<MedicalService[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const headerRef = useRef<HTMLDivElement>(null)
  const [headerVisible, setHeaderVisible] = useState(false)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [visibleCards, setVisibleCards] = useState<boolean[]>([])

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await medicalServicesApi.getAllServices(LOCATION)
      setProducts(data)
      setVisibleCards(new Array(data.length).fill(false))
    } catch (err) {
      console.error('Failed to fetch services:', err)
      setError('Failed to fetch services')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

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
    if (products.length === 0) return
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
  }, [products])

  const activeProducts = products.filter(p => p.isActive !== false)

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
            {t('pharma.catalog.badge') || 'Our Products'}
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
          {t('pharma.catalog.title') || 'Pharmaceutical Products'}
        </h2>
        <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
          {t('pharma.catalog.subtitle') ||
            'Quality-assured medicines manufactured locally under GMP standards — available for institutional and retail distribution.'}
        </p>
      </div>

      {/* Loading Skeleton State */}
      {loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="bg-card border border-border rounded-3xl overflow-hidden animate-pulse p-6 space-y-4"
            >
              <div className="w-full h-48 bg-muted rounded-2xl" />
              <div className="h-6 bg-muted rounded-md w-3/4" />
              <div className="h-4 bg-muted rounded-md w-1/2" />
              <div className="h-12 bg-muted rounded-md w-full" />
            </div>
          ))}
        </div>
      )}

      {/* No Services Yet / Error State */}
      {!loading && (activeProducts.length === 0 || error) && (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card border border-border rounded-3xl max-w-xl mx-auto shadow-sm my-8 transition-all">
          <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 text-primary">
            <PackageX className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-3">
            {t('pharma.catalog.empty_title') || 'No services yet'}
          </h3>
          <p className="text-foreground/70 text-base max-w-md leading-relaxed mb-6">
            {t('pharma.catalog.empty_desc') ||
              'We are currently updating our pharmaceutical service catalog for Afilas Drug Manufacturing. Please check back soon or submit a B2B inquiry.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={fetchProducts}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-background hover:bg-muted text-foreground text-sm font-semibold transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <a
              href="#b2b-inquiry"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:shadow-md transition-all"
            >
              Request B2B Quote
            </a>
          </div>
        </div>
      )}

      {/* Active Products Grid */}
      {!loading && activeProducts.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeProducts.map((product, idx) => {
            const productName = product.name || product.title || 'Pharmaceutical Product'
            const productLocation = product.location || LOCATION

            return (
              <div
                key={product.id}
                ref={el => {
                  cardRefs.current[idx] = el
                }}
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
                    productName
                  )} flex items-center justify-center overflow-hidden`}
                >
                  {product.image ? (
                    <img
                      src={
                        product.image.startsWith('http')
                          ? product.image
                          : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${
                              product.image.startsWith('/') ? '' : '/'
                            }${product.image}`
                      }
                      alt={productName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <span className="text-5xl">{getProductIcon(productName)}</span>
                      <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest">
                        {productLocation}
                      </span>
                    </div>
                  )}

                  {/* Status badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 backdrop-blur-sm border border-emerald-500/20">
                      {t('pharma.catalog.active') || 'Active'}
                    </span>
                  </div>

                  {/* Duration badge */}
                  {product.duration && (
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-foreground/10 text-foreground/70 backdrop-blur-sm border border-foreground/10">
                        <Calendar className="w-3 h-3" />
                        {product.duration} {t('pharma.catalog.days') || 'days'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-4">
                  {/* Name + Location */}
                  <div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {productName}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <MapPin className="w-3.5 h-3.5 text-foreground/40" />
                      <p className="text-xs text-foreground/50">{productLocation}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-foreground/70 leading-relaxed line-clamp-2">
                    {product.description}
                  </p>

                  {/* Meta info */}
                  {product.createdAt && (
                    <div className="flex items-center gap-4 text-xs text-foreground/40">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(product.createdAt)}
                      </span>
                    </div>
                  )}

                  {/* Price + Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <p className="text-xs text-foreground/50">{t('pharma.catalog.price') || 'Price'}</p>
                      <p className="text-2xl font-bold text-foreground">
                        {product.price != null
                          ? `ETB ${product.price.toLocaleString()}`
                          : 'Quote Required'}
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
            )
          })}
        </div>
      )}
    </section>
  )
}
