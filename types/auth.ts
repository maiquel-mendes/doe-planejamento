export type UserRole = "admin" | "editor" | "user"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: Date
  isActive: boolean
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}
