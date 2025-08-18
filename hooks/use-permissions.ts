"use client";

import { useAuth } from "@/contexts/auth-context";
import {
  getUserPermissions,
  hasAllPermissions,
  hasAnyPermission,
  hasPermission,
  logAccess,
} from "@/lib/permissions";
import type { Permission } from "@/types/permissions";

export function usePermissions() {
  const { user } = useAuth();

  const checkPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return hasPermission(user.role, permission);
  };

  const checkAnyPermission = (permissions: Permission[]): boolean => {
    if (!user) return false;
    return hasAnyPermission(user.role, permissions);
  };

  const checkAllPermissions = (permissions: Permission[]): boolean => {
    if (!user) return false;
    return hasAllPermissions(user.role, permissions);
  };

  const getPermissions = (): Permission[] => {
    if (!user) return [];
    return getUserPermissions(user.role);
  };

  const logUserAccess = (
    action: string,
    resource: string,
    success: boolean,
    details?: string,
  ) => {
    if (user) {
      logAccess(user, action, resource, success, details);
    }
  };

  return {
    user,
    hasPermission: checkPermission,
    hasAnyPermission: checkAnyPermission,
    hasAllPermissions: checkAllPermissions,
    permissions: getPermissions(),
    logAccess: logUserAccess,
  };
}
