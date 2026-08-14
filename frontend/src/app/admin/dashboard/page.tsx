// app/admin/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api, extractApiData } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ComposedChart
} from 'recharts';

// Types
interface DashboardStats {
  overview: {
    totalAppointments: number;
    todayAppointments: number;
    upcomingAppointments: number;
    totalDoctors: number;
    totalServices: number;
    totalUsers: number;
    pendingContacts: number;
    totalNews: number;
  };
  appointmentsByStatus: {
    [key: string]: number;
  };
  recentAppointments: Array<{
    id: string;
    date: string;
    status: string;
    doctor: {
      name: string;
      specialization: string;
    };
    service: {
      name: string;
    };
  }>;
  reviews: {
    totalReviews: number;
    averageRating: number;
  };
  location?: string;
}

interface ChartDataItem {
  month?: string;
  role?: string;
  appointments?: number;
  completed?: number;
  cancelled?: number;
  count?: number;
}

interface DashboardData {
  stats: DashboardStats;
  appointmentsChart: ChartDataItem[];
  usersChart: ChartDataItem[];
}

const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6', '#6366F1'];

// Location options
const LOCATIONS = [
  { id: 'Afilas General Hospital', label: 'Afilas General Hospital' },
  { id: 'Afilas Diagnosis Center', label: 'Afilas Diagnosis Center' },
  { id: 'Afilas Drug Manufacturing', label: 'Afilas Drug Manufacturing' }
];

// Mock data for testing
const MOCK_APPOINTMENTS_CHART = [
  { month: 'Jan', appointments: 45, completed: 30, cancelled: 5 },
  { month: 'Feb', appointments: 52, completed: 35, cancelled: 8 },
  { month: 'Mar', appointments: 48, completed: 32, cancelled: 6 },
  { month: 'Apr', appointments: 60, completed: 45, cancelled: 10 },
  { month: 'May', appointments: 55, completed: 38, cancelled: 7 },
  { month: 'Jun', appointments: 70, completed: 50, cancelled: 12 },
];

const MOCK_USERS_CHART = [
  { role: 'SUPER_ADMIN', count: 2 },
  { role: 'ADMIN', count: 5 },
  { role: 'DOCTOR', count: 15 },
  { role: 'USER', count: 50 },
];

