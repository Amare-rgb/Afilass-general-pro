'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageProvider';
import { Loader2, AlertCircle } from 'lucide-react';

interface PharmaService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration?: number;
  image?: string | null;
  isActive?: boolean;
  location?: string;
}

export function PharmaCatalog() {
  const { t } = useLanguage();
  const [services, setServices] = useState<PharmaService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageFailed, setImageFailed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isMounted = true;

    async function fetchServices() {
      try {
        setLoading(true);
        const response = await fetch(
          'http://localhost:5000/api/services?location=Afilas%20Drug%20Manufacturing'
        );
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const result = await response.json();

        if (result.success && Array.isArray(result.data) && result.data.length > 0) {
          const active = result.data.filter((s: any) => s.isActive !== false);
          if (active.length > 0 && isMounted) {
            setServices(active.slice(0, 4));
            setError(null);
          } else if (isMounted) {
            setServices(getFallbackServices());
          }
        } else if (isMounted) {
          setServices(getFallbackServices());
        }
      } catch (err) {
        if (isMounted) {
          setServices(getFallbackServices());
          setError('Offline mode - displaying featured manufacturing services');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchServices();
    return () => {
      isMounted = false;
    };
  }, []);

function getAppointmentLink(service: PharmaService) {
  const loc = service.location || 'Afilas Drug Manufacturing';
  let basePath = '/appointments/hospital';
  if (loc === 'Afilas Diagnosis Center') {
    basePath = '/appointments/diagnosis';
  } else if (loc === 'Afilas Drug Manufacturing') {
    basePath = '/appointments/pharma';
  }
  const param = service.name ? `${service.name} - ${loc}` : loc;
  return `${basePath}?${encodeURIComponent(param)}`;
}

  function getFallbackServices(): PharmaService[] {
    return [
      {
        id: 'fallback-pharma-1',
        name: 'Amoxicillin 500mg Capsules',
        description: 'Broad-spectrum antibiotic formulation for systemic bacterial infection treatment. Produced under strict GMP guidelines.',
        price: 280,
        duration: 30,
        location: 'Afilas Drug Manufacturing',
        image: null,
        isActive: true,
      },
      {
        id: 'fallback-pharma-2',
        name: 'Metformin 850mg Tablets',
        description: 'First-line metabolic therapy for blood glucose management. High-purity oral solid dosage form.',
        price: 450,
        duration: 60,
        location: 'Afilas Drug Manufacturing',
        image: null,
        isActive: true,
      },
      {
        id: 'fallback-pharma-3',
        name: 'Paracetamol 500mg Tablets',
        description: 'Analgesic and antipyretic formulation for pain management and fever reduction. ISO certified.',
        price: 120,
        duration: 30,
        location: 'Afilas Drug Manufacturing',
        image: null,
        isActive: true,
      },
      {
        id: 'fallback-pharma-4',
        name: 'Omeprazole 20mg Capsules',
        description: 'Proton pump inhibitor for gastrointestinal acidity and peptic ulcer therapeutic care.',
        price: 350,
        duration: 30,
        location: 'Afilas Drug Manufacturing',
        image: null,
        isActive: true,
      },
    ];
  }

  return (
    <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold tracking-widest text-primary uppercase bg-primary/10 px-4 py-1.5 rounded-full">
          {t('pharma.catalog.badge')}
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mt-4 mb-3">
          {t('pharma.catalog.title')}
        </h2>
        <p className="text-muted-foreground text-base sm:text-lg">
          {t('pharma.catalog.subtitle')}
        </p>
        {error && (
          <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2 flex items-center justify-center gap-1">
            <AlertCircle className="w-4 h-4" /> {error}
          </p>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      ) : (
        <>
          {/* Services Cards (Max 4, split layout per card) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {services.slice(0, 4).map((service) => {
              const photoUrl = service.image
                ? /^https?:\/\//i.test(service.image)
                  ? service.image
                  : `http://localhost:5000/${service.image.replace(/^\/+/, '')}`
                : null;

              return (
                <div
                  key={service.id}
                  className="bg-card border border-border rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-stretch gap-6 shadow-xl hover:shadow-2xl hover:border-primary/30 transition-all duration-300 group"
                >
                  {/* Left Column: Product Image Card Container */}
                  <div className="relative w-full sm:w-48 sm:h-auto aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-teal-500/5 to-emerald-500/10 border border-border flex-shrink-0 flex items-center justify-center shadow-md">
                    {photoUrl && !imageFailed[service.id] ? (
                      <Image
                        src={photoUrl}
                        alt={service.name}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500 rounded-2xl"
                        onError={() =>
                          setImageFailed((prev) => ({ ...prev, [service.id]: true }))
                        }
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-primary/15 via-teal-500/10 to-emerald-500/20">
                        <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center mb-2">
                          <span className="text-xs font-bold text-primary uppercase">GMP</span>
                        </div>
                        <span className="text-[11px] font-bold text-foreground/50 uppercase tracking-wider line-clamp-1">
                          {service.location || 'Afilas Pharma'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Details & Book Action */}
                  <div className="flex-1 flex flex-col justify-between w-full">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <h3 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {service.name}
                        </h3>
                      </div>

                      {/* Location Badge */}
                      <p className="text-xs font-semibold text-primary/80 uppercase tracking-wider mb-3">
                        {service.location || 'Afilas Drug Manufacturing'}
                      </p>

                      {/* Price Display */}
                      <div className="mb-3">
                        <span className="text-xs text-muted-foreground block mb-0.5">
                          {t('pharma.catalog.price')}
                        </span>
                        <span className="text-2xl sm:text-3xl font-black text-primary">
                          ETB {Number(service.price).toLocaleString()}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                        {service.description}
                      </p>
                    </div>

                    {/* Book / Get Button linking dynamically based on location */}
                    <div className="pt-4 border-t border-border/60">
                      <Link
                        href={getAppointmentLink(service)}
                        className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        {t('pharma.catalog.book_btn')}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View All Services Button */}
          <div className="text-center mt-12">
            <Link
              href="/services?location=Afilas%20Drug%20Manufacturing"
              className="inline-flex items-center gap-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-2.5 font-medium transition-colors duration-300"
            >
              <span>{t('pharma.catalog.view_all_btn')}</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </>
      )}

      {!loading && services.length === 0 && !error && (
        <p className="text-center text-muted-foreground py-8">
          No services available at the moment.
        </p>
      )}
    </section>
  );
}

