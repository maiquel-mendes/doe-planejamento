"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { RouteGuard } from "@/components/auth/route-guard";

import { OperationalPlanningFormModal } from "@/components/planning/operational-planning-form-modal";
import { PlanningTable } from "@/components/planning/planning-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePermissions } from "@/hooks/use-permissions";
import { useToast } from "@/hooks/use-toast";
import {
  createOperationalPlanning,
  deleteOperationalPlanning,
  getAllOperationalPlannings,
  updateOperationalPlanning,
} from "@/lib/operational-planning-management";
import type { OperationalPlanning } from "@/types/operational-planning";

export default function PlanningPage() {
  const { user, hasPermission, logAccess } = usePermissions();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPlanning, setEditingPlanning] =
    useState<OperationalPlanning | null>(null);

  const canEdit = hasPermission("planning.edit");
  const canCreate = hasPermission("planning.create");
  const canDelete = hasPermission("planning.delete");

  const { data: plannings = [], isLoading } = useQuery<OperationalPlanning[]>({
    queryKey: ["plannings"],
    queryFn: async () => {
      try {
        logAccess("LOAD_PLANNINGS", "/planejamento", true);
        return await getAllOperationalPlannings();
      } catch (error) {
        console.error("Failed to load plannings:", error);
        logAccess("LOAD_PLANNINGS", "/planejamento", false, "Failed to load plannings");
        toast({ title: "Erro", description: "Não foi possível carregar os planejamentos", variant: "destructive" });
        return [];
      }
    },
  });

  const { mutate: savePlanning, isPending: isSubmitting } = useMutation({
    mutationFn: async (data: OperationalPlanning) => {
      if (!user) throw new Error("Usuário não autenticado.");
      const isEditing = !!editingPlanning;
      if (isEditing) {
        if (!editingPlanning.id) throw new Error("ID do planejamento inválido.");
        return updateOperationalPlanning(editingPlanning.id, data);
      }
      return createOperationalPlanning(data, user.name);
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["plannings"] });
      const previousPlannings =
        queryClient.getQueryData<OperationalPlanning[]>(["plannings"]) || [];

      if (editingPlanning) {
        logAccess(
          "UPDATE_PLANNING_OPTIMISTIC",
          `/planejamento/${editingPlanning.id}`,
          true,
        );
        queryClient.setQueryData<OperationalPlanning[]>(
          ["plannings"],
          (old = []) =>
            old.map((planning) =>
              planning.id === editingPlanning.id
                ? { ...planning, ...newData }
                : planning,
            ),
        );
      } else {
        logAccess("CREATE_PLANNING_OPTIMISTIC", `/planejamento`, true);
        const optimisticPlanning: OperationalPlanning = {
          ...newData,
          id: `optimistic-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: user?.id ?? "temp-id",
          responsibleId: user?.id ?? "temp-id",
          responsibleName: user?.name ?? "Temp User",
          status: newData.status || "Elaboração",
          priority: newData.priority || "Média",
          isOptimistic: true,
        };
        queryClient.setQueryData<OperationalPlanning[]>(
          ["plannings"],
          (old = []) => [...old, optimisticPlanning],
        );
      }

      setIsFormModalOpen(false);
      return { previousPlannings };
    },
    onError: (err: Error, newData, context) => {
      queryClient.setQueryData(["plannings"], context?.previousPlannings || []);

      const isEditing = !!editingPlanning;
      const action = isEditing ? "UPDATE_PLANNING" : "CREATE_PLANNING";
      const resource = isEditing
        ? `/planejamento/${editingPlanning?.id}`
        : "/planejamento";
      logAccess(action, resource, false, err.message);

      toast({
        title: "Erro ao Salvar",
        description: `A alteração foi revertida. Erro: ${err.message}`,
        variant: "destructive",
      });
    },
    onSuccess: (data, variables) => {
      const isEditing = !!editingPlanning;
      if (isEditing && data) {
        // This is crucial: update the editingPlanning state with the fresh data
        // from the server to ensure the form re-initializes with the correct data
        // if the user opens it again.
        const newPlanning = JSON.parse(JSON.stringify(data));
        setEditingPlanning(newPlanning);
      }

      const action = isEditing ? "UPDATE_PLANNING" : "CREATE_PLANNING";
      const resource = isEditing
        ? `/planejamento/${editingPlanning?.id}`
        : "/planejamento";
      logAccess(action, resource, true);
      toast({
        title: "Sucesso",
        description: `Planejamento ${isEditing ? "atualizado" : "criado"} com sucesso.`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["plannings"] });
    },
  });

  const { mutate: removePlanning } = useMutation({
    mutationFn: deleteOperationalPlanning,
    onMutate: async (planningId: string) => {
      logAccess("DELETE_PLANNING_OPTIMISTIC", `/planejamento/${planningId}`, true);
      await queryClient.cancelQueries({ queryKey: ["plannings"] });
      const previousPlannings = queryClient.getQueryData<OperationalPlanning[]>(["plannings"]);
      if (previousPlannings) {
        queryClient.setQueryData(
          ["plannings"],
          previousPlannings.filter((planning) => planning.id !== planningId),
        );
      }
      return { previousPlannings };
    },
    onError: (err: Error, planningId, context) => {
      if (context?.previousPlannings) {
        queryClient.setQueryData(["plannings"], context.previousPlannings);
      }
      logAccess("DELETE_PLANNING_ERROR", `/planejamento/${planningId}`, false, err.message);
      toast({
        title: "Exclusão falhou",
        description: "A alteração foi revertida.",
        variant: "destructive",
      });
    },
    onSuccess: (_, planningId) => {
      logAccess("DELETE_PLANNING_SUCCESS", `/planejamento/${planningId}`, true);
      toast({
        title: "Sucesso",
        description: "Planejamento excluído com sucesso.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["plannings"] });
    },
  });

  const handleCreatePlanning = () => {
    if (!canCreate) return;
    logAccess("OPEN_CREATE_PLANNING_FORM", "/planejamento", true);
    setEditingPlanning(null);
    setIsFormModalOpen(true);
  };

  const handleEditPlanning = (planning: OperationalPlanning) => {
    if (!canEdit) return;
    logAccess("OPEN_EDIT_PLANNING_FORM", `/planejamento/${planning.id}`, true);
    setEditingPlanning(planning);
    setIsFormModalOpen(true);
  };

  

  return (
    <RouteGuard requiredPermissions={["planning.view"]}>
      <div className="min-h-screen bg-muted/30 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" onClick={() => router.push("/")} size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-primary">Planejamento Operacional</h1>
              <p className="text-muted-foreground">
                {canEdit ? "Gerencie seus planejamentos operacionais" : "Visualize os planejamentos operacionais"}
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Planejamentos</CardTitle>
                  <CardDescription>
                    {canEdit
                      ? "Lista de todos os planejamentos operacionais. Você pode criar, editar e gerenciar planejamentos."
                      : "Lista de todos os planejamentos operacionais para visualização."}
                  </CardDescription>
                </div>
                <PermissionGuard permission="planning.create">
                  <Button onClick={handleCreatePlanning}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Planejamento
                  </Button>
                </PermissionGuard>
              </div>
            </CardHeader>
            <CardContent>
              <PlanningTable
                plannings={plannings}
                onEditPlanning={handleEditPlanning}
                onDeletePlanning={removePlanning}
                canEdit={canEdit}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>

          <OperationalPlanningFormModal
            isOpen={isFormModalOpen}
            onClose={() => setIsFormModalOpen(false)}
            onSubmit={savePlanning}
            planning={editingPlanning}
            isLoading={isSubmitting}
          />

          
        </div>
      </div>
    </RouteGuard>
  );
}