// components/HospitalDivision/HospitalServices.tsx
"use client";

import { useLanguage } from "@/contexts/LanguageProvider";
import { useEffect, useRef, useState } from "react";
import { 
  Clock, 
  MapPin, 
  DollarSign, 
  Stethoscope, 
  Loader2, 
  Heart, 
  Brain, 
  Bone, 
  Shield, 
  Ambulance, 
  Users, 
  Microscope, 
  Pill, 
  Activity,
  AlertCircle,
  Search,
  X
} from "lucide-react";

// Define Service interface
interface Service {
  id: string;
  name: string;
  description: string;
  price: number | null;
  duration: number | null;
  image: string | null;
  departmentId: string | null;
  location: string;
  isActive: boolean;
  department?: {
    id: string;
    name: string;
  };
}

// Mock data - 6 services (will be displayed immediately)
const mockServices: Service[] = [
  {
    id: "mock-1",
    name: "General Consultation",
    description: "Comprehensive consultation with a specialist physician for diagnosis and treatment planning.",
    price: 50,
    duration: 30,
    image: null,
    departmentId: null,
    location: "Afilas General Hospital",
    isActive: true
  },
  {
    id: "mock-2",
    name: "Cardiac Check-up",
    description: "Full cardiac evaluation including ECG, stress test, and specialist cardiology review.",
    price: 120,
    duration: 45,
    image: null,
    departmentId: null,
    location: "Afilas General Hospital",
    isActive: true
  },
  {
    id: "mock-3",
    name: "Pediatric Wellness Visit",
    description: "Growth monitoring, developmental screening, vaccinations, and general pediatric care.",
    price: 40,
    duration: 25,
    image: null,
    departmentId: null,
    location: "Afilas General Hospital",
    isActive: true
  },
  {
    id: "mock-4",
    name: "Orthopedic Assessment",
    description: "Comprehensive bone, joint, and muscle examination with X-ray if needed.",
    price: 70,
    duration: 40,
    image: null,
    departmentId: null,
    location: "Afilas General Hospital",
    isActive: true
  },
  {
    id: "mock-5",
    name: "Neurology Consultation",
    description: "In-depth neurological examination, diagnostic testing, and treatment planning.",
    price: 90,
    duration: 50,
    image: null,
    departmentId: null,
    location: "Afilas General Hospital",
    isActive: true
  },
  {
    id: "mock-6",
    name: "Emergency Triage",
    description: "Rapid assessment and stabilisation for emergency cases with immediate care.",
    price: 30,
    duration: 20,
    image: null,
    departmentId: null,
    location: "Afilas General Hospital",
    isActive: true
  }
];

// Icon mapping based on service name
const iconMap: Record<string, any> = {
  'cardiology': Heart,
  'heart': Heart,
  'pediatrics': Users,
  'children': Users,
  'neurology': Brain,
  'brain': Brain,
  'orthopedics': Bone,
  'bone': Bone,
  'ortho': Bone,
  'oncology': Shield,
  'cancer': Shield,
  'emergency': Ambulance,
  'trauma': Ambulance,
  'imaging': Microscope,
  'scan': Microscope,
  'pharmacy': Pill,
  'medication': Pill,
  'therapy': Activity,
  'rehab': Activity,
  'general': Stethoscope,
  'consultation': Stethoscope,
};

// Custom hook for scroll‑reveal animation
function useInView(ref: React.RefObject<HTMLElement>) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return isInView;
}

// Get icon from service name
function getIconFromName(name: string) {
  const nameLower = name.toLowerCase();
  for (const [key, icon] of Object.entries(iconMap)) {
    if (nameLower.includes(key)) {
      return icon;
    }
  }
  return Stethoscope;
}

// Get color based on service name
function getColorFromName(name: string): string {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('cardiology') || nameLower.includes('heart')) return 'text-red-500';
  if (nameLower.includes('pediatrics') || nameLower.includes('children')) return 'text-blue-500';
  if (nameLower.includes('neurology') || nameLower.includes('brain')) return 'text-purple-500';
  if (nameLower.includes('orthopedics') || nameLower.includes('bone')) return 'text-green-500';
  if (nameLower.includes('oncology') || nameLower.includes('cancer')) return 'text-orange-500';
  if (nameLower.includes('emergency') || nameLower.includes('trauma')) return 'text-red-600';
  if (nameLower.includes('imaging') || nameLower.includes('scan')) return 'text-cyan-500';
  if (nameLower.includes('pharmacy') || nameLower.includes('medication')) return 'text-teal-500';
  if (nameLower.includes('therapy') || nameLower.includes('rehab')) return 'text-indigo-500';
  return 'text-primary';
}

