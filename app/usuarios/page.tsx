"use client"

import { useState, useEffect } from "react"
import { RouteGuard } from "@/components/auth/route-guard"
import { PermissionGuard } from "@/components/auth/permission-guard"
import { usePermissions } from "@/hooks/use-permissions"
import type { User } from "@/types/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserTable } from "@/components/user-management/user-table"
import { UserFormModal } from "@/components/user-management/user-form-modal"
import { getAllUsers, createUser, updateUser, toggleUserStatus, deleteUser } from "@/lib/user-management"
import { Plus, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function UsersPage() {
  const { logAccess } = usePermissions()
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load users
  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setIsLoading(true)
      logAccess("LOAD_USERS", "/usuarios", true)
      const usersData = await getAllUsers()
      setUsers(usersData)
    } catch (error) {
      logAccess("LOAD_USERS", "/usuarios", false, "Failed to load users")
      toast({
        title: "Erro",
        description: "Não foi possível carregar os usuários",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateUser = () => {
    logAccess("OPEN_CREATE_USER_FORM", "/usuarios", true)
    setEditingUser(null)
    setIsModalOpen(true)
  }

  const handleEditUser = (user: User) => {
    logAccess("OPEN_EDIT_USER_FORM", `/usuarios/${user.id}`, true)
    setEditingUser(user)
    setIsModalOpen(true)
  }

  const handleSubmitUser = async (userData: any) => {
    try {
      setIsSubmitting(true)

      if (editingUser) {
        // Update existing user
        await updateUser(editingUser.id, userData)
        logAccess("UPDATE_USER", `/usuarios/${editingUser.id}`, true)
        toast({
          title: "Sucesso",
          description: "Usuário atualizado com sucesso",
        })
      } else {
        // Create new user
        await createUser(userData)
        logAccess("CREATE_USER", "/usuarios", true)
        toast({
          title: "Sucesso",
          description: "Usuário criado com sucesso",
        })
      }

      setIsModalOpen(false)
      loadUsers()
    } catch (error) {
      const action = editingUser ? "UPDATE_USER" : "CREATE_USER"
      const resource = editingUser ? `/usuarios/${editingUser.id}` : "/usuarios"
      logAccess(action, resource, false, "Failed to save user")
      toast({
        title: "Erro",
        description: "Não foi possível salvar o usuário",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleStatus = async (userId: string) => {
    try {
      await toggleUserStatus(userId)
      logAccess("TOGGLE_USER_STATUS", `/usuarios/${userId}`, true)
      toast({
        title: "Sucesso",
        description: "Status do usuário atualizado",
      })
      loadUsers()
    } catch (error) {
      logAccess("TOGGLE_USER_STATUS", `/usuarios/${userId}`, false, "Failed to toggle user status")
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId)
      logAccess("DELETE_USER", `/usuarios/${userId}`, true)
      toast({
        title: "Sucesso",
        description: "Usuário excluído com sucesso",
      })
      loadUsers()
    } catch (error) {
      logAccess("DELETE_USER", `/usuarios/${userId}`, false, "Failed to delete user")
      toast({
        title: "Erro",
        description: "Não foi possível excluir o usuário",
        variant: "destructive",
      })
    }
  }

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
                onToggleStatus={handleToggleStatus}
                onDeleteUser={handleDeleteUser}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>

          <UserFormModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmitUser}
            user={editingUser}
            isLoading={isSubmitting}
          />
        </div>
      </div>
    </RouteGuard>
  )
}
