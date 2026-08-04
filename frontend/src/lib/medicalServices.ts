// src/lib/medicalServices.ts
import axios from 'axios';

export interface Service {
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
  createdAt?: string;
  updatedAt?: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialization: string;
  department: string;
  active: boolean;
  email: string;
  phone: string;
  availableDays: string[];
  availableTime: string;
  image?: string;
  experience?: string;
  education?: string;
  bio?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ============================================================
// MOCK DOCTORS
// ============================================================
const mockDoctors: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Abebe Kebede',
    title: 'Dr.',
    specialization: 'Cardiology',
    department: 'Cardiology',
    active: true,
    email: 'abebe.kebede@afilas.com',
    phone: '+251 911 000 001',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    availableTime: '9:00 AM - 5:00 PM',
    image: '/doctors/doctor-1.jpg',
    experience: '15 years',
    education: 'MD, Addis Ababa University',
    bio: 'Dr. Abebe Kebede is a renowned cardiologist with over 15 years of experience.'
  },
  {
    id: 'doc-2',
    name: 'Dr. Selam Tesfaye',
    title: 'Dr.',
    specialization: 'Pediatrics',
    department: 'Pediatrics',
    active: true,
    email: 'selam.tesfaye@afilas.com',
    phone: '+251 911 000 002',
    availableDays: ['Tuesday', 'Thursday', 'Saturday'],
    availableTime: '9:00 AM - 5:00 PM',
    image: '/doctors/doctor-2.jpg',
    experience: '10 years',
    education: 'MD, Gondar University',
    bio: 'Dr. Selam Tesfaye is a compassionate pediatrician dedicated to children\'s health.'
  },
  {
    id: 'doc-3',
    name: 'Dr. Yonas Worku',
    title: 'Dr.',
    specialization: 'Orthopedics',
    department: 'Orthopedics',
    active: true,
    email: 'yonas.worku@afilas.com',
    phone: '+251 911 000 003',
    availableDays: ['Monday', 'Tuesday', 'Thursday'],
    availableTime: '8:00 AM - 4:00 PM',
    image: '/doctors/doctor-3.jpg',
    experience: '12 years',
    education: 'MD, Jimma University',
    bio: 'Dr. Yonas Worku is an experienced orthopedic surgeon.'
  },
  {
    id: 'doc-4',
    name: 'Dr. Tigist Hailu',
    title: 'Dr.',
    specialization: 'Gynecology',
    department: 'Gynecology',
    active: true,
    email: 'tigist.hailu@afilas.com',
    phone: '+251 911 000 004',
    availableDays: ['Wednesday', 'Friday', 'Saturday'],
    availableTime: '9:00 AM - 6:00 PM',
    image: '/doctors/doctor-4.jpg',
    experience: '8 years',
    education: 'MD, Bahir Dar University',
    bio: 'Dr. Tigist Hailu is a dedicated gynecologist.'
  }
];

// ============================================================
// SIMPLE MOCK SERVICES - Just enough to satisfy the backend
// ============================================================
const mockServices: Service[] = [
  {
    id: 'gen-consult',
    name: 'General Consultation',
    description: 'Standard general medical consultation',
    price: 50,
    duration: 30,
    image: null,
    departmentId: null,
    location: 'Afilas General Hospital',
    isActive: true,
    department: {
      id: 'dept-1',
      name: 'General Medicine'
    }
  }
];

// ============================================================
// SERVICES API - MINIMAL VERSION
// ============================================================
export const servicesApi = {
  // Get all services - returns mock data directly (no API call)
  async getAllServices(): Promise<Service[]> {
    console.log('📋 Using mock services data');
    return mockServices;
  },

  // Get active services - returns mock data directly (no API call)
  async getActiveServices(): Promise<Service[]> {
    console.log('📋 Using mock active services data');
    return mockServices.filter(s => s.isActive === true);
  },

  // Get single service
  async getServiceById(id: string): Promise<Service | null> {
    return mockServices.find(s => s.id === id) || null;
  },

  // Get services by department
  async getServicesByDepartment(departmentId: string): Promise<Service[]> {
    return mockServices.filter(s => s.department?.id === departmentId);
  },

  // Get all doctors - tries API first, falls back to mock
  async getDoctors(filters?: { active?: boolean }): Promise<Doctor[]> {
    try {
      console.log('Fetching doctors from API...');
      const response = await api.get('/doctors');
      console.log('Doctors API Response:', response.data);
      
      if (response.data && response.data.data && response.data.data.length > 0) {
        let result = response.data.data;
        if (filters?.active !== undefined) {
          result = result.filter((d: Doctor) => d.active === filters.active);
        }
        return result;
      } else {
        console.log('No doctors from API, using mock data');
        let result = mockDoctors;
        if (filters?.active !== undefined) {
          result = result.filter(d => d.active === filters.active);
        }
        return result;
      }
    } catch (error) {
      console.error('Error fetching doctors, using mock data:', error);
      let result = mockDoctors;
      if (filters?.active !== undefined) {
        result = result.filter(d => d.active === filters.active);
      }
      return result;
    }
  },

  // Get a single doctor by ID
  async getDoctorById(id: string): Promise<Doctor | null> {
    try {
      const response = await api.get(`/doctors/${id}`);
      return response.data.data || null;
    } catch (error) {
      console.error('Error fetching doctor:', error);
      return mockDoctors.find(d => d.id === id) || null;
    }
  },

  // Get doctors by department
  async getDoctorsByDepartment(department: string): Promise<Doctor[]> {
    try {
      const response = await api.get(`/doctors/department/${department}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching doctors by department:', error);
      return mockDoctors.filter(d => d.department === department);
    }
  },

  // Search doctors
  async searchDoctors(query: string): Promise<Doctor[]> {
    try {
      const response = await api.get(`/doctors/search?q=${query}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error searching doctors:', error);
      const lowerQuery = query.toLowerCase();
      return mockDoctors.filter(d => 
        d.name.toLowerCase().includes(lowerQuery) ||
        d.specialization?.toLowerCase().includes(lowerQuery) ||
        d.department?.toLowerCase().includes(lowerQuery)
      );
    }
  },

  // Search services - uses mock data
  async searchServices(query: string): Promise<Service[]> {
    console.log('📋 Searching services in mock data');
    const lowerQuery = query.toLowerCase();
    return mockServices.filter(s => 
      s.name.toLowerCase().includes(lowerQuery) ||
      (s.department && s.department.name && s.department.name.toLowerCase().includes(lowerQuery))
    );
  }
};

// Default export
export default servicesApi;