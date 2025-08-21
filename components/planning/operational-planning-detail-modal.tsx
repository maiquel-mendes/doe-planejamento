"use client";

import { getUserById } from "@/lib/user-management";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { OperationalPlanning } from "@/types/operational-planning";
import { OperationalPlanningDisplay } from "./operational-planning-display";

interface OperationalPlanningDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  planning: OperationalPlanning | null;
}

export function OperationalPlanningDetailModal({
  isOpen,
  onClose,
  planning,
}: OperationalPlanningDetailModalProps) {
  const [creatorName, setCreatorName] = useState("");

  useEffect(() => {
    if (planning?.createdBy) {
      const fetchCreator = async () => {
        try {
          const user = await getUserById(planning.createdBy);
          setCreatorName(user?.name || "Desconhecido");
        } catch (error) {
          console.error("Failed to fetch creator name:", error);
          setCreatorName("Erro ao carregar");
        }
      };
      fetchCreator();
    } else {
      setCreatorName("");
    }
  }, [planning?.createdBy]);

  if (!planning) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {planning.introduction.operationType} -{" "}
            {planning.introduction.serviceOrderNumber}
          </DialogTitle>
          <DialogDescription>
            {planning.introduction.operationDate} às{" "}
            {planning.introduction.operationTime} -{" "}
            {planning.introduction.supportUnit}
          </DialogDescription>
        </DialogHeader>


        <OperationalPlanningDisplay planning={planning} />

        {/* Metadata */}
        <div className="pt-4 border-t space-y-2">
          <div className="text-xs text-muted-foreground">
            Criado por {creatorName} em{" "}
            {planning.createdAt.toLocaleDateString("pt-BR")}
            <div className="text-xs text-muted-foreground">
              Última atualização: {planning.updatedAt.toLocaleDateString("pt-BR")}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
