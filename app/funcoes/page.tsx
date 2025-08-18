"use client";

import { ArrowLeft, Edit, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
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
import type { OperationalFunction } from "@/types/operational-planning";

export default function FunctionsPage() {
  const { hasPermission, logAccess } = usePermissions();
  const router = useRouter();
  const { toast } = useToast();
  const [functions, setFunctions] = useState<OperationalFunction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingFunction, setEditingFunction] =
    useState<OperationalFunction | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "apoio" as "entrada" | "apoio" | "comando" | "especializada",
    isActive: true,
  });

  const canEdit = hasPermission("user.manage"); // Apenas admins podem gerenciar funções
  const canCreate = hasPermission("user.manage");
  const canDelete = hasPermission("user.manage");

  useEffect(() => {
    loadFunctions();
  }, []);

  const loadFunctions = async () => {
    try {
      setIsLoading(true);
      logAccess("LOAD_FUNCTIONS", "/funcoes", true);
      const functionsData = await getAllFunctions();
      setFunctions(functionsData);
    } catch (error) {
      logAccess(
        "LOAD_FUNCTIONS",
        "/funcoes",
        false,
        "Failed to load functions",
      );
      toast({
        title: "Erro",
        description: "Não foi possível carregar as funções",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleSubmitFunction = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      if (editingFunction) {
        if (!canEdit) {
          logAccess(
            "UPDATE_FUNCTION",
            `/funcoes/${editingFunction.id}`,
            false,
            "No edit permission",
          );
          return;
        }
        await updateFunction(editingFunction.id, formData);
        logAccess("UPDATE_FUNCTION", `/funcoes/${editingFunction.id}`, true);
        toast({
          title: "Sucesso",
          description: "Função atualizada com sucesso",
        });
      } else {
        if (!canCreate) {
          logAccess(
            "CREATE_FUNCTION",
            "/funcoes",
            false,
            "No create permission",
          );
          return;
        }
        await createFunction(formData);
        logAccess("CREATE_FUNCTION", "/funcoes", true);
        toast({
          title: "Sucesso",
          description: "Função criada com sucesso",
        });
      }

      setIsFormModalOpen(false);
      loadFunctions();
    } catch (error) {
      const action = editingFunction ? "UPDATE_FUNCTION" : "CREATE_FUNCTION";
      const resource = editingFunction
        ? `/funcoes/${editingFunction.id}`
        : "/funcoes";
      logAccess(action, resource, false, "Failed to save function");
      toast({
        title: "Erro",
        description: "Não foi possível salvar a função",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFunction = async (functionId: string) => {
    if (!canDelete) {
      logAccess(
        "DELETE_FUNCTION",
        `/funcoes/${functionId}`,
        false,
        "No delete permission",
      );
      return;
    }

    try {
      await deleteFunction(functionId);
      logAccess("DELETE_FUNCTION", `/funcoes/${functionId}`, true);
      toast({
        title: "Sucesso",
        description: "Função excluída com sucesso",
      });
      loadFunctions();
    } catch (error) {
      logAccess(
        "DELETE_FUNCTION",
        `/funcoes/${functionId}`,
        false,
        "Failed to delete function",
      );
      toast({
        title: "Erro",
        description: "Não foi possível excluir a função",
        variant: "destructive",
      });
    }
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
                        <TableRow key={func.id}>
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
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Nome da função"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
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
                    <Label htmlFor="category">Categoria</Label>
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
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="isActive">Função ativa</Label>
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
