'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { RegisterUser } from '@/features/auth/components/RegisterUser';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    // Add a small delay to ensure Redux state is updated
    const timer = setTimeout(() => {
      console.log('🔍 Dashboard auth check (delayed):', {
        isAuthenticated,
        isLoading,
        user: user ? { username: user.username, email: user.email } : null
      });
      
      if (!isLoading && !isAuthenticated) {
        console.log('🚪 Redirecting to login - not authenticated');
        router.push('/login');
      } else if (!isLoading && isAuthenticated) {
        console.log('✅ User authenticated, staying on dashboard');
      }
    }, 100); // 100ms delay

    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <DashboardLayout 
      user={user ? {
        username: user.username,
        email: user.email,
        role: user.role
      } : undefined}
      onLogout={handleLogout}
    />
  );
}
