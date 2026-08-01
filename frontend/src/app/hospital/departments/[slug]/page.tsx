// app/hospital/departments/[slug]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { 
  ArrowLeft, 
  Heart, 
  Brain, 
  Bone, 
  Shield, 
  Ambulance,
  Users,
  Stethoscope,
  Activity,
  Clock,
  Phone,
  Mail,
  MapPin,
  User,
  Star,
  CheckCircle,
  Microscope,
  Pill,
  Hospital,
  Bed,
  AlertCircle,
  ChevronRight,
  Calendar,
  Award
} from "lucide-react";
import { useState } from "react";

const departmentData = {
  cardiology: {
    id: "cardiology",
    name: "Cardiology",
    icon: Heart,
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-800",
    description: "Heart and cardiovascular system care with advanced interventional procedures",
    longDescription: "Our Cardiology Department provides complete cardiovascular care, from prevention and diagnosis to treatment and rehabilitation. We offer advanced procedures including cardiac catheterization, angioplasty, pacemaker implantation, and cardiac surgery. Our team of internationally trained cardiologists, cardiac surgeons, and support staff work together to provide personalized care for every patient.",
    stats: {
      patients: "12,500+",
      procedures: "3,200+",
      successRate: "98.5%",
      yearsOfService: "25+"
    },
    services: [
      "Cardiac Catheterization - Diagnostic and interventional procedures",
      "Echocardiography - Non-invasive heart imaging",
      "Cardiac Surgery - Bypass, valve replacement, and transplantation",
      "Interventional Cardiology - Angioplasty and stenting",
      "Cardiac Rehabilitation - Recovery and wellness programs",
      "Electrophysiology - Heart rhythm disorder treatment"
    ],
    doctors: [
      {
        name: "Dr. Sarah Johnson",
        title: "Chief Cardiologist",
        specialty: "Interventional Cardiology",
        experience: "18 years",
        education: "MD, FACC, Johns Hopkins University",
        rating: 4.9,
        reviews: 127,
        availability: "Mon-Fri 9:00 AM - 5:00 PM"
      },
      {
        name: "Dr. Michael Chen",
        title: "Cardiac Surgeon",
        specialty: "Cardiothoracic Surgery",
        experience: "15 years",
        education: "MD, FRCS, Stanford University",
        rating: 4.8,
        reviews: 98,
        availability: "Tue-Thu 8:00 AM - 4:00 PM"
      },
      {
        name: "Dr. Emily Williams",
        title: "Electrophysiologist",
        specialty: "Heart Rhythm Disorders",
        experience: "12 years",
        education: "MD, FHRS, Mayo Clinic",
        rating: 4.9,
        reviews: 85,
        availability: "Mon-Wed-Fri 10:00 AM - 6:00 PM"
      }
    ],
    facilities: [
      "8 Advanced Cardiac Catheterization Labs",
      "24/7 Cardiac Emergency Unit",
      "Dedicated Cardiac ICU with 20 beds",
      "State-of-the-art Hybrid Operating Suite",
      "Comprehensive Cardiac Rehabilitation Center",
      "Advanced Echocardiography and Imaging Lab"
    ],
    contact: {
      phone: "+251 98 320 1998",
      email: "cardiology@afilas.com",
      location: "Afilas General Hospital, 3rd Floor, East Wing"
    },
    workingHours: "24/7 Emergency Services • Outpatient: Mon-Fri 8:00 AM - 6:00 PM"
  },
  pediatrics: {
    id: "pediatrics",
    name: "Pediatrics",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
    description: "Specialized care for children and infants in a child-friendly environment",
    longDescription: "The Pediatrics Department at Afilas General Hospital provides comprehensive medical care for children from birth through adolescence. Our team of pediatricians, pediatric specialists, and child life specialists create a warm, welcoming environment focused on the unique needs of young patients and their families. We offer preventive care, acute illness management, and chronic disease treatment with a child-centered approach.",
    stats: {
      patients: "15,000+",
      procedures: "1,800+",
      successRate: "99.2%",
      yearsOfService: "20+"
    },
    services: [
      "Neonatal Intensive Care - Specialized care for newborns",
      "Pediatric Emergency - 24/7 child-friendly emergency services",
      "Childhood Immunizations - Comprehensive vaccination programs",
      "Pediatric Surgery - Specialized surgical procedures for children",
      "Child Development - Monitoring and support services",
      "Pediatric Nutrition - Specialized nutritional guidance"
    ],
    doctors: [
      {
        name: "Dr. Lisa Park",
        title: "Head of Pediatrics",
        specialty: "Neonatology",
        experience: "20 years",
        education: "MD, FAAP, Harvard Medical School",
        rating: 4.9,
        reviews: 156,
        availability: "Mon-Thu 8:00 AM - 4:00 PM"
      },
      {
        name: "Dr. James Wilson",
        title: "Pediatric Surgeon",
        specialty: "Pediatric Surgery",
        experience: "16 years",
        education: "MD, FACS, Children's Hospital",
        rating: 4.8,
        reviews: 112,
        availability: "Mon-Wed-Fri 9:00 AM - 5:00 PM"
      }
    ],
    facilities: [
      "Level III NICU with 25 beds",
      "Child-friendly Emergency Department",
      "Dedicated Pediatric Operating Rooms",
      "Pediatric Intensive Care Unit (PICU)",
      "Child Life Activity Center",
      "Specialized Pediatric Rehabilitation"
    ],
    contact: {
      phone: "+251 98 320 1998",
      email: "pediatrics@afilas.com",
      location: "Afilas General Hospital, 2nd Floor, West Wing"
    },
    workingHours: "24/7 Emergency Services • Outpatient: Mon-Fri 8:00 AM - 5:00 PM"
  },
  neurology: {
    id: "neurology",
    name: "Neurology",
    icon: Brain,
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    borderColor: "border-purple-200 dark:border-purple-800",
    description: "Brain and nervous system treatment with advanced diagnostics",
    longDescription: "Our Neurology Department offers comprehensive care for patients with neurological conditions including stroke, epilepsy, multiple sclerosis, Parkinson's disease, and Alzheimer's disease. We utilize the latest diagnostic technologies including MRI, CT, and EEG, combined with evidence-based treatments and rehabilitation programs.",
    stats: {
      patients: "8,700+",
      procedures: "1,500+",
      successRate: "97.8%",
      yearsOfService: "18+"
    },
    services: [
      "Stroke Care - Rapid response and comprehensive treatment",
      "Neuro-Intervention - Minimally invasive procedures",
      "Epilepsy Management - Advanced monitoring and treatment",
      "Neurosurgery - Surgical interventions for brain and spine",
      "Neuro-Rehabilitation - Comprehensive recovery programs",
      "Memory Clinic - Cognitive and memory disorder care"
    ],
    doctors: [
      {
        name: "Dr. Robert Taylor",
        title: "Head of Neurology",
        specialty: "Cerebrovascular Diseases",
        experience: "22 years",
        education: "MD, PhD, Harvard Medical School",
        rating: 4.9,
        reviews: 143,
        availability: "Mon-Fri 8:00 AM - 5:00 PM"
      },
      {
        name: "Dr. Maria Garcia",
        title: "Neurosurgeon",
        specialty: "Brain and Spine Surgery",
        experience: "18 years",
        education: "MD, FACS, UCSF Medical Center",
        rating: 4.9,
        reviews: 134,
        availability: "Tue-Thu 9:00 AM - 6:00 PM"
      }
    ],
    facilities: [
      "Advanced Neuro-Imaging Suite",
      "Comprehensive Epilepsy Monitoring Unit",
      "Dedicated Stroke Center",
      "Neuro-ICU with 15 beds",
      "Cognitive Assessment Center",
      "Movement Disorders Clinic"
    ],
    contact: {
      phone: "+251 98 320 1998",
      email: "neurology@afilas.com",
      location: "Afilas General Hospital, 5th Floor, North Wing"
    },
    workingHours: "24/7 Emergency Services • Outpatient: Mon-Fri 8:00 AM - 5:00 PM"
  },
  orthopedics: {
    id: "orthopedics",
    name: "Orthopedics",
    icon: Bone,
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-200 dark:border-green-800",
    description: "Bone and joint health management including surgical and non-surgical care",
    longDescription: "The Orthopedics Department provides complete musculoskeletal care including diagnosis, treatment, and rehabilitation. Our services cover everything from sports injuries and fractures to complex joint replacements and spinal surgery. We use minimally invasive techniques, robotic-assisted surgery, and comprehensive rehabilitation programs.",
    stats: {
      patients: "10,200+",
      procedures: "2,800+",
      successRate: "98.2%",
      yearsOfService: "22+"
    },
    services: [
      "Joint Replacement - Advanced hip, knee, and shoulder replacement",
      "Sports Medicine - Injury prevention, treatment, and rehabilitation",
      "Spinal Surgery - Expert surgical and non-surgical treatment",
      "Fracture Care - Complex fractures and trauma treatment",
      "Arthroscopic Surgery - Minimally invasive joint surgery",
      "Physical Therapy - Comprehensive rehabilitation services"
    ],
    doctors: [
      {
        name: "Dr. David Kim",
        title: "Head of Orthopedics",
        specialty: "Joint Replacement",
        experience: "20 years",
        education: "MD, FACS, Mayo Clinic",
        rating: 4.9,
        reviews: 167,
        availability: "Mon-Fri 8:00 AM - 5:00 PM"
      },
      {
        name: "Dr. Rachel Brown",
        title: "Sports Medicine Specialist",
        specialty: "Sports Medicine",
        experience: "14 years",
        education: "MD, CAQ, Cleveland Clinic",
        rating: 4.8,
        reviews: 98,
        availability: "Mon-Wed-Fri 10:00 AM - 6:00 PM"
      }
    ],
    facilities: [
      "Robotic-Assisted Surgery Suite",
      "Advanced Imaging Center",
      "Dedicated Sports Medicine Clinic",
      "Comprehensive Rehabilitation Center",
      "Pediatric Orthopedics Unit",
      "24/7 Trauma Center"
    ],
    contact: {
      phone: "+251 98 320 1998",
      email: "orthopedics@afilas.com",
      location: "Afilas General Hospital, 4th Floor, South Wing"
    },
    workingHours: "24/7 Emergency Services • Outpatient: Mon-Fri 8:00 AM - 6:00 PM"
  },
  oncology: {
    id: "oncology",
    name: "Oncology",
    icon: Shield,
    color: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    borderColor: "border-orange-200 dark:border-orange-800",
    description: "Cancer diagnosis and treatment with comprehensive care",
    longDescription: "Our Oncology Department provides integrated cancer care including prevention, early detection, treatment, and supportive care. We offer a full range of treatment modalities including chemotherapy, radiation therapy, immunotherapy, targeted therapy, and surgical oncology. Our multidisciplinary team works together to create personalized treatment plans.",
    stats: {
      patients: "6,500+",
      procedures: "15,000+",
      successRate: "92.5%",
      yearsOfService: "15+"
    },
    services: [
      "Medical Oncology - Chemotherapy, immunotherapy, and targeted therapy",
      "Radiation Therapy - Advanced radiation treatments",
      "Surgical Oncology - Cancer surgeries by specialized surgeons",
      "Palliative Care - Quality of life and symptom management",
      "Cancer Screening - Comprehensive early detection programs",
      "Clinical Trials - Cutting-edge cancer research"
    ],
    doctors: [
      {
        name: "Dr. Angela Martinez",
        title: "Chief of Oncology",
        specialty: "Medical Oncology",
        experience: "24 years",
        education: "MD, PhD, Memorial Sloan Kettering",
        rating: 4.9,
        reviews: 189,
        availability: "Mon-Fri 8:00 AM - 5:00 PM"
      },
      {
        name: "Dr. Thomas Anderson",
        title: "Radiation Oncologist",
        specialty: "Radiation Oncology",
        experience: "18 years",
        education: "MD, FASTRO, MD Anderson",
        rating: 4.8,
        reviews: 156,
        availability: "Tue-Thu 9:00 AM - 6:00 PM"
      }
    ],
    facilities: [
      "State-of-the-art Radiation Therapy Suite",
      "Infusion Center with 20 beds",
      "Oncology Outpatient Clinic",
      "Palliative Care Unit",
      "Cancer Support Center",
      "Clinical Research Unit"
    ],
    contact: {
      phone: "+251 98 320 1998",
      email: "oncology@afilas.com",
      location: "Afilas General Hospital, 6th Floor, East Wing"
    },
    workingHours: "Mon-Fri 8:00 AM - 6:00 PM • Emergency: 24/7"
  },
  emergency: {
    id: "emergency",
    name: "Emergency Medicine",
    icon: Ambulance,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-800",
    description: "24/7 emergency and trauma care with rapid response teams",
    longDescription: "Our Emergency Medicine Department provides round-the-clock emergency care for all medical emergencies and trauma cases. We are equipped with a Level I Trauma Center, specialized teams for cardiac emergencies, stroke, and pediatric emergencies. Our board-certified emergency physicians and trauma surgeons are ready to handle any emergency situation.",
    stats: {
      patients: "45,000+",
      procedures: "12,000+",
      successRate: "95.5%",
      yearsOfService: "25+"
    },
    services: [
      "Trauma Care - Rapid response for traumatic injuries",
      "Cardiac Emergencies - Immediate care for heart attacks",
      "Stroke Response - Rapid assessment and treatment",
      "Pediatric Emergencies - Specialized emergency care for children",
      "Minor Injuries - Treatment for cuts, burns, and fractures",
      "Rapid Diagnostics - Immediate lab and imaging services"
    ],
    doctors: [
      {
        name: "Dr. Andrew Miller",
        title: "Head of Emergency Medicine",
        specialty: "Emergency Medicine",
        experience: "21 years",
        education: "MD, FACEP, University of Pennsylvania",
        rating: 4.9,
        reviews: 203,
        availability: "24/7 Rotating Schedule"
      },
      {
        name: "Dr. Patricia Turner",
        title: "Trauma Surgeon",
        specialty: "Trauma Surgery",
        experience: "19 years",
        education: "MD, FACS, Shock Trauma Center",
        rating: 4.9,
        reviews: 178,
        availability: "24/7 Rotating Schedule"
      }
    ],
    facilities: [
      "Level I Trauma Center",
      "20-bed Emergency Observation Unit",
      "Designated Cardiac Emergency Suite",
      "Stroke Center",
      "Pediatric Emergency Area",
      "Rapid Diagnostic Lab"
    ],
    contact: {
      phone: "+251 98 320 1998",
      email: "emergency@afilas.com",
      location: "Afilas General Hospital, Ground Floor, Main Entrance"
    },
    workingHours: "24/7 - 365 Days • Open 24 Hours"
  }
};

