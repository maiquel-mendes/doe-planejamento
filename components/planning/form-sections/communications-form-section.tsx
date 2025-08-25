import { useFormContext, Controller } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { PlanningFormData } from '@/hooks/use-operational-planning-form';

export function CommunicationsFormSection() {
  const { control } = useFormContext<PlanningFormData>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>6. Plano de Comunicações</CardTitle>
        <CardDescription>
          Defina os canais de rádio e outras informações de comunicação.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="grid gap-2">
          <Label htmlFor="operatorChannel">Canal de Operadores</Label>
          <Controller
            name="communicationsPlan.operatorChannel"
            control={control}
            render={({ field }) => (
              <Input
                id="operatorChannel"
                placeholder="Ex: Frequência 1 / GR 1"
                {...field}
              />
            )}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="vehicleChannel">Canal de Viaturas (Opcional)</Label>
          <Controller
            name="communicationsPlan.vehicleChannel"
            control={control}
            render={({ field }) => (
              <Input
                id="vehicleChannel"
                placeholder="Ex: Frequência 2 / GR 2"
                {...field}
                value={field.value || ''} // Garante que o valor nunca seja null
              />
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
