export interface DashboardMetric {
  id: string;
  title: string;
  value: string | number;
  change?: number;
  changeType?: "increase" | "decrease" | "neutral";
  icon?: string;
  description?: string;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface ActivityItem {
  id: string;
  type:
    | "planning_created"
    | "planning_updated"
    | "user_created"
    | "status_changed";
  title: string;
  description: string;
  timestamp: Date;
  user: string;
  priority?: "low" | "medium" | "high";
}

export interface DashboardData {
  metrics: DashboardMetric[];
  chartData: ChartData[];
  recentActivity: ActivityItem[];
  notifications: {
    id: string;
    type: "info" | "warning" | "success" | "error";
    title: string;
    message: string;
    timestamp: Date;
  }[];
}
