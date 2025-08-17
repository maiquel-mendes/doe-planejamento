import type { OperationalFunction } from "@/types/operational-planning"

// Mock data para funções operacionais
const mockFunctions: OperationalFunction[] = [
  {
    id: "1",
    name: "Coordenador/Motorista",
    description: "Responsável pela coordenação da operação e condução da viatura",
    category: "comando",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    name: "Arrombamento Mecânico",
    description: "Especialista em arrombamento e entrada forçada",
    category: "especializada",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    name: "Escudo/Taser",
    description: "Operador com escudo balístico e arma de eletrochoque",
    category: "entrada",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "4",
    name: "Motorista",
    description: "Responsável pela condução da viatura",
    category: "apoio",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "5",
    name: "Cal 12/Espargidor",
    description: "Operador com espingarda calibre 12 e equipamentos de dispersão",
    category: "entrada",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "6",
    name: "Mãos Livres/Taser/Escada",
    description: "Operador com equipamentos diversos e escada",
    category: "apoio",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "7",
    name: "APH",
    description: "Atendimento Pré-Hospitalar",
    category: "especializada",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
]

const functions: OperationalFunction[] = [...mockFunctions]

export const getAllFunctions = async (): Promise<OperationalFunction[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return [...functions].sort((a, b) => a.name.localeCompare(b.name))
}

export const getFunctionById = async (id: string): Promise<OperationalFunction | null> => {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return functions.find((f) => f.id === id) || null
}

export const createFunction = async (
  data: Omit<OperationalFunction, "id" | "createdAt" | "updatedAt">,
): Promise<OperationalFunction> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const newFunction: OperationalFunction = {
    ...data,
    id: (functions.length + 1).toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  functions.push(newFunction)
  return newFunction
}

export const updateFunction = async (
  id: string,
  data: Partial<OperationalFunction>,
): Promise<OperationalFunction | null> => {
  await new Promise((resolve) => setTimeout(resolve, 400))

  const functionIndex = functions.findIndex((f) => f.id === id)
  if (functionIndex === -1) return null

  functions[functionIndex] = { ...functions[functionIndex], ...data, updatedAt: new Date() }
  return functions[functionIndex]
}

export const deleteFunction = async (id: string): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 300))

  const functionIndex = functions.findIndex((f) => f.id === id)
  if (functionIndex === -1) return false

  functions.splice(functionIndex, 1)
  return true
}

export { mockFunctions }
