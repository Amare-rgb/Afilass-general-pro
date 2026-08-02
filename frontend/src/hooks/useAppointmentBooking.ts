// src/hooks/useAppointmentBooking.ts
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api, getApiErrorMessage, isApiSuccess, extractApiData } from '@/lib/api';
import { Department, Doctor, Service, Appointment } from '@/lib/types';
import { toast } from 'sonner';

// Zod Schema for form validation - FIXED: Removed .default() from all fields
export const appointmentSchema = z.object({
  // Step 1: Personal Information
  patientName: z.string().min(2, 'Full name is required').max(100, 'Name is too long'),
  patientEmail: z.string().email('Valid email is required'),
  patientPhone: z.string().min(10, 'Valid phone number is required'),
  patientAddress: z.string().optional(),
  patientAge: z.number().min(0, 'Age must be positive').max(150, 'Invalid age').optional(),
  patientGender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),

  // Step 2: Emergency & Visit Type
  isEmergency: z.boolean(),
  visitType: z.enum(['HOSPITAL', 'HOME_CARE']),
  homeAddress: z.string().optional(),
  homeNotes: z.string().optional(),
  requesterType: z.enum(['INDIVIDUAL', 'ORGANIZATION']),
  organizationName: z.string().optional(),

  // Step 3: Medical History
  isReturningPatient: z.boolean(),
  hasMedicalRecords: z.boolean(),
  previousVisitDate: z.string().optional(),
  medicalNotes: z.string().optional(),
  symptoms: z.string().optional(),
  requestInitialAssessment: z.boolean(),

  // Step 4: Scheduling
  departmentId: z.string().min(1, 'Department is required'),
  doctorId: z.string().min(1, 'Doctor is required'),
  serviceId: z.string().min(1, 'Service is required'),
  appointmentDate: z.string().min(1, 'Date is required'),
  appointmentTime: z.string().min(1, 'Time is required'),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;

// Create default values that match the schema exactly
const defaultValues: AppointmentFormData = {
  patientName: '',
  patientEmail: '',
  patientPhone: '',
  patientAddress: '',
  patientAge: undefined,
  patientGender: undefined,
  isEmergency: false,
  visitType: 'HOSPITAL',
  homeAddress: '',
  homeNotes: '',
  requesterType: 'INDIVIDUAL',
  organizationName: '',
  isReturningPatient: false,
  hasMedicalRecords: false,
  previousVisitDate: '',
  medicalNotes: '',
  symptoms: '',
  requestInitialAssessment: false,
  departmentId: '',
  doctorId: '',
  serviceId: '',
  appointmentDate: '',
  appointmentTime: '',
};

export function useAppointmentBooking() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: defaultValues,
  });

  // Load data
  useEffect(() => {
    async function loadData() {
      try {
        const [deptsRes, doctorsRes, servicesRes] = await Promise.all([
          api.getDepartments(),
          api.getDoctors({ active: true }),
          api.getServices({ isActive: true }),
        ]);

        setDepartments(extractApiData<Department[]>(deptsRes) || []);
        setDoctors(extractApiData<Doctor[]>(doctorsRes) || []);
        setServices(extractApiData<Service[]>(servicesRes) || []);
      } catch (error) {
        console.error('Failed to load data:', error);
        toast.error(getApiErrorMessage(error) || 'Failed to load required data');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Submit appointment
  const submitAppointment = async (data: AppointmentFormData): Promise<Appointment | null> => {
    setIsSubmitting(true);
    
    try {
      const payload = {
        ...data,
        location: data.visitType === 'HOME_CARE' ? 'Home Care' : 'Afilas General Hospital',
        patientAddress: data.visitType === 'HOME_CARE' ? data.homeAddress : data.patientAddress,
        notes: data.symptoms || data.medicalNotes || '',
      };

      const response = await api.createAppointment(payload);
      
      if (isApiSuccess(response)) {
        toast.success('Appointment booked successfully! 🎉');
        return extractApiData<Appointment>(response);
      } else {
        // Fix: Safely access message property
        const errorMsg = response && typeof response === 'object' && 'message' in response 
          ? String(response.message) 
          : 'Failed to book appointment';
        toast.error(errorMsg);
        return null;
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(getApiErrorMessage(error) || 'Failed to book appointment');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    departments,
    doctors,
    services,
    loading,
    isSubmitting,
    submitAppointment,
  };
}