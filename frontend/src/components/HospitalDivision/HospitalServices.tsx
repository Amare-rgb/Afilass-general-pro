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
  AlertCircle
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

export function HospitalServices() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    // FIX: Set mock data and stop loading immediately so the UI shows instantly
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
        console.log('API Response:', result);
        
        // Only replace mock data if API returns actual data
        if (result.success && result.data && result.data.length > 0) {
          const activeServices = result.data.filter((s: Service) => s.isActive !== false);
          if (activeServices.length > 0 && isMounted) {
            setServices(activeServices);
            setError(null);
          }
        }
      } catch (err) {
        console.log('API not available, using mock data');
        // If API fails, we do nothing. The mock data is already showing!
        if (isMounted) setError('Offline mode - showing demo services');
      }
    }

    // Start background API fetch
    fetchFromAPI();

    return () => {
      isMounted = false;
    };
  }, []);

  // If still loading (shouldn't happen after immediate set)
  if (loading) {
    return (
      <section className="bg-background py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Our Medical Services
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
      className="bg-background py-20 sm:py-24 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div
          className="text-center mb-16 transition-all duration-700 ease-out opacity-100 translate-y-0"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Our Medical Services
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Comprehensive care tailored to your health needs
          </p>
          {error && (
            <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
              ⚠️ {error}
            </p>
          )}
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service: Service, index: number) => {
            const delay = index * 100;
            const IconComponent = getIconFromName(service.name);
            const color = getColorFromName(service.name);
            const bgColor = getBgColorFromName(service.name);

            return (
              <div
                key={service.id}
                className={`bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group flex flex-col opacity-100 translate-y-0`}
                style={{ transitionDelay: `${delay}ms` }}
              >
                {/* Icon */}
                <div className={`w-14 h-14 ${bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                  <IconComponent className={`w-7 h-7 ${color}`} />
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition">
                  {service.name}
                </h3>
                <p className="text-foreground/70 text-sm flex-1 mb-4">
                  {service.description}
                </p>

                <div className="space-y-2 text-sm text-foreground/60 border-t border-border pt-4 mt-auto">
                  {service.price && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span>${service.price} per visit</span>
                    </div>
                  )}
                  {service.duration && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>{service.duration} min</span>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{service.location || 'Afilas General Hospital'}</span>
                  </div>
                </div>

                <button className="mt-6 w-full bg-primary text-primary-foreground py-2.5 rounded-full font-semibold hover:bg-primary/90 transition-colors">
                  Book Appointment
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}