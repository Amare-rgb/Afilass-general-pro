// lib/medicalServices.ts
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

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Fallback mock data
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
    isActive: true,
    department: undefined
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
    isActive: true,
    department: undefined
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
    isActive: true,
    department: undefined
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
    isActive: true,
    department: undefined
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
    isActive: true,
    department: undefined
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
    isActive: true,
    department: undefined
  }
];

export const servicesApi = {
  // Get all services with fallback to mock data
  async getAllServices(): Promise<Service[]> {
    try {
      console.log('Fetching services from API...');
      const response = await api.get('/services');
      console.log('API Response:', response.data);
      
      if (response.data && response.data.data && response.data.data.length > 0) {
        return response.data.data;
      } else {
        console.log('No services from API, using mock data');
        return mockServices;
      }
    } catch (error) {
      console.error('Error fetching services, using mock data:', error);
      return mockServices;
    }
  },

  // Get single service
  async getServiceById(id: string): Promise<Service | null> {
    try {
      const response = await api.get(`/services/${id}`);
      return response.data.data || null;
    } catch (error) {
      console.error('Error fetching service:', error);
      return mockServices.find(s => s.id === id) || null;
    }
  },

  // Get services by department
  async getServicesByDepartment(departmentId: string): Promise<Service[]> {
    try {
      const response = await api.get(`/services/department/${departmentId}`);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching services by department:', error);
      return mockServices;
    }
  }
};