"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Edit, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState, useId } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { usePermissions } from "@/hooks/use-permissions";
import { useToast } from "@/hooks/use-toast";
import {
  createFunction,
  deleteFunction,
  getAllFunctions,
  updateFunction,
} from "@/lib/operational-functions";
import { cn } from "@/lib/utils";
import type { OperationalFunction } from "@/types/operational-planning";

export default function FunctionsPage() {
  const { hasPermission, logAccess } = usePermissions();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingFunction, setEditingFunction] =
    useState<OperationalFunction | null>(null);
  const [formData, setFormData] = useState<
    Omit<OperationalFunction, "id" | "createdAt" | "updatedAt"> & {
      id?: string;
    }
  >({
    name: "",
    description: "",
    category: "apoio",
    isActive: true,
  });

  const canEdit = hasPermission("user.manage");
  const canCreate = hasPermission("user.manage");
  const canDelete = hasPermission("user.manage");

  const {
    data: functions = [],
    isLoading,
    isError,
  } = useQuery<OperationalFunction[]>({
    queryKey: ["functions"],
    queryFn: async () => {
      logAccess("LOAD_FUNCTIONS", "/funcoes", true);
      try {
        const data = await getAllFunctions();
        return data.map((f: any) => ({
          ...f,
          createdAt: new Date(f.createdAt),
          updatedAt: new Date(f.updatedAt),
        }));
      } catch (error) {
        logAccess(
          "LOAD_FUNCTIONS",
          "/funcoes",
          false,
          "Failed to load functions",
        );
        toast({
          title: "Erro",
          description: "Não foi possível carregar as funções.",
          variant: "destructive",
        });
        throw error; // Re-throw to let React Query handle the error state
      }
    },
  });

  const { mutate: saveFunction, isPending: isSubmitting } = useMutation({
    mutationFn: async (
      data: Omit<OperationalFunction, "id" | "createdAt" | "updatedAt">,
    ) => {
      const isEditing = !!editingFunction;
      if (isEditing) {
        if (!canEdit) throw new Error("Permissão para editar negada.");
        return updateFunction(editingFunction.id, data);
      }
      if (!canCreate) throw new Error("Permissão para criar negada.");
      return createFunction(data);
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["functions"] });
      const previousFunctions =
        queryClient.getQueryData<OperationalFunction[]>(["functions"]) || [];

      if (editingFunction) {
        logAccess(
          "UPDATE_FUNCTION_OPTIMISTIC",
          `/funcoes/${editingFunction.id}`,
          true,
        );
        queryClient.setQueryData<OperationalFunction[]>(
          ["functions"],
          (old = []) =>
            old.map((func) =>
              func.id === editingFunction.id ? { ...func, ...newData } : func,
            ),
        );
      } else {
        logAccess("CREATE_FUNCTION_OPTIMISTIC", `/funcoes`, true);
        const optimisticFunction: OperationalFunction = {
          id: `optimistic-${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          isOptimistic: true,
          ...newData,
        };
        queryClient.setQueryData<OperationalFunction[]>(
          ["functions"],
          (old = []) => [...old, optimisticFunction],
        );
      }

      setIsFormModalOpen(false);
      return { previousFunctions };
    },
    onError: (err: Error, newData, context) => {
      queryClient.setQueryData(["functions"], context?.previousFunctions || []);

      const isEditing = !!editingFunction;
      const action = isEditing ? "UPDATE_FUNCTION" : "CREATE_FUNCTION";
      const resource = isEditing ? `/funcoes/${editingFunction?.id}` : "/funcoes";
      logAccess(action, resource, false, err.message);

      toast({
        title: "Erro ao Salvar",
        description: `A alteração foi revertida. Erro: ${err.message}`,
        variant: "destructive",
      });
    },
    onSuccess: (data, variables) => {
      const isEditing = !!editingFunction;
      const action = isEditing ? "UPDATE_FUNCTION" : "CREATE_FUNCTION";
      const resource = isEditing ? `/funcoes/${editingFunction?.id}` : "/funcoes";
      logAccess(action, resource, true);
      toast({
        title: "Sucesso",
        description: `Função ${
          isEditing ? "atualizada" : "criada"
        } com sucesso.`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["functions"] });
    },
  });

  const { mutate: removeFunction } = useMutation({
    mutationFn: deleteFunction,
    onMutate: async (functionId: string) => {
      logAccess("DELETE_FUNCTION_OPTIMISTIC", `/funcoes/${functionId}`, true);
      await queryClient.cancelQueries({ queryKey: ["functions"] });

      const previousFunctions = queryClient.getQueryData<OperationalFunction[]>([
        "functions",
      ]);

      if (previousFunctions) {
        queryClient.setQueryData(
          ["functions"],
          previousFunctions.filter((func) => func.id !== functionId),
        );
      }

      return { previousFunctions };
    },
    onError: (err: Error, functionId, context) => {
      if (context?.previousFunctions) {
        queryClient.setQueryData(["functions"], context.previousFunctions);
      }
      logAccess(
        "DELETE_FUNCTION_ERROR",
        `/funcoes/${functionId}`,
        false,
        err.message,
      );
      toast({
        title: "Exclusão falhou",
        description: "A alteração foi revertida.",
        variant: "destructive",
      });
    },
    onSuccess: (_, functionId) => {
      logAccess("DELETE_FUNCTION_SUCCESS", `/funcoes/${functionId}`, true);
      toast({
        title: "Sucesso",
        description: "Função excluída com sucesso.",
      });
    },
    onSettled: (data, error, functionId) => {
      queryClient.invalidateQueries({ queryKey: ["functions"] });
    },
  });

  const handleCreateFunction = () => {
    if (!canCreate) return;
    logAccess("OPEN_CREATE_FUNCTION_FORM", "/funcoes", true);
    setEditingFunction(null);
    setFormData({
      name: "",
      description: "",
      category: "apoio",
      isActive: true,
    });
    setIsFormModalOpen(true);
  };

  const handleEditFunction = (func: OperationalFunction) => {
    if (!canEdit) return;
    logAccess("OPEN_EDIT_FUNCTION_FORM", `/funcoes/${func.id}`, true);
    setEditingFunction(func);
    setFormData({
      name: func.name,
      description: func.description,
      category: func.category,
      isActive: func.isActive,
    });
    setIsFormModalOpen(true);
  };

  const handleSubmitFunction = (e: React.FormEvent) => {
    e.preventDefault();
    saveFunction(formData);
  };

  const handleDeleteFunction = (functionId: string) => {
    if (!canDelete) {
      logAccess(
        "DELETE_FUNCTION",
        `/funcoes/${functionId}`,
        false,
        "No delete permission",
      );
      return;
    }
    removeFunction(functionId);
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "entrada":
        return "Entrada";
      case "apoio":
        return "Apoio";
      case "comando":
        return "Comando";
      case "especializada":
        return "Especializada";
      default:
        return category;
    }
  };

  const getCategoryVariant = (category: string) => {
    switch (category) {
      case "entrada":
        return "destructive";
      case "apoio":
        return "secondary";
      case "comando":
        return "default";
      case "especializada":
        return "outline";
      default:
        return "outline";
    }
  };

  const nameId = useId();
  const descriptionId = useId();
  const categoryId = useId();
  const isActiveId = useId();

  return (
    <RouteGuard requiredPermissions={["user.manage"]}>
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
                Funções Operacionais
              </h1>
              <p className="text-muted-foreground">
                Gerencie as funções disponíveis para operações
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Funções</CardTitle>
                  <CardDescription>
                    Lista de todas as funções operacionais disponíveis para
                    atribuição em operações.
                  </CardDescription>
                </div>
                <PermissionGuard permission="user.manage">
                  <Button onClick={handleCreateFunction}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Função
                  </Button>
                </PermissionGuard>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-muted-foreground">
                    Carregando funções...
                  </div>
                </div>
              ) : isError ? (
                <div className="flex items-center justify-center py-8 text-red-600">
                  Ocorreu um erro ao carregar as funções.
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {functions.map((func) => (
                        <TableRow
                          key={func.id}
                          className={cn(
                            "transition-opacity",
                            func.isOptimistic && "opacity-50",
                          )}
                        >
                          <TableCell className="font-medium">
                            {func.name}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {func.description}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getCategoryVariant(func.category)}>
                              {getCategoryLabel(func.category)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={func.isActive ? "default" : "secondary"}
                            >
                              {func.isActive ? "Ativa" : "Inativa"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              {canEdit && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditFunction(func)}
                                >
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
                                      <AlertDialogTitle>
                                        Confirmar exclusão
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Tem certeza que deseja excluir a função
                                        "{func.name}"? Esta ação não pode ser
                                        desfeita.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancelar
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          handleDeleteFunction(func.id)
                                        }
                                      >
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
                <DialogTitle>
                  {editingFunction ? "Editar Função" : "Nova Função"}
                </DialogTitle>
                <DialogDescription>
                  {editingFunction
                    ? "Edite as informações da função operacional."
                    : "Preencha as informações para criar uma nova função operacional."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitFunction}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor={nameId}>Nome</Label>
                    <Input
                      id={nameId}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Nome da função"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor={descriptionId}>Descrição</Label>
                    <Textarea
                      id={descriptionId}
                      value={formData.description || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Descrição da função"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor={categoryId}>Categoria</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(
                        value:
                          | "entrada"
                          | "apoio"
                          | "comando"
                          | "especializada",
                      ) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entrada">Entrada</SelectItem>
                        <SelectItem value="apoio">Apoio</SelectItem>
                        <SelectItem value="comando">Comando</SelectItem>
                        <SelectItem value="especializada">
                          Especializada
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id={isActiveId}
                      checked={formData.isActive}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, isActive: checked })
                      }
                    />
                    <Label htmlFor={isActiveId}>Função ativa</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsFormModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? "Salvando..."
                      : editingFunction
                        ? "Salvar"
                        : "Criar"}
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