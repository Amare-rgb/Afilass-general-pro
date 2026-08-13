'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { 
  Users,
  RefreshCw,
  Loader2,
  Mail,
  Phone,
  XCircle,
  Search,
  ChevronDown,
  Trash2,
  UserX,
  UserCheck
} from 'lucide-react';

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

const LOCATION_NAME = 'Afilas Drug Manufacturing';

export default function AfilasDrugUsersPage() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      console.log(`📡 Fetching users for location: ${LOCATION_NAME}`);
      const response = await api.get<any>(`/users?location=${encodeURIComponent(LOCATION_NAME)}`, true);
      
      let usersData: User[] = [];
      if (response) {
        if (Array.isArray(response)) {
          usersData = response;
        } else if (response.data && Array.isArray(response.data)) {
          usersData = response.data;
        } else if (response.users && Array.isArray(response.users)) {
          usersData = response.users;
        } else if (response.success && response.data && Array.isArray(response.data)) {
          usersData = response.data;
        }
      }
      
      // 🔥 Filter out SUPER_ADMIN from this view
      usersData = usersData.filter(user => user.role !== 'SUPER_ADMIN');
      
      console.log(`✅ Loaded ${usersData.length} users for ${LOCATION_NAME} (excluding SUPER_ADMIN)`);
      setUsers(usersData);
    } catch (error: any) {
      console.error('❌ Failed to load users:', error);
      setError(error.message || 'Failed to load users');
      toast.error(error.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(userId: string, userName: string) {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) return;
    
    setUpdatingId(userId);
    setError('');
    setSuccess('');
    try {
      await api.delete(`/users/${userId}`, true);
      setSuccess(`✅ User "${userName}" deleted successfully`);
      toast.success(`User "${userName}" deleted successfully`);
      await load();
    } catch (error: any) {
      const errorMsg = error.message || 'Failed to delete user';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleToggleStatus(userId: string, currentStatus: boolean, userName: string) {
    const action = currentStatus ? 'deactivate' : 'activate';
    if (!confirm(`Are you sure you want to ${action} user "${userName}"?`)) return;
    
    setUpdatingId(userId);
    setError('');
    setSuccess('');
    try {
      await api.patch(`/users/${userId}/toggle-status`, { isActive: !currentStatus }, true);
      
      const message = currentStatus 
        ? `❌ User "${userName}" deactivated` 
        : `✅ User "${userName}" activated`;
      setSuccess(message);
      toast.success(message);
      await load();
    } catch (error: any) {
      const errorMsg = error.message || `Failed to ${action} user`;
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setUpdatingId(null);
    }
  }

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      'SUPER_ADMIN': 'bg-red-100 text-red-700',
      'ADMIN': 'bg-blue-100 text-blue-700',
      'DOCTOR': 'bg-green-100 text-green-700',
      'USER': 'bg-gray-100 text-gray-700'
    };
    return colors[role] || colors['USER'];
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4">
        <button
          onClick={load}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <span className="text-green-600">✓</span>
          <p className="text-sm text-green-600">{success}</p>
          <button onClick={() => setSuccess('')} className="ml-auto text-green-600 hover:text-green-800">×</button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <XCircle className="w-5 h-5 text-red-600" />
          <p className="text-sm text-red-600">{error}</p>
          <button onClick={() => setError('')} className="ml-auto text-red-600 hover:text-red-800">×</button>
        </div>
      )}

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
            {/* 🔥 REMOVED SUPER_ADMIN and DOCTOR */}
            <option value="ADMIN">ADMIN</option>
            <option value="USER">USER</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center p-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No users found for {LOCATION_NAME}</p>
            <p className="text-xs text-gray-400 mt-1">
              {searchTerm || filterRole ? 'Try changing your filters' : 'No users registered for this location'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <th className="py-3 px-4 font-semibold">User</th>
                  <th className="py-3 px-4 font-semibold">Email / Phone</th>
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
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center text-xs font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
                          <div className="text-xs text-gray-400">
                            <span className={`px-1.5 py-0.5 rounded-full ${getRoleBadge(user.role)}`}>
                              {user.role}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs">{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" />
                          {user.phone}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        user.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-500 dark:text-gray-400">
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleToggleStatus(user.id, user.isActive, user.name)}
                          disabled={updatingId === user.id}
                          className={`p-1.5 rounded-lg transition-colors ${
                            user.isActive 
                              ? 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800'
                              : 'bg-green-100 hover:bg-green-200 text-green-600 hover:text-green-800'
                          } disabled:opacity-50`}
                          title={user.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {user.isActive ? (
                            <UserX className="w-4 h-4" />
                          ) : (
                            <UserCheck className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(user.id, user.name)}
                          disabled={updatingId === user.id}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete user"
                        >
                          {updatingId === user.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
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
          <span>Showing {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} for {LOCATION_NAME}</span>
          <span>{users.filter(u => u.isActive).length} active, {users.filter(u => !u.isActive).length} inactive</span>
        </div>
      )}
    </div>
  );
}