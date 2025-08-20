"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { usePermissions } from "@/hooks/use-permissions";
import type { Permission } from "@/types/permissions";

interface RouteGuardProps {
  children: ReactNode;
  requiredPermissions?: Permission[];
  redirectTo?: string;
  requireAll?: boolean;
}

export function RouteGuard({
  children,
  requiredPermissions = [],
  redirectTo = "/login",
  requireAll = false,
}: RouteGuardProps) {
  const { user, isLoading, hasAnyPermission, hasAllPermissions, logAccess } =
    usePermissions();
  const router = useRouter();

  console.log('RouteGuard Render - user:', user, 'isLoading:', isLoading);

  useEffect(() => {
    console.log('RouteGuard useEffect - user:', user, 'isLoading:', isLoading);

    if (isLoading) {
      // Still loading, do nothing yet
      return;
    }

    if (!user) {
      console.log('RouteGuard: No user and not loading, redirecting to login.');
      router.push(redirectTo);
      return;
    }

    if (requiredPermissions.length > 0) {
      const hasAccess = requireAll
        ? hasAllPermissions(requiredPermissions)
        : hasAnyPermission(requiredPermissions);

      if (!hasAccess) {
        logAccess(
          "ACCESS_DENIED",
          window.location.pathname,
          false,
          "Insufficient permissions",
        );
        console.log('RouteGuard: Insufficient permissions, redirecting.');
        router.push(redirectTo);
        return;
      }
    }

    logAccess("PAGE_ACCESS", window.location.pathname, true);
  }, [
    user,
    isLoading,
    requiredPermissions,
    requireAll,
    redirectTo,
    router,
    hasAnyPermission,
    hasAllPermissions,
    logAccess,
  ]);

  if (isLoading) {
    console.log('RouteGuard: Returning null while loading.');
    return null; // Show a loading spinner or skeleton while authentication is in progress
  }

  if (!user) {
    console.log('RouteGuard: No user after loading, returning null (should have redirected).');
    return null; // Should have been redirected by useEffect, but as a fallback
  }

  if (requiredPermissions.length > 0) {
    const hasAccess = requireAll
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);

    if (!hasAccess) {
      console.log('RouteGuard: No access after loading, returning null.');
      return null;
    }
  }

  console.log('RouteGuard: User has access, rendering children.');
  return <>{children}</>;
}
