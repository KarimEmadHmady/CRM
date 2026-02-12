'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function CustomersPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    // Add a small delay to ensure auth state is properly initialized
    const timer = setTimeout(() => {
      if (!isLoading && !isAuthenticated) {
        router.push('/login');
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
    return null;
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
