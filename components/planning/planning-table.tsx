"use client"

import type { Planning } from "@/types/planning"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Edit, Eye, Trash2 } from "lucide-react"

interface PlanningTableProps {
  plannings: Planning[]
  onViewPlanning: (planning: Planning) => void
  onEditPlanning: (planning: Planning) => void
  onDeletePlanning: (planningId: string) => void
  canEdit: boolean
  isLoading?: boolean
}

export function PlanningTable({
  plannings,
  onViewPlanning,
  onEditPlanning,
  onDeletePlanning,
  canEdit,
  isLoading,
}: PlanningTableProps) {
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "completed":
        return "secondary"
      case "draft":
        return "outline"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "Ativo"
      case "completed":
        return "Concluído"
      case "draft":
        return "Rascunho"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "critical":
        return "Crítica"
      case "high":
        return "Alta"
      case "medium":
        return "Média"
      case "low":
        return "Baixa"
      default:
        return priority
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Carregando planejamentos...</div>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Responsável</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Progresso</TableHead>
            <TableHead>Período</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plannings.map((planning) => (
            <TableRow key={planning.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{planning.title}</div>
                  <div className="text-sm text-muted-foreground truncate max-w-xs">{planning.description}</div>
                </div>
              </TableCell>
              <TableCell>{planning.responsibleName}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(planning.status)}>{getStatusLabel(planning.status)}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={getPriorityBadgeVariant(planning.priority)}>
                  {getPriorityLabel(planning.priority)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={planning.progress} className="w-16" />
                  <span className="text-sm text-muted-foreground">{planning.progress}%</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{planning.startDate.toLocaleDateString("pt-BR")}</div>
                  <div className="text-muted-foreground">até {planning.endDate.toLocaleDateString("pt-BR")}</div>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => onViewPlanning(planning)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  {canEdit && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => onEditPlanning(planning)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o planejamento "{planning.title}"? Esta ação não pode ser
                              desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDeletePlanning(planning.id)}>Excluir</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
