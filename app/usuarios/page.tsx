"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PermissionGuard } from "@/components/auth/permission-guard";
import { RouteGuard } from "@/components/auth/route-guard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserFormModal } from "@/components/user-management/user-form-modal";
import { UserTable } from "@/components/user-management/user-table";
import { usePermissions } from "@/hooks/use-permissions";
import { useToast } from "@/hooks/use-toast";
import {
  createUser,
  deleteUser,
  getAllUsers,
  toggleUserStatus,
  updateUser,
} from "@/lib/user-management";
import type { User } from "@/types/auth";

export default function UsersPage() {
  const { logAccess } = usePermissions();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        logAccess("LOAD_USERS", "/usuarios", true);
        return await getAllUsers();
      } catch (error) {
        logAccess("LOAD_USERS", "/usuarios", false, "Failed to load users");
        toast({ title: "Erro", description: "Não foi possível carregar os usuários", variant: "destructive" });
        return [];
      }
    },
  });

  const handleCreateUser = () => {
    logAccess("OPEN_CREATE_USER_FORM", "/usuarios", true);
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    logAccess("OPEN_EDIT_USER_FORM", `/usuarios/${user.id}`, true);
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const { mutateAsync: saveUser, isPending: isSubmitting } = useMutation({
    mutationFn: async (userData: Omit<User, "id" | "createdAt"> & { password?: string }) => {
      const isEditing = !!editingUser;
      if (isEditing) {
        return updateUser(editingUser.id, userData);
      }
      if (!userData.password) {
        throw new Error("A senha é obrigatória para novos usuários.");
      }
      return createUser(userData as Omit<User, "id" | "createdAt"> & { password: string });
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const previousUsers = queryClient.getQueryData<User[]>(["users"]) || [];

      if (editingUser) {
        logAccess("UPDATE_USER_OPTIMISTIC", `/usuarios/${editingUser.id}`, true);
        queryClient.setQueryData<User[]>(
          ["users"],
          (old = []) =>
            old.map((user) =>
              user.id === editingUser.id ? { ...user, ...newData } : user,
            ),
        );
      } else {
        logAccess("CREATE_USER_OPTIMISTIC", `/usuarios`, true);
        const optimisticUser: User = {
          id: `optimistic-${Date.now()}`,
          createdAt: new Date(),
          isOptimistic: true,
          name: newData.name,
          email: newData.email,
          role: newData.role,
          isActive: newData.isActive,
        };
        queryClient.setQueryData<User[]>(
          ["users"],
          (old = []) => [...old, optimisticUser],
        );
      }

      setIsModalOpen(false);
      return { previousUsers };
    },
    onError: (err: Error, newData, context) => {
      queryClient.setQueryData(["users"], context?.previousUsers || []);

      const isEditing = !!editingUser;
      const action = isEditing ? "UPDATE_USER" : "CREATE_USER";
      const resource = isEditing ? `/usuarios/${editingUser?.id}` : "/usuarios";
      logAccess(action, resource, false, err.message);

      toast({
        title: "Erro ao Salvar",
        description: `A alteração foi revertida. Erro: ${err.message}`,
        variant: "destructive",
      });
    },
    onSuccess: (data, variables) => {
      const isEditing = !!editingUser;
      const action = isEditing ? "UPDATE_USER" : "CREATE_USER";
      const resource = isEditing ? `/usuarios/${editingUser?.id}` : "/usuarios";
      logAccess(action, resource, true);
      toast({
        title: "Sucesso",
        description: `Usuário ${isEditing ? "atualizado" : "criado"} com sucesso.`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const { mutate: toggleStatus } = useMutation({
    mutationFn: toggleUserStatus,
    onMutate: async (userId: string) => {
      logAccess("TOGGLE_USER_STATUS_OPTIMISTIC", `/usuarios/${userId}`, true);
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const previousUsers = queryClient.getQueryData<User[]>(["users"]);
      if (previousUsers) {
        queryClient.setQueryData(
          ["users"],
          previousUsers.map((user) =>
            user.id === userId ? { ...user, isActive: !user.isActive } : user,
          ),
        );
      }
      return { previousUsers };
    },
    onError: (err: Error, userId, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(["users"], context.previousUsers);
      }
      logAccess(
        "TOGGLE_USER_STATUS_ERROR",
        `/usuarios/${userId}`,
        false,
        err.message,
      );
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status. A alteração foi revertida.",
        variant: "destructive",
      });
    },
    onSuccess: (_, userId) => {
      logAccess("TOGGLE_USER_STATUS_SUCCESS", `/usuarios/${userId}`, true);
      toast({ title: "Sucesso", description: "Status do usuário atualizado" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const { mutate: removeUser } = useMutation({
    mutationFn: deleteUser,
    onMutate: async (userId: string) => {
      logAccess("DELETE_USER_OPTIMISTIC", `/usuarios/${userId}`, true);
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const previousUsers = queryClient.getQueryData<User[]>(["users"]);
      if (previousUsers) {
        queryClient.setQueryData(
          ["users"],
          previousUsers.filter((user) => user.id !== userId),
        );
      }
      return { previousUsers };
    },
    onError: (err: Error, userId, context) => {
      if (context?.previousUsers) {
        queryClient.setQueryData(["users"], context.previousUsers);
      }
      logAccess("DELETE_USER_ERROR", `/usuarios/${userId}`, false, err.message);
      toast({
        title: "Exclusão falhou",
        description: "A alteração foi revertida.",
        variant: "destructive",
      });
    },
    onSuccess: (_, userId) => {
      logAccess("DELETE_USER_SUCCESS", `/usuarios/${userId}`, true);
      toast({ title: "Sucesso", description: "Usuário excluído com sucesso" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return (
    <RouteGuard requiredPermissions={["users.view"]}>
      <div className="min-h-screen bg-muted/30 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" onClick={() => router.push("/")} size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-primary">Gerenciamento de Usuários</h1>
              <p className="text-muted-foreground">Gerencie usuários e suas permissões</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Usuários do Sistema</CardTitle>
                  <CardDescription>Lista de todos os usuários cadastrados no sistema</CardDescription>
                </div>
                <PermissionGuard permission="users.create">
                  <Button onClick={handleCreateUser}>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Usuário
                  </Button>
                </PermissionGuard>
              </div>
            </CardHeader>
            <CardContent>
              <UserTable
                users={users}
                onEditUser={handleEditUser}
                onToggleStatus={toggleStatus}
                onDeleteUser={removeUser}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>

          <UserFormModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={saveUser}
            user={editingUser}
            isLoading={isSubmitting}
          />
        </div>
      </div>
    </RouteGuard>
  );
}