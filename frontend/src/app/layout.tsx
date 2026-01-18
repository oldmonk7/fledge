'use client';

import { Inter } from 'next/font/google';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { apiClient } from '@/lib/api';
import { User } from '@fledge/shared';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear user data regardless of API response
      localStorage.removeItem('user');
      setUser(null);
      router.push('/login');
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-2 text-sm text-neutral-600">Loading...</p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  // Redirect to login if not authenticated and not on login or signup page
  if (!user && pathname !== '/login' && pathname !== '/signup') {
    console.log('Redirecting to login page');
    router.push('/login');
    return null;
  }

  // Show login or signup page without layout if not authenticated
  if (!user && (pathname === '/login' || pathname === '/signup')) {
    console.log('Showing login or signup page');
    return (
      <html lang="en">
        <body className={inter.className}>
          {children}
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-neutral-50">
          <header className="bg-white border-b border-neutral-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-4">
                <div className="flex items-center">
                  <Link href="/" className="flex items-center group">
                    <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight group-hover:text-primary-600 transition-colors">
                      Fledge
                    </h1>
                    <span className="ml-2.5 text-sm text-neutral-500 font-medium">DCFSA Management</span>
                  </Link>
                </div>
                <div className="flex items-center space-x-4">
                  <nav className="flex space-x-1">
                    <Link
                      href="/"
                      className="text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                    >
                      Home
                    </Link>
                    {user?.role === 'admin' && (
                      <Link
                        href="/employees"
                        className="text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                      >
                        Employees
                      </Link>
                    )}
                  </nav>

                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-neutral-700">
                      Welcome, {user?.firstName}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
