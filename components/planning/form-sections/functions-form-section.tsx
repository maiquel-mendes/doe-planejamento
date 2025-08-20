import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import type {
  OperationalAssignment,
  OperationalFunction,
  Vehicle,
} from "@/types/operational-planning";
import type { User } from "@/types/auth";

interface FunctionsFormSectionProps {
  assignments: OperationalAssignment[];
  newAssignment: {
    id: string;
    operatorId: string;
    operatorName: string;
    vehicleId?: string;
    vehiclePrefix?: string;
    order: number;
    selectedFunction1Id: string;
    selectedFunction2Id: string;
  };
  setNewAssignment: (assignment: {
    id: string;
    operatorId: string;
    operatorName: string;
    vehicleId?: string;
    vehiclePrefix?: string;
    order: number;
    selectedFunction1Id: string;
    selectedFunction2Id: string;
  }) => void;
  addAssignment: () => { success: boolean; message?: string };
  removeAssignment: (id: string) => void;
  updateFunctionAssignment: (
    index: number,
    field: "operatorId" | "vehicleId" | "function1Id" | "function2Id",
    value: string,
  ) => void;
  users: User[];
  functions: OperationalFunction[];
  vehicles: Vehicle[];
  showToast: (props: { title: string; description?: string; variant?: "default" | "destructive" }) => void;
}

export function FunctionsFormSection({
  assignments,
  newAssignment,
  setNewAssignment,
  addAssignment,
  removeAssignment,
  updateFunctionAssignment,
  users,
  functions,
  vehicles,
  showToast,
}: FunctionsFormSectionProps) {
  const handleAddAssignment = () => {
    const result = addAssignment();
    if (!result.success) {
      showToast({
        title: "Erro ao adicionar operador",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>5. Quadro de Funções</CardTitle>
        <CardDescription>
          Distribuição de operadores, funções e viaturas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {assignments.map((assignment, index) => (
            <div
              key={assignment.id}
              className="flex flex-wrap gap-2 p-3 border rounded"
            >
              <Select
                value={assignment.operatorId || ""}
                onValueChange={(value) =>
                  updateFunctionAssignment(index, "operatorId", value)
                }
              >
                <SelectTrigger className="min-w-0 flex-grow">
                  <SelectValue placeholder="Operador" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user: User) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={assignment.assignedFunctions[0]?.id || ""}
                onValueChange={(value) =>
                  updateFunctionAssignment(index, "function1Id", value)
                }
              >
                <SelectTrigger className="min-w-0 flex-grow">
                  <SelectValue placeholder="Função 1" />
                </SelectTrigger>
                <SelectContent>
                  {functions.map((func: OperationalFunction) => (
                    <SelectItem key={func.id} value={func.id}>
                      {func.name} ({func.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {assignment.assignedFunctions[0]?.id && (
                <Select
                  className="min-w-0 flex-grow"
                  value={assignment.assignedFunctions[1]?.id || ""}
                  onValueChange={(value) =>
                    updateFunctionAssignment(index, "function2Id", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Função 2" />
                  </SelectTrigger>
                  <SelectContent>
                    {functions.map((func: OperationalFunction) => (
                      <SelectItem key={func.id} value={func.id}>
                        {func.name} ({func.category})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Select
                value={assignment.vehicleId || ""}
                onValueChange={(value) =>
                  updateFunctionAssignment(index, "vehicleId", value)
                }
              >
                <SelectTrigger className="min-w-0 flex-grow">
                  <SelectValue placeholder="Viatura" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle: Vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.prefix} - {vehicle.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeAssignment(assignment.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="flex flex-wrap gap-2 p-3 border rounded">
            <Select
              value={newAssignment.operatorId}
              onValueChange={(value) =>
                setNewAssignment({ ...newAssignment, operatorId: value })
              }
            >
              <SelectTrigger className="min-w-0 flex-grow">
                <SelectValue placeholder="Operador" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user: User) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={newAssignment.selectedFunction1Id}
              onValueChange={(value) =>
                setNewAssignment({ ...newAssignment, selectedFunction1Id: value })
              }
            >
              <SelectTrigger className="min-w-0 flex-grow">
                <SelectValue placeholder="Função 1" />
              </SelectTrigger>
              <SelectContent>
                {functions.map((func: OperationalFunction) => (
                  <SelectItem key={func.id} value={func.id}>
                    {func.name} ({func.category})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {newAssignment.selectedFunction1Id && (
              <Select
                value={newAssignment.selectedFunction2Id}
                onValueChange={(value) =>
                  setNewAssignment({ ...newAssignment, selectedFunction2Id: value })
                }
              >
                <SelectTrigger className="min-w-0 flex-grow">
                  <SelectValue placeholder="Função 2" />
                </SelectTrigger>
                <SelectContent>
                  {functions
                    .filter((func) => {
                      const selectedFunc1 = functions.find(
                        (f) => f.id === newAssignment.selectedFunction1Id,
                      );
                      return selectedFunc1
                        ? func.category !== selectedFunc1.category
                        : true;
                    })
                    .map((func: OperationalFunction) => (
                      <SelectItem key={func.id} value={func.id}>
                        {func.name} ({func.category})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}

            <Select
              value={newAssignment.vehicleId || ""}
              onValueChange={(value) =>
                setNewAssignment({ ...newAssignment, vehicleId: value })
              }
            >
              <SelectTrigger className="min-w-0 flex-grow">
                <SelectValue placeholder="Viatura" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((vehicle: Vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.prefix} - {vehicle.model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              type="button"
              variant="outline"
              onClick={handleAddAssignment}
              className="col-span-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Operador
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
