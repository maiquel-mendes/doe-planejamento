import type { DashboardData, DashboardMetric, ChartData, ActivityItem } from "@/types/dashboard"
import type { UserRole } from "@/types/auth"
import { getAllUsers } from "./user-management"
import { getAllPlannings } from "./planning-management"
import { getAccessLogs } from "./permissions"

export const getDashboardData = async (userRole: UserRole, userId: string): Promise<DashboardData> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  const [users, plannings, accessLogs] = await Promise.all([getAllUsers(), getAllPlannings(), getAccessLogs(20)])

  switch (userRole) {
    case "admin":
      return getAdminDashboardData(users, plannings, accessLogs)
    case "editor":
      return getEditorDashboardData(users, plannings, accessLogs, userId)
    case "user":
      return getUserDashboardData(plannings, accessLogs, userId)
    default:
      return getDefaultDashboardData()
  }
}

const getAdminDashboardData = (users: any[], plannings: any[], accessLogs: any[]): DashboardData => {
  const activeUsers = users.filter((u) => u.isActive).length
  const activePlannings = plannings.filter((p) => p.status === "active").length
  const completedPlannings = plannings.filter((p) => p.status === "completed").length
  const totalBudget = plannings.reduce((sum, p) => sum + (p.budget || 0), 0)

  const metrics: DashboardMetric[] = [
    {
      id: "total-users",
      title: "Usuários Ativos",
      value: activeUsers,
      change: 12,
      changeType: "increase",
      description: "Usuários ativos no sistema",
    },
    {
      id: "active-plannings",
      title: "Planejamentos Ativos",
      value: activePlannings,
      change: 8,
      changeType: "increase",
      description: "Planejamentos em andamento",
    },
    {
      id: "completed-plannings",
      title: "Planejamentos Concluídos",
      value: completedPlannings,
      change: 25,
      changeType: "increase",
      description: "Planejamentos finalizados",
    },
    {
      id: "total-budget",
      title: "Orçamento Total",
      value: `R$ ${totalBudget.toLocaleString("pt-BR")}`,
      change: 15,
      changeType: "increase",
      description: "Soma de todos os orçamentos",
    },
  ]

  const chartData: ChartData[] = [
    { name: "Rascunho", value: plannings.filter((p) => p.status === "draft").length, color: "#94a3b8" },
    { name: "Ativo", value: activePlannings, color: "#3b82f6" },
    { name: "Concluído", value: completedPlannings, color: "#10b981" },
    { name: "Cancelado", value: plannings.filter((p) => p.status === "cancelled").length, color: "#ef4444" },
  ]

  const recentActivity: ActivityItem[] = accessLogs.slice(0, 10).map((log, index) => ({
    id: log.id,
    type: log.action.includes("CREATE") ? "planning_created" : "planning_updated",
    title: log.action.replace("_", " "),
    description: `${log.userName} ${log.action.toLowerCase()} em ${log.resource}`,
    timestamp: log.timestamp,
    user: log.userName,
    priority: log.success ? "low" : "high",
  }))

  return {
    metrics,
    chartData,
    recentActivity,
    notifications: [
      {
        id: "1",
        type: "info",
        title: "Sistema Atualizado",
        message: "Nova versão do sistema foi implantada com sucesso",
        timestamp: new Date(),
      },
      {
        id: "2",
        type: "warning",
        title: "Backup Agendado",
        message: "Backup automático será executado às 02:00",
        timestamp: new Date(),
      },
    ],
  }
}

