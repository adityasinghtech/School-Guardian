import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell, Check, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const Notifications = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await api.get('/notifications');
      return response.data.data.notifications;
    }
  });

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      refetch();
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      toast.success('All notifications marked as read');
      refetch();
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center">
            <Bell className="mr-3 h-6 w-6 text-primary-600" />
            Notifications
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Stay updated with your issue reports and repair assignments.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Check className="-ml-1 mr-2 h-5 w-5 text-slate-400" aria-hidden="true" />
            Mark all as read
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md border border-slate-200">
        <ul className="divide-y divide-slate-200">
          {isLoading ? (
            <li className="px-6 py-12 text-center text-slate-500 animate-pulse">Loading notifications...</li>
          ) : data?.length === 0 ? (
            <li className="px-6 py-12 text-center text-slate-500">
              <Bell className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              You're all caught up! No notifications.
            </li>
          ) : (
            data?.map((notification: any) => (
              <li key={notification._id} className={`${notification.isRead ? 'bg-white' : 'bg-primary-50'} hover:bg-slate-50 transition-colors`}>
                <div className="px-4 py-4 sm:px-6 flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-4">
                    <p className={`text-sm font-medium ${notification.isRead ? 'text-slate-900' : 'text-primary-700'} truncate`}>
                      {notification.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {notification.message}
                    </p>
                    <p className="mt-2 flex items-center text-xs text-slate-400">
                      <Clock className="flex-shrink-0 mr-1.5 h-3.5 w-3.5 text-slate-400" />
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex items-center space-x-2">
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification._id)}
                        className="text-xs bg-white border border-slate-300 rounded px-2 py-1 text-slate-600 hover:bg-slate-50"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

// Quick fix for Clock icon missing from imports
import { Clock } from 'lucide-react';

export default Notifications;
