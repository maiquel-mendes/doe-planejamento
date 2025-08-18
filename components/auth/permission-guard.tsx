"use client";

import { ShieldX } from "lucide-react";
import type { ReactNode } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usePermissions } from "@/hooks/use-permissions";
import type { Permission } from "@/types/permissions";

interface PermissionGuardProps {
  children: ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: ReactNode;
  showError?: boolean;
}

export function PermissionGuard({
  children,
  permission,
  permissions = [],
  requireAll = false,
  fallback,
  showError = true,
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, user } =
    usePermissions();

  if (!user) {
    return showError ? (
      <Alert variant="destructive">
        <ShieldX className="h-4 w-4" />
        <AlertDescription>
          Você precisa estar logado para acessar este conteúdo.
        </AlertDescription>
      </Alert>
    ) : null;
  }

  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (permissions.length > 0) {
    hasAccess = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  } else {
    hasAccess = true; // No permissions required
  }

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return showError ? (
      <Alert variant="destructive">
        <ShieldX className="h-4 w-4" />
        <AlertDescription>
          Você não tem permissão para acessar este conteúdo. Entre em contato
          com o administrador se necessário.
        </AlertDescription>
      </Alert>
    ) : null;
  }

  return <>{children}</>;
}
