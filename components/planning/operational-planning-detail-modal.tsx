"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

  if (!planning) return null;

  const creatorName = planning.createdBy?.name || "Desconhecido";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {planning.introduction?.operationType || 'N/A'} -{" "}
            {planning.introduction?.serviceOrderNumber || 'N/A'}
          </DialogTitle>
          <DialogDescription>
            {planning.introduction?.operationDate || 'N/A'} às{" "}
            {planning.introduction?.operationTime || 'N/A'} -{" "}
            {planning.introduction?.supportUnit || 'N/A'}
          </DialogDescription>
        </DialogHeader>

        <OperationalPlanningDisplay planning={planning} />

        {/* Metadata */}
        <div className="pt-4 border-t space-y-2">
          <div className="text-xs text-muted-foreground">
            Criado por {creatorName} em{" "}
            {new Date(planning.createdAt).toLocaleDateString("pt-BR")}
            <div className="text-xs text-muted-foreground">
              Última atualização: {new Date(planning.updatedAt).toLocaleDateString("pt-BR")}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}