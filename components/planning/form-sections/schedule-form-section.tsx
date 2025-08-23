import { Plus, X } from "lucide-react";
import { useFieldArray, useFormContext, Controller } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlanningFormData } from '@/hooks/use-operational-planning-form';
import { useState } from 'react';

// Helper to format a Date object to HH:mm string, handling potential invalid dates
const formatTimeToHHMM = (date: Date | string | undefined): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return ''; // Return empty if the date is invalid
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

export function ScheduleFormSection() {
  const { control, register } = useFormContext<PlanningFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'scheduleItems',
  });

  const [newScheduleTime, setNewScheduleTime] = useState('');
  const [newScheduleActivity, setNewScheduleActivity] = useState('');

  const handleAddScheduleItem = () => {
    if (newScheduleTime && newScheduleActivity) {
      const timeParts = newScheduleTime.split(':');
      const date = new Date();
      date.setHours(parseInt(timeParts[0], 10), parseInt(timeParts[1], 10), 0, 0);

      append({ 
        time: date,
        activity: newScheduleActivity, 
      });
      
      setNewScheduleTime('');
      setNewScheduleActivity('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>6. Quadro de Horários</CardTitle>
        <CardDescription>Cronograma detalhado da operação</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-center gap-2 p-3 border rounded"
            >
              <div className="font-mono text-sm font-medium min-w-[120px]">
                <Controller
                  control={control}
                  name={`scheduleItems.${index}.time`}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      type="time"
                      value={formatTimeToHHMM(value)}
                      onChange={(e) => {
                        const timeParts = e.target.value.split(':');
                        const date = new Date(value instanceof Date ? value : new Date());
                        date.setHours(parseInt(timeParts[0], 10), parseInt(timeParts[1], 10), 0, 0);
                        onChange(date);
                      }}
                    />
                  )}
                />
              </div>
              <div className="flex-1">
                <Input {...register(`scheduleItems.${index}.activity`)} placeholder="Atividade" />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="grid grid-cols-3 gap-2">
            <Input
              type="time"
              placeholder="Horário"
              value={newScheduleTime}
              onChange={(e) => setNewScheduleTime(e.target.value)}
            />
            <Input
              placeholder="Atividade"
              className="col-span-2"
              value={newScheduleActivity}
              onChange={(e) => setNewScheduleActivity(e.target.value)}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleAddScheduleItem}
            className="w-full bg-transparent"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Horário
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
