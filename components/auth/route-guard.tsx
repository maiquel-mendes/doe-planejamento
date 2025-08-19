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
  redirectTo = "/",
  requireAll = false,
}: RouteGuardProps) {
  const { user, hasAnyPermission, hasAllPermissions, logAccess } =
    usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
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
    requiredPermissions,
    requireAll,
    redirectTo,
    router,
    hasAnyPermission,
    hasAllPermissions,
    logAccess,
  ]);

  if (!user) {
    return null;
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
