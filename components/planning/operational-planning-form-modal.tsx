import { FormProvider } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { OperationalPlanning } from "@/types/operational-planning";
import { useOperationalPlanningForm, PlanningFormData } from "@/hooks/use-operational-planning-form";
import { usePlanningSelectData } from "@/hooks/use-planning-select-data";

// Import all refactored form sections
import { IntroductionFormSection } from "./form-sections/introduction-form-section";
import { TargetsFormSection } from "./form-sections/targets-form-section";
import { FunctionsFormSection } from "./form-sections/functions-form-section";
import { ScheduleFormSection } from "./form-sections/schedule-form-section";
import { DetailsFormSection } from "./form-sections/details-form-section";

interface OperationalPlanningFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PlanningFormData) => void;
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
  const { form } = useOperationalPlanningForm({ planning });
  const { users, functions, vehicles, locations, isLoading: isSelectDataLoading } = usePlanningSelectData();

  const handleFormSubmit = (data: PlanningFormData) => {
    onSubmit(data);
  };

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

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            <Tabs defaultValue="introducao" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="introducao">Introdução</TabsTrigger>
                <TabsTrigger value="alvos">Alvos</TabsTrigger>
                <TabsTrigger value="funcoes">Funções</TabsTrigger>
                <TabsTrigger value="horarios">Horários</TabsTrigger>
                <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
              </TabsList>

              <div className="mt-4">
                <TabsContent value="introducao">
                  <IntroductionFormSection />
                </TabsContent>
                <TabsContent value="alvos">
                  <TargetsFormSection locations={locations} />
                </TabsContent>
                <TabsContent value="funcoes">
                  <FunctionsFormSection users={users} functions={functions} vehicles={vehicles} />
                </TabsContent>
                <TabsContent value="horarios">
                  <ScheduleFormSection />
                </TabsContent>
                <TabsContent value="detalhes">
                  <DetailsFormSection locations={locations} vehicles={vehicles} users={users} functions={functions} />
                </TabsContent>
              </div>
            </Tabs>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading || isSelectDataLoading}>
                {isLoading || isSelectDataLoading ? "Salvando..." : isEditing ? "Salvar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
