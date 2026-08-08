"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { DiagnosticsHero } from '@/components/DiagnosticsHero';
import { useLanguage } from '@/contexts/LanguageProvider';
import { 
  ChevronDown, 
  CheckCircle2, 
  FileText, 
  Clock, 
  AlertCircle, 
  UserCheck,
  Loader2,
  MapPin
} from 'lucide-react';

export default function DiagnosticsPage() {
  const { t } = useLanguage();

  // Tab State
  const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0);
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  // Services State
  const [services, setServices] = useState<any[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState<string | null>(null);

  // Doctors State
  const [doctors, setDoctors] = useState<any[]>([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [doctorsError, setDoctorsError] = useState<string | null>(null);
  const [docImageFailed, setDocImageFailed] = useState<Record<string, boolean>>({});

  // 1. Fetch Services
  useEffect(() => {
    let isMounted = true;

    async function fetchServices() {
      try {
        const response = await fetch('http://localhost:5000/api/services?location=Afilas%20Diagnosis%20Center');
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const result = await response.json();
        if (result.success && result.data && result.data.length > 0) {
          const active = result.data.filter((s: any) => s.isActive !== false);
          if (active.length > 0 && isMounted) {
            setServices(active.slice(0, 4));
            setServicesError(null);
          }
        }
      } catch (err) {
        if (isMounted) {
          setServices(getFallbackServices());
          setServicesError('Offline mode - showing demo services');
        }
      } finally {
        if (isMounted) setServicesLoading(false);
      }
    }

    fetchServices();
    return () => { isMounted = false; };
  }, []);

  function getFallbackServices() {
    return [
      {
        id: 'fallback-1',
        name: 'Full Body Diagnostic Panel',
        description: 'Complete analysis covering lipid, liver, and renal functions.',
        price: 80,
        duration: 20,
        location: 'Afilas Diagnosis Center',
        isActive: true,
      },
      {
        id: 'fallback-2',
        name: '3T MRI Scan',
        description: 'High-precision non-invasive structural imaging.',
        price: 200,
        duration: 45,
        location: 'Afilas Diagnosis Center',
        isActive: true,
      },
      {
        id: 'fallback-3',
        name: '2D Echocardiogram',
        description: 'Ultrasound screening for cardiac structure and valves.',
        price: 110,
        duration: 30,
        location: 'Afilas Diagnosis Center',
        isActive: true,
      },
      {
        id: 'fallback-4',
        name: 'Digital X-Ray (PA View)',
        description: 'Low-radiation chest and musculoskeletal radiology.',
        price: 35,
        duration: 15,
        location: 'Afilas Diagnosis Center',
        isActive: true,
      },
    ];
  }

  // 2. Fetch Doctors
  useEffect(() => {
    let isMounted = true;

    async function fetchDoctors() {
      try {
        setDoctorsLoading(true);
        const res = await fetch('http://localhost:5000/api/doctors');
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const json = await res.json();

        let apiDoctors = [];
        if (json.success && Array.isArray(json.data)) apiDoctors = json.data;
        else if (Array.isArray(json)) apiDoctors = json;

        if (apiDoctors.length > 0 && isMounted) {
          const formatted = apiDoctors.map((doc: any) => {
            let photoUrl: string | null = null;
            const rawImage = doc.image || doc.photoUrl || null;
            if (rawImage) {
              if (/^https?:\/\//i.test(rawImage)) {
                photoUrl = rawImage;
              } else {
                const clean = rawImage.replace(/^\/+/, '');
                photoUrl = `http://localhost:5000/${clean}`;
              }
            }
            return {
              id: doc.id,
              name: doc.user ? `Dr. ${doc.user.firstName} ${doc.user.lastName}` : doc.name || "Doctor",
              title: doc.specialization || doc.title || "Specialist",
              bio: doc.bio || "Experienced diagnostic consultant.",
              photoUrl,
              specialization: doc.specialization || "General",
              experience: doc.experience || 0,
              location: doc.location || "Afilas Diagnosis Center",
              availability: doc.availability || "Mon - Fri",
            };
          });
          setDoctors(formatted.slice(0, 4));
          setDoctorsError(null);
        }
      } catch (err) {
        if (isMounted) {
          setDoctors([
            {
              id: "mock-1",
              name: "Dr. Amanuel Kebede",
              title: "Senior Radiologist",
              bio: "Specializing in advanced imaging and structural MRI diagnostics.",
              photoUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
              experience: 15,
              location: "Afilas Diagnosis Center",
              availability: "Mon, Wed, Fri",
            },
            {
              id: "mock-2",
              name: "Dr. Selam Tesfaye",
              title: "Consultant Pathologist",
              bio: "Expert in hematology and clinical biomarker analytics.",
              photoUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
              experience: 12,
              location: "Afilas Diagnosis Center",
              availability: "Tue, Thu, Sat",
            }
          ]);
          setDoctorsError('Offline - showing demo specialists');
        }
      } finally {
        if (isMounted) setDoctorsLoading(false);
      }
    }

    fetchDoctors();
    return () => { isMounted = false; };
  }, []);

  const packages = [
    {
      id: 'executive',
      name: t("diagnostics.packages.executive.name"),
      tag: t("diagnostics.packages.executive.tag"),
      bestFor: t("diagnostics.packages.executive.best_for"),
      sections: [
        {
          title: t("diagnostics.packages.executive.sec1_title"),
          tests: [
            t("diagnostics.packages.executive.sec1_t1"),
            t("diagnostics.packages.executive.sec1_t2"),
            t("diagnostics.packages.executive.sec1_t3")
          ]
        },
        {
          title: t("diagnostics.packages.executive.sec2_title"),
          tests: [
            t("diagnostics.packages.executive.sec2_t1"),
            t("diagnostics.packages.executive.sec2_t2"),
            t("diagnostics.packages.executive.sec2_t3")
          ]
        },
        {
          title: t("diagnostics.packages.executive.sec3_title"),
          tests: [
            t("diagnostics.packages.executive.sec3_t1"),
            t("diagnostics.packages.executive.sec3_t2"),
            t("diagnostics.packages.executive.sec3_t3")
          ]
        }
      ],
      consultation: t("diagnostics.packages.executive.consultation"),
      primaryCta: t("diagnostics.packages.executive.primary_cta")
    },
    {
      id: 'diabetic',
      name: t("diagnostics.packages.diabetic.name"),
      tag: t("diagnostics.packages.diabetic.tag"),
      bestFor: t("diagnostics.packages.diabetic.best_for"),
      sections: [
        {
          title: t("diagnostics.packages.diabetic.sec1_title"),
          tests: [
            t("diagnostics.packages.diabetic.sec1_t1"),
            t("diagnostics.packages.diabetic.sec1_t2"),
            t("diagnostics.packages.diabetic.sec1_t3")
          ]
        },
        {
          title: t("diagnostics.packages.diabetic.sec2_title"),
          tests: [
            t("diagnostics.packages.diabetic.sec2_t1"),
            t("diagnostics.packages.diabetic.sec2_t2")
          ]
        },
        {
          title: t("diagnostics.packages.diabetic.sec3_title"),
          tests: [
            t("diagnostics.packages.diabetic.sec3_t1"),
            t("diagnostics.packages.diabetic.sec3_t2"),
            t("diagnostics.packages.diabetic.sec3_t3")
          ]
        }
      ],
      consultation: t("diagnostics.packages.diabetic.consultation"),
      primaryCta: t("diagnostics.packages.diabetic.primary_cta")
    },
    {
      id: 'cardiac',
      name: t("diagnostics.packages.cardiac.name"),
      tag: t("diagnostics.packages.cardiac.tag"),
      bestFor: t("diagnostics.packages.cardiac.best_for"),
      sections: [
        {
          title: t("diagnostics.packages.cardiac.sec1_title"),
          tests: [
            t("diagnostics.packages.cardiac.sec1_t1"),
            t("diagnostics.packages.cardiac.sec1_t2"),
            t("diagnostics.packages.cardiac.sec1_t3"),
            t("diagnostics.packages.cardiac.sec1_t4")
          ]
        },
        {
          title: t("diagnostics.packages.cardiac.sec2_title"),
          tests: [
            t("diagnostics.packages.cardiac.sec2_t1"),
            t("diagnostics.packages.cardiac.sec2_t2"),
            t("diagnostics.packages.cardiac.sec2_t3"),
            t("diagnostics.packages.cardiac.sec2_t4")
          ]
        }
      ],
      consultation: t("diagnostics.packages.cardiac.consultation"),
      primaryCta: t("diagnostics.packages.cardiac.primary_cta")
    }
  ];

  const accordionItems = [
    {
      title: t("diagnostics.prep.fasting.title"),
      icon: Clock,
      content: t("diagnostics.prep.fasting.content")
    },
    {
      title: t("diagnostics.prep.medication.title"),
      icon: AlertCircle,
      content: t("diagnostics.prep.medication.content")
    },
    {
      title: t("diagnostics.prep.cardiac_footwear.title"),
      icon: CheckCircle2,
      content: t("diagnostics.prep.cardiac_footwear.content")
    }
  ];

  return (
    <>
      <Header />
      <main className="bg-background text-foreground min-h-screen">
        <DiagnosticsHero />

        {/* Health Packages Section */}
        <section id="packages" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-widest text-primary uppercase bg-primary/10 px-4 py-1.5 rounded-full">
              {t("diagnostics.packages.badge")}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4 mb-3">
              {t("diagnostics.packages.section_title")}
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg">
              {t("diagnostics.packages.section_subtitle")}
            </p>
          </div>

          <div className="w-full max-w-7xl mx-auto bg-slate-200/60 dark:bg-slate-800/60 border-[12px] border-slate-200/80 dark:border-slate-800/80 p-0 rounded-[44px] shadow-2xl overflow-hidden">
            <div className="grid lg:grid-cols-12 min-h-[650px]">
              
              {/* Left Column: Vertical Tabs */}
              <div className="lg:col-span-3 bg-slate-300/80 dark:bg-slate-900/80 pt-8 pb-8 flex flex-col justify-start space-y-3 relative">
                {packages.map((pkg, idx) => {
                  const isActive = activeTab === idx;
                  return (
                    <button
                      key={pkg.id}
                      onClick={() => setActiveTab(idx as 0 | 1 | 2)}
                      className={`relative w-full text-right pr-8 py-6 text-sm sm:text-base font-extrabold tracking-wider transition-all duration-300 select-none ${
                        isActive
                          ? 'bg-card text-primary font-black z-10 tab-active-top-curve tab-active-bottom-curve shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-foreground opacity-70 hover:opacity-100'
                      }`}
                    >
                      {pkg.name}
                    </button>
                  );
                })}
              </div>

              {/* Right Column: Tab Content */}
              <div className="lg:col-span-9 bg-card p-8 sm:p-12 flex flex-col justify-between overflow-y-auto min-h-[650px]">
                <div key={activeTab} className="space-y-8 animate-fadeInUp">
                  <div className="border-b border-border pb-6">
                    <div className="flex flex-wrap justify-between items-center gap-4 mb-3">
                      <h3 className="text-3xl font-bold text-foreground">
                        {packages[activeTab].name}
                      </h3>
                      <span className="text-xs font-semibold bg-primary/10 text-primary px-4 py-1.5 rounded-full">
                        {packages[activeTab].tag}
                      </span>
                    </div>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">{t("diagnostics.packages.best_for_label")} </strong> 
                      {packages[activeTab].bestFor}
                    </p>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      {t("diagnostics.packages.included_tests_heading")}
                    </h4>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {packages[activeTab].sections.map((sec, i) => (
                        <div key={i} className="bg-muted/40 p-5 rounded-2xl border border-border/80 flex flex-col justify-start">
                          <h5 className="font-bold text-primary text-base mb-3">{sec.title}</h5>
                          <ul className="space-y-2.5 text-xs sm:text-sm text-muted-foreground">
                            {sec.tests.map((test, tIdx) => (
                              <li key={tIdx} className="flex items-start gap-2 leading-relaxed">
                                <span className="text-primary font-bold mt-0.5">•</span>
                                <span>{test}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-primary/5 rounded-2xl p-5 border border-primary/20 text-sm text-foreground flex items-center gap-4">
                    <UserCheck className="w-6 h-6 text-primary flex-shrink-0" />
                    <span>
                      <strong>{t("diagnostics.packages.consultation_label")}</strong> {packages[activeTab].consultation}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-4 border-t border-border">
                    <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs sm:text-sm uppercase tracking-wider px-8 py-3.5 rounded-xl transition-colors shadow-md">
                      {packages[activeTab].primaryCta}
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Patient Preparation Guidelines Accordion */}
        <section className="bg-card border-y border-border py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                {t("diagnostics.prep.title")}
              </h2>
              <p className="text-muted-foreground mt-2 text-sm">
                {t("diagnostics.prep.subtitle")}
              </p>
            </div>

            <div className="space-y-4">
              {accordionItems.map((item, index) => {
                const Icon = item.icon;
                const isOpen = openAccordion === index;
                return (
                  <div 
                    key={index} 
                    className="border border-border rounded-xl bg-background overflow-hidden transition-all duration-300"
                  >
                    <button
                      onClick={() => setOpenAccordion(isOpen ? null : index)}
                      className="w-full flex justify-between items-center p-5 text-left font-semibold text-foreground hover:bg-muted/50 transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-primary" /> {item.title}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-300 ease-in-out ${
                          isOpen ? 'rotate-180 text-primary' : 'text-muted-foreground'
                        }`}
                      />
                    </button>
                    
                    <div 
                      className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="p-5 pt-0 text-sm text-muted-foreground border-t border-border/50 bg-muted/20">
                          <p className="pt-3 leading-relaxed">
                            {item.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ==========================================================================
           Copied Section 1: MEDICAL SERVICES
           ========================================================================== */}
        <section id="services" className="border-t border-border/50 py-16 sm:py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                {t("hospital.sec_services.title")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t("hospital.sec_services.subtitle")}
              </p>
              {servicesError && (
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2 flex items-center justify-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {servicesError}
                </p>
              )}
            </div>

            {servicesLoading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="bg-card border border-border rounded-xl p-5 flex flex-col sm:flex-row gap-4 hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="sm:w-1/3">
                        <h3 className="font-bold text-foreground text-lg leading-tight">
                          {service.name}
                        </h3>
                      </div>

                      <div className="hidden sm:block w-px bg-border self-stretch mx-2" style={{ height: 'auto', minHeight: '3rem' }} />

                      <div className="flex-1 flex flex-col gap-1 text-sm">
                        <p className="text-muted-foreground line-clamp-2">{service.description}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-muted-foreground">
                          {service.price && (
                            <span>{t("hospital.sec_services.price_label")} {service.price}</span>
                          )}
                          {service.duration && (
                            <span>{t("hospital.sec_services.duration_label")} {service.duration} {t("hospital.sec_services.min_unit")}</span>
                          )}
                          <span>{t("hospital.sec_services.location_label")} {service.location || t("hospital.sec_services.default_location")}</span>
                        </div>
                        <button className="mt-2 self-start bg-primary text-primary-foreground px-5 py-1.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors">
                          {t("hospital.sec_services.book_btn")}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-10">
                  <Link
                    href="/services"
                    className="inline-flex items-center gap-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-2.5 font-medium transition-colors duration-300"
                  >
                    <span>{t("hospital.sec_services.view_all_btn")}</span>
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

            {!servicesLoading && services.length === 0 && !servicesError && (
              <p className="text-center text-muted-foreground py-8">{t("hospital.sec_services.empty_msg")}</p>
            )}
          </div>
        </section>

        {/* ==========================================================================
           Copied Section 2: DOCTOR SECTION
           ========================================================================== */}
        <section id="doctors" className="border-t border-border/50 py-16 sm:py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                {t("hospital.sec_doc.title")}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {t("hospital.sec_doc.subtitle")}
              </p>
              {doctorsError && (
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2 flex items-center justify-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {doctorsError}
                </p>
              )}
            </div>

            {doctorsLoading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className="bg-card border border-border rounded-none overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
                    >
                      <div className="pt-10 px-6 flex justify-center">
                        <div className="relative w-48 h-48 rounded-full overflow-hidden bg-muted border-2 border-primary/20">
                          {doctor.photoUrl && !docImageFailed[doctor.id] ? (
                            <Image
                              src={doctor.photoUrl}
                              alt={doctor.name}
                              fill
                              unoptimized
                              className="object-cover"
                              onError={() => setDocImageFailed((prev) => ({ ...prev, [doctor.id]: true }))}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-primary/30 bg-muted">
                              {doctor.name.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-foreground text-center">
                          {doctor.name}
                        </h3>
                        <p className="text-base font-semibold text-primary text-center">
                          {doctor.title}
                        </p>

                        <div className="grid grid-cols-2 gap-2 mt-4 border-t border-b border-border/50 py-4">
                          <div className="text-center">
                            <span className="block text-[10px] font-bold text-foreground/60 uppercase tracking-wider">{t("hospital.sec_doc.experience_label")}</span>
                            <span className="block text-base font-bold text-foreground">{doctor.experience}{t("hospital.sec_doc.yrs_suffix")}</span>
                          </div>
                          <div className="text-center border-l border-border/50">
                            <span className="block text-[10px] font-bold text-foreground/60 uppercase tracking-wider">{t("hospital.sec_doc.available_label")}</span>
                            <span className="block text-base font-bold text-foreground">{doctor.availability}</span>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground leading-relaxed mt-3 line-clamp-2">
                          {doctor.bio}
                        </p>

                        <div className="flex items-center gap-1 mt-auto pt-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 shrink-0" />
                          <span>{doctor.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-12">
                  <Link
                    href="/doctors"
                    className="inline-flex items-center gap-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-2.5 font-medium transition-colors duration-300"
                  >
                    <span>{t("hospital.sec_doc.view_all_btn")}</span>
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

            {!doctorsLoading && doctors.length === 0 && !doctorsError && (
              <p className="text-center text-muted-foreground py-8">{t("hospital.sec_doc.empty_msg")}</p>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}