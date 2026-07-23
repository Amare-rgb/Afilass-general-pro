// app/admin/services/page.tsx
'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import Image from 'next/image';
import { api, ApiError } from '@/lib/api';
import { Service, Department } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Plus, 
  X, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Image as ImageIcon,
  Trash2,
  Edit2,
  GripVertical,
  Upload,
  Building2,
  DollarSign,
  Clock
} from 'lucide-react';

export default function AdminServicesPage() {
  const { t } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    departmentId: '',
    image: null as File | null,
    imagePreview: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      console.log('📡 Loading services and departments...');
      
      const [serviceRes, deptRes] = await Promise.all([
        api.get<any>('/services?includeInactive=true'),
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
      setError(t('admin.services.error_load'));
    } finally {
      setLoading(false);
    }
  }

  function startCreate() {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      departmentId: '',
      image: null,
      imagePreview: '',
    });
    setShowForm(true);
    setError('');
    setSuccess('');
  }

  function startEdit(service: Service) {
    setEditingId(service.id);
    setFormData({
      name: service.name || '',
      description: service.description || '',
      price: service.price?.toString() || '',
      duration: service.duration?.toString() || '',
      departmentId: service.departmentId || '',
      image: null,
      imagePreview: service.image || '',
    });
    setShowForm(true);
    setError('');
    setSuccess('');
  }

  function handleImageChange(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      setFormData({
        ...formData,
        image: file,
        imagePreview: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageChange(file);
    } else {
      setError(t('admin.services.error_drop_image'));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('departmentId', formData.departmentId);
      if (formData.price) data.append('price', formData.price);
      if (formData.duration) data.append('duration', formData.duration);
      if (formData.image) data.append('image', formData.image);

      if (editingId) {
        await api.put(`/services/${editingId}`, data, true);
        setSuccess(t('admin.services.updated'));
      } else {
        await api.post('/services', data, true);
        setSuccess(t('admin.services.created'));
      }

      setShowForm(false);
      await loadData();
    } catch (err) {
      console.error('❌ Save error:', err);
      setError(err instanceof ApiError ? err.message : t('admin.services.error_save'));
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm(t('admin.services.confirm_delete'))) return;
    try {
      await api.delete(`/services/${id}`, true);
      setSuccess(t('admin.services.deleted'));
      await loadData();
    } catch (error) {
      console.error('❌ Failed to delete service:', error);
      setError(t('admin.services.error_delete'));
    }
  }

  const handleRefresh = async () => {
    await loadData();
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-clinical-900">{t('admin.services.title')}</h1>
          <p className="text-sm text-gray-500 mt-1">{t('admin.services.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200">
            {services.length} {t('admin.services.service')}{services.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-500 hover:text-clinical-700 hover:bg-gray-100 rounded-lg transition-colors"
            title={t('button.refresh')}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={startCreate}
            className="focus-ring rounded-lg bg-clinical-700 hover:bg-clinical-800 text-white text-sm font-semibold px-5 py-2.5 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {t('admin.services.add_service')}
          </button>
        </div>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-600">{success}</p>
          <button onClick={() => setSuccess('')} className="ml-auto">
            <X className="w-4 h-4 text-green-600" />
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 animate-fadeIn">
          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
          <button onClick={() => setError('')} className="ml-auto">
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="font-semibold text-clinical-900 text-xl flex items-center gap-2">
                {editingId ? (
                  <>
                    <Edit2 className="w-5 h-5 text-clinical-600" />
                    {t('admin.services.edit_service')}
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 text-clinical-600" />
                    {t('admin.services.add_new_service')}
                  </>
                )}
              </h2>
              <button
                onClick={() => { setShowForm(false); setError(''); }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Image Upload with Drag & Drop */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('admin.services.service_image')}
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                    dragOver 
                      ? 'border-clinical-500 bg-clinical-50' 
                      : formData.imagePreview 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-300 hover:border-clinical-400'
                  }`}
                >
                  {formData.imagePreview ? (
                    <div className="relative">
                      <div className="relative w-48 h-48 mx-auto rounded-lg overflow-hidden">
                        <Image
                          src={formData.imagePreview}
                          alt={t('admin.services.service_preview')}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: null, imagePreview: '' })}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <p className="text-xs text-green-600 mt-2">✓ {t('admin.services.image_uploaded')}</p>
                    </div>
                  ) : (
                    <div className="py-8">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600">
                        {t('admin.services.drag_drop')}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {t('admin.services.image_support')}
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-3 px-4 py-2 bg-clinical-700 text-white text-sm rounded-lg hover:bg-clinical-800 transition-colors"
                      >
                        {t('admin.services.choose_image')}
                      </button>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageChange(file);
                    }}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('admin.services.service_name')} <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="focus-ring w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-clinical-500 transition-colors"
                  placeholder={t('admin.services.service_name_placeholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('admin.services.description')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="focus-ring w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-clinical-500 transition-colors"
                  placeholder={t('admin.services.description_placeholder')}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('admin.services.department')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    className="focus-ring w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-clinical-500 transition-colors bg-white"
                  >
                    <option value="">{t('admin.services.select_department')}</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('admin.services.price')}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="focus-ring w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-clinical-500 transition-colors"
                    placeholder={t('admin.services.price_placeholder')}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('admin.services.duration')}
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="focus-ring w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-clinical-500 transition-colors"
                  placeholder={t('admin.services.duration_placeholder')}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 focus-ring rounded-lg bg-clinical-700 hover:bg-clinical-800 disabled:opacity-50 text-white text-sm font-semibold px-6 py-2.5 transition-colors flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t('button.saving')}
                    </>
                  ) : (
                    editingId ? t('admin.services.update_service') : t('admin.services.create_service')
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setError(''); }}
                  className="flex-1 focus-ring rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold px-6 py-2.5 hover:bg-gray-50 transition-colors"
                >
                  {t('button.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Services Grid */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-clinical-700 animate-spin" />
            <p className="text-sm text-clinical-500">{t('admin.services.loading')}</p>
          </div>
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('admin.services.no_services')}</h3>
          <p className="text-sm text-gray-500 mb-4">{t('admin.services.no_services_hint')}</p>
          <button
            onClick={startCreate}
            className="focus-ring rounded-lg bg-clinical-700 hover:bg-clinical-800 text-white text-sm font-semibold px-5 py-2.5 transition-colors"
          >
            + {t('admin.services.add_service')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const dept = departments.find(d => d.id === service.departmentId);
            return (
              <div
                key={service.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 group"
              >
                <div className="relative h-48 bg-gray-100">
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-16 h-16 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      service.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                    }`}>
                      {service.isActive ? t('admin.services.active') : t('admin.services.inactive')}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-clinical-900 text-lg">{service.name}</h3>
                  {service.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{service.description}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-3 mt-3">
                    {dept && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {dept.name}
                      </span>
                    )}
                    {service.price && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        ${service.price.toFixed(2)}
                      </span>
                    )}
                    {service.duration && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {service.duration} {t('admin.services.min')}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => startEdit(service)}
                      className="flex-1 text-sm text-clinical-700 hover:text-clinical-900 font-medium hover:bg-clinical-50 px-3 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      {t('button.edit')}
                    </button>
                    <button
                      onClick={() => remove(service.id)}
                      className="flex-1 text-sm text-red-600 hover:text-red-800 font-medium hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {t('button.delete')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}