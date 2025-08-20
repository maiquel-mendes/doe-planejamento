import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { OperationalPlanning, TimeSchedule } from "@/types/operational-planning";

interface ScheduleFormSectionProps {
  schedule: OperationalPlanning["schedule"];
  newScheduleItem: TimeSchedule;
  setNewScheduleItem: (item: TimeSchedule) => void;
  addSchedule: () => void;
  removeSchedule: (id: string) => void;
  communications: OperationalPlanning["communications"];
  onCommunicationsChange: (field: keyof OperationalPlanning["communications"], value: string) => void;
}

export function ScheduleFormSection({
  schedule,
  newScheduleItem,
  setNewScheduleItem,
  addSchedule,
  removeSchedule,
  communications,
  onCommunicationsChange,
}: ScheduleFormSectionProps) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>6. Quadro de Horários</CardTitle>
          <CardDescription>Cronograma detalhado da operação</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {schedule.map((item, _index) => (
              <div
                key={item.id}
                className="flex items-center gap-2 p-3 border rounded"
              >
                <div className="font-mono text-sm font-medium min-w-[80px]">
                  {item.time}
                </div>
                <div className="flex-1">{item.activity}</div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSchedule(item.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="grid grid-cols-3 gap-2">
              <Input
                type="time"
                value={newScheduleItem.time}
                onChange={(e) =>
                  setNewScheduleItem({
                    ...newScheduleItem,
                    time: e.target.value,
                  })
                }
                placeholder="Horário"
              />
              <Input
                value={newScheduleItem.activity}
                onChange={(e) =>
                  setNewScheduleItem({
                    ...newScheduleItem,
                    activity: e.target.value,
                  })
                }
                placeholder="Atividade"
                className="col-span-2"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={addSchedule}
              className="w-full bg-transparent"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Horário
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>7. Comunicações Durante Trajeto</CardTitle>
          <CardDescription>Configurações de comunicação</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Chamada das Viaturas</Label>
              <Input
                value={communications.vehicleCall}
                onChange={(e) =>
                  onCommunicationsChange("vehicleCall", e.target.value)
                }
                placeholder="Ex: OPERAÇÃO 03"
              />
            </div>
            <div className="grid gap-2">
              <Label>Chamada dos Operadores</Label>
              <Input
                value={communications.operatorCall}
                onChange={(e) =>
                  onCommunicationsChange("operatorCall", e.target.value)
                }
                placeholder="Ex: DMO: DOA / DOE"
              />
            </div>
            
          </div>
        </CardContent>
      </Card>
    </>
  );
}