export default function DepartmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [activeTab, setActiveTab] = useState("overview");
  const [showBookingForm, setShowBookingForm] = useState(false);
  
  const department = departmentData[slug as keyof typeof departmentData];
  
  if (!department) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-32">
          <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Department Not Found</h1>
            <p className="text-foreground/70 mb-8">The department you're looking for doesn't exist.</p>
            <button
              onClick={() => router.push("/hospital")}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Hospital
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const IconComponent = department.icon;

  return (
    <>
      <Header />
      <main className="pt-24 lg:pt-32">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/30 blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl" />
          </div>
          <div className="container mx-auto px-4 py-12 lg:py-20 relative z-10">
            <button
              onClick={() => router.push("/hospital")}
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Hospital
            </button>
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-4 rounded-2xl ${department.bgColor} border ${department.borderColor}`}>
                <IconComponent className={`w-8 h-8 ${department.color}`} />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold">
                  {department.name}
                </h1>
                <p className="text-lg text-white/80 mt-2">
                  {department.description}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/10">
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{department.workingHours}</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/10">
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <Phone className="w-4 h-4" />
                  <span>{department.contact.phone}</span>
                </div>
              </div>
              <button
                onClick={() => setShowBookingForm(true)}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Book Appointment
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-24 lg:top-32 z-30">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto gap-1 py-4 no-scrollbar">
              {["overview", "services", "doctors", "facilities", "contact"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap capitalize ${
                    activeTab === tab
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-foreground/70 hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="container mx-auto px-4 py-12">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-12">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card border border-border rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-primary">{department.stats.patients}</div>
                  <div className="text-sm text-foreground/70 mt-1">Patients Served</div>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-primary">{department.stats.procedures}</div>
                  <div className="text-sm text-foreground/70 mt-1">Procedures Performed</div>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-green-500">{department.stats.successRate}</div>
                  <div className="text-sm text-foreground/70 mt-1">Success Rate</div>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6 text-center">
                  <div className="text-3xl font-bold text-primary">{department.stats.yearsOfService}</div>
                  <div className="text-sm text-foreground/70 mt-1">Years of Excellence</div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">About {department.name}</h2>
                <p className="text-foreground/80 leading-relaxed text-lg">
                  {department.longDescription}
                </p>
              </div>

              {/* Quick Links */}
              <div className="grid md:grid-cols-3 gap-6">
                <button
                  onClick={() => setActiveTab("services")}
                  className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition text-left group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${department.bgColor}`}>
                      <Activity className={`w-6 h-6 ${department.color}`} />
                    </div>
                    <h3 className="font-semibold text-foreground">Our Services</h3>
                  </div>
                  <p className="text-sm text-foreground/70">
                    Explore the comprehensive services we offer
                  </p>
                  <ChevronRight className="w-5 h-5 text-primary mt-3 group-hover:translate-x-1 transition" />
                </button>

                <button
                  onClick={() => setActiveTab("doctors")}
                  className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition text-left group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${department.bgColor}`}>
                      <Users className={`w-6 h-6 ${department.color}`} />
                    </div>
                    <h3 className="font-semibold text-foreground">Our Doctors</h3>
                  </div>
                  <p className="text-sm text-foreground/70">
                    Meet our experienced medical team
                  </p>
                  <ChevronRight className="w-5 h-5 text-primary mt-3 group-hover:translate-x-1 transition" />
                </button>

                <button
                  onClick={() => setActiveTab("contact")}
                  className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition text-left group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${department.bgColor}`}>
                      <Phone className={`w-6 h-6 ${department.color}`} />
                    </div>
                    <h3 className="font-semibold text-foreground">Contact Us</h3>
                  </div>
                  <p className="text-sm text-foreground/70">
                    Get in touch for appointments and inquiries
                  </p>
                  <ChevronRight className="w-5 h-5 text-primary mt-3 group-hover:translate-x-1 transition" />
                </button>
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === "services" && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-foreground">Our Services</h2>
              <p className="text-lg text-foreground/70">
                Comprehensive medical services provided by our {department.name} department
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {department.services.map((service, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 bg-card border border-border rounded-2xl p-4 hover:shadow-md transition"
                  >
                    <CheckCircle className={`w-5 h-5 ${department.color} flex-shrink-0 mt-0.5`} />
                    <span className="text-foreground">{service}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        

         

       
        </div>

        {/* Related Departments */}
        <section className="border-t border-border bg-card/50 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              Other Departments
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(departmentData)
                .filter(([key]) => key !== slug)
                .slice(0, 3)
                .map(([key, dept]) => {
                  const DeptIcon = dept.icon;
                  return (
                    <Link
                      key={key}
                      href={`/hospital/departments/${key}`}
                      className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition group"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${dept.bgColor}`}>
                          <DeptIcon className={`w-5 h-5 ${dept.color}`} />
                        </div>
                        <h3 className="font-semibold text-foreground">{dept.name}</h3>
                      </div>
                      <p className="text-sm text-foreground/70">{dept.description}</p>
                      <div className="flex items-center gap-2 text-primary font-semibold mt-3 group-hover:gap-3 transition text-sm">
                        Explore <ChevronRight className="w-4 h-4" />
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        </section>
      </main>

      {/* Booking Modal */}
      {showBookingForm && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setShowBookingForm(false)}
        >
          <div 
            className="bg-card border border-border rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-foreground">Book Appointment</h3>
              <button
                onClick={() => setShowBookingForm(false)}
                className="p-2 rounded-lg hover:bg-muted transition"
              >
                ✕
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-1">Full Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-1">Email Address</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-1">Phone Number</label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-1">Preferred Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-1">Message</label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Tell us about your concern..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Book Appointment
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}