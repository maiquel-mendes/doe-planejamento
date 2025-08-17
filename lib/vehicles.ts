import type { Vehicle } from "@/types/operational-planning"

// Mock data para viaturas
const mockVehicles: Vehicle[] = [
  {
    id: "1",
    prefix: "D-0210",
    type: "viatura",
    model: "Toyota Hilux",
    capacity: 4,
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    prefix: "D-0212",
    type: "viatura",
    model: "Ford Ranger",
    capacity: 4,
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    prefix: "D-0236",
    type: "viatura",
    model: "Chevrolet S10",
    capacity: 4,
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "4",
    prefix: "D-0245",
    type: "van",
    model: "Mercedes Sprinter",
    capacity: 8,
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
]

const vehicles: Vehicle[] = [...mockVehicles]

export const getAllVehicles = async (): Promise<Vehicle[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return [...vehicles].sort((a, b) => a.prefix.localeCompare(b.prefix))
}

export const getVehicleById = async (id: string): Promise<Vehicle | null> => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return vehicles.find((v) => v.id === id) || null
}

export const createVehicle = async (data: Omit<Vehicle, "id" | "createdAt" | "updatedAt">): Promise<Vehicle> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const newVehicle: Vehicle = {
    ...data,
    id: (vehicles.length + 1).toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  vehicles.push(newVehicle)
  return newVehicle
}

export const updateVehicle = async (id: string, data: Partial<Vehicle>): Promise<Vehicle | null> => {
  await new Promise((resolve) => setTimeout(resolve, 400))

  const vehicleIndex = vehicles.findIndex((v) => v.id === id)
  if (vehicleIndex === -1) return null

  vehicles[vehicleIndex] = { ...vehicles[vehicleIndex], ...data, updatedAt: new Date() }
  return vehicles[vehicleIndex]
}

export const deleteVehicle = async (id: string): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const vehicleIndex = vehicles.findIndex((v) => v.id === id)
  if (vehicleIndex === -1) return false

  vehicles.splice(vehicleIndex, 1)
  return true
}

export { mockVehicles }
