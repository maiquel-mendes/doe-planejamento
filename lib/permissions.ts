import type { User, UserRole } from '@/types/auth';
import type {
  AccessLog,
  Permission,
  RolePermissions,
} from '@/types/permissions';

// Define permissions for each role
export const ROLE_PERMISSIONS: RolePermissions = {
  admin: [
    'users.view',
    'users.create',
    'users.edit',
    'users.delete',
    'planning.view',
    'planning.create',
    'planning.edit',
    'planning.delete',
    'planning.manage_progress',
    'dashboard.view',
    'dashboard.admin',
    'system.audit',
    'user.manage',
  ],
  editor: [
    'planning.view',
    'planning.create',
    'planning.edit',
    'planning.delete',
    'planning.manage_progress',
    'dashboard.view',
  ],
  user: ['planning.view', 'dashboard.view'],
};

// Access logs storage (in real app, this would be in database)
const accessLogs: AccessLog[] = [];

export const hasPermission = (
  userRole: UserRole,
  permission: Permission,
): boolean => {
  const rolePermissions = ROLE_PERMISSIONS[userRole] || [];
  return rolePermissions.includes(permission);
};

export const hasAnyPermission = (
  userRole: UserRole,
  permissions: Permission[],
): boolean => {
  return permissions.some((permission) => hasPermission(userRole, permission));
};

export const hasAllPermissions = (
  userRole: UserRole,
  permissions: Permission[],
): boolean => {
  return permissions.every((permission) => hasPermission(userRole, permission));
};

export const getUserPermissions = (userRole: UserRole): Permission[] => {
  return ROLE_PERMISSIONS[userRole] || [];
};

export const logAccess = (
  user: User,
  action: string,
  resource: string,
  success: boolean,
  details?: string,
): void => {
  const log: AccessLog = {
    id: (accessLogs.length + 1).toString(),
    userId: user.id,
    userName: user.name,
    action,
    resource,
    timestamp: new Date(),
    success,
    details,
  };

  accessLogs.push(log);
  // console.log(
  //   `[ACCESS LOG] ${user.name} (${user.role}) ${action} ${resource} - ${success ? "SUCCESS" : "DENIED"}`,
  // );
};

export const getAccessLogs = async (limit = 50): Promise<AccessLog[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [...accessLogs]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);
};

export const canAccessRoute = (userRole: UserRole, route: string): boolean => {
  const routePermissions: { [key: string]: Permission[] } = {
    '/usuarios': ['users.view'],
    '/planejamento': ['planning.view'],
    '/dashboard': ['dashboard.view'],
    '/auditoria': ['system.audit'],
  };

  const requiredPermissions = routePermissions[route];
  if (!requiredPermissions) return true; // Public route

  return hasAnyPermission(userRole, requiredPermissions);
};
