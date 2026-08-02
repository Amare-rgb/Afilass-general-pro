// src/app/appointments/hospital/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
  PhoneCall,
  Crosshair,
  Navigation
} from 'lucide-react';
import { toast } from 'sonner';
import { appointmentService } from '@/lib/appointment';
import { medicalServices } from '@/lib/medicalServices';
import { Appointment, Doctor, Service } from '@/lib/types';

// ============================================================
// SCHEMA DEFINITION
// ============================================================
const hospitalBookingSchema = z.object({
  isEmergency: z.boolean(),
  visitType: z.enum(['HOSPITAL', 'HOME_CARE']),
  city: z.string().optional(),
  subCity: z.string().optional(),
  woreda: z.string().optional(),
  homeAddress: z.string().optional(),
  gpsPin: z.string().optional(),
  patientName: z.string().min(2, 'Full name is required'),
  patientPhone: z.string().min(10, 'Valid phone number is required'),
  patientEmail: z.string().email('Valid email is required'),
  patientType: z.enum(['RETURNING', 'NEW']),
  medicalHistory: z.string().optional(),
  appointmentDate: z.string().min(1, 'Date is required'),
  timeSlot: z.enum(['MORNING', 'AFTERNOON', 'EVENING']),
  doctorId: z.string().optional(),
  serviceId: z.string().optional(),
});

type HospitalBookingData = z.infer<typeof hospitalBookingSchema>;

// ============================================================
// STEP COMPONENTS
// ============================================================

