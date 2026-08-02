// src/app/appointments/diagnosis/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
  Calendar,
  Clock,
  FileText,
  Microscope,
  Stethoscope,
  Upload,
  AlertCircle,
  Info,
  FlaskRoundIcon as Flask,
  Scan,
  Droplet,
  Activity,
  Bone
} from 'lucide-react';
import { toast } from 'sonner';

// ============================================================
// SCHEMA DEFINITION - FIXED
// ============================================================
const diagnosisBookingSchema = z.object({
  // Test Selection
  testCategory: z.enum(['LAB', 'IMAGING']),
  testType: z.string().min(1, 'Please select a test type'),

  // Medical Paperwork
  hasPrescription: z.boolean(),
  prescriptionFile: z.any().optional(),
  requestAssessment: z.boolean(),

  // Scheduling
  appointmentDate: z.string().min(1, 'Date is required'),
  timeSlot: z.enum(['MORNING', 'AFTERNOON', 'EVENING']),
});

type DiagnosisBookingData = z.infer<typeof diagnosisBookingSchema>;

// Default values
const defaultValues: DiagnosisBookingData = {
  testCategory: 'LAB',
  testType: '',
  hasPrescription: false,
  prescriptionFile: undefined,
  requestAssessment: false,
  appointmentDate: '',
  timeSlot: 'MORNING',
};

// ============================================================
// STEP COMPONENTS
// ============================================================

