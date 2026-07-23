// app/(site)/doctors/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';
import { 
  ArrowLeft, 
  Stethoscope, 
  Mail, 
  Phone, 
  Building2, 
  Clock, 
  Calendar,
  Award,
  Briefcase,
  GraduationCap,
  Star,
  StarHalf,
  User,
  MapPin
} from 'lucide-react';

const BACKEND_URL = 'http://localhost:5000';

interface DoctorDetail {
  id: string;
  name: string;
  title: string;
  bio: string;
  photoUrl: string;
  departmentId: string;
  department: {
    id: string;
    name: string;
    description: string;
  };
  active: boolean;
  email: string;
  phone: string;
  specialization: string;
  experience: number;
  education: string;
  rating: number;
  consultationFee: number;
  scheduleSlots: any[];
  createdAt: string;
  updatedAt: string;
}

export default function DoctorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  
  const [doctor, setDoctor] = useState<DoctorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError('');
        console.log(`📡 Fetching doctor details for ID: ${id}`);
        
        const response = await api.get<any>(`/doctors/${id}`);
        console.log('📡 Doctor detail response:', response);
        
        // Extract doctor data from response
        let doctorData = null;
        
        if (response) {
          // If response has data property
          if (response.data) {
            doctorData = response.data;
          } 
          // If response itself is the doctor object
          else if (response.id) {
            doctorData = response;
          }
          // If response has success and data
          else if (response.success && response.data) {
            doctorData = response.data;
          }
        }
        
        if (doctorData) {
          setDoctor(doctorData);
          console.log('✅ Doctor details loaded:', doctorData.name);
        } else {
          setError('Doctor not found');
        }
      } catch (error) {
        console.error('❌ Error fetching doctor details:', error);
        setError('Failed to load doctor details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  const getImageUrl = (photoUrl: string | null) => {
    if (!photoUrl) return null;
    if (photoUrl.startsWith('http')) return photoUrl;
    if (photoUrl.startsWith('/uploads')) return `${BACKEND_URL}${photoUrl}`;
    return `${BACKEND_URL}/uploads/doctors/${photoUrl}`;
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C5A059] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading doctor details...</p>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Doctor Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The doctor you are looking for does not exist.'}</p>
          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C5A059] text-white rounded-lg hover:bg-[#B8963A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Doctors
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = getImageUrl(doctor.photoUrl);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-5 py-6">
        <Link
          href="/doctors"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#C5A059] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to All Doctors</span>
        </Link>
      </div>

      {/* Doctor Profile */}
      <div className="max-w-7xl mx-auto px-5 pb-16">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Section with Image and Basic Info */}
          <div className="md:flex">
            {/* Image Section */}
            <div className="md:w-1/3 bg-gradient-to-br from-[#C5A059]/10 to-[#C5A059]/5 p-8 flex items-center justify-center">
              <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-[#C5A059] shadow-xl">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={doctor.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const div = document.createElement('div');
                        div.className = 'w-full h-full flex items-center justify-center bg-gray-100 text-6xl text-gray-400 font-bold';
                        div.textContent = doctor.name.charAt(0);
                        parent.appendChild(div);
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 text-6xl text-gray-400 font-bold">
                    {doctor.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>

            {/* Info Section */}
            <div className="md:w-2/3 p-8 md:p-10">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <h1 className="font-display text-3xl md:text-4xl text-clinical-900">
                    {doctor.name}
                  </h1>
                  <p className="text-[#C5A059] text-lg font-medium mt-1">{doctor.title}</p>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      doctor.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {doctor.active ? 'Available' : 'Not Available'}
                    </span>
                    
                    {doctor.rating && doctor.rating > 0 && (
                      <div className="flex items-center gap-1">
                        {renderStars(doctor.rating)}
                        <span className="text-sm text-gray-600 ml-1">({doctor.rating})</span>
                      </div>
                    )}
                  </div>
                </div>

                {doctor.consultationFee && doctor.consultationFee > 0 && (
                  <div className="bg-[#C5A059]/10 px-4 py-2 rounded-lg">
                    <p className="text-sm text-gray-600">Consultation Fee</p>
                    <p className="text-xl font-bold text-[#C5A059]">${doctor.consultationFee}</p>
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {doctor.email && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4 text-[#C5A059]" />
                    <span className="text-sm">{doctor.email}</span>
                  </div>
                )}
                {doctor.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 text-[#C5A059]" />
                    <span className="text-sm">{doctor.phone}</span>
                  </div>
                )}
                {doctor.department && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building2 className="w-4 h-4 text-[#C5A059]" />
                    <span className="text-sm">{doctor.department.name}</span>
                  </div>
                )}
                {doctor.specialization && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Stethoscope className="w-4 h-4 text-[#C5A059]" />
                    <span className="text-sm">{doctor.specialization}</span>
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                {doctor.experience !== undefined && (
                  <div>
                    <p className="text-xs text-gray-400">Experience</p>
                    <p className="font-semibold text-gray-800">{doctor.experience}+ years</p>
                  </div>
                )}
                {doctor.scheduleSlots && doctor.scheduleSlots.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-400">Working Days</p>
                    <p className="font-semibold text-gray-800">{doctor.scheduleSlots.length} days</p>
                  </div>
                )}
                {doctor.education && (
                  <div>
                    <p className="text-xs text-gray-400">Education</p>
                    <p className="font-semibold text-gray-800 truncate">{doctor.education}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bio Section */}
          {doctor.bio && (
            <div className="px-8 md:px-10 pb-8">
              <div className="pt-6 border-t border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">About</h2>
                <p className="text-gray-600 leading-relaxed">{doctor.bio}</p>
              </div>
            </div>
          )}

          {/* Working Hours Section */}
          {doctor.scheduleSlots && doctor.scheduleSlots.length > 0 && (
            <div className="px-8 md:px-10 pb-8">
              <div className="pt-6 border-t border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Working Hours</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {doctor.scheduleSlots.map((slot: any, index: number) => {
                    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    return (
                      <div key={index} className="bg-gray-50 rounded-lg p-3">
                        <p className="font-medium text-gray-700">{days[slot.dayOfWeek]}</p>
                        <p className="text-sm text-gray-600">
                          {slot.startTime} - {slot.endTime}
                        </p>
                        <p className="text-xs text-gray-400">
                          {slot.isAvailable ? 'Available' : 'Unavailable'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="px-8 md:px-10 pb-8">
            <div className="pt-6 border-t border-gray-100 flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-[#C5A059] text-white rounded-lg hover:bg-[#B8963A] transition-colors font-medium">
                Book Appointment
              </button>
              <button className="px-6 py-3 border border-[#C5A059] text-[#C5A059] rounded-lg hover:bg-[#C5A059]/10 transition-colors font-medium">
                Contact Doctor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}