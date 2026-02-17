'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ProfileForm } from '@/features/auth/components/ProfileForm';
import { User, ArrowLeft, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('🔍 Profile auth check (delayed):', {
        isAuthenticated,
        isLoading,
        user: user ? { username: user.username, email: user.email } : null
      });
      
      if (!isLoading && !isAuthenticated) {
        console.log('🚪 Profile: Redirecting to login - not authenticated');
        router.push('/login');
      } else if (!isLoading && isAuthenticated) {
        console.log('✅ Profile: User authenticated, staying on profile');
      }
    }, 100);

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
    <div className="min-h-screen bg-gray-50">

<nav className="bg-white shadow">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">

      {/* Title */}
      <h1 className="text-base sm:text-xl font-semibold text-gray-900">
        <span className="hidden sm:inline">CRM System - </span>Profile
      </h1>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-4">

        {/* Welcome — hidden on mobile */}
        <div className="hidden sm:flex items-center gap-2">
          <User className="h-5 w-5 text-gray-600 shrink-0" />
          <span className="text-sm text-gray-700">Welcome, {user?.username}</span>
        </div>

        {/* Back — icon only on mobile */}
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Back to Dashboard</span>
        </button>

        {/* Logout — icon only on mobile */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Logout</span>
        </button>

      </div>
    </div>
  </div>
</nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
            <p className="text-gray-600">Manage your profile information and security settings</p>
          </div>
          
          <ProfileForm />
        </div>
      </main>
    </div>
  );
}
