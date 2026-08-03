// lib/medicalServices.ts
import axios from 'axios';

export interface MedicalService {
  id: string;
  name?: string;
  title?: string;
  description: string;
  price?: number | null;
  duration?: number | null;
  image?: string | null;
  isActive?: boolean;
  location?: string | null;
  category?: string | null;
  createdAt?: string;
  updatedAt?: string;
  icon?: string;
  color?: string;
  bgColor?: string;
  details?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const medicalServicesApi = {
  // Get all medical services (supports optional location parameter)
  async getAllServices(location: string ): Promise<MedicalService[]> {
    try {
      const url = location
        ? `${API_BASE_URL}/services?location=${encodeURIComponent(location)}`
        : `${API_BASE_URL}/services`;
        
      const response = await axios.get(url);
      
      let servicesData: MedicalService[] = [];
      if (response.data) {
        if (Array.isArray(response.data)) {
          servicesData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          servicesData = response.data.data;
        } else if (response.data.services && Array.isArray(response.data.services)) {
          servicesData = response.data.services;
        }
      }
      return servicesData;
    } catch (error) {
      console.error('Error fetching medical services:', error);
      return [];
    }
  },

  // Get single medical service
  async getServiceById(id: string): Promise<MedicalService | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/services/${id}`);
      return response.data?.data || response.data || null;
    } catch (error) {
      console.error('Error fetching medical service:', error);
      return null;
    }
  },

  // Create medical service
  async createService(data: Omit<MedicalService, 'id'>): Promise<MedicalService> {
    const response = await axios.post(`${API_BASE_URL}/services`, data);
    return response.data?.data || response.data;
  },

  // Update medical service
  async updateService(id: string, data: Partial<MedicalService>): Promise<MedicalService> {
    const response = await axios.put(`${API_BASE_URL}/services/${id}`, data);
    return response.data?.data || response.data;
  },

  // Delete medical service
  async deleteService(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/services/${id}`);
  }
};