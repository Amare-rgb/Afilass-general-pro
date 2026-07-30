// app/admin/doctors/afilas-drug/page.tsx
'use client';

import { useEffect, useState, FormEvent, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api, ApiError } from '@/lib/api';
import { getToken, clearSession } from '@/lib/auth';
import { Doctor, ScheduleSlot } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Upload,
  X,
  Stethoscope,
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
  Pill,
  Clock,
  Calendar
} from 'lucide-react';

interface DoctorFormData {
  name: string;
  title: string;
  bio: string;
  photoUrl: string;
  email: string;
  phone: string;
  specialization: string;
  experience: number;
  scheduleSlots: {
    [key: number]: {
      startTime: string;
      endTime: string;
      isAvailable: boolean;
    }
  };
}

const emptyForm: DoctorFormData = { 
  name: '', 
  title: '', 
  bio: '', 
  photoUrl: '',
  email: '',
  phone: '',
  specialization: '',
  experience: 0,
  scheduleSlots: {
    0: { startTime: '', endTime: '', isAvailable: false },
    1: { startTime: '', endTime: '', isAvailable: false },
    2: { startTime: '', endTime: '', isAvailable: false },
    3: { startTime: '', endTime: '', isAvailable: false },
    4: { startTime: '', endTime: '', isAvailable: false },
    5: { startTime: '', endTime: '', isAvailable: false },
    6: { startTime: '', endTime: '', isAvailable: false }
  }
};

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const LOCATION_NAME = 'Afilas Drug Manufacturing';

