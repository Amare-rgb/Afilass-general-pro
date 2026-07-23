// app/(site)/doctors/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Doctor } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';

const BACKEND_URL = 'http://localhost:5000';

// Department colors for badge
const DEPARTMENT_COLORS: Record<string, string> = {
  'General Surgery': 'bg-blue-100 text-blue-800',
  'Neurosurgery': 'bg-purple-100 text-purple-800',
  'Ophthalmology': 'bg-sky-100 text-sky-800',
  'Internal Medicine': 'bg-green-100 text-green-800',
  'Cardiology': 'bg-red-100 text-red-800',
  'Neurology': 'bg-indigo-100 text-indigo-800',
  'Orthopedics': 'bg-amber-100 text-amber-800',
  'Pediatrics': 'bg-pink-100 text-pink-800',
  'Oncology': 'bg-violet-100 text-violet-800',
  'Emergency Medicine': 'bg-orange-100 text-orange-800',
};

export default function DoctorsPage() {
  const { t } = useLanguage();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError('');
        console.log('📡 Fetching doctors from API...');
        
        const response = await api.get<any>('/doctors');
        console.log('📡 Full API Response:', response);
        
        let doctorsArray: any[] = [];
        
        if (response) {
          if (response.data && Array.isArray(response.data)) {
            doctorsArray = response.data;
          } else if (Array.isArray(response)) {
            doctorsArray = response;
          } else if (response.doctors && Array.isArray(response.doctors)) {
            doctorsArray = response.doctors;
          } else if (response.success && response.data && Array.isArray(response.data)) {
            doctorsArray = response.data;
          }
        }
        
        console.log(`📊 Found ${doctorsArray.length} doctors in response`);
        
        if (doctorsArray.length > 0) {
          const mappedData = doctorsArray.map((doc: any) => {
            return {
              id: doc.id,
              name: doc.name || 'Unknown Doctor',
              title: doc.title || doc.specialization || 'Doctor',
              specialty: doc.specialty || doc.specialization || 'General',
              photoUrl: doc.photoUrl || doc.image || null,
              experience: doc.experience ? `${doc.experience}+ years` : null,
              department: doc.department?.name || doc.department || 'General',
              active: doc.active !== undefined ? doc.active : doc.isAvailable !== undefined ? doc.isAvailable : true,
              departmentId: doc.departmentId,
              departmentObj: doc.department,
              email: doc.email,
              phone: doc.phone,
            };
          });
          setDoctors(mappedData);
          console.log(`✅ Mapped ${mappedData.length} doctors for display`);
        } else {
          console.warn('⚠️ No doctors found in response');
          setDoctors([]);
        }
      } catch (error) {
        console.error('❌ Error fetching doctors:', error);
        setError(t('doctors.error_load'));
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [t]);

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getImageUrl = (photoUrl: string | null) => {
    if (!photoUrl) return null;
    if (photoUrl.startsWith('http')) return photoUrl;
    if (photoUrl.startsWith('/uploads')) return `${BACKEND_URL}${photoUrl}`;
    return `${BACKEND_URL}/uploads/doctors/${photoUrl}`;
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-5 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#C5A059] font-semibold mb-4">
            {t('doctors.our_team')}
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-clinical-900 mb-4">
            {t('doctors.meet_our_doctors')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('doctors.description')}
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-4 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-5">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="flex-1 relative w-full">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder={t('doctors.search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-[#C5A059] focus:outline-none transition-colors"
              />
            </div>
            <div className="text-xs text-gray-500 whitespace-nowrap">
              {filteredDoctors.length} {t('doctors.doctor')}{filteredDoctors.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-5">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C5A059]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 text-[#C5A059] hover:text-[#B8963A] font-semibold"
              >
                {t('doctors.retry')}
              </button>
            </div>
          ) : filteredDoctors.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">
                {searchTerm ? t('doctors.no_results') : t('doctors.no_doctors')}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 text-[#C5A059] hover:text-[#B8963A] font-semibold"
                >
                  {t('doctors.clear_search')}
                </button>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDoctors.map((doctor) => {
                const imageUrl = getImageUrl(doctor.photoUrl);
                const deptColor = DEPARTMENT_COLORS[doctor.specialty] || 
                                 DEPARTMENT_COLORS[doctor.department] || 
                                 'bg-gray-100 text-gray-800';

                return (
                  <Link
                    key={doctor.id}
                    href={`/doctors/${doctor.id}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02]"
                  >
                    {/* Doctor Image - Fixed Circular Display */}
                    <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-[#C5A059]/10 group-hover:to-[#C5A059]/5 transition-all duration-500 flex items-center justify-center">
                      <div className="relative w-40 h-40">
                        {/* Decorative ring */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 group-hover:from-[#C5A059] group-hover:to-[#B8963A] transition-all duration-500 scale-105"></div>

                        {/* Image container */}
                        <div className="absolute inset-0 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={doctor.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              sizes="(max-width: 160px) 100vw, 160px"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  const div = document.createElement('div');
                                  div.className = 'w-full h-full flex items-center justify-center bg-gray-100 text-4xl text-gray-400 font-bold';
                                  div.textContent = doctor.name.charAt(0);
                                  parent.appendChild(div);
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-4xl text-gray-400 font-bold">
                              {doctor.name.charAt(0)}
                            </div>
                          )}
                        </div>

                        {/* Hover ring effect */}
                        <div className="absolute inset-0 rounded-full border-4 border-transparent group-hover:border-[#C5A059] transition-all duration-500 scale-110 opacity-0 group-hover:opacity-100"></div>
                      </div>
                    </div>

                    {/* Doctor Info */}
                    <div className="p-4 text-center">
                      <h3 className="font-semibold text-clinical-900 text-base group-hover:text-[#C5A059] transition-colors duration-300 line-clamp-1">
                        {doctor.name}
                      </h3>
                      <p className="text-[#C5A059] text-xs font-medium mt-0.5 line-clamp-1">{doctor.title}</p>

                      <div className="flex flex-wrap gap-1.5 justify-center mt-2">
                        {doctor.specialty && (
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${deptColor}`}>
                            {doctor.specialty}
                          </span>
                        )}
                        {doctor.department && doctor.department !== doctor.specialty && (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                            {doctor.department}
                          </span>
                        )}
                      </div>

                      {doctor.experience && (
                        <div className="mt-1.5 text-xs text-gray-400">
                          {doctor.experience} {t('doctors.experience')}
                        </div>
                      )}

                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <span className="text-xs text-[#C5A059] font-medium group-hover:underline">
                          {t('doctors.view_profile')} →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}