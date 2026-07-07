import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  AlertCircle, 
  ClipboardList, 
  Bell, 
  Settings, 
  LogOut, 
  Menu,
  X,
  Users,
  BarChart3,
  FileText,
  User
} from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Report Issue', path: '/dashboard/report', icon: AlertCircle },
    { name: 'Track Issues', path: '/dashboard/issues', icon: ClipboardList },
    { name: 'Notifications', path: '/dashboard/notifications', icon: Bell },
    { name: 'Profile', path: '/dashboard/profile', icon: User },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const adminItems = [
    { name: 'Manage Users', path: '/dashboard/users', icon: Users },
    { name: 'Reports', path: '/dashboard/reports', icon: FileText },
  ];

  const renderNavItems = (items: any[]) => (
    items.map((item) => {
      const Icon = item.icon;
      const isActive = location.pathname === item.path;
      return (
        <Link
          key={item.name}
          to={item.path}
          className={`${
            isActive
              ? 'bg-primary-50 text-primary-600'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          } group flex items-center px-2 py-2 text-sm font-medium rounded-md mb-1 transition-colors`}
        >
          <Icon
            className={`${
              isActive ? 'text-primary-600' : 'text-slate-400 group-hover:text-slate-500'
            } mr-3 flex-shrink-0 h-5 w-5`}
            aria-hidden="true"
          />
          {item.name}
        </Link>
      );
    })
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-40 flex lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
        <div className="fixed inset-0 bg-slate-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4 font-bold text-xl text-primary-600">
              School Guardian
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {renderNavItems(navItems)}
              {user?.role === 'Admin' && (
                <>
                  <div className="mt-8 mb-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Admin
                  </div>
                  {renderNavItems(adminItems)}
                </>
              )}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-slate-200 p-4">
            <div className="flex items-center">
              <div>
                <img
                  className="inline-block h-10 w-10 rounded-full"
                  src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.name}&background=2563eb&color=fff`}
                  alt=""
                />
              </div>
              <div className="ml-3">
                <p className="text-base font-medium text-slate-700 group-hover:text-slate-900">
                  {user?.name}
                </p>
                <p className="text-sm font-medium text-slate-500 group-hover:text-slate-700">
                  {user?.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 border-r border-slate-200 bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4 font-bold text-xl text-primary-600">
                School Guardian
              </div>
              <nav className="mt-8 flex-1 px-2 bg-white space-y-1">
                {renderNavItems(navItems)}
                {user?.role === 'Admin' && (
                  <>
                    <div className="mt-8 mb-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Admin
                    </div>
                    {renderNavItems(adminItems)}
                  </>
                )}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-slate-200 p-4 justify-between items-center">
              <div className="flex items-center">
                <div>
                  <img
                    className="inline-block h-9 w-9 rounded-full"
                    src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.name}&background=2563eb&color=fff`}
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-slate-700">
                    {user?.name}
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    {user?.role}
                  </p>
                </div>
              </div>
              <button 
                onClick={logout}
                className="text-slate-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 flex justify-between bg-white border-b border-slate-200">
          <div className="py-2 px-2 font-bold text-lg text-primary-600">
            School Guardian
          </div>
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-slate-500 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
