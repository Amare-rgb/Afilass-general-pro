// lib/api/medicalServicesApi.ts
import axios from 'axios';

export interface MedicalService {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  details: string;
  createdAt?: string;
  updatedAt?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const medicalServicesApi = {
  // Get all medical services
  async getAllServices(): Promise<MedicalService[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/medical-services`);
      return response.data;
    } catch (error) {
      console.error('Error fetching medical services:', error);
      return getDefaultServices();
    }
  },

  // Get single medical service
  async getServiceById(id: string): Promise<MedicalService | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/medical-services/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching medical service:', error);
      return null;
    }
  },

  // Create medical service
  async createService(data: Omit<MedicalService, 'id'>): Promise<MedicalService> {
    const response = await axios.post(`${API_BASE_URL}/medical-services`, data);
    return response.data;
  },

  // Update medical service
  async updateService(id: string, data: Partial<MedicalService>): Promise<MedicalService> {
    const response = await axios.put(`${API_BASE_URL}/medical-services`, { id, ...data });
    return response.data;
  },

  // Delete medical service
  async deleteService(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/medical-services?id=${id}`);
  }
};

// Default services as fallback
function getDefaultServices(): MedicalService[] {
  return [
    {
      id: "ms1",
      title: "Emergency Care",
      description: "24/7 emergency medical services with rapid response teams.",
      icon: "Ambulance",
      color: "text-red-500",
      bgColor: "bg-red-100 dark:bg-red-950/30",
      details: "Our Emergency Department is equipped with advanced life support systems, dedicated trauma teams, and rapid diagnostic capabilities."
    },
    {
      id: "ms2",
      title: "Surgery Services",
      description: "Comprehensive surgical services including general, orthopedic, and cardiovascular surgery.",
      icon: "Hospital",
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-950/30",
      details: "Our surgical suites feature the latest technology including robotic-assisted surgery, minimally invasive procedures, and advanced monitoring systems."
    },
    {
      id: "ms3",
      title: "Diagnostic Imaging",
      description: "Advanced imaging services including MRI, CT, X-ray, ultrasound, and PET scans.",
      icon: "Microscope",
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-950/30",
      details: "Our diagnostic imaging center is equipped with the latest technology for accurate diagnosis."
    }
  ];
}