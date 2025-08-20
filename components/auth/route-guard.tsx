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


  useEffect(() => {

    if (isLoading) {
      // Still loading, do nothing yet
      return;
    }

    if (!user) {
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
    return null; // Show a loading spinner or skeleton while authentication is in progress
  }

  if (!user) {
    return null; // Should have been redirected by useEffect, but as a fallback
  }

  if (requiredPermissions.length > 0) {
    const hasAccess = requireAll
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);

    if (!hasAccess) {
      return null;
    }
  }

  return <>{children}</>;
}
