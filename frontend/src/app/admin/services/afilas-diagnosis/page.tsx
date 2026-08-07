// app/admin/services/afilas-diagnosis/page.tsx
'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { api } from '@/lib/api';
import { getToken, clearSession } from '@/lib/auth';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
  X,
  Clock,
  DollarSign,
  Search,
  ChevronDown,
  Save,
  Building2,
  Upload,
  Image as ImageIcon,
  Microscope,
  TestTube
} from 'lucide-react';

// ============================================================
// TYPES
// ============================================================

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  location: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ServiceFormData {
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  location: string;
  image: string;
  isActive: boolean;
}

interface FormErrors {
  name?: string;
  description?: string;
  price?: string;
  duration?: string;
  category?: string;
  image?: string;
}

// ============================================================
// CONSTANTS
// ============================================================

const LOCATION = 'Afilas Diagnosis Center';
const DEFAULT_CATEGORIES = [
  'Blood Tests',
  'Imaging',
  'X-Ray',
  'MRI',
  'CT Scan',
  'Ultrasound',
  'ECG',
  'Endoscopy',
  'Biopsy',
  'Genetic Testing',
  'Pathology',
  'Microbiology'
];

const IMAGE_MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// ============================================================
// VALIDATION FUNCTIONS
// ============================================================

const validateName = (value: string): string | null => {
  const trimmed = value?.trim();
  if (!trimmed) return 'Service name is required';
  if (trimmed.length < 3) return 'Service name must be at least 3 characters';
  if (trimmed.length > 100) return 'Service name must be less than 100 characters';
  return null;
};

const validateDescription = (value: string): string | null => {
  const trimmed = value?.trim();
  if (!trimmed) return 'Description is required';
  if (trimmed.length < 10) return 'Description must be at least 10 characters';
  if (trimmed.length > 500) return 'Description must be less than 500 characters';
  return null;
};

const validatePrice = (value: number): string | null => {
  if (!value || value <= 0) return 'Price is required and must be greater than 0';
  if (value < 0) return 'Price cannot be negative';
  if (value > 999999) return 'Price cannot exceed 999,999';
  if (!Number.isFinite(value)) return 'Please enter a valid price';
  return null;
};

const validateDuration = (value: number): string | null => {
  if (!value || value <= 0) return 'Duration is required';
  if (value < 5) return 'Duration must be at least 5 minutes';
  if (value > 480) return 'Duration cannot exceed 480 minutes (8 hours)';
  if (!Number.isInteger(value)) return 'Duration must be a whole number';
  return null;
};

const validateCategory = (value: string): string | null => {
  if (!value?.trim()) return 'Category is required';
  return null;
};

const validateImage = (file: File | null, currentImage?: string): string | null => {
  if (!file && !currentImage) return 'Image is required';
  if (file) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)';
    }
    if (file.size > IMAGE_MAX_SIZE) {
      return 'Image size must be less than 5MB';
    }
  }
  return null;
};

// ============================================================
// COMPONENT
// ============================================================

