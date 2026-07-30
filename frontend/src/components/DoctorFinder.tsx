"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageProvider";
import { Mail, Phone, Star, MapPin, Search, ChevronDown } from "lucide-react";
import Image from "next/image";

// ============================================================
// MOCK DATA – Matches the backend structure
// ============================================================
const mockDoctors = [
  {
    id: "1",
    name: "Dr. Amanuel Kebede",
    title: "Senior Cardiologist",
    bio: "Specializing in interventional cardiology with over 15 years of experience in treating complex heart conditions.",
    photoUrl:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
    active: true,
    email: "amanuel.k@afilas.com",
    phone: "+251 911 234 567",
    specialization: "Cardiology",
    experience: 15,
    education: "MD, Fellowship in Interventional Cardiology",
    rating: 4.8,
    consultationFee: 1500,
    scheduleSlots: ["Mon 9-12", "Wed 2-5", "Fri 9-12"],
    location: "Afilas General Hospital",
    availability: "Mon, Wed, Fri",
  },
  {
    id: "2",
    name: "Dr. Selam Tesfaye",
    title: "Endocrinologist",
    bio: "Expert in diabetes management, thyroid disorders, and metabolic health with a focus on personalized patient care.",
    photoUrl:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    active: true,
    email: "selam.t@afilas.com",
    phone: "+251 922 345 678",
    specialization: "Endocrinology",
    experience: 12,
    education: "MD, Fellowship in Endocrinology",
    rating: 4.9,
    consultationFee: 1200,
    scheduleSlots: ["Tue 10-1", "Thu 2-6", "Sat 9-12"],
    location: "Afilas General Hospital",
    availability: "Tue, Thu, Sat",
  },
  {
    id: "3",
    name: "Dr. Yonas Hailemariam",
    title: "Orthopedic Surgeon",
    bio: "Performing joint replacements, sports medicine procedures, and complex orthopedic surgeries with precision.",
    photoUrl:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face",
    active: true,
    email: "yonas.h@afilas.com",
    phone: "+251 933 456 789",
    specialization: "Orthopedics",
    experience: 18,
    education: "MD, Fellowship in Orthopedic Surgery",
    rating: 4.7,
    consultationFee: 2000,
    scheduleSlots: ["Mon 2-5", "Wed 9-12", "Fri 2-5"],
    location: "Afilas General Hospital",
    availability: "Mon, Wed, Fri",
  },
  {
    id: "4",
    name: "Dr. Meron Assefa",
    title: "Pediatrician",
    bio: "Dedicated to children's health and development, providing comprehensive care from infancy through adolescence.",
    photoUrl:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face",
    active: true,
    email: "meron.a@afilas.com",
    phone: "+251 944 567 890",
    specialization: "Pediatrics",
    experience: 10,
    education: "MD, Fellowship in Pediatrics",
    rating: 4.9,
    consultationFee: 1000,
    scheduleSlots: ["Mon 9-1", "Tue 2-6", "Thu 9-12", "Fri 2-5"],
    location: "Afilas General Hospital",
    availability: "Mon, Tue, Thu, Fri",
  },
  {
    id: "5",
    name: "Dr. Dawit Girma",
    title: "Neurologist",
    bio: "Specializing in neurological disorders, stroke management, and movement disorders with cutting-edge treatments.",
    photoUrl:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
    active: true,
    email: "dawit.g@afilas.com",
    phone: "+251 955 678 901",
    specialization: "Neurology",
    experience: 14,
    education: "MD, Fellowship in Neurology",
    rating: 4.6,
    consultationFee: 1800,
    scheduleSlots: ["Tue 9-12", "Thu 1-5", "Sat 9-12"],
    location: "Afilas Diagnosis Center",
    availability: "Tue, Thu, Sat",
  },
  {
    id: "6",
    name: "Dr. Sara Mohammed",
    title: "Obstetrician & Gynecologist",
    bio: "Providing comprehensive women's health services including prenatal care, family planning, and gynecological surgery.",
    photoUrl:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face",
    active: true,
    email: "sara.m@afilas.com",
    phone: "+251 966 789 012",
    specialization: "Obstetrics & Gynecology",
    experience: 16,
    education: "MD, Fellowship in OB/GYN",
    rating: 4.8,
    consultationFee: 1600,
    scheduleSlots: ["Mon 10-2", "Wed 2-6", "Fri 9-1"],
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
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return isInView;
}

// ============================================================
// COMPONENT
// ============================================================
export function DoctorFinder() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedAvailability, setSelectedAvailability] = useState("");

  // Get unique specializations for filter dropdown
  const specializations = [
    "All",
    ...new Set(mockDoctors.map((d) => d.specialization)),
  ];
  const availabilities = [
    "All",
    ...new Set(mockDoctors.map((d) => d.availability)),
  ];

  // Filter doctors
  const filteredDoctors = mockDoctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty =
      selectedSpecialty === "" ||
      selectedSpecialty === "All" ||
      doctor.specialization === selectedSpecialty;
    const matchesAvailability =
      selectedAvailability === "" ||
      selectedAvailability === "All" ||
      doctor.availability === selectedAvailability;
    return matchesSearch && matchesSpecialty && matchesAvailability;
  });

  return (
    <section id="doctors" ref={sectionRef} className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center mb-12 transition-all duration-700 ease-out ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t("doctors.headline")}
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            {t("doctors.subtitle")}
          </p>
        </div>

        {/* Filter Bar */}
        <div
          className={`flex flex-col sm:flex-row gap-4 mb-12 transition-all duration-700 ease-out delay-100 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <input
              type="text"
              placeholder={t("doctors.filter_search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          {/* Specialty Filter */}
          <div className="relative sm:w-48">
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full appearance-none px-4 py-3 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
            >
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec === "All" ? t("doctors.filter_specialty") : spec}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40 pointer-events-none" />
          </div>

          {/* Availability Filter */}
          <div className="relative sm:w-48">
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="w-full appearance-none px-4 py-3 bg-card border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
            >
              {availabilities.map((avail) => (
                <option key={avail} value={avail}>
                  {avail === "All" ? t("doctors.filter_availability") : avail}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40 pointer-events-none" />
          </div>
        </div>

        {/* Doctor Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor, idx) => {
            const delay = idx * 100;
            return (
              <div
                key={doctor.id}
                className={`group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${
                  isInView
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${150 + delay}ms` }}
              >
                {/* Doctor Image */}
                <div className="relative w-full h-56 overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
                  {doctor.photoUrl ? (
                    <Image
                      src={doctor.photoUrl}
                      alt={doctor.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-primary/30">
                      {doctor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  )}

                  {/* Rating Badge */}
                  {doctor.rating > 0 && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-white text-sm">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span>{doctor.rating}</span>
                    </div>
                  )}

                  {/* Active Status */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 bg-green-500/90 backdrop-blur-sm rounded-lg text-white text-xs font-medium">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    Available
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="p-5 space-y-3">
                  <h3 className="text-lg font-bold text-foreground">
                    {doctor.name}
                  </h3>
                  <p className="text-sm font-semibold text-primary">
                    {doctor.title}
                  </p>
                  <p className="text-sm text-foreground/70 leading-relaxed line-clamp-2">
                    {doctor.bio}
                  </p>

                  {/* Details */}
                  <div className="flex flex-wrap gap-2 text-xs text-foreground/60">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {doctor.location}
                    </span>
                    <span className="text-border">|</span>
                    <span>{doctor.experience}+ years</span>
                    <span className="text-border">|</span>
                    <span className="font-medium text-primary">
                      ETB {doctor.consultationFee}
                    </span>
                  </div>

                  {/* Availability */}
                  <div className="text-xs text-foreground/50">
                    Available: {doctor.availability}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-all duration-300">
                      <Phone className="w-4 h-4" />
                      <span className="text-xs font-semibold">
                        {t("doctors.book")}
                      </span>
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 text-foreground/70 rounded-lg transition-all duration-300">
                      <Mail className="w-4 h-4" />
                      <span className="text-xs font-semibold">Email</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-foreground/60 text-lg">
              No doctors found matching your criteria.
            </p>
          </div>
        )}

        {/* View All CTA */}
        <div
          className={`text-center mt-12 transition-all duration-700 ease-out delay-300 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <button className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5">
            {t("doctors.view_all")}
          </button>
        </div>
      </div>
    </section>
  );
}
