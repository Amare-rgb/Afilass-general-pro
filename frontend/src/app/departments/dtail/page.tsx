// D:\Afilass-general-pro\frontend\src\app\departments\dtail\page.tsx
"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageProvider";
import { 
  ArrowLeft, 
  Heart, 
  Brain, 
  Bone, 
  Shield, 
  Ambulance, 
  Users,
  Stethoscope,
  Loader2,
  Building2,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  User,
  Award,
  CheckCircle
} from "lucide-react";
import { useState, useEffect } from "react";

// Mapping function for icons based on department name
const getDepartmentIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('cardio') || lower.includes('heart')) 
    return { Icon: Heart, color: "text-red-500", bgColor: "bg-red-50 dark:bg-red-950/30", borderColor: "border-red-200 dark:border-red-800" };
  if (lower.includes('pediat') || lower.includes('child') || lower.includes('paed')) 
    return { Icon: Users, color: "text-blue-500", bgColor: "bg-blue-50 dark:bg-blue-950/30", borderColor: "border-blue-200 dark:border-blue-800" };
  if (lower.includes('brain') || lower.includes('neuro')) 
    return { Icon: Brain, color: "text-purple-500", bgColor: "bg-purple-50 dark:bg-purple-950/30", borderColor: "border-purple-200 dark:border-purple-800" };
  if (lower.includes('bone') || lower.includes('ortho')) 
    return { Icon: Bone, color: "text-green-500", bgColor: "bg-green-50 dark:bg-green-950/30", borderColor: "border-green-200 dark:border-green-800" };
  if (lower.includes('emergency') || lower.includes('trauma')) 
    return { Icon: Ambulance, color: "text-red-600", bgColor: "bg-red-50 dark:bg-red-950/30", borderColor: "border-red-200 dark:border-red-800" };
  if (lower.includes('oncol') || lower.includes('cancer')) 
    return { Icon: Shield, color: "text-orange-500", bgColor: "bg-orange-50 dark:bg-orange-950/30", borderColor: "border-orange-200 dark:border-orange-800" };
  return { Icon: Stethoscope, color: "text-indigo-500", bgColor: "bg-indigo-50 dark:bg-indigo-950/30", borderColor: "border-indigo-200 dark:border-indigo-800" };
};

// Main component that uses useSearchParams
function DepartmentDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();
  const departmentId = searchParams.get('id');
  
  const [department, setDepartment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDepartment = async () => {
      if (!departmentId) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch('http://localhost:5000/api/departments');
        const data = await res.json();
        
        if (data.success) {
          const found = data.data.find((dept: any) => dept.id === departmentId);
          
          if (found) {
            setDepartment(found);
            setError(false);
          } else {
            setError(true);
          }
        } else {
          setError(true);
        }
      } catch (error) {
        console.error('Failed to fetch department:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [departmentId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <div className="container mx-auto px-4 py-20 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-foreground/70">{t("departments.loading") || "Loading department details..."}</p>
          </div>
        </main>
      </div>
    );
  }

  // Error state - Department not found
  if (error || !department) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <div className="container mx-auto px-4 py-20 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-6">🔍</div>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                {t("departments.not_found") || "Department Not Found"}
              </h1>
              <p className="text-foreground/70 mb-8">
                {t("departments.not_found_message") || "The department you're looking for doesn't exist or has been removed."}
              </p>
              <button
                onClick={() => router.push("/departments")}
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition"
              >
                <ArrowLeft className="w-5 h-5" />
                {t("departments.back_to_all") || "Back to All Departments"}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const { Icon, color, bgColor, borderColor } = getDepartmentIcon(department.name);

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-blue-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-b border-border overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/30 blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl" />
          </div>
          
          <div className="container mx-auto px-4 py-10 md:py-14 relative z-10">
            <button
              onClick={() => router.push("/departments")}
              className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground mb-4 transition text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("departments.back") || "Back to Departments"}
            </button>
            
            <div className="max-w-4xl">
              <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full ${bgColor} border ${borderColor} mb-4`}>
                <Icon className={`w-5 h-5 ${color}`} />
                <span className={`font-medium text-sm ${color}`}>
                  {t("departments.department") || "Department"}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
                {department.name}
              </h1>
              
              <p className="text-base md:text-lg text-foreground/70 max-w-2xl">
                {department.description || `${department.name} ${t("departments.providing_care") || "department providing specialized medical care"}`}
              </p>
            </div>
          </div>
        </div>

        {/* Department Details */}
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-4xl mx-auto">
            {/* About Section */}
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Award className="w-6 h-6 text-primary" />
                {t("departments.about") || "About"} {department.name}
              </h2>
              <p className="text-foreground/80 leading-relaxed text-base">
                {department.description || `${department.name} ${t("departments.about_description") || "department provides comprehensive medical care for patients requiring specialized treatment. Our team of experienced healthcare professionals is dedicated to delivering the highest quality care using the latest medical technologies."}`}
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    {t("departments.services") || "Our Services"}
                  </h3>
                </div>
                <ul className="space-y-2 text-foreground/70 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    {t("departments.service_1") || "Specialized consultations"}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    {t("departments.service_2") || "Advanced diagnostics"}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    {t("departments.service_3") || "Treatment plans"}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    {t("departments.service_4") || "Follow-up care"}
                  </li>
                </ul>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    {t("departments.hours") || "Working Hours"}
                  </h3>
                </div>
                <ul className="space-y-2 text-foreground/70 text-sm">
                  <li className="flex items-center justify-between">
                    <span>{t("departments.weekdays") || "Monday - Friday"}</span>
                    <span className="font-medium">8:00 AM - 6:00 PM</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>{t("departments.saturday") || "Saturday"}</span>
                    <span className="font-medium">9:00 AM - 2:00 PM</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>{t("departments.sunday") || "Sunday"}</span>
                    <span className="font-medium text-primary">{t("departments.closed") || "Closed"}</span>
                  </li>
                  <li className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-primary font-medium">{t("departments.emergency") || "Emergency"}</span>
                    <span className="font-medium text-red-500">24/7</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact & Location */}
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                {t("departments.contact_location") || "Contact & Location"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-foreground/70 text-sm">
                    <Phone className="w-4 h-4 text-primary" />
                    <span>+251 98 320 1998</span>
                  </div>
                  <div className="flex items-center gap-3 text-foreground/70 text-sm">
                    <Mail className="w-4 h-4 text-primary" />
                    <span>info@afilas.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-foreground/70 text-sm">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{t("departments.location") || "Felege Hiwot Area, Lake Tana Shore, Bahir Dar"}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => router.push("/appointments/hospital")}
                    className="flex-1 bg-primary text-primary-foreground px-4 py-3 rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    {t("departments.book_appointment") || "Book Appointment"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

// Loading fallback for Suspense
function DepartmentDetailFallback() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <div className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-foreground/70">Loading department...</p>
        </div>
      </main>
    </div>
  );
}

// Main page component with Suspense boundary
export default function DepartmentDetailPage() {
  return (
    <Suspense fallback={<DepartmentDetailFallback />}>
      <DepartmentDetailContent />
    </Suspense>
  );
}