// src/app/admin/appointments/afilas-general/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { appointmentService } from '@/lib/appointment';
import { Appointment } from '@/lib/types';
import { 
  Calendar, 
  RefreshCw,
  ChevronDown,
  Loader2,
  CheckCircle,
  User,
  Mail,
  Phone,
  Building2,
  Stethoscope,
  X,
  Hospital,
  ArrowLeft,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

const STATUSES = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
const LOCATION_NAME = 'Afilas General Hospital';

export default function AdminAfilasGeneralAppointments() {
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

  async function loadAppointments() {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      console.log(`🔍 Fetching appointments for ${LOCATION_NAME} with filter: ${filter || 'All'}`);
      
      const filters: any = { location: LOCATION_NAME };
      if (filter) {
        filters.status = filter;
      }
      
      const data = await appointmentService.getAppointments(filters, true);
      console.log(`📊 Found ${data.length} appointments`);
      
      setAppointments(data);
      
      setStats({
        total: data.length,
        pending: data.filter((a: Appointment) => a.status === 'PENDING').length,
        confirmed: data.filter((a: Appointment) => a.status === 'CONFIRMED').length,
        completed: data.filter((a: Appointment) => a.status === 'COMPLETED').length,
        cancelled: data.filter((a: Appointment) => a.status === 'CANCELLED').length,
      });
    } catch (error: any) {
      console.error('❌ Failed to load appointments:', error);
      setError(error.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAppointments();
  }, [filter]);

  async function updateStatus(id: string, status: string) {
    setUpdatingId(id);
    setError('');
    setSuccess('');
    try {
      await appointmentService.updateAppointmentStatus(id, status, true);
      setSuccess(`Status updated to ${status}`);
      await loadAppointments();
    } catch (error: any) {
      console.error('❌ Failed to update status:', error);
      setError(error.message || 'Failed to update appointment status');
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteAppointment(id: string) {
    if (!confirm('Are you sure you want to delete this appointment?')) return;
    try {
      await appointmentService.deleteAppointment(id, true);
      setSuccess('Appointment deleted successfully');
      await loadAppointments();
    } catch (error: any) {
      console.error('❌ Failed to delete appointment:', error);
      setError(error.message || 'Failed to delete appointment');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400';
      case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400';
      case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Link href="/admin/appointments" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Hospital className="w-6 h-6 text-green-600" />
                Afilas General Hospital
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Manage appointments for Afilas General Hospital
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={loadAppointments}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
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

      {/* Filter */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="focus-ring rounded-lg border border-gray-300 pl-3 pr-8 py-2 bg-white text-sm appearance-none cursor-pointer hover:border-gray-400 transition-colors dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="">All Statuses</option>
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

      {/* Messages */}
      {success && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
          <button onClick={() => setSuccess('')} className="ml-auto">
            <X className="w-4 h-4 text-green-600" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          <button onClick={() => setError('')} className="ml-auto">
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>
      )}

      {/* Appointments Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-green-700 animate-spin" />
              <p className="text-sm text-gray-500">Loading appointments...</p>
            </div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center p-12">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No appointments found for Afilas General Hospital</p>
            <p className="text-xs text-gray-400 mt-1">
              {filter ? 'Try changing the status filter' : 'Create new appointments to see them here'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  <th className="py-3 px-5 font-semibold">Patient</th>
                  <th className="py-3 px-5 font-semibold">Contact</th>
                  <th className="py-3 px-5 font-semibold">Doctor</th>
                  <th className="py-3 px-5 font-semibold">Date & Time</th>
                  <th className="py-3 px-5 font-semibold">Status</th>
                  <th className="py-3 px-5 font-semibold">Location</th>
                  <th className="py-3 px-5 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment: Appointment) => (
                  <tr key={appointment.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors last:border-0">
                    <td className="py-3 px-5">
                      <div className="font-medium text-gray-800 dark:text-white flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        {appointment.patientName}
                      </div>
                      {appointment.isEmergency && (
                        <span className="inline-block mt-1 text-[10px] font-semibold text-red-600 bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded-full">
                          🚨 Emergency
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-5 text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1 text-xs">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span className="truncate max-w-[120px]">{appointment.patientEmail}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs mt-0.5">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span>{appointment.patientPhone}</span>
                      </div>
                    </td>
                    <td className="py-3 px-5">
                      <div className="text-gray-800 dark:text-white flex items-center gap-1">
                        <Stethoscope className="w-3.5 h-3.5 text-gray-400" />
                        {appointment.doctor?.name || 'Not assigned'}
                      </div>
                      {appointment.doctor?.specialization && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 ml-5">{appointment.doctor.specialization}</div>
                      )}
                    </td>
                    <td className="py-3 px-5">
                      <div className="text-gray-800 dark:text-white">{formatDate(appointment.appointmentDate || appointment.date || '')}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{appointment.time}</div>
                    </td>
                    <td className="py-3 px-5">
                      <select
                        value={appointment.status}
                        onChange={(e) => updateStatus(appointment.id, e.target.value)}
                        disabled={updatingId === appointment.id}
                        className={`focus-ring rounded-lg border px-3 py-1 text-xs font-medium ${getStatusColor(appointment.status)} border-transparent hover:border-gray-300 cursor-pointer transition-colors disabled:opacity-50 dark:bg-gray-800`}
                      >
                        {STATUSES.map((s: string) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-5">
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {appointment.location || 'Afilas General Hospital'}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-center">
                      <button
                        onClick={() => deleteAppointment(appointment.id)}
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