"use client";

import {
  BarChart3,
  Car,
  FileText,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { LoginForm } from "@/components/login-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { usePermissions } from "@/hooks/use-permissions";

export default function HomePage() {
  const { user, logout } = useAuth();
  const { hasPermission, logAccess } = usePermissions();

  if (!user) {
    return <LoginForm />;
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "editor":
        return "default";
      case "user":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "editor":
        return "Editor";
      case "user":
        return "Usuário";
      default:
        return role;
    }
  };

  const handleCardClick = (resource: string) => {
    logAccess("NAVIGATE", resource, true);
  };

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">
              Sistema de Planejamento Operacional
            </h1>
            <p className="text-muted-foreground mt-1">Bem-vindo, {user.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant={getRoleBadgeVariant(user.role)}>
              {getRoleLabel(user.role)}
            </Badge>
            <Button variant="outline" onClick={logout}>
              Sair
            </Button>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <PermissionGuard permission="users.view">
            <Link href="/usuarios" onClick={() => handleCardClick("/usuarios")}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <Users className="h-6 w-6 text-primary mr-3" />
                  <CardTitle className="text-lg">Usuários</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Gerenciar usuários e permissões do sistema
                  </p>
                </CardContent>
              </Card>
            </Link>
          </PermissionGuard>

          <PermissionGuard permission="planning.view">
            <Link
              href="/planejamento"
              onClick={() => handleCardClick("/planejamento")}
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <FileText className="h-6 w-6 text-primary mr-3" />
                  <CardTitle className="text-lg">Planejamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {hasPermission("planning.edit")
                      ? "Criar e editar planejamentos operacionais"
                      : "Visualizar planejamentos operacionais"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </PermissionGuard>

          <PermissionGuard permission="user.manage">
            <Link href="/funcoes" onClick={() => handleCardClick("/funcoes")}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <Settings className="h-6 w-6 text-primary mr-3" />
                  <CardTitle className="text-lg">Funções</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Gerenciar funções operacionais disponíveis
                  </p>
                </CardContent>
              </Card>
            </Link>
          </PermissionGuard>

          <PermissionGuard permission="user.manage">
            <Link href="/viaturas" onClick={() => handleCardClick("/viaturas")}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <Car className="h-6 w-6 text-primary mr-3" />
                  <CardTitle className="text-lg">Viaturas</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Gerenciar viaturas disponíveis para operações
                  </p>
                </CardContent>
              </Card>
            </Link>
          </PermissionGuard>

          <PermissionGuard permission="dashboard.view">
            <Link
              href="/dashboard"
              onClick={() => handleCardClick("/dashboard")}
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <BarChart3 className="h-6 w-6 text-primary mr-3" />
                  <CardTitle className="text-lg">Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {user.role === "admin"
                      ? "Métricas administrativas e visão geral do sistema"
                      : user.role === "editor"
                        ? "Seus projetos e métricas de produtividade"
                        : "Visão geral dos planejamentos disponíveis"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </PermissionGuard>

          <PermissionGuard permission="system.audit">
            <Link
              href="/auditoria"
              onClick={() => handleCardClick("/auditoria")}
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <Shield className="h-6 w-6 text-primary mr-3" />
                  <CardTitle className="text-lg">Auditoria</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Visualizar logs de acesso e atividades
                  </p>
                </CardContent>
              </Card>
            </Link>
          </PermissionGuard>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Suas Permissões</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {user.role === "admin" && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">
                      Gerenciar usuários (criar, editar, excluir)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">
                      Acesso completo ao planejamento operacional
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">
                      Gerenciar funções e viaturas operacionais
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">
                      Visualizar logs de auditoria
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">
                      Acesso a dashboards administrativos
                    </span>
                  </div>
                </>
              )}
              {user.role === "editor" && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">
                      Criar e editar planejamentos
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Visualizar dados do sistema</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">
                      Acesso a dashboard personalizado
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Gerenciar usuários</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm">
                      Gerenciar funções e viaturas
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Acessar logs de auditoria</span>
                  </div>
                </>
              )}
              {user.role === "user" && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Visualizar planejamentos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">
                      Acesso a dashboard de visualização
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Editar dados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Gerenciar usuários</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm">
                      Gerenciar funções e viaturas
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Acessar logs de auditoria</span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
