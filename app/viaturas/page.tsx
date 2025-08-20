"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Edit, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState, useId, useEffect } from "react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { RouteGuard } from "@/components/auth/route-guard";
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
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePermissions } from "@/hooks/use-permissions";
import { useToast } from "@/hooks/use-toast";
import {
  createVehicle,
  deleteVehicle,
  getAllVehicles,
  updateVehicle,
} from "@/lib/vehicles";
import { cn } from "@/lib/utils";
import type { Vehicle } from "@/types/operational-planning";

export default function VehiclesPage() {
  const { hasPermission, logAccess } = usePermissions();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState<Omit<Vehicle, "id" | "createdAt" | "updatedAt">>({
    prefix: "",
    type: "viatura",
    model: "",
    capacity: 4,
    isActive: true,
  });

  const canEdit = hasPermission("user.manage");
  const canCreate = hasPermission("user.manage");
  const canDelete = hasPermission("user.manage");

  useEffect(() => {
    if (isFormModalOpen) {
      if (editingVehicle) {
        setFormData({
          prefix: editingVehicle.prefix,
          type: editingVehicle.type,
          model: editingVehicle.model,
          capacity: editingVehicle.capacity,
          isActive: editingVehicle.isActive,
        });
      } else {
        setFormData({
          prefix: "",
          type: "viatura",
          model: "",
          capacity: 4,
          isActive: true,
        });
      }
    }
  }, [isFormModalOpen, editingVehicle]);


  const { data: vehicles = [], isLoading, isError } = useQuery<Vehicle[]>({
    queryKey: ["vehicles"],
    queryFn: async () => {
      try {
        logAccess("LOAD_VEHICLES", "/viaturas", true);
        const data = await getAllVehicles();
        return data.map((v: Vehicle) => ({ ...v, createdAt: new Date(v.createdAt), updatedAt: new Date(v.updatedAt) }));
      } catch (error) {
        logAccess("LOAD_VEHICLES", "/viaturas", false, "Failed to load vehicles");
        toast({ title: "Erro", description: "Não foi possível carregar as viaturas.", variant: "destructive" });
        throw error;
      }
    },
  });

  const { mutate: saveVehicle, isPending: isSubmitting } = useMutation({
    mutationFn: async (data: Omit<Vehicle, "id" | "createdAt" | "updatedAt">) => {
      const isEditing = !!editingVehicle;
      if (isEditing) {
        if (!canEdit) throw new Error("Permissão para editar negada.");
        return updateVehicle(editingVehicle.id, data);
      }
      if (!canCreate) throw new Error("Permissão para criar negada.");
      return createVehicle(data);
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["vehicles"] });
      const previousVehicles =
        queryClient.getQueryData<Vehicle[]>(["vehicles"]) || [];

      if (editingVehicle) {
        logAccess(
          "UPDATE_VEHICLE_OPTIMISTIC",
          `/viaturas/${editingVehicle.id}`,
          true,
        );
        queryClient.setQueryData<Vehicle[]>(
          ["vehicles"],
          (old = []) =>
            old.map((vehicle) =>
              vehicle.id === editingVehicle.id
                ? { ...vehicle, ...newData }
                : vehicle,
            ),
        );
      } else {
        logAccess("CREATE_VEHICLE_OPTIMISTIC", `/viaturas`, true);
        const optimisticVehicle: Vehicle = {
          id: `optimistic-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          isOptimistic: true,
          ...newData,
        };
        queryClient.setQueryData<Vehicle[]>(
          ["vehicles"],
          (old = []) => [...old, optimisticVehicle],
        );
      }

      setIsFormModalOpen(false);
      return { previousVehicles };
    },
    onError: (err: Error, newData, context) => {
      queryClient.setQueryData(["vehicles"], context?.previousVehicles || []);

      const isEditing = !!editingVehicle;
      const action = isEditing ? "UPDATE_VEHICLE" : "CREATE_VEHICLE";
      const resource = isEditing ? `/viaturas/${editingVehicle?.id}` : "/viaturas";
      logAccess(action, resource, false, err.message);

      toast({
        title: "Erro ao Salvar",
        description: `A alteração foi revertida. Erro: ${err.message}`,
        variant: "destructive",
      });
    },
    onSuccess: (data, variables) => {
      const isEditing = !!editingVehicle;
      const action = isEditing ? "UPDATE_VEHICLE" : "CREATE_VEHICLE";
      const resource = isEditing ? `/viaturas/${editingVehicle?.id}` : "/viaturas";
      logAccess(action, resource, true);
      toast({
        title: "Sucesso",
        description: `Viatura ${isEditing ? "atualizada" : "criada"} com sucesso.`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });

  const { mutate: removeVehicle } = useMutation({
    mutationFn: deleteVehicle,
    onMutate: async (vehicleId: string) => {
      logAccess("DELETE_VEHICLE_OPTIMISTIC", `/viaturas/${vehicleId}`, true);
      await queryClient.cancelQueries({ queryKey: ["vehicles"] });
      const previousVehicles = queryClient.getQueryData<Vehicle[]>(["vehicles"]);
      if (previousVehicles) {
        queryClient.setQueryData(
          ["vehicles"],
          previousVehicles.filter((vehicle) => vehicle.id !== vehicleId),
        );
      }
      return { previousVehicles };
    },
    onError: (err: Error, vehicleId, context) => {
      if (context?.previousVehicles) {
        queryClient.setQueryData(["vehicles"], context.previousVehicles);
      }
      logAccess(
        "DELETE_VEHICLE_ERROR",
        `/viaturas/${vehicleId}`,
        false,
        err.message,
      );
      toast({
        title: "Exclusão falhou",
        description: "A alteração foi revertida.",
        variant: "destructive",
      });
    },
    onSuccess: (_, vehicleId) => {
      logAccess("DELETE_VEHICLE_SUCCESS", `/viaturas/${vehicleId}`, true);
      toast({
        title: "Sucesso",
        description: "Viatura excluída com sucesso.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });

  const handleCreateVehicle = () => {
    if (!canCreate) return;
    logAccess("OPEN_CREATE_VEHICLE_FORM", "/viaturas", true);
    setEditingVehicle(null);
    setIsFormModalOpen(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    if (!canEdit) return;
    logAccess("OPEN_EDIT_VEHICLE_FORM", `/viaturas/${vehicle.id}`, true);
    setEditingVehicle(vehicle);
    setIsFormModalOpen(true);
  };

  const handleSubmitVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    saveVehicle(formData);
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    if (!canDelete) {
      logAccess("DELETE_VEHICLE", `/viaturas/${vehicleId}`, false, "No delete permission");
      return;
    }
    removeVehicle(vehicleId);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "viatura": return "Viatura";
      case "moto": return "Motocicleta";
      case "van": return "Van";
      case "blindado": return "Blindado";
      default: return type;
    }
  };

  const getTypeVariant = (type: string) => {
    switch (type) {
      case "viatura": return "default";
      case "moto": return "secondary";
      case "van": return "outline";
      case "blindado": return "destructive";
      default: return "outline";
    }
  };

  const prefixId = useId();
  const typeId = useId();
  const modelId = useId();
  const capacityId = useId();
  const isActiveId = useId();

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
                  <CardDescription>Lista de todas as viaturas disponíveis para atribuição em operações.</CardDescription>
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
              ) : isError ? (
                <div className="flex items-center justify-center py-8 text-red-600">
                  Ocorreu um erro ao carregar as viaturas.
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
                        <TableRow
                          key={vehicle.id}
                          className={cn(
                            "transition-opacity",
                            vehicle.isOptimistic && "opacity-50",
                          )}
                        >
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
                                        Tem certeza que deseja excluir a viatura "{vehicle.prefix}"? Esta ação não pode ser desfeita.
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
                  {editingVehicle ? "Edite as informações da viatura." : "Preencha as informações para criar uma nova viatura."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitVehicle}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor={prefixId}>Prefixo</Label>
                    <Input id={prefixId} value={formData.prefix} onChange={(e) => setFormData({ ...formData, prefix: e.target.value })} placeholder="Ex: D-0210" required />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor={typeId}>Tipo</Label>
                    <Select value={formData.type} onValueChange={(value: "viatura" | "moto" | "van" | "blindado") => setFormData({ ...formData, type: value })}>
                      <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viatura">Viatura</SelectItem>
                        <SelectItem value="moto">Motocicleta</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                        <SelectItem value="blindado">Blindado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor={modelId}>Modelo</Label>
                    <Input id={modelId} value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} placeholder="Ex: Toyota Hilux" required />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor={capacityId}>Capacidade</Label>
                    <Input id={capacityId} type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: Number.parseInt(e.target.value, 10) || 0 })} placeholder="Número de pessoas" min="1" max="20" required />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id={isActiveId} checked={formData.isActive} onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })} />
                    <Label htmlFor={isActiveId}>Viatura ativa</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsFormModalOpen(false)}>Cancelar</Button>
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
  );
}
