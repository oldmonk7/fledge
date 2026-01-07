import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fledge - DCFSA Management',
  description: 'Manage your Dependent Care Flexible Spending Account',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
                <nav className="flex space-x-1">
                  <Link
                    href="/"
                    className="text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  >
                    Home
                  </Link>
                  <Link
                    href="/employees"
                    className="text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  >
                    Employees
                  </Link>
                </nav>
              </div>
            </div>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
