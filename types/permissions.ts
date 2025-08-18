export type Permission =
  | "users.view"
  | "users.create"
  | "users.edit"
  | "users.delete"
  | "planning.view"
  | "planning.create"
  | "planning.edit"
  | "planning.delete"
  | "planning.manage_progress"
  | "dashboard.view"
  | "dashboard.admin"
  | "system.audit"
  | "user.manage";

export type RolePermissions = {
  [key: string]: Permission[];
};

export interface AccessLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  timestamp: Date;
  success: boolean;
  details?: string;
}
