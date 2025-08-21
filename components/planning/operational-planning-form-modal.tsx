import { Upload } from "lucide-react";
import { useCallback, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type {
  OperationalPlanning,
} from "@/types/operational-planning";
import { useOperationalPlanningForm } from "@/hooks/use-operational-planning-form";
import { usePlanningSelectData } from "@/hooks/use-planning-select-data";
import { IntroductionFormSection } from "./form-sections/introduction-form-section";
import { TargetsFormSection } from "./form-sections/targets-form-section";
import { FunctionsFormSection } from "./form-sections/functions-form-section";
import { ScheduleFormSection } from "./form-sections/schedule-form-section";
import { ComplementaryFormSection } from "./form-sections/complementary-form-section";

interface OperationalPlanningFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OperationalPlanning) => void;
  planning?: OperationalPlanning | null;
  isLoading?: boolean;
}

export function OperationalPlanningFormModal({
  isOpen,
  onClose,
  onSubmit,
  planning,
  isLoading,
}: OperationalPlanningFormModalProps) {
  const { users, functions, vehicles, isLoading: isSelectDataLoading } = usePlanningSelectData();
  const { toast } = useToast();

  const {
    formData,
    setFormData,
    newTarget,
    setNewTarget,
    newRoute,
    setNewRoute,
    newLocation,
    setNewLocation,
    newAssignment,
    setNewAssignment,
    newScheduleItem,
    setNewScheduleItem,
    newMeasure,
    setNewMeasure,
    newSearchObject,
    setNewSearchObject,
    addTarget,
    removeTarget,
    addAssignment,
    removeAssignment,
    updateFunctionAssignment,
    addRoute,
    removeRoute,
    addLocation,
    removeLocation,
    addSchedule,
    removeSchedule,
    addMeasure,
    removeMeasure,
    addSearchObject,
    removeSearchObject,
    handleMedicalChange,
  } = useOperationalPlanningForm({ planning, users, functions, vehicles });

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  }, [onSubmit, formData]);

  const isEditing = !!planning;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? "Editar Planejamento Operacional"
              : "Novo Planejamento Operacional"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edite as informações do planejamento operacional."
              : "Preencha as informações para criar um novo planejamento operacional."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="introducao" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="introducao">Introdução</TabsTrigger>
              <TabsTrigger value="alvos">Alvos</TabsTrigger>
              <TabsTrigger value="funcoes">Funções</TabsTrigger>
              <TabsTrigger value="horarios">Horários</TabsTrigger>
              <TabsTrigger value="complementares">Complementares</TabsTrigger>
            </TabsList>

            <div className="mt-4">
              {/* Aba Introdução */}
              <TabsContent value="introducao" className="space-y-4">
                <IntroductionFormSection
                  introduction={formData.introduction}
                  onFieldChange={(field, value) =>
                    setFormData((prev) => ({
                      ...prev,
                      introduction: { ...prev.introduction, [field]: value },
                    }))
                  }
                />
              </TabsContent>

              {/* Aba Alvos */}
              <TabsContent value="alvos" className="space-y-4">
                <TargetsFormSection
                  targets={formData.targets}
                  newTarget={newTarget}
                  setNewTarget={setNewTarget}
                  addTarget={addTarget}
                  removeTarget={removeTarget}
                />

              </TabsContent>

              {/* Aba Funções */}
              <TabsContent value="funcoes" className="space-y-4">
                <FunctionsFormSection
                  assignments={formData.assignments}
                  newAssignment={newAssignment}
                  setNewAssignment={setNewAssignment}
                  addAssignment={addAssignment}
                  removeAssignment={removeAssignment}
                  updateFunctionAssignment={updateFunctionAssignment}
                  users={users}
                  functions={functions}
                  vehicles={vehicles}
                  showToast={toast}
                />
              </TabsContent>

              {/* Aba Horários */}
              <TabsContent value="horarios" className="space-y-4">
                <ScheduleFormSection
                  schedule={formData.schedule}
                  newScheduleItem={newScheduleItem}
                  setNewScheduleItem={setNewScheduleItem}
                  addSchedule={addSchedule}
                  removeSchedule={removeSchedule}
                  communications={formData.communications}
                  onCommunicationsChange={(field, value) =>
                    setFormData((prev) => ({
                      ...prev,
                      communications: { ...prev.communications, [field]: value },
                    }))
                  }
                />
              </TabsContent>

              {/* Aba Complementares */}
              <TabsContent value="complementares" className="space-y-4">
                <ComplementaryFormSection
                  peculiarities={formData.peculiarities}
                  newSearchObject={newSearchObject}
                  setNewSearchObject={setNewSearchObject}
                  addSearchObject={addSearchObject}
                  removeSearchObject={removeSearchObject}
                  medical={formData.medical}
                  handleMedicalChange={(field, value) =>
                    setFormData((prev) => ({
                      ...prev,
                      medical: { ...prev.medical, [field]: value },
                    }))
                  }
                  complementaryMeasures={formData.complementaryMeasures}
                  newMeasure={newMeasure}
                  setNewMeasure={setNewMeasure}
                  addMeasure={addMeasure}
                  removeMeasure={removeMeasure}
                  routes={formData.routes}
                  newRoute={newRoute}
                  setNewRoute={setNewRoute}
                  addRoute={addRoute}
                  removeRoute={removeRoute}
                  locations={formData.locations}
                  newLocation={newLocation}
                  setNewLocation={setNewLocation}
                  addLocation={addLocation}
                  removeLocation={removeLocation}
                  />
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isSelectDataLoading}
            >
              {isLoading || isSelectDataLoading ? "Salvando..." : isEditing ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}