// Get background color based on service name
function getBgColorFromName(name: string): string {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('cardiology') || nameLower.includes('heart')) return 'bg-red-100 dark:bg-red-950/30';
  if (nameLower.includes('pediatrics') || nameLower.includes('children')) return 'bg-blue-100 dark:bg-blue-950/30';
  if (nameLower.includes('neurology') || nameLower.includes('brain')) return 'bg-purple-100 dark:bg-purple-950/30';
  if (nameLower.includes('orthopedics') || nameLower.includes('bone')) return 'bg-green-100 dark:bg-green-950/30';
  if (nameLower.includes('oncology') || nameLower.includes('cancer')) return 'bg-orange-100 dark:bg-orange-950/30';
  if (nameLower.includes('emergency') || nameLower.includes('trauma')) return 'bg-red-100 dark:bg-red-950/30';
  if (nameLower.includes('imaging') || nameLower.includes('scan')) return 'bg-cyan-100 dark:bg-cyan-950/30';
  if (nameLower.includes('pharmacy') || nameLower.includes('medication')) return 'bg-teal-100 dark:bg-teal-950/30';
  if (nameLower.includes('therapy') || nameLower.includes('rehab')) return 'bg-indigo-100 dark:bg-indigo-950/30';
  return 'bg-primary/10';
}

export function HospitalServices({ 
  showHeader = true,
  searchPlaceholder 
}: { 
  showHeader?: boolean;
  searchPlaceholder?: string;
}) {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;

    // Set mock data and stop loading immediately so the UI shows instantly
    setServices(mockServices);
    setLoading(false);

    // Try to fetch from API in background to replace mock data
    async function fetchFromAPI() {
      try {
        const response = await fetch('http://localhost:5000/api/services?location=Afilas%20General%20Hospital');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
          const activeServices = result.data.filter((s: Service) => s.isActive !== false);
          if (activeServices.length > 0 && isMounted) {
            setServices(activeServices);
            setError(null);
          }
        }
      } catch (err) {
        console.log('API not available, using mock data');
        if (isMounted) setError('Offline mode - showing demo services');
      }
    }

    fetchFromAPI();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter services on frontend by name or description
  const filteredServices = services.filter((service) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      service.name.toLowerCase().includes(query) ||
      (service.description && service.description.toLowerCase().includes(query))
    );
  });

  if (loading) {
    return (
      <section className="bg-background py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t("services.hero.title") || "Our Medical Services"}
          </h2>
          <div className="flex justify-center items-center space-x-2 mt-8">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <p className="text-foreground/70 mt-4">Loading medical services...</p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="bg-background py-12 sm:py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header (Optional) */}
        {showHeader && (
          <div className="text-center mb-10 transition-all duration-700 ease-out opacity-100 translate-y-0">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {t("hospital.sec_services.title")}
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              {t("hospital.sec_services.subtitle")}
            </p>
            {error && (
              <p className="text-sm text-amber-600 dark:text-amber-400 mt-2 flex items-center justify-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </p>
            )}
          </div>
        )}

        {/* Search Bar Component */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative flex items-center">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground">
              <Search className="w-5 h-5 text-primary" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder || t("services.search.placeholder")}
              className="w-full pl-11 pr-12 py-3.5 sm:py-4 bg-card border border-border rounded-2xl shadow-sm text-foreground text-sm sm:text-base placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                aria-label={t("services.search.clear")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5 bg-muted/60 p-1 rounded-full hover:bg-muted" />
              </button>
            )}
          </div>

          {/* Search Result Counter / Metadata */}
          <div className="flex items-center justify-between mt-3 px-2 text-xs sm:text-sm text-muted-foreground">
            {searchQuery ? (
              <span>
                {filteredServices.length} {t("services.search.results_count")}
              </span>
            ) : (
              <span>{t("services.search.showing_all")} ({services.length})</span>
            )}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-primary hover:underline font-medium text-xs"
              >
                {t("services.search.clear")}
              </button>
            )}
          </div>
        </div>

        {/* Empty State when Search has no results */}
        {filteredServices.length === 0 ? (
          <div className="bg-card border border-border rounded-2xl p-8 sm:p-12 text-center max-w-xl mx-auto my-8 shadow-sm">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {t("services.search.no_results")}
            </h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto leading-relaxed">
              {t("services.search.no_results_desc")}
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-full hover:bg-primary/90 transition-colors shadow-md"
            >
              {t("services.search.clear")}
            </button>
          </div>
        ) : (
          /* Services Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredServices.map((service: Service, index: number) => {
              const delay = (index % 6) * 100;
              const IconComponent = getIconFromName(service.name);
              const color = getColorFromName(service.name);
              const bgColor = getBgColorFromName(service.name);

              return (
                <div
                  key={service.id}
                  className="bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between"
                  style={{ transitionDelay: `${delay}ms` }}
                >
                  <div>
                    {/* Icon & Category Tag */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-14 h-14 ${bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className={`w-7 h-7 ${color}`} />
                      </div>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                        {service.department?.name || "Specialties"}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>

                  <div>
                    <div className="space-y-2 text-sm text-muted-foreground border-t border-border/80 pt-4 mt-auto">
                      {service.price && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-primary shrink-0" />
                          <span>ETB {service.price}</span>
                        </div>
                      )}
                      {service.duration && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary shrink-0" />
                          <span>{service.duration} {t("hospital.sec_services.min_unit")}</span>
                        </div>
                      )}
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{service.location || t("hospital.sec_services.default_location")}</span>
                      </div>
                    </div>

                    <button className="mt-6 w-full bg-primary text-primary-foreground py-3 px-4 rounded-xl font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm">
                      {t("hospital.sec_services.book_btn")}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}