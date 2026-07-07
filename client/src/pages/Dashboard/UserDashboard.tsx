import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ClipboardList, Clock, CheckCircle2, AlertTriangle, Plus } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['user-analytics'],
    queryFn: async () => {
      const response = await api.get('/analytics/dashboard');
      return response.data.data;
    }
  });

  if (isLoading) return <div className="animate-pulse flex space-x-4">Loading dashboard...</div>;
  if (error) return <div className="text-red-500">Failed to load dashboard data.</div>;

  const stats = [
    { name: 'Total Reported', stat: data.overview.totalIssues, icon: ClipboardList, color: 'bg-blue-500' },
    { name: 'Pending', stat: data.overview.pending, icon: Clock, color: 'bg-amber-500' },
    { name: 'In Progress', stat: data.overview.inProgress, icon: AlertTriangle, color: 'bg-orange-500' },
    { name: 'Resolved', stat: data.overview.resolved, icon: CheckCircle2, color: 'bg-emerald-500' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.name}</h1>
          <p className="text-sm text-slate-500 mt-1">Here's an overview of your reported issues.</p>
        </div>
        <Link 
          to="/dashboard/report" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Report Issue
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div key={item.name} className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden border border-slate-100">
            <dt>
              <div className={`absolute rounded-md p-3 ${item.color}`}>
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 text-sm font-medium text-slate-500 truncate">{item.name}</p>
            </dt>
            <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
              <p className="text-2xl font-semibold text-slate-900">{item.stat}</p>
            </dd>
          </div>
        ))}
      </div>
      
      {/* Recent Activity List would go here */}
      <div className="mt-8 bg-white shadow rounded-lg border border-slate-100 p-6">
        <h2 className="text-lg font-medium text-slate-900 mb-4">Recent Activity</h2>
        {data.recentActivities?.length === 0 ? (
          <p className="text-sm text-slate-500">No recent activity.</p>
        ) : (
          <ul className="divide-y divide-slate-200">
            {data.recentActivities?.map((activity: any) => (
              <li key={activity._id} className="py-4 flex">
                <div className="ml-3">
                  <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                  <p className="text-sm text-slate-500">{new Date(activity.createdAt).toLocaleDateString()}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
