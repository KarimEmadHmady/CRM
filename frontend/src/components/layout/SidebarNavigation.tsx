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
  LogOut,
  Settings,
  ChevronRight
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { id: 'dashboard',     label: 'Dashboard',       icon: <Home       className="h-5 w-5" />, path: '/dashboard' },
  { id: 'customers',     label: 'Customers',        icon: <Users      className="h-5 w-5" />, path: '/dashboard/customers' },
  { id: 'campaigns',     label: 'Email Campaigns',  icon: <Mail       className="h-5 w-5" />, path: '/dashboard/campaigns' },
  { id: 'notifications', label: 'Notifications',    icon: <Bell       className="h-5 w-5" />, path: '/dashboard/notifications' },
  { id: 'subscriptions', label: 'Subscriptions',    icon: <CreditCard className="h-5 w-5" />, path: '/dashboard/subscriptions' },
];

// Bottom nav shows only the 5 main items (no label on very small screens)
const bottomNavItems = navItems.slice(0, 5);

interface SidebarNavigationProps {
  user?: { username: string; email: string; role: string };
  onLogout?: () => void;
  onRegisterUser?: () => void;
  onManageUsers?: () => void;
}

export function SidebarNavigation({ user, onLogout, onRegisterUser, onManageUsers }: SidebarNavigationProps) {
  const [isCollapsed,   setIsCollapsed]   = useState(false);
  const [isMobileOpen,  setIsMobileOpen]  = useState(false);
  const router   = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMobileOpen(false);
  };

  const isActive = (path: string) => {
    const clean = pathname.replace(/^\/[a-z]{2}/, '');
    if (path === '/dashboard') return clean === '/dashboard' || clean === '/';
    return clean.startsWith(path);
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════
          DESKTOP SIDEBAR  (lg+)
      ═══════════════════════════════════════════════ */}
      <div className={`
        hidden lg:flex flex-col
        fixed inset-y-0 left-0 z-50
        bg-white border-r border-gray-200
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-gray-900">CRM System</h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors ml-auto"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              title={isCollapsed ? item.label : undefined}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                ${isActive(item.path)
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
                ${isCollapsed ? 'justify-center' : ''}
              `}
            >
              {item.icon}
              {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
              {!isCollapsed && item.badge && (
                <span className="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-gray-200 p-4 space-y-1">
          {!isCollapsed && user && (
            <div className="mb-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <User className="h-4 w-4 text-gray-500 shrink-0" />
                <span className="text-sm font-semibold text-gray-800 truncate">{user.username}</span>
              </div>
              <p className="text-xs text-gray-400 pl-6 truncate">{user.email}</p>
            </div>
          )}

          {!isCollapsed && (
            <button onClick={() => handleNavigation('/profile')} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <User className="h-4 w-4" /><span>Profile</span>
            </button>
          )}

          {user?.role === 'admin' && !isCollapsed && (
            <>
              <button onClick={onRegisterUser} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-green-600 rounded-lg hover:bg-green-50 transition-colors">
                <UserPlus className="h-4 w-4" /><span>Register User</span>
              </button>
              <button onClick={onManageUsers} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                <Users className="h-4 w-4" /><span>Manage Users</span>
              </button>
              <button onClick={() => handleNavigation('/dashboard/email-config')} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                <Settings className="h-4 w-4" /><span>Email Configuration</span>
              </button>
            </>
          )}

          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          MOBILE  — top bar + slide-in drawer + bottom nav
      ═══════════════════════════════════════════════ */}

      {/* Top bar (mobile only) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <h1 className="text-base font-bold text-gray-900">CRM System</h1>
        <div className="flex items-center gap-2">
          {user && (
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <div className="h-7 w-7 rounded-full bg-gray-900 flex items-center justify-center">
                <span className="text-xs font-semibold text-white">
                  {user.username?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            </div>
          )}
          {/* Hamburger — only for admin extras + logout */}
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Slide-in drawer — only for user info + admin actions + logout */}
      <div className={`
        lg:hidden fixed top-0 right-0 bottom-0 z-50 w-72
        bg-white border-l border-gray-200 shadow-xl
        flex flex-col
        transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Drawer header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <span className="font-semibold text-gray-900">Menu</span>
          <button onClick={() => setIsMobileOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {/* User card */}
          {user && (
            <div className="mb-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold text-white">{user.username?.charAt(0)?.toUpperCase()}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user.username}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Nav items in drawer too (for quick access) */}
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                ${isActive(item.path) ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-50'}
              `}
            >
              {item.icon}
              <span className="font-medium text-sm">{item.label}</span>
              {!isActive(item.path) && <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />}
            </button>
          ))}

          <div className="pt-2 border-t border-gray-100 space-y-1">
            <button onClick={() => handleNavigation('/profile')} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <User className="h-4 w-4" /><span>Profile</span><ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
            </button>

            {user?.role === 'admin' && (
              <>
                <button onClick={onRegisterUser} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-green-600 rounded-lg hover:bg-green-50 transition-colors">
                  <UserPlus className="h-4 w-4" /><span>Register User</span><ChevronRight className="h-4 w-4 ml-auto text-green-300" />
                </button>
                <button onClick={onManageUsers} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                  <Users className="h-4 w-4" /><span>Manage Users</span><ChevronRight className="h-4 w-4 ml-auto text-purple-300" />
                </button>
                <button onClick={() => handleNavigation('/dashboard/email-config')} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                  <Settings className="h-4 w-4" /><span>Email Configuration</span><ChevronRight className="h-4 w-4 ml-auto text-blue-300" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Logout at bottom of drawer */}
        <div className="p-4 border-t border-gray-200">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
            <LogOut className="h-4 w-4" /><span>Logout</span>
          </button>
        </div>
      </div>

      {/* ── BOTTOM NAV (mobile only) ───────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 safe-area-pb">
        <div className="flex items-center justify-around h-16 px-2">
          {bottomNavItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.path)}
                className="flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors"
              >
                <div className={`
                  flex items-center justify-center w-10 h-7 rounded-full transition-all duration-200
                  ${active ? 'bg-gray-900' : ''}
                `}>
                  <span className={active ? 'text-white' : 'text-gray-400'}>
                    {item.icon}
                  </span>
                </div>
                <span className={`text-[10px] font-medium leading-none transition-colors ${active ? 'text-gray-900' : 'text-gray-400'}`}>
                  {/* Short labels for bottom nav */}
                  {item.id === 'dashboard'     && 'Home'}
                  {item.id === 'customers'     && 'Customers'}
                  {item.id === 'campaigns'     && 'Campaigns'}
                  {item.id === 'notifications' && 'Alerts'}
                  {item.id === 'subscriptions' && 'Subs'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}