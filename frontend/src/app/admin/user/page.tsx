// C:\Afilass\afilas-hospital\frontend\src\app\admin\users\page.tsx
'use client';

import { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import { api, ApiError } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Users,
  UserPlus,
  Edit,
  Trash2,
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
  X,
  Mail,
  Phone,
  Shield,
  User,
  Eye,
  EyeOff,
  Search,
  Filter,
  ChevronDown,
  Building2,
  MoreVertical,
  Hospital,
  Activity,
  Pill,
  ArrowRight
} from 'lucide-react';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'DOCTOR' | 'USER';
  isActive: boolean;
  location?: string;
  lastLogin?: string;
  createdAt: string;
  avatar?: string;
}

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  location: string;
  isActive: boolean;
}

const ROLES = ['SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'USER'];
const LOCATIONS = [
  'Afilas General Hospital',
  'Afilas Diagnosis Center',
  'Afilas Drug Manufacturing'
];

const emptyForm: UserFormData = {
  name: '',
  email: '',
  phone: '',
  password: '',
  role: 'USER',
  location: 'Afilas General Hospital',
  isActive: true
};

export default function AdminUsersPage() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<UserFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    superAdmin: 0,
    admin: 0,
    doctor: 0,
    user: 0,
    active: 0,
    inactive: 0
  });

  // Location stats
  const [locationStats, setLocationStats] = useState({
    general: 0,
    diagnosis: 0,
    drug: 0
  });

  async function load() {
    setLoading(true);
    setError('');
    try {
      const response = await api.get<any>('/users', true);
      
      let usersData: User[] = [];
      if (response) {
        if (Array.isArray(response)) {
          usersData = response;
        } else if (response.data && Array.isArray(response.data)) {
          usersData = response.data;
        } else if (response.users && Array.isArray(response.users)) {
          usersData = response.users;
        }
      }
      
      setUsers(usersData);
      
      // Calculate stats
      setStats({
        total: usersData.length,
        superAdmin: usersData.filter(u => u.role === 'SUPER_ADMIN').length,
        admin: usersData.filter(u => u.role === 'ADMIN').length,
        doctor: usersData.filter(u => u.role === 'DOCTOR').length,
        user: usersData.filter(u => u.role === 'USER').length,
        active: usersData.filter(u => u.isActive).length,
        inactive: usersData.filter(u => !u.isActive).length
      });

      // Calculate location stats
      setLocationStats({
        general: usersData.filter(u => u.location === 'Afilas General Hospital').length,
        diagnosis: usersData.filter(u => u.location === 'Afilas Diagnosis Center').length,
        drug: usersData.filter(u => u.location === 'Afilas Drug Manufacturing').length
      });
      
      console.log(`✅ Loaded ${usersData.length} users`);
    } catch (error: any) {
      console.error('❌ Failed to load users:', error);
      setError(error.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function startCreate() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setShowForm(true);
    setError('');
    setSuccess('');
  }

  function startEdit(user: User) {
    setEditingId(user.id);
    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      password: '',
      role: user.role,
      location: user.location || 'Afilas General Hospital',
      isActive: user.isActive
    });
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
      if (!form.name || !form.email) {
        setError('Name and email are required');
        setSaving(false);
        return;
      }
      
      const userData: any = {
        name: form.name,
        email: form.email,
        phone: form.phone || '',
        role: form.role,
        location: form.location,
        isActive: form.isActive
      };
      
      if (form.password) {
        userData.password = form.password;
      }
      
      if (editingId) {
        await api.put(`/users/${editingId}`, userData, true);
        setSuccess('User updated successfully');
      } else {
        if (!form.password) {
          setError('Password is required for new users');
          setSaving(false);
          return;
        }
        await api.post('/users', userData, true);
        setSuccess('User created successfully');
      }
      
      setShowForm(false);
      await load();
    } catch (err: any) {
      console.error('❌ Error saving user:', err);
      if (err.message?.toLowerCase().includes('email already exists')) {
        setError('A user with this email already exists');
      } else {
        setError(err.message || 'Failed to save user');
      }
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/users/${id}`, true);
      setSuccess('User deleted successfully');
      await load();
    } catch (error: any) {
      console.error('❌ Failed to delete user:', error);
      setError(error.message || 'Failed to delete user');
    }
  }

  async function toggleStatus(id: string, currentStatus: boolean) {
    try {
      await api.patch(`/users/${id}/toggle-status`, { isActive: !currentStatus }, true);
      setSuccess(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      await load();
    } catch (error: any) {
      console.error('❌ Failed to toggle status:', error);
      setError(error.message || 'Failed to update user status');
    }
  }

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      'SUPER_ADMIN': 'bg-red-100 text-red-700 border-red-200',
      'ADMIN': 'bg-blue-100 text-blue-700 border-blue-200',
      'DOCTOR': 'bg-green-100 text-green-700 border-green-200',
      'USER': 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[role] || colors['USER'];
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Location cards
  const locationCards = [
    {
      id: 'all',
      name: 'All Users',
      count: stats.total,
      icon: Users,
      color: 'from-green-500 to-emerald-600',
      href: '/admin/users/all'
    },
    {
      id: 'general',
      name: 'Afilas General Hospital',
      count: locationStats.general,
      icon: Hospital,
      color: 'from-blue-500 to-blue-600',
      href: '/admin/users/afilas-general'
    },
    {
      id: 'diagnosis',
      name: 'Afilas Diagnosis Center',
      count: locationStats.diagnosis,
      icon: Activity,
      color: 'from-purple-500 to-purple-600',
      href: '/admin/users/afilas-diagnosis'
    },
    {
      id: 'drug',
      name: 'Afilas Drug Manufacturing',
      count: locationStats.drug,
      icon: Pill,
      color: 'from-green-500 to-green-600',
      href: '/admin/users/afilas-drug'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-7 h-7 text-green-600" />
            User Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage all users in the system
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={load}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button
            onClick={startCreate}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </button>
        </div>
      </div>

      {/* Location Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {locationCards.map((card) => (
          <Link key={card.id} href={card.href}>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">{card.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.count}</p>
                </div>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${card.color}`}>
                  <card.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-xs text-green-600 group-hover:gap-2 transition-all">
                View Users <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats Cards - Role Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-center">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-center">
          <p className="text-xs text-red-600">Super Admin</p>
          <p className="text-xl font-bold text-red-600">{stats.superAdmin}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-center">
          <p className="text-xs text-blue-600">Admin</p>
          <p className="text-xl font-bold text-blue-600">{stats.admin}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-center">
          <p className="text-xs text-green-600">Doctor</p>
          <p className="text-xl font-bold text-green-600">{stats.doctor}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-center">
          <p className="text-xs text-gray-600">User</p>
          <p className="text-xl font-bold text-gray-600">{stats.user}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-center">
          <p className="text-xs text-green-600">Active</p>
          <p className="text-xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-center">
          <p className="text-xs text-red-600">Inactive</p>
          <p className="text-xl font-bold text-red-600">{stats.inactive}</p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-600">{success}</p>
          <button onClick={() => setSuccess('')} className="ml-auto">
            <X className="w-4 h-4 text-green-600" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-600">{error}</p>
          <button onClick={() => setError('')} className="ml-auto">
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800"
          />
        </div>
        <div className="relative">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 appearance-none"
          >
            <option value="">All Roles</option>
            {ROLES.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* User Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="font-semibold text-gray-900 dark:text-white text-xl flex items-center gap-2">
                {editingId ? (
                  <>
                    <Edit className="w-5 h-5 text-green-600" />
                    Edit User
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 text-green-600" />
                    Add New User
                  </>
                )}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setError('');
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800"
                      placeholder="+251-911-123456"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Password {!editingId && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder={editingId ? 'Leave blank to keep current' : 'Enter password'}
                      className="w-full pl-4 pr-12 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      required
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 appearance-none"
                    >
                      {ROLES.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Location
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 appearance-none"
                    >
                      {LOCATIONS.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingId ? 'Update User' : 'Create User'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setError('');
                  }}
                  className="flex-1 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
              <p className="text-sm text-gray-500">Loading users...</p>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center p-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No users found</p>
            <p className="text-xs text-gray-400 mt-1">
              {searchTerm || filterRole ? 'Try changing your filters' : 'Create your first user to get started'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <th className="py-3 px-4 font-semibold">User</th>
                  <th className="py-3 px-4 font-semibold">Email</th>
                  <th className="py-3 px-4 font-semibold">Role</th>
                  <th className="py-3 px-4 font-semibold">Location</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Last Login</th>
                  <th className="py-3 px-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center text-xs font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="text-xs text-gray-400 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {user.phone}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400 text-xs">
                      {user.location || 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleStatus(user.id, user.isActive)}
                        className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${
                          user.isActive 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {user.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-500 dark:text-gray-400">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => startEdit(user)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => remove(user.id)}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && filteredUsers.length > 0 && (
        <div className="text-xs text-gray-400 flex items-center justify-between">
          <span>Showing {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''}</span>
        </div>
      )}
    </div>
  );
}