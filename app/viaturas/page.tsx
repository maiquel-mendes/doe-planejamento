"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { RouteGuard } from "@/components/auth/route-guard"
import { PermissionGuard } from "@/components/auth/permission-guard"
import { usePermissions } from "@/hooks/use-permissions"
import type { Vehicle } from "@/types/operational-planning"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, ArrowLeft, Edit, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { getAllVehicles, createVehicle, updateVehicle, deleteVehicle } from "@/lib/vehicles"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

export default function VehiclesPage() {
  const { hasPermission, logAccess } = usePermissions()
  const router = useRouter()
  const { toast } = useToast()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    prefix: "",
    type: "viatura" as "viatura" | "moto" | "van" | "blindado",
    model: "",
    capacity: 4,
    isActive: true,
  })

  const canEdit = hasPermission("user.manage") // Apenas admins podem gerenciar viaturas
  const canCreate = hasPermission("user.manage")
  const canDelete = hasPermission("user.manage")

  useEffect(() => {
    loadVehicles()
  }, [])

  const loadVehicles = async () => {
    try {
      setIsLoading(true)
      logAccess("LOAD_VEHICLES", "/viaturas", true)
      const vehiclesData = await getAllVehicles()
      setVehicles(vehiclesData)
    } catch (error) {
      logAccess("LOAD_VEHICLES", "/viaturas", false, "Failed to load vehicles")
      toast({
        title: "Erro",
        description: "Não foi possível carregar as viaturas",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateVehicle = () => {
    if (!canCreate) return
    logAccess("OPEN_CREATE_VEHICLE_FORM", "/viaturas", true)
    setEditingVehicle(null)
    setFormData({
      prefix: "",
      type: "viatura",
      model: "",
      capacity: 4,
      isActive: true,
    })
    setIsFormModalOpen(true)
  }

  const handleEditVehicle = (vehicle: Vehicle) => {
    if (!canEdit) return
    logAccess("OPEN_EDIT_VEHICLE_FORM", `/viaturas/${vehicle.id}`, true)
    setEditingVehicle(vehicle)
    setFormData({
      prefix: vehicle.prefix,
      type: vehicle.type,
      model: vehicle.model,
      capacity: vehicle.capacity,
      isActive: vehicle.isActive,
    })
    setIsFormModalOpen(true)
  }

  const handleSubmitVehicle = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsSubmitting(true)

      if (editingVehicle) {
        if (!canEdit) {
          logAccess("UPDATE_VEHICLE", `/viaturas/${editingVehicle.id}`, false, "No edit permission")
          return
        }
        await updateVehicle(editingVehicle.id, formData)
        logAccess("UPDATE_VEHICLE", `/viaturas/${editingVehicle.id}`, true)
        toast({
          title: "Sucesso",
          description: "Viatura atualizada com sucesso",
        })
      } else {
        if (!canCreate) {
          logAccess("CREATE_VEHICLE", "/viaturas", false, "No create permission")
          return
        }
        await createVehicle(formData)
        logAccess("CREATE_VEHICLE", "/viaturas", true)
        toast({
          title: "Sucesso",
          description: "Viatura criada com sucesso",
        })
      }

      setIsFormModalOpen(false)
      loadVehicles()
    } catch (error) {
      const action = editingVehicle ? "UPDATE_VEHICLE" : "CREATE_VEHICLE"
      const resource = editingVehicle ? `/viaturas/${editingVehicle.id}` : "/viaturas"
      logAccess(action, resource, false, "Failed to save vehicle")
      toast({
        title: "Erro",
        description: "Não foi possível salvar a viatura",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!canDelete) {
      logAccess("DELETE_VEHICLE", `/viaturas/${vehicleId}`, false, "No delete permission")
      return
    }

    try {
      await deleteVehicle(vehicleId)
      logAccess("DELETE_VEHICLE", `/viaturas/${vehicleId}`, true)
      toast({
        title: "Sucesso",
        description: "Viatura excluída com sucesso",
      })
      loadVehicles()
    } catch (error) {
      logAccess("DELETE_VEHICLE", `/viaturas/${vehicleId}`, false, "Failed to delete vehicle")
      toast({
        title: "Erro",
        description: "Não foi possível excluir a viatura",
        variant: "destructive",
      })
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "viatura":
        return "Viatura"
      case "moto":
        return "Motocicleta"
      case "van":
        return "Van"
      case "blindado":
        return "Blindado"
      default:
        return type
    }
  }

  const getTypeVariant = (type: string) => {
    switch (type) {
      case "viatura":
        return "default"
      case "moto":
        return "secondary"
      case "van":
        return "outline"
      case "blindado":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <RouteGuard requiredPermissions={["user.manage"]}>
      <div className="min-h-screen bg-muted/30 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" onClick={() => router.push("/")} size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-primary">Viaturas</h1>
              <p className="text-muted-foreground">Gerencie as viaturas disponíveis para operações</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Viaturas</CardTitle>
                  <CardDescription>
                    Lista de todas as viaturas disponíveis para atribuição em operações.
                  </CardDescription>
                </div>
                <PermissionGuard permission="user.manage">
                  <Button onClick={handleCreateVehicle}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Viatura
                  </Button>
                </PermissionGuard>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-muted-foreground">Carregando viaturas...</div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Prefixo</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Modelo</TableHead>
                        <TableHead>Capacidade</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vehicles.map((vehicle) => (
                        <TableRow key={vehicle.id}>
                          <TableCell className="font-medium">{vehicle.prefix}</TableCell>
                          <TableCell>
                            <Badge variant={getTypeVariant(vehicle.type)}>{getTypeLabel(vehicle.type)}</Badge>
                          </TableCell>
                          <TableCell>{vehicle.model}</TableCell>
                          <TableCell>{vehicle.capacity} pessoas</TableCell>
                          <TableCell>
                            <Badge variant={vehicle.isActive ? "default" : "secondary"}>
                              {vehicle.isActive ? "Ativa" : "Inativa"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              {canEdit && (
                                <Button variant="outline" size="sm" onClick={() => handleEditVehicle(vehicle)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              )}
                              {canDelete && (
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
                                        Tem certeza que deseja excluir a viatura "{vehicle.prefix}"? Esta ação não pode
                                        ser desfeita.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleDeleteVehicle(vehicle.id)}>
                                        Excluir
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          <Dialog open={isFormModalOpen} onOpenChange={setIsFormModalOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingVehicle ? "Editar Viatura" : "Nova Viatura"}</DialogTitle>
                <DialogDescription>
                  {editingVehicle
                    ? "Edite as informações da viatura."
                    : "Preencha as informações para criar uma nova viatura."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitVehicle}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="prefix">Prefixo</Label>
                    <Input
                      id="prefix"
                      value={formData.prefix}
                      onChange={(e) => setFormData({ ...formData, prefix: e.target.value })}
                      placeholder="Ex: D-0210"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: "viatura" | "moto" | "van" | "blindado") =>
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viatura">Viatura</SelectItem>
                        <SelectItem value="moto">Motocicleta</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                        <SelectItem value="blindado">Blindado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="model">Modelo</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      placeholder="Ex: Toyota Hilux"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="capacity">Capacidade</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: Number.parseInt(e.target.value) || 0 })}
                      placeholder="Número de pessoas"
                      min="1"
                      max="20"
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="isActive">Viatura ativa</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsFormModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Salvando..." : editingVehicle ? "Salvar" : "Criar"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </RouteGuard>
  )
}