const getEditorDashboardData = (users: any[], plannings: any[], accessLogs: any[], userId: string): DashboardData => {
  const myPlannings = plannings.filter((p) => p.responsibleId === userId)
  const activePlannings = myPlannings.filter((p) => p.status === "active").length
  const completedPlannings = myPlannings.filter((p) => p.status === "completed").length
  const avgProgress =
    myPlannings.length > 0 ? Math.round(myPlannings.reduce((sum, p) => sum + p.progress, 0) / myPlannings.length) : 0

  const metrics: DashboardMetric[] = [
    {
      id: "my-plannings",
      title: "Meus Planejamentos",
      value: myPlannings.length,
      description: "Total de planejamentos sob sua responsabilidade",
    },
    {
      id: "active-plannings",
      title: "Em Andamento",
      value: activePlannings,
      change: 5,
      changeType: "increase",
      description: "Planejamentos ativos",
    },
    {
      id: "completed-plannings",
      title: "Concluídos",
      value: completedPlannings,
      change: 20,
      changeType: "increase",
      description: "Planejamentos finalizados",
    },
    {
      id: "avg-progress",
      title: "Progresso Médio",
      value: `${avgProgress}%`,
      change: 10,
      changeType: "increase",
      description: "Progresso médio dos seus projetos",
    },
  ]

  const chartData: ChartData[] = myPlannings.map((p) => ({
    name: p.title.substring(0, 20) + (p.title.length > 20 ? "..." : ""),
    value: p.progress,
    color: p.progress >= 80 ? "#10b981" : p.progress >= 50 ? "#f59e0b" : "#ef4444",
  }))

  const recentActivity: ActivityItem[] = myPlannings.slice(0, 8).map((planning, index) => ({
    id: planning.id,
    type: "planning_updated",
    title: planning.title,
    description: `Progresso: ${planning.progress}% - Status: ${planning.status}`,
    timestamp: planning.updatedAt,
    user: planning.responsibleName,
    priority: planning.priority === "high" || planning.priority === "critical" ? "high" : "medium",
  }))

  return {
    metrics,
    chartData,
    recentActivity,
    notifications: [
      {
        id: "1",
        type: "info",
        title: "Novo Planejamento",
        message: "Você foi designado para um novo planejamento",
        timestamp: new Date(),
      },
    ],
  }
}

const getUserDashboardData = (plannings: any[], accessLogs: any[], userId: string): DashboardData => {
  const activePlannings = plannings.filter((p) => p.status === "active").length
  const completedPlannings = plannings.filter((p) => p.status === "completed").length
  const highPriorityPlannings = plannings.filter((p) => p.priority === "high" || p.priority === "critical").length

  const metrics: DashboardMetric[] = [
    {
      id: "total-plannings",
      title: "Total de Planejamentos",
      value: plannings.length,
      description: "Planejamentos disponíveis para visualização",
    },
    {
      id: "active-plannings",
      title: "Em Andamento",
      value: activePlannings,
      description: "Planejamentos ativos",
    },
    {
      id: "completed-plannings",
      title: "Concluídos",
      value: completedPlannings,
      description: "Planejamentos finalizados",
    },
    {
      id: "high-priority",
      title: "Alta Prioridade",
      value: highPriorityPlannings,
      description: "Planejamentos de alta prioridade",
    },
  ]

  const chartData: ChartData[] = [
    { name: "Rascunho", value: plannings.filter((p) => p.status === "draft").length, color: "#94a3b8" },
    { name: "Ativo", value: activePlannings, color: "#3b82f6" },
    { name: "Concluído", value: completedPlannings, color: "#10b981" },
    { name: "Cancelado", value: plannings.filter((p) => p.status === "cancelled").length, color: "#ef4444" },
  ]

  const recentActivity: ActivityItem[] = plannings.slice(0, 6).map((planning, index) => ({
    id: planning.id,
    type: "planning_updated",
    title: planning.title,
    description: `Responsável: ${planning.responsibleName} - ${planning.progress}% concluído`,
    timestamp: planning.updatedAt,
    user: planning.responsibleName,
    priority: "low",
  }))

  return {
    metrics,
    chartData,
    recentActivity,
    notifications: [
      {
        id: "1",
        type: "info",
        title: "Bem-vindo",
        message: "Você tem acesso de visualização aos planejamentos",
        timestamp: new Date(),
      },
    ],
  }
}

const getDefaultDashboardData = (): DashboardData => ({
  metrics: [],
  chartData: [],
  recentActivity: [],
  notifications: [],
})
