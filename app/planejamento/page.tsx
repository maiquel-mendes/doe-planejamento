"use client"

import { useState, useEffect } from "react"
import { RouteGuard } from "@/components/auth/route-guard"
import { PermissionGuard } from "@/components/auth/permission-guard"
import { usePermissions } from "@/hooks/use-permissions"
import type { Planning } from "@/types/planning"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlanningTable } from "@/components/planning/planning-table"
import { OperationalPlanningFormModal } from "@/components/planning/operational-planning-form-modal"
import { PlanningDetailModal } from "@/components/planning/planning-detail-modal"
import { getAllPlannings, createPlanning, updatePlanning, deletePlanning } from "@/lib/planning-management"
import { Plus, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function PlanningPage() {
  const { user, hasPermission, logAccess } = usePermissions()
  const router = useRouter()
  const { toast } = useToast()
  const [plannings, setPlannings] = useState<Planning[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [editingPlanning, setEditingPlanning] = useState<Planning | null>(null)
  const [viewingPlanning, setViewingPlanning] = useState<Planning | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canEdit = hasPermission("planning.edit")
  const canCreate = hasPermission("planning.create")
  const canDelete = hasPermission("planning.delete")

  // Load plannings
  useEffect(() => {
    loadPlannings()
  }, [])

  const loadPlannings = async () => {
    try {
      setIsLoading(true)
      logAccess("LOAD_PLANNINGS", "/planejamento", true)
      const planningsData = await getAllPlannings()
      setPlannings(planningsData)
    } catch (error) {
      logAccess("LOAD_PLANNINGS", "/planejamento", false, "Failed to load plannings")
      toast({
        title: "Erro",
        description: "Não foi possível carregar os planejamentos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePlanning = () => {
    if (!canCreate) return
    logAccess("OPEN_CREATE_PLANNING_FORM", "/planejamento", true)
    setEditingPlanning(null)
    setIsFormModalOpen(true)
  }

  const handleEditPlanning = (planning: Planning) => {
    if (!canEdit) return
    logAccess("OPEN_EDIT_PLANNING_FORM", `/planejamento/${planning.id}`, true)
    setEditingPlanning(planning)
    setIsFormModalOpen(true)
  }

  const handleViewPlanning = (planning: Planning) => {
    logAccess("VIEW_PLANNING", `/planejamento/${planning.id}`, true)
    setViewingPlanning(planning)
    setIsDetailModalOpen(true)
  }

  const handleSubmitPlanning = async (data: any) => {
    if (!user) return

    try {
      setIsSubmitting(true)

      if (editingPlanning) {
        // Update existing planning
        if (!canEdit) {
          logAccess("UPDATE_PLANNING", `/planejamento/${editingPlanning.id}`, false, "No edit permission")
          return
        }
        await updatePlanning(editingPlanning.id, data)
        logAccess("UPDATE_PLANNING", `/planejamento/${editingPlanning.id}`, true)
        toast({
          title: "Sucesso",
          description: "Planejamento atualizado com sucesso",
        })
      } else {
        // Create new planning
        if (!canCreate) {
          logAccess("CREATE_PLANNING", "/planejamento", false, "No create permission")
          return
        }
        await createPlanning(data, user.name)
        logAccess("CREATE_PLANNING", "/planejamento", true)
        toast({
          title: "Sucesso",
          description: "Planejamento criado com sucesso",
        })
      }

      setIsFormModalOpen(false)
      loadPlannings()
    } catch (error) {
      const action = editingPlanning ? "UPDATE_PLANNING" : "CREATE_PLANNING"
      const resource = editingPlanning ? `/planejamento/${editingPlanning.id}` : "/planejamento"
      logAccess(action, resource, false, "Failed to save planning")
      toast({
        title: "Erro",
        description: "Não foi possível salvar o planejamento",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeletePlanning = async (planningId: string) => {
    if (!canDelete) {
      logAccess("DELETE_PLANNING", `/planejamento/${planningId}`, false, "No delete permission")
      return
    }

    try {
      await deletePlanning(planningId)
      logAccess("DELETE_PLANNING", `/planejamento/${planningId}`, true)
      toast({
        title: "Sucesso",
        description: "Planejamento excluído com sucesso",
      })
      loadPlannings()
    } catch (error) {
      logAccess("DELETE_PLANNING", `/planejamento/${planningId}`, false, "Failed to delete planning")
      toast({
        title: "Erro",
        description: "Não foi possível excluir o planejamento",
        variant: "destructive",
      })
    }
  }

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
                onViewPlanning={handleViewPlanning}
                onEditPlanning={handleEditPlanning}
                onDeletePlanning={handleDeletePlanning}
                canEdit={canEdit}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>

          <OperationalPlanningFormModal
            isOpen={isFormModalOpen}
            onClose={() => setIsFormModalOpen(false)}
            onSubmit={handleSubmitPlanning}
            planning={editingPlanning}
            isLoading={isSubmitting}
          />

          <PlanningDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            planning={viewingPlanning}
          />
        </div>
      </div>
    </RouteGuard>
  )
}
