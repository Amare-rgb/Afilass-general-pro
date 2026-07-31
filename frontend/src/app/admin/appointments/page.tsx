// app/admin/appointments/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Appointment, AppointmentStatus } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Calendar, 
  RefreshCw,
  ChevronDown,
  Loader2,
  CheckCircle,
  XCircle,
  User,
  Mail,
  Phone,
  Building2,
  Stethoscope,
  X,
  Hospital,
  Activity,
  Pill,
  Filter
} from 'lucide-react';

const STATUSES: AppointmentStatus[] = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

export default function AdminAppointmentsPage() {
  const { t } = useLanguage();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      let query = '';
      const params = new URLSearchParams();
      
      if (filter) params.append('status', filter);
      
      query = params.toString() ? `?${params.toString()}` : '';
      
      console.log('📡 Fetching appointments with filter:', query);
      
      const response = await api.get<any>(`/appointments${query}`, true);
      console.log('📡 Response:', response);
      
      let appointmentsData: Appointment[] = [];
      if (response) {
        if (Array.isArray(response)) {
          appointmentsData = response;
        } else if (response.data && Array.isArray(response.data)) {
          appointmentsData = response.data;
        } else if (response.success && response.data && Array.isArray(response.data)) {
          appointmentsData = response.data;
        } else if (response.appointments && Array.isArray(response.appointments)) {
          appointmentsData = response.appointments;
        }
      }
      
      setAppointments(appointmentsData);
      console.log(`✅ Loaded ${appointmentsData.length} appointments`);
    } catch (error: any) {
      console.error('❌ Failed to load appointments:', error);
      setError(error.message || t('admin.appointments.error_load'));
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [filter]);

  async function updateStatus(id: string, status: AppointmentStatus) {
    setUpdatingId(id);
    setError('');
    setSuccess('');
    try {
      await api.patch(`/appointments/${id}/status`, { status }, true);
      setSuccess(t('admin.appointments.status_updated') + ` ${status}`);
      await load();
    } catch (error) {
      console.error('❌ Failed to update status:', error);
      setError(t('admin.appointments.error_update'));
    } finally {
      setUpdatingId(null);
    }
  }

  async function remove(id: string) {
    if (!confirm(t('admin.appointments.confirm_delete'))) return;
    try {
      await api.delete(`/appointments/${id}`, true);
      setSuccess(t('admin.appointments.deleted'));
      await load();
    } catch (error) {
      console.error('❌ Failed to delete appointment:', error);
      setError(t('admin.appointments.error_delete'));
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', { 
        dateStyle: 'medium', 
        timeStyle: 'short' 
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'CONFIRMED': return 'bg-green-100 text-green-700 border-green-200';
      case 'COMPLETED': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getLocationBadge = (location: string | null | undefined) => {
    if (!location) return null;
    const colors: { [key: string]: string } = {
      'Afilas General Hospital': 'bg-blue-100 text-blue-700',
      'Afilas Diagnosis Center': 'bg-purple-100 text-purple-700',
      'Afilas Drug Manufacturing': 'bg-green-100 text-green-700'
    };
    const colorClass = colors[location] || 'bg-gray-100 text-gray-700';
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full ${colorClass}`}>
        {location}
      </span>
    );
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-clinical-900">{t('admin.appointments.title')}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage all appointments
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={load}
            className="focus-ring rounded-lg bg-clinical-700 hover:bg-clinical-800 text-white px-4 py-2 text-sm transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            {t('button.refresh')}
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="focus-ring rounded-lg border border-gray-300 pl-3 pr-8 py-2 bg-white text-sm appearance-none cursor-pointer hover:border-gray-400 transition-colors"
          >
            <option value="">{t('admin.appointments.all_statuses')}</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        <div className="text-sm text-gray-500">
          {appointments.length} appointment{appointments.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-600">{success}</p>
          <button onClick={() => setSuccess('')} className="ml-auto">
            <X className="w-4 h-4 text-green-600" />
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
          <button onClick={() => setError('')} className="ml-auto">
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-clinical-700 animate-spin" />
              <p className="text-sm text-clinical-500">{t('admin.appointments.loading')}</p>
            </div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center p-12">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">{t('admin.appointments.no_appointments')}</p>
            <p className="text-xs text-gray-400 mt-1">
              {filter ? t('admin.appointments.no_filtered') : t('admin.appointments.no_created')}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-200 bg-gray-50">
                  <th className="py-3 px-5 font-semibold">{t('admin.appointments.patient')}</th>
                  <th className="py-3 px-5 font-semibold">{t('admin.appointments.contact')}</th>
                  <th className="py-3 px-5 font-semibold">{t('admin.appointments.department')}</th>
                  <th className="py-3 px-5 font-semibold">{t('admin.appointments.doctor')}</th>
                  <th className="py-3 px-5 font-semibold">{t('admin.appointments.date_time')}</th>
                  <th className="py-3 px-5 font-semibold">Location</th>
                  <th className="py-3 px-5 font-semibold">{t('admin.appointments.status')}</th>
                  <th className="py-3 px-5 font-semibold text-center">{t('admin.appointments.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors last:border-0 align-top">
                    <td className="py-3 px-5">
                      <div className="font-medium text-gray-800 flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        {appointment.patientName}
                      </div>
                      {appointment.isEmergency && (
                        <span className="inline-block mt-1 text-[10px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                          🚨 Emergency
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-5 text-gray-600">
                      <div className="flex items-center gap-1 text-xs">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span>{appointment.patientEmail}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs mt-0.5">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span>{appointment.patientPhone}</span>
                      </div>
                    </td>
                    <td className="py-3 px-5">
                      <span className="text-gray-800 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                        {appointment.department?.name || 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-5">
                      <div className="text-gray-800 flex items-center gap-1">
                        <Stethoscope className="w-3.5 h-3.5 text-gray-400" />
                        {appointment.doctor?.name || t('admin.appointments.not_assigned')}
                      </div>
                      {appointment.doctor?.specialization && (
                        <div className="text-xs text-gray-500 ml-5">{appointment.doctor.specialization}</div>
                      )}
                    </td>
                    <td className="py-3 px-5">
                      <div className="text-gray-800">{formatDate(appointment.appointmentDate)}</div>
                      <div className="text-xs text-gray-500">{appointment.time}</div>
                    </td>
                    <td className="py-3 px-5">
                      {getLocationBadge(appointment.location)}
                    </td>
                    <td className="py-3 px-5">
                      <select
                        value={appointment.status}
                        onChange={(e) => updateStatus(appointment.id, e.target.value as AppointmentStatus)}
                        disabled={updatingId === appointment.id}
                        className={`focus-ring rounded-lg border px-3 py-1 text-xs font-medium ${getStatusColor(appointment.status)} border-transparent hover:border-gray-300 cursor-pointer transition-colors disabled:opacity-50`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-5 text-center">
                      <button
                        onClick={() => remove(appointment.id)}
                        className="text-red-500 hover:text-red-700 text-xs font-medium hover:underline transition-colors"
                      >
                        {t('button.delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && appointments.length > 0 && (
        <div className="mt-4 text-xs text-gray-400">
          Showing {appointments.length} appointment{appointments.length !== 1 ? 's' : ''}
        </div>
      )}
    </>
  );
}