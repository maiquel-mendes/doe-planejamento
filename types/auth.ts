export type UserRole = "admin" | "editor" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  isActive: boolean;
  isOptimistic?: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (accessToken: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
