import type { Planning, PlanningFormData } from "@/types/planning"
import { mockUsers } from "./auth-mock"

// Mock planning data
const mockPlannings: Planning[] = [
  {
    id: "1",
    title: "Expansão da Linha de Produção A",
    description: "Planejamento para aumentar a capacidade produtiva da linha A em 30%",
    startDate: new Date("2024-03-01"),
    endDate: new Date("2024-06-30"),
    status: "active",
    priority: "high",
    responsibleId: "2",
    responsibleName: "Editor Silva",
    objectives: [
      "Aumentar capacidade produtiva em 30%",
      "Reduzir tempo de setup em 20%",
      "Implementar controle de qualidade automatizado",
    ],
    resources: [
      "2 novos equipamentos de produção",
      "Sistema de automação",
      "Treinamento da equipe técnica",
      "Consultoria especializada",
    ],
    budget: 150000,
    progress: 45,
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-03-10"),
    createdBy: "Editor Silva",
  },
  {
    id: "2",
    title: "Otimização do Processo Logístico",
    description: "Reestruturação do fluxo logístico para reduzir custos e melhorar eficiência",
    startDate: new Date("2024-04-01"),
    endDate: new Date("2024-08-31"),
    status: "draft",
    priority: "medium",
    responsibleId: "2",
    responsibleName: "Editor Silva",
    objectives: [
      "Reduzir custos logísticos em 15%",
      "Melhorar tempo de entrega",
      "Implementar rastreamento em tempo real",
    ],
    resources: ["Software de gestão logística", "Equipamentos de rastreamento", "Treinamento da equipe"],
    budget: 80000,
    progress: 10,
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01"),
    createdBy: "Editor Silva",
  },
]

const plannings: Planning[] = [...mockPlannings]

export const getAllPlannings = async (): Promise<Planning[]> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return [...plannings].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
}

export const getPlanningById = async (id: string): Promise<Planning | null> => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return plannings.find((p) => p.id === id) || null
}

export const createPlanning = async (data: PlanningFormData, createdBy: string): Promise<Planning> => {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const responsible = mockUsers.find((u) => u.id === data.responsibleId)

  const newPlanning: Planning = {
    ...data,
    id: (plannings.length + 1).toString(),
    startDate: new Date(data.startDate),
    endDate: new Date(data.endDate),
    responsibleName: responsible?.name || "Usuário não encontrado",
    progress: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy,
  }

  plannings.push(newPlanning)
  return newPlanning
}

export const updatePlanning = async (id: string, data: Partial<PlanningFormData>): Promise<Planning | null> => {
  await new Promise((resolve) => setTimeout(resolve, 600))

  const planningIndex = plannings.findIndex((p) => p.id === id)
  if (planningIndex === -1) return null

  const responsible = data.responsibleId ? mockUsers.find((u) => u.id === data.responsibleId) : null

  const updatedData: Partial<Planning> = {
    ...data,
    ...(data.startDate && { startDate: new Date(data.startDate) }),
    ...(data.endDate && { endDate: new Date(data.endDate) }),
    ...(responsible && { responsibleName: responsible.name }),
    updatedAt: new Date(),
  }

  plannings[planningIndex] = { ...plannings[planningIndex], ...updatedData }
  return plannings[planningIndex]
}

export const updatePlanningProgress = async (id: string, progress: number): Promise<Planning | null> => {
  await new Promise((resolve) => setTimeout(resolve, 400))

  const planningIndex = plannings.findIndex((p) => p.id === id)
  if (planningIndex === -1) return null

  plannings[planningIndex].progress = Math.max(0, Math.min(100, progress))
  plannings[planningIndex].updatedAt = new Date()

  return plannings[planningIndex]
}

export const deletePlanning = async (id: string): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const planningIndex = plannings.findIndex((p) => p.id === id)
  if (planningIndex === -1) return false

  plannings.splice(planningIndex, 1)
  return true
}