export default function AdminDashboardPage() {
  const { t } = useLanguage();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [selectedLocation, setSelectedLocation] = useState<string>('Afilas General Hospital');

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod, selectedLocation]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const statsResponse = await api.get(`/dashboard/stats?location=${encodeURIComponent(selectedLocation)}`, true);
      const stats = extractApiData<DashboardStats>(statsResponse);

      let appointmentsChart;
      let usersChart;

      try {
        const appointmentsResponse = await api.get(`/dashboard/appointments-chart?period=${selectedPeriod}&location=${encodeURIComponent(selectedLocation)}`, true);
        appointmentsChart = extractApiData<ChartDataItem[]>(appointmentsResponse);
        console.log('📊 Appointments chart data:', appointmentsChart);
      } catch (err) {
        console.log('Using mock appointments data');
        appointmentsChart = MOCK_APPOINTMENTS_CHART;
      }

      try {
        const usersResponse = await api.get(`/dashboard/users-chart?location=${encodeURIComponent(selectedLocation)}`, true);
        usersChart = extractApiData<ChartDataItem[]>(usersResponse);
        console.log('📊 Users chart data:', usersChart);
      } catch (err) {
        console.log('Using mock users data');
        usersChart = MOCK_USERS_CHART;
      }

      setData({
        stats,
        appointmentsChart: appointmentsChart || [],
        usersChart: usersChart || [],
      });
    } catch (error: any) {
      console.error('❌ Error fetching dashboard data:', error);
      // Use mock data as fallback
      setData({
        stats: {
          overview: {
            totalAppointments: 0,
            todayAppointments: 0,
            upcomingAppointments: 0,
            totalDoctors: 0,
            totalServices: 0,
            totalUsers: 0,
            pendingContacts: 0,
            totalNews: 0,
          },
          appointmentsByStatus: {},
          recentAppointments: [],
          reviews: {
            totalReviews: 0,
            averageRating: 0,
          },
          location: 'all',
        },
        appointmentsChart: MOCK_APPOINTMENTS_CHART,
        usersChart: MOCK_USERS_CHART,
      });
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (locationId: string) => {
    setSelectedLocation(locationId);
  };

  const getLocationDisplay = () => {
    const loc = LOCATIONS.find(l => l.id === selectedLocation);
    return loc ? loc.label : selectedLocation;
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`star-${i}`} className="text-yellow-400">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half-star" className="text-yellow-400">★</span>);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="text-gray-300">★</span>);
    }
    return stars;
  };

  // Custom label renderer for pie charts
  const renderPieLabel = ({ name, percent }: { name?: string; percent?: number }) => {
    if (!name || !percent) return '';
    return `${name} ${(percent * 100).toFixed(0)}%`;
  };

  const renderStatusLabel = ({ name, percent }: { name?: string; percent?: number }) => {
    if (!name || !percent) return '';
    return `${name} ${(percent * 100).toFixed(0)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠</div>
          <p className="text-gray-600 mb-2">Failed to load dashboard data</p>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            ↻ Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No data available</p>
        </div>
      </div>
    );
  }

  const { stats, appointmentsChart, usersChart } = data;

  // ============================================================
  // ✅ UPDATED SUMMARY CARDS - "Today's Appointments" changed to "Website Reviews"
  // ============================================================
  const summaryCards = [
    { 
      label: 'Total Appointments', 
      value: stats?.overview?.totalAppointments?.toLocaleString() || '0',
      color: 'from-green-500 to-emerald-600'
    },
    { 
      label: 'Website Reviews', 
      value: stats?.reviews?.totalReviews?.toString() || '0',
      color: 'from-yellow-500 to-orange-600',
      rating: stats?.reviews?.averageRating || 0
    },
    { 
      label: 'Total Doctors', 
      value: stats?.overview?.totalDoctors?.toString() || '0',
      color: 'from-purple-500 to-violet-600'
    },
    { 
      label: 'Total Users', 
      value: stats?.overview?.totalUsers?.toLocaleString() || '0',
      color: 'from-yellow-500 to-orange-600'
    },
    { 
      label: 'Total Services', 
      value: stats?.overview?.totalServices?.toLocaleString() || '0',
      color: 'from-cyan-500 to-teal-600'
    },
    { 
      label: 'Blog Posts', 
      value: stats?.overview?.totalNews?.toLocaleString() || '0',
      color: 'from-pink-500 to-rose-600'
    },
  ];

  // Status distribution for chart
  const statusData = stats?.appointmentsByStatus 
    ? Object.entries(stats.appointmentsByStatus).map(([name, value]) => ({
        name: name.charAt(0) + name.slice(1).toLowerCase(),
        value
      }))
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as any)}
              className="bg-transparent border-none outline-none text-sm text-gray-600 dark:text-gray-300"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <button 
            onClick={fetchDashboardData}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            ↻ Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors">
            ↓ Export
          </button>
        </div>
      </div>

      {/* Location Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex flex-wrap gap-4">
        {LOCATIONS.map((location) => (
          <button
            key={location.id}
            onClick={() => handleLocationChange(location.id)}
            className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex-1 min-w-[180px] ${
              selectedLocation === location.id
                ? 'bg-gray-900 text-white shadow-md hover:bg-gray-800'
                : 'bg-white text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-700'
            }`}
          >
            {location.label}
          </button>
        ))}
      </div>

      {/* ✅ Summary Cards - 6 cards in a row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {summaryCards.map((card, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider truncate">
                  {card.label}
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">
                  {card.value}
                </p>
                {card.rating !== undefined && card.rating > 0 && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="flex items-center">
                      {renderStars(card.rating)}
                    </div>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400">
                      {card.rating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
              <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${card.color} flex-shrink-0 ml-2`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* TWO CHARTS: Appointments Trend & Users by Role */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Appointments Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Appointments Trend</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {getLocationDisplay()} • Monthly statistics
              </p>
            </div>
          </div>
          {appointmentsChart && appointmentsChart.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={appointmentsChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="appointments" fill="#10B981" name="Total" />
                  <Bar dataKey="completed" fill="#3B82F6" name="Completed" />
                  <Bar dataKey="cancelled" fill="#EF4444" name="Cancelled" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500">No appointment data available</p>
                <p className="text-xs text-gray-400 mt-1">Add appointments to see the chart</p>
              </div>
            </div>
          )}
        </div>

        {/* Chart 2: Users by Role */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Users by Role</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">User role distribution</p>
            </div>
          </div>
          {usersChart && usersChart.length > 0 ? (
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={usersChart}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderPieLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="role"
                  >
                    {usersChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500">No user data available</p>
                <p className="text-xs text-gray-400 mt-1">Add users to see the chart</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ✅ REMOVED: Recent Appointments Section */}
      
    </div>
  );
}