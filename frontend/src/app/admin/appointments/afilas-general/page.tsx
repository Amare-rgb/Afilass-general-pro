// app/admin/afilas-general/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Appointment, AppointmentStatus } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';

const STATUSES: AppointmentStatus[] = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

export default function AfilasGeneralAppointmentsPage() {
  const { t } = useLanguage();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0
  });

  const LOCATION_NAME = 'Afilas General Hospital';

  async function load() {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const params = new URLSearchParams();
      if (filter) params.append('status', filter);
      params.append('location', LOCATION_NAME);
      
      const response = await api.get<any>(`/appointments?${params.toString()}`, true);
      
      let appointmentsData: Appointment[] = [];
      if (response) {
        if (Array.isArray(response)) {
          appointmentsData = response;
        } else if (response.data && Array.isArray(response.data)) {
          appointmentsData = response.data;
        } else if (response.success && response.data && Array.isArray(response.data)) {
          appointmentsData = response.data;
        }
      }
      
      setAppointments(appointmentsData);
      
      setStats({
        total: appointmentsData.length,
        pending: appointmentsData.filter(a => a.status === 'PENDING').length,
        confirmed: appointmentsData.filter(a => a.status === 'CONFIRMED').length,
        completed: appointmentsData.filter(a => a.status === 'COMPLETED').length,
        cancelled: appointmentsData.filter(a => a.status === 'CANCELLED').length,
      });
      
      console.log(`✅ Loaded ${appointmentsData.length} appointments for ${LOCATION_NAME}`);
    } catch (error: any) {
      console.error('❌ Failed to load appointments:', error);
      setError(error.message || 'Failed to load appointments');
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
      setSuccess(`Status updated to ${status}`);
      await load();
    } catch (error) {
      console.error('❌ Failed to update status:', error);
      setError('Failed to update appointment status');
    } finally {
      setUpdatingId(null);
    }
  }

  async function remove(id: string) {
    if (!confirm('Are you sure you want to delete this appointment?')) return;
    try {
      await api.delete(`/appointments/${id}`, true);
      setSuccess('Appointment deleted successfully');
      await load();
    } catch (error) {
      console.error('❌ Failed to delete appointment:', error);
      setError('Failed to delete appointment');
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4">
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={load}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3">
          <p className="text-xs text-yellow-600">Pending</p>
          <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3">
          <p className="text-xs text-blue-600">Confirmed</p>
          <p className="text-xl font-bold text-blue-600">{stats.confirmed}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3">
          <p className="text-xs text-green-600">Completed</p>
          <p className="text-xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3">
          <p className="text-xs text-red-600">Cancelled</p>
          <p className="text-xl font-bold text-red-600">{stats.cancelled}</p>
        </div>
      </div>

      {/* Filter - Right Aligned */}
      <div className="flex items-center justify-end gap-4 flex-wrap">
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="focus-ring rounded-lg border border-gray-300 pl-3 pr-8 py-2 bg-white text-sm appearance-none cursor-pointer hover:border-gray-400 transition-colors"
          >
            <option value="">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
        </div>
        <div className="text-sm text-gray-500">
          {appointments.length} appointment{appointments.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <span className="text-green-600 flex-shrink-0">✓</span>
          <p className="text-sm text-green-600">{success}</p>
          <button onClick={() => setSuccess('')} className="ml-auto">
            <span className="text-green-600">×</span>
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <span className="text-red-600 flex-shrink-0">✗</span>
          <p className="text-sm text-red-600">{error}</p>
          <button onClick={() => setError('')} className="ml-auto">
            <span className="text-red-600">×</span>
          </button>
        </div>
      )}

      {/* Appointments Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-gray-500">Loading appointments...</p>
            </div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center p-12">
            <p className="text-sm text-gray-500">No appointments found for Afilas General Hospital</p>
            <p className="text-xs text-gray-400 mt-1">
              {filter ? 'Try changing the status filter' : 'Create new appointments to see them here'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-200 bg-gray-50">
                  <th className="py-3 px-5 font-semibold">Patient</th>
                  <th className="py-3 px-5 font-semibold">Contact</th>
                  <th className="py-3 px-5 font-semibold">Department</th>
                  <th className="py-3 px-5 font-semibold">Doctor</th>
                  <th className="py-3 px-5 font-semibold">Date & Time</th>
                  <th className="py-3 px-5 font-semibold">Status</th>
                  <th className="py-3 px-5 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors last:border-0">
                    <td className="py-3 px-5">
                      <div className="font-medium text-gray-800">
                        {appointment.patientName}
                      </div>
                      {appointment.isEmergency && (
                        <span className="inline-block mt-1 text-[10px] font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                          🚨 Emergency
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-5 text-gray-600">
                      <div className="text-xs truncate max-w-[120px]">{appointment.patientEmail}</div>
                      <div className="text-xs mt-0.5">{appointment.patientPhone}</div>
                    </td>
                    <td className="py-3 px-5">
                      <span className="text-gray-800">{appointment.department?.name || 'N/A'}</span>
                    </td>
                    <td className="py-3 px-5">
                      <div className="text-gray-800">{appointment.doctor?.name || 'Not assigned'}</div>
                      {appointment.doctor?.specialization && (
                        <div className="text-xs text-gray-500">{appointment.doctor.specialization}</div>
                      )}
                    </td>
                    <td className="py-3 px-5">
                      <div className="text-gray-800">{formatDate(appointment.appointmentDate)}</div>
                      <div className="text-xs text-gray-500">{appointment.time}</div>
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
                        Delete
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
        <div className="text-xs text-gray-400">
          Showing {appointments.length} appointment{appointments.length !== 1 ? 's' : ''} for Afilas General Hospital
        </div>
      )}
    </div>
  );
}