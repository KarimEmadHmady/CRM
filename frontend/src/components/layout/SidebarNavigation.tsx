'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Home, 
  Users, 
  UserPlus, 
  Mail, 
  Bell,
  CreditCard,
  Menu,
  X,
  User,
  LogOut
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <Home className="h-5 w-5" />,
    path: '/dashboard'
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: <Users className="h-5 w-5" />,
    path: '/dashboard/customers'
    
  },
  {
    id: 'campaigns',
    label: 'Email Campaigns',
    icon: <Mail className="h-5 w-5" />,
    path: '/dashboard/campaigns'
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: <Bell className="h-5 w-5" />,
    path: '/dashboard/notifications',
    
  },
  {
    id: 'subscriptions',
    label: 'Subscriptions',
    icon: <CreditCard className="h-5 w-5" />,
    path: '/dashboard/subscriptions'
  }
];

interface SidebarNavigationProps {
  user?: {
    username: string;
    email: string;
    role: string;
  };
  onLogout?: () => void;
  onRegisterUser?: () => void;
  onManageUsers?: () => void;
}

export function SidebarNavigation({ user, onLogout, onRegisterUser, onManageUsers }: SidebarNavigationProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMobileOpen(false);
  };

  const isActive = (path: string) => {
    // Remove locale prefix from pathname for comparison
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');
    
    // Exact match for dashboard root
    if (path === '/dashboard') {
      return pathWithoutLocale === '/dashboard' || pathWithoutLocale === '/';
    }
    
    // For other routes, check if path starts with the route
    return pathWithoutLocale.startsWith(path);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 
        bg-white border-r border-gray-200 
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-gray-900">CRM System</h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="flex lg:hidden items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`
                w-full flex items-center justify-between
                px-3 py-2.5 rounded-lg transition-all duration-200
                ${isActive(item.path) 
                  ? 'bg-black/70 text-black-600 border-l-4 border-black-600 shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
                ${isCollapsed ? 'justify-center' : ''}
              `}
            >
              <div className="flex items-center space-x-3">
                {item.icon}
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </div>
              {!isCollapsed && item.badge && (
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                  
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-gray-200 p-4">
        {!isCollapsed && user && (
          <div className="mb-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
            
            <div className="flex items-center gap-2 mb-1">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-semibold text-gray-800 leading-none">
                {user.username}
              </span>
            </div>

            <p className="text-xs text-gray-500 pl-6 break-all">
              {user.email}
            </p>

          </div>
        )}

          
          <div className="space-y-2">
            {!isCollapsed && (
              <button
                onClick={() => handleNavigation('/profile')}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </button>
            )}
            
            {user?.role === 'admin' && !isCollapsed && (
              <>
                <button
                  onClick={onRegisterUser}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Register User</span>
                </button>
                
                <button
                  onClick={onManageUsers}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                >
                  <Users className="h-4 w-4" />
                  <span>Manage Users</span>
                </button>
              </>
            )}
            
            <button
              onClick={onLogout}
              className={`
                w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors
                ${isCollapsed ? 'justify-center' : ''}
              `}
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-white rounded-lg shadow-md border border-gray-200"
      >
        <Menu className="h-5 w-5 text-gray-600" />
      </button>
    </>
  );
}
