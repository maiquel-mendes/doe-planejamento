import type { User } from "@/types/auth"

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@empresa.com",
    role: "admin",
    createdAt: new Date("2024-01-01"),
    isActive: true,
  },
  {
    id: "2",
    name: "Editor Silva",
    email: "editor@empresa.com",
    role: "editor",
    createdAt: new Date("2024-01-15"),
    isActive: true,
  },
  {
    id: "3",
    name: "João Visualizador",
    email: "user@empresa.com",
    role: "user",
    createdAt: new Date("2024-02-01"),
    isActive: true,
  },
]

export const authenticateUser = async (email: string, password: string): Promise<User | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // For demo purposes, any password works
  const user = mockUsers.find((u) => u.email === email && u.isActive)
  return user || null
}

export const hasPermission = (userRole: string, requiredRole: string): boolean => {
  const roleHierarchy = { admin: 3, editor: 2, user: 1 }
  return (
    roleHierarchy[userRole as keyof typeof roleHierarchy] >= roleHierarchy[requiredRole as keyof typeof roleHierarchy]
  )
}
