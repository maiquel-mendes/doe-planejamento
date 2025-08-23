import type { User, UserRole } from "@/types/auth";
import type {
  ActivityItem,
  ChartData,
  DashboardData,
  DashboardMetric,
} from "@/types/dashboard";
import { getAccessLogs } from "./permissions";
import { getAllOperationalPlannings } from "./operational-planning-management";
import { getAllUsers } from "./user-management";
import type { OperationalPlanning } from "@/types/operational-planning";
import type { AccessLog } from "@/types/permissions";

export const getDashboardData = async (
  userRole: UserRole,
  userId: string,
): Promise<DashboardData> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const [users, plannings, accessLogs] = await Promise.all([
    getAllUsers(),
    getAllOperationalPlannings(),
    getAccessLogs(20),
  ]);

  switch (userRole) {
    case "admin":
      return getAdminDashboardData(users, plannings, accessLogs);
    case "editor":
      return getEditorDashboardData(users, plannings, accessLogs, userId);
    case "user":
      return getUserDashboardData(plannings, accessLogs, userId);
    default:
      return getDefaultDashboardData();
  }
};

const getAdminDashboardData = (
  users: User[],
  plannings: OperationalPlanning[],
  accessLogs: AccessLog[],
): DashboardData => {
  const activeUsers = users.filter((u) => u.isActive).length;
  const activePlannings = plannings.filter(
    (p) => p.status === "approved",
  ).length;
  const completedPlannings = plannings.filter(
    (p) => p.status === "completed",
  ).length;

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
      value: `R$ 100`,
      change: 15,
      changeType: "increase",
      description: "Soma de todos os orçamentos",
    },
  ];

  const chartData: ChartData[] = [
    {
      name: "Rascunho",
      value: plannings.filter((p) => p.status === "draft").length,
      color: "#94a3b8",
    },
    { name: "Ativo", value: activePlannings, color: "#3b82f6" },
    { name: "Concluído", value: completedPlannings, color: "#10b981" },
    {
      name: "Cancelado",
      value: plannings.filter((p) => p.status === "cancelled").length,
      color: "#ef4444",
    },
  ];

  const recentActivity: ActivityItem[] = accessLogs.slice(0, 10).map((log) => ({
    id: log.id,
    type: log.action.includes("CREATE")
      ? "planning_created"
      : "planning_updated",
    title: log.action.replace("_", " "),
    description: `${log.userName} ${log.action.toLowerCase()} em ${log.resource}`,
    timestamp: log.timestamp,
    user: log.userName,
    priority: log.success ? "low" : "high",
  }));

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
  };
};

const getEditorDashboardData = (
  _users: User[],
  plannings: OperationalPlanning[],
  _accessLogs: AccessLog[],
  userId: string,
): DashboardData => {
  const myPlannings = plannings.filter((p) => p.responsibleId === userId);
  const activePlannings = myPlannings.filter(
    (p) => p.status === "approved",
  ).length;
  const completedPlannings = myPlannings.filter(
    (p) => p.status === "completed",
  ).length;

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
      value: `100%`,
      change: 10,
      changeType: "increase",
      description: "Progresso médio dos seus projetos",
    },
  ];

  const recentActivity: ActivityItem[] = myPlannings
    .slice(0, 8)
    .map((planning, _index) => ({
      id: planning.id,
      type: "planning_updated",
      title: planning.introduction?.serviceOrderNumber || 'N/A',
      description: `Progresso: ${planning.introduction?.description || 'N/A'}% - Status: ${planning.status}`,
      timestamp: planning.updatedAt,
      user: planning.responsible.name,
      priority:
        planning.priority === "high" || planning.priority === "critical"
          ? "high"
          : "medium",
    }));

  return {
    metrics,
    chartData: [],
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
  };
};

const getUserDashboardData = (
  plannings: OperationalPlanning[],
  _accessLogs: AccessLog[],
  _userId: string,
): DashboardData => {
  const activePlannings = plannings.filter(
    (p) => p.status === "approved",
  ).length;
  const completedPlannings = plannings.filter(
    (p) => p.status === "completed",
  ).length;
  const highPriorityPlannings = plannings.filter(
    (p) => p.priority === "high" || p.priority === "critical",
  ).length;

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
  ];

  const chartData: ChartData[] = [
    {
      name: "Rascunho",
      value: plannings.filter((p) => p.status === "draft").length,
      color: "#94a3b8",
    },
    { name: "Ativo", value: activePlannings, color: "#3b82f6" },
    { name: "Concluído", value: completedPlannings, color: "#10b981" },
    {
      name: "Cancelado",
      value: plannings.filter((p) => p.status === "cancelled").length,
      color: "#ef4444",
    },
  ];

  const recentActivity: ActivityItem[] = plannings
    .slice(0, 6)
    .map((planning, _index) => ({
      id: planning.id,
      type: "planning_updated",
      title: planning.introduction?.serviceOrderNumber || 'N/A',
      description: `Responsável: ${planning.responsible.name} - Status: ${planning.status}`,
      timestamp: planning.updatedAt,
      user: planning.responsible.name,
      priority: "low",
    }));

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
  };
};

const getDefaultDashboardData = (): DashboardData => ({
  metrics: [],
  chartData: [],
  recentActivity: [],
  notifications: [],
});