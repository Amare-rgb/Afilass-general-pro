// app/(site)/services/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Service, Department } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Loader2, 
  Building2, 
  DollarSign, 
  Clock, 
  Search,
  Filter,
  X
} from 'lucide-react';

export default function ServicesPage() {
  const { t } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      console.log('📡 Loading services and departments...');
      
      const [serviceRes, deptRes] = await Promise.all([
        api.get<any>('/services'),
        api.get<any>('/departments'),
      ]);

      let servicesData: Service[] = [];
      if (serviceRes) {
        if (Array.isArray(serviceRes)) servicesData = serviceRes;
        else if (serviceRes.data && Array.isArray(serviceRes.data)) servicesData = serviceRes.data;
        else if (serviceRes.services && Array.isArray(serviceRes.services)) servicesData = serviceRes.services;
      }
      setServices(servicesData);

      let departmentsData: Department[] = [];
      if (deptRes) {
        if (Array.isArray(deptRes)) departmentsData = deptRes;
        else if (deptRes.data && Array.isArray(deptRes.data)) departmentsData = deptRes.data;
        else if (deptRes.departments && Array.isArray(deptRes.departments)) departmentsData = deptRes.departments;
      }
      setDepartments(departmentsData);

      console.log(`✅ Loaded ${servicesData.length} services and ${departmentsData.length} departments`);
    } catch (error) {
      console.error('❌ Failed to load data:', error);
      setError(t('services.error_load'));
    } finally {
      setLoading(false);
    }
  }

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !selectedDepartment || service.departmentId === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const getDepartmentName = (departmentId: string) => {
    const dept = departments.find(d => d.id === departmentId);
    return dept?.name || t('services.unknown_department');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Search and Filter Section */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 py-2">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-col sm:flex-row gap-2 items-center">
            <div className="flex-1 w-full relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder={t('services.search_placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-7 pr-7 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-clinical-500 focus:border-clinical-500 transition-colors bg-gray-50 hover:bg-white"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="relative w-full sm:w-40 flex-shrink-0">
              <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full pl-7 pr-3 py-1 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-clinical-500 focus:border-clinical-500 transition-colors appearance-none bg-gray-50 hover:bg-white"
              >
                <option value="">{t('services.all_departments')}</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-6xl mx-auto px-5 py-6">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-clinical-700 animate-spin" />
              <p className="text-sm text-gray-500">{t('services.loading')}</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={loadData}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {t('services.retry')}
            </button>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('services.no_services')}</h3>
            <p className="text-sm text-gray-500">
              {searchTerm || selectedDepartment 
                ? t('services.adjust_filters')
                : t('services.no_services_available')}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-xs text-gray-500">
              {filteredServices.length} {t('services.service')}{filteredServices.length !== 1 ? 's' : ''} {t('services.found')}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredServices.map((service) => {
                const dept = departments.find(d => d.id === service.departmentId);
                return (
                  <div
                    key={service.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
                    onClick={() => setSelectedService(service)}
                  >
                    <div className="relative h-40 bg-gray-100 overflow-hidden">
                      {service.image ? (
                        <Image
                          src={service.image}
                          alt={service.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="text-xs mt-1">{t('services.no_image')}</span>
                        </div>
                      )}
                      
                      {dept && (
                        <div className="absolute top-2 left-2">
                          <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-sm text-clinical-700 text-[10px] font-medium px-2 py-0.5 rounded-md shadow-sm">
                            <Building2 className="w-3 h-3" />
                            {dept.name}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-3">
                      <h3 className="font-semibold text-gray-900 text-sm mb-0.5 line-clamp-1">
                        {service.name}
                      </h3>
                      {service.description && (
                        <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                          {service.description}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-1.5 text-xs text-gray-500">
                        {service.price && service.price > 0 && (
                          <span className="flex items-center gap-0.5 bg-green-50 text-green-700 px-1.5 py-0.5 rounded-md text-[10px]">
                            <DollarSign className="w-2.5 h-2.5" />
                            ${service.price.toFixed(2)}
                          </span>
                        )}
                        {service.duration && service.duration > 0 && (
                          <span className="flex items-center gap-0.5 bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-md text-[10px]">
                            <Clock className="w-2.5 h-2.5" />
                            {service.duration} min
                          </span>
                        )}
                      </div>

                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedService(service);
                          }}
                          className="w-full text-center text-xs text-clinical-700 hover:text-clinical-900 font-medium hover:bg-clinical-50 px-2 py-1 rounded-md transition-colors"
                        >
                          {t('services.view_details')} →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setSelectedService(null)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="font-semibold text-gray-900 text-xl">
                {selectedService.name}
              </h2>
              <button
                onClick={() => setSelectedService(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {selectedService.image && (
                <div className="relative w-full h-64 rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={selectedService.image}
                    alt={selectedService.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{t('services.description')}</h3>
                  <p className="text-gray-700 mt-1">{selectedService.description || t('services.no_description')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t('services.department')}</h3>
                    <p className="text-gray-700 mt-1 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-clinical-600" />
                      {getDepartmentName(selectedService.departmentId)}
                    </p>
                  </div>

                  {selectedService.price && selectedService.price > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">{t('services.price')}</h3>
                      <p className="text-gray-700 mt-1 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        ${selectedService.price.toFixed(2)}
                      </p>
                    </div>
                  )}

                  {selectedService.duration && selectedService.duration > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">{t('services.duration')}</h3>
                      <p className="text-gray-700 mt-1 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        {selectedService.duration} {t('services.minutes')}
                      </p>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">{t('services.status')}</h3>
                    <p className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        selectedService.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedService.isActive ? t('services.active') : t('services.inactive')}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <Link
                    href={`/appointment?service=${selectedService.id}`}
                    className="w-full block text-center bg-clinical-700 hover:bg-clinical-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                  >
                    {t('services.book_appointment')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}