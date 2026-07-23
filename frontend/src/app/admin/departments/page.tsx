// app/admin/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { DashboardSummary } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Calendar, 
  ChevronRight,
  Activity,
  Clock,
  UserCheck,
  FileText,
  Building2
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { t } = useLanguage();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    api.get<DashboardSummary>('/dashboard/summary', true)
      .then(setSummary)
      .catch(() => setSummary(null));
  }, []);

  const cards = summary
    ? [
        { 
          label: t('admin.dashboard.total_appointments'), 
          value: summary.totalAppointments, 
          icon: Calendar,
          bgColor: 'bg-blue-50',
          iconColor: 'text-blue-600'
        },
        { 
          label: t('admin.dashboard.pending'), 
          value: summary.pendingAppointments, 
          icon: Clock,
          bgColor: 'bg-yellow-50',
          iconColor: 'text-yellow-600'
        },
        { 
          label: t('admin.dashboard.today_appointments'), 
          value: summary.todaysAppointments, 
          icon: Activity,
          bgColor: 'bg-green-50',
          iconColor: 'text-green-600'
        },
        { 
          label: t('admin.dashboard.active_doctors'), 
          value: summary.totalDoctors, 
          icon: UserCheck,
          bgColor: 'bg-purple-50',
          iconColor: 'text-purple-600'
        },
        { 
          label: t('admin.dashboard.departments'), 
          value: summary.totalDepartments, 
          icon: Building2,
          bgColor: 'bg-indigo-50',
          iconColor: 'text-indigo-600'
        },
        { 
          label: t('admin.dashboard.news_articles'), 
          value: summary.totalArticles, 
          icon: FileText,
          bgColor: 'bg-pink-50',
          iconColor: 'text-pink-600'
        },
      ]
    : [];

  return (
    <>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-clinical-900">{t('admin.dashboard.title')}</h1>
        <p className="text-sm text-gray-500 mt-1">{t('admin.dashboard.welcome')}</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl font-display text-clinical-800">{c.value}</p>
                <p className="text-sm text-gray-600 mt-1">{c.label}</p>
              </div>
              <div className={`p-3 rounded-xl ${c.bgColor}`}>
                <c.icon className={`w-5 h-5 ${c.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="font-semibold text-clinical-900">{t('admin.dashboard.upcoming_appointments')}</h2>
          <Link href="/admin/appointments" className="text-sm text-clinical-700 hover:text-clinical-900 font-medium flex items-center gap-1 hover:gap-2 transition-all">
            {t('button.view_all')}
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="p-6">
          {!summary || summary.upcoming.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">{t('admin.dashboard.no_upcoming')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-200">
                    <th className="pb-3 font-medium">{t('admin.dashboard.patient')}</th>
                    <th className="pb-3 font-medium">{t('admin.dashboard.department')}</th>
                    <th className="pb-3 font-medium">{t('admin.dashboard.date_time')}</th>
                    <th className="pb-3 font-medium">{t('admin.dashboard.status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.upcoming.map((a) => (
                    <tr key={a.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="py-3 font-medium text-gray-800">{a.patientName}</td>
                      <td className="py-3 text-gray-600">{a.department?.name || 'N/A'}</td>
                      <td className="py-3 text-gray-600">
                        {new Date(a.appointmentDate).toLocaleString('en-US', { 
                          dateStyle: 'medium', 
                          timeStyle: 'short' 
                        })}
                      </td>
                      <td className="py-3">
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-medium
                          ${a.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : ''}
                          ${a.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : ''}
                          ${a.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' : ''}
                          ${a.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : ''}
                        `}>
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}