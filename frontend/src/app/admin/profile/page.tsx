// app/admin/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { getStoredAdmin } from '@/lib/auth';

interface ProfileData {
  name: string;
  email: string;
  role: string;
  phone: string;
  location: string;
}

export default function MyProfile() {
  const [profile, setProfile] = useState<ProfileData>({
    name: 'Super Admin',
    email: 'admin@afilashospital.com',
    role: 'Super Admin',
    phone: '+1 (555) 123-4567',
    location: 'ethiopia',
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    const admin = getStoredAdmin();
    if (admin?.name) {
      setProfile(prev => ({ 
        ...prev, 
        name: admin.name || prev.name, 
        email: admin.email || prev.email 
      }));
    }
  }, []);

  return (
    <div className="flex justify-end">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header with My Profile title */}
        <div className="px-5 pt-5 pb-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
              <span className="text-base">👤</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">My Profile</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Your personal information</p>
            </div>
          </div>
        </div>
        
        <div className="px-5 pb-5 relative">
         

          {/* Edit Button - Compact */}
          <div className="flex justify-end mb-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-xs font-medium"
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>

          {/* Vertical Minimal Details List */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-3 py-1.5 border-b border-gray-100 dark:border-gray-700/50">
              
              <div className="flex-1">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Email</p>
                {isEditing ? (
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="w-full p-1 text-sm border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-green-500 outline-none"
                  />
                ) : (
                  <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{profile.email}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 py-1.5 border-b border-gray-100 dark:border-gray-700/50">
             
              <div className="flex-1">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Phone</p>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    className="w-full p-1 text-sm border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-green-500 outline-none"
                  />
                ) : (
                  <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{profile.phone}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 py-1.5 border-b border-gray-100 dark:border-gray-700/50">
     
              <div className="flex-1">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Location</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({...profile, location: e.target.value})}
                    className="w-full p-1 text-sm border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-green-500 outline-none"
                  />
                ) : (
                  <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{profile.location}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 py-1.5">

              <div className="flex-1">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Role</p>
                <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{profile.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}