"use client";

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { RouteGuard } from './route-guard';
import { MainHeader } from '@/components/layout/main-header';

interface ProtectedLayoutProps {
  children: ReactNode;
}

const publicRoutes = ['/login']; // Add any other public routes here

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const pathname = usePathname();
  const isPublicRoute = pathname ? publicRoutes.includes(pathname) : false;

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <RouteGuard>
      <div className="flex min-h-screen flex-col">
        <MainHeader />
        <main className="flex-1 flex flex-col">{children}</main>
      </div>
    </RouteGuard>
  );
}