// Step 1: Test Selection
function TestSelectionStep({ form, watch, setValue }: { form: any; watch: any; setValue: any }) {
  const testCategory = watch('testCategory');
  const { formState: { errors } } = form;

  const labTests = [
    { id: 'blood', label: 'Blood Test', icon: Droplet, desc: 'CBC, Chemistry, Hormones' },
    { id: 'urine', label: 'Urine Test', icon: Flask, desc: 'Urinalysis, Culture' },
    { id: 'biochemistry', label: 'Biochemistry', icon: Activity, desc: 'Liver, Kidney, Thyroid' },
  ];

  const imagingTests = [
    { id: 'xray', label: 'X-Ray', icon: Bone, desc: 'Chest, Bone, Dental' },
    { id: 'ultrasound', label: 'Ultrasound', icon: Scan, desc: 'Abdominal, Pelvic, Cardiac' },
    { id: 'ctscan', label: 'CT Scan', icon: Scan, desc: 'Brain, Chest, Abdomen' },
    { id: 'mri', label: 'MRI', icon: Scan, desc: 'Brain, Spine, Joints' },
  ];

  const currentTests = testCategory === 'LAB' ? labTests : imagingTests;

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Microscope className="w-5 h-5 text-blue-600" />
          Test Selection
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Choose the type of diagnostic test you need
        </p>
      </div>

      {/* Category Selection */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => { setValue('testCategory', 'LAB'); setValue('testType', ''); }}
          className={`p-4 border-2 rounded-xl text-center transition-all ${
            testCategory === 'LAB'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <Flask className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <div className="font-semibold">Lab Test</div>
          <div className="text-xs text-gray-500">Blood, Urine, Biochemistry</div>
        </button>
        <button
          type="button"
          onClick={() => { setValue('testCategory', 'IMAGING'); setValue('testType', ''); }}
          className={`p-4 border-2 rounded-xl text-center transition-all ${
            testCategory === 'IMAGING'
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <Scan className="w-8 h-8 mx-auto mb-2 text-purple-600" />
          <div className="font-semibold">Imaging / Scan</div>
          <div className="text-xs text-gray-500">X-Ray, Ultrasound, CT, MRI</div>
        </button>
      </div>

      {/* Test Type Grid */}
      {testCategory && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-in slide-in-from-top duration-300">
          {currentTests.map((test) => {
            const Icon = test.icon;
            return (
              <button
                key={test.id}
                type="button"
                onClick={() => setValue('testType', test.id)}
                className={`p-4 border-2 rounded-xl text-center transition-all ${
                  watch('testType') === test.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Icon className="w-6 h-6 mx-auto mb-1 text-gray-600 dark:text-gray-400" />
                <div className="font-medium text-sm">{test.label}</div>
                <div className="text-[10px] text-gray-500">{test.desc}</div>
              </button>
            );
          })}
        </div>
      )}
      {errors.testType && (
        <p className="text-sm text-red-600">{errors.testType.message as string}</p>
      )}
    </div>
  );
}

// Step 2: Medical Paperwork
function PaperworkStep({ form, watch, setValue }: { form: any; watch: any; setValue: any }) {
  const hasPrescription = watch('hasPrescription');
  const { formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-600" />
          Medical Paperwork / Doctor Order
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Provide your doctor's prescription or order
        </p>
      </div>

      <div className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl">
        <div className="flex items-start gap-4">
          <input
            type="checkbox"
            checked={hasPrescription}
            onChange={(e) => setValue('hasPrescription', e.target.checked)}
            className="w-6 h-6 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <div>
            <label className="text-lg font-medium text-gray-900 dark:text-white">
              Do you have a Doctor's Prescription / Order Paper?
            </label>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Upload your prescription or order form if available
            </p>
          </div>
        </div>

        {hasPrescription && (
          <div className="mt-4 pl-10 animate-in slide-in-from-left duration-300">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Drag & drop your prescription image or PDF here
              </p>
              <p className="text-xs text-gray-400 mt-1">or click to browse</p>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-400"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setValue('prescriptionFile', file);
                    toast.success(`File "${file.name}" uploaded`);
                  }
                }}
              />
              {errors.prescriptionFile && (
                <p className="mt-1 text-sm text-red-600">{errors.prescriptionFile.message as string}</p>
              )}
            </div>
          </div>
        )}

        {!hasPrescription && (
          <div className="mt-4 pl-10 animate-in slide-in-from-left duration-300">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                    No Prescription Available?
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    We can help you prepare for your visit. Request an initial assessment kit.
                  </p>
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => setValue('requestAssessment', true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      <Stethoscope className="w-4 h-4" />
                      Request Initial Assessment Kit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Step 3: Scheduling
function DiagnosisSchedulingStep({ form }: { form: any }) {
  const { register, formState: { errors } } = form;

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
    <div className="space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-green-600" />
          Schedule Your Test
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Select your preferred date and time slot
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Appointment Date *
          </label>
          <select
            {...register('appointmentDate')}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select a date</option>
            {getAvailableDates().map((date) => (
              <option key={date} value={date}>
                {new Date(date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </option>
            ))}
          </select>
          {errors.appointmentDate && (
            <p className="mt-1 text-sm text-red-600">{errors.appointmentDate.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Time Slot *
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => form.setValue('timeSlot', 'MORNING')}
              className={`p-3 border-2 rounded-lg text-center transition-all ${
                form.watch('timeSlot') === 'MORNING'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
              }`}
            >
              <Clock className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
              <div className="text-xs font-medium">Morning</div>
              <div className="text-[10px] text-gray-500">8:00 - 12:00</div>
            </button>
            <button
              type="button"
              onClick={() => form.setValue('timeSlot', 'AFTERNOON')}
              className={`p-3 border-2 rounded-lg text-center transition-all ${
                form.watch('timeSlot') === 'AFTERNOON'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
              }`}
            >
              <Clock className="w-5 h-5 mx-auto mb-1 text-orange-500" />
              <div className="text-xs font-medium">Afternoon</div>
              <div className="text-[10px] text-gray-500">1:00 - 5:00</div>
            </button>
            <button
              type="button"
              onClick={() => form.setValue('timeSlot', 'EVENING')}
              className={`p-3 border-2 rounded-lg text-center transition-all ${
                form.watch('timeSlot') === 'EVENING'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
              }`}
            >
              <Clock className="w-5 h-5 mx-auto mb-1 text-indigo-500" />
              <div className="text-xs font-medium">Evening</div>
              <div className="text-[10px] text-gray-500">5:00 - 9:00</div>
            </button>
          </div>
          {errors.timeSlot && (
            <p className="mt-1 text-sm text-red-600">{errors.timeSlot.message as string}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function DiagnosisBookingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingData, setBookingData] = useState<DiagnosisBookingData | null>(null);
  const [testInstructions, setTestInstructions] = useState<string[]>([]);

  const form = useForm<DiagnosisBookingData>({
    resolver: zodResolver(diagnosisBookingSchema),
    defaultValues: defaultValues,
  });

  const { watch, handleSubmit, trigger } = form;

  const steps = [
    { id: 0, title: 'Test Selection', icon: Microscope },
    { id: 1, title: 'Paperwork', icon: FileText },
    { id: 2, title: 'Schedule', icon: Calendar },
  ];

  const getStepContent = () => {
    switch (currentStep) {
      case 0:
        return <TestSelectionStep form={form} watch={watch} setValue={form.setValue} />;
      case 1:
        return <PaperworkStep form={form} watch={watch} setValue={form.setValue} />;
      case 2:
        return <DiagnosisSchedulingStep form={form} />;
      default:
        return null;
    }
  };

  const canProceed = async () => {
    let fields: (keyof DiagnosisBookingData)[] = [];
    switch (currentStep) {
      case 0:
        fields = ['testCategory', 'testType'];
        break;
      case 1:
        // No required fields in paperwork step
        return true;
      case 2:
        fields = ['appointmentDate', 'timeSlot'];
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

  const getTestInstructions = (testType: string): string[] => {
    const instructions: Record<string, string[]> = {
      blood: [
        '🩸 Fasting required for 8-12 hours before the test',
        '💧 Drink plenty of water before the test',
        '💊 Inform your doctor about any medications you are taking',
      ],
      urine: [
        '🧪 Collect first morning urine sample for best results',
        '🚫 Avoid drinking too much fluid before the test',
        '🧼 Clean the genital area before collecting sample',
      ],
      biochemistry: [
        '🍽️ Fasting for 10-12 hours required',
        '💊 Continue taking prescribed medications',
        '🚫 Avoid alcohol for 24 hours before the test',
      ],
      xray: [
        '🖼️ Remove all jewelry and metal objects',
        '👕 Wear comfortable, loose-fitting clothing',
        '🤰 Inform if you are pregnant or suspect pregnancy',
      ],
      ultrasound: [
        '💧 Drink 1-1.5 liters of water 1 hour before the test',
        '🚫 Do not urinate before the scan',
        '👕 Wear loose clothing for easy access',
      ],
      ctscan: [
        '🍽️ Fasting for 4-6 hours required',
        '💊 Inform about any allergies or medications',
        '🚫 Remove all metal objects and jewelry',
      ],
      mri: [
        '⚠️ No metal objects allowed (pacemakers, implants, etc.)',
        '💊 Inform about any tattoos or piercings',
        '🕐 Allow 45-60 minutes for the complete scan',
      ],
    };
    return instructions[testType] || [
      '📋 Follow the preparation instructions provided by our staff',
      '🕐 Arrive 15 minutes before your scheduled time',
      '📄 Bring your ID and any relevant medical records',
    ];
  };

  const onSubmit = async (data: DiagnosisBookingData) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Diagnosis Booking Data:', data);
      
      // Generate test instructions
      const instructions = getTestInstructions(data.testType);
      setTestInstructions(instructions);
      setBookingData(data);
      setShowConfirmation(true);
      toast.success('Test booked successfully! 🎉');
    } catch (error) {
      toast.error('Failed to book test');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showConfirmation && bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Test Booked Successfully! 🎉
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Your diagnostic test has been scheduled.
            </p>
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-left">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Test:</span> {bookingData.testType}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Date:</span> {new Date(bookingData.appointmentDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Time:</span> {bookingData.timeSlot}
              </p>
            </div>
          </div>

          {/* Pre-Test Instructions */}
          <div className="mt-6 p-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2 mb-3">
              <Info className="w-5 h-5" />
              Pre-Test Instructions
            </h3>
            <ul className="space-y-2">
              {testInstructions.map((instruction, index) => (
                <li key={index} className="text-sm text-blue-700 dark:text-blue-300">
                  {instruction}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return Home
            </button>
            <button
              onClick={() => window.print()}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Print Instructions
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            🔬 Diagnosis Center
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Book your diagnostic tests at Afilas Diagnosis Center
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep >= index;
              const isPast = currentStep > index;

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {isPast ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className={`text-xs mt-2 font-medium hidden sm:block ${
                      isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-12 sm:w-16 h-0.5 mx-2 transition-all duration-300 ${
                        currentStep > index
                          ? 'bg-blue-600'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          <div className="min-h-[400px]">
            {getStepContent()}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={handlePrevious}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg transition-colors w-full sm:w-auto justify-center ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed bg-gray-100 dark:bg-gray-700'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex-1" />

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg w-full sm:w-auto justify-center"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg w-full sm:w-auto justify-center disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Book Test
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}