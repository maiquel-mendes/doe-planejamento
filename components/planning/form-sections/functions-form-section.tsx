import { Plus, X } from "lucide-react";
import { useFieldArray, useFormContext, useWatch, Controller, type Control } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { PlanningFormData } from '@/hooks/use-operational-planning-form';
import type { OperationalFunction, Vehicle } from "@/types/operational-planning";
import type { User } from "@/types/auth";
import { memo, useMemo } from "react";

interface FunctionsFormSectionProps {
  users: User[];
  functions: OperationalFunction[];
  vehicles: Vehicle[];
}

interface AssignmentRowProps {
  control: Control<PlanningFormData>;
  index: number;
  remove: (index: number) => void;
  users: User[];
  functions: OperationalFunction[];
  vehicles: Vehicle[];
  selectedUserIds: Set<string>;
}

const AssignmentRow = memo(function AssignmentRow({ control, index, remove, users, functions, vehicles, selectedUserIds }: AssignmentRowProps) {
  const assignment = useWatch({ control, name: `assignments.${index}` });
  const functionIds = assignment.functionIds || [];

  const availableUsers = useMemo(() => {
    return users.filter(user => !selectedUserIds.has(user.id) || user.id === assignment.userId);
  }, [users, selectedUserIds, assignment.userId]);

  const { assignedFunctions, availableFunctions } = useMemo(() => {
    const assigned = functions.filter((f: OperationalFunction) => functionIds.includes(f.id));
    const assignedCategories = assigned.map((f: OperationalFunction) => f.category);

    let available;
    if (functionIds.length === 0) {
      // FIX: Use lowercase 'entrada' to match seed data
      available = functions.filter(f => f.category === 'entrada');
    } else {
      available = functions.filter((f: OperationalFunction) => !assignedCategories.includes(f.category));
    }
    
    return { assignedFunctions: assigned, availableFunctions: available };
  }, [functionIds, functions]);

  const { setValue } = useFormContext<PlanningFormData>();

  const handleAddFunction = (functionId: string) => {
    setValue(`assignments.${index}.functionIds`, [...functionIds, functionId]);
  };

  const handleRemoveFunction = (functionId: string) => {
    setValue(`assignments.${index}.functionIds`, functionIds.filter((id: string) => id !== functionId));
  };

  return (
    <div className="p-4 border rounded-lg space-y-3">
      <div className="flex justify-between items-start">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Operador</Label>
            <Controller
              control={control}
              name={`assignments.${index}.userId`}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <SelectTrigger><SelectValue placeholder="Selecione o Operador" /></SelectTrigger>
                  <SelectContent>{availableUsers.map((user: User) => <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>)}</SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="grid gap-2">
            <Label>Viatura (Opcional)</Label>
            <Controller
              control={control}
              name={`assignments.${index}.vehicleId`}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value || ''}>
                  <SelectTrigger><SelectValue placeholder="Selecione a Viatura" /></SelectTrigger>
                  <SelectContent>{vehicles.map((v: Vehicle) => <SelectItem key={v.id} value={v.id}>{v.prefix} - {v.model}</SelectItem>)}</SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}><X className="h-4 w-4" /></Button>
      </div>
      <div className="grid gap-2">
        <Label>Funções Atribuídas</Label>
        <div className="flex flex-wrap gap-2 min-h-[30px]">
          {assignedFunctions.map((func: OperationalFunction) => (
            <Badge key={func.id} variant="secondary">
              {func.name}
              <button type="button" className="ml-2" onClick={() => handleRemoveFunction(func.id)}><X className="h-3 w-3"/></button>
            </Badge>
          ))}
        </div>
      </div>
      <div className="grid gap-2">
        <Select onValueChange={handleAddFunction} value="">
          <SelectTrigger><SelectValue placeholder={availableFunctions.length > 0 ? "Adicionar nova função..." : "Nenhuma função disponível"} /></SelectTrigger>
          <SelectContent>
            {availableFunctions.map((func: OperationalFunction) => (
              <SelectItem key={func.id} value={func.id}>{func.name} ({func.category})</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
});

export function FunctionsFormSection({ users, functions, vehicles }: FunctionsFormSectionProps) {
  const { control } = useFormContext<PlanningFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'assignments',
  });

  const assignments = useWatch({ control, name: 'assignments' });
  const selectedUserIds = useMemo(() => 
    new Set(assignments?.map((a: { userId: string }) => a.userId).filter(Boolean) || [])
  , [assignments]);

  const handleAddAssignment = () => {
    append({ userId: '', vehicleId: null, functionIds: [] });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>5. Quadro de Funções</CardTitle>
        <CardDescription>Distribuição de operadores, funções e viaturas.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {fields.map((field, index) => (
            <AssignmentRow 
              key={field.id} 
              {...{ control, index, remove, users, functions, vehicles, selectedUserIds }} 
            />
          ))}
        </div>
        <Button type="button" variant="outline" onClick={handleAddAssignment} className="w-full mt-4">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Atribuição de Operador
        </Button>
      </CardContent>
    </Card>
  );
}