export default function AfilasDrugDoctorsPage() {
  const { t } = useLanguage();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DoctorFormData>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    setError('');
    try {
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
      
      setDoctors(doctorsData);
      console.log(`✅ Loaded ${doctorsData.length} doctors for ${LOCATION_NAME}`);
      console.log('📅 Sample doctor schedule:', doctorsData[0]?.scheduleSlots);
    } catch (error) {
      console.error('❌ Failed to load data:', error);
      setDoctors([]);
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
      if (!token) throw new Error('No authentication token found');
      
      const response = await fetch('http://localhost:5000/api/upload?type=doctors', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      
      const data = await response.json();
      if (response.status === 401) {
        clearSession();
        throw new Error('Session expired. Please login again.');
      }
      if (!response.ok) throw new Error(data.error || data.message || 'Upload failed');
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
    const scheduleSlots = { ...emptyForm.scheduleSlots };
    if (doc.scheduleSlots && doc.scheduleSlots.length > 0) {
      doc.scheduleSlots.forEach(slot => {
        if (slot.dayOfWeek !== undefined && slot.dayOfWeek >= 0 && slot.dayOfWeek <= 6) {
          scheduleSlots[slot.dayOfWeek] = {
            startTime: slot.startTime || '',
            endTime: slot.endTime || '',
            isAvailable: slot.isAvailable !== undefined ? slot.isAvailable : true
          };
        }
      });
    }

    setEditingId(doc.id);
    setForm({
      name: doc.name,
      title: doc.title || '',
      bio: doc.bio || '',
      photoUrl: doc.photoUrl || '',
      email: doc.email || '',
      phone: doc.phone || '',
      specialization: doc.specialization || '',
      experience: doc.experience || 0,
      scheduleSlots
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
      if (!form.name.trim()) {
        setError('Name is required');
        setSaving(false);
        return;
      }
      if (!form.specialization.trim()) {
        setError('Specialization is required');
        setSaving(false);
        return;
      }
      if (!form.email.trim()) {
        setError('Email is required');
        setSaving(false);
        return;
      }
      
      let photoUrl = form.photoUrl;
      if (imageFile) {
        setUploadingImage(true);
        try {
          photoUrl = await uploadImage(imageFile);
        } catch (uploadError) {
          setError(uploadError instanceof Error ? uploadError.message : 'Failed to upload image');
          setSaving(false);
          setUploadingImage(false);
          return;
        }
        setUploadingImage(false);
      }
      
      // Convert schedule slots to workingHours format for backend
      const workingHours = Object.entries(form.scheduleSlots)
        .filter(([_, slot]) => slot.isAvailable && slot.startTime && slot.endTime)
        .map(([day, slot]) => ({
          dayOfWeek: parseInt(day),
          startTime: slot.startTime,
          endTime: slot.endTime,
          isAvailable: true
        }));

      const doctorData = { 
        name: form.name,
        title: form.specialization,
        bio: form.bio || '',
        photoUrl: photoUrl,
        email: form.email,
        phone: form.phone || '',
        specialization: form.specialization,
        experience: form.experience || 0,
        location: LOCATION_NAME,
        active: true,
        workingHours: workingHours
      };

      console.log('📤 Sending doctor data:', JSON.stringify(doctorData, null, 2));
      console.log('📅 Working hours:', workingHours);
      
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
      setUploadingImage(false);
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
      return 'No schedule set';
    }
    
    const availableSlots = doctor.scheduleSlots.filter(s => s.isAvailable);
    if (availableSlots.length === 0) return 'No schedule set';
    
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

  return (
    <>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/doctors" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
          </Link>
          <div>
            <h1 className="font-display text-3xl text-clinical-900 flex items-center gap-2">
              <Pill className="w-7 h-7 text-green-600" />
              Afilas Drug Manufacturing
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage doctors and specialists for Afilas Drug Manufacturing</p>
          </div>
        </div>
        <button
          onClick={startCreate}
          className="focus-ring rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 transition-colors flex items-center gap-2 shadow-sm"
        >
          <UserPlus className="w-4 h-4" />
          Add Doctor
        </button>
      </div>

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

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="font-semibold text-clinical-900 text-xl flex items-center gap-2">
                {editingId ? (
                  <>
                    <Edit className="w-5 h-5 text-green-600" />
                    Edit Doctor
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 text-green-600" />
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
                    className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors shadow-lg"
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
                    className="focus-ring w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 transition-colors"
                    placeholder="Dr. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Specialization <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    placeholder="Pharmacology, Research, etc."
                    value={form.specialization}
                    onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                    className="focus-ring w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 transition-colors"
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
                      className="focus-ring w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 focus:border-green-500 transition-colors"
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
                      className="focus-ring w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2.5 focus:border-green-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Experience (years)
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.experience}
                  onChange={(e) => setForm({ ...form, experience: parseInt(e.target.value) || 0 })}
                  className="focus-ring w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 transition-colors"
                  placeholder="10"
                />
              </div>

              {/* Schedule Slots - Day by Day */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-green-600" />
                    Weekly Schedule
                  </div>
                  <span className="text-xs text-gray-400 font-normal">Set working hours for each day</span>
                </label>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                  {DAYS_OF_WEEK.map((day, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="w-24 flex-shrink-0">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                          <input
                            type="checkbox"
                            checked={form.scheduleSlots[index]?.isAvailable || false}
                            onChange={(e) => {
                              const updatedSlots = { ...form.scheduleSlots };
                              updatedSlots[index] = {
                                ...updatedSlots[index],
                                isAvailable: e.target.checked,
                                startTime: e.target.checked ? updatedSlots[index].startTime || '09:00' : '',
                                endTime: e.target.checked ? updatedSlots[index].endTime || '17:00' : ''
                              };
                              setForm({ ...form, scheduleSlots: updatedSlots });
                            }}
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                          {day}
                        </label>
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <div>
                          <input
                            type="time"
                            value={form.scheduleSlots[index]?.startTime || ''}
                            disabled={!form.scheduleSlots[index]?.isAvailable}
                            onChange={(e) => {
                              const updatedSlots = { ...form.scheduleSlots };
                              updatedSlots[index] = {
                                ...updatedSlots[index],
                                startTime: e.target.value
                              };
                              setForm({ ...form, scheduleSlots: updatedSlots });
                            }}
                            className={`focus-ring w-full rounded-lg border px-3 py-1.5 text-sm focus:border-green-500 transition-colors ${
                              form.scheduleSlots[index]?.isAvailable 
                                ? 'border-gray-300' 
                                : 'border-gray-200 bg-gray-100 text-gray-400'
                            }`}
                            step="900"
                          />
                        </div>
                        <div>
                          <input
                            type="time"
                            value={form.scheduleSlots[index]?.endTime || ''}
                            disabled={!form.scheduleSlots[index]?.isAvailable}
                            onChange={(e) => {
                              const updatedSlots = { ...form.scheduleSlots };
                              updatedSlots[index] = {
                                ...updatedSlots[index],
                                endTime: e.target.value
                              };
                              setForm({ ...form, scheduleSlots: updatedSlots });
                            }}
                            className={`focus-ring w-full rounded-lg border px-3 py-1.5 text-sm focus:border-green-500 transition-colors ${
                              form.scheduleSlots[index]?.isAvailable 
                                ? 'border-gray-300' 
                                : 'border-gray-200 bg-gray-100 text-gray-400'
                            }`}
                            step="900"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
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
                  className="focus-ring w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-green-500 transition-colors"
                  placeholder="Doctor's biography..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="flex-1 focus-ring rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-semibold px-6 py-2.5 transition-colors flex items-center justify-center gap-2"
                >
                  {saving || uploadingImage ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {uploadingImage ? 'Uploading Image...' : 'Saving...'}
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

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
        </div>
      ) : doctors.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Doctors Found</h3>
          <p className="text-sm text-gray-500 mb-4">No doctors available for Afilas Drug Manufacturing</p>
          <button
            onClick={startCreate}
            className="focus-ring rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 transition-colors"
          >
            + Add Doctor
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col">
              <div className="relative h-56 bg-gradient-to-br from-green-50 to-gray-100 flex-shrink-0">
                {doc.photoUrl ? (
                  <Image
                    src={doc.photoUrl}
                    alt={doc.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Pill className="w-20 h-20 text-green-300" />
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
              
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">{doc.name}</h3>
                <p className="text-sm text-green-600 font-medium">{doc.specialization || doc.title}</p>
                
                {doc.email && (
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {doc.email}
                  </p>
                )}
                
                {doc.bio && (
                  <p className="text-xs text-gray-500 mt-3 line-clamp-2">{doc.bio}</p>
                )}
                
                {/* Schedule Display at Bottom */}
                {doc.scheduleSlots && doc.scheduleSlots.filter(s => s.isAvailable).length > 0 && (
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <div className="text-xs">
                        <p className="font-medium text-gray-700">{getScheduleDisplay(doc)}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => startEdit(doc)} 
                    className="flex-1 text-sm text-green-600 hover:text-green-800 font-medium hover:bg-green-50 px-3 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1"
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
          <span>Showing {doctors.length} doctor{doctors.length !== 1 ? 's' : ''} for Afilas Drug Manufacturing</span>
          <button
            onClick={() => load()}
            className="text-green-600 hover:text-green-800 transition-colors flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Refresh
          </button>
        </div>
      )}
    </>
  );
}