// Step 1: Emergency Check
function EmergencyStep({ form, watch, setValue }: { form: any; watch: any; setValue: any }) {
  const isEmergency = watch('isEmergency');

  return (
    <div className="space-y-4">
      <div className="border-b border-gray-100 dark:border-gray-700 pb-2">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          Emergency Check
        </h3>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Confirm if this is a medical emergency
        </p>
      </div>

      <div className={`p-4 border-2 rounded-lg transition-all duration-200 ${
        isEmergency 
          ? 'border-red-500 bg-red-50 dark:bg-red-950/30 shadow-lg shadow-red-100 dark:shadow-red-900/20' 
          : 'border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-700'
      }`}>
        <div className="flex items-start gap-3">
          <div className="relative mt-0.5">
            <input
              type="checkbox"
              checked={isEmergency}
              onChange={(e) => setValue('isEmergency', e.target.checked)}
              className="w-5 h-5 text-red-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:ring-offset-2 cursor-pointer transition-all"
            />
          </div>
          <div className="flex-1">
            <label className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 flex-wrap">
              <span>Is this an Emergency?</span>
              <span className="text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded-full border border-red-200 dark:border-red-800 animate-pulse">
                ⚠️ Urgent
              </span>
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Check if you or someone else needs immediate medical attention
            </p>
            {!isEmergency && (
              <p className="text-[10px] text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                <Check className="w-3 h-3" />
                Proceed with standard booking
              </p>
            )}
          </div>
        </div>

        {isEmergency && (
          <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/30 border-2 border-red-400 dark:border-red-600 rounded-xl shadow-lg shadow-red-200 dark:shadow-red-900/30 animate-in slide-in-from-top duration-300">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-red-800 dark:text-red-200 flex items-center gap-2 flex-wrap">
                  ⚠️ Emergency Detected
                  <span className="text-[10px] font-normal bg-red-200 dark:bg-red-800/50 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full animate-pulse">
                    Call Now
                  </span>
                </h4>
                <p className="text-xs text-red-700 dark:text-red-300 mt-1 font-medium">
                  Please call our emergency hotline for immediate assistance:
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href="tel:+251911000000"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-bold rounded-lg transition-all shadow-md hover:shadow-lg hover:shadow-red-500/30 transform hover:-translate-y-0.5"
                  >
                    <PhoneCall className="w-4 h-4" />
                    +251 911 000 000
                  </a>
                  <a
                    href="tel:+251911000001"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/50 text-red-700 dark:text-red-300 text-sm font-bold rounded-lg transition-all border-2 border-red-300 dark:border-red-700 hover:border-red-500"
                  >
                    <PhoneCall className="w-4 h-4" />
                    +251 911 000 001
                  </a>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-red-600 dark:text-red-400 bg-white/50 dark:bg-black/20 p-2 rounded-lg">
                  <span className="font-medium text-base">📍</span>
                  <span>Emergency Department - Ground Floor, East Wing</span>
                </div>
                <button
                  type="button"
                  onClick={() => setValue('isEmergency', false)}
                  className="mt-3 text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 hover:underline font-medium transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-3 h-3" />
                  Not an emergency? Continue with standard booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Step 2: Service Type
function ServiceTypeStep({ form, watch, setValue }: { form: any; watch: any; setValue: any }) {
  const visitType = watch('visitType');
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-4">
      <div className="border-b border-gray-100 dark:border-gray-700 pb-2">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          Service Type
        </h3>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Choose how you'd like to receive care
        </p>
      </div>

      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setValue('visitType', 'HOSPITAL')}
          className={`w-full p-3 border rounded-lg text-left transition-all ${
            visitType === 'HOSPITAL'
              ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-sm'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <div className="text-sm font-medium text-gray-900 dark:text-white">In-Hospital Visit</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Visit us at Afilas General Hospital
          </div>
          <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
            Bole Sub-city, Addis Ababa
          </div>
        </button>

        <button
          type="button"
          onClick={() => setValue('visitType', 'HOME_CARE')}
          className={`w-full p-3 border rounded-lg text-left transition-all ${
            visitType === 'HOME_CARE'
              ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-sm'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <div className="text-sm font-medium text-gray-900 dark:text-white">Home Care Visit</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Doctor visits you at home
          </div>
          <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
            Available within Addis Ababa
          </div>
        </button>
      </div>

      {errors.visitType && (
        <p className="text-xs text-red-600">{errors.visitType.message}</p>
      )}

      {/* Home Care Address Fields */}
      {visitType === 'HOME_CARE' && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Home Address Details
          </p>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                City
              </label>
              <input
                {...register('city')}
                type="text"
                placeholder="Addis Ababa"
                className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                Sub-City
              </label>
              <input
                {...register('subCity')}
                type="text"
                placeholder="Bole"
                className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                Woreda
              </label>
              <input
                {...register('woreda')}
                type="text"
                placeholder="Woreda 03"
                className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                GPS Pin / Location
              </label>
              <div className="relative">
                <input
                  {...register('gpsPin')}
                  type="text"
                  placeholder="Click crosshair to get your current location"
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-green-500 dark:bg-gray-700 dark:text-white pr-10"
                  readOnly
                />
                <button
                  type="button"
                  onClick={() => {
                    if ('geolocation' in navigator) {
                      toast.info('Getting your location...');
                      navigator.geolocation.getCurrentPosition(
                        (position) => {
                          const { latitude, longitude } = position.coords;
                          const gpsString = `${latitude.toFixed(6)}° N, ${longitude.toFixed(6)}° E`;
                          setValue('gpsPin', gpsString);
                          toast.success('Location captured successfully! 📍');
                        },
                        (error) => {
                          console.error('Geolocation error:', error);
                          let errorMessage = 'Unable to get location. ';
                          switch(error.code) {
                            case error.PERMISSION_DENIED:
                              errorMessage += 'Please allow location access in your browser settings.';
                              break;
                            case error.POSITION_UNAVAILABLE:
                              errorMessage += 'Location information is unavailable.';
                              break;
                            case error.TIMEOUT:
                              errorMessage += 'Location request timed out. Please try again.';
                              break;
                            default:
                              errorMessage += 'Please enter your location manually.';
                          }
                          toast.error(errorMessage);
                        },
                        { 
                          enableHighAccuracy: true,
                          timeout: 10000,
                          maximumAge: 0
                        }
                      );
                    } else {
                      toast.error('Geolocation is not supported by your browser. Please enter your location manually.');
                    }
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                  title="Get current location"
                >
                  <Crosshair className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 flex items-center gap-1">
                <Navigation className="w-3 h-3" />
                Click the crosshair icon to use your device's GPS
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                Detailed Address
              </label>
              <textarea
                {...register('homeAddress')}
                rows={2}
                placeholder="House number, building, landmarks..."
                className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Step 3: Patient Information
function PatientInfoStep({ form }: { form: any }) {
  const { register, watch, formState: { errors } } = form;
  const patientType = watch('patientType');

  return (
    <div className="space-y-4">
      <div className="border-b border-gray-100 dark:border-gray-700 pb-2">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          Patient Information
        </h3>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Provide your contact details
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
            Full Name *
          </label>
          <input
            {...register('patientName')}
            type="text"
            placeholder="Enter your full name"
            className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
          />
          {errors.patientName && (
            <p className="mt-0.5 text-xs text-red-600">{errors.patientName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
            Phone Number *
          </label>
          <input
            {...register('patientPhone')}
            type="tel"
            placeholder="+251 9XX XXX XXX"
            className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
          />
          {errors.patientPhone && (
            <p className="mt-0.5 text-xs text-red-600">{errors.patientPhone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
            Email Address *
          </label>
          <input
            {...register('patientEmail')}
            type="email"
            placeholder="your@email.com"
            className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
          />
          {errors.patientEmail && (
            <p className="mt-0.5 text-xs text-red-600">{errors.patientEmail.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Patient Type *
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => form.setValue('patientType', 'RETURNING')}
              className={`p-2 border rounded-lg text-center transition-all text-sm ${
                patientType === 'RETURNING'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-gray-900 dark:text-white">Returning</div>
              <div className="text-[10px] text-gray-500">Has visited before</div>
            </button>
            <button
              type="button"
              onClick={() => form.setValue('patientType', 'NEW')}
              className={`p-2 border rounded-lg text-center transition-all text-sm ${
                patientType === 'NEW'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-gray-900 dark:text-white">New Patient</div>
              <div className="text-[10px] text-gray-500">First time visit</div>
            </button>
          </div>
          {errors.patientType && (
            <p className="mt-0.5 text-xs text-red-600">{errors.patientType.message}</p>
          )}
        </div>

        {patientType === 'NEW' && (
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
              Brief Medical History
            </label>
            <textarea
              {...register('medicalHistory')}
              rows={2}
              placeholder="Describe your symptoms or reason for visit..."
              className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Step 4: Scheduling
function SchedulingStep({ form, doctors, services }: { form: any; doctors: Doctor[]; services: Service[] }) {
  const { register, formState: { errors }, watch } = form;

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-gray-100 dark:border-gray-700 pb-2">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          Schedule Appointment
        </h3>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Select your preferred date and time
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
            Doctor *
          </label>
          <select
            {...register('doctorId')}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select a doctor</option>
            {doctors.filter(d => d.active !== false).map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.title} {doctor.name} - {doctor.specialization || 'General'}
              </option>
            ))}
          </select>
          {errors.doctorId && (
            <p className="mt-0.5 text-xs text-red-600">{errors.doctorId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
            Service *
          </label>
          <select
            {...register('serviceId')}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select a service</option>
            {services.filter(s => s.isActive !== false).map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} {service.price ? `- $${service.price}` : ''}
              </option>
            ))}
          </select>
          {errors.serviceId && (
            <p className="mt-0.5 text-xs text-red-600">{errors.serviceId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
            Appointment Date *
          </label>
          <select
            {...register('appointmentDate')}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select a date</option>
            {getAvailableDates().map((date) => (
              <option key={date} value={date}>
                {new Date(date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </option>
            ))}
          </select>
          {errors.appointmentDate && (
            <p className="mt-0.5 text-xs text-red-600">{errors.appointmentDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Time Slot *
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => form.setValue('timeSlot', 'MORNING')}
              className={`p-2 border rounded-lg text-center transition-all ${
                form.watch('timeSlot') === 'MORNING'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="text-xs font-medium text-gray-900 dark:text-white">Morning</div>
              <div className="text-[10px] text-gray-500">8:00 - 12:00</div>
            </button>
            <button
              type="button"
              onClick={() => form.setValue('timeSlot', 'AFTERNOON')}
              className={`p-2 border rounded-lg text-center transition-all ${
                form.watch('timeSlot') === 'AFTERNOON'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="text-xs font-medium text-gray-900 dark:text-white">Afternoon</div>
              <div className="text-[10px] text-gray-500">1:00 - 5:00</div>
            </button>
            <button
              type="button"
              onClick={() => form.setValue('timeSlot', 'EVENING')}
              className={`p-2 border rounded-lg text-center transition-all ${
                form.watch('timeSlot') === 'EVENING'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="text-xs font-medium text-gray-900 dark:text-white">Evening</div>
              <div className="text-[10px] text-gray-500">5:00 - 9:00</div>
            </button>
          </div>
          {errors.timeSlot && (
            <p className="mt-0.5 text-xs text-red-600">{errors.timeSlot.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function HospitalBookingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingData, setBookingData] = useState<HospitalBookingData | null>(null);
  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const form = useForm<HospitalBookingData>({
    resolver: zodResolver(hospitalBookingSchema),
    defaultValues: {
      isEmergency: false,
      visitType: 'HOSPITAL',
      patientType: 'RETURNING',
      timeSlot: 'MORNING',
    },
  });

  const { watch, handleSubmit, trigger, setValue } = form;
  const isEmergency = watch('isEmergency');

  // Load doctors and services using the medicalServices
  useEffect(() => {
    async function loadData() {
      try {
        const [doctorsData, servicesData] = await Promise.all([
          medicalServices.getDoctors({ active: true }),
          medicalServices.getServices({ isActive: true })
        ]);
        
        setDoctors(doctorsData);
        setServices(servicesData);
        console.log('✅ Loaded doctors:', doctorsData.length);
        console.log('✅ Loaded services:', servicesData.length);
      } catch (error) {
        console.error('❌ Failed to load data:', error);
        toast.error('Failed to load doctors and services');
      } finally {
        setLoadingData(false);
      }
    }
    loadData();
  }, []);

  const steps = [
    { id: 0, title: 'Emergency' },
    { id: 1, title: 'Service' },
    { id: 2, title: 'Patient' },
    { id: 3, title: 'Schedule' },
  ];

  const getStepContent = () => {
    switch (currentStep) {
      case 0:
        return <EmergencyStep form={form} watch={watch} setValue={setValue} />;
      case 1:
        return <ServiceTypeStep form={form} watch={watch} setValue={setValue} />;
      case 2:
        return <PatientInfoStep form={form} />;
      case 3:
        return <SchedulingStep form={form} doctors={doctors} services={services} />;
      default:
        return null;
    }
  };

  if (isEmergency) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 dark:bg-red-950/30 p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 border-2 border-red-400 dark:border-red-600">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-xl font-bold text-red-800 dark:text-red-200">
              🚨 Emergency Detected
            </h1>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
              Call our emergency hotline immediately:
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
              <a
                href="tel:+251911000000"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition shadow-lg hover:shadow-red-500/30 text-lg font-bold"
              >
                <PhoneCall className="w-5 h-5" />
                +251 911 000 000
              </a>
              <a
                href="tel:+251911000001"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/50 transition border-2 border-red-300 dark:border-red-700 text-lg font-bold"
              >
                <PhoneCall className="w-5 h-5" />
                +251 911 000 001
              </a>
            </div>
            <p className="mt-3 text-xs text-red-600 dark:text-red-400">
              📍 Emergency Department - Ground Floor, East Wing
            </p>
            <button
              onClick={() => setValue('isEmergency', false)}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 underline"
            >
              ← Not an emergency? Back to booking
            </button>
          </div>
        </div>
      </div>
    );
  }

  const canProceed = async () => {
    let fields: (keyof HospitalBookingData)[] = [];
    switch (currentStep) {
      case 0:
        return true;
      case 1:
        fields = ['visitType'];
        if (watch('visitType') === 'HOME_CARE') {
          fields = ['visitType', 'city', 'subCity', 'woreda', 'homeAddress'];
        }
        break;
      case 2:
        fields = ['patientName', 'patientPhone', 'patientEmail', 'patientType'];
        if (watch('patientType') === 'NEW') {
          fields.push('medicalHistory');
        }
        break;
      case 3:
        fields = ['doctorId', 'serviceId', 'appointmentDate', 'timeSlot'];
        break;
    }

    const isValid = await trigger(fields);
    if (!isValid) {
      toast.error('Please fill in all required fields');
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    const canContinue = await canProceed();
    if (!canContinue) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const onSubmit = async (data: HospitalBookingData) => {
    setIsSubmitting(true);
    try {
      // Convert timeSlot to time string
      const timeMap: Record<string, string> = {
        MORNING: '09:00',
        AFTERNOON: '14:00',
        EVENING: '17:00',
      };

      // Use selected doctor and service or fallback to first available
      const doctorId = data.doctorId || (doctors.length > 0 ? doctors[0].id : '');
      const serviceId = data.serviceId || (services.length > 0 ? services[0].id : '');

      if (!doctorId || !serviceId) {
        toast.error('No doctors or services available. Please contact support.');
        setIsSubmitting(false);
        return;
      }

      // Prepare payload for API
      const payload = {
        patientName: data.patientName,
        patientEmail: data.patientEmail,
        patientPhone: data.patientPhone,
        patientAge: null,
        patientGender: null,
        date: data.appointmentDate,
        time: timeMap[data.timeSlot] || '09:00',
        doctorId: doctorId,
        serviceId: serviceId,
        location: data.visitType === 'HOME_CARE' ? 'Home Care' : 'Afilas General Hospital',
        notes: data.medicalHistory || '',
        symptoms: data.medicalHistory || '',
        isEmergency: data.isEmergency || false,
      };

      console.log('📤 Submitting appointment:', payload);
      
      // Use the appointment service to create the appointment
      const appointment = await appointmentService.createAppointment(payload);
      console.log('✅ Appointment created:', appointment);
      
      setCreatedAppointment(appointment);
      setBookingData(data);
      setShowConfirmation(true);
      toast.success('Appointment booked successfully! 🎉');
    } catch (error: any) {
      console.error('❌ Booking error:', error);
      toast.error(error.message || 'Failed to book appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showConfirmation && bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Confirmed! ✅
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your appointment has been booked.
            </p>
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-left space-y-1">
              <p className="text-xs text-gray-600 dark:text-gray-300">
                <span className="font-medium">Patient:</span> {bookingData.patientName}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                <span className="font-medium">Date:</span>{' '}
                {new Date(bookingData.appointmentDate).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                <span className="font-medium">Time:</span> {bookingData.timeSlot}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                <span className="font-medium">Visit Type:</span>{' '}
                {bookingData.visitType === 'HOME_CARE' ? 'Home Care' : 'Hospital Visit'}
              </p>
              {createdAppointment && (
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Booking ID:</span>{' '}
                  <span className="font-mono text-blue-600 dark:text-blue-400">
                    {createdAppointment.id.slice(0, 8)}
                  </span>
                </p>
              )}
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
              >
                Home
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-300 transition"
              >
                Print
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 px-6 py-4">
            <h1 className="text-xl font-bold text-white text-center">
              General Hospital
            </h1>
            <p className="text-sm text-green-100 text-center mt-0.5">
              Book your appointment
            </p>
          </div>

          {/* Card Body */}
          <div className="p-5">
            {/* Progress Steps */}
            <div className="mb-6">
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold bg-green-600 text-white shadow-sm">
                    {currentStep + 1}
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    of {steps.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="min-h-[300px]">
                {loadingData ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-green-600" />
                    <span className="ml-2 text-sm text-gray-500">Loading...</span>
                  </div>
                ) : (
                  getStepContent()
                )}
              </div>

              {/* Navigation */}
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePrevious}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-colors ${
                    currentStep === 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>

                {currentStep < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition shadow-sm"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || loadingData}
                    className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Booking...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Book
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}