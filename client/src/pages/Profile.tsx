import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Camera, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Profile = () => {
  const { user } = useAuth();
  
  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { isSubmitting: isProfileSubmitting } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
    }
  });

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, reset: resetPassword, formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting } } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileUpdate = async (data: any) => {
    try {
      await api.put('/auth/profile', data);
      toast.success('Profile updated successfully');
      // In a real app, we'd update AuthContext too or trigger a re-fetch
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const onPasswordUpdate = async (data: any) => {
    try {
      await api.put('/auth/password', data);
      toast.success('Password updated successfully');
      resetPassword();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg border border-slate-100 overflow-hidden">
        <div className="px-4 py-5 sm:p-6 border-b border-slate-200">
          <h2 className="text-lg font-medium text-slate-900 mb-4">Profile Information</h2>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <img 
                src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.name}&background=2563eb&color=fff`} 
                alt="Profile" 
                className="h-24 w-24 rounded-full object-cover border-4 border-slate-50 shadow-sm"
              />
              <button className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow border border-slate-200 text-slate-500 hover:text-primary-600">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            
            <form onSubmit={handleProfileSubmit(onProfileUpdate)} className="flex-1 w-full space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Full Name</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      {...registerProfile('name')}
                      className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-2 border"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Email Address (Read Only)</label>
                  <div className="mt-1 relative rounded-md shadow-sm opacity-60">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      value={user?.email || ''}
                      readOnly
                      className="bg-slate-50 focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-md py-2 border"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700">Role</label>
                  <input
                    type="text"
                    value={user?.role || ''}
                    readOnly
                    className="mt-1 bg-slate-50 block w-full sm:text-sm border-slate-300 rounded-md py-2 px-3 border opacity-60"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isProfileSubmitting}
                  className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Change Password Section */}
        <div className="px-4 py-5 sm:p-6 bg-slate-50">
          <h2 className="text-lg font-medium text-slate-900 mb-4">Change Password</h2>
          <form onSubmit={handlePasswordSubmit(onPasswordUpdate)} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-slate-700">Current Password</label>
              <input
                type="password"
                {...registerPassword('currentPassword')}
                className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-slate-300 rounded-md py-2 px-3 border"
              />
              {passwordErrors.currentPassword && <p className="mt-1 text-xs text-red-600">{passwordErrors.currentPassword.message as string}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700">New Password</label>
              <input
                type="password"
                {...registerPassword('newPassword')}
                className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-slate-300 rounded-md py-2 px-3 border"
              />
              {passwordErrors.newPassword && <p className="mt-1 text-xs text-red-600">{passwordErrors.newPassword.message as string}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700">Confirm New Password</label>
              <input
                type="password"
                {...registerPassword('confirmPassword')}
                className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-slate-300 rounded-md py-2 px-3 border"
              />
              {passwordErrors.confirmPassword && <p className="mt-1 text-xs text-red-600">{passwordErrors.confirmPassword.message as string}</p>}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isPasswordSubmitting}
                className="inline-flex justify-center py-2 px-4 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