export default function AdminServicesAfilasDiagnosisPage() {
  const { t } = useLanguage();
  
  // State
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    description: '',
    price: 0,
    duration: 30,
    category: '',
    location: LOCATION,
    image: '',
    isActive: true
  });

  // ============================================================
  // API CALLS
  // ============================================================

  const loadServices = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get<any>(`/services?location=${encodeURIComponent(LOCATION)}`, true);
      
      let servicesData: Service[] = [];
      if (Array.isArray(response)) {
        servicesData = response;
      } else if (response?.data && Array.isArray(response.data)) {
        servicesData = response.data;
      } else if (response?.services && Array.isArray(response.services)) {
        servicesData = response.services;
      }
      
      setServices(servicesData);
    } catch (error: any) {
      console.error('Failed to load diagnostic services:', error);
      setError(error.message || 'Failed to load diagnostic services');
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  // ============================================================
  // VALIDATION
  // ============================================================

  const validateField = useCallback((field: keyof FormErrors, value: any): string | null => {
    switch (field) {
      case 'name': return validateName(value);
      case 'description': return validateDescription(value);
      case 'price': return validatePrice(value);
      case 'duration': return validateDuration(value);
      case 'category': return validateCategory(value);
      case 'image': return validateImage(imageFile, formData.image);
      default: return null;
    }
  }, [imageFile, formData.image]);

  const validateForm = useCallback((): boolean => {
    const errors: FormErrors = {};
    
    const nameError = validateName(formData.name);
    if (nameError) errors.name = nameError;
    
    const descriptionError = validateDescription(formData.description);
    if (descriptionError) errors.description = descriptionError;
    
    const priceError = validatePrice(formData.price);
    if (priceError) errors.price = priceError;
    
    const durationError = validateDuration(formData.duration);
    if (durationError) errors.duration = durationError;
    
    const categoryError = validateCategory(formData.category);
    if (categoryError) errors.category = categoryError;
    
    const imageError = validateImage(imageFile, formData.image);
    if (imageError) errors.image = imageError;
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, imageFile]);

  const handleFieldChange = (field: keyof FormErrors, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, value);
    setFormErrors(prev => ({ ...prev, [field]: error || undefined }));
  };

  const hasError = (field: keyof FormErrors) => {
    return formErrors[field] && touched[field];
  };

  // ============================================================
  // FILTERED SERVICES
  // ============================================================

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            service.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter ? service.category === categoryFilter : true;
      return matchesSearch && matchesCategory;
    });
  }, [services, searchTerm, categoryFilter]);

  // ============================================================
  // IMAGE HANDLING
  // ============================================================

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const imageError = validateImage(file, '');
    if (imageError) {
      setFormErrors(prev => ({ ...prev, image: imageError }));
      setError(imageError);
      return;
    }
    
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    setFormErrors(prev => ({ ...prev, image: undefined }));
    setError('');
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    
    const token = getToken();
    if (!token) throw new Error('No authentication token found');
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/upload?type=services`, {
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
  };

  // ============================================================
  // MODAL HANDLING
  // ============================================================

  const handleOpenModal = useCallback((service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration,
        category: service.category,
        location: service.location,
        image: service.image || '',
        isActive: service.isActive
      });
      setImagePreview(service.image || '');
    } else {
      setEditingService(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        duration: 30,
        category: '',
        location: LOCATION,
        image: '',
        isActive: true
      });
      setImagePreview('');
      setImageFile(null);
    }
    setFormErrors({});
    setTouched({});
    setShowNewCategory(false);
    setNewCategory('');
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setEditingService(null);
    setError('');
    setFormErrors({});
    setTouched({});
    setImageFile(null);
    setImagePreview('');
    setShowNewCategory(false);
    setNewCategory('');
    setIsSubmitting(false);
  }, []);

  // ============================================================
  // CATEGORY HANDLING
  // ============================================================

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'new') {
      setShowNewCategory(true);
      setFormData(prev => ({ ...prev, category: '' }));
    } else {
      setShowNewCategory(false);
      setNewCategory('');
      setFormData(prev => ({ ...prev, category: value }));
    }
  };

  const handleAddNewCategory = () => {
    if (!newCategory.trim()) return;
    
    const trimmedCategory = newCategory.trim();
    if (categories.includes(trimmedCategory)) {
      setError(`Category "${trimmedCategory}" already exists`);
      return;
    }
    
    setCategories(prev => [...prev, trimmedCategory]);
    setFormData(prev => ({ ...prev, category: trimmedCategory }));
    setNewCategory('');
    setShowNewCategory(false);
    setTouched(prev => ({ ...prev, category: true }));
    setFormErrors(prev => ({ ...prev, category: undefined }));
  };

  // ============================================================
  // SUBMIT HANDLING
  // ============================================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    
    if (!validateForm()) {
      setIsSubmitting(false);
      const firstError = document.querySelector('[data-error="true"]');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    try {
      let imageUrl = formData.image;
      if (imageFile) {
        setUploadingImage(true);
        try {
          imageUrl = await uploadImage(imageFile);
        } catch (uploadError) {
          setError(uploadError instanceof Error ? uploadError.message : 'Failed to upload image');
          setIsSubmitting(false);
          setUploadingImage(false);
          return;
        }
        setUploadingImage(false);
      }
      
      const serviceData = {
        ...formData,
        image: imageUrl,
        price: Number(formData.price),
        duration: Number(formData.duration)
      };

      if (editingService) {
        await api.put(`/services/${editingService.id}`, serviceData, true);
        setSuccess('Diagnostic service updated successfully!');
      } else {
        await api.post('/services', serviceData, true);
        setSuccess('Diagnostic service created successfully!');
      }
      
      handleCloseModal();
      await loadServices();
    } catch (error: any) {
      console.error('Failed to save diagnostic service:', error);
      setError(error.message || 'Failed to save diagnostic service');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // DELETE HANDLING
  // ============================================================

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this diagnostic service?')) return;
    
    try {
      await api.delete(`/services/${id}`, true);
      setSuccess('Diagnostic service deleted successfully!');
      await loadServices();
    } catch (error: any) {
      console.error('Failed to delete diagnostic service:', error);
      setError(error.message || 'Failed to delete diagnostic service');
    }
  };

  // ============================================================
  // UTILITY FUNCTIONS
  // ============================================================

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Blood Tests': 'bg-red-100 text-red-700',
      'Imaging': 'bg-blue-100 text-blue-700',
      'X-Ray': 'bg-indigo-100 text-indigo-700',
      'MRI': 'bg-purple-100 text-purple-700',
      'CT Scan': 'bg-cyan-100 text-cyan-700',
      'Ultrasound': 'bg-pink-100 text-pink-700',
      'ECG': 'bg-green-100 text-green-700',
      'Endoscopy': 'bg-yellow-100 text-yellow-700',
      'Biopsy': 'bg-orange-100 text-orange-700',
      'Genetic Testing': 'bg-teal-100 text-teal-700',
      'Pathology': 'bg-rose-100 text-rose-700',
      'Microbiology': 'bg-lime-100 text-lime-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-end mb-6 flex-wrap gap-4">
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={loadServices}
            disabled={loading}
            className="rounded-lg bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700 px-4 py-2 text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="rounded-lg bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700 px-4 py-2 text-sm transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Diagnostic Service
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search diagnostic services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                aria-label="Search diagnostic services"
              />
            </div>
          </div>
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white text-sm"
              aria-label="Filter by category"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <div className="text-sm text-gray-500">
            {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Alerts */}
      {success && (
        <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2" role="alert">
          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-600">{success}</p>
          <button onClick={() => setSuccess('')} className="ml-auto" aria-label="Dismiss">
            <X className="w-4 h-4 text-green-600" />
          </button>
        </div>
      )}

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2" role="alert">
          <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
          <button onClick={() => setError('')} className="ml-auto" aria-label="Dismiss">
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>
      )}

      {/* Services Grid */}
      {loading ? (
        <div className="flex items-center justify-center p-12" aria-label="Loading">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <Microscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Diagnostic Services Found</h3>
          <p className="text-sm text-gray-500 mb-4">
            {searchTerm || categoryFilter ? 'Try adjusting your filters' : 'Click "Add Diagnostic Service" to create one'}
          </p>
          {!searchTerm && !categoryFilter && (
            <button
              onClick={() => handleOpenModal()}
              className="rounded-lg bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700 px-5 py-2 text-sm transition-colors"
            >
              + Add Diagnostic Service
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredServices.map((service) => (
            <div key={service.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Service Image */}
              <div className="relative h-40 bg-gray-100">
                {service.image ? (
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Microscope className="w-12 h-12 text-gray-300" />
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h4 className="text-sm font-semibold text-gray-800 truncate" title={service.name}>
                  {service.name}
                </h4>
                <span className={`text-[10px] px-2 py-0.5 rounded-full inline-block mt-1 ${getCategoryColor(service.category)}`}>
                  {service.category}
                </span>
                
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{service.description}</p>
                
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-sm font-bold text-gray-800">{formatCurrency(service.price)}</p>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {service.duration} min
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleOpenModal(service)}
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label={`Edit ${service.name}`}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label={`Delete ${service.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredServices.length > 0 && (
        <div className="mt-4 text-xs text-gray-400 flex items-center justify-end">
          {filteredServices.length} diagnostic service{filteredServices.length !== 1 ? 's' : ''} in {LOCATION}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between rounded-t-xl">
              <h3 className="text-sm font-semibold text-gray-800">
                {editingService ? '✏️ Edit Diagnostic Service' : '➕ New Diagnostic Service'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              {/* Image Upload - Always Visible */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                      {imagePreview ? (
                        <Image
                          src={imagePreview}
                          alt="Service preview"
                          width={80}
                          height={80}
                          unoptimized
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <Microscope className="w-8 h-8 text-gray-400" />
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
                      className="absolute -bottom-2 -right-2 bg-white border border-gray-300 text-gray-600 p-1.5 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">Service Image</p>
                    <p className="text-xs text-gray-400">Click the upload button to add an image</p>
                    <p className="text-[10px] text-gray-400 mt-1">JPG, PNG, GIF, WebP (max 5MB)</p>
                    {formData.image && !imageFile && !imagePreview && (
                      <p className="text-xs text-green-600 mt-1">✓ Image uploaded</p>
                    )}
                  </div>
                </div>
              </div>
              {hasError('image') && (
                <p className="text-xs text-red-500 -mt-2">{formErrors.image}</p>
              )}

              {/* Service Name */}
              <div data-error={!!formErrors.name && touched.name}>
                <label className="block text-xs font-medium text-gray-600 mb-0.5">
                  Service Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
                  className={`w-full rounded-lg border px-3 py-1.5 text-sm transition-colors outline-none ${
                    hasError('name')
                      ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                      : 'border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400'
                  }`}
                  placeholder="Enter diagnostic service name"
                  maxLength={100}
                />
                {hasError('name') && (
                  <p className="text-xs text-red-500 mt-0.5">{formErrors.name}</p>
                )}
                <p className="text-[10px] text-gray-400 mt-0.5">{formData.name.length}/100</p>
              </div>

              {/* Category with New Category Option */}
              <div data-error={!!formErrors.category && touched.category}>
                <label className="block text-xs font-medium text-gray-600 mb-0.5">
                  Category <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={handleCategoryChange}
                  onBlur={() => setTouched(prev => ({ ...prev, category: true }))}
                  className={`w-full rounded-lg border px-3 py-1.5 text-sm transition-colors outline-none ${
                    hasError('category')
                      ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                      : 'border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400'
                  }`}
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="new" className="text-purple-600 font-medium">+ Add New Category</option>
                </select>
                {hasError('category') && (
                  <p className="text-xs text-red-500 mt-0.5">{formErrors.category}</p>
                )}
              </div>

              {/* New Category Input */}
              {showNewCategory && (
                <div className="flex gap-2 items-center bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Enter new category name..."
                      className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                      autoFocus
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddNewCategory}
                    className="px-3 py-1.5 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewCategory(false);
                      setNewCategory('');
                      setFormData(prev => ({ ...prev, category: '' }));
                    }}
                    className="px-3 py-1.5 bg-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Description */}
              <div data-error={!!formErrors.description && touched.description}>
                <label className="block text-xs font-medium text-gray-600 mb-0.5">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  onBlur={() => setTouched(prev => ({ ...prev, description: true }))}
                  className={`w-full rounded-lg border px-3 py-1.5 text-sm transition-colors outline-none ${
                    hasError('description')
                      ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                      : 'border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400'
                  }`}
                  rows={2}
                  placeholder="Enter service description"
                  maxLength={500}
                />
                {hasError('description') && (
                  <p className="text-xs text-red-500 mt-0.5">{formErrors.description}</p>
                )}
                <p className="text-[10px] text-gray-400 mt-0.5">{formData.description.length}/500</p>
              </div>

              {/* Price and Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div data-error={!!formErrors.price && touched.price}>
                  <label className="block text-xs font-medium text-gray-600 mb-0.5">
                    Price (USD) <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleFieldChange('price', parseFloat(e.target.value) || 0)}
                      onBlur={() => setTouched(prev => ({ ...prev, price: true }))}
                      className={`w-full rounded-lg border pl-8 pr-3 py-1.5 text-sm transition-colors outline-none ${
                        hasError('price')
                          ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                          : 'border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400'
                      }`}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>
                  {hasError('price') && (
                    <p className="text-xs text-red-500 mt-0.5">{formErrors.price}</p>
                  )}
                </div>

                <div data-error={!!formErrors.duration && touched.duration}>
                  <label className="block text-xs font-medium text-gray-600 mb-0.5">
                    Duration (min) <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => handleFieldChange('duration', parseInt(e.target.value) || 0)}
                      onBlur={() => setTouched(prev => ({ ...prev, duration: true }))}
                      className={`w-full rounded-lg border pl-8 pr-3 py-1.5 text-sm transition-colors outline-none ${
                        hasError('duration')
                          ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                          : 'border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400'
                      }`}
                      min="5"
                      step="5"
                      placeholder="30"
                    />
                  </div>
                  {hasError('duration') && (
                    <p className="text-xs text-red-500 mt-0.5">{formErrors.duration}</p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-0.5">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  disabled
                  className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Active Status */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-xs font-medium text-gray-700">Active</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={uploadingImage || isSubmitting}
                  className="flex-1 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 text-sm font-medium px-4 py-1.5 transition-colors flex items-center justify-center gap-2"
                >
                  {uploadingImage || isSubmitting ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      {uploadingImage ? 'Uploading...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      {editingService ? 'Update' : 'Add'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 rounded-lg bg-white border border-gray-200 text-gray-500 text-sm font-medium px-4 py-1.5 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}