// C:\Afilass\afilas-hospital\frontend\src\app\admin\doctors\afilas-diagnosis\page.tsx
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
  Phone,
  ArrowLeft,
  Activity,
  Calendar
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

const LOCATION_NAME = 'Afilas Diagnosis Center';

export default function AfilasDiagnosisDoctorsPage() {
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
      console.log(`📡 Loading doctors for ${LOCATION_NAME}...`);
      
      const doctorsResponse = await api.get<any>(`/doctors?location=${encodeURIComponent(LOCATION_NAME)}`);
      
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
      
      const deptResponse = await api.get<any>(`/departments?location=${encodeURIComponent(LOCATION_NAME)}`);
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
      
      console.log(`✅ Loaded ${doctorsData.length} doctors and ${departmentsData.length} departments for ${LOCATION_NAME}`);
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
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.status === 401) {
        clearSession();
        throw new Error('Session expired. Please login again.');
      }
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Upload failed');
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
        setError('Email is required');
        setSaving(false);
        return;
      }
      
      let photoUrl = form.photoUrl;
      
      if (imageFile) {
        try {
          photoUrl = await uploadImage(imageFile);
        } catch (uploadError) {
          setError(uploadError instanceof Error ? uploadError.message : 'Failed to upload image');
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
        location: LOCATION_NAME,
        active: true
      };
      
      if (editingId) {
        await api.put(`/doctors/${editingId}`, doctorData, true);
        setSuccess('Doctor updated successfully');
      } else {
        await api.post('/doctors', doctorData, true);
        setSuccess('Doctor created successfully');
      }
      
      setShowForm(false);
      await load();
      setImageFile(null);
      setImagePreview('');
    } catch (err) {
      console.error('❌ Error saving doctor:', err);
      setError(err instanceof Error ? err.message : 'Failed to save doctor');
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('Are you sure you want to delete this doctor?')) return;
    try {
      await api.delete(`/doctors/${id}`, true);
      setSuccess('Doctor deleted successfully');
      await load();
    } catch (error) {
      console.error('❌ Failed to delete doctor:', error);
      alert('Failed to delete doctor');
    }
  }

  return (
    <>
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/doctors" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
          </Link>
          <div>
            <h1 className="font-display text-3xl text-clinical-900 flex items-center gap-2">
              <Activity className="w-7 h-7 text-purple-600" />
              Afilas Diagnosis Center
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage doctors for Afilas Diagnosis Center</p>
          </div>
        </div>
        <button
          onClick={startCreate}
          className="focus-ring rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-5 py-2.5 transition-colors flex items-center gap-2 shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          Add Doctor
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-sm text-green-600">{success}</p>
          <button onClick={() => setSuccess('')} className="ml-auto">
            <X className="w-4 h-4 text-green-600" />
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <XCircle className="w-5 h-5 text-red-600" />
          <p className="text-sm text-red-600">{error}</p>
          <button onClick={() => setError('')} className="ml-auto">
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="font-semibold text-clinical-900 text-xl flex items-center gap-2">
                {editingId ? (
                  <>
                    <Edit className="w-5 h-5 text-clinical-600" />
                    Edit Doctor
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 text-clinical-600" />
                    Add New Doctor
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
                    className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors shadow-lg"
                  >
                    <Upload size={16} />
                  </button>
                </div>
                <p className="text-xs text-gray-400">Upload doctor photo (JPG, PNG)</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="focus-ring w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-purple-500 transition-colors"
                    placeholder="Dr. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    placeholder="Cardiologist"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="focus-ring w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      required
                      type="email"
                      placeholder="doctor@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="focus-ring w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="+251-911-123456"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="focus-ring w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
              
             
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Bio
                </label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="focus-ring w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-purple-500 transition-colors"
                  placeholder="Doctor's biography..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 focus-ring rounded-lg bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-semibold px-6 py-2.5 transition-colors flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingId ? 'Update Doctor' : 'Add Doctor'
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
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Doctors List */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
      ) : doctors.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Doctors Found</h3>
          <p className="text-sm text-gray-500 mb-4">No doctors available for Afilas Diagnosis Center</p>
          <button
            onClick={startCreate}
            className="focus-ring rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-5 py-2.5 transition-colors"
          >
            + Add Doctor
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200">
              <div className="relative h-56 bg-gradient-to-br from-purple-50 to-gray-100">
                {doc.photoUrl ? (
                  <Image
                    src={doc.photoUrl}
                    alt={doc.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Stethoscope className="w-20 h-20 text-purple-300" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    doc.active ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                  }`}>
                    {doc.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 text-lg">{doc.name}</h3>
                <p className="text-sm text-gray-600">{doc.title}</p>
                
                {doc.email && (
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {doc.email}
                  </p>
                )}
                
                <div className="mt-3">
                  {doc.department && (
                    <p className="text-xs text-gray-500 flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5" />
                      {doc.department.name}
                    </p>
                  )}
                </div>
                
                {doc.bio && (
                  <p className="text-xs text-gray-500 mt-3 line-clamp-2">{doc.bio}</p>
                )}
                
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => startEdit(doc)} 
                    className="flex-1 text-sm text-purple-600 hover:text-purple-800 font-medium hover:bg-purple-50 px-3 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button 
                    onClick={() => remove(doc.id)} 
                    className="flex-1 text-sm text-red-600 hover:text-red-800 font-medium hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {!loading && doctors.length > 0 && (
        <div className="mt-4 text-xs text-gray-400 flex items-center justify-between">
          <span>Showing {doctors.length} doctor{doctors.length !== 1 ? 's' : ''} for Afilas Diagnosis Center</span>
          <button
            onClick={() => load()}
            className="text-purple-600 hover:text-purple-800 transition-colors flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Refresh
          </button>
        </div>
      )}
    </>
  );
}