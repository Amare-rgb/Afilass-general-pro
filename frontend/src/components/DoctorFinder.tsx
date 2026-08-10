// components/DoctorFinder.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageProvider";
import {
  Mail, Phone, Star, MapPin, Search, ChevronDown, Loader2, Calendar
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// ============================================================
// TYPES (Based on your Backend API)
// ============================================================
interface BackendDoctor {
  id: string;
  userId: string;
  specialization: string;
  experience: number;
  education: string;
  bio: string;
  consultationFee: number;
  rating: number;
  isAvailable: boolean;
  location: string;
  image: string | null;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

// ============================================================
// FALLBACK MOCK DATA (If the API fails or is offline)
// ============================================================
const mockDoctors = [
  {
    id: "1",
    name: "Dr. Amanuel Kebede",
    title: "Senior Cardiologist",
    bio: "Specializing in interventional cardiology with over 15 years of experience in treating complex heart conditions.",
    photoUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
    active: true,
    email: "amanuel.k@afilas.com",
    phone: "+251 911 234 567",
    specialization: "Cardiology",
    experience: 15,
    education: "MD, Fellowship in Interventional Cardiology",
    rating: 4.8,
    consultationFee: 1500,
    location: "Afilas General Hospital",
    availability: "Mon, Wed, Fri",
  },
  {
    id: "2",
    name: "Dr. Selam Tesfaye",
    title: "Endocrinologist",
    bio: "Expert in diabetes management and metabolic health.",
    photoUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    active: true,
    email: "selam.t@afilas.com",
    phone: "+251 922 345 678",
    specialization: "Endocrinology",
    experience: 12,
    education: "MD, Fellowship in Endocrinology",
    rating: 4.9,
    consultationFee: 1200,
    location: "Afilas General Hospital",
    availability: "Tue, Thu, Sat",
  },
  {
    id: "3",
    name: "Dr. Yonas Hailemariam",
    title: "Orthopedic Surgeon",
    bio: "Performing joint replacements and sports medicine procedures.",
    photoUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face",
    active: true,
    email: "yonas.h@afilas.com",
    phone: "+251 933 456 789",
    specialization: "Orthopedics",
    experience: 18,
    education: "MD, Fellowship in Orthopedic Surgery",
    rating: 4.7,
    consultationFee: 2000,
    location: "Afilas General Hospital",
    availability: "Mon, Wed, Fri",
  },
  {
    id: "4",
    name: "Dr. Meron Assefa",
    title: "Pediatrician",
    bio: "Providing comprehensive care from infancy through adolescence.",
    photoUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face",
    active: true,
    email: "meron.a@afilas.com",
    phone: "+251 944 567 890",
    specialization: "Pediatrics",
    experience: 10,
    education: "MD, Fellowship in Pediatrics",
    rating: 4.9,
    consultationFee: 1000,
    location: "Afilas General Hospital",
    availability: "Mon, Tue, Thu, Fri",
  },
  {
    id: "5",
    name: "Dr. Dawit Girma",
    title: "Neurologist",
    bio: "Specializing in neurological disorders and stroke management.",
    photoUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    active: true,
    email: "dawit.g@afilas.com",
    phone: "+251 955 678 901",
    specialization: "Neurology",
    experience: 14,
    education: "MD, Fellowship in Neurology",
    rating: 4.6,
    consultationFee: 1800,
    location: "Afilas Diagnosis Center",
    availability: "Tue, Thu, Sat",
  },
  {
    id: "6",
    name: "Dr. Sara Mohammed",
    title: "Obstetrician & Gynecologist",
    bio: "Providing comprehensive women's health services.",
    photoUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face",
    active: true,
    email: "sara.m@afilas.com",
    phone: "+251 966 789 012",
    specialization: "Obstetrics & Gynecology",
    experience: 16,
    education: "MD, Fellowship in OB/GYN",
    rating: 4.8,
    consultationFee: 1600,
    location: "Afilas General Hospital",
    availability: "Mon, Wed, Fri",
  },
];

// ============================================================
// CUSTOM HOOK: Detect if element is in viewport
// ============================================================
function useInView(ref: React.RefObject<HTMLElement>) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return isInView;
}

// ============================================================
// COMPONENT
// ============================================================
interface DoctorFinderProps {
  selectedLocation?: string;
  showHeader?: boolean;
}

export function DoctorFinder({ 
  selectedLocation = "All", 
  showHeader = true 
}: DoctorFinderProps = {}) {
  const { t } = useLanguage();
  const router = useRouter(); // ✅ Hook for page redirection
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef);

  const [doctors, setDoctors] = useState(mockDoctors);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageFailed, setImageFailed] = useState<Record<string, boolean>>({});

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedAvailability, setSelectedAvailability] = useState("");

  // ✅ New function to handle direct page redirection
  const handleBookAppointment = (doctorId: string) => {
    // Send the user directly to the appointment page
    // You can pass the doctor ID as a query parameter if needed
    router.push(`/appointment?doctorId=${doctorId}`);
  };

  // ============================================================
  // 🔌 REAL API CONNECTION
  // ============================================================
  useEffect(() => {
    async function fetchDoctors() {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch('http://localhost:5000/api/doctors');
        if (!res.ok) throw new Error(`Server responded with status: ${res.status}`);

        const json = await res.json();
        console.log("✅ Real Doctors API Response:", json);

        let apiDoctors = [];
        if (json.success && Array.isArray(json.data)) apiDoctors = json.data;
        else if (Array.isArray(json)) apiDoctors = json;

        if (apiDoctors.length > 0) {
          const formattedDoctors = apiDoctors.map((doc: any) => {
            const rawImage: string | null = doc.image || doc.photoUrl || null;
            let photoUrl: string | null = null;
            if (rawImage) {
              if (/^https?:\/\//i.test(rawImage)) {
                photoUrl = rawImage;
              } else {
                const cleanPath = rawImage.replace(/^\/+/, '');
                photoUrl = `http://localhost:5000/${cleanPath}`;
              }
            }

            return {
              id: doc.id,
              name: doc.user ? `Dr. ${doc.user.firstName} ${doc.user.lastName}` : doc.name || "Doctor",
              title: doc.specialization || doc.title || "Specialist",
              bio: doc.bio || "Experienced medical professional dedicated to patient care.",
              photoUrl: photoUrl,
              active: doc.isAvailable !== undefined ? doc.isAvailable : !!doc.active,
              email: doc.user?.email || doc.email || "",
              phone: doc.user?.phone || doc.phone || "",
              specialization: doc.specialization || doc.title || "General",
              experience: doc.experience || 0,
              education: doc.education || "",
              rating: doc.rating || 4.5,
              consultationFee: doc.consultationFee || 0,
              location: doc.location || "Afilas General Hospital",
              availability: doc.availability || "Mon - Fri",
            };
          });

          setDoctors(formattedDoctors);
        }
      } catch (err) {
        console.error("❌ Failed to fetch doctors from API:", err);
        setError(err instanceof Error ? err.message : "Connection failed");
        console.log("🔄 Falling back to mock doctors data");
        setDoctors(mockDoctors);
      } finally {
        setLoading(false);
      }
    }

    fetchDoctors();
  }, []);

  const specializations = ["All", ...new Set(doctors.map((d) => d.specialization))];
  const availabilities = ["All", ...new Set(doctors.map((d) => d.availability))];

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty =
      selectedSpecialty === "" || selectedSpecialty === "All" ||
      doctor.specialization === selectedSpecialty;
    const matchesAvailability =
      selectedAvailability === "" || selectedAvailability === "All" ||
      doctor.availability === selectedAvailability;

    // Check location matching (case insensitive and flexible)
    const normLocation = (doctor.location || "").toLowerCase();
    const targetLoc = (selectedLocation || "All").toLowerCase();

    let matchesLocation = true;
    if (targetLoc !== "all") {
      if (targetLoc.includes("hospital")) {
        matchesLocation = normLocation.includes("hospital");
      } else if (targetLoc.includes("diagnostic") || targetLoc.includes("diagnosis")) {
        matchesLocation = normLocation.includes("diagnostic") || normLocation.includes("diagnosis");
      } else if (targetLoc.includes("pharma") || targetLoc.includes("drug") || targetLoc.includes("manufacturing")) {
        matchesLocation = normLocation.includes("pharma") || normLocation.includes("drug") || normLocation.includes("manufacturing");
      } else {
        matchesLocation = normLocation.includes(targetLoc);
      }
    }

    return matchesSearch && matchesSpecialty && matchesAvailability && matchesLocation;
  });

  return (
    <section id="doctors" ref={sectionRef} className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        {showHeader && (
          <div className={`mb-8 transition-all duration-600 ease-out ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              {t("doctors.headline")}
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg">
              {t("doctors.subtitle")}
            </p>
          </div>
        )}

        {/* Filter Bar */}
        <div className={`flex flex-col sm:flex-row gap-3 mb-8 transition-all duration-600 ease-out delay-100 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("doctors.filter_search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-lg text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
          </div>
          <div className="relative sm:w-44">
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full appearance-none px-3 py-2.5 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all cursor-pointer"
            >
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec === "All" ? t("doctors.filter_specialty") : spec}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
          <div className="relative sm:w-44">
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="w-full appearance-none px-3 py-2.5 bg-card border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all cursor-pointer"
            >
              {availabilities.map((avail) => (
                <option key={avail} value={avail}>
                  {avail === "All" ? t("doctors.filter_availability") : avail}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
          <div className="text-xs flex items-center text-muted-foreground sm:ml-1">
            {loading ? (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Loader2 className="w-3 h-3 animate-spin" /> {t("doctors.status_loading")}
              </span>
            ) : error ? (
              <span className="text-destructive/70">⚠️ {t("doctors.status_offline")}</span>
            ) : (
              <span className="text-primary">✓ {t("doctors.status_live")}</span>
            )}
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}

        {!loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDoctors.map((doctor, idx) => {
              const delay = idx * 80;
              return (
                <div
                  key={doctor.id}
                  className={`group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-500 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                  style={{ transitionDelay: `${150 + delay}ms` }}
                >
                  {/* Doctor Image */}
                  <div className="relative w-full h-48 overflow-hidden bg-muted">
                    {doctor.photoUrl && !imageFailed[doctor.id] ? (
                      <Image
                        src={doctor.photoUrl}
                        alt={doctor.name}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={() => setImageFailed((p) => ({ ...p, [doctor.id]: true }))}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-primary/20 bg-muted">
                        {doctor.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                    )}
                  </div>

                  {/* Doctor Info */}
                  <div className="p-4 space-y-2.5">
                    <div>
                      <h3 className="text-base font-bold text-foreground leading-tight">
                        {doctor.name}
                      </h3>
                      <p className="text-xs font-semibold text-primary mt-0.5">
                        {doctor.title}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {doctor.bio}
                    </p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {doctor.location}
                      </span>
                      <span>{doctor.experience}+ yrs</span>
                      <span className="font-medium text-foreground/70">
                        ETB {doctor.consultationFee}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {t("doctors.available")}: {doctor.availability}
                    </p>

                    {/* ✅ ACTION BUTTONS WITH PAGE REDIRECT */}
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleBookAppointment(doctor.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        {t("doctors.book")}
                      </button>
                      <a
                        href={`mailto:${doctor.email}`}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-muted text-muted-foreground rounded-lg text-xs font-semibold hover:bg-muted/80 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        {t("doctors.email")}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filteredDoctors.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-sm">
              {t("doctors.no_doctors")}
            </p>
          </div>
        )}

        <div className={`text-center mt-10 transition-all duration-600 ease-out delay-300 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <button className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors">
            {t("doctors.view_all")}
          </button>
        </div>
      </div>
    </section>
  );
}