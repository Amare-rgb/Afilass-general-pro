// app/appointment/page.tsx
'use client';

import { useEffect, useState, FormEvent } from 'react';
import { api, ApiError } from '@/lib/api';
import { Department, Doctor, Service } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  User, 
  Phone, 
  Mail, 
  Building2, 
  Stethoscope, 
  Calendar as CalendarIcon,
  FileText,
  ArrowRight,
  Clock,
  AlertCircle
} from 'lucide-react';

const emptyForm = {
  patientName: '',
  patientEmail: '',
  patientPhone: '',
  departmentId: '',
  doctorId: '',
  appointmentDate: '',
  note: '',
};

export default function AppointmentPage() {
  const { t } = useLanguage();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [step, setStep] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log('📡 Fetching departments...');
        
        const deptResponse = await api.get<any>('/departments');
        console.log('📡 Departments response:', deptResponse);
        
        let deptData: Department[] = [];
        if (deptResponse) {
          if (deptResponse.data && Array.isArray(deptResponse.data)) {
            deptData = deptResponse.data;
          } else if (Array.isArray(deptResponse)) {
            deptData = deptResponse;
          } else if (deptResponse.success && deptResponse.data && Array.isArray(deptResponse.data)) {
            deptData = deptResponse.data;
          }
        }
        setDepartments(deptData);
        console.log(`✅ Loaded ${deptData.length} departments`);
        
        console.log('📡 Fetching services...');
        const serviceResponse = await api.get<any>('/services');
        console.log('📡 Services response:', serviceResponse);
        
        let serviceData: Service[] = [];
        if (serviceResponse) {
          if (serviceResponse.data && Array.isArray(serviceResponse.data)) {
            serviceData = serviceResponse.data;
          } else if (Array.isArray(serviceResponse)) {
            serviceData = serviceResponse;
          } else if (serviceResponse.success && serviceResponse.data && Array.isArray(serviceResponse.data)) {
            serviceData = serviceResponse.data;
          }
        }
        setServices(serviceData);
        console.log(`✅ Loaded ${serviceData.length} services`);
        
      } catch (error) {
        console.error('❌ Failed to fetch data:', error);
        setError(t('appointment.error_load'));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [t]);

  useEffect(() => {
    if (!form.departmentId) {
      setDoctors([]);
      return;
    }
    
    const fetchDoctors = async () => {
      try {
        console.log(`📡 Fetching doctors for department: ${form.departmentId}`);
        const response = await api.get<any>(`/doctors?departmentId=${form.departmentId}`);
        console.log('📡 Doctors response:', response);
        
        let doctorData: Doctor[] = [];
        if (response) {
          if (response.data && Array.isArray(response.data)) {
            doctorData = response.data;
          } else if (Array.isArray(response)) {
            doctorData = response;
          } else if (response.success && response.data && Array.isArray(response.data)) {
            doctorData = response.data;
          }
        }
        setDoctors(doctorData);
        console.log(`✅ Loaded ${doctorData.length} doctors`);
      } catch (error) {
        console.error('❌ Failed to fetch doctors:', error);
        setDoctors([]);
      }
    };
    
    fetchDoctors();
  }, [form.departmentId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('sending');
    setError('');
    
    try {
      // Validate form
      if (!form.patientName.trim()) {
        throw new Error(t('appointment.error_name'));
      }
      if (!form.patientEmail.trim()) {
        throw new Error(t('appointment.error_email'));
      }
      if (!form.patientPhone.trim()) {
        throw new Error(t('appointment.error_phone'));
      }
      if (!form.departmentId) {
        throw new Error(t('appointment.error_department'));
      }
      if (!form.doctorId) {
        throw new Error(t('appointment.error_doctor'));
      }
      if (!form.appointmentDate) {
        throw new Error(t('appointment.error_date'));
      }

      // Format the date properly
      const dateObj = new Date(form.appointmentDate);
      const date = dateObj.toISOString().split('T')[0];
      const time = dateObj.toTimeString().slice(0, 5);

      // Prepare the appointment data
      const appointmentData = {
        patientName: form.patientName.trim(),
        patientEmail: form.patientEmail.trim(),
        patientPhone: form.patientPhone.trim(),
        doctorId: form.doctorId,
        date: date,
        time: time,
        notes: form.note || '',
        symptoms: form.note || '',
        isEmergency: false
      };

      console.log('📡 Creating appointment with data:', appointmentData);

      // Make the API call
      const response = await api.post('/appointments', appointmentData);
      console.log('📡 Appointment response:', response);
      
      setStatus('sent');
      setForm(emptyForm);
      setStep(1);
      
    } catch (err) {
      console.error('❌ Failed to create appointment:', err);
      setStatus('error');
      
      if (err instanceof ApiError) {
        const errorMessage = err.data?.error || err.data?.message || err.message;
        setError(errorMessage);
        console.error('📡 Error details:', err.data);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t('appointment.error_general'));
      }
    }
  }

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setForm({ ...form, departmentId: value, doctorId: '' });
    setSelectedDepartment(value);
    if (value) setStep(2);
  };

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-12 h-12 text-clinical-700 animate-spin" />
          <p className="text-sm text-clinical-500 font-medium">{t('appointment.loading')}</p>
        </div>
      </section>
    );
  }

  if (status === 'sent') {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-5">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 md:p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-clay-600 font-semibold mb-3">{t('appointment.received')}</p>
          <h1 className="font-display text-2xl md:text-3xl text-clinical-900 mb-3">{t('appointment.success')}</h1>
          <p className="text-clinical-800/80 text-sm mb-5">
            {t('appointment.success_msg')}
          </p>
          <div className="bg-gray-50 rounded-lg p-3 mb-5 text-left">
            <p className="text-xs text-gray-600 font-medium mb-1.5">{t('appointment.next_steps')}</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                {t('appointment.steps')}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                {t('appointment.steps2')}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                {t('appointment.steps3')}
              </li>
            </ul>
          </div>
          <button
            onClick={() => setStatus('idle')}
            className="w-full rounded-lg bg-clinical-700 hover:bg-clinical-800 text-white font-semibold px-4 py-2.5 text-sm transition-colors"
          >
            {t('appointment.book_again')}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-xs uppercase tracking-[0.3em] text-clay-600 font-semibold mb-2">{t('appointment.title')}</p>
          <h1 className="font-display text-2xl md:text-3xl text-clinical-900 mb-2">{t('appointment.title')}</h1>
          <p className="text-clinical-700/80 text-sm max-w-xs mx-auto">
            {t('appointment.subtitle')}
          </p>
        </div>

        {/* Steps Progress */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[
            t('appointment.step_info'), 
            t('appointment.step_dept'), 
            t('appointment.step_confirm')
          ].map((label, index) => {
            const currentStep = index + 1;
            const isActive = currentStep <= step;
            return (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                  isActive ? 'bg-clinical-700 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep}
                </div>
                <span className={`text-xs ${isActive ? 'text-clinical-700 font-medium' : 'text-gray-400'}`}>
                  {label}
                </span>
                {index < 2 && (
                  <div className={`w-6 h-0.5 ${isActive ? 'bg-clinical-700' : 'bg-gray-200'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-5">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-red-600 font-medium">{t('appointment.error')}</p>
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Personal Information */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h2 className="text-sm font-semibold text-clinical-900 mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-clinical-600" />
                  {t('appointment.personal')}
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="patientName">
                      {t('appointment.fullname')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="patientName"
                      required
                      value={form.patientName}
                      onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-clinical-500 focus:border-transparent transition-colors bg-white"
                      placeholder={t('appointment.name_placeholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="patientPhone">
                      {t('appointment.phone')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="patientPhone"
                      required
                      value={form.patientPhone}
                      onChange={(e) => setForm({ ...form, patientPhone: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-clinical-500 focus:border-transparent transition-colors bg-white"
                      placeholder={t('appointment.phone_placeholder')}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="patientEmail">
                      {t('appointment.email')} <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="patientEmail"
                      type="email"
                      required
                      value={form.patientEmail}
                      onChange={(e) => setForm({ ...form, patientEmail: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-clinical-500 focus:border-transparent transition-colors bg-white"
                      placeholder={t('appointment.email_placeholder')}
                    />
                  </div>
                </div>
              </div>

              {/* Department & Doctor */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h2 className="text-sm font-semibold text-clinical-900 mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-clinical-600" />
                  {t('appointment.department_doctor')}
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="departmentId">
                      {t('appointment.department')} <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="departmentId"
                      required
                      value={form.departmentId}
                      onChange={handleDepartmentChange}
                      className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-clinical-500 focus:border-transparent transition-colors bg-white appearance-none"
                    >
                      <option value="">{t('appointment.select_department')}</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="doctorId">
                      {t('appointment.doctor')} <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="doctorId"
                      required
                      value={form.doctorId}
                      onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
                      disabled={!form.departmentId}
                      className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-clinical-500 focus:border-transparent transition-colors bg-white disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none"
                    >
                      <option value="">{t('appointment.select_doctor')}</option>
                      {doctors.map((doc) => (
                        <option key={doc.id} value={doc.id}>
                          {doc.name} {doc.title ? `(${doc.title})` : ''}
                        </option>
                      ))}
                    </select>
                    {form.departmentId && doctors.length === 0 && (
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
                        <AlertCircle className="w-3 h-3 text-yellow-600 flex-shrink-0" />
                        <p className="text-xs text-yellow-700">{t('appointment.no_doctors')}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h2 className="text-sm font-semibold text-clinical-900 mb-3 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-clinical-600" />
                  {t('appointment.date_time')}
                </h2>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="appointmentDate">
                    {t('appointment.choose')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="appointmentDate"
                    type="datetime-local"
                    required
                    value={form.appointmentDate}
                    onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-clinical-500 focus:border-transparent transition-colors bg-white"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
              </div>

              {/* Note */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h2 className="text-sm font-semibold text-clinical-900 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-clinical-600" />
                  {t('appointment.additional')}
                </h2>
                <textarea
                  id="note"
                  rows={2}
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-clinical-500 focus:border-transparent transition-colors bg-white"
                  placeholder={t('appointment.note')}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full rounded-xl bg-clinical-700 hover:bg-clinical-800 disabled:opacity-60 text-white font-semibold px-4 py-3 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                {status === 'sending' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('appointment.submitting')}
                  </>
                ) : (
                  <>
                    {t('appointment.submit')}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center">
                {t('appointment.agree')}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}