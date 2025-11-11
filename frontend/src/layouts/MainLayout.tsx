import React from 'react';
import Header from '@/components/Header';
import DynamicNavbar from '@/components/DynamicNavbar';
import SiteFooter from '@/components/layout/SiteFooter';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <Header />
      <DynamicNavbar />

      <main className="flex-1">
        {children}
      </main>

      <SiteFooter />
    </div>
  );
}
