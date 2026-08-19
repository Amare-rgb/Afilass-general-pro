// components/DoctorFinder.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageProvider";
import {
  Star, MapPin, Search, ChevronDown, Loader2, Calendar, Briefcase, Clock,
  X, Phone, Mail, Stethoscope, DollarSign, GraduationCap
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Day mapping helper for scheduleSlots
const dayNames: Record<number, string> = {
  0: "Sun", 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat", 7: "Sun"
};

function formatScheduleSlots(slots: any[]): string {
  if (!Array.isArray(slots) || slots.length === 0) return "";
  const activeSlots = slots.filter(s => s.isAvailable !== false);
  if (activeSlots.length === 0) return "";
  
  const days = activeSlots.map(s => dayNames[s.dayOfWeek] || `Day ${s.dayOfWeek}`);
  const uniqueDays = Array.from(new Set(days));
  return uniqueDays.join(", ");
}

// ============================================================
// TYPES (Based on your Backend API)
// ============================================================
interface BackendDoctor {
  id: string;
  userId?: string;
  name?: string;
  title?: string;
  specialization: string;
  experience: number;
  education?: string;
  bio: string;
  consultationFee: number;
  rating?: number;
  active?: boolean;
  isAvailable?: boolean;
  location: string;
  image?: string | null;
  photoUrl?: string | null;
  email?: string;
  phone?: string;
  scheduleSlots?: any[];
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
    availability: "Mon - Fri",
    scheduleSlots: [],
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
    availability: "Mon - Fri",
    scheduleSlots: [],
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
    availability: "Mon - Fri",
    scheduleSlots: [],
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
    availability: "Mon - Fri",
    scheduleSlots: [],
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
    availability: "Mon - Fri",
    scheduleSlots: [],
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
    availability: "Mon - Fri",
    scheduleSlots: [],
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
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef);

  const [doctors, setDoctors] = useState<any[]>(mockDoctors);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageFailed, setImageFailed] = useState<Record<string, boolean>>({});
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedAvailability, setSelectedAvailability] = useState("");

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
            const rawImage: string | null = doc.photoUrl || doc.image || null;
            let photoUrl: string | null = null;
            if (rawImage) {
              if (/^https?:\/\//i.test(rawImage)) {
                photoUrl = rawImage;
              } else {
                const cleanPath = rawImage.replace(/^\/+/, '');
                photoUrl = `http://localhost:5000/${cleanPath}`;
              }
            }

            const rawName = doc.name || (doc.user ? `${doc.user.firstName} ${doc.user.lastName}` : "Doctor");
            const displayName = rawName.startsWith("Dr.") ? rawName : `Dr. ${rawName}`;
            const computedAvail = doc.availability || formatScheduleSlots(doc.scheduleSlots) || "Mon - Fri";

            return {
              id: doc.id,
              name: displayName,
              title: doc.title || doc.specialization || "Specialist",
              bio: doc.bio || "Experienced medical professional dedicated to patient care.",
              photoUrl: photoUrl,
              active: doc.active !== undefined ? doc.active : doc.isAvailable !== undefined ? doc.isAvailable : true,
              email: doc.email || doc.user?.email || "",
              phone: doc.phone || doc.user?.phone || "",
              specialization: doc.specialization || doc.title || "General",
              experience: doc.experience || 0,
              education: doc.education || "",
              rating: doc.rating || 4.8,
              consultationFee: doc.consultationFee || 0,
              location: doc.location || "Afilas General Hospital",
              availability: computedAvail,
              scheduleSlots: doc.scheduleSlots || [],
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

  // ============================================================
  // ✅ HELPER: GET THE CORRECT APPOINTMENT LINK BASED ON BRANCH
  // ============================================================
  const getAppointmentLink = (location: string) => {
    const loc = location.toLowerCase();
    if (loc.includes("hospital")) return "/appointments/hospital";
    if (loc.includes("diagnostic") || loc.includes("diagnosis")) return "/appointments/diagnosis";
    if (loc.includes("pharma") || loc.includes("drug") || loc.includes("manufacturing")) return "/orders/pharma";
    return "/appointments"; // Fallback
  };

  return (
    <section id="doctors" ref={sectionRef} className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDoctors.map((doctor, idx) => {
              const delay = idx * 80;
              return (
                <div
                  key={doctor.id}
                  className={`group bg-card border border-border/60 rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 ${(
                    isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  )}`}
                  style={{ transitionDelay: `${150 + delay}ms` }}
                  onClick={() => setSelectedDoctor(doctor)} // Opens Modal
                >
                  {/* Doctor Image - Circular */}
                  <div className="relative w-full pt-8 pb-4 flex items-center justify-center bg-gradient-to-b from-primary/5 via-background to-background">
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all duration-300 bg-muted shadow-md">
                      {doctor.photoUrl && !imageFailed[doctor.id] ? (
                        <Image
                          src={doctor.photoUrl}
                          alt={doctor.name}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={() => setImageFailed((p) => ({ ...p, [doctor.id]: true }))}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-primary/30 bg-muted">
                          {doctor.name.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="p-5 pt-2 space-y-3 text-center">
                    {/* Name */}
                    <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                      {doctor.name}
                    </h3>
                    
                    {/* Title/Specialty */}
                    <p className="text-sm font-medium text-primary">
                      {doctor.title}
                    </p>

                    {/* Divider */}
                    <div className="w-12 h-0.5 bg-primary/30 mx-auto rounded-full" />

                    {/* Experience */}
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        EXPERIENCE
                      </p>
                      <p className="text-sm font-bold text-foreground">
                        {doctor.experience}+ yrs
                      </p>
                    </div>

                    {/* Availability */}
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                        AVAILABLE
                      </p>
                      <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        {doctor.availability}
                      </p>
                    </div>

                    {/* Location/Affiliation */}
                    <div className="pt-3 mt-2 border-t border-border/40">
                      <p className="text-[11px] text-muted-foreground/60 font-medium">
                        © {doctor.location}
                      </p>
                    </div>

                    {/* ============================================================ */}
                    {/* ✅ BOOK APPOINTMENT BUTTON - WHITE BLUE BACKGROUND, NO ICON */}
                    {/* ============================================================ */}
                    <div 
                      className="pt-4 mt-2 border-t border-border/40"
                      onClick={(e) => e.stopPropagation()} // ✅ PREVENTS THE MODAL FROM OPENING!
                    >
                      <Link
                        href={getAppointmentLink(doctor.location)}
                        className="flex w-full items-center justify-center bg-[#EAF4FF] hover:bg-[#D4E8FF] text-[#4A90D9] hover:text-[#2d6a4f] px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-95"
                        onClick={(e) => e.stopPropagation()} // Extra safety
                      >
                        <span>{t("cta.book_appointment") || "Book Appointment"}</span>
                      </Link>
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

        {showHeader && (
          <div className={`text-center mt-10 transition-all duration-600 ease-out delay-300 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <Link
              href="/doctors"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              {t("doctors.view_all")}
              <ChevronDown className="w-4 h-4 -rotate-90" />
            </Link>
          </div>
        )}
      </div>

      {/* ============================================================
          DOCTOR DETAILS MODAL (CLICKABLE CARD DETAILED VIEW)
         ============================================================ */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-fadeIn">
          {/* Backdrop click to close */}
          <div 
            className="absolute inset-0" 
            onClick={() => setSelectedDoctor(null)} 
          />
          
          {/* Modal Card */}
          <div className="relative w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col transition-all">
            {/* Modal Header */}
            <div className="relative p-6 sm:p-8 bg-gradient-to-r from-primary/20 via-primary/10 to-background border-b border-border flex items-start justify-between gap-4">
              <div className="flex items-center gap-4 sm:gap-6">
                {/* Doctor Avatar */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden ring-4 ring-primary/20 shrink-0 bg-muted shadow-md">
                  {selectedDoctor.photoUrl && !imageFailed[selectedDoctor.id] ? (
                    <Image
                      src={selectedDoctor.photoUrl}
                      alt={selectedDoctor.name}
                      fill
                      unoptimized
                      className="object-cover"
                      onError={() => setImageFailed((p) => ({ ...p, [selectedDoctor.id]: true }))}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-primary/40 bg-muted">
                      {selectedDoctor.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                  )}
                </div>

                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{t("doctors.modal.active_status")}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-foreground leading-tight">
                    {selectedDoctor.name}
                  </h3>
                  <p className="text-sm font-semibold text-primary mt-0.5">
                    {selectedDoctor.title}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedDoctor(null)}
                aria-label={t("doctors.modal.close")}
                className="p-2 rounded-full bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - Scrollable Details */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-sm">
              {/* Bio */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  {t("doctors.modal.title")}
                </h4>
                <p className="text-foreground/90 text-sm leading-relaxed bg-muted/30 p-4 rounded-xl border border-border/50">
                  {selectedDoctor.bio}
                </p>
              </div>

              {/* Info Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 bg-card border border-border/80 rounded-xl flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">{t("doctors.modal.specialization")}</p>
                    <p className="text-sm font-bold text-foreground mt-0.5">{selectedDoctor.specialization}</p>
                  </div>
                </div>

                <div className="p-3.5 bg-card border border-border/80 rounded-xl flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">{t("doctors.modal.experience")}</p>
                    <p className="text-sm font-bold text-foreground mt-0.5">{selectedDoctor.experience}+ Years</p>
                  </div>
                </div>

                <div className="p-3.5 bg-card border border-border/80 rounded-xl flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">{t("doctors.modal.location")}</p>
                    <p className="text-sm font-bold text-foreground mt-0.5">{selectedDoctor.location}</p>
                  </div>
                </div>

                <div className="p-3.5 bg-card border border-border/80 rounded-xl flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">{t("doctors.modal.fee")}</p>
                    <p className="text-sm font-bold text-foreground mt-0.5">
                      {selectedDoctor.consultationFee > 0 ? `ETB ${selectedDoctor.consultationFee}` : t("doctors.modal.free_fee")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Education (if present) */}
              {selectedDoctor.education && (
                <div className="p-3.5 bg-card border border-border/80 rounded-xl flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">{t("doctors.modal.education")}</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{selectedDoctor.education}</p>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              {(selectedDoctor.phone || selectedDoctor.email) && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    {t("doctors.modal.contact")}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedDoctor.phone && (
                      <a
                        href={`tel:${selectedDoctor.phone}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/40 text-foreground text-xs font-medium transition-colors"
                      >
                        <Phone className="w-4 h-4 text-primary shrink-0" />
                        <span>{selectedDoctor.phone}</span>
                      </a>
                    )}
                    {selectedDoctor.email && (
                      <a
                        href={`mailto:${selectedDoctor.email}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/40 text-foreground text-xs font-medium transition-colors"
                      >
                        <Mail className="w-4 h-4 text-primary shrink-0" />
                        <span className="truncate">{selectedDoctor.email}</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Schedule Slots */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  {t("doctors.modal.schedule")}
                </h4>
                {Array.isArray(selectedDoctor.scheduleSlots) && selectedDoctor.scheduleSlots.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedDoctor.scheduleSlots.map((slot: any) => {
                      const dayStr = dayNames[slot.dayOfWeek] || `Day ${slot.dayOfWeek}`;
                      return (
                        <div
                          key={slot.id || Math.random()}
                          className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs"
                        >
                          <span className="font-bold text-foreground flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            {dayStr}
                          </span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold text-xs border border-emerald-500/20">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>{selectedDoctor.availability || "Mon - Fri"}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 sm:p-6 bg-muted/40 border-t border-border flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={() => setSelectedDoctor(null)}
                className="px-5 py-2.5 rounded-xl border border-border text-foreground font-semibold text-xs hover:bg-muted transition-colors"
              >
                {t("doctors.modal.close")}
              </button>
              {/* <button
                onClick={() => {
                  const docId = selectedDoctor.id;
                  setSelectedDoctor(null);
                  router.push(`/appointments/doctor?doctorId=${docId}`);
                }}
                className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all shadow-md active:scale-95 flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>{t("doctors.modal.book")}</span>
              </button> */}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}