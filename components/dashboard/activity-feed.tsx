"use client";

import { Clock, FileText, Settings, User, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ActivityItem } from "@/types/dashboard";

interface ActivityFeedProps {
  activities: ActivityItem[];
  title?: string;
}

export function ActivityFeed({
  activities,
  title = "Atividade Recente",
}: ActivityFeedProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "planning_created":
        return <FileText className="h-4 w-4 text-blue-600" />;
      case "planning_updated":
        return <Settings className="h-4 w-4 text-orange-600" />;
      case "user_created":
        return <UserPlus className="h-4 w-4 text-green-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityBadge = (priority?: string) => {
    if (!priority) return null;

    const variant =
      priority === "high"
        ? "destructive"
        : priority === "medium"
          ? "default"
          : "secondary";
    return (
      <Badge variant={variant} className="text-xs">
        {priority}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>Últimas atividades do sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma atividade recente
            </p>
          ) : (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 pb-3 border-b last:border-b-0"
              >
                <div className="mt-1">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium truncate">
                      {activity.title}
                    </p>
                    {getPriorityBadge(activity.priority)}
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>{activity.user}</span>
                    <span>•</span>
                    <span>
                      {activity.timestamp.toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
