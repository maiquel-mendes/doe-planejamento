import type { User } from "@/types/auth"
import { mockUsers } from "./auth-mock"

// Simulate user management operations
const users: User[] = [...mockUsers]

export const getAllUsers = async (): Promise<User[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [...users]
}

export const createUser = async (userData: Omit<User, "id" | "createdAt">): Promise<User> => {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const newUser: User = {
    ...userData,
    id: (users.length + 1).toString(),
    createdAt: new Date(),
  }

  users.push(newUser)
  return newUser
}

export const updateUser = async (id: string, userData: Partial<User>): Promise<User | null> => {
  await new Promise((resolve) => setTimeout(resolve, 600))

  const userIndex = users.findIndex((u) => u.id === id)
  if (userIndex === -1) return null

  users[userIndex] = { ...users[userIndex], ...userData }
  return users[userIndex]
}

export const toggleUserStatus = async (id: string): Promise<User | null> => {
  await new Promise((resolve) => setTimeout(resolve, 400))

  const userIndex = users.findIndex((u) => u.id === id)
  if (userIndex === -1) return null

  users[userIndex].isActive = !users[userIndex].isActive
  return users[userIndex]
}

export const deleteUser = async (id: string): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const userIndex = users.findIndex((u) => u.id === id)
  if (userIndex === -1) return false

  users.splice(userIndex, 1)
  return true
}
