"use client";

import type React from "react";

import { useEffect, useState, useId } from "react";
import { Button } from "@/components/ui/button";
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
import type { User, UserRole } from "@/types/auth";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: Omit<User, "id" | "createdAt"> & { password?: string }) => Promise<void>;
  user?: User | null;
  isLoading?: boolean;
}

export function UserFormModal({
  isOpen,
  onClose,
  onSubmit,
  user,
  isLoading,
}: UserFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "", // Add password field
    role: "user" as UserRole,
    isActive: true,
  });

  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const isActiveId = useId();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        password: "", // Password should not be pre-filled for security
      });
    } else {
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "user",
        isActive: true,
      });
    }
  }, [user]); // Removed isOpen from dependencies

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Only include password if creating a new user or if it's explicitly set for update
    const dataToSubmit = isEditing && !formData.password
      ? { ...formData, password: undefined } // Don't send empty password on edit if not changed
      : formData;
    onSubmit(dataToSubmit);
  };

  const isEditing = !!user;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Usuário" : "Novo Usuário"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edite as informações do usuário abaixo." : "Preencha as informações para criar um novo usuário."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor={nameId}>Nome</Label>
              <Input
                id={nameId}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Nome completo"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor={emailId}>Email</Label>
              <Input
                id={emailId}
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="email@empresa.com"
                required
              />
            </div>
            {!isEditing && (
              <div className="grid gap-2">
                <Label htmlFor={passwordId}>Senha</Label>
                <Input
                  id={passwordId}
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="********"
                  required={!isEditing}
                />
              </div>
            )}
            {isEditing && (
              <div className="grid gap-2">
                <Label htmlFor={passwordId}>Nova Senha (opcional)</Label>
                <Input
                  id={passwordId}
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Deixe em branco para manter a senha atual"
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="role">Perfil</Label>
              <Select
                value={formData.role}
                onValueChange={(value: UserRole) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuário</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
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
              <Label htmlFor={isActiveId}>Usuário ativo</Label>
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
  );
}

