'use client';

import { ReactNode, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SidebarNavigation } from './SidebarNavigation';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { CustomersTab } from '@/components/dashboard/CustomersTab';
import { EmailCampaignsTab } from '@/components/dashboard/EmailCampaignsTab';
import { NotificationsTab } from '@/components/dashboard/NotificationsTab';
import { SubscriptionsTab } from '@/components/dashboard/SubscriptionsTab';
import { RegisterUser } from '@/features/auth/components/RegisterUser';

interface DashboardLayoutProps {
  user?: {
    username: string;
    email: string;
    role: string;
  };
  onLogout?: () => void;
}

const tabComponents: Record<string, ReactNode> = {
  '/dashboard': <DashboardOverview />,
  '/dashboard/customers': <CustomersTab />,
  '/dashboard/campaigns': <EmailCampaignsTab />,
  '/dashboard/notifications': <NotificationsTab />,
  '/dashboard/subscriptions': <SubscriptionsTab />,
};

export function DashboardLayout({ user, onLogout }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleRegisterUser = () => {
    setShowRegisterModal(true);
  };

  const handleManageUsers = () => {
    router.push('/users');
  };

  const getCurrentTab = () => {
    // Extract the path without locale
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '');
    
    // Find the most specific route match
    const exactMatch = tabComponents[pathWithoutLocale];
    if (exactMatch) return exactMatch;

    // Check for partial matches (for dynamic routes)
    for (const [route, component] of Object.entries(tabComponents)) {
      if (pathWithoutLocale.startsWith(route) && route !== '/dashboard') {
        return component;
      }
    }

    // Default to dashboard overview
    return tabComponents['/dashboard'];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SidebarNavigation 
        user={user} 
        onLogout={onLogout}
        onRegisterUser={handleRegisterUser}
        onManageUsers={handleManageUsers}
      />
      
      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="py-6">
          {getCurrentTab()}
        </main>
      </div>

      {/* Register User Modal */}
      {showRegisterModal && (
        <RegisterUser onClose={() => setShowRegisterModal(false)} />
      )}
    </div>
  );
}
