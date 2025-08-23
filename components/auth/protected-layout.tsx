"use client";

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { RouteGuard } from './route-guard';

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

  return <RouteGuard>{children}</RouteGuard>;
}
