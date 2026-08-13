'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Check,
  Loader2,
  User,
  Phone,
  Mail,
  Stethoscope,
  FileText,
  MapPin,
  Crosshair,
  Navigation,
  Home,
  ChevronRight,
  ChevronLeft,
  UserCircle,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/api';
import { Appointment } from '@/lib/types';

// ============================================================
// SCHEMA DEFINITION
// ============================================================
const hospitalBookingSchema = z.object({
  // Step 1: Personal Information
  patientName: z.string().min(2, 'Full name is required'),
  patientPhone: z.string().min(10, 'Valid phone number is required'),
  patientEmail: z.string().email('A valid email is required'),
  patientAge: z.string().optional(),
  patientGender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),

  // Step 2: Visit Details
  symptoms: z.string().optional(),
  notes: z.string().optional(),
  visitType: z.enum(['HOSPITAL', 'HOME']),
  city: z.string().optional(),
  subCity: z.string().optional(),
  woreda: z.string().optional(),
  homeAddress: z.string().optional(),
  gpsPin: z.string().optional(),
});

type HospitalBookingData = z.infer<typeof hospitalBookingSchema>;

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function HospitalBookingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingData, setBookingData] = useState<HospitalBookingData | null>(null);
  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [errorDetails, setErrorDetails] = useState<string>('');

  const { register, handleSubmit, watch, setValue, trigger, formState: { errors } } = useForm<HospitalBookingData>({
    resolver: zodResolver(hospitalBookingSchema),
    defaultValues: {
      patientName: '',
      patientPhone: '',
      patientEmail: '',
      patientAge: '',
      patientGender: undefined,
      symptoms: '',
      notes: '',
      visitType: 'HOSPITAL',
      city: '',
      subCity: '',
      woreda: '',
      homeAddress: '',
      gpsPin: '',
    },
  });

  const visitType = watch('visitType');

  useEffect(() => {
    setLoadingData(false);
  }, []);

  const getCurrentLocation = () => {
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
          toast.error('Unable to get location. Please enter manually.');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser.');
    }
  };

  const nextStep = async () => {
    const step1Fields: (keyof HospitalBookingData)[] = ['patientName', 'patientPhone', 'patientEmail'];
    const isValid = await trigger(step1Fields);
    if (isValid) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (data: HospitalBookingData) => {
    setIsSubmitting(true);
    setErrorDetails('');

    try {
      // Get current date and time
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const appointmentDate = `${year}-${month}-${day}`;
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const timeSlot = `${hours}:${minutes}`;

      // 🔥 CRITICAL FIX: ALWAYS use 'Afilas General Hospital' as the location
      // Whether it's HOSPITAL or HOME visit, the location is the branch
      const location = 'Afilas General Hospital';

      // Build payload
      const payload: Record<string, unknown> = {
        patientName: data.patientName.trim(),
        patientEmail: data.patientEmail.trim(),
        patientPhone: data.patientPhone.trim(),
        date: appointmentDate,
        time: timeSlot,
        location: location, // ALWAYS the branch name
        notes: data.notes?.trim() || '',
        symptoms: data.symptoms?.trim() || '',
        isEmergency: false,
        visitType: data.visitType, // 'HOSPITAL' or 'HOME'
      };

      // Add age and gender if provided
      if (data.patientAge) {
        payload.patientAge = parseInt(data.patientAge);
      }
      if (data.patientGender) {
        payload.patientGender = data.patientGender;
      }

      // 🔥 CRITICAL FIX: For HOME visits, send the address fields
      // These will be stored separately from the location
      if (data.visitType === 'HOME') {
        payload.city = data.city || null;
        payload.subCity = data.subCity || null;
        payload.woreda = data.woreda || null;
        payload.gpsPin = data.gpsPin || null;
        payload.homeAddress = data.homeAddress || null;
      }

      console.log('📤 Submitting appointment payload:', JSON.stringify(payload, null, 2));

      const response = await api.post('/appointments', payload, false);

      console.log('✅ Appointment created:', response);

      const appointmentData = api.extractData<Appointment>(response);

      setCreatedAppointment(appointmentData);
      setBookingData(data);
      setShowConfirmation(true);
      toast.success('Appointment booked successfully! 🎉');
    } catch (error: any) {
      console.error('❌ Booking error:', error);
      
      let errorMessage = 'Failed to book appointment. Please try again.';
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      if (error.data && error.data.errors) {
        const validationErrors = error.data.errors.map((e: any) => {
          const field = e.param || e.field || e.path || 'field';
          return `${field}: ${e.msg || e.message}`;
        }).join(', ');
        errorMessage = `Validation failed: ${validationErrors}`;
      }
      
      if (error.data && error.data.error) {
        errorMessage = error.data.error;
      }
      
      setErrorDetails(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showConfirmation && bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-sm w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
              <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Confirmed! ✅</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Your appointment has been booked.</p>
            <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-left space-y-0.5 max-h-48 overflow-y-auto">
              <p className="text-xs text-gray-600 dark:text-gray-300">
                <span className="font-medium">Patient:</span> {bookingData.patientName}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                <span className="font-medium">Email:</span> {bookingData.patientEmail}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                <span className="font-medium">Phone:</span> {bookingData.patientPhone}
              </p>
              {bookingData.patientAge && (
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Age:</span> {bookingData.patientAge}
                </p>
              )}
              {bookingData.patientGender && (
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Gender:</span> {bookingData.patientGender}
                </p>
              )}
              <p className="text-xs text-gray-600 dark:text-gray-300">
                <span className="font-medium">Visit Type:</span> {bookingData.visitType === 'HOSPITAL' ? 'Hospital' : '🏠 Home Visit'}
              </p>
              {bookingData.visitType === 'HOME' && (
                <>
                  {bookingData.city && (
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      <span className="font-medium">City:</span> {bookingData.city}
                    </p>
                  )}
                  {bookingData.subCity && (
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Sub-City:</span> {bookingData.subCity}
                    </p>
                  )}
                  {bookingData.woreda && (
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Woreda:</span> {bookingData.woreda}
                    </p>
                  )}
                  {bookingData.homeAddress && (
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      <span className="font-medium">Address:</span> {bookingData.homeAddress}
                    </p>
                  )}
                  {bookingData.gpsPin && (
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      <span className="font-medium">GPS Pin:</span> {bookingData.gpsPin}
                    </p>
                  )}
                </>
              )}
              <p className="text-xs text-gray-600 dark:text-gray-300">
                <span className="font-medium">Date:</span> {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                <span className="font-medium">Time:</span> {new Date().toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              {createdAppointment && (
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Booking ID:</span>{' '}
                  <span className="font-mono text-blue-600 dark:text-blue-400">
                    {createdAppointment.id?.slice(0, 8) || 'N/A'}
                  </span>
                </p>
              )}
            </div>
            <div className="mt-3 flex flex-col sm:flex-row gap-2 justify-center">
              <button
                onClick={() => router.push('/')}
                className="px-3 py-1.5 bg-black text-white text-xs rounded-lg hover:bg-gray-800 transition"
              >
                Home
              </button>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-2 px-4 flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-[#73787E]">
            <h1 className="text-sm font-bold text-white text-center">
              General Hospital
            </h1>
            <p className="text-[11px] text-gray-200 text-center">
              Book your appointment
            </p>
          </div>

          <div className="p-2.5">
            {loadingData ? (
              <div className="flex items-center justify-center py-3">
                <Loader2 className="w-5 h-5 animate-spin text-gray-600 dark:text-gray-400" />
                <span className="ml-2 text-xs text-gray-500">Loading...</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                      currentStep >= 1 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      1
                    </div>
                    <span className={`text-xs ${currentStep === 1 ? 'text-black dark:text-white font-medium' : 'text-gray-400'}`}>
                      Personal Info
                    </span>
                  </div>
                  <div className="flex-1 h-0.5 mx-2 bg-gray-200">
                    <div className={`h-full bg-black transition-all duration-300 ${
                      currentStep === 2 ? 'w-full' : 'w-0'
                    }`} />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                      currentStep >= 2 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      2
                    </div>
                    <span className={`text-xs ${currentStep === 2 ? 'text-black dark:text-white font-medium' : 'text-gray-400'}`}>
                      Visit Details
                    </span>
                  </div>
                </div>

                {currentStep === 1 && (
                  <div className="space-y-1.5">
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-0.5">
                      <h3 className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                        <UserCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        Personal Information
                      </h3>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">
                        Please provide your personal details
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                          Full Name *
                        </label>
                        <input
                          {...register('patientName')}
                          type="text"
                          placeholder="Enter your full name"
                          className="w-full px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:text-white transition"
                        />
                        {errors.patientName && (
                          <p className="mt-0.5 text-[10px] text-red-600">{errors.patientName.message}</p>
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
                          className="w-full px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:text-white transition"
                        />
                        {errors.patientPhone && (
                          <p className="mt-0.5 text-[10px] text-red-600">{errors.patientPhone.message}</p>
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
                          className="w-full px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:text-white transition"
                        />
                        {errors.patientEmail && (
                          <p className="mt-0.5 text-[10px] text-red-600">{errors.patientEmail.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                          Age
                        </label>
                        <input
                          {...register('patientAge')}
                          type="number"
                          placeholder="Enter your age"
                          min="0"
                          max="150"
                          className="w-full px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:text-white transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                          Gender
                        </label>
                        <select
                          {...register('patientGender')}
                          className="w-full px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:text-white transition"
                        >
                          <option value="">Select Gender</option>
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={nextStep}
                        className="w-full flex items-center justify-center gap-1.5 px-4 py-2 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition-all text-xs mt-2"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-1.5">
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-0.5">
                      <h3 className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        Visit Details
                      </h3>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500">
                        Tell us about your visit
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                        Visit Type *
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setValue('visitType', 'HOSPITAL')}
                          className={`py-2 text-xs border rounded-lg transition ${
                            visitType === 'HOSPITAL'
                              ? 'border-black bg-gray-100 dark:bg-gray-700 text-black dark:text-white'
                              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                          }`}
                        >
                          Hospital Visit
                        </button>
                        <button
                          type="button"
                          onClick={() => setValue('visitType', 'HOME')}
                          className={`py-2 text-xs border rounded-lg transition ${
                            visitType === 'HOME'
                              ? 'border-black bg-gray-100 dark:bg-gray-700 text-black dark:text-white'
                              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                          }`}
                        >
                          Home Visit
                        </button>
                      </div>
                      {errors.visitType && (
                        <p className="mt-0.5 text-[10px] text-red-600">{errors.visitType.message}</p>
                      )}
                    </div>

                    {visitType === 'HOME' && (
                      <div className="space-y-1.5 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="border-b border-gray-200 dark:border-gray-700 pb-0.5">
                          <h3 className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                            <Home className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            Home Address Details
                          </h3>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500">
                            Please provide your home address
                          </p>
                        </div>

                        <div className="space-y-1.5">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                              City
                            </label>
                            <input
                              {...register('city')}
                              type="text"
                              placeholder="Bahir Dar"
                              className="w-full px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:text-white transition"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                              Sub-City
                            </label>
                            <input
                              {...register('subCity')}
                              type="text"
                              placeholder="Kebele 13"
                              className="w-full px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:text-white transition"
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
                              className="w-full px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:text-white transition"
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
                                placeholder="Click crosshair to get location"
                                className="w-full px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:text-white pr-8 transition"
                                readOnly
                              />
                              <button
                                type="button"
                                onClick={getCurrentLocation}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                title="Get current location"
                              >
                                <Crosshair className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5 flex items-center gap-1">
                              <Navigation className="w-3 h-3" />
                              Click the crosshair to use your device's GPS
                            </p>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                              Detailed Address
                            </label>
                            <textarea
                              {...register('homeAddress')}
                              rows={1}
                              placeholder="House number, building, landmarks..."
                              className="w-full px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:text-white transition resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                        Symptoms
                      </label>
                      <textarea
                        {...register('symptoms')}
                        rows={1}
                        placeholder="Describe your symptoms (e.g., Headache, fever, cough...)"
                        className="w-full px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:text-white transition resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-0.5">
                        Additional Notes
                      </label>
                      <textarea
                        {...register('notes')}
                        rows={1}
                        placeholder="Allergies, medical history, special requests..."
                        className="w-full px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:text-white transition resize-none"
                      />
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-all text-xs"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting || loadingData}
                        className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-black hover:bg-gray-800 text-white font-medium rounded-lg transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed text-xs"
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
                    </div>
                  </div>
                )}

                {errorDetails && (
                  <div className="p-1.5 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-[10px] text-red-600">{errorDetails}</p>
                  </div>
                )}

                <p className="text-center text-[9px] text-gray-400 dark:text-gray-500">
                  By booking, you agree to our terms and conditions
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}