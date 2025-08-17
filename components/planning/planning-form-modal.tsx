"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Planning, PlanningFormData, PlanningStatus, PlanningPriority } from "@/types/planning"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { mockUsers } from "@/lib/auth-mock"

interface PlanningFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: PlanningFormData) => void
  planning?: Planning | null
  isLoading?: boolean
}

export function PlanningFormModal({ isOpen, onClose, onSubmit, planning, isLoading }: PlanningFormModalProps) {
  const [formData, setFormData] = useState<PlanningFormData>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "draft",
    priority: "medium",
    responsibleId: "",
    objectives: [""],
    resources: [""],
    budget: undefined,
  })

  const [newObjective, setNewObjective] = useState("")
  const [newResource, setNewResource] = useState("")

  useEffect(() => {
    if (planning) {
      setFormData({
        title: planning.title,
        description: planning.description,
        startDate: planning.startDate.toISOString().split("T")[0],
        endDate: planning.endDate.toISOString().split("T")[0],
        status: planning.status,
        priority: planning.priority,
        responsibleId: planning.responsibleId,
        objectives: planning.objectives.length > 0 ? planning.objectives : [""],
        resources: planning.resources.length > 0 ? planning.resources : [""],
        budget: planning.budget,
      })
    } else {
      setFormData({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        status: "draft",
        priority: "medium",
        responsibleId: "",
        objectives: [""],
        resources: [""],
        budget: undefined,
      })
    }
    setNewObjective("")
    setNewResource("")
  }, [planning, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const cleanedData = {
      ...formData,
      objectives: formData.objectives.filter((obj) => obj.trim() !== ""),
      resources: formData.resources.filter((res) => res.trim() !== ""),
    }

    onSubmit(cleanedData)
  }

  const addObjective = () => {
    if (newObjective.trim()) {
      setFormData({
        ...formData,
        objectives: [...formData.objectives.filter((obj) => obj.trim() !== ""), newObjective.trim()],
      })
      setNewObjective("")
    }
  }

  const removeObjective = (index: number) => {
    setFormData({
      ...formData,
      objectives: formData.objectives.filter((_, i) => i !== index),
    })
  }

  const addResource = () => {
    if (newResource.trim()) {
      setFormData({
        ...formData,
        resources: [...formData.resources.filter((res) => res.trim() !== ""), newResource.trim()],
      })
      setNewResource("")
    }
  }

  const removeResource = (index: number) => {
    setFormData({
      ...formData,
      resources: formData.resources.filter((_, i) => i !== index),
    })
  }

  const isEditing = !!planning

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Planejamento" : "Novo Planejamento"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edite as informações do planejamento operacional."
              : "Preencha as informações para criar um novo planejamento operacional."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Título do planejamento"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição detalhada do planejamento"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Data de Início</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">Data de Término</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: PlanningStatus) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="priority">Prioridade</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: PlanningPriority) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="critical">Crítica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="responsible">Responsável</Label>
              <Select
                value={formData.responsibleId}
                onValueChange={(value) => setFormData({ ...formData, responsibleId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o responsável" />
                </SelectTrigger>
                <SelectContent>
                  {mockUsers
                    .filter((user) => user.role === "admin" || user.role === "editor")
                    .map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.role === "admin" ? "Administrador" : "Editor"})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="budget">Orçamento (R$)</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget || ""}
                onChange={(e) =>
                  setFormData({ ...formData, budget: e.target.value ? Number(e.target.value) : undefined })
                }
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div className="grid gap-2">
              <Label>Objetivos</Label>
              <div className="space-y-2">
                {formData.objectives
                  .filter((obj) => obj.trim() !== "")
                  .map((objective, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Badge variant="outline" className="flex-1 justify-start">
                        {objective}
                      </Badge>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeObjective(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                <div className="flex gap-2">
                  <Input
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    placeholder="Adicionar objetivo"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addObjective())}
                  />
                  <Button type="button" variant="outline" onClick={addObjective}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Recursos Necessários</Label>
              <div className="space-y-2">
                {formData.resources
                  .filter((res) => res.trim() !== "")
                  .map((resource, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Badge variant="outline" className="flex-1 justify-start">
                        {resource}
                      </Badge>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeResource(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                <div className="flex gap-2">
                  <Input
                    value={newResource}
                    onChange={(e) => setNewResource(e.target.value)}
                    placeholder="Adicionar recurso"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addResource())}
                  />
                  <Button type="button" variant="outline" onClick={addResource}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : isEditing ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
