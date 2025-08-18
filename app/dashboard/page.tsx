"use client";

import { ArrowLeft, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RouteGuard } from "@/components/auth/route-guard";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { MetricCard } from "@/components/dashboard/metric-card";
import { NotificationsPanel } from "@/components/dashboard/notifications-panel";
import { StatusChart } from "@/components/dashboard/status-chart";
import { Button } from "@/components/ui/button";
import { usePermissions } from "@/hooks/use-permissions";
import { getDashboardData } from "@/lib/dashboard-data";
import type { DashboardData } from "@/types/dashboard";

export default function DashboardPage() {
  const { user, logAccess } = usePermissions();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      logAccess("LOAD_DASHBOARD", "/dashboard", true);
      const data = await getDashboardData(user.role, user.id);
      setDashboardData(data);
    } catch (error) {
      logAccess(
        "LOAD_DASHBOARD",
        "/dashboard",
        false,
        "Failed to load dashboard data",
      );
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismissNotification = (notificationId: string) => {
    if (!dashboardData) return;

    setDashboardData({
      ...dashboardData,
      notifications: dashboardData.notifications.filter(
        (n) => n.id !== notificationId,
      ),
    });
  };

  const getDashboardTitle = () => {
    switch (user?.role) {
      case "admin":
        return "Dashboard Administrativo";
      case "editor":
        return "Dashboard do Editor";
      case "user":
        return "Dashboard do Usuário";
      default:
        return "Dashboard";
    }
  };

  const getDashboardDescription = () => {
    switch (user?.role) {
      case "admin":
        return "Visão geral completa do sistema e métricas administrativas";
      case "editor":
        return "Seus planejamentos e métricas de produtividade";
      case "user":
        return "Visão geral dos planejamentos disponíveis";
      default:
        return "Painel de controle personalizado";
    }
  };

  if (isLoading) {
    return (
      <RouteGuard requiredPermissions={["dashboard.view"]}>
        <div className="min-h-screen bg-muted/30 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Carregando dashboard...</p>
              </div>
            </div>
          </div>
        </div>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard requiredPermissions={["dashboard.view"]}>
      <div className="min-h-screen bg-muted/30 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-primary">
                {getDashboardTitle()}
              </h1>
              <p className="text-muted-foreground">
                {getDashboardDescription()}
              </p>
            </div>
          </div>

          {dashboardData && (
            <div className="space-y-6">
              {/* Metrics Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {dashboardData.metrics.map((metric) => (
                  <MetricCard key={metric.id} metric={metric} />
                ))}
              </div>

              {/* Charts and Activity */}
              <div className="grid gap-6 md:grid-cols-2">
                <StatusChart
                  data={dashboardData.chartData}
                  title={
                    user?.role === "editor"
                      ? "Progresso dos Projetos"
                      : "Status dos Planejamentos"
                  }
                  description={
                    user?.role === "editor"
                      ? "Progresso dos seus planejamentos"
                      : "Distribuição por status"
                  }
                />
                <ActivityFeed
                  activities={dashboardData.recentActivity}
                  title={
                    user?.role === "admin"
                      ? "Atividade do Sistema"
                      : "Atividade Recente"
                  }
                />
              </div>

              {/* Notifications */}
              {dashboardData.notifications.length > 0 && (
                <div className="max-w-2xl">
                  <NotificationsPanel
                    notifications={dashboardData.notifications}
                    onDismiss={handleDismissNotification}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </RouteGuard>
  );
}
