// app/admin/doctors/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import { Doctor } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Stethoscope,
  Building2,
  Clock,
  XCircle,
  Loader2,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Activity,
  Pill,
  Hospital,
  UserPlus,
  Calendar,
  CheckCircle
} from 'lucide-react';

interface LocationStat {
  name: string;
  slug: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  hoverBg: string;
}

export default function AdminDoctorsPage() {
  const { t } = useLanguage();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Location configurations (count will be calculated dynamically)
  const getLocationConfigs = (): Omit<LocationStat, 'count'>[] => {
    return [
      {
        name: 'Afilas General Hospital',
        slug: 'afilas-general',
        icon: <Hospital className="w-5 h-5" />,
        color: 'bg-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-600',
        hoverBg: 'hover:bg-blue-50'
      },
      {
        name: 'Afilas Diagnosis Center',
        slug: 'afilas-diagnosis',
        icon: <Activity className="w-5 h-5" />,
        color: 'bg-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        textColor: 'text-purple-600',
        hoverBg: 'hover:bg-purple-50'
      },
      {
        name: 'Afilas Drug Manufacturing',
        slug: 'afilas-drug',
        icon: <Pill className="w-5 h-5" />,
        color: 'bg-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-600',
        hoverBg: 'hover:bg-green-50'
      }
    ];
  };

  const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  async function load() {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      console.log('📡 Loading all doctors from backend...');
      
      const response = await api.get<any>('/doctors');
      
      let doctorsData: Doctor[] = [];
      if (response) {
        if (Array.isArray(response)) {
          doctorsData = response;
        } else if (response.data && Array.isArray(response.data)) {
          doctorsData = response.data;
        } else if (response.doctors && Array.isArray(response.doctors)) {
          doctorsData = response.doctors;
        }
      }
      
      setDoctors(doctorsData);
      setSuccess(`✅ Loaded ${doctorsData.length} doctors successfully`);
      console.log(`✅ Loaded ${doctorsData.length} doctors total`);
    } catch (error) {
      console.error('❌ Failed to load data:', error);
      setError('Failed to load doctors. Please try again.');
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // Get doctors by location
  const getDoctorsByLocation = (locationName: string) => {
    return doctors.filter(doc => doc.location === locationName);
  };

  // Get location icon
  const getLocationIcon = (location: string) => {
    const configs = getLocationConfigs();
    const found = configs.find(l => l.name === location);
    return found ? found.icon : <Building2 className="w-5 h-5" />;
  };

  // Get location color
  const getLocationColor = (location: string) => {
    const configs = getLocationConfigs();
    const found = configs.find(l => l.name === location);
    return found ? found.textColor : 'text-gray-600';
  };

  // Get location bg color
  const getLocationBgColor = (location: string) => {
    const configs = getLocationConfigs();
    const found = configs.find(l => l.name === location);
    return found ? found.bgColor : 'bg-gray-50';
  };

  // Format time to 12-hour format
  const formatTimeDisplay = (time?: string) => {
    if (!time || time === '') return 'Not set';
    
    try {
      const parts = time.split(':');
      if (parts.length < 2) return time;
      
      const hours = parseInt(parts[0]);
      const minutes = parts[1];
      
      if (isNaN(hours) || hours < 0 || hours > 23) return time;
      
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours % 12 || 12;
      
      return `${hour12}:${minutes} ${ampm}`;
    } catch (error) {
      return time;
    }
  };

  // Get schedule display text
  const getScheduleDisplay = (doctor: Doctor) => {
    if (!doctor.scheduleSlots || doctor.scheduleSlots.length === 0) {
      return null;
    }
    
    const availableSlots = doctor.scheduleSlots.filter(s => s.isAvailable);
    if (availableSlots.length === 0) return null;
    
    // Get unique day names
    const days = availableSlots
      .map(s => DAYS_OF_WEEK[s.dayOfWeek])
      .filter(Boolean);
    
    // Get unique time ranges
    const timeRanges = availableSlots.map(s => {
      const start = formatTimeDisplay(s.startTime);
      const end = formatTimeDisplay(s.endTime);
      return `${start} - ${end}`;
    });
    
    const uniqueDays = [...new Set(days)];
    const uniqueTimes = [...new Set(timeRanges)];
    
    // Format: "Monday, Wednesday, Friday - 9:00 AM - 5:00 PM"
    if (uniqueTimes.length === 1) {
      return `${uniqueDays.join(', ')} - ${uniqueTimes[0]}`;
    }
    
    // Multiple time ranges
    const timeDisplay = uniqueTimes.map(t => `(${t})`).join(' ');
    return `${uniqueDays.join(', ')} ${timeDisplay}`;
  };

  // Get location slug for doctor
  const getLocationSlug = (location: string) => {
    const configs = getLocationConfigs();
    const found = configs.find(l => l.name === location);
    return found ? found.slug : 'afilas-general';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm text-gray-500">Loading doctors...</p>
        </div>
      </div>
    );
  }

  // Get location configs with counts
  const locationConfigs = getLocationConfigs();
  const locationsWithCounts: LocationStat[] = locationConfigs.map(config => ({
    ...config,
    count: getDoctorsByLocation(config.name).length
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-gray-900">Doctor Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all doctors across all locations</p>
        </div>
        <button
          onClick={() => load()}
          className="focus-ring rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-5 py-2.5 transition-colors flex items-center gap-2 shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-sm text-green-600">{success}</p>
          <button onClick={() => setSuccess('')} className="ml-auto">
            <XCircle className="w-4 h-4 text-green-600" />
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <XCircle className="w-5 h-5 text-red-600" />
          <p className="text-sm text-red-600">{error}</p>
          <button onClick={() => setError('')} className="ml-auto">
            <XCircle className="w-4 h-4 text-red-600" />
          </button>
        </div>
      )}

      {/* Location Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {locationsWithCounts.map((location) => {
          const count = location.count;
          
          return (
            <Link
              key={location.slug}
              href={`/admin/doctors/${location.slug}`}
              className={`block rounded-xl border ${location.borderColor} ${location.bgColor} p-6 hover:shadow-lg transition-all duration-200 group ${location.hoverBg}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${location.color} text-white`}>
                    {location.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{location.name}</h3>
                    <p className={`text-2xl font-bold ${location.textColor}`}>{count}</p>
                  </div>
                </div>
                <div className={`text-xs ${location.textColor} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  View All →
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs text-gray-500">
                  {count} doctor{count !== 1 ? 's' : ''} assigned
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* All Doctors List */}
      {doctors.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Doctors Found</h3>
          <p className="text-sm text-gray-500 mb-4">No doctors have been added to any location yet.</p>
          <Link
            href="/admin/doctors/afilas-general"
            className="inline-block focus-ring rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-5 py-2.5 transition-colors"
          >
            <UserPlus className="w-4 h-4 inline mr-2" />
            Add Doctor
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-sm text-gray-500">Showing {doctors.length} doctor{doctors.length !== 1 ? 's' : ''} across all locations</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doc) => {
              const scheduleDisplay = getScheduleDisplay(doc);
              const locationColor = getLocationColor(doc.location || '');
              const locationBgColor = getLocationBgColor(doc.location || '');
              const locationSlug = getLocationSlug(doc.location || '');
              
              return (
                <div key={doc.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col">
                  {/* Image Section */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex-shrink-0">
                    {doc.photoUrl ? (
                      <Image
                        src={doc.photoUrl}
                        alt={doc.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Stethoscope className="w-20 h-20 text-gray-300" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        doc.active !== false ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                      }`}>
                        {doc.active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {doc.location && (
                      <div className="absolute bottom-3 left-3">
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${locationBgColor} ${locationColor} border border-gray-200 flex items-center gap-1`}>
                          <MapPin className="w-3 h-3" />
                          {doc.location}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Content Section */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">{doc.name}</h3>
                    <p className="text-sm text-gray-600">{doc.specialization || doc.title}</p>
                    
                    {doc.email && (
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{doc.email}</span>
                      </p>
                    )}
                    
                    {doc.phone && (
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Phone className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{doc.phone}</span>
                      </p>
                    )}
                    
                    {doc.department && (
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{doc.department.name}</span>
                      </p>
                    )}
                    
                    {doc.experience !== undefined && doc.experience > 0 && (
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{doc.experience} years experience</span>
                      </p>
                    )}
                    
                    {doc.bio && (
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2">{doc.bio}</p>
                    )}
                    
                    {/* Schedule Display at Bottom */}
                    {scheduleDisplay && (
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <div className="flex items-start gap-2">
                          <Clock className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div className="text-xs">
                            <p className="font-medium text-gray-700">{scheduleDisplay}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                      <Link
                        href={`/admin/doctors/${locationSlug}`}
                        className="flex-1 text-sm text-blue-600 hover:text-blue-800 font-medium hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        View Location
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}