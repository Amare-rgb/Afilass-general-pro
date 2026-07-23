// app/admin/doctors/page.tsx
'use client';

import { useEffect, useState, FormEvent, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api, ApiError } from '@/lib/api';
import { getToken, clearSession } from '@/lib/auth';
import { Department, Doctor } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Upload,
  X,
  Stethoscope,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  UserPlus,
  Edit,
  Trash2,
  RefreshCw,
  Mail,
  Phone
} from 'lucide-react';

const emptyForm = { 
  name: '', 
  title: '', 
  bio: '', 
  photoUrl: '',
  email: '',
  phone: '',
  departmentId: ''
};

export default function AdminDoctorsPage() {
  const { t } = useLanguage();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    setError('');
    try {
      console.log('📡 Loading doctors and departments from backend...');
      
      const [doctorsResponse, deptResponse] = await Promise.all([
        api.get<any>('/doctors'),
        api.get<any>('/departments'),
      ]);
      
      let doctorsData: Doctor[] = [];
      if (doctorsResponse) {
        if (Array.isArray(doctorsResponse)) {
          doctorsData = doctorsResponse;
        } else if (doctorsResponse.data && Array.isArray(doctorsResponse.data)) {
          doctorsData = doctorsResponse.data;
        } else if (doctorsResponse.doctors && Array.isArray(doctorsResponse.doctors)) {
          doctorsData = doctorsResponse.doctors;
        }
      }
      
      let departmentsData: Department[] = [];
      if (deptResponse) {
        if (Array.isArray(deptResponse)) {
          departmentsData = deptResponse;
        } else if (deptResponse.data && Array.isArray(deptResponse.data)) {
          departmentsData = deptResponse.data;
        } else if (deptResponse.departments && Array.isArray(deptResponse.departments)) {
          departmentsData = deptResponse.departments;
        }
      }
      
      setDoctors(doctorsData);
      setDepartments(departmentsData);
      
      console.log(`✅ Loaded ${doctorsData.length} doctors and ${departmentsData.length} departments`);
    } catch (error) {
      console.error('❌ Failed to load data:', error);
      setDoctors([]);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const token = getToken();
      console.log('🔑 Token:', token ? 'Present' : 'MISSING!');
      
      if (!token) {
        throw new Error(t('admin.doctors.error_no_token'));
      }
      
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      console.log('📡 Upload response status:', response.status);
      
      const data = await response.json();
      console.log('📡 Upload response data:', data);
      
      if (response.status === 401) {
        clearSession();
        throw new Error(t('admin.doctors.error_session_expired'));
      }
      
      if (!response.ok) {
        throw new Error(data.error || data.message || t('admin.doctors.error_upload_failed'));
      }
      
      if (!data.url) {
        throw new Error(t('admin.doctors.error_no_url'));
      }
      
      return data.url;
    } catch (error) {
      console.error('❌ Upload error:', error);
      throw error;
    }
  };

  function startCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setError('');
    setSuccess('');
    setImageFile(null);
    setImagePreview('');
  }

  function startEdit(doc: Doctor) {
    setEditingId(doc.id);
    setForm({
      name: doc.name,
      title: doc.title || '',
      bio: doc.bio || '',
      photoUrl: doc.photoUrl || '',
      email: doc.email || '',
      phone: doc.phone || '',
      departmentId: doc.departmentId,
    });
    setImagePreview(doc.photoUrl || '');
    setShowForm(true);
    setError('');
    setSuccess('');
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      if (!form.email) {
        setError(t('admin.doctors.error_email_required'));
        setSaving(false);
        return;
      }
      
      let photoUrl = form.photoUrl;
      
      if (imageFile) {
        try {
          console.log('📸 Uploading image...');
          photoUrl = await uploadImage(imageFile);
          console.log('📸 Image uploaded successfully:', photoUrl);
        } catch (uploadError) {
          console.error('Upload failed:', uploadError);
          setError(uploadError instanceof Error ? uploadError.message : t('admin.doctors.error_upload_image'));
          setSaving(false);
          return;
        }
      }
      
      const doctorData = { 
        name: form.name,
        title: form.title,
        bio: form.bio || '',
        photoUrl: photoUrl,
        email: form.email,
        phone: form.phone || '',
        departmentId: form.departmentId,
        active: true
      };
      
      if (editingId) {
        console.log('📝 Updating doctor:', editingId);
        await api.put(`/doctors/${editingId}`, doctorData, true);
        setSuccess(t('admin.doctors.updated'));
      } else {
        console.log('📝 Creating new doctor');
        await api.post('/doctors', doctorData, true);
        setSuccess(t('admin.doctors.created'));
      }
      
      setShowForm(false);
      await load();
      setImageFile(null);
      setImagePreview('');
    } catch (err) {
      console.error('❌ Error saving doctor:', err);
      
      if (err instanceof ApiError && err.message?.toLowerCase().includes('email already exists')) {
        setError(t('admin.doctors.error_email_exists'));
      } else if (err instanceof ApiError) {
        setError(err.message || t('admin.doctors.error_save'));
      } else {
        setError(t('admin.doctors.error_save'));
      }
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm(t('admin.doctors.confirm_delete'))) return;
    try {
      console.log('🗑️ Deleting doctor:', id);
      await api.delete(`/doctors/${id}`, true);
      setSuccess(t('admin.doctors.deleted'));
      await load();
    } catch (error) {
      console.error('❌ Failed to delete doctor:', error);
      alert(t('admin.doctors.error_delete'));
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-clinical-900">{t('admin.doctors.title')}</h1>
          <p className="text-sm text-gray-500 mt-1">{t('admin.doctors.subtitle')}</p>
        </div>
        <button
          onClick={startCreate}
          className="focus-ring rounded-lg bg-clinical-700 hover:bg-clinical-800 text-white text-sm font-semibold px-5 py-2.5 transition-colors flex items-center gap-2 shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          {t('admin.doctors.add')}
        </button>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-sm text-green-600">{success}</p>
          <button onClick={() => setSuccess('')} className="ml-auto">
            <X className="w-4 h-4 text-green-600" />
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 animate-fadeIn">
          <XCircle className="w-5 h-5 text-red-600" />
          <p className="text-sm text-red-600">{error}</p>
          <button onClick={() => setError('')} className="ml-auto">
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slideUp">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="font-semibold text-clinical-900 text-xl flex items-center gap-2">
                {editingId ? (
                  <>
                    <Edit className="w-5 h-5 text-clinical-600" />
                    {t('admin.doctors.edit')}
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 text-clinical-600" />
                    {t('admin.doctors.add_new')}
                  </>
                )}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setImageFile(null);
                  setImagePreview('');
                  setError('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-dashed border-gray-300 flex items-center justify-center">
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
                        alt="Doctor preview"
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <Stethoscope className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-clinical-700 text-white p-2 rounded-full hover:bg-clinical-800 transition-colors shadow-lg"
                  >
                    <Upload size={16} />
                  </button>
                </div>
                <p className="text-xs text-gray-400">{t('admin.doctors.upload_hint')}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('admin.doctors.full_name')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="focus-ring w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-clinical-500 transition-colors"
                    placeholder={t('admin.doctors.name_placeholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('admin.doctors.title')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    placeholder={t('admin.doctors.title_placeholder')}
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="focus-ring w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-clinical-500 transition-colors"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('admin.doctors.email')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      required
                      type="email"
                      placeholder={t('admin.doctors.email_placeholder')}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="focus-ring w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 focus:border-clinical-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('admin.doctors.phone')}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      placeholder={t('admin.doctors.phone_placeholder')}
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="focus-ring w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 focus:border-clinical-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('admin.doctors.department')} <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={form.departmentId}
                  onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
                  className="focus-ring w-full rounded-lg border border-gray-300 px-4 py-2.5 bg-white focus:border-clinical-500 transition-colors"
                >
                  <option value="">{t('admin.doctors.select_department')}</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
                {departments.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">
                    ⚠️ {t('admin.doctors.no_departments')}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t('admin.doctors.bio')}
                </label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="focus-ring w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-clinical-500 transition-colors"
                  placeholder={t('admin.doctors.bio_placeholder')}
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
                  disabled={saving || departments.length === 0}
                  className="flex-1 focus-ring rounded-lg bg-clinical-700 hover:bg-clinical-800 disabled:opacity-50 text-white text-sm font-semibold px-6 py-2.5 transition-colors flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t('admin.doctors.saving')}
                    </>
                  ) : (
                    editingId ? t('admin.doctors.update') : t('admin.doctors.add')
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setImageFile(null);
                    setImagePreview('');
                    setError('');
                  }}
                  className="flex-1 focus-ring rounded-lg border border-gray-300 text-gray-700 text-sm font-semibold px-6 py-2.5 hover:bg-gray-50 transition-colors"
                >
                  {t('button.cancel')}
                </button>
              </div>
              {departments.length === 0 && !editingId && (
                <p className="text-xs text-amber-600 text-center -mt-2">
                  ⚠️ {t('admin.doctors.no_departments_warning')}
                </p>
              )}
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-clinical-700 animate-spin" />
            <p className="text-sm text-clinical-500">{t('admin.doctors.loading')}</p>
          </div>
        </div>
      ) : (
        <>
          {doctors.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('admin.doctors.no_doctors')}</h3>
              <p className="text-sm text-gray-500 mb-4">{t('admin.doctors.no_doctors_hint')}</p>
              <button
                onClick={startCreate}
                className="focus-ring rounded-lg bg-clinical-700 hover:bg-clinical-800 text-white text-sm font-semibold px-5 py-2.5 transition-colors"
              >
                + {t('admin.doctors.add')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doc) => (
                <div key={doc.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 group">
                  <div className="relative h-56 bg-gradient-to-br from-clinical-50 to-gray-100">
                    {doc.photoUrl ? (
                      <Image
                        src={doc.photoUrl}
                        alt={doc.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Stethoscope className="w-20 h-20 text-clinical-300" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                        doc.active === true ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                      }`}>
                        {doc.active === true ? t('admin.doctors.active') : t('admin.doctors.inactive')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h3 className="font-semibold text-clinical-900 text-lg">{doc.name}</h3>
                    <p className="text-sm text-clinical-600">{doc.title}</p>
                    
                    {doc.email && (
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {doc.email}
                      </p>
                    )}
                    
                    <div className="mt-3 space-y-1.5">
                      {doc.department && (
                        <p className="text-xs text-gray-500 flex items-center gap-2">
                          <Building2 className="w-3.5 h-3.5" />
                          {doc.department.name}
                        </p>
                      )}
                      {doc.scheduleSlots && doc.scheduleSlots.length > 0 && (
                        <p className="text-xs text-gray-500 flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" />
                          {doc.scheduleSlots.length} {t('admin.doctors.schedule_slots')}
                        </p>
                      )}
                    </div>
                    
                    {doc.bio && (
                      <p className="text-xs text-gray-500 mt-3 line-clamp-2">{doc.bio}</p>
                    )}
                    
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                      <button 
                        onClick={() => startEdit(doc)} 
                        className="flex-1 text-sm text-clinical-700 hover:text-clinical-900 font-medium hover:bg-clinical-50 px-3 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        {t('button.edit')}
                      </button>
                      <button 
                        onClick={() => remove(doc.id)} 
                        className="flex-1 text-sm text-red-600 hover:text-red-800 font-medium hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        {t('button.delete')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      
      {!loading && doctors.length > 0 && (
        <div className="mt-4 text-xs text-gray-400 flex items-center justify-between">
          <span>{t('admin.doctors.showing')} {doctors.length} {t('admin.doctors.doctor')}{doctors.length !== 1 ? 's' : ''}</span>
          <button
            onClick={() => load()}
            className="text-clinical-600 hover:text-clinical-800 transition-colors flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            {t('button.refresh')}
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}