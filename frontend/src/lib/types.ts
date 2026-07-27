// lib/types.ts
export interface Department {
  id: string;
  name: string;
  nameAmharic?: string | null;
  slug: string;
  summary: string;
  details: string;
  description?: string;
  icon?: string | null;
  order: number;
  doctors?: Doctor[];
  services?: Service[];
  isActive?: boolean;
}

export interface ScheduleSlot {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isAvailable?: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  bio?: string | null;
  photoUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  departmentId: string;
  department?: Department;
  active: boolean;
  scheduleSlots?: ScheduleSlot[];
  specialization?: string;
  experience?: number;
  education?: string;
  rating?: number;
  consultationFee?: number;
}

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Appointment {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientAge?: number | null;
  patientGender?: string | null;
  departmentId?: string;
  department?: Department;
  doctorId?: string | null;
  doctor?: Doctor | null;
  serviceId?: string | null;
  service?: Service | null;
  appointmentDate: string;
  date?: string;
  time?: string;
  note?: string | null;
  notes?: string | null;
  symptoms?: string | null;
  isEmergency?: boolean;
  status: AppointmentStatus;
  location?: string | null; // ADD THIS LINE - Location field
  reminderSentAt?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  category: string;
  published: boolean;
  publishedAt: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  description?: string | null;
  caption?: string | null;
  type: 'IMAGE' | 'VIDEO';
  url: string;
  thumbnail?: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface DashboardSummary {
  totalAppointments: number;
  pendingAppointments: number;
  todaysAppointments: number;
  totalDoctors: number;
  totalDepartments: number;
  totalArticles: number;
  upcoming: Appointment[];
}

export interface Service {
  id: string;
  name: string;
  description?: string | null;
  price?: number | null;
  duration?: number | null;
  image?: string | null;
  departmentId: string;
  department?: Department;
  order?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

// Upload response
export interface UploadResponse {
  url: string;
  filename: string;
  success: boolean;
  message?: string;